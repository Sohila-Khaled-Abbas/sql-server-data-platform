---
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
