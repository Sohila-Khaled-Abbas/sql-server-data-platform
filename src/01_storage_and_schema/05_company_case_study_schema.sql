/*
===============================================================================
Module:        01_storage_and_schema
Script:        05_company_case_study_schema.sql
Description:   Physical implementation of the MaharaTech Course 2305 Case Study
               (Peter Chen ERD: Company Database - CH01_VID02 through CH01_VID05).
Features:      - Relational mapping of 1:1, 1:N, M:N, weak entities & multi-valued attributes
               - Circular foreign key resolution (Employee <-> Department)
               - Explicit filegroup placement (DATA_FG & INDEX_FG)
               - Cascading delete rules & check constraints
               - Benchmark ITI seed dataset and hierarchical verification
Execution:     Idempotent (safe to re-run multiple times)
===============================================================================
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

USE [OmniFlowDB];
GO

-- 1. Create Dedicated Schema
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'Company')
BEGIN
    EXEC('CREATE SCHEMA Company AUTHORIZATION dbo;');
    PRINT '>> Schema [Company] created successfully.';
END
GO

-- Determine target filegroup (supports fg1 from ITItest, DATA_FG from OmniFlowDB, or PRIMARY)
DECLARE @TargetFG NVARCHAR(128) = 'PRIMARY';
IF EXISTS (SELECT 1 FROM sys.filegroups WHERE name = 'fg1')
    SET @TargetFG = 'fg1';
ELSE IF EXISTS (SELECT 1 FROM sys.filegroups WHERE name = 'DATA_FG')
    SET @TargetFG = 'DATA_FG';

-- 2. Drop Foreign Keys for Idempotent Scripting
IF OBJECT_ID('Company.FK_Employee_Department_Dno', 'F') IS NOT NULL
    ALTER TABLE Company.Employee DROP CONSTRAINT FK_Employee_Department_Dno;

IF OBJECT_ID('Company.FK_Department_Employee_MgrSSN', 'F') IS NOT NULL
    ALTER TABLE Company.Department DROP CONSTRAINT FK_Department_Employee_MgrSSN;

IF OBJECT_ID('Company.FK_Employee_Supervisor_SuperSSN', 'F') IS NOT NULL
    ALTER TABLE Company.Employee DROP CONSTRAINT FK_Employee_Supervisor_SuperSSN;

-- 3. Base Entities: Department & Employee

-- 3.1 Department Table
IF OBJECT_ID('Company.Department', 'U') IS NULL
BEGIN
    CREATE TABLE Company.Department (
        DNum            INT             NOT NULL,
        DName           VARCHAR(50)     NOT NULL,
        MgrSSN          CHAR(9)         NULL,
        MgrHireDate     DATE            NULL,
        CreatedAt       DATETIME2(3)    NOT NULL CONSTRAINT DF_Dept_CreatedAt DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_Company_Department PRIMARY KEY CLUSTERED (DNum),
        CONSTRAINT UQ_Company_Department_DName UNIQUE (DName)
    ) ON [DATA_FG];
    PRINT '>> Table [Company.Department] created.';
END
GO

-- 3.2 Employee Table
IF OBJECT_ID('Company.Employee', 'U') IS NULL
BEGIN
    CREATE TABLE Company.Employee (
        SSN             CHAR(9)         NOT NULL,
        FName           VARCHAR(15)     NOT NULL,
        MInit           CHAR(1)         NULL,
        LName           VARCHAR(15)     NOT NULL,
        BDate           DATE            NULL,
        Gender          CHAR(1)         NULL,
        Salary          DECIMAL(10,2)   NOT NULL,
        SuperSSN        CHAR(9)         NULL,
        Dno             INT             NULL,
        CreatedAt       DATETIME2(3)    NOT NULL CONSTRAINT DF_Emp_CreatedAt DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_Company_Employee PRIMARY KEY CLUSTERED (SSN),
        CONSTRAINT CK_Company_Employee_Gender CHECK (Gender IN ('M', 'F')),
        CONSTRAINT CK_Company_Employee_Salary CHECK (Salary > 0)
    ) ON [DATA_FG];
    PRINT '>> Table [Company.Employee] created.';
END
GO

-- 4. Circular Foreign Key Constraints Binding
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Employee_Department_Dno')
BEGIN
    ALTER TABLE Company.Employee
    ADD CONSTRAINT FK_Employee_Department_Dno
    FOREIGN KEY (Dno) REFERENCES Company.Department(DNum);
    PRINT '>> Foreign Key [FK_Employee_Department_Dno] bound.';
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Department_Employee_MgrSSN')
BEGIN
    ALTER TABLE Company.Department
    ADD CONSTRAINT FK_Department_Employee_MgrSSN
    FOREIGN KEY (MgrSSN) REFERENCES Company.Employee(SSN);
    PRINT '>> Foreign Key [FK_Department_Employee_MgrSSN] bound.';
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_Employee_Supervisor_SuperSSN')
BEGIN
    ALTER TABLE Company.Employee
    ADD CONSTRAINT FK_Employee_Supervisor_SuperSSN
    FOREIGN KEY (SuperSSN) REFERENCES Company.Employee(SSN);
    PRINT '>> Recursive Foreign Key [FK_Employee_Supervisor_SuperSSN] bound.';
END
GO

-- 5. Multi-Valued Attribute Mapping: DeptLocations (1:N)
IF OBJECT_ID('Company.DeptLocations', 'U') IS NULL
BEGIN
    CREATE TABLE Company.DeptLocations (
        DNum        INT             NOT NULL,
        Location    VARCHAR(50)     NOT NULL,
        CONSTRAINT PK_Company_DeptLocations PRIMARY KEY CLUSTERED (DNum, Location),
        CONSTRAINT FK_DeptLocations_Department FOREIGN KEY (DNum)
            REFERENCES Company.Department(DNum) ON DELETE CASCADE
    ) ON [DATA_FG];
    PRINT '>> Table [Company.DeptLocations] created.';
END
GO

-- 6. Entity: Project (1:N with Department)
IF OBJECT_ID('Company.Project', 'U') IS NULL
BEGIN
    CREATE TABLE Company.Project (
        PNum        INT             NOT NULL,
        PName       VARCHAR(50)     NOT NULL,
        City        VARCHAR(50)     NOT NULL,
        Location    VARCHAR(50)     NULL,
        DNum        INT             NOT NULL,
        CONSTRAINT PK_Company_Project PRIMARY KEY CLUSTERED (PNum),
        CONSTRAINT UQ_Company_Project_PName UNIQUE (PName),
        CONSTRAINT FK_Project_Department FOREIGN KEY (DNum)
            REFERENCES Company.Department(DNum)
    ) ON [DATA_FG];
    PRINT '>> Table [Company.Project] created.';
END
GO

-- 7. Associative Table for M:N Relationship: WorksOn
IF OBJECT_ID('Company.WorksOn', 'U') IS NULL
BEGIN
    CREATE TABLE Company.WorksOn (
        ESSN        CHAR(9)         NOT NULL,
        PNo         INT             NOT NULL,
        Hours       DECIMAL(5,2)    NULL,
        CONSTRAINT PK_Company_WorksOn PRIMARY KEY CLUSTERED (ESSN, PNo),
        CONSTRAINT CK_WorksOn_Hours CHECK (Hours >= 0.00 AND Hours <= 100.00),
        CONSTRAINT FK_WorksOn_Employee FOREIGN KEY (ESSN)
            REFERENCES Company.Employee(SSN) ON DELETE CASCADE,
        CONSTRAINT FK_WorksOn_Project FOREIGN KEY (PNo)
            REFERENCES Company.Project(PNum) ON DELETE CASCADE
    ) ON [DATA_FG];
    PRINT '>> Table [Company.WorksOn] created.';
END
GO

-- 8. Weak Entity Mapping: Dependent (Identifying 1:N with Employee)
IF OBJECT_ID('Company.Dependent', 'U') IS NULL
BEGIN
    CREATE TABLE Company.Dependent (
        ESSN            CHAR(9)         NOT NULL,
        DependentName   VARCHAR(50)     NOT NULL,
        Gender          CHAR(1)         NULL,
        BDate           DATE            NULL,
        Relationship    VARCHAR(20)     NOT NULL,
        CONSTRAINT PK_Company_Dependent PRIMARY KEY CLUSTERED (ESSN, DependentName),
        CONSTRAINT CK_Company_Dependent_Gender CHECK (Gender IN ('M', 'F')),
        CONSTRAINT FK_Dependent_Employee FOREIGN KEY (ESSN)
            REFERENCES Company.Employee(SSN) ON DELETE CASCADE
    ) ON [DATA_FG];
    PRINT '>> Table [Company.Dependent] created.';
END
GO

-- 9. Performance Indexes on Foreign Keys (Eliminating Table Scans on Joins)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Employee_Dno' AND object_id = OBJECT_ID('Company.Employee'))
    CREATE NONCLUSTERED INDEX IX_Employee_Dno ON Company.Employee (Dno) ON [INDEX_FG];

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Employee_SuperSSN' AND object_id = OBJECT_ID('Company.Employee'))
    CREATE NONCLUSTERED INDEX IX_Employee_SuperSSN ON Company.Employee (SuperSSN) ON [INDEX_FG];

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Project_DNum' AND object_id = OBJECT_ID('Company.Project'))
    CREATE NONCLUSTERED INDEX IX_Project_DNum ON Company.Project (DNum) ON [INDEX_FG];
GO

-- 10. Seed Benchmark Dataset (Classic ITI Company Case Study)
SET NOCOUNT ON;

-- Step A: Insert Departments (with MgrSSN = NULL initially to avoid circular FK violation)
MERGE Company.Department AS target
USING (VALUES
    (1, 'Headquarters', NULL, '2020-06-19'),
    (4, 'Administration', NULL, '2021-01-01'),
    (5, 'Research',       NULL, '2018-05-22')
) AS source (DNum, DName, MgrSSN, MgrHireDate)
ON target.DNum = source.DNum
WHEN NOT MATCHED THEN
    INSERT (DNum, DName, MgrSSN, MgrHireDate)
    VALUES (source.DNum, source.DName, source.MgrSSN, source.MgrHireDate);

-- Step B: Insert Employees
MERGE Company.Employee AS target
USING (VALUES
    ('888665555', 'James',    'E', 'Borg',     '1967-11-10', 'M', 55000.00, NULL,        1),
    ('333445555', 'Franklin', 'T', 'Wong',     '1985-12-08', 'M', 40000.00, '888665555', 5),
    ('987654321', 'Jennifer', 'S', 'Wallace',  '1971-06-20', 'F', 43000.00, '888665555', 4),
    ('123456789', 'John',     'B', 'Smith',    '1995-01-09', 'M', 30000.00, '333445555', 5),
    ('666884444', 'Ramesh',   'K', 'Narayan',  '1992-09-15', 'M', 38000.00, '333445555', 5),
    ('453453453', 'Joyce',    'A', 'English',  '2002-07-31', 'F', 25000.00, '333445555', 5),
    ('987987987', 'Ahmad',    'V', 'Jabbar',   '1989-03-29', 'M', 25000.00, '987654321', 4),
    ('999887777', 'Alicia',   'J', 'Zelaya',   '1998-07-19', 'F', 25000.00, '987654321', 4)
) AS source (SSN, FName, MInit, LName, BDate, Gender, Salary, SuperSSN, Dno)
ON target.SSN = source.SSN
WHEN NOT MATCHED THEN
    INSERT (SSN, FName, MInit, LName, BDate, Gender, Salary, SuperSSN, Dno)
    VALUES (source.SSN, source.FName, source.MInit, source.LName, source.BDate, source.Gender, source.Salary, source.SuperSSN, source.Dno);

-- Step C: Update Managers in Department table now that Employees exist
UPDATE Company.Department SET MgrSSN = '888665555' WHERE DNum = 1;
UPDATE Company.Department SET MgrSSN = '987654321' WHERE DNum = 4;
UPDATE Company.Department SET MgrSSN = '333445555' WHERE DNum = 5;

-- Step D: Insert Department Locations
MERGE Company.DeptLocations AS target
USING (VALUES
    (1, 'Houston'),
    (4, 'Stafford'),
    (5, 'Bellaire'),
    (5, 'Sugarland'),
    (5, 'Houston')
) AS source (DNum, Location)
ON target.DNum = source.DNum AND target.Location = source.Location
WHEN NOT MATCHED THEN
    INSERT (DNum, Location) VALUES (source.DNum, source.Location);

-- Step E: Insert Projects
MERGE Company.Project AS target
USING (VALUES
    (1,  'ProductX',       'Bellaire', 'Bellaire Center', 5),
    (2,  'ProductY',       'Sugarland','Sugarland Park',  5),
    (3,  'ProductZ',       'Houston',  'HQ Lab',          5),
    (10, 'Computerization','Stafford', 'Admin Block',     4),
    (20, 'Reorganization', 'Houston',  'HQ Tower',        1),
    (30, 'Newbenefits',    'Stafford', 'Benefits Office', 4)
) AS source (PNum, PName, City, Location, DNum)
ON target.PNum = source.PNum
WHEN NOT MATCHED THEN
    INSERT (PNum, PName, City, Location, DNum)
    VALUES (source.PNum, source.PName, source.City, source.Location, source.DNum);

-- Step F: Insert Works_On Records
MERGE Company.WorksOn AS target
USING (VALUES
    ('123456789', 1,  32.5),
    ('123456789', 2,  7.5),
    ('666884444', 3,  40.0),
    ('453453453', 1,  20.0),
    ('453453453', 2,  20.0),
    ('333445555', 2,  10.0),
    ('333445555', 3,  10.0),
    ('333445555', 10, 10.0),
    ('333445555', 20, 10.0),
    ('999887777', 30, 30.0),
    ('999887777', 10, 10.0),
    ('987987987', 10, 35.0),
    ('987987987', 30, 5.0),
    ('987654321', 30, 20.0),
    ('987654321', 20, 15.0),
    ('888665555', 20, 0.0)
) AS source (ESSN, PNo, Hours)
ON target.ESSN = source.ESSN AND target.PNo = source.PNo
WHEN NOT MATCHED THEN
    INSERT (ESSN, PNo, Hours) VALUES (source.ESSN, source.PNo, source.Hours);

-- Step G: Insert Dependents (Weak Entity)
MERGE Company.Dependent AS target
USING (VALUES
    ('333445555', 'Alice',     'F', '2016-04-05', 'Daughter'),
    ('333445555', 'Theodore',  'M', '2013-10-25', 'Son'),
    ('333445555', 'Joy',       'F', '1988-05-03', 'Spouse'),
    ('987654321', 'Abner',     'M', '1972-02-28', 'Spouse'),
    ('123456789', 'Michael',   'M', '2018-01-04', 'Son'),
    ('123456789', 'Alice',     'F', '2020-12-30', 'Daughter'),
    ('123456789', 'Elizabeth', 'F', '1997-05-05', 'Spouse')
) AS source (ESSN, DependentName, Gender, BDate, Relationship)
ON target.ESSN = source.ESSN AND target.DependentName = source.DependentName
WHEN NOT MATCHED THEN
    INSERT (ESSN, DependentName, Gender, BDate, Relationship)
    VALUES (source.ESSN, source.DependentName, source.Gender, source.BDate, source.Relationship);

PRINT '>> Benchmark Seed Data for [Company] successfully populated.';
GO

-- 11. Verification Query
DECLARE @EmpCount INT, @DeptCount INT, @ProjCount INT, @DepCount INT;
SELECT @EmpCount = COUNT(*) FROM Company.Employee;
SELECT @DeptCount = COUNT(*) FROM Company.Department;
SELECT @ProjCount = COUNT(*) FROM Company.Project;
SELECT @DepCount = COUNT(*) FROM Company.Dependent;

PRINT '=======================================================';
PRINT 'Company Database Case Study Verification:';
PRINT '  Total Employees   : ' + CAST(@EmpCount AS VARCHAR);
PRINT '  Total Departments : ' + CAST(@DeptCount AS VARCHAR);
PRINT '  Total Projects    : ' + CAST(@ProjCount AS VARCHAR);
PRINT '  Total Dependents  : ' + CAST(@DepCount AS VARCHAR);
PRINT '=======================================================';
GO
