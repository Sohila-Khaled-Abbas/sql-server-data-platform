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
-- Step 6: Advantage 1 - Sharing a Rule Between Multiple Tables
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.Consultant', N'U') IS NOT NULL DROP TABLE dbo.Consultant;
GO

CREATE TABLE dbo.Consultant
(
    ConsultantId INT PRIMARY KEY,
    ConsultantName NVARCHAR(50),
    HourlyRate MONEY
);
GO

-- Bind the EXACT same rule object to another table's column
EXEC sp_bindrule 'myrule', 'dbo.Consultant.HourlyRate';
PRINT '>>> Rule [myrule] bound to dbo.Consultant.HourlyRate (Shared across tables).';
GO

-- Test enforcement on second table
BEGIN TRY
    INSERT INTO dbo.Consultant (ConsultantId, ConsultantName, HourlyRate)
    VALUES (1, N'Dr. Smith', 300);
END TRY
BEGIN CATCH
    PRINT '>>> [EXPECTED] Shared rule enforced on dbo.Consultant:';
    PRINT '    Error ' + CAST(ERROR_NUMBER() AS VARCHAR) + ': ' + ERROR_MESSAGE();
END CATCH;
GO

-- Clean up Consultant table
EXEC sp_unbindrule 'dbo.Consultant.HourlyRate';
DROP TABLE dbo.Consultant;
GO

-- ----------------------------------------------------------------------------
-- Step 7: Advantage 2 - Binding a Rule to a User-Defined Data Type (UDDT)
-- ----------------------------------------------------------------------------
IF TYPE_ID(N'dbo.udt_CompSalary') IS NOT NULL
BEGIN
    DROP TYPE dbo.udt_CompSalary;
END
GO

CREATE TYPE dbo.udt_CompSalary FROM MONEY NOT NULL;
GO

-- Bind rule directly to the user-defined type
EXEC sp_bindrule 'myrule', 'dbo.udt_CompSalary';
PRINT '>>> Rule [myrule] bound to User-Defined Data Type dbo.udt_CompSalary.';
GO

-- Clean up type binding
EXEC sp_unbindrule 'dbo.udt_CompSalary';
DROP TYPE dbo.udt_CompSalary;
GO

-- ----------------------------------------------------------------------------
-- Step 8: Defaults (Global Standalone Default Values)
-- ----------------------------------------------------------------------------
IF EXISTS (SELECT 1 FROM sys.objects WHERE name = N'mydef' AND type = 'D')
BEGIN
    EXEC sp_unbindefault 'dbo.Instructor.Salary';
    DROP DEFAULT mydef;
END
GO

---> Default [Global default value]
CREATE DEFAULT mydef AS 5000;
GO

PRINT '>>> Default [mydef] created successfully.';
GO

-- Bind default to column
EXEC sp_bindefault 'mydef', 'dbo.Instructor.Salary';
PRINT '>>> sp_bindefault executed: mydef bound to dbo.Instructor.Salary.';
GO

-- Test default value on INSERT with unspecified Salary
INSERT INTO dbo.Instructor (Ins_Id, Ins_Name)
VALUES (888, N'DefaultSalaryInstructor');

SELECT Ins_Id, Ins_Name, Salary 
FROM dbo.Instructor 
WHERE Ins_Id = 888;

-- Clean up test row
DELETE FROM dbo.Instructor WHERE Ins_Id = 888;
GO

-- ----------------------------------------------------------------------------
-- Step 9: Unbinding & Object Lifecycle Management
-- ----------------------------------------------------------------------------
EXEC sp_unbindrule 'dbo.Instructor.Salary';
PRINT '>>> Rule unbound from dbo.Instructor.Salary.';

DROP RULE myrule;
PRINT '>>> Rule [myrule] dropped successfully.';

EXEC sp_unbindefault 'dbo.Instructor.Salary';
PRINT '>>> Default unbound from dbo.Instructor.Salary.';

DROP DEFAULT mydef;
PRINT '>>> Default [mydef] dropped successfully.';
GO

PRINT '============================================================================';
PRINT 'CH01_VID06 execution completed successfully with 100% database fidelity.';
PRINT '============================================================================';
GO
