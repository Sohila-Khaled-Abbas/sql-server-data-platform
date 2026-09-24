---
type: video
course: SQL Server Data Platform
chapter: CH01
lesson_id: CH01_VID07
title: Creating a Custom Data Type
status: mastered
difficulty: medium
confidence: 100
practice: true
implemented: true
explained: true
estimated_minutes: 15
source: https://maharatech.gov.eg/mod/hvp/view.php?id=17526
code_reference: src/01_storage_and_schema/ch01_vid07_custom_data_types.sql
topics:
  - storage-physical-architecture
  - creating-a-custom-data-type
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

# CH01_VID07 — Creating a Custom Data Type

> [!abstract] Learning Goal
> Master the concepts, mechanics, and operational trade-offs of **Creating a Custom Data Type (UDDT)** within the **Storage & Physical Architecture** domain, bridging relational database theory with practical data engineering implementations.

## 🎯 Core Idea
In `CH01_VID06`, an essential relational constraint limitation was identified: *standard ANSI table constraints cannot be bound directly to User-Defined Data Types*. Standalone database objects (**Rules** and **Defaults**), however, can be bound directly to a custom User-Defined Data Type (`sp_bindrule`, `sp_bindefault`). Any subsequent table column or procedural variable declared with that UDDT automatically inherits the validation invariant and baseline default value across the entire database.

## 🧠 What I Need to Understand
- **Engine Execution**: How SQL Server resolves UDDTs in `sys.types`, linking them to underlying system base types (`int`, `system_type_id = 56`) while storing binding metadata in `rule_object_id` and `default_object_id`.
- **Physical Impact**: A scalar UDDT incurs zero additional storage overhead beyond its base physical type (e.g., 4 bytes for `int`), executing inline during page write-ahead logging (WAL).
- **Logical Invariants**: Declarative rules bound to UDDTs enforce domain integrity on new `INSERT` / `UPDATE` operations across every table referencing the type, preventing invalid state transitions at the engine level.

## 🔧 SQL Syntax
```sql
-- Create User-Defined Data Type [int, values > 1000, default 5000]
sp_addtype complexdt, 'int';
GO

-- Create Standalone Rule & Default Objects
CREATE RULE myrule AS @x > 1000;
GO
CREATE DEFAULT mydef AS 5000;
GO

-- Bind Rule & Default Directly to Data Type
sp_bindrule myrule, complexdt;
GO
sp_bindefault mydef, complexdt;
GO

-- Create Table Utilizing Custom Data Type
CREATE TABLE dbo.mydata
(
    id INT,
    name VARCHAR(20),
    salary complexdt
);
GO
```

> [!example] Mentor Example
> *VERIFIED FROM LIVE MAHARATECH LECTURE & SQL SERVER 2022 TELEMETRY*  
> The following sample illustrates the authentic sequence demonstrated by Eng. Rami Mohamed Abonagi in `CH01_VID07`, verified live against `[ITI].[dbo].[mydata]`:

```sql
USE ITI;
GO

-- 1. Create custom UDDT
sp_addtype complexdt, 'int';
GO

-- 2. Create standalone rule and default
CREATE RULE myrule AS @x > 1000;
GO
CREATE DEFAULT mydef AS 5000;
GO

-- 3. Bind rule and default to UDDT (Inherited by all future columns)
sp_bindrule myrule, complexdt;
GO
sp_bindefault mydef, complexdt;
GO

-- 4. Create table using complexdt
CREATE TABLE dbo.mydata
(
    id INT,
    name VARCHAR(20),
    salary complexdt
);
GO

-- 5. Seed live authentic dataset (6 records edited in SSMS)
INSERT INTO dbo.mydata (id) VALUES (1); -- Salary auto-populates 5000 via mydef
INSERT INTO dbo.mydata (id) VALUES (2); -- Salary auto-populates 5000 via mydef
INSERT INTO dbo.mydata (id) VALUES (3); -- Salary auto-populates 5000 via mydef
INSERT INTO dbo.mydata (id) VALUES (4); -- Salary auto-populates 5000 via mydef
INSERT INTO dbo.mydata (id, name, salary) VALUES (5, NULL, 6000); -- Explicit value > 1000
INSERT INTO dbo.mydata (id, name, salary) VALUES (6, NULL, 4000); -- Explicit value > 1000
GO

-- 6. Verify rule enforcement on invalid salary (<= 1000)
BEGIN TRY
    INSERT INTO dbo.mydata (id, name, salary) VALUES (7, 'BadRecord', 500);
END TRY
BEGIN CATCH
    PRINT '>>> [EXPECTED] Rule violation (Msg 513): ' + ERROR_MESSAGE();
END CATCH;
GO
```

### 🔍 Line-by-Line Explanation
- `sp_addtype complexdt, 'int'`: Registers a custom scalar User-Defined Data Type named `complexdt` based on the 4-byte system integer.
- `CREATE RULE myrule AS @x > 1000`: Creates a standalone database-scoped validation rule ensuring salary values exceed 1000.
- `CREATE DEFAULT mydef AS 5000`: Creates a standalone database-scoped default object providing a fallback value of 5000.
- `sp_bindrule myrule, complexdt`: Attaches `myrule` directly to the `complexdt` type in `sys.types`, causing every column of this type to inherit the check.
- `sp_bindefault mydef, complexdt`: Attaches `mydef` directly to `complexdt`, auto-populating 5000 when the column is omitted on `INSERT`.
- `salary complexdt`: Declares the `salary` column in `dbo.mydata` using the newly defined domain type.
- `Msg 513 Enforcement`: Inserting `salary = 500` immediately aborts with error 513, proving that rule validation is inherited without needing an explicit table constraint.

## 🏗️ Data Engineering Perspective
- **Why does this matter to a Data Engineer?** Legacy enterprise databases (banking, ERP, healthcare) frequently leverage UDDTs with bound rules and defaults to enforce enterprise data dictionaries. Understanding how UDDTs resolve in the engine is essential when designing migration scripts, ETL mappings, or modernizing schemas.
- **Where does this appear in real systems?** Centralized schema dictionaries, legacy database modernizations (migrating from on-prem SQL Server to Azure SQL or Fabric), and enterprise ELT staging pipelines.
- **What operational problem does it solve?** Centralizes domain logic: altering a bound default or rule can update domain behavior across multiple tables without repeating constraint definitions.
- **What dependencies does it create?** Strict drop ordering: a UDDT cannot be dropped (`sp_droptype`) while referenced by table columns (`Msg 3729`), and rules/defaults cannot be dropped while bound (`Msg 3716`).

> [!warning] Legacy / Modern Architecture Comparison
> While `sp_addtype`, `sp_bindrule`, and `sp_bindefault` are fully functional and supported for backward compatibility in SQL Server 2022, Microsoft recommends ANSI-standard syntax for greenfield projects:
> ```sql
> -- Modern ANSI Equivalent:
> CREATE TYPE [dbo].[udt_Salary] FROM INT NOT NULL;
> -- Enforce rules and defaults via declarative table constraints:
> ALTER TABLE dbo.mydata ADD CONSTRAINT DF_mydata_salary DEFAULT 5000 FOR salary;
> ALTER TABLE dbo.mydata ADD CONSTRAINT CK_mydata_salary CHECK (salary > 1000);
> ```

## ✅ What I Should Be Able to Do
- [x] Explain the underlying architectural concept of **Creating a Custom Data Type** to a peer without referencing notes. ✅ 2026-09-24
- [x] Reproduce the basic T-SQL implementation in SQL Server Management Studio (SSMS) or Azure Data Studio. ✅ 2026-09-24
- [x] Modify the implementation to handle edge conditions, NULL inputs, and high-concurrency workloads. ✅ 2026-09-24
- [x] Explain when this feature is the appropriate architectural tool versus when an alternative pattern should be selected. ✅ 2026-09-24
- [x] Identify performance bottlenecks, wait statistics, and storage costs associated with this feature. ✅ 2026-09-24

## 🧪 Hands-On Lab
Write a T-SQL verification script in your local sandbox:
1. Connect to the local SQL Server 2022 instance: `[ITI]` database.
2. Execute `src/01_storage_and_schema/ch01_vid07_custom_data_types.sql` to deploy `complexdt`, `myrule`, `mydef`, and `dbo.mydata`.
3. Verify that the 6 live records exist in `dbo.mydata` with IDs 1-4 having salary 5000 and IDs 5-6 having 6000 and 4000.
4. Execute test inserts to verify that salary <= 1000 triggers error Msg 513.
5. Query `sys.types` and `sys.columns` to verify engine binding metadata.

## 🧩 Challenge
Enhance your implementation to support automated idempotent execution: if `complexdt` or `dbo.mydata` already exists, check `rule_object_id` and `default_object_id` before unbinding to prevent runtime error Msg 15239, then cleanly recreate the objects.

## 🧑🏫 Mentor Challenge
You are asked by a senior data architect to evaluate whether **Creating a Custom Data Type** can be introduced into an hourly ingestion pipeline that processes 5 million rows per batch.
- **Problem**: What concurrency, locking, and recovery risks must you mitigate before approving this in production?
> [!hint] 🧠 Mentor Hint
> Consider lock escalation from row to table level, transaction log growth, and whether set-based bulk operations or partition switching can replace iterative processing.
> [!check] ✅ Expected Evidence
> A documented trade-off evaluation matrix comparing throughput (rows/sec), lock duration, and transaction log generation in MB.

## ⚠️ Common Mistakes
- **Dropping Bound UDDT**: Attempting to call `sp_droptype` while tables still contain columns of that type, failing with `Msg 3729`.
- **Dropping Bound Rule/Default**: Calling `DROP RULE` or `DROP DEFAULT` before unbinding with `sp_unbindrule` / `sp_unbindefault`, failing with `Msg 3716`.
- **Unbinding Non-Existent Bindings**: Calling `sp_unbindrule` when no rule is bound, triggering `Msg 15239`.

## 🚦 Production Considerations
- **Maintainability**: Centralize all custom types in declarative migration scripts (`src/01_storage_and_schema/`).
- **Modern Standards**: Favor `CREATE TYPE ... FROM` and declarative `CHECK` / `DEFAULT` constraints for new cloud-native workloads.
- **Reliability & Recoverability**: Ensure full transaction log backup chains remain uninterrupted to satisfy RPO <= 15 minutes.

## 🔗 Related Concepts
- [[Database Architecture]]
- [[Constraints and Invariants]]
- [[Declarative Constraints]]
- [[CH01_VID06 - Constraints, Rules, and Default Values]]

## 💬 Interview Questions
1. **Conceptual**: How does SQL Server store and resolve User-Defined Data Types internally in `sys.types`?
2. **Practical / T-SQL**: What is the required unbinding and drop sequence when removing a UDDT that has bound rules and defaults?
3. **Data Engineering Scenario**: When migrating an on-premises database with bound rules and UDDTs to modern Azure SQL, what automated schema transformations should you apply?

## 📝 My Notes
> [!note] Observations
> Captured live telemetry from SQL Server 2022 instance: `[ITI].[dbo].[mydata]` has 6 rows. IDs 1-4 successfully auto-populated salary 5000 via bound default `mydef`. IDs 5-6 successfully accepted manual values 6000 and 4000. Rejection of salary 500 validated via Msg 513.

## ✅ Knowledge Check
1. What invariant or operational guarantee does **Creating a Custom Data Type** provide?
2. Under what specific conditions would this implementation degrade system performance?
3. How would you test this implementation in an automated CI/CD pipeline running in Docker?

## 🔖 Status
- [x] Watched ✅ 2026-09-24
- [x] Reproduced ✅ 2026-09-24
- [x] Modified ✅ 2026-09-24
- [x] Explained from memory ✅ 2026-09-24
- [x] Reviewed ✅ 2026-09-24
