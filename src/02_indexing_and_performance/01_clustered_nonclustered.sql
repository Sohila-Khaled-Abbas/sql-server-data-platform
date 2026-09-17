/* ============================================================================
   Script: 01_clustered_nonclustered.sql
   Module: 02_indexing_and_performance
   Purpose: Implements advanced indexing strategies (Covering with INCLUDE,
            Filtered Indexes, Columnstore, and Index Maintenance DMVs).
   ============================================================================ */

USE [OmniFlowDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Deploying performance-tuned indexes on INDEX_FG...';

-- 1. Covering Non-Clustered Index with INCLUDE Clause
-- Problem: Queries filtering by CustomerId and OrderDate had to perform expensive
-- Key Lookups on the clustered index to retrieve TotalAmount and OrderStatus.
-- Solution: Include secondary columns in the leaf level of the non-clustered index.
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Orders_Customer_Date_Covering' AND object_id = OBJECT_ID(N'Sales.Orders'))
    DROP INDEX [IX_Orders_Customer_Date_Covering] ON [Sales].[Orders];
GO

CREATE NONCLUSTERED INDEX [IX_Orders_Customer_Date_Covering]
ON [Sales].[Orders] ([CustomerId], [OrderDate])
INCLUDE ([OrderStatus], [TotalAmount], [OrderNumber])
WITH (FILLFACTOR = 90, DATA_COMPRESSION = PAGE)
ON [INDEX_FG];
GO
PRINT '>>> Created Covering Index: IX_Orders_Customer_Date_Covering with PAGE compression on INDEX_FG.';
GO

-- 2. Filtered Non-Clustered Index for Active Workflows
-- 95% of orders in an enterprise system are 'CO' (Completed) or 'CA' (Cancelled).
-- Creating an index over the entire table wastes storage and memory.
-- A Filtered Index exclusively indexes in-flight orders ('PE' = Pending, 'PR' = Processing).
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Orders_InFlight_Filtered' AND object_id = OBJECT_ID(N'Sales.Orders'))
    DROP INDEX [IX_Orders_InFlight_Filtered] ON [Sales].[Orders];
GO

CREATE NONCLUSTERED INDEX [IX_Orders_InFlight_Filtered]
ON [Sales].[Orders] ([OrderDate], [OrderId])
INCLUDE ([CustomerId], [TotalAmount])
WHERE [OrderStatus] IN ('PE', 'PR')
WITH (FILLFACTOR = 90)
ON [INDEX_FG];
GO
PRINT '>>> Created Filtered Index: IX_Orders_InFlight_Filtered for active orders.';
GO

-- 3. Clustered Columnstore Index for High-Volume Audit Logging
-- Columnstore indexes provide 10x-15x data compression and vector batch-mode
-- execution for analytical queries scanning millions of historical audit rows.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'CCI_OrderHistory' AND object_id = OBJECT_ID(N'Audit.OrderHistory'))
BEGIN
    CREATE CLUSTERED COLUMNSTORE INDEX [CCI_OrderHistory]
    ON [Audit].[OrderHistory]
    WITH (MAXDOP = 1)
    ON [DATA_FG];
    PRINT '>>> Created Clustered Columnstore Index: CCI_OrderHistory on Audit.OrderHistory with MAXDOP = 1.';
END;
GO

-- 4. DBRE Index Telemetry & Diagnostic Query
-- Detects index fragmentation, page counts, and leaf-level density across all tables
SELECT 
    OBJECT_SCHEMA_NAME(ps.object_id) + '.' + OBJECT_NAME(ps.object_id) AS [TableName],
    i.name AS [IndexName],
    i.type_desc AS [IndexType],
    ps.avg_fragmentation_in_percent AS [FragmentationPct],
    ps.page_count AS [PageCount],
    CAST(ps.page_count * 8.0 / 1024 AS DECIMAL(10, 2)) AS [SizeMB],
    ius.user_seeks AS [UserSeeks],
    ius.user_scans AS [UserScans],
    ius.user_lookups AS [UserLookups],
    ius.user_updates AS [UserUpdates]
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'LIMITED') ps
JOIN sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id
LEFT JOIN sys.dm_db_index_usage_stats ius 
    ON ps.database_id = ius.database_id 
    AND ps.object_id = ius.object_id 
    AND ps.index_id = ius.index_id
WHERE ps.object_id > 100 -- Ignore system catalogs
ORDER BY ps.avg_fragmentation_in_percent DESC;
GO
