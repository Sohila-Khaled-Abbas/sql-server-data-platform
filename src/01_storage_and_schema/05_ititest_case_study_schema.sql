/*
===============================================================================
Database:      ITItest
Script:        05_ititest_case_study_schema.sql
Description:   Dynamically synchronized schema for ITItest database
Generated At:  2026-09-18T16:47:06.108706+00:00
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

-- [INFO] Database [ITItest] has been provisioned with 4 filegroups (PRIMARY, fg1, fg2, fg3).
-- [INFO] Tables are being created in SSMS Wizard. Once added, run 'python scripts/sync_ititest_db.py'
--        to automatically capture their DDL definitions here.
