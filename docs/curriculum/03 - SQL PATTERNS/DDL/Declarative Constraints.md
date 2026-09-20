---
type: sql-pattern
category: DDL
title: "Declarative Constraints"
status: mastered
tags:
  - course/sql-server
  - type/sql-pattern
  - domain/ddl
---

# SQL Pattern — Declarative Constraints & Rules Lifecycle

## 🎯 Problem Statement
Enforce relational integrity, column domain rules, and default values using ANSI declarative constraints, while safely managing legacy standalone rules and defaults across multiple tables without incurring dependency errors (**Msg 3716**).

## 🔧 Production T-SQL Patterns

### Pattern 1: ANSI Declarative Constraints (Preferred)
```sql
-- Production Implementation: Declarative Constraints
-- Grounded in: src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql
USE [DB2];
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;

-- 1. Table creation with inline constraints
CREATE TABLE dbo.Employee (
    SSN INT CONSTRAINT PK_Employee PRIMARY KEY,
    EmpName VARCHAR(50) NOT NULL,
    Salary INT CONSTRAINT CK_Emp_Salary CHECK (Salary >= 1000),
    Gender CHAR(1) CONSTRAINT CK_Emp_Gender CHECK (Gender IN ('M', 'F')),
    DeptId INT
);

-- 2. Adding constraints out-of-line with validation control
-- WITH NOCHECK: Skips existing data validation; only enforces on future rows
ALTER TABLE dbo.Employee WITH NOCHECK 
ADD CONSTRAINT CK_Emp_Salary_Overtime CHECK (Salary > 2000);

-- WITH CHECK: Re-validates all existing rows to restore optimizer trust
ALTER TABLE dbo.Employee WITH CHECK 
CHECK CONSTRAINT CK_Emp_Salary_Overtime;
GO
```

### Pattern 2: Legacy Standalone Rules & Defaults (Multi-Table Binding & Lifecycle)
```sql
-- Production Implementation: Standalone Rule & Default Management
-- Grounded in: src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql
USE [ITI];
GO

-- 1. Create independent rule (Batch first statement requirement)
CREATE RULE myrule AS @x > 1000;
GO

-- 2. Bind across multiple distinct tables
EXEC sp_bindrule 'myrule', 'instructor.salary';
EXEC sp_bindrule 'myrule', 'emps.overtime';
GO

-- 3. Create independent default object
CREATE DEFAULT mydef AS 5000;
GO

-- 4. Bind default to column
EXEC sp_bindefault 'mydef', 'instructor.salary';
GO

-- 5. Complete Teardown & Unbinding Lifecycle (Avoiding Msg 3716)
-- Unbind rule from all bound targets before dropping
EXEC sp_unbindrule 'instructor.salary';
EXEC sp_unbindrule 'emps.overtime';
DROP RULE myrule;
GO

-- Unbind default from target column before dropping
EXEC sp_unbindefault 'instructor.salary';
DROP DEFAULT mydef;
GO
```

## 🧠 Why It Works
- **Storage Engine Gatekeeper**: Constraint checks occur immediately before the page is modified in the buffer pool.
- **Dependency Graph Defense**: SQL Server prevents dropping objects that active columns depend on. Calling `sp_unbindrule` and `sp_unbindefault` detaches the pointers in `sys.sql_expression_dependencies`.
- **Query Optimizer Trust**: Declarative constraints with `is_not_trusted = 0` allow the optimizer to eliminate table scans for logically impossible predicates.

## ⚠️ Anti-Patterns to Avoid
- **Attempting `DROP RULE` / `DROP DEFAULT` without unbinding**: Causes `Msg 3716` and fails the batch.
- **Relying on Rules for New Green-Field Tables**: `CREATE RULE` is deprecated in Microsoft SQL Server; always use `CONSTRAINT ... CHECK`.
- **Leaving Constraints in `WITH NOCHECK` Untrusted State**: Degrades query optimizer performance because untrusted constraints cannot be used for plan optimization.

## 🏗️ Data Engineering Use Case
- **Bulk Load Optimization**: Temporarily disable constraints (`ALTER TABLE ... NOCHECK CONSTRAINT ALL`) during bulk bcp/TVP loads, then re-enable with `WITH CHECK` to validate and re-trust.
- **Legacy Migration**: Safely refactoring legacy Sybase/SQL Server 2000 databases into modern ANSI schemas by unbinding standalone rules and replacing them with table-scoped `CHECK` constraints.

## 🔗 Related Notes
- Originating Lesson: [[CH01_VID06 - Constraints, Rules, and Default Values]]
- Previous Lesson: [[CH01_VID05 - Integrity constraints]]
- Concept Deep Dive: [[Constraints and Invariants]]
- Cheat Sheet: [[DDL Cheat Sheet]]
- Code Reference: `src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql`
