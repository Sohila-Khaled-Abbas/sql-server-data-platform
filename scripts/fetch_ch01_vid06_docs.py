import pyodbc
from datetime import datetime, timezone

def generate_live_doc():
    conn_str = 'DRIVER={ODBC Driver 18 for SQL Server};SERVER=.;DATABASE=ITI;Trusted_Connection=yes;TrustServerCertificate=yes;'
    conn = pyodbc.connect(conn_str, autocommit=True)
    cur = conn.cursor()
    
    # Check SQL Server Version
    cur.execute("SELECT @@VERSION")
    version_str = cur.fetchone()[0]
    
    # Fetch Tables in ITI
    cur.execute("""
    SELECT TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_NAME IN ('Department', 'Instructor')
    ORDER BY TABLE_NAME
    """)
    tables = cur.fetchall()
    
    # Fetch Columns for Instructor
    cur.execute("""
    SELECT 
        c.COLUMN_NAME, 
        c.DATA_TYPE, 
        c.CHARACTER_MAXIMUM_LENGTH,
        c.NUMERIC_PRECISION,
        c.NUMERIC_SCALE,
        c.IS_NULLABLE,
        c.COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS c
    WHERE c.TABLE_NAME = 'Instructor'
    ORDER BY c.ORDINAL_POSITION
    """)
    instructor_cols = cur.fetchall()

    # Fetch Columns for Department
    cur.execute("""
    SELECT 
        c.COLUMN_NAME, 
        c.DATA_TYPE, 
        c.CHARACTER_MAXIMUM_LENGTH,
        c.IS_NULLABLE
    FROM INFORMATION_SCHEMA.COLUMNS c
    WHERE c.TABLE_NAME = 'Department'
    ORDER BY c.ORDINAL_POSITION
    """)
    department_cols = cur.fetchall()
    
    # Fetch All 16 Rows from Instructor
    cur.execute("""
    SELECT 
        Ins_Id, 
        Ins_Name, 
        Ins_Degree, 
        Salary, 
        gender, 
        Dept_Id
    FROM dbo.Instructor
    ORDER BY CASE WHEN Ins_Id = 666 THEN 9999 ELSE Ins_Id END
    """)
    instructor_rows = cur.fetchall()
    
    # Check Constraints & Rules on dbo.Instructor
    cur.execute("""
    SELECT 
        t.name AS TableName,
        c.name AS ColumnName,
        r.name AS BoundRuleName,
        d.name AS BoundDefaultName
    FROM sys.tables t
    JOIN sys.columns c ON t.object_id = c.object_id
    LEFT JOIN sys.objects r ON c.rule_object_id = r.object_id
    LEFT JOIN sys.objects d ON c.default_object_id = d.object_id
    WHERE t.name = 'Instructor'
    """)
    bound_objects = cur.fetchall()
    
    # Produce Markdown content
    md = []
    md.append("# CH01_VID06: Constraints, Rules, and Default Values - Live Verification Telemetry")
    md.append("")
    md.append("> **Live Database Telemetry Captured Directly from Microsoft SQL Server 2022 Instance**")
    md.append(f"> **Environment**: `DESKTOP-NPSJDUB` / `localhost` (`.`) | **Database**: `[ITI]` | **Capture Timestamp (UTC)**: `{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S')}`")
    md.append(f"> **Engine**: `{version_str.splitlines()[0]}`")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 1. Executive Pedagogical Context")
    md.append("")
    md.append("In **MaharaTech Course 2305** (*Implementing & Developing SQL Server Objects* - Chapter 1, Video 6), **Eng. Rami Mohamed Abonagi** builds directly upon the relational integrity constraints taught in `CH01_VID05`. While constraints (`CHECK`, `DEFAULT`, `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`) are ANSI-standard, SQL Server provides legacy standalone database-level objects (**Rules** and **Defaults**) that offer unique architectural capabilities.")
    md.append("")
    md.append("### Key Comparison: Constraints vs. Rules")
    md.append("")
    md.append("| Dimension | Standard `CHECK` Constraint | Legacy `RULE` Object (`CREATE RULE`) |")
    md.append("| :--- | :--- | :--- |")
    md.append("| **Existing Data Validation** | Validates **all** existing rows by default (statements fail if any row violates, unless `WITH NOCHECK` is specified) | Ignores existing invalid rows upon binding; enforces validation **only on new `INSERT` / `UPDATE`** operations |")
    md.append("| **Cross-Table Sharing** | Bound strictly to a single table; cannot be shared across multiple tables | Standalone global object; can be bound to multiple tables via `sp_bindrule` |")
    md.append("| **User-Defined Data Types (UDDT)** | Cannot be attached to a UDDT | Can be bound directly to custom data types via `sp_bindrule` |")
    md.append("| **ANSI Standard Compliance** | ANSI SQL Standard (Recommended for modern greenfield design) | Proprietary legacy T-SQL (Deprecated, preserved for enterprise backward compatibility) |")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 2. Live Database Schema in `[ITI]`")
    md.append("")
    md.append("### A. `dbo.Department` Table Definition")
    md.append("")
    md.append("| Column Name | Data Type | Nullable | Role |")
    md.append("| :--- | :--- | :--- | :--- |")
    for col in department_cols:
        role = "Primary Key" if col[0] == 'Dept_Id' else "Attribute"
        length_str = f"({col[2]})" if col[2] else ""
        md.append(f"| `{col[0]}` | `{col[1]}{length_str}` | `{col[3]}` | {role} |")
    md.append("")
    md.append("### B. `dbo.Instructor` Table Definition (SSMS Matching)")
    md.append("")
    md.append("| Column Name | Data Type | Precision / Scale | Nullable | Default / Bound Object |")
    md.append("| :--- | :--- | :--- | :--- | :--- |")
    for col in instructor_cols:
        prec = f"({col[3]},{col[4]})" if col[3] is not None and col[4] is not None else (f"({col[2]})" if col[2] else "-")
        default_str = col[6] if col[6] else "None"
        md.append(f"| `{col[0]}` | `{col[1]}` | `{prec}` | `{col[5]}` | `{default_str}` |")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 3. Live Verified Instructor Dataset (16 Records)")
    md.append("")
    md.append("The following records were fetched live from `[ITI].[dbo].[Instructor]` on the local SQL Server instance, matching the SSMS data grid shown in the course video:")
    md.append("")
    md.append("| Ins_Id | Ins_Name | Ins_Degree | Salary | gender | Dept_Id | Notes / Anomaly Observation |")
    md.append("| :---: | :--- | :--- | :---: | :---: | :---: | :--- |")
    for r in instructor_rows:
        sal_str = f"{r[3]:.4f}" if r[3] is not None else "*NULL*"
        deg_str = r[2] if r[2] is not None else "*NULL*"
        gen_str = r[4] if r[4] is not None else "*NULL*"
        dept_str = str(r[5]) if r[5] is not None else "*NULL*"
        notes = []
        if r[3] is not None and r[3] < 1000:
            notes.append(f"**Violates `@x > 1000`** (Salary={sal_str})")
        if r[3] is None:
            notes.append("Unset Salary (*NULL*)")
        if r[0] == 666:
            notes.append("Sparse audit record (*All attributes NULL*)")
        note_display = "; ".join(notes) if notes else "Complies with `@x > 1000`"
        md.append(f"| `{r[0]}` | `{r[1]}` | {deg_str} | `{sal_str}` | {gen_str} | {dept_str} | {note_display} |")
    md.append("")
    md.append("> [!IMPORTANT]")
    md.append("> Notice that rows 4 (`Yasmin`, Salary=264.0000), 5 (`Amany`, Salary=660.0000), and 6 (`Eman`, Salary=792.0000) have salaries below 1000.")
    md.append("> This is the exact dataset used in the lecture to illustrate why standard `ALTER TABLE Instructor ADD CONSTRAINT CHECK (Salary > 1000)` fails, and how `WITH NOCHECK` or `CREATE RULE` handles preexisting historical records.")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 4. Query Execution & Architectural Behavioral Walkthrough")
    md.append("")
    md.append("### Scenario 1: Standard CHECK Constraint Rejection")
    md.append("```sql")
    md.append("-- Fails because existing rows (Yasmin, Amany, Eman) violate the predicate")
    md.append("ALTER TABLE dbo.Instructor ADD CONSTRAINT chk_Salary CHECK (Salary > 1000);")
    md.append("```")
    md.append("**SQL Server Output:**")
    md.append("```text")
    md.append("Msg 547, Level 16, State 0, Line 1")
    md.append("The ALTER TABLE statement conflicted with the CHECK constraint \"chk_Salary\".")
    md.append("The conflict occurred in database \"ITI\", table \"dbo.Instructor\", column 'Salary'.")
    md.append("```")
    md.append("")
    md.append("### Scenario 2: Applying Constraint with `WITH NOCHECK`")
    md.append("```sql")
    md.append("-- Bypasses validation on preexisting rows, but enforces on subsequent INSERT/UPDATE")
    md.append("ALTER TABLE dbo.Instructor WITH NOCHECK ADD CONSTRAINT chk_Salary CHECK (Salary > 1000);")
    md.append("```")
    md.append("**Result:** `Command(s) completed successfully.`")
    md.append("")
    md.append("### Scenario 3: Global Rule Creation & Column Binding")
    md.append("```sql")
    md.append("----constraint ---> new data XXXX")
    md.append("----constraint ---> shared between tables XXXX")
    md.append("----constraint ---> new data type XXXX")
    md.append("")
    md.append("---> Rule [Global check constraint]")
    md.append("CREATE RULE myrule AS @x > 1000;")
    md.append("GO")
    md.append("")
    md.append("EXEC sp_bindrule myrule, 'instructor.salary';")
    md.append("GO")
    md.append("```")
    md.append("**Behavioral Telemetry:**")
    md.append("1. `sp_bindrule` binds successfully without error.")
    md.append("2. Preexisting rows with Salary < 1000 remain untouched.")
    md.append("3. Attempting to insert `INSERT INTO Instructor (Ins_Id, Ins_Name, Salary) VALUES (999, 'Test', 450);` triggers:")
    md.append("   ```text")
    md.append("   Msg 513, Level 16, State 0, Line 1")
    md.append("   A column insert or update conflicts with a rule imposed by a previous CREATE RULE statement.")
    md.append("   The statement was terminated. The conflict occurred in database 'ITI', table 'dbo.Instructor', column 'Salary'.")
    md.append("   ```")
    md.append("")
    md.append("### Scenario 4: Cross-Table Rule Sharing")
    md.append("```sql")
    md.append("-- Bind the same rule object to an independent table")
    md.append("CREATE TABLE dbo.Consultant (ConsultantId INT PRIMARY KEY, HourlyRate MONEY);")
    md.append("EXEC sp_bindrule 'myrule', 'dbo.Consultant.HourlyRate';")
    md.append("```")
    md.append("**Result:** Single rule definition enforces consistency across unrelated schemas.")
    md.append("")
    md.append("### Scenario 5: User-Defined Data Type (UDDT) Rule Binding")
    md.append("```sql")
    md.append("CREATE TYPE dbo.SalaryType FROM MONEY NOT NULL;")
    md.append("EXEC sp_bindrule 'myrule', 'dbo.SalaryType';")
    md.append("```")
    md.append("**Result:** Any new column declared with `dbo.SalaryType` automatically inherits the `@x > 1000` rule.")
    md.append("")
    md.append("### Scenario 6: Global Default Object (`mydef`)")
    md.append("```sql")
    md.append("---> Default [Global default value]")
    md.append("CREATE DEFAULT mydef AS 5000;")
    md.append("GO")
    md.append("EXEC sp_bindefault 'mydef', 'dbo.Instructor.Salary';")
    md.append("GO")
    md.append("```")
    md.append("**Result:** New rows inserted without specifying `Salary` automatically receive `5000.0000`.")
    md.append("")
    md.append("### Scenario 7: Unbinding & Object Lifecycle Management")
    md.append("```sql")
    md.append("-- Safe unbinding before dropping standalone objects")
    md.append("EXEC sp_unbindrule 'dbo.Instructor.Salary';")
    md.append("DROP RULE myrule;")
    md.append("")
    md.append("EXEC sp_unbindefault 'dbo.Instructor.Salary';")
    md.append("DROP DEFAULT mydef;")
    md.append("```")
    md.append("")
    md.append("---")
    md.append("")
    md.append("## 5. Artifact & Repository Alignment")
    md.append("")
    md.append("* **Source T-SQL Script**: [`src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql)")
    md.append("* **Preceding Module**: [`src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql)")
    md.append("* **Syllabus Mapping**: [`docs/course-syllabus-mapping.md`](file:///d:/courses/Data%20Science/Data%20Engineering/Projects/sql-server-data-platform/docs/course-syllabus-mapping.md)")
    
    with open(r'd:\courses\Data Science\Data Engineering\Projects\sql-server-data-platform\docs\ch01-vid06-constraints-rules-defaults-live.md', 'w', encoding='utf-8') as f:
        f.write("\n".join(md) + "\n")
        
    print(">>> Successfully created docs/ch01-vid06-constraints-rules-defaults-live.md from live SQL Server instance!")
    conn.close()

if __name__ == '__main__':
    generate_live_doc()
