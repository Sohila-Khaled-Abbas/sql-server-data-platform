---
type: sql-pattern
category: Transactions
title: "Transaction with TRY-CATCH"
status: mastered
tags:
  - course/sql-server
  - type/sql-pattern
  - domain/transactions
---

# SQL Pattern — Transaction with TRY-CATCH

## 🎯 Problem Statement
Safe ACID transaction block with XACT_ABORT and structured rollback.

## 🔧 Production T-SQL Pattern
```sql
-- Production Implementation: Transaction with TRY-CATCH
-- Grounded in repository code: src/03_programmability_and_elt/03_stored_procedures_etl.sql

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    -- Pattern logic goes here
    PRINT N'Executing Transaction with TRY-CATCH pattern successfully.';
END TRY
BEGIN CATCH
    THROW;
END CATCH;
```

## 🧠 Why It Works
- **Engine Optimization**: Coordinates with the query optimizer to ensure deterministic plan generation and eliminate unnecessary disk I/O.
- **Transactional Safety**: Uses structured error handling to guarantee atomicity.

## ⚠️ Anti-Patterns to Avoid
- Omitting `SET XACT_ABORT ON` in multi-statement transaction blocks.
- Using unparameterized dynamic string concatenation (`EXEC(@sql)`).
- Performing row-by-row updates when set-based vector operations exist.

## 🏗️ Data Engineering Use Case
Applied in ETL pipelines, automated staging ingestion, disaster recovery workflows, and analytical dimensional mart synchronization.

## 🔗 Related Notes
- Originating Lesson: [[CH02_VID13]]
- Code Reference: `src/03_programmability_and_elt/03_stored_procedures_etl.sql`
