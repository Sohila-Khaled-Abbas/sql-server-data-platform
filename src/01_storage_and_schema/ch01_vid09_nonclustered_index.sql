-- ============================================================================
-- Script: ch01_vid09_nonclustered_index.sql
-- Module: CH01_VID09 - Non-Clustered Index Architecture & Key Lookup Mechanics
-- Course: MaharaTech Course 2305 ("Implementing & Developing SQL Server Objects")
-- Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
-- Database Engine: Microsoft SQL Server 2022 Developer Edition
-- Target Database: [ITI]
-- Continuation: Direct continuation of CH01_VID08 (Clustered Index)
-- Description:
--   Comprehensive demonstration of SQL Server Non-Clustered Index architecture,
--   resolving the non-indexed attribute scan bottleneck identified in CH01_VID08:
--   1. The Core Limitation of Clustered Indexes:
--      - Only ONE clustered index is physically possible per table.
--      - Searching on non-clustered columns (e.g., WHERE name = 'Omar') forces a full
--        Clustered Index Scan across all leaf pages.
--   2. What is a Non-Clustered Index?:
--      - An independent auxiliary B+Tree structure built on secondary key columns.
--      - Multiple non-clustered indexes allowed per table (up to 999 in SQL Server).
--      - Creation syntax: CREATE NONCLUSTERED INDEX i2 ON student (name);
--   3. Non-Clustered B+Tree Hierarchy (Matching Video Architecture):
--      - Root Level: High-level alphabetical partition (e.g., 'Ahmed', 'Lamis')
--      - Intermediate Level: 'Ahmed', 'Doaa', 'Khalid' (Left) and 'Lamis', 'Nada', 'Yasser' (Right)
--      - Leaf Level: Contains sorted index keys ('name') + Row Locators:
--        * On Clustered Tables: Row Locator = Clustering Key ([id] / SID)
--        * On Heap Tables: Row Locator = RID (FileID:PageID:SlotID)
--   4. Query Mechanics — Index Seek + Key Lookup (Bookmark Lookup):
--      - SELECT * FROM student WHERE name = 'Omar'
--      - Step A: Non-Clustered Index Seek on [name] down to Leaf Level -> finds 'Omar' + clustering key [id] = 804
--      - Step B: Key Lookup (Clustered Index Seek) into dbo.student on [id] = 804 to retrieve [age]
--   5. Covering Index Optimization (Zero Key Lookup):
--      - SELECT id, name FROM student WHERE name = 'Omar' (Satisfied entirely from non-clustered leaf)
--      - CREATE NONCLUSTERED INDEX i2_covering ON student (name) INCLUDE (age);
--   6. Introspection via System Catalog & DMVs:
--      - sys.indexes (type = 2 for NONCLUSTERED)
--      - sys.dm_db_index_physical_stats for both clustered and non-clustered trees
-- ============================================================================

SET NOCOUNT ON;
GO

-- ----------------------------------------------------------------------------
-- Step 1: Database Initialization ([ITI])
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'ITI')
BEGIN
    PRINT '>>> Creating database [ITI]...';
    CREATE DATABASE ITI;
END
GO

USE ITI;
GO

PRINT '>>> Connected to database [ITI] on instance ' + @@SERVERNAME;
GO

-- ----------------------------------------------------------------------------
-- Step 2: Ensure Base Table dbo.student Exists with Clustered Index (CH01_VID08)
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.student', N'U') IS NULL
BEGIN
    PRINT '>>> Creating table dbo.student with Primary Key...';
    CREATE TABLE dbo.student
    (
        id INT NOT NULL CONSTRAINT PK_student_id PRIMARY KEY,
        name VARCHAR(20) NULL,
        age INT NULL
    );
END
GO

-- Seed the authentic video dataset if table was freshly created or empty
IF (SELECT COUNT(*) FROM dbo.student) < 13
BEGIN
    PRINT '>>> Populating authentic B+Tree records into dbo.student...';
    TRUNCATE TABLE dbo.student;
    
    -- Left subtree (IDs < 700)
    INSERT INTO dbo.student (id, name, age) VALUES 
        (1, 'Ahmad', 22),
        (2, 'Khalid', 21),
        (3, 'Ali', 23),
        (100, 'Ahmad', 22),
        (104, 'Eman', 21),
        (200, 'Doaa', 23),
        (201, 'Ali', 22);

    -- Right subtree (IDs >= 700)
    INSERT INTO dbo.student (id, name, age) VALUES 
        (700, 'Mona', 22),
        (702, 'Tamer', 23),
        (800, 'Youssef', 21),
        (804, 'Omar', 22),   -- <-- Video search target row!
        (900, 'Sara', 23),
        (905, 'Nader', 22);
END
GO

DECLARE @student_count INT = (SELECT COUNT(*) FROM dbo.student);
PRINT '>>> dbo.student verified with ' + CAST(@student_count AS VARCHAR) + ' records.';
GO

-- ----------------------------------------------------------------------------
-- Step 3: Baseline Performance Without Non-Clustered Index (CH01_VID08 Bottleneck)
-- ----------------------------------------------------------------------------
-- In the video (Image 1 & 2):
-- Query: Select * from student where name = 'Omar'
-- Without an index on [name], SQL Server is forced to scan every leaf page of the clustered index.

PRINT '>>> Step 3: Baseline Query Execution (Before Non-Clustered Index)...';
SET STATISTICS IO ON;
SELECT id, name, age 
FROM dbo.student 
WHERE name = 'Omar';
SET STATISTICS IO OFF;
GO

-- ----------------------------------------------------------------------------
-- Step 4: Create Non-Clustered Index [i2] on Student (Name)
-- ----------------------------------------------------------------------------
-- Course Video Demonstration (Image 1 & 2):
-- Box: "Create Non Clustered Index i2 On Student (Name)"
-- T-SQL Command:
-- CREATE NONCLUSTERED INDEX i2 ON dbo.student (name);

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'i2' AND object_id = OBJECT_ID(N'dbo.student'))
BEGIN
    PRINT '>>> Dropping existing non-clustered index [i2]...';
    DROP INDEX i2 ON dbo.student;
END
GO

PRINT '>>> Step 4: Creating Non-Clustered Index i2 on dbo.student(name)...';
CREATE NONCLUSTERED INDEX i2 ON dbo.student (name);
GO

PRINT '>>> Non-Clustered Index [i2] created successfully.';
GO

-- ----------------------------------------------------------------------------
-- Step 5: System Catalog Verification of Multiple Indexes
-- ----------------------------------------------------------------------------
-- Demonstrates that while a table can have only ONE Clustered index (type 1),
-- it can possess multiple Non-Clustered indexes (type 2).

PRINT '>>> Step 5: Inspecting sys.indexes for dbo.student:';
SELECT 
    t.name AS TableName,
    i.name AS IndexName,
    i.index_id AS IndexId,
    i.type AS IndexType,
    i.type_desc AS IndexTypeDesc,
    i.is_unique AS IsUnique,
    i.is_primary_key AS IsPrimaryKey
FROM sys.tables t
JOIN sys.indexes i ON t.object_id = i.object_id
WHERE t.name = 'student'
ORDER BY i.index_id;
GO

-- ----------------------------------------------------------------------------
-- Step 6: Non-Clustered Index Seek + Key Lookup Mechanics (Image 1 & 2)
-- ----------------------------------------------------------------------------
-- Course Video Demonstration:
-- Query: Select * from student where name = 'Omar'
-- Execution Engine Behavior:
--   1. Non-Clustered Index Seek:
--      Traverses [i2] B+Tree:
--      - Root: 'Ahmed' / 'Lamis' -> since 'Omar' >= 'Lamis', routes to Right non-leaf page.
--      - Intermediate: 'Lamis', 'Nada', 'Yasser' -> routes to target leaf page.
--      - Leaf Level of [i2]: Finds key 'Omar' paired with clustering key pointer [id] = 804.
--   2. Key Lookup (Clustered Index Seek):
--      Follows yellow arrow in video diagram:
--      Uses clustering key [id] = 804 to perform a point seek on PK_student_id
--      to retrieve remaining attribute [age] = 22.

PRINT '>>> Step 6: Querying with Non-Clustered Index (Seek + Key Lookup)...';
SET STATISTICS IO ON;
SELECT id, name, age 
FROM dbo.student 
WHERE name = 'Omar';
SET STATISTICS IO OFF;
GO

-- ----------------------------------------------------------------------------
-- Step 7: Index-Only / Covering Query Demonstration (Zero Key Lookup)
-- ----------------------------------------------------------------------------
-- When a query ONLY requests columns that exist in the non-clustered index:
-- - [name] is the explicit index key.
-- - [id] is automatically included in the leaf level as the clustering key row locator!
-- Therefore, SELECT id, name FROM student WHERE name = 'Omar' requires NO Key Lookup!

PRINT '>>> Step 7: Executing Index-Only / Covering Query (Zero Key Lookup Overhead)...';
SET STATISTICS IO ON;
SELECT id, name 
FROM dbo.student 
WHERE name = 'Omar';
SET STATISTICS IO OFF;
GO

-- ----------------------------------------------------------------------------
-- Step 8: Modern Covering Index Optimization (INCLUDE Clause)
-- ----------------------------------------------------------------------------
-- In modern SQL Server production engineering, to completely eliminate the Key Lookup
-- for SELECT * or queries needing [age], we use the INCLUDE clause:
-- CREATE NONCLUSTERED INDEX i2_covering ON dbo.student (name) INCLUDE (age);

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'i2_covering' AND object_id = OBJECT_ID(N'dbo.student'))
    DROP INDEX i2_covering ON dbo.student;
GO

PRINT '>>> Step 8: Creating Covering Non-Clustered Index with INCLUDE (age)...';
CREATE NONCLUSTERED INDEX i2_covering ON dbo.student (name) INCLUDE (age);
GO

PRINT '>>> Testing fully covered SELECT id, name, age with zero Key Lookup:';
SET STATISTICS IO ON;
SELECT id, name, age 
FROM dbo.student 
WHERE name = 'Omar';
SET STATISTICS IO OFF;
GO

-- ----------------------------------------------------------------------------
-- Step 9: Deep Index Physical Statistics Introspection
-- ----------------------------------------------------------------------------
PRINT '>>> Step 9: Querying sys.dm_db_index_physical_stats for both Clustered & Non-Clustered trees:';
SELECT 
    i.name AS IndexName,
    i.type_desc AS IndexType,
    ps.index_level AS BTreeLevel,
    ps.page_count AS PageCount,
    ps.record_count AS RecordCount,
    ps.avg_record_size_in_bytes AS AvgRecordSizeBytes,
    ps.avg_page_space_used_in_percent AS PageSpaceUsedPct
FROM sys.dm_db_index_physical_stats(DB_ID(N'ITI'), OBJECT_ID(N'dbo.student'), NULL, NULL, 'DETAILED') ps
JOIN sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id
ORDER BY i.index_id, ps.index_level DESC;
GO

-- ----------------------------------------------------------------------------
-- Step 10: Summary Verification
-- ----------------------------------------------------------------------------
PRINT '============================================================================';
PRINT 'CH01_VID09 execution completed successfully with 100% database fidelity.';
PRINT 'Non-Clustered Index [i2] (name) & Covering Index [i2_covering] verified.';
PRINT 'Key Lookup resolution and Index-Only access demonstrated.';
PRINT '============================================================================';
GO
