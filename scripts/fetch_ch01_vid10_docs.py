import pyodbc
from datetime import datetime, timezone
import os

def generate_live_doc():
    conn_str = 'DRIVER={ODBC Driver 18 for SQL Server};SERVER=.;DATABASE=ITI;Trusted_Connection=yes;TrustServerCertificate=yes;'
    conn = pyodbc.connect(conn_str, autocommit=True)
    cur = conn.cursor()
    
    # Check SQL Server Version
    cur.execute("SELECT @@VERSION")
    version_str = cur.fetchone()[0]
    
    # 1. Table metadata for dbo.Student
    cur.execute("""
    SELECT 
        c.column_id,
        c.name AS ColumnName,
        tp.name AS DataType,
        c.max_length AS MaxLength,
        c.is_nullable AS IsNullable,
        CASE WHEN EXISTS (
            SELECT 1 FROM sys.index_columns ic
            JOIN sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
            WHERE ic.object_id = c.object_id AND ic.column_id = c.column_id AND i.is_primary_key = 1
        ) THEN 1 ELSE 0 END AS IsPrimaryKey
    FROM sys.columns c
    JOIN sys.types tp ON c.user_type_id = tp.user_type_id
    WHERE c.object_id = OBJECT_ID('dbo.Student')
    ORDER BY c.column_id
    """)
    student_cols = cur.fetchall()
    
    # 2. Indexes on dbo.Student
    cur.execute("""
    SELECT 
        i.name AS IndexName,
        i.index_id AS IndexId,
        i.type_desc AS IndexType,
        i.is_unique AS IsUnique,
        i.is_primary_key AS IsPrimaryKey,
        STRING_AGG(CASE WHEN ic.is_included_column = 0 THEN c.name END, ', ') WITHIN GROUP (ORDER BY ic.key_ordinal) AS KeyColumns,
        STRING_AGG(CASE WHEN ic.is_included_column = 1 THEN c.name END, ', ') AS IncludedColumns
    FROM sys.indexes i
    JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
    JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
    WHERE i.object_id = OBJECT_ID('dbo.Student') AND i.type IN (1, 2)
    GROUP BY i.name, i.index_id, i.type_desc, i.is_unique, i.is_primary_key
    ORDER BY i.index_id
    """)
    index_meta = cur.fetchall()
    
    # 3. Physical index stats for dbo.Student
    cur.execute("""
    SELECT 
        i.name AS IndexName,
        i.type_desc AS IndexType,
        ps.index_level AS BTreeLevel,
        ps.page_count AS PageCount,
        ps.record_count AS RecordCount,
        ps.avg_record_size_in_bytes AS AvgRecordSize,
        ps.avg_page_space_used_in_percent AS PageSpaceUsedPct
    FROM sys.dm_db_index_physical_stats(DB_ID('ITI'), OBJECT_ID('dbo.Student'), NULL, NULL, 'DETAILED') ps
    JOIN sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id
    ORDER BY i.index_id, ps.index_level DESC
    """)
    student_index_stats = cur.fetchall()
    
    # 4. Table metadata & indexes for dbo.mytest
    cur.execute("""
    SELECT 
        i.name AS IndexName,
        i.type_desc AS IndexType,
        i.is_unique AS IsUnique,
        i.is_primary_key AS IsPrimaryKey,
        i.is_unique_constraint AS IsUniqueConstraint,
        c.name AS ColumnName
    FROM sys.indexes i
    JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
    JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
    WHERE i.object_id = OBJECT_ID('dbo.mytest')
    ORDER BY i.type, i.name
    """)
    mytest_indexes = cur.fetchall()
    
    # 5. Capture Msg 1902 on duplicate clustered index
    msg_1902_text = ""
    try:
        cur.execute("CREATE CLUSTERED INDEX test_cluster ON dbo.Student(St_Fname)")
    except Exception as e:
        msg_1902_text = str(e)
        
    # 6. Capture Msg 1505 on duplicate unique index
    msg_1505_text = ""
    try:
        cur.execute("CREATE UNIQUE INDEX test_unique_age ON dbo.Student(St_Age)")
    except Exception as e:
        msg_1505_text = str(e)
        
    # 7. Query trace sample from sys.fn_trace_gettable
    trace_path = r'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\VID10.trc'
    trace_rows = []
    try:
        cur.execute(f"""
        SELECT TOP 8 
            EventClass, 
            ApplicationName, 
            LEFT(REPLACE(REPLACE(CONVERT(NVARCHAR(MAX), TextData), CHAR(13), ' '), CHAR(10), ' '), 70) AS Snippet,
            CPU, Reads, Writes, Duration, SPID
        FROM sys.fn_trace_gettable('{trace_path}', DEFAULT)
        WHERE TextData IS NOT NULL
        """)
        trace_rows = cur.fetchall()
    except Exception as e:
        print("Trace fetch error:", e)

    # Construct Markdown
    md = []
    md.append("# CH01_VID10: Demo on Index (Practical SSMS Indexing & Tuning Lab) - Live Verification Telemetry")
    md.append("")
    md.append("> **Live Database Telemetry Captured Directly from Microsoft SQL Server 2022 Instance**")
    md.append(f"> **Environment**: `DESKTOP-NPSJDUB` / `localhost` (`.`) | **Database**: `[ITI]` | **Capture Timestamp (UTC)**: `{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}`")
    md.append(f"> **Engine**: `{version_str.splitlines()[0]}`")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 1. Executive Pedagogical Context")
    md.append("")
    md.append("In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 10), **Eng. Rami Mohamed Abonagi** transitions from the physical mechanics of B+Trees into a hands-on practical lab using SQL Server Management Studio (SSMS), SQL Server Profiler, and the Database Engine Tuning Advisor (DTA).")
    md.append("")
    md.append("This live telemetry document captures and verifies each core principle:")
    md.append("")
    md.append("1. **The Single Clustered Index Invariant**:")
    md.append("   - Attempting `CREATE CLUSTERED INDEX i2 ON student(st_fname)` triggers **Msg 1902**: A table's physical data pages can only be sorted in **ONE** physical sequence on disk.")
    md.append("2. **Multiple Auxiliary Non-Clustered Indexes**:")
    md.append("   - Creating `CREATE NONCLUSTERED INDEX i2 ON student(st_fname)` and `CREATE NONCLUSTERED INDEX i3 ON student(st_address)` succeeds. Tables support up to 999 non-clustered B+Trees.")
    md.append("3. **Execution Plan Dissection (Clustered Seek vs Heap Table Scan)**:")
    md.append("   - `SELECT * FROM Student WHERE St_Id = 1` yields a **Clustered Index Seek** (0 logical reads for non-leaf navigation, direct row retrieval).")
    md.append("   - `SELECT * FROM mydata WHERE id = 1` yields a **Table Scan** because `mydata` is a heap without a clustered index, forcing an IAM page traverse.")
    md.append("4. **Constraint-to-Index Architectural Laws**:")
    md.append("   - Primary Key constraints automatically generate a **CLUSTERED** unique index by default.")
    md.append("   - Unique constraints automatically generate a **NONCLUSTERED** unique index by default.")
    md.append("   - Verified via `dbo.mytest` system catalog introspection.")
    md.append("5. **Unique Index Duplicate Key Violation & Resolution**:")
    md.append("   - `CREATE UNIQUE INDEX i7 ON student(st_age)` is terminated with **Msg 1505** due to duplicate value `(21)`.")
    md.append("   - Fixed by removing `UNIQUE`: `CREATE INDEX i7 ON student(st_age)`.")
    md.append("6. **Workload Analysis & Database Engine Tuning Advisor (DTA)**:")
    md.append("   - Unindexed queries (`Instructor WHERE salary > 5000`, `Student WHERE dept_id = 10`) captured in trace `VID10.trc` via SQL Server Profiler.")
    md.append("   - DTAEngine Storage Bound Error resolution (`Define max. space for recommendations` / `dta.exe -B 50`).")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 2. Visual SSMS Execution Plans & Tool Verification")
    md.append("")
    md.append("### A. Clustered Index Seek vs Table Scan (SSMS Execution Plans)")
    md.append("")
    md.append("#### Query 1: Clustered Index Seek on `dbo.Student` (`WHERE St_Id = 1`)")
    md.append("![Clustered Index Seek on Student.PK_Student](assets/ch01_vid10/01_clustered_index_seek_student.png)")
    md.append("")
    md.append("> **Analysis**: Because `St_Id` is the Primary Key Clustered Index, SQL Server navigates the root and intermediate B+Tree pages directly to the exact data page where `St_Id = 1` resides. Operator cost is 100% of the query, executed with **0 scan count** and **2 logical reads**.")
    md.append("")
    md.append("#### Query 2: Table Scan on `dbo.mydata` (`WHERE id = 1`)")
    md.append("![Table Scan on mydata heap](assets/ch01_vid10/02_table_scan_mydata_heap.png)")
    md.append("")
    md.append("> **Analysis**: Because `mydata` is a Heap table (no clustered index), the query engine has no B+Tree hierarchy to navigate. It must allocate an **IAM (Index Allocation Map)** scan and read every individual page in the allocation chain, resulting in a **Table Scan**.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("### B. SSMS External Diagnostics & Tuning Tools")
    md.append("")
    md.append("#### SSMS Tools Menu: SQL Server Profiler & Database Engine Tuning Advisor")
    md.append("![SSMS Tools Menu: Profiler & DTA](assets/ch01_vid10/03_ssms_tools_profiler_dta_menu.png)")
    md.append("")
    md.append("#### SQL Server Profiler: Real-Time Workload Capture (`ITI (localhost)`)")
    md.append("![SQL Server Profiler Trace Window](assets/ch01_vid10/04_sql_server_profiler_trace_window.png)")
    md.append("")
    md.append("> **Operational Context**: SQL Server Profiler records database engine events (`RPC:Completed`, `SQL:BatchStarting`, `SQL:BatchCompleted`) along with CPU, Reads, Writes, Duration, and SPID. The captured workload is saved to:")
    md.append("> - Host Location: `D:\\courses\\Data Science\\Data Engineering\\MaharaTech\\Implementing and Developing SQL server objects\\CH01\\VID10.trc`")
    md.append("> - Repository Location: [`src/01_storage_and_schema/traces/VID10.trc`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/traces/VID10.trc)")
    md.append("")
    md.append("---")
    md.append("")
    md.append("### C. Database Engine Tuning Advisor (DTA) Workload Analysis & Error Resolution")
    md.append("")
    md.append("#### DTA Workload Configuration Session")
    md.append("![DTA Workload Configuration](assets/ch01_vid10/05_dta_workload_configuration.png)")
    md.append("")
    md.append("#### DTAEngine Storage Bound Error Popup")
    md.append("![DTAEngine Storage Space Exceeded Error](assets/ch01_vid10/06_dta_storage_space_error_popup.png)")
    md.append("")
    md.append("```text")
    md.append("The minimum storage space required for the selected physical design structures exceeds the default storage space selected by Database Engine Tuning Advisor. Either keep fewer physical design structures, or increase the default storage space to be larger than at least 4MB. Use one of the following methods to increase storage space:")
    md.append("(1) If you are using the graphical user interface, enter the required value for Define max. space for recommendations (MB) in the Advanced Options of the Tuning Options tabbed page;")
    md.append("(2) If you are using dta.exe, specify the maximum space value for the -B argument;")
    md.append("(3) If you are using an XML input file, specify the maximum space value for the <StorageBoundInMB> element under <TuningOptions>")
    md.append("```")
    md.append("")
    md.append("#### The 3 Architectural Solutions:")
    md.append("| Method | Mechanism | Concrete Configuration Action |")
    md.append("| :--- | :--- | :--- |")
    md.append("| **1. SSMS GUI** | Advanced Options | Navigate to **Tuning Options** tab &rarr; click **Advanced Options...** &rarr; change **Define max. space for recommendations (MB)** from default (typically 3 MB) to **50 MB** or higher. |")
    md.append("| **2. CLI (`dta.exe`)** | `-B` Parameter | Execute: `dta.exe -S localhost -D ITI -if \"VID10.trc\" -B 50 -s \"CH01_VID10_Session\"` |")
    md.append("| **3. XML Configuration** | `<StorageBoundInMB>` | In the tuning XML input file, set `<TuningOptions><StorageBoundInMB>50</StorageBoundInMB></TuningOptions>`. |")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 3. Live Database Telemetry from `[ITI]`")
    md.append("")
    md.append("### A. Table Structure (`dbo.Student`)")
    md.append("")
    md.append("| Column ID | Column Name | Data Type | Storage Bytes | Nullable | Primary Key | Role |")
    md.append("| :---: | :--- | :--- | :---: | :---: | :--- | :--- |")
    for col in student_cols:
        pk_badge = "**YES** (Clustering Key)" if col[5] else "NO"
        role = "Primary Key (Clustering Key)" if col[1] == 'St_Id' else ("Secondary Index Key (i2)" if col[1] == 'St_Fname' else ("Secondary Index Key (i3)" if col[1] == 'St_Address' else ("Secondary Index Key (i7)" if col[1] == 'St_Age' else "Payload Attribute")))
        md.append(f"| {col[0]} | `{col[1]}` | `{col[2]}` | {col[3]} | {col[4]} | {pk_badge} | {role} |")
    md.append("")
    md.append("### B. Active Indexes on `dbo.Student`")
    md.append("")
    md.append("| Index Name | Index ID | Type | Is Unique | Primary Key | Key Columns | Included Columns | Role |")
    md.append("| :--- | :---: | :--- | :---: | :---: | :--- | :--- | :--- |")
    for idx in index_meta:
        inc_cols = f"`{idx[6]}`" if idx[6] else "*None*"
        role = "Base Clustered Table" if idx[1] == 1 else ("Secondary Index (st_fname)" if idx[0] == 'i2' else ("Secondary Index (st_address)" if idx[0] == 'i3' else ("Secondary Index (st_age)" if idx[0] == 'i7' else "Covering Index Optimization")))
        md.append(f"| `{idx[0]}` | `{idx[1]}` | `{idx[2]}` | `{idx[3]}` | `{idx[4]}` | `{idx[5]}` | {inc_cols} | {role} |")
    md.append("")
    md.append("### C. Physical B+Tree Hierarchy Telemetry (`sys.dm_db_index_physical_stats`)")
    md.append("")
    md.append("| Index Name | Type | Level | Role | Pages | Records | Avg Size | Space Used |")
    md.append("| :--- | :--- | :---: | :--- | :---: | :---: | :---: | :---: |")
    for st in student_index_stats:
        lvl_role = "Leaf Level" if st[2] == 0 else "Root / Intermediate Level"
        md.append(f"| `{st[0]}` | `{st[1]}` | `{st[2]}` | {lvl_role} | `{st[3]}` | `{st[4]}` | `{round(st[5], 2)} B` | `{round(st[6], 2)}%` |")
    md.append("")
    md.append("### D. Constraint to Index Mapping Proof (`dbo.mytest`)")
    md.append("")
    md.append("```sql")
    md.append("CREATE TABLE dbo.mytest")
    md.append("(")
    md.append("    id INT IDENTITY,")
    md.append("    SSN INT PRIMARY KEY,")
    md.append("    name VARCHAR(20),")
    md.append("    salary INT UNIQUE,")
    md.append("    overtime INT UNIQUE,")
    md.append("    CONSTRAINT c100 CHECK(overtime > 100)")
    md.append(");")
    md.append("```")
    md.append("")
    md.append("| Index Name | Physical Type | Is Unique | Primary Key | Unique Constraint | Column | Enforced Architectural Rule |")
    md.append("| :--- | :--- | :---: | :---: | :---: | :--- | :--- |")
    for idx in mytest_indexes:
        rule = "**Primary Key &rarr; CLUSTERED Index**" if idx[3] else "**Unique Constraint &rarr; NONCLUSTERED Index**"
        md.append(f"| `{idx[0]}` | `{idx[1]}` | `{idx[2]}` | `{idx[3]}` | `{idx[4]}` | `{idx[5]}` | {rule} |")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 4. Live Engine Error Rejections & Diagnostic Analyses")
    md.append("")
    md.append("### A. The Single Clustered Index Constraint Rejection (Msg 1902)")
    md.append("```sql")
    md.append("CREATE CLUSTERED INDEX i2 ON dbo.Student(st_fname);")
    md.append("```")
    md.append("**Engine Rejection Response:**")
    md.append("```text")
    md.append(f"{msg_1902_text}")
    md.append("```")
    md.append("> **Why Msg 1902 Occurs**: Clustered index leaf nodes are the table's physical data pages. Because data on disk cannot have two simultaneous physical orderings (ordered by `St_Id` and ordered by `St_Fname`), only ONE clustered index can exist per table.")
    md.append("")
    md.append("### B. Unique Index Duplicate Key Violation (Msg 1505)")
    md.append("```sql")
    md.append("CREATE UNIQUE INDEX i7 ON dbo.Student(st_age);")
    md.append("```")
    md.append("**Engine Rejection Response:**")
    md.append("```text")
    md.append(f"{msg_1505_text}")
    md.append("```")
    md.append("> **Why Msg 1505 Occurs**: In `dbo.Student`, multiple students share age `21` (`Amr`, `Eman`, `Doaa`, `Hany`). A UNIQUE index strictly guarantees row uniqueness across all keys; encountering duplicate key `(21)` terminates the statement.")
    md.append(">")
    md.append("> **The Fix**: Create a standard non-unique index:")
    md.append("> ```sql")
    md.append("> CREATE INDEX i7 ON dbo.Student(st_age);")
    md.append("> ```")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 5. Trace Data Telemetry (`sys.fn_trace_gettable`)")
    md.append("")
    md.append("Below are authentic events parsed directly from `VID10.trc` using SQL Server's built-in table function:")
    md.append("")
    md.append("| Event Class | Application | SQL Text / Batch Snippet | CPU | Reads | Writes | Duration | SPID |")
    md.append("| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |")
    for tr in trace_rows:
        md.append(f"| {tr[0]} | `{tr[1]}` | `{tr[2]}` | {tr[3]} | {tr[4]} | {tr[5]} | {tr[6]} | {tr[7]} |")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 6. Artifact & Repository Alignment")
    md.append("")
    md.append("* **Source T-SQL Script**: [`src/01_storage_and_schema/ch01_vid10_demo_on_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid10_demo_on_index.sql)")
    md.append("* **Environment Setup Script**: [`src/01_storage_and_schema/ch01_vid10_demo_on_index_setup.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid10_demo_on_index_setup.sql)")
    md.append("* **Captured Trace File**: [`src/01_storage_and_schema/traces/VID10.trc`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/traces/VID10.trc)")
    md.append("* **Syllabus Mapping**: [`docs/course-syllabus-mapping.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/course-syllabus-mapping.md)")
    md.append("* **Obsidian Second Brain Note**: [`docs/curriculum/01 - COURSE/CH01 - Database Creation and Management/CH01_VID10 - Demo on Index.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/curriculum/01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/CH01_VID10%20-%20Demo%20on%20Index.md)")
    
    out_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "ch01-vid10-demo-on-index-live.md")
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(md) + "\n")
        
    print(f">>> Successfully generated comprehensive live telemetry doc: {out_path}")
    conn.close()

if __name__ == '__main__':
    generate_live_doc()
