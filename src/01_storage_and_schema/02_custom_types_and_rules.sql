/* ============================================================================
   Script: 02_custom_types_and_rules.sql
   Module: 01_storage_and_schema
   Purpose: Defines domain-specific User-Defined Types (UDTs), Rules, and Defaults
            enforcing data dictionary standards across all transactional tables.
   ============================================================================ */

USE [OmniFlowDB];
GO

SET NOCOUNT ON;
GO

PRINT '>>> Deploying User-Defined Data Types, Rules, and Defaults...';

-- 1. Create Core Application Schemas
IF SCHEMA_ID(N'Customer') IS NULL
    EXEC('CREATE SCHEMA [Customer];');
GO

IF SCHEMA_ID(N'Inventory') IS NULL
    EXEC('CREATE SCHEMA [Inventory];');
GO

IF SCHEMA_ID(N'Sales') IS NULL
    EXEC('CREATE SCHEMA [Sales];');
GO

IF SCHEMA_ID(N'Audit') IS NULL
    EXEC('CREATE SCHEMA [Audit];');
GO

-- 2. Create User-Defined Data Types (UDTs)
IF NOT EXISTS (SELECT 1 FROM sys.types WHERE name = N'udt_Currency')
BEGIN
    CREATE TYPE [dbo].[udt_Currency] FROM DECIMAL(18, 4) NOT NULL;
    PRINT '>>> Created UDT: udt_Currency (DECIMAL(18, 4))';
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.types WHERE name = N'udt_PostalCode')
BEGIN
    CREATE TYPE [dbo].[udt_PostalCode] FROM VARCHAR(10) NULL;
    PRINT '>>> Created UDT: udt_PostalCode (VARCHAR(10))';
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.types WHERE name = N'udt_StatusCode')
BEGIN
    CREATE TYPE [dbo].[udt_StatusCode] FROM CHAR(2) NOT NULL;
    PRINT '>>> Created UDT: udt_StatusCode (CHAR(2))';
END;
GO

-- 3. Create Rules and Bind to UDTs
-- Note: While CHECK constraints are preferred on tables, Rules demonstrate backward-compatible
-- domain constraint binding as covered in advanced SQL Server database management.
IF NOT EXISTS (SELECT 1 FROM sys.types WHERE name = N'udt_DemoRate')
    CREATE TYPE [dbo].[udt_DemoRate] FROM DECIMAL(5, 2) NOT NULL;
GO

IF OBJECT_ID(N'dbo.rule_PositiveRate', N'R') IS NOT NULL
    DROP RULE [dbo].[rule_PositiveRate];
GO

CREATE RULE [dbo].[rule_PositiveRate]
AS
    @val >= 0.00;
GO
PRINT '>>> Created Rule: rule_PositiveRate';
GO

-- Bind rule to udt_DemoRate
EXEC sp_bindrule 'dbo.rule_PositiveRate', 'dbo.udt_DemoRate';
PRINT '>>> Bound rule_PositiveRate to udt_DemoRate.';
GO

-- 4. Create Defaults and Bind to UDTs
IF OBJECT_ID(N'dbo.def_ZeroRate', N'D') IS NOT NULL
    DROP DEFAULT [dbo].[def_ZeroRate];
GO

CREATE DEFAULT [dbo].[def_ZeroRate]
AS
    0.00;
GO
PRINT '>>> Created Default: def_ZeroRate';
GO

EXEC sp_bindefault 'dbo.def_ZeroRate', 'dbo.udt_DemoRate';
PRINT '>>> Bound def_ZeroRate to udt_DemoRate.';
GO

-- 5. Audit Verification: List user-defined types and their bindings
SELECT 
    t.name AS [TypeName],
    st.name AS [BaseSystemType],
    t.max_length AS [MaxLength],
    t.precision AS [Precision],
    t.scale AS [Scale],
    t.is_nullable AS [IsNullable],
    OBJECT_NAME(t.default_object_id) AS [BoundDefault],
    OBJECT_NAME(t.rule_object_id) AS [BoundRule]
FROM sys.types t
JOIN sys.types st ON t.system_type_id = st.system_type_id AND st.user_type_id = st.system_type_id
WHERE t.is_user_defined = 1;
GO
