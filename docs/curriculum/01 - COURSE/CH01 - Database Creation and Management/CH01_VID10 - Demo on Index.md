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
estimated_minutes: 20
source: https://maharatech.gov.eg/mod/hvp/view.php?id=17529
code_reference: src/01_storage_and_schema/ch01_vid10_demo_on_index.sql
topics:
  - storage-physical-architecture
  - demo-on-index
  - clustered-index-limitations
  - non-clustered-index-creation
  - key-lookup
  - execution-plan-analysis
skills:
  - T-SQL
  - Database Engineering
tags:
  - course/sql-server
  - type/video
  - chapter/ch01
  - domain/database
  - status/mastered
---

# CH01_VID10 — Demo on Index

> [!abstract] Learning Goal
> Master the practical implementation, execution plan interpretation, and engine constraints of **Clustered vs Non-Clustered Indexes** in SQL Server Management Studio (SSMS), bridging storage theory with observable query performance metrics.

## 🎯 Core Idea
In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 10), **Eng. Rami Mohamed Abonagi** conducts an interactive SSMS practical demonstration on table `dbo.Student`, demonstrating two foundational indexing behaviors:
1. **The Single Clustered Index Invariant**:
   - Attempting:
     ```sql
     CREATE CLUSTERED INDEX i2 ON student(st_fname);
     ```
   - The engine immediately aborts with **Msg 1902**: *"Cannot create more than one clustered index on table 'student'. Drop the existing clustered index 'PK_Student' before creating another."*
   - This physically verifies that because leaf pages of a clustered index **are** the data pages, disk storage can only maintain **one** physical sorting order.
2. **Auxiliary Non-Clustered Index Creation**:
   - Executing:
     ```sql
     CREATE NONCLUSTERED INDEX i2 ON student(st_fname);
     ```
   - The engine succeeds seamlessly! SQL Server builds an auxiliary B+Tree sorted alphabetically on `St_Fname`, storing the clustering key `St_Id` as the leaf row locator.
3. **Execution Plan Transformation**:
   - **Baseline (No Index on `St_Fname`)**: `SELECT * FROM Student WHERE St_Fname = 'Ahmed'` triggers a full **Clustered Index Scan**.
   - **With `i2` (Wide Query)**: Uses an **Index Seek** on `i2` to find `'Ahmed'`, followed by a **Key Lookup** into `PK_Student` on `St_Id = 1` to retrieve `St_Address`, `St_Age`, etc.
   - **Index-Only / Covering Query**: `SELECT St_Id, St_Fname FROM Student WHERE St_Fname = 'Ahmed'` incurs **ZERO Key Lookups**, satisfied 100% from the `i2` leaf level.
   - **Modern Covering Index (`INCLUDE`)**: `CREATE NONCLUSTERED INDEX i2_covering ON student(st_fname) INCLUDE (St_Address, St_Age)` eliminates Key Lookups for wide queries without widening the intermediate B+Tree branches.

---

## 🧠 What I Need to Understand
- **Engine Error Msg 1902**: Why SQL Server restricts tables to exactly one clustered index, and the operational procedure required if a DBA wants to change the clustering key.
- **Key Lookup Cost Dynamics**: Why the query optimizer calculates cost based on table cardinality; if a non-clustered index matches a large percentage of rows, random Key Lookup I/O exceeds sequential table scan I/O, causing the optimizer to abandon the index.
- **Index Lifecycle Management**: How to inspect index metadata using `sys.indexes` and monitor physical fragmentation via `sys.dm_db_index_physical_stats`.

---

## 🔧 SQL Syntax
```sql
-- 1. Demonstrating Single Clustered Index Constraint (Rejection Msg 1902)
CREATE CLUSTERED INDEX i2 
ON dbo.Student(st_fname);
GO

-- 2. Creating Secondary Non-Clustered Index
CREATE NONCLUSTERED INDEX i2 
ON dbo.Student(st_fname);
GO

-- 3. Query with Index Seek + Key Lookup
SELECT St_Id, St_Fname, St_Lname, St_Address, St_Age, Dept_Id 
FROM dbo.Student 
WHERE St_Fname = N'Ahmed';
GO

-- 4. Index-Only Query (Zero Key Lookup Overhead)
SELECT St_Id, St_Fname 
FROM dbo.Student 
WHERE St_Fname = N'Ahmed';
GO

-- 5. Modern Covering Index with INCLUDE Clause
CREATE NONCLUSTERED INDEX i2_covering 
ON dbo.Student(st_fname) 
INCLUDE (St_Address, St_Age);
GO
```

> [!example] Mentor Example
> *VERIFIED FROM LIVE MAHARATECH LECTURE & SQL SERVER 2022 TELEMETRY*  
> The following sample illustrates the authentic sequence demonstrated by Eng. Rami Mohamed Abonagi in `CH01_VID10`, verified live against `[ITI].[dbo].[Student]`:

```sql
USE ITI;
GO

-- 1. Attempt invalid second clustered index
BEGIN TRY
    CREATE CLUSTERED INDEX i2 ON dbo.Student(st_fname);
END TRY
BEGIN CATCH
    PRINT '>>> [EXPECTED REJECTION] Msg ' + CAST(ERROR_NUMBER() AS VARCHAR) + ': ' + ERROR_MESSAGE();
END CATCH;
GO

-- 2. Create non-clustered index i2
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'i2' AND object_id = OBJECT_ID(N'dbo.Student'))
    DROP INDEX i2 ON dbo.Student;
GO

CREATE NONCLUSTERED INDEX i2 ON dbo.Student(st_fname);
GO

-- 3. Compare execution IO: Seek + Key Lookup vs Index-Only
SET STATISTICS IO ON;

-- A. Seek + Key Lookup
SELECT St_Id, St_Fname, St_Lname, St_Address, St_Age
FROM dbo.Student 
WHERE St_Fname = N'Ahmed';

-- B. Index-Only (Zero Key Lookup)
SELECT St_Id, St_Fname 
FROM dbo.Student 
WHERE St_Fname = N'Ahmed';

SET STATISTICS IO OFF;
GO

-- 4. Create covering index with INCLUDE
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'i2_covering' AND object_id = OBJECT_ID(N'dbo.Student'))
    DROP INDEX i2_covering ON dbo.Student;
GO

CREATE NONCLUSTERED INDEX i2_covering 
ON dbo.Student(st_fname) 
INCLUDE (St_Address, St_Age);
GO

-- 5. DMV Introspection
SELECT 
    i.name AS IndexName,
    i.type_desc AS IndexType,
    ps.index_level AS BTreeLevel,
    ps.page_count AS PageCount,
    ps.record_count AS RecordCount
FROM sys.dm_db_index_physical_stats(DB_ID(N'ITI'), OBJECT_ID(N'dbo.Student'), NULL, NULL, 'DETAILED') ps
JOIN sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id
ORDER BY i.index_id, ps.index_level DESC;
GO
```

---

## 🏗️ Data Engineering Perspective
- **Why does this matter to a Data Engineer?** Unindexed search attributes cause query plans to degrade into multi-gigabyte table scans. However, creating indexes blindly without analyzing query selectivity or Key Lookup overhead creates write amplification during ETL ingestion.
- **Where does this appear in real systems?** Operational search endpoints (filtering by customer name or product code), staging lookups, and reporting data marts.
- **What operational problem does it solve?** Provides sub-millisecond point seeks for high-cardinality lookups while enabling covering index strategies to avoid random disk I/O.
- **What dependencies does it create?** Requires regular monitoring of index fragmentation, index usage statistics (`sys.dm_db_index_usage_stats`), and maintenance during bulk ETL loading.

---

## ✅ What I Should Be Able to Do
- [x] Explain why SQL Server throws `Msg 1902` when attempting to create a second clustered index. ✅ 2026-09-25
- [x] Execute `CREATE NONCLUSTERED INDEX` in SSMS and inspect the resulting index in Object Explorer. ✅ 2026-09-25
- [x] Differentiate between an **Index Seek with Key Lookup** and an **Index-Only Query**. ✅ 2026-09-25
- [x] Design and apply a covering index with `INCLUDE` to eliminate Key Lookups. ✅ 2026-09-25
- [x] Query system catalog views (`sys.indexes`, `sys.dm_db_index_physical_stats`) to inspect index internals. ✅ 2026-09-25

---

## 🧪 Hands-On Lab
Write a T-SQL verification script in your local sandbox:
1. Connect to the local SQL Server 2022 instance: `[ITI]` database.
2. Execute `src/01_storage_and_schema/ch01_vid10_demo_on_index.sql`.
3. Verify that `CREATE CLUSTERED INDEX i2 ON Student(st_fname)` triggers error `Msg 1902`.
4. Verify that `CREATE NONCLUSTERED INDEX i2 ON Student(st_fname)` succeeds.
5. Review the execution plans and logical reads using `SET STATISTICS IO ON`.
6. Run `scripts/fetch_ch01_vid10_docs.py` to extract live telemetry into `docs/ch01-vid10-demo-on-index-live.md`.

---

## 🧩 Challenge
Write an automated script that checks if a table has an existing clustered index before running DDL, gracefully dropping and rebuilding the clustered index with `DROP_EXISTING = ON` if a clustering key migration is requested.

---

## 🧑🏫 Mentor Challenge
You are asked by a senior data architect to evaluate introducing non-clustered indexes on 15 different columns of an operational table that receives 20,000 `INSERT`/`UPDATE` operations per second.
- **Problem**: What write amplification and buffer pool penalty will this introduce?
> [!hint] 🧠 Mentor Hint
> Every DML modification must synchronously update all 15 index B+Trees and generate corresponding transaction log records, causing severe lock contention and log flush wait stats (`WRITELOG`).
> [!check] ✅ Expected Evidence
> An index consolidation proposal reducing the 15 single-column indexes down to 2-3 composite or covering indexes based on actual DMV query usage.

---

## ⚠️ Common Mistakes
- **Attempting Multiple Clustered Indexes**: Failing to realize that the clustered index dictates physical row arrangement on disk (`Msg 1902`).
- **Ignoring Key Lookups in Production**: Assuming that adding a non-clustered index solves all performance problems, failing to notice that random I/O from Key Lookups is exhausting storage IOPS.
- **Over-Indexing Every Column**: Creating indexes on columns with low cardinality (e.g., gender, status flags) where the optimizer will choose a table scan anyway.

---

## 🚦 Production Considerations
- **Maintainability**: Maintain centralized DDL scripts in `src/01_storage_and_schema/` with declarative schema migrations.
- **Monitoring**: Prune unused indexes regularly by querying `sys.dm_db_index_usage_stats` (`user_seeks = 0`, `user_scans = 0`).
- **Bulk Loading**: Disable non-clustered indexes prior to large batch ETL jobs, rebuilding them in a single operation post-load.

---

## 🔗 Related Concepts
- [[Database Architecture]]
- [[Data Pages and Extents]]
- [[CH01_VID08 - Clustered Index]]
- [[CH01_VID09 - Non-Clustered Index]]
- [[Covering Index and INCLUDE]]

---

## 💬 Interview Questions
1. **Conceptual**: Why does SQL Server permit only one clustered index per table, but up to 999 non-clustered indexes?
2. **Practical / T-SQL**: What is the purpose of the `INCLUDE` clause in a non-clustered index, and how does it differ from adding columns to the index key?
3. **Data Engineering Scenario**: How can you determine if an existing non-clustered index is actually being utilized by production queries or merely adding write overhead?

---

## 📝 My Notes
> [!note] Observations
> Verified live against SQL Server 2022 instance `[ITI]`. Attempting `CREATE CLUSTERED INDEX i2 ON Student(st_fname)` was rejected with Msg 1902. `CREATE NONCLUSTERED INDEX i2 ON Student(st_fname)` succeeded. Querying `St_Fname` performed an Index Seek on `i2` followed by Key Lookup on `PK_Student`. Creating `i2_covering` with `INCLUDE (St_Address, St_Age)` completely eliminated the Key Lookup.

---

## ✅ Knowledge Check
1. What invariant or operational guarantee does **Demo on Index** provide?
2. Under what specific conditions would this implementation degrade system performance?
3. How would you test this implementation in an automated CI/CD pipeline running in Docker?

---

## 🔖 Status
- [x] Watched ✅ 2026-09-25
- [x] Reproduced ✅ 2026-09-25
- [x] Modified ✅ 2026-09-25
- [x] Explained from memory ✅ 2026-09-25
- [x] Reviewed ✅ 2026-09-25
