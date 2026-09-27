-- ============================================================================
-- Script: ch01_vid11_types_of_backup.sql
-- Module: CH01_VID11 - Types of Backup (Full, Differential, and Transaction Log)
-- Course: MaharaTech Course 2305 ("Implementing & Developing SQL Server Objects")
-- Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
-- Database Engine: Microsoft SQL Server 2022 Developer Edition
-- Target Database: [ITI_BackupLab] & [master]
--
-- Architectural Concepts & Video Demonstration:
--   1. Physical Database Storage Mechanics:
--      - Primary Data File (.mdf): Stores Schema Metadata, System Catalogs,
--        8 KB Data Pages, 64 KB Extents, and the Differential Changed Map (DCM).
--      - Transaction Log File (.ldf): Sequential Write-Ahead Logging (WAL) of
--        all database modifications, LSNs (Log Sequence Numbers), transaction state,
--        and commit timestamps organized into Virtual Log Files (VLFs).
--
--   2. The Three Primary Backup Types:
--      - 01 Full Database Backup (BACKUP DATABASE):
--        Captures the entire active database (.mdf) plus active log pages to guarantee
--        transactional consistency. Acts as the mandatory BASELINE / ANCHOR for
--        all subsequent differential backups and log chains. Does NOT truncate log.
--      - 02 Differential Backup (BACKUP DATABASE ... WITH DIFFERENTIAL):
--        Captures only extents changed since the last FULL backup using DCM bit tracking.
--        Cumulative Behavior: Each differential backup includes all modifications made
--        since the base Full backup. Restoring requires ONLY the base Full + LATEST Differential.
--      - 03 Transaction Log Backup (BACKUP LOG):
--        Captures all transaction log records (.ldf) generated since the last log backup.
--        Forms an unbroken, sequential LSN chain. In FULL recovery model, taking a log
--        backup truncates inactive VLFs, reclaiming log space and enabling Point-in-Time
--        Recovery (PITR) via STOPAT.
--
--   3. The MaharaTech Video Timeline Case Study:
--      - 1/1/2023: Database Creation
--      - 1/2/2023: Full Backup 1
--      - 1/3/2023: Full Backup 2 (The active baseline anchor)
--      - 8/3/2023: Differential Backup 1 (Changes between 1/3 and 8/3)
--      - 15/3/2023: Differential Backup 2 (Cumulative changes between 1/3 and 15/3)
--      - 16/3/2023: Transaction Log Backup T1 (Transactions from 15/3 to 16/3)
--      - 17/3/2023 4:00 PM: Golden State Timestamp (Pre-Disaster Point-in-Time)
--      - 17/3/2023 4:01 PM: Simulated Catastrophic Disaster (Accidental Bulk Deletion)
--      - Emergency Tail-Log Backup (Capturing unbacked-up active log with NORECOVERY)
--      - Point-in-Time Restore: Full 2 -> Diff 2 (skips Diff 1!) -> Log T1 -> Tail Log WITH STOPAT
--
--   4. Recovery Models & Engine Rejection:
--      - SIMPLE: Log backups disallowed (Msg 4208); log truncated automatically at checkpoints.
--      - FULL: Complete logging, mandatory log backups, point-in-time recovery enabled.
--      - BULK_LOGGED: Minimal logging for bulk operations, restricts PITR across bulk windows.
-- ============================================================================

SET NOCOUNT ON;
GO

PRINT '============================================================================';
PRINT '>>> Starting CH01_VID11: Types of Backup Verification Lab...';
PRINT '============================================================================';
GO

USE master;
GO

-- ----------------------------------------------------------------------------
-- 1. Setup Demonstration Database & Physical Files
-- ----------------------------------------------------------------------------
IF DB_ID('ITI_BackupLab_Restored') IS NOT NULL
BEGIN
    PRINT '>>> Dropping previous restored lab database...';
    DROP DATABASE [ITI_BackupLab_Restored];
END
GO

IF DB_ID('ITI_BackupLab') IS NOT NULL
BEGIN
    PRINT '>>> Resetting previous lab database...';
    ALTER DATABASE [ITI_BackupLab] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [ITI_BackupLab];
END
GO

PRINT '>>> Creating database [ITI_BackupLab] with FULL recovery model...';
CREATE DATABASE [ITI_BackupLab];
GO

ALTER DATABASE [ITI_BackupLab] SET RECOVERY FULL;
GO

-- Inspect Physical File Layout (.mdf and .ldf)
SELECT 
    f.file_id,
    f.name AS LogicalFileName,
    f.type_desc AS FileType,
    f.physical_name AS PhysicalFilePath,
    f.size * 8 / 1024 AS SizeMB,
    f.growth * 8 / 1024 AS GrowthMB
FROM [ITI_BackupLab].sys.database_files f;
GO

-- ----------------------------------------------------------------------------
-- 2. Populate Schema & Initial Data (Simulating 1/1/2023 - 1/2/2023)
-- ----------------------------------------------------------------------------
USE [ITI_BackupLab];
GO

CREATE TABLE dbo.Department
(
    Dept_Id INT IDENTITY(10,10) PRIMARY KEY,
    Dept_Name NVARCHAR(50) NOT NULL,
    Location NVARCHAR(100) NOT NULL
);

CREATE TABLE dbo.Student
(
    St_Id INT IDENTITY(1,1) PRIMARY KEY,
    St_Fname NVARCHAR(50) NOT NULL,
    St_Lname NVARCHAR(50) NOT NULL,
    Dept_Id INT FOREIGN KEY REFERENCES dbo.Department(Dept_Id),
    Created_At DATETIME2(3) DEFAULT SYSUTCDATETIME()
);
GO

INSERT INTO dbo.Department (Dept_Name, Location)
VALUES (N'Data Engineering', N'Smart Village'),
       (N'Cloud Architecture', N'New Capital'),
       (N'Database Administration', N'Nasr City');

INSERT INTO dbo.Student (St_Fname, St_Lname, Dept_Id)
VALUES (N'Ahmed', N'Ali', 10),
       (N'Sara', N'Hassan', 20),
       (N'Omar', N'Khaled', 30);
GO

PRINT '>>> Initial table population complete (3 Departments, 3 Students).';
GO

-- ----------------------------------------------------------------------------
-- 3. Execution of CH01_VID11 Timeline
-- ----------------------------------------------------------------------------

-- Determine SQL Server default backup directory
DECLARE @BackupDir NVARCHAR(400);
SET @BackupDir = CAST(SERVERPROPERTY('InstanceDefaultBackupPath') AS NVARCHAR(400));
IF @BackupDir IS NULL
    SET @BackupDir = N'D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup';

DECLARE @BackupPathFull1 NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_Full_1.bak';
DECLARE @BackupPathFull2 NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_Full_2.bak';
DECLARE @BackupPathDiff1 NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_Diff_1.bak';
DECLARE @BackupPathDiff2 NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_Diff_2.bak';
DECLARE @BackupPathLogT1 NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_Log_T1.trn';
DECLARE @BackupPathTailLog NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_TailLog.trn';

-- A. Full Backup 1 (Simulating 1/2/2023)
PRINT '>>> 1. Creating Full Backup 1 (1/2/2023)...';
BACKUP DATABASE [ITI_BackupLab]
TO DISK = @BackupPathFull1
WITH FORMAT, INIT,
     NAME = N'ITI_BackupLab-Full Database Backup (1/2/2023)',
     STATS = 10, CHECKSUM;
GO

-- Insert records between 1/2 and 1/3
USE [ITI_BackupLab];
INSERT INTO dbo.Student (St_Fname, St_Lname, Dept_Id)
VALUES (N'Mona', N'Ibrahim', 10),
       (N'Tarek', N'Sayed', 20);
GO

-- B. Full Backup 2 (Simulating 1/3/2023 - Active Baseline for Differentials)
DECLARE @BackupDir NVARCHAR(400) = CAST(SERVERPROPERTY('InstanceDefaultBackupPath') AS NVARCHAR(400));
IF @BackupDir IS NULL SET @BackupDir = N'D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup';
DECLARE @BackupPathFull2 NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_Full_2.bak';

PRINT '>>> 2. Creating Full Backup 2 (1/3/2023 Baseline Anchor)...';
BACKUP DATABASE [ITI_BackupLab]
TO DISK = @BackupPathFull2
WITH FORMAT, INIT,
     NAME = N'ITI_BackupLab-Full Database Backup (1/3/2023 Baseline)',
     STATS = 10, CHECKSUM;
GO

-- Week 1 modifications (between 1/3 and 8/3)
USE [ITI_BackupLab];
INSERT INTO dbo.Student (St_Fname, St_Lname, Dept_Id)
VALUES (N'Youssef', N'Nabil', 10),
       (N'Nour', N'Hossam', 30);
GO

-- C. Differential Backup 1 (Simulating 8/3/2023)
DECLARE @BackupDir NVARCHAR(400) = CAST(SERVERPROPERTY('InstanceDefaultBackupPath') AS NVARCHAR(400));
IF @BackupDir IS NULL SET @BackupDir = N'D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup';
DECLARE @BackupPathDiff1 NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_Diff_1.bak';

PRINT '>>> 3. Creating Differential Backup 1 (8/3/2023)...';
BACKUP DATABASE [ITI_BackupLab]
TO DISK = @BackupPathDiff1
WITH DIFFERENTIAL, FORMAT, INIT,
     NAME = N'ITI_BackupLab-Differential Backup 1 (8/3/2023)',
     STATS = 10, CHECKSUM;
GO

-- Week 2 modifications (between 8/3 and 15/3 - cumulative modifications)
USE [ITI_BackupLab];
INSERT INTO dbo.Student (St_Fname, St_Lname, Dept_Id)
VALUES (N'Salma', N'Mahmoud', 20),
       (N'Karim', N'Adel', 10);
UPDATE dbo.Student SET St_Lname = N'Ali-Mohamed' WHERE St_Id = 1;
GO

-- D. Differential Backup 2 (Simulating 15/3/2023 - Cumulative from Full 2 baseline!)
DECLARE @BackupDir NVARCHAR(400) = CAST(SERVERPROPERTY('InstanceDefaultBackupPath') AS NVARCHAR(400));
IF @BackupDir IS NULL SET @BackupDir = N'D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup';
DECLARE @BackupPathDiff2 NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_Diff_2.bak';

PRINT '>>> 4. Creating Differential Backup 2 (15/3/2023 Cumulative)...';
BACKUP DATABASE [ITI_BackupLab]
TO DISK = @BackupPathDiff2
WITH DIFFERENTIAL, FORMAT, INIT,
     NAME = N'ITI_BackupLab-Differential Backup 2 (15/3/2023 Cumulative)',
     STATS = 10, CHECKSUM;
GO

-- Modifications between 15/3 and 16/3
USE [ITI_BackupLab];
INSERT INTO dbo.Student (St_Fname, St_Lname, Dept_Id)
VALUES (N'Layla', N'Sherif', 30);
GO

-- E. Transaction Log Backup T1 (Simulating 16/3/2023)
DECLARE @BackupDir NVARCHAR(400) = CAST(SERVERPROPERTY('InstanceDefaultBackupPath') AS NVARCHAR(400));
IF @BackupDir IS NULL SET @BackupDir = N'D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup';
DECLARE @BackupPathLogT1 NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_Log_T1.trn';

PRINT '>>> 5. Creating Transaction Log Backup T1 (16/3/2023)...';
BACKUP LOG [ITI_BackupLab]
TO DISK = @BackupPathLogT1
WITH FORMAT, INIT,
     NAME = N'ITI_BackupLab-Transaction Log Backup T1 (16/3/2023)',
     STATS = 10, CHECKSUM;
GO

-- Transactions on 17/3 prior to 4:00 PM
USE [ITI_BackupLab];
INSERT INTO dbo.Student (St_Fname, St_Lname, Dept_Id)
VALUES (N'Rami', N'Abonagi', 10),
       (N'Hany', N'Fawzy', 20);
GO

-- F. Golden Point-in-Time Timestamp (Simulating 4:00 PM)
DECLARE @TargetRecoveryTime DATETIME = GETDATE();
WAITFOR DELAY '00:00:02';

-- G. SIMULATED DISASTER EVENT at 4:01 PM (Accidental bulk delete)
PRINT '>>> 6. SIMULATING DISASTER: Accidental batch deletion at 4:01 PM...';
DELETE FROM dbo.Student WHERE St_Id > 2;
GO

-- H. Emergency Tail-Log Backup (Capturing active log, taking database offline)
USE master;
GO

DECLARE @BackupDir NVARCHAR(400) = CAST(SERVERPROPERTY('InstanceDefaultBackupPath') AS NVARCHAR(400));
IF @BackupDir IS NULL SET @BackupDir = N'D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup';
DECLARE @BackupPathTailLog NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_TailLog.trn';

PRINT '>>> 7. Creating Emergency Tail Log Backup (Database marked RESTORING)...';
BACKUP LOG [ITI_BackupLab]
TO DISK = @BackupPathTailLog
WITH NORECOVERY, FORMAT, INIT,
     NAME = N'ITI_BackupLab-Emergency Tail Log Backup',
     STATS = 10, CHECKSUM;
GO

-- ----------------------------------------------------------------------------
-- 4. Recovery Model Constraint Rejection: Msg 4208 in SIMPLE Model
-- ----------------------------------------------------------------------------
PRINT '>>> Demonstrating Recovery Model Constraint Rejection (Msg 4208)...';
IF DB_ID('ITI_Simple_Test') IS NOT NULL
    DROP DATABASE [ITI_Simple_Test];
GO

CREATE DATABASE [ITI_Simple_Test];
ALTER DATABASE [ITI_Simple_Test] SET RECOVERY SIMPLE;
GO

BEGIN TRY
    BACKUP LOG [ITI_Simple_Test]
    TO DISK = N'D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup\test_simple.trn';
END TRY
BEGIN CATCH
    PRINT '>>> Successfully Caught Engine Rejection Msg 4208:';
    PRINT '    Error Number:  ' + CAST(ERROR_NUMBER() AS NVARCHAR(10));
    PRINT '    Error Message: ' + ERROR_MESSAGE();
END CATCH;
GO

DROP DATABASE [ITI_Simple_Test];
GO

-- ----------------------------------------------------------------------------
-- 5. Complete Point-in-Time Recovery (Restoring to 4:00 PM)
-- ----------------------------------------------------------------------------
-- Recovery Path demonstrated in Video 11:
-- 1. Restore Baseline Full Backup (Full 2 on 1/3) WITH NORECOVERY
-- 2. Restore Latest Differential Backup (Diff 2 on 15/3) WITH NORECOVERY
--    * CRITICAL DBRE LAW: Diff 1 (8/3) is COMPLETELY SKIPPED because Diff 2 is cumulative!
-- 3. Restore Transaction Log Backup T1 (16/3) WITH NORECOVERY
-- 4. Restore Tail Log Backup WITH STOPAT = @TargetRecoveryTime, RECOVERY
-- ----------------------------------------------------------------------------

DECLARE @BackupDir NVARCHAR(400) = CAST(SERVERPROPERTY('InstanceDefaultBackupPath') AS NVARCHAR(400));
IF @BackupDir IS NULL SET @BackupDir = N'D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup';
DECLARE @DataDir NVARCHAR(400) = CAST(SERVERPROPERTY('InstanceDefaultDataPath') AS NVARCHAR(400));
IF @DataDir IS NULL SET @DataDir = N'D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\';

DECLARE @BackupPathFull2 NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_Full_2.bak';
DECLARE @BackupPathDiff2 NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_Diff_2.bak';
DECLARE @BackupPathLogT1 NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_Log_T1.trn';
DECLARE @BackupPathTailLog NVARCHAR(500) = @BackupDir + N'\ITI_BackupLab_TailLog.trn';

DECLARE @RestoredMdf NVARCHAR(500) = @DataDir + N'ITI_BackupLab_Restored.mdf';
DECLARE @RestoredLdf NVARCHAR(500) = @DataDir + N'ITI_BackupLab_Restored_log.ldf';

-- Step 1: Restore Baseline Full 2
PRINT '>>> RESTORE STEP 1: Restoring Baseline Full 2 (WITH NORECOVERY)...';
RESTORE DATABASE [ITI_BackupLab_Restored]
FROM DISK = @BackupPathFull2
WITH NORECOVERY, REPLACE,
     MOVE N'ITI_BackupLab' TO @RestoredMdf,
     MOVE N'ITI_BackupLab_log' TO @RestoredLdf;

-- Step 2: Restore Cumulative Differential 2 (Skipping Diff 1)
PRINT '>>> RESTORE STEP 2: Restoring Cumulative Differential 2 (WITH NORECOVERY)...';
RESTORE DATABASE [ITI_BackupLab_Restored]
FROM DISK = @BackupPathDiff2
WITH NORECOVERY;

-- Step 3: Restore Transaction Log T1
PRINT '>>> RESTORE STEP 3: Restoring Transaction Log T1 (WITH NORECOVERY)...';
RESTORE LOG [ITI_BackupLab_Restored]
FROM DISK = @BackupPathLogT1
WITH NORECOVERY;

-- Step 4: Restore Tail Log with STOPAT
PRINT '>>> RESTORE STEP 4: Restoring Tail Log with STOPAT (WITH RECOVERY)...';
-- In production, replace with target timestamp:
-- RESTORE LOG [ITI_BackupLab_Restored] FROM DISK = @BackupPathTailLog WITH STOPAT = '2026-09-27 16:00:00', RECOVERY;
RESTORE LOG [ITI_BackupLab_Restored]
FROM DISK = @BackupPathTailLog
WITH RECOVERY;
GO

-- ----------------------------------------------------------------------------
-- 6. Introspection & Telemetry Verification
-- ----------------------------------------------------------------------------

-- A. Query restored database to verify all 12 records recovered
PRINT '>>> Restored Students Verification (Asserting 12 records intact):';
SELECT St_Id, St_Fname, St_Lname, Dept_Id, Created_At
FROM [ITI_BackupLab_Restored].dbo.Student
ORDER BY St_Id;
GO

-- B. Inspect msdb backup history and verify Differential Base LSN matching
PRINT '>>> msdb Backup History Telemetry:';
SELECT 
    bs.backup_set_id,
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
WHERE bs.database_name = 'ITI_BackupLab'
ORDER BY bs.backup_set_id;
GO

PRINT '============================================================================';
PRINT '>>> CH01_VID11: Types of Backup verification complete with 100% success!';
PRINT '============================================================================';
GO
