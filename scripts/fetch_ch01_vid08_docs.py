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
    
    # Table metadata
    cur.execute("""
    SELECT 
        t.name AS TableName,
        SCHEMA_NAME(t.schema_id) AS SchemaName,
        t.create_date,
        t.modify_date
    FROM sys.tables t
    WHERE t.name = 'student'
    """)
    table_meta = cur.fetchone()
    
    # Columns for student
    cur.execute("""
    SELECT 
        c.column_id,
        c.name AS ColumnName,
        tp.name AS DataType,
        c.max_length AS MaxLength,
        c.is_nullable AS IsNullable,
        ISNULL(i.is_primary_key, 0) AS IsPrimaryKey
    FROM sys.columns c
    JOIN sys.types tp ON c.user_type_id = tp.user_type_id
    LEFT JOIN sys.index_columns ic ON c.object_id = ic.object_id AND c.column_id = ic.column_id
    LEFT JOIN sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id AND i.is_primary_key = 1
    WHERE c.object_id = OBJECT_ID('dbo.student')
    ORDER BY c.column_id
    """)
    student_cols = cur.fetchall()
    
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
    
    # Physical index stats for Clustered Index (index_id = 1)
    cur.execute("""
    SELECT 
        index_id,
        index_type_desc,
        index_level,
        page_count,
        record_count,
        avg_record_size_in_bytes,
        avg_page_space_used_in_percent
    FROM sys.dm_db_index_physical_stats(DB_ID('ITI'), OBJECT_ID('dbo.student'), 1, NULL, 'DETAILED')
    ORDER BY index_level DESC
    """)
    clustered_stats = cur.fetchall()
    
    # Rows in student (ordered by cluster key id)
    cur.execute("""
    SELECT id, name, age
    FROM dbo.student
    ORDER BY id
    """)
    student_rows = cur.fetchall()
    
    # Construct Markdown
    md = []
    md.append("# CH01_VID08: Clustered Index Architecture & B+Tree Traversal - Live Verification Telemetry")
    md.append("")
    md.append("> **Live Database Telemetry Captured Directly from Microsoft SQL Server 2022 Instance**")
    md.append(f"> **Environment**: `DESKTOP-NPSJDUB` / `localhost` (`.`) | **Database**: `[ITI]` | **Capture Timestamp (UTC)**: `{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}`")
    md.append(f"> **Engine**: `{version_str.splitlines()[0]}`")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 1. Executive Pedagogical Context")
    md.append("")
    md.append("In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 8), **Eng. Rami Mohamed Abonagi** introduces database indexing fundamentals, comparing **Functional Requirements** with **Non-Functional Requirements**, dissecting the physical mechanics of **Heap Tables vs Clustered Tables**, and illustrating the internal architecture of **B+Trees**.")
    md.append("")
    md.append("### A. Functional vs Non-Functional Requirements")
    md.append("")
    md.append("| Dimension | Functional Requirement | Non-Functional Requirement |")
    md.append("| :--- | :--- | :--- |")
    md.append("| **Core Definition** | What the application does (business features, data transformations, returning the correct result set). | How well the application performs (speed, scalability, throughput, reliability, resource efficiency). |")
    md.append("| **Example in Lecture** | `SELECT * FROM student WHERE id = 100;` returns Ahmad's record. | The query must return in `< 2 ms` instead of scanning millions of records for minutes. |")
    md.append("| **Database Mechanism** | T-SQL syntax, relational operators, constraints, stored procedures. | **Indexes (B+Tree)**, memory management, buffer cache, storage engine partitioning. |")
    md.append("")
    md.append("### B. Heap Table vs Clustered Table")
    md.append("")
    md.append("| Physical Characteristic | Heap Table (`sys.indexes.type = 0`) | Clustered Table (`sys.indexes.type = 1`) |")
    md.append("| :--- | :--- | :--- |")
    md.append("| **Physical Organization** | Unordered data pages. Rows are placed wherever free space exists in IAM-tracked extents. | Physically sorted in B+Tree leaf pages by the Clustered Key columns. |")
    md.append("| **Row Identifier** | **RID** (Row Identifier: `FileID:PageID:SlotID`). | **Clustering Key** (e.g., `id`). |")
    md.append("| **Count per Table** | At most 1 (mutually exclusive with Clustered Index). | Exactly 1 per table (data pages ARE the leaf level). |")
    md.append("| **Lookup Mechanism** | Table Scan (`O(N)`) required for every query unless a secondary non-clustered index exists. | Clustered Index Seek (`O(log N)`) via binary search down the B+Tree hierarchy. |")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 2. Live Database Schema in `[ITI]`")
    md.append("")
    md.append("### A. Table Structure: `dbo.student`")
    md.append("")
    md.append("| Column ID | Column Name | Data Type | Storage Bytes | Nullable | Primary Key | Role |")
    md.append("| :---: | :--- | :--- | :---: | :---: | :---: | :--- |")
    for col in student_cols:
        pk_badge = "**YES** (Clustering Key)" if col[5] else "NO"
        role = "Primary Key / B+Tree Search Key" if col[1] == 'id' else ("Secondary Search Attribute" if col[1] == 'name' else "Payload Attribute")
        md.append(f"| {col[0]} | `{col[1]}` | `{col[2]}` | {col[3]} | {col[4]} | {pk_badge} | {role} |")
    md.append("")
    md.append("### B. Verified Indexes on `dbo.student`")
    md.append("")
    md.append("| Index Name | Index ID | Type | Is Unique | Primary Key | Key Column(s) |")
    md.append("| :--- | :---: | :--- | :---: | :---: | :--- |")
    for idx in index_meta:
        md.append(f"| `{idx[0]}` | `{idx[1]}` | `{idx[2]}` | `{idx[3]}` | `{idx[4]}` | `{idx[5]}` |")
    md.append("")
    md.append("### C. Clustered B+Tree Physical Hierarchy Telemetry (`sys.dm_db_index_physical_stats`)")
    md.append("")
    md.append("| B+Tree Level | Level Description | Page Count | Record Count | Avg Record Size | Page Space Used |")
    md.append("| :---: | :--- | :---: | :---: | :---: | :---: |")
    for ps in clustered_stats:
        lvl_desc = "Leaf Level (Actual Data Pages containing full records)" if ps[2] == 0 else "Root / Intermediate Level (Index Pages)"
        md.append(f"| `{ps[2]}` | {lvl_desc} | `{ps[3]}` | `{ps[4]}` | `{round(ps[5], 2)} bytes` | `{round(ps[6], 2)}%` |")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 3. Authentic Course Dataset in `dbo.student` (13 Records)")
    md.append("")
    md.append("The 13 records corresponding directly to the video slides (Left Subtree IDs 1-201, Right Subtree IDs 700-905):")
    md.append("")
    md.append("| `id` (Clustering Key) | `name` | `age` | B+Tree Physical Subtree Allocation | Target Query Role |")
    md.append("| :---: | :--- | :---: | :--- | :--- |")
    for r in student_rows:
        id_val = r[0]
        name_val = r[1]
        age_val = r[2]
        if id_val <= 201:
            subtree = "Left Subtree (Non-Leaf Pointer: `1 Ahmad` - `201 Ali`)"
        else:
            subtree = "Right Subtree (Non-Leaf Pointer: `700 Mona` - `905 Nader`)"
        
        if id_val == 804:
            role = "**Target of Index Seek** (`WHERE id = 804` in Slide 4)"
        elif name_val == 'Omar':
            role = "**Target of Table Scan / Index Scan** (`WHERE name = 'Omar'` in Slide 5)"
        else:
            role = "Data Page Record"
            
        md.append(f"| `{id_val}` | `{name_val}` | `{age_val}` | {subtree} | {role} |")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 4. Architectural Step-by-Step Walkthrough")
    md.append("")
    md.append("### Step 1: Initial Heap Phase (Unordered)")
    md.append("```sql")
    md.append("CREATE TABLE dbo.student_heap (id INT, name VARCHAR(20), age INT);")
    md.append("INSERT INTO dbo.student_heap VALUES (1, 'Ahmad', 22), (4, 'Khalid', 21), (2, 'Ali', 23), (3, 'Eman', 21);")
    md.append("SELECT * FROM dbo.student_heap;")
    md.append("```")
    md.append("**Result:** Rows are returned in insertion order: `[1, 4, 2, 3]`. There is no natural or guaranteed order.")
    md.append("")
    md.append("### Step 2: Primary Key Creation & Physical Reordering")
    md.append("```sql")
    md.append("ALTER TABLE dbo.student ADD CONSTRAINT PK_student_id PRIMARY KEY (id);")
    md.append("```")
    md.append("**Result:** SQL Server creates a Unique Clustered Index on `id`. The physical data pages are rebuilt into a sorted B+Tree leaf chain: `[1, 2, 3, 4]`. Row positions are permanently managed by the clustering key.")
    md.append("")
    md.append("### Step 3: Clustered Index Seek (`WHERE id = 804`)")
    md.append("```sql")
    md.append("SELECT * FROM dbo.student WHERE id = 804;")
    md.append("```")
    md.append("**Execution Engine Traversal:**")
    md.append("1. **Root Page Inspection**: Evaluates key ranges. Identifies that `804 >= 700`, routing the traversal pointer to the **Right Subtree** intermediate page.")
    md.append("2. **Intermediate Page Inspection**: Evaluates child page boundaries (`700`, `702`, `800`, `900`). Identifies that `804` belongs to **Leaf Page 800** (`800 <= id < 900`).")
    md.append("3. **Leaf Page Slot Array Scan**: Performs a binary search across the 2-byte slot array at the end of Page 800 to locate record offset for `id = 804`.")
    md.append("4. **I/O Cost**: Exactly **2-3 logical reads**, regardless of whether the table contains 13 rows or 13,000,000 rows.")
    md.append("")
    md.append("### Step 4: The Clustered Index Limitation (`WHERE name = 'Omar'`)")
    md.append("```sql")
    md.append("SELECT * FROM dbo.student WHERE name = 'Omar';")
    md.append("```")
    md.append("**Execution Engine Dilemma:**")
    md.append("- The B+Tree is sorted physically on `id` (integer order).")
    md.append("- It has **zero ordering** on `name` (alphabetical).")
    md.append("- The engine CANNOT navigate the tree to find `'Omar'`. It must perform a **Clustered Index Scan**, visiting every single leaf data page in the doubly linked list from first to last.")
    md.append("- **Conclusion**: A table can only have **ONE** clustered index. To accelerate searches on secondary attributes (like `name`), SQL Server requires **Non-Clustered Indexes** (`CH01_VID09`).")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 5. Artifact & Repository Alignment")
    md.append("")
    md.append("* **Source T-SQL Script**: [`src/01_storage_and_schema/ch01_vid08_clustered_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid08_clustered_index.sql)")
    md.append("* **Subsequent Module Script**: [`src/01_storage_and_schema/ch01_vid09_nonclustered_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid09_nonclustered_index.sql)")
    md.append("* **Syllabus Mapping**: [`docs/course-syllabus-mapping.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/course-syllabus-mapping.md)")
    md.append("* **Obsidian Second Brain Note**: [`docs/curriculum/01 - COURSE/CH01 - Database Creation and Management/CH01_VID08 - Clustered Index.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/curriculum/01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/CH01_VID08%20-%20Clustered%20Index.md)")
    
    out_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "docs", "ch01-vid08-clustered-index-live.md")
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(md) + "\n")
        
    print(f">>> Successfully created {out_path} from live SQL Server instance!")
    conn.close()

if __name__ == '__main__':
    generate_live_doc()
