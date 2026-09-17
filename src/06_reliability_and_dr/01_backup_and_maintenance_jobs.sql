/* ============================================================================
   Script: 01_backup_and_maintenance_jobs.sql
   Module: 06_reliability_and_dr
   Purpose: Configures enterprise SQL Server Agent maintenance jobs implementing
            the classic 3-tier backup strategy: Weekly Full, Daily Diff, and
            15-Minute Transaction Log chains with CHECKSUM and COMPRESSION.
   ============================================================================ */

USE msdb;
GO

SET NOCOUNT ON;
GO

PRINT '>>> Configuring SQL Server Agent automated backup schedules...';

-- 1. Helper Variables
DECLARE @JobNameFull NVARCHAR(128) = N'DBRE_OmniFlowDB_Backup_Full';
DECLARE @JobNameDiff NVARCHAR(128) = N'DBRE_OmniFlowDB_Backup_Diff';
DECLARE @JobNameLog  NVARCHAR(128) = N'DBRE_OmniFlowDB_Backup_Log';

-- ----------------------------------------------------------------------------
-- 2. JOB 1: Weekly Full Database Backup (Sundays at 01:00 UTC)
-- ----------------------------------------------------------------------------
IF EXISTS (SELECT 1 FROM msdb.dbo.sysjobs WHERE name = @JobNameFull)
    EXEC msdb.dbo.sp_delete_job @job_name = @JobNameFull;

EXEC msdb.dbo.sp_add_job
    @job_name = @JobNameFull,
    @enabled = 1,
    @description = N'Weekly Full Backup with Checksums and Compression for OmniFlowDB',
    @category_name = N'Database Maintenance';

EXEC msdb.dbo.sp_add_jobstep
    @job_name = @JobNameFull,
    @step_name = N'Execute Full Backup',
    @subsystem = N'TSQL',
    @command = N'
    DECLARE @BackupFile NVARCHAR(512);
    SET @BackupFile = CAST(SERVERPROPERTY(''InstanceDefaultDataPath'') AS NVARCHAR(256)) 
                      + N''OmniFlowDB_Full_'' + CONVERT(NVARCHAR(20), GETDATE(), 112) + N''.bak'';

    BACKUP DATABASE [OmniFlowDB]
    TO DISK = @BackupFile
    WITH FORMAT, INIT, CHECKSUM, COMPRESSION, STATS = 10;

    RESTORE VERIFYONLY FROM DISK = @BackupFile WITH CHECKSUM;
    ',
    @retry_attempts = 3,
    @retry_interval = 5;

-- Schedule: Every Sunday at 01:00:00
EXEC msdb.dbo.sp_add_jobschedule
    @job_name = @JobNameFull,
    @name = N'Sched_Weekly_Full',
    @freq_type = 8,        -- Weekly
    @freq_interval = 1,    -- Sunday
    @freq_recurrence_factor = 1,
    @active_start_time = 010000;

EXEC msdb.dbo.sp_add_jobserver @job_name = @JobNameFull, @server_name = N'(local)';
PRINT '>>> Created SQL Agent Job: ' + @JobNameFull;

-- ----------------------------------------------------------------------------
-- 3. JOB 2: Daily Differential Backup (Monday-Saturday at 01:00 UTC)
-- ----------------------------------------------------------------------------
IF EXISTS (SELECT 1 FROM msdb.dbo.sysjobs WHERE name = @JobNameDiff)
    EXEC msdb.dbo.sp_delete_job @job_name = @JobNameDiff;

EXEC msdb.dbo.sp_add_job
    @job_name = @JobNameDiff,
    @enabled = 1,
    @description = N'Daily Differential Backup for OmniFlowDB',
    @category_name = N'Database Maintenance';

EXEC msdb.dbo.sp_add_jobstep
    @job_name = @JobNameDiff,
    @step_name = N'Execute Diff Backup',
    @subsystem = N'TSQL',
    @command = N'
    DECLARE @BackupFile NVARCHAR(512);
    SET @BackupFile = CAST(SERVERPROPERTY(''InstanceDefaultDataPath'') AS NVARCHAR(256)) 
                      + N''OmniFlowDB_Diff_'' + CONVERT(NVARCHAR(20), GETDATE(), 112) + N''.dif'';

    BACKUP DATABASE [OmniFlowDB]
    TO DISK = @BackupFile
    WITH DIFFERENTIAL, FORMAT, INIT, CHECKSUM, COMPRESSION, STATS = 10;
    ',
    @retry_attempts = 2,
    @retry_interval = 5;

-- Schedule: Mon-Sat at 01:00:00 (freq_interval: Mon=2 + Tue=4 + Wed=8 + Thu=16 + Fri=32 + Sat=64 = 126)
EXEC msdb.dbo.sp_add_jobschedule
    @job_name = @JobNameDiff,
    @name = N'Sched_Daily_Diff',
    @freq_type = 8,        -- Weekly
    @freq_interval = 126,  -- Monday through Saturday
    @freq_recurrence_factor = 1,
    @active_start_time = 010000;

EXEC msdb.dbo.sp_add_jobserver @job_name = @JobNameDiff, @server_name = N'(local)';
PRINT '>>> Created SQL Agent Job: ' + @JobNameDiff;

-- ----------------------------------------------------------------------------
-- 4. JOB 3: 15-Minute Transaction Log Backup (Continuous Chain)
-- ----------------------------------------------------------------------------
IF EXISTS (SELECT 1 FROM msdb.dbo.sysjobs WHERE name = @JobNameLog)
    EXEC msdb.dbo.sp_delete_job @job_name = @JobNameLog;

EXEC msdb.dbo.sp_add_job
    @job_name = @JobNameLog,
    @enabled = 1,
    @description = N'15-Minute Transaction Log Backup for RPO Protection',
    @category_name = N'Database Maintenance';

EXEC msdb.dbo.sp_add_jobstep
    @job_name = @JobNameLog,
    @step_name = N'Execute Log Backup',
    @subsystem = N'TSQL',
    @command = N'
    DECLARE @BackupFile NVARCHAR(512);
    SET @BackupFile = CAST(SERVERPROPERTY(''InstanceDefaultDataPath'') AS NVARCHAR(256)) 
                      + N''OmniFlowDB_Log_'' + REPLACE(REPLACE(REPLACE(CONVERT(NVARCHAR(30), GETDATE(), 120), ''-'', ''''), '' '', ''_''), '':'', '''') + N''.trn'';

    BACKUP LOG [OmniFlowDB]
    TO DISK = @BackupFile
    WITH CHECKSUM, COMPRESSION;
    ',
    @retry_attempts = 3,
    @retry_interval = 2;

-- Schedule: Recurring every 15 minutes all day
EXEC msdb.dbo.sp_add_jobschedule
    @job_name = @JobNameLog,
    @name = N'Sched_15Min_Log',
    @freq_type = 4,        -- Daily
    @freq_interval = 1,
    @freq_subday_type = 4, -- Minutes
    @freq_subday_interval = 15,
    @active_start_time = 000000,
    @active_end_time = 235959;

EXEC msdb.dbo.sp_add_jobserver @job_name = @JobNameLog, @server_name = N'(local)';
PRINT '>>> Created SQL Agent Job: ' + @JobNameLog;
GO
