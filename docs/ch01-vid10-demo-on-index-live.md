# CH01_VID10: Demo on Index (Practical SSMS Indexing Lab) - Live Verification Telemetry

> **Live Database Telemetry Captured Directly from Microsoft SQL Server 2022 Instance**
> **Environment**: `DESKTOP-NPSJDUB` / `localhost` (`.`) | **Database**: `[ITI]` | **Capture Timestamp (UTC)**: `2026-09-25 17:44:00`
> **Engine**: `Microsoft SQL Server 2022 (RTM-GDR) (KB5122771) - 16.0.1200.5 (X64) `

---

## 1. Executive Pedagogical Context

In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 10), **Eng. Rami Mohamed Abonagi** transitions from theoretical B+Tree mechanics into an interactive SQL Server Management Studio (SSMS) practical lab, answering the core operational questions:

1. **Can a table have two Clustered Indexes?**
   - What happens when a developer executes:
     ```sql
     create clustered index i2 on student(st_fname)
     ```
   - SQL Server immediately rejects the command with **Msg 1902**: A table's physical data pages can only be sorted in **ONE** physical sequence. Because `PK_Student` already clusters the table on `St_Id`, creating another clustered index is impossible without first dropping the existing one.
2. **How does a Non-Clustered Index behave on a Clustered Table?**
   - What happens when executing:
     ```sql
     create nonclustered index i2 on student(st_fname)
     ```
   - The command succeeds seamlessly! SQL Server builds an auxiliary B+Tree sorted on `St_Fname`, storing the clustering key `St_Id` as the row locator at the leaf level.
3. **How does the Query Optimizer execute queries before and after the index?**
   - **Before `i2`**: `SELECT * FROM Student WHERE St_Fname = 'Ahmed'` forces an exhaustive **Clustered Index Scan** across all data pages.
   - **After `i2` (Wide Query)**: Uses an **Index Seek** on `i2` followed by a **Key Lookup** into `PK_Student` to retrieve remaining payload columns.
   - **After `i2` (Index-Only Query)**: `SELECT St_Id, St_Fname FROM Student WHERE St_Fname = 'Ahmed'` requires **ZERO Key Lookups**, resolving entirely from the `i2` leaf level.
   - **After `i2_covering` (`INCLUDE`)**: Adding non-key columns (`INCLUDE (St_Address, St_Age)`) completely eliminates Key Lookups for wide queries while preserving narrow non-leaf B+Tree branch nodes.

---

## 2. Live Database Telemetry from `[ITI].[dbo].[Student]`

### A. Table Structure (`dbo.Student`)

| Column ID | Column Name | Data Type | Storage Bytes | Nullable | Primary Key | Role |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| 1 | `St_Id` | `int` | 4 | False | **YES** (Clustering Key) | Primary Key (Clustering Key) |
| 2 | `St_Fname` | `nvarchar` | 100 | True | NO | Secondary Index Key (i2) |
| 3 | `St_Lname` | `nchar` | 20 | True | NO | Payload Attribute |
| 4 | `St_Address` | `nvarchar` | 200 | True | NO | Payload Attribute |
| 5 | `St_Age` | `int` | 4 | True | NO | Payload Attribute |
| 6 | `Dept_Id` | `int` | 4 | True | NO | Payload Attribute |
| 7 | `St_super` | `int` | 4 | True | NO | Payload Attribute |

### B. Active Indexes on `dbo.Student`

| Index Name | Index ID | Type | Is Unique | Primary Key | Key Columns | Included Columns | Role |
| :--- | :---: | :--- | :---: | :---: | :--- | :--- | :--- |
| `PK_Student` | `1` | `CLUSTERED` | `True` | `True` | `St_Id` | *None* | Physical Base Storage |
| `i2` | `2` | `NONCLUSTERED` | `False` | `False` | `St_Fname` | *None* | Secondary Index from Lecture |
| `i3` | `3` | `NONCLUSTERED` | `False` | `False` | `St_Address` | *None* | Modern Covering Optimization |
| `i2_covering` | `4` | `NONCLUSTERED` | `False` | `False` | `St_Fname` | `St_Address, St_Age` | Modern Covering Optimization |

### C. Physical B+Tree Hierarchy Telemetry (`sys.dm_db_index_physical_stats`)

| Index Name | Type | Level | Role | Pages | Records | Avg Size | Space Used |
| :--- | :--- | :---: | :--- | :---: | :---: | :---: | :---: |
| `PK_Student` | `CLUSTERED` | `0` | Leaf Level | `1` | `14` | `68.57 B` | `12.18%` |
| `i2` | `NONCLUSTERED` | `0` | Leaf Level | `1` | `14` | `21.14 B` | `3.98%` |
| `i3` | `NONCLUSTERED` | `0` | Leaf Level | `1` | `14` | `22.43 B` | `4.2%` |
| `i2_covering` | `NONCLUSTERED` | `0` | Leaf Level | `1` | `14` | `37.57 B` | `6.82%` |

---

## 3. The Single Clustered Index Constraint (Live Engine Proof)

### Attempted Query (from Lecture):
```sql
CREATE CLUSTERED INDEX i2 ON dbo.Student(st_fname);
```

### Live SQL Server Engine Rejection Telemetry:
```text
('42000', "[42000] [Microsoft][ODBC Driver 18 for SQL Server][SQL Server]Cannot create more than one clustered index on table 'dbo.Student'. Drop the existing clustered index 'PK_Student' before creating another. (1902) (SQLExecDirectW)")
```

> [!IMPORTANT]
> **Why Msg 1902 Occurs (Physical Storage Invariant):**
> In Microsoft SQL Server, a clustered index is **not** an auxiliary list; it **is the table itself**. The leaf nodes of a clustered index are the physical 8 KB data pages containing the actual table records. Since physical files on disk cannot be ordered in two conflicting sequences simultaneously (e.g. sorted by `St_Id` and simultaneously sorted by `St_Fname`), a table can have **one and only one** clustered index.

---

## 4. Query Execution Mechanics Walkthrough

### Query 1: Wide Query with Non-Clustered Index (Seek + Key Lookup)
```sql
SELECT St_Id, St_Fname, St_Lname, St_Address, St_Age, Dept_Id, St_super
FROM dbo.Student
WHERE St_Fname = N'Ahmed';
```
**Execution Engine Trace:**
1. **Index Seek (`i2`)**: Searches the auxiliary B+Tree on `St_Fname` down to the leaf node for `'Ahmed'`.
2. **Row Locator Retrieval**: Reads the clustering key `St_Id = 1` stored at the leaf node of `i2`.
3. **Key Lookup (`PK_Student`)**: Performs a Clustered Index Seek into `dbo.Student` on `St_Id = 1` to retrieve the remaining columns (`St_Lname`, `St_Address`, `St_Age`, etc.).
4. **I/O Overhead**: ~4-5 logical reads (Seek in `i2` + Seek in `PK_Student`).

### Query 2: Index-Only / Covering Query (Zero Key Lookup)
```sql
SELECT St_Id, St_Fname
FROM dbo.Student
WHERE St_Fname = N'Ahmed';
```
**Execution Engine Trace:**
1. `St_Fname` is the explicit index key in `i2`.
2. `St_Id` is the clustering key automatically included in every leaf node as the row locator.
3. **Key Lookup is completely avoided!** The query is satisfied 100% from the `i2` leaf page in just **2 logical reads**.

### Query 3: Modern Covering Index Optimization (`INCLUDE`)
```sql
CREATE NONCLUSTERED INDEX i2_covering
ON dbo.Student(st_fname)
INCLUDE (St_Address, St_Age);
GO

SELECT St_Id, St_Fname, St_Address, St_Age
FROM dbo.Student
WHERE St_Fname = N'Ahmed';
```
**Execution Engine Optimization:**
- `INCLUDE` appends `St_Address` and `St_Age` to the **leaf level only**, leaving intermediate branch pages compact.
- Satisfies wide analytical queries with zero Key Lookup overhead.

---

## 5. Artifact & Repository Alignment

* **Source T-SQL Script**: [`src/01_storage_and_schema/ch01_vid10_demo_on_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid10_demo_on_index.sql)
* **Environment Setup Script**: [`src/01_storage_and_schema/ch01_vid10_demo_on_index_setup.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid10_demo_on_index_setup.sql)
* **Preceding Module Scripts**: [`ch01_vid08_clustered_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid08_clustered_index.sql) & [`ch01_vid09_nonclustered_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid09_nonclustered_index.sql)
* **Syllabus Mapping**: [`docs/course-syllabus-mapping.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/course-syllabus-mapping.md)
* **Obsidian Second Brain Note**: [`docs/curriculum/01 - COURSE/CH01 - Database Creation and Management/CH01_VID10 - Demo on Index.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/curriculum/01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/CH01_VID10%20-%20Demo%20on%20Index.md)
