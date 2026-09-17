/* ============================================================================
   Script: 03_integrity_constraints.sql
   Module: 01_storage_and_schema
   Purpose: Implements core transactional tables with declarative integrity
            constraints (PK, FK, UNIQUE, CHECK, DEFAULT, and Computed Columns)
            allocated explicitly on the DATA_FG filegroup.
   ============================================================================ */

USE [OmniFlowDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Deploying transactional tables and declarative integrity constraints...';

-- 1. Customer Schema Tables
IF OBJECT_ID(N'Customer.Customer', N'U') IS NULL
BEGIN
    CREATE TABLE [Customer].[Customer]
    (
        [CustomerId]    INT IDENTITY(1, 1) NOT NULL,
        [CustomerCode]  VARCHAR(20) NOT NULL,
        [FirstName]     NVARCHAR(50) NOT NULL,
        [LastName]      NVARCHAR(50) NOT NULL,
        [Email]         VARCHAR(100) NOT NULL,
        [PhoneNumber]   VARCHAR(20) NULL,
        [PostalCode]    dbo.udt_PostalCode,
        [CreatedDate]   DATETIME2(3) NOT NULL CONSTRAINT [DF_Customer_CreatedDate] DEFAULT (SYSUTCDATETIME()),
        [ModifiedDate]  DATETIME2(3) NOT NULL CONSTRAINT [DF_Customer_ModifiedDate] DEFAULT (SYSUTCDATETIME()),

        -- Integrity Constraints
        CONSTRAINT [PK_Customer] PRIMARY KEY CLUSTERED ([CustomerId]) ON [DATA_FG],
        CONSTRAINT [UQ_Customer_CustomerCode] UNIQUE NONCLUSTERED ([CustomerCode]) ON [INDEX_FG],
        CONSTRAINT [UQ_Customer_Email] UNIQUE NONCLUSTERED ([Email]) ON [INDEX_FG],
        CONSTRAINT [CK_Customer_Email_Format] CHECK ([Email] LIKE '%_@__%.__%'),
        CONSTRAINT [CK_Customer_Name_NotEmpty] CHECK (LEN(RTRIM(LTRIM([FirstName]))) > 0 AND LEN(RTRIM(LTRIM([LastName]))) > 0)
    ) ON [DATA_FG];

    PRINT '>>> Created Table: Customer.Customer on DATA_FG.';
END;
GO

-- 2. Inventory Schema Tables
IF OBJECT_ID(N'Inventory.Category', N'U') IS NULL
BEGIN
    CREATE TABLE [Inventory].[Category]
    (
        [CategoryId]        INT IDENTITY(1, 1) NOT NULL,
        [CategoryName]      NVARCHAR(100) NOT NULL,
        [ParentCategoryId]  INT NULL,
        [CreatedDate]       DATETIME2(3) NOT NULL CONSTRAINT [DF_Category_CreatedDate] DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT [PK_Category] PRIMARY KEY CLUSTERED ([CategoryId]) ON [DATA_FG],
        CONSTRAINT [UQ_Category_CategoryName] UNIQUE NONCLUSTERED ([CategoryName]) ON [INDEX_FG],
        CONSTRAINT [FK_Category_ParentCategory] FOREIGN KEY ([ParentCategoryId]) 
            REFERENCES [Inventory].[Category]([CategoryId])
    ) ON [DATA_FG];

    PRINT '>>> Created Table: Inventory.Category on DATA_FG.';
END;
GO

IF OBJECT_ID(N'Inventory.Product', N'U') IS NULL
BEGIN
    CREATE TABLE [Inventory].[Product]
    (
        [ProductId]     INT IDENTITY(1, 1) NOT NULL,
        [SKU]           VARCHAR(30) NOT NULL,
        [ProductName]   NVARCHAR(150) NOT NULL,
        [CategoryId]    INT NOT NULL,
        [UnitPrice]     dbo.udt_Currency,
        [CostPrice]     dbo.udt_Currency,
        [SafetyStock]   INT NOT NULL CONSTRAINT [DF_Product_SafetyStock] DEFAULT (10),
        [IsActive]      BIT NOT NULL CONSTRAINT [DF_Product_IsActive] DEFAULT (1),
        [CreatedDate]   DATETIME2(3) NOT NULL CONSTRAINT [DF_Product_CreatedDate] DEFAULT (SYSUTCDATETIME()),
        [ModifiedDate]  DATETIME2(3) NOT NULL CONSTRAINT [DF_Product_ModifiedDate] DEFAULT (SYSUTCDATETIME()),

        CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED ([ProductId]) ON [DATA_FG],
        CONSTRAINT [UQ_Product_SKU] UNIQUE NONCLUSTERED ([SKU]) ON [INDEX_FG],
        CONSTRAINT [FK_Product_Category] FOREIGN KEY ([CategoryId]) 
            REFERENCES [Inventory].[Category]([CategoryId]),
        CONSTRAINT [CK_Product_Price_Cost] CHECK ([UnitPrice] >= [CostPrice]),
        CONSTRAINT [CK_Product_SafetyStock] CHECK ([SafetyStock] >= 0)
    ) ON [DATA_FG];

    PRINT '>>> Created Table: Inventory.Product on DATA_FG.';
END;
GO

-- 3. Sales Schema Tables
IF OBJECT_ID(N'Sales.Orders', N'U') IS NULL
BEGIN
    CREATE TABLE [Sales].[Orders]
    (
        [OrderId]       BIGINT IDENTITY(1000, 1) NOT NULL,
        [OrderNumber]   VARCHAR(30) NOT NULL,
        [CustomerId]    INT NOT NULL,
        [OrderDate]     DATETIME2(3) NOT NULL CONSTRAINT [DF_Orders_OrderDate] DEFAULT (SYSUTCDATETIME()),
        [OrderStatus]   dbo.udt_StatusCode CONSTRAINT [DF_Orders_Status] DEFAULT ('PE'),
        [SubTotal]      dbo.udt_Currency CONSTRAINT [DF_Orders_SubTotal] DEFAULT (0.00),
        [TaxAmount]     dbo.udt_Currency CONSTRAINT [DF_Orders_TaxAmount] DEFAULT (0.00),
        [FreightAmount] dbo.udt_Currency CONSTRAINT [DF_Orders_FreightAmount] DEFAULT (0.00),
        [TotalAmount]   dbo.udt_Currency CONSTRAINT [DF_Orders_TotalAmount] DEFAULT (0.00),
        [Notes]         NVARCHAR(500) NULL,
        [RowVersion]    ROWVERSION NOT NULL, -- Optimistic concurrency control

        CONSTRAINT [PK_Orders] PRIMARY KEY CLUSTERED ([OrderId]) ON [DATA_FG],
        CONSTRAINT [UQ_Orders_OrderNumber] UNIQUE NONCLUSTERED ([OrderNumber]) ON [INDEX_FG],
        CONSTRAINT [FK_Orders_Customer] FOREIGN KEY ([CustomerId]) 
            REFERENCES [Customer].[Customer]([CustomerId]),
        CONSTRAINT [CK_Orders_Status_Allowed] CHECK ([OrderStatus] IN ('PE', 'PR', 'SH', 'CA', 'CO')), -- Pending, Processing, Shipped, Cancelled, Completed
        CONSTRAINT [CK_Orders_PositiveTotals] CHECK ([SubTotal] >= 0.00 AND [TaxAmount] >= 0.00 AND [FreightAmount] >= 0.00 AND [TotalAmount] >= 0.00)
    ) ON [DATA_FG];

    PRINT '>>> Created Table: Sales.Orders on DATA_FG.';
END;
GO

IF OBJECT_ID(N'Sales.OrderItems', N'U') IS NULL
BEGIN
    CREATE TABLE [Sales].[OrderItems]
    (
        [OrderItemId]   BIGINT IDENTITY(1, 1) NOT NULL,
        [OrderId]       BIGINT NOT NULL,
        [ProductId]     INT NOT NULL,
        [Quantity]      INT NOT NULL,
        [UnitPrice]     dbo.udt_Currency,
        [DiscountPct]   DECIMAL(5, 2) NOT NULL CONSTRAINT [DF_OrderItems_DiscountPct] DEFAULT (0.00),
        
        -- Deterministic persisted computed column: enables indexing & zero-runtime compute overhead
        [LineTotal]     AS CAST([Quantity] * [UnitPrice] * (1.00 - ([DiscountPct] / 100.00)) AS DECIMAL(18, 4)) PERSISTED,

        CONSTRAINT [PK_OrderItems] PRIMARY KEY CLUSTERED ([OrderItemId]) ON [DATA_FG],
        CONSTRAINT [FK_OrderItems_Orders] FOREIGN KEY ([OrderId]) 
            REFERENCES [Sales].[Orders]([OrderId]) ON DELETE CASCADE, -- Cascade delete for order line items
        CONSTRAINT [FK_OrderItems_Product] FOREIGN KEY ([ProductId]) 
            REFERENCES [Inventory].[Product]([ProductId]),
        CONSTRAINT [CK_OrderItems_Quantity] CHECK ([Quantity] > 0),
        CONSTRAINT [CK_OrderItems_DiscountPct] CHECK ([DiscountPct] >= 0.00 AND [DiscountPct] <= 100.00)
    ) ON [DATA_FG];

    PRINT '>>> Created Table: Sales.OrderItems on DATA_FG with PERSISTED computed column.';
END;
GO

-- 4. Audit Table Structure
IF OBJECT_ID(N'Audit.OrderHistory', N'U') IS NULL
BEGIN
    CREATE TABLE [Audit].[OrderHistory]
    (
        [AuditId]           BIGINT IDENTITY(1, 1) NOT NULL,
        [OrderId]           BIGINT NOT NULL,
        [Action]            VARCHAR(10) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
        [OldStatus]         CHAR(2) NULL,
        [NewStatus]         CHAR(2) NULL,
        [OldTotalAmount]    DECIMAL(18, 4) NULL,
        [NewTotalAmount]    DECIMAL(18, 4) NULL,
        [ModifiedBy]        NVARCHAR(128) NOT NULL CONSTRAINT [DF_OrderHistory_ModifiedBy] DEFAULT (SUSER_SNAME()),
        [ModifiedDate]      DATETIME2(3) NOT NULL CONSTRAINT [DF_OrderHistory_ModifiedDate] DEFAULT (SYSUTCDATETIME()),
        [AppHost]           NVARCHAR(128) NULL CONSTRAINT [DF_OrderHistory_AppHost] DEFAULT (HOST_NAME())
    ) ON [DATA_FG];

    PRINT '>>> Created Table: Audit.OrderHistory on DATA_FG.';
END;
GO
