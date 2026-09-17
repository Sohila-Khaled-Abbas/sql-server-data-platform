/* ============================================================================
   Script: 01_audit_change_capture_triggers.sql
   Module: 04_governance_and_audit
   Purpose: Implements set-based DML triggers capturing Change Data Capture (CDC)
            traces via virtual inserted and deleted tables without locking.
   ============================================================================ */

USE [OmniFlowDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Creating Audit Change-Capture DML Triggers...';

-- Drop existing trigger if present
IF OBJECT_ID(N'Sales.trg_Orders_AuditChangeCapture', N'TR') IS NOT NULL
    DROP TRIGGER [Sales].[trg_Orders_AuditChangeCapture];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

CREATE TRIGGER [Sales].[trg_Orders_AuditChangeCapture]
ON [Sales].[Orders]
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Avoid recursive trigger execution
    IF TRIGGER_NESTLEVEL() > 1
        RETURN;

    DECLARE @Action VARCHAR(10);
    DECLARE @HasInserted BIT = CASE WHEN EXISTS (SELECT 1 FROM inserted) THEN 1 ELSE 0 END;
    DECLARE @HasDeleted  BIT = CASE WHEN EXISTS (SELECT 1 FROM deleted) THEN 1 ELSE 0 END;

    IF @HasInserted = 1 AND @HasDeleted = 1
        SET @Action = 'UPDATE';
    ELSE IF @HasInserted = 1 AND @HasDeleted = 0
        SET @Action = 'INSERT';
    ELSE IF @HasInserted = 0 AND @HasDeleted = 1
        SET @Action = 'DELETE';
    ELSE
        RETURN; -- No rows affected

    -- CRITICAL DBRE RULE: Always write set-based trigger logic!
    -- Never assume a single row is inserted or updated.
    IF @Action = 'UPDATE'
    BEGIN
        INSERT INTO [Audit].[OrderHistory] (
            [OrderId],
            [Action],
            [OldStatus],
            [NewStatus],
            [OldTotalAmount],
            [NewTotalAmount],
            [ModifiedBy],
            [ModifiedDate],
            [AppHost]
        )
        SELECT 
            i.[OrderId],
            'UPDATE',
            d.[OrderStatus],
            i.[OrderStatus],
            d.[TotalAmount],
            i.[TotalAmount],
            SUSER_SNAME(),
            SYSUTCDATETIME(),
            HOST_NAME()
        FROM inserted i
        JOIN deleted d ON i.[OrderId] = d.[OrderId]
        -- Only audit if meaningful business attributes changed
        WHERE d.[OrderStatus] <> i.[OrderStatus] 
           OR d.[TotalAmount] <> i.[TotalAmount];
    END
    ELSE IF @Action = 'INSERT'
    BEGIN
        INSERT INTO [Audit].[OrderHistory] (
            [OrderId],
            [Action],
            [OldStatus],
            [NewStatus],
            [OldTotalAmount],
            [NewTotalAmount],
            [ModifiedBy],
            [ModifiedDate],
            [AppHost]
        )
        SELECT 
            i.[OrderId],
            'INSERT',
            NULL,
            i.[OrderStatus],
            NULL,
            i.[TotalAmount],
            SUSER_SNAME(),
            SYSUTCDATETIME(),
            HOST_NAME()
        FROM inserted i;
    END
    ELSE IF @Action = 'DELETE'
    BEGIN
        INSERT INTO [Audit].[OrderHistory] (
            [OrderId],
            [Action],
            [OldStatus],
            [NewStatus],
            [OldTotalAmount],
            [NewTotalAmount],
            [ModifiedBy],
            [ModifiedDate],
            [AppHost]
        )
        SELECT 
            d.[OrderId],
            'DELETE',
            d.[OrderStatus],
            NULL,
            d.[TotalAmount],
            NULL,
            SUSER_SNAME(),
            SYSUTCDATETIME(),
            HOST_NAME()
        FROM deleted d;
    END;
END;
GO
PRINT '>>> Created Trigger: Sales.trg_Orders_AuditChangeCapture.';
GO
