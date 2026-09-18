/**
 * Official Video Catalog: MaharaTech Course 2305
 * Implementing and Developing SQL Server Objects
 * Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)
 * Fully cataloged with all 101 authentic course lessons + Final Capstone Project
 * Integrated with Microsoft Learn Documentation references.
 */

export const COURSE_METADATA = {
  courseId: 2305,
  courseTitle: "Implementing and Developing SQL Server Objects",
  instructor: "Eng. Rami Mohamed Abonagi",
  institution: "Information Technology Institute (ITI) / MaharaTech",
  portalUrl: "https://maharatech.gov.eg/course/view.php?id=2305",
  totalVideos: 102,
  totalChapters: 5,
  description: "Comprehensive 101-module engineering curriculum mastering Microsoft SQL Server internals, relational modeling, advanced T-SQL programming, concurrency control, partitioning, triggers, and Kimball dimensional warehousing."
};

export const COURSE_VIDEOS = [
  // ==========================================
  // CHAPTER 1: DATABASE CREATION AND MANAGEMENT
  // ==========================================
  {
    id: "ch01-vid01",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID01",
    title: "Create Database and Filegroups",
    duration: "19 mins",
    level: "Foundational",
    skillsConnected: ["Storage Engine Internals", "MDF/NDF/LDF Files", "Filegroup Isolation", "Disk I/O Separation"],
    objectives: [
      "Master storage engine internals in SQL Server.",
      "Master mdf/ndf/ldf files in SQL Server.",
      "Master filegroup isolation in SQL Server.",
      "Complete the practical exercise for Create Database and Filegroups."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Create Database and Filegroups' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Create Database and Filegroups\n-- Video Code: CH01_VID01\nSELECT 'CH01_VID01' AS VideoCode, 'Create Database and Filegroups' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/01_storage_and_schema/ch01_vid01_ititest_filegroups.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid01-1", name: "Create Database and Filegroups Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid01-2", name: "Solution DDL / Script", type: "SQL", path: "src/01_storage_and_schema/ch01_vid01_ititest_filegroups.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17520",
    microsoftDocTitle: "Database Files and Filegroups Architecture",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-files-and-filegroups"
  },
  {
    id: "ch01-vid02",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID02",
    title: "Create Database Using Wizard (ITItest Case Study)",
    duration: "24 mins",
    level: "Foundational",
    skillsConnected: ["SSMS Wizard", "Table Designer", "Filegroup Allocation", "Foreign Keys", "Database Diagrams"],
    objectives: [
      "Master ssms wizard in SQL Server.",
      "Master table designer in SQL Server.",
      "Master filegroup allocation in SQL Server.",
      "Complete the practical exercise for Create Database Using Wizard (ITItest Case Study)."
    ],
    description: "Hands-on walkthrough of creating the ITItest database and multi-filegroup physical layout using the SSMS Database Creation Wizard in CH01\\Mydb. Students model the depts and emp tables, define identity fields, and establish foreign key relationships via SSMS Database Diagrams.",
    sampleSql: `-- Query the live ITItest depts and emp tables created via Wizard\nSELECT e.eid, e.ename, e.salary, e.eadd, d.dname\nFROM emp e INNER JOIN depts d ON e.dnum = d.did\nORDER BY d.dname, e.salary DESC;`,
    repoPath: "src/01_storage_and_schema/ch01_vid02_ititest_case_study_schema.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid02-1", name: "Create Database Using Wizard (ITItest Case Study) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid02-2", name: "Solution DDL / Script", type: "SQL", path: "src/01_storage_and_schema/ch01_vid02_ititest_case_study_schema.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17521",
    microsoftDocTitle: "CREATE TABLE (Transact-SQL) Guide",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql"
  },
  {
    id: "ch01-vid03",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID03",
    title: "Create Database Using Code (T-SQL)",
    duration: "22 mins",
    level: "Foundational",
    skillsConnected: ["CREATE DATABASE DDL", "Physical Sizing Math", "FILEGROWTH Rules", "ALTER DATABASE ADD FILEGROUP"],
    objectives: [
      "Master create database ddl in SQL Server.",
      "Master physical sizing math in SQL Server.",
      "Master filegrowth rules in SQL Server.",
      "Complete the practical exercise for Create Database Using Code (T-SQL)."
    ],
    description: "Mastering programmatic database creation using Transact-SQL DDL. Covers CREATE DATABASE with PRIMARY, secondary filegroups (fg1, fg2), filegrowth mathematics, and safe drop/recreate patterns.",
    sampleSql: `-- Create database with code & multiple filegroups\nCREATE DATABASE ITItest\nON PRIMARY (NAME = N'ITItest_Data', FILENAME = N'D:\\courses\\Data Science\\Data Engineering\\MaharaTech\\Implementing and Developing SQL server objects\\CH01\\Mydb\\ITItest_Data.mdf'),\nFILEGROUP fg1 (NAME = N'ITItest_fg1', FILENAME = N'D:\\courses\\Data Science\\Data Engineering\\MaharaTech\\Implementing and Developing SQL server objects\\CH01\\Mydb\\ITItest_fg1.ndf')\nLOG ON (NAME = N'ITItest_Log', FILENAME = N'D:\\courses\\Data Science\\Data Engineering\\MaharaTech\\Implementing and Developing SQL server objects\\CH01\\Mydb\\ITItest_Log.ldf');`,
    repoPath: "src/01_storage_and_schema/ch01_vid03_create_database_code.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid03-1", name: "Create Database Using Code (T-SQL) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid03-2", name: "Solution DDL / Script", type: "SQL", path: "src/01_storage_and_schema/ch01_vid03_create_database_code.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17522",
    microsoftDocTitle: "CREATE DATABASE (Transact-SQL) Syntax Reference",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-database-transact-sql"
  },
  {
    id: "ch01-vid04",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID04",
    title: "Database Integrity (Domain, Entity & Referential)",
    duration: "18 mins",
    level: "Foundational",
    skillsConnected: ["Domain Integrity (Range of Values)", "Entity Integrity (Uniqueness)", "Referential Integrity (Relationships)", "DB Constraints vs DB Objects", "Custom Constraints"],
    objectives: [
      "Master domain integrity (range of values) in SQL Server.",
      "Master entity integrity (uniqueness) in SQL Server.",
      "Master referential integrity (relationships) in SQL Server.",
      "Complete the practical exercise for Database Integrity (Domain, Entity & Referential)."
    ],
    description: "Comprehensive implementation of the Database Integrity taxonomy: Domain Integrity (data types, defaults, check constraints, rules), Entity Integrity (primary keys, unique constraints, filtered unique indexes), and Referential Integrity (foreign keys, cascading actions) across DB constraints, DB objects, and custom stored procedures in ITItest.",
    sampleSql: `-- Inspect verified Domain, Entity, and Referential Integrity on ITItest\nSELECT e.eid, e.ename, e.salary, e.eadd, e.netsal, d.dname\nFROM dbo.emp e INNER JOIN dbo.depts d ON e.dnum = d.did;\n\n-- Enforce custom business rules via transactional Stored Procedure\nEXEC dbo.usp_HireEmployee @ename = N'Kareem Tarek', @salary = 4500.00, @dnum = 10, @hiredate = '2026-03-01';`,
    repoPath: "src/01_storage_and_schema/ch01_vid04_database_integrity.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid04-1", name: "Database Integrity (Domain, Entity & Referential) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid04-2", name: "Solution DDL / Script", type: "SQL", path: "src/01_storage_and_schema/ch01_vid04_database_integrity.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17523",
    microsoftDocTitle: "Data Integrity in Relational Databases",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints"
  },
  {
    id: "ch01-vid05",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID05",
    title: "Integrity Constraints (PK, FK, Unique, Check)",
    duration: "20 mins",
    level: "Foundational",
    skillsConnected: ["PRIMARY KEY", "FOREIGN KEY Cascades", "UNIQUE Constraints", "CHECK Constraints"],
    objectives: [
      "Master primary key in SQL Server.",
      "Master foreign key cascades in SQL Server.",
      "Master unique constraints in SQL Server.",
      "Complete the practical exercise for Integrity Constraints (PK, FK, Unique, Check)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Integrity Constraints (PK, FK, Unique, Check)' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Integrity Constraints (PK, FK, Unique, Check)\n-- Video Code: CH01_VID05\nSELECT 'CH01_VID05' AS VideoCode, 'Integrity Constraints (PK, FK, Unique, Check)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/01_storage_and_schema/03_integrity_constraints.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid05-1", name: "Integrity Constraints (PK, FK, Unique, Check) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid05-2", name: "Solution DDL / Script", type: "SQL", path: "src/01_storage_and_schema/03_integrity_constraints.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17524",
    microsoftDocTitle: "Create Unique Constraints & Check Constraints",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/tables/create-unique-constraints"
  },
  {
    id: "ch01-vid06",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID06",
    title: "Constraints, Rules, and Default Values",
    duration: "17 mins",
    level: "Foundational",
    skillsConnected: ["CREATE RULE", "sp_bindrule", "CREATE DEFAULT", "sp_bindefault", "ANSI Constraints vs Legacy Objects"],
    objectives: [
      "Master create rule in SQL Server.",
      "Master sp_bindrule in SQL Server.",
      "Master create default in SQL Server.",
      "Complete the practical exercise for Constraints, Rules, and Default Values."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Constraints, Rules, and Default Values' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Constraints, Rules, and Default Values\n-- Video Code: CH01_VID06\nSELECT 'CH01_VID06' AS VideoCode, 'Constraints, Rules, and Default Values' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/01_storage_and_schema/02_custom_types_and_rules.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid06-1", name: "Constraints, Rules, and Default Values Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid06-2", name: "Solution DDL / Script", type: "SQL", path: "src/01_storage_and_schema/02_custom_types_and_rules.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17525",
    microsoftDocTitle: "CREATE RULE & sp_bindrule (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-rule-transact-sql"
  },
  {
    id: "ch01-vid07",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID07",
    title: "Creating a Custom Data Type (UDDT)",
    duration: "16 mins",
    level: "Foundational",
    skillsConnected: ["CREATE TYPE", "sp_addtype", "Domain Modeling", "Binding Rules & Defaults to Types"],
    objectives: [
      "Master create type in SQL Server.",
      "Master sp_addtype in SQL Server.",
      "Master domain modeling in SQL Server.",
      "Complete the practical exercise for Creating a Custom Data Type (UDDT)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Creating a Custom Data Type (UDDT)' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Creating a Custom Data Type (UDDT)\n-- Video Code: CH01_VID07\nSELECT 'CH01_VID07' AS VideoCode, 'Creating a Custom Data Type (UDDT)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/01_storage_and_schema/02_custom_types_and_rules.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid07-1", name: "Creating a Custom Data Type (UDDT) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid07-2", name: "Solution DDL / Script", type: "SQL", path: "src/01_storage_and_schema/02_custom_types_and_rules.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17526",
    microsoftDocTitle: "CREATE TYPE (Transact-SQL) User-Defined Data Types",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-type-transact-sql"
  },
  {
    id: "ch01-vid08",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID08",
    title: "Clustered Index Architecture & B-Tree Structure",
    duration: "25 mins",
    level: "Intermediate",
    skillsConnected: ["B-Tree Root & Intermediate Levels", "Leaf Page Order", "Clustering Key Selection", "Index Fragmentation"],
    objectives: [
      "Master b-tree root & intermediate levels in SQL Server.",
      "Master leaf page order in SQL Server.",
      "Master clustering key selection in SQL Server.",
      "Complete the practical exercise for Clustered Index Architecture & B-Tree Structure."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Clustered Index Architecture & B-Tree Structure' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Clustered Index Architecture & B-Tree Structure\n-- Video Code: CH01_VID08\nSELECT 'CH01_VID08' AS VideoCode, 'Clustered Index Architecture & B-Tree Structure' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/02_indexing_and_performance/01_clustered_nonclustered.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid08-1", name: "Clustered Index Architecture & B-Tree Structure Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid08-2", name: "Solution DDL / Script", type: "SQL", path: "src/02_indexing_and_performance/01_clustered_nonclustered.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17527",
    microsoftDocTitle: "Clustered and Nonclustered Indexes Described",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described"
  },
  {
    id: "ch01-vid09",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID09",
    title: "Non-Clustered Index & Covering Index Strategy",
    duration: "23 mins",
    level: "Intermediate",
    skillsConnected: ["Non-Clustered B-Trees", "Row Locators (RID vs Clustering Key)", "INCLUDE Columns", "Key Lookups Eliminating"],
    objectives: [
      "Master non-clustered b-trees in SQL Server.",
      "Master row locators (rid vs clustering key) in SQL Server.",
      "Master include columns in SQL Server.",
      "Complete the practical exercise for Non-Clustered Index & Covering Index Strategy."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Non-Clustered Index & Covering Index Strategy' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Non-Clustered Index & Covering Index Strategy\n-- Video Code: CH01_VID09\nSELECT 'CH01_VID09' AS VideoCode, 'Non-Clustered Index & Covering Index Strategy' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/02_indexing_and_performance/01_clustered_nonclustered.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid09-1", name: "Non-Clustered Index & Covering Index Strategy Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid09-2", name: "Solution DDL / Script", type: "SQL", path: "src/02_indexing_and_performance/01_clustered_nonclustered.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17528",
    microsoftDocTitle: "Create Indexes with Included Columns",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/indexes/create-indexes-with-included-columns"
  },
  {
    id: "ch01-vid10",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID10",
    title: "Demo on Index Performance & Execution Plans",
    duration: "26 mins",
    level: "Intermediate",
    skillsConnected: ["Graphical Execution Plans", "Index Seek vs Scan", "Bookmark Lookups", "sys.dm_db_index_physical_stats"],
    objectives: [
      "Master graphical execution plans in SQL Server.",
      "Master index seek vs scan in SQL Server.",
      "Master bookmark lookups in SQL Server.",
      "Complete the practical exercise for Demo on Index Performance & Execution Plans."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Demo on Index Performance & Execution Plans' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Demo on Index Performance & Execution Plans\n-- Video Code: CH01_VID10\nSELECT 'CH01_VID10' AS VideoCode, 'Demo on Index Performance & Execution Plans' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/02_indexing_and_performance/03_execution_plan_analysis.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid10-1", name: "Demo on Index Performance & Execution Plans Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid10-2", name: "Solution DDL / Script", type: "SQL", path: "src/02_indexing_and_performance/03_execution_plan_analysis.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17529",
    microsoftDocTitle: "Display an Actual Execution Plan",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/performance/display-an-actual-execution-plan"
  },
  {
    id: "ch01-vid11",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID11",
    title: "Types of Backup (Full, Differential, Log)",
    duration: "21 mins",
    level: "Intermediate",
    skillsConnected: ["Full Database Backups", "Differential LSN Basing", "Transaction Log Backup Chains", "Recovery Models (Full/Simple/Bulk-Logged)"],
    objectives: [
      "Master full database backups in SQL Server.",
      "Master differential lsn basing in SQL Server.",
      "Master transaction log backup chains in SQL Server.",
      "Complete the practical exercise for Types of Backup (Full, Differential, Log)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Types of Backup (Full, Differential, Log)' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Types of Backup (Full, Differential, Log)\n-- Video Code: CH01_VID11\nSELECT 'CH01_VID11' AS VideoCode, 'Types of Backup (Full, Differential, Log)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid11-1", name: "Types of Backup (Full, Differential, Log) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid11-2", name: "Solution DDL / Script", type: "SQL", path: "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17530",
    microsoftDocTitle: "Backup Overview (SQL Server)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/backup-overview-sql-server"
  },
  {
    id: "ch01-vid12",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID12",
    title: "Backup Database Using Wizard & SSMS Tasks",
    duration: "18 mins",
    level: "Foundational",
    skillsConnected: ["SSMS Backup Dialog", "Media Sets & Backup Families", "Verify Backup Integrity", "Compression Settings"],
    objectives: [
      "Master ssms backup dialog in SQL Server.",
      "Master media sets & backup families in SQL Server.",
      "Master verify backup integrity in SQL Server.",
      "Complete the practical exercise for Backup Database Using Wizard & SSMS Tasks."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Backup Database Using Wizard & SSMS Tasks' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Backup Database Using Wizard & SSMS Tasks\n-- Video Code: CH01_VID12\nSELECT 'CH01_VID12' AS VideoCode, 'Backup Database Using Wizard & SSMS Tasks' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid12-1", name: "Backup Database Using Wizard & SSMS Tasks Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid12-2", name: "Solution DDL / Script", type: "SQL", path: "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17531",
    microsoftDocTitle: "Create a Full Database Backup (SSMS Wizard)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/create-a-full-database-backup"
  },
  {
    id: "ch01-vid13",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID13",
    title: "Backup & SQL Server Agent Jobs Automation",
    duration: "24 mins",
    level: "Intermediate",
    skillsConnected: ["SQL Server Agent", "Scheduled Backup Jobs", "Job Steps & Alerts", "Maintenance Plans"],
    objectives: [
      "Master sql server agent in SQL Server.",
      "Master scheduled backup jobs in SQL Server.",
      "Master job steps & alerts in SQL Server.",
      "Complete the practical exercise for Backup & SQL Server Agent Jobs Automation."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Backup & SQL Server Agent Jobs Automation' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Backup & SQL Server Agent Jobs Automation\n-- Video Code: CH01_VID13\nSELECT 'CH01_VID13' AS VideoCode, 'Backup & SQL Server Agent Jobs Automation' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid13-1", name: "Backup & SQL Server Agent Jobs Automation Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid13-2", name: "Solution DDL / Script", type: "SQL", path: "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17532",
    microsoftDocTitle: "Automate Backup Tasks with SQL Server Agent",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/ssms/agent/create-a-job"
  },
  {
    id: "ch01-vid14",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID14",
    title: "Snapshot DB Architecture & Copy-on-Write",
    duration: "20 mins",
    level: "Intermediate",
    skillsConnected: ["Database Snapshots", "Copy-on-Write Sparse Files", "Read-Only Point-in-Time Views", "Reverting from Snapshots"],
    objectives: [
      "Master database snapshots in SQL Server.",
      "Master copy-on-write sparse files in SQL Server.",
      "Master read-only point-in-time views in SQL Server.",
      "Complete the practical exercise for Snapshot DB Architecture & Copy-on-Write."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Snapshot DB Architecture & Copy-on-Write' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Snapshot DB Architecture & Copy-on-Write\n-- Video Code: CH01_VID14\nSELECT 'CH01_VID14' AS VideoCode, 'Snapshot DB Architecture & Copy-on-Write' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/06_reliability_and_dr/02_snapshot_lifecycle.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid14-1", name: "Snapshot DB Architecture & Copy-on-Write Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid14-2", name: "Solution DDL / Script", type: "SQL", path: "src/06_reliability_and_dr/02_snapshot_lifecycle.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17533",
    microsoftDocTitle: "Database Snapshots (SQL Server)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-snapshots-sql-server"
  },
  {
    id: "ch01-vid15",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID15",
    title: "Demo on Snapshot Creation & Data Recovery",
    duration: "22 mins",
    level: "Intermediate",
    skillsConnected: ["CREATE DATABASE AS SNAPSHOT OF", "Testing Rollbacks", "Accidental Truncation Recovery", "DROP DATABASE SNAPSHOT"],
    objectives: [
      "Master create database as snapshot of in SQL Server.",
      "Master testing rollbacks in SQL Server.",
      "Master accidental truncation recovery in SQL Server.",
      "Complete the practical exercise for Demo on Snapshot Creation & Data Recovery."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Demo on Snapshot Creation & Data Recovery' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Demo on Snapshot Creation & Data Recovery\n-- Video Code: CH01_VID15\nSELECT 'CH01_VID15' AS VideoCode, 'Demo on Snapshot Creation & Data Recovery' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/06_reliability_and_dr/02_snapshot_lifecycle.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid15-1", name: "Demo on Snapshot Creation & Data Recovery Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid15-2", name: "Solution DDL / Script", type: "SQL", path: "src/06_reliability_and_dr/02_snapshot_lifecycle.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17534",
    microsoftDocTitle: "Create a Database Snapshot (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/databases/create-a-database-snapshot-transact-sql"
  },
  {
    id: "ch01-vid16",
    chapter: 1,
    chapterTitle: "Chapter 1: Database Creation and Management",
    videoCode: "CH01_VID16",
    title: "Assignment 01: Storage, Integrity & Physical Schema Design",
    duration: "35 mins",
    level: "Intermediate",
    skillsConnected: ["Enterprise Storage Topology", "Relational Constraints", "Backup & Recovery Verification", "End-to-End Chapter 1 Capstone"],
    objectives: [
      "Master enterprise storage topology in SQL Server.",
      "Master relational constraints in SQL Server.",
      "Master backup & recovery verification in SQL Server.",
      "Complete the practical exercise for Assignment 01: Storage, Integrity & Physical Schema Design."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Assignment 01: Storage, Integrity & Physical Schema Design' as part of Chapter 1: Database Creation and Management. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Assignment 01: Storage, Integrity & Physical Schema Design\n-- Video Code: CH01_VID16\nSELECT 'CH01_VID16' AS VideoCode, 'Assignment 01: Storage, Integrity & Physical Schema Design' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/01_storage_and_schema/05_company_case_study_schema.sql",
    challengeId: "ch-1",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch01-vid16-1", name: "Assignment 01: Storage, Integrity & Physical Schema Design Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch01-vid16-2", name: "Solution DDL / Script", type: "SQL", path: "src/01_storage_and_schema/05_company_case_study_schema.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17535",
    microsoftDocTitle: "Designing and Implementing Tables and Views",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/tables/tables"
  },
  // ==========================================
  // CHAPTER 2: SQL PROGRAMMING ESSENTIALS
  // ==========================================
  {
    id: "ch02-vid01",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID01",
    title: "Variables in T-SQL",
    duration: "17 mins",
    level: "Foundational",
    skillsConnected: ["DECLARE Syntax", "Data Type Assignments", "Scope of Variables", "SET vs SELECT Assignment"],
    objectives: [
      "Master declare syntax in SQL Server.",
      "Master data type assignments in SQL Server.",
      "Master scope of variables in SQL Server.",
      "Complete the practical exercise for Variables in T-SQL."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Variables in T-SQL' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Variables in T-SQL\n-- Video Code: CH02_VID01\nSELECT 'CH02_VID01' AS VideoCode, 'Variables in T-SQL' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid01-1", name: "Variables in T-SQL Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid01-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17537",
    microsoftDocTitle: "DECLARE @local_variable (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/declare-local-variable-transact-sql"
  },
  {
    id: "ch02-vid02",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID02",
    title: "Local Variables & In-Memory State",
    duration: "19 mins",
    level: "Foundational",
    skillsConnected: ["Local Variable Lifetime", "Batch Isolation", "Accumulator Patterns", "Dynamic Filter Injection"],
    objectives: [
      "Master local variable lifetime in SQL Server.",
      "Master batch isolation in SQL Server.",
      "Master accumulator patterns in SQL Server.",
      "Complete the practical exercise for Local Variables & In-Memory State."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Local Variables & In-Memory State' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Local Variables & In-Memory State\n-- Video Code: CH02_VID02\nSELECT 'CH02_VID02' AS VideoCode, 'Local Variables & In-Memory State' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid02-1", name: "Local Variables & In-Memory State Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid02-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17538",
    microsoftDocTitle: "SET @local_variable (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/set-local-variable-transact-sql"
  },
  {
    id: "ch02-vid03",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID03",
    title: "Global Variables (System Configuration & Status)",
    duration: "16 mins",
    level: "Foundational",
    skillsConnected: ["@@ERROR", "@@ROWCOUNT", "@@IDENTITY vs SCOPE_IDENTITY()", "@@SERVERNAME & @@VERSION"],
    objectives: [
      "Master @@error in SQL Server.",
      "Master @@rowcount in SQL Server.",
      "Master @@identity vs scope_identity() in SQL Server.",
      "Complete the practical exercise for Global Variables (System Configuration & Status)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Global Variables (System Configuration & Status)' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Global Variables (System Configuration & Status)\n-- Video Code: CH02_VID03\nSELECT 'CH02_VID03' AS VideoCode, 'Global Variables (System Configuration & Status)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid03-1", name: "Global Variables (System Configuration & Status) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid03-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/03_stored_procedures_etl.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17539",
    microsoftDocTitle: "System Functions (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/functions/system-functions-transact-sql"
  },
  {
    id: "ch02-vid04",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID04",
    title: "Control of Flow (Part 1: IF...ELSE, BEGIN...END)",
    duration: "21 mins",
    level: "Foundational",
    skillsConnected: ["IF...ELSE Branching", "BEGIN...END Blocks", "EXISTS Subqueries in Conditions", "Nested Control Blocks"],
    objectives: [
      "Master if...else branching in SQL Server.",
      "Master begin...end blocks in SQL Server.",
      "Master exists subqueries in conditions in SQL Server.",
      "Complete the practical exercise for Control of Flow (Part 1: IF...ELSE, BEGIN...END)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Control of Flow (Part 1: IF...ELSE, BEGIN...END)' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Control of Flow (Part 1: IF...ELSE, BEGIN...END)\n-- Video Code: CH02_VID04\nSELECT 'CH02_VID04' AS VideoCode, 'Control of Flow (Part 1: IF...ELSE, BEGIN...END)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid04-1", name: "Control of Flow (Part 1: IF...ELSE, BEGIN...END) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid04-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/03_stored_procedures_etl.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17540",
    microsoftDocTitle: "Control-of-Flow Language (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/control-of-flow"
  },
  {
    id: "ch02-vid05",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID05",
    title: "Control of Flow (Part 2: WHILE, BREAK, CONTINUE, RETURN)",
    duration: "22 mins",
    level: "Foundational",
    skillsConnected: ["WHILE Loops", "BREAK & CONTINUE Semantics", "RETURN Early Termination", "Batch Execution Abort"],
    objectives: [
      "Master while loops in SQL Server.",
      "Master break & continue semantics in SQL Server.",
      "Master return early termination in SQL Server.",
      "Complete the practical exercise for Control of Flow (Part 2: WHILE, BREAK, CONTINUE, RETURN)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Control of Flow (Part 2: WHILE, BREAK, CONTINUE, RETURN)' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Control of Flow (Part 2: WHILE, BREAK, CONTINUE, RETURN)\n-- Video Code: CH02_VID05\nSELECT 'CH02_VID05' AS VideoCode, 'Control of Flow (Part 2: WHILE, BREAK, CONTINUE, RETURN)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid05-1", name: "Control of Flow (Part 2: WHILE, BREAK, CONTINUE, RETURN) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid05-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/03_stored_procedures_etl.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17541",
    microsoftDocTitle: "WHILE (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/while-transact-sql"
  },
  {
    id: "ch02-vid06",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID06",
    title: "User-Defined Functions (UDF) Overview",
    duration: "20 mins",
    level: "Intermediate",
    skillsConnected: ["Deterministic vs Non-Deterministic", "Side-Effect Free Execution", "Scalar vs Table-Valued", "Schema Binding"],
    objectives: [
      "Master deterministic vs non-deterministic in SQL Server.",
      "Master side-effect free execution in SQL Server.",
      "Master scalar vs table-valued in SQL Server.",
      "Complete the practical exercise for User-Defined Functions (UDF) Overview."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'User-Defined Functions (UDF) Overview' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: User-Defined Functions (UDF) Overview\n-- Video Code: CH02_VID06\nSELECT 'CH02_VID06' AS VideoCode, 'User-Defined Functions (UDF) Overview' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid06-1", name: "User-Defined Functions (UDF) Overview Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid06-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17542",
    microsoftDocTitle: "User-Defined Functions (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/user-defined-functions"
  },
  {
    id: "ch02-vid07",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID07",
    title: "Scalar Functions & SQL Server 2022 Inlining",
    duration: "23 mins",
    level: "Intermediate",
    skillsConnected: ["CREATE FUNCTION ... RETURNS scalar", "Scalar UDF Inlining (TSQL9)", "Iterative Row Overhead", "CROSS APPLY Alternatives"],
    objectives: [
      "Master create function ... returns scalar in SQL Server.",
      "Master scalar udf inlining (tsql9) in SQL Server.",
      "Master iterative row overhead in SQL Server.",
      "Complete the practical exercise for Scalar Functions & SQL Server 2022 Inlining."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Scalar Functions & SQL Server 2022 Inlining' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Scalar Functions & SQL Server 2022 Inlining\n-- Video Code: CH02_VID07\nSELECT 'CH02_VID07' AS VideoCode, 'Scalar Functions & SQL Server 2022 Inlining' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid07-1", name: "Scalar Functions & SQL Server 2022 Inlining Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid07-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17543",
    microsoftDocTitle: "Scalar UDF Inlining in SQL Server",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/scalar-udf-inlining"
  },
  {
    id: "ch02-vid08",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID08",
    title: "Inline Statement Table-Valued Functions (iTVF)",
    duration: "24 mins",
    level: "Intermediate",
    skillsConnected: ["RETURNS TABLE", "Query Optimizer Macro Expansion", "Parameterized Views", "Index Seeking on Underlying Tables"],
    objectives: [
      "Master returns table in SQL Server.",
      "Master query optimizer macro expansion in SQL Server.",
      "Master parameterized views in SQL Server.",
      "Complete the practical exercise for Inline Statement Table-Valued Functions (iTVF)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Inline Statement Table-Valued Functions (iTVF)' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Inline Statement Table-Valued Functions (iTVF)\n-- Video Code: CH02_VID08\nSELECT 'CH02_VID08' AS VideoCode, 'Inline Statement Table-Valued Functions (iTVF)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid08-1", name: "Inline Statement Table-Valued Functions (iTVF) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid08-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17544",
    microsoftDocTitle: "Create Inline Table-Valued Functions",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/create-user-defined-functions-database-engine"
  },
  {
    id: "ch02-vid09",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID09",
    title: "Multi-Statement Table-Valued Functions (MSTVF)",
    duration: "25 mins",
    level: "Intermediate",
    skillsConnected: ["@TableVariable Returns", "Cardinality Estimation Pitfalls (100 Rows Guess)", "Interleaved Execution", "Performance Comparison to iTVF"],
    objectives: [
      "Master @tablevariable returns in SQL Server.",
      "Master cardinality estimation pitfalls (100 rows guess) in SQL Server.",
      "Master interleaved execution in SQL Server.",
      "Complete the practical exercise for Multi-Statement Table-Valued Functions (MSTVF)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Multi-Statement Table-Valued Functions (MSTVF)' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Multi-Statement Table-Valued Functions (MSTVF)\n-- Video Code: CH02_VID09\nSELECT 'CH02_VID09' AS VideoCode, 'Multi-Statement Table-Valued Functions (MSTVF)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid09-1", name: "Multi-Statement Table-Valued Functions (MSTVF) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid09-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17545",
    microsoftDocTitle: "Multi-Statement Table-Valued Functions",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-function-transact-sql"
  },
  {
    id: "ch02-vid10",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID10",
    title: "System Databases Architecture (master, model, msdb, tempdb)",
    duration: "21 mins",
    level: "Foundational",
    skillsConnected: ["master Configuration", "model Template", "msdb Agent & Backups", "tempdb PAGELATCH Allocation & Tuning"],
    objectives: [
      "Master master configuration in SQL Server.",
      "Master model template in SQL Server.",
      "Master msdb agent & backups in SQL Server.",
      "Complete the practical exercise for System Databases Architecture (master, model, msdb, tempdb)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'System Databases Architecture (master, model, msdb, tempdb)' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: System Databases Architecture (master, model, msdb, tempdb)\n-- Video Code: CH02_VID10\nSELECT 'CH02_VID10' AS VideoCode, 'System Databases Architecture (master, model, msdb, tempdb)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/01_storage_and_schema/01_filegroups_and_files.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid10-1", name: "System Databases Architecture (master, model, msdb, tempdb) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid10-2", name: "Solution DDL / Script", type: "SQL", path: "src/01_storage_and_schema/01_filegroups_and_files.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17546",
    microsoftDocTitle: "System Databases (SQL Server)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/databases/system-databases"
  },
  {
    id: "ch02-vid11",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID11",
    title: "Types of Tables (Permanent, #Temp, ##Global, @TableVar)",
    duration: "22 mins",
    level: "Intermediate",
    skillsConnected: ["Local Temp Tables (#table)", "Global Temp Tables (##table)", "Table Variables (@table)", "Memory-Optimized Tables"],
    objectives: [
      "Master local temp tables (#table) in SQL Server.",
      "Master global temp tables (##table) in SQL Server.",
      "Master table variables (@table) in SQL Server.",
      "Complete the practical exercise for Types of Tables (Permanent, #Temp, ##Global, @TableVar)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Types of Tables (Permanent, #Temp, ##Global, @TableVar)' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Types of Tables (Permanent, #Temp, ##Global, @TableVar)\n-- Video Code: CH02_VID11\nSELECT 'CH02_VID11' AS VideoCode, 'Types of Tables (Permanent, #Temp, ##Global, @TableVar)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid11-1", name: "Types of Tables (Permanent, #Temp, ##Global, @TableVar) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid11-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17547",
    microsoftDocTitle: "Temporary Tables and Table Variables",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql"
  },
  {
    id: "ch02-vid12",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID12",
    title: "Scripts & Batches (GO Separator & Execution Scope)",
    duration: "18 mins",
    level: "Foundational",
    skillsConnected: ["GO Utility Command", "Batch Compilation Boundaries", "DDL in Batches", "Dynamic SQL EXEC() Isolation"],
    objectives: [
      "Master go utility command in SQL Server.",
      "Master batch compilation boundaries in SQL Server.",
      "Master ddl in batches in SQL Server.",
      "Complete the practical exercise for Scripts & Batches (GO Separator & Execution Scope)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Scripts & Batches (GO Separator & Execution Scope)' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Scripts & Batches (GO Separator & Execution Scope)\n-- Video Code: CH02_VID12\nSELECT 'CH02_VID12' AS VideoCode, 'Scripts & Batches (GO Separator & Execution Scope)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/04_governance_and_audit/03_dynamic_sql_guardrails.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid12-1", name: "Scripts & Batches (GO Separator & Execution Scope) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid12-2", name: "Solution DDL / Script", type: "SQL", path: "src/04_governance_and_audit/03_dynamic_sql_guardrails.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17548",
    microsoftDocTitle: "SQL Server Utilities Statements - GO",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/sql-server-utilities-statements-go"
  },
  {
    id: "ch02-vid13",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID13",
    title: "Types of Transactions & ACID Boundaries",
    duration: "24 mins",
    level: "Intermediate",
    skillsConnected: ["Autocommit Transactions", "Explicit Transactions (BEGIN TRAN)", "Implicit Transactions", "Atomicity & Durability in WAL"],
    objectives: [
      "Master autocommit transactions in SQL Server.",
      "Master explicit transactions (begin tran) in SQL Server.",
      "Master implicit transactions in SQL Server.",
      "Complete the practical exercise for Types of Transactions & ACID Boundaries."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Types of Transactions & ACID Boundaries' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Types of Transactions & ACID Boundaries\n-- Video Code: CH02_VID13\nSELECT 'CH02_VID13' AS VideoCode, 'Types of Transactions & ACID Boundaries' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid13-1", name: "Types of Transactions & ACID Boundaries Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid13-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/03_stored_procedures_etl.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17549",
    microsoftDocTitle: "Transaction Statements (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/transactions-transact-sql"
  },
  {
    id: "ch02-vid14",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID14",
    title: "Demo on Transactions, COMMIT, ROLLBACK & SAVEPOINT",
    duration: "25 mins",
    level: "Intermediate",
    skillsConnected: ["COMMIT TRANSACTION", "ROLLBACK TRANSACTION", "SAVE TRANSACTION savepoint", "XACT_ABORT ON & TRY...CATCH"],
    objectives: [
      "Master commit transaction in SQL Server.",
      "Master rollback transaction in SQL Server.",
      "Master save transaction savepoint in SQL Server.",
      "Complete the practical exercise for Demo on Transactions, COMMIT, ROLLBACK & SAVEPOINT."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Demo on Transactions, COMMIT, ROLLBACK & SAVEPOINT' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Demo on Transactions, COMMIT, ROLLBACK & SAVEPOINT\n-- Video Code: CH02_VID14\nSELECT 'CH02_VID14' AS VideoCode, 'Demo on Transactions, COMMIT, ROLLBACK & SAVEPOINT' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid14-1", name: "Demo on Transactions, COMMIT, ROLLBACK & SAVEPOINT Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid14-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/03_stored_procedures_etl.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17550",
    microsoftDocTitle: "SAVE TRANSACTION (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/save-transaction-transact-sql"
  },
  {
    id: "ch02-vid15",
    chapter: 2,
    chapterTitle: "Chapter 2: SQL Programming Essentials",
    videoCode: "CH02_VID15",
    title: "Assignment 02: Functions, Transactions & Flow Control",
    duration: "35 mins",
    level: "Intermediate",
    skillsConnected: ["UDF Performance Optimization", "Transaction Error Handling", "Complex Procedural Logic", "End-to-End Chapter 2 Capstone"],
    objectives: [
      "Master udf performance optimization in SQL Server.",
      "Master transaction error handling in SQL Server.",
      "Master complex procedural logic in SQL Server.",
      "Complete the practical exercise for Assignment 02: Functions, Transactions & Flow Control."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Assignment 02: Functions, Transactions & Flow Control' as part of Chapter 2: SQL Programming Essentials. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Assignment 02: Functions, Transactions & Flow Control\n-- Video Code: CH02_VID15\nSELECT 'CH02_VID15' AS VideoCode, 'Assignment 02: Functions, Transactions & Flow Control' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
    challengeId: "ch-2",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch02-vid15-1", name: "Assignment 02: Functions, Transactions & Flow Control Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch02-vid15-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17551",
    microsoftDocTitle: "Transactions and Concurrency Architecture",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide"
  },
  // ==========================================
  // CHAPTER 3: ADVANCED QUERY TECHNIQUES AND HIGH AVAILABILITY
  // ==========================================
  {
    id: "ch03-vid01",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID01",
    title: "Overview of Views & Logical Data Abstraction",
    duration: "18 mins",
    level: "Foundational",
    skillsConnected: ["Virtual Tables", "Security Encapsulation", "Simplifying Complex Queries", "View Definition Metadata"],
    objectives: [
      "Master virtual tables in SQL Server.",
      "Master security encapsulation in SQL Server.",
      "Master simplifying complex queries in SQL Server.",
      "Complete the practical exercise for Overview of Views & Logical Data Abstraction."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Overview of Views & Logical Data Abstraction' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Overview of Views & Logical Data Abstraction\n-- Video Code: CH03_VID01\nSELECT 'CH03_VID01' AS VideoCode, 'Overview of Views & Logical Data Abstraction' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/02_indexing_and_performance/02_indexed_views.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid01-1", name: "Overview of Views & Logical Data Abstraction Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid01-2", name: "Solution DDL / Script", type: "SQL", path: "src/02_indexing_and_performance/02_indexed_views.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17553",
    microsoftDocTitle: "Views (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/views/views"
  },
  {
    id: "ch03-vid02",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID02",
    title: "Types of Views (Standard, Partitioned, System)",
    duration: "19 mins",
    level: "Intermediate",
    skillsConnected: ["Standard User Views", "Partitioned Views across Instances", "System Catalog Views", "Dynamic Management Views (DMVs)"],
    objectives: [
      "Master standard user views in SQL Server.",
      "Master partitioned views across instances in SQL Server.",
      "Master system catalog views in SQL Server.",
      "Complete the practical exercise for Types of Views (Standard, Partitioned, System)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Types of Views (Standard, Partitioned, System)' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Types of Views (Standard, Partitioned, System)\n-- Video Code: CH03_VID02\nSELECT 'CH03_VID02' AS VideoCode, 'Types of Views (Standard, Partitioned, System)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/02_indexing_and_performance/02_indexed_views.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid02-1", name: "Types of Views (Standard, Partitioned, System) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid02-2", name: "Solution DDL / Script", type: "SQL", path: "src/02_indexing_and_performance/02_indexed_views.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17554",
    microsoftDocTitle: "Types of Views in SQL Server",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/views/create-views"
  },
  {
    id: "ch03-vid03",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID03",
    title: "Creating and Using Views (WITH SCHEMABINDING & ENCRYPTION)",
    duration: "22 mins",
    level: "Intermediate",
    skillsConnected: ["CREATE VIEW", "WITH SCHEMABINDING", "WITH ENCRYPTION", "WITH CHECK OPTION"],
    objectives: [
      "Master create view in SQL Server.",
      "Master with schemabinding in SQL Server.",
      "Master with encryption in SQL Server.",
      "Complete the practical exercise for Creating and Using Views (WITH SCHEMABINDING & ENCRYPTION)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Creating and Using Views (WITH SCHEMABINDING & ENCRYPTION)' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Creating and Using Views (WITH SCHEMABINDING & ENCRYPTION)\n-- Video Code: CH03_VID03\nSELECT 'CH03_VID03' AS VideoCode, 'Creating and Using Views (WITH SCHEMABINDING & ENCRYPTION)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/02_indexing_and_performance/02_indexed_views.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid03-1", name: "Creating and Using Views (WITH SCHEMABINDING & ENCRYPTION) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid03-2", name: "Solution DDL / Script", type: "SQL", path: "src/02_indexing_and_performance/02_indexed_views.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17555",
    microsoftDocTitle: "CREATE VIEW (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-view-transact-sql"
  },
  {
    id: "ch03-vid04",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID04",
    title: "DML Operations on Views (INSERT, UPDATE, DELETE Rules)",
    duration: "20 mins",
    level: "Intermediate",
    skillsConnected: ["Single Base Table Updatability", "INSTEAD OF Trigger Resolution", "CHECK OPTION Enforcement", "Calculated Column Restrictions"],
    objectives: [
      "Master single base table updatability in SQL Server.",
      "Master instead of trigger resolution in SQL Server.",
      "Master check option enforcement in SQL Server.",
      "Complete the practical exercise for DML Operations on Views (INSERT, UPDATE, DELETE Rules)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'DML Operations on Views (INSERT, UPDATE, DELETE Rules)' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: DML Operations on Views (INSERT, UPDATE, DELETE Rules)\n-- Video Code: CH03_VID04\nSELECT 'CH03_VID04' AS VideoCode, 'DML Operations on Views (INSERT, UPDATE, DELETE Rules)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/02_indexing_and_performance/02_indexed_views.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid04-1", name: "DML Operations on Views (INSERT, UPDATE, DELETE Rules) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid04-2", name: "Solution DDL / Script", type: "SQL", path: "src/02_indexing_and_performance/02_indexed_views.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17556",
    microsoftDocTitle: "Modify Data Through a View",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/views/modify-data-through-a-view"
  },
  {
    id: "ch03-vid05",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID05",
    title: "Indexed Views & Materialized Aggregations",
    duration: "27 mins",
    level: "Advanced",
    skillsConnected: ["CREATE UNIQUE CLUSTERED INDEX ON VIEW", "Materialized Storage", "NOEXPAND Query Hint", "Pre-aggregated BI Performance"],
    objectives: [
      "Master create unique clustered index on view in SQL Server.",
      "Master materialized storage in SQL Server.",
      "Master noexpand query hint in SQL Server.",
      "Complete the practical exercise for Indexed Views & Materialized Aggregations."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Indexed Views & Materialized Aggregations' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Indexed Views & Materialized Aggregations\n-- Video Code: CH03_VID05\nSELECT 'CH03_VID05' AS VideoCode, 'Indexed Views & Materialized Aggregations' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/02_indexing_and_performance/02_indexed_views.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid05-1", name: "Indexed Views & Materialized Aggregations Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid05-2", name: "Solution DDL / Script", type: "SQL", path: "src/02_indexing_and_performance/02_indexed_views.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17557",
    microsoftDocTitle: "Create Indexed Views",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/views/create-indexed-views"
  },
  {
    id: "ch03-vid06",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID06",
    title: "Partitioning (Horizontal Range Schemes & Sliding Windows)",
    duration: "28 mins",
    level: "Advanced",
    skillsConnected: ["CREATE PARTITION FUNCTION", "CREATE PARTITION SCHEME", "Sliding Window Maintenance", "Zero-IO ALTER TABLE SWITCH"],
    objectives: [
      "Master create partition function in SQL Server.",
      "Master create partition scheme in SQL Server.",
      "Master sliding window maintenance in SQL Server.",
      "Complete the practical exercise for Partitioning (Horizontal Range Schemes & Sliding Windows)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Partitioning (Horizontal Range Schemes & Sliding Windows)' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Partitioning (Horizontal Range Schemes & Sliding Windows)\n-- Video Code: CH03_VID06\nSELECT 'CH03_VID06' AS VideoCode, 'Partitioning (Horizontal Range Schemes & Sliding Windows)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/01_storage_and_schema/04_partitioning_scheme.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid06-1", name: "Partitioning (Horizontal Range Schemes & Sliding Windows) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid06-2", name: "Solution DDL / Script", type: "SQL", path: "src/01_storage_and_schema/04_partitioning_scheme.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17558",
    microsoftDocTitle: "Partitioned Tables and Indexes",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/partitions/partitioned-tables-and-indexes"
  },
  {
    id: "ch03-vid07",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID07",
    title: "Harnessing the Power of XML in SQL Server",
    duration: "21 mins",
    level: "Intermediate",
    skillsConnected: ["XML Data Type", "XML Indexes (Primary & Secondary)", "Well-Formed XML Documents", "XML Schema Collections (XSD)"],
    objectives: [
      "Master xml data type in SQL Server.",
      "Master xml indexes (primary & secondary) in SQL Server.",
      "Master well-formed xml documents in SQL Server.",
      "Complete the practical exercise for Harnessing the Power of XML in SQL Server."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Harnessing the Power of XML in SQL Server' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Harnessing the Power of XML in SQL Server\n-- Video Code: CH03_VID07\nSELECT 'CH03_VID07' AS VideoCode, 'Harnessing the Power of XML in SQL Server' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid07-1", name: "Harnessing the Power of XML in SQL Server Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid07-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17559",
    microsoftDocTitle: "XML Data (SQL Server)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/xml/xml-data-sql-server"
  },
  {
    id: "ch03-vid08",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID08",
    title: "Use RAW and AUTO Mode with FOR XML",
    duration: "20 mins",
    level: "Intermediate",
    skillsConnected: ["FOR XML RAW", "FOR XML AUTO", "ELEMENTS Directive", "Root Wrapper Tag Generation"],
    objectives: [
      "Master for xml raw in SQL Server.",
      "Master for xml auto in SQL Server.",
      "Master elements directive in SQL Server.",
      "Complete the practical exercise for Use RAW and AUTO Mode with FOR XML."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Use RAW and AUTO Mode with FOR XML' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Use RAW and AUTO Mode with FOR XML\n-- Video Code: CH03_VID08\nSELECT 'CH03_VID08' AS VideoCode, 'Use RAW and AUTO Mode with FOR XML' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid08-1", name: "Use RAW and AUTO Mode with FOR XML Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid08-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17560",
    microsoftDocTitle: "Use RAW Mode with FOR XML",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/xml/use-raw-mode-with-for-xml"
  },
  {
    id: "ch03-vid09",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID09",
    title: "Use PATH Mode with FOR XML",
    duration: "22 mins",
    level: "Intermediate",
    skillsConnected: ["FOR XML PATH", "Column Aliasing XPath Mappings", "Nested Sub-elements", "String Concatenation Tricks (Pre-STRING_AGG)"],
    objectives: [
      "Master for xml path in SQL Server.",
      "Master column aliasing xpath mappings in SQL Server.",
      "Master nested sub-elements in SQL Server.",
      "Complete the practical exercise for Use PATH Mode with FOR XML."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Use PATH Mode with FOR XML' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Use PATH Mode with FOR XML\n-- Video Code: CH03_VID09\nSELECT 'CH03_VID09' AS VideoCode, 'Use PATH Mode with FOR XML' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid09-1", name: "Use PATH Mode with FOR XML Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid09-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17561",
    microsoftDocTitle: "Use PATH Mode with FOR XML",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/xml/use-path-mode-with-for-xml"
  },
  {
    id: "ch03-vid10",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID10",
    title: "Querying XML Data (XQuery methods: value, query, exist, nodes)",
    duration: "26 mins",
    level: "Advanced",
    skillsConnected: [".nodes() Shredding", ".value() Strong Typing", ".exist() XPath Filtering", ".modify() DML Modifications"],
    objectives: [
      "Master .nodes() shredding in SQL Server.",
      "Master .value() strong typing in SQL Server.",
      "Master .exist() xpath filtering in SQL Server.",
      "Complete the practical exercise for Querying XML Data (XQuery methods: value, query, exist, nodes)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Querying XML Data (XQuery methods: value, query, exist, nodes)' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Querying XML Data (XQuery methods: value, query, exist, nodes)\n-- Video Code: CH03_VID10\nSELECT 'CH03_VID10' AS VideoCode, 'Querying XML Data (XQuery methods: value, query, exist, nodes)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid10-1", name: "Querying XML Data (XQuery methods: value, query, exist, nodes) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid10-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17562",
    microsoftDocTitle: "xml Data Type Methods",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/xml/xml-data-type-methods"
  },
  {
    id: "ch03-vid11",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID11",
    title: "Hierarchical Data (Self-Referencing Relationships & HierarchyID)",
    duration: "24 mins",
    level: "Intermediate",
    skillsConnected: ["Recursive Self-Joins", "Adjacency List Modeling", "hierarchyid Data Type", "GetAncestor & GetDescendant Methods"],
    objectives: [
      "Master recursive self-joins in SQL Server.",
      "Master adjacency list modeling in SQL Server.",
      "Master hierarchyid data type in SQL Server.",
      "Complete the practical exercise for Hierarchical Data (Self-Referencing Relationships & HierarchyID)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Hierarchical Data (Self-Referencing Relationships & HierarchyID)' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Hierarchical Data (Self-Referencing Relationships & HierarchyID)\n-- Video Code: CH03_VID11\nSELECT 'CH03_VID11' AS VideoCode, 'Hierarchical Data (Self-Referencing Relationships & HierarchyID)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid11-1", name: "Hierarchical Data (Self-Referencing Relationships & HierarchyID) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid11-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17563",
    microsoftDocTitle: "Hierarchical Data (SQL Server)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/hierarchical-data-sql-server"
  },
  {
    id: "ch03-vid12",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID12",
    title: "CTE: Common Table Expression (Standard & Recursive)",
    duration: "25 mins",
    level: "Intermediate",
    skillsConnected: ["WITH cte AS (...) Syntax", "Anchor Member", "Recursive Member", "MAXRECURSION Hint Prevention"],
    objectives: [
      "Master with cte as (...) syntax in SQL Server.",
      "Master anchor member in SQL Server.",
      "Master recursive member in SQL Server.",
      "Complete the practical exercise for CTE: Common Table Expression (Standard & Recursive)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'CTE: Common Table Expression (Standard & Recursive)' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: CTE: Common Table Expression (Standard & Recursive)\n-- Video Code: CH03_VID12\nSELECT 'CH03_VID12' AS VideoCode, 'CTE: Common Table Expression (Standard & Recursive)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid12-1", name: "CTE: Common Table Expression (Standard & Recursive) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid12-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17564",
    microsoftDocTitle: "WITH common_table_expression (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/queries/with-common-table-expression-transact-sql"
  },
  {
    id: "ch03-vid13",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID13",
    title: "OFFSET and FETCH Keyword (Deterministic Pagination)",
    duration: "18 mins",
    level: "Foundational",
    skillsConnected: ["OFFSET n ROWS", "FETCH NEXT n ROWS ONLY", "ORDER BY Determinism", "Eliminating ROW_NUMBER() Subqueries"],
    objectives: [
      "Master offset n rows in SQL Server.",
      "Master fetch next n rows only in SQL Server.",
      "Master order by determinism in SQL Server.",
      "Complete the practical exercise for OFFSET and FETCH Keyword (Deterministic Pagination)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'OFFSET and FETCH Keyword (Deterministic Pagination)' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: OFFSET and FETCH Keyword (Deterministic Pagination)\n-- Video Code: CH03_VID13\nSELECT 'CH03_VID13' AS VideoCode, 'OFFSET and FETCH Keyword (Deterministic Pagination)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid13-1", name: "OFFSET and FETCH Keyword (Deterministic Pagination) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid13-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17565",
    microsoftDocTitle: "ORDER BY Clause (Transact-SQL) - OFFSET FETCH",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/queries/select-order-by-clause-transact-sql"
  },
  {
    id: "ch03-vid14",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID14",
    title: "Sequence Objects vs IDENTITY Columns",
    duration: "19 mins",
    level: "Intermediate",
    skillsConnected: ["CREATE SEQUENCE", "NEXT VALUE FOR", "Cycling & Cache Optimization", "Sharing Sequences Across Multiple Tables"],
    objectives: [
      "Master create sequence in SQL Server.",
      "Master next value for in SQL Server.",
      "Master cycling & cache optimization in SQL Server.",
      "Complete the practical exercise for Sequence Objects vs IDENTITY Columns."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Sequence Objects vs IDENTITY Columns' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Sequence Objects vs IDENTITY Columns\n-- Video Code: CH03_VID14\nSELECT 'CH03_VID14' AS VideoCode, 'Sequence Objects vs IDENTITY Columns' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/01_storage_and_schema/05_company_case_study_schema.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid14-1", name: "Sequence Objects vs IDENTITY Columns Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid14-2", name: "Solution DDL / Script", type: "SQL", path: "src/01_storage_and_schema/05_company_case_study_schema.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17566",
    microsoftDocTitle: "Sequence Numbers",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/sequence-numbers/sequence-numbers"
  },
  {
    id: "ch03-vid15",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID15",
    title: "Table Valued Parameters (TVPs) & High-Throughput Bulk Ingest",
    duration: "26 mins",
    level: "Advanced",
    skillsConnected: ["CREATE TYPE ... AS TABLE", "READONLY Parameter Modifier", "Multi-Row Streaming to Stored Procedures", "Zero Round-Trip Ingestion"],
    objectives: [
      "Master create type ... as table in SQL Server.",
      "Master readonly parameter modifier in SQL Server.",
      "Master multi-row streaming to stored procedures in SQL Server.",
      "Complete the practical exercise for Table Valued Parameters (TVPs) & High-Throughput Bulk Ingest."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Table Valued Parameters (TVPs) & High-Throughput Bulk Ingest' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Table Valued Parameters (TVPs) & High-Throughput Bulk Ingest\n-- Video Code: CH03_VID15\nSELECT 'CH03_VID15' AS VideoCode, 'Table Valued Parameters (TVPs) & High-Throughput Bulk Ingest' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid15-1", name: "Table Valued Parameters (TVPs) & High-Throughput Bulk Ingest Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid15-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17567",
    microsoftDocTitle: "Use Table-Valued Parameters (Database Engine)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/tables/use-table-valued-parameters-database-engine"
  },
  {
    id: "ch03-vid16",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID16",
    title: "High Availability Concepts (RPO, RTO & Disaster Recovery)",
    duration: "22 mins",
    level: "Intermediate",
    skillsConnected: ["Recovery Point Objective (RPO)", "Recovery Time Objective (RTO)", "High Availability Architectures", "Disaster Recovery Runbooks"],
    objectives: [
      "Master recovery point objective (rpo) in SQL Server.",
      "Master recovery time objective (rto) in SQL Server.",
      "Master high availability architectures in SQL Server.",
      "Complete the practical exercise for High Availability Concepts (RPO, RTO & Disaster Recovery)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'High Availability Concepts (RPO, RTO & Disaster Recovery)' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: High Availability Concepts (RPO, RTO & Disaster Recovery)\n-- Video Code: CH03_VID16\nSELECT 'CH03_VID16' AS VideoCode, 'High Availability Concepts (RPO, RTO & Disaster Recovery)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid16-1", name: "High Availability Concepts (RPO, RTO & Disaster Recovery) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid16-2", name: "Solution DDL / Script", type: "SQL", path: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17568",
    microsoftDocTitle: "High Availability and Disaster Recovery (SQL Server)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server"
  },
  {
    id: "ch03-vid17",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID17",
    title: "Set Up SQL Server Instances for Replication & HA",
    duration: "23 mins",
    level: "Intermediate",
    skillsConnected: ["Named Instances", "SQL Server Browser Service", "Shared Network Directories", "Endpoints & Service Accounts"],
    objectives: [
      "Master named instances in SQL Server.",
      "Master sql server browser service in SQL Server.",
      "Master shared network directories in SQL Server.",
      "Complete the practical exercise for Set Up SQL Server Instances for Replication & HA."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Set Up SQL Server Instances for Replication & HA' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Set Up SQL Server Instances for Replication & HA\n-- Video Code: CH03_VID17\nSELECT 'CH03_VID17' AS VideoCode, 'Set Up SQL Server Instances for Replication & HA' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid17-1", name: "Set Up SQL Server Instances for Replication & HA Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid17-2", name: "Solution DDL / Script", type: "SQL", path: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17569",
    microsoftDocTitle: "Configure SQL Server Instances",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/database-engine-instances"
  },
  {
    id: "ch03-vid18",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID18",
    title: "Database Mirroring Architecture & Operating Modes",
    duration: "24 mins",
    level: "Intermediate",
    skillsConnected: ["Principal & Mirror Roles", "High Safety (Synchronous) Mode", "High Performance (Asynchronous) Mode", "Witness Automatic Failover"],
    objectives: [
      "Master principal & mirror roles in SQL Server.",
      "Master high safety (synchronous) mode in SQL Server.",
      "Master high performance (asynchronous) mode in SQL Server.",
      "Complete the practical exercise for Database Mirroring Architecture & Operating Modes."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Database Mirroring Architecture & Operating Modes' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Database Mirroring Architecture & Operating Modes\n-- Video Code: CH03_VID18\nSELECT 'CH03_VID18' AS VideoCode, 'Database Mirroring Architecture & Operating Modes' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid18-1", name: "Database Mirroring Architecture & Operating Modes Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid18-2", name: "Solution DDL / Script", type: "SQL", path: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17571",
    microsoftDocTitle: "Database Mirroring (SQL Server)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/database-engine/database-mirroring/database-mirroring-sql-server"
  },
  {
    id: "ch03-vid19",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID19",
    title: "Demo Database Mirroring Setup & Failover Drill",
    duration: "26 mins",
    level: "Advanced",
    skillsConnected: ["TCP Endpoints Configuration", "ALTER DATABASE SET PARTNER", "Manual Failover Drill", "Mirror Monitoring Jobs"],
    objectives: [
      "Master tcp endpoints configuration in SQL Server.",
      "Master alter database set partner in SQL Server.",
      "Master manual failover drill in SQL Server.",
      "Complete the practical exercise for Demo Database Mirroring Setup & Failover Drill."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Demo Database Mirroring Setup & Failover Drill' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Demo Database Mirroring Setup & Failover Drill\n-- Video Code: CH03_VID19\nSELECT 'CH03_VID19' AS VideoCode, 'Demo Database Mirroring Setup & Failover Drill' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid19-1", name: "Demo Database Mirroring Setup & Failover Drill Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid19-2", name: "Solution DDL / Script", type: "SQL", path: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17572",
    microsoftDocTitle: "Setting Up Database Mirroring",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/database-engine/database-mirroring/setting-up-database-mirroring-sql-server"
  },
  {
    id: "ch03-vid20",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID20",
    title: "Overview of Shipping Transaction Logs",
    duration: "21 mins",
    level: "Intermediate",
    skillsConnected: ["Log Shipping Architecture", "Backup Job, Copy Job, Restore Job", "Monitor Server & Alerts", "Standby vs NoRecovery Mode"],
    objectives: [
      "Master log shipping architecture in SQL Server.",
      "Master backup job, copy job, restore job in SQL Server.",
      "Master monitor server & alerts in SQL Server.",
      "Complete the practical exercise for Overview of Shipping Transaction Logs."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Overview of Shipping Transaction Logs' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Overview of Shipping Transaction Logs\n-- Video Code: CH03_VID20\nSELECT 'CH03_VID20' AS VideoCode, 'Overview of Shipping Transaction Logs' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid20-1", name: "Overview of Shipping Transaction Logs Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid20-2", name: "Solution DDL / Script", type: "SQL", path: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17573",
    microsoftDocTitle: "About Log Shipping (SQL Server)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/database-engine/log-shipping/about-log-shipping-sql-server"
  },
  {
    id: "ch03-vid21",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID21",
    title: "Steps to Configure SQL Server Log Shipping",
    duration: "25 mins",
    level: "Intermediate",
    skillsConnected: ["Network Share Permissions", "Transaction Log Schedules", "Secondary Standby Queries", "Automated Retention Purges"],
    objectives: [
      "Master network share permissions in SQL Server.",
      "Master transaction log schedules in SQL Server.",
      "Master secondary standby queries in SQL Server.",
      "Complete the practical exercise for Steps to Configure SQL Server Log Shipping."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Steps to Configure SQL Server Log Shipping' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Steps to Configure SQL Server Log Shipping\n-- Video Code: CH03_VID21\nSELECT 'CH03_VID21' AS VideoCode, 'Steps to Configure SQL Server Log Shipping' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid21-1", name: "Steps to Configure SQL Server Log Shipping Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid21-2", name: "Solution DDL / Script", type: "SQL", path: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17574",
    microsoftDocTitle: "Configure Log Shipping (SQL Server)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/database-engine/log-shipping/configure-log-shipping-sql-server"
  },
  {
    id: "ch03-vid22",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID22",
    title: "Log Shipping vs Mirroring vs Always On Comparison",
    duration: "22 mins",
    level: "Intermediate",
    skillsConnected: ["SLA & RPO/RTO Matrix", "Multi-Database Support", "Licensing Costs", "Modern Always On Migration Path"],
    objectives: [
      "Master sla & rpo/rto matrix in SQL Server.",
      "Master multi-database support in SQL Server.",
      "Master licensing costs in SQL Server.",
      "Complete the practical exercise for Log Shipping vs Mirroring vs Always On Comparison."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Log Shipping vs Mirroring vs Always On Comparison' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Log Shipping vs Mirroring vs Always On Comparison\n-- Video Code: CH03_VID22\nSELECT 'CH03_VID22' AS VideoCode, 'Log Shipping vs Mirroring vs Always On Comparison' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid22-1", name: "Log Shipping vs Mirroring vs Always On Comparison Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid22-2", name: "Solution DDL / Script", type: "SQL", path: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17575",
    microsoftDocTitle: "High Availability Solutions (SQL Server)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/sql-server/failover-clusters/high-availability-solutions-sql-server"
  },
  {
    id: "ch03-vid23",
    chapter: 3,
    chapterTitle: "Chapter 3: Advanced Query Techniques and High Availability",
    videoCode: "CH03_VID23",
    title: "Assignment 03: Scalability, Ingestion & High Availability",
    duration: "35 mins",
    level: "Advanced",
    skillsConnected: ["Sliding Window Partition Switching", "XML Ingestion Pipeline", "Log Shipping Resilience", "End-to-End Chapter 3 Capstone"],
    objectives: [
      "Master sliding window partition switching in SQL Server.",
      "Master xml ingestion pipeline in SQL Server.",
      "Master log shipping resilience in SQL Server.",
      "Complete the practical exercise for Assignment 03: Scalability, Ingestion & High Availability."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Assignment 03: Scalability, Ingestion & High Availability' as part of Chapter 3: Advanced Query Techniques and High Availability. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Assignment 03: Scalability, Ingestion & High Availability\n-- Video Code: CH03_VID23\nSELECT 'CH03_VID23' AS VideoCode, 'Assignment 03: Scalability, Ingestion & High Availability' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/01_storage_and_schema/04_partitioning_scheme.sql",
    challengeId: "ch-3",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch03-vid23-1", name: "Assignment 03: Scalability, Ingestion & High Availability Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch03-vid23-2", name: "Solution DDL / Script", type: "SQL", path: "src/01_storage_and_schema/04_partitioning_scheme.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17576",
    microsoftDocTitle: "Scalability and Partitioning Guide",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/partitions/partitioned-tables-and-indexes"
  },
  // ==========================================
  // CHAPTER 4: PROCEDURES, TRIGGERS, AND SQL AUTOMATION
  // ==========================================
  {
    id: "ch04-vid01",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID01",
    title: "Overview of Stored Procedures",
    duration: "19 mins",
    level: "Foundational",
    skillsConnected: ["Procedural Modularity", "Compiled Execution Plans", "Security Abstraction", "Network Traffic Reduction"],
    objectives: [
      "Master procedural modularity in SQL Server.",
      "Master compiled execution plans in SQL Server.",
      "Master security abstraction in SQL Server.",
      "Complete the practical exercise for Overview of Stored Procedures."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Overview of Stored Procedures' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Overview of Stored Procedures\n-- Video Code: CH04_VID01\nSELECT 'CH04_VID01' AS VideoCode, 'Overview of Stored Procedures' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid01-1", name: "Overview of Stored Procedures Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid01-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/03_stored_procedures_etl.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17577",
    microsoftDocTitle: "Stored Procedures (Database Engine)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/stored-procedures-database-engine"
  },
  {
    id: "ch04-vid02",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID02",
    title: "Advantages of Stored Procedures (Performance & Security)",
    duration: "20 mins",
    level: "Intermediate",
    skillsConnected: ["Plan Reuse & Cache", "SQL Injection Prevention", "Granular EXECUTE Permissions", "Maintainability"],
    objectives: [
      "Master plan reuse & cache in SQL Server.",
      "Master sql injection prevention in SQL Server.",
      "Master granular execute permissions in SQL Server.",
      "Complete the practical exercise for Advantages of Stored Procedures (Performance & Security)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Advantages of Stored Procedures (Performance & Security)' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Advantages of Stored Procedures (Performance & Security)\n-- Video Code: CH04_VID02\nSELECT 'CH04_VID02' AS VideoCode, 'Advantages of Stored Procedures (Performance & Security)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid02-1", name: "Advantages of Stored Procedures (Performance & Security) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid02-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/03_stored_procedures_etl.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17579",
    microsoftDocTitle: "Stored Procedures Security and Advantages",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/create-a-stored-procedure"
  },
  {
    id: "ch04-vid03",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID03",
    title: "Demo on Creating & Executing Stored Procedures",
    duration: "22 mins",
    level: "Intermediate",
    skillsConnected: ["CREATE PROCEDURE", "EXEC Statement", "Modifying Existing Procs", "Viewing Sys.procedures Metadata"],
    objectives: [
      "Master create procedure in SQL Server.",
      "Master exec statement in SQL Server.",
      "Master modifying existing procs in SQL Server.",
      "Complete the practical exercise for Demo on Creating & Executing Stored Procedures."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Demo on Creating & Executing Stored Procedures' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Demo on Creating & Executing Stored Procedures\n-- Video Code: CH04_VID03\nSELECT 'CH04_VID03' AS VideoCode, 'Demo on Creating & Executing Stored Procedures' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid03-1", name: "Demo on Creating & Executing Stored Procedures Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid03-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/03_stored_procedures_etl.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17580",
    microsoftDocTitle: "Execute a Stored Procedure",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/execute-a-stored-procedure"
  },
  {
    id: "ch04-vid04",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID04",
    title: "DML Statements in Stored Procedures",
    duration: "21 mins",
    level: "Intermediate",
    skillsConnected: ["Transactional Multi-Table Inserts", "Conditional Updates", "Soft-Delete Logic", "Merge Semantics"],
    objectives: [
      "Master transactional multi-table inserts in SQL Server.",
      "Master conditional updates in SQL Server.",
      "Master soft-delete logic in SQL Server.",
      "Complete the practical exercise for DML Statements in Stored Procedures."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'DML Statements in Stored Procedures' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: DML Statements in Stored Procedures\n-- Video Code: CH04_VID04\nSELECT 'CH04_VID04' AS VideoCode, 'DML Statements in Stored Procedures' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid04-1", name: "DML Statements in Stored Procedures Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid04-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/03_stored_procedures_etl.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17581",
    microsoftDocTitle: "Modify Data through Stored Procedures",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/modify-a-stored-procedure"
  },
  {
    id: "ch04-vid05",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID05",
    title: "Stored Procedure with Parameters and Return Values",
    duration: "23 mins",
    level: "Intermediate",
    skillsConnected: ["Input Parameters & Defaults", "OUTPUT Parameters", "RETURN Integer Status Codes", "Handling Missing Args"],
    objectives: [
      "Master input parameters & defaults in SQL Server.",
      "Master output parameters in SQL Server.",
      "Master return integer status codes in SQL Server.",
      "Complete the practical exercise for Stored Procedure with Parameters and Return Values."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Stored Procedure with Parameters and Return Values' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Stored Procedure with Parameters and Return Values\n-- Video Code: CH04_VID05\nSELECT 'CH04_VID05' AS VideoCode, 'Stored Procedure with Parameters and Return Values' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid05-1", name: "Stored Procedure with Parameters and Return Values Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid05-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/03_stored_procedures_etl.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17582",
    microsoftDocTitle: "Return Data from a Stored Procedure",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/return-data-from-a-stored-procedure"
  },
  {
    id: "ch04-vid06",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID06",
    title: "Functions vs Stored Procedures (Architectural Trade-offs)",
    duration: "20 mins",
    level: "Intermediate",
    skillsConnected: ["Side-Effects Policy", "Usability in SELECT vs EXEC", "Transaction Management Capabilities", "Compiler Inlining Differences"],
    objectives: [
      "Master side-effects policy in SQL Server.",
      "Master usability in select vs exec in SQL Server.",
      "Master transaction management capabilities in SQL Server.",
      "Complete the practical exercise for Functions vs Stored Procedures (Architectural Trade-offs)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Functions vs Stored Procedures (Architectural Trade-offs)' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Functions vs Stored Procedures (Architectural Trade-offs)\n-- Video Code: CH04_VID06\nSELECT 'CH04_VID06' AS VideoCode, 'Functions vs Stored Procedures (Architectural Trade-offs)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid06-1", name: "Functions vs Stored Procedures (Architectural Trade-offs) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid06-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17583",
    microsoftDocTitle: "Comparing Functions and Stored Procedures",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/user-defined-functions"
  },
  {
    id: "ch04-vid07",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID07",
    title: "Dynamic Query in Stored Procedure (sp_executesql Guardrails)",
    duration: "25 mins",
    level: "Advanced",
    skillsConnected: ["sp_executesql Parameterization", "Plan Reuse with Dynamic Queries", "QUOTENAME() Sanitization", "SQL Injection Elimination"],
    objectives: [
      "Master sp_executesql parameterization in SQL Server.",
      "Master plan reuse with dynamic queries in SQL Server.",
      "Master quotename() sanitization in SQL Server.",
      "Complete the practical exercise for Dynamic Query in Stored Procedure (sp_executesql Guardrails)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Dynamic Query in Stored Procedure (sp_executesql Guardrails)' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Dynamic Query in Stored Procedure (sp_executesql Guardrails)\n-- Video Code: CH04_VID07\nSELECT 'CH04_VID07' AS VideoCode, 'Dynamic Query in Stored Procedure (sp_executesql Guardrails)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/04_governance_and_audit/03_dynamic_sql_guardrails.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid07-1", name: "Dynamic Query in Stored Procedure (sp_executesql Guardrails) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid07-2", name: "Solution DDL / Script", type: "SQL", path: "src/04_governance_and_audit/03_dynamic_sql_guardrails.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17584",
    microsoftDocTitle: "sp_executesql (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-executesql-transact-sql"
  },
  {
    id: "ch04-vid08",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID08",
    title: "Stored Procedures and Triggers Types Overview",
    duration: "21 mins",
    level: "Intermediate",
    skillsConnected: ["DML Triggers (AFTER vs INSTEAD OF)", "DDL Triggers", "Logon Triggers", "Event Notification Comparison"],
    objectives: [
      "Master dml triggers (after vs instead of) in SQL Server.",
      "Master ddl triggers in SQL Server.",
      "Master logon triggers in SQL Server.",
      "Complete the practical exercise for Stored Procedures and Triggers Types Overview."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Stored Procedures and Triggers Types Overview' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Stored Procedures and Triggers Types Overview\n-- Video Code: CH04_VID08\nSELECT 'CH04_VID08' AS VideoCode, 'Stored Procedures and Triggers Types Overview' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid08-1", name: "Stored Procedures and Triggers Types Overview Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid08-2", name: "Solution DDL / Script", type: "SQL", path: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17585",
    microsoftDocTitle: "DML Triggers",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/triggers/dml-triggers"
  },
  {
    id: "ch04-vid09",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID09",
    title: "Creating a Table Level Trigger (AFTER INSERT, UPDATE)",
    duration: "24 mins",
    level: "Intermediate",
    skillsConnected: ["CREATE TRIGGER ... AFTER", "Trigger Firing Sequence", "Nested Triggers Option", "Rolling Back Failing Transactions in Trigger"],
    objectives: [
      "Master create trigger ... after in SQL Server.",
      "Master trigger firing sequence in SQL Server.",
      "Master nested triggers option in SQL Server.",
      "Complete the practical exercise for Creating a Table Level Trigger (AFTER INSERT, UPDATE)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Creating a Table Level Trigger (AFTER INSERT, UPDATE)' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Creating a Table Level Trigger (AFTER INSERT, UPDATE)\n-- Video Code: CH04_VID09\nSELECT 'CH04_VID09' AS VideoCode, 'Creating a Table Level Trigger (AFTER INSERT, UPDATE)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid09-1", name: "Creating a Table Level Trigger (AFTER INSERT, UPDATE) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid09-2", name: "Solution DDL / Script", type: "SQL", path: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17586",
    microsoftDocTitle: "CREATE TRIGGER (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-trigger-transact-sql"
  },
  {
    id: "ch04-vid10",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID10",
    title: "Triggers Features (INSTEAD OF & Recursive Settings)",
    duration: "23 mins",
    level: "Intermediate",
    skillsConnected: ["INSTEAD OF Triggers on Views", "Direct & Indirect Recursion", "RECURSIVE_TRIGGERS Option", "Trigger Performance Impact"],
    objectives: [
      "Master instead of triggers on views in SQL Server.",
      "Master direct & indirect recursion in SQL Server.",
      "Master recursive_triggers option in SQL Server.",
      "Complete the practical exercise for Triggers Features (INSTEAD OF & Recursive Settings)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Triggers Features (INSTEAD OF & Recursive Settings)' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Triggers Features (INSTEAD OF & Recursive Settings)\n-- Video Code: CH04_VID10\nSELECT 'CH04_VID10' AS VideoCode, 'Triggers Features (INSTEAD OF & Recursive Settings)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid10-1", name: "Triggers Features (INSTEAD OF & Recursive Settings) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid10-2", name: "Solution DDL / Script", type: "SQL", path: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17587",
    microsoftDocTitle: "INSTEAD OF DML Triggers",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/triggers/use-the-inserted-and-deleted-tables"
  },
  {
    id: "ch04-vid11",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID11",
    title: "Using INSERTED and DELETED Tables Within Triggers",
    duration: "26 mins",
    level: "Advanced",
    skillsConnected: ["inserted Logical Table", "deleted Logical Table", "Multi-Row Set-Based Trigger Logic", "UPDATE() and COLUMNS_UPDATED() functions"],
    objectives: [
      "Master inserted logical table in SQL Server.",
      "Master deleted logical table in SQL Server.",
      "Master multi-row set-based trigger logic in SQL Server.",
      "Complete the practical exercise for Using INSERTED and DELETED Tables Within Triggers."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Using INSERTED and DELETED Tables Within Triggers' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Using INSERTED and DELETED Tables Within Triggers\n-- Video Code: CH04_VID11\nSELECT 'CH04_VID11' AS VideoCode, 'Using INSERTED and DELETED Tables Within Triggers' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid11-1", name: "Using INSERTED and DELETED Tables Within Triggers Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid11-2", name: "Solution DDL / Script", type: "SQL", path: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17588",
    microsoftDocTitle: "Use the inserted and deleted Tables",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/triggers/use-the-inserted-and-deleted-tables"
  },
  {
    id: "ch04-vid12",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID12",
    title: "Track User Activity Using Audit Table (CDC Pattern)",
    duration: "27 mins",
    level: "Advanced",
    skillsConnected: ["Audit Log Schema Design", "Non-Locking Change Auditing", "SUSER_SNAME() & HOST_NAME() Capture", "Temporal Change Tracking"],
    objectives: [
      "Master audit log schema design in SQL Server.",
      "Master non-locking change auditing in SQL Server.",
      "Master suser_sname() & host_name() capture in SQL Server.",
      "Complete the practical exercise for Track User Activity Using Audit Table (CDC Pattern)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Track User Activity Using Audit Table (CDC Pattern)' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Track User Activity Using Audit Table (CDC Pattern)\n-- Video Code: CH04_VID12\nSELECT 'CH04_VID12' AS VideoCode, 'Track User Activity Using Audit Table (CDC Pattern)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid12-1", name: "Track User Activity Using Audit Table (CDC Pattern) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid12-2", name: "Solution DDL / Script", type: "SQL", path: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17589",
    microsoftDocTitle: "Audit Changes Using Triggers",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/security/auditing/sql-server-audit-database-engine"
  },
  {
    id: "ch04-vid13",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID13",
    title: "Creating Server-Level and Database-Level Triggers (DDL Governance)",
    duration: "25 mins",
    level: "Advanced",
    skillsConnected: ["ON DATABASE vs ON ALL SERVER", "EVENTDATA() XML Function", "Preventing Unauthorized DROP TABLE", "Compliance Auditing"],
    objectives: [
      "Master on database vs on all server in SQL Server.",
      "Master eventdata() xml function in SQL Server.",
      "Master preventing unauthorized drop table in SQL Server.",
      "Complete the practical exercise for Creating Server-Level and Database-Level Triggers (DDL Governance)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Creating Server-Level and Database-Level Triggers (DDL Governance)' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Creating Server-Level and Database-Level Triggers (DDL Governance)\n-- Video Code: CH04_VID13\nSELECT 'CH04_VID13' AS VideoCode, 'Creating Server-Level and Database-Level Triggers (DDL Governance)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/04_governance_and_audit/02_ddl_and_server_triggers.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid13-1", name: "Creating Server-Level and Database-Level Triggers (DDL Governance) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid13-2", name: "Solution DDL / Script", type: "SQL", path: "src/04_governance_and_audit/02_ddl_and_server_triggers.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17590",
    microsoftDocTitle: "DDL Triggers",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/triggers/ddl-triggers"
  },
  {
    id: "ch04-vid14",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID14",
    title: "Using OUTPUT with DML Statements (Atomic Auditing & Staging)",
    duration: "24 mins",
    level: "Advanced",
    skillsConnected: ["OUTPUT INTO Clause", "Atomic Insert/Delete Capture", "Eliminating Double Queries", "ETL Audit Staging in One Pass"],
    objectives: [
      "Master output into clause in SQL Server.",
      "Master atomic insert/delete capture in SQL Server.",
      "Master eliminating double queries in SQL Server.",
      "Complete the practical exercise for Using OUTPUT with DML Statements (Atomic Auditing & Staging)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Using OUTPUT with DML Statements (Atomic Auditing & Staging)' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Using OUTPUT with DML Statements (Atomic Auditing & Staging)\n-- Video Code: CH04_VID14\nSELECT 'CH04_VID14' AS VideoCode, 'Using OUTPUT with DML Statements (Atomic Auditing & Staging)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid14-1", name: "Using OUTPUT with DML Statements (Atomic Auditing & Staging) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid14-2", name: "Solution DDL / Script", type: "SQL", path: "src/03_programmability_and_elt/03_stored_procedures_etl.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17591",
    microsoftDocTitle: "OUTPUT Clause (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/queries/output-clause-transact-sql"
  },
  {
    id: "ch04-vid15",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID15",
    title: "Cursors Architecture & Mechanics",
    duration: "20 mins",
    level: "Intermediate",
    skillsConnected: ["Row-By-Agonizing-Row (RBAR)", "Cursor Lifecycle", "DECLARE, OPEN, FETCH, CLOSE, DEALLOCATE", "Cursor Scopes (GLOBAL vs LOCAL)"],
    objectives: [
      "Master row-by-agonizing-row (rbar) in SQL Server.",
      "Master cursor lifecycle in SQL Server.",
      "Master declare, open, fetch, close, deallocate in SQL Server.",
      "Complete the practical exercise for Cursors Architecture & Mechanics."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Cursors Architecture & Mechanics' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Cursors Architecture & Mechanics\n-- Video Code: CH04_VID15\nSELECT 'CH04_VID15' AS VideoCode, 'Cursors Architecture & Mechanics' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/02_indexing_and_performance/03_execution_plan_analysis.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid15-1", name: "Cursors Architecture & Mechanics Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid15-2", name: "Solution DDL / Script", type: "SQL", path: "src/02_indexing_and_performance/03_execution_plan_analysis.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17592",
    microsoftDocTitle: "Cursors (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/cursors-transact-sql"
  },
  {
    id: "ch04-vid16",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID16",
    title: "Create a Database Cursor & Traversal",
    duration: "22 mins",
    level: "Intermediate",
    skillsConnected: ["FETCH NEXT ... INTO", "@@FETCH_STATUS = 0 Loop", "FORWARD_ONLY READ_ONLY Options", "Memory Resource Reclamation"],
    objectives: [
      "Master fetch next ... into in SQL Server.",
      "Master @@fetch_status = 0 loop in SQL Server.",
      "Master forward_only read_only options in SQL Server.",
      "Complete the practical exercise for Create a Database Cursor & Traversal."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Create a Database Cursor & Traversal' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Create a Database Cursor & Traversal\n-- Video Code: CH04_VID16\nSELECT 'CH04_VID16' AS VideoCode, 'Create a Database Cursor & Traversal' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/02_indexing_and_performance/03_execution_plan_analysis.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid16-1", name: "Create a Database Cursor & Traversal Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid16-2", name: "Solution DDL / Script", type: "SQL", path: "src/02_indexing_and_performance/03_execution_plan_analysis.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17593",
    microsoftDocTitle: "FETCH (Transact-SQL)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/fetch-transact-sql"
  },
  {
    id: "ch04-vid17",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID17",
    title: "Practical Applications of SQL Cursors 01 (Administrative Tasks)",
    duration: "23 mins",
    level: "Intermediate",
    skillsConnected: ["Iterating Databases for Maintenance", "Dynamic Per-Table Index Rebuilds", "Automated Metadata Scripts", "Error Trapping in Loops"],
    objectives: [
      "Master iterating databases for maintenance in SQL Server.",
      "Master dynamic per-table index rebuilds in SQL Server.",
      "Master automated metadata scripts in SQL Server.",
      "Complete the practical exercise for Practical Applications of SQL Cursors 01 (Administrative Tasks)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Practical Applications of SQL Cursors 01 (Administrative Tasks)' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Practical Applications of SQL Cursors 01 (Administrative Tasks)\n-- Video Code: CH04_VID17\nSELECT 'CH04_VID17' AS VideoCode, 'Practical Applications of SQL Cursors 01 (Administrative Tasks)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid17-1", name: "Practical Applications of SQL Cursors 01 (Administrative Tasks) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid17-2", name: "Solution DDL / Script", type: "SQL", path: "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17594",
    microsoftDocTitle: "Administrative Cursor Workflows",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/indexes/reorganize-and-rebuild-indexes"
  },
  {
    id: "ch04-vid18",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID18",
    title: "Practical Applications of SQL Cursors 02 vs Set-Based Benchmarking",
    duration: "26 mins",
    level: "Advanced",
    skillsConnected: ["RBAR Cursor Performance Bottlenecks", "Refactoring to Window Aggregates", "Execution Time & Reads Profiling", "Zero-Cursor Architecture"],
    objectives: [
      "Master rbar cursor performance bottlenecks in SQL Server.",
      "Master refactoring to window aggregates in SQL Server.",
      "Master execution time & reads profiling in SQL Server.",
      "Complete the practical exercise for Practical Applications of SQL Cursors 02 vs Set-Based Benchmarking."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Practical Applications of SQL Cursors 02 vs Set-Based Benchmarking' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Practical Applications of SQL Cursors 02 vs Set-Based Benchmarking\n-- Video Code: CH04_VID18\nSELECT 'CH04_VID18' AS VideoCode, 'Practical Applications of SQL Cursors 02 vs Set-Based Benchmarking' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/02_indexing_and_performance/03_execution_plan_analysis.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid18-1", name: "Practical Applications of SQL Cursors 02 vs Set-Based Benchmarking Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid18-2", name: "Solution DDL / Script", type: "SQL", path: "src/02_indexing_and_performance/03_execution_plan_analysis.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17595",
    microsoftDocTitle: "Overcoming Cursor Performance Issues with Set-Based T-SQL",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/t-sql/queries/select-over-clause-transact-sql"
  },
  {
    id: "ch04-vid19",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID19",
    title: "Overview of Common Language Runtime (CLR) Integration",
    duration: "22 mins",
    level: "Intermediate",
    skillsConnected: ["In-Process .NET CLR Engine", "C# Execution in Database", "String/Regex Performance Gains", "CLR vs T-SQL Boundary Decisions"],
    objectives: [
      "Master in-process .net clr engine in SQL Server.",
      "Master c# execution in database in SQL Server.",
      "Master string/regex performance gains in SQL Server.",
      "Complete the practical exercise for Overview of Common Language Runtime (CLR) Integration."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Overview of Common Language Runtime (CLR) Integration' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Overview of Common Language Runtime (CLR) Integration\n-- Video Code: CH04_VID19\nSELECT 'CH04_VID19' AS VideoCode, 'Overview of Common Language Runtime (CLR) Integration' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/05_automation_and_smo/clr/SqlClrExtensions.cs",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid19-1", name: "Overview of Common Language Runtime (CLR) Integration Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid19-2", name: "Solution DDL / Script", type: "SQL", path: "src/05_automation_and_smo/clr/SqlClrExtensions.cs" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17600",
    microsoftDocTitle: "Common Language Runtime (CLR) Integration Programming Concepts",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration/common-language-runtime-integration-overview"
  },
  {
    id: "ch04-vid20",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID20",
    title: "Create SQL CLR C# User-Defined Function (Regex & Algorithms)",
    duration: "25 mins",
    level: "Advanced",
    skillsConnected: ["[SqlFunction] Attribute", "Regex Matching in C#", "Passing SqlString Parameters", "CREATE FUNCTION ... EXTERNAL NAME"],
    objectives: [
      "Master [sqlfunction] attribute in SQL Server.",
      "Master regex matching in c# in SQL Server.",
      "Master passing sqlstring parameters in SQL Server.",
      "Complete the practical exercise for Create SQL CLR C# User-Defined Function (Regex & Algorithms)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Create SQL CLR C# User-Defined Function (Regex & Algorithms)' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Create SQL CLR C# User-Defined Function (Regex & Algorithms)\n-- Video Code: CH04_VID20\nSELECT 'CH04_VID20' AS VideoCode, 'Create SQL CLR C# User-Defined Function (Regex & Algorithms)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/05_automation_and_smo/clr/SqlClrExtensions.cs",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid20-1", name: "Create SQL CLR C# User-Defined Function (Regex & Algorithms) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid20-2", name: "Solution DDL / Script", type: "SQL", path: "src/05_automation_and_smo/clr/SqlClrExtensions.cs" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17602",
    microsoftDocTitle: "CLR User-Defined Functions",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration-database-objects-user-defined-functions/clr-user-defined-functions"
  },
  {
    id: "ch04-vid21",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID21",
    title: "Create SQL CLR C# User-Defined Type (UDT)",
    duration: "27 mins",
    level: "Advanced",
    skillsConnected: ["[SqlUserDefinedType] Serialization", "INullable Interface", "Byte-Ordering & Native Formatting", "Creating Composite Types"],
    objectives: [
      "Master [sqluserdefinedtype] serialization in SQL Server.",
      "Master inullable interface in SQL Server.",
      "Master byte-ordering & native formatting in SQL Server.",
      "Complete the practical exercise for Create SQL CLR C# User-Defined Type (UDT)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Create SQL CLR C# User-Defined Type (UDT)' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Create SQL CLR C# User-Defined Type (UDT)\n-- Video Code: CH04_VID21\nSELECT 'CH04_VID21' AS VideoCode, 'Create SQL CLR C# User-Defined Type (UDT)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/05_automation_and_smo/clr/SqlClrExtensions.cs",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid21-1", name: "Create SQL CLR C# User-Defined Type (UDT) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid21-2", name: "Solution DDL / Script", type: "SQL", path: "src/05_automation_and_smo/clr/SqlClrExtensions.cs" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17603",
    microsoftDocTitle: "CLR User-Defined Types",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration-database-objects-user-defined-types/clr-user-defined-types"
  },
  {
    id: "ch04-vid22",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID22",
    title: "Create SQL CLR C# Stored Procedure",
    duration: "26 mins",
    level: "Advanced",
    skillsConnected: ["[SqlProcedure] Attribute", "SqlPipe Streaming to Client", "Executing Context Connections", "External API Communication"],
    objectives: [
      "Master [sqlprocedure] attribute in SQL Server.",
      "Master sqlpipe streaming to client in SQL Server.",
      "Master executing context connections in SQL Server.",
      "Complete the practical exercise for Create SQL CLR C# Stored Procedure."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Create SQL CLR C# Stored Procedure' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Create SQL CLR C# Stored Procedure\n-- Video Code: CH04_VID22\nSELECT 'CH04_VID22' AS VideoCode, 'Create SQL CLR C# Stored Procedure' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/05_automation_and_smo/clr/SqlClrExtensions.cs",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid22-1", name: "Create SQL CLR C# Stored Procedure Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid22-2", name: "Solution DDL / Script", type: "SQL", path: "src/05_automation_and_smo/clr/SqlClrExtensions.cs" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17604",
    microsoftDocTitle: "CLR Stored Procedures",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration-database-objects-user-defined-functions/clr-stored-procedures"
  },
  {
    id: "ch04-vid23",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID23",
    title: "Create SQL CLR C# Trigger & Publish with Right Permissions",
    duration: "28 mins",
    level: "Advanced",
    skillsConnected: ["CLR Triggers with SqlTriggerContext", "CREATE ASSEMBLY with SAFE / EXTERNAL_ACCESS", "TRUSTWORTHY Database Setting", "Asymmetric Key Signing"],
    objectives: [
      "Master clr triggers with sqltriggercontext in SQL Server.",
      "Master create assembly with safe / external_access in SQL Server.",
      "Master trustworthy database setting in SQL Server.",
      "Complete the practical exercise for Create SQL CLR C# Trigger & Publish with Right Permissions."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Create SQL CLR C# Trigger & Publish with Right Permissions' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Create SQL CLR C# Trigger & Publish with Right Permissions\n-- Video Code: CH04_VID23\nSELECT 'CH04_VID23' AS VideoCode, 'Create SQL CLR C# Trigger & Publish with Right Permissions' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/05_automation_and_smo/clr/Deploy-ClrAssembly.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid23-1", name: "Create SQL CLR C# Trigger & Publish with Right Permissions Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid23-2", name: "Solution DDL / Script", type: "SQL", path: "src/05_automation_and_smo/clr/Deploy-ClrAssembly.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17605",
    microsoftDocTitle: "CLR Triggers and Assembly Security",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration/security/clr-integration-security"
  },
  {
    id: "ch04-vid24",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID24",
    title: "Overview of SQL Server Management Objects (SMO)",
    duration: "22 mins",
    level: "Intermediate",
    skillsConnected: ["Microsoft.SqlServer.Smo Object Model", "Server, Database, Table Objects", "PowerShell & C# SDK", "Declarative Management Framework"],
    objectives: [
      "Master microsoft.sqlserver.smo object model in SQL Server.",
      "Master server, database, table objects in SQL Server.",
      "Master powershell & c# sdk in SQL Server.",
      "Complete the practical exercise for Overview of SQL Server Management Objects (SMO)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Overview of SQL Server Management Objects (SMO)' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Overview of SQL Server Management Objects (SMO)\n-- Video Code: CH04_VID24\nSELECT 'CH04_VID24' AS VideoCode, 'Overview of SQL Server Management Objects (SMO)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid24-1", name: "Overview of SQL Server Management Objects (SMO) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid24-2", name: "Solution DDL / Script", type: "SQL", path: "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17606",
    microsoftDocTitle: "SQL Server Management Objects (SMO) Programming Guide",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/server-management-objects-smo/overview-smo"
  },
  {
    id: "ch04-vid25",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID25",
    title: "Create Simple Custom Application for End User Using SMO",
    duration: "27 mins",
    level: "Advanced",
    skillsConnected: ["Connecting to SQL Instance via SMO", "Enumerating Databases & Status", "Dynamic Object Inspection", "Automated UI Generation"],
    objectives: [
      "Master connecting to sql instance via smo in SQL Server.",
      "Master enumerating databases & status in SQL Server.",
      "Master dynamic object inspection in SQL Server.",
      "Complete the practical exercise for Create Simple Custom Application for End User Using SMO."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Create Simple Custom Application for End User Using SMO' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Create Simple Custom Application for End User Using SMO\n-- Video Code: CH04_VID25\nSELECT 'CH04_VID25' AS VideoCode, 'Create Simple Custom Application for End User Using SMO' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/05_automation_and_smo/smo_scripts/ScriptDatabaseObjects.py",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid25-1", name: "Create Simple Custom Application for End User Using SMO Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid25-2", name: "Solution DDL / Script", type: "SQL", path: "src/05_automation_and_smo/smo_scripts/ScriptDatabaseObjects.py" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17607",
    microsoftDocTitle: "Creating a Simple SMO Application",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/server-management-objects-smo/smo-license-terms-and-documentation"
  },
  {
    id: "ch04-vid26",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID26",
    title: "Create & Backup Database Programmatically with SMO through App",
    duration: "29 mins",
    level: "Advanced",
    skillsConnected: ["Smo.Database.Create()", "Smo.Backup Class Integration", "Event Handling & PercentComplete", "DevOps Infrastructure as Code"],
    objectives: [
      "Master smo.database.create() in SQL Server.",
      "Master smo.backup class integration in SQL Server.",
      "Master event handling & percentcomplete in SQL Server.",
      "Complete the practical exercise for Create & Backup Database Programmatically with SMO through App."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Create & Backup Database Programmatically with SMO through App' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Create & Backup Database Programmatically with SMO through App\n-- Video Code: CH04_VID26\nSELECT 'CH04_VID26' AS VideoCode, 'Create & Backup Database Programmatically with SMO through App' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid26-1", name: "Create & Backup Database Programmatically with SMO through App Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid26-2", name: "Solution DDL / Script", type: "SQL", path: "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17608",
    microsoftDocTitle: "Backup and Restore Using SMO",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/server-management-objects-smo/tasks/backing-up-and-restoring-databases-and-transaction-logs"
  },
  {
    id: "ch04-vid27",
    chapter: 4,
    chapterTitle: "Chapter 4: Procedures, Triggers, and SQL Automation",
    videoCode: "CH04_VID27",
    title: "Assignment 04: Procedures, Triggers, CLR & Automation",
    duration: "40 mins",
    level: "Advanced",
    skillsConnected: ["Idempotent ETL Procedures", "Audit Triggers", "Managed CLR Assemblies", "SMO Deployment Pipeline", "End-to-End Chapter 4 Capstone"],
    objectives: [
      "Master idempotent etl procedures in SQL Server.",
      "Master audit triggers in SQL Server.",
      "Master managed clr assemblies in SQL Server.",
      "Complete the practical exercise for Assignment 04: Procedures, Triggers, CLR & Automation."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Assignment 04: Procedures, Triggers, CLR & Automation' as part of Chapter 4: Procedures, Triggers, and SQL Automation. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Assignment 04: Procedures, Triggers, CLR & Automation\n-- Video Code: CH04_VID27\nSELECT 'CH04_VID27' AS VideoCode, 'Assignment 04: Procedures, Triggers, CLR & Automation' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
    challengeId: "ch-4",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch04-vid27-1", name: "Assignment 04: Procedures, Triggers, CLR & Automation Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch04-vid27-2", name: "Solution DDL / Script", type: "SQL", path: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17609",
    microsoftDocTitle: "Database Automation and Governance Guide",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/server-management-objects-smo/overview-smo"
  },
  // ==========================================
  // CHAPTER 5: REPORTING AND DATA WAREHOUSING
  // ==========================================
  {
    id: "ch05-vid01",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID01",
    title: "Overview of SQL Server Reporting Services (SSRS) & Installation",
    duration: "22 mins",
    level: "Foundational",
    skillsConnected: ["SSRS Architecture", "Report Server Configuration Manager", "Web Service & Report Portal URLs", "ReportServer Database"],
    objectives: [
      "Master ssrs architecture in SQL Server.",
      "Master report server configuration manager in SQL Server.",
      "Master web service & report portal urls in SQL Server.",
      "Complete the practical exercise for Overview of SQL Server Reporting Services (SSRS) & Installation."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Overview of SQL Server Reporting Services (SSRS) & Installation' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Overview of SQL Server Reporting Services (SSRS) & Installation\n-- Video Code: CH05_VID01\nSELECT 'CH05_VID01' AS VideoCode, 'Overview of SQL Server Reporting Services (SSRS) & Installation' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid01-1", name: "Overview of SQL Server Reporting Services (SSRS) & Installation Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid01-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17610",
    microsoftDocTitle: "What is SQL Server Reporting Services (SSRS)?",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/create-deploy-and-manage-mobile-and-paginated-reports"
  },
  {
    id: "ch05-vid02",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID02",
    title: "Create a Report Server Project in Visual Studio / SSDT",
    duration: "21 mins",
    level: "Foundational",
    skillsConnected: ["SQL Server Data Tools (SSDT)", "Report Server Project Template", "Shared Data Sources (.rds)", "Shared Datasets (.rsd)"],
    objectives: [
      "Master sql server data tools (ssdt) in SQL Server.",
      "Master report server project template in SQL Server.",
      "Master shared data sources (.rds) in SQL Server.",
      "Complete the practical exercise for Create a Report Server Project in Visual Studio / SSDT."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Create a Report Server Project in Visual Studio / SSDT' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Create a Report Server Project in Visual Studio / SSDT\n-- Video Code: CH05_VID02\nSELECT 'CH05_VID02' AS VideoCode, 'Create a Report Server Project in Visual Studio / SSDT' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid02-1", name: "Create a Report Server Project in Visual Studio / SSDT Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid02-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17611",
    microsoftDocTitle: "Create a Report Server Project",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/reports/create-a-basic-table-report-ssrs-tutorial"
  },
  {
    id: "ch05-vid03",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID03",
    title: "Add Items to Your Report & Edit SSRS Expressions",
    duration: "23 mins",
    level: "Intermediate",
    skillsConnected: ["Report Designer Surface", "Textbox & Table Controls", "SSRS Expression Builder (=Fields!...)", "Built-in Global Collections"],
    objectives: [
      "Master report designer surface in SQL Server.",
      "Master textbox & table controls in SQL Server.",
      "Master ssrs expression builder (=fields!...) in SQL Server.",
      "Complete the practical exercise for Add Items to Your Report & Edit SSRS Expressions."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Add Items to Your Report & Edit SSRS Expressions' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Add Items to Your Report & Edit SSRS Expressions\n-- Video Code: CH05_VID03\nSELECT 'CH05_VID03' AS VideoCode, 'Add Items to Your Report & Edit SSRS Expressions' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid03-1", name: "Add Items to Your Report & Edit SSRS Expressions Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid03-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17612",
    microsoftDocTitle: "Expression Uses in Reports (Report Builder and SSRS)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/expression-uses-in-reports-report-builder-and-ssrs"
  },
  {
    id: "ch05-vid04",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID04",
    title: "Change Report Properties & Professional Styling",
    duration: "20 mins",
    level: "Intermediate",
    skillsConnected: ["Page Setup (A4/Letter)", "Header & Footer Margins", "Color Palettes & Typography", "Conditional Formatting Expressions"],
    objectives: [
      "Master page setup (a4/letter) in SQL Server.",
      "Master header & footer margins in SQL Server.",
      "Master color palettes & typography in SQL Server.",
      "Complete the practical exercise for Change Report Properties & Professional Styling."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Change Report Properties & Professional Styling' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Change Report Properties & Professional Styling\n-- Video Code: CH05_VID04\nSELECT 'CH05_VID04' AS VideoCode, 'Change Report Properties & Professional Styling' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid04-1", name: "Change Report Properties & Professional Styling Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid04-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17613",
    microsoftDocTitle: "Formatting Report Items (Report Builder and SSRS)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/formatting-report-items-report-builder-and-ssrs"
  },
  {
    id: "ch05-vid05",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID05",
    title: "Use COUNT and Interactive Sorting Functions",
    duration: "22 mins",
    level: "Intermediate",
    skillsConnected: ["COUNT & SUM Aggregates", "Interactive Sorting on Column Headers", "Scope Resolution", "Sort Direction Toggling"],
    objectives: [
      "Master count & sum aggregates in SQL Server.",
      "Master interactive sorting on column headers in SQL Server.",
      "Master scope resolution in SQL Server.",
      "Complete the practical exercise for Use COUNT and Interactive Sorting Functions."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Use COUNT and Interactive Sorting Functions' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Use COUNT and Interactive Sorting Functions\n-- Video Code: CH05_VID05\nSELECT 'CH05_VID05' AS VideoCode, 'Use COUNT and Interactive Sorting Functions' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid05-1", name: "Use COUNT and Interactive Sorting Functions Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid05-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17614",
    microsoftDocTitle: "Interactive Sort (Report Builder and SSRS)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/interactive-sort-report-builder-and-ssrs"
  },
  {
    id: "ch05-vid06",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID06",
    title: "Choose How to Group Data in Table, Matrix and Chart Reports",
    duration: "25 mins",
    level: "Intermediate",
    skillsConnected: ["Row Groups & Column Groups", "Matrix (Pivot) Tablix Controls", "Group Headers & Subtotals", "Visual Charts (Bar, Line, Pie)"],
    objectives: [
      "Master row groups & column groups in SQL Server.",
      "Master matrix (pivot) tablix controls in SQL Server.",
      "Master group headers & subtotals in SQL Server.",
      "Complete the practical exercise for Choose How to Group Data in Table, Matrix and Chart Reports."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Choose How to Group Data in Table, Matrix and Chart Reports' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Choose How to Group Data in Table, Matrix and Chart Reports\n-- Video Code: CH05_VID06\nSELECT 'CH05_VID06' AS VideoCode, 'Choose How to Group Data in Table, Matrix and Chart Reports' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid06-1", name: "Choose How to Group Data in Table, Matrix and Chart Reports Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid06-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17615",
    microsoftDocTitle: "Grouping Data (Report Builder and SSRS)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/understanding-groups-report-builder-and-ssrs"
  },
  {
    id: "ch05-vid07",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID07",
    title: "Create a Free-Form Report Layout",
    duration: "24 mins",
    level: "Intermediate",
    skillsConnected: ["List Tablix for Form Layouts", "Banding and Nested Containers", "Catalog Cards & Invoices", "Subreport Placeholders"],
    objectives: [
      "Master list tablix for form layouts in SQL Server.",
      "Master banding and nested containers in SQL Server.",
      "Master catalog cards & invoices in SQL Server.",
      "Complete the practical exercise for Create a Free-Form Report Layout."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Create a Free-Form Report Layout' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Create a Free-Form Report Layout\n-- Video Code: CH05_VID07\nSELECT 'CH05_VID07' AS VideoCode, 'Create a Free-Form Report Layout' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid07-1", name: "Create a Free-Form Report Layout Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid07-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17616",
    microsoftDocTitle: "Create a Free-Form Form (Report Builder and SSRS)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/create-invoices-and-forms-with-lists-report-builder-and-ssrs"
  },
  {
    id: "ch05-vid08",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID08",
    title: "Join Many Tables Using Query Designer & Add Indicators",
    duration: "25 mins",
    level: "Intermediate",
    skillsConnected: ["Graphical Query Designer", "Multi-Table SQL Joins", "KPI Indicators (Traffic Lights, Gauges)", "State Range Configuration"],
    objectives: [
      "Master graphical query designer in SQL Server.",
      "Master multi-table sql joins in SQL Server.",
      "Master kpi indicators (traffic lights, gauges) in SQL Server.",
      "Complete the practical exercise for Join Many Tables Using Query Designer & Add Indicators."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Join Many Tables Using Query Designer & Add Indicators' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Join Many Tables Using Query Designer & Add Indicators\n-- Video Code: CH05_VID08\nSELECT 'CH05_VID08' AS VideoCode, 'Join Many Tables Using Query Designer & Add Indicators' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid08-1", name: "Join Many Tables Using Query Designer & Add Indicators Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid08-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17617",
    microsoftDocTitle: "Indicators (Report Builder and SSRS)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/indicators-report-builder-and-ssrs"
  },
  {
    id: "ch05-vid09",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID09",
    title: "Using Stored Procedures & Map Dataset to Report Parameter",
    duration: "26 mins",
    level: "Advanced",
    skillsConnected: ["CommandType.StoredProcedure", "Report Parameter Auto-Generation", "Available Values Queries", "Default Values Setup"],
    objectives: [
      "Master commandtype.storedprocedure in SQL Server.",
      "Master report parameter auto-generation in SQL Server.",
      "Master available values queries in SQL Server.",
      "Complete the practical exercise for Using Stored Procedures & Map Dataset to Report Parameter."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Using Stored Procedures & Map Dataset to Report Parameter' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Using Stored Procedures & Map Dataset to Report Parameter\n-- Video Code: CH05_VID09\nSELECT 'CH05_VID09' AS VideoCode, 'Using Stored Procedures & Map Dataset to Report Parameter' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid09-1", name: "Using Stored Procedures & Map Dataset to Report Parameter Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid09-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17618",
    microsoftDocTitle: "Report Parameters (Report Builder and Report Designer)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/report-parameters-report-builder-and-report-designer"
  },
  {
    id: "ch05-vid10",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID10",
    title: "Go to Another Report Action (Drill-Through Navigation)",
    duration: "24 mins",
    level: "Advanced",
    skillsConnected: ["Action Properties: Go to report", "Passing Parameters to Target Report", "Drill-Through vs Drill-Down", "Breadcrumb Navigation"],
    objectives: [
      "Master action properties: go to report in SQL Server.",
      "Master passing parameters to target report in SQL Server.",
      "Master drill-through vs drill-down in SQL Server.",
      "Complete the practical exercise for Go to Another Report Action (Drill-Through Navigation)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Go to Another Report Action (Drill-Through Navigation)' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Go to Another Report Action (Drill-Through Navigation)\n-- Video Code: CH05_VID10\nSELECT 'CH05_VID10' AS VideoCode, 'Go to Another Report Action (Drill-Through Navigation)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid10-1", name: "Go to Another Report Action (Drill-Through Navigation) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid10-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17619",
    microsoftDocTitle: "Add a Drillthrough Action on a Report",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/add-a-drillthrough-action-on-a-report-report-builder-and-ssrs"
  },
  {
    id: "ch05-vid11",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID11",
    title: "Link Datasets with Cascading Parameters",
    duration: "25 mins",
    level: "Advanced",
    skillsConnected: ["Cascading Parameter Dependencies", "Filtering Child Parameter Queries", "Handling Multi-Select Cascades", "Parameter Refresh Order"],
    objectives: [
      "Master cascading parameter dependencies in SQL Server.",
      "Master filtering child parameter queries in SQL Server.",
      "Master handling multi-select cascades in SQL Server.",
      "Complete the practical exercise for Link Datasets with Cascading Parameters."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Link Datasets with Cascading Parameters' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Link Datasets with Cascading Parameters\n-- Video Code: CH05_VID11\nSELECT 'CH05_VID11' AS VideoCode, 'Link Datasets with Cascading Parameters' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid11-1", name: "Link Datasets with Cascading Parameters Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid11-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17620",
    microsoftDocTitle: "Add Cascading Parameters to a Report",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/add-cascading-parameters-to-a-report-report-builder-and-ssrs"
  },
  {
    id: "ch05-vid12",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID12",
    title: "Add a Sparkline & Data Bar to Your Report",
    duration: "20 mins",
    level: "Intermediate",
    skillsConnected: ["Sparkline Trendlines", "Data Bars within Table Cells", "Aligning Horizontal Axis across Rows", "Compact Dashboard Visuals"],
    objectives: [
      "Master sparkline trendlines in SQL Server.",
      "Master data bars within table cells in SQL Server.",
      "Master aligning horizontal axis across rows in SQL Server.",
      "Complete the practical exercise for Add a Sparkline & Data Bar to Your Report."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Add a Sparkline & Data Bar to Your Report' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Add a Sparkline & Data Bar to Your Report\n-- Video Code: CH05_VID12\nSELECT 'CH05_VID12' AS VideoCode, 'Add a Sparkline & Data Bar to Your Report' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid12-1", name: "Add a Sparkline & Data Bar to Your Report Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid12-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17621",
    microsoftDocTitle: "Sparklines and Data Bars (Report Builder and SSRS)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/sparklines-and-data-bars-report-builder-and-ssrs"
  },
  {
    id: "ch05-vid13",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID13",
    title: "How to Deploy Reports & Configure Report Server",
    duration: "23 mins",
    level: "Intermediate",
    skillsConnected: ["TargetServerURL Deployment", "SSDT Deploy Project", "Folder Structures & Item Permissions", "Data Source Credential Storage"],
    objectives: [
      "Master targetserverurl deployment in SQL Server.",
      "Master ssdt deploy project in SQL Server.",
      "Master folder structures & item permissions in SQL Server.",
      "Complete the practical exercise for How to Deploy Reports & Configure Report Server."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'How to Deploy Reports & Configure Report Server' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: How to Deploy Reports & Configure Report Server\n-- Video Code: CH05_VID13\nSELECT 'CH05_VID13' AS VideoCode, 'How to Deploy Reports & Configure Report Server' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid13-1", name: "How to Deploy Reports & Configure Report Server Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid13-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17622",
    microsoftDocTitle: "Publish Reports to a Report Server",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/reports/publish-reports-to-a-report-server"
  },
  {
    id: "ch05-vid14",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID14",
    title: "View Reports with a Browser (Report Builder and SSRS Portal)",
    duration: "21 mins",
    level: "Foundational",
    skillsConnected: ["Report Portal Web Interface", "Exporting to PDF / Excel / Word", "Subscription & Email Delivery", "Browser Rendering Engines"],
    objectives: [
      "Master report portal web interface in SQL Server.",
      "Master exporting to pdf / excel / word in SQL Server.",
      "Master subscription & email delivery in SQL Server.",
      "Complete the practical exercise for View Reports with a Browser (Report Builder and SSRS Portal)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'View Reports with a Browser (Report Builder and SSRS Portal)' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: View Reports with a Browser (Report Builder and SSRS Portal)\n-- Video Code: CH05_VID14\nSELECT 'CH05_VID14' AS VideoCode, 'View Reports with a Browser (Report Builder and SSRS Portal)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid14-1", name: "View Reports with a Browser (Report Builder and SSRS Portal) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid14-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17623",
    microsoftDocTitle: "Web Portal of a Report Server (SSRS Native Mode)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/web-portal-ssrs-native-mode"
  },
  {
    id: "ch05-vid15",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID15",
    title: "Create Custom Reports Using Microsoft RDLC Report Designer",
    duration: "24 mins",
    level: "Intermediate",
    skillsConnected: ["Local Report Definition (RDLC)", "Embedding Reports in .NET WinForms / Web", "ReportViewer Control", "Offline Client Rendering"],
    objectives: [
      "Master local report definition (rdlc) in SQL Server.",
      "Master embedding reports in .net winforms / web in SQL Server.",
      "Master reportviewer control in SQL Server.",
      "Complete the practical exercise for Create Custom Reports Using Microsoft RDLC Report Designer."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Create Custom Reports Using Microsoft RDLC Report Designer' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Create Custom Reports Using Microsoft RDLC Report Designer\n-- Video Code: CH05_VID15\nSELECT 'CH05_VID15' AS VideoCode, 'Create Custom Reports Using Microsoft RDLC Report Designer' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid15-1", name: "Create Custom Reports Using Microsoft RDLC Report Designer Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid15-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17624",
    microsoftDocTitle: "ReportViewer Controls in Visual Studio (RDLC)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/application-integration/integrating-reporting-services-using-reportviewer-controls"
  },
  {
    id: "ch05-vid16",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID16",
    title: "Link Parameters to Your Custom Report (RDLC & Code-Behind)",
    duration: "23 mins",
    level: "Intermediate",
    skillsConnected: ["ReportParameter Collection in C#", "Binding DataTable to ReportDataSource", "Programmatic Parameter Passing", "Print Dialog Automation"],
    objectives: [
      "Master reportparameter collection in c# in SQL Server.",
      "Master binding datatable to reportdatasource in SQL Server.",
      "Master programmatic parameter passing in SQL Server.",
      "Complete the practical exercise for Link Parameters to Your Custom Report (RDLC & Code-Behind)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Link Parameters to Your Custom Report (RDLC & Code-Behind)' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Link Parameters to Your Custom Report (RDLC & Code-Behind)\n-- Video Code: CH05_VID16\nSELECT 'CH05_VID16' AS VideoCode, 'Link Parameters to Your Custom Report (RDLC & Code-Behind)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid16-1", name: "Link Parameters to Your Custom Report (RDLC & Code-Behind) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid16-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17625",
    microsoftDocTitle: "Set Parameters on Local Reports (RDLC)",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/application-integration/integrating-reporting-services-using-reportviewer-controls"
  },
  {
    id: "ch05-vid17",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID17",
    title: "Data Warehousing Architecture & Enterprise Fundamentals",
    duration: "26 mins",
    level: "Foundational",
    skillsConnected: ["Corporate Information Factory (CIF)", "Enterprise Data Warehouse (EDW)", "Data Marts", "ETL/ELT Extraction Layers"],
    objectives: [
      "Master corporate information factory (cif) in SQL Server.",
      "Master enterprise data warehouse (edw) in SQL Server.",
      "Master data marts in SQL Server.",
      "Complete the practical exercise for Data Warehousing Architecture & Enterprise Fundamentals."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Data Warehousing Architecture & Enterprise Fundamentals' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Data Warehousing Architecture & Enterprise Fundamentals\n-- Video Code: CH05_VID17\nSELECT 'CH05_VID17' AS VideoCode, 'Data Warehousing Architecture & Enterprise Fundamentals' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid17-1", name: "Data Warehousing Architecture & Enterprise Fundamentals Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid17-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17626",
    microsoftDocTitle: "Data Warehousing Architecture Overview",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/relational-databases/data-warehouse-architectures"
  },
  {
    id: "ch05-vid18",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID18",
    title: "Difference Between OLAP and OLTP Systems",
    duration: "22 mins",
    level: "Foundational",
    skillsConnected: ["Normalized 3NF vs De-normalized Star", "Write-Optimized vs Read-Optimized", "Transaction Locks vs Columnar Scans", "Historical Time-Variant Data"],
    objectives: [
      "Master normalized 3nf vs de-normalized star in SQL Server.",
      "Master write-optimized vs read-optimized in SQL Server.",
      "Master transaction locks vs columnar scans in SQL Server.",
      "Complete the practical exercise for Difference Between OLAP and OLTP Systems."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Difference Between OLAP and OLTP Systems' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Difference Between OLAP and OLTP Systems\n-- Video Code: CH05_VID18\nSELECT 'CH05_VID18' AS VideoCode, 'Difference Between OLAP and OLTP Systems' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/01_oltp_source_schema.sql",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid18-1", name: "Difference Between OLAP and OLTP Systems Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid18-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/01_oltp_source_schema.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17627",
    microsoftDocTitle: "Comparing Online Analytical Processing (OLAP) and OLTP",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/azure/architecture/data-guide/relational-data/online-analytical-processing"
  },
  {
    id: "ch05-vid19",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID19",
    title: "Dimensional Modeling (Facts, Dimensions & Kimball Star)",
    duration: "28 mins",
    level: "Advanced",
    skillsConnected: ["Kimball Star Schema", "Fact Tables (Additive, Semi-Additive)", "Conformed Dimensions", "Surrogate Keys vs Natural Keys", "SCD Types 1, 2, 3"],
    objectives: [
      "Master kimball star schema in SQL Server.",
      "Master fact tables (additive, semi-additive) in SQL Server.",
      "Master conformed dimensions in SQL Server.",
      "Complete the practical exercise for Dimensional Modeling (Facts, Dimensions & Kimball Star)."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Dimensional Modeling (Facts, Dimensions & Kimball Star)' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Dimensional Modeling (Facts, Dimensions & Kimball Star)\n-- Video Code: CH05_VID19\nSELECT 'CH05_VID19' AS VideoCode, 'Dimensional Modeling (Facts, Dimensions & Kimball Star)' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid19-1", name: "Dimensional Modeling (Facts, Dimensions & Kimball Star) Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid19-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17628",
    microsoftDocTitle: "Dimensional Modeling and Star Schemas",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-tables-overview"
  },
  {
    id: "ch05-vid20",
    chapter: 5,
    chapterTitle: "Chapter 5: Reporting and Data Warehousing",
    videoCode: "CH05_VID20",
    title: "Assignment 05: Data Warehouse & Paginated Report Delivery",
    duration: "40 mins",
    level: "Advanced",
    skillsConnected: ["Kimball Star Schema Build", "SCD Type 2 Historical Lineage", "Production SSRS Tablix Report", "End-to-End Chapter 5 Capstone"],
    objectives: [
      "Master kimball star schema build in SQL Server.",
      "Master scd type 2 historical lineage in SQL Server.",
      "Master production ssrs tablix report in SQL Server.",
      "Complete the practical exercise for Assignment 05: Data Warehouse & Paginated Report Delivery."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Assignment 05: Data Warehouse & Paginated Report Delivery' as part of Chapter 5: Reporting and Data Warehousing. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Assignment 05: Data Warehouse & Paginated Report Delivery\n-- Video Code: CH05_VID20\nSELECT 'CH05_VID20' AS VideoCode, 'Assignment 05: Data Warehouse & Paginated Report Delivery' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql",
    challengeId: "ch-5",
    erdEntity: "Database",
    attachments: [
      { id: "att-ch05-vid20-1", name: "Assignment 05: Data Warehouse & Paginated Report Delivery Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-ch05-vid20-2", name: "Solution DDL / Script", type: "SQL", path: "src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17629",
    microsoftDocTitle: "Paginated Reports and Star Schema Integration",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/reporting-services/create-deploy-and-manage-mobile-and-paginated-reports"
  },
  // ==========================================
  // FINAL PROJECT: ENTERPRISE DATA PLATFORM CAPSTONE
  // ==========================================
  {
    id: "final-project",
    chapter: 6,
    chapterTitle: "Final Project: Enterprise Data Platform Capstone",
    videoCode: "FinalProject",
    title: "Final Enterprise Capstone Project: End-to-End Data Platform",
    duration: "60 mins",
    level: "Capstone",
    skillsConnected: ["Multi-Filegroup Architecture", "ACID Stored Procedures", "Sliding-Window Partitioning", "Kimball Star Schema", "Paginated SSRS Delivery", "DevOps Automated CI/CD"],
    objectives: [
      "Master multi-filegroup architecture in SQL Server.",
      "Master acid stored procedures in SQL Server.",
      "Master sliding-window partitioning in SQL Server.",
      "Complete the practical exercise for Final Enterprise Capstone Project: End-to-End Data Platform."
    ],
    description: "Eng. Rami Mohamed Abonagi presents 'Final Enterprise Capstone Project: End-to-End Data Platform' as part of Final Project: Enterprise Data Platform Capstone. Master core concepts, practical implementation in SSMS, and production database patterns.",
    sampleSql: `-- T-SQL Demo: Final Enterprise Capstone Project: End-to-End Data Platform\n-- Video Code: FinalProject\nSELECT 'FinalProject' AS VideoCode, 'Final Enterprise Capstone Project: End-to-End Data Platform' AS ModuleTitle, GETDATE() AS ExecutedAt;`,
    repoPath: "deploy.ps1",
    challengeId: "ch-6",
    erdEntity: "Database",
    attachments: [
      { id: "att-final-project-1", name: "Final Enterprise Capstone Project: End-to-End Data Platform Technical Guide", type: "DOC", path: "docs/ch01-case-study-erd-and-implementation.md" },
      { id: "att-final-project-2", name: "Solution DDL / Script", type: "SQL", path: "deploy.ps1" }
    ],
    maharatechUrl: "https://maharatech.gov.eg/mod/hvp/view.php?id=17630",
    microsoftDocTitle: "End-to-End SQL Server Architecture Capstone Guide",
    microsoftDocsUrl: "https://learn.microsoft.com/en-us/sql/sql-server/educational-curriculum"
  },
];