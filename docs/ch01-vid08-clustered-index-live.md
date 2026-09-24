# CH01_VID08: Clustered Index Architecture & B+Tree Traversal - Live Verification Telemetry

> **Live Database Telemetry Captured Directly from Microsoft SQL Server 2022 Instance**
> **Environment**: `DESKTOP-NPSJDUB` / `localhost` (`.`) | **Database**: `[ITI]` | **Capture Timestamp (UTC)**: `2026-09-24 21:19:07`
> **Engine**: `Microsoft SQL Server 2022 (RTM-GDR) (KB5122771) - 16.0.1200.5 (X64) `

---

## 1. Executive Pedagogical Context

In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 8), **Eng. Rami Mohamed Abonagi** introduces database indexing fundamentals, comparing **Functional Requirements** with **Non-Functional Requirements**, dissecting the physical mechanics of **Heap Tables vs Clustered Tables**, and illustrating the internal architecture of **B+Trees**.

### A. Functional vs Non-Functional Requirements

| Dimension | Functional Requirement | Non-Functional Requirement |
| :--- | :--- | :--- |
| **Core Definition** | What the application does (business features, data transformations, returning the correct result set). | How well the application performs (speed, scalability, throughput, reliability, resource efficiency). |
| **Example in Lecture** | `SELECT * FROM student WHERE id = 100;` returns Ahmad's record. | The query must return in `< 2 ms` instead of scanning millions of records for minutes. |
| **Database Mechanism** | T-SQL syntax, relational operators, constraints, stored procedures. | **Indexes (B+Tree)**, memory management, buffer cache, storage engine partitioning. |

### B. Heap Table vs Clustered Table

| Physical Characteristic | Heap Table (`sys.indexes.type = 0`) | Clustered Table (`sys.indexes.type = 1`) |
| :--- | :--- | :--- |
| **Physical Organization** | Unordered data pages. Rows are placed wherever free space exists in IAM-tracked extents. | Physically sorted in B+Tree leaf pages by the Clustered Key columns. |
| **Row Identifier** | **RID** (Row Identifier: `FileID:PageID:SlotID`). | **Clustering Key** (e.g., `id`). |
| **Count per Table** | At most 1 (mutually exclusive with Clustered Index). | Exactly 1 per table (data pages ARE the leaf level). |
| **Lookup Mechanism** | Table Scan (`O(N)`) required for every query unless a secondary non-clustered index exists. | Clustered Index Seek (`O(log N)`) via binary search down the B+Tree hierarchy. |

---

## 2. Live Database Schema in `[ITI]`

### A. Table Structure: `dbo.student`

| Column ID | Column Name | Data Type | Storage Bytes | Nullable | Primary Key | Role |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| 1 | `id` | `int` | 4 | False | **YES** (Clustering Key) | Primary Key / B+Tree Search Key |
| 2 | `name` | `varchar` | 20 | True | NO | Secondary Search Attribute |
| 2 | `name` | `varchar` | 20 | True | NO | Secondary Search Attribute |
| 3 | `age` | `int` | 4 | True | NO | Payload Attribute |

### B. Verified Indexes on `dbo.student`

| Index Name | Index ID | Type | Is Unique | Primary Key | Key Column(s) |
| :--- | :---: | :--- | :---: | :---: | :--- |
| `PK_student_id` | `1` | `CLUSTERED` | `True` | `True` | `id` |
| `i2` | `4` | `NONCLUSTERED` | `False` | `False` | `name` |
| `i2_covering` | `5` | `NONCLUSTERED` | `False` | `False` | `age, name` |

### C. Clustered B+Tree Physical Hierarchy Telemetry (`sys.dm_db_index_physical_stats`)

| B+Tree Level | Level Description | Page Count | Record Count | Avg Record Size | Page Space Used |
| :---: | :--- | :---: | :---: | :---: | :---: |
| `0` | Leaf Level (Actual Data Pages containing full records) | `1` | `13` | `23.54 bytes` | `4.08%` |

---

## 3. Authentic Course Dataset in `dbo.student` (13 Records)

The 13 records corresponding directly to the video slides (Left Subtree IDs 1-201, Right Subtree IDs 700-905):

| `id` (Clustering Key) | `name` | `age` | B+Tree Physical Subtree Allocation | Target Query Role |
| :---: | :--- | :---: | :--- | :--- |
| `1` | `Ahmad` | `22` | Left Subtree (Non-Leaf Pointer: `1 Ahmad` - `201 Ali`) | Data Page Record |
| `2` | `Khalid` | `21` | Left Subtree (Non-Leaf Pointer: `1 Ahmad` - `201 Ali`) | Data Page Record |
| `3` | `Ali` | `23` | Left Subtree (Non-Leaf Pointer: `1 Ahmad` - `201 Ali`) | Data Page Record |
| `100` | `Ahmad` | `22` | Left Subtree (Non-Leaf Pointer: `1 Ahmad` - `201 Ali`) | Data Page Record |
| `104` | `Eman` | `21` | Left Subtree (Non-Leaf Pointer: `1 Ahmad` - `201 Ali`) | Data Page Record |
| `200` | `Doaa` | `23` | Left Subtree (Non-Leaf Pointer: `1 Ahmad` - `201 Ali`) | Data Page Record |
| `201` | `Ali` | `22` | Left Subtree (Non-Leaf Pointer: `1 Ahmad` - `201 Ali`) | Data Page Record |
| `700` | `Mona` | `22` | Right Subtree (Non-Leaf Pointer: `700 Mona` - `905 Nader`) | Data Page Record |
| `702` | `Tamer` | `23` | Right Subtree (Non-Leaf Pointer: `700 Mona` - `905 Nader`) | Data Page Record |
| `800` | `Youssef` | `21` | Right Subtree (Non-Leaf Pointer: `700 Mona` - `905 Nader`) | Data Page Record |
| `804` | `Omar` | `22` | Right Subtree (Non-Leaf Pointer: `700 Mona` - `905 Nader`) | **Target of Index Seek** (`WHERE id = 804` in Slide 4) |
| `900` | `Sara` | `23` | Right Subtree (Non-Leaf Pointer: `700 Mona` - `905 Nader`) | Data Page Record |
| `905` | `Nader` | `22` | Right Subtree (Non-Leaf Pointer: `700 Mona` - `905 Nader`) | Data Page Record |

---

## 4. Architectural Step-by-Step Walkthrough

### Step 1: Initial Heap Phase (Unordered)
```sql
CREATE TABLE dbo.student_heap (id INT, name VARCHAR(20), age INT);
INSERT INTO dbo.student_heap VALUES (1, 'Ahmad', 22), (4, 'Khalid', 21), (2, 'Ali', 23), (3, 'Eman', 21);
SELECT * FROM dbo.student_heap;
```
**Result:** Rows are returned in insertion order: `[1, 4, 2, 3]`. There is no natural or guaranteed order.

### Step 2: Primary Key Creation & Physical Reordering
```sql
ALTER TABLE dbo.student ADD CONSTRAINT PK_student_id PRIMARY KEY (id);
```
**Result:** SQL Server creates a Unique Clustered Index on `id`. The physical data pages are rebuilt into a sorted B+Tree leaf chain: `[1, 2, 3, 4]`. Row positions are permanently managed by the clustering key.

### Step 3: Clustered Index Seek (`WHERE id = 804`)
```sql
SELECT * FROM dbo.student WHERE id = 804;
```
**Execution Engine Traversal:**
1. **Root Page Inspection**: Evaluates key ranges. Identifies that `804 >= 700`, routing the traversal pointer to the **Right Subtree** intermediate page.
2. **Intermediate Page Inspection**: Evaluates child page boundaries (`700`, `702`, `800`, `900`). Identifies that `804` belongs to **Leaf Page 800** (`800 <= id < 900`).
3. **Leaf Page Slot Array Scan**: Performs a binary search across the 2-byte slot array at the end of Page 800 to locate record offset for `id = 804`.
4. **I/O Cost**: Exactly **2-3 logical reads**, regardless of whether the table contains 13 rows or 13,000,000 rows.

### Step 4: The Clustered Index Limitation (`WHERE name = 'Omar'`)
```sql
SELECT * FROM dbo.student WHERE name = 'Omar';
```
**Execution Engine Dilemma:**
- The B+Tree is sorted physically on `id` (integer order).
- It has **zero ordering** on `name` (alphabetical).
- The engine CANNOT navigate the tree to find `'Omar'`. It must perform a **Clustered Index Scan**, visiting every single leaf data page in the doubly linked list from first to last.
- **Conclusion**: A table can only have **ONE** clustered index. To accelerate searches on secondary attributes (like `name`), SQL Server requires **Non-Clustered Indexes** (`CH01_VID09`).

---

## 5. Artifact & Repository Alignment

* **Source T-SQL Script**: [`src/01_storage_and_schema/ch01_vid08_clustered_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid08_clustered_index.sql)
* **Subsequent Module Script**: [`src/01_storage_and_schema/ch01_vid09_nonclustered_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid09_nonclustered_index.sql)
* **Syllabus Mapping**: [`docs/course-syllabus-mapping.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/course-syllabus-mapping.md)
* **Obsidian Second Brain Note**: [`docs/curriculum/01 - COURSE/CH01 - Database Creation and Management/CH01_VID08 - Clustered Index.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/curriculum/01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/CH01_VID08%20-%20Clustered%20Index.md)
