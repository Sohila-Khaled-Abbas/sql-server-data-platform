---
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
