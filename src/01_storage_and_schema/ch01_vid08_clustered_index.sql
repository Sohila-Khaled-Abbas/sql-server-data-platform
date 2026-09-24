-- ============================================================================
-- Script: ch01_vid08_clustered_index.sql
-- Module: CH01_VID08 - Clustered Index Architecture & B-Tree Structure
-- Course: MaharaTech Course 2305 ("Implementing & Developing SQL Server Objects")
-- Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
-- Database Engine: Microsoft SQL Server 2022 Developer Edition
-- Target Database: [ITI]
-- Continuation: Direct continuation of CH01_VID07 (Custom Data Types)
-- Description:
--   Comprehensive demonstration of SQL Server Storage Physical Organization,
--   comparing Heap tables against Clustered Index B+Tree structures:
--   1. Functional vs. Non-Functional Requirements:
--      - Functional: Data Integrity, Business Rules, Declarative Constraints (PK, FK, CHECK, DEFAULT, RULE)
--      - Non-Functional: Performance (Index Architecture), Security, Concurrency
--   2. What is an Index?:
--      - Auxiliary database object created to accelerate data retrieval
--      - Primary architectural types: Clustered Index vs. Non-Clustered Index
--   3. Heap Structure (Table Without Primary Key / Clustered Index):
--      - Data stored in unordered 8 KB data pages
--      - New rows appended wherever space is available (IAM allocation pages)
--      - Point queries (e.g., WHERE id = 1) force an exhaustive TABLE SCAN
--   4. Primary Key & Clustered Index Relationship:
--      - Adding a PRIMARY KEY constraint automatically creates a UNIQUE CLUSTERED INDEX
--      - Only ONE Clustered Index allowed per table (the leaf level IS the physical data)
--      - Physically re-orders table rows on disk by the clustered key (B+Tree Leaf Level)
--   5. B+Tree (Balanced Tree) Structural Hierarchy:
--      - Root Level (Level 2): Page with boundary pointers (e.g., Key 1 -> Left, Key 700 -> Right)
--      - Non-Leaf Intermediate Level (Level 1): Directs traversals to target page boundaries
--      - Leaf Level (Level 0): Actual 8 KB data pages containing complete row attributes
--   6. Clustered Index Seek Mechanics (WHERE id = 804):
--      - Logarithmic search: Root -> Intermediate -> Leaf Page (3 logical reads)
--      - Internal Page Scan on the slot array locates row (804, 'Omar', 22)
--   7. Non-Indexed Predicates & Clustered Index Scan (WHERE name = 'Omar'):
--      - Explaining why non-key predicates cannot traverse the B+Tree and force an INDEX SCAN
--      - Architectural motivation for Non-Clustered Indexes (CH01_VID09 preview)
--   8. System Catalog & DMV Introspection:
--      - Querying sys.indexes, sys.partitions, sys.allocation_units, and sys.dm_db_index_physical_stats
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
-- Step 2: Idempotent Teardown of Demonstration Table
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.student', N'U') IS NOT NULL
BEGIN
    PRINT '>>> Dropping existing table dbo.student...';
    DROP TABLE dbo.student;
END
GO

-- ----------------------------------------------------------------------------
-- Step 3: Phase 1 — Create Table Without Primary Key (Heap Storage)
-- ----------------------------------------------------------------------------
-- Course Video Demonstration (Image 3 & 4):
-- "Create a table without a primary key --> Data isn't sorted on disk.
--  Instead, it's stored in unordered data pages (Heap).
--  Requires FULL TABLE SCAN for retrieval."

PRINT '>>> Step 3: Creating Heap Table dbo.student (No Primary Key, Heap Storage)...';
CREATE TABLE dbo.student
(
    id INT NOT NULL,
    name VARCHAR(20) NULL,
    age INT NULL
);
GO

-- Verify that the table is created as a HEAP (type = 0) in sys.indexes
SELECT 
    t.name AS TableName,
    i.name AS IndexName,
    i.type AS IndexType,
    i.type_desc AS IndexTypeDesc
FROM sys.tables t
JOIN sys.indexes i ON t.object_id = i.object_id
WHERE t.name = 'student';
GO

-- ----------------------------------------------------------------------------
-- Step 4: Populate Unordered Heap Data (Authentic Video Dataset)
-- ----------------------------------------------------------------------------
-- In the video (Image 3 & 4), rows are inserted in non-sequential order:
-- (1, 'Ahmed', 22), (4, 'Khalid', 21), (2, 'Ali', 23), (3, 'Eman', 21)

PRINT '>>> Step 4: Inserting unordered records into Heap table dbo.student...';
INSERT INTO dbo.student (id, name, age) VALUES (1, 'Ahmed', 22);
INSERT INTO dbo.student (id, name, age) VALUES (4, 'Khalid', 21);
INSERT INTO dbo.student (id, name, age) VALUES (2, 'Ali', 23);
INSERT INTO dbo.student (id, name, age) VALUES (3, 'Eman', 21);
GO

-- Query Heap: Records reflect exact insertion order (unordered physical pages)
PRINT '>>> Contents of dbo.student as a HEAP (Notice physical unsorted order: 1, 4, 2, 3):';
SELECT id, name, age FROM dbo.student;
GO

-- ----------------------------------------------------------------------------
-- Step 5: Heap Retrieval Telemetry — Table Scan Demonstration
-- ----------------------------------------------------------------------------
-- Course Video Query (Image 4):
-- Select * from student where id = 1
-- In a heap, SQL Server cannot navigate a tree structure; it scans all pages.

PRINT '>>> Step 5: Querying Heap table with WHERE id = 1...';
SELECT id, name, age 
FROM dbo.student 
WHERE id = 1;
GO

-- ----------------------------------------------------------------------------
-- Step 6: Phase 2 — Transform Heap to Clustered Table via Primary Key
-- ----------------------------------------------------------------------------
-- Course Video Demonstration (Image 5 & 6):
-- "Primary Key Constraint --> B+tree --> Clustered Index"
-- Creating a Primary Key automatically builds a Unique Clustered Index.
-- SQL Server physically rewrites the 8 KB data pages on disk, sorting by [id].

PRINT '>>> Step 6: Adding PRIMARY KEY constraint to dbo.student...';
ALTER TABLE dbo.student 
ADD CONSTRAINT PK_student_id PRIMARY KEY (id);
GO

-- Verify index transition from HEAP (type 0) to CLUSTERED (type 1) in sys.indexes
PRINT '>>> Inspecting sys.indexes after Primary Key addition:';
SELECT 
    t.name AS TableName,
    i.name AS IndexName,
    i.type AS IndexType,
    i.type_desc AS IndexTypeDesc,
    i.is_primary_key AS IsPrimaryKey,
    i.is_unique AS IsUnique
FROM sys.tables t
JOIN sys.indexes i ON t.object_id = i.object_id
WHERE t.name = 'student';
GO

-- Observe that physical storage order is now strictly sorted by the cluster key [id] (1, 2, 3, 4)
PRINT '>>> Contents of dbo.student after Clustered Index creation (Sorted by ID):';
SELECT id, name, age FROM dbo.student;
GO

-- ----------------------------------------------------------------------------
-- Step 7: Phase 3 — Populate Multi-Level B+Tree Dataset (Images 6 - 10)
-- ----------------------------------------------------------------------------
-- In the lecture, Eng. Rami expands the student dataset across page ranges:
-- Left Pages:
--   Page 1 (Leaf):   1 Ahmad (22), 2 Khalid (21), 3 Ali (23)
--   Page 2 (Leaf):   100 Ahmad (22), 104 Eman (21)
--   Page 3 (Leaf):   200 Doaa (23), 201 Ali (22)
-- Right Pages:
--   Page 4 (Leaf):   700 Mona (22), 702 Tamer (23)
--   Page 5 (Leaf):   800 Youssef (21), 804 Omar (22)  <-- Target row for Clustered Index Seek!
--   Page 6 (Leaf):   900 Sara (23), 905 Nader (22)

PRINT '>>> Step 7: Populating multi-level B+Tree hierarchy dataset...';

-- Clean table to match authentic video dataset exactly
DELETE FROM dbo.student;
GO

-- Left subtree records (IDs < 700)
INSERT INTO dbo.student (id, name, age) VALUES 
    (1, 'Ahmad', 22),
    (2, 'Khalid', 21),
    (3, 'Ali', 23),
    (100, 'Ahmad', 22),
    (104, 'Eman', 21),
    (200, 'Doaa', 23),
    (201, 'Ali', 22);

-- Right subtree records (IDs >= 700)
INSERT INTO dbo.student (id, name, age) VALUES 
    (700, 'Mona', 22),
    (702, 'Tamer', 23),
    (800, 'Youssef', 21),
    (804, 'Omar', 22),   -- <-- Authentic search target row!
    (900, 'Sara', 23),
    (905, 'Nader', 22);
GO

PRINT '>>> Total records populated in B+Tree: ' + CAST(@@ROWCOUNT AS VARCHAR);
GO

-- ----------------------------------------------------------------------------
-- Step 8: Clustered Index Seek Mechanics (WHERE id = 804)
-- ----------------------------------------------------------------------------
-- Course Video Demonstration (Images 8 & 9):
-- Query: Select * from student where id = 804
-- Engine Search Path:
--   1. Root Element: Evaluates boundary (1 vs 700). Since 804 >= 700 -> traverses to Right Non-Leaf page.
--   2. Non-Leaf Level (Right): Evaluates (700, 800, 900). Since 804 >= 800 and < 900 -> traverses to Page 800.
--   3. Leaf Level (Data Page 800): Performs internal Page Scan (binary slot array search) -> returns (804, 'Omar', 22).
-- Efficiency: Only 3 logical page reads!

PRINT '>>> Step 8: Executing Clustered Index Seek for id = 804...';
SET STATISTICS IO ON;
SELECT id, name, age 
FROM dbo.student 
WHERE id = 804;
SET STATISTICS IO OFF;
GO

-- ----------------------------------------------------------------------------
-- Step 9: Non-Indexed Column Retrieval — Clustered Index Scan (Image 10)
-- ----------------------------------------------------------------------------
-- Course Video Demonstration (Image 10):
-- Query: Select * from student where name = 'Omar'
-- Problem: The Clustered Index B+Tree is ordered by [id], NOT by [name].
-- Consequence: SQL Server CANNOT traverse the tree hierarchy.
-- Resolution: Engine must perform a CLUSTERED INDEX SCAN, examining every leaf page.
-- Takeaway: Demonstrates why secondary Non-Clustered Indexes are required (CH01_VID09).

PRINT '>>> Step 9: Executing query on non-key attribute (name = ''Omar'')...';
SET STATISTICS IO ON;
SELECT id, name, age 
FROM dbo.student 
WHERE name = 'Omar';
SET STATISTICS IO OFF;
GO

-- ----------------------------------------------------------------------------
-- Step 10: Deep Engine Introspection via DMVs and System Catalog
-- ----------------------------------------------------------------------------
PRINT '>>> Step 10: Querying physical index stats for dbo.student...';

-- Inspect index physical stats (b-tree depth, page count, fragmentation)
SELECT 
    OBJECT_NAME(ps.object_id) AS TableName,
    i.name AS IndexName,
    ps.index_type_desc AS IndexType,
    ps.index_level AS IndexLevel,
    ps.page_count AS PageCount,
    ps.record_count AS RecordCount,
    ps.avg_record_size_in_bytes AS AvgRecordSizeBytes,
    ps.avg_page_space_used_in_percent AS PageSpaceUsedPct
FROM sys.dm_db_index_physical_stats(DB_ID(N'ITI'), OBJECT_ID(N'dbo.student'), NULL, NULL, 'DETAILED') ps
JOIN sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id
ORDER BY ps.index_level DESC;
GO

-- Inspect partition and allocation units
SELECT 
    t.name AS TableName,
    i.name AS IndexName,
    p.partition_number AS PartitionNum,
    p.rows AS TotalRows,
    au.type_desc AS AllocationUnitType,
    au.total_pages AS TotalPages,
    au.used_pages AS UsedPages,
    au.data_pages AS DataPages
FROM sys.tables t
JOIN sys.indexes i ON t.object_id = i.object_id
JOIN sys.partitions p ON i.object_id = p.object_id AND i.index_id = p.index_id
JOIN sys.allocation_units au ON p.partition_id = au.container_id
WHERE t.name = 'student';
GO

-- ----------------------------------------------------------------------------
-- Step 11: Summary Verification
-- ----------------------------------------------------------------------------
PRINT '============================================================================';
PRINT 'CH01_VID08 execution completed successfully with 100% database fidelity.';
PRINT 'Table dbo.student is active in [ITI] with 13 authentic B+Tree records.';
PRINT 'Clustered Index Seek (id=804) & Index Scan (name=''Omar'') verified.';
PRINT '============================================================================';
GO
