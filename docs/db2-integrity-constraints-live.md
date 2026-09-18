# DB2: Integrity Constraints & Referential Actions (CH01_VID05)

## Overview & Course Context
This specification documents the live Microsoft SQL Server 2022 database **`DB2`** created for **MaharaTech Course 2305** (*"Implementing and Developing SQL Server Objects"* by Eng. Rami Mohamed Abonagi).

It demonstrates the full spectrum of **Relational Integrity Constraints** in Transact-SQL:
- **Entity Integrity**: Composite Primary Key (`c1`) and Unique Constraints (`c2`, `c3`).
- **Domain Integrity**: Range, Membership, and Enum Check Constraints (`c4`, `c5`, `c6`, `c7`), Default Values, and Column Length limits.
- **Referential Integrity**: Foreign Key (`c8`) with cascading actions (`ON UPDATE CASCADE`, `ON DELETE SET NULL`).
- **Storage Optimization**: Persisted vs. Non-Persisted Computed Columns (`netsal` vs. `age`).

---

## 1. Live Database Telemetry

| Parameter | Live Value |
| :--- | :--- |
| **SQL Server Instance** | `.` (Microsoft SQL Server 2022 Developer Edition - 64-bit) |
| **Database Name** | `DB2` |
| **Primary Data File** | `D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\DB2.mdf` (8 MB, autogrowth 64 MB) |
| **Write-Ahead Log File** | `D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\DB2_log.ldf` (8 MB, autogrowth 64 MB) |
| **Active Schema Objects** | `dbo.depts` (Parent), `dbo.emps` (Child) |
| **Solution Script** | [`src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql) |

---

## 2. Table Specifications & Constraint Catalog

### A. Parent Table: `dbo.depts`

```sql
CREATE TABLE depts
(
    did INT PRIMARY KEY,
    dname VARCHAR(10)
);
```

- **`did`**: `INT NOT NULL`, Primary Key (Clustered Index).
- **`dname`**: `VARCHAR(10) NULL`, Domain-constrained to max 10 characters (e.g. `'HR'`, `'IT'`, `'Sales'`).

---

### B. Child Table: `dbo.emps`

```sql
CREATE TABLE emps
(
    eid INT IDENTITY(1,1),
    ename VARCHAR(10),
    eadd VARCHAR(10) DEFAULT 'cairo',
    hiredate DATE DEFAULT GETDATE(),
    salary INT,
    overtime INT,
    netsal AS ISNULL(salary, 0) + ISNULL(overtime, 0) PERSISTED,
    bd DATE,
    age AS YEAR(GETDATE()) - YEAR(bd),
    gender VARCHAR(1),
    hour_rate INT NOT NULL,
    dnum INT,
    CONSTRAINT c1 PRIMARY KEY (eid, ename),
    CONSTRAINT c2 UNIQUE (salary),
    CONSTRAINT c3 UNIQUE (overtime),
    CONSTRAINT c4 CHECK (salary > 1000),
    CONSTRAINT c5 CHECK (overtime BETWEEN 100 AND 5600),
    CONSTRAINT c6 CHECK (eadd IN ('alex', 'mansoura', 'cairo')),
    CONSTRAINT c7 CHECK (gender = 'F' OR gender = 'M'),
    CONSTRAINT c8 FOREIGN KEY (dnum) REFERENCES depts(did)
        ON DELETE SET NULL ON UPDATE CASCADE
);
```

---

## 3. The 8 Relational Integrity Constraints

| Constraint Name | Target Column(s) | Category | Exact Definition & Operational Behavior |
| :--- | :--- | :--- | :--- |
| **`c1`** | `(eid, ename)` | **Composite Primary Key** | Guarantees entity uniqueness across the composite key pair. Generates the default unique clustered index. |
| **`c2`** | `salary` | **Unique Constraint** | Enforces that no two employees can share the exact same base salary value. |
| **`c3`** | `overtime` | **Unique Constraint** | Enforces that no two employees can have identical overtime amounts. |
| **`c4`** | `salary` | **Domain CHECK** | `([salary] > 1000)`. Minimum wage floor; prevents underpaid row insertion. |
| **`c5`** | `overtime` | **Domain CHECK** | `([overtime] >= 100 AND [overtime] <= 5600)`. Enforces legal overtime boundaries. |
| **`c6`** | `eadd` | **Domain CHECK** | `([eadd] IN ('alex', 'mansoura', 'cairo'))`. Allowed city domain membership. |
| **`c7`** | `gender` | **Domain CHECK** | `([gender] = 'F' OR [gender] = 'M')`. Binary gender code validation. |
| **`c8`** | `dnum` &rarr; `depts(did)` | **Foreign Key** | `ON UPDATE CASCADE`: Modifying `depts.did` automatically propagates to all child rows. <br>`ON DELETE SET NULL`: Deleting a department sets employee `dnum = NULL` instead of deleting the employee record or blocking the delete. |

---

## 4. Computed Columns Architecture: Persisted vs Non-Persisted

### 1. `netsal AS ISNULL(salary, 0) + ISNULL(overtime, 0) PERSISTED`
- **PERSISTED Mechanics**: The calculated integer value is physically stored on the 8 KB data page alongside standard columns.
- **DBRE Benefit**: Deterministic calculations can be indexed with a Nonclustered Index, enabling index seeks without runtime arithmetic recomputation.

### 2. `age AS YEAR(GETDATE()) - YEAR(bd)`
- **Non-Persisted Mechanics**: Calculated dynamically on-the-fly whenever a query executes.
- **DBRE Benefit**: Never becomes stale as time progresses; always reflects the current calendar year.

---

## 5. Live Data Verification (Directly from `DB2`)

### `dbo.depts`
| did | dname |
| :--- | :--- |
| `10` | `HR` |
| `20` | `IT` |
| `30` | `Sales` |

### `dbo.emps`
| eid | ename | eadd | hiredate | salary | overtime | netsal (Persisted) | bd | age (Computed) | gender | hour_rate | dnum |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | `Ahmed` | `cairo` | `2026-01-15` | `5000` | `500` | **`5500`** | `1995-04-12` | **`31`** | `M` | `50` | `10` |
| `2` | `Sara` | `alex` | `2026-02-01` | `7500` | `800` | **`8300`** | `1998-09-20` | **`28`** | `F` | `65` | `20` |

---

## 6. Testing Referential Cascading Actions

```sql
-- 1. Test ON UPDATE CASCADE (Department 10 -> 100)
UPDATE dbo.depts SET did = 100 WHERE did = 10;
-- Ahmed's dnum is automatically updated to 100!

-- 2. Test ON DELETE SET NULL
DELETE FROM dbo.depts WHERE did = 30;
-- Safe deletion; if child rows had dnum = 30, they are set to NULL.
```
