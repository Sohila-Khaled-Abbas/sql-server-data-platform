/* ============================================================================
   Script: 01_oltp_source_schema.sql
   Module: 07_warehousing_and_reporting
   Purpose: Defines standardized extraction views and watermarked CDC access
            points in OmniFlowDB for downstream Data Warehouse ETL ingestion.
   ============================================================================ */

USE [OmniFlowDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Deploying OLTP Extraction Views for Data Warehouse Ingestion...';

IF SCHEMA_ID(N'Extract') IS NULL
    EXEC('CREATE SCHEMA [Extract];');
GO

-- 1. Watermarked Customer Delta Extract View
CREATE OR ALTER VIEW [Extract].[v_CustomerExtract]
AS
SELECT 
    c.[CustomerId] AS [CustomerBK],
    c.[CustomerCode],
    c.[FirstName],
    c.[LastName],
    c.[Email],
    c.[PhoneNumber],
    c.[PostalCode],
    c.[CreatedDate],
    c.[ModifiedDate]
FROM [Customer].[Customer] c;
GO
PRINT '>>> Created View: Extract.v_CustomerExtract.';
GO

-- 2. Watermarked Product Delta Extract View
CREATE OR ALTER VIEW [Extract].[v_ProductExtract]
AS
SELECT 
    p.[ProductId],
    p.[SKU] AS [ProductBK],
    p.[ProductName],
    c.[CategoryName],
    p.[UnitPrice],
    p.[CostPrice],
    p.[IsActive],
    p.[CreatedDate],
    p.[ModifiedDate]
FROM [Inventory].[Product] p
JOIN [Inventory].[Category] c ON p.[CategoryId] = c.[CategoryId];
GO
PRINT '>>> Created View: Extract.v_ProductExtract.';
GO

-- 3. Incremental Orders & Line Items Fact Extract View
CREATE OR ALTER VIEW [Extract].[v_SalesExtract]
AS
SELECT 
    oi.[OrderItemId],
    o.[OrderId] AS [OrderIdBK],
    o.[OrderNumber] AS [OrderNumberBK],
    CAST(o.[OrderDate] AS DATE) AS [OrderDate],
    CONVERT(INT, CONVERT(VARCHAR(8), o.[OrderDate], 112)) AS [DateKey],
    o.[CustomerId] AS [CustomerBK],
    p.[SKU] AS [ProductBK],
    oi.[Quantity],
    oi.[UnitPrice],
    oi.[DiscountPct],
    CAST(oi.[Quantity] * oi.[UnitPrice] AS DECIMAL(18, 4)) AS [GrossAmount],
    CAST(oi.[Quantity] * oi.[UnitPrice] * (oi.[DiscountPct] / 100.00) AS DECIMAL(18, 4)) AS [DiscountAmount],
    oi.[LineTotal] AS [NetAmount],
    p.[CostPrice],
    CAST(oi.[LineTotal] - (oi.[Quantity] * p.[CostPrice]) AS DECIMAL(18, 4)) AS [MarginAmount],
    o.[OrderDate] AS [ModifiedDate]
FROM [Sales].[Orders] o
JOIN [Sales].[OrderItems] oi ON o.[OrderId] = oi.[OrderId]
JOIN [Inventory].[Product] p ON oi.[ProductId] = p.[ProductId]
WHERE o.[OrderStatus] IN ('SH', 'CO'); -- Only extract Shipped or Completed transactions
GO
PRINT '>>> Created View: Extract.v_SalesExtract.';
GO
