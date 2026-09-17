/* ============================================================================
   Script: 05_scalar_vs_table_functions.sql
   Module: 03_programmability_and_elt
   Purpose: Performance analysis comparing Scalar UDFs, Multi-Statement TVFs
            (MSTVF), and Inline Table-Valued Functions (ITVF).
   Core Concepts:
     - The "Black Box" problem of traditional Scalar UDFs
     - MSTVF Cardinality Regression (fixed 100-row estimate in legacy CE)
     - Inline TVFs: Unfolded like macros/views with predicate pushdown
     - SQL Server 2022 Scalar UDF Inlining (Intelligent Query Processing)
   ============================================================================ */

USE [OmniFlowDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Deploying and benchmarking SQL Function architectures...';
GO

-- ----------------------------------------------------------------------------
-- 1. SCALAR USER-DEFINED FUNCTION (UDF)
-- ----------------------------------------------------------------------------
CREATE OR ALTER FUNCTION [dbo].[udf_CalculateTaxScalar]
(
    @Amount DECIMAL(18, 4),
    @TaxRatePct DECIMAL(5, 2)
)
RETURNS DECIMAL(18, 4)
WITH SCHEMABINDING
AS
BEGIN
    RETURN CAST(@Amount * (@TaxRatePct / 100.00) AS DECIMAL(18, 4));
END;
GO
PRINT '>>> Created Scalar UDF: dbo.udf_CalculateTaxScalar.';
GO

-- ----------------------------------------------------------------------------
-- 2. MULTI-STATEMENT TABLE-VALUED FUNCTION (MSTVF)
-- Has a declared table variable with BEGIN...END procedural block.
-- Drawback: Creates a table variable in TempDB; optimizer cannot easily peek inside.
-- ----------------------------------------------------------------------------
CREATE OR ALTER FUNCTION [Sales].[mstvf_GetCustomerOrderHistory]
(
    @CustomerId INT
)
RETURNS @Results TABLE
(
    OrderId BIGINT,
    OrderNumber VARCHAR(30),
    OrderDate DATETIME2(3),
    TotalAmount DECIMAL(18, 4),
    ItemCount INT
)
WITH SCHEMABINDING
AS
BEGIN
    INSERT INTO @Results
    SELECT 
        o.[OrderId],
        o.[OrderNumber],
        o.[OrderDate],
        o.[TotalAmount],
        COUNT(oi.[OrderItemId]) AS [ItemCount]
    FROM [Sales].[Orders] o
    LEFT JOIN [Sales].[OrderItems] oi ON o.[OrderId] = oi.[OrderId]
    WHERE o.[CustomerId] = @CustomerId
    GROUP BY o.[OrderId], o.[OrderNumber], o.[OrderDate], o.[TotalAmount];

    RETURN;
END;
GO
PRINT '>>> Created MSTVF: Sales.mstvf_GetCustomerOrderHistory.';
GO

-- ----------------------------------------------------------------------------
-- 3. INLINE TABLE-VALUED FUNCTION (ITVF)
-- Single RETURN SELECT statement without table variable or BEGIN...END.
-- Benefit: Query optimizer expands it inline, allowing join reordering,
-- index seeks, and cost-based predicate pushdown.
-- ----------------------------------------------------------------------------
CREATE OR ALTER FUNCTION [Sales].[itvf_GetCustomerOrderHistory]
(
    @CustomerId INT
)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN
(
    SELECT 
        o.[OrderId],
        o.[OrderNumber],
        o.[OrderDate],
        o.[TotalAmount],
        COUNT(oi.[OrderItemId]) AS [ItemCount]
    FROM [Sales].[Orders] o
    LEFT JOIN [Sales].[OrderItems] oi ON o.[OrderId] = oi.[OrderId]
    WHERE o.[CustomerId] = @CustomerId
    GROUP BY o.[OrderId], o.[OrderNumber], o.[OrderDate], o.[TotalAmount]
);
GO
PRINT '>>> Created ITVF: Sales.itvf_GetCustomerOrderHistory.';
GO

-- ----------------------------------------------------------------------------
-- 4. PERFORMANCE BENCHMARK: MSTVF VS ITVF WITH CROSS APPLY
-- ----------------------------------------------------------------------------
PRINT '>>> Comparing execution telemetry: MSTVF vs ITVF...';

SET STATISTICS IO ON;
SET STATISTICS TIME ON;

PRINT '--- Query A: Multi-Statement TVF (MSTVF) with CROSS APPLY ---';
SELECT 
    c.[CustomerId],
    c.[Email],
    m.[OrderId],
    m.[TotalAmount]
FROM [Customer].[Customer] c
CROSS APPLY [Sales].[mstvf_GetCustomerOrderHistory](c.[CustomerId]) m
WHERE c.[CustomerId] <= 10;

PRINT '--- Query B: Inline TVF (ITVF) with CROSS APPLY ---';
SELECT 
    c.[CustomerId],
    c.[Email],
    i.[OrderId],
    i.[TotalAmount]
FROM [Customer].[Customer] c
CROSS APPLY [Sales].[itvf_GetCustomerOrderHistory](c.[CustomerId]) i
WHERE c.[CustomerId] <= 10;

SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;
GO

/* ============================================================================
   ARCHITECTURAL COMPARISON SUMMARY:
   
   Dimension             Scalar UDF            MSTVF                 Inline TVF (ITVF)
   -------------------   -------------------   -------------------   -------------------
   Syntax Format         RETURNS <type>        RETURNS @Table TABLE  RETURNS TABLE AS RETURN
   Optimization Model    Iterative / Inlined   Procedural Blackbox   Relational Macro (Inlined)
   Cardinality Estimate  N/A                   Fixed 100 rows (old)  Accurate histogram
   Parallelism (PQ)      Limited / Inhibited   Inhibited             Fully parallelizable
   TempDB Overhead       None                  Table variable IO     None (Zero TempDB)
   Recommendation        Use Inlined or expr   Avoid in joins        Gold Standard for Data Eng
   ============================================================================ */
PRINT '>>> Function comparison and architectural documentation complete.';
GO
