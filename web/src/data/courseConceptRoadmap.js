/**
 * Course Concept Architecture Roadmap Data
 * =========================================
 * Authoritative taxonomy of Microsoft SQL Server 2022 & DBRE Concepts
 * aligned with MaharaTech Course 2305 (Eng. Rami Mohamed Abonagi).
 */

export const CONCEPT_CATEGORIES = [
  { id: 'storage', label: 'Storage & Physical Architecture', color: '#0ea5e9', icon: 'HardDrive' },
  { id: 'integrity', label: 'Relational Integrity & Schema', color: '#10b981', icon: 'ShieldCheck' },
  { id: 'indexing', label: 'B-Trees & Index Optimization', color: '#f59e0b', icon: 'Zap' },
  { id: 'concurrency', label: 'ACID Concurrency & Transactions', color: '#8b5cf6', icon: 'Layers' },
  { id: 'programmability', label: 'T-SQL Programmability & XML', color: '#ec4899', icon: 'Code' },
  { id: 'reliability', label: 'Reliability, HA/DR & Governance', color: '#ef4444', icon: 'Server' },
  { id: 'warehousing', label: 'Kimball Star Warehousing & BI', color: '#06b6d4', icon: 'BarChart3' }
];

export const COURSE_CONCEPTS = [
  // 1. Storage & Physical Architecture
  {
    id: 'concept-8kb-page',
    categoryId: 'storage',
    title: '8 KB Data Page & Extent Architecture',
    level: 'Foundational',
    tier: 1,
    summary: 'The fundamental unit of disk I/O in SQL Server is the 8 KB (8,192 byte) page. 8 contiguous pages form a 64 KB extent (mixed vs uniform).',
    dbreSignificance: 'Minimizes disk reads; prevents row-overflow and table fragmentation through proper sizing.',
    tSqlExample: `-- Inspect 8 KB page allocation across database files
SELECT 
    df.name AS LogicalFileName,
    df.physical_name,
    df.size * 8 / 1024 AS SizeMB,
    df.growth * 8 / 1024 AS GrowthMB
FROM sys.database_files df;`,
    videoCode: 'CH01_VID01',
    videoTitle: 'Create Database and Filegroups',
    msDocTitle: 'Pages and Extents Architecture Guide',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/relational-databases/pages-and-extents-architecture-guide'
  },
  {
    id: 'concept-filegroups',
    categoryId: 'storage',
    title: 'Multi-Filegroup Isolation Strategy',
    level: 'Intermediate',
    tier: 1,
    summary: 'Separating the PRIMARY system filegroup (.mdf) from secondary data (.ndf) and transaction log (.ldf) across distinct disk arrays.',
    dbreSignificance: 'Eliminates I/O bottlenecks, enables piecemeal disaster recovery, and protects system catalogs from user space exhaustion.',
    tSqlExample: `-- Create secondary filegroups for data and indexes
ALTER DATABASE ITItest ADD FILEGROUP fg1;
ALTER DATABASE ITItest ADD FILEGROUP fg2;
ALTER DATABASE ITItest ADD FILEGROUP fg3;`,
    videoCode: 'CH01_VID03',
    videoTitle: 'Create Database Using Code (T-SQL)',
    msDocTitle: 'Database Files and Filegroups Architecture',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-files-and-filegroups'
  },

  // 2. Relational Integrity & Schema Design
  {
    id: 'concept-domain-integrity',
    categoryId: 'integrity',
    title: 'Domain Integrity (Data Types, Checks & Defaults)',
    level: 'Foundational',
    tier: 2,
    summary: 'Enforcing the valid range, format, and nullability of attribute values using strong typing, CHECK constraints, and DEFAULT expressions.',
    dbreSignificance: 'Guarantees data correctness at the storage layer, preventing invalid entries before they reach application memory.',
    tSqlExample: `-- Enforce domain integrity on employee table
ALTER TABLE dbo.emp ADD CONSTRAINT DF_emp_eadd DEFAULT 'cairo' FOR eadd;
ALTER TABLE dbo.emp ADD CONSTRAINT CK_emp_salary CHECK (salary >= 2000.00);`,
    videoCode: 'CH01_VID04',
    videoTitle: 'Database Integrity (Domain, Entity & Referential)',
    msDocTitle: 'Create Check Constraints',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/relational-databases/tables/create-check-constraints'
  },
  {
    id: 'concept-circular-fk',
    categoryId: 'integrity',
    title: 'Circular Foreign Key Resolution',
    level: 'Intermediate',
    tier: 2,
    summary: 'Resolving mutual dependencies between two entities (e.g. Employee.Dno -> Department.DNum vs Department.MgrSSN -> Employee.SSN).',
    dbreSignificance: 'Allows strict relational integrity without compilation deadlock or seed failure through deferred ALTER TABLE binding.',
    tSqlExample: `-- Step 1: Base table with MgrSSN NULL
-- Step 2: Seed Departments and Employees
-- Step 3: Attach reverse manager foreign key
ALTER TABLE Department ADD CONSTRAINT FK_Dept_Manager 
FOREIGN KEY (MgrSSN) REFERENCES Employee(SSN);`,
    videoCode: 'CH01_VID05',
    videoTitle: 'Integrity Constraints (PK, FK, Unique, Check)',
    msDocTitle: 'Primary and Foreign Key Constraints',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints'
  },

  // 3. B-Trees & Index Optimization
  {
    id: 'concept-clustered-btree',
    categoryId: 'indexing',
    title: 'Clustered B-Tree Architecture',
    level: 'Intermediate',
    tier: 3,
    summary: 'In a Clustered Index, the physical data pages are arranged in order of the key and serve as the leaf nodes of the balanced tree.',
    dbreSignificance: 'Enables high-throughput range scans and clustered seeks; key must be narrow, unique, static, and ever-increasing.',
    tSqlExample: `-- Querying clustered index leaf pages
SELECT 
    index_type_desc, 
    page_count, 
    avg_page_space_used_in_percent, 
    avg_fragmentation_in_percent
FROM sys.dm_db_index_physical_stats(DB_ID('ITItest'), OBJECT_ID('dbo.emp'), NULL, NULL, 'DETAILED');`,
    videoCode: 'CH01_VID08',
    videoTitle: 'Clustered Index Architecture & B-Tree Structure',
    msDocTitle: 'Clustered and Nonclustered Indexes Described',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described'
  },
  {
    id: 'concept-tipping-point',
    categoryId: 'indexing',
    title: 'The Query Optimizer Tipping Point',
    level: 'Advanced',
    tier: 3,
    summary: 'The critical selectivity threshold (~2% to 5%) where random 8 KB Key Lookups become more expensive than a full table scan.',
    dbreSignificance: 'Explains why an index is ignored despite matching WHERE clauses; solved using Covering Indexes with the INCLUDE clause.',
    tSqlExample: `-- Covering Index that eliminates Key Lookups
CREATE NONCLUSTERED INDEX IX_Emp_Dnum_Covering
ON dbo.emp(dnum)
INCLUDE (salary, hiredate, netsal);`,
    videoCode: 'CH01_VID09',
    videoTitle: 'Non-Clustered Index & Covering Index Strategy',
    msDocTitle: 'Create Indexes with Included Columns',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/relational-databases/indexes/create-indexes-with-included-columns'
  },

  // 4. ACID Concurrency & Transactions
  {
    id: 'concept-rcsi',
    categoryId: 'concurrency',
    title: 'Read Committed Snapshot Isolation (RCSI)',
    level: 'Advanced',
    tier: 4,
    summary: 'Row-versioning isolation using the tempdb version store. Readers read the last committed snapshot without acquiring shared locks.',
    dbreSignificance: 'Eliminates read-write blocking deadlocks in high-throughput enterprise OLTP applications.',
    tSqlExample: `-- Enable RCSI on database
ALTER DATABASE ITItest SET READ_COMMITTED_SNAPSHOT ON WITH ROLLBACK IMMEDIATE;
-- Verify RCSI status
SELECT name, is_read_committed_snapshot_on FROM sys.databases WHERE name = 'ITItest';`,
    videoCode: 'CH02_VID14',
    videoTitle: 'Demo on Transactions, COMMIT, ROLLBACK & SAVEPOINT',
    msDocTitle: 'Transaction Locking and Row Versioning Guide',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide'
  },
  {
    id: 'concept-xact-abort',
    categoryId: 'concurrency',
    title: 'Defensive Transactions & SET XACT_ABORT ON',
    level: 'Intermediate',
    tier: 4,
    summary: 'Guarantees automatic, instantaneous transaction rollback on statement-level runtime errors, preventing orphaned uncommitted locks.',
    dbreSignificance: 'Zero zombie transactions; robust exception handling in enterprise stored procedures.',
    tSqlExample: `BEGIN TRY
    SET NOCOUNT, XACT_ABORT ON;
    BEGIN TRANSACTION;
    
    -- Transactional statements
    UPDATE dbo.emp SET overtime = 300.00 WHERE did = 10;
    
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF (XACT_STATE() <> 0) ROLLBACK TRANSACTION;
    THROW;
END CATCH;`,
    videoCode: 'CH04_VID01',
    videoTitle: 'Stored Procedures Overview & Execution Mechanics',
    msDocTitle: 'SET XACT_ABORT (Transact-SQL)',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/t-sql/statements/set-xact-abort-transact-sql'
  },

  // 5. T-SQL Programmability & XML
  {
    id: 'concept-itvf-vs-mstvf',
    categoryId: 'programmability',
    title: 'Inline TVF vs Multi-Statement TVF (MSTVF)',
    level: 'Advanced',
    tier: 5,
    summary: 'Inline Table-Valued Functions (iTVFs) are treated as parameterized views that inline directly into query execution plans.',
    dbreSignificance: 'MSTVFs use fixed cardinality estimates (prior to 2019) causing disastrous spilling; iTVFs allow full parallelization and predicate pushdown.',
    tSqlExample: `-- High-performance Inline TVF (Zero RBAR)
CREATE FUNCTION dbo.ufn_GetDepartmentEmployees(@did INT)
RETURNS TABLE
AS
RETURN (
    SELECT e.eid, e.ename, e.salary, e.netsal
    FROM dbo.emp e
    WHERE e.dnum = @did
);`,
    videoCode: 'CH02_VID08',
    videoTitle: 'Inline Statement Table-Valued Functions (iTVF)',
    msDocTitle: 'Create User-defined Functions (Database Engine)',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/create-user-defined-functions-database-engine'
  },
  {
    id: 'concept-xml-shredding',
    categoryId: 'programmability',
    title: 'Semi-Structured XML Shredding & .nodes()',
    level: 'Advanced',
    tier: 5,
    summary: 'Extracting relational rows from hierarchical XML payloads using the XQuery .nodes() and .value() methods.',
    dbreSignificance: 'Enables high-throughput multi-record ingestion across microservices without repetitive connection overhead.',
    tSqlExample: `DECLARE @xml XML = '<Employees><Emp id="101" name="Sarah"/><Emp id="102" name="Tamer"/></Employees>';

SELECT 
    T.c.value('@id', 'INT') AS EmpId,
    T.c.value('@name', 'NVARCHAR(50)') AS EmpName
FROM @xml.nodes('/Employees/Emp') AS T(c);`,
    videoCode: 'CH03_VID11',
    videoTitle: 'XML Data Shredding with .nodes() and .value()',
    msDocTitle: 'XML Data (SQL Server)',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/relational-databases/xml/xml-data-sql-server'
  },

  // 6. Reliability, HA/DR & Governance
  {
    id: 'concept-backup-chains',
    categoryId: 'reliability',
    title: 'L-S-N Log Chains & Point-In-Time Recovery (STOPAT)',
    level: 'Intermediate',
    tier: 6,
    summary: 'Restoring Full Backup followed by Differential Backup and continuous Transaction Log chains up to an exact microsecond timestamp.',
    dbreSignificance: 'Enforces strict Recovery Point Objective (RPO) and Recovery Time Objective (RTO) against ransomware or operator error.',
    tSqlExample: `-- Point-in-time restore simulation
RESTORE DATABASE ITItest_Restored 
FROM DISK = 'D:\\Backups\\ITItest_Full.bak' WITH NORECOVERY;

RESTORE LOG ITItest_Restored 
FROM DISK = 'D:\\Backups\\ITItest_Log.trn' 
WITH STOPAT = '2026-09-18 14:30:00.000', RECOVERY;`,
    videoCode: 'CH01_VID11',
    videoTitle: 'Types of Backup (Full, Differential, Log)',
    msDocTitle: 'Restore a SQL Server Database to a Point in Time',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/restore-a-sql-server-database-to-a-point-in-time-full-recovery-model'
  },
  {
    id: 'concept-database-snapshots',
    categoryId: 'reliability',
    title: 'NTFS Copy-on-Write Database Snapshots',
    level: 'Advanced',
    tier: 6,
    summary: 'Creating instantaneous read-only static views using NTFS sparse files, recording original 8 KB pages only when modified.',
    dbreSignificance: 'Enables sub-second reverts of bad deployments and offloads reporting queries without read locks on the live OLTP database.',
    tSqlExample: `CREATE DATABASE ITItest_Snapshot_PreDeploy
ON (NAME = N'ITItest_Data', FILENAME = N'D:\\Snapshots\\ITItest_Data.ss'),
   (NAME = N'ITItest_fg1', FILENAME = N'D:\\Snapshots\\ITItest_fg1.ss')
AS SNAPSHOT OF ITItest;`,
    videoCode: 'CH01_VID15',
    videoTitle: 'Create Database Snapshot Using T-SQL',
    msDocTitle: 'Database Snapshots (SQL Server)',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-snapshots-sql-server'
  },

  // 7. Kimball Star Warehousing & BI
  {
    id: 'concept-scd-type2',
    categoryId: 'warehousing',
    title: 'Kimball Dimensional Modeling & SCD Type 2',
    level: 'Advanced',
    tier: 7,
    summary: 'Distinguishing 3NF transactional models from analytical star schemas; tracking historical dimension attribute changes with temporal validity flags.',
    dbreSignificance: 'Maintains historical business truth for executive reporting, preventing historical metrics from shifting when attributes update.',
    tSqlExample: `-- Slowly Changing Dimension Type 2 Schema
CREATE TABLE dw.DimCustomer (
    CustomerSK INT IDENTITY(1,1) PRIMARY KEY,
    CustomerId INT NOT NULL,
    CustomerName NVARCHAR(100),
    PostalCode NVARCHAR(20),
    ValidFrom DATETIME2 NOT NULL,
    ValidTo DATETIME2 NOT NULL,
    IsCurrent BIT NOT NULL DEFAULT 1
);`,
    videoCode: 'CH05_VID16',
    videoTitle: 'Slowly Changing Dimensions (SCD Type 1 & 2)',
    msDocTitle: 'Data Warehousing with SQL Server and Azure Synapse',
    msDocUrl: 'https://learn.microsoft.com/en-us/sql/relational-databases/indexes/columnstore-indexes-data-warehouse'
  }
];
