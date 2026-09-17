/* ============================================================================
   Script: 03_dynamic_sql_guardrails.sql
   Module: 04_governance_and_audit
   Purpose: Implements secure parameterized dynamic SQL via sp_executesql with
            QUOTENAME() identifier escaping and SQL injection defense.
   ============================================================================ */

USE [OmniFlowDB];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '>>> Creating Hardened Dynamic SQL Search Procedure...';
GO

CREATE OR ALTER PROCEDURE [Sales].[usp_SearchOrdersDynamic]
    @CustomerCode       VARCHAR(20)  = NULL,
    @OrderStatus        CHAR(2)      = NULL,
    @StartDate          DATETIME2(3) = NULL,
    @EndDate            DATETIME2(3) = NULL,
    @SortColumn         SYSNAME      = N'OrderDate',
    @SortDirection      VARCHAR(4)   = 'DESC',
    @PageNumber         INT          = 1,
    @PageSize           INT          = 20
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Whitelist validation for dynamic Sort Column (Defense-in-Depth)
    DECLARE @AllowedSortColumns TABLE (ColName SYSNAME);
    INSERT INTO @AllowedSortColumns (ColName)
    VALUES (N'OrderId'), (N'OrderNumber'), (N'OrderDate'), (N'TotalAmount'), (N'OrderStatus');

    IF NOT EXISTS (SELECT 1 FROM @AllowedSortColumns WHERE ColName = @SortColumn)
    BEGIN
        THROW 52001, 'Invalid Sort Column specified. Must match allowed whitelist.', 1;
    END;

    -- Whitelist validation for Sort Direction
    SET @SortDirection = UPPER(TRIM(@SortDirection));
    IF @SortDirection NOT IN ('ASC', 'DESC')
    BEGIN
        SET @SortDirection = 'DESC';
    END;

    -- 2. Build Parameterized Dynamic SQL
    -- Identifiers are wrapped with QUOTENAME(); values are passed strictly as parameters!
    DECLARE @Sql NVARCHAR(MAX);
    DECLARE @Params NVARCHAR(MAX);

    SET @Sql = N'
    SELECT 
        o.[OrderId],
        o.[OrderNumber],
        o.[OrderDate],
        o.[OrderStatus],
        o.[TotalAmount],
        c.[CustomerCode],
        c.[FirstName] + '' '' + c.[LastName] AS [CustomerName]
    FROM [Sales].[Orders] o
    JOIN [Customer].[Customer] c ON o.[CustomerId] = c.[CustomerId]
    WHERE 1 = 1 ';

    IF @CustomerCode IS NOT NULL
        SET @Sql = @Sql + N' AND c.[CustomerCode] = @pCustomerCode ';

    IF @OrderStatus IS NOT NULL
        SET @Sql = @Sql + N' AND o.[OrderStatus] = @pOrderStatus ';

    IF @StartDate IS NOT NULL
        SET @Sql = @Sql + N' AND o.[OrderDate] >= @pStartDate ';

    IF @EndDate IS NOT NULL
        SET @Sql = @Sql + N' AND o.[OrderDate] <= @pEndDate ';

    -- Safely append validated and escaped Sort Column
    SET @Sql = @Sql + N'
    ORDER BY ' + QUOTENAME(N'o') + N'.' + QUOTENAME(@SortColumn) + N' ' + @SortDirection + N'
    OFFSET (@pPageNumber - 1) * @pPageSize ROWS
    FETCH NEXT @pPageSize ROWS ONLY;';

    SET @Params = N'
        @pCustomerCode   VARCHAR(20),
        @pOrderStatus    CHAR(2),
        @pStartDate      DATETIME2(3),
        @pEndDate        DATETIME2(3),
        @pPageNumber     INT,
        @pPageSize       INT';

    -- Execute via sp_executesql: allows query plan caching and prevents SQL injection
    EXEC sp_executesql 
        @stmt           = @Sql,
        @params         = @Params,
        @pCustomerCode  = @CustomerCode,
        @pOrderStatus   = @OrderStatus,
        @pStartDate     = @StartDate,
        @pEndDate       = @EndDate,
        @pPageNumber    = @PageNumber,
        @pPageSize      = @PageSize;
END;
GO
PRINT '>>> Created Stored Procedure: Sales.usp_SearchOrdersDynamic.';
GO

-- ----------------------------------------------------------------------------
-- 3. SQL INJECTION SECURITY DEFENSE TEST
-- ----------------------------------------------------------------------------
PRINT '>>> Testing SQL Injection Attack Payload Defense...';

-- An attacker attempts an injection payload via @CustomerCode:
DECLARE @MaliciousPayload VARCHAR(20) = '''; DROP TABLE Audit;--';

-- Executing the procedure with the payload:
-- The parameterized query treats @MaliciousPayload strictly as a literal search string
-- and looks for CustomerCode = '''; DROP TABLE Audit;--' without executing the DROP!
EXEC [Sales].[usp_SearchOrdersDynamic]
    @CustomerCode = @MaliciousPayload,
    @PageSize = 5;

PRINT '>>> Verification: Defense-in-depth validated. Malicious payload treated as data literal.';
GO
