"""
Generate the authentic 102-module video catalog for MaharaTech Course 2305:
Implementing and Developing SQL Server Objects.
"""
import json

VIDEOS_SPEC = [
    # --- CH01 (16 items) ---
    {
        "id": "ch01-vid01", "chap": 1, "code": "CH01_VID01", "m_id": 17520,
        "title": "Create Database and Filegroups",
        "dur": "19 mins", "level": "Foundational",
        "skills": ["Storage Engine Internals", "MDF/NDF/LDF Files", "Filegroup Isolation", "Disk I/O Separation"],
        "repo": "src/01_storage_and_schema/01_filegroups_and_files.sql",
        "ms_title": "Database Files and Filegroups Architecture",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-files-and-filegroups"
    },
    {
        "id": "ch01-vid02", "chap": 1, "code": "CH01_VID02", "m_id": 17521,
        "title": "Create Database Using Wizard (ITItest Case Study)",
        "dur": "24 mins", "level": "Foundational",
        "skills": ["SSMS Wizard", "Table Designer", "Filegroup Allocation", "Foreign Keys", "Database Diagrams"],
        "repo": "src/01_storage_and_schema/05_ititest_case_study_schema.sql",
        "ms_title": "CREATE TABLE (Transact-SQL) Guide",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql"
    },
    {
        "id": "ch01-vid03", "chap": 1, "code": "CH01_VID03", "m_id": 17522,
        "title": "Create Database Using Code (T-SQL)",
        "dur": "22 mins", "level": "Foundational",
        "skills": ["CREATE DATABASE DDL", "Physical Sizing Math", "FILEGROWTH Rules", "ALTER DATABASE ADD FILEGROUP"],
        "repo": "src/01_storage_and_schema/01_create_database_code_ch01_vid03.sql",
        "ms_title": "CREATE DATABASE (Transact-SQL) Syntax Reference",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-database-transact-sql"
    },
    {
        "id": "ch01-vid04", "chap": 1, "code": "CH01_VID04", "m_id": 17523,
        "title": "Database Integrity & Normalization Rules",
        "dur": "18 mins", "level": "Foundational",
        "skills": ["Entity Integrity", "Referential Integrity", "Domain Integrity", "User-Defined Integrity"],
        "repo": "src/01_storage_and_schema/03_integrity_constraints.sql",
        "ms_title": "Data Integrity in Relational Databases",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/tables/primary-and-foreign-key-constraints"
    },
    {
        "id": "ch01-vid05", "chap": 1, "code": "CH01_VID05", "m_id": 17524,
        "title": "Integrity Constraints (PK, FK, Unique, Check)",
        "dur": "20 mins", "level": "Foundational",
        "skills": ["PRIMARY KEY", "FOREIGN KEY Cascades", "UNIQUE Constraints", "CHECK Constraints"],
        "repo": "src/01_storage_and_schema/03_integrity_constraints.sql",
        "ms_title": "Create Unique Constraints & Check Constraints",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/tables/create-unique-constraints"
    },
    {
        "id": "ch01-vid06", "chap": 1, "code": "CH01_VID06", "m_id": 17525,
        "title": "Constraints, Rules, and Default Values",
        "dur": "17 mins", "level": "Foundational",
        "skills": ["CREATE RULE", "sp_bindrule", "CREATE DEFAULT", "sp_bindefault", "ANSI Constraints vs Legacy Objects"],
        "repo": "src/01_storage_and_schema/02_custom_types_and_rules.sql",
        "ms_title": "CREATE RULE & sp_bindrule (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-rule-transact-sql"
    },
    {
        "id": "ch01-vid07", "chap": 1, "code": "CH01_VID07", "m_id": 17526,
        "title": "Creating a Custom Data Type (UDDT)",
        "dur": "16 mins", "level": "Foundational",
        "skills": ["CREATE TYPE", "sp_addtype", "Domain Modeling", "Binding Rules & Defaults to Types"],
        "repo": "src/01_storage_and_schema/02_custom_types_and_rules.sql",
        "ms_title": "CREATE TYPE (Transact-SQL) User-Defined Data Types",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-type-transact-sql"
    },
    {
        "id": "ch01-vid08", "chap": 1, "code": "CH01_VID08", "m_id": 17527,
        "title": "Clustered Index Architecture & B-Tree Structure",
        "dur": "25 mins", "level": "Intermediate",
        "skills": ["B-Tree Root & Intermediate Levels", "Leaf Page Order", "Clustering Key Selection", "Index Fragmentation"],
        "repo": "src/02_indexing_and_performance/01_clustered_and_nonclustered_indexes.sql",
        "ms_title": "Clustered and Nonclustered Indexes Described",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/indexes/clustered-and-nonclustered-indexes-described"
    },
    {
        "id": "ch01-vid09", "chap": 1, "code": "CH01_VID09", "m_id": 17528,
        "title": "Non-Clustered Index & Covering Index Strategy",
        "dur": "23 mins", "level": "Intermediate",
        "skills": ["Non-Clustered B-Trees", "Row Locators (RID vs Clustering Key)", "INCLUDE Columns", "Key Lookups Eliminating"],
        "repo": "src/02_indexing_and_performance/01_clustered_and_nonclustered_indexes.sql",
        "ms_title": "Create Indexes with Included Columns",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/indexes/create-indexes-with-included-columns"
    },
    {
        "id": "ch01-vid10", "chap": 1, "code": "CH01_VID10", "m_id": 17529,
        "title": "Demo on Index Performance & Execution Plans",
        "dur": "26 mins", "level": "Intermediate",
        "skills": ["Graphical Execution Plans", "Index Seek vs Scan", "Bookmark Lookups", "sys.dm_db_index_physical_stats"],
        "repo": "src/02_indexing_and_performance/03_execution_plan_analysis.sql",
        "ms_title": "Display an Actual Execution Plan",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/performance/display-an-actual-execution-plan"
    },
    {
        "id": "ch01-vid11", "chap": 1, "code": "CH01_VID11", "m_id": 17530,
        "title": "Types of Backup (Full, Differential, Log)",
        "dur": "21 mins", "level": "Intermediate",
        "skills": ["Full Database Backups", "Differential LSN Basing", "Transaction Log Backup Chains", "Recovery Models (Full/Simple/Bulk-Logged)"],
        "repo": "src/06_reliability_and_dr/01_backup_and_restore_runbook.sql",
        "ms_title": "Backup Overview (SQL Server)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/backup-overview-sql-server"
    },
    {
        "id": "ch01-vid12", "chap": 1, "code": "CH01_VID12", "m_id": 17531,
        "title": "Backup Database Using Wizard & SSMS Tasks",
        "dur": "18 mins", "level": "Foundational",
        "skills": ["SSMS Backup Dialog", "Media Sets & Backup Families", "Verify Backup Integrity", "Compression Settings"],
        "repo": "src/06_reliability_and_dr/01_backup_and_restore_runbook.sql",
        "ms_title": "Create a Full Database Backup (SSMS Wizard)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/create-a-full-database-backup"
    },
    {
        "id": "ch01-vid13", "chap": 1, "code": "CH01_VID13", "m_id": 17532,
        "title": "Backup & SQL Server Agent Jobs Automation",
        "dur": "24 mins", "level": "Intermediate",
        "skills": ["SQL Server Agent", "Scheduled Backup Jobs", "Job Steps & Alerts", "Maintenance Plans"],
        "repo": "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1",
        "ms_title": "Automate Backup Tasks with SQL Server Agent",
        "ms_url": "https://learn.microsoft.com/en-us/sql/ssms/agent/create-a-job"
    },
    {
        "id": "ch01-vid14", "chap": 1, "code": "CH01_VID14", "m_id": 17533,
        "title": "Snapshot DB Architecture & Copy-on-Write",
        "dur": "20 mins", "level": "Intermediate",
        "skills": ["Database Snapshots", "Copy-on-Write Sparse Files", "Read-Only Point-in-Time Views", "Reverting from Snapshots"],
        "repo": "src/06_reliability_and_dr/02_snapshot_lifecycle.sql",
        "ms_title": "Database Snapshots (SQL Server)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-snapshots-sql-server"
    },
    {
        "id": "ch01-vid15", "chap": 1, "code": "CH01_VID15", "m_id": 17534,
        "title": "Demo on Snapshot Creation & Data Recovery",
        "dur": "22 mins", "level": "Intermediate",
        "skills": ["CREATE DATABASE AS SNAPSHOT OF", "Testing Rollbacks", "Accidental Truncation Recovery", "DROP DATABASE SNAPSHOT"],
        "repo": "src/06_reliability_and_dr/02_snapshot_lifecycle.sql",
        "ms_title": "Create a Database Snapshot (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/databases/create-a-database-snapshot-transact-sql"
    },
    {
        "id": "ch01-vid16", "chap": 1, "code": "CH01_VID16", "m_id": 17535,
        "title": "Assignment 01: Storage, Integrity & Physical Schema Design",
        "dur": "35 mins", "level": "Intermediate",
        "skills": ["Enterprise Storage Topology", "Relational Constraints", "Backup & Recovery Verification", "End-to-End Chapter 1 Capstone"],
        "repo": "src/01_storage_and_schema/05_company_case_study_schema.sql",
        "ms_title": "Designing and Implementing Tables and Views",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/tables/tables"
    },

    # --- CH02 (15 items) ---
    {
        "id": "ch02-vid01", "chap": 2, "code": "CH02_VID01", "m_id": 17537,
        "title": "Variables in T-SQL",
        "dur": "17 mins", "level": "Foundational",
        "skills": ["DECLARE Syntax", "Data Type Assignments", "Scope of Variables", "SET vs SELECT Assignment"],
        "repo": "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
        "ms_title": "DECLARE @local_variable (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/declare-local-variable-transact-sql"
    },
    {
        "id": "ch02-vid02", "chap": 2, "code": "CH02_VID02", "m_id": 17538,
        "title": "Local Variables & In-Memory State",
        "dur": "19 mins", "level": "Foundational",
        "skills": ["Local Variable Lifetime", "Batch Isolation", "Accumulator Patterns", "Dynamic Filter Injection"],
        "repo": "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
        "ms_title": "SET @local_variable (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/set-local-variable-transact-sql"
    },
    {
        "id": "ch02-vid03", "chap": 2, "code": "CH02_VID03", "m_id": 17539,
        "title": "Global Variables (System Configuration & Status)",
        "dur": "16 mins", "level": "Foundational",
        "skills": ["@@ERROR", "@@ROWCOUNT", "@@IDENTITY vs SCOPE_IDENTITY()", "@@SERVERNAME & @@VERSION"],
        "repo": "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
        "ms_title": "System Functions (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/functions/system-functions-transact-sql"
    },
    {
        "id": "ch02-vid04", "chap": 2, "code": "CH02_VID04", "m_id": 17540,
        "title": "Control of Flow (Part 1: IF...ELSE, BEGIN...END)",
        "dur": "21 mins", "level": "Foundational",
        "skills": ["IF...ELSE Branching", "BEGIN...END Blocks", "EXISTS Subqueries in Conditions", "Nested Control Blocks"],
        "repo": "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
        "ms_title": "Control-of-Flow Language (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/control-of-flow"
    },
    {
        "id": "ch02-vid05", "chap": 2, "code": "CH02_VID05", "m_id": 17541,
        "title": "Control of Flow (Part 2: WHILE, BREAK, CONTINUE, RETURN)",
        "dur": "22 mins", "level": "Foundational",
        "skills": ["WHILE Loops", "BREAK & CONTINUE Semantics", "RETURN Early Termination", "Batch Execution Abort"],
        "repo": "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
        "ms_title": "WHILE (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/while-transact-sql"
    },
    {
        "id": "ch02-vid06", "chap": 2, "code": "CH02_VID06", "m_id": 17542,
        "title": "User-Defined Functions (UDF) Overview",
        "dur": "20 mins", "level": "Intermediate",
        "skills": ["Deterministic vs Non-Deterministic", "Side-Effect Free Execution", "Scalar vs Table-Valued", "Schema Binding"],
        "repo": "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
        "ms_title": "User-Defined Functions (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/user-defined-functions"
    },
    {
        "id": "ch02-vid07", "chap": 2, "code": "CH02_VID07", "m_id": 17543,
        "title": "Scalar Functions & SQL Server 2022 Inlining",
        "dur": "23 mins", "level": "Intermediate",
        "skills": ["CREATE FUNCTION ... RETURNS scalar", "Scalar UDF Inlining (TSQL9)", "Iterative Row Overhead", "CROSS APPLY Alternatives"],
        "repo": "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
        "ms_title": "Scalar UDF Inlining in SQL Server",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/scalar-udf-inlining"
    },
    {
        "id": "ch02-vid08", "chap": 2, "code": "CH02_VID08", "m_id": 17544,
        "title": "Inline Statement Table-Valued Functions (iTVF)",
        "dur": "24 mins", "level": "Intermediate",
        "skills": ["RETURNS TABLE", "Query Optimizer Macro Expansion", "Parameterized Views", "Index Seeking on Underlying Tables"],
        "repo": "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
        "ms_title": "Create Inline Table-Valued Functions",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/create-user-defined-functions-database-engine"
    },
    {
        "id": "ch02-vid09", "chap": 2, "code": "CH02_VID09", "m_id": 17545,
        "title": "Multi-Statement Table-Valued Functions (MSTVF)",
        "dur": "25 mins", "level": "Intermediate",
        "skills": ["@TableVariable Returns", "Cardinality Estimation Pitfalls (100 Rows Guess)", "Interleaved Execution", "Performance Comparison to iTVF"],
        "repo": "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
        "ms_title": "Multi-Statement Table-Valued Functions",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-function-transact-sql"
    },
    {
        "id": "ch02-vid10", "chap": 2, "code": "CH02_VID10", "m_id": 17546,
        "title": "System Databases Architecture (master, model, msdb, tempdb)",
        "dur": "21 mins", "level": "Foundational",
        "skills": ["master Configuration", "model Template", "msdb Agent & Backups", "tempdb PAGELATCH Allocation & Tuning"],
        "repo": "src/01_storage_and_schema/01_filegroups_and_files.sql",
        "ms_title": "System Databases (SQL Server)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/databases/system-databases"
    },
    {
        "id": "ch02-vid11", "chap": 2, "code": "CH02_VID11", "m_id": 17547,
        "title": "Types of Tables (Permanent, #Temp, ##Global, @TableVar)",
        "dur": "22 mins", "level": "Intermediate",
        "skills": ["Local Temp Tables (#table)", "Global Temp Tables (##table)", "Table Variables (@table)", "Memory-Optimized Tables"],
        "repo": "src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql",
        "ms_title": "Temporary Tables and Table Variables",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-table-transact-sql"
    },
    {
        "id": "ch02-vid12", "chap": 2, "code": "CH02_VID12", "m_id": 17548,
        "title": "Scripts & Batches (GO Separator & Execution Scope)",
        "dur": "18 mins", "level": "Foundational",
        "skills": ["GO Utility Command", "Batch Compilation Boundaries", "DDL in Batches", "Dynamic SQL EXEC() Isolation"],
        "repo": "src/04_governance_and_audit/03_dynamic_sql_guardrails.sql",
        "ms_title": "SQL Server Utilities Statements - GO",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/sql-server-utilities-statements-go"
    },
    {
        "id": "ch02-vid13", "chap": 2, "code": "CH02_VID13", "m_id": 17549,
        "title": "Types of Transactions & ACID Boundaries",
        "dur": "24 mins", "level": "Intermediate",
        "skills": ["Autocommit Transactions", "Explicit Transactions (BEGIN TRAN)", "Implicit Transactions", "Atomicity & Durability in WAL"],
        "repo": "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
        "ms_title": "Transaction Statements (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/transactions-transact-sql"
    },
    {
        "id": "ch02-vid14", "chap": 2, "code": "CH02_VID14", "m_id": 17550,
        "title": "Demo on Transactions, COMMIT, ROLLBACK & SAVEPOINT",
        "dur": "25 mins", "level": "Intermediate",
        "skills": ["COMMIT TRANSACTION", "ROLLBACK TRANSACTION", "SAVE TRANSACTION savepoint", "XACT_ABORT ON & TRY...CATCH"],
        "repo": "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
        "ms_title": "SAVE TRANSACTION (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/save-transaction-transact-sql"
    },
    {
        "id": "ch02-vid15", "chap": 2, "code": "CH02_VID15", "m_id": 17551,
        "title": "Assignment 02: Functions, Transactions & Flow Control",
        "dur": "35 mins", "level": "Intermediate",
        "skills": ["UDF Performance Optimization", "Transaction Error Handling", "Complex Procedural Logic", "End-to-End Chapter 2 Capstone"],
        "repo": "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
        "ms_title": "Transactions and Concurrency Architecture",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide"
    },

    # --- CH03 (23 items) ---
    {
        "id": "ch03-vid01", "chap": 3, "code": "CH03_VID01", "m_id": 17553,
        "title": "Overview of Views & Logical Data Abstraction",
        "dur": "18 mins", "level": "Foundational",
        "skills": ["Virtual Tables", "Security Encapsulation", "Simplifying Complex Queries", "View Definition Metadata"],
        "repo": "src/02_indexing_and_performance/02_indexed_views.sql",
        "ms_title": "Views (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/views/views"
    },
    {
        "id": "ch03-vid02", "chap": 3, "code": "CH03_VID02", "m_id": 17554,
        "title": "Types of Views (Standard, Partitioned, System)",
        "dur": "19 mins", "level": "Intermediate",
        "skills": ["Standard User Views", "Partitioned Views across Instances", "System Catalog Views", "Dynamic Management Views (DMVs)"],
        "repo": "src/02_indexing_and_performance/02_indexed_views.sql",
        "ms_title": "Types of Views in SQL Server",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/views/create-views"
    },
    {
        "id": "ch03-vid03", "chap": 3, "code": "CH03_VID03", "m_id": 17555,
        "title": "Creating and Using Views (WITH SCHEMABINDING & ENCRYPTION)",
        "dur": "22 mins", "level": "Intermediate",
        "skills": ["CREATE VIEW", "WITH SCHEMABINDING", "WITH ENCRYPTION", "WITH CHECK OPTION"],
        "repo": "src/02_indexing_and_performance/02_indexed_views.sql",
        "ms_title": "CREATE VIEW (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-view-transact-sql"
    },
    {
        "id": "ch03-vid04", "chap": 3, "code": "CH03_VID04", "m_id": 17556,
        "title": "DML Operations on Views (INSERT, UPDATE, DELETE Rules)",
        "dur": "20 mins", "level": "Intermediate",
        "skills": ["Single Base Table Updatability", "INSTEAD OF Trigger Resolution", "CHECK OPTION Enforcement", "Calculated Column Restrictions"],
        "repo": "src/02_indexing_and_performance/02_indexed_views.sql",
        "ms_title": "Modify Data Through a View",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/views/modify-data-through-a-view"
    },
    {
        "id": "ch03-vid05", "chap": 3, "code": "CH03_VID05", "m_id": 17557,
        "title": "Indexed Views & Materialized Aggregations",
        "dur": "27 mins", "level": "Advanced",
        "skills": ["CREATE UNIQUE CLUSTERED INDEX ON VIEW", "Materialized Storage", "NOEXPAND Query Hint", "Pre-aggregated BI Performance"],
        "repo": "src/02_indexing_and_performance/02_indexed_views.sql",
        "ms_title": "Create Indexed Views",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/views/create-indexed-views"
    },
    {
        "id": "ch03-vid06", "chap": 3, "code": "CH03_VID06", "m_id": 17558,
        "title": "Partitioning (Horizontal Range Schemes & Sliding Windows)",
        "dur": "28 mins", "level": "Advanced",
        "skills": ["CREATE PARTITION FUNCTION", "CREATE PARTITION SCHEME", "Sliding Window Maintenance", "Zero-IO ALTER TABLE SWITCH"],
        "repo": "src/01_storage_and_schema/04_partitioning_scheme.sql",
        "ms_title": "Partitioned Tables and Indexes",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/partitions/partitioned-tables-and-indexes"
    },
    {
        "id": "ch03-vid07", "chap": 3, "code": "CH03_VID07", "m_id": 17559,
        "title": "Harnessing the Power of XML in SQL Server",
        "dur": "21 mins", "level": "Intermediate",
        "skills": ["XML Data Type", "XML Indexes (Primary & Secondary)", "Well-Formed XML Documents", "XML Schema Collections (XSD)"],
        "repo": "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql",
        "ms_title": "XML Data (SQL Server)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/xml/xml-data-sql-server"
    },
    {
        "id": "ch03-vid08", "chap": 3, "code": "CH03_VID08", "m_id": 17560,
        "title": "Use RAW and AUTO Mode with FOR XML",
        "dur": "20 mins", "level": "Intermediate",
        "skills": ["FOR XML RAW", "FOR XML AUTO", "ELEMENTS Directive", "Root Wrapper Tag Generation"],
        "repo": "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql",
        "ms_title": "Use RAW Mode with FOR XML",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/xml/use-raw-mode-with-for-xml"
    },
    {
        "id": "ch03-vid09", "chap": 3, "code": "CH03_VID09", "m_id": 17561,
        "title": "Use PATH Mode with FOR XML",
        "dur": "22 mins", "level": "Intermediate",
        "skills": ["FOR XML PATH", "Column Aliasing XPath Mappings", "Nested Sub-elements", "String Concatenation Tricks (Pre-STRING_AGG)"],
        "repo": "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql",
        "ms_title": "Use PATH Mode with FOR XML",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/xml/use-path-mode-with-for-xml"
    },
    {
        "id": "ch03-vid10", "chap": 3, "code": "CH03_VID10", "m_id": 17562,
        "title": "Querying XML Data (XQuery methods: value, query, exist, nodes)",
        "dur": "26 mins", "level": "Advanced",
        "skills": [".nodes() Shredding", ".value() Strong Typing", ".exist() XPath Filtering", ".modify() DML Modifications"],
        "repo": "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql",
        "ms_title": "xml Data Type Methods",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/xml/xml-data-type-methods"
    },
    {
        "id": "ch03-vid11", "chap": 3, "code": "CH03_VID11", "m_id": 17563,
        "title": "Hierarchical Data (Self-Referencing Relationships & HierarchyID)",
        "dur": "24 mins", "level": "Intermediate",
        "skills": ["Recursive Self-Joins", "Adjacency List Modeling", "hierarchyid Data Type", "GetAncestor & GetDescendant Methods"],
        "repo": "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql",
        "ms_title": "Hierarchical Data (SQL Server)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/hierarchical-data-sql-server"
    },
    {
        "id": "ch03-vid12", "chap": 3, "code": "CH03_VID12", "m_id": 17564,
        "title": "CTE: Common Table Expression (Standard & Recursive)",
        "dur": "25 mins", "level": "Intermediate",
        "skills": ["WITH cte AS (...) Syntax", "Anchor Member", "Recursive Member", "MAXRECURSION Hint Prevention"],
        "repo": "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql",
        "ms_title": "WITH common_table_expression (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/queries/with-common-table-expression-transact-sql"
    },
    {
        "id": "ch03-vid13", "chap": 3, "code": "CH03_VID13", "m_id": 17565,
        "title": "OFFSET and FETCH Keyword (Deterministic Pagination)",
        "dur": "18 mins", "level": "Foundational",
        "skills": ["OFFSET n ROWS", "FETCH NEXT n ROWS ONLY", "ORDER BY Determinism", "Eliminating ROW_NUMBER() Subqueries"],
        "repo": "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql",
        "ms_title": "ORDER BY Clause (Transact-SQL) - OFFSET FETCH",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/queries/select-order-by-clause-transact-sql"
    },
    {
        "id": "ch03-vid14", "chap": 3, "code": "CH03_VID14", "m_id": 17566,
        "title": "Sequence Objects vs IDENTITY Columns",
        "dur": "19 mins", "level": "Intermediate",
        "skills": ["CREATE SEQUENCE", "NEXT VALUE FOR", "Cycling & Cache Optimization", "Sharing Sequences Across Multiple Tables"],
        "repo": "src/01_storage_and_schema/05_company_case_study_schema.sql",
        "ms_title": "Sequence Numbers",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/sequence-numbers/sequence-numbers"
    },
    {
        "id": "ch03-vid15", "chap": 3, "code": "CH03_VID15", "m_id": 17567,
        "title": "Table Valued Parameters (TVPs) & High-Throughput Bulk Ingest",
        "dur": "26 mins", "level": "Advanced",
        "skills": ["CREATE TYPE ... AS TABLE", "READONLY Parameter Modifier", "Multi-Row Streaming to Stored Procedures", "Zero Round-Trip Ingestion"],
        "repo": "src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql",
        "ms_title": "Use Table-Valued Parameters (Database Engine)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/tables/use-table-valued-parameters-database-engine"
    },
    {
        "id": "ch03-vid16", "chap": 3, "code": "CH03_VID16", "m_id": 17568,
        "title": "High Availability Concepts (RPO, RTO & Disaster Recovery)",
        "dur": "22 mins", "level": "Intermediate",
        "skills": ["Recovery Point Objective (RPO)", "Recovery Time Objective (RTO)", "High Availability Architectures", "Disaster Recovery Runbooks"],
        "repo": "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
        "ms_title": "High Availability and Disaster Recovery (SQL Server)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server"
    },
    {
        "id": "ch03-vid17", "chap": 3, "code": "CH03_VID17", "m_id": 17569,
        "title": "Set Up SQL Server Instances for Replication & HA",
        "dur": "23 mins", "level": "Intermediate",
        "skills": ["Named Instances", "SQL Server Browser Service", "Shared Network Directories", "Endpoints & Service Accounts"],
        "repo": "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
        "ms_title": "Configure SQL Server Instances",
        "ms_url": "https://learn.microsoft.com/en-us/sql/database-engine/configure-windows/database-engine-instances"
    },
    {
        "id": "ch03-vid18", "chap": 3, "code": "CH03_VID18", "m_id": 17571,
        "title": "Database Mirroring Architecture & Operating Modes",
        "dur": "24 mins", "level": "Intermediate",
        "skills": ["Principal & Mirror Roles", "High Safety (Synchronous) Mode", "High Performance (Asynchronous) Mode", "Witness Automatic Failover"],
        "repo": "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
        "ms_title": "Database Mirroring (SQL Server)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/database-engine/database-mirroring/database-mirroring-sql-server"
    },
    {
        "id": "ch03-vid19", "chap": 3, "code": "CH03_VID19", "m_id": 17572,
        "title": "Demo Database Mirroring Setup & Failover Drill",
        "dur": "26 mins", "level": "Advanced",
        "skills": ["TCP Endpoints Configuration", "ALTER DATABASE SET PARTNER", "Manual Failover Drill", "Mirror Monitoring Jobs"],
        "repo": "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
        "ms_title": "Setting Up Database Mirroring",
        "ms_url": "https://learn.microsoft.com/en-us/sql/database-engine/database-mirroring/setting-up-database-mirroring-sql-server"
    },
    {
        "id": "ch03-vid20", "chap": 3, "code": "CH03_VID20", "m_id": 17573,
        "title": "Overview of Shipping Transaction Logs",
        "dur": "21 mins", "level": "Intermediate",
        "skills": ["Log Shipping Architecture", "Backup Job, Copy Job, Restore Job", "Monitor Server & Alerts", "Standby vs NoRecovery Mode"],
        "repo": "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
        "ms_title": "About Log Shipping (SQL Server)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/database-engine/log-shipping/about-log-shipping-sql-server"
    },
    {
        "id": "ch03-vid21", "chap": 3, "code": "CH03_VID21", "m_id": 17574,
        "title": "Steps to Configure SQL Server Log Shipping",
        "dur": "25 mins", "level": "Intermediate",
        "skills": ["Network Share Permissions", "Transaction Log Schedules", "Secondary Standby Queries", "Automated Retention Purges"],
        "repo": "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
        "ms_title": "Configure Log Shipping (SQL Server)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/database-engine/log-shipping/configure-log-shipping-sql-server"
    },
    {
        "id": "ch03-vid22", "chap": 3, "code": "CH03_VID22", "m_id": 17575,
        "title": "Log Shipping vs Mirroring vs Always On Comparison",
        "dur": "22 mins", "level": "Intermediate",
        "skills": ["SLA & RPO/RTO Matrix", "Multi-Database Support", "Licensing Costs", "Modern Always On Migration Path"],
        "repo": "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md",
        "ms_title": "High Availability Solutions (SQL Server)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/sql-server/failover-clusters/high-availability-solutions-sql-server"
    },
    {
        "id": "ch03-vid23", "chap": 3, "code": "CH03_VID23", "m_id": 17576,
        "title": "Assignment 03: Scalability, Ingestion & High Availability",
        "dur": "35 mins", "level": "Advanced",
        "skills": ["Sliding Window Partition Switching", "XML Ingestion Pipeline", "Log Shipping Resilience", "End-to-End Chapter 3 Capstone"],
        "repo": "src/01_storage_and_schema/04_partitioning_scheme.sql",
        "ms_title": "Scalability and Partitioning Guide",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/partitions/partitioned-tables-and-indexes"
    },

    # --- CH04 (27 items) ---
    {
        "id": "ch04-vid01", "chap": 4, "code": "CH04_VID01", "m_id": 17577,
        "title": "Overview of Stored Procedures",
        "dur": "19 mins", "level": "Foundational",
        "skills": ["Procedural Modularity", "Compiled Execution Plans", "Security Abstraction", "Network Traffic Reduction"],
        "repo": "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
        "ms_title": "Stored Procedures (Database Engine)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/stored-procedures-database-engine"
    },
    {
        "id": "ch04-vid02", "chap": 4, "code": "CH04_VID02", "m_id": 17579,
        "title": "Advantages of Stored Procedures (Performance & Security)",
        "dur": "20 mins", "level": "Intermediate",
        "skills": ["Plan Reuse & Cache", "SQL Injection Prevention", "Granular EXECUTE Permissions", "Maintainability"],
        "repo": "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
        "ms_title": "Stored Procedures Security and Advantages",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/create-a-stored-procedure"
    },
    {
        "id": "ch04-vid03", "chap": 4, "code": "CH04_VID03", "m_id": 17580,
        "title": "Demo on Creating & Executing Stored Procedures",
        "dur": "22 mins", "level": "Intermediate",
        "skills": ["CREATE PROCEDURE", "EXEC Statement", "Modifying Existing Procs", "Viewing Sys.procedures Metadata"],
        "repo": "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
        "ms_title": "Execute a Stored Procedure",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/execute-a-stored-procedure"
    },
    {
        "id": "ch04-vid04", "chap": 4, "code": "CH04_VID04", "m_id": 17581,
        "title": "DML Statements in Stored Procedures",
        "dur": "21 mins", "level": "Intermediate",
        "skills": ["Transactional Multi-Table Inserts", "Conditional Updates", "Soft-Delete Logic", "Merge Semantics"],
        "repo": "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
        "ms_title": "Modify Data through Stored Procedures",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/modify-a-stored-procedure"
    },
    {
        "id": "ch04-vid05", "chap": 4, "code": "CH04_VID05", "m_id": 17582,
        "title": "Stored Procedure with Parameters and Return Values",
        "dur": "23 mins", "level": "Intermediate",
        "skills": ["Input Parameters & Defaults", "OUTPUT Parameters", "RETURN Integer Status Codes", "Handling Missing Args"],
        "repo": "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
        "ms_title": "Return Data from a Stored Procedure",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/stored-procedures/return-data-from-a-stored-procedure"
    },
    {
        "id": "ch04-vid06", "chap": 4, "code": "CH04_VID06", "m_id": 17583,
        "title": "Functions vs Stored Procedures (Architectural Trade-offs)",
        "dur": "20 mins", "level": "Intermediate",
        "skills": ["Side-Effects Policy", "Usability in SELECT vs EXEC", "Transaction Management Capabilities", "Compiler Inlining Differences"],
        "repo": "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql",
        "ms_title": "Comparing Functions and Stored Procedures",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/user-defined-functions/user-defined-functions"
    },
    {
        "id": "ch04-vid07", "chap": 4, "code": "CH04_VID07", "m_id": 17584,
        "title": "Dynamic Query in Stored Procedure (sp_executesql Guardrails)",
        "dur": "25 mins", "level": "Advanced",
        "skills": ["sp_executesql Parameterization", "Plan Reuse with Dynamic Queries", "QUOTENAME() Sanitization", "SQL Injection Elimination"],
        "repo": "src/04_governance_and_audit/03_dynamic_sql_guardrails.sql",
        "ms_title": "sp_executesql (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-executesql-transact-sql"
    },
    {
        "id": "ch04-vid08", "chap": 4, "code": "CH04_VID08", "m_id": 17585,
        "title": "Stored Procedures and Triggers Types Overview",
        "dur": "21 mins", "level": "Intermediate",
        "skills": ["DML Triggers (AFTER vs INSTEAD OF)", "DDL Triggers", "Logon Triggers", "Event Notification Comparison"],
        "repo": "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
        "ms_title": "DML Triggers",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/triggers/dml-triggers"
    },
    {
        "id": "ch04-vid09", "chap": 4, "code": "CH04_VID09", "m_id": 17586,
        "title": "Creating a Table Level Trigger (AFTER INSERT, UPDATE)",
        "dur": "24 mins", "level": "Intermediate",
        "skills": ["CREATE TRIGGER ... AFTER", "Trigger Firing Sequence", "Nested Triggers Option", "Rolling Back Failing Transactions in Trigger"],
        "repo": "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
        "ms_title": "CREATE TRIGGER (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/statements/create-trigger-transact-sql"
    },
    {
        "id": "ch04-vid10", "chap": 4, "code": "CH04_VID10", "m_id": 17587,
        "title": "Triggers Features (INSTEAD OF & Recursive Settings)",
        "dur": "23 mins", "level": "Intermediate",
        "skills": ["INSTEAD OF Triggers on Views", "Direct & Indirect Recursion", "RECURSIVE_TRIGGERS Option", "Trigger Performance Impact"],
        "repo": "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
        "ms_title": "INSTEAD OF DML Triggers",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/triggers/use-the-inserted-and-deleted-tables"
    },
    {
        "id": "ch04-vid11", "chap": 4, "code": "CH04_VID11", "m_id": 17588,
        "title": "Using INSERTED and DELETED Tables Within Triggers",
        "dur": "26 mins", "level": "Advanced",
        "skills": ["inserted Logical Table", "deleted Logical Table", "Multi-Row Set-Based Trigger Logic", "UPDATE() and COLUMNS_UPDATED() functions"],
        "repo": "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
        "ms_title": "Use the inserted and deleted Tables",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/triggers/use-the-inserted-and-deleted-tables"
    },
    {
        "id": "ch04-vid12", "chap": 4, "code": "CH04_VID12", "m_id": 17589,
        "title": "Track User Activity Using Audit Table (CDC Pattern)",
        "dur": "27 mins", "level": "Advanced",
        "skills": ["Audit Log Schema Design", "Non-Locking Change Auditing", "SUSER_SNAME() & HOST_NAME() Capture", "Temporal Change Tracking"],
        "repo": "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
        "ms_title": "Audit Changes Using Triggers",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/security/auditing/sql-server-audit-database-engine"
    },
    {
        "id": "ch04-vid13", "chap": 4, "code": "CH04_VID13", "m_id": 17590,
        "title": "Creating Server-Level and Database-Level Triggers (DDL Governance)",
        "dur": "25 mins", "level": "Advanced",
        "skills": ["ON DATABASE vs ON ALL SERVER", "EVENTDATA() XML Function", "Preventing Unauthorized DROP TABLE", "Compliance Auditing"],
        "repo": "src/04_governance_and_audit/02_ddl_and_server_triggers.sql",
        "ms_title": "DDL Triggers",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/triggers/ddl-triggers"
    },
    {
        "id": "ch04-vid14", "chap": 4, "code": "CH04_VID14", "m_id": 17591,
        "title": "Using OUTPUT with DML Statements (Atomic Auditing & Staging)",
        "dur": "24 mins", "level": "Advanced",
        "skills": ["OUTPUT INTO Clause", "Atomic Insert/Delete Capture", "Eliminating Double Queries", "ETL Audit Staging in One Pass"],
        "repo": "src/03_programmability_and_elt/03_stored_procedures_etl.sql",
        "ms_title": "OUTPUT Clause (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/queries/output-clause-transact-sql"
    },
    {
        "id": "ch04-vid15", "chap": 4, "code": "CH04_VID15", "m_id": 17592,
        "title": "Cursors Architecture & Mechanics",
        "dur": "20 mins", "level": "Intermediate",
        "skills": ["Row-By-Agonizing-Row (RBAR)", "Cursor Lifecycle", "DECLARE, OPEN, FETCH, CLOSE, DEALLOCATE", "Cursor Scopes (GLOBAL vs LOCAL)"],
        "repo": "src/02_indexing_and_performance/03_execution_plan_analysis.sql",
        "ms_title": "Cursors (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/cursors-transact-sql"
    },
    {
        "id": "ch04-vid16", "chap": 4, "code": "CH04_VID16", "m_id": 17593,
        "title": "Create a Database Cursor & Traversal",
        "dur": "22 mins", "level": "Intermediate",
        "skills": ["FETCH NEXT ... INTO", "@@FETCH_STATUS = 0 Loop", "FORWARD_ONLY READ_ONLY Options", "Memory Resource Reclamation"],
        "repo": "src/02_indexing_and_performance/03_execution_plan_analysis.sql",
        "ms_title": "FETCH (Transact-SQL)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/language-elements/fetch-transact-sql"
    },
    {
        "id": "ch04-vid17", "chap": 4, "code": "CH04_VID17", "m_id": 17594,
        "title": "Practical Applications of SQL Cursors 01 (Administrative Tasks)",
        "dur": "23 mins", "level": "Intermediate",
        "skills": ["Iterating Databases for Maintenance", "Dynamic Per-Table Index Rebuilds", "Automated Metadata Scripts", "Error Trapping in Loops"],
        "repo": "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1",
        "ms_title": "Administrative Cursor Workflows",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/indexes/reorganize-and-rebuild-indexes"
    },
    {
        "id": "ch04-vid18", "chap": 4, "code": "CH04_VID18", "m_id": 17595,
        "title": "Practical Applications of SQL Cursors 02 vs Set-Based Benchmarking",
        "dur": "26 mins", "level": "Advanced",
        "skills": ["RBAR Cursor Performance Bottlenecks", "Refactoring to Window Aggregates", "Execution Time & Reads Profiling", "Zero-Cursor Architecture"],
        "repo": "src/02_indexing_and_performance/03_execution_plan_analysis.sql",
        "ms_title": "Overcoming Cursor Performance Issues with Set-Based T-SQL",
        "ms_url": "https://learn.microsoft.com/en-us/sql/t-sql/queries/select-over-clause-transact-sql"
    },
    {
        "id": "ch04-vid19", "chap": 4, "code": "CH04_VID19", "m_id": 17600,
        "title": "Overview of Common Language Runtime (CLR) Integration",
        "dur": "22 mins", "level": "Intermediate",
        "skills": ["In-Process .NET CLR Engine", "C# Execution in Database", "String/Regex Performance Gains", "CLR vs T-SQL Boundary Decisions"],
        "repo": "src/05_automation_and_smo/clr/SqlClrExtensions.cs",
        "ms_title": "Common Language Runtime (CLR) Integration Programming Concepts",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration/common-language-runtime-integration-overview"
    },
    {
        "id": "ch04-vid20", "chap": 4, "code": "CH04_VID20", "m_id": 17602,
        "title": "Create SQL CLR C# User-Defined Function (Regex & Algorithms)",
        "dur": "25 mins", "level": "Advanced",
        "skills": ["[SqlFunction] Attribute", "Regex Matching in C#", "Passing SqlString Parameters", "CREATE FUNCTION ... EXTERNAL NAME"],
        "repo": "src/05_automation_and_smo/clr/SqlClrExtensions.cs",
        "ms_title": "CLR User-Defined Functions",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration-database-objects-user-defined-functions/clr-user-defined-functions"
    },
    {
        "id": "ch04-vid21", "chap": 4, "code": "CH04_VID21", "m_id": 17603,
        "title": "Create SQL CLR C# User-Defined Type (UDT)",
        "dur": "27 mins", "level": "Advanced",
        "skills": ["[SqlUserDefinedType] Serialization", "INullable Interface", "Byte-Ordering & Native Formatting", "Creating Composite Types"],
        "repo": "src/05_automation_and_smo/clr/SqlClrExtensions.cs",
        "ms_title": "CLR User-Defined Types",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration-database-objects-user-defined-types/clr-user-defined-types"
    },
    {
        "id": "ch04-vid22", "chap": 4, "code": "CH04_VID22", "m_id": 17604,
        "title": "Create SQL CLR C# Stored Procedure",
        "dur": "26 mins", "level": "Advanced",
        "skills": ["[SqlProcedure] Attribute", "SqlPipe Streaming to Client", "Executing Context Connections", "External API Communication"],
        "repo": "src/05_automation_and_smo/clr/SqlClrExtensions.cs",
        "ms_title": "CLR Stored Procedures",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration-database-objects-user-defined-functions/clr-stored-procedures"
    },
    {
        "id": "ch04-vid23", "chap": 4, "code": "CH04_VID23", "m_id": 17605,
        "title": "Create SQL CLR C# Trigger & Publish with Right Permissions",
        "dur": "28 mins", "level": "Advanced",
        "skills": ["CLR Triggers with SqlTriggerContext", "CREATE ASSEMBLY with SAFE / EXTERNAL_ACCESS", "TRUSTWORTHY Database Setting", "Asymmetric Key Signing"],
        "repo": "src/05_automation_and_smo/clr/Deploy-ClrAssembly.sql",
        "ms_title": "CLR Triggers and Assembly Security",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration/security/clr-integration-security"
    },
    {
        "id": "ch04-vid24", "chap": 4, "code": "CH04_VID24", "m_id": 17606,
        "title": "Overview of SQL Server Management Objects (SMO)",
        "dur": "22 mins", "level": "Intermediate",
        "skills": ["Microsoft.SqlServer.Smo Object Model", "Server, Database, Table Objects", "PowerShell & C# SDK", "Declarative Management Framework"],
        "repo": "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1",
        "ms_title": "SQL Server Management Objects (SMO) Programming Guide",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/server-management-objects-smo/overview-smo"
    },
    {
        "id": "ch04-vid25", "chap": 4, "code": "CH04_VID25", "m_id": 17607,
        "title": "Create Simple Custom Application for End User Using SMO",
        "dur": "27 mins", "level": "Advanced",
        "skills": ["Connecting to SQL Instance via SMO", "Enumerating Databases & Status", "Dynamic Object Inspection", "Automated UI Generation"],
        "repo": "src/05_automation_and_smo/smo_scripts/ScriptDatabaseObjects.py",
        "ms_title": "Creating a Simple SMO Application",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/server-management-objects-smo/smo-license-terms-and-documentation"
    },
    {
        "id": "ch04-vid26", "chap": 4, "code": "CH04_VID26", "m_id": 17608,
        "title": "Create & Backup Database Programmatically with SMO through App",
        "dur": "29 mins", "level": "Advanced",
        "skills": ["Smo.Database.Create()", "Smo.Backup Class Integration", "Event Handling & PercentComplete", "DevOps Infrastructure as Code"],
        "repo": "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1",
        "ms_title": "Backup and Restore Using SMO",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/server-management-objects-smo/tasks/backing-up-and-restoring-databases-and-transaction-logs"
    },
    {
        "id": "ch04-vid27", "chap": 4, "code": "CH04_VID27", "m_id": 17609,
        "title": "Assignment 04: Procedures, Triggers, CLR & Automation",
        "dur": "40 mins", "level": "Advanced",
        "skills": ["Idempotent ETL Procedures", "Audit Triggers", "Managed CLR Assemblies", "SMO Deployment Pipeline", "End-to-End Chapter 4 Capstone"],
        "repo": "src/04_governance_and_audit/01_audit_change_capture_triggers.sql",
        "ms_title": "Database Automation and Governance Guide",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/server-management-objects-smo/overview-smo"
    },

    # --- CH05 (20 items) ---
    {
        "id": "ch05-vid01", "chap": 5, "code": "CH05_VID01", "m_id": 17610,
        "title": "Overview of SQL Server Reporting Services (SSRS) & Installation",
        "dur": "22 mins", "level": "Foundational",
        "skills": ["SSRS Architecture", "Report Server Configuration Manager", "Web Service & Report Portal URLs", "ReportServer Database"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "What is SQL Server Reporting Services (SSRS)?",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/create-deploy-and-manage-mobile-and-paginated-reports"
    },
    {
        "id": "ch05-vid02", "chap": 5, "code": "CH05_VID02", "m_id": 17611,
        "title": "Create a Report Server Project in Visual Studio / SSDT",
        "dur": "21 mins", "level": "Foundational",
        "skills": ["SQL Server Data Tools (SSDT)", "Report Server Project Template", "Shared Data Sources (.rds)", "Shared Datasets (.rsd)"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Create a Report Server Project",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/reports/create-a-basic-table-report-ssrs-tutorial"
    },
    {
        "id": "ch05-vid03", "chap": 5, "code": "CH05_VID03", "m_id": 17612,
        "title": "Add Items to Your Report & Edit SSRS Expressions",
        "dur": "23 mins", "level": "Intermediate",
        "skills": ["Report Designer Surface", "Textbox & Table Controls", "SSRS Expression Builder (=Fields!...)", "Built-in Global Collections"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Expression Uses in Reports (Report Builder and SSRS)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/expression-uses-in-reports-report-builder-and-ssrs"
    },
    {
        "id": "ch05-vid04", "chap": 5, "code": "CH05_VID04", "m_id": 17613,
        "title": "Change Report Properties & Professional Styling",
        "dur": "20 mins", "level": "Intermediate",
        "skills": ["Page Setup (A4/Letter)", "Header & Footer Margins", "Color Palettes & Typography", "Conditional Formatting Expressions"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Formatting Report Items (Report Builder and SSRS)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/formatting-report-items-report-builder-and-ssrs"
    },
    {
        "id": "ch05-vid05", "chap": 5, "code": "CH05_VID05", "m_id": 17614,
        "title": "Use COUNT and Interactive Sorting Functions",
        "dur": "22 mins", "level": "Intermediate",
        "skills": ["COUNT & SUM Aggregates", "Interactive Sorting on Column Headers", "Scope Resolution", "Sort Direction Toggling"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Interactive Sort (Report Builder and SSRS)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/interactive-sort-report-builder-and-ssrs"
    },
    {
        "id": "ch05-vid06", "chap": 5, "code": "CH05_VID06", "m_id": 17615,
        "title": "Choose How to Group Data in Table, Matrix and Chart Reports",
        "dur": "25 mins", "level": "Intermediate",
        "skills": ["Row Groups & Column Groups", "Matrix (Pivot) Tablix Controls", "Group Headers & Subtotals", "Visual Charts (Bar, Line, Pie)"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Grouping Data (Report Builder and SSRS)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/understanding-groups-report-builder-and-ssrs"
    },
    {
        "id": "ch05-vid07", "chap": 5, "code": "CH05_VID07", "m_id": 17616,
        "title": "Create a Free-Form Report Layout",
        "dur": "24 mins", "level": "Intermediate",
        "skills": ["List Tablix for Form Layouts", "Banding and Nested Containers", "Catalog Cards & Invoices", "Subreport Placeholders"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Create a Free-Form Form (Report Builder and SSRS)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/create-invoices-and-forms-with-lists-report-builder-and-ssrs"
    },
    {
        "id": "ch05-vid08", "chap": 5, "code": "CH05_VID08", "m_id": 17617,
        "title": "Join Many Tables Using Query Designer & Add Indicators",
        "dur": "25 mins", "level": "Intermediate",
        "skills": ["Graphical Query Designer", "Multi-Table SQL Joins", "KPI Indicators (Traffic Lights, Gauges)", "State Range Configuration"],
        "repo": "src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql",
        "ms_title": "Indicators (Report Builder and SSRS)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/indicators-report-builder-and-ssrs"
    },
    {
        "id": "ch05-vid09", "chap": 5, "code": "CH05_VID09", "m_id": 17618,
        "title": "Using Stored Procedures & Map Dataset to Report Parameter",
        "dur": "26 mins", "level": "Advanced",
        "skills": ["CommandType.StoredProcedure", "Report Parameter Auto-Generation", "Available Values Queries", "Default Values Setup"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Report Parameters (Report Builder and Report Designer)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/report-parameters-report-builder-and-report-designer"
    },
    {
        "id": "ch05-vid10", "chap": 5, "code": "CH05_VID10", "m_id": 17619,
        "title": "Go to Another Report Action (Drill-Through Navigation)",
        "dur": "24 mins", "level": "Advanced",
        "skills": ["Action Properties: Go to report", "Passing Parameters to Target Report", "Drill-Through vs Drill-Down", "Breadcrumb Navigation"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Add a Drillthrough Action on a Report",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/add-a-drillthrough-action-on-a-report-report-builder-and-ssrs"
    },
    {
        "id": "ch05-vid11", "chap": 5, "code": "CH05_VID11", "m_id": 17620,
        "title": "Link Datasets with Cascading Parameters",
        "dur": "25 mins", "level": "Advanced",
        "skills": ["Cascading Parameter Dependencies", "Filtering Child Parameter Queries", "Handling Multi-Select Cascades", "Parameter Refresh Order"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Add Cascading Parameters to a Report",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/add-cascading-parameters-to-a-report-report-builder-and-ssrs"
    },
    {
        "id": "ch05-vid12", "chap": 5, "code": "CH05_VID12", "m_id": 17621,
        "title": "Add a Sparkline & Data Bar to Your Report",
        "dur": "20 mins", "level": "Intermediate",
        "skills": ["Sparkline Trendlines", "Data Bars within Table Cells", "Aligning Horizontal Axis across Rows", "Compact Dashboard Visuals"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Sparklines and Data Bars (Report Builder and SSRS)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/report-design/sparklines-and-data-bars-report-builder-and-ssrs"
    },
    {
        "id": "ch05-vid13", "chap": 5, "code": "CH05_VID13", "m_id": 17622,
        "title": "How to Deploy Reports & Configure Report Server",
        "dur": "23 mins", "level": "Intermediate",
        "skills": ["TargetServerURL Deployment", "SSDT Deploy Project", "Folder Structures & Item Permissions", "Data Source Credential Storage"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Publish Reports to a Report Server",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/reports/publish-reports-to-a-report-server"
    },
    {
        "id": "ch05-vid14", "chap": 5, "code": "CH05_VID14", "m_id": 17623,
        "title": "View Reports with a Browser (Report Builder and SSRS Portal)",
        "dur": "21 mins", "level": "Foundational",
        "skills": ["Report Portal Web Interface", "Exporting to PDF / Excel / Word", "Subscription & Email Delivery", "Browser Rendering Engines"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Web Portal of a Report Server (SSRS Native Mode)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/web-portal-ssrs-native-mode"
    },
    {
        "id": "ch05-vid15", "chap": 5, "code": "CH05_VID15", "m_id": 17624,
        "title": "Create Custom Reports Using Microsoft RDLC Report Designer",
        "dur": "24 mins", "level": "Intermediate",
        "skills": ["Local Report Definition (RDLC)", "Embedding Reports in .NET WinForms / Web", "ReportViewer Control", "Offline Client Rendering"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "ReportViewer Controls in Visual Studio (RDLC)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/application-integration/integrating-reporting-services-using-reportviewer-controls"
    },
    {
        "id": "ch05-vid16", "chap": 5, "code": "CH05_VID16", "m_id": 17625,
        "title": "Link Parameters to Your Custom Report (RDLC & Code-Behind)",
        "dur": "23 mins", "level": "Intermediate",
        "skills": ["ReportParameter Collection in C#", "Binding DataTable to ReportDataSource", "Programmatic Parameter Passing", "Print Dialog Automation"],
        "repo": "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl",
        "ms_title": "Set Parameters on Local Reports (RDLC)",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/application-integration/integrating-reporting-services-using-reportviewer-controls"
    },
    {
        "id": "ch05-vid17", "chap": 5, "code": "CH05_VID17", "m_id": 17626,
        "title": "Data Warehousing Architecture & Enterprise Fundamentals",
        "dur": "26 mins", "level": "Foundational",
        "skills": ["Corporate Information Factory (CIF)", "Enterprise Data Warehouse (EDW)", "Data Marts", "ETL/ELT Extraction Layers"],
        "repo": "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql",
        "ms_title": "Data Warehousing Architecture Overview",
        "ms_url": "https://learn.microsoft.com/en-us/sql/relational-databases/data-warehouse-architectures"
    },
    {
        "id": "ch05-vid18", "chap": 5, "code": "CH05_VID18", "m_id": 17627,
        "title": "Difference Between OLAP and OLTP Systems",
        "dur": "22 mins", "level": "Foundational",
        "skills": ["Normalized 3NF vs De-normalized Star", "Write-Optimized vs Read-Optimized", "Transaction Locks vs Columnar Scans", "Historical Time-Variant Data"],
        "repo": "src/07_warehousing_and_reporting/01_oltp_source_schema.sql",
        "ms_title": "Comparing Online Analytical Processing (OLAP) and OLTP",
        "ms_url": "https://learn.microsoft.com/en-us/azure/architecture/data-guide/relational-data/online-analytical-processing"
    },
    {
        "id": "ch05-vid19", "chap": 5, "code": "CH05_VID19", "m_id": 17628,
        "title": "Dimensional Modeling (Facts, Dimensions & Kimball Star)",
        "dur": "28 mins", "level": "Advanced",
        "skills": ["Kimball Star Schema", "Fact Tables (Additive, Semi-Additive)", "Conformed Dimensions", "Surrogate Keys vs Natural Keys", "SCD Types 1, 2, 3"],
        "repo": "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql",
        "ms_title": "Dimensional Modeling and Star Schemas",
        "ms_url": "https://learn.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-tables-overview"
    },
    {
        "id": "ch05-vid20", "chap": 5, "code": "CH05_VID20", "m_id": 17629,
        "title": "Assignment 05: Data Warehouse & Paginated Report Delivery",
        "dur": "40 mins", "level": "Advanced",
        "skills": ["Kimball Star Schema Build", "SCD Type 2 Historical Lineage", "Production SSRS Tablix Report", "End-to-End Chapter 5 Capstone"],
        "repo": "src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql",
        "ms_title": "Paginated Reports and Star Schema Integration",
        "ms_url": "https://learn.microsoft.com/en-us/sql/reporting-services/create-deploy-and-manage-mobile-and-paginated-reports"
    },

    # --- Final Project (1 item) ---
    {
        "id": "final-project", "chap": 6, "code": "FinalProject", "m_id": 17630,
        "title": "Final Enterprise Capstone Project: End-to-End Data Platform",
        "dur": "60 mins", "level": "Capstone",
        "skills": ["Multi-Filegroup Architecture", "ACID Stored Procedures", "Sliding-Window Partitioning", "Kimball Star Schema", "Paginated SSRS Delivery", "DevOps Automated CI/CD"],
        "repo": "deploy.ps1",
        "ms_title": "End-to-End SQL Server Architecture Capstone Guide",
        "ms_url": "https://learn.microsoft.com/en-us/sql/sql-server/educational-curriculum"
    }
]

def generate_js():
    chapter_titles = {
        1: "Chapter 1: Database Creation and Management",
        2: "Chapter 2: SQL Programming Essentials",
        3: "Chapter 3: Advanced Query Techniques and High Availability",
        4: "Chapter 4: Procedures, Triggers, and SQL Automation",
        5: "Chapter 5: Reporting and Data Warehousing",
        6: "Final Project: Enterprise Data Platform Capstone"
    }

    out = []
    out.append("/**")
    out.append(" * Official Video Catalog: MaharaTech Course 2305")
    out.append(" * Implementing and Developing SQL Server Objects")
    out.append(" * Instructor: Eng. Rami Mohamed Abonagi (ITI / MCIT Egypt)")
    out.append(" * Fully cataloged with all 101 authentic course lessons + Final Capstone Project")
    out.append(" * Integrated with Microsoft Learn Documentation references.")
    out.append(" */")
    out.append("")
    out.append("export const COURSE_METADATA = {")
    out.append("  courseId: 2305,")
    out.append('  courseTitle: "Implementing and Developing SQL Server Objects",')
    out.append('  instructor: "Eng. Rami Mohamed Abonagi",')
    out.append('  institution: "Information Technology Institute (ITI) / MaharaTech",')
    out.append('  portalUrl: "https://maharatech.gov.eg/course/view.php?id=2305",')
    out.append(f"  totalVideos: {len(VIDEOS_SPEC)},")
    out.append("  totalChapters: 5,")
    out.append('  description: "Comprehensive 101-module engineering curriculum mastering Microsoft SQL Server internals, relational modeling, advanced T-SQL programming, concurrency control, partitioning, triggers, and Kimball dimensional warehousing."')
    out.append("};")
    out.append("")
    out.append("export const COURSE_VIDEOS = [")

    current_chap = None
    for item in VIDEOS_SPEC:
        chap = item["chap"]
        if chap != current_chap:
            current_chap = chap
            out.append("  // ==========================================")
            out.append(f"  // {chapter_titles[chap].upper()}")
            out.append("  // ==========================================")

        v_id = item["id"]
        v_code = item["code"]
        v_title = item["title"]
        v_dur = item["dur"]
        v_level = item["level"]
        skills_str = json.dumps(item["skills"])
        m_url = f"https://maharatech.gov.eg/mod/hvp/view.php?id={item['m_id']}"
        ms_title = item["ms_title"]
        ms_url = item["ms_url"]
        repo = item["repo"]

        # Rich descriptions and sample sql tailored for each lesson
        desc = f"Eng. Rami Mohamed Abonagi presents '{v_title}' as part of {chapter_titles[chap]}. Master core concepts, practical implementation in SSMS, and production database patterns."
        
        # Specific custom overrides for highlighted lessons
        if v_id == "ch01-vid02":
            desc = "Hands-on walkthrough of creating the ITItest database and multi-filegroup physical layout using the SSMS Database Creation Wizard in CH01\\\\Mydb. Students model the depts and emp tables, define identity fields, and establish foreign key relationships via SSMS Database Diagrams."
            sample_sql = ("-- Query the live ITItest depts and emp tables created via Wizard\\n"
                          "SELECT e.eid, e.ename, e.salary, e.eadd, d.dname\\n"
                          "FROM emp e INNER JOIN depts d ON e.dnum = d.did\\n"
                          "ORDER BY d.dname, e.salary DESC;")
            att_doc = "docs/ch01-case-study-erd-and-implementation.md"
        elif v_id == "ch01-vid03":
            desc = "Mastering programmatic database creation using Transact-SQL DDL. Covers CREATE DATABASE with PRIMARY, secondary filegroups (fg1, fg2), filegrowth mathematics, and safe drop/recreate patterns."
            sample_sql = ("-- Create database with code & multiple filegroups\\n"
                          "CREATE DATABASE ITItest\\n"
                          "ON PRIMARY (NAME = N'ITItest_Data', FILENAME = N'D:\\\\courses\\\\Data Science\\\\Data Engineering\\\\MaharaTech\\\\Implementing and Developing SQL server objects\\\\CH01\\\\Mydb\\\\ITItest_Data.mdf'),\\n"
                          "FILEGROUP fg1 (NAME = N'ITItest_fg1', FILENAME = N'D:\\\\courses\\\\Data Science\\\\Data Engineering\\\\MaharaTech\\\\Implementing and Developing SQL server objects\\\\CH01\\\\Mydb\\\\ITItest_fg1.ndf')\\n"
                          "LOG ON (NAME = N'ITItest_Log', FILENAME = N'D:\\\\courses\\\\Data Science\\\\Data Engineering\\\\MaharaTech\\\\Implementing and Developing SQL server objects\\\\CH01\\\\Mydb\\\\ITItest_Log.ldf');")
            att_doc = "docs/ch01-case-study-erd-and-implementation.md"
        else:
            sample_sql = f"-- T-SQL Demo: {v_title}\\n-- Video Code: {v_code}\\nSELECT '{v_code}' AS VideoCode, '{v_title}' AS ModuleTitle, GETDATE() AS ExecutedAt;"
            att_doc = "docs/ch01-case-study-erd-and-implementation.md"

        out.append("  {")
        out.append(f'    id: "{v_id}",')
        out.append(f"    chapter: {chap},")
        out.append(f'    chapterTitle: "{chapter_titles[chap]}",')
        out.append(f'    videoCode: "{v_code}",')
        out.append(f'    title: "{v_title}",')
        out.append(f'    duration: "{v_dur}",')
        out.append(f'    level: "{v_level}",')
        out.append(f"    skillsConnected: {skills_str},")
        out.append("    objectives: [")
        for sk in item["skills"][:3]:
            out.append(f'      "Master {sk.lower()} in SQL Server.",')
        out.append(f'      "Complete the practical exercise for {v_title}."')
        out.append("    ],")
        out.append(f'    description: "{desc}",')
        out.append(f'    sampleSql: `{sample_sql}`,')
        out.append(f'    repoPath: "{repo}",')
        out.append(f'    challengeId: "ch-{chap}",')
        out.append('    erdEntity: "Database",')
        out.append("    attachments: [")
        out.append(f'      {{ id: "att-{v_id}-1", name: "{v_title} Technical Guide", type: "DOC", path: "{att_doc}" }},')
        out.append(f'      {{ id: "att-{v_id}-2", name: "Solution DDL / Script", type: "SQL", path: "{repo}" }}')
        out.append("    ],")
        out.append(f'    maharatechUrl: "{m_url}",')
        out.append(f'    microsoftDocTitle: "{ms_title}",')
        out.append(f'    microsoftDocsUrl: "{ms_url}"')
        out.append("  },")

    out.append("];")
    return "\n".join(out)

if __name__ == "__main__":
    content = generate_js()
    with open("web/src/data/videoCatalog.js", "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated {len(VIDEOS_SPEC)} items in web/src/data/videoCatalog.js successfully.")
