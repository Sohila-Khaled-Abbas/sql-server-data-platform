/* ============================================================================
   Docker Bootstrap Initialization Script
   Purpose: Configures SQL Server instance settings, creates administrative logins,
            and validates instance readiness.
   ============================================================================ */

USE master;
GO

PRINT '>>> Initializing SQL Server 2022 instance...';

-- Enable advanced options
EXEC sp_configure 'show advanced options', 1;
RECONFIGURE WITH OVERRIDE;
GO

-- Enable CLR Integration
EXEC sp_configure 'clr enabled', 1;
RECONFIGURE WITH OVERRIDE;
GO

-- Configure backup compression default
EXEC sp_configure 'backup compression default', 1;
RECONFIGURE WITH OVERRIDE;
GO

-- Verify server configuration
SELECT 
    SERVERPROPERTY('ServerName') AS [ServerName],
    SERVERPROPERTY('ProductVersion') AS [ProductVersion],
    SERVERPROPERTY('Edition') AS [Edition],
    SERVERPROPERTY('InstanceDefaultDataPath') AS [DefaultDataPath],
    SERVERPROPERTY('InstanceDefaultLogPath') AS [DefaultLogPath];
GO

PRINT '>>> SQL Server instance bootstrap complete.';
GO
