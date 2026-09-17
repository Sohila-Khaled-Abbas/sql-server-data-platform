/* ============================================================================
   Script: 04_partitioning_scheme.sql
   Module: 01_storage_and_schema
   Purpose: Implements horizontal range partitioning on date boundaries and
            demonstrates zero-IO sliding window partition switching.
   Storage Architecture:
     - Partition Function: pf_InvoiceDateRange (RANGE RIGHT)
     - Partition Scheme: ps_InvoiceScheme
       - Partition 1 (< 2024-01-01): Mapped to ARCHIVE_FG
       - Partitions 2-6 (2024-01-01 to Future): Mapped to DATA_FG
   ============================================================================ */

USE [OmniFlowDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Configuring Table Partitioning and Sliding Window Infrastructure...';

-- 1. Create Partition Function (RANGE RIGHT on DATE)
IF NOT EXISTS (SELECT 1 FROM sys.partition_functions WHERE name = N'pf_InvoiceDateRange')
BEGIN
    CREATE PARTITION FUNCTION [pf_InvoiceDateRange] (DATE)
    AS RANGE RIGHT FOR VALUES (
        '2024-01-01',
        '2024-04-01',
        '2024-07-01',
        '2024-10-01',
        '2025-01-01'
    );
    PRINT '>>> Created Partition Function: pf_InvoiceDateRange.';
END;
GO

-- 2. Create Partition Scheme Mapping to Physical Filegroups
-- Partition 1 -> ARCHIVE_FG (historical cold data)
-- Partitions 2,3,4,5,6 -> DATA_FG (active operational data)
IF NOT EXISTS (SELECT 1 FROM sys.partition_schemes WHERE name = N'ps_InvoiceScheme')
BEGIN
    CREATE PARTITION SCHEME [ps_InvoiceScheme]
    AS PARTITION [pf_InvoiceDateRange]
    TO ([ARCHIVE_FG], [DATA_FG], [DATA_FG], [DATA_FG], [DATA_FG], [DATA_FG]);
    PRINT '>>> Created Partition Scheme: ps_InvoiceScheme.';
END;
GO

-- 3. Create Partitioned Table: Sales.Invoices
-- The partitioning column (InvoiceDate) MUST be part of the clustered primary key
EXEC sys.sp_set_session_context @key = N'AllowDropProductionTable', @value = N'YES';

IF OBJECT_ID(N'Sales.Invoices', N'U') IS NOT NULL
    DROP TABLE [Sales].[Invoices];
GO

CREATE TABLE [Sales].[Invoices]
(
    [InvoiceId]     BIGINT IDENTITY(1, 1) NOT NULL,
    [InvoiceDate]   DATE NOT NULL,
    [OrderId]       BIGINT NOT NULL,
    [CustomerId]    INT NOT NULL,
    [InvoiceAmount] dbo.udt_Currency,
    [TaxAmount]     dbo.udt_Currency,
    [PaymentStatus] VARCHAR(20) NOT NULL CONSTRAINT [DF_Invoices_Status] DEFAULT ('Unpaid'),
    [CreatedDate]   DATETIME2(3) NOT NULL CONSTRAINT [DF_Invoices_Created] DEFAULT (SYSUTCDATETIME()),

    CONSTRAINT [PK_Invoices] PRIMARY KEY CLUSTERED ([InvoiceDate], [InvoiceId])
        ON [ps_InvoiceScheme]([InvoiceDate]),
    CONSTRAINT [CK_Invoices_Status] CHECK ([PaymentStatus] IN ('Unpaid', 'Paid', 'Refunded', 'Void'))
) ON [ps_InvoiceScheme]([InvoiceDate]);
GO
PRINT '>>> Created Partitioned Table: Sales.Invoices on ps_InvoiceScheme(InvoiceDate).';
GO

-- 4. Create an Identical Staging Table for Partition Switching
-- For partition switching, table schema, filegroup, indexes, and constraints MUST match exactly.
EXEC sys.sp_set_session_context @key = N'AllowDropProductionTable', @value = N'YES';

IF OBJECT_ID(N'Sales.Invoices_ArchiveStage', N'U') IS NOT NULL
    DROP TABLE [Sales].[Invoices_ArchiveStage];
GO

CREATE TABLE [Sales].[Invoices_ArchiveStage]
(
    [InvoiceId]     BIGINT IDENTITY(1, 1) NOT NULL,
    [InvoiceDate]   DATE NOT NULL,
    [OrderId]       BIGINT NOT NULL,
    [CustomerId]    INT NOT NULL,
    [InvoiceAmount] dbo.udt_Currency,
    [TaxAmount]     dbo.udt_Currency,
    [PaymentStatus] VARCHAR(20) NOT NULL,
    [CreatedDate]   DATETIME2(3) NOT NULL,

    CONSTRAINT [PK_Invoices_ArchiveStage] PRIMARY KEY CLUSTERED ([InvoiceDate], [InvoiceId])
        ON [ARCHIVE_FG],
    CONSTRAINT [CK_Invoices_ArchiveStage_DateRange] CHECK ([InvoiceDate] < '2024-01-01')
) ON [ARCHIVE_FG];
GO
PRINT '>>> Created Partition Staging Table: Sales.Invoices_ArchiveStage on ARCHIVE_FG.';
GO

-- 5. Seed Test Partition Data
INSERT INTO [Sales].[Invoices] ([InvoiceDate], [OrderId], [CustomerId], [InvoiceAmount], [TaxAmount], [PaymentStatus])
VALUES 
    ('2023-11-15', 1001, 1, 450.00, 45.00, 'Paid'),   -- Partition 1 (Archive)
    ('2023-12-20', 1002, 2, 890.00, 89.00, 'Paid'),   -- Partition 1 (Archive)
    ('2024-02-10', 1003, 1, 120.00, 12.00, 'Paid'),   -- Partition 2 (DATA_FG)
    ('2024-05-18', 1004, 3, 750.00, 75.00, 'Paid'),   -- Partition 3 (DATA_FG)
    ('2024-08-22', 1005, 4, 330.00, 33.00, 'Paid'),   -- Partition 4 (DATA_FG)
    ('2024-11-05', 1006, 2, 920.00, 92.00, 'Unpaid'), -- Partition 5 (DATA_FG)
    ('2025-02-14', 1007, 1, 640.00, 64.00, 'Unpaid'); -- Partition 6 (DATA_FG)
GO

-- 6. Partition Inspection Diagnostic Query
SELECT 
    p.partition_number AS [PartitionNum],
    fg.name AS [FilegroupName],
    p.rows AS [RowCount],
    rv.value AS [RangeRightBoundary],
    CASE 
        WHEN p.partition_number = 1 THEN '< 2024-01-01'
        ELSE CAST(LAG(rv.value, 1) OVER (ORDER BY p.partition_number) AS VARCHAR(20)) 
             + ' TO < ' + ISNULL(CAST(rv.value AS VARCHAR(20)), 'MAX')
    END AS [PartitionRange]
FROM sys.partitions p
JOIN sys.destination_data_spaces dds ON p.partition_number = dds.destination_id
JOIN sys.filegroups fg ON dds.data_space_id = fg.data_space_id
LEFT JOIN sys.partition_schemes ps ON ps.data_space_id = p.object_id
LEFT JOIN sys.partition_range_values rv ON rv.boundary_id = p.partition_number
WHERE p.object_id = OBJECT_ID(N'Sales.Invoices') AND p.index_id <= 1
ORDER BY p.partition_number;
GO

-- 7. Demonstration: Zero-IO Partition Switch (Sliding Window Archival)
-- To archive Partition 1 instantaneously into Sales.Invoices_ArchiveStage:
/*
PRINT '>>> Demonstrating Zero-IO partition switch operation...';
ALTER TABLE [Sales].[Invoices] 
SWITCH PARTITION 1 TO [Sales].[Invoices_ArchiveStage];

SELECT COUNT(*) AS [StagingArchivedRowCount] FROM [Sales].[Invoices_ArchiveStage];
*/
GO
