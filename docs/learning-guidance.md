# Enterprise SQL Server Engineering: Learning Guidance & Deep-Dive Handbook

A comprehensive companion guide to the **[MaharaTech: Implementing and Developing SQL Server Objects](https://maharatech.gov.eg/course/view.php?id=2305)** course, engineered from a **Database Reliability Engineering (DBRE)** and **Data Engineering** perspective.

---

## Chapter 1: Physical Storage Architecture & Integrity Constraints

### 1. The Anatomy of SQL Server Physical Storage

At the lowest level, SQL Server organizes data into **8 KB pages** (8,192 bytes). Eight physically contiguous pages form an **Extent** (64 KB).

```mermaid
graph TD
    subgraph ExtentLayout ["Uniform Extent (64 KB = 8 Contiguous 8 KB Pages)"]
        P0["Page 0: PFS / Header"]
        P1["Page 1: Data Row (1..N)"]
        P2["Page 2: Data Row"]
        P3["Page 3: Data Row"]
        P4["Page 4: Index Node"]
        P5["Page 5: Index Leaf"]
        P6["Page 6: LOB / Overflow"]
        P7["Page 7: Free Space"]
    end
```

### 2. Multi-Filegroup Strategy
Placing all user tables on the `PRIMARY` filegroup is an anti-pattern in production environments.

```mermaid
flowchart TD
    subgraph DiskSeparation ["IO Isolation Across Physical Disks"]
        subgraph DriveC ["System Drive C:"]
            PrimaryFile["OmniFlowDB_Primary.mdf<br/>(Only System Metadata)"]
        end

        subgraph DriveD ["High-Speed NVMe Drive D:"]
            DataFile["OmniFlowDB_Data.ndf<br/>(Active OLTP Tables)"]
            IndexFile["OmniFlowDB_Index.ndf<br/>(Non-Clustered Indexes)"]
        end

        subgraph DriveE ["Cost-Optimized High-Capacity Drive E:"]
            ArchiveFile["OmniFlowDB_Archive.ndf<br/>(Historical Partitions)"]
        end

        subgraph DriveL ["Dedicated Low-Latency Log Drive L:"]
            LogFile["OmniFlowDB_Log.ldf<br/>(Sequential Write-Ahead Log)"]
        end
    end
```

#### Why Separate Indexes from Data?
* **Random vs. Sequential IO**: Index seeks generate random read IOPS across the b-tree hierarchy, whereas table scans and bulk inserts generate sequential IO. Separating them prevents head-contention and disk queue saturation.
* **Piecemeal Restores**: If a non-critical index filegroup is corrupted, the core `DATA_FG` can be brought online immediately while `INDEX_FG` is rebuilt or restored in the background.

---

## Chapter 2: ACID Transactions, Concurrency & Function Internals

### 1. The ACID Boundary & Error Handling Architecture

In production pipelines, an unhandled runtime error can leave transactions orphaned, holding exclusive (`X`) locks and blocking the entire engine.

```mermaid
stateDiagram-v2
    [*] --> StartTransaction : BEGIN TRANSACTION
    StartTransaction --> AcquireLocks : SET XACT_ABORT ON
    AcquireLocks --> ExecuteDML : UPDLOCK / HOLDLOCK Seeks
    
    state Decision <<choice>>
    ExecuteDML --> Decision : Errors Occurred?
    
    Decision --> InError : Yes (Runtime Fault)
    Decision --> SuccessCommit : No (Clean Execution)
    
    InError --> AutomaticRollback : XACT_STATE() = -1
    AutomaticRollback --> RethrowError : THROW 51000, msg
    RethrowError --> [*]
    
    SuccessCommit --> RecordAudit : OUTPUT into Audit Sink
    RecordAudit --> CommitDone : COMMIT TRANSACTION
    CommitDone --> [*]
```

### 2. Function Internal Execution Models: Scalar vs. MSTVF vs. Inline TVF

```mermaid
flowchart TD
    subgraph FunctionTypes ["SQL Server Function Execution Internals"]
        subgraph ScalarUDF ["Scalar UDF (Pre-2019)"]
            S_Call["Row 1"] --> S_Context["Context Switch to Expression Engine"]
            S_Context --> S_Eval["Evaluate & Return Scalar Value"]
            S_Eval --> S_Next["Repeat for Every Single Row (RBAR)"]
        end

        subgraph MSTVF ["Multi-Statement TVF"]
            M_TableVar["Allocates @ResultTable in TempDB"]
            M_Procedural["Executes Procedural Logic (Loops/Inserts)"]
            M_Estimate["Card. Estimator: Fixed 100 rows"]
            M_TableVar --> M_Procedural --> M_Estimate
        end

        subgraph ITVF ["Inline Table-Valued Function"]
            I_Macro["Single RETURN SELECT Query"]
            I_Unfold["Optimizer expands directly into Query Tree"]
            I_Pushdown["Pushes Predicates, Joins & Parallelism"]
            I_Macro --> I_Unfold --> I_Pushdown
        end
    end
```

> [!TIP]
> **SQL Server 2022 Enhancement**: Scalar UDF Inlining automatically converts qualifying scalar functions into relational subqueries, mitigating the context-switching penalty without code rewrites.

---

## Chapter 3: Table Partitioning & High Availability

### 1. Range Partitioning & Sliding Window Mechanics

Range Right partitioning establishes inclusive upper or lower boundaries:

```mermaid
graph LR
    subgraph PartitionBoundaries ["Partition Function: pf_InvoiceDateRange (RANGE RIGHT)"]
        P1["Partition 1<br/>Date &lt; '2024-01-01'<br/><b>ARCHIVE_FG</b>"]
        P2["Partition 2<br/>'2024-01-01' &le; Date &lt; '2024-04-01'<br/><b>DATA_FG</b>"]
        P3["Partition 3<br/>'2024-04-01' &le; Date &lt; '2024-07-01'<br/><b>DATA_FG</b>"]
        P4["Partition 4<br/>'2024-07-01' &le; Date &lt; '2024-10-01'<br/><b>DATA_FG</b>"]
        P5["Partition 5<br/>'2024-10-01' &le; Date &lt; '2025-01-01'<br/><b>DATA_FG</b>"]
        P6["Partition 6<br/>Date &ge; '2025-01-01'<br/><b>DATA_FG</b>"]
    end
```

### 2. Zero-IO Partition Switching (`SWITCH PARTITION`)
Traditional `DELETE FROM Invoices WHERE InvoiceDate < '2024-01-01'` causes massive transaction log growth, row lock escalation, and buffer pool eviction.
`ALTER TABLE Invoices SWITCH PARTITION 1 TO Invoices_ArchiveStage` executes in **< 5 milliseconds** because it is a pure metadata pointer swap in the system catalogs.

---

## Chapter 4: Database Governance, CDC Auditing & SMO

### 1. Set-Based CDC Trigger State Transition

```mermaid
sequenceDiagram
    autonumber
    participant DML as UPDATE Statement (Batch of 500 rows)
    participant Engine as SQL Server Storage Engine
    participant Virt as Virtual Memory Tables (inserted & deleted)
    participant Trig as Sales.trg_Orders_AuditChangeCapture
    participant Log as Audit.OrderHistory

    DML->>Engine: Modify Status ('PE' -> 'PR')
    Engine->>Virt: Populate 'deleted' (Old) & 'inserted' (New)
    Engine->>Trig: Fire AFTER UPDATE Trigger
    critical Set-Based Evaluation
        Trig->>Virt: JOIN inserted i ON deleted d ON i.OrderId = d.OrderId
        Trig->>Log: Single INSERT ... SELECT with bulk streaming
    end
    Note over Trig,Log: 0 cursors used, 0 table-level exclusive locks
```

---

## Chapter 5: Dimensional Data Warehousing (Kimball Star Schema)

### 1. Kimball Slowly Changing Dimension (SCD) Type 2 Lifecycle

When customer attributes change (e.g., relocation, email change), SCD Type 2 preserves historical reporting accuracy:

```mermaid
gantt
    title SCD Type 2 Timeline for Customer 101
    dateFormat YYYY-MM-DD
    section Record Version 1 (SK: 501)
    Active (PostalCode: 90210, IsCurrent: 0) :active, v1, 2022-01-01, 2024-06-15
    section Record Version 2 (SK: 842)
    Active (PostalCode: 10001, IsCurrent: 1) :crit, v2, 2024-06-15, 2030-01-01
```

* **Sales prior to 2024-06-15**: Linked to `CustomerSK = 501` (aggregates correctly reflect California revenue).
* **Sales after 2024-06-15**: Linked to `CustomerSK = 842` (aggregates correctly reflect New York revenue).

---

## DBRE Interview Masterclass: Questions & Scenarios

### Q1: Why use `SET XACT_ABORT ON` in production stored procedures?
**Answer**: By default (`XACT_ABORT OFF`), certain T-SQL runtime errors (e.g., data type conversion, foreign key constraint violations) do not abort execution; the batch continues to the next statement while leaving the transaction open. This can result in partial data commits and orphaned locks. `SET XACT_ABORT ON` guarantees that any statement-level error immediately halts execution and flags the transaction as doomed (`XACT_STATE() = -1`), allowing clean rollback in the `CATCH` block.

### Q2: What is the difference between a Filtered Index and an Indexed View?
**Answer**:
* A **Filtered Index** is a non-clustered b-tree containing only rows matching a static `WHERE` predicate (e.g., `WHERE OrderStatus = 'Pending'`). It cannot aggregate data or join tables.
* An **Indexed View** physically materializes computed aggregations (`SUM`, `COUNT_BIG`) or table joins on disk with a unique clustered index, eliminating runtime join/aggregation overhead.

### Q3: Why does `MERGE` fail when a table has a bound `RULE`?
**Answer**: SQL Server rules created via `CREATE RULE` and bound via `sp_bindrule` represent legacy Sybase-era constraints. The modern relational query optimizer's `MERGE` engine does not support evaluating old-style rule objects during execution. Production tables should exclusively use declarative `CHECK` and `DEFAULT` constraints.
