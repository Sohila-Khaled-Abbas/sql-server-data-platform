/* ============================================================================
   Script: 02_ddl_and_server_triggers.sql
   Module: 04_governance_and_audit
   Purpose: Implements database-scoped DDL triggers and event-driven schema
            governance using XML EVENTDATA() capture.
   ============================================================================ */

USE [OmniFlowDB];
GO

SET NOCOUNT ON;
GO

PRINT '>>> Setting up Schema Governance and DDL Audit Infrastructure...';

-- 1. Create Schema Audit Log Table
IF OBJECT_ID(N'Audit.SchemaChangeLog', N'U') IS NULL
BEGIN
    CREATE TABLE [Audit].[SchemaChangeLog]
    (
        [LogId]         BIGINT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
        [PostTime]      DATETIME2(3) NOT NULL,
        [DatabaseUser]  NVARCHAR(128) NOT NULL,
        [LoginName]     NVARCHAR(128) NOT NULL,
        [EventType]     NVARCHAR(100) NOT NULL,
        [SchemaName]    NVARCHAR(128) NULL,
        [ObjectName]    NVARCHAR(128) NULL,
        [ObjectType]    NVARCHAR(100) NULL,
        [CommandText]   NVARCHAR(MAX) NOT NULL,
        [EventDataXml]  XML NOT NULL
    ) ON [DATA_FG];

    PRINT '>>> Created Table: Audit.SchemaChangeLog.';
END;
GO

-- 2. Create Database-Level DDL Trigger
IF EXISTS (SELECT 1 FROM sys.triggers WHERE parent_class_desc = 'DATABASE' AND name = N'trg_AuditAndProtectSchemaDDL')
    DROP TRIGGER [trg_AuditAndProtectSchemaDDL] ON DATABASE;
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

CREATE TRIGGER [trg_AuditAndProtectSchemaDDL]
ON DATABASE
FOR DDL_TABLE_EVENTS, DDL_VIEW_EVENTS, DDL_PROCEDURE_EVENTS, DDL_FUNCTION_EVENTS
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @EventData XML = EVENTDATA();
    DECLARE @EventType NVARCHAR(100) = @EventData.value('(/EVENT_INSTANCE/EventType)[1]', 'NVARCHAR(100)');
    DECLARE @ObjectName NVARCHAR(128) = @EventData.value('(/EVENT_INSTANCE/ObjectName)[1]', 'NVARCHAR(128)');
    DECLARE @SchemaName NVARCHAR(128) = @EventData.value('(/EVENT_INSTANCE/SchemaName)[1]', 'NVARCHAR(128)');
    DECLARE @CommandText NVARCHAR(MAX) = @EventData.value('(/EVENT_INSTANCE/TSQLCommand/CommandText)[1]', 'NVARCHAR(MAX)');

    -- 1. Log every DDL event into Audit.SchemaChangeLog
    INSERT INTO [Audit].[SchemaChangeLog] (
        [PostTime],
        [DatabaseUser],
        [LoginName],
        [EventType],
        [SchemaName],
        [ObjectName],
        [ObjectType],
        [CommandText],
        [EventDataXml]
    )
    VALUES (
        @EventData.value('(/EVENT_INSTANCE/PostTime)[1]', 'DATETIME2(3)'),
        @EventData.value('(/EVENT_INSTANCE/UserName)[1]', 'NVARCHAR(128)'),
        @EventData.value('(/EVENT_INSTANCE/LoginName)[1]', 'NVARCHAR(128)'),
        @EventType,
        @SchemaName,
        @ObjectName,
        @EventData.value('(/EVENT_INSTANCE/ObjectType)[1]', 'NVARCHAR(100)'),
        @CommandText,
        @EventData
    );

    -- 2. Guardrail: Guard core production tables against accidental DROP TABLE
    -- Tables in Customer, Sales, Inventory schemas are protected unless session override is set
    IF @EventType = 'DROP_TABLE' AND @SchemaName IN ('Customer', 'Sales', 'Inventory')
    BEGIN
        -- Check for emergency bypass session context: 'AllowDropProductionTable' = 'YES'
        IF ISNULL(CAST(SESSION_CONTEXT(N'AllowDropProductionTable') AS VARCHAR(10)), 'NO') <> 'YES'
        BEGIN
            PRINT '>>> [SECURITY ALERT] DROP TABLE rejected on protected schema: ' + @SchemaName + '.' + @ObjectName;
            PRINT '>>> Set SESSION_CONTEXT(N''AllowDropProductionTable'', N''YES'') to override with DBA authorization.';
            ROLLBACK;
        END;
    END;
END;
GO
PRINT '>>> Created Database DDL Trigger: trg_AuditAndProtectSchemaDDL.';
GO
