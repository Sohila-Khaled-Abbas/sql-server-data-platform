# MaharaTech Course Syllabus to Enterprise DBRE Architecture Mapping

[![Course](https://img.shields.io/badge/MaharaTech-Course%202305-red?logo=open-access&logoColor=white)](https://maharatech.gov.eg/course/view.php?id=2305)
[![Institution](https://img.shields.io/badge/ITI-Information%20Technology%20Institute-8B1E28)](#)
[![Instructor](https://img.shields.io/badge/Instructor-Eng.%20Rami%20Mohamed%20Abonagi-blue)](#)

This platform codebase directly implements and elevates the curriculum of the official ITI / MaharaTech course:
**[Implementing and Developing SQL Server Objects (Course ID: 2305)](https://maharatech.gov.eg/course/view.php?id=2305)**.

Rather than storing isolated lecture scripts, each academic concept is re-engineered as an operational component within an enterprise-grade **Data Engineering & Database Reliability Engineering (DBRE)** data platform.

---

## Comprehensive Curriculum Mapping Matrix

| Chapter / Topic | Official Course Objective | Enterprise DBRE Implementation | Repository Code Artifacts |
| :--- | :--- | :--- | :--- |
| **CH01: Database Creation and Management** | Database creation scripts & wizards (*CH01_VID02*), Chen ERD case study, physical files, secondary filegroups, integrity constraints, and database snapshots. | **Storage Engine Internals & Multi-Filegroup Topology**: Peter Chen ERD to 3NF relational transformation. Solving circular foreign key dependencies. Separation of metadata (`PRIMARY`), high-churn data (`DATA_FG`), non-clustered indexes (`INDEX_FG`), and partitioned cold storage (`ARCHIVE_FG`). Dynamic path auto-detection. Point-in-time copy-on-write sparse file snapshots. | - [`01_filegroups_and_files.sql`](file:///src/01_storage_and_schema/01_filegroups_and_files.sql)<br>- [`02_custom_types_and_rules.sql`](file:///src/01_storage_and_schema/02_custom_types_and_rules.sql)<br>- [`03_integrity_constraints.sql`](file:///src/01_storage_and_schema/03_integrity_constraints.sql)<br>- [`05_company_case_study_schema.sql`](file:///src/01_storage_and_schema/05_company_case_study_schema.sql)<br>- [`ch01-case-study-erd-and-implementation.md`](file:///docs/ch01-case-study-erd-and-implementation.md)<br>- [`02_snapshot_lifecycle.sql`](file:///src/06_reliability_and_dr/02_snapshot_lifecycle.sql) |
| **CH02: SQL Programming Essentials** | Control of flow, procedural variables, batches, transactions, and user-defined functions (Scalar, Inline, MSTVF). | **ACID Management & Performance Profiling**: Benchmarking Cursor RBAR vs Set-Based Window aggregates. Analyzing the execution plan "black box" regressions of MSTVFs vs macro expansion in Inline TVFs. SQL Server 2022 Scalar UDF inlining. | - [`05_scalar_vs_table_functions.sql`](file:///src/03_programmability_and_elt/05_scalar_vs_table_functions.sql)<br>- [`03_execution_plan_analysis.sql`](file:///src/02_indexing_and_performance/03_execution_plan_analysis.sql) |
| **CH03: Advanced Query Techniques & High Availability** | Indexed views, XML parsing (`.nodes`, `.value`), recursive CTEs, horizontal partitioning, TVPs, and disaster recovery replication. | **High-Throughput Ingestion & Scalability**: Zero-IO partition switching for sliding-window archival. Bulk ingestion via strongly-typed TVPs. Parsing semi-structured vendor XML catalogs. High Availability runbooks for Log Shipping and Always On AGs. | - [`04_partitioning_scheme.sql`](file:///src/01_storage_and_schema/04_partitioning_scheme.sql)<br>- [`01_tvps_and_bulk_ingestion.sql`](file:///src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql)<br>- [`02_xml_shredding_and_generation.sql`](file:///src/03_programmability_and_elt/02_xml_shredding_and_generation.sql)<br>- [`04_hierarchical_data_and_ctes.sql`](file:///src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql)<br>- [`02_indexed_views.sql`](file:///src/02_indexing_and_performance/02_indexed_views.sql)<br>- [`log_shipping_and_ag_guide.md`](file:///src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md) |
| **CH04: Procedures, Triggers, and SQL Automation** | Stored procedures, DML triggers, DDL triggers, managed CLR assemblies, and SMO automation. | **Pipeline Orchestration & Extensibility**: Idempotent transactional ELT procs (`SET XACT_ABORT ON`, explicit transactions, `TRY...CATCH`, `OUTPUT`). Non-locking CDC change auditing. DDL security governance via `EVENTDATA()`. CLR C# managed libraries. PowerShell/Python SMO automation. | - [`03_stored_procedures_etl.sql`](file:///src/03_programmability_and_elt/03_stored_procedures_etl.sql)<br>- [`01_audit_change_capture_triggers.sql`](file:///src/04_governance_and_audit/01_audit_change_capture_triggers.sql)<br>- [`02_ddl_and_server_triggers.sql`](file:///src/04_governance_and_audit/02_ddl_and_server_triggers.sql)<br>- [`03_dynamic_sql_guardrails.sql`](file:///src/04_governance_and_audit/03_dynamic_sql_guardrails.sql)<br>- [`SqlClrExtensions.cs`](file:///src/05_automation_and_smo/clr/SqlClrExtensions.cs)<br>- [`Deploy-ClrAssembly.sql`](file:///src/05_automation_and_smo/clr/Deploy-ClrAssembly.sql)<br>- [`BackupDatabase.ps1`](file:///src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1)<br>- [`ScriptDatabaseObjects.py`](file:///src/05_automation_and_smo/smo_scripts/ScriptDatabaseObjects.py) |
| **CH05: Reporting and Data Warehousing** | SSRS reporting, report parameters, OLTP vs OLAP differences, and dimensional modeling concepts. | **Kimball Star Schema Data Warehouse**: Normalized OLTP extracts staging to `OmniFlowDW`. Slowly Changing Dimensions (SCD Type 2 on `DimCustomer`, SCD Type 1 on `DimProduct`). Production SSRS `.rdl` report with parameters and dynamic matrix grid. | - [`01_oltp_source_schema.sql`](file:///src/07_warehousing_and_reporting/01_oltp_source_schema.sql)<br>- [`02_dimensional_star_schema.sql`](file:///src/07_warehousing_and_reporting/02_dimensional_star_schema.sql)<br>- [`03_etl_staging_to_dw.sql`](file:///src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql)<br>- [`SalesExecutiveSummary.rdl`](file:///src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl) |
| **Final Project** | Capstone integration project unifying all syllabus modules into an end-to-end database solution. | **Unified OmniFlow Data Platform**: Complete end-to-end automated deployment orchestrated via PowerShell (`deploy.ps1`) and containerized via Docker Compose, validated with an automated test suite. | - [`deploy.ps1`](file:///deploy.ps1)<br>- [`docker-compose.yml`](file:///docker/docker-compose.yml)<br>- [`test_stored_procedures.sql`](file:///tests/tSQLt/test_stored_procedures.sql)<br>- [`.github/workflows/sql-lint-ci.yml`](file:///.github/workflows/sql-lint-ci.yml) |

---

## Architectural Progression Diagram

```mermaid
flowchart LR
    subgraph CH01 ["CH01: Storage & Schemas"]
        direction TB
        FGs["Multi-Filegroups<br/>(PRIMARY, DATA, INDEX, ARCHIVE)"]
        Constraints["PK / FK / Rules / Defaults"]
        Snapshots["Sparse Snapshot Isolation"]
    end

    subgraph CH02 ["CH02: Programming & Tuning"]
        direction TB
        ACID["ACID Boundaries & Transactions"]
        Funcs["Scalar vs MSTVF vs Inline TVF"]
        Bench["RBAR vs Window Aggregates"]
    end

    subgraph CH03 ["CH03: Advanced Scalability"]
        direction TB
        Part["Range Partitioning & Sliding Windows"]
        TVP["Batch Loading via TVPs"]
        XML_P["XQuery .nodes() & FOR XML"]
        HA_Spec["Log Shipping & Always On"]
    end

    subgraph CH04 ["CH04: Procedures & Automation"]
        direction TB
        SP_ETL["Idempotent ETL (OUTPUT clause)"]
        Trig["Set-Based CDC Triggers"]
        DDL_Trig["DDL Schema Governance"]
        SMO["SMO PowerShell & Python"]
    end

    subgraph CH05 ["CH05: Data Warehousing & BI"]
        direction TB
        Kimball["Kimball Star Schema (OmniFlowDW)"]
        SCD["SCD Type 1 & Type 2 Pipelines"]
        SSRS_Rep["SSRS Matrix Reporting (.rdl)"]
    end

    CH01 --> CH02 --> CH03 --> CH04 --> CH05
```
