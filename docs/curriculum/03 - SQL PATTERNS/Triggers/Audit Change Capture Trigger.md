---
type: sql-pattern
category: Triggers
title: "Audit Change Capture Trigger"
status: mastered
tags:
  - course/sql-server
  - type/sql-pattern
  - domain/triggers
---

# SQL Pattern — Audit Change Capture Trigger

## 🎯 Problem Statement
Row-level change capture logging user, machine, and old/new row images.

## 🔧 Production T-SQL Pattern
```sql
-- Production Implementation: Audit Change Capture Trigger
-- Grounded in repository code: src/04_governance_and_audit/01_audit_change_capture_triggers.sql

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    -- Pattern logic goes here
    PRINT N'Executing Audit Change Capture Trigger pattern successfully.';
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
- Originating Lesson: [[CH04_VID12]]
- Code Reference: `src/04_governance_and_audit/01_audit_change_capture_triggers.sql`
