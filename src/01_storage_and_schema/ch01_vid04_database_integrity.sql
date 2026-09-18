/* ============================================================================
   Script: ch01_vid04_database_integrity.sql
   Course: MaharaTech Course 2305: Implementing and Developing SQL Server Objects
   Module: CH01_VID04_Database Integrity
   Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
   Target Database: ITItest (or OmniFlowDB)
   
   PURPOSE:
   Implements and demonstrates the complete architectural taxonomy of 
   Database Integrity taught in CH01_VID04 across the 3 core pillars:
     1. Domain Integrity (Range of Values)
     2. Entity Integrity (Uniqueness)
     3. Referential Integrity (Relationship)
   
   CONTRASTING IMPLEMENTATION MECHANISMS:
     - Declarative DB Constraints (PRIMARY KEY, UNIQUE, FOREIGN KEY, CHECK, DEFAULT)
     - Procedural & Structural DB Objects (RULES, UNIQUE INDEXES, TRIGGERS)
     - Custom Business Constraints (STORED PROCEDURES)
   ============================================================================ */

USE [ITItest];
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET NOCOUNT ON;
GO

PRINT '==============================================================================';
PRINT '>>> Starting CH01_VID04: Database Integrity Architecture & Taxonomy Script...';
PRINT '==============================================================================';
GO

-- ============================================================================
-- 1. DOMAIN INTEGRITY (Range of Values)
-- Ensures that only valid, well-formed values within the defined domain exist.
-- Mechanisms:
--   A) DB Constraints: Data Type (size/quality), DEFAULT ('cairo'), NOT NULL, CHECK
--   B) DB Objects: RULE (CREATE RULE / sp_bindrule), TRIGGERS
-- ============================================================================
PRINT '>>> 1. Configuring Domain Integrity on dbo.emp...';

-- 1.1 Data Type & Quality / Storage Size (e.g. tinyint = 1 byte vs int = 4 bytes)
-- Age values range 0-255, so tinyint saves 3 bytes per row over int!
IF COL_LENGTH('dbo.emp', 'age_optimized') IS NULL
BEGIN
    ALTER TABLE dbo.emp ADD [age_optimized] TINYINT NULL;
    PRINT '    Added column age_optimized TINYINT (Quality: 0-255, Size: 1 Byte).';
END;
GO

-- 1.2 Default Constraints (Ex: 'cairo' for eadd, GETDATE() for hiredate)
IF NOT EXISTS (
    SELECT 1 FROM sys.default_constraints dc
    JOIN sys.columns c ON dc.parent_object_id = c.object_id AND dc.parent_column_id = c.column_id
    WHERE dc.parent_object_id = OBJECT_ID('dbo.emp') AND c.name = 'eadd'
)
BEGIN
    ALTER TABLE dbo.emp ADD CONSTRAINT [DF_emp_eadd_cairo] DEFAULT ('cairo') FOR [eadd];
    PRINT '    Added named DEFAULT constraint DF_emp_eadd_cairo (''cairo'').';
END;
ELSE
BEGIN
    PRINT '    Default constraint on eadd verified (''cairo'').';
END;
GO

-- 1.3 Check Constraints (WHERE-clause logic evaluated upon INSERT / UPDATE)
-- A) Check: Salary must be greater than or equal to 2,000
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_emp_salary_min')
BEGIN
    ALTER TABLE dbo.emp WITH CHECK ADD CONSTRAINT [CK_emp_salary_min] 
        CHECK ([salary] IS NULL OR [salary] >= 2000);
    PRINT '    Added CHECK constraint CK_emp_salary_min ([salary] >= 2000).';
END;
GO

-- B) Check: Birth date must be in the past
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_emp_bd_past')
BEGIN
    ALTER TABLE dbo.emp WITH CHECK ADD CONSTRAINT [CK_emp_bd_past] 
        CHECK ([bd] IS NULL OR [bd] <= GETDATE());
    PRINT '    Added CHECK constraint CK_emp_bd_past ([bd] <= GETDATE()).';
END;
GO

-- C) Check: Gender must be M or F
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_emp_gender_valid')
BEGIN
    ALTER TABLE dbo.emp WITH CHECK ADD CONSTRAINT [CK_emp_gender_valid] 
        CHECK ([gender] IS NULL OR [gender] IN ('M', 'F', 'm', 'f'));
    PRINT '    Added CHECK constraint CK_emp_gender_valid (gender IN (''M'', ''F'')).';
END;
GO

-- 1.4 DB Objects: CREATE RULE and sp_bindrule (Legacy standalone object)
-- Rules are separate schema objects bound to columns or user-defined types.
IF OBJECT_ID('dbo.R_PositiveRate', 'R') IS NULL
BEGIN
    EXEC('CREATE RULE dbo.R_PositiveRate AS @val > 0;');
    PRINT '    Created DB Object: RULE dbo.R_PositiveRate (@val > 0).';
    EXEC sp_bindrule 'dbo.R_PositiveRate', 'dbo.emp.salary';
    PRINT '    Bound RULE dbo.R_PositiveRate to dbo.emp.salary via sp_bindrule.';
END
ELSE
BEGIN
    PRINT '    DB Object: RULE dbo.R_PositiveRate already active and bound to dbo.emp.salary.';
END;
GO


-- ============================================================================
-- 2. ENTITY INTEGRITY (Uniqueness)
-- Ensures each row uniquely represents a distinct real-world entity.
-- Mechanisms:
--   A) DB Constraints: PRIMARY KEY (1 per table, NOT NULL), UNIQUE (Multiple, 1 NULL)
--   B) DB Objects: UNIQUE INDEX (allows filtered index WHERE col IS NOT NULL), TRIGGERS
-- ============================================================================
PRINT '>>> 2. Configuring Entity Integrity on dbo.emp...';

-- 2.1 Primary Key: Verified on eid (Single PK constraint per table, Clustered by default)
IF EXISTS (SELECT 1 FROM sys.key_constraints WHERE parent_object_id = OBJECT_ID('dbo.emp') AND type = 'PK')
BEGIN
    PRINT '    Verified PRIMARY KEY constraint on dbo.emp(eid) [Strictly NOT NULL, Unique].';
END;
GO

-- 2.2 Add National ID column to demonstrate UNIQUE Constraint vs PRIMARY KEY
IF COL_LENGTH('dbo.emp', 'national_id') IS NULL
BEGIN
    ALTER TABLE dbo.emp ADD [national_id] CHAR(14) NULL;
    PRINT '    Added column national_id CHAR(14) for UNIQUE constraint demonstration.';
END;
GO

-- Add UNIQUE constraint: Allows multiple unique constraints per table, allows 1 NULL
IF NOT EXISTS (SELECT 1 FROM sys.key_constraints WHERE name = 'UQ_emp_national_id')
BEGIN
    ALTER TABLE dbo.emp ADD CONSTRAINT [UQ_emp_national_id] UNIQUE NONCLUSTERED ([national_id]);
    PRINT '    Added UNIQUE constraint UQ_emp_national_id (Multiple allowed, allows 1 NULL).';
END;
GO

-- 2.3 DB Objects: Filtered UNIQUE INDEX
-- Solves the "1 NULL in Unique Constraint" limitation in SQL Server by ignoring NULLs!
IF COL_LENGTH('dbo.emp', 'email') IS NULL
BEGIN
    ALTER TABLE dbo.emp ADD [email] VARCHAR(100) NULL;
    PRINT '    Added column email VARCHAR(100) for Filtered Unique Index demonstration.';
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UIX_emp_email_filtered')
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX [UIX_emp_email_filtered]
    ON dbo.emp([email])
    WHERE [email] IS NOT NULL;
    PRINT '    Created DB Object: Filtered UNIQUE INDEX UIX_emp_email_filtered (Allows multiple NULLs).';
END;
GO


-- ============================================================================
-- 3. REFERENTIAL INTEGRITY (Relationships)
-- Ensures references between tables remain valid without orphaned child rows.
-- Mechanisms:
--   A) DB Constraints: FOREIGN KEY constraint (REFERENCES Parent(PK))
--   B) DB Objects: Referential Triggers
-- ============================================================================
PRINT '>>> 3. Configuring Referential Integrity...';

-- 3.1 Foreign Key constraint on emp.dnum referencing depts.did
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_emp_depts')
BEGIN
    ALTER TABLE dbo.emp WITH CHECK ADD CONSTRAINT [FK_emp_depts] 
        FOREIGN KEY ([dnum]) REFERENCES dbo.depts ([did])
        ON UPDATE CASCADE 
        ON DELETE NO ACTION;
    PRINT '    Added FOREIGN KEY constraint FK_emp_depts (REFERENCES depts(did) ON UPDATE CASCADE).';
END;
ELSE
BEGIN
    PRINT '    Verified FOREIGN KEY constraint FK_emp_depts (references dbo.depts(did)).';
END;
GO


-- ============================================================================
-- 4. CUSTOM CONSTRAINTS (Business Workflow Logic)
-- Complex validations spanning multiple tables, temporal schedules, or external APIs.
-- Mechanisms:
--   - Stored Procedures with explicit transaction handling and guardrails.
-- ============================================================================
PRINT '>>> 4. Creating Custom Constraint Stored Procedure: dbo.usp_HireEmployee...';
GO

CREATE OR ALTER PROCEDURE dbo.usp_HireEmployee
    @p_ename        VARCHAR(50),
    @p_eadd         VARCHAR(50) = 'cairo',
    @p_salary       INT,
    @p_bd           DATE = '1995-01-01',
    @p_gender       VARCHAR(1) = 'M',
    @p_dnum         INT,
    @p_national_id  CHAR(14) = NULL,
    @p_hour_rate    INT = 50,
    @p_new_eid      INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- Custom Business Rule 1: Validate department exists and is active
    IF NOT EXISTS (SELECT 1 FROM dbo.depts WHERE did = @p_dnum)
    BEGIN
        THROW 50001, 'Custom Integrity Violation: Specified department does not exist.', 1;
    END;

    -- Custom Business Rule 2: Minimum compensation check based on birth date (seniority)
    IF DATEDIFF(YEAR, @p_bd, GETDATE()) > 30 AND @p_salary < 4000
    BEGIN
        THROW 50002, 'Custom Integrity Violation: Senior employees (age > 30) must have salary >= 4000.', 1;
    END;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- Note: 'age' and 'netsal' are computed columns and calculated automatically!
        INSERT INTO dbo.emp (
            ename, eadd, hiredate, salary, bd, gender, dnum, national_id, hour_rate
        )
        VALUES (
            @p_ename, 
            COALESCE(@p_eadd, 'cairo'), 
            CAST(GETDATE() AS DATE), 
            @p_salary, 
            @p_bd, 
            @p_gender, 
            @p_dnum, 
            @p_national_id,
            @p_hour_rate
        );

        SET @p_new_eid = SCOPE_IDENTITY();

        COMMIT TRANSACTION;
        PRINT '>>> Successfully hired employee with EID: ' + CAST(@p_new_eid AS VARCHAR(10));
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO


-- ============================================================================
-- 5. VERIFICATION & INTEGRITY TEST HARNESS
-- Proves that constraints successfully guard against invalid data.
-- ============================================================================
PRINT '==============================================================================';
PRINT '>>> 5. Running Database Integrity Verification Tests...';
PRINT '==============================================================================';

-- Ensure a test department exists in dbo.depts
IF NOT EXISTS (SELECT 1 FROM dbo.depts WHERE did = 10)
BEGIN
    INSERT INTO dbo.depts (did, dname) VALUES (10, 'Engineering');
    PRINT '    Inserted test department: 10 (Engineering).';
END;
GO

-- Clean up any previous test employee for idempotent execution
DELETE FROM dbo.emp WHERE ename = 'Ahmed Hassan';

-- Test 1: Successful insert respecting all domain, entity, and referential constraints
DECLARE @TestEid INT;
EXEC dbo.usp_HireEmployee
    @p_ename = 'Ahmed Hassan',
    @p_eadd = NULL, -- will default to 'cairo'
    @p_salary = 5000,
    @p_bd = '1998-04-12',
    @p_gender = 'M',
    @p_dnum = 10,
    @p_national_id = '29804121234567',
    @p_hour_rate = 60,
    @p_new_eid = @TestEid OUTPUT;

-- Verify default value and computed columns were applied
SELECT 
    eid, 
    ename, 
    eadd AS City_DefaultApplied, 
    hiredate, 
    salary, 
    bd AS BirthDate, 
    age AS ComputedAge, 
    netsal AS ComputedNetSalary, 
    dnum
FROM dbo.emp 
WHERE eid = @TestEid;
GO

-- Test 2: Verify Check Constraint Violation (salary < 2000)
PRINT '>>> Test 2: Testing Check Constraint violation (salary = 1000)...';
BEGIN TRY
    INSERT INTO dbo.emp (ename, salary, dnum) VALUES ('Failing Emp', 1000, 10);
    PRINT '    ERROR: Check constraint failed to block invalid salary!';
END TRY
BEGIN CATCH
    PRINT '    SUCCESS: Check constraint correctly blocked insert. Error: ' + ERROR_MESSAGE();
END CATCH;
GO

-- Test 3: Verify Referential Integrity Violation (non-existent department)
PRINT '>>> Test 3: Testing Foreign Key violation (dnum = 9999)...';
BEGIN TRY
    INSERT INTO dbo.emp (ename, salary, dnum) VALUES ('Orphan Emp', 3000, 9999);
    PRINT '    ERROR: Foreign key failed to block invalid department!';
END TRY
BEGIN CATCH
    PRINT '    SUCCESS: Foreign key correctly blocked orphan insert. Error: ' + ERROR_MESSAGE();
END CATCH;
GO

PRINT '==============================================================================';
PRINT '>>> CH01_VID04 Database Integrity Architecture Successfully Deployed & Verified!';
PRINT '==============================================================================';
GO
