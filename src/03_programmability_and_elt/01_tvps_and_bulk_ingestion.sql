/* ============================================================================
   Script: 01_tvps_and_bulk_ingestion.sql
   Module: 03_programmability_and_elt
   Purpose: High-performance bulk ingestion using strongly-typed Table-Valued
            Parameters (TVPs), eliminating network round-trips for batch APIs.
   ============================================================================ */

USE [OmniFlowDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Deploying Table-Valued Parameter bulk ingestion pipeline...';

-- 1. Create User-Defined Table Type (UDTT)
IF TYPE_ID(N'Sales.OrderBatchType') IS NOT NULL
BEGIN
    -- If dependent procedures exist, drop them first
    IF OBJECT_ID(N'Sales.usp_BulkIngestOrders', N'P') IS NOT NULL
        DROP PROCEDURE [Sales].[usp_BulkIngestOrders];
    
    DROP TYPE [Sales].[OrderBatchType];
END;
GO

CREATE TYPE [Sales].[OrderBatchType] AS TABLE
(
    [BatchRowId]    INT NOT NULL PRIMARY KEY,
    [OrderNumber]   VARCHAR(30) NOT NULL,
    [CustomerCode]  VARCHAR(20) NOT NULL,
    [OrderDate]     DATETIME2(3) NOT NULL,
    [ProductSKU]    VARCHAR(30) NOT NULL,
    [Quantity]      INT NOT NULL,
    [UnitPrice]     DECIMAL(18, 4) NOT NULL,
    [DiscountPct]   DECIMAL(5, 2) NOT NULL DEFAULT (0.00)
);
GO
PRINT '>>> Created UDTT: Sales.OrderBatchType.';
GO

-- 2. Create Bulk Ingestion Stored Procedure
CREATE OR ALTER PROCEDURE [Sales].[usp_BulkIngestOrders]
    @OrderBatch [Sales].[OrderBatchType] READONLY,
    @RowsProcessed INT = 0 OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON; -- Abort and rollback on any runtime error

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Step A: Validate that all customer codes and product SKUs exist
        IF EXISTS (
            SELECT 1 
            FROM @OrderBatch b
            LEFT JOIN [Customer].[Customer] c ON b.[CustomerCode] = c.[CustomerCode]
            WHERE c.[CustomerId] IS NULL
        )
        BEGIN
            THROW 50001, 'Ingestion Aborted: One or more CustomerCode values do not exist.', 1;
        END;

        IF EXISTS (
            SELECT 1 
            FROM @OrderBatch b
            LEFT JOIN [Inventory].[Product] p ON b.[ProductSKU] = p.[SKU]
            WHERE p.[ProductId] IS NULL
        )
        BEGIN
            THROW 50002, 'Ingestion Aborted: One or more ProductSKU values do not exist.', 1;
        END;

        -- Step B: Atomic Ingestion of Order Headers
        -- Intermediate mapping table to capture generated OrderIds
        DECLARE @HeaderMap TABLE (
            OrderId BIGINT,
            OrderNumber VARCHAR(30)
        );

        INSERT INTO [Sales].[Orders] (
            [OrderNumber], 
            [CustomerId], 
            [OrderDate], 
            [OrderStatus], 
            [SubTotal], 
            [TaxAmount], 
            [TotalAmount]
        )
        OUTPUT inserted.OrderId, inserted.OrderNumber INTO @HeaderMap
        SELECT 
            b.[OrderNumber],
            c.[CustomerId],
            MIN(b.[OrderDate]),
            'PE', -- Initial Status: Pending
            SUM(b.[Quantity] * b.[UnitPrice] * (1.00 - (b.[DiscountPct] / 100.00))),
            SUM(b.[Quantity] * b.[UnitPrice] * 0.10), -- 10% Tax
            SUM(b.[Quantity] * b.[UnitPrice] * (1.00 - (b.[DiscountPct] / 100.00))) + SUM(b.[Quantity] * b.[UnitPrice] * 0.10)
        FROM @OrderBatch b
        JOIN [Customer].[Customer] c ON b.[CustomerCode] = c.[CustomerCode]
        GROUP BY b.[OrderNumber], c.[CustomerId];

        -- Step C: Atomic Ingestion of Line Items
        INSERT INTO [Sales].[OrderItems] (
            [OrderId], 
            [ProductId], 
            [Quantity], 
            [UnitPrice], 
            [DiscountPct]
        )
        SELECT 
            hm.[OrderId],
            p.[ProductId],
            b.[Quantity],
            b.[UnitPrice],
            b.[DiscountPct]
        FROM @OrderBatch b
        JOIN @HeaderMap hm ON b.[OrderNumber] = hm.[OrderNumber]
        JOIN [Inventory].[Product] p ON b.[ProductSKU] = p.[SKU];

        SET @RowsProcessed = @@ROWCOUNT;

        COMMIT TRANSACTION;
        PRINT '>>> Ingestion succeeded. Total lines processed: ' + CAST(@RowsProcessed AS VARCHAR(10));
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrState INT = ERROR_STATE();
        
        RAISERROR(@ErrMsg, @ErrSeverity, @ErrState);
    END CATCH;
END;
GO
PRINT '>>> Created Stored Procedure: Sales.usp_BulkIngestOrders.';
GO
