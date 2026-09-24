-- ============================================================================
-- Script: ch01_vid10_demo_on_index_setup.sql
-- Module: CH01_VID10 - Demo on Index (Database Object Explorer Environment Setup)
-- Course: MaharaTech Course 2305 ("Implementing & Developing SQL Server Objects")
-- Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
-- Database Engine: Microsoft SQL Server 2022 Developer Edition
-- Target Database: [ITI]
-- Description:
--   Automatically creates all missing schema objects shown in SSMS Object Explorer
--   for CH01_VID10 while strictly preserving all existing tables and data
--   (dbo.Department, dbo.Instructor, dbo.mydata, dbo.emps).
--   
--   Objects Reconciled:
--     1. Schema [HR] & table [HR.student] (transferred from dbo.student preserving B+Tree records)
--     2. dbo.Student (with exact columns: St_Id, St_Fname, St_Lname, St_Address, St_Age, Dept_Id, St_super)
--     3. dbo.Topic, dbo.Stud_Course, dbo.Ins_Course, dbo.exam, dbo.grades
--     4. dbo.myemp, dbo.mystaff, dbo.Myusers, dbo.sales
--     5. dbo.fromcmd, dbo.lastt, dbo.newtable, dbo.tab5, dbo.table2, dbo.table3, dbo.table7
-- ============================================================================

SET NOCOUNT ON;
GO

USE ITI;
GO

PRINT '>>> Initializing SSMS Object Explorer Environment for CH01_VID10 in [ITI]...';
GO

-- ----------------------------------------------------------------------------
-- Step 1: Reconcile HR Schema & HR.student Table
-- ----------------------------------------------------------------------------
-- The screenshot shows [HR.student] at the bottom.
-- We create schema [HR] if missing, and transfer our existing [dbo.student]
-- (which holds the 13 B+tree demonstration rows from VID08/09) into [HR.student].
-- This preserves all data, indexes, and frees up 'Student' in dbo for the canonical table.

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'HR')
BEGIN
    PRINT '>>> Creating schema [HR]...';
    EXEC(N'CREATE SCHEMA HR;');
END
GO

IF OBJECT_ID(N'dbo.student', N'U') IS NOT NULL AND OBJECT_ID(N'HR.student', N'U') IS NULL
BEGIN
    PRINT '>>> Transferring dbo.student to HR.student (preserving all 13 B+tree records & indexes)...';
    ALTER SCHEMA HR TRANSFER dbo.student;
END
GO

-- ----------------------------------------------------------------------------
-- Step 2: Create Canonical dbo.Student Table (Exact Columns from SSMS Explorer)
-- ----------------------------------------------------------------------------
-- In the screenshot:
--   St_Id (PK, int, not null)
--   St_Fname (nvarchar(50), null)
--   St_Lname (nchar(10), null)
--   St_Address (nvarchar(100), null)
--   St_Age (int, null)
--   Dept_Id (FK, int, null)
--   St_super (FK, int, null)
--   Indexes: PK_Student (Clustered)

IF OBJECT_ID(N'dbo.Student', N'U') IS NULL
BEGIN
    PRINT '>>> Creating canonical dbo.Student table matching SSMS Object Explorer...';
    CREATE TABLE dbo.Student
    (
        St_Id INT NOT NULL CONSTRAINT PK_Student PRIMARY KEY CLUSTERED,
        St_Fname NVARCHAR(50) NULL,
        St_Lname NCHAR(10) NULL,
        St_Address NVARCHAR(100) NULL,
        St_Age INT NULL,
        Dept_Id INT NULL CONSTRAINT FK_Student_Department REFERENCES dbo.Department(Dept_Id),
        St_super INT NULL CONSTRAINT FK_Student_Student REFERENCES dbo.Student(St_Id)
    );

    PRINT '>>> Seeding authentic ITI Student records...';
    INSERT INTO dbo.Student (St_Id, St_Fname, St_Lname, St_Address, St_Age, Dept_Id, St_super) VALUES
        (1, N'Ahmed', N'Hassan   ', N'Cairo', 22, 10, NULL),
        (2, N'Amr', N'Ali      ', N'Alex', 21, 20, 1),
        (3, N'Sara', N'Mahmoud  ', N'Mansoura', 23, 10, 1),
        (4, N'Mona', N'Ibrahim  ', N'Cairo', 22, 20, 2),
        (5, N'Eman', N'Mohamed  ', N'Giza', 21, 30, 2),
        (6, N'Nada', N'Khaled   ', N'Alex', 23, 10, 1),
        (7, N'Yasser', N'Tamer    ', N'Cairo', 22, 30, 3),
        (8, N'Doaa', N'Sayed    ', N'Mansoura', 21, 20, 3),
        (9, N'Khalid', N'Hany     ', N'Cairo', 22, 10, 4),
        (10, N'Ali', N'Mostafa  ', N'Alex', 23, 20, 4),
        (11, N'Tamer', N'Samir    ', N'Giza', 22, 30, 5),
        (12, N'Hany', N'Adel     ', N'Cairo', 21, 10, 5),
        (13, N'Nader', N'Ramy     ', N'Mansoura', 23, 20, 6),
        (14, N'Youssef', N'Nabil    ', N'Alex', 22, 30, 6);
END
GO

-- ----------------------------------------------------------------------------
-- Step 3: Create Academic Course & Topic Tables (dbo.Topic, Stud_Course, Ins_Course)
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.Topic', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.Topic...';
    CREATE TABLE dbo.Topic
    (
        Top_Id INT NOT NULL CONSTRAINT PK_Topic PRIMARY KEY,
        Top_Name VARCHAR(50) NULL
    );

    INSERT INTO dbo.Topic (Top_Id, Top_Name) VALUES
        (1, 'Database'),
        (2, 'Programming'),
        (3, 'Web Development'),
        (4, 'Operating Systems');
END
GO

IF OBJECT_ID(N'dbo.Stud_Course', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.Stud_Course...';
    CREATE TABLE dbo.Stud_Course
    (
        St_Id INT NOT NULL CONSTRAINT FK_Stud_Course_Student REFERENCES dbo.Student(St_Id),
        Crs_Id INT NOT NULL,
        Grade INT NULL,
        CONSTRAINT PK_Stud_Course PRIMARY KEY (St_Id, Crs_Id)
    );

    INSERT INTO dbo.Stud_Course (St_Id, Crs_Id, Grade) VALUES
        (1, 100, 85),
        (1, 200, 92),
        (2, 100, 78),
        (2, 300, 88),
        (3, 100, 95),
        (4, 200, 70),
        (5, 300, 84);
END
GO

IF OBJECT_ID(N'dbo.Ins_Course', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.Ins_Course...';
    CREATE TABLE dbo.Ins_Course
    (
        Ins_Id INT NOT NULL CONSTRAINT FK_Ins_Course_Instructor REFERENCES dbo.Instructor(Ins_Id),
        Crs_Id INT NOT NULL,
        Evaluation VARCHAR(50) NULL,
        CONSTRAINT PK_Ins_Course PRIMARY KEY (Ins_Id, Crs_Id)
    );

    INSERT INTO dbo.Ins_Course (Ins_Id, Crs_Id, Evaluation) VALUES
        (1, 100, 'Excellent'),
        (2, 200, 'Very Good'),
        (3, 300, 'Good'),
        (4, 100, 'Excellent');
END
GO

-- ----------------------------------------------------------------------------
-- Step 4: Create Assessment Tables (dbo.exam, dbo.grades)
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.exam', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.exam...';
    CREATE TABLE dbo.exam
    (
        Ex_Id INT NOT NULL CONSTRAINT PK_exam PRIMARY KEY,
        Ex_Name VARCHAR(50) NULL,
        Date DATE NULL
    );

    INSERT INTO dbo.exam (Ex_Id, Ex_Name, Date) VALUES
        (1, 'SQL Server Fundamentals', '2024-01-15'),
        (2, 'Advanced T-SQL Programming', '2024-02-10'),
        (3, 'Database Administration', '2024-03-05');
END
GO

IF OBJECT_ID(N'dbo.grades', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.grades...';
    CREATE TABLE dbo.grades
    (
        id INT NOT NULL,
        grade INT NULL
    );

    INSERT INTO dbo.grades (id, grade) VALUES
        (1, 85),
        (2, 90),
        (3, 75),
        (4, 95);
END
GO

-- ----------------------------------------------------------------------------
-- Step 5: Create Workforce & Domain Tables (dbo.myemp, dbo.mystaff, dbo.Myusers, dbo.sales)
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.myemp', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.myemp...';
    CREATE TABLE dbo.myemp
    (
        eid INT NOT NULL,
        ename VARCHAR(50) NULL,
        salary INT NULL,
        overtime INT NULL
    );

    INSERT INTO dbo.myemp (eid, ename, salary, overtime) VALUES
        (1, 'Ahmed', 2000, 200),
        (2, 'Amr', 3000, 300),
        (3, 'Sara', 4000, 400);
END
GO

IF OBJECT_ID(N'dbo.mystaff', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.mystaff...';
    CREATE TABLE dbo.mystaff
    (
        sid INT NOT NULL,
        sname VARCHAR(50) NULL,
        salary INT NULL
    );

    INSERT INTO dbo.mystaff (sid, sname, salary) VALUES
        (1, 'Kareem', 2500),
        (2, 'Heba', 3500);
END
GO

IF OBJECT_ID(N'dbo.Myusers', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.Myusers...';
    CREATE TABLE dbo.Myusers
    (
        userid INT NOT NULL,
        username VARCHAR(50) NULL
    );

    INSERT INTO dbo.Myusers (userid, username) VALUES
        (1, 'db_admin'),
        (2, 'app_user'),
        (3, 'report_viewer');
END
GO

IF OBJECT_ID(N'dbo.sales', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.sales...';
    CREATE TABLE dbo.sales
    (
        sales_id INT NOT NULL,
        amount DECIMAL(10,2) NULL
    );

    INSERT INTO dbo.sales (sales_id, amount) VALUES
        (1, 5000.00),
        (2, 7500.50),
        (3, 12000.00);
END
GO

-- ----------------------------------------------------------------------------
-- Step 6: Create Demonstration & Command-Line Tables
-- (dbo.fromcmd, dbo.lastt, dbo.newtable, dbo.tab5, dbo.table2, dbo.table3, dbo.table7)
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.fromcmd', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.fromcmd...';
    CREATE TABLE dbo.fromcmd
    (
        id INT NOT NULL,
        name VARCHAR(20) NULL
    );
    INSERT INTO dbo.fromcmd VALUES (1, 'cmd_entry_1'), (2, 'cmd_entry_2');
END
GO

IF OBJECT_ID(N'dbo.lastt', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.lastt...';
    CREATE TABLE dbo.lastt
    (
        id INT NOT NULL,
        name VARCHAR(20) NULL
    );
    INSERT INTO dbo.lastt VALUES (1, 'last_entry');
END
GO

IF OBJECT_ID(N'dbo.newtable', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.newtable...';
    CREATE TABLE dbo.newtable
    (
        id INT NOT NULL,
        name VARCHAR(50) NULL
    );
    INSERT INTO dbo.newtable VALUES (1, 'wizard_table');
END
GO

IF OBJECT_ID(N'dbo.tab5', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.tab5...';
    CREATE TABLE dbo.tab5
    (
        id INT NOT NULL,
        name VARCHAR(20) NULL
    );
    INSERT INTO dbo.tab5 VALUES (1, 'tab5_row');
END
GO

IF OBJECT_ID(N'dbo.table2', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.table2...';
    CREATE TABLE dbo.table2
    (
        id INT NOT NULL,
        name VARCHAR(20) NULL
    );
    INSERT INTO dbo.table2 VALUES (1, 'table2_row');
END
GO

IF OBJECT_ID(N'dbo.table3', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.table3...';
    CREATE TABLE dbo.table3
    (
        id INT NOT NULL,
        name VARCHAR(20) NULL
    );
    INSERT INTO dbo.table3 VALUES (1, 'table3_row');
END
GO

IF OBJECT_ID(N'dbo.table7', N'U') IS NULL
BEGIN
    PRINT '>>> Creating dbo.table7...';
    CREATE TABLE dbo.table7
    (
        id INT NOT NULL,
        name VARCHAR(20) NULL
    );
    INSERT INTO dbo.table7 VALUES (1, 'table7_row');
END
GO

-- ----------------------------------------------------------------------------
-- Step 7: Final Object Verification
-- ----------------------------------------------------------------------------
PRINT '============================================================================';
PRINT 'Reconciliation complete! Current Tables in database [ITI]:';
PRINT '============================================================================';

SELECT 
    s.name AS SchemaName,
    t.name AS TableName,
    t.create_date AS CreatedDate
FROM sys.tables t
JOIN sys.schemas s ON t.schema_id = s.schema_id
ORDER BY s.name, t.name;
GO
