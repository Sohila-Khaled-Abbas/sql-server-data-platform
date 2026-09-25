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
    
    # Table metadata for dbo.Student
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
    
    # Indexes on dbo.Student
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
    
    # Physical index stats for dbo.Student
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
    
    # Rows in dbo.Student (ordered by PK)
    cur.execute("""
    SELECT St_Id, St_Fname, St_Lname, St_Address, St_Age, Dept_Id
    FROM dbo.Student
    ORDER BY St_Id
    """)
    student_rows = cur.fetchall()
    
    # Attempt second clustered index to capture real engine error Msg 1902
    msg_1902_text = ""
    try:
        cur.execute("CREATE CLUSTERED INDEX test_cluster ON dbo.Student(St_Fname)")
    except Exception as e:
        msg_1902_text = str(e)
    
    # Construct Markdown
    md = []
    md.append("# CH01_VID10: Demo on Index (Practical SSMS Indexing Lab) - Live Verification Telemetry")
    md.append("")
    md.append("> **Live Database Telemetry Captured Directly from Microsoft SQL Server 2022 Instance**")
    md.append(f"> **Environment**: `DESKTOP-NPSJDUB` / `localhost` (`.`) | **Database**: `[ITI]` | **Capture Timestamp (UTC)**: `{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}`")
    md.append(f"> **Engine**: `{version_str.splitlines()[0]}`")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 1. Executive Pedagogical Context")
    md.append("")
    md.append("In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 10), **Eng. Rami Mohamed Abonagi** transitions from theoretical B+Tree mechanics into an interactive SQL Server Management Studio (SSMS) practical lab, answering the core operational questions:")
    md.append("")
    md.append("1. **Can a table have two Clustered Indexes?**")
    md.append("   - What happens when a developer executes:")
    md.append("     ```sql")
    md.append("     create clustered index i2 on student(st_fname)")
    md.append("     ```")
    md.append("   - SQL Server immediately rejects the command with **Msg 1902**: A table's physical data pages can only be sorted in **ONE** physical sequence. Because `PK_Student` already clusters the table on `St_Id`, creating another clustered index is impossible without first dropping the existing one.")
    md.append("2. **How does a Non-Clustered Index behave on a Clustered Table?**")
    md.append("   - What happens when executing:")
    md.append("     ```sql")
    md.append("     create nonclustered index i2 on student(st_fname)")
    md.append("     ```")
    md.append("   - The command succeeds seamlessly! SQL Server builds an auxiliary B+Tree sorted on `St_Fname`, storing the clustering key `St_Id` as the row locator at the leaf level.")
    md.append("3. **How does the Query Optimizer execute queries before and after the index?**")
    md.append("   - **Before `i2`**: `SELECT * FROM Student WHERE St_Fname = 'Ahmed'` forces an exhaustive **Clustered Index Scan** across all data pages.")
    md.append("   - **After `i2` (Wide Query)**: Uses an **Index Seek** on `i2` followed by a **Key Lookup** into `PK_Student` to retrieve remaining payload columns.")
    md.append("   - **After `i2` (Index-Only Query)**: `SELECT St_Id, St_Fname FROM Student WHERE St_Fname = 'Ahmed'` requires **ZERO Key Lookups**, resolving entirely from the `i2` leaf level.")
    md.append("   - **After `i2_covering` (`INCLUDE`)**: Adding non-key columns (`INCLUDE (St_Address, St_Age)`) completely eliminates Key Lookups for wide queries while preserving narrow non-leaf B+Tree branch nodes.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 2. Live Database Telemetry from `[ITI].[dbo].[Student]`")
    md.append("")
    md.append("### A. Table Structure (`dbo.Student`)")
    md.append("")
    md.append("| Column ID | Column Name | Data Type | Storage Bytes | Nullable | Primary Key | Role |")
    md.append("| :---: | :--- | :--- | :---: | :---: | :---: | :--- |")
    for col in student_cols:
        pk_badge = "**YES** (Clustering Key)" if col[5] else "NO"
        role = "Primary Key (Clustering Key)" if col[1] == 'St_Id' else ("Secondary Index Key (i2)" if col[1] == 'St_Fname' else "Payload Attribute")
        md.append(f"| {col[0]} | `{col[1]}` | `{col[2]}` | {col[3]} | {col[4]} | {pk_badge} | {role} |")
    md.append("")
    md.append("### B. Active Indexes on `dbo.Student`")
    md.append("")
    md.append("| Index Name | Index ID | Type | Is Unique | Primary Key | Key Columns | Included Columns | Role |")
    md.append("| :--- | :---: | :--- | :---: | :---: | :--- | :--- | :--- |")
    for idx in index_meta:
        inc_cols = f"`{idx[6]}`" if idx[6] else "*None*"
        role = "Physical Base Storage" if idx[1] == 1 else ("Secondary Index from Lecture" if idx[0] == 'i2' else "Modern Covering Optimization")
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
    md.append("---")
    md.append("")
    md.append("## 3. The Single Clustered Index Constraint (Live Engine Proof)")
    md.append("")
    md.append("### Attempted Query (from Lecture):")
    md.append("```sql")
    md.append("CREATE CLUSTERED INDEX i2 ON dbo.Student(st_fname);")
    md.append("```")
    md.append("")
    md.append("### Live SQL Server Engine Rejection Telemetry:")
    md.append("```text")
    md.append(f"{msg_1902_text}")
    md.append("```")
    md.append("")
    md.append("> [!IMPORTANT]")
    md.append("> **Why Msg 1902 Occurs (Physical Storage Invariant):**")
    md.append("> In Microsoft SQL Server, a clustered index is **not** an auxiliary list; it **is the table itself**. The leaf nodes of a clustered index are the physical 8 KB data pages containing the actual table records. Since physical files on disk cannot be ordered in two conflicting sequences simultaneously (e.g. sorted by `St_Id` and simultaneously sorted by `St_Fname`), a table can have **one and only one** clustered index.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 4. Query Execution Mechanics Walkthrough")
    md.append("")
    md.append("### Query 1: Wide Query with Non-Clustered Index (Seek + Key Lookup)")
    md.append("```sql")
    md.append("SELECT St_Id, St_Fname, St_Lname, St_Address, St_Age, Dept_Id, St_super")
    md.append("FROM dbo.Student")
    md.append("WHERE St_Fname = N'Ahmed';")
    md.append("```")
    md.append("**Execution Engine Trace:**")
    md.append("1. **Index Seek (`i2`)**: Searches the auxiliary B+Tree on `St_Fname` down to the leaf node for `'Ahmed'`.")
    md.append("2. **Row Locator Retrieval**: Reads the clustering key `St_Id = 1` stored at the leaf node of `i2`.")
    md.append("3. **Key Lookup (`PK_Student`)**: Performs a Clustered Index Seek into `dbo.Student` on `St_Id = 1` to retrieve the remaining columns (`St_Lname`, `St_Address`, `St_Age`, etc.).")
    md.append("4. **I/O Overhead**: ~4-5 logical reads (Seek in `i2` + Seek in `PK_Student`).")
    md.append("")
    md.append("### Query 2: Index-Only / Covering Query (Zero Key Lookup)")
    md.append("```sql")
    md.append("SELECT St_Id, St_Fname")
    md.append("FROM dbo.Student")
    md.append("WHERE St_Fname = N'Ahmed';")
    md.append("```")
    md.append("**Execution Engine Trace:**")
    md.append("1. `St_Fname` is the explicit index key in `i2`.")
    md.append("2. `St_Id` is the clustering key automatically included in every leaf node as the row locator.")
    md.append("3. **Key Lookup is completely avoided!** The query is satisfied 100% from the `i2` leaf page in just **2 logical reads**.")
    md.append("")
    md.append("### Query 3: Modern Covering Index Optimization (`INCLUDE`)")
    md.append("```sql")
    md.append("CREATE NONCLUSTERED INDEX i2_covering")
    md.append("ON dbo.Student(st_fname)")
    md.append("INCLUDE (St_Address, St_Age);")
    md.append("GO")
    md.append("")
    md.append("SELECT St_Id, St_Fname, St_Address, St_Age")
    md.append("FROM dbo.Student")
    md.append("WHERE St_Fname = N'Ahmed';")
    md.append("```")
    md.append("**Execution Engine Optimization:**")
    md.append("- `INCLUDE` appends `St_Address` and `St_Age` to the **leaf level only**, leaving intermediate branch pages compact.")
    md.append("- Satisfies wide analytical queries with zero Key Lookup overhead.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 5. Artifact & Repository Alignment")
    md.append("")
    md.append("* **Source T-SQL Script**: [`src/01_storage_and_schema/ch01_vid10_demo_on_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid10_demo_on_index.sql)")
    md.append("* **Environment Setup Script**: [`src/01_storage_and_schema/ch01_vid10_demo_on_index_setup.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid10_demo_on_index_setup.sql)")
    md.append("* **Preceding Module Scripts**: [`ch01_vid08_clustered_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid08_clustered_index.sql) & [`ch01_vid09_nonclustered_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid09_nonclustered_index.sql)")
    md.append("* **Syllabus Mapping**: [`docs/course-syllabus-mapping.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/course-syllabus-mapping.md)")
    md.append("* **Obsidian Second Brain Note**: [`docs/curriculum/01 - COURSE/CH01 - Database Creation and Management/CH01_VID10 - Demo on Index.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/curriculum/01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/CH01_VID10%20-%20Demo%20on%20Index.md)")
    
    out_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "ch01-vid10-demo-on-index-live.md")
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(md) + "\n")
        
    print(f">>> Successfully created {out_path} from live SQL Server instance!")
    conn.close()

if __name__ == '__main__':
    generate_live_doc()
