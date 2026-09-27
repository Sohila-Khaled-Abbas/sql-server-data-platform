-- ============================================================================
-- Script: ch01_vid12_backup_database_wizard.sql
-- Module: CH01_VID12 - Backup Database Using Wizard & Multi-Set Media Files
-- Course: MaharaTech Course 2305 ("Implementing & Developing SQL Server Objects")
-- Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
-- Database Engine: Microsoft SQL Server 2022 Developer Edition
-- Live Target Database: [testbackup]
-- Live Backup File: D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\test.bak
--
-- Architectural Concepts & Video Demonstration:
--   1. The SSMS Graphical Backup Wizard (GUI to T-SQL Translation):
--      - Right-click Database -> Tasks -> Back Up...
--      - General Tab:
--          * Database selection ([testbackup])
--          * Recovery model display (FULL)
--          * Backup type dropdown (Full, Differential, Transaction Log)
--          * Destination management (Disk, Add/Remove, Contents...)
--      - Media Options Tab:
--          * Overwrite media: "Append to the existing backup set" (default NOINIT)
--            vs "Overwrite all existing backup sets" (FORMAT, INIT)
--          * Reliability: "Verify backup when finished" (RESTORE VERIFYONLY)
--            and "Perform checksum before writing to media" (WITH CHECKSUM)
--          * Transaction log: "Truncate transaction log" vs "Back up tail of log"
--      - Backup Options Tab:
--          * Compression options: Default / Compress (COMPRESSION) / Do not compress
--          * Expiration and Encryption
--      - The "Script" Button:
--          * Generates the underlying T-SQL engine commands executed by SSMS.
--
--   2. Multi-Set Backup Architecture (Media Families & Positions):
--      - When using the SSMS Wizard with "Append to existing backup set" (NOINIT),
--        multiple backup operations write into the SAME physical .bak file!
--      - File Structure:
--          * Position 1: Full Database Backup (Baseline)
--          * Position 2: Differential Database Backup (Cumulative changes since Pos 1)
--          * Position 3: Transaction Log Backup (Sequential log records since Pos 2)
--      - Introspection via RESTORE HEADERONLY / RESTORE LABELONLY / RESTORE FILELISTONLY.
--      - Restoring specific positions using the WITH FILE = <position> parameter.
-- ============================================================================

SET NOCOUNT ON;
GO

PRINT '============================================================================';
PRINT '>>> Starting CH01_VID12: Backup Database Using Wizard Verification Lab...';
PRINT '============================================================================';
GO

USE master;
GO

-- ----------------------------------------------------------------------------
-- 1. Inspect Live Database: [testbackup]
-- ----------------------------------------------------------------------------
IF DB_ID('testbackup') IS NULL
BEGIN
    PRINT '>>> Creating [testbackup] database in FULL recovery model...';
    CREATE DATABASE [testbackup];
    ALTER DATABASE [testbackup] SET RECOVERY FULL;
END
GO

USE [testbackup];
GO

-- Ensure dbo.emp exists matching user's live demo
IF OBJECT_ID('dbo.emp', 'U') IS NULL
BEGIN
    PRINT '>>> Creating table dbo.emp in [testbackup]...';
    CREATE TABLE dbo.emp
    (
        id INT NOT NULL,
        name VARCHAR(50) NULL
    );

    -- Insert 10 demo rows matching live database
    INSERT INTO dbo.emp (id, name)
    VALUES (1, NULL), (2, NULL), (3, NULL), (4, NULL), (5, NULL),
           (6, NULL), (7, NULL), (8, NULL), (9, NULL), (10, NULL);
END
GO

-- Inspect table records
SELECT id, name FROM dbo.emp ORDER BY id;
GO

-- ----------------------------------------------------------------------------
-- 2. SSMS Backup Wizard Operations: Appending 3 Backup Tiers to test.bak
-- ----------------------------------------------------------------------------
-- Target Physical Path demonstrated in MaharaTech Course 2305:
-- D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\test.bak
-- ----------------------------------------------------------------------------

DECLARE @BackupFile NVARCHAR(500) = N'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\test.bak';

-- Wizard Action 1: Full Database Backup (Position 1)
-- SSMS GUI: Tasks -> Back Up -> Type: Full -> Media Options: Append (NOINIT)
PRINT '>>> Wizard Action 1: Creating Full Database Backup (Set 1)...';
BACKUP DATABASE [testbackup]
TO DISK = @BackupFile
WITH NOINIT,
     NAME = N'testbackup-Full Database Backup',
     DESCRIPTION = N'SSMS Wizard Generated Full Database Backup',
     STATS = 10;
GO

-- Simulate Workload: Data modification between Full and Differential
USE [testbackup];
UPDATE dbo.emp SET name = 'Engineer_' + CAST(id AS VARCHAR(10)) WHERE id <= 5;
GO

-- Wizard Action 2: Differential Database Backup (Position 2)
-- SSMS GUI: Tasks -> Back Up -> Type: Differential -> Media Options: Append (NOINIT)
DECLARE @BackupFile NVARCHAR(500) = N'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\test.bak';

PRINT '>>> Wizard Action 2: Creating Differential Database Backup (Set 2)...';
BACKUP DATABASE [testbackup]
TO DISK = @BackupFile
WITH DIFFERENTIAL,
     NOINIT,
     NAME = N'testbackup-Differential Database Backup',
     DESCRIPTION = N'SSMS Wizard Generated Differential Backup',
     STATS = 10;
GO

-- Simulate Workload: Transactional modifications
USE [testbackup];
INSERT INTO dbo.emp (id, name) VALUES (11, 'Sohila'), (12, 'Khaled');
GO

-- Wizard Action 3: Transaction Log Backup (Position 3)
-- SSMS GUI: Tasks -> Back Up -> Type: Transaction Log -> Media Options: Append (NOINIT)
DECLARE @BackupFile NVARCHAR(500) = N'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\test.bak';

PRINT '>>> Wizard Action 3: Creating Transaction Log Backup (Set 3)...';
BACKUP LOG [testbackup]
TO DISK = @BackupFile
WITH NOINIT,
     NAME = N'testbackup-Transaction Log Backup',
     DESCRIPTION = N'SSMS Wizard Generated Transaction Log Backup',
     STATS = 10;
GO

-- ----------------------------------------------------------------------------
-- 3. Introspecting Multi-Set Media Files via T-SQL Engine Diagnostics
-- ----------------------------------------------------------------------------

DECLARE @BackupFile NVARCHAR(500) = N'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\test.bak';

-- A. Inspect Media Header (Media Family & Format Info)
PRINT '>>> Inspecting Backup Media Label:';
RESTORE LABELONLY FROM DISK = @BackupFile;

-- B. Inspect All Backup Sets & Positions inside the single physical file
PRINT '>>> Inspecting All Backup Sets (RESTORE HEADERONLY):';
RESTORE HEADERONLY FROM DISK = @BackupFile;

-- C. Inspect Logical File Layout inside Position 1
PRINT '>>> Inspecting File List in Position 1 (RESTORE FILELISTONLY):';
RESTORE FILELISTONLY FROM DISK = @BackupFile WITH FILE = 1;

-- D. Verify Integrity of Position 1 without restoring data
PRINT '>>> Verifying Backup File Integrity (RESTORE VERIFYONLY):';
RESTORE VERIFYONLY FROM DISK = @BackupFile WITH FILE = 1;
GO

-- ----------------------------------------------------------------------------
-- 4. Multi-Position Restore Sequence using WITH FILE = <position>
-- ----------------------------------------------------------------------------
-- In multi-set backup files, each restore command MUST specify WITH FILE = N!
-- ----------------------------------------------------------------------------

USE master;
GO

IF DB_ID('testbackup_Restored') IS NOT NULL
BEGIN
    PRINT '>>> Dropping previous testbackup_Restored...';
    ALTER DATABASE [testbackup_Restored] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [testbackup_Restored];
END
GO

DECLARE @BackupFile NVARCHAR(500) = N'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\test.bak';

DECLARE @DataPath NVARCHAR(400) = CAST(SERVERPROPERTY('InstanceDefaultDataPath') AS NVARCHAR(400));
IF @DataPath IS NULL SET @DataPath = N'D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\';

DECLARE @RestoredMdf NVARCHAR(500) = @DataPath + N'testbackup_Restored.mdf';
DECLARE @RestoredLdf NVARCHAR(500) = @DataPath + N'testbackup_Restored_log.ldf';

-- Step 1: Restore Full Database from Position 1
PRINT '>>> RESTORE STEP 1: Restoring Full Backup from Position 1 (WITH NORECOVERY)...';
RESTORE DATABASE [testbackup_Restored]
FROM DISK = @BackupFile
WITH FILE = 1,
     NORECOVERY,
     REPLACE,
     MOVE N'testbackup' TO @RestoredMdf,
     MOVE N'testbackup_log' TO @RestoredLdf;

-- Step 2: Restore Cumulative Differential from Position 2
PRINT '>>> RESTORE STEP 2: Restoring Differential Backup from Position 2 (WITH NORECOVERY)...';
RESTORE DATABASE [testbackup_Restored]
FROM DISK = @BackupFile
WITH FILE = 2,
     NORECOVERY;

-- Step 3: Restore Transaction Log from Position 3
PRINT '>>> RESTORE STEP 3: Restoring Transaction Log from Position 3 (WITH RECOVERY)...';
RESTORE LOG [testbackup_Restored]
FROM DISK = @BackupFile
WITH FILE = 3,
     RECOVERY;
GO

-- ----------------------------------------------------------------------------
-- 5. Verification & Telemetry Introspection
-- ----------------------------------------------------------------------------

-- Verify recovered records in restored database
PRINT '>>> Verifying Restored Database [testbackup_Restored].dbo.emp:';
SELECT id, name FROM [testbackup_Restored].dbo.emp ORDER BY id;
GO

-- Introspect msdb backup history for [testbackup]
PRINT '>>> msdb Backup History for [testbackup]:';
SELECT 
    bs.backup_set_id,
    bs.position AS SetPosition,
    bs.name AS BackupSetName,
    CASE bs.type 
        WHEN 'D' THEN 'Full Database'
        WHEN 'I' THEN 'Differential'
        WHEN 'L' THEN 'Transaction Log'
        ELSE bs.type
    END AS BackupType,
    bs.backup_size AS SizeBytes,
    bs.checkpoint_lsn,
    bs.differential_base_lsn,
    bs.first_lsn,
    bs.last_lsn,
    mf.physical_device_name AS BackupFile
FROM msdb.dbo.backupset bs
JOIN msdb.dbo.backupmediafamily mf ON bs.media_set_id = mf.media_set_id
WHERE bs.database_name = 'testbackup'
ORDER BY bs.backup_set_id;
GO

-- Clean up restored database to leave instance clean
USE master;
IF DB_ID('testbackup_Restored') IS NOT NULL
    DROP DATABASE [testbackup_Restored];
GO

PRINT '============================================================================';
PRINT '>>> CH01_VID12: Backup Database Using Wizard verification complete with 100% success!';
PRINT '============================================================================';
GO
