---
type: video
course: SQL Server Data Platform
chapter: CH01
lesson_id: CH01_VID10
title: Demo on Index
status: mastered
difficulty: medium
confidence: 100
practice: true
implemented: true
explained: true
estimated_minutes: 26
source: https://maharatech.gov.eg/mod/hvp/view.php?id=17529
code_reference: src/01_storage_and_schema/ch01_vid10_demo_on_index.sql
topics:
  - storage-physical-architecture
  - demo-on-index
  - clustered-index-limitations
  - non-clustered-index-creation
  - key-lookup
  - execution-plan-analysis
  - constraints-to-indexes
  - unique-index-duplicate-keys
  - sql-server-profiler
  - database-engine-tuning-advisor
skills:
  - T-SQL
  - Database Engineering
  - Query Tuning
tags:
  - course/sql-server
  - type/video
  - chapter/ch01
  - domain/database
  - status/mastered
---

# CH01_VID10 — Demo on Index

> [!abstract] Learning Goal
> Master practical index design, physical execution plan interpretation, constraint-to-index mapping rules, duplicate key handling, and workload optimization using **SQL Server Management Studio (SSMS)**, **SQL Server Profiler**, and the **Database Engine Tuning Advisor (DTA)**.

---

## 🎯 Core Idea
In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 10), **Eng. Rami Mohamed Abonagi** delivers a comprehensive practical lab demonstrating the physical behavior of indexes and diagnostic tuning tools in SQL Server:

1. **The Single Clustered Index Invariant**:
   - Attempting:
     ```sql
     create clustered index i2
     on student(st_fname);
     ```
   - **Engine Rejection**: **Msg 1902**: *"Cannot create more than one clustered index on table 'student'. Drop the existing clustered index 'PK_Student' before creating another."*
   - **Physical Reality**: The leaf level of a clustered index **is the data itself**. A disk file cannot have two conflicting physical sorting orders simultaneously.
2. **Auxiliary Non-Clustered Indexes (`i2` and `i3`)**:
   - Creating secondary indexes succeeds seamlessly:
     ```sql
     create nonclustered index i2 on student(st_fname);
     create nonclustered index i3 on student(st_address);
     ```
   - SQL Server constructs separate auxiliary B+Trees where leaf pages hold the index key and the clustering key (`St_Id`) acting as the 4-byte row locator.
3. **Execution Plan Dissection (Clustered Seek vs Table Scan)**:
   - `SELECT * FROM Student WHERE St_Id = 1` &rarr; **Clustered Index Seek** on `[Student].[PK_Student]` (Cost 100%, 0 scan count, 2 logical reads).
   - `SELECT * FROM mydata WHERE id = 1` &rarr; **Table Scan** on `[mydata]` (Cost 100%, 1 scan count, IAM allocation traversal).
4. **Constraint-to-Index Physical Laws**:
   - **Primary Key Constraint** &rarr; Automatically builds a **CLUSTERED** unique index by default.
   - **Unique Constraint** &rarr; Automatically builds a **NONCLUSTERED** unique index by default.
   - Demonstrated on `dbo.mytest` with `SSN` (PK), `salary` (UNIQUE), and `overtime` (UNIQUE).
5. **Unique Index Violation on Duplicate Data (Msg 1505)**:
   - Attempting `CREATE UNIQUE INDEX i7 ON student(st_age)` terminates with **Msg 1505** due to duplicate value `(21)`.
   - Fixed by removing `UNIQUE`: `CREATE INDEX i7 ON student(st_age)`.
6. **Workload Analysis & Database Engine Tuning Advisor (DTA)**:
   - Workload queries (`Instructor WHERE salary > 5000`, `Student WHERE dept_id = 10`) captured in `.trc` via SQL Server Profiler.
   - DTAEngine Storage Bound error resolution (`Define max. space for recommendations` / `dta.exe -B 50`).

---

## 🖼️ SSMS Visual Evidence & Diagnostic Tool Verification

### A. Execution Plan Comparisons

#### 1. Clustered Index Seek on `dbo.Student` (`WHERE St_Id = 1`)
![Clustered Index Seek on Student.PK_Student](../../../docs/assets/ch01_vid10/01_clustered_index_seek_student.png)

> [!tip] Execution Insight
> Because `St_Id` is the clustered primary key, SQL Server traverses directly down the B+Tree root and intermediate branches to the exact data page containing `St_Id = 1`. No row scans or residual predicates occur.

#### 2. Table Scan on `dbo.mydata` (`WHERE id = 1`)
![Table Scan on mydata heap](../../../docs/assets/ch01_vid10/02_table_scan_mydata_heap.png)

> [!warning] Heap Table Bottleneck
> `mydata` has no clustered index. Without a B+Tree, the storage engine must initiate an **Index Allocation Map (IAM)** scan and inspect every allocated data page in the heap to evaluate `id = 1`.

---

### B. Profiler & Database Engine Tuning Advisor (DTA)

#### SSMS Tools Menu: SQL Server Profiler & DTA
![SSMS Tools Menu: Profiler & DTA](../../../docs/assets/ch01_vid10/03_ssms_tools_profiler_dta_menu.png)

#### SQL Server Profiler: Real-Time Workload Capture (`ITI (localhost)`)
![SQL Server Profiler Trace Window](../../../docs/assets/ch01_vid10/04_sql_server_profiler_trace_window.png)

> **Trace File Artifact**:
> - Host Location: `D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\VID10.trc`
> - Project Location: [`src/01_storage_and_schema/traces/VID10.trc`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/traces/VID10.trc)
> - Read via T-SQL: `SELECT * FROM sys.fn_trace_gettable('VID10.trc', DEFAULT);`

#### Database Engine Tuning Advisor (DTA) Configuration
![DTA Workload Configuration](../../../docs/assets/ch01_vid10/05_dta_workload_configuration.png)

#### DTAEngine Storage Bound Error Popup
![DTAEngine Storage Space Exceeded Error](../../../docs/assets/ch01_vid10/06_dta_storage_space_error_popup.png)

```text
The minimum storage space required for the selected physical design structures exceeds the default storage space selected by Database Engine Tuning Advisor. Either keep fewer physical design structures, or increase the default storage space to be larger than at least 4MB. Use one of the following methods to increase storage space:
(1) If you are using the graphical user interface, enter the required value for Define max. space for recommendations (MB) in the Advanced Options of the Tuning Options tabbed page;
(2) If you are using dta.exe, specify the maximum space value for the -B argument;
(3) If you are using an XML input file, specify the maximum space value for the <StorageBoundInMB> element under <TuningOptions>
```

---

## 🧠 What I Need to Understand
- **Engine Error Msg 1902**: Why SQL Server restricts tables to exactly one clustered index, and the operational procedure required if a DBA wants to change the clustering key.
- **Engine Error Msg 1505**: Why a unique index cannot be created on a column containing duplicate values, requiring either data deduplication or creation of a standard non-unique index.
- **Constraint to Index Mapping**: Why a `PRIMARY KEY` automatically creates a `CLUSTERED` index (unless overridden with `NONCLUSTERED`), whereas a `UNIQUE` constraint creates a `NONCLUSTERED` index.
- **DTAEngine Storage Bounds**: Why DTA requires allocating recommendation storage buffer space (`-B` or `Define max. space for recommendations (MB)` >= 50 MB) when analyzing entire multi-table databases.

---

## 🔧 Complete T-SQL Lecture Syntax

```sql
USE ITI;
GO

-- 1. Attempting Second Clustered Index (Rejection Msg 1902)
-- Cannot create more than one clustered index on table 'student'. Drop the existing clustered index 'PK_Student' before creating another.
CREATE CLUSTERED INDEX i2
ON student(st_fname);
GO

-- 2. Creating Secondary Non-Clustered Indexes
CREATE NONCLUSTERED INDEX i2
ON student(st_fname);
GO

CREATE NONCLUSTERED INDEX i3
ON student(st_address);
GO

-- 3. Execution Plan Comparison: Clustered Index Seek vs Table Scan
SELECT * FROM Student
WHERE St_Id = 1;
GO

SELECT * FROM mydata
WHERE id = 1;
GO

-- 4. Constraint to Index Physical Architecture
-- Primary key constraint ----> clustered index
-- Unique constraint       ----> nonclustered index
CREATE TABLE mytest
(
    id INT IDENTITY,
    SSN INT PRIMARY KEY,
    name VARCHAR(20),
    salary INT UNIQUE,
    overtime INT UNIQUE,
    CONSTRAINT c100 CHECK(overtime > 100)
);
GO

-- 5. Unique Index Rejection on Duplicate Data (Msg 1505)
-- Msg 1505: The CREATE UNIQUE INDEX statement terminated because a duplicate key was found...
CREATE UNIQUE INDEX i7 -- unique constraint + nonclustered index
ON student(st_age);
GO

-- Fix: Create regular non-unique nonclustered index
CREATE INDEX i7 -- nonclustered index
ON student(st_age);
GO

-- 6. Workload Queries for Profiler & DTA
SELECT * FROM Instructor
WHERE salary > 5000;
GO

SELECT * FROM student
WHERE dept_id = 10;
GO

-- 7. Reading Profiler Trace File
SELECT TOP 10 EventClass, ApplicationName, CONVERT(NVARCHAR(MAX), TextData) AS SqlText, CPU, Reads
FROM sys.fn_trace_gettable(N'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\VID10.trc', DEFAULT)
WHERE TextData IS NOT NULL;
GO
```

---

## 🏗️ Data Engineering Perspective
- **Why does this matter to a Data Engineer?** Ingestion pipelines and staging tables frequently suffer from table scan bottlenecks when queries lack selective indexes. Understanding when to use clustered vs non-clustered indexes directly dictates whether a query executes in 2 milliseconds or 45 seconds.
- **Where does this appear in real systems?** Operational search endpoints, foreign key join paths (`Student.Dept_Id`), and automated workload tuning sessions using DTA.
- **What operational problem does it solve?** Enables precise performance diagnosis using SSMS execution plans, eliminates table scans, and provides automated physical design recommendations through DTA.
- **What dependencies does it create?** Requires monitoring storage footprints, managing index fragmentation, and configuring recommendation bounds (`-B 50`) for automated DTA tuning sessions.

---

## ✅ What I Should Be Able to Do
- [x] Explain why SQL Server throws `Msg 1902` when attempting to create a second clustered index. ✅ 2026-09-25
- [x] Create multiple secondary non-clustered indexes (`i2`, `i3`) on a single table. ✅ 2026-09-25
- [x] Differentiate between a **Clustered Index Seek** on a clustered table and a **Table Scan** on a heap table. ✅ 2026-09-25
- [x] Identify the indexes created by `PRIMARY KEY` (Clustered) vs `UNIQUE` (Non-Clustered) constraints. ✅ 2026-09-25
- [x] Diagnose and resolve `Msg 1505` duplicate key errors on `CREATE UNIQUE INDEX`. ✅ 2026-09-25
- [x] Capture a workload trace in SQL Server Profiler and parse it using `sys.fn_trace_gettable()`. ✅ 2026-09-25
- [x] Configure Database Engine Tuning Advisor (DTA) and resolve the default storage space error using Advanced Options / `-B` parameter. ✅ 2026-09-25

---

## 🧪 Hands-On Lab
Write a T-SQL verification script in your local sandbox:
1. Connect to local SQL Server 2022 instance: `[ITI]` database.
2. Execute [`src/01_storage_and_schema/ch01_vid10_demo_on_index.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid10_demo_on_index.sql).
3. Verify that `CREATE CLUSTERED INDEX i2 ON Student(st_fname)` triggers error `Msg 1902`.
4. Verify that `CREATE UNIQUE INDEX i7 ON Student(st_age)` triggers error `Msg 1505`, then resolve it with `CREATE INDEX i7`.
5. Verify execution plans for `Student WHERE St_Id = 1` (Seek) vs `mydata WHERE id = 1` (Scan).
6. Verify generated indexes on `dbo.mytest` via `sys.indexes`.
7. Inspect the trace events from [`src/01_storage_and_schema/traces/VID10.trc`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/traces/VID10.trc).
8. Read live telemetry documentation in [`docs/ch01-vid10-demo-on-index-live.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/ch01-vid10-demo-on-index-live.md).

---

## 🧩 Challenge
Write an automated script that scans all foreign keys in database `[ITI]` and flags which foreign keys are missing supporting non-clustered indexes (e.g. `Student(Dept_Id)`), automatically generating the corresponding `CREATE NONCLUSTERED INDEX` DDL statements.

---

## 🧑🏫 Mentor Challenge
You are running Database Engine Tuning Advisor across an operational database with 80 tables and 500 GB of data. The analysis job terminates abruptly with:
`The minimum storage space required for the selected physical design structures exceeds the default storage space selected by Database Engine Tuning Advisor.`
- **Problem**: How do you automate this tuning session via PowerShell/CLI without SSMS GUI interaction while ensuring DTA does not abort?
> [!hint] 🧠 Mentor Hint
> Use `dta.exe` with the `-B` parameter specifying maximum storage space (e.g. `dta.exe -S . -D ITI -if "VID10.trc" -B 200 -s "ProdTuning" -of "recommendations.sql"`).
> [!check] ✅ Expected Evidence
> Automated execution script passing `-B 200` to allocate sufficient recommendation storage space.

---

## ⚠️ Common Mistakes
- **Attempting Multiple Clustered Indexes**: Failing to realize that data pages can only have one physical order on disk (`Msg 1902`).
- **Creating Unique Indexes on Duplicate Columns**: Expecting `CREATE UNIQUE INDEX` to succeed on non-unique data (`Msg 1505`).
- **Ignoring Heap Table Scans**: Assuming small lookup tables perform well without realizing heap tables lack B+Tree index structures.
- **DTA Default Storage Overflow**: Running DTA without increasing recommendation storage bounds in Advanced Options when tuning multi-table schemas.

---

## 🚦 Production Considerations
- **Index Selectivity**: Create non-clustered indexes on columns with high cardinality (many distinct values).
- **Foreign Key Indexing**: SQL Server does not automatically index foreign keys; always add non-clustered indexes on FK columns to optimize joins and avoid table locks during parent deletes.
- **Trace Overhead**: SQL Server Profiler incurs synchronous overhead; in modern production environments, use **Extended Events (XEvents)** for workload captures.

---

## 🔗 Related Concepts
- [[Database Architecture]]
- [[Data Pages and Extents]]
- [[CH01_VID08 - Clustered Index]]
- [[CH01_VID09 - Non-Clustered Index]]
- [[SQL Server Profiler and Extended Events]]
- [[Database Engine Tuning Advisor]]

---

## 💬 Interview Questions
1. **Conceptual**: Why does SQL Server permit only one clustered index per table, but up to 999 non-clustered indexes?
2. **Practical / T-SQL**: What physical index is generated by a `PRIMARY KEY` constraint vs a `UNIQUE` constraint in SQL Server?
3. **Troubleshooting**: If `CREATE UNIQUE INDEX` fails with `Msg 1505`, what are the two possible remediation strategies?
4. **Tooling**: What causes the DTAEngine storage bound error in Database Engine Tuning Advisor, and how is it resolved?

---

## 📝 My Notes
> [!note] Observations
> Verified live against SQL Server 2022 instance `[ITI]`. Attempting `CREATE CLUSTERED INDEX i2 ON Student(st_fname)` was rejected with Msg 1902. `CREATE NONCLUSTERED INDEX i2` and `i3` succeeded. `SELECT * FROM Student WHERE St_Id=1` executed as a Clustered Index Seek, while `SELECT * FROM mydata WHERE id=1` executed as a Table Scan. `mytest` proved that PK maps to CLUSTERED and UNIQUE maps to NONCLUSTERED. `CREATE UNIQUE INDEX i7 ON Student(st_age)` failed with Msg 1505 on duplicate key (21) and was resolved by removing `UNIQUE`. Profiler trace `VID10.trc` was analyzed with `sys.fn_trace_gettable()`, and DTA storage bound resolution was verified.

---

## ✅ Knowledge Check
1. What invariant or operational guarantee does **Demo on Index** provide?
2. Under what specific conditions would this implementation degrade system performance?
3. How would you automate DTA tuning using command-line `dta.exe` with custom recommendation storage limits?

---

## 🔖 Status
- [x] Watched ✅ 2026-09-25
- [x] Reproduced ✅ 2026-09-25
- [x] Modified ✅ 2026-09-25
- [x] Explained from memory ✅ 2026-09-25
- [x] Reviewed ✅ 2026-09-25
