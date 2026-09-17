/* ============================================================================
   Script: test_stored_procedures.sql
   Module: tests/tSQLt
   Purpose: Unit testing test cases validating ACID boundaries, integrity
            constraints, TVP bulk ingestion, and trigger change capture.
   Note: Can be executed directly as standalone integration test harness or
         within the tSQLt unit testing framework.
   ============================================================================ */

USE [OmniFlowDB];
GO

SET NOCOUNT ON;
GO

PRINT '============================================================================';
PRINT '  RUNNING AUTOMATED UNIT & INTEGRATION TEST HARNESS';
PRINT '============================================================================';

DECLARE @PassedTests INT = 0;
DECLARE @FailedTests INT = 0;

-- ----------------------------------------------------------------------------
-- TEST 1: Constraint Verification - Invalid Email Format Rejection
-- ----------------------------------------------------------------------------
PRINT '>>> [TEST 1] Testing Email CHECK Constraint Rejection...';
BEGIN TRY
    INSERT INTO [Customer].[Customer] ([CustomerCode], [FirstName], [LastName], [Email])
    VALUES ('CUST-FAIL', 'Test', 'Invalid', 'bad-email-without-at-sign');
    
    PRINT '    FAILED: Invalid email was accepted!';
    SET @FailedTests = @FailedTests + 1;
END TRY
BEGIN CATCH
    IF ERROR_NUMBER() = 547 -- CHECK constraint violation
    BEGIN
        PRINT '    PASSED: CHECK constraint correctly blocked malformed email.';
        SET @PassedTests = @PassedTests + 1;
    END
    ELSE
    BEGIN
        PRINT '    FAILED: Unexpected error: ' + ERROR_MESSAGE();
        SET @FailedTests = @FailedTests + 1;
    END;
END CATCH;

-- ----------------------------------------------------------------------------
-- TEST 2: TVP Ingestion - Atomic Validation & Rollback on Invalid Customer
-- ----------------------------------------------------------------------------
PRINT '>>> [TEST 2] Testing TVP Atomic Rollback on Unknown Customer Code...';
BEGIN TRY
    DECLARE @InvalidBatch [Sales].[OrderBatchType];
    INSERT INTO @InvalidBatch ([BatchRowId], [OrderNumber], [CustomerCode], [OrderDate], [ProductSKU], [Quantity], [UnitPrice])
    VALUES (1, 'ORD-FAIL-001', 'NONEXISTENT-CUST', SYSUTCDATETIME(), 'SKU-001', 1, 100.00);

    DECLARE @Rows INT;
    EXEC [Sales].[usp_BulkIngestOrders] @OrderBatch = @InvalidBatch, @RowsProcessed = @Rows OUTPUT;

    PRINT '    FAILED: Unknown CustomerCode was ingested without error!';
    SET @FailedTests = @FailedTests + 1;
END TRY
BEGIN CATCH
    IF ERROR_NUMBER() = 50001
    BEGIN
        PRINT '    PASSED: Stored procedure aborted and rolled back with custom error 50001.';
        SET @PassedTests = @PassedTests + 1;
    END
    ELSE
    BEGIN
        PRINT '    FAILED: Unexpected error: ' + ERROR_MESSAGE();
        SET @FailedTests = @FailedTests + 1;
    END;
END CATCH;

-- ----------------------------------------------------------------------------
-- TEST 3: TVP Ingestion - Successful Batch Ingestion
-- ----------------------------------------------------------------------------
PRINT '>>> [TEST 3] Testing Valid TVP Batch Ingestion...';
BEGIN TRY
    -- Ensure test customer and product exist
    IF NOT EXISTS (SELECT 1 FROM [Customer].[Customer] WHERE [CustomerCode] = 'TEST-CUST-100')
    BEGIN
        INSERT INTO [Customer].[Customer] ([CustomerCode], [FirstName], [LastName], [Email])
        VALUES ('TEST-CUST-100', 'Test', 'Consumer', 'consumer100@test.com');
    END;

    IF NOT EXISTS (SELECT 1 FROM [Inventory].[Category] WHERE [CategoryName] = 'Testing')
    BEGIN
        INSERT INTO [Inventory].[Category] ([CategoryName]) VALUES ('Testing');
    END;

    DECLARE @TestCatId INT = (SELECT CategoryId FROM [Inventory].[Category] WHERE CategoryName = 'Testing');

    IF NOT EXISTS (SELECT 1 FROM [Inventory].[Product] WHERE [SKU] = 'TEST-SKU-100')
    BEGIN
        INSERT INTO [Inventory].[Product] ([SKU], [ProductName], [CategoryId], [UnitPrice], [CostPrice], [SafetyStock])
        VALUES ('TEST-SKU-100', 'Unit Test Widget', @TestCatId, 50.00, 30.00, 100);
    END;

    DECLARE @ValidBatch [Sales].[OrderBatchType];
    DECLARE @TestOrderNumber VARCHAR(30) = 'ORD-UNIT-' + CAST(ABS(CHECKSUM(NEWID())) % 100000 AS VARCHAR(10));

    INSERT INTO @ValidBatch ([BatchRowId], [OrderNumber], [CustomerCode], [OrderDate], [ProductSKU], [Quantity], [UnitPrice], [DiscountPct])
    VALUES 
        (1, @TestOrderNumber, 'TEST-CUST-100', SYSUTCDATETIME(), 'TEST-SKU-100', 2, 50.00, 0.00),
        (2, @TestOrderNumber, 'TEST-CUST-100', SYSUTCDATETIME(), 'TEST-SKU-100', 3, 50.00, 10.00);

    DECLARE @ProcessedCount INT;
    EXEC [Sales].[usp_BulkIngestOrders] @OrderBatch = @ValidBatch, @RowsProcessed = @ProcessedCount OUTPUT;

    IF EXISTS (SELECT 1 FROM [Sales].[Orders] WHERE [OrderNumber] = @TestOrderNumber)
       AND (SELECT COUNT(*) FROM [Sales].[OrderItems] oi JOIN [Sales].[Orders] o ON oi.OrderId = o.OrderId WHERE o.OrderNumber = @TestOrderNumber) = 2
    BEGIN
        PRINT '    PASSED: Order header and line items ingested atomically.';
        SET @PassedTests = @PassedTests + 1;
    END
    ELSE
    BEGIN
        PRINT '    FAILED: Order lines missing after ingestion.';
        SET @FailedTests = @FailedTests + 1;
    END;
END TRY
BEGIN CATCH
    PRINT '    FAILED: Exception raised: ' + ERROR_MESSAGE();
    SET @FailedTests = @FailedTests + 1;
END CATCH;

-- ----------------------------------------------------------------------------
-- TEST 4: Audit Trigger - Verifying State Capture on Order Update
-- ----------------------------------------------------------------------------
PRINT '>>> [TEST 4] Testing Audit Trigger Change Data Capture...';
BEGIN TRY
    DECLARE @TargetOrderId BIGINT = (SELECT TOP 1 OrderId FROM [Sales].[Orders] WHERE OrderStatus = 'PE');
    
    IF @TargetOrderId IS NOT NULL
    BEGIN
        DECLARE @PreAuditCount INT = (SELECT COUNT(*) FROM [Audit].[OrderHistory] WHERE OrderId = @TargetOrderId);

        -- Perform update
        UPDATE [Sales].[Orders]
        SET [OrderStatus] = 'PR', [TotalAmount] = [TotalAmount] + 10.00
        WHERE [OrderId] = @TargetOrderId;

        DECLARE @PostAuditCount INT = (SELECT COUNT(*) FROM [Audit].[OrderHistory] WHERE OrderId = @TargetOrderId);

        IF @PostAuditCount > @PreAuditCount
        BEGIN
            PRINT '    PASSED: Audit trigger recorded state transition in Audit.OrderHistory.';
            SET @PassedTests = @PassedTests + 1;
        END
        ELSE
        BEGIN
            PRINT '    FAILED: No audit record captured for OrderId ' + CAST(@TargetOrderId AS VARCHAR(20));
            SET @FailedTests = @FailedTests + 1;
        END;
    END
    ELSE
    BEGIN
        PRINT '    SKIPPED: No pending orders found to test status transition.';
    END;
END TRY
BEGIN CATCH
    PRINT '    FAILED: Audit trigger test error: ' + ERROR_MESSAGE();
    SET @FailedTests = @FailedTests + 1;
END CATCH;

-- ----------------------------------------------------------------------------
-- SUMMARY
-- ----------------------------------------------------------------------------
PRINT '============================================================================';
PRINT '  TEST RESULTS SUMMARY';
PRINT '  Passed: ' + CAST(@PassedTests AS VARCHAR(5));
PRINT '  Failed: ' + CAST(@FailedTests AS VARCHAR(5));
PRINT '============================================================================';
GO
