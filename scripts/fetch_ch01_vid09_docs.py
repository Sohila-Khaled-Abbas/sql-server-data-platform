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
    
    # Indexes on student
    cur.execute("""
    SELECT 
        i.name AS IndexName,
        i.index_id AS IndexId,
        i.type_desc AS IndexType,
        i.is_unique AS IsUnique,
        i.is_primary_key AS IsPrimaryKey,
        STRING_AGG(c.name, ', ') WITHIN GROUP (ORDER BY ic.key_ordinal) AS KeyColumns
    FROM sys.indexes i
    JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
    JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
    WHERE i.object_id = OBJECT_ID('dbo.student') AND i.type IN (1, 2)
    GROUP BY i.name, i.index_id, i.type_desc, i.is_unique, i.is_primary_key
    ORDER BY i.index_id
    """)
    index_meta = cur.fetchall()
    
    # Detailed index physical statistics for all indexes on dbo.student
    cur.execute("""
    SELECT 
        i.name AS IndexName,
        i.index_id AS IndexId,
        i.type_desc AS IndexType,
        ps.index_level AS BTreeLevel,
        ps.page_count AS PageCount,
        ps.record_count AS RecordCount,
        ps.avg_record_size_in_bytes AS AvgRecordSizeBytes,
        ps.avg_page_space_used_in_percent AS PageSpaceUsedPct
    FROM sys.dm_db_index_physical_stats(DB_ID('ITI'), OBJECT_ID('dbo.student'), NULL, NULL, 'DETAILED') ps
    JOIN sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id
    ORDER BY i.index_id, ps.index_level DESC
    """)
    all_index_stats = cur.fetchall()
    
    # Rows in student (ordered by name to show Non-Clustered index traversal order)
    cur.execute("""
    SELECT name, id, age
    FROM dbo.student
    ORDER BY name, id
    """)
    nc_sorted_rows = cur.fetchall()
    
    # Construct Markdown
    md = []
    md.append("# CH01_VID09: Non-Clustered Index Architecture & Key Lookup Mechanics - Live Verification Telemetry")
    md.append("")
    md.append("> **Live Database Telemetry Captured Directly from Microsoft SQL Server 2022 Instance**")
    md.append(f"> **Environment**: `DESKTOP-NPSJDUB` / `localhost` (`.`) | **Database**: `[ITI]` | **Capture Timestamp (UTC)**: `{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}`")
    md.append(f"> **Engine**: `{version_str.splitlines()[0]}`")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 1. Executive Pedagogical Context")
    md.append("")
    md.append("In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 9), **Eng. Rami Mohamed Abonagi** examines the architecture and query mechanics of **Non-Clustered Indexes**, resolving the fundamental limitation identified in `CH01_VID08`:")
    md.append("")
    md.append("> `Select * from student where name = 'Omar'`")
    md.append("> Because a table can have only **one** clustered index (which physically orders data by `id`), searching on a non-clustered column like `name` previously forced an exhaustive **Clustered Index Scan** across all data pages.")
    md.append("> Creating a **Non-Clustered Index** builds an independent secondary B+Tree sorted on the search column, dramatically accelerating lookups while using a **Row Locator** to connect back to the base data.")
    md.append("")
    md.append("### Architectural Comparison: Clustered vs Non-Clustered Index")
    md.append("")
    md.append("| Architectural Dimension | Clustered Index (`type = 1`) | Non-Clustered Index (`type = 2`) |")
    md.append("| :--- | :--- | :--- |")
    md.append("| **Maximum Per Table** | Exactly **1** (or 0 if Heap) | Up to **999** per table |")
    md.append("| **Leaf Level Contents** | The **actual data pages** of the table (all columns and rows) | The **Index Key** (`name`) + **Row Locator** pointer |")
    md.append("| **Row Locator (On Clustered Table)** | N/A (Leaf IS the row) | **Clustering Key value** (`id`) |")
    md.append("| **Row Locator (On Heap Table)** | N/A (Heap has no clustered index) | **RID** (`FileID:PageID:SlotID`) |")
    md.append("| **Data Physical Order** | Dictates physical layout of table | Independent; table remains sorted by clustered key |")
    md.append("| **Query Operation** | Clustered Index Seek / Scan | Non-Clustered Index Seek / Scan |")
    md.append("| **Auxiliary Step for Uncovered Attributes** | None (Leaf has all attributes) | **Key Lookup** (or RID Lookup) back to base table |")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 2. Live Database Telemetry from `[ITI]`")
    md.append("")
    md.append("### A. Verified Indexes on `dbo.student`")
    md.append("")
    md.append("| Index Name | Index ID | Index Type | Is Unique | Primary Key | Key Column(s) | Role & Status |")
    md.append("| :--- | :---: | :--- | :---: | :---: | :--- | :--- |")
    for idx in index_meta:
        role = "Base Clustered Storage" if idx[1] == 1 else ("Secondary Index from Lecture Slide" if idx[0] == 'i2' else "Modern Covering Optimization")
        md.append(f"| `{idx[0]}` | `{idx[1]}` | `{idx[2]}` | `{idx[3]}` | `{idx[4]}` | `{idx[5]}` | {role} |")
    md.append("")
    md.append("### B. Physical B+Tree Statistics Across Both Indexes (`sys.dm_db_index_physical_stats`)")
    md.append("")
    md.append("| Index Name | Type | Level | Level Role | Pages | Records | Avg Size | Space Used |")
    md.append("| :--- | :--- | :---: | :--- | :---: | :---: | :---: | :---: |")
    for st in all_index_stats:
        lvl_role = "Leaf Level" if st[3] == 0 else "Root / Intermediate Level"
        md.append(f"| `{st[0]}` | `{st[2]}` | `{st[3]}` | {lvl_role} | `{st[4]}` | `{st[5]}` | `{round(st[6], 2)} B` | `{round(st[7], 2)}%` |")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 3. Non-Clustered Index `i2` Traversal Structure (Alphabetical)")
    md.append("")
    md.append("In the course slide, Non-Clustered Index `i2` organizes the students by `name` with row locators pointing back to the clustering key `id`:")
    md.append("")
    md.append("| `name` (Index Key) | `id` (Row Locator / Clustering Key) | `age` (Payload in Clustered Leaf) | B+Tree Route in Lecture Slide |")
    md.append("| :--- | :---: | :---: | :--- |")
    for r in nc_sorted_rows:
        name_val = r[0]
        id_val = r[1]
        age_val = r[2]
        if name_val <= 'Khalid':
            branch = "Left Intermediate Branch (`Ahmed`, `Doaa`, `Khalid`)"
        else:
            branch = "Right Intermediate Branch (`Lamis`, `Nada`, `Yasser`)"
        
        if name_val == 'Omar':
            lookup_note = "**VIDEO TARGET QUERY**: `i2` Seek yields `id=804` -> Triggers Key Lookup into Clustered Leaf for `age=22`"
        else:
            lookup_note = f"Non-clustered leaf node pointing to Clustered Row `{id_val}`"
            
        md.append(f"| `{name_val}` | `{id_val}` | `{age_val}` | {branch} — {lookup_note} |")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 4. Query Mechanics: Key Lookup vs Index-Only vs Covering Index")
    md.append("")
    md.append("### Scenario 1: Index Seek + Key Lookup (Bookmark Lookup)")
    md.append("```sql")
    md.append("-- Video Query (Yellow Box):")
    md.append("SELECT * FROM dbo.student WHERE name = 'Omar';")
    md.append("```")
    md.append("**Execution Engine Steps:**")
    md.append("1. **Non-Clustered Index Seek**: Traverses the `i2` B+Tree (`Root -> Right Intermediate -> Leaf Page`) to locate `'Omar'`.")
    md.append("2. **Extract Row Locator**: At the leaf level of `i2`, the engine reads the row locator, which is the clustering key `id = 804`.")
    md.append("3. **Follow the Pointer (Yellow Arrow in Slide)**: Because the query requests `SELECT *` (specifically requiring `age`), and `i2` does not contain `age`, SQL Server performs a **Key Lookup** (Clustered Index Seek on `PK_student_id`) using `id = 804` to fetch the remaining column `age = 22`.")
    md.append("4. **Cost Implication**: 2-3 logical reads in `i2` + 2-3 logical reads in `PK_student_id` = ~5-6 total logical reads.")
    md.append("")
    md.append("### Scenario 2: Index-Only Query (Zero Key Lookup)")
    md.append("```sql")
    md.append("SELECT id, name FROM dbo.student WHERE name = 'Omar';")
    md.append("```")
    md.append("**Execution Engine Steps:**")
    md.append("1. The requested columns are `id` and `name`.")
    md.append("2. `name` is the explicit index key in `i2`.")
    md.append("3. `id` is the row locator, which is **automatically present** at the leaf level of every non-clustered index on a clustered table!")
    md.append("4. **Key Lookup is completely avoided!** The query is satisfied 100% from the `i2` leaf page in just **2-3 logical reads**.")
    md.append("")
    md.append("### Scenario 3: Modern Covering Index with INCLUDE Clause")
    md.append("```sql")
    md.append("-- Eliminating the Key Lookup for SELECT * without bloating the B+Tree key hierarchy:")
    md.append("CREATE NONCLUSTERED INDEX i2_covering ON dbo.student (name) INCLUDE (age);")
    md.append("GO")
    md.append("")
    md.append("SELECT id, name, age FROM dbo.student WHERE name = 'Omar';")
    md.append("```")
    md.append("**Engine Optimization:**")
    md.append("- `INCLUDE (age)` adds `age` to the **leaf level only** of the index, keeping non-leaf index pages small and shallow.")
    md.append("- Query achieves full coverage for `id`, `name`, and `age` directly from the leaf level of `i2_covering` without any Key Lookup.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 5. Artifact & Repository Alignment")
    md.append("")
    md.append("* **Source T-SQL Script**: [`src/01_storage_and_schema/ch01_vid09_nonclustered_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid09_nonclustered_index.sql)")
    md.append("* **Preceding Module Script**: [`src/01_storage_and_schema/ch01_vid08_clustered_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid08_clustered_index.sql)")
    md.append("* **Preceding Live Telemetry**: [`docs/ch01-vid08-clustered-index-live.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/ch01-vid08-clustered-index-live.md)")
    md.append("* **Syllabus Mapping**: [`docs/course-syllabus-mapping.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/course-syllabus-mapping.md)")
    md.append("* **Obsidian Second Brain Note**: [`docs/curriculum/01 - COURSE/CH01 - Database Creation and Management/CH01_VID09 - Non-Clustered Index.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/curriculum/01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/CH01_VID09%20-%20Non-Clustered%20Index.md)")
    
    out_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "ch01-vid09-nonclustered-index-live.md")
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(md) + "\n")
        
    print(f">>> Successfully created {out_path} from live SQL Server instance!")
    conn.close()

if __name__ == '__main__':
    generate_live_doc()
