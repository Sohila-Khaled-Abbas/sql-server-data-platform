"""
scripts/vault_data.py
Data structures and curriculum definitions for the SQL Server Second Brain vault.
Contains the exact 102 lessons, chapter relationships, concepts, patterns,
mini projects, assignments, final project parts, and cheat sheets.
"""

CHAPTERS = [
    {
        "id": "CH01",
        "title": "Database Creation and Management",
        "folder": "01 - COURSE/CH01 - Database Creation and Management",
        "domain": "Storage & Physical Architecture",
        "code_dir": "src/01_storage_and_schema/",
        "platform_anchor": "#architecture"
    },
    {
        "id": "CH02",
        "title": "SQL Programming Essentials",
        "folder": "01 - COURSE/CH02 - SQL Programming Essentials",
        "domain": "T-SQL Programming & ACID",
        "code_dir": "src/03_programmability_and_elt/",
        "platform_anchor": "#sql-engineering"
    },
    {
        "id": "CH03",
        "title": "Advanced Query Techniques and High Availability",
        "folder": "01 - COURSE/CH03 - Advanced Query Techniques and High Availability",
        "domain": "Views, Partitioning & High Availability",
        "code_dir": "src/02_indexing_and_performance/",
        "platform_anchor": "#data-flow"
    },
    {
        "id": "CH04",
        "title": "Procedures, Triggers, and SQL Automation",
        "folder": "01 - COURSE/CH04 - Procedures, Triggers, and SQL Automation",
        "domain": "Programmability, Auditing & Automation",
        "code_dir": "src/04_governance_and_audit/",
        "platform_anchor": "#deep-dive"
    },
    {
        "id": "CH05",
        "title": "Reporting and Data Warehousing",
        "folder": "01 - COURSE/CH05 - Reporting and Data Warehousing",
        "domain": "SSRS & Kimball Dimensional Warehousing",
        "code_dir": "src/07_warehousing_and_reporting/",
        "platform_anchor": "#database-design"
    },
    {
        "id": "Final",
        "title": "Final Project",
        "folder": "01 - COURSE/Final Project",
        "domain": "Integrated Enterprise Data Platform",
        "code_dir": "tests/",
        "platform_anchor": "#overview"
    }
]

# Raw 102 lessons parsed directly from VIDEO_INDEX.md
LESSONS_RAW = [
    # CH01 (16 lessons)
    ("CH01", "CH01_VID01", "Create Database and Filegroups", "17520", "src/01_storage_and_schema/01_filegroups_and_files.sql", "medium", 15),
    ("CH01", "CH01_VID02", "Create Database Using Wizard", "17521", "src/01_storage_and_schema/01_filegroups_and_files.sql", "easy", 10),
    ("CH01", "CH01_VID03", "Create Database Using Code", "17522", "src/01_storage_and_schema/01_filegroups_and_files.sql", "medium", 15),
    ("CH01", "CH01_VID04", "Database Integrity", "17523", "src/02_data_integrity_and_ddl/01_declarative_constraints.sql", "medium", 15),
    ("CH01", "CH01_VID05", "Integrity constraints", "17524", "src/02_data_integrity_and_ddl/01_declarative_constraints.sql", "medium", 20),
    ("CH01", "CH01_VID06", "Constraints, Rules, and Default Values", "17525", "src/02_data_integrity_and_ddl/02_check_constraints_and_defaults.sql", "hard", 25),
    ("CH01", "CH01_VID07", "Creating a Custom Data Type", "17526", "src/01_storage_and_schema/04_user_defined_types.sql", "medium", 15),
    ("CH01", "CH01_VID08", "Clustered Index", "17527", "src/05_indexing_and_performance/01_clustered_indexes.sql", "hard", 20),
    ("CH01", "CH01_VID09", "Non-Clustered Index", "17528", "src/05_indexing_and_performance/02_nonclustered_indexes.sql", "hard", 20),
    ("CH01", "CH01_VID10", "Demo on Index", "17529", "src/05_indexing_and_performance/03_index_maintenance.sql", "medium", 20),
    ("CH01", "CH01_VID11", "Types of Backup", "17530", "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql", "medium", 15),
    ("CH01", "CH01_VID12", "Backup Database Using Wizard", "17531", "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql", "easy", 10),
    ("CH01", "CH01_VID13", "Backup & SQL server agent jobs", "17532", "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql", "medium", 20),
    ("CH01", "CH01_VID14", "Snapshot DB", "17533", "src/06_reliability_and_dr/02_snapshot_lifecycle.sql", "hard", 20),
    ("CH01", "CH01_VID15", "Demo on Snapshot", "17534", "src/06_reliability_and_dr/02_snapshot_lifecycle.sql", "medium", 15),
    ("CH01", "CH01_VID16", "Assignment 01", "17535", "src/01_storage_and_schema/05_company_case_study_schema.sql", "hard", 30),

    # CH02 (15 lessons)
    ("CH02", "CH02_VID01", "Variables", "17537", "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql", "easy", 10),
    ("CH02", "CH02_VID02", "Local Variables", "17538", "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql", "easy", 15),
    ("CH02", "CH02_VID03", "Global Variables", "17539", "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql", "medium", 15),
    ("CH02", "CH02_VID04", "Control of Flow_Part(1)", "17540", "src/03_programmability_and_elt/03_stored_procedures_etl.sql", "medium", 15),
    ("CH02", "CH02_VID05", "Control of Flow_Part(2)", "17541", "src/03_programmability_and_elt/03_stored_procedures_etl.sql", "medium", 20),
    ("CH02", "CH02_VID06", "Functions", "17542", "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql", "medium", 15),
    ("CH02", "CH02_VID07", "Scalar Function", "17543", "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql", "medium", 20),
    ("CH02", "CH02_VID08", "Inline Statement Table-Valued Functions", "17544", "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql", "hard", 20),
    ("CH02", "CH02_VID09", "Multi-Statement Table-Valued Functions", "17545", "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql", "hard", 25),
    ("CH02", "CH02_VID10", "System databases", "17546", "src/01_storage_and_schema/01_filegroups_and_files.sql", "medium", 15),
    ("CH02", "CH02_VID11", "Types of Table", "17547", "src/01_storage_and_schema/02_custom_types_and_rules.sql", "hard", 20),
    ("CH02", "CH02_VID12", "Script & Batch", "17548", "src/03_programmability_and_elt/03_stored_procedures_etl.sql", "medium", 15),
    ("CH02", "CH02_VID13", "Types of Transactions", "17549", "src/03_programmability_and_elt/03_stored_procedures_etl.sql", "hard", 25),
    ("CH02", "CH02_VID14", "Demo on Transactions", "17550", "src/03_programmability_and_elt/03_stored_procedures_etl.sql", "hard", 20),
    ("CH02", "CH02_VID15", "Assignment 02", "17551", "src/03_programmability_and_elt/03_stored_procedures_etl.sql", "hard", 30),

    # CH03 (23 lessons)
    ("CH03", "CH03_VID01", "Overview of Views", "17553", "src/02_indexing_and_performance/02_indexed_views.sql", "easy", 15),
    ("CH03", "CH03_VID02", "Types of Views", "17554", "src/02_indexing_and_performance/02_indexed_views.sql", "medium", 15),
    ("CH03", "CH03_VID03", "Creating and using Views", "17555", "src/02_indexing_and_performance/02_indexed_views.sql", "medium", 15),
    ("CH03", "CH03_VID04", "DML Operations on Views", "17556", "src/02_indexing_and_performance/02_indexed_views.sql", "hard", 20),
    ("CH03", "CH03_VID05", "Indexed View", "17557", "src/02_indexing_and_performance/02_indexed_views.sql", "hard", 25),
    ("CH03", "CH03_VID06", "Partitioning", "17558", "src/01_storage_and_schema/04_partitioning_scheme.sql", "hard", 30),
    ("CH03", "CH03_VID07", "Harnessing the Power of XML", "17559", "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql", "medium", 15),
    ("CH03", "CH03_VID08", "Use Raw and Auto Mode with For XML", "17560", "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql", "medium", 20),
    ("CH03", "CH03_VID09", "Use Path Mode with For XML", "17561", "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql", "medium", 20),
    ("CH03", "CH03_VID10", "Querying XML data", "17562", "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql", "hard", 25),
    ("CH03", "CH03_VID11", "Hierarchical Data", "17563", "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql", "medium", 20),
    ("CH03", "CH03_VID12", "CTE: Common Table Expression", "17564", "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql", "hard", 20),
    ("CH03", "CH03_VID13", "Offset and Fetch keyword", "17565", "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql", "easy", 15),
    ("CH03", "CH03_VID14", "Sequence", "17566", "src/01_storage_and_schema/02_custom_types_and_rules.sql", "medium", 15),
    ("CH03", "CH03_VID15", "Table Valued Parameters", "17567", "src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql", "hard", 25),
    ("CH03", "CH03_VID16", "High Availability", "17568", "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql", "medium", 20),
    ("CH03", "CH03_VID17", "Set Up Instances", "17569", "docker/docker-compose.yml", "medium", 20),
    ("CH03", "CH03_VID18", "DB Mirroring", "17571", "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql", "hard", 25),
    ("CH03", "CH03_VID19", "Demo Database Mirroring", "17572", "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql", "hard", 25),
    ("CH03", "CH03_VID20", "Overview of Ship Transaction Log", "17573", "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql", "medium", 20),
    ("CH03", "CH03_VID21", "Steps to Configure SQL Server Log Shipping", "17574", "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql", "hard", 25),
    ("CH03", "CH03_VID22", "Log Shipping vs Mirroring", "17575", "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql", "medium", 15),
    ("CH03", "CH03_VID23", "Assignment 03", "17576", "src/01_storage_and_schema/04_partitioning_scheme.sql", "hard", 30),

    # CH04 (27 lessons)
    ("CH04", "CH04_VID01", "Overview of stored procedure", "17577", "src/03_programmability_and_elt/03_stored_procedures_etl.sql", "easy", 15),
    ("CH04", "CH04_VID02", "Advantages of Stored Procedures", "17579", "src/03_programmability_and_elt/03_stored_procedures_etl.sql", "easy", 15),
    ("CH04", "CH04_VID03", "Demo on stored procedures", "17580", "src/03_programmability_and_elt/03_stored_procedures_etl.sql", "medium", 20),
    ("CH04", "CH04_VID04", "DML Statements in Stored Procedures", "17581", "src/03_programmability_and_elt/03_stored_procedures_etl.sql", "medium", 20),
    ("CH04", "CH04_VID05", "Stored Procedure with Parameters and Return Values", "17582", "src/03_programmability_and_elt/03_stored_procedures_etl.sql", "medium", 20),
    ("CH04", "CH04_VID06", "Functions vs Stored Procedures", "17583", "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql", "medium", 15),
    ("CH04", "CH04_VID07", "Dynamic Query in Stored Procedure", "17584", "src/04_governance_and_audit/03_dynamic_sql_guardrails.sql", "hard", 25),
    ("CH04", "CH04_VID08", "Stored Procedures and Triggers Types", "17585", "src/04_governance_and_audit/01_audit_change_capture_triggers.sql", "medium", 20),
    ("CH04", "CH04_VID09", "Creating a Table Level Trigger", "17586", "src/04_governance_and_audit/01_audit_change_capture_triggers.sql", "hard", 20),
    ("CH04", "CH04_VID10", "Triggers Features", "17587", "src/04_governance_and_audit/01_audit_change_capture_triggers.sql", "medium", 15),
    ("CH04", "CH04_VID11", "Using Inserted and Deleted Tables Within Triggers", "17588", "src/04_governance_and_audit/01_audit_change_capture_triggers.sql", "hard", 20),
    ("CH04", "CH04_VID12", "Track User Activity Using Audit Table", "17589", "src/04_governance_and_audit/01_audit_change_capture_triggers.sql", "hard", 25),
    ("CH04", "CH04_VID13", "Creating Server-Level and Database-Level Triggers", "17590", "src/04_governance_and_audit/02_ddl_and_server_triggers.sql", "hard", 25),
    ("CH04", "CH04_VID14", "Using OUTPUT with DML statements", "17591", "src/03_programmability_and_elt/03_stored_procedures_etl.sql", "medium", 20),
    ("CH04", "CH04_VID15", "Cursors", "17592", "src/02_indexing_and_performance/03_execution_plan_analysis.sql", "medium", 15),
    ("CH04", "CH04_VID16", "Create a Database Cursor", "17593", "src/02_indexing_and_performance/03_execution_plan_analysis.sql", "medium", 20),
    ("CH04", "CH04_VID17", "Practical Applications of SQL Cursors 01", "17594", "src/02_indexing_and_performance/03_execution_plan_analysis.sql", "hard", 20),
    ("CH04", "CH04_VID18", "Practical Applications of SQL Cursors 02", "17595", "src/02_indexing_and_performance/03_execution_plan_analysis.sql", "hard", 20),
    ("CH04", "CH04_VID19", "Overview of Common Language Runtime (CLR)", "17600", "src/05_automation_and_smo/clr/SqlClrExtensions.cs", "medium", 20),
    ("CH04", "CH04_VID20", "Create SQL CLR C# User-Defined Function", "17602", "src/05_automation_and_smo/clr/SqlClrExtensions.cs", "hard", 25),
    ("CH04", "CH04_VID21", "Create SQL CLR C# User-Defined Type", "17603", "src/05_automation_and_smo/clr/SqlClrExtensions.cs", "hard", 25),
    ("CH04", "CH04_VID22", "Create SQL CLR C# Stored Procedure", "17604", "src/05_automation_and_smo/clr/SqlClrExtensions.cs", "hard", 25),
    ("CH04", "CH04_VID23", "Create SQL CLR C# Trigger & publish with right permission", "17605", "src/05_automation_and_smo/clr/SqlClrExtensions.cs", "hard", 25),
    ("CH04", "CH04_VID24", "Overview of SQL Server Management Objects (SMO)", "17606", "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1", "medium", 20),
    ("CH04", "CH04_VID25", "Create simple custom application (for end user) using SMO", "17607", "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1", "hard", 25),
    ("CH04", "CH04_VID26", "Create & Backup database programmatically with SMO through app", "17608", "src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1", "hard", 25),
    ("CH04", "CH04_VID27", "Assignment 04", "17609", "src/04_governance_and_audit/02_ddl_and_server_triggers.sql", "hard", 30),

    # CH05 (20 lessons)
    ("CH05", "CH05_VID01", "Overview of SQL Server Reporting Services (SSRS) & installation", "17610", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "medium", 20),
    ("CH05", "CH05_VID02", "Create a report server project", "17611", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "easy", 15),
    ("CH05", "CH05_VID03", "Add some items to your report & edit SSRS expressions", "17612", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "medium", 20),
    ("CH05", "CH05_VID04", "Change Report Properties & Styling", "17613", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "easy", 15),
    ("CH05", "CH05_VID05", "Use count and interactive sorting functions", "17614", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "medium", 20),
    ("CH05", "CH05_VID06", "Choose how to group data in the table, matrix and chart report", "17615", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "hard", 25),
    ("CH05", "CH05_VID07", "Create a free form report", "17616", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "medium", 20),
    ("CH05", "CH05_VID08", "Join many tables using query designer & Add indicators", "17617", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "medium", 20),
    ("CH05", "CH05_VID09", "Using Stored Procedures & Map dataset to report parameter", "17618", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "hard", 25),
    ("CH05", "CH05_VID10", "Go to another report action", "17619", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "medium", 20),
    ("CH05", "CH05_VID11", "Link datasets has parameter depend on another parameter", "17620", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "hard", 25),
    ("CH05", "CH05_VID12", "Add a sparkline to your report", "17621", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "medium", 15),
    ("CH05", "CH05_VID13", "How to deploy reports & configure report server", "17622", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "hard", 25),
    ("CH05", "CH05_VID14", "View reports with a browser (Report Builder and SSRS)", "17623", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "easy", 15),
    ("CH05", "CH05_VID15", "Create custom reports using Microsoft RDLC Report Designer", "17624", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "hard", 25),
    ("CH05", "CH05_VID16", "Link parameters to your custom report", "17625", "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl", "hard", 20),
    ("CH05", "CH05_VID17", "Data Warehousing", "17626", "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql", "medium", 20),
    ("CH05", "CH05_VID18", "Difference between OLAP and OLTP", "17627", "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql", "hard", 25),
    ("CH05", "CH05_VID19", "Dimensional Modeling", "17628", "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql", "hard", 30),
    ("CH05", "CH05_VID20", "Assignment 05", "17629", "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql", "hard", 35),

    # Final Project (1 lesson)
    ("Final", "FINAL_VID01", "Final Project — Integrated SQL Server Data Platform", "2305", "tests/python/test_data_platform.py", "hard", 60)
]

# Legacy technologies mapping
LEGACY_WARNINGS = {
    "CH01_VID06": {
        "tech": "CREATE RULE and CREATE DEFAULT",
        "reason": "CREATE RULE and CREATE DEFAULT are deprecated features marked for removal in future SQL Server versions. They are included in legacy curriculum because older enterprise databases still have bound rules. Modern SQL Server standards mandate ANSI CHECK constraints and DEFAULT constraints declared directly in table DDL.",
        "modern": "Use `ALTER TABLE ... ADD CONSTRAINT CK_... CHECK (...)` and `ADD CONSTRAINT DF_... DEFAULT (...)`."
    },
    "CH03_VID18": {
        "tech": "Database Mirroring",
        "reason": "Database Mirroring is a deprecated SQL Server feature retained solely for backward compatibility. The MaharaTech course covers it as a foundation for understanding transaction log synchronization. For all modern production deployments on SQL Server 2012–2022, Microsoft recommends Always On Availability Groups (Basic or Advanced).",
        "modern": "Investigate Always On Availability Groups (AOAG) and Azure SQL Managed Instance failover groups."
    },
    "CH03_VID19": {
        "tech": "Database Mirroring",
        "reason": "Database Mirroring is deprecated. Modern multi-database synchronization relies on Always On Availability Groups or Distributed Availability Groups across clusters.",
        "modern": "Always On Availability Groups with Windows Server Failover Clustering (WSFC)."
    },
    "CH03_VID22": {
        "tech": "Database Mirroring (vs Log Shipping)",
        "reason": "While Log Shipping remains a fully supported, reliable disaster recovery standby mechanism, Mirroring has been superseded by Availability Groups.",
        "modern": "Combine Log Shipping (for cost-effective delayed disaster recovery) with Always On AGs (for high availability)."
    },
    "CH04_VID15": {
        "tech": "T-SQL Cursors (RBAR - Row-By-Agonizing-Row)",
        "reason": "Procedural cursors violate the relational set-based processing model. They incur heavy locking, high memory grants, and massive context switching. While cursors remain necessary for certain administrative tasks (iterating across databases), data processing pipelines should almost never use cursors.",
        "modern": "Use set-based window functions (`ROW_NUMBER()`, `LEAD()`, `LAG()`), `CROSS APPLY`, or multi-threaded bulk ETL tools."
    },
    "CH04_VID16": {
        "tech": "T-SQL Cursors",
        "reason": "Cursors should be strictly avoided in pipeline transformations. If unavoidable for DBA scripts, always specify `FAST_FORWARD READ_ONLY` to minimize tempdb spooling.",
        "modern": "Window functions and set-based UPDATE joins."
    },
    "CH04_VID17": {
        "tech": "T-SQL Cursors",
        "reason": "RBAR operations create major transactional log bottlenecks and page latch contention under concurrency.",
        "modern": "Batch iterations with set-based chunks using `WHILE` and `TOP (N)`."
    },
    "CH04_VID18": {
        "tech": "T-SQL Cursors",
        "reason": "Iterative row processing should be migrated to set-based vector operations in analytical data engineering.",
        "modern": "Set-based T-SQL or staging in modern vector/columnar storage engines."
    }
}
