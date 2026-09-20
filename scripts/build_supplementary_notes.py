"""
scripts/build_supplementary_notes.py
Populates 07 - RESOURCES, 04 - LAB architecture diagrams, 06 - REVISION deep dives,
and 99 - ATTACHMENTS.
"""

import os

VAULT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'curriculum'))

def safe_write(rel_path, content):
    filepath = os.path.join(VAULT_DIR, rel_path)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def build_supplementary():
    # 07 - RESOURCES
    safe_write("07 - RESOURCES/Microsoft Docs/Microsoft SQL Server 2022 Official Documentation.md", """---
type: resource
title: "Microsoft SQL Server 2022 Official Documentation"
tags:
  - resource
  - microsoft-docs
---

# Microsoft SQL Server 2022 Documentation Hub

## 📚 Core Architecture & Engine Guides
- **Storage Engine**: [Pages and Extents Architecture Guide](https://learn.microsoft.com/en-us/sql/relational-databases/pages-and-extents-architecture-guide)
- **Indexing**: [SQL Server Index Architecture and Design Guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide)
- **Transactions & Locking**: [Transaction Locking and Row Versioning Guide](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide)
- **High Availability**: [Always On Availability Groups Overview](https://learn.microsoft.com/en-us/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server)
- **Disaster Recovery**: [Back Up and Restore of SQL Server Databases](https://learn.microsoft.com/en-us/sql/relational-databases/backup-restore/back-up-and-restore-of-sql-server-databases)
- **Procedural T-SQL**: [Transact-SQL Reference (Database Engine)](https://learn.microsoft.com/en-us/sql/t-sql/language-reference)
- **CLR Integration**: [Common Language Runtime (CLR) Integration Programming Concepts](https://learn.microsoft.com/en-us/sql/relational-databases/clr-integration/common-language-runtime-clr-integration-programming-concepts)
- **SMO SDK**: [SQL Server Management Objects (SMO) Programming Guide](https://learn.microsoft.com/en-us/sql/relational-databases/server-management-objects-smo/overview-smo)
- **SSRS**: [SQL Server Reporting Services (SSRS)](https://learn.microsoft.com/en-us/sql/reporting-services/create-deploy-and-manage-mobile-and-paginated-reports)
""")

    safe_write("07 - RESOURCES/Course Resources/MaharaTech Course 2305 Portal Resources.md", """---
type: resource
title: "MaharaTech Course 2305 Portal Resources"
tags:
  - resource
  - maharatech
---

# MaharaTech Course 2305 — Official Course Resources

- **Portal URL**: [MaharaTech Course 2305: Implementing and Developing SQL Server Objects](https://maharatech.gov.eg/course/view.php?id=2305)
- **Curriculum Organization**: Information Technology Institute (ITI)
- **Instructor**: Eng. Rami Mohamed Abonagi
- **Total Modules**: 102 Structured Lessons across 5 Chapters + Capstone Final Project
- **Official Course Video IDs**: 17520 through 17629
""")

    safe_write("07 - RESOURCES/References/Data Engineering and DBRE Bibliography.md", """---
type: resource
title: "Data Engineering and DBRE Bibliography"
tags:
  - resource
  - bibliography
---

# Data Engineering & Database Reliability Engineering Bibliography

1. **The Data Warehouse Toolkit (3rd Edition)** — Ralph Kimball & Margy Ross  
   *The definitive authority on dimensional modeling, star schemas, fact table grain, and Slowly Changing Dimensions.*
2. **Microsoft SQL Server 2012 Internals** — Kalen Delaney, Craig Freeman, Bob Beauchemin  
   *Deepest technical exploration of the storage engine, data pages, transaction log architecture, and lock manager.*
3. **T-SQL Fundamentals & T-SQL Querying** — Itzik Ben-Gan  
   *Logical query processing, set-based query formulation, window functions, and execution plan optimization.*
4. **SQL Server Execution Plans** — Grant Fritchey  
   *Interpreting graphical execution plans, identifying table scans, bookmark lookups, and parameter sniffing.*
5. **Database Reliability Engineering** — Laine Campbell & Charity Majors  
   *Operating databases at scale, designing for failure, RPO/RTO engineering, and automated observability.*
""")

    # 04 - LAB/Architecture
    safe_write("04 - LAB/Architecture/Database Physical Architecture Diagram.md", """---
type: architecture-diagram
title: "Database Physical Architecture Diagram"
tags:
  - architecture
  - diagram
---

# Database Physical Architecture Diagram

```mermaid
graph TD
    classDef primary fill:#1e1e2e,stroke:#38bdf8,stroke-width:2px,color:#cdd6f4;
    classDef data fill:#1e1e2e,stroke:#10b981,stroke-width:2px,color:#cdd6f4;
    classDef index fill:#1e1e2e,stroke:#f59e0b,stroke-width:2px,color:#cdd6f4;
    classDef log fill:#1e1e2e,stroke:#ec4899,stroke-width:2px,color:#cdd6f4;

    DB["OmniFlowDB Database"] --> FG_PRI["PRIMARY Filegroup"]:::primary
    DB --> FG_DATA["DATA_FG Filegroup"]:::data
    DB --> FG_IDX["INDEX_FG Filegroup"]:::index
    DB --> LOG["Transaction Log (LDF)"]:::log

    FG_PRI --> F_MDF["OmniFlow_Primary.mdf<br/>(System Catalogs & Metadata)"]
    FG_DATA --> F_NDF1["OmniFlow_Data_01.ndf<br/>(Sequential OLTP Tables)"]
    FG_IDX --> F_NDF2["OmniFlow_Index_01.ndf<br/>(Nonclustered B-Trees)"]
    LOG --> F_LDF["OmniFlow_Log.ldf<br/>(Write-Ahead Logging / WAL)"]
```
""")

    safe_write("04 - LAB/Architecture/Kimball Dimensional Model Bus Matrix.md", """---
type: architecture-diagram
title: "Kimball Dimensional Model Bus Matrix"
tags:
  - architecture
  - dimensional-modeling
---

# Kimball Dimensional Model Bus Matrix & Star Schema

```mermaid
erDiagram
    FactSales }|..|| DimDate : "OrderDateKey"
    FactSales }|..|| DimCustomer : "CustomerKey"
    FactSales }|..|| DimProduct : "ProductKey"
    FactSales }|..|| DimTerritory : "TerritoryKey"

    FactSales {
        bigint SalesKey PK
        int OrderDateKey FK
        int CustomerKey FK
        int ProductKey FK
        int TerritoryKey FK
        int Quantity
        decimal UnitPrice
        decimal TotalAmount
    }

    DimCustomer {
        int CustomerKey PK
        int CustomerID BK
        nvarchar CustomerName
        nvarchar Segment
        datetime2 ValidFrom
        datetime2 ValidTo
        bit IsCurrent
    }

    DimProduct {
        int ProductKey PK
        int ProductID BK
        nvarchar ProductName
        nvarchar Category
        decimal StandardCost
    }

    DimDate {
        int DateKey PK
        date FullDate
        int CalendarYear
        int CalendarQuarter
        int MonthNumber
        nvarchar MonthName
    }

    DimTerritory {
        int TerritoryKey PK
        nvarchar RegionName
        nvarchar CountryCode
    }
```
""")

    # 06 - REVISION
    safe_write("06 - REVISION/Mistakes/SQL Server Mistake Journal.md", """---
type: mistake-journal
title: "SQL Server Mistake Journal & Prevention Models"
tags:
  - revision
  - mistakes
---

# ⚠️ SQL Server Mistake Journal & Prevention Models

## Mistake 1: Placing Primary Keys on Non-Clustered Indexes Accidentally
- **What I Did**: Defined `CREATE TABLE ... (ID INT PRIMARY KEY NONCLUSTERED)`.
- **Why It Was Wrong**: Left the table as a Heap (without a clustered index), causing forward pointers, fragmentation, and poor range scan performance.
- **Correct Mental Model**: In SQL Server, a PRIMARY KEY creates a clustered index by default unless specified otherwise. Keep the primary key clustered on narrow, sequential, unique, unchanging keys (e.g. `IDENTITY` or `BIGINT`).
- **How I Avoid It**: Explicitly review table DDL for `CLUSTERED` index definition.

## Mistake 2: Non-SARGable WHERE Clauses
- **What I Did**: `WHERE YEAR(CreatedAt) = 2026` or `WHERE ISNULL(Status, '') = 'Active'`.
- **Why It Was Wrong**: Wrapping indexed columns in scalar functions forces the query engine to evaluate the function for every row in the table, preventing index seeks and causing full index scans.
- **Correct Mental Model**: Keep column references pure on the left side of comparisons: `WHERE CreatedAt >= '2026-01-01' AND CreatedAt < '2027-01-01'`.
""")

    safe_write("06 - REVISION/Interview Questions/Data Engineer SQL Server Interview Handbook.md", """---
type: interview-handbook
title: "Data Engineer SQL Server Interview Handbook"
tags:
  - interview
  - revision
---

# 💼 Data Engineer SQL Server Interview Handbook

## Scenario 1: ETL Deadlocks During Concurrent Ingestion
**Question**: Multiple worker threads in an ETL pipeline are inserting data into `StagingOrders` while an automated merge procedure aggregates into `FactOrders`. The pipeline fails intermittently with `Transaction (Process ID X) was deadlocked on lock resources with another process and has been chosen as the deadlock victim`. How do you diagnose and permanently resolve this?

**Strong Answer Key Points**:
1. **Diagnosis**: Enable Extended Events `system_health` session or query `sys.dm_tran_locks` and `sys.fn_xe_file_target_read_file('system_health*.xel', ...)` to extract the Deadlock Graph XML.
2. **Analysis**: Check the resources requested and held (Key locks, Page locks, or Object locks). Typically caused by disparate object access orders between jobs or lock escalation during bulk INSERTs.
3. **Remediation**:
   - Enforce uniform object access order across all pipelines.
   - Use `TABLOCK` during bulk loads or partition the staging table.
   - Consider enabling Read Committed Snapshot Isolation (`RCSI`) or Snapshot Isolation on the database to eliminate read-write contention.
   - Add retry logic with exponential backoff around transactional stored procedure calls.
""")

    safe_write("06 - REVISION/Flashcards/SQL Server Mastery Flashcards.md", """---
type: flashcards
title: "SQL Server Mastery Flashcards"
tags:
  - flashcards
  - revision
---

# 🗂️ SQL Server Mastery Flashcards

## Card 1: Data Page Size
- **Front**: What is the size of an 8 KB data page in SQL Server, and how much space is reserved for the page header?
- **Back**: Exactly 8,192 bytes total. The page header consumes 96 bytes, leaving 8,060 bytes for data and row offset arrays.
- **Related Concept**: [[Data Pages and Extents]]

## Card 2: Clustered Index Leaf Level
- **Front**: What is physically stored at the leaf level of a Clustered Index?
- **Back**: The actual data rows of the table (the table itself is organized as a B-Tree).
- **Related Concept**: [[Clustered Index]]

## Card 3: XACT_ABORT ON
- **Front**: What does `SET XACT_ABORT ON` do when a runtime error occurs inside a transaction?
- **Back**: Immediately terminates the query and rolls back the entire transaction, preventing orphaned open transactions.
- **Related Concept**: [[Transactions and ACID]]
""")

    # 99 - ATTACHMENTS
    safe_write("99 - ATTACHMENTS/.gitkeep", "")

    print("Generated Supplementary notes in 04-LAB, 06-REVISION, 07-RESOURCES, and 99-ATTACHMENTS.")

if __name__ == '__main__':
    build_supplementary()
