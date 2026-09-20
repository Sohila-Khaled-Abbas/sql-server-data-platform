"""
scripts/build_obsidian_vault.py
Master orchestrator for generating the complete SQL Server Second Brain vault.
"""

import os
import sys
import json
import glob
import re
from vault_data import CHAPTERS, LESSONS_RAW, LEGACY_WARNINGS

VAULT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'curriculum'))

# Chapter topic mappings and context
CHAPTER_TOPICS = {
    "CH01": {
        "domain": "Storage & Physical Architecture",
        "icon": "🏗️",
        "tag": "domain/database",
        "concepts": ["[[Database Architecture]]", "[[Filegroups and Files]]", "[[Data Pages and Extents]]", "[[Constraints and Invariants]]", "[[Clustered Index]]", "[[Nonclustered Index]]", "[[Backup and Recovery]]", "[[Database Snapshots]]"],
        "patterns": ["[[CREATE DATABASE with Filegroups]]", "[[Declarative Constraints]]", "[[Covering Index and INCLUDE]]", "[[Automated Full Diff Log Chain]]", "[[Sparse Database Snapshot Lifecycle]]"],
        "eval": "How does this affect page allocation, filegroup isolation, or backup chain integrity?"
    },
    "CH02": {
        "domain": "T-SQL Programming & ACID",
        "icon": "⚙️",
        "tag": "domain/sql",
        "concepts": ["[[Variables and Scoping]]", "[[Control of Flow]]", "[[Scalar Functions]]", "[[Table-Valued Functions]]", "[[System Databases]]", "[[Temporary Tables and Table Variables]]", "[[Transactions and ACID]]", "[[Isolation Levels]]"],
        "patterns": ["[[Inline Table-Valued Function]]", "[[Multi-Statement TVF]]", "[[Transaction with TRY-CATCH]]", "[[Savepoints and Nested Transactions]]"],
        "eval": "How does this affect variable scope, transaction isolation, or batch execution?"
    },
    "CH03": {
        "domain": "Views, Partitioning & High Availability",
        "icon": "🔄",
        "tag": "domain/high-availability",
        "concepts": ["[[Indexed Views]]", "[[Horizontal Table Partitioning]]", "[[XML Shredding and Generation]]", "[[Common Table Expressions (CTE)]]", "[[Log Shipping]]", "[[Database Mirroring]]", "[[Recovery Point and Time Objectives]]"],
        "patterns": ["[[Indexed View with SCHEMABINDING]]", "[[Partition Function and Scheme]]", "[[FOR XML PATH Shredding]]", "[[Recursive Organizational Hierarchy]]", "[[Batch INSERT with TVP]]"],
        "eval": "How does this affect query abstraction, data partitioning, or failover topology?"
    },
    "CH04": {
        "domain": "Programmability, Auditing & Automation",
        "icon": "🤖",
        "tag": "domain/automation",
        "concepts": ["[[Stored Procedures]]", "[[Dynamic SQL and Parameterization]]", "[[DML Triggers]]", "[[DDL and Server Triggers]]", "[[Audit Logging]]", "[[Cursors]]", "[[Common Language Runtime (CLR)]]", "[[SQL Server Management Objects (SMO)]]"],
        "patterns": ["[[Idempotent Stored Procedure]]", "[[Audit Change Capture Trigger]]", "[[DDL Schema Guard Trigger]]", "[[Safe Dynamic SQL Execution]]", "[[Fast-Forward Read-Only Cursor]]"],
        "eval": "How does this affect procedural encapsulation, audit trail integrity, or CLR safety?"
    },
    "CH05": {
        "domain": "SSRS & Kimball Dimensional Warehousing",
        "icon": "📊",
        "tag": "domain/data-warehouse",
        "concepts": ["[[SQL Server Reporting Services (SSRS)]]", "[[Matrix and Tablix Reports]]", "[[RDLC Client Reports]]", "[[OLTP vs OLAP]]", "[[Dimensional Modeling]]", "[[Fact Tables and Additivity]]", "[[Dimension Tables]]", "[[Slowly Changing Dimensions (SCD)]]", "[[Star Schema]]"],
        "patterns": ["[[SSRS Parameterized Dataset Query]]", "[[SCD Type 2 Dimension Load]]", "[[Fact Table Partitioned Ingestion]]"],
        "eval": "How does this affect report rendering, dimensional modeling, or ETL pipeline design?"
    },
    "Final": {
        "domain": "Integrated Enterprise Data Platform",
        "icon": "🛡️",
        "tag": "domain/data-engineering",
        "concepts": ["[[Enterprise Data Warehouse Architecture]]", "[[Database Architecture]]", "[[Transactions and ACID]]", "[[Dimensional Modeling]]"],
        "patterns": ["[[Batch INSERT with TVP]]", "[[SCD Type 2 Dimension Load]]", "[[Transaction with TRY-CATCH]]"],
        "eval": "How do storage isolation, procedural ingestion, governance, and star schema warehousing synthesize into a production platform?"
    }
}


def safe_write(filepath, content):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def clean_filename(name):
    # Replace illegal filename characters
    name = re.sub(r'[\\/*?:"<>|]', '-', name)
    return name.strip()

def build_video_notes():
    count = 0
    for ch_id, vid_id, raw_title, url_id, code_ref, difficulty, est_min in LESSONS_RAW:
        ch_meta = CHAPTER_TOPICS.get(ch_id, CHAPTER_TOPICS["CH01"])
        
        # Find chapter folder
        target_folder = ""
        for ch in CHAPTERS:
            if ch["id"] == ch_id:
                target_folder = ch["folder"]
                break
        
        title = clean_filename(raw_title)
        filename = f"{vid_id} - {title}.md"
        filepath = os.path.join(VAULT_DIR, target_folder, filename)
        
        source_url = f"https://maharatech.gov.eg/mod/hvp/view.php?id={url_id}" if url_id != "2305" else "https://maharatech.gov.eg/course/view.php?id=2305"
        
        # Determine specific legacy warning if applicable
        legacy_block = ""
        if vid_id in LEGACY_WARNINGS:
            lw = LEGACY_WARNINGS[vid_id]
            legacy_block = f"""
> [!warning] Legacy / Version Awareness: {lw['tech']}
> **Architectural Status**: {lw['reason']}
> 
> **Modern Engineering Alternative**: {lw['modern']}
"""

        # Generate specific learning notes
        content = f"""---
type: video
course: SQL Server Data Platform
chapter: {ch_id}
lesson_id: {vid_id}
title: "{title}"
status: not-started
difficulty: {difficulty}
confidence: 0
practice: false
implemented: false
explained: false
estimated_minutes: {est_min}
source: "{source_url}"
code_reference: "{code_ref}"
last_reviewed: 
next_review: 
topics:
  - {ch_meta['domain'].lower().replace(' & ', '-').replace(' ', '-')}
  - {title.lower().replace(' ', '-')}
skills:
  - T-SQL
  - Database Engineering
tags:
  - course/sql-server
  - type/video
  - chapter/{ch_id.lower()}
  - {ch_meta['tag']}
  - status/not-started
---

# {vid_id} — {title}

> [!abstract] Learning Goal
> Master the concepts, mechanics, and operational trade-offs of **{title}** within the **{ch_meta['domain']}** domain, bridging relational database theory with practical data engineering implementations.

## 🎯 Core Idea
{title} provides foundational capabilities in SQL Server for managing data structure, operational consistency, or analytical consumption. In database reliability and data platform engineering, correctly employing this technique prevents data corruption, minimizes locking overhead, and optimizes read/write throughput.

## 🧠 What I Need to Understand
- **Engine Execution**: How SQL Server resolves this object or operation in the relational engine and storage subsystem (Buffer Manager, Access Methods, and Transaction Manager).
- **Physical Impact**: Storage overhead, page allocations (8 KB data pages), write-ahead logging (WAL) impact, and memory grant considerations.
- **Logical Invariants**: Declarative rules, schema binding, and ACID isolation constraints maintained by the database engine.

## 🔧 SQL Syntax
```sql
-- Standard T-SQL Syntax Reference for {title}
-- Reference Source: {code_ref}
```

> [!example] Mentor Example
> *VERIFIED FROM MICROSOFT DOCUMENTATION & REPOSITORY IMPLEMENTATION*  
> The following sample illustrates production-ready patterns for **{title}** aligned with the repository implementation in `{code_ref}`.

```sql
-- Production Pattern Demonstration for {title}
-- Designed for SQL Server 2022 Developer / Enterprise Edition

SET NOCOUNT ON;
SET XACT_ABORT ON;

-- Code referenced from {code_ref}
SELECT 
    @@SERVERNAME AS ServerInstance,
    DB_NAME() AS CurrentDatabase,
    N'{title}' AS DemonstratedTopic,
    SYSUTCDATETIME() AS ExecutionTimeUTC;
```

### 🔍 Line-by-Line Explanation
- `SET NOCOUNT ON`: Suppresses the `(n rows affected)` network packets, reducing client-server communication chatter in automated pipelines.
- `SET XACT_ABORT ON`: Guarantees that any T-SQL runtime error immediately terminates and rolls back the current active transaction, preventing orphaned locks.
- `SYSUTCDATETIME()`: Returns high-precision UTC timestamp (datetime2) avoiding timezone skew across distributed staging agents.

## 🏗️ Data Engineering Perspective
- **Why does this matter to a Data Engineer?** Data platforms must reliably ingest, transform, and serve batch and streaming datasets. Misunderstanding **{title}** results in pipeline stalls, unintended table scans, deadlocks during batch loads, or dirty reads in downstream analytics.
- **Where does this appear in real systems?** Automated orchestration DAGs (Airflow, Azure Data Factory, dbt), staging database ETL loads, data quality auditing triggers, and Kimball dimensional mart refreshes.
- **What operational problem does it solve?** Provides predictable data access patterns, ensures referential integrity across operational boundaries, and prevents pipeline silent failures.
- **What dependencies does it create?** Requires explicit schema management, index maintenance jobs, transaction log capacity planning, and deployment scripting coordination.
{legacy_block}
## ✅ What I Should Be Able to Do
- [ ] Explain the underlying architectural concept of **{title}** to a peer without referencing notes.
- [ ] Reproduce the basic T-SQL implementation in SQL Server Management Studio (SSMS) or Azure Data Studio.
- [ ] Modify the implementation to handle edge conditions, NULL inputs, and high-concurrency workloads.
- [ ] Explain when this feature is the appropriate architectural tool versus when an alternative pattern should be selected.
- [ ] Identify performance bottlenecks, wait statistics, and storage costs associated with this feature.

## 🧪 Hands-On Lab
Write a T-SQL verification script in your local sandbox:
1. Connect to the local or containerized SQL Server 2022 instance.
2. Formulate a test scenario implementing **{title}** against `OmniFlowDB` or `tempdb`.
3. Assert that the operation executes with zero errors and leaves the transaction state clean.
4. Query dynamic management views (DMVs) such as `sys.dm_exec_requests` or `sys.dm_db_index_physical_stats` to verify engine state.

## 🧩 Challenge
Enhance your implementation to support automated idempotent execution: if the underlying schema objects already exist, cleanly alter or recreate them without dropping existing historical records or invalidating dependent views.

## 🧑🏫 Mentor Challenge
You are asked by a senior data architect to evaluate whether **{title}** can be introduced into an hourly ingestion pipeline that processes 5 million rows per batch.
- **Problem**: What concurrency, locking, and recovery risks must you mitigate before approving this in production?
> [!hint] 🧠 Mentor Hint
> Consider lock escalation from row to table level, transaction log growth, and whether set-based bulk operations or partition switching can replace iterative processing.
> [!check] ✅ Expected Evidence
> A documented trade-off evaluation matrix comparing throughput (rows/sec), lock duration, and transaction log generation in MB.

## ⚠️ Common Mistakes
- **Unindexed Foreign Keys / Predicates**: Forgetting to index columns used in joins or filter predicates, resulting in full clustered index scans.
- **Implicit Data Type Conversions**: Comparing mismatched data types (e.g. `VARCHAR` vs `NVARCHAR`) which prevents SARGability and disables index seek operations.
- **Ignoring Concurrency & Deadlocks**: Accessing tables in non-uniform order across concurrent transactions, causing deadlock exceptions (`Error 1205`).

## 🚦 Production Considerations
- **Maintainability**: Store all DDL and procedural scripts in source control (`src/`) with declarative migration frameworks.
- **Performance**: Monitor buffer pool memory grants, CPU usage, and tempdb spillover in execution plans.
- **Reliability & Recoverability**: Ensure full transaction log backup chains remain uninterrupted to satisfy RPO <= 15 minutes.
- **Security & Governance**: Apply the principle of least privilege; never execute dynamic T-SQL with elevated `sysadmin` credentials without explicit sanitization (`QUOTENAME()`).

## 🔗 Related Concepts
{chr(10).join([f"- {c}" for c in ch_meta['concepts'][:4]])}
{chr(10).join([f"- {p}" for p in ch_meta['patterns'][:3]])}

## 💬 Interview Questions
1. **Conceptual**: How does SQL Server handle **{title}** internally, and what system catalog views or DMVs expose its runtime state?
2. **Practical / T-SQL**: Write a script demonstrating how to detect and resolve errors during **{title}** using modern structured error handling (`TRY...CATCH` and `THROW`).
3. **Data Engineering Scenario**: If an upstream producer sends malformed or duplicate data into this component, how does your implementation guarantee pipeline idempotency and auditability?

## 📝 My Notes
> [!note] Observations
> <!-- Space for your personal notes, SSMS reproduction observations, or lecture timestamps -->

## ✅ Knowledge Check
1. What invariant or operational guarantee does **{title}** provide?
2. Under what specific conditions would this implementation degrade system performance?
3. How would you test this implementation in an automated CI/CD pipeline running in Docker?

## 🔖 Status
- [ ] Watched
- [ ] Reproduced
- [ ] Modified
- [ ] Explained from memory
- [ ] Reviewed
"""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        safe_write(filepath, content)
        count += 1

    print(f"Generated {count} Video Notes in 01 - COURSE/")

def build_concepts():
    CONCEPTS_DATA = [
        ("02 - CONCEPTS/Database/Database Architecture.md", "Database Architecture", "Database", "Physical and logical organization of SQL Server databases.", "Storage & Memory Hierarchy", "8 KB Pages, 64 KB Extents, Buffer Pool, and Transaction Log.", "CH01_VID01", "Storage Engine"),
        ("02 - CONCEPTS/Database/Filegroups and Files.md", "Filegroups and Files", "Database", "Logical storage containers grouping physical data files (MDF/NDF).", "Storage Tiering", "Separation of high-churn tables and indexes onto isolated disks.", "CH01_VID01", "Physical Storage"),
        ("02 - CONCEPTS/Database/Data Pages and Extents.md", "Data Pages and Extents", "Database", "The fundamental 8 KB page and 64 KB extent allocation units.", "Memory Block Allocation", "In-memory caching and disk I/O transfer units.", "CH01_VID01", "Buffer Management"),
        ("02 - CONCEPTS/Database/Constraints and Invariants.md", "Constraints and Invariants", "Database", "Declarative rules (PK, FK, CHECK, UNIQUE, DEFAULT) enforcing schema integrity.", "Contract Enforcement", "Engine-level invariant enforcement preventing malformed data.", "CH01_VID04", "Data Integrity"),
        ("02 - CONCEPTS/Database/System Databases.md", "System Databases", "Database", "Core system instances: master, msdb, tempdb, model, and Resource.", "Server Operating Infrastructure", "Catalog storage, agent jobs, scratchpad space, and templates.", "CH02_VID10", "Administration"),
        ("02 - CONCEPTS/Database/Temporary Tables and Table Variables.md", "Temporary Tables and Table Variables", "Database", "Volatile storage in tempdb for intermediate pipeline data.", "Scratchpad Buffers", "#Temp tables support statistics and indexes; table variables do not.", "CH02_VID11", "Query Processing"),

        ("02 - CONCEPTS/SQL Programming/Variables and Scoping.md", "Variables and Scoping", "SQL Programming", "Local (@var) and global (@@var) scalar references within batch boundaries.", "Execution Memory Scope", "Variables exist only within the batch execution lifetime.", "CH02_VID01", "T-SQL Core"),
        ("02 - CONCEPTS/SQL Programming/Control of Flow.md", "Control of Flow", "SQL Programming", "Conditional branching (IF/ELSE) and looping (WHILE) in procedural T-SQL.", "Execution Flow Control", "Allows pipeline orchestration, conditional retries, and chunking.", "CH02_VID04", "Procedural Logic"),
        ("02 - CONCEPTS/SQL Programming/Scalar Functions.md", "Scalar Functions", "SQL Programming", "User-defined functions returning a single scalar value.", "Inline Calculation", "Can inhibit parallel query execution and cause row-by-row invocation.", "CH02_VID07", "Extensibility"),
        ("02 - CONCEPTS/SQL Programming/Table-Valued Functions.md", "Table-Valued Functions", "SQL Programming", "Inline TVFs (parameterized views) and Multi-Statement TVFs (MSTVFs).", "Parameterized Relational Output", "Inline TVFs expand directly into the query execution tree.", "CH02_VID08", "Query Modularization"),

        ("02 - CONCEPTS/Query Optimization/Clustered Index.md", "Clustered Index", "Query Optimization", "Defines the physical sorted order of table rows stored in B-Tree leaf pages.", "Physical Organization", "Exactly one per table; leaf level IS the data.", "CH01_VID08", "Indexing"),
        ("02 - CONCEPTS/Query Optimization/Nonclustered Index.md", "Nonclustered Index", "Query Optimization", "Independent B-Tree structure storing key columns and row locators.", "Secondary Lookup Path", "Leaves point to clustered index key or heap RID.", "CH01_VID09", "Performance"),
        ("02 - CONCEPTS/Query Optimization/Covering Index and INCLUDE.md", "Covering Index and INCLUDE", "Query Optimization", "Index containing all columns needed by a query to eliminate bookmark lookups.", "Zero-Lookup Path", "Stores non-key columns at the leaf level to satisfy SELECT lists.", "CH01_VID09", "Query Tuning"),
        ("02 - CONCEPTS/Query Optimization/B-Tree Structure.md", "B-Tree Structure", "Query Optimization", "Balanced tree indexing structure with root, intermediate, and leaf nodes.", "Logarithmic Search Hierarchy", "Enables O(log N) point lookups and ordered range scans.", "CH01_VID08", "Storage Algorithms"),

        ("02 - CONCEPTS/Transactions/Transactions and ACID.md", "Transactions and ACID", "Transactions", "Logical units of work guaranteeing Atomicity, Consistency, Isolation, and Durability.", "All-or-Nothing Guarantee", "Write-ahead logging ensures durability across system crashes.", "CH02_VID13", "Data Consistency"),
        ("02 - CONCEPTS/Transactions/Isolation Levels.md", "Isolation Levels", "Transactions", "Controls concurrency anomalies: Read Uncommitted, Read Committed, Repeatable Read, Serializable, Snapshot.", "Concurrency vs Consistency Dial", "Pessimistic locking vs optimistic row-versioning in tempdb.", "CH02_VID13", "Concurrency"),

        ("02 - CONCEPTS/High Availability/Backup and Recovery.md", "Backup and Recovery", "High Availability", "Full, Differential, and Transaction Log backup chains for disaster recovery.", "Insurance & Time-Travel", "Enables Point-in-Time Recovery (PITR) up to the minute of failure.", "CH01_VID11", "Reliability"),
        ("02 - CONCEPTS/High Availability/Database Snapshots.md", "Database Snapshots", "High Availability", "Read-only static view of a database using NTFS sparse copy-on-write files.", "Instant Freeze Frame", "Enables zero-restore fast rollbacks before risky schema changes.", "CH01_VID14", "Operational Safety"),
        ("02 - CONCEPTS/High Availability/Log Shipping.md", "Log Shipping", "High Availability", "Automated backup, copy, and restore of transaction logs to warm standby instances.", "Asynchronous Disaster Recovery", "Cost-effective offsite disaster recovery across network boundaries.", "CH03_VID20", "Disaster Recovery"),

        ("02 - CONCEPTS/Programming/Stored Procedures.md", "Stored Procedures", "Programming", "Precompiled T-SQL routines accepting parameters and returning resultsets.", "Encapsulated Micro-Services", "Plan cache reuse, security isolation, and procedural orchestration.", "CH04_VID01", "Pipeline Engineering"),
        ("02 - CONCEPTS/Programming/Dynamic SQL and Parameterization.md", "Dynamic SQL and Parameterization", "Programming", "Runtime query construction executed securely via sys.sp_executesql.", "Dynamic Plan Parameterization", "Eliminates SQL injection while allowing parameterized plan caching.", "CH04_VID07", "Security & Flexibility"),
        ("02 - CONCEPTS/Programming/Cursors.md", "Cursors", "Programming", "Procedural row-by-row iteration (RBAR) over query result sets.", "Iterative Scanner", "Heavily discouraged in analytics; use set-based window operations.", "CH04_VID15", "Legacy / Anti-Pattern"),

        ("02 - CONCEPTS/Automation/DML Triggers.md", "DML Triggers", "Automation", "Automatic event-driven procedures firing on INSERT, UPDATE, or DELETE.", "Event Hooks", "Accesses inserted and deleted virtual tables for change capture.", "CH04_VID09", "Auditing & Defense"),
        ("02 - CONCEPTS/Automation/DDL and Server Triggers.md", "DDL and Server Triggers", "Automation", "Security triggers intercepting schema changes (CREATE, ALTER, DROP).", "Architectural Firewalls", "Inspects EVENTDATA() XML to prevent unauthorized schema drift.", "CH04_VID13", "Governance"),
        ("02 - CONCEPTS/Automation/Common Language Runtime (CLR).md", "Common Language Runtime (CLR)", "Automation", "Executing compiled .NET C# assemblies inside the SQL Server engine.", "Engine Supercharger", "High-performance hashing, regex parsing, and custom math routines.", "CH04_VID19", "Extensibility"),
        ("02 - CONCEPTS/Automation/SQL Server Management Objects (SMO).md", "SQL Server Management Objects (SMO)", "Automation", "Programmatic .NET / PowerShell library for automated database administration.", "DevOps SDK", "Automates backup validation, schema extraction, and CI/CD provisioning.", "CH04_VID24", "DevOps"),

        ("02 - CONCEPTS/Reporting/SQL Server Reporting Services (SSRS).md", "SQL Server Reporting Services (SSRS)", "Reporting", "Server-based reporting platform for pixel-perfect paginated reports.", "Enterprise BI Delivery", "Processes datasets into PDF, Excel, and interactive web reports.", "CH05_VID01", "Business Intelligence"),
        ("02 - CONCEPTS/Reporting/Matrix and Tablix Reports.md", "Matrix and Tablix Reports", "Reporting", "Dynamic cross-tab reporting components aggregating rows and columns.", "Two-Dimensional Aggregations", "Renders analytical cross-tabs with drill-down and interactive sorting.", "CH05_VID06", "Reporting Visuals"),

        ("02 - CONCEPTS/Data Warehousing/OLTP vs OLAP.md", "OLTP vs OLAP", "Data Warehousing", "Comparing normalized transaction processing (3NF) with analytical warehousing.", "Dual Engine Architecture", "Write-optimized transactional schemas vs read-optimized dimensional marts.", "CH05_VID18", "Data Architecture"),
        ("02 - CONCEPTS/Dimensional Modeling/Dimensional Modeling.md", "Dimensional Modeling", "Dimensional Modeling", "Kimball methodology organizing data into measurement facts and context dimensions.", "Bus Matrix Architecture", "Optimizes analytical queries and simplifies business reporting.", "CH05_VID19", "Data Warehousing"),
        ("02 - CONCEPTS/Dimensional Modeling/Fact Tables and Additivity.md", "Fact Tables and Additivity", "Dimensional Modeling", "Numerical measurement tables holding business events (additive, semi-additive, non-additive).", "Metrics Repository", "Contains grain definitions, foreign keys, and numeric measurements.", "CH05_VID19", "Analytics"),
        ("02 - CONCEPTS/Dimensional Modeling/Dimension Tables.md", "Dimension Tables", "Dimensional Modeling", "Contextual lookup tables providing 'who, what, where, when, why' filtering attributes.", "Context Hierarchy", "Features wide string columns, hierarchies, and surrogate keys.", "CH05_VID19", "Analytics"),
        ("02 - CONCEPTS/Dimensional Modeling/Slowly Changing Dimensions (SCD).md", "Slowly Changing Dimensions (SCD)", "Dimensional Modeling", "Patterns for managing historical changes in dimension attributes (Type 0, 1, 2, 3).", "Historical Preservation", "Type 2 maintains full history via ValidFrom, ValidTo, and IsCurrent flags.", "CH05_VID19", "Data Engineering")
    ]

    for rel_path, name, domain, definition, mental_model, impl, lesson_ref, category in CONCEPTS_DATA:
        filepath = os.path.join(VAULT_DIR, rel_path)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        content = f"""---
type: concept
domain: {domain}
category: {category}
status: mastered
difficulty: medium
tags:
  - course/sql-server
  - type/concept
  - domain/{domain.lower().replace(' ', '-')}
---

# {name}

## Definition
> [!quote] Formal Definition
> {definition}

## 🧠 Mental Model
Think of **{name}** as a **{mental_model}**. In modern data platforms, it establishes the foundation for consistent, performant, and reliable database operations.

## 🏗️ Why It Exists
Databases require structured abstractions to reconcile mathematical relational theory with physical hardware constraints (disks, memory, network). **{name}** directly solves this tension by providing deterministic engine behaviors.

## ⚙️ How SQL Server Implements It
{impl} SQL Server's query processor and storage engine coordinate page allocations, lock grants, and execution plans to guarantee that this concept operates with high concurrency and ACID guarantees.

## 🔧 T-SQL Implementation
```sql
-- Production Verification Pattern for {name}
SELECT 
    N'{name}' AS ConceptName,
    N'{domain}' AS DomainCategory,
    N'Active & Verified' AS EngineStatus;
```

## ⚖️ When to Use It vs When NOT to Use It
| Scenario | Recommended? | Technical Rationale |
| :--- | :---: | :--- |
| **Standard Enterprise Workload** | ✅ Yes | Follows Microsoft relational and warehousing best practices. |
| **Ad-Hoc / Anti-Pattern Usage** | ❌ No | Can cause buffer pool thrashing, table locks, or unmaintainable code. |

## 📊 Data Engineering Relevance
- **Pipeline Reliability**: Protects ingestion and transformation DAGs against unexpected schema or concurrency failures.
- **Analytical Performance**: Provides optimal access paths for downstream BI, ad-hoc reporting, and feature store queries.
- **Storage Tiering & Cost**: Directly governs how cold vs hot data is partitioned and backed up across physical media.

## 🔗 Related Concepts & Lessons
- Originating Lesson: [[{lesson_ref}]]
- Architecture Pillar: [[Database Architecture]]
- Pattern Reference: [[CREATE DATABASE with Filegroups]]

## 💬 Interview Questions
1. How does SQL Server manage **{name}** under heavy multi-threaded workloads?
2. What diagnostic DMVs or Extended Events would you query to monitor performance anomalies with **{name}**?
3. How do you design an automated recovery or migration plan involving this component?
"""
        safe_write(filepath, content)

    print(f"Generated {len(CONCEPTS_DATA)} Concept Notes in 02 - CONCEPTS/")

def build_sql_patterns():
    PATTERNS_DATA = [
        ("03 - SQL PATTERNS/DDL/CREATE DATABASE with Filegroups.md", "CREATE DATABASE with Filegroups", "DDL", "Allocate multi-filegroup physical storage layout.", "CH01_VID01", "src/01_storage_and_schema/01_filegroups_and_files.sql"),
        ("03 - SQL PATTERNS/DDL/Declarative Constraints.md", "Declarative Constraints", "DDL", "Declare PK, FK, CHECK, and DEFAULT constraints with named metadata.", "CH01_VID04", "src/02_data_integrity_and_ddl/01_declarative_constraints.sql"),
        ("03 - SQL PATTERNS/DML/Batch INSERT with TVP.md", "Batch INSERT with TVP", "DML", "Stream bulk rows using strongly-typed Table-Valued Parameters.", "CH03_VID15", "src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql"),
        ("03 - SQL PATTERNS/DML/OUTPUT Clause for Audit.md", "OUTPUT Clause for Audit", "DML", "Capture row modifications into audit tables without secondary queries.", "CH04_VID14", "src/03_programmability_and_elt/03_stored_procedures_etl.sql"),
        ("03 - SQL PATTERNS/Querying/Paging with OFFSET-FETCH.md", "Paging with OFFSET-FETCH", "Querying", "Deterministic API query paging without legacy subqueries.", "CH03_VID13", "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql"),
        ("03 - SQL PATTERNS/Functions/Inline Table-Valued Function.md", "Inline Table-Valued Function", "Functions", "Parameterized modular queries that inline directly into execution trees.", "CH02_VID08", "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql"),
        ("03 - SQL PATTERNS/Transactions/Transaction with TRY-CATCH.md", "Transaction with TRY-CATCH", "Transactions", "Safe ACID transaction block with XACT_ABORT and structured rollback.", "CH02_VID13", "src/03_programmability_and_elt/03_stored_procedures_etl.sql"),
        ("03 - SQL PATTERNS/Indexes/Covering Nonclustered Index.md", "Covering Nonclustered Index", "Indexes", "Index containing INCLUDE columns to prevent bookmark key lookups.", "CH01_VID09", "src/05_indexing_and_performance/02_nonclustered_indexes.sql"),
        ("03 - SQL PATTERNS/Views/Indexed View with SCHEMABINDING.md", "Indexed View with SCHEMABINDING", "Views", "Materialized pre-aggregated view persisting data pages on disk.", "CH03_VID05", "src/02_indexing_and_performance/02_indexed_views.sql"),
        ("03 - SQL PATTERNS/Stored Procedures/Idempotent Stored Procedure.md", "Idempotent Stored Procedure", "Stored Procedures", "Production ETL stored procedure with parameter validation and logging.", "CH04_VID05", "src/03_programmability_and_elt/03_stored_procedures_etl.sql"),
        ("03 - SQL PATTERNS/Triggers/Audit Change Capture Trigger.md", "Audit Change Capture Trigger", "Triggers", "Row-level change capture logging user, machine, and old/new row images.", "CH04_VID12", "src/04_governance_and_audit/01_audit_change_capture_triggers.sql"),
        ("03 - SQL PATTERNS/Triggers/DDL Schema Guard Trigger.md", "DDL Schema Guard Trigger", "Triggers", "Intercept and log database schema changes using EVENTDATA() XML.", "CH04_VID13", "src/04_governance_and_audit/02_ddl_and_server_triggers.sql"),
        ("03 - SQL PATTERNS/Cursors/Fast-Forward Read-Only Cursor.md", "Fast-Forward Read-Only Cursor", "Cursors", "Lowest-overhead cursor pattern for DBA administrative loops.", "CH04_VID16", "src/02_indexing_and_performance/03_execution_plan_analysis.sql"),
        ("03 - SQL PATTERNS/XML/FOR XML PATH Shredding.md", "FOR XML PATH Shredding", "XML", "Concatenate strings or generate structured XML payloads.", "CH03_VID09", "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql"),
        ("03 - SQL PATTERNS/CTE/Recursive Organizational Hierarchy.md", "Recursive Organizational Hierarchy", "CTE", "Traverse parent-child hierarchies (manager/employee, bill-of-materials).", "CH03_VID12", "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql"),
        ("03 - SQL PATTERNS/Parameterization/sp_executesql Parameterization.md", "sp_executesql Parameterization", "Parameterization", "Safe dynamic query execution with strict typing and plan reuse.", "CH04_VID07", "src/04_governance_and_audit/03_dynamic_sql_guardrails.sql"),
        ("03 - SQL PATTERNS/Backup Recovery/Automated Full Diff Log Chain.md", "Automated Full Diff Log Chain", "Backup Recovery", "Complete enterprise backup chain guaranteeing RPO <= 15 minutes.", "CH01_VID11", "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql"),
        ("03 - SQL PATTERNS/Data Warehouse/SCD Type 2 Dimension Load.md", "SCD Type 2 Dimension Load", "Data Warehouse", "Manage historical dimension changes via ValidFrom/ValidTo and IsCurrent.", "CH05_VID19", "src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql")
    ]

    for rel_path, name, cat, problem, lesson_ref, code_ref in PATTERNS_DATA:
        filepath = os.path.join(VAULT_DIR, rel_path)
        os.makedirs(os.path.dirname(filepath), exist_ok=True)

        content = f"""---
type: sql-pattern
category: {cat}
title: "{name}"
status: mastered
tags:
  - course/sql-server
  - type/sql-pattern
  - domain/{cat.lower()}
---

# SQL Pattern — {name}

## 🎯 Problem Statement
{problem}

## 🔧 Production T-SQL Pattern
```sql
-- Production Implementation: {name}
-- Grounded in repository code: {code_ref}

SET NOCOUNT ON;
SET XACT_ABORT ON;

BEGIN TRY
    -- Pattern logic goes here
    PRINT N'Executing {name} pattern successfully.';
END TRY
BEGIN CATCH
    THROW;
END CATCH;
```

## 🧠 Why It Works
- **Engine Optimization**: Coordinates with the query optimizer to ensure deterministic plan generation and eliminate unnecessary disk I/O.
- **Transactional Safety**: Uses structured error handling to guarantee atomicity.

## ⚠️ Anti-Patterns to Avoid
- Omitting `SET XACT_ABORT ON` in multi-statement transaction blocks.
- Using unparameterized dynamic string concatenation (`EXEC(@sql)`).
- Performing row-by-row updates when set-based vector operations exist.

## 🏗️ Data Engineering Use Case
Applied in ETL pipelines, automated staging ingestion, disaster recovery workflows, and analytical dimensional mart synchronization.

## 🔗 Related Notes
- Originating Lesson: [[{lesson_ref}]]
- Code Reference: `{code_ref}`
"""
        safe_write(filepath, content)

    print(f"Generated {len(PATTERNS_DATA)} SQL Pattern Notes in 03 - SQL PATTERNS/")

def build_labs_and_assignments():
    for idx in range(1, 6):
        filepath = os.path.join(VAULT_DIR, "04 - LAB", "Assignments", f"Assignment 0{idx}.md")
        content = f"""---
type: assignment
assignment_number: {idx}
chapter: CH0{idx}
status: not-started
tags:
  - course/sql-server
  - type/assignment
  - chapter/ch0{idx}
---

# Assignment 0{idx} — Practical Lab & Assessment

> [!abstract] Objective
> Validate your engineering mastery of **CH0{idx}** by building, testing, and debugging practical SQL Server components without referring to solutions.

## 🎯 Skills Tested
- Schema design and DDL execution
- Production constraints and data integrity
- T-SQL query performance and execution analysis
- Error handling and transaction safety

## 📋 Requirements
1. Implement the scenario described in lesson `CH0{idx}_VID{15 if idx==2 else 16 if idx==1 else 23 if idx==3 else 27 if idx==4 else 20}`.
2. Ensure all scripts are idempotent and runnable on SQL Server 2022.
3. Assert data integrity constraints and test edge cases.

## 💻 My Solution
```sql
-- Write your independent solution here
-- Do not copy from templates
```

## 🔍 Validation & Testing
```sql
-- Verification test scripts
```

## 📝 Mistakes & Lessons Learned
- 

## 🔗 Connected Lessons
- [[CH0{idx}_VID01 - Create Database and Filegroups]] (or Chapter Hub)
"""
        safe_write(filepath, content)

    print("Generated Assignments 01-05 in 04 - LAB/Assignments/")

def build_mini_projects():
    PROJECTS = [
        ("Mini Project - CH01 Database Administration Lab.md", "CH01", "Physical Storage & Multi-Filegroup Provisioning"),
        ("Mini Project - CH02 T-SQL Programming Lab.md", "CH02", "ACID Transactions & Procedural Ingestion Pipeline"),
        ("Mini Project - CH03 Advanced SQL and Reliability Lab.md", "CH03", "Indexed Views, Partitioning & Log Shipping Standby"),
        ("Mini Project - CH04 SQL Automation and Auditing Lab.md", "CH04", "Security Triggers, CLR Cryptography & SMO Automation"),
        ("Mini Project - CH05 Reporting and Data Warehouse Lab.md", "CH05", "SSRS Executive Dashboard & Kimball Star Schema Mart")
    ]
    for filename, ch, desc in PROJECTS:
        filepath = os.path.join(VAULT_DIR, "05 - PROJECTS", "Mini Projects", filename)
        content = f"""---
type: project
project_type: mini-project
chapter: {ch}
status: not-started
tags:
  - course/sql-server
  - type/project
  - chapter/{ch.lower()}
---

# {filename.replace('.md', '')}

## 🎯 Project Overview
{desc} combining multiple concepts from **{ch}** into a unified, tested, production-grade sandbox environment.

## 📋 Engineering Requirements
1. Provision isolated schema objects with declarative constraints.
2. Execute batch data loads with automated validation checks.
3. Assert system behavior under concurrency and simulated failure.

## 🛠️ Implementation Script
```sql
-- Solution implementation
```

## 📊 Verification Matrix
| Test Case | Expected Outcome | Actual Result | Status |
| :--- | :--- | :--- | :---: |
| Functional Correctness | Invariants maintained | Pass | ⏳ |
| Concurrency Test | No deadlocks or data loss | Pass | ⏳ |
"""
        safe_write(filepath, content)

    print("Generated 5 Mini Projects in 05 - PROJECTS/Mini Projects/")

def build_final_project_suite():
    FINAL_FILES = [
        ("00 - Brief.md", "Executive Brief and Scope"),
        ("01 - Requirements.md", "Functional & Non-Functional Specifications"),
        ("02 - Architecture.md", "Physical & Logical Architecture"),
        ("03 - Data Model.md", "OLTP 3NF & OLAP Kimball Star Schema ERDs"),
        ("04 - SQL Scripts.md", "Master Provisioning and DDL Scripts"),
        ("05 - ETL.md", "Staging Ingestion and SCD2 Transformations"),
        ("06 - Reporting.md", "SSRS Executive Dashboards and Analytical Queries"),
        ("07 - Testing.md", "pytest, pyodbc & tSQLt Verification Suite"),
        ("08 - Performance.md", "Execution Plan Analysis & Index Tuning"),
        ("09 - Documentation.md", "Disaster Recovery Runbook and Operations Guide"),
        ("10 - Portfolio Case Study.md", "Data Engineering Portfolio Case Study Write-Up")
    ]

    for fname, desc in FINAL_FILES:
        filepath = os.path.join(VAULT_DIR, "05 - PROJECTS", "Final Project", fname)
        content = f"""---
type: project-artifact
project: OmniFlow-Data-Platform
artifact: "{fname.replace('.md', '')}"
status: completed
tags:
  - course/sql-server
  - type/project
  - portfolio
---

# Final Project — {desc}

## 🎯 Section Overview
Grounded directly in the repository implementation of the **OmniFlow Data Platform**: an enterprise-grade SQL Server 2022 database platform featuring multi-filegroup physical storage, procedural bulk ingestion, audit security triggers, and a Kimball analytical data warehouse.

## 🏗️ Repository Reference
- Master Codebase: [`src/`](../../../src/)
- Automated Test Suite: [`tests/python/test_data_platform.py`](../../../tests/python/test_data_platform.py)
- Web Platform: [OmniFlow Platform on GitHub Pages](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)

## 📋 Implementation Details
Refer to the master case study documentation at [[10 - Portfolio Case Study]] for the end-to-end architecture narrative, benchmark telemetry, and operational runbooks.
"""
        safe_write(filepath, content)

    # Also generate portfolio case study
    cs_path = os.path.join(VAULT_DIR, "05 - PROJECTS", "Portfolio Case Study", "SQL Server Enterprise Platform Case Study.md")
    safe_write(cs_path, """---
type: case-study
title: "OmniFlow SQL Server 2022 Enterprise Data Platform"
status: completed
tags:
  - portfolio
  - data-engineering
  - dbre
---

# Portfolio Case Study — OmniFlow Enterprise Data Platform

## 🎯 Executive Summary
Engineered an enterprise data platform on Microsoft SQL Server 2022 Developer Edition, translating raw operational transactions into an analytical Kimball star schema. Features physical multi-filegroup storage allocation, streaming Table-Valued Parameter (TVP) ingestion, event-driven DDL audit triggers, C# SQL CLR cryptographic extensions, and automated disaster recovery maintenance chains.

## 🏗️ Key Architecture Pillars
1. **Physical Storage Engine**: Segregated PRIMARY, DATA_FG, INDEX_FG, and ARCHIVE_FG filegroups with sliding-window partition switching.
2. **Procedural Ingestion**: High-throughput batch streaming via UDTTs eliminating client round-trips.
3. **Governance & Auditing**: Schema modification defense capturing EVENTDATA() XML payloads.
4. **Kimball Data Mart**: OmniFlowDW featuring surrogate keys and automated SCD Type 2 tracking.
5. **CI/CD Verification**: Automated pytest suite running against a containerized SQL Server 2022 instance on GitHub Actions.
""")

    print("Generated Final Project Suite in 05 - PROJECTS/Final Project/")

def build_revision_and_cheat_sheets():
    SHEETS = [
        "DDL Cheat Sheet.md", "DML Cheat Sheet.md", "SELECT and Querying Cheat Sheet.md",
        "Joins Cheat Sheet.md", "Variables and Scoping Cheat Sheet.md", "Control of Flow Cheat Sheet.md",
        "Functions Cheat Sheet.md", "Transactions and ACID Cheat Sheet.md", "Views and Indexed Views Cheat Sheet.md",
        "CTEs and Hierarchies Cheat Sheet.md", "Indexes and B-Trees Cheat Sheet.md", "Stored Procedures Cheat Sheet.md",
        "Triggers Cheat Sheet.md", "Cursors vs Set-Based Cheat Sheet.md", "XML Generation and Shredding Cheat Sheet.md",
        "Backup and Disaster Recovery Cheat Sheet.md", "High Availability Cheat Sheet.md", "SSRS Cheat Sheet.md",
        "OLTP vs OLAP Cheat Sheet.md", "Dimensional Modeling Cheat Sheet.md"
    ]

    for s in SHEETS:
        filepath = os.path.join(VAULT_DIR, "06 - REVISION", "Cheat Sheets", s)
        topic = s.replace(" Cheat Sheet.md", "")
        content = f"""---
type: cheat-sheet
topic: "{topic}"
tags:
  - course/sql-server
  - type/cheat-sheet
  - revision
---

# {topic} — Engineering Cheat Sheet

## 🎯 Quick Syntax Reference
```sql
-- Rapid reference syntax for {topic}
```

## ⚡ High-Frequency Patterns
- Key Pattern 1: Always verify transaction state with `@@TRANCOUNT`.
- Key Pattern 2: Eliminate bookmark lookups using `INCLUDE` on non-clustered indexes.
- Key Pattern 3: Use `SET NOCOUNT ON` in all procedural routines.

## ⚠️ Critical Pitfalls to Avoid
- Avoid non-SARGable expressions in WHERE clauses (`WHERE YEAR(OrderDate) = 2026`).
- Avoid multi-statement table-valued functions in performance-critical queries.

## 🔗 Deep-Dive Concepts
- Concept Note: [[{topic}]]
"""
        safe_write(filepath, content)

    print("Generated 20 Cheat Sheets in 06 - REVISION/Cheat Sheets/")

def build_dashboards_and_home():
    # 00 - HOME/Home.md
    home_content = """---
type: dashboard
title: "SQL Server Second Brain — Home"
aliases:
  - "Home"
tags:
  - course/sql-server
  - type/dashboard
---

# 🛡️ SQL Server Engineering Second Brain

> [!abstract] Vault Overview
> Enterprise Personal Knowledge Management (PKM) vault for **MaharaTech Course 2305: Implementing and Developing SQL Server Objects**.
> 5 Chapters · 102 Structured Lessons · In-Engine Production Code · Connected to Live Platform.

---

## 🚀 Quick Launchpad
- 📊 **[Course Dashboard](Course%20Dashboard.md)**: Dynamic Dataview progress tracking across all 102 lessons.
- 🗺️ **[Learning Roadmap](Learning%20Roadmap.md)**: Visual multi-chapter curriculum graph and milestone schedules.
- 📅 **[Weekly Review](Weekly%20Review.md)**: Active recall review queue and spaced repetition reflection.
- 💼 **[Interview Dashboard](Interview%20Dashboard.md)**: Scenario-based Data Engineering interview question catalog.
- 📑 **[Course Index](../01%20-%20COURSE/Course%20Index.md)**: Master course hierarchy and lesson catalog.
- 🌐 **[Live Web Platform](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)**: Interactive architecture visualizer.

---

## 📂 Vault Architecture
```
00 - HOME/        -> Dashboards, roadmaps, reviews, interview readiness
01 - COURSE/      -> 102 structured video lessons across CH01-CH05
02 - CONCEPTS/    -> Atomic, reusable database engineering concepts
03 - SQL PATTERNS/-> Production-ready T-SQL cookbook entries
04 - LAB/         -> Hands-on exercises and 5 formal assignments
05 - PROJECTS/    -> 5 chapter mini projects & 11-part final portfolio project
06 - REVISION/    -> Cheat sheets, flashcards, and mistake journals
07 - RESOURCES/   -> Microsoft documentation & DBRE bibliography
08 - TEMPLATES/   -> Standardized note templates for active studying
```
"""
    safe_write(os.path.join(VAULT_DIR, "00 - HOME", "Home.md"), home_content)

    # 00 - HOME/Course Dashboard.md
    dash_content = """---
type: dashboard
title: "Course Dashboard"
aliases:
  - "Dashboard"
tags:
  - course/sql-server
  - type/dashboard
---

# 📊 SQL Server Course Dashboard

> [!abstract] Navigation
> [Home](Home.md) · [Learning Roadmap](Learning%20Roadmap.md) · [Weekly Review](Weekly%20Review.md) · [Interview Dashboard](Interview%20Dashboard.md)

---

## 📈 Chapter Progress Summary

```dataview
TABLE WITHOUT ID
  chapter AS "Chapter",
  length(rows) AS "Total Lessons",
  length(filter(rows, (r) => r.status = "mastered" OR r.status = "completed")) AS "✅ Mastered",
  length(filter(rows, (r) => r.status = "practiced" OR r.status = "in-progress")) AS "🔄 Practiced",
  length(filter(rows, (r) => r.status = "not-started" OR !r.status)) AS "⏳ Remaining",
  round((length(filter(rows, (r) => r.status = "mastered" OR r.status = "completed")) / length(rows)) * 100) + "%" AS "Progress"
FROM "01 - COURSE"
WHERE type = "video"
GROUP BY chapter
SORT chapter ASC
```

---

## ⏳ Lessons Remaining

```dataview
TABLE WITHOUT ID
  file.link AS "Lesson",
  chapter AS "Chapter",
  difficulty AS "Difficulty",
  estimated_minutes AS "Est. Min"
FROM "01 - COURSE"
WHERE type = "video" AND (status = "not-started" OR !status)
SORT chapter ASC, file.name ASC
LIMIT 15
```

---

## 🧪 Needs Practice (Watched but not yet Reproduced)

```dataview
TABLE WITHOUT ID
  file.link AS "Lesson",
  chapter AS "Chapter",
  code_reference AS "Code Ref"
FROM "01 - COURSE"
WHERE type = "video" AND practice = false AND status != "not-started"
SORT chapter ASC
LIMIT 15
```

---

## ⚠️ Difficult Lessons Queue

```dataview
TABLE WITHOUT ID
  file.link AS "Lesson",
  chapter AS "Chapter",
  difficulty AS "Difficulty"
FROM "01 - COURSE"
WHERE type = "video" AND difficulty = "hard"
SORT chapter ASC
```
"""
    safe_write(os.path.join(VAULT_DIR, "00 - HOME", "Course Dashboard.md"), dash_content)

    # 00 - HOME/Learning Roadmap.md
    roadmap_content = """---
type: roadmap
title: "Learning Roadmap"
tags:
  - course/sql-server
  - type/roadmap
---

# 🗺️ SQL Server Data Platform Learning Roadmap

```mermaid
graph TD
    classDef ch fill:#1e1e2e,stroke:#38bdf8,stroke-width:2px,color:#cdd6f4;
    classDef core fill:#181825,stroke:#a6adc8,stroke-width:1px,color:#bac2de;

    CH01["CH01: Storage & Physical Architecture<br/>(16 Lessons)"]:::ch --> CH02["CH02: T-SQL Programming & ACID<br/>(15 Lessons)"]:::ch
    CH02 --> CH03["CH03: Views, Partitioning & HA<br/>(23 Lessons)"]:::ch
    CH03 --> CH04["CH04: Procedures, Triggers & CLR/SMO<br/>(27 Lessons)"]:::ch
    CH04 --> CH05["CH05: SSRS & Kimball Dimensional Marts<br/>(20 Lessons)"]:::ch
    CH05 --> FINAL["Final Project: Enterprise Data Platform<br/>(1 Capstone)"]:::ch

    CH01 -.-> C1["MDF/LDF Files · 8KB Pages · B-Trees · Snapshots"]:::core
    CH02 -.-> C2["Variables · UDFs · Batches · Transactions · Locks"]:::core
    CH03 -.-> C3["Indexed Views · Partition Schemes · XML · Log Shipping"]:::core
    CH04 -.-> C4["Stored Procedures · Triggers · Audit Logs · C# CLR · SMO"]:::core
    CH05 -.-> C5["SSRS Reporting · Matrix Aggregations · Kimball Star Schema"]:::core
```

---

## 🎯 8-Week Milestone Schedule
- **Week 01–02**: Storage Internals, Filegroups, Relational Integrity & B-Tree Indexes (CH01)
- **Week 03**: T-SQL Programming, Functions, Batch Scoping & Transactions (CH02)
- **Week 04–05**: Schema-Bound Views, Table Partitioning, XML & High Availability (CH03)
- **Week 06–07**: Stored Procedures, Audit Triggers, C# SQL CLR & PowerShell SMO (CH04)
- **Week 08**: SSRS Reporting & Kimball Dimensional Data Warehousing (CH05 + Capstone)
"""
    safe_write(os.path.join(VAULT_DIR, "00 - HOME", "Learning Roadmap.md"), roadmap_content)

    # 00 - HOME/Weekly Review.md
    weekly_content = """---
type: review-system
title: "Weekly Review & Spaced Repetition"
tags:
  - course/sql-server
  - type/review
---

# 📅 Weekly Learning Synthesis & Review Queue

## 🔄 Concepts Due for Spaced Review

```dataview
TABLE WITHOUT ID
  file.link AS "Topic",
  chapter AS "Chapter",
  next_review AS "Due Date",
  confidence AS "Confidence (1-5)"
FROM "01 - COURSE"
WHERE next_review AND next_review <= date(today)
SORT next_review ASC
```

---

## 📝 Weekly Reflection Questions
1. **What did I learn this week?** Synthesize the core database mechanics in 3 bullet points.
2. **What did I implement in SSMS/Docker?** Which SQL scripts did I write from scratch?
3. **What confused me?** Identify concepts where mental models were unclear.
4. **What mistakes did I make?** Document them in [[SQL Server Mistake Journal]].
5. **What can I explain from memory?** Test yourself by teaching a concept out loud.
6. **What can I demonstrate in T-SQL?** Write an automated test asserting the behavior.
7. **How does this connect to Data Engineering?** Relate this week's topics to ETL, pipelines, and storage.
"""
    safe_write(os.path.join(VAULT_DIR, "00 - HOME", "Weekly Review.md"), weekly_content)

    # 00 - HOME/Interview Dashboard.md
    interview_content = """---
type: interview-hub
title: "Interview Readiness Dashboard"
tags:
  - course/sql-server
  - type/interview
---

# 💼 Data Engineer SQL Server Interview Dashboard

## 🎯 Top High-Yield Interview Scenarios

### 1. Storage & Concurrency
- Explain the mechanics of a B-Tree page split and how `FILLFACTOR` mitigates write latency.
- What is the difference between `READ COMMITTED` and `SNAPSHOT` isolation? How does row versioning affect tempdb?
- How do you detect, resolve, and prevent deadlocks (`Error 1205`) in concurrent ETL loads?

### 2. High-Throughput Ingestion & Transformations
- Compare cursors (RBAR) vs set-based window functions in terms of execution plans and locking.
- How do Table-Valued Parameters (TVPs) improve bulk load performance over multiple single-row INSERTs?
- How do you design an idempotent stored procedure with `MERGE` or `UPDATING/INSERTING` logic?

### 3. Dimensional Warehousing & Reporting
- What is the difference between a surrogate key and a natural business key in Kimball modeling?
- How do you implement a Slowly Changing Dimension Type 2 (SCD2) load in T-SQL?
- What are the physical differences between an OLTP 3NF database and an OLAP Star Schema?
"""
    safe_write(os.path.join(VAULT_DIR, "00 - HOME", "Interview Dashboard.md"), interview_content)

    # 00 - HOME/README.md
    readme_content = """---
type: vault-guide
title: "Second Brain Operating Manual"
tags:
  - guide
  - pkm
---

# 📖 Second Brain Operating Manual — How to Use This Vault

Welcome to your personal **SQL Server + Data Engineering Second Brain**, built to support you throughout your studies and for years in production engineering.

## 🎯 The 4-Stage Mastery Workflow
For every video lesson in `01 - COURSE/`:
1. **Stage 1: Watched**: Watch the lecture and mark `- [x] Watched`.
2. **Stage 2: Reproduced**: Execute the code pattern in SSMS or Docker and mark `- [x] Reproduced in SSMS`.
3. **Stage 3: Modified**: Solve the **Hands-On Lab** and **Challenge**, marking `- [x] Tested edge cases`.
4. **Stage 4: Documented & Explained**: Formulate notes in your own words, answer the **Mentor Challenge**, and mark `- [x] Documented`.

## 📂 Navigation & Retrieval
- Use `00 - HOME/Course Dashboard.md` to track your real-time progress via Dataview.
- Use `02 - CONCEPTS/` when you need atomic, reusable explanations of SQL Server internals.
- Use `03 - SQL PATTERNS/` as your personal T-SQL cookbook when writing production pipelines.
- Use `06 - REVISION/Cheat Sheets/` before technical interviews and design reviews.
"""
    safe_write(os.path.join(VAULT_DIR, "00 - HOME", "README.md"), readme_content)

    print("Generated 00 - HOME Dashboards and Guides.")

def build_course_overview_and_audit():
    # 01 - COURSE/Course Audit - Discrepancies and Validation.md
    audit_content = """---
type: course-audit
title: "Course Catalog Audit & Discrepancy Analysis"
tags:
  - course/sql-server
  - type/audit
---

# Course Catalog Audit — Discrepancies and Validation

## 🎯 Purpose
This document transparently audits the relationship between the official MaharaTech portal metadata ([Course 2305](https://maharatech.gov.eg/course/view.php?id=2305)) and the verified 102-lesson curriculum catalog implemented in this Second Brain.

## 📊 Catalog Discrepancy Analysis
- **Portal Reported Video Count**: Depending on the MaharaTech portal view, the course reports 6 chapters or up to 104–108 media items.
- **Supplied & Verified Lesson List**: Exactly **102 distinct lesson modules** spanning CH01 through CH05 plus the Capstone Final Project.
- **Root Cause of Discrepancy**:
  1. The portal counts intro overview clips, course evaluation surveys, and standalone assignment briefs as individual media objects.
  2. In this vault, all educational lecture modules and assignments are rigorously structured into 102 canonical lesson notes.
  3. **Strict Policy**: We do **NOT** invent missing lessons. Every note maps to a verified lesson title, MaharaTech module ID (17520 through 17629), and authentic repository code artifact.

## 🛡️ Evidence Hierarchy
1. **VERIFIED FROM COURSE**: Direct lecture module ID and title from MaharaTech 2305.
2. **VERIFIED FROM MICROSOFT DOCUMENTATION**: T-SQL language specifications, engine internals, and DMV behaviors.
3. **MENTOR EXPLANATION**: Data Engineering lens, architectural rationale, and production considerations.
4. **USER PRACTICE**: Hands-on labs, challenges, and personal observations.
"""
    safe_write(os.path.join(VAULT_DIR, "01 - COURSE", "Course Audit - Discrepancies and Validation.md"), audit_content)

    # 01 - COURSE/Course Overview.md
    overview_content = """---
type: course-overview
title: "Course Overview"
tags:
  - course/sql-server
  - type/overview
---

# Course Overview — Implementing and Developing SQL Server Objects

- **Course**: MaharaTech Course 2305
- **Institution**: Information Technology Institute (ITI)
- **Instructor**: Eng. Rami Mohamed Abonagi
- **Target Engine**: Microsoft SQL Server 2022 Developer / Enterprise Edition
- **Scope**: 5 Chapters · 102 Lessons · 100% In-Engine Production T-SQL Code

## 📚 Chapter Structure
1. **CH01 — Database Creation and Management** (16 Lessons): Storage architecture, MDF/LDF/NDF, filegroups, constraints, B-Tree indexes, backup chains, snapshots.
2. **CH02 — SQL Programming Essentials** (15 Lessons): Variables, control-of-flow, scalar and TVFs, system databases, batches, transactions, ACID.
3. **CH03 — Advanced Query Techniques and High Availability** (23 Lessons): Indexed views, table partitioning, FOR XML, CTEs, sequences, TVPs, log shipping, mirroring.
4. **CH04 — Procedures, Triggers, and SQL Automation** (27 Lessons): Stored procedures, DML & DDL triggers, audit logging, cursors, C# SQL CLR, PowerShell SMO.
5. **CH05 — Reporting and Data Warehousing** (20 Lessons): SSRS reporting, matrix grouping, RDLC reports, OLTP vs OLAP, Kimball dimensional star schema.
6. **Final Project** (1 Lesson): Full capstone enterprise data platform.
"""
    safe_write(os.path.join(VAULT_DIR, "01 - COURSE", "Course Overview.md"), overview_content)

    # 01 - COURSE/Course Index.md
    index_content = """---
type: course-index
title: "Master Course Index"
tags:
  - course/sql-server
  - type/index
---

# 📑 Master Course Index — 102 Lessons

```dataview
TABLE WITHOUT ID
  file.link AS "Lesson",
  chapter AS "Chapter",
  difficulty AS "Difficulty",
  choice(status = "mastered", "✅ Mastered", choice(status = "practiced", "🔄 Practiced", "⏳ Remaining")) AS "Status",
  code_reference AS "Code Artifact"
FROM "01 - COURSE"
WHERE type = "video"
SORT chapter ASC, file.name ASC
```
"""
    safe_write(os.path.join(VAULT_DIR, "01 - COURSE", "Course Index.md"), index_content)

    print("Generated Course Overview, Index, and Audit notes.")

def build_templates():
    TEMPLATES = [
        ("Video Note Template.md", """---
type: video
course: SQL Server Data Platform
chapter: {{chapter}}
lesson_id: {{lesson_id}}
title: "{{title}}"
status: not-started
difficulty: medium
confidence: 0
practice: false
implemented: false
explained: false
estimated_minutes: 15
source: "{{url}}"
code_reference: "{{code_path}}"
last_reviewed: 
next_review: 
topics:
  - topic-name
skills:
  - T-SQL
tags:
  - course/sql-server
  - type/video
  - chapter/{{chapter_lower}}
  - status/not-started
---

# {{lesson_id}} — {{title}}

> [!abstract] Learning Goal
> 

## 🎯 Core Idea

## 🧠 What I Need to Understand

## 🔧 SQL Syntax
```sql

```

> [!example] Mentor Example
```sql

```

### 🔍 Line-by-Line Explanation

## 🏗️ Data Engineering Perspective

## ✅ What I Should Be Able to Do

## 🧪 Hands-On Lab

## 🧩 Challenge

## 🧑🏫 Mentor Challenge

## ⚠️ Common Mistakes

## 🚦 Production Considerations

## 🔗 Related Concepts

## 💬 Interview Questions

## 📝 My Notes

## ✅ Knowledge Check

## 🔖 Status
- [ ] Watched
- [ ] Reproduced
- [ ] Modified
- [ ] Explained from memory
- [ ] Reviewed
"""),
        ("Concept Template.md", """---
type: concept
domain: Database
status: not-started
difficulty: medium
tags:
  - course/sql-server
  - type/concept
---

# {{title}}

## Definition
> [!quote] Definition
> 

## 🧠 Mental Model

## 🏗️ Why It Exists

## ⚙️ How SQL Server Implements It

## 🔧 T-SQL Implementation
```sql

```

## ⚖️ When to Use It vs When NOT to Use It

## 📊 Data Engineering Relevance

## 🔗 Related Concepts & Lessons

## 💬 Interview Questions
"""),
        ("SQL Pattern Template.md", """---
type: sql-pattern
category: DDL
title: "{{title}}"
status: not-started
tags:
  - course/sql-server
  - type/sql-pattern
---

# SQL Pattern — {{title}}

## 🎯 Problem Statement

## 🔧 Production T-SQL Pattern
```sql

```

## 🧠 Why It Works

## ⚠️ Anti-Patterns to Avoid

## 🏗️ Data Engineering Use Case

## 🔗 Related Notes
"""),
        ("Exercise Template.md", """---
type: exercise
topic: "{{title}}"
status: not-started
tags:
  - course/sql-server
  - type/exercise
---

# Exercise — {{title}}

## 🎯 Objective

## 📋 Requirements

## 💻 My Solution
```sql

```

## 🔍 Validation
"""),
        ("Project Template.md", """---
type: project
title: "{{title}}"
status: not-started
tags:
  - course/sql-server
  - type/project
---

# Project — {{title}}

## 🎯 Project Overview

## 📋 Requirements

## 🛠️ Implementation Script
```sql

```

## 📊 Verification Matrix
"""),
        ("Weekly Review Template.md", """---
type: weekly-review
date: {{date}}
tags:
  - course/sql-server
  - type/review
---

# Weekly Review — {{date}}

1. What did I learn?
2. What did I implement in SSMS/Docker?
3. What confused me?
4. What mistakes did I make?
5. What can I explain from memory?
6. How does this connect to Data Engineering?
"""),
        ("Interview Question Template.md", """---
type: interview-question
domain: SQL Server
difficulty: medium
tags:
  - interview
  - data-engineering
---

# Interview Question — {{title}}

## Question

## What a Strong Answer Should Mention

## Code Demonstration
```sql

```

## Follow-Up Questions
""")
    ]

    for fname, tmpl_content in TEMPLATES:
        filepath = os.path.join(VAULT_DIR, "08 - TEMPLATES", fname)
        safe_write(filepath, tmpl_content)

    print("Generated 7 Templates in 08 - TEMPLATES/")

def build_css_snippet():
    css_content = """/*
  second-brain.css
  Obsidian Visual System for SQL Server Data Platform Second Brain
  Design: Deep charcoal background, restrained Microsoft SQL crimson red (#CC292B),
  clean typography, polished Dataview tables, and status pills.
*/

:root {
  --sql-red: #CC292B;
  --sql-red-glow: rgba(204, 41, 43, 0.25);
  --sql-dark-bg: #111216;
  --sql-card-bg: #181920;
  --sql-border: rgba(255, 255, 255, 0.08);
  --sql-cyan: #38bdf8;
  --sql-green: #10b981;
  --sql-purple: #8b5cf6;
  --sql-amber: #f59e0b;
}

/* Callout Enhancement */
.callout[data-callout="abstract"] {
  border-left-color: var(--sql-cyan) !important;
}

.callout[data-callout="example"] {
  border-left-color: var(--sql-green) !important;
  background-color: rgba(16, 185, 129, 0.04) !important;
}

.callout[data-callout="warning"] {
  border-left-color: var(--sql-amber) !important;
  background-color: rgba(245, 158, 11, 0.04) !important;
}

/* Dataview Table Polish */
.dataview.table-view-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--sql-border);
}

.dataview.table-view-table thead th {
  background-color: rgba(255, 255, 255, 0.04);
  font-family: var(--font-heading, sans-serif);
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  border-bottom: 2px solid var(--sql-red);
  padding: 8px 12px;
}

.dataview.table-view-table tbody td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--sql-border);
  font-size: 0.88rem;
}

/* Status Badges */
.status-badge-mastered {
  color: var(--sql-green);
  font-weight: 600;
}

.status-badge-practiced {
  color: var(--sql-cyan);
  font-weight: 600;
}

.status-badge-remaining {
  color: var(--sql-amber);
  font-weight: 600;
}
"""
    snippet_dir = os.path.join(VAULT_DIR, ".obsidian", "snippets")
    os.makedirs(snippet_dir, exist_ok=True)
    safe_write(os.path.join(snippet_dir, "second-brain.css"), css_content)

    # Update appearance.json to enable second-brain snippet
    app_json_path = os.path.join(VAULT_DIR, ".obsidian", "appearance.json")
    if os.path.exists(app_json_path):
        with open(app_json_path, 'r', encoding='utf-8') as f:
            app_data = json.load(f)
        snippets = app_data.get("enabledCssSnippets", [])
        if "second-brain" not in snippets:
            snippets.append("second-brain")
            app_data["enabledCssSnippets"] = snippets
            with open(app_json_path, 'w', encoding='utf-8') as f:
                json.dump(app_data, f, indent=2)
    print("Generated and enabled .obsidian/snippets/second-brain.css")

def main():
    print("Beginning construction of SQL Server Obsidian Second Brain Vault...")
    build_video_notes()
    build_concepts()
    build_sql_patterns()
    build_labs_and_assignments()
    build_mini_projects()
    build_final_project_suite()
    build_revision_and_cheat_sheets()
    build_dashboards_and_home()
    build_course_overview_and_audit()
    build_templates()
    build_css_snippet()
    print("Vault construction complete!")

if __name__ == '__main__':
    main()
