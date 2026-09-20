---
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
