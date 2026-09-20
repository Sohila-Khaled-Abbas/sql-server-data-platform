---
type: concept
domain: Database
category: Data Integrity
status: mastered
difficulty: medium
tags:
  - course/sql-server
  - type/concept
  - domain/database
---

# Constraints and Invariants

## Definition
> [!quote] Formal Definition
> Declarative schema rules (PK, FK, CHECK, UNIQUE, DEFAULT) and legacy database objects (RULE, DEFAULT) that enforce relational invariants and domain integrity within the storage engine.

## 🧠 Mental Model
Think of **Constraints and Invariants** as a **Gatekeeper at the Storage Engine Boundary**. 
- **ANSI Declarative Constraints** (`CHECK`, `DEFAULT`, `FOREIGN KEY`) are compiled directly into the table's schema metadata and evaluated by the query processor with direct optimizer visibility.
- **Legacy Standalone Objects** (`CREATE RULE`, `CREATE DEFAULT`) are independent database objects that can be bound to multiple table columns or User-Defined Data Types (UDDTs) via system stored procedures (`sp_bindrule`, `sp_bindefault`). Before dropping them, they must be cleanly unbound (`sp_unbindrule`, `sp_unbindefault`) or the engine raises **Msg 3716**.

```
[ Incoming Data Modification (INSERT / UPDATE) ]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌──────────────────┐    ┌──────────────────┐
│ Legacy RULE      │    │ ANSI CHECK       │
│ Bound via sp_    │    │ Table metadata   │
│ bindrule         │    │ WITH CHECK/      │
│                  │    │ WITH NOCHECK     │
└────────┬─────────┘    └────────┬─────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
  Violation? ──► [ Error Msg 513 / Msg 547 ] ──► ROLLBACK
         │
         ▼
  Valid? ──────► [ Buffer Pool Page Allocation / Disk Commit ]
```

## 🏗️ Why It Exists
Data corruption is irreversible and expensive. Without engine-enforced invariants, bad data leaks into storage, breaking analytical dashboards, ETL pipelines, and downstream services. 

Constraints guarantee:
1. **Domain Integrity**: Ensuring column values stay within valid ranges (e.g., `Salary > 1000`, `Overtime > 1000`).
2. **Referential Integrity**: Guaranteeing child records always point to valid parent entities.
3. **Query Optimization**: The SQL Server Query Optimizer uses trusted constraints (`is_not_trusted = 0`) to eliminate entire table scans via **Constraint Exclusion**.

## ⚙️ How SQL Server Implements It

### Declarative vs. Legacy Standalone Objects
| Feature | Declarative Constraints (`CHECK` / `DEFAULT`) | Legacy Objects (`RULE` / `DEFAULT`) |
| :--- | :--- | :--- |
| **SQL Standard** | ANSI SQL compliant | Sybase/Transact-SQL legacy |
| **Scope** | Bound to a specific table column | Independent object reusable across tables & UDDTs |
| **Binding Mechanism** | `ALTER TABLE ... ADD CONSTRAINT` | `sp_bindrule`, `sp_bindefault` |
| **Multiple per Column**| Multiple `CHECK` constraints allowed | Only **one** rule per column at a time |
| **Removal** | `ALTER TABLE ... DROP CONSTRAINT` | `sp_unbindrule` / `sp_unbindefault` then `DROP` |
| **Optimizer Integration**| Full constraint exclusion & trust metrics | Limited optimizer visibility |

## 🔧 T-SQL Implementation

### 1. Legacy Standalone Rule: Multi-Table Binding & Unbinding
```sql
-- Grounded in src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql
USE [ITI];
GO

-- 1. Create independent rule object
CREATE RULE myrule AS @x > 1000;
GO

-- 2. Bind across multiple distinct tables
EXEC sp_bindrule 'myrule', 'instructor.salary';
EXEC sp_bindrule 'myrule', 'emps.overtime';
GO

-- 3. Engine enforces Msg 3716 if dropping while bound:
-- DROP RULE myrule; 
-- Msg 3716: Cannot drop rule 'myrule' because it is bound to one or more column.

-- 4. Safe unbinding lifecycle
EXEC sp_unbindrule 'instructor.salary';
EXEC sp_unbindrule 'emps.overtime';
GO

-- 5. Successfully drop the unlinked rule
DROP RULE myrule;
GO
```

### 2. Legacy Standalone Default: Binding & Unbinding
```sql
-- Create standalone default
CREATE DEFAULT mydef AS 5000;
GO

-- Bind to column
EXEC sp_bindefault 'mydef', 'instructor.salary';
GO

-- Unbind and drop
EXEC sp_unbindefault 'instructor.salary';
GO
DROP DEFAULT mydef;
GO
```

### 3. Modern ANSI Declarative Constraints (Preferred)
```sql
-- Table-scoped declarative check constraint
ALTER TABLE dbo.Instructor WITH CHECK 
ADD CONSTRAINT CK_Instructor_Salary CHECK (Salary > 1000);

-- Table-scoped declarative default constraint
ALTER TABLE dbo.Instructor 
ADD CONSTRAINT DF_Instructor_Salary DEFAULT (5000) FOR Salary;
GO
```

## ⚖️ When to Use It vs When NOT to Use It
| Technique | Recommended? | Technical Rationale |
| :--- | :---: | :--- |
| **ANSI Declarative Constraints** | ✅ Yes | Production standard. Fully recognized by optimizer for partition pruning and constraint exclusion. |
| **Legacy Rules (`CREATE RULE`)** | ⚠️ Deprecated | Maintained for backward compatibility. Cannot be defined inline; requires procedural binding via stored procedures. |
| **Application-Layer Only Checks** | ❌ No | Dangerous. Bypassed by direct bulk inserts, ETL scripts, and administrative fixes. |

## 📊 Data Engineering Relevance
- **Data Quality Ingestion Gate**: Eliminates corrupt records before they enter the raw OLTP layer.
- **Query Plan Simplification**: A trusted constraint allows the optimizer to return zero rows instantly for queries like `WHERE Salary < 500` without reading a single page.
- **Safe Schema Migrations**: When unbinding legacy objects during schema refactoring, scripts must handle dependency ordering to avoid `Msg 3716` execution aborts.

## 🔗 Related Concepts & Lessons
- Originating Lesson: [[CH01_VID06 - Constraints, Rules, and Default Values]]
- Related Lesson: [[CH01_VID05 - Integrity constraints]]
- Architecture Pillar: [[Database Architecture]]
- Pattern Reference: [[Declarative Constraints]]
- Cheat Sheet: [[DDL Cheat Sheet]]

## 💬 Interview Questions
1. What is the difference between a `CHECK` constraint and a `RULE` in SQL Server?
   *Answer*: A `CHECK` constraint is an ANSI-standard, table-bound declarative constraint with optimizer integration. A `RULE` is a legacy backward-compatible database object created independently and bound to columns via `sp_bindrule`. Only one rule can be bound to a column, whereas multiple CHECK constraints can coexist.
2. What error occurs if you execute `DROP RULE` on an active rule, and how do you resolve it?
   *Answer*: SQL Server raises **Msg 3716**, Level 16 (`The rule '...' cannot be dropped because it is bound to one or more column`). You must resolve it by calling `sp_unbindrule` for every bound column before executing `DROP RULE`.
3. How does SQL Server's query optimizer use trusted constraints during execution plan generation?
   *Answer*: If a constraint is trusted (`is_not_trusted = 0`), the optimizer can perform *Contradiction Detection* (Constraint Exclusion). If a query's `WHERE` predicate contradicts the constraint, the optimizer substitutes a constant scan operator and returns 0 rows without touching the table data pages.
