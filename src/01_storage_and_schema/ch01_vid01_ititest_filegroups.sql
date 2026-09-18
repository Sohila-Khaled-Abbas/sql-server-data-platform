/* ============================================================================
   Script: ch01_vid01_ititest_filegroups.sql
   Module: 01_storage_and_schema
   Database: ITItest
   Purpose: Provisions and configures the ITItest database with the exact
            multi-filegroup physical layout created via the SSMS Wizard in:
            D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb
   Filegroups:
     - PRIMARY : ITItest.mdf  (System Catalogs & Schemas)
     - fg1     : file2.ndf    (Core Relational Entities: Employee, Department)
     - fg2     : file3.ndf    (Operational Associations & Projects: Project, WorksOn)
     - fg3     : file4.ndf    (Indexes, Reporting & Staging Data)
     - LOG     : ITItest_log.ldf (Sequential Transaction Write-Ahead Log)
   ============================================================================ */

USE [master];
GO

SET NOCOUNT ON;
GO

-- 1. Check if ITItest already exists
IF DB_ID(N'ITItest') IS NULL
BEGIN
    PRINT '>>> Determining target storage path for database [ITItest]...';

    -- Target preferred path requested on local Windows workstation
    DECLARE @PreferredDir NVARCHAR(512) = N'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\';
    DECLARE @TargetDir NVARCHAR(512) = @PreferredDir;
    DECLARE @PathSep NCHAR(1) = N'\';

    -- Detect instance default storage paths (Windows local & Linux Docker)
    DECLARE @DefaultDataPath NVARCHAR(512) = CAST(SERVERPROPERTY('InstanceDefaultDataPath') AS NVARCHAR(512));
    DECLARE @DefaultLogPath  NVARCHAR(512) = CAST(SERVERPROPERTY('InstanceDefaultLogPath')  AS NVARCHAR(512));

    IF CHARINDEX('/', (SELECT TOP 1 physical_name FROM sys.master_files WHERE database_id = 1)) > 0
        SET @PathSep = N'/';

    -- Fallback defaults if instance properties return NULL
    IF @DefaultDataPath IS NULL OR @DefaultDataPath = ''
    BEGIN
        SELECT TOP (1) 
            @DefaultDataPath = CASE 
                WHEN CHARINDEX('/', physical_name) > 0 
                    THEN LEFT(physical_name, LEN(physical_name) - CHARINDEX('/', REVERSE(physical_name)) + 1)
                WHEN CHARINDEX('\', physical_name) > 0 
                    THEN LEFT(physical_name, LEN(physical_name) - CHARINDEX('\', REVERSE(physical_name)) + 1)
                ELSE physical_name
            END
        FROM sys.master_files
        WHERE database_id = 1 AND type = 0;
    END;

    IF @DefaultLogPath IS NULL OR @DefaultLogPath = ''
    BEGIN
        SELECT TOP (1) 
            @DefaultLogPath = CASE 
                WHEN CHARINDEX('/', physical_name) > 0 
                    THEN LEFT(physical_name, LEN(physical_name) - CHARINDEX('/', REVERSE(physical_name)) + 1)
                WHEN CHARINDEX('\', physical_name) > 0 
                    THEN LEFT(physical_name, LEN(physical_name) - CHARINDEX('\', REVERSE(physical_name)) + 1)
                ELSE physical_name
            END
        FROM sys.master_files
        WHERE database_id = 1 AND type = 1;
    END;

    -- Ensure trailing separator
    IF RIGHT(@DefaultDataPath, 1) NOT IN ('\', '/') 
        SET @DefaultDataPath = @DefaultDataPath + @PathSep;
    IF RIGHT(@DefaultLogPath, 1) NOT IN ('\', '/') 
        SET @DefaultLogPath = @DefaultLogPath + @PathSep;

    -- Verify if preferred directory exists on host OS
    DECLARE @DirExists INT = 0;
    BEGIN TRY
        EXEC master.dbo.xp_fileexist @PreferredDir, @DirExists OUTPUT;
    END TRY
    BEGIN CATCH
        SET @DirExists = 0;
    END CATCH;

    IF @DirExists = 0
    BEGIN
        PRINT '    Preferred directory not found or non-Windows environment. Using instance default: ' + @DefaultDataPath;
        SET @TargetDir = @DefaultDataPath;
    END
    ELSE
    BEGIN
        PRINT '    Target directory verified: ' + @TargetDir;
    END;

    DECLARE @Sql NVARCHAR(MAX);
    SET @Sql = N'
    CREATE DATABASE [ITItest]
    ON PRIMARY
    (
        NAME = N''ITItest'',
        FILENAME = N''' + @TargetDir + N'ITItest.mdf'',
        SIZE = 8MB,
        FILEGROWTH = 64MB
    ),
    FILEGROUP [fg1]
    (
        NAME = N''file2'',
        FILENAME = N''' + @TargetDir + N'file2.ndf'',
        SIZE = 8MB,
        FILEGROWTH = 64MB
    ),
    FILEGROUP [fg2]
    (
        NAME = N''file3'',
        FILENAME = N''' + @TargetDir + N'file3.ndf'',
        SIZE = 8MB,
        FILEGROWTH = 64MB
    ),
    FILEGROUP [fg3]
    (
        NAME = N''file4'',
        FILENAME = N''' + @TargetDir + N'file4.ndf'',
        SIZE = 8MB,
        FILEGROWTH = 64MB
    )
    LOG ON
    (
        NAME = N''ITItest_log'',
        FILENAME = N''' + CASE WHEN @DirExists = 1 THEN @TargetDir ELSE @DefaultLogPath END + N'ITItest_log.ldf'',
        SIZE = 8MB,
        FILEGROWTH = 64MB
    );';

    PRINT '>>> Creating database [ITItest] with 4 filegroups...';
    EXEC (@Sql);
    PRINT '>>> Database [ITItest] created successfully.';
END
ELSE
BEGIN
    PRINT '>>> Database [ITItest] already exists. Verifying filegroups...';
END;
GO

USE [ITItest];
GO

-- 2. Verify all filegroups exist
IF NOT EXISTS (SELECT 1 FROM sys.filegroups WHERE name = N'fg1')
    ALTER DATABASE [ITItest] ADD FILEGROUP [fg1];
IF NOT EXISTS (SELECT 1 FROM sys.filegroups WHERE name = N'fg2')
    ALTER DATABASE [ITItest] ADD FILEGROUP [fg2];
IF NOT EXISTS (SELECT 1 FROM sys.filegroups WHERE name = N'fg3')
    ALTER DATABASE [ITItest] ADD FILEGROUP [fg3];
GO

-- 3. Diagnostic Output
SELECT 
    df.name AS [LogicalFileName],
    df.physical_name AS [PhysicalDiskPath],
    df.type_desc AS [FileType],
    ISNULL(fg.name, 'N/A (LOG)') AS [Filegroup],
    (df.size * 8) / 1024 AS [SizeMB]
FROM sys.database_files df
LEFT JOIN sys.filegroups fg ON df.data_space_id = fg.data_space_id
ORDER BY df.type, df.file_id;
GO
