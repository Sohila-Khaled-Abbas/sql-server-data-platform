/* ============================================================================
   Script: 01_filegroups_and_files.sql
   Module: 01_storage_and_schema
   Purpose: Provisions the OmniFlowDB transactional database with an enterprise
            multi-filegroup physical layout (PRIMARY, DATA_FG, INDEX_FG, ARCHIVE_FG).
   Design Principles:
     - Isolates SQL Server catalogs from user tables
     - Separates random index IO from sequential data IO
     - Enables physical storage tiering for partitioned historical archives
     - Dynamically detects instance storage paths (Windows local & Linux Docker)
   ============================================================================ */

USE master;
GO

SET NOCOUNT ON;
GO

-- 1. Determine Default Data and Log File Paths Dynamically
DECLARE @DefaultDataPath NVARCHAR(512) = CAST(SERVERPROPERTY('InstanceDefaultDataPath') AS NVARCHAR(512));
DECLARE @DefaultLogPath  NVARCHAR(512) = CAST(SERVERPROPERTY('InstanceDefaultLogPath')  AS NVARCHAR(512));

-- Fallback defaults if instance properties return NULL
IF @DefaultDataPath IS NULL OR @DefaultDataPath = ''
BEGIN
    SELECT TOP (1) 
        @DefaultDataPath = LEFT(physical_name, LEN(physical_name) - CHARINDEX('\', REVERSE(physical_name)) + 1)
    FROM sys.master_files
    WHERE database_id = 1 AND type = 0; -- master data file path
END;

IF @DefaultLogPath IS NULL OR @DefaultLogPath = ''
BEGIN
    SELECT TOP (1) 
        @DefaultLogPath = LEFT(physical_name, LEN(physical_name) - CHARINDEX('\', REVERSE(physical_name)) + 1)
    FROM sys.master_files
    WHERE database_id = 1 AND type = 1; -- master log file path
END;

-- Ensure trailing slash
IF RIGHT(@DefaultDataPath, 1) NOT IN ('\', '/') 
    SET @DefaultDataPath = @DefaultDataPath + '\';
IF RIGHT(@DefaultLogPath, 1) NOT IN ('\', '/') 
    SET @DefaultLogPath = @DefaultLogPath + '\';

PRINT '>>> Detected Storage Paths:';
PRINT '    Data Path: ' + @DefaultDataPath;
PRINT '    Log Path:  ' + @DefaultLogPath;

-- 2. Create Database if not exists
IF DB_ID(N'OmniFlowDB') IS NULL
BEGIN
    PRINT '>>> Creating database OmniFlowDB with multi-filegroup topology...';
    
    DECLARE @SQL NVARCHAR(MAX);
    SET @SQL = N'
    CREATE DATABASE [OmniFlowDB]
    ON PRIMARY
    (
        NAME = N''OmniFlowDB_Primary'',
        FILENAME = N''' + @DefaultDataPath + N'OmniFlowDB_Primary.mdf'',
        SIZE = 64MB,
        FILEGROWTH = 64MB
    ),
    FILEGROUP [DATA_FG]
    (
        NAME = N''OmniFlowDB_Data'',
        FILENAME = N''' + @DefaultDataPath + N'OmniFlowDB_Data.ndf'',
        SIZE = 128MB,
        FILEGROWTH = 128MB
    ),
    FILEGROUP [INDEX_FG]
    (
        NAME = N''OmniFlowDB_Index'',
        FILENAME = N''' + @DefaultDataPath + N'OmniFlowDB_Index.ndf'',
        SIZE = 64MB,
        FILEGROWTH = 64MB
    ),
    FILEGROUP [ARCHIVE_FG]
    (
        NAME = N''OmniFlowDB_Archive'',
        FILENAME = N''' + @DefaultDataPath + N'OmniFlowDB_Archive.ndf'',
        SIZE = 128MB,
        FILEGROWTH = 128MB
    )
    LOG ON
    (
        NAME = N''OmniFlowDB_Log'',
        FILENAME = N''' + @DefaultLogPath + N'OmniFlowDB_Log.ldf'',
        SIZE = 64MB,
        FILEGROWTH = 64MB
    );';

    EXEC sp_executesql @SQL;
    PRINT '>>> Database OmniFlowDB created successfully.';
END
ELSE
BEGIN
    PRINT '>>> Database OmniFlowDB already exists. Verifying filegroups...';
END;
GO

-- 3. Configure Database Options for High-Concurrency & DBRE Standards
USE [OmniFlowDB];
GO

-- Set DATA_FG as the default filegroup so accidental user tables are not placed on PRIMARY
IF EXISTS (SELECT 1 FROM sys.filegroups WHERE name = N'DATA_FG' AND is_default = 0)
BEGIN
    ALTER DATABASE [OmniFlowDB] MODIFY FILEGROUP [DATA_FG] DEFAULT;
    PRINT '>>> Set DATA_FG as the default filegroup.';
END;
GO

-- Enable Read Committed Snapshot Isolation (RCSI) for non-blocking reads
ALTER DATABASE [OmniFlowDB] SET READ_COMMITTED_SNAPSHOT ON WITH ROLLBACK IMMEDIATE;
ALTER DATABASE [OmniFlowDB] SET ALLOW_SNAPSHOT_ISOLATION ON;
PRINT '>>> Enabled Snapshot Isolation and RCSI.';
GO

-- Enable Page-Level Checksums for Early Detection of IO Subsystem Corruption
ALTER DATABASE [OmniFlowDB] SET PAGE_VERIFY CHECKSUM WITH NO_WAIT;
PRINT '>>> Enabled PAGE_VERIFY CHECKSUM.';
GO

-- Configure Query Store for Performance Telemetry (SQL Server 2022 Best Practice)
ALTER DATABASE [OmniFlowDB] SET QUERY_STORE = ON;
ALTER DATABASE [OmniFlowDB] SET QUERY_STORE (
    OPERATION_MODE = READ_WRITE,
    CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30),
    DATA_FLUSH_INTERVAL_SECONDS = 900,
    MAX_STORAGE_SIZE_MB = 1024,
    QUERY_CAPTURE_MODE = AUTO
);
PRINT '>>> Configured Query Store.';
GO

-- 4. Audit Verification: Output Physical Layout & File Allocation
SELECT 
    fg.name AS [FilegroupName],
    fg.is_default AS [IsDefault],
    df.name AS [LogicalFileName],
    df.physical_name AS [PhysicalFilePath],
    CAST(df.size * 8.0 / 1024 AS DECIMAL(10,2)) AS [CurrentSizeMB],
    CASE 
        WHEN df.is_percent_growth = 1 THEN CAST(df.growth AS VARCHAR(10)) + '%'
        ELSE CAST(df.growth * 8 / 1024 AS VARCHAR(10)) + ' MB'
    END AS [FileGrowth]
FROM sys.filegroups fg
JOIN sys.database_files df ON fg.data_space_id = df.data_space_id
ORDER BY fg.name, df.name;
GO
