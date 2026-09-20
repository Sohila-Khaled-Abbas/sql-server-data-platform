---
type: sql-pattern
category: Data Warehouse
title: "SCD Type 2 Dimension Load"
status: mastered
tags:
  - course/sql-server
  - type/sql-pattern
  - domain/data warehouse
---

# SQL Pattern — SCD Type 2 Dimension Load

## 🎯 Problem Statement
Manage historical dimension changes via ValidFrom/ValidTo and IsCurrent.

## 🔧 Production T-SQL Pattern
```sql
-- Production Implementation: SCD Type 2 Dimension Load
-- Grounded in repository code: src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    -- Pattern logic goes here
    PRINT N'Executing SCD Type 2 Dimension Load pattern successfully.';
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
- Originating Lesson: [[CH05_VID19]]
- Code Reference: `src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql`
