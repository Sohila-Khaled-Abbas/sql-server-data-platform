/* ============================================================================
   Script: 03_etl_staging_to_dw.sql
   Module: 07_warehousing_and_reporting
   Purpose: Staging tables and idempotent ELT stored procedures loading Kimball
            dimensions (SCD 1 & 2) and FactSales from staging.
   ============================================================================ */

USE [OmniFlowDW];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Deploying Staging Tables and Data Warehouse ELT Pipelines...';

-- 1. Create Staging Tables
IF OBJECT_ID(N'stg.Customers', N'U') IS NOT NULL
    DROP TABLE [stg].[Customers];
GO

CREATE TABLE [stg].[Customers]
(
    [CustomerBK]    INT NOT NULL,
    [CustomerCode]  VARCHAR(20) NOT NULL,
    [FirstName]     NVARCHAR(50) NOT NULL,
    [LastName]      NVARCHAR(50) NOT NULL,
    [Email]         VARCHAR(100) NOT NULL,
    [PostalCode]    VARCHAR(10) NULL
);
GO

IF OBJECT_ID(N'stg.Products', N'U') IS NOT NULL
    DROP TABLE [stg].[Products];
GO

CREATE TABLE [stg].[Products]
(
    [ProductBK]     VARCHAR(30) NOT NULL,
    [ProductName]   NVARCHAR(150) NOT NULL,
    [CategoryName]  NVARCHAR(100) NOT NULL,
    [UnitPrice]     DECIMAL(18, 4) NOT NULL,
    [CostPrice]     DECIMAL(18, 4) NOT NULL
);
GO

IF OBJECT_ID(N'stg.Sales', N'U') IS NOT NULL
    DROP TABLE [stg].[Sales];
GO

CREATE TABLE [stg].[Sales]
(
    [OrderItemIdBK] BIGINT NOT NULL,
    [OrderIdBK]     BIGINT NOT NULL,
    [OrderNumberBK] VARCHAR(30) NOT NULL,
    [DateKey]       INT NOT NULL,
    [CustomerBK]    INT NOT NULL,
    [ProductBK]     VARCHAR(30) NOT NULL,
    [Quantity]      INT NOT NULL,
    [UnitPrice]     DECIMAL(18, 4) NOT NULL,
    [DiscountPct]   DECIMAL(5, 2) NOT NULL,
    [GrossAmount]   DECIMAL(18, 4) NOT NULL,
    [DiscountAmount]DECIMAL(18, 4) NOT NULL,
    [NetAmount]     DECIMAL(18, 4) NOT NULL,
    [MarginAmount]  DECIMAL(18, 4) NOT NULL
);
GO
PRINT '>>> Created Staging Tables in stg schema.';
GO

-- 2. ELT Procedure: Generate DimDate (Calendar Generation)
CREATE OR ALTER PROCEDURE [dw].[usp_PopulateDimDate]
    @StartDate DATE = '2022-01-01',
    @EndDate   DATE = '2030-12-31'
AS
BEGIN
    SET NOCOUNT ON;
    PRINT '>>> Populating dw.DimDate from ' + CAST(@StartDate AS VARCHAR(10)) + ' to ' + CAST(@EndDate AS VARCHAR(10)) + '...';

    DECLARE @CurrentDate DATE = @StartDate;

    WHILE @CurrentDate <= @EndDate
    BEGIN
        DECLARE @DateKey INT = CONVERT(INT, CONVERT(VARCHAR(8), @CurrentDate, 112));

        IF NOT EXISTS (SELECT 1 FROM [dw].[DimDate] WHERE [DateKey] = @DateKey)
        BEGIN
            INSERT INTO [dw].[DimDate] (
                [DateKey],
                [FullDate],
                [DayNumberOfWeek],
                [DayNameOfWeek],
                [DayNumberOfMonth],
                [DayNumberOfYear],
                [WeekNumberOfYear],
                [MonthName],
                [MonthNumberOfYear],
                [CalendarQuarter],
                [CalendarYear],
                [FiscalYear],
                [FiscalQuarter],
                [IsWeekend]
            )
            VALUES (
                @DateKey,
                @CurrentDate,
                DATEPART(WEEKDAY, @CurrentDate),
                DATENAME(WEEKDAY, @CurrentDate),
                DATEPART(DAY, @CurrentDate),
                DATEPART(DAYOFYEAR, @CurrentDate),
                DATEPART(ISO_WEEK, @CurrentDate),
                DATENAME(MONTH, @CurrentDate),
                DATEPART(MONTH, @CurrentDate),
                DATEPART(QUARTER, @CurrentDate),
                DATEPART(YEAR, @CurrentDate),
                CASE WHEN DATEPART(MONTH, @CurrentDate) >= 7 THEN DATEPART(YEAR, @CurrentDate) + 1 ELSE DATEPART(YEAR, @CurrentDate) END,
                CASE 
                    WHEN DATEPART(MONTH, @CurrentDate) IN (7, 8, 9) THEN 1
                    WHEN DATEPART(MONTH, @CurrentDate) IN (10, 11, 12) THEN 2
                    WHEN DATEPART(MONTH, @CurrentDate) IN (1, 2, 3) THEN 3
                    ELSE 4
                END,
                CASE WHEN DATEPART(WEEKDAY, @CurrentDate) IN (1, 7) THEN 1 ELSE 0 END
            );
        END;

        SET @CurrentDate = DATEADD(DAY, 1, @CurrentDate);
    END;

    DECLARE @TotalRows INT;
    SELECT @TotalRows = COUNT(*) FROM [dw].[DimDate];
    PRINT '>>> dw.DimDate population completed. Total rows: ' + CAST(@TotalRows AS VARCHAR(10));
END;
GO
PRINT '>>> Created Stored Procedure: dw.usp_PopulateDimDate.';
GO

-- 3. ELT Procedure: Load DimCustomer (Kimball SCD Type 2)
CREATE OR ALTER PROCEDURE [dw].[usp_LoadDimCustomer_SCD2]
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    PRINT '>>> Executing SCD Type 2 merge for dw.DimCustomer...';

    DECLARE @CurrentTimestamp DATETIME2(3) = SYSUTCDATETIME();
    DECLARE @FutureInfinity DATETIME2(3) = '9999-12-31 23:59:59.999';

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Step A: Identify changed records and retire them (ValidTo = CurrentTimestamp, IsCurrent = 0)
        UPDATE d
        SET 
            d.[ValidTo] = @CurrentTimestamp,
            d.[IsCurrent] = 0
        FROM [dw].[DimCustomer] d
        JOIN [stg].[Customers] s ON d.[CustomerBK] = s.[CustomerBK]
        WHERE d.[IsCurrent] = 1
          AND (
               d.[Email] <> s.[Email] 
            OR ISNULL(d.[PostalCode], '') <> ISNULL(s.[PostalCode], '')
            OR d.[FirstName] <> s.[FirstName]
            OR d.[LastName] <> s.[LastName]
          );

        -- Step B: Insert new versions for changed rows and brand new customers
        INSERT INTO [dw].[DimCustomer] (
            [CustomerBK], [CustomerCode], [FirstName], [LastName], 
            [Email], [PostalCode], [ValidFrom], [ValidTo], [IsCurrent]
        )
        SELECT 
            s.[CustomerBK],
            s.[CustomerCode],
            s.[FirstName],
            s.[LastName],
            s.[Email],
            s.[PostalCode],
            @CurrentTimestamp,
            @FutureInfinity,
            1
        FROM [stg].[Customers] s
        LEFT JOIN [dw].[DimCustomer] d ON s.[CustomerBK] = d.[CustomerBK] AND d.[IsCurrent] = 1
        WHERE d.[CustomerSK] IS NULL;

        COMMIT TRANSACTION;
        PRINT '>>> DimCustomer SCD Type 2 load successful.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO
PRINT '>>> Created Stored Procedure: dw.usp_LoadDimCustomer_SCD2.';
GO

-- 4. ELT Procedure: Load FactSales from Staging
CREATE OR ALTER PROCEDURE [dw].[usp_LoadFactSales]
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    PRINT '>>> Executing incremental load for dw.FactSales...';

    BEGIN TRY
        BEGIN TRANSACTION;

        INSERT INTO [dw].[FactSales] (
            [DateKey],
            [CustomerSK],
            [ProductSK],
            [OrderIdBK],
            [OrderNumberBK],
            [OrderItemIdBK],
            [Quantity],
            [UnitPrice],
            [DiscountPct],
            [GrossAmount],
            [DiscountAmount],
            [NetAmount],
            [MarginAmount]
        )
        SELECT 
            s.[DateKey],
            ISNULL(dc.[CustomerSK], -1),
            ISNULL(dp.[ProductSK], -1),
            s.[OrderIdBK],
            s.[OrderNumberBK],
            s.[OrderItemIdBK],
            s.[Quantity],
            s.[UnitPrice],
            s.[DiscountPct],
            s.[GrossAmount],
            s.[DiscountAmount],
            s.[NetAmount],
            s.[MarginAmount]
        FROM [stg].[Sales] s
        -- Lookup current customer surrogate key
        LEFT JOIN [dw].[DimCustomer] dc 
            ON s.[CustomerBK] = dc.[CustomerBK] AND dc.[IsCurrent] = 1
        -- Lookup product surrogate key
        LEFT JOIN [dw].[DimProduct] dp 
            ON s.[ProductBK] = dp.[ProductBK]
        -- Avoid duplicate ingestion
        WHERE NOT EXISTS (
            SELECT 1 FROM [dw].[FactSales] f 
            WHERE f.[OrderItemIdBK] = s.[OrderItemIdBK]
        );

        COMMIT TRANSACTION;
        PRINT '>>> FactSales incremental load completed.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO
PRINT '>>> Created Stored Procedure: dw.usp_LoadFactSales.';
GO
