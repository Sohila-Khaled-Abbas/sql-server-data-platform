"""
Generate comprehensive docs/course-syllabus-mapping.md with all 102 lessons mapped to repo scripts.
"""
from generate_video_catalog import VIDEOS_SPEC

def generate_markdown():
    lines = []
    lines.append("# MaharaTech Course Syllabus to Enterprise DBRE Architecture Mapping")
    lines.append("")
    lines.append("[![Course](https://img.shields.io/badge/MaharaTech-Course%202305-red?logo=open-access&logoColor=white)](https://maharatech.gov.eg/course/view.php?id=2305)")
    lines.append("[![Institution](https://img.shields.io/badge/ITI-Information%20Technology%20Institute-8B1E28)](#)")
    lines.append("[![Instructor](https://img.shields.io/badge/Instructor-Eng.%20Rami%20Mohamed%20Abonagi-blue)](#)")
    lines.append("[![Total Lessons](https://img.shields.io/badge/Curriculum-101%20Lessons%20%2B%20Final%20Project-blueviolet)](#)")
    lines.append("")
    lines.append("This platform codebase directly implements and elevates the complete 101-module curriculum of the official ITI / MaharaTech course:")
    lines.append("**[Implementing and Developing SQL Server Objects (Course ID: 2305)](https://maharatech.gov.eg/course/view.php?id=2305)**, taught by **Eng. Rami Mohamed Abonagi**.")
    lines.append("")
    lines.append("Rather than storing isolated lecture scripts, every single lesson is re-engineered as an operational component within an enterprise-grade **Data Engineering & Database Reliability Engineering (DBRE)** data platform.")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Executive Chapter Mapping Matrix")
    lines.append("")
    lines.append("| Chapter | Title | Official Modules | Enterprise DBRE Implementation | Primary Code Artifacts |")
    lines.append("| :--- | :--- | :---: | :--- | :--- |")
    lines.append("| **CH01** | Database Creation and Management | 16 Lessons | **Storage Engine Internals & Multi-Filegroups**: Primary (`.mdf`), Secondary (`.ndf`), Log (`.ldf`) isolation. Live `ITItest` Wizard/Code implementation, custom UDDTs, rules, defaults, clustered/non-clustered B-trees, differential backups, and copy-on-write sparse file snapshots. | [`01_filegroups_and_files.sql`](../src/01_storage_and_schema/01_filegroups_and_files.sql)<br>[`01_create_database_code_ch01_vid03.sql`](../src/01_storage_and_schema/01_create_database_code_ch01_vid03.sql)<br>[`05_ititest_case_study_schema.sql`](../src/01_storage_and_schema/05_ititest_case_study_schema.sql)<br>[`01_clustered_and_nonclustered_indexes.sql`](../src/02_indexing_and_performance/01_clustered_and_nonclustered_indexes.sql)<br>[`02_snapshot_lifecycle.sql`](../src/06_reliability_and_dr/02_snapshot_lifecycle.sql) |")
    lines.append("| **CH02** | SQL Programming Essentials | 15 Lessons | **ACID Concurrency & Procedural T-SQL**: Variables, flow control (`IF/ELSE`, `WHILE`), Scalar UDF inlining, Inline Table-Valued Functions (iTVF) vs Multi-Statement TVF (MSTVF) cardinality bottlenecks, system DB internals (`tempdb`), and explicit transactions with savepoints. | [`05_scalar_vs_table_functions.sql`](../src/03_programmability_and_elt/05_scalar_vs_table_functions.sql)<br>[`03_execution_plan_analysis.sql`](../src/02_indexing_and_performance/03_execution_plan_analysis.sql)<br>[`03_stored_procedures_etl.sql`](../src/03_programmability_and_elt/03_stored_procedures_etl.sql) |")
    lines.append("| **CH03** | Advanced Query Techniques & High Availability | 23 Lessons | **High-Throughput Ingestion & Disaster Recovery**: Indexed views (`WITH SCHEMABINDING`), sliding-window partition switching (`ALTER TABLE SWITCH`), semi-structured XML shredding (`.nodes()`, `.value()`), hierarchical CTEs, batch TVP streaming, Database Mirroring, and Log Shipping. | [`02_indexed_views.sql`](../src/02_indexing_and_performance/02_indexed_views.sql)<br>[`04_partitioning_scheme.sql`](../src/01_storage_and_schema/04_partitioning_scheme.sql)<br>[`01_tvps_and_bulk_ingestion.sql`](../src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql)<br>[`02_xml_shredding_and_generation.sql`](../src/03_programmability_and_elt/02_xml_shredding_and_generation.sql)<br>[`log_shipping_and_ag_guide.md`](../src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md) |")
    lines.append("| **CH04** | Procedures, Triggers, and SQL Automation | 27 Lessons | **Governance, Extensibility & DevOps Automation**: Idempotent transactional ELT procs with `OUTPUT`, non-locking CDC audit triggers (`inserted`/`deleted`), server-level DDL protection (`EVENTDATA()`), C# SQL CLR functions/types/procs/triggers, and PowerShell/Python SMO automation. | [`03_stored_procedures_etl.sql`](../src/03_programmability_and_elt/03_stored_procedures_etl.sql)<br>[`01_audit_change_capture_triggers.sql`](../src/04_governance_and_audit/01_audit_change_capture_triggers.sql)<br>[`02_ddl_and_server_triggers.sql`](../src/04_governance_and_audit/02_ddl_and_server_triggers.sql)<br>[`SqlClrExtensions.cs`](../src/05_automation_and_smo/clr/SqlClrExtensions.cs)<br>[`BackupDatabase.ps1`](../src/05_automation_and_smo/smo_scripts/BackupDatabase.ps1) |")
    lines.append("| **CH05** | Reporting and Data Warehousing | 20 Lessons | **Kimball Dimensional Warehousing & SSRS**: Paginated `.rdl` report design, expressions, grouping, matrix drill-downs, cascading parameters, RDLC integration, 3NF OLTP vs Star Schema OLAP, and Slowly Changing Dimensions (SCD Type 1 & 2). | [`01_oltp_source_schema.sql`](../src/07_warehousing_and_reporting/01_oltp_source_schema.sql)<br>[`02_dimensional_star_schema.sql`](../src/07_warehousing_and_reporting/02_dimensional_star_schema.sql)<br>[`03_etl_staging_to_dw.sql`](../src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql)<br>[`SalesExecutiveSummary.rdl`](../src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl) |")
    lines.append("| **Final** | Final Project | 1 Lesson | **Unified OmniFlow Data Platform**: Complete end-to-end multi-filegroup, partitioned, automated, and tested platform with automated CI/CD and interactive Web IDE. | [`deploy.ps1`](../deploy.ps1)<br>[`test_stored_procedures.sql`](../tests/tSQLt/test_stored_procedures.sql)<br>[`test_data_platform.py`](../tests/python/test_data_platform.py) |")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Complete 101-Module Curriculum Syllabus Breakdown")
    lines.append("")

    chap_names = {
        1: "CH01: Database Creation and Management",
        2: "CH02: SQL Programming Essentials",
        3: "CH03: Advanced Query Techniques and High Availability",
        4: "CH04: Procedures, Triggers, and SQL Automation",
        5: "CH05: Reporting and Data Warehousing",
        6: "Final Project: Enterprise Capstone Platform"
    }

    current_c = None
    for item in VIDEOS_SPEC:
        c = item["chap"]
        if c != current_c:
            current_c = c
            lines.append(f"### {chap_names[c]}")
            lines.append("")
            lines.append("| Video Code | Lesson Title | Duration | Level | MaharaTech Portal Link | Repository Code Artifact |")
            lines.append("| :--- | :--- | :---: | :---: | :--- | :--- |")

        code = item["code"]
        title = item["title"]
        dur = item["dur"]
        lvl = item["level"]
        url = f"https://maharatech.gov.eg/mod/hvp/view.php?id={item['m_id']}"
        repo = item["repo"]
        lines.append(f"| `{code}` | {title} | {dur} | {lvl} | [Watch on MaharaTech]({url}) | [`{repo.split('/')[-1]}`](../{repo}) |")

    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Architectural Progression Diagram")
    lines.append("")
    lines.append("```mermaid")
    lines.append("flowchart LR")
    lines.append("    subgraph CH01 [\"CH01: Storage & Schemas (16 Lessons)\"]")
    lines.append("        direction TB")
    lines.append("        FGs[\"Multi-Filegroups<br/>(PRIMARY, fg1, fg2, ARCHIVE)\"]")
    lines.append("        Constraints[\"PK / FK / Rules / Defaults / UDDTs\"]")
    lines.append("        Indexes[\"Clustered & Non-Clustered B-Trees\"]")
    lines.append("        Snapshots[\"Sparse Snapshot Isolation & Backups\"]")
    lines.append("    end")
    lines.append("")
    lines.append("    subgraph CH02 [\"CH02: Programming & Tuning (15 Lessons)\"]")
    lines.append("        direction TB")
    lines.append("        Variables[\"Local / Global Variables & Flow Control\"]")
    lines.append("        Funcs[\"Scalar Inlining vs iTVF vs MSTVF\"]")
    lines.append("        TempT[\"Permanent vs #Temp vs @TableVariable\"]")
    lines.append("        ACID[\"ACID Boundaries, Transactions & Savepoints\"]")
    lines.append("    end")
    lines.append("")
    lines.append("    subgraph CH03 [\"CH03: Advanced Scalability (23 Lessons)\"]")
    lines.append("        direction TB")
    lines.append("        Views_P[\"Indexed Views (SCHEMABINDING)\"]")
    lines.append("        Part[\"Range Partitioning & Sliding Windows\"]")
    lines.append("        XML_P[\"XQuery .nodes() & FOR XML\"]")
    lines.append("        HA_Spec[\"Database Mirroring & Log Shipping\"]")
    lines.append("    end")
    lines.append("")
    lines.append("    subgraph CH04 [\"CH04: Procedures & Automation (27 Lessons)\"]")
    lines.append("        direction TB")
    lines.append("        SP_ETL[\"Idempotent ETL (OUTPUT clause)\"]")
    lines.append("        Trig[\"Set-Based CDC Triggers (inserted/deleted)\"]")
    lines.append("        CLR[\"Managed C# SQL CLR Assemblies\"]")
    lines.append("        SMO[\"SMO Automation (PowerShell & Python)\"]")
    lines.append("    end")
    lines.append("")
    lines.append("    subgraph CH05 [\"CH05: Data Warehousing & BI (20 Lessons)\"]")
    lines.append("        direction TB")
    lines.append("        Kimball[\"Kimball Star Schema (OmniFlowDW)\"]")
    lines.append("        SCD[\"SCD Type 1 & Type 2 Pipelines\"]")
    lines.append("        SSRS_Rep[\"SSRS Paginated Matrix Reports (.rdl)\"]")
    lines.append("        RDLC[\"Local Embedded Client RDLC Reports\"]")
    lines.append("    end")
    lines.append("")
    lines.append("    subgraph Capstone [\"Final Project: OmniFlow Platform\"]")
    lines.append("        direction TB")
    lines.append("        Unified[\"End-to-End Enterprise Deployment\"]")
    lines.append("        Tests[\"tSQLt & Python Test Suite\"]")
    lines.append("        WebIDE[\"Interactive SSMS & WASM Web App\"]")
    lines.append("    end")
    lines.append("")
    lines.append("    CH01 --> CH02 --> CH03 --> CH04 --> CH05 --> Capstone")
    lines.append("```")
    lines.append("")

    return "\n".join(lines)

if __name__ == "__main__":
    content = generate_markdown()
    with open("docs/course-syllabus-mapping.md", "w", encoding="utf-8") as f:
        f.write(content)
    print("Generated docs/course-syllabus-mapping.md successfully.")
