---
type: cheat-sheet
topic: "DDL"
tags:
  - course/sql-server
  - type/cheat-sheet
  - revision
---

# DDL — Engineering Cheat Sheet

## 🎯 Quick Syntax Reference

### 1. Table Creation with Named Declarative Constraints
```sql
CREATE TABLE dbo.Employee (
    SSN INT CONSTRAINT PK_Employee PRIMARY KEY,
    EmpName VARCHAR(50) NOT NULL,
    Salary INT CONSTRAINT CK_Emp_Salary CHECK (Salary >= 1000),
    Gender CHAR(1) CONSTRAINT CK_Emp_Gender CHECK (Gender IN ('M', 'F')),
    HireDate DATE CONSTRAINT DF_Emp_HireDate DEFAULT (CAST(GETDATE() AS DATE)),
    DeptId INT CONSTRAINT FK_Emp_Department FOREIGN KEY REFERENCES dbo.Department(DeptId)
        ON DELETE SET NULL ON UPDATE CASCADE
);
```

### 2. Modifying Declarative Constraints
```sql
-- Add constraint without checking existing rows (instant, untrusted)
ALTER TABLE dbo.Employee WITH NOCHECK 
ADD CONSTRAINT CK_Emp_Salary_Max CHECK (Salary <= 50000);

-- Enable/Disable existing constraint
ALTER TABLE dbo.Employee NOCHECK CONSTRAINT CK_Emp_Salary_Max;
ALTER TABLE dbo.Employee CHECK CONSTRAINT CK_Emp_Salary_Max;

-- Re-validate entire table to restore Query Optimizer trust
ALTER TABLE dbo.Employee WITH CHECK CHECK CONSTRAINT CK_Emp_Salary_Max;

-- Drop constraint
ALTER TABLE dbo.Employee DROP CONSTRAINT CK_Emp_Salary_Max;
```

### 3. Legacy Standalone Rules & Defaults (Transact-SQL)
```sql
-- Rules (CREATE RULE must be first statement in batch)
CREATE RULE myrule AS @x > 1000;
GO
-- Bind to column(s) across tables
EXEC sp_bindrule 'myrule', 'dbo.Instructor.salary';
EXEC sp_bindrule 'myrule', 'dbo.emps.overtime';
GO
-- Unbind and drop (resolves Msg 3716 dependency error)
EXEC sp_unbindrule 'dbo.Instructor.salary';
EXEC sp_unbindrule 'dbo.emps.overtime';
DROP RULE myrule;
GO

-- Standalone Defaults
CREATE DEFAULT mydef AS 5000;
GO
-- Bind default
EXEC sp_bindefault 'mydef', 'dbo.Instructor.salary';
GO
-- Unbind and drop
EXEC sp_unbindefault 'dbo.Instructor.salary';
DROP DEFAULT mydef;
GO
```

## ⚡ High-Frequency Patterns
- **Rule Unbinding Before Drop**: Never call `DROP RULE` or `DROP DEFAULT` without first unbinding from all associated columns; otherwise SQL Server aborts with `Msg 3716`.
- **Restoring Trust**: After ETL bulk operations using `NOCHECK`, always run `ALTER TABLE ... WITH CHECK CHECK CONSTRAINT ...` so `is_not_trusted` resets to `0`.
- **Batch Delimiters**: In scripts and migrations, `CREATE RULE` and `CREATE DEFAULT` must immediately follow a `GO` batch separator.

## 🔍 Diagnostic DMVs & Catalog Views
```sql
-- Check constraint trust and definition
SELECT name, definition, is_disabled, is_not_trusted 
FROM sys.check_constraints 
WHERE parent_object_id = OBJECT_ID('dbo.Instructor');

-- Default constraints
SELECT name, definition 
FROM sys.default_constraints 
WHERE parent_object_id = OBJECT_ID('dbo.Instructor');

-- Inspect bound rules and defaults on columns
SELECT 
    t.name AS TableName,
    c.name AS ColumnName,
    OBJECT_NAME(c.rule_object_id) AS BoundRule,
    OBJECT_NAME(c.default_object_id) AS BoundDefault
FROM sys.columns c
JOIN sys.tables t ON c.object_id = t.object_id
WHERE c.rule_object_id > 0 OR c.default_object_id > 0;
```

## ⚠️ Critical Pitfalls to Avoid
- **Msg 3716**: `The rule/default cannot be dropped because it is bound to one or more column.` -> Fix: Run `sp_unbindrule` / `sp_unbindefault` first.
- **Msg 513**: `A column insert or update conflicts with a rule imposed by a previous CREATE RULE statement.` -> Fix: Check the bound rule condition or supplied value.
- **Msg 547**: `The INSERT statement conflicted with the CHECK constraint.` -> Fix: Validate payload against table check predicates.

## 🔗 Deep-Dive Concepts & Lessons
- Lesson: [[CH01_VID06 - Constraints, Rules, and Default Values]]
- Lesson: [[CH01_VID05 - Integrity constraints]]
- Concept: [[Constraints and Invariants]]
- Pattern: [[Declarative Constraints]]
