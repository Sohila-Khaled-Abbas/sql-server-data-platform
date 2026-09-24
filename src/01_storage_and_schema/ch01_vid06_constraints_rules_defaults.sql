-- ============================================================================
-- Script: ch01_vid06_constraints_rules_defaults.sql
-- Module: CH01_VID06 - Constraints, Rules, and Default Values
-- Course: MaharaTech Course 2305 ("Implementing & Developing SQL Server Objects")
-- Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
-- Database Engine: Microsoft SQL Server 2022 Developer Edition
-- Target Database: [ITI]
-- Continuation: Direct continuation of CH01_VID05 (Integrity Constraints)
-- Description:
--   Comprehensive demonstration of constraints vs legacy standalone database objects:
--   1. Limitation of Constraints:
--      ---- constraint ---> new data XXXX (Enforces on existing data unless WITH NOCHECK)
--      ---- constraint ---> shared between tables XXXX (Cannot be shared across tables)
--      ---- constraint ---> new data type XXXX (Cannot bind to User-Defined Data Types)
--   2. Global Check Constraints via Rules:
--      CREATE RULE myrule AS @x > 1000;
--      sp_bindrule myrule, 'instructor.salary';
--   3. Reusability across multiple tables and User-Defined Data Types (UDDT).
--   4. Global Defaults via Defaults:
--      CREATE DEFAULT mydef AS 5000;
--      sp_bindefault mydef, 'instructor.salary';
--   5. Unbinding and object lifecycle management (sp_unbindrule, sp_unbindefault).
-- ============================================================================

SET NOCOUNT ON;
GO

-- ----------------------------------------------------------------------------
-- Step 1: Database Initialization ([ITI])
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'ITI')
BEGIN
    PRINT '>>> Creating database [ITI]...';
    CREATE DATABASE ITI;
END
GO

USE ITI;
GO

-- ----------------------------------------------------------------------------
-- Step 2: Parent Entity - Department Table
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.Instructor', N'U') IS NOT NULL DROP TABLE dbo.Instructor;
IF OBJECT_ID(N'dbo.Department', N'U') IS NOT NULL DROP TABLE dbo.Department;
GO

CREATE TABLE dbo.Department
(
    Dept_Id INT PRIMARY KEY,
    Dept_Name VARCHAR(50) NOT NULL,
    Dept_Desc VARCHAR(100) NULL,
    Dept_Location VARCHAR(50) NULL,
    Manager_hiredate DATE NULL
);
GO

INSERT INTO dbo.Department (Dept_Id, Dept_Name, Dept_Desc, Dept_Location, Manager_hiredate)
VALUES
    (10, 'SD', 'Software Development', 'Cairo', '2015-01-01'),
    (20, 'Java', 'Java & Middleware', 'Smart Village', '2016-03-15'),
    (30, 'BI', 'Business Intelligence', 'Alexandria', '2018-07-01');
GO

PRINT '>>> Table dbo.Department created and seeded with 3 core tracks.';
GO

-- ----------------------------------------------------------------------------
-- Step 3: Child Entity - Instructor Table (Authentic Video Dataset)
-- ----------------------------------------------------------------------------
CREATE TABLE dbo.Instructor
(
    Ins_Id INT PRIMARY KEY,
    Ins_Name NVARCHAR(50) NULL,
    Ins_Degree NVARCHAR(50) NULL,
    Salary MONEY NULL,
    gender VARCHAR(1) NULL,
    Dept_Id INT NULL FOREIGN KEY REFERENCES dbo.Department(Dept_Id)
);
GO

-- Populate exactly matching video SSMS screenshot (16 rows)
INSERT INTO dbo.Instructor (Ins_Id, Ins_Name, Ins_Degree, Salary, gender, Dept_Id)
VALUES
    (1, N'Ahmed', N'Master', 5000.0000, 'M', 10),
    (2, N'Hany', N'Master', 4320.0000, 'M', 10),
    (3, N'Reham', N'Master', 2640.0000, 'F', 10),
    (4, N'Yasmin', N'PHD', 264.0000, 'F', 10),       -- Salary < 1000
    (5, N'Amany', N'PHD', 660.0000, 'F', 10),        -- Salary < 1000
    (6, N'Eman', N'Master', 792.0000, 'F', 10),       -- Salary < 1000
    (7, N'Saly', NULL, 12960.0000, 'F', 10),
    (8, N'Amr', NULL, NULL, 'M', 20),
    (9, N'Hussien', NULL, NULL, 'M', 20),
    (10, N'Khalid', NULL, 11520.0000, 'M', 20),
    (11, N'Salah', NULL, 12960.0000, 'M', 20),
    (12, N'Adel', NULL, 8640.0000, 'M', 30),
    (13, N'Fakry', NULL, 5760.0000, 'M', 30),
    (14, N'Amena', NULL, 7200.0000, 'F', 30),
    (15, N'Ghada', NULL, 4320.0000, 'F', 30),
    (666, N'ahmed', NULL, NULL, NULL, NULL);
GO

PRINT '>>> Table dbo.Instructor created and populated with authentic 16 records.';
GO

-- ----------------------------------------------------------------------------
-- Step 4: Architectural Analysis - Limitations of Standard Constraints
-- ----------------------------------------------------------------------------
/*
   ----constraint ---> new data XXXX
   By default, adding a CHECK constraint to an existing table validates ALL existing data.
   Because rows 4, 5, and 6 have Salary < 1000 (264, 660, 792), the following statement FAILS:
*/
BEGIN TRY
    ALTER TABLE dbo.Instructor ADD CONSTRAINT chk_Salary_Standard CHECK (Salary > 1000);
END TRY
BEGIN CATCH
    PRINT '>>> [EXPECTED] Standard CHECK constraint failed on existing data:';
    PRINT '    Error ' + CAST(ERROR_NUMBER() AS VARCHAR) + ': ' + ERROR_MESSAGE();
END CATCH;
GO

/*
   To apply a constraint ONLY to new data (INSERT / UPDATE) while skipping legacy records:
   Use WITH NOCHECK:
*/
ALTER TABLE dbo.Instructor WITH NOCHECK ADD CONSTRAINT chk_Salary_NoCheck CHECK (Salary > 1000);
PRINT '>>> Constraint chk_Salary_NoCheck added successfully with WITH NOCHECK.';
GO

-- Clean up demonstration constraint
ALTER TABLE dbo.Instructor DROP CONSTRAINT chk_Salary_NoCheck;
GO

/*
   ----constraint ---> shared between tables XXXX
   A table constraint is tied exclusively to the table on which it was created.
   It cannot be shared or inherited across multiple independent tables.

   ----constraint ---> new data type XXXX
   A table constraint cannot be directly bound to a User-Defined Data Type (UDDT).
*/

-- ----------------------------------------------------------------------------
-- Step 5: Rules (Global Standalone Check Constraints)
-- ----------------------------------------------------------------------------
-- Clean up existing rule if present
IF EXISTS (SELECT 1 FROM sys.objects WHERE name = N'myrule' AND type = 'R')
BEGIN
    EXEC sp_unbindrule 'dbo.Instructor.Salary';
    DROP RULE myrule;
END
GO

-- Create global reusable rule
---> Rule [Global check constraint]
CREATE RULE myrule AS @x > 1000;
GO

PRINT '>>> Rule [myrule] created successfully.';
GO

-- Bind rule to column 'instructor.salary'
EXEC sp_bindrule 'myrule', 'dbo.Instructor.Salary';
GO

PRINT '>>> sp_bindrule executed: myrule bound to dbo.Instructor.Salary.';
GO

-- Test 1: Verify existing data remains unaffected (Rows 4, 5, 6 with Salary < 1000 still exist)
SELECT Ins_Id, Ins_Name, Salary 
FROM dbo.Instructor 
WHERE Salary < 1000;
GO

-- Test 2: Verify rule blocks invalid NEW data on INSERT
BEGIN TRY
    INSERT INTO dbo.Instructor (Ins_Id, Ins_Name, Salary) 
    VALUES (999, N'InvalidInstructor', 450);
END TRY
BEGIN CATCH
    PRINT '>>> [EXPECTED] Rule successfully blocked invalid INSERT (Salary = 450):';
    PRINT '    Error ' + CAST(ERROR_NUMBER() AS VARCHAR) + ': ' + ERROR_MESSAGE();
END CATCH;
GO

-- Test 3: Verify rule permits valid NEW data on INSERT
INSERT INTO dbo.Instructor (Ins_Id, Ins_Name, Salary) 
VALUES (999, N'ValidInstructor', 3500);
PRINT '>>> Valid instructor inserted successfully with Salary = 3500.';

-- Clean up test row
DELETE FROM dbo.Instructor WHERE Ins_Id = 999;
GO

-- ----------------------------------------------------------------------------
-- Step 6: Advantage 1 - Sharing a Rule Across Tables (instructor.salary & emps.overtime)
-- ----------------------------------------------------------------------------
-- Ensure table emps exists with column overtime (matching authentic course environment)
IF OBJECT_ID(N'dbo.emps', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.emps
    (
        eid INT IDENTITY(1,1) PRIMARY KEY,
        ename VARCHAR(50) NULL,
        salary INT NULL,
        overtime INT NULL
    );
    PRINT '>>> Table dbo.emps created successfully.';
END
ELSE
BEGIN
    ALTER TABLE dbo.emps ALTER COLUMN ename VARCHAR(50) NULL;
END
GO

-- Seed sample rows in emps
IF NOT EXISTS (SELECT 1 FROM dbo.emps WHERE ename = 'Ali')
BEGIN
    INSERT INTO dbo.emps (ename, salary, overtime) VALUES ('Ali', 3000, 1500);
END
GO

-- Bind the EXACT same rule object to another table's column: emps.overtime
EXEC sp_bindrule 'myrule', 'emps.overtime';
PRINT '>>> sp_bindrule executed: myrule bound to emps.overtime (Shared across tables).';
GO

-- Test enforcement on emps.overtime
BEGIN TRY
    INSERT INTO dbo.emps (ename, salary, overtime)
    VALUES ('BadEmp', 4000, 500); -- 500 <= 1000, violates myrule
END TRY
BEGIN CATCH
    PRINT '>>> [EXPECTED] Rule successfully blocked invalid INSERT on emps.overtime (overtime = 500):';
    PRINT '    Error ' + CAST(ERROR_NUMBER() AS VARCHAR) + ': ' + ERROR_MESSAGE();
END CATCH;
GO

-- ----------------------------------------------------------------------------
-- Step 7: Dropping Rules & Dependency Handling (Msg 3716 Demonstration)
-- ----------------------------------------------------------------------------
-- Attempting to drop rule while it is still bound to columns triggers Msg 3716:
-- "The rule 'myrule' cannot be dropped because it is bound to one or more column."
BEGIN TRY
    DROP RULE myrule;
END TRY
BEGIN CATCH
    PRINT '>>> [EXPECTED] Cannot drop rule while bound to columns (Msg 3716):';
    PRINT '    Error ' + CAST(ERROR_NUMBER() AS VARCHAR) + ': ' + ERROR_MESSAGE();
END CATCH;
GO

-- Unbind rule from all bound columns before dropping (Authentic Video Sequence)
EXEC sp_unbindrule 'instructor.salary';
PRINT '>>> sp_unbindrule executed: myrule unbound from instructor.salary.';

EXEC sp_unbindrule 'emps.overtime';
PRINT '>>> sp_unbindrule executed: myrule unbound from emps.overtime.';

-- Now DROP RULE succeeds cleanly
DROP RULE myrule;
PRINT '>>> DROP RULE myrule executed successfully.';
GO

-- ----------------------------------------------------------------------------
-- Step 8: Standalone Default Objects (create default & sp_bindefault)
-- ----------------------------------------------------------------------------
-- In the video:
-- --default
-- create default mydef as 5000
-- sp_bindefault mydef,'instructor.salary'
-- sp_unbindefault 'instructor.salary'
-- drop default mydef

IF EXISTS (SELECT 1 FROM sys.objects WHERE name = N'mydef' AND type = 'D')
BEGIN
    EXEC sp_unbindefault 'instructor.salary';
    DROP DEFAULT mydef;
END
GO

-- Create global standalone default
CREATE DEFAULT mydef AS 5000;
GO
PRINT '>>> CREATE DEFAULT mydef AS 5000 executed successfully.';
GO

-- Bind default to instructor.salary
EXEC sp_bindefault 'mydef', 'instructor.salary';
PRINT '>>> sp_bindefault executed: mydef bound to instructor.salary.';
GO

-- Test default value on INSERT when Salary is omitted
INSERT INTO dbo.Instructor (Ins_Id, Ins_Name)
VALUES (888, N'DefaultSalaryInstructor');

SELECT Ins_Id, Ins_Name, Salary 
FROM dbo.Instructor 
WHERE Ins_Id = 888;

-- Clean up test row
DELETE FROM dbo.Instructor WHERE Ins_Id = 888;
GO

-- ----------------------------------------------------------------------------
-- Step 9: Unbinding & Dropping Default Object (Lifecycle Cleanup)
-- ----------------------------------------------------------------------------
-- Attempting to drop default while bound triggers Msg 3716:
BEGIN TRY
    DROP DEFAULT mydef;
END TRY
BEGIN CATCH
    PRINT '>>> [EXPECTED] Cannot drop default while bound to column (Msg 3716):';
    PRINT '    Error ' + CAST(ERROR_NUMBER() AS VARCHAR) + ': ' + ERROR_MESSAGE();
END CATCH;
GO

-- Unbind default from column
EXEC sp_unbindefault 'instructor.salary';
PRINT '>>> sp_unbindefault executed: mydef unbound from instructor.salary.';

-- Drop default
DROP DEFAULT mydef;
PRINT '>>> DROP DEFAULT mydef executed successfully.';
GO

PRINT '============================================================================';
PRINT 'CH01_VID06 execution completed successfully with 100% database fidelity.';
PRINT '============================================================================';
GO

-- ----------------------------------------------------------------------------
-- Continuation Module Reference:
-- For the next module demonstrating User-Defined Data Types (UDDTs) bound to
-- standalone rules and defaults, see:
--   Script: src/01_storage_and_schema/ch01_vid07_custom_data_types.sql
--   Live Telemetry: docs/ch01-vid07-custom-data-types-live.md
-- ----------------------------------------------------------------------------
GO

