/* ============================================================================
   Script: 02_xml_shredding_and_generation.sql
   Module: 03_programmability_and_elt
   Purpose: Implements semi-structured XML processing using XQuery (.nodes, .value)
            and relational data transformation to nested XML feeds (FOR XML PATH).
   ============================================================================ */

USE [OmniFlowDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Deploying XML Shredding and Generation Pipelines...';

-- ----------------------------------------------------------------------------
-- 1. XML SHREDDING (INGESTION): Parsing Semi-Structured Supplier Feed
-- Demonstrates shredding raw XML document into structured relational rows
-- ----------------------------------------------------------------------------
DECLARE @XmlPayload XML = N'
<SupplierShipment shipmentId="SHP-2024-998" timestamp="2024-04-15T10:30:00Z">
    <Supplier name="Global Logistics Corp" code="SUP-GLC" />
    <Items>
        <Item sku="SKU-TECH-001" quantity="50">
            <Description>High Performance Wireless Mouse</Description>
            <UnitPrice>45.50</UnitPrice>
            <Category>Peripherals</Category>
        </Item>
        <Item sku="SKU-TECH-002" quantity="20">
            <Description>Mechanical Gaming Keyboard</Description>
            <UnitPrice>129.99</UnitPrice>
            <Category>Peripherals</Category>
        </Item>
        <Item sku="SKU-TECH-003" quantity="15">
            <Description>USB-C Dual 4K Docking Station</Description>
            <UnitPrice>189.00</UnitPrice>
            <Category>Accessories</Category>
        </Item>
    </Items>
</SupplierShipment>';

PRINT '>>> Shredding XML Payload using XQuery .nodes() and .value()...';

SELECT 
    -- Header attributes
    @XmlPayload.value('(/SupplierShipment/@shipmentId)[1]', 'VARCHAR(30)') AS [ShipmentId],
    @XmlPayload.value('(/SupplierShipment/@timestamp)[1]', 'DATETIME2') AS [ShipmentTime],
    @XmlPayload.value('(/SupplierShipment/Supplier/@name)[1]', 'NVARCHAR(100)') AS [SupplierName],
    @XmlPayload.value('(/SupplierShipment/Supplier/@code)[1]', 'VARCHAR(20)') AS [SupplierCode],

    -- Shredded Item Elements
    ItemNode.value('@sku', 'VARCHAR(30)') AS [ProductSKU],
    ItemNode.value('@quantity', 'INT') AS [QuantityReceived],
    ItemNode.value('(Description)[1]', 'NVARCHAR(150)') AS [ItemDescription],
    ItemNode.value('(UnitPrice)[1]', 'DECIMAL(18, 4)') AS [SupplierUnitPrice],
    ItemNode.value('(Category)[1]', 'NVARCHAR(50)') AS [ItemCategory]
FROM @XmlPayload.nodes('/SupplierShipment/Items/Item') AS ShreddedItems(ItemNode);
GO

-- ----------------------------------------------------------------------------
-- 2. STORED PROCEDURE: Ingest XML Product Catalog
-- ----------------------------------------------------------------------------
CREATE OR ALTER PROCEDURE [Inventory].[usp_IngestProductsFromXml]
    @CatalogXml XML
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Ensure Category exists
        MERGE [Inventory].[Category] AS target
        USING (
            SELECT DISTINCT
                T.Item.value('(Category)[1]', 'NVARCHAR(100)') AS CategoryName
            FROM @CatalogXml.nodes('/SupplierShipment/Items/Item') AS T(Item)
            WHERE T.Item.value('(Category)[1]', 'NVARCHAR(100)') IS NOT NULL
        ) AS source
        ON target.CategoryName = source.CategoryName
        WHEN NOT MATCHED THEN
            INSERT (CategoryName) VALUES (source.CategoryName);

        -- Upsert Products
        MERGE [Inventory].[Product] AS target
        USING (
            SELECT 
                T.Item.value('@sku', 'VARCHAR(30)') AS SKU,
                T.Item.value('(Description)[1]', 'NVARCHAR(150)') AS ProductName,
                c.CategoryId,
                T.Item.value('(UnitPrice)[1]', 'DECIMAL(18, 4)') AS UnitPrice,
                T.Item.value('(UnitPrice)[1]', 'DECIMAL(18, 4)') * 0.70 AS CostPrice
            FROM @CatalogXml.nodes('/SupplierShipment/Items/Item') AS T(Item)
            JOIN [Inventory].[Category] c 
                ON c.CategoryName = T.Item.value('(Category)[1]', 'NVARCHAR(100)')
        ) AS source
        ON target.SKU = source.SKU
        WHEN MATCHED THEN
            UPDATE SET 
                target.ProductName = source.ProductName,
                target.UnitPrice = source.UnitPrice,
                target.ModifiedDate = SYSUTCDATETIME()
        WHEN NOT MATCHED THEN
            INSERT (SKU, ProductName, CategoryId, UnitPrice, CostPrice)
            VALUES (source.SKU, source.ProductName, source.CategoryId, source.UnitPrice, source.CostPrice);

        COMMIT TRANSACTION;
        PRINT '>>> Product catalog XML ingestion completed successfully.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO
PRINT '>>> Created Stored Procedure: Inventory.usp_IngestProductsFromXml.';
GO

-- ----------------------------------------------------------------------------
-- 3. XML GENERATION: Relational Data to Nested XML Feeds (FOR XML PATH)
-- ----------------------------------------------------------------------------
PRINT '>>> Generating Nested Hierarchical XML via FOR XML PATH...';

SELECT 
    o.[OrderId] AS [@id],
    o.[OrderNumber] AS [@number],
    o.[OrderDate] AS [@date],
    o.[OrderStatus] AS [Status],
    o.[TotalAmount] AS [Totals/GrandTotal],
    o.[TaxAmount] AS [Totals/Tax],
    (
        SELECT 
            c.[CustomerCode] AS [Code],
            c.[FirstName] + ' ' + c.[LastName] AS [FullName],
            c.[Email] AS [EmailAddress]
        FROM [Customer].[Customer] c
        WHERE c.[CustomerId] = o.[CustomerId]
        FOR XML PATH('CustomerInfo'), TYPE
    ),
    (
        SELECT 
            oi.[OrderItemId] AS [@lineId],
            p.[SKU] AS [Product/SKU],
            p.[ProductName] AS [Product/Name],
            oi.[Quantity] AS [Quantity],
            oi.[UnitPrice] AS [UnitPrice],
            oi.[LineTotal] AS [LineTotal]
        FROM [Sales].[OrderItems] oi
        JOIN [Inventory].[Product] p ON oi.[ProductId] = p.[ProductId]
        WHERE oi.[OrderId] = o.[OrderId]
        FOR XML PATH('Item'), ROOT('OrderLines'), TYPE
    )
FROM [Sales].[Orders] o
WHERE o.[OrderId] <= 1005
FOR XML PATH('Order'), ROOT('OmniFlowOrders');
GO
