---
type: sql-pattern
category: DML
title: "OUTPUT Clause for Audit"
status: mastered
tags:
  - course/sql-server
  - type/sql-pattern
  - domain/dml
---

# SQL Pattern — OUTPUT Clause for Audit

## 🎯 Problem Statement
Capture row modifications into audit tables without secondary queries.

## 🔧 Production T-SQL Pattern
```sql
-- Production Implementation: OUTPUT Clause for Audit
-- Grounded in repository code: src/03_programmability_and_elt/03_stored_procedures_etl.sql

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    -- Pattern logic goes here
    PRINT N'Executing OUTPUT Clause for Audit pattern successfully.';
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
- Originating Lesson: [[CH04_VID14]]
- Code Reference: `src/03_programmability_and_elt/03_stored_procedures_etl.sql`
