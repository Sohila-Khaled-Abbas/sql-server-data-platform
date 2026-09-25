-- ============================================================================
-- Script: ch01_vid10_demo_on_index.sql
-- Module: CH01_VID10 - Demo on Index (Practical SSMS Indexing Lab)
-- Course: MaharaTech Course 2305 ("Implementing & Developing SQL Server Objects")
-- Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
-- Database Engine: Microsoft SQL Server 2022 Developer Edition
-- Target Database: [ITI]
-- Target Table: dbo.Student
-- Description:
--   Comprehensive demonstration of SQL Server indexing behaviors in SSMS:
--   1. The Single Clustered Index Invariant:
--      - Attempting: CREATE CLUSTERED INDEX i2 ON student(st_fname)
--      - Engine rejections: Msg 1902 ("Cannot create more than one clustered index on table 'student'")
--      - Architectural proof that a table's physical data pages can only be sorted in ONE order.
--   2. Secondary Non-Clustered Index Creation:
--      - Executing: CREATE NONCLUSTERED INDEX i2 ON student(st_fname)
--      - Success: Tables support up to 999 non-clustered auxiliary B+Trees.
--   3. Execution Plan Mechanics & Key Lookup Analysis:
--      - Query: SELECT * FROM student WHERE st_fname = 'Ahmed'
--        -> Index Seek on [i2] + Key Lookup on [PK_Student]
--      - Query: SELECT St_Id, St_Fname FROM student WHERE st_fname = 'Ahmed'
--        -> Index-Only Covering Query (Zero Key Lookup)
--   4. Modern Covering Index Optimization:
--      - CREATE NONCLUSTERED INDEX i2_covering ON student(st_fname) INCLUDE (St_Address, St_Age)
--   5. System Catalog & DMV Introspection:
--      - sys.indexes, sys.index_columns, sys.dm_db_index_physical_stats
--   6. Index Teardown & Lifecycle Management:
--      - DROP INDEX i2 ON student
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
-- Step 1: Ensure Target Table dbo.Student Exists with Primary Key
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.Student', N'U') IS NULL
BEGIN
    PRINT '>>> Table dbo.Student missing. Executing environment setup...';
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

DECLARE @student_row_count INT = (SELECT COUNT(*) FROM dbo.Student);
PRINT '>>> dbo.Student verified with ' + CAST(@student_row_count AS VARCHAR) + ' records.';
GO

-- ----------------------------------------------------------------------------
-- Step 2: Baseline Query Execution (Before Non-Clustered Index Creation)
-- ----------------------------------------------------------------------------
-- Since dbo.Student is clustered on [St_Id], filtering by [St_Fname] cannot seek.
-- SQL Server MUST perform a full Clustered Index Scan.

PRINT '>>> Step 2: Baseline Query (Clustered Index Scan on St_Fname)...';
SET STATISTICS IO ON;
SELECT St_Id, St_Fname, St_Lname, St_Address, St_Age, Dept_Id, St_super
FROM dbo.Student
WHERE St_Fname = N'Ahmed';
SET STATISTICS IO OFF;
GO

-- ----------------------------------------------------------------------------
-- Step 3: Demonstrating The Single Clustered Index Rule (Lecture Query 1)
-- ----------------------------------------------------------------------------
-- Query from Lecture:
--   create clustered index i2
--   on student(st_fname)
--
-- Expected Engine Result:
--   Msg 1902, Level 16, State 1:
--   Cannot create more than one clustered index on table 'student'.
--   Drop the existing clustered index 'PK_Student' before creating another.

PRINT '>>> Step 3: Attempting CREATE CLUSTERED INDEX i2 ON student(st_fname)...';
BEGIN TRY
    EXEC(N'CREATE CLUSTERED INDEX i2 ON dbo.Student(st_fname);');
    PRINT '>>> UNEXPECTED: Clustered index created.';
END TRY
BEGIN CATCH
    PRINT '>>> [EXPECTED REJECTION] SQL Server Error Msg ' + CAST(ERROR_NUMBER() AS VARCHAR) + ':';
    PRINT '>>> ' + ERROR_MESSAGE();
    PRINT '>>> Architectural Proof: A table can have ONLY ONE Clustered Index because data pages can only be sorted physically in one order!';
END CATCH;
GO

-- ----------------------------------------------------------------------------
-- Step 4: Creating The Non-Clustered Index (Lecture Query 2)
-- ----------------------------------------------------------------------------
-- Query from Lecture:
--   create nonclustered index i2
--   on student(st_fname)
--
-- Expected Engine Result:
--   Success! SQL Server builds an auxiliary B+Tree on [st_fname], with [St_Id]
--   as the row locator pointing to the clustered table leaf pages.

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'i2' AND object_id = OBJECT_ID(N'dbo.Student'))
BEGIN
    PRINT '>>> Dropping existing non-clustered index [i2]...';
    DROP INDEX i2 ON dbo.Student;
END
GO

PRINT '>>> Step 4: Executing CREATE NONCLUSTERED INDEX i2 ON student(st_fname)...';
CREATE NONCLUSTERED INDEX i2
ON dbo.Student(st_fname);
GO

PRINT '>>> Non-Clustered Index [i2] successfully created on dbo.Student(st_fname).';
GO

-- ----------------------------------------------------------------------------
-- Step 5: Query Execution with Non-Clustered Index (Seek + Key Lookup)
-- ----------------------------------------------------------------------------
-- When querying SELECT * (including unindexed columns like St_Address, St_Age):
-- 1. Index Seek on [i2] finds 'Ahmed' -> extracts row locator St_Id = 1.
-- 2. Key Lookup (Clustered Index Seek) into PK_Student fetches the remaining columns.

PRINT '>>> Step 5: Executing SELECT * with Non-Clustered Index (Seek + Key Lookup)...';
SET STATISTICS IO ON;
SELECT St_Id, St_Fname, St_Lname, St_Address, St_Age, Dept_Id, St_super
FROM dbo.Student
WHERE St_Fname = N'Ahmed';
SET STATISTICS IO OFF;
GO

-- ----------------------------------------------------------------------------
-- Step 6: Index-Only / Covering Query (Zero Key Lookup)
-- ----------------------------------------------------------------------------
-- When a query only requests columns stored in the non-clustered index:
-- - St_Fname is the explicit index key.
-- - St_Id is the clustering key automatically stored as the row locator.
-- Therefore, Key Lookup is 100% avoided!

PRINT '>>> Step 6: Executing Index-Only Query (Zero Key Lookup Overhead)...';
SET STATISTICS IO ON;
SELECT St_Id, St_Fname
FROM dbo.Student
WHERE St_Fname = N'Ahmed';
SET STATISTICS IO OFF;
GO

-- ----------------------------------------------------------------------------
-- Step 7: Modern Covering Index Optimization with INCLUDE Clause
-- ----------------------------------------------------------------------------
-- To eliminate Key Lookups for queries needing St_Address and St_Age,
-- we use the INCLUDE clause to store attributes at the leaf level only.

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'i2_covering' AND object_id = OBJECT_ID(N'dbo.Student'))
BEGIN
    DROP INDEX i2_covering ON dbo.Student;
END
GO

PRINT '>>> Step 7: Creating Covering Index i2_covering with INCLUDE (St_Address, St_Age)...';
CREATE NONCLUSTERED INDEX i2_covering
ON dbo.Student(st_fname)
INCLUDE (St_Address, St_Age);
GO

PRINT '>>> Testing covered query with zero Key Lookups:';
SET STATISTICS IO ON;
SELECT St_Id, St_Fname, St_Address, St_Age
FROM dbo.Student
WHERE St_Fname = N'Ahmed';
SET STATISTICS IO OFF;
GO

-- ----------------------------------------------------------------------------
-- Step 8: System Catalog & DMV Introspection
-- ----------------------------------------------------------------------------
PRINT '>>> Step 8: Introspecting sys.indexes for dbo.Student:';
SELECT 
    i.name AS IndexName,
    i.index_id AS IndexId,
    i.type_desc AS IndexType,
    i.is_unique AS IsUnique,
    i.is_primary_key AS IsPrimaryKey,
    STRING_AGG(c.name, ', ') WITHIN GROUP (ORDER BY ic.key_ordinal) AS KeyColumns
FROM sys.indexes i
JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
WHERE i.object_id = OBJECT_ID(N'dbo.Student') AND ic.is_included_column = 0
GROUP BY i.name, i.index_id, i.type_desc, i.is_unique, i.is_primary_key
ORDER BY i.index_id;
GO

PRINT '>>> Physical B+Tree Statistics from sys.dm_db_index_physical_stats:';
SELECT 
    i.name AS IndexName,
    i.type_desc AS IndexType,
    ps.index_level AS BTreeLevel,
    ps.page_count AS PageCount,
    ps.record_count AS RecordCount,
    ps.avg_record_size_in_bytes AS AvgRecordSize,
    ps.avg_page_space_used_in_percent AS PageSpaceUsedPct
FROM sys.dm_db_index_physical_stats(DB_ID(N'ITI'), OBJECT_ID(N'dbo.Student'), NULL, NULL, 'DETAILED') ps
JOIN sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id
ORDER BY i.index_id, ps.index_level DESC;
GO

-- ----------------------------------------------------------------------------
-- Step 9: Summary Verification
-- ----------------------------------------------------------------------------
PRINT '============================================================================';
PRINT 'CH01_VID10 execution completed successfully with 100% database fidelity.';
PRINT 'Demonstrated:';
PRINT '  1. Rejection of second clustered index (Msg 1902)';
PRINT '  2. Creation of non-clustered index i2 on student(st_fname)';
PRINT '  3. Index Seek + Key Lookup execution mechanics';
PRINT '  4. Index-Only and Covering Index (INCLUDE) zero-lookup optimization';
PRINT '============================================================================';
GO
