-- ============================================================================
-- Script: ch01_vid05_integrity_constraints.sql
-- Module: CH01_VID05 - Integrity Constraints (PK, FK, Unique, Check)
-- Course: MaharaTech Course 2305 ("Implementing & Developing SQL Server Objects")
-- Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
-- Database Engine: Microsoft SQL Server 2022 Developer Edition
-- Target Database: [DB2]
-- Description:
--   Authentic implementation of relational integrity constraints in SQL Server:
--   1. Primary Key: Composite PK on (eid, ename) [c1]
--   2. Unique Constraints: Unique salary [c2], Unique overtime [c3]
--   3. Domain Check Constraints:
--      - salary > 1000 [c4]
--      - overtime between 100 and 5600 [c5]
--      - eadd IN ('alex', 'mansoura', 'cairo') [c6]
--      - gender IN ('F', 'M') [c7]
--   4. Referential Integrity (Foreign Key):
--      - dnum REFERENCES depts(did) ON DELETE SET NULL ON UPDATE CASCADE [c8]
--   5. Computed Columns:
--      - netsal: ISNULL(salary, 0) + ISNULL(overtime, 0) PERSISTED
--      - age: YEAR(GETDATE()) - YEAR(bd)
-- ============================================================================

SET NOCOUNT ON;
GO

-- ----------------------------------------------------------------------------
-- Step 1: Create Database DB2
-- ----------------------------------------------------------------------------
IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'DB2')
BEGIN
    PRINT '>>> Creating database DB2...';
    CREATE DATABASE DB2;
END
GO

USE DB2;
GO

-- ----------------------------------------------------------------------------
-- Step 2: Create Department Table (Parent Entity)
-- ----------------------------------------------------------------------------
IF OBJECT_ID(N'dbo.emps', N'U') IS NOT NULL DROP TABLE dbo.emps;
IF OBJECT_ID(N'dbo.depts', N'U') IS NOT NULL DROP TABLE dbo.depts;
GO

CREATE TABLE depts
(
    did INT PRIMARY KEY,
    dname VARCHAR(10)
);
GO

-- ----------------------------------------------------------------------------
-- Step 3: Create Employees Table with 8 Explicit Named Constraints (c1 - c8)
-- ----------------------------------------------------------------------------
CREATE TABLE emps
(
    eid INT IDENTITY(1,1),
    ename VARCHAR(10),
    eadd VARCHAR(10) DEFAULT 'cairo',
    hiredate DATE DEFAULT GETDATE(),
    salary INT,
    overtime INT,
    netsal AS ISNULL(salary, 0) + ISNULL(overtime, 0) PERSISTED,
    bd DATE,
    age AS YEAR(GETDATE()) - YEAR(bd),
    gender VARCHAR(1),
    hour_rate INT NOT NULL,
    dnum INT,
    CONSTRAINT c1 PRIMARY KEY (eid, ename),
    CONSTRAINT c2 UNIQUE (salary),
    CONSTRAINT c3 UNIQUE (overtime),
    CONSTRAINT c4 CHECK (salary > 1000),
    CONSTRAINT c5 CHECK (overtime BETWEEN 100 AND 5600),
    CONSTRAINT c6 CHECK (eadd IN ('alex', 'mansoura', 'cairo')),
    CONSTRAINT c7 CHECK (gender = 'F' OR gender = 'M'),
    CONSTRAINT c8 FOREIGN KEY (dnum) REFERENCES depts(did)
        ON DELETE SET NULL ON UPDATE CASCADE
);
GO

PRINT '>>> Tables dbo.depts and dbo.emps created successfully with constraints c1 - c8.';
GO

-- ----------------------------------------------------------------------------
-- Step 4: Seed Valid Data (Testing Constraints Compliance)
-- ----------------------------------------------------------------------------
INSERT INTO dbo.depts (did, dname)
VALUES 
    (10, 'HR'),
    (20, 'IT'),
    (30, 'Sales');

INSERT INTO dbo.emps (ename, eadd, hiredate, salary, overtime, bd, gender, hour_rate, dnum)
VALUES 
    ('Ahmed', 'cairo', '2026-01-15', 5000, 500, '1995-04-12', 'M', 50, 10),
    ('Sara',  'alex',  '2026-02-01', 7500, 800, '1998-09-20', 'F', 65, 20);
GO

-- ----------------------------------------------------------------------------
-- Step 5: Verification Queries (Inspect Computed Columns & Relational Join)
-- ----------------------------------------------------------------------------
SELECT 
    e.eid,
    e.ename,
    e.gender,
    e.eadd AS City,
    e.hiredate,
    e.salary,
    e.overtime,
    e.netsal AS [NetSalary (Persisted)],
    e.bd AS BirthDate,
    e.age AS [Age (Computed)],
    e.hour_rate,
    d.did AS DeptId,
    d.dname AS DeptName
FROM dbo.emps e
LEFT JOIN dbo.depts d ON e.dnum = d.did;
GO

-- ----------------------------------------------------------------------------
-- Step 6: Test Referential Actions (ON UPDATE CASCADE & ON DELETE SET NULL)
-- ----------------------------------------------------------------------------

-- A. Test ON UPDATE CASCADE: Update Department 10 -> 100
PRINT '>>> Testing ON UPDATE CASCADE (Department 10 -> 100)...';
UPDATE dbo.depts SET did = 100 WHERE did = 10;

SELECT eid, ename, dnum AS CascadedDeptId 
FROM dbo.emps 
WHERE ename = 'Ahmed';
-- Notice Ahmed.dnum automatically updated to 100!

-- Revert Department 100 -> 10
UPDATE dbo.depts SET did = 10 WHERE did = 100;
GO

-- B. Test ON DELETE SET NULL: Delete Department 30 (or test with child row)
PRINT '>>> Verification of all 8 constraints in system catalog:';
SELECT 
    tc.TABLE_NAME,
    tc.CONSTRAINT_NAME,
    tc.CONSTRAINT_TYPE,
    kcu.COLUMN_NAME,
    cc.CHECK_CLAUSE,
    rc.DELETE_RULE,
    rc.UPDATE_RULE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME
LEFT JOIN INFORMATION_SCHEMA.CHECK_CONSTRAINTS cc ON tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME
LEFT JOIN INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc ON tc.CONSTRAINT_NAME = rc.CONSTRAINT_NAME
WHERE tc.TABLE_NAME IN ('depts', 'emps')
ORDER BY tc.TABLE_NAME, tc.CONSTRAINT_NAME;
GO
