/* ============================================================================
   Script: 04_hierarchical_data_and_ctes.sql
   Module: 03_programmability_and_elt
   Purpose: Implements recursive Common Table Expressions (CTEs) to query and
            aggregate hierarchical catalog taxonomies and organizational trees.
   Demonstration:
     - Anchor member & recursive member definition
     - Depth tracking, breadcrumb lineage path generation
     - Hierarchy-aware rollup aggregation
     - Recursion guardrails via OPTION (MAXRECURSION 50)
   ============================================================================ */

USE [OmniFlowDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Setting up sample hierarchical category tree...';

-- 1. Ensure deep hierarchical categories exist
IF NOT EXISTS (SELECT 1 FROM [Inventory].[Category] WHERE [CategoryName] = 'Electronics')
BEGIN
    INSERT INTO [Inventory].[Category] ([CategoryName], [ParentCategoryId])
    VALUES ('Electronics', NULL);
    
    DECLARE @ElectronicsId INT = SCOPE_IDENTITY();

    INSERT INTO [Inventory].[Category] ([CategoryName], [ParentCategoryId])
    VALUES 
        ('Computers & Laptops', @ElectronicsId),
        ('Audio & Sound', @ElectronicsId);

    DECLARE @ComputersId INT = (SELECT CategoryId FROM [Inventory].[Category] WHERE CategoryName = 'Computers & Laptops');
    
    INSERT INTO [Inventory].[Category] ([CategoryName], [ParentCategoryId])
    VALUES 
        ('Workstations', @ComputersId),
        ('Ultrabooks', @ComputersId),
        ('Computer Accessories', @ComputersId);

    DECLARE @AccId INT = (SELECT CategoryId FROM [Inventory].[Category] WHERE CategoryName = 'Computer Accessories');

    INSERT INTO [Inventory].[Category] ([CategoryName], [ParentCategoryId])
    VALUES 
        ('Keyboards & Mice', @AccId),
        ('Cables & Adapters', @AccId);
END;
GO

-- 2. Recursive CTE: Full Taxonomy Lineage, Level Depth, and Visual Tree
PRINT '>>> Executing Recursive CTE for Taxonomy Hierarchy...';

WITH CategoryHierarchy AS
(
    -- Anchor Member: Root categories where ParentCategoryId IS NULL
    SELECT 
        c.[CategoryId],
        c.[CategoryName],
        c.[ParentCategoryId],
        0 AS [DepthLevel],
        CAST(c.[CategoryName] AS NVARCHAR(1000)) AS [LineagePath],
        CAST(c.[CategoryName] AS NVARCHAR(1000)) AS [VisualTree]
    FROM [Inventory].[Category] c
    WHERE c.[ParentCategoryId] IS NULL

    UNION ALL

    -- Recursive Member: Join children to their parents
    SELECT 
        child.[CategoryId],
        child.[CategoryName],
        child.[ParentCategoryId],
        parent.[DepthLevel] + 1 AS [DepthLevel],
        CAST(parent.[LineagePath] + ' > ' + child.[CategoryName] AS NVARCHAR(1000)),
        CAST(REPLICATE('    ', parent.[DepthLevel] + 1) + '|-- ' + child.[CategoryName] AS NVARCHAR(1000))
    FROM [Inventory].[Category] child
    JOIN CategoryHierarchy parent ON child.[ParentCategoryId] = parent.[CategoryId]
)
SELECT 
    [CategoryId],
    [VisualTree],
    [DepthLevel],
    [LineagePath]
FROM CategoryHierarchy
ORDER BY [LineagePath]
OPTION (MAXRECURSION 50); -- Guardrail against infinite circular loops
GO

-- 3. Stored Procedure: Get Subtree Product Aggregations
CREATE OR ALTER PROCEDURE [Inventory].[usp_GetCategorySubtreeProductTotals]
    @RootCategoryId INT
AS
BEGIN
    SET NOCOUNT ON;

    WITH SubtreeCTE AS
    (
        SELECT [CategoryId]
        FROM [Inventory].[Category]
        WHERE [CategoryId] = @RootCategoryId

        UNION ALL

        SELECT c.[CategoryId]
        FROM [Inventory].[Category] c
        JOIN SubtreeCTE s ON c.[ParentCategoryId] = s.[CategoryId]
    )
    SELECT 
        @RootCategoryId AS [RootCategoryId],
        (SELECT CategoryName FROM [Inventory].[Category] WHERE CategoryId = @RootCategoryId) AS [RootCategoryName],
        COUNT(p.[ProductId]) AS [TotalProductsInSubtree],
        ISNULL(SUM(p.[UnitPrice]), 0.00) AS [TotalCatalogValue]
    FROM SubtreeCTE s
    LEFT JOIN [Inventory].[Product] p ON s.[CategoryId] = p.[CategoryId]
    OPTION (MAXRECURSION 30);
END;
GO
PRINT '>>> Created Stored Procedure: Inventory.usp_GetCategorySubtreeProductTotals.';
GO
