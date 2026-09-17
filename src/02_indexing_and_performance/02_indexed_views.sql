/* ============================================================================
   Script: 02_indexed_views.sql
   Module: 02_indexing_and_performance
   Purpose: Implements materialized (indexed) views for pre-aggregating high-cost
            reporting queries, reducing runtime CPU consumption to O(1) index seeks.
   Requirements for Indexed Views in SQL Server:
     - Must be created WITH SCHEMABINDING
     - All referenced tables must use two-part names (Schema.Table)
     - Aggregations must include COUNT_BIG(*)
     - A Unique Clustered Index must be created first before non-clustered indexes
   ============================================================================ */

USE [OmniFlowDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Creating Materialized Indexed View: Sales.v_CustomerMonthlyMetrics...';

-- 1. Drop existing view if present
IF OBJECT_ID(N'Sales.v_CustomerMonthlyMetrics', N'V') IS NOT NULL
    DROP VIEW [Sales].[v_CustomerMonthlyMetrics];
GO

-- 2. Create Schema-Bound View
CREATE VIEW [Sales].[v_CustomerMonthlyMetrics]
WITH SCHEMABINDING
AS
SELECT 
    o.[CustomerId],
    YEAR(o.[OrderDate]) AS [OrderYear],
    MONTH(o.[OrderDate]) AS [OrderMonth],
    COUNT_BIG(*) AS [TotalOrders],
    SUM(ISNULL(o.[TotalAmount], 0.00)) AS [TotalRevenue],
    SUM(ISNULL(o.[TaxAmount], 0.00)) AS [TotalTaxCollected]
FROM [Sales].[Orders] o
GROUP BY 
    o.[CustomerId],
    YEAR(o.[OrderDate]),
    MONTH(o.[OrderDate]);
GO
PRINT '>>> Created View: Sales.v_CustomerMonthlyMetrics (SCHEMABINDING).';
GO

-- 3. Create Unique Clustered Index (Materializes the View on Disk)
CREATE UNIQUE CLUSTERED INDEX [UCI_v_CustomerMonthlyMetrics]
ON [Sales].[v_CustomerMonthlyMetrics] ([CustomerId], [OrderYear], [OrderMonth])
ON [INDEX_FG];
GO
PRINT '>>> Materialized view via Unique Clustered Index on INDEX_FG.';
GO

-- 4. Demonstration of Query Optimizer Behavior & NOEXPAND Hint
-- Best Practice: Always query indexed views with the WITH (NOEXPAND) table hint
-- in SQL Server Standard and Developer editions to ensure the query engine seeks
-- directly into the persisted index rather than expanding underlying table joins.
PRINT '>>> Testing query against materialized index (NOEXPAND hint):';
SELECT 
    [CustomerId],
    [OrderYear],
    [OrderMonth],
    [TotalOrders],
    [TotalRevenue]
FROM [Sales].[v_CustomerMonthlyMetrics] WITH (NOEXPAND)
WHERE [CustomerId] = 1 AND [OrderYear] = 2024;
GO
