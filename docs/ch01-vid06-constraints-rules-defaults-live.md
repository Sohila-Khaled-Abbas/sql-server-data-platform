# CH01_VID06: Constraints, Rules, and Default Values - Live Verification Telemetry

> **Live Database Telemetry Captured Directly from Microsoft SQL Server 2022 Instance**
> **Environment**: `DESKTOP-NPSJDUB` / `localhost` (`.`) | **Database**: `[ITI]` | **Capture Timestamp (UTC)**: `2026-09-19 16:34:49`
> **Engine**: `Microsoft SQL Server 2022 (RTM-GDR) (KB5122771) - 16.0.1200.5 (X64) `

---

## 1. Executive Pedagogical Context

In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 6), **Eng. Rami Mohamed Abonagi** builds directly upon the relational integrity constraints taught in `CH01_VID05`. While constraints (`CHECK`, `DEFAULT`, `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`) are ANSI-standard, SQL Server provides legacy standalone database-level objects (**Rules** and **Defaults**) that offer unique architectural capabilities.

### Key Comparison: Constraints vs. Rules

| Dimension | Standard `CHECK` Constraint | Legacy `RULE` Object (`CREATE RULE`) |
| :--- | :--- | :--- |
| **Existing Data Validation** | Validates **all** existing rows by default (statements fail if any row violates, unless `WITH NOCHECK` is specified) | Ignores existing invalid rows upon binding; enforces validation **only on new `INSERT` / `UPDATE`** operations |
| **Cross-Table Sharing** | Bound strictly to a single table; cannot be shared across multiple tables | Standalone global object; can be bound to multiple tables via `sp_bindrule` |
| **User-Defined Data Types (UDDT)** | Cannot be attached to a UDDT | Can be bound directly to custom data types via `sp_bindrule` |
| **ANSI Standard Compliance** | ANSI SQL Standard (Recommended for modern greenfield design) | Proprietary legacy T-SQL (Deprecated, preserved for enterprise backward compatibility) |

---

## 2. Live Database Schema in `[ITI]`

### A. `dbo.Department` Table Definition

| Column Name | Data Type | Nullable | Role |
| :--- | :--- | :--- | :--- |
| `Dept_Id` | `int` | `NO` | Primary Key |
| `Dept_Name` | `varchar(50)` | `NO` | Attribute |
| `Dept_Desc` | `varchar(100)` | `YES` | Attribute |
| `Dept_Location` | `varchar(50)` | `YES` | Attribute |
| `Manager_hiredate` | `date` | `YES` | Attribute |

### B. `dbo.Instructor` Table Definition (SSMS Matching)

| Column Name | Data Type | Precision / Scale | Nullable | Default / Bound Object |
| :--- | :--- | :--- | :--- | :--- |
| `Ins_Id` | `int` | `(10,0)` | `NO` | `None` |
| `Ins_Name` | `nvarchar` | `(50)` | `YES` | `None` |
| `Ins_Degree` | `nvarchar` | `(50)` | `YES` | `None` |
| `Salary` | `money` | `(19,4)` | `YES` | `None` |
| `gender` | `varchar` | `(1)` | `YES` | `None` |
| `Dept_Id` | `int` | `(10,0)` | `YES` | `None` |

---

## 3. Live Verified Instructor Dataset (16 Records)

The following records were fetched live from `[ITI].[dbo].[Instructor]` on the local SQL Server instance, matching the SSMS data grid shown in the course video:

| Ins_Id | Ins_Name | Ins_Degree | Salary | gender | Dept_Id | Notes / Anomaly Observation |
| :---: | :--- | :--- | :---: | :---: | :---: | :--- |
| `1` | `Ahmed` | Master | `5000.0000` | M | 10 | Complies with `@x > 1000` |
| `2` | `Hany` | Master | `4320.0000` | M | 10 | Complies with `@x > 1000` |
| `3` | `Reham` | Master | `2640.0000` | F | 10 | Complies with `@x > 1000` |
| `4` | `Yasmin` | PHD | `264.0000` | F | 10 | **Violates `@x > 1000`** (Salary=264.0000) |
| `5` | `Amany` | PHD | `660.0000` | F | 10 | **Violates `@x > 1000`** (Salary=660.0000) |
| `6` | `Eman` | Master | `792.0000` | F | 10 | **Violates `@x > 1000`** (Salary=792.0000) |
| `7` | `Saly` | *NULL* | `12960.0000` | F | 10 | Complies with `@x > 1000` |
| `8` | `Amr` | *NULL* | `*NULL*` | M | 20 | Unset Salary (*NULL*) |
| `9` | `Hussien` | *NULL* | `*NULL*` | M | 20 | Unset Salary (*NULL*) |
| `10` | `Khalid` | *NULL* | `11520.0000` | M | 20 | Complies with `@x > 1000` |
| `11` | `Salah` | *NULL* | `12960.0000` | M | 20 | Complies with `@x > 1000` |
| `12` | `Adel` | *NULL* | `8640.0000` | M | 30 | Complies with `@x > 1000` |
| `13` | `Fakry` | *NULL* | `5760.0000` | M | 30 | Complies with `@x > 1000` |
| `14` | `Amena` | *NULL* | `7200.0000` | F | 30 | Complies with `@x > 1000` |
| `15` | `Ghada` | *NULL* | `4320.0000` | F | 30 | Complies with `@x > 1000` |
| `666` | `ahmed` | *NULL* | `*NULL*` | *NULL* | *NULL* | Unset Salary (*NULL*); Sparse audit record (*All attributes NULL*) |

> [!IMPORTANT]
> Notice that rows 4 (`Yasmin`, Salary=264.0000), 5 (`Amany`, Salary=660.0000), and 6 (`Eman`, Salary=792.0000) have salaries below 1000.
> This is the exact dataset used in the lecture to illustrate why standard `ALTER TABLE Instructor ADD CONSTRAINT CHECK (Salary > 1000)` fails, and how `WITH NOCHECK` or `CREATE RULE` handles preexisting historical records.

---

## 4. Query Execution & Architectural Behavioral Walkthrough

### Scenario 1: Standard CHECK Constraint Rejection
```sql
-- Fails because existing rows (Yasmin, Amany, Eman) violate the predicate
ALTER TABLE dbo.Instructor ADD CONSTRAINT chk_Salary CHECK (Salary > 1000);
```
**SQL Server Output:**
```text
Msg 547, Level 16, State 0, Line 1
The ALTER TABLE statement conflicted with the CHECK constraint "chk_Salary".
The conflict occurred in database "ITI", table "dbo.Instructor", column 'Salary'.
```

### Scenario 2: Applying Constraint with `WITH NOCHECK`
```sql
-- Bypasses validation on preexisting rows, but enforces on subsequent INSERT/UPDATE
ALTER TABLE dbo.Instructor WITH NOCHECK ADD CONSTRAINT chk_Salary CHECK (Salary > 1000);
```
**Result:** `Command(s) completed successfully.`

### Scenario 3: Global Rule Creation & Column Binding
```sql
----constraint ---> new data XXXX
----constraint ---> shared between tables XXXX
----constraint ---> new data type XXXX

---> Rule [Global check constraint]
CREATE RULE myrule AS @x > 1000;
GO

EXEC sp_bindrule myrule, 'instructor.salary';
GO
```
**Behavioral Telemetry:**
1. `sp_bindrule` binds successfully without error.
2. Preexisting rows with Salary < 1000 remain untouched.
3. Attempting to insert `INSERT INTO Instructor (Ins_Id, Ins_Name, Salary) VALUES (999, 'Test', 450);` triggers:
   ```text
   Msg 513, Level 16, State 0, Line 1
   A column insert or update conflicts with a rule imposed by a previous CREATE RULE statement.
   The statement was terminated. The conflict occurred in database 'ITI', table 'dbo.Instructor', column 'Salary'.
   ```

### Scenario 4: Cross-Table Rule Sharing (`instructor.salary` & `emps.overtime`)
```sql
-- In the video: sp_bindrule myrule, 'emps.overtime'
-- Bind the EXACT same rule object to another table's column
EXEC sp_bindrule 'myrule', 'emps.overtime';
GO
```
**SQL Server Telemetry:**
```text
Rule bound to table column.
```
**Validation on `emps.overtime`:**
```sql
-- Attempting to insert overtime <= 1000 triggers rule violation
INSERT INTO dbo.emps (ename, salary, overtime) VALUES ('BadEmp', 4000, 500);
```
**SQL Server Error Output:**
```text
Msg 513, Level 16, State 0, Line 1
A column insert or update conflicts with a rule imposed by a previous CREATE RULE statement.
The statement was terminated. The conflict occurred in database 'ITI', table 'dbo.emps', column 'overtime'.
```

### Scenario 5: Dropping Rules & Dependency Handling (Msg 3716 Error)
```sql
-- In the video: attempting to drop rule while bound fails!
DROP RULE myrule;
```
**SQL Server Output:**
```text
Msg 3716, Level 16, State 1, Line 1
The rule 'myrule' cannot be dropped because it is bound to one or more column.
```

### Scenario 6: Safe Unbinding Sequence (`sp_unbindrule`)
```sql
-- In the video: unbind from both tables before dropping
EXEC sp_unbindrule 'instructor.salary';
EXEC sp_unbindrule 'emps.overtime';
DROP RULE myrule;
```
**SQL Server Output:**
```text
Rule unbound from table column.
Rule unbound from table column.
Command(s) completed successfully.
```

### Scenario 7: Standalone Global Default Object (`mydef`)
```sql
-- In the video:
-- --default
-- create default mydef as 5000
-- sp_bindefault mydef,'instructor.salary'
CREATE DEFAULT mydef AS 5000;
GO
EXEC sp_bindefault 'mydef', 'instructor.salary';
GO
```
**SQL Server Telemetry:**
```text
Default bound to column.
```
**Default Value Verification:**
```sql
INSERT INTO dbo.Instructor (Ins_Id, Ins_Name) VALUES (888, N'DefaultSalaryInstructor');
SELECT Ins_Id, Ins_Name, Salary FROM dbo.Instructor WHERE Ins_Id = 888;
```
| Ins_Id | Ins_Name | Salary |
| :---: | :--- | :---: |
| `888` | DefaultSalaryInstructor | `5000.0000` |

### Scenario 8: Dropping Bound Default & Safe Unbinding (`sp_unbindefault`)
```sql
-- In the video:
-- sp_unbindefault 'instructor.salary'
-- drop default mydef

-- Attempting drop before unbinding:
DROP DEFAULT mydef;
-- Triggers: Msg 3716, Level 16, State 3: The default 'mydef' cannot be dropped because it is bound to one or more column.

-- Unbind and drop:
EXEC sp_unbindefault 'instructor.salary';
DROP DEFAULT mydef;
```
**SQL Server Output:**
```text
Default unbound from table column.
Command(s) completed successfully.
```

---

## 5. Artifact & Repository Alignment

* **Source T-SQL Script**: [`src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql)
* **Preceding Module**: [`src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql)
* **Obsidian Note**: [`docs/curriculum/01 - COURSE/CH01 - Database Creation and Management/CH01_VID06 - Constraints, Rules, and Default Values.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/curriculum/01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/CH01_VID06%20-%20Constraints,%20Rules,%20and%20Default%20Values.md)
* **Syllabus Mapping**: [`docs/course-syllabus-mapping.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/course-syllabus-mapping.md)
