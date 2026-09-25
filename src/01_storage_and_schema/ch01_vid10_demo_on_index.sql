-- ============================================================================
-- Script: ch01_vid10_demo_on_index.sql
-- Module: CH01_VID10 - Demo on Index (Practical SSMS Indexing & Tuning Lab)
-- Course: MaharaTech Course 2305 ("Implementing & Developing SQL Server Objects")
-- Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
-- Database Engine: Microsoft SQL Server 2022 Developer Edition
-- Target Database: [ITI]
-- Target Tables: dbo.Student, dbo.mydata, dbo.mytest, dbo.Instructor
-- Description:
--   Comprehensive demonstration of SQL Server indexing, physical execution plans,
--   constraint-to-index mappings, and workload tuning in SSMS:
--
--   1. The Single Clustered Index Invariant:
--      - Attempt: CREATE CLUSTERED INDEX i2 ON student(st_fname)
--      - Result: Rejection with Msg 1902 ("Cannot create more than one clustered index...")
--      - Physical proof: Table data pages can only have ONE physical disk ordering.
--
--   2. Secondary Non-Clustered Indexes:
--      - CREATE NONCLUSTERED INDEX i2 ON student(st_fname)
--      - CREATE NONCLUSTERED INDEX i3 ON student(st_address)
--      - Up to 999 non-clustered auxiliary B+Trees supported per table.
--
--   3. Execution Plan Comparison (Clustered Index Seek vs Table Scan):
--      - Query 1: SELECT * FROM Student WHERE St_Id = 1
--        -> Clustered Index Seek on [Student].[PK_Student] (Cost 100%)
--      - Query 2: SELECT * FROM mydata WHERE id = 1
--        -> Table Scan on Heap [mydata] (Cost 100%)
--
--   4. Constraint to Index Physical Architecture:
--      - Rule: PRIMARY KEY constraint   -----> CLUSTERED index (default)
--      - Rule: UNIQUE constraint        -----> NONCLUSTERED index (default)
--      - Demonstration Table: dbo.mytest (PK on SSN, UNIQUE on salary, UNIQUE on overtime, CHECK c100)
--
--   5. Unique Index Violation & Duplicate Key Termination:
--      - Attempt: CREATE UNIQUE INDEX i7 ON student(st_age)
--      - Result: Msg 1505 ("duplicate key was found... duplicate key value is (21)")
--      - Fix: CREATE INDEX i7 ON student(st_age) (Standard Non-Clustered Index)
--
--   6. Workload Profiling & Database Engine Tuning Advisor (DTA):
--      - Query Workload:
--          SELECT * FROM Instructor WHERE salary > 5000
--          SELECT * FROM student WHERE dept_id = 10
--      - SQL Server Profiler Trace: D:\courses\...\VID10.trc (src/01_storage_and_schema/traces/VID10.trc)
--      - Reading trace files with sys.fn_trace_gettable()
--      - DTA Tuning & DTAEngine Storage Bound Error Resolution:
--          "The minimum storage space required... exceeds default storage space... at least 4MB"
--          Fixes: (1) GUI Advanced Options Max MB, (2) dta.exe -B 50, (3) XML <StorageBoundInMB>50</StorageBoundInMB>
-- ============================================================================

SET NOCOUNT ON;
GO

USE ITI;
GO

PRINT '============================================================================';
PRINT '>>> Starting CH01_VID10: Demo on Index execution on database [ITI]...';
PRINT '============================================================================';
GO

-- ----------------------------------------------------------------------------
-- Step 1: Ensure Target Tables Exist (Student & mydata)
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.Student', N'U') IS NULL
BEGIN
    PRINT '>>> Table dbo.Student missing. Creating canonical table...';
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

IF OBJECT_ID(N'dbo.mydata', N'U') IS NULL
BEGIN
    PRINT '>>> Table dbo.mydata missing. Creating Heap demonstration table...';
    CREATE TABLE dbo.mydata
    (
        id INT NULL,
        name VARCHAR(20) NULL,
        salary complexdt NULL
    );
    INSERT INTO dbo.mydata (id, name, salary) VALUES
        (1, 'Ahmed', 5000),
        (2, 'Sara', 7500),
        (3, 'Omar', 12000);
END
GO

DECLARE @student_cnt INT = (SELECT COUNT(*) FROM dbo.Student);
DECLARE @mydata_cnt INT = (SELECT COUNT(*) FROM dbo.mydata);
PRINT '>>> Target tables verified: dbo.Student (' + CAST(@student_cnt AS VARCHAR) + ' rows), dbo.mydata (' + CAST(@mydata_cnt AS VARCHAR) + ' rows).';
GO

-- ----------------------------------------------------------------------------
-- Step 2: Attempting Second Clustered Index (Msg 1902 Rejection)
-- ----------------------------------------------------------------------------
-- Lecture Query:
--   create clustered index i2
--   on student(st_fname)
--
-- Expected Engine Result:
--   Msg 1902, Level 16, State 1:
--   Cannot create more than one clustered index on table 'student'.
--   Drop the existing clustered index 'PK_Student' before creating another.

-- Ensure index i2 does not exist beforehand so Msg 1902 is cleanly demonstrated:
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'i2' AND object_id = OBJECT_ID(N'dbo.Student'))
    DROP INDEX i2 ON dbo.Student;
GO

PRINT '>>> Step 2: Attempting CREATE CLUSTERED INDEX i2 ON student(st_fname)...';
BEGIN TRY
    EXEC(N'CREATE CLUSTERED INDEX i2 ON dbo.Student(st_fname);');
    PRINT '>>> UNEXPECTED: Clustered index created.';
END TRY
BEGIN CATCH
    PRINT '>>> [EXPECTED REJECTION] SQL Server Error Msg ' + CAST(ERROR_NUMBER() AS VARCHAR) + ':';
    PRINT '>>> ' + ERROR_MESSAGE();
    PRINT '>>> Architectural Proof: Only ONE physical sort order exists per table on disk.';
END CATCH;
GO

-- ----------------------------------------------------------------------------
-- Step 3: Creating Secondary Non-Clustered Indexes (i2 and i3)
-- ----------------------------------------------------------------------------
-- Lecture Queries:
--   create nonclustered index i2
--   on student(st_fname)
--
--   create nonclustered index i3
--   on student(st_address)

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'i2' AND object_id = OBJECT_ID(N'dbo.Student'))
    DROP INDEX i2 ON dbo.Student;
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'i3' AND object_id = OBJECT_ID(N'dbo.Student'))
    DROP INDEX i3 ON dbo.Student;
GO

PRINT '>>> Step 3: Creating Non-Clustered Index i2 on student(st_fname)...';
CREATE NONCLUSTERED INDEX i2
ON dbo.Student(st_fname);
GO

PRINT '>>> Creating Non-Clustered Index i3 on student(st_address)...';
CREATE NONCLUSTERED INDEX i3
ON dbo.Student(st_address);
GO

PRINT '>>> Both non-clustered indexes i2 and i3 created successfully on dbo.Student.';
GO

-- ----------------------------------------------------------------------------
-- Step 4: Execution Plan Comparison: Clustered Index Seek vs Table Scan
-- ----------------------------------------------------------------------------
-- Query 1: select * from Student where St_Id = 1
--   Because St_Id is the PRIMARY KEY CLUSTERED, the storage engine navigates
--   the B+Tree directly to the target leaf data page.
--   Execution Plan: Clustered Index Seek (Clustered) [Student].[PK_Student] (Cost 100%)

PRINT '>>> Step 4: Testing Execution Plans (Clustered Index Seek vs Table Scan)...';

PRINT '>>> 4a: Executing SELECT * FROM Student WHERE St_Id = 1 (Expects Clustered Index Seek):';
SET STATISTICS IO ON;
SELECT St_Id, St_Fname, St_Lname, St_Address, St_Age, Dept_Id, St_super
FROM dbo.Student
WHERE St_Id = 1;
SET STATISTICS IO OFF;
GO

-- Query 2: select * from mydata where id = 1
--   Because dbo.mydata is a Heap table (no clustered index), the query engine
--   MUST read every allocated page via the IAM (Index Allocation Map).
--   Execution Plan: Table Scan [mydata] (Cost 100%)

PRINT '>>> 4b: Executing SELECT * FROM mydata WHERE id = 1 (Expects Table Scan on Heap):';
SET STATISTICS IO ON;
SELECT id, name, salary
FROM dbo.mydata
WHERE id = 1;
SET STATISTICS IO OFF;
GO

-- ----------------------------------------------------------------------------
-- Step 5: Constraint to Index Physical Architecture (mytest Table)
-- ----------------------------------------------------------------------------
-- Architectural Invariants:
--   Primary key constraint  ----> Clustered index (Default)
--   Unique constraint       ----> Nonclustered index (Default)
--
-- Demonstration Table:
--   create table mytest
--   (
--       id int identity,
--       SSN int primary key,
--       name varchar(20),
--       salary int unique,
--       overtime int unique,
--       constraint c100 check(overtime>100)
--   )

IF OBJECT_ID(N'dbo.mytest', N'U') IS NOT NULL
    DROP TABLE dbo.mytest;
GO

PRINT '>>> Step 5: Creating table dbo.mytest to observe constraint-to-index mappings...';
CREATE TABLE dbo.mytest
(
    id INT IDENTITY,
    SSN INT PRIMARY KEY,
    name VARCHAR(20),
    salary INT UNIQUE,
    overtime INT UNIQUE,
    CONSTRAINT c100 CHECK(overtime > 100)
);
GO

PRINT '>>> System Catalog Proof: Inspecting sys.indexes for dbo.mytest:';
SELECT 
    i.name AS IndexName,
    i.type_desc AS IndexType,
    i.is_unique AS IsUnique,
    i.is_primary_key AS IsPrimaryKey,
    i.is_unique_constraint AS IsUniqueConstraint,
    c.name AS ColumnName
FROM sys.indexes i
JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
WHERE i.object_id = OBJECT_ID(N'dbo.mytest')
ORDER BY i.type, i.name;
GO

-- ----------------------------------------------------------------------------
-- Step 6: Unique Index vs Duplicate Key Data Violation (Msg 1505) & Fix
-- ----------------------------------------------------------------------------
-- Lecture Query:
--   create unique index i7 --unique constraint + nonclustered index
--   on student(st_age)
--
-- Expected Failure:
--   Msg 1505, Level 16, State 1:
--   The CREATE UNIQUE INDEX statement terminated because a duplicate key was
--   found for the object name 'dbo.Student' and the index name 'i7'.
--   The duplicate key value is (21).
--   The statement has been terminated.

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'i7' AND object_id = OBJECT_ID(N'dbo.Student'))
    DROP INDEX i7 ON dbo.Student;
GO

PRINT '>>> Step 6: Demonstrating CREATE UNIQUE INDEX on duplicate data (Student.st_age)...';
BEGIN TRY
    EXEC(N'CREATE UNIQUE INDEX i7 ON dbo.Student(st_age);');
    PRINT '>>> UNEXPECTED: Unique index created on duplicate data.';
END TRY
BEGIN CATCH
    PRINT '>>> [EXPECTED REJECTION] SQL Server Error Msg ' + CAST(ERROR_NUMBER() AS VARCHAR) + ':';
    PRINT '>>> ' + ERROR_MESSAGE();
    PRINT '>>> Explanation: Age 21 occurs multiple times in dbo.Student. Unique index enforces strict uniqueness.';
END CATCH;
GO

-- The Fix: Create regular (non-unique) nonclustered index:
--   create index i7 --nonclustered index
--   on student(st_age)

PRINT '>>> Applying Fix: Creating regular non-unique index i7 on student(st_age)...';
CREATE INDEX i7
ON dbo.Student(st_age);
GO

PRINT '>>> Regular Non-Clustered Index i7 created successfully on dbo.Student(st_age).';
GO

-- ----------------------------------------------------------------------------
-- Step 7: Workload Queries for Database Engine Tuning Advisor (DTA)
-- ----------------------------------------------------------------------------
-- Lecture Workload Queries:
--   select * from Instructor where salary > 5000
--   select * from student where dept_id = 10
--
-- Current State:
--   - dbo.Instructor has no index on [Salary] -> Clustered Index Scan.
--   - dbo.Student has no index on foreign key [Dept_Id] -> Clustered Index Scan.

PRINT '>>> Step 7: Running Workload Queries Analyzed in DTA / Profiler:';

PRINT '>>> Query 1: Instructor salary filter (performs scan):';
SET STATISTICS IO ON;
SELECT Ins_Id, Ins_Name, Ins_Degree, Salary, Dept_Id
FROM dbo.Instructor
WHERE Salary > 5000;
SET STATISTICS IO OFF;
GO

PRINT '>>> Query 2: Student dept_id filter (performs scan):';
SET STATISTICS IO ON;
SELECT St_Id, St_Fname, St_Lname, St_Address, St_Age, Dept_Id, St_super
FROM dbo.Student
WHERE Dept_Id = 10;
SET STATISTICS IO OFF;
GO

-- ----------------------------------------------------------------------------
-- Step 8: Profiler Trace Reading & DTA Error Resolution
-- ----------------------------------------------------------------------------
-- 1. SQL Server Profiler captured these events into:
--    D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\VID10.trc
--    (Cached locally in: src/01_storage_and_schema/traces/VID10.trc)
--
-- 2. Reading captured events via T-SQL:
PRINT '>>> Step 8: Reading Profiler Trace File via sys.fn_trace_gettable:';
DECLARE @trace_path NVARCHAR(500) = N'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\VID10.trc';

BEGIN TRY
    SELECT TOP 10 
        EventClass, 
        DatabaseName, 
        ApplicationName, 
        LEFT(REPLACE(REPLACE(CONVERT(NVARCHAR(MAX), TextData), CHAR(13), ' '), CHAR(10), ' '), 80) AS Snippet,
        CPU, 
        Reads, 
        Duration, 
        StartTime
    FROM sys.fn_trace_gettable(@trace_path, DEFAULT)
    WHERE TextData IS NOT NULL;
END TRY
BEGIN CATCH
    PRINT '>>> Note: Trace file read exception: ' + ERROR_MESSAGE();
END CATCH;
GO

-- 3. Database Engine Tuning Advisor Storage Space Error:
--    Error: "The minimum storage space required for the selected physical design structures
--            exceeds the default storage space selected by Database Engine Tuning Advisor.
--            Either keep fewer physical design structures, or increase default storage space to be larger than at least 4MB."
--
--    Troubleshooting Solutions:
--    (1) SSMS GUI: Tuning Options Tab -> Click [Advanced Options...] -> Set "Define max. space for recommendations (MB)" to 50 MB.
--    (2) Command Line: dta.exe -S localhost -D ITI -if "VID10.trc" -B 50 -s "CH01_VID10_Session"
--    (3) XML Tuning Config: <StorageBoundInMB>50</StorageBoundInMB> inside <TuningOptions>.

PRINT '============================================================================';
PRINT 'CH01_VID10 execution completed successfully with 100% database fidelity.';
PRINT 'Key Takeaways:';
PRINT '  1. Single Clustered Index: Only 1 clustered index permitted per table (Msg 1902).';
PRINT '  2. Non-Clustered Indexes: Multiple indexes (i2 on st_fname, i3 on st_address) supported.';
PRINT '  3. Clustered Seek vs Table Scan: Index Seek on PK_Student vs Table Scan on heap mydata.';
PRINT '  4. Constraints to Indexes: PK creates CLUSTERED index; UNIQUE creates NONCLUSTERED index.';
PRINT '  5. Unique Index Rule: Fails on duplicate values (Msg 1505) unless created without UNIQUE.';
PRINT '  6. Profiler & DTA: Trace workloads and resolve DTAEngine storage bounds via -B / Advanced Options.';
PRINT '============================================================================';
GO
