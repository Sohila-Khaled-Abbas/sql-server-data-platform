/* ============================================================================
   Script: 02_dimensional_star_schema.sql
   Module: 07_warehousing_and_reporting
   Purpose: Provisions the OmniFlowDW analytical database and builds a Kimball
            star schema with SCD Type 1 & 2 dimensions and additive sales facts.
   ============================================================================ */

USE master;
GO

SET NOCOUNT ON;
GO

-- 1. Create Data Warehouse Database if not exists
DECLARE @DataPath NVARCHAR(512) = CAST(SERVERPROPERTY('InstanceDefaultDataPath') AS NVARCHAR(512));
DECLARE @LogPath  NVARCHAR(512) = CAST(SERVERPROPERTY('InstanceDefaultLogPath')  AS NVARCHAR(512));

IF @DataPath IS NULL OR @DataPath = ''
    SELECT TOP 1 @DataPath = LEFT(physical_name, LEN(physical_name) - CHARINDEX('\', REVERSE(physical_name)) + 1)
    FROM sys.master_files WHERE database_id = 1 AND type = 0;

IF @LogPath IS NULL OR @LogPath = ''
    SELECT TOP 1 @LogPath = LEFT(physical_name, LEN(physical_name) - CHARINDEX('\', REVERSE(physical_name)) + 1)
    FROM sys.master_files WHERE database_id = 1 AND type = 1;

IF RIGHT(@DataPath, 1) NOT IN ('\', '/') SET @DataPath = @DataPath + '\';
IF RIGHT(@LogPath, 1) NOT IN ('\', '/') SET @LogPath = @LogPath + '\';

IF DB_ID(N'OmniFlowDW') IS NULL
BEGIN
    PRINT '>>> Creating Analytical Database OmniFlowDW...';
    DECLARE @SqlCreateDW NVARCHAR(MAX) = N'
    CREATE DATABASE [OmniFlowDW]
    ON PRIMARY
    (
        NAME = N''OmniFlowDW_Primary'',
        FILENAME = N''' + @DataPath + N'OmniFlowDW_Primary.mdf'',
        SIZE = 128MB,
        FILEGROWTH = 128MB
    )
    LOG ON
    (
        NAME = N''OmniFlowDW_Log'',
        FILENAME = N''' + @LogPath + N'OmniFlowDW_Log.ldf'',
        SIZE = 64MB,
        FILEGROWTH = 64MB
    );';

    EXEC sp_executesql @SqlCreateDW;
    PRINT '>>> Created Database: OmniFlowDW.';
END;
GO

USE [OmniFlowDW];
GO

-- 2. Create Warehouse Schema
IF SCHEMA_ID(N'dw') IS NULL
    EXEC('CREATE SCHEMA [dw];');
GO

IF SCHEMA_ID(N'stg') IS NULL
    EXEC('CREATE SCHEMA [stg];');
GO

PRINT '>>> Deploying Kimball Star Schema Objects...';

-- 3. Dimension: dw.DimDate
IF OBJECT_ID(N'dw.DimDate', N'U') IS NULL
BEGIN
    CREATE TABLE [dw].[DimDate]
    (
        [DateKey]           INT NOT NULL,          -- Format: YYYYMMDD
        [FullDate]          DATE NOT NULL,
        [DayNumberOfWeek]   TINYINT NOT NULL,
        [DayNameOfWeek]     VARCHAR(10) NOT NULL,
        [DayNumberOfMonth]  TINYINT NOT NULL,
        [DayNumberOfYear]   SMALLINT NOT NULL,
        [WeekNumberOfYear]  TINYINT NOT NULL,
        [MonthName]         VARCHAR(15) NOT NULL,
        [MonthNumberOfYear] TINYINT NOT NULL,
        [CalendarQuarter]   TINYINT NOT NULL,
        [CalendarYear]      SMALLINT NOT NULL,
        [FiscalYear]        SMALLINT NOT NULL,
        [FiscalQuarter]     TINYINT NOT NULL,
        [IsWeekend]         BIT NOT NULL,
        [IsHoliday]         BIT NOT NULL CONSTRAINT [DF_DimDate_Holiday] DEFAULT (0),

        CONSTRAINT [PK_DimDate] PRIMARY KEY CLUSTERED ([DateKey])
    );
    PRINT '>>> Created Dimension: dw.DimDate.';
END;
GO

-- 4. Dimension: dw.DimCustomer (Kimball Slowly Changing Dimension Type 2)
IF OBJECT_ID(N'dw.DimCustomer', N'U') IS NULL
BEGIN
    CREATE TABLE [dw].[DimCustomer]
    (
        [CustomerSK]    INT IDENTITY(1, 1) NOT NULL, -- Surrogate Key
        [CustomerBK]    INT NOT NULL,                -- Business Key (OLTP CustomerId)
        [CustomerCode]  VARCHAR(20) NOT NULL,
        [FirstName]     NVARCHAR(50) NOT NULL,
        [LastName]      NVARCHAR(50) NOT NULL,
        [Email]         VARCHAR(100) NOT NULL,
        [PostalCode]    VARCHAR(10) NULL,
        
        -- SCD Type 2 Temporal Validity Tracking
        [ValidFrom]     DATETIME2(3) NOT NULL,
        [ValidTo]       DATETIME2(3) NOT NULL,
        [IsCurrent]     BIT NOT NULL,

        CONSTRAINT [PK_DimCustomer] PRIMARY KEY CLUSTERED ([CustomerSK])
    );

    CREATE NONCLUSTERED INDEX [IX_DimCustomer_BK_Current]
    ON [dw].[DimCustomer] ([CustomerBK], [IsCurrent])
    INCLUDE ([CustomerSK]);

    PRINT '>>> Created Dimension: dw.DimCustomer (SCD Type 2).';
END;
GO

-- 5. Dimension: dw.DimProduct (SCD Type 1 - In-Place Overwrite)
IF OBJECT_ID(N'dw.DimProduct', N'U') IS NULL
BEGIN
    CREATE TABLE [dw].[DimProduct]
    (
        [ProductSK]     INT IDENTITY(1, 1) NOT NULL,
        [ProductBK]     VARCHAR(30) NOT NULL,        -- Business Key (SKU)
        [ProductName]   NVARCHAR(150) NOT NULL,
        [CategoryName]  NVARCHAR(100) NOT NULL,
        [UnitPrice]     DECIMAL(18, 4) NOT NULL,
        [CostPrice]     DECIMAL(18, 4) NOT NULL,

        CONSTRAINT [PK_DimProduct] PRIMARY KEY CLUSTERED ([ProductSK]),
        CONSTRAINT [UQ_DimProduct_ProductBK] UNIQUE NONCLUSTERED ([ProductBK])
    );
    PRINT '>>> Created Dimension: dw.DimProduct (SCD Type 1).';
END;
GO

-- 6. Fact Table: dw.FactSales (Granularity: 1 row per order line item)
IF OBJECT_ID(N'dw.FactSales', N'U') IS NULL
BEGIN
    CREATE TABLE [dw].[FactSales]
    (
        [SalesFactId]           BIGINT IDENTITY(1, 1) NOT NULL,
        
        -- Foreign Keys to Dimensions
        [DateKey]               INT NOT NULL,
        [CustomerSK]            INT NOT NULL,
        [ProductSK]             INT NOT NULL,
        
        -- Degenerate Dimensions (Retained from OLTP for line-level drilldown)
        [OrderIdBK]             BIGINT NOT NULL,
        [OrderNumberBK]         VARCHAR(30) NOT NULL,
        [OrderItemIdBK]         BIGINT NOT NULL,

        -- Additive Measures
        [Quantity]              INT NOT NULL,
        [UnitPrice]             DECIMAL(18, 4) NOT NULL,
        [DiscountPct]           DECIMAL(5, 2) NOT NULL,
        [GrossAmount]           DECIMAL(18, 4) NOT NULL,
        [DiscountAmount]        DECIMAL(18, 4) NOT NULL,
        [NetAmount]             DECIMAL(18, 4) NOT NULL,
        [MarginAmount]          DECIMAL(18, 4) NOT NULL,

        -- Audit Metadata
        [IngestionTimestamp]    DATETIME2(3) NOT NULL CONSTRAINT [DF_FactSales_Ingestion] DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT [PK_FactSales] PRIMARY KEY CLUSTERED ([SalesFactId]),
        CONSTRAINT [FK_FactSales_Date] FOREIGN KEY ([DateKey]) REFERENCES [dw].[DimDate]([DateKey]),
        CONSTRAINT [FK_FactSales_Customer] FOREIGN KEY ([CustomerSK]) REFERENCES [dw].[DimCustomer]([CustomerSK]),
        CONSTRAINT [FK_FactSales_Product] FOREIGN KEY ([ProductSK]) REFERENCES [dw].[DimProduct]([ProductSK])
    );

    CREATE NONCLUSTERED INDEX [IX_FactSales_Date_Customer]
    ON [dw].[FactSales] ([DateKey], [CustomerSK])
    INCLUDE ([NetAmount], [MarginAmount], [Quantity]);

    PRINT '>>> Created Fact Table: dw.FactSales.';
END;
GO
