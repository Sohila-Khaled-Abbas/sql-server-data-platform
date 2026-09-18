/*
===============================================================================
Database:      ITItest
Script:        05_ititest_case_study_schema.sql
Description:   Dynamically synchronized schema for ITItest database
Generated At:  2026-09-18T17:16:58.218652+00:00
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

-- 3. Foreign Key Constraints