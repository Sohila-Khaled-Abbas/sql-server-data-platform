/* ============================================================================
   Script: 02_snapshot_lifecycle.sql
   Module: 06_reliability_and_dr
   Purpose: Implements Database Snapshots for zero-copy read-only reporting and
            rapid point-in-time disaster recovery rollback drills.
   Storage Architecture:
     - Uses NTFS/ReFS copy-on-write sparse files
     - Each physical filegroup data file must have a corresponding snapshot file
   ============================================================================ */

USE master;
GO

SET NOCOUNT ON;
GO

PRINT '>>> Managing Database Snapshot Lifecycle for OmniFlowDB...';

-- 1. Drop existing snapshot if present
IF DB_ID(N'OmniFlowDB_Snapshot') IS NOT NULL
BEGIN
    PRINT '>>> Dropping prior snapshot OmniFlowDB_Snapshot...';
    DROP DATABASE [OmniFlowDB_Snapshot];
END;
GO

-- 2. Dynamically determine data directory
DECLARE @DataPath NVARCHAR(512) = CAST(SERVERPROPERTY('InstanceDefaultDataPath') AS NVARCHAR(512));
DECLARE @PathSep NCHAR(1) = CASE WHEN CHARINDEX('/', (SELECT TOP 1 physical_name FROM sys.master_files WHERE database_id = DB_ID('OmniFlowDB'))) > 0 THEN N'/' ELSE N'\' END;

IF @DataPath IS NULL OR @DataPath = ''
BEGIN
    SELECT TOP 1 
        @DataPath = CASE 
            WHEN CHARINDEX('/', physical_name) > 0 
                THEN LEFT(physical_name, LEN(physical_name) - CHARINDEX('/', REVERSE(physical_name)) + 1)
            WHEN CHARINDEX('\', physical_name) > 0 
                THEN LEFT(physical_name, LEN(physical_name) - CHARINDEX('\', REVERSE(physical_name)) + 1)
            ELSE physical_name
        END
    FROM sys.master_files WHERE database_id = DB_ID('OmniFlowDB') AND type = 0;
END;

IF RIGHT(@DataPath, 1) NOT IN ('\', '/') SET @DataPath = @DataPath + @PathSep;

-- 3. Create Database Snapshot
-- Notice: Every data file in PRIMARY, DATA_FG, INDEX_FG, ARCHIVE_FG must be specified!
DECLARE @SqlCreateSnap NVARCHAR(MAX);
SET @SqlCreateSnap = N'
CREATE DATABASE [OmniFlowDB_Snapshot]
ON
(
    NAME = N''OmniFlowDB_Primary'',
    FILENAME = N''' + @DataPath + N'OmniFlowDB_Primary_Snapshot.ss''
),
(
    NAME = N''OmniFlowDB_Data'',
    FILENAME = N''' + @DataPath + N'OmniFlowDB_Data_Snapshot.ss''
),
(
    NAME = N''OmniFlowDB_Index'',
    FILENAME = N''' + @DataPath + N'OmniFlowDB_Index_Snapshot.ss''
),
(
    NAME = N''OmniFlowDB_Archive'',
    FILENAME = N''' + @DataPath + N'OmniFlowDB_Archive_Snapshot.ss''
)
AS SNAPSHOT OF [OmniFlowDB];';

EXEC sp_executesql @SqlCreateSnap;
PRINT '>>> Created Snapshot: OmniFlowDB_Snapshot using NTFS sparse files.';
GO

-- 4. Demonstration: Read-Only Reporting Against Snapshot
PRINT '>>> Querying Read-Only Snapshot...';
SELECT 
    'Snapshot View' AS [DataSource],
    COUNT(*) AS [TotalOrders],
    SUM([TotalAmount]) AS [TotalRevenue]
FROM [OmniFlowDB_Snapshot].[Sales].[Orders];
GO

-- ----------------------------------------------------------------------------
-- 5. DISASTER RECOVERY DRILL: SIMULATING CATASTROPHIC HUMAN ERROR & ROLLBACK
-- ----------------------------------------------------------------------------
/*
-- STEP A: Accidental catastrophic update on production database
USE [OmniFlowDB];
UPDATE [Sales].[Orders] SET [TotalAmount] = 0.00; -- Accidental missing WHERE clause!
SELECT TOP 5 OrderId, TotalAmount FROM [Sales].[Orders];

-- STEP B: Rapid Database Rollback from Snapshot
-- (Reverts all modified pages to the snapshot state in seconds without restoring .bak files)
USE master;
ALTER DATABASE [OmniFlowDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;

RESTORE DATABASE [OmniFlowDB] 
FROM DATABASE_SNAPSHOT = 'OmniFlowDB_Snapshot';

ALTER DATABASE [OmniFlowDB] SET MULTI_USER;

-- STEP C: Verify data is restored
SELECT TOP 5 OrderId, TotalAmount FROM [OmniFlowDB].[Sales].[Orders];
*/
GO
PRINT '>>> Snapshot lifecycle and disaster recovery drill ready.';
GO
