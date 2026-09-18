/*
===============================================================================
Database:      ITItest
Script:        05_ititest_case_study_schema.sql
Description:   Dynamically synchronized schema for ITItest database
Generated At:  2026-09-18T17:38:50.668554+00:00
Storage Root:  D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb
===============================================================================
*/

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

USE [ITItest];
GO

-- 1. Physical Storage & Filegroups Verification
-- File: ITItest (PRIMARY) -> D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\ITItest.mdf [8 MB]
-- File: file2 (fg1) -> D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\file2.ndf [8 MB]
-- File: file3 (fg2) -> D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\file3.ndf [8 MB]
-- File: file4 (fg3) -> D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\file4.ndf [8 MB]
-- File: ITItest_log (N/A (LOG)) -> D:\courses\Data Science\Data Engineering\MaharaTech\Implementing and Developing SQL server objects\CH01\Mydb\ITItest_log.ldf [8 MB]

-- 2. Schemas & User Tables

-- Table: dbo.depts (Filegroup: fg1)
IF OBJECT_ID('dbo.depts', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.depts (
        [did] INT NOT NULL,
        [dname] VARCHAR(50) NULL,
        CONSTRAINT [PK_depts] PRIMARY KEY CLUSTERED ([did])
    ) ON [fg1];
    PRINT '>> Created Table dbo.depts on filegroup [fg1].';
END;
GO

-- Table: dbo.emp (Filegroup: fg2)
IF OBJECT_ID('dbo.emp', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.emp (
        [eid] INT IDENTITY(1,1) NOT NULL,
        [ename] VARCHAR(50) NOT NULL,
        [eadd] VARCHAR(50) NULL CONSTRAINT [DF_emp_eadd] DEFAULT ('cairo'),
        [hiredate] DATE NULL CONSTRAINT [DF_emp_hiredate] DEFAULT (getdate()),
        [salary] INT NULL,
        [overtime] INT NULL,
        [netsal] INT NULL,
        [bd] DATE NULL,
        [age] INT NULL,
        [hour_rate] INT NULL,
        [gender] VARCHAR(1) NULL,
        [dnum] INT NULL,
        CONSTRAINT [PK_emp] PRIMARY KEY CLUSTERED ([eid])
    ) ON [fg2];
    PRINT '>> Created Table dbo.emp on filegroup [fg2].';
END;
GO

-- 3. Foreign Key Constraints
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_emp_depts')
BEGIN
    ALTER TABLE dbo.emp
    ADD CONSTRAINT [FK_emp_depts] FOREIGN KEY ([dnum])
    REFERENCES dbo.depts ([did]);
    PRINT '>> Bound Foreign Key [FK_emp_depts].';
END;
GO
