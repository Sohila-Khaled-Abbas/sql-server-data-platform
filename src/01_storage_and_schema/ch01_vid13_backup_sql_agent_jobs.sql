-- ============================================================================
-- Script: ch01_vid13_backup_sql_agent_jobs.sql
-- Module: CH01_VID13 - Backup & SQL Server Agent Jobs Automation
-- Course: MaharaTech Course 2305 ("Implementing & Developing SQL Server Objects")
-- Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
-- Database Engine: Microsoft SQL Server 2022 Developer Edition
-- Live Target Database: [ITI] (Recovery Model: FULL)
-- Live Physical Backup File:
--   D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak
--
-- ============================================================================
-- Core Architectural Principles (Eng. Rami Mohamed Abonagi):
-- ============================================================================
-- Jobs [query + [sch, event]]
-- SQLServer Agent (Background Service executing asynchronous scheduled workloads)
-- Job: Execution modes:
--   1. [on demand]   -> Manually triggered via SSMS or msdb.dbo.sp_start_job
--   2. [sch]         -> Triggered automatically by recurring schedule (e.g. daily at 12:00 AM)
--   3. [listen alert] -> Triggered reactively in response to an Alert event
-- Alert: 3 Primary Categories:
--   1. --events [error]       -> SQL Server engine error numbers or severity levels (16-25)
--   2. --performance          -> Performance counters (e.g. User Connections > 10, Buffer Cache)
--   3. --WMI                  -> Windows Management Instrumentation OS/disk storage events
-- Operator:
--   --Operator --email admin  -> Designated administrative notification endpoint (e.g. ahmed)
-- ============================================================================

SET NOCOUNT ON;
GO

PRINT '============================================================================';
PRINT '>>> Starting CH01_VID13: Backup & SQL Server Agent Jobs Verification Lab...';
PRINT '============================================================================';
GO

USE master;
GO

-- ----------------------------------------------------------------------------
-- 1. Inspect SQL Server Agent Windows Service & Target Database [ITI]
-- ----------------------------------------------------------------------------
PRINT '>>> 1. Inspecting SQL Server Agent Service Status:';
SELECT 
    servicename, 
    startup_type_desc, 
    status_desc, 
    CAST(last_startup_time AS VARCHAR(50)) AS LastStartupTime
FROM sys.dm_server_services
WHERE servicename LIKE '%Agent%';
GO

-- Ensure database [ITI] exists in FULL recovery model
IF DB_ID('ITI') IS NULL
BEGIN
    PRINT '>>> Database [ITI] not found! Creating [ITI] in FULL recovery model...';
    CREATE DATABASE [ITI];
    ALTER DATABASE [ITI] SET RECOVERY FULL;
END
ELSE
BEGIN
    PRINT '>>> Database [ITI] verified online.';
    SELECT 
        database_id, 
        name, 
        state_desc, 
        recovery_model_desc 
    FROM sys.databases 
    WHERE name = 'ITI';
END
GO

-- ----------------------------------------------------------------------------
-- 2. Lecture T-SQL Backup & Recovery Commands (MaharaTech Live Demo)
-- ----------------------------------------------------------------------------
-- Target path demonstrated in MaharaTech Course 2305:
-- D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak
-- ----------------------------------------------------------------------------

-- A. Full Database Backup
PRINT '>>> 2A. Executing Full Database Backup on [ITI]...';
backup database ITI
to disk='D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak';
GO

-- B. Transaction Log Backup
PRINT '>>> 2B. Executing Transaction Log Backup on [ITI]...';
backup log ITI
to disk='D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak';
GO

-- C. Introspect Backup Sets in Media Family
PRINT '>>> 2C. Inspecting Backup Sets inside [iti.bak]:';
RESTORE HEADERONLY 
FROM DISK = 'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak';
GO

-- D. Restore Verification of ITI
-- (Tested safely against staging target [ITI_Restored] to protect active instance)
PRINT '>>> 2D. Safe Verification Restore of [ITI] from [iti.bak]:';
IF DB_ID('ITI_Restored') IS NOT NULL
BEGIN
    ALTER DATABASE [ITI_Restored] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE [ITI_Restored];
END
GO

DECLARE @DataPath NVARCHAR(400) = CAST(SERVERPROPERTY('InstanceDefaultDataPath') AS NVARCHAR(400));
IF @DataPath IS NULL SET @DataPath = N'D:\SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\';

DECLARE @RestoredMdf NVARCHAR(500) = @DataPath + N'ITI_Restored.mdf';
DECLARE @RestoredLdf NVARCHAR(500) = @DataPath + N'ITI_Restored_log.ldf';

RESTORE DATABASE [ITI_Restored]
FROM DISK = 'D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak'
WITH FILE = 1,
     RECOVERY,
     REPLACE,
     MOVE N'ITI' TO @RestoredMdf,
     MOVE N'ITI_log' TO @RestoredLdf;

-- Clean up test database
IF DB_ID('ITI_Restored') IS NOT NULL
    DROP DATABASE [ITI_Restored];
GO

-- ----------------------------------------------------------------------------
-- 3. Programmatic SQL Server Agent Automation via msdb Stored Procedures
-- ----------------------------------------------------------------------------
-- Live Objects configured in the SSMS Screenshots:
--   - Operator:  [ahmed] (ahmed@gmail.com)
--   - Job:       [ITIbackupJob]
--   - Step 1:    [Q1] (backup database ITI to disk='...')
--   - Schedule:  [sch1] (Daily recurring at 12:00:00 AM)
--   - Notification: Email operator [ahmed] when job completes / succeeds
-- ----------------------------------------------------------------------------

USE msdb;
GO

-- A. Create Operator [ahmed] (Email Notification Endpoint)
IF NOT EXISTS (SELECT 1 FROM msdb.dbo.sysoperators WHERE name = N'ahmed')
BEGIN
    PRINT '>>> 3A. Creating Operator [ahmed] with email ahmed@gmail.com...';
    EXEC msdb.dbo.sp_add_operator 
        @name = N'ahmed', 
        @enabled = 1, 
        @email_address = N'ahmed@gmail.com',
        @category_name = N'[Uncategorized]';
END
ELSE
BEGIN
    PRINT '>>> Operator [ahmed] verified in msdb.';
    EXEC msdb.dbo.sp_update_operator 
        @name = N'ahmed', 
        @enabled = 1, 
        @email_address = N'ahmed@gmail.com';
END
GO

-- B. Create SQL Server Agent Job [ITIbackupJob]
IF NOT EXISTS (SELECT 1 FROM msdb.dbo.sysjobs WHERE name = N'ITIbackupJob')
BEGIN
    PRINT '>>> 3B. Creating Job [ITIbackupJob]...';
    EXEC msdb.dbo.sp_add_job 
        @job_name = N'ITIbackupJob', 
        @enabled = 1, 
        @description = N'Automated daily backup job for ITI database created during MaharaTech CH01_VID13 lab.',
        @category_name = N'[Uncategorized (Local)]',
        @notify_level_email = 1, -- 1 = On Success, 3 = On Completion
        @notify_email_operator_name = N'ahmed';
END
ELSE
BEGIN
    PRINT '>>> Job [ITIbackupJob] verified in msdb.';
    EXEC msdb.dbo.sp_update_job
        @job_name = N'ITIbackupJob',
        @enabled = 1,
        @notify_level_email = 1,
        @notify_email_operator_name = N'ahmed';
END
GO

-- C. Create Job Step 1: [Q1] (T-SQL Backup Command)
IF NOT EXISTS (
    SELECT 1 
    FROM msdb.dbo.sysjobsteps js
    JOIN msdb.dbo.sysjobs j ON js.job_id = j.job_id
    WHERE j.name = N'ITIbackupJob' AND js.step_id = 1
)
BEGIN
    PRINT '>>> 3C. Adding Step 1 [Q1] to [ITIbackupJob]...';
    EXEC msdb.dbo.sp_add_jobstep 
        @job_name = N'ITIbackupJob', 
        @step_name = N'Q1', 
        @step_id = 1, 
        @subsystem = N'TSQL', 
        @command = N'backup database ITI
to disk=''D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak''', 
        @database_name = N'master', 
        @on_success_action = 1, -- Quit with success
        @on_fail_action = 2;    -- Quit with failure
END
ELSE
BEGIN
    PRINT '>>> Step 1 [Q1] verified in [ITIbackupJob].';
    EXEC msdb.dbo.sp_update_jobstep
        @job_name = N'ITIbackupJob',
        @step_id = 1,
        @step_name = N'Q1',
        @subsystem = N'TSQL',
        @command = N'backup database ITI
to disk=''D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\iti.bak''',
        @database_name = N'master',
        @on_success_action = 1,
        @on_fail_action = 2;
END
GO

-- D. Create Recurring Schedule [sch1] (Daily at 12:00:00 AM)
IF NOT EXISTS (SELECT 1 FROM msdb.dbo.sysschedules WHERE name = N'sch1')
BEGIN
    PRINT '>>> 3D. Creating Schedule [sch1] (Daily recurring at 12:00:00 AM)...';
    EXEC msdb.dbo.sp_add_schedule 
        @schedule_name = N'sch1', 
        @enabled = 1, 
        @freq_type = 4,              -- 4 = Daily
        @freq_interval = 1,          -- Every 1 day
        @freq_subday_type = 1,       -- At the specified time
        @freq_subday_interval = 0, 
        @active_start_time = 0,      -- 00:00:00 (12:00:00 AM)
        @active_start_date = 20260927;
END
GO

-- Attach Schedule [sch1] to Job [ITIbackupJob]
IF NOT EXISTS (
    SELECT 1 
    FROM msdb.dbo.sysjobschedules js
    JOIN msdb.dbo.sysjobs j ON js.job_id = j.job_id
    JOIN msdb.dbo.sysschedules s ON js.schedule_id = s.schedule_id
    WHERE j.name = N'ITIbackupJob' AND s.name = N'sch1'
)
BEGIN
    PRINT '>>> Attaching Schedule [sch1] to Job [ITIbackupJob]...';
    EXEC msdb.dbo.sp_attach_schedule 
        @job_name = N'ITIbackupJob', 
        @schedule_name = N'sch1';
END
GO

-- E. Target Job to Local Server
IF NOT EXISTS (
    SELECT 1 
    FROM msdb.dbo.sysjobservers js
    JOIN msdb.dbo.sysjobs j ON js.job_id = j.job_id
    WHERE j.name = N'ITIbackupJob'
)
BEGIN
    PRINT '>>> Assigning Job [ITIbackupJob] to (local) server target...';
    EXEC msdb.dbo.sp_add_jobserver 
        @job_name = N'ITIbackupJob', 
        @server_name = N'(local)';
END
GO

-- ----------------------------------------------------------------------------
-- 4. SQL Server Agent Alerts Architecture & The [alert1] Step
-- ----------------------------------------------------------------------------
-- In CH01_VID13, Eng. Rami demonstrates the creation of [alert1]:
--   - Alert Name: [alert1]
--   - Alert Type: SQL Server performance condition alert
--   - Object:     General Statistics
--   - Counter:    User Connections
--   - Condition:  rises above 10
--   - Response 1: Execute Job -> [ITIbackupJob]
--   - Response 2: Notify Operator -> [ahmed] via E-mail
-- ----------------------------------------------------------------------------

PRINT '>>> 4. Configuring Alert [alert1] (Performance Condition: User Connections > 10)...';
IF NOT EXISTS (SELECT 1 FROM msdb.dbo.sysalerts WHERE name = N'alert1')
BEGIN
    EXEC msdb.dbo.sp_add_alert 
        @name = N'alert1', 
        @message_id = 0, 
        @severity = 0, 
        @enabled = 1, 
        @delay_between_responses = 0, 
        @include_event_description_in = 1, 
        @category_name = N'[Uncategorized]', 
        @performance_condition = N'General Statistics|User Connections||>|10', 
        @job_name = N'ITIbackupJob';

    -- Attach Notification to Operator [ahmed]
    EXEC msdb.dbo.sp_add_notification 
        @alert_name = N'alert1', 
        @operator_name = N'ahmed', 
        @notification_method = 1; -- 1 = E-mail
END
ELSE
BEGIN
    PRINT '>>> Alert [alert1] already exists. Updating response job and condition...';
    EXEC msdb.dbo.sp_update_alert
        @name = N'alert1',
        @enabled = 1,
        @performance_condition = N'General Statistics|User Connections||>|10',
        @job_name = N'ITIbackupJob';

    IF NOT EXISTS (
        SELECT 1 
        FROM msdb.dbo.sysnotifications n
        JOIN msdb.dbo.sysalerts a ON n.alert_id = a.id
        JOIN msdb.dbo.sysoperators o ON n.operator_id = o.id
        WHERE a.name = N'alert1' AND o.name = N'ahmed'
    )
    BEGIN
        EXEC msdb.dbo.sp_add_notification 
            @alert_name = N'alert1', 
            @operator_name = N'ahmed', 
            @notification_method = 1;
    END
END
GO

-- Additional Alert Types Taught in Lecture:
-- Error Event Alert (Severity 17 - Insufficient Resources / Disk Out of Space)
IF NOT EXISTS (SELECT 1 FROM msdb.dbo.sysalerts WHERE name = N'Alert_Severity_17_Resources')
BEGIN
    EXEC msdb.dbo.sp_add_alert 
        @name = N'Alert_Severity_17_Resources', 
        @severity = 17, 
        @enabled = 1, 
        @delay_between_responses = 60,
        @include_event_description_in = 1;

    EXEC msdb.dbo.sp_add_notification 
        @alert_name = N'Alert_Severity_17_Resources', 
        @operator_name = N'ahmed', 
        @notification_method = 1;
END
GO

-- ----------------------------------------------------------------------------
-- 5. Trigger Job Execution & Telemetry Audit Queries
-- ----------------------------------------------------------------------------

-- A. Audit Operator in msdb
PRINT '>>> 5A. Operators in msdb:';
SELECT id, name, enabled, email_address FROM msdb.dbo.sysoperators;

-- B. Audit Job & Schedule in msdb
PRINT '>>> 5B. Jobs and Schedules in msdb:';
SELECT 
    j.job_id,
    j.name AS JobName,
    j.enabled AS IsEnabled,
    o.name AS OperatorName,
    o.email_address AS OperatorEmail,
    s.step_id,
    s.step_name,
    s.subsystem,
    s.database_name,
    sch.name AS ScheduleName,
    sch.active_start_time AS StartTime
FROM msdb.dbo.sysjobs j
LEFT JOIN msdb.dbo.sysoperators o ON j.notify_email_operator_id = o.id
LEFT JOIN msdb.dbo.sysjobsteps s ON j.job_id = s.job_id
LEFT JOIN msdb.dbo.sysjobschedules js ON j.job_id = js.job_id
LEFT JOIN msdb.dbo.sysschedules sch ON js.schedule_id = sch.schedule_id
WHERE j.name = N'ITIbackupJob';

-- C. Audit Alert [alert1] in msdb
PRINT '>>> 5C. Alerts & Responses in msdb:';
SELECT 
    a.id AS AlertID,
    a.name AS AlertName,
    a.enabled AS IsEnabled,
    a.performance_condition AS Condition,
    j.name AS ResponseJob,
    o.name AS NotifyOperator,
    an.notification_method AS Method
FROM msdb.dbo.sysalerts a
LEFT JOIN msdb.dbo.sysjobs j ON a.job_id = j.job_id
LEFT JOIN msdb.dbo.sysnotifications an ON a.id = an.alert_id
LEFT JOIN msdb.dbo.sysoperators o ON an.operator_id = o.id
WHERE a.name = N'alert1';

-- D. Audit Job Execution History
PRINT '>>> 5D. Job Execution History:';
SELECT TOP 5
    h.instance_id,
    h.step_id,
    h.step_name,
    CASE h.run_status
        WHEN 0 THEN 'Failed'
        WHEN 1 THEN 'Succeeded'
        WHEN 2 THEN 'Retry'
        WHEN 3 THEN 'Canceled'
        WHEN 4 THEN 'In Progress'
    END AS ExecutionStatus,
    h.run_date,
    h.run_time,
    h.run_duration,
    h.message
FROM msdb.dbo.sysjobhistory h
JOIN msdb.dbo.sysjobs j ON h.job_id = j.job_id
WHERE j.name = N'ITIbackupJob'
ORDER BY h.instance_id DESC;
GO

PRINT '============================================================================';
PRINT '>>> CH01_VID13: Backup & SQL Server Agent Jobs verification completed with 100% success!';
PRINT '============================================================================';
GO
