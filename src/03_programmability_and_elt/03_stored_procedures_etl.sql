/* ============================================================================
   Script: 03_stored_procedures_etl.sql
   Module: 03_programmability_and_elt
   Purpose: Production-grade transactional ETL stored procedure managing order
            fulfillment, inventory reconciliation, and non-blocking change capture.
   Architecture Best Practices:
     - SET XACT_ABORT ON for immediate rollback on operational faults
     - Explicit transaction boundaries with TRY...CATCH
     - OUTPUT clause writing directly to audit sinks without extra round-trips
     - Re-raising original errors with modern THROW statement
   ============================================================================ */

USE [OmniFlowDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Creating Transactional ETL Stored Procedure: Sales.usp_FulfillOrder...';
GO

CREATE OR ALTER PROCEDURE [Sales].[usp_FulfillOrder]
    @OrderId            BIGINT,
    @TrackingNumber     VARCHAR(50) = NULL,
    @Carrier            VARCHAR(50) = 'Standard Logistics',
    @AuditUser          NVARCHAR(128) = NULL,
    @UpdatedStatus      CHAR(2) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- Default user context if not explicitly provided
    IF @AuditUser IS NULL
        SET @AuditUser = SUSER_SNAME();

    DECLARE @CurrentStatus CHAR(2);
    DECLARE @TotalAmount DECIMAL(18, 4);

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Step 1: Lock order row exclusively with UPDLOCK, HOLDLOCK to prevent race conditions
        SELECT 
            @CurrentStatus = [OrderStatus],
            @TotalAmount = [TotalAmount]
        FROM [Sales].[Orders] WITH (UPDLOCK, HOLDLOCK)
        WHERE [OrderId] = @OrderId;

        -- Validation: Check order existence
        IF @CurrentStatus IS NULL
        BEGIN
            THROW 51001, 'Order not found for the specified OrderId.', 1;
        END;

        -- Validation: Verify business status flow (Only Pending or Processing can be fulfilled)
        IF @CurrentStatus NOT IN ('PE', 'PR')
        BEGIN
            DECLARE @InvalidMsg NVARCHAR(200) = 
                FORMATMESSAGE('Cannot fulfill order in status %s. Must be PE or PR.', @CurrentStatus);
            THROW 51002, @InvalidMsg, 1;
        END;

        -- Step 2: Validate inventory availability for each line item
        IF EXISTS (
            SELECT 1
            FROM [Sales].[OrderItems] oi
            JOIN [Inventory].[Product] p ON oi.[ProductId] = p.[ProductId]
            WHERE oi.[OrderId] = @OrderId 
              AND p.[SafetyStock] < oi.[Quantity]
        )
        BEGIN
            THROW 51003, 'Fulfillment failed: Insufficient stock available for one or more order items.', 1;
        END;

        -- Step 3: Deduct inventory stock
        UPDATE p
        SET 
            p.[SafetyStock] = p.[SafetyStock] - oi.[Quantity],
            p.[ModifiedDate] = SYSUTCDATETIME()
        FROM [Inventory].[Product] p
        JOIN [Sales].[OrderItems] oi ON p.[ProductId] = oi.[ProductId]
        WHERE oi.[OrderId] = @OrderId;

        -- Step 4: Transition Order Status to Shipped ('SH') and log with OUTPUT clause
        UPDATE [Sales].[Orders]
        SET 
            [OrderStatus] = 'SH',
            [Notes] = ISNULL([Notes] + ' | ', '') + 'Shipped via ' + @Carrier + ' (' + ISNULL(@TrackingNumber, 'N/A') + ')'
        OUTPUT 
            deleted.[OrderId],
            'UPDATE' AS [Action],
            deleted.[OrderStatus] AS [OldStatus],
            inserted.[OrderStatus] AS [NewStatus],
            deleted.[TotalAmount] AS [OldTotalAmount],
            inserted.[TotalAmount] AS [NewTotalAmount],
            @AuditUser AS [ModifiedBy],
            SYSUTCDATETIME() AS [ModifiedDate],
            HOST_NAME() AS [AppHost]
        INTO [Audit].[OrderHistory] (
            [OrderId], [Action], [OldStatus], [NewStatus], 
            [OldTotalAmount], [NewTotalAmount], [ModifiedBy], [ModifiedDate], [AppHost]
        )
        WHERE [OrderId] = @OrderId;

        -- Step 5: Generate Partitioned Billing Invoice
        INSERT INTO [Sales].[Invoices] (
            [InvoiceDate],
            [OrderId],
            [CustomerId],
            [InvoiceAmount],
            [TaxAmount],
            [PaymentStatus]
        )
        SELECT 
            CAST(SYSUTCDATETIME() AS DATE),
            o.[OrderId],
            o.[CustomerId],
            o.[TotalAmount],
            o.[TaxAmount],
            'Unpaid'
        FROM [Sales].[Orders] o
        WHERE o.[OrderId] = @OrderId;

        SET @UpdatedStatus = 'SH';

        COMMIT TRANSACTION;
        PRINT '>>> Order ' + CAST(@OrderId AS VARCHAR(20)) + ' fulfilled and invoiced successfully.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        -- Telemetry log of failed execution
        DECLARE @ErrorNum INT = ERROR_NUMBER();
        DECLARE @ErrorMsg NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorLine INT = ERROR_LINE();

        PRINT '>>> Transaction rolled back. Error: ' + @ErrorMsg + ' (Line: ' + CAST(@ErrorLine AS VARCHAR(10)) + ')';
        THROW;
    END CATCH;
END;
GO
PRINT '>>> Created Stored Procedure: Sales.usp_FulfillOrder.';
GO
