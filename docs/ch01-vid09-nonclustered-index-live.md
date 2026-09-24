# CH01_VID09: Non-Clustered Index Architecture & Key Lookup Mechanics - Live Verification Telemetry

> **Live Database Telemetry Captured Directly from Microsoft SQL Server 2022 Instance**
> **Environment**: `DESKTOP-NPSJDUB` / `localhost` (`.`) | **Database**: `[ITI]` | **Capture Timestamp (UTC)**: `2026-09-24 21:19:07`
> **Engine**: `Microsoft SQL Server 2022 (RTM-GDR) (KB5122771) - 16.0.1200.5 (X64) `

---

## 1. Executive Pedagogical Context

In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 9), **Eng. Rami Mohamed Abonagi** examines the architecture and query mechanics of **Non-Clustered Indexes**, resolving the fundamental limitation identified in `CH01_VID08`:

> `Select * from student where name = 'Omar'`
> Because a table can have only **one** clustered index (which physically orders data by `id`), searching on a non-clustered column like `name` previously forced an exhaustive **Clustered Index Scan** across all data pages.
> Creating a **Non-Clustered Index** builds an independent secondary B+Tree sorted on the search column, dramatically accelerating lookups while using a **Row Locator** to connect back to the base data.

### Architectural Comparison: Clustered vs Non-Clustered Index

| Architectural Dimension | Clustered Index (`type = 1`) | Non-Clustered Index (`type = 2`) |
| :--- | :--- | :--- |
| **Maximum Per Table** | Exactly **1** (or 0 if Heap) | Up to **999** per table |
| **Leaf Level Contents** | The **actual data pages** of the table (all columns and rows) | The **Index Key** (`name`) + **Row Locator** pointer |
| **Row Locator (On Clustered Table)** | N/A (Leaf IS the row) | **Clustering Key value** (`id`) |
| **Row Locator (On Heap Table)** | N/A (Heap has no clustered index) | **RID** (`FileID:PageID:SlotID`) |
| **Data Physical Order** | Dictates physical layout of table | Independent; table remains sorted by clustered key |
| **Query Operation** | Clustered Index Seek / Scan | Non-Clustered Index Seek / Scan |
| **Auxiliary Step for Uncovered Attributes** | None (Leaf has all attributes) | **Key Lookup** (or RID Lookup) back to base table |

---

## 2. Live Database Telemetry from `[ITI]`

### A. Verified Indexes on `dbo.student`

| Index Name | Index ID | Index Type | Is Unique | Primary Key | Key Column(s) | Role & Status |
| :--- | :---: | :--- | :---: | :---: | :--- | :--- |
| `PK_student_id` | `1` | `CLUSTERED` | `True` | `True` | `id` | Base Clustered Storage |
| `i2` | `4` | `NONCLUSTERED` | `False` | `False` | `name` | Secondary Index from Lecture Slide |
| `i2_covering` | `5` | `NONCLUSTERED` | `False` | `False` | `age, name` | Modern Covering Optimization |

### B. Physical B+Tree Statistics Across Both Indexes (`sys.dm_db_index_physical_stats`)

| Index Name | Type | Level | Level Role | Pages | Records | Avg Size | Space Used |
| :--- | :--- | :---: | :--- | :---: | :---: | :---: | :---: |
| `PK_student_id` | `CLUSTERED` | `0` | Leaf Level | `1` | `13` | `23.54 B` | `4.08%` |
| `i2` | `NONCLUSTERED` | `0` | Leaf Level | `1` | `13` | `16.54 B` | `2.95%` |
| `i2_covering` | `NONCLUSTERED` | `0` | Leaf Level | `1` | `13` | `20.54 B` | `3.6%` |

---

## 3. Non-Clustered Index `i2` Traversal Structure (Alphabetical)

In the course slide, Non-Clustered Index `i2` organizes the students by `name` with row locators pointing back to the clustering key `id`:

| `name` (Index Key) | `id` (Row Locator / Clustering Key) | `age` (Payload in Clustered Leaf) | B+Tree Route in Lecture Slide |
| :--- | :---: | :---: | :--- |
| `Ahmad` | `1` | `22` | Left Intermediate Branch (`Ahmed`, `Doaa`, `Khalid`) — Non-clustered leaf node pointing to Clustered Row `1` |
| `Ahmad` | `100` | `22` | Left Intermediate Branch (`Ahmed`, `Doaa`, `Khalid`) — Non-clustered leaf node pointing to Clustered Row `100` |
| `Ali` | `3` | `23` | Left Intermediate Branch (`Ahmed`, `Doaa`, `Khalid`) — Non-clustered leaf node pointing to Clustered Row `3` |
| `Ali` | `201` | `22` | Left Intermediate Branch (`Ahmed`, `Doaa`, `Khalid`) — Non-clustered leaf node pointing to Clustered Row `201` |
| `Doaa` | `200` | `23` | Left Intermediate Branch (`Ahmed`, `Doaa`, `Khalid`) — Non-clustered leaf node pointing to Clustered Row `200` |
| `Eman` | `104` | `21` | Left Intermediate Branch (`Ahmed`, `Doaa`, `Khalid`) — Non-clustered leaf node pointing to Clustered Row `104` |
| `Khalid` | `2` | `21` | Left Intermediate Branch (`Ahmed`, `Doaa`, `Khalid`) — Non-clustered leaf node pointing to Clustered Row `2` |
| `Mona` | `700` | `22` | Right Intermediate Branch (`Lamis`, `Nada`, `Yasser`) — Non-clustered leaf node pointing to Clustered Row `700` |
| `Nader` | `905` | `22` | Right Intermediate Branch (`Lamis`, `Nada`, `Yasser`) — Non-clustered leaf node pointing to Clustered Row `905` |
| `Omar` | `804` | `22` | Right Intermediate Branch (`Lamis`, `Nada`, `Yasser`) — **VIDEO TARGET QUERY**: `i2` Seek yields `id=804` -> Triggers Key Lookup into Clustered Leaf for `age=22` |
| `Sara` | `900` | `23` | Right Intermediate Branch (`Lamis`, `Nada`, `Yasser`) — Non-clustered leaf node pointing to Clustered Row `900` |
| `Tamer` | `702` | `23` | Right Intermediate Branch (`Lamis`, `Nada`, `Yasser`) — Non-clustered leaf node pointing to Clustered Row `702` |
| `Youssef` | `800` | `21` | Right Intermediate Branch (`Lamis`, `Nada`, `Yasser`) — Non-clustered leaf node pointing to Clustered Row `800` |

---

## 4. Query Mechanics: Key Lookup vs Index-Only vs Covering Index

### Scenario 1: Index Seek + Key Lookup (Bookmark Lookup)
```sql
-- Video Query (Yellow Box):
SELECT * FROM dbo.student WHERE name = 'Omar';
```
**Execution Engine Steps:**
1. **Non-Clustered Index Seek**: Traverses the `i2` B+Tree (`Root -> Right Intermediate -> Leaf Page`) to locate `'Omar'`.
2. **Extract Row Locator**: At the leaf level of `i2`, the engine reads the row locator, which is the clustering key `id = 804`.
3. **Follow the Pointer (Yellow Arrow in Slide)**: Because the query requests `SELECT *` (specifically requiring `age`), and `i2` does not contain `age`, SQL Server performs a **Key Lookup** (Clustered Index Seek on `PK_student_id`) using `id = 804` to fetch the remaining column `age = 22`.
4. **Cost Implication**: 2-3 logical reads in `i2` + 2-3 logical reads in `PK_student_id` = ~5-6 total logical reads.

### Scenario 2: Index-Only Query (Zero Key Lookup)
```sql
SELECT id, name FROM dbo.student WHERE name = 'Omar';
```
**Execution Engine Steps:**
1. The requested columns are `id` and `name`.
2. `name` is the explicit index key in `i2`.
3. `id` is the row locator, which is **automatically present** at the leaf level of every non-clustered index on a clustered table!
4. **Key Lookup is completely avoided!** The query is satisfied 100% from the `i2` leaf page in just **2-3 logical reads**.

### Scenario 3: Modern Covering Index with INCLUDE Clause
```sql
-- Eliminating the Key Lookup for SELECT * without bloating the B+Tree key hierarchy:
CREATE NONCLUSTERED INDEX i2_covering ON dbo.student (name) INCLUDE (age);
GO

SELECT id, name, age FROM dbo.student WHERE name = 'Omar';
```
**Engine Optimization:**
- `INCLUDE (age)` adds `age` to the **leaf level only** of the index, keeping non-leaf index pages small and shallow.
- Query achieves full coverage for `id`, `name`, and `age` directly from the leaf level of `i2_covering` without any Key Lookup.

---

## 5. Artifact & Repository Alignment

* **Source T-SQL Script**: [`src/01_storage_and_schema/ch01_vid09_nonclustered_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid09_nonclustered_index.sql)
* **Preceding Module Script**: [`src/01_storage_and_schema/ch01_vid08_clustered_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid08_clustered_index.sql)
* **Preceding Live Telemetry**: [`docs/ch01-vid08-clustered-index-live.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/ch01-vid08-clustered-index-live.md)
* **Syllabus Mapping**: [`docs/course-syllabus-mapping.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/course-syllabus-mapping.md)
* **Obsidian Second Brain Note**: [`docs/curriculum/01 - COURSE/CH01 - Database Creation and Management/CH01_VID09 - Non-Clustered Index.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/curriculum/01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/CH01_VID09%20-%20Non-Clustered%20Index.md)
