# Architecture & Storage Internals Documentation

## 1. Physical Storage & Filegroup Topology

The `OmniFlowDB` transactional database uses an enterprise multi-filegroup topology designed to optimize IO throughput, isolate administrative operations, and isolate maintenance overhead.

```mermaid
graph TD
    subgraph StorageTopology ["OmniFlowDB Physical Layout"]
        subgraph FG_PRIMARY ["PRIMARY Filegroup (.mdf)"]
            SysCat["System Catalogs & Metadata"]
            SysProc["System Stored Procedures"]
        end

        subgraph FG_DATA ["DATA_FG Filegroup (.ndf)"]
            CustTab["Customers.Customer"]
            ProdTab["Inventory.Product"]
            OrdTab["Sales.Orders"]
            ItemTab["Sales.OrderItems"]
        end

        subgraph FG_INDEX ["INDEX_FG Filegroup (.ndf)"]
            NCI1["Non-Clustered Covering Indexes"]
            NCI2["Filtered Operational Indexes"]
            NCI3["Unique Business Indexes"]
        end

        subgraph FG_ARCHIVE ["ARCHIVE_FG Filegroup (.ndf)"]
            PartP1["Invoices Partition P1 (< 2024-01-01)"]
            PartP2["Invoices Partition P2 (2024 Q1)"]
            PartP3["Invoices Partition P3 (Historical Cold Data)"]
        end

        subgraph LOG_STORAGE ["Transaction Log (.ldf)"]
            TLog["Sequential Write Ahead Log (WAL)"]
        end
    end
```

### Architectural Justifications:
1. **Separation of System and User Data**: `PRIMARY` filegroup contains solely SQL Server metadata and internal system objects. User tables are prohibited on `PRIMARY`, safeguarding against catalog corruption and facilitating piecemeal restores.
2. **IO Isolation for Indexes**: Placing non-clustered indexes on `INDEX_FG` separates random read operations (index seeks/lookups) from sequential table scans and data page write operations.
3. **Storage Tiering via Partitions**: High-churn active partitions reside on `DATA_FG` (typically high-speed NVMe/SSD storage), whereas historical partitions switch onto `ARCHIVE_FG` (cost-optimized high-capacity storage).

---

## 2. End-to-End Procedural ELT & Operational Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as API / Client Ingestion
    participant TVP as Table-Valued Parameter
    participant SP as Sales.usp_BulkIngestOrders
    participant Audit as Audit.OrderHistory
    participant OLTP as Sales.Orders & Items
    participant Staging as dw.stg_Orders
    participant DW as OmniFlowDW (Kimball Mart)

    Client->>TVP: Submit strongly-typed OrderBatchType
    TVP->>SP: Pass batch array into stored procedure
    critical Transaction Boundary (SET XACT_ABORT ON)
        SP->>OLTP: Validate references & execute atomic MERGE
        SP->>Audit: Capture pre/post state via OUTPUT inserted.*, deleted.*
    end
    Note over SP,Audit: Zero-lock, non-blocking CDC change tracking
    
    rect rgb(240, 248, 255)
        Note over Staging,DW: Batch / Micro-batch ELT Pipeline
        OLTP->>Staging: Delta extract via temporal watermark
        Staging->>DW: Execute dw.usp_LoadFactSales
        Note over DW: SCD Type 2 dimension merge & additive fact load
    end
```

---

## 3. Disaster Recovery & Snapshot Architecture

```mermaid
flowchart LR
    ProdDB[("OmniFlowDB (Active OLTP)")]
    
    subgraph SnapEngine ["Point-in-Time Resilience"]
        Snap[("OmniFlowDB_Snapshot (Read-Only Sparse File)")]
        ProdDB -->|Copy-on-Write Pages| Snap
        Snap -.->|Immediate Rollback Target| ProdDB
    end

    subgraph AgentChain ["SQL Agent Backup Cadence"]
        Full["Weekly Full Backup (.bak)"]
        Diff["Daily Differential (.dif)"]
        TLog["15-Min Transaction Log (.trn)"]
        Full --> Diff --> TLog
    end

    subgraph StandbyReplica ["High Availability & Offloading"]
        ProdDB -->|Log Shipping / AG Sync| Standby[("Secondary Standby / Read-Intent")]
    end
```
