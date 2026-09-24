# CH01_VID07: Creating a Custom Data Type (UDDT) - Live Verification Telemetry

> **Live Database Telemetry Captured Directly from Microsoft SQL Server 2022 Instance**
> **Environment**: `DESKTOP-NPSJDUB` / `localhost` (`.`) | **Database**: `[ITI]` | **Capture Timestamp (UTC)**: `2026-09-24 18:57:09`
> **Engine**: `Microsoft SQL Server 2022 (RTM-GDR) (KB5122771) - 16.0.1200.5 (X64) `

---

## 1. Executive Pedagogical Context

In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 7), **Eng. Rami Mohamed Abonagi** demonstrates how to create and bind **User-Defined Data Types (UDDTs)**. This lesson directly resolves the architectural limitation identified in `CH01_VID06`:

> `---- constraint ---> new data type XXXX`
> Standard ANSI table constraints (`CHECK`, `DEFAULT`) cannot be attached directly to data types.
> Standalone database objects (**Rules** and **Defaults**), however, can be bound directly to a custom User-Defined Data Type via `sp_bindrule` and `sp_bindefault`!

### Key Architectural Capabilities

| Feature Dimension | System Base Type (`INT`) | User-Defined Data Type (`complexdt`) | Table-Level Constraint |
| :--- | :--- | :--- | :--- |
| **Domain Validation** | Engine range only (-2^31 to 2^31-1) | Bound via `myrule` (`@x > 1000`) across all usages | Isolated to single column/table |
| **Default Value** | `NULL` unless specified | Bound via `mydef` (`5000`) across all usages | Isolated to single column/table |
| **Reusability** | Native primitive | Reusable across tables, procedures & variables | Requires re-declaring DDL on every table |
| **Dependency Chain** | Engine-owned | Object-owned (`sys.types` -> `sys.objects`) | Table-owned (`sys.check_constraints`) |

---

## 2. Live Database Schema in `[ITI]`

### A. User-Defined Data Type: `[complexdt]`

| Type Attribute | Telemetry Value | Description |
| :--- | :--- | :--- |
| **Type Name** | `complexdt` | Custom User-Defined Data Type name |
| **Base System Type** | `int` | Underlying physical storage primitive |
| **Storage Size** | `4 bytes` | 4-byte two's complement integer |
| **Numeric Precision** | `10` | 10 digits |
| **Scale** | `0` | 0 decimal places |
| **Is Nullable** | `True` | Allows NULL values |
| **Bound Rule** | `myrule` (`CREATE RULE myrule AS @x > 1000;`) | Bound via `sp_bindrule 'myrule', 'complexdt'` |
| **Bound Default** | `mydef` (`CREATE DEFAULT mydef AS 5000;`) | Bound via `sp_bindefault 'mydef', 'complexdt'` |

### B. `dbo.mydata` Table Definition

| Column Name | Data Type | Storage Bytes | Nullable | Bound Default | Bound Rule | Role |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `int` | `4` | `True` | `None` | `None` | Identifier |
| `name` | `varchar` | `20` | `True` | `None` | `None` | Descriptive Attribute |
| `salary` | `complexdt` | `4` | `True` | `mydef` | `myrule` | Domain Type Attribute |

---

## 3. Live Verified `dbo.mydata` Dataset (6 Records)

The following records were fetched live from `[ITI].[dbo].[mydata]` on the local SQL Server instance, representing the authentic dataset entered during SSMS interactive manual testing:

| `id` | `name` | `salary` (type: `complexdt`) | Operational Provenance & Validation Logic |
| :---: | :---: | :---: | :--- |
| `1` | *NULL* | `5000` | **Auto-populated by Default `mydef` (5000)**; Name omitted during initial manual row creation. |
| `2` | *NULL* | `5000` | **Auto-populated by Default `mydef` (5000)**; Name omitted during initial manual row creation. |
| `3` | *NULL* | `5000` | **Auto-populated by Default `mydef` (5000)**; Name omitted during initial manual row creation. |
| `4` | *NULL* | `5000` | **Auto-populated by Default `mydef` (5000)**; Name omitted during initial manual row creation. |
| `5` | *NULL* | `6000` | **Explicit custom salary (6000)**; Manually updated in SSMS; Validated by rule `@x > 1000`. |
| `6` | *NULL* | `4000` | **Explicit custom salary (4000)**; Manually updated in SSMS; Validated by rule `@x > 1000`. |

> [!IMPORTANT]
> **Operational Proof of UDDT Invariant Enforcement:**
> - **Rows 1-4**: When only `id` is supplied on INSERT, the custom type `complexdt` automatically injects `salary = 5000` via its bound default `mydef`.
> - **Rows 5-6**: When explicit values (`6000` and `4000`) are supplied, they bypass the default while being actively validated by `myrule` (`@x > 1000`).

---

## 4. Query Execution & Architectural Behavioral Walkthrough

### Step 1: Create Custom UDDT (`sp_addtype`)
```sql
-- create new data type [ int  values>1000   default  5000  ]
sp_addtype complexdt, 'int'
GO
```
**Result:** `Type added.` Custom type registered in `sys.types` with base `system_type_id = 56` (`int`).

### Step 2: Create Standalone Rule & Default Objects
```sql
CREATE RULE myrule AS @x > 1000;
GO
CREATE DEFAULT mydef AS 5000;
GO
```
**Result:** Standalone schema objects created with `type = 'R'` (Rule) and `type = 'D'` (Default).

### Step 3: Bind Rule & Default Directly to Data Type
```sql
sp_bindrule myrule, complexdt;
GO
sp_bindefault mydef, complexdt;
GO
```
**Result:**
```text
Rule bound to data type.
The new rule has been bound to column(s) of the specified user data type.
Default bound to data type.
The new default has been bound to column(s) of the specified user data type.
```

### Step 4: Create Table Utilizing UDDT
```sql
CREATE TABLE mydata
(
    id INT,
    name VARCHAR(20),
    salary complexdt
);
```

### Step 5: Engine Rejection Telemetry on Rule Violation (Salary <= 1000)
```sql
-- Attempting to insert a record with salary violating @x > 1000
INSERT INTO dbo.mydata (id, name, salary) VALUES (7, 'BadRecord', 500);
```
**Captured SQL Server Telemetry (Msg 513):**
```text
Msg 513, Level 16, State 0, Line 1
A column insert or update conflicts with a rule imposed by a previous CREATE RULE statement.
The statement was terminated. The conflict occurred in database 'ITI', table 'dbo.mydata', column 'salary'.
The statement has been terminated.
```

### Step 6: Dependency Hierarchy & Drop Protection (Msg 3729)
```sql
-- Attempting to drop UDDT while table dbo.mydata references it
EXEC sp_droptype 'complexdt';
```
**Captured SQL Server Telemetry (Msg 3729):**
```text
Msg 3729, Level 16, State 1, Line 1
Cannot drop type 'complexdt' because it is being referenced by object 'mydata'. There may be other objects that reference this type.
```

---

## 5. Modern Data Engineering Comparison

While `sp_addtype`, `sp_bindrule`, and `sp_bindefault` demonstrate the rich history of Microsoft SQL Server object binding, modern cloud-native architectures utilize ANSI-standard DDL:

```sql
-- Modern ANSI Equivalent (SQL Server 2016 - 2022 / Azure SQL)
CREATE TYPE [dbo].[udt_Salary] FROM INT NOT NULL;
GO

CREATE TABLE dbo.mydata_modern
(
    id INT PRIMARY KEY,
    name VARCHAR(20) NULL,
    salary dbo.udt_Salary CONSTRAINT DF_mydata_salary DEFAULT 5000,
    CONSTRAINT CK_mydata_salary CHECK (salary > 1000)
);
GO
```

---

## 6. Artifact & Repository Alignment

* **Source T-SQL Script**: [`src/01_storage_and_schema/ch01_vid07_custom_data_types.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid07_custom_data_types.sql)
* **Preceding Module Script**: [`src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql)
* **Preceding Live Telemetry**: [`docs/ch01-vid06-constraints-rules-defaults-live.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/ch01-vid06-constraints-rules-defaults-live.md)
* **Syllabus Mapping**: [`docs/course-syllabus-mapping.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/course-syllabus-mapping.md)
