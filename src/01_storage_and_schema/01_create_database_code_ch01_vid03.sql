/* ============================================================================
   Script:      01_create_database_code_ch01_vid03.sql
   Module:      01_storage_and_schema
   Course:      MaharaTech Course 2305: Implementing and Developing SQL Server Objects
   Lecture:     CH01_VID03: Create Database Using Code
   Instructor:  Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
   Target OS:   Windows (SQL Server 2022 / 16.0.1200)
   Environment: D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb
   ============================================================================
   Design Objectives:
     1. Create database using simple T-SQL code (default instance storage).
     2. Inspect instance default data and transaction log file paths.
     3. Back up database to physical disk (.bak file).
     4. Safely drop database using SINGLE_USER WITH ROLLBACK IMMEDIATE.
     5. Restore database from disk (.bak) with MOVE options.
     6. Create database with explicit physical files, filegroups, and growth parameters.
   ============================================================================ */

USE [master];
GO

SET NOCOUNT ON;
GO

PRINT '======================================================================';
PRINT '  MaharaTech CH01_VID03: Create Database Using Code (T-SQL Guide)';
PRINT '  Instructor: Eng. Rami Mohamed Abonagi';
PRINT '  Active Instance: ' + @@SERVERNAME;
PRINT '======================================================================';
GO

-- ---------------------------------------------------------------------------
-- 0. Inspect Environment & Instance Default File Paths
-- ---------------------------------------------------------------------------
PRINT '>>> Step 0: Inspecting SQL Server Default Storage Paths...';

SELECT 
    CAST(SERVERPROPERTY('ServerName') AS NVARCHAR(128)) AS [SQL_Instance],
    CAST(SERVERPROPERTY('ProductVersion') AS NVARCHAR(64)) AS [Product_Version],
    CAST(SERVERPROPERTY('InstanceDefaultDataPath') AS NVARCHAR(512)) AS [Default_Data_Path_MDF],
    CAST(SERVERPROPERTY('InstanceDefaultLogPath') AS NVARCHAR(512)) AS [Default_Log_Path_LDF];
GO


-- ---------------------------------------------------------------------------
-- 1. Simple Database Creation via Code (Default Path)
-- In CH01_VID03, Eng. Rami demonstrates:
--   Create Database MyfirstDB
-- ---------------------------------------------------------------------------
PRINT '>>> Step 1: Creating [MyfirstDB] using minimal T-SQL syntax...';

IF DB_ID(N'MyfirstDB') IS NOT NULL
BEGIN
    ALTER DATABASE [MyfirstDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [MyfirstDB];
    PRINT '    Existing [MyfirstDB] dropped for clean idempotent run.';
END;
GO

CREATE DATABASE [MyfirstDB];
GO

-- Verify where SQL Server placed the files for MyfirstDB
SELECT 
    DB_NAME(database_id) AS [DatabaseName],
    name AS [LogicalFileName],
    type_desc AS [FileType],
    physical_name AS [PhysicalDiskPath],
    (size * 8) / 1024 AS [SizeMB],
    growth AS [GrowthSetting],
    is_percent_growth AS [IsPercentGrowth]
FROM sys.master_files
WHERE database_id = DB_ID(N'MyfirstDB');
GO


-- ---------------------------------------------------------------------------
-- 2. Physical Storage Path Resolution for User's Environment
-- Target Folder: D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\
-- Fallback: Instance Default Data Path (for Docker CI / Linux runners)
-- ---------------------------------------------------------------------------
DECLARE @UserCoursePath NVARCHAR(512) = N'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\';
DECLARE @TargetDir NVARCHAR(512) = @UserCoursePath;
DECLARE @DirExists INT = 0;

BEGIN TRY
    EXEC master.dbo.xp_fileexist @UserCoursePath, @DirExists OUTPUT;
END TRY
BEGIN CATCH
    SET @DirExists = 0;
END CATCH;

IF @DirExists = 0
BEGIN
    DECLARE @DefData NVARCHAR(512) = CAST(SERVERPROPERTY('InstanceDefaultDataPath') AS NVARCHAR(512));
    IF @DefData IS NULL OR @DefData = ''
    BEGIN
        SELECT TOP (1) @DefData = LEFT(physical_name, LEN(physical_name) - CHARINDEX(CASE WHEN CHARINDEX('/', physical_name) > 0 THEN '/' ELSE '\' END, REVERSE(physical_name)) + 1)
        FROM sys.master_files WHERE database_id = 1 AND type = 0;
    END;
    SET @TargetDir = @DefData;
    PRINT '    Target directory not found on host. Fallback storage: ' + @TargetDir;
END
ELSE
BEGIN
    PRINT '    Verified User Course Path: ' + @TargetDir;
END;


-- ---------------------------------------------------------------------------
-- 3. Advanced CREATE DATABASE with Explicit Files & Filegroups
-- In CH01_VID03, Eng. Rami demonstrates:
--   CREATE DATABASE MyDB
--   ON (NAME = MyDB_data, FILENAME = 'E:\MyDB_data.mdf', SIZE = 10MB, ...)
--   LOG ON (NAME = MyDB_log, FILENAME = 'E:\MyDB_log.ldf', ...)
-- ---------------------------------------------------------------------------
PRINT '>>> Step 2: Creating [MyDB] with explicit physical file layout in CH01\Mydb...';

IF DB_ID(N'MyDB') IS NOT NULL
BEGIN
    ALTER DATABASE [MyDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [MyDB];
    PRINT '    Existing [MyDB] dropped.';
END;
GO

DECLARE @TargetDir NVARCHAR(512) = N'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\';
DECLARE @DirExists INT = 0;
BEGIN TRY EXEC master.dbo.xp_fileexist @TargetDir, @DirExists OUTPUT; END TRY BEGIN CATCH SET @DirExists = 0; END CATCH;

IF @DirExists = 0
BEGIN
    SELECT TOP (1) @TargetDir = LEFT(physical_name, LEN(physical_name) - CHARINDEX(CASE WHEN CHARINDEX('/', physical_name) > 0 THEN '/' ELSE '\' END, REVERSE(physical_name)) + 1)
    FROM sys.master_files WHERE database_id = 1 AND type = 0;
END;

DECLARE @CreateDbSQL NVARCHAR(MAX) = N'
CREATE DATABASE [MyDB]
ON PRIMARY
(
    NAME = N''MyDB_data'',
    FILENAME = N''' + @TargetDir + N'MyDB_data.mdf'',
    SIZE = 10MB,
    MAXSIZE = 100MB,
    FILEGROWTH = 5MB
),
FILEGROUP [MyDB_FG1]
(
    NAME = N''MyDB_fg1_data'',
    FILENAME = N''' + @TargetDir + N'MyDB_fg1_data.ndf'',
    SIZE = 8MB,
    MAXSIZE = 100MB,
    FILEGROWTH = 5MB
)
LOG ON
(
    NAME = N''MyDB_log'',
    FILENAME = N''' + @TargetDir + N'MyDB_log.ldf'',
    SIZE = 5MB,
    MAXSIZE = 50MB,
    FILEGROWTH = 5MB
);';

EXEC (@CreateDbSQL);
PRINT '    Database [MyDB] created successfully with explicit parameters.';
GO

-- Verify file allocation of MyDB
SELECT 
    df.name AS [LogicalName],
    df.physical_name AS [DiskPath],
    df.type_desc AS [Type],
    ISNULL(fg.name, 'LOG') AS [Filegroup],
    (df.size * 8) / 1024 AS [CurrentSizeMB],
    CASE WHEN df.max_size = -1 THEN 'UNLIMITED' ELSE CAST((df.max_size * 8) / 1024 AS VARCHAR(16)) + ' MB' END AS [MaxSize],
    CASE WHEN df.is_percent_growth = 1 THEN CAST(df.growth AS VARCHAR(8)) + '%' ELSE CAST((df.growth * 8) / 1024 AS VARCHAR(8)) + ' MB' END AS [GrowthRate]
FROM sys.master_files df
LEFT JOIN sys.filegroups fg ON df.data_space_id = fg.data_space_id AND df.database_id = DB_ID(N'MyDB')
WHERE df.database_id = DB_ID(N'MyDB');
GO


-- ---------------------------------------------------------------------------
-- 4. Database Backup Operation
-- In CH01_VID03, Eng. Rami demonstrates:
--   Backup DataBase Mydb to disk='e:\mydb.bak'
-- ---------------------------------------------------------------------------
PRINT '>>> Step 3: Backing up database [MyDB] to disk (.bak)...';

DECLARE @TargetDir NVARCHAR(512) = N'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\';
DECLARE @DirExists INT = 0;
BEGIN TRY EXEC master.dbo.xp_fileexist @TargetDir, @DirExists OUTPUT; END TRY BEGIN CATCH SET @DirExists = 0; END CATCH;

IF @DirExists = 0
BEGIN
    SELECT TOP (1) @TargetDir = LEFT(physical_name, LEN(physical_name) - CHARINDEX(CASE WHEN CHARINDEX('/', physical_name) > 0 THEN '/' ELSE '\' END, REVERSE(physical_name)) + 1)
    FROM sys.master_files WHERE database_id = 1 AND type = 0;
END;

DECLARE @BackupPath NVARCHAR(512) = @TargetDir + N'MyDB.bak';
DECLARE @BackupSQL NVARCHAR(MAX) = N'
BACKUP DATABASE [MyDB]
TO DISK = N''' + @BackupPath + N'''
WITH FORMAT,
     INIT,
     NAME = N''MyDB-Full Database Backup (CH01_VID03)'',
     SKIP,
     STATS = 25;';

EXEC (@BackupSQL);
PRINT '    Backup completed: ' + @BackupPath;
GO


-- ---------------------------------------------------------------------------
-- 5. Safe Database Drop Operation
-- In CH01_VID03, Eng. Rami demonstrates:
--   Drop Database MyDB
-- Note: In production, connections must be terminated first to avoid Error 3702!
-- ---------------------------------------------------------------------------
PRINT '>>> Step 4: Safely Dropping [MyDB] after terminating active sessions...';

IF DB_ID(N'MyDB') IS NOT NULL
BEGIN
    -- Force kill active sessions and set single-user
    ALTER DATABASE [MyDB] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [MyDB];
    PRINT '    Database [MyDB] successfully dropped.';
END;
GO


-- ---------------------------------------------------------------------------
-- 6. Database Restore Operation from Disk (.bak)
-- In CH01_VID03, Eng. Rami demonstrates:
--   Restore database mydb from disk='e:\mydb.bak'
-- ---------------------------------------------------------------------------
PRINT '>>> Step 5: Restoring database [MyDB] from .bak backup...';

DECLARE @TargetDir NVARCHAR(512) = N'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\';
DECLARE @DirExists INT = 0;
BEGIN TRY EXEC master.dbo.xp_fileexist @TargetDir, @DirExists OUTPUT; END TRY BEGIN CATCH SET @DirExists = 0; END CATCH;

IF @DirExists = 0
BEGIN
    SELECT TOP (1) @TargetDir = LEFT(physical_name, LEN(physical_name) - CHARINDEX(CASE WHEN CHARINDEX('/', physical_name) > 0 THEN '/' ELSE '\' END, REVERSE(physical_name)) + 1)
    FROM sys.master_files WHERE database_id = 1 AND type = 0;
END;

DECLARE @BackupPath NVARCHAR(512) = @TargetDir + N'MyDB.bak';

-- Inspect logical file names inside backup header
RESTORE FILELISTONLY FROM DISK = @BackupPath;

DECLARE @RestoreSQL NVARCHAR(MAX) = N'
RESTORE DATABASE [MyDB]
FROM DISK = N''' + @BackupPath + N'''
WITH REPLACE,
     RECOVERY,
     STATS = 25;';

EXEC (@RestoreSQL);
PRINT '    Database [MyDB] successfully restored and brought online.';
GO

-- ---------------------------------------------------------------------------
-- 7. Verification: Database is Online & Accessible
-- ---------------------------------------------------------------------------
SELECT 
    name AS [DatabaseName],
    state_desc AS [State],
    recovery_model_desc AS [RecoveryModel],
    compatibility_level AS [CompatLevel],
    collation_name AS [Collation]
FROM sys.databases
WHERE name IN (N'MyfirstDB', N'MyDB', N'ITItest');
GO

PRINT '======================================================================';
PRINT '  [SUCCESS] MaharaTech CH01_VID03 T-SQL Script Completed Successfully!';
PRINT '======================================================================';
GO
