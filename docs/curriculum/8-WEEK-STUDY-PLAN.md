---
title: "8-Week Mentor Study Plan & Milestone Roadmap"
aliases:
  - "8-Week Study Plan"
  - "Study Roadmap"
tags:
  - sql-server
  - dbre
  - data-engineering
  - study-plan
  - roadmap
  - maharatech
weeks: 8
date_created: 2026-09-19
last_modified: 2026-09-19
---

# 8-Week Mentor Study Plan & Milestone Roadmap

> [!abstract] Study Plan Overview
> 📑 **Navigation:** [Curriculum Overview](README.md) · [Learning Tracker](LEARNING_TRACKER.md) · [102 Video Index](VIDEO_INDEX.md) · [Mentor Workflow](MENTOR_WORKFLOW.md)  
> ⏱️ **Time Commitment:** 4–7 hours/week across 8 structured weekly sprints (35–50 hours total mastery time).  
> 🎯 **Primary Goal:** Transform conceptual video lectures into production-grade database reliability engineering (DBRE) competencies.

---

## Sprints & Milestone Breakdown

### Week 1 — Database Foundations & Storage Architecture
> [!info] Sprint Objectives
> * **Modules:** CH01 VID01–VID16
> * **Topics:** Physical files, multi-filegroups, relational integrity, constraints (PK, FK, CHECK, DEFAULT), clustered and non-clustered B-Trees, backup types, SQL Server Agent, and NTFS copy-on-write sparse database snapshots.
> * **Production Deliverable:** Create an operational database entirely from declarative scripts with isolated secondary filegroups and an emergency snapshot rollback plan.
> * **Mentor Checkpoint:** Explain why a database can be completely logically correct while remaining operationally unsafe and prone to catastrophic data loss.

### Week 2 — T-SQL Programming Essentials & Transaction Boundaries
> [!info] Sprint Objectives
> * **Modules:** CH02 VID01–VID15
> * **Topics:** Variable scoping, flow control (`IF/ELSE`, `WHILE`), Scalar functions vs Inline TVFs vs MSTVFs, system databases (`tempdb` allocation churn), temporary tables vs table variables, batches, and ACID transaction boundaries.
> * **Production Deliverable:** Build a transactional order-processing routine with parameter validation, error trapping, and atomic rollback behavior.
> * **Mentor Checkpoint:** Rewrite one procedural row-by-row routine into a set-based query and analyze the reduction in logical reads using `SET STATISTICS IO ON`.

### Week 3 — Views, Partitioning & Advanced Querying
> [!info] Sprint Objectives
> * **Modules:** CH03 VID01–VID15
> * **Topics:** Standard views, indexed materialized views (`WITH SCHEMABINDING`), sliding-window partition functions and partition switching (`ALTER TABLE SWITCH`), semi-structured XML shredding (`.nodes()`, `.value()`), hierarchical CTEs, pagination, sequences, and Table-Valued Parameters (TVPs).
> * **Production Deliverable:** Implement an API-like query access layer using indexed views, TVPs for bulk streaming, and document the lock escalation trade-offs.
> * **Mentor Checkpoint:** Identify and define the explicit grain of every query before designing its supporting index structure.

### Week 4 — High Availability & Disaster Recovery
> [!info] Sprint Objectives
> * **Modules:** CH03 VID16–VID23
> * **Topics:** Recovery Point Objective (RPO), Recovery Time Objective (RTO), multi-instance setup, Database Mirroring (legacy literacy), Log Shipping automation, tail-log backups, and failover mechanics.
> * **Production Deliverable:** Write a one-page disaster recovery runbook showing primary and secondary server topologies, copy/restore schedules, monitoring alerts, and failover procedures.
> * **Modern DBRE Lens:** Database Mirroring is deprecated; Microsoft recommends Always On Availability Groups. Study Mirroring for conceptual grounding and legacy maintenance, while positioning Availability Groups for new production architectures.
> * **Mentor Checkpoint:** Answer: "What happens to potential data loss (RPO) and client application latency when secondary replication runs asynchronously vs synchronously?"

### Week 5 — Stored Procedures, Triggers & DDL Governance
> [!info] Sprint Objectives
> * **Modules:** CH04 VID01–VID14
> * **Topics:** Reusable stored procedure APIs, parameterization, dynamic SQL with `sp_executesql` and `QUOTENAME`, non-blocking audit triggers utilizing `inserted` and `deleted` virtual tables, server DDL triggers capturing `EVENTDATA()`, and the `OUTPUT` clause.
> * **Production Deliverable:** Build an idempotent stored procedure pipeline that audits modifications simultaneously into an immutable history table without causing write lock contention.
> * **Mentor Checkpoint:** Contrast two scenarios where a trigger makes a platform significantly safer against two scenarios where it creates unpredictable deadlocks and maintenance hazards.

### Week 6 — Cursors, SQL CLR & SMO Automation
> [!info] Sprint Objectives
> * **Modules:** CH04 VID15–VID27
> * **Topics:** Cursors vs set-based operations, C# SQL CLR user-defined functions and types, SQL Server Management Objects (SMO) programmatic administration via PowerShell and Python.
> * **Production Deliverable:** Write a PowerShell or Python script using SMO to automate database backup execution, checksum verification, and table scripting without opening SSMS.
> * **Mentor Checkpoint:** Defend whether a cursor, set-based T-SQL, or an external script/worker process is the optimal engineering choice for a given batch update workload.

### Week 7 — Reporting Services & Dimensional Modeling
> [!info] Sprint Objectives
> * **Modules:** CH05 VID01–VID20
> * **Topics:** SQL Server Reporting Services (SSRS), report server configuration, tabular/matrix reports, expressions, cascading parameters, OLTP 3NF vs OLAP Star Schema, Ralph Kimball dimensional modeling, facts, dimensions, surrogate keys, and Slowly Changing Dimensions (SCD Type 1 & 2).
> * **Production Deliverable:** Construct a star schema (`FactSales`, `DimCustomer`, `DimProduct`, `DimDate`) and design an enterprise SSRS paginated report (`.rdl`) with interactive drill-down.
> * **Mentor Checkpoint:** Explain why query performance degrades severely when running complex analytical aggregations directly against a 3NF normalized operational OLTP schema.

### Week 8 — Capstone Project & Portfolio Finalization
> [!info] Sprint Objectives
> * **Modules:** Final Capstone Case Study
> * **Topics:** Complete platform integration, automated orchestration, unit testing with tSQLt and pytest, containerized Docker deployments, and interactive portfolio presentation.
> * **Production Deliverable:** Fully verified, reproducible repository with automated CI/CD and comprehensive technical documentation.
> * **Mentor Checkpoint:** Demonstrate the platform end-to-end to a technical peer, defending architectural decisions across storage, indexing, programmability, and disaster recovery.

---

## Weekly Rhythm & Study Cadence

```mermaid
graph LR
    Watch["1. Watch & Predict
(60-90 min)"] --> Repro["2. Hands-on Code
(30-45 min)"]
    Repro --> Mod["3. Break & Modify
(20 min)"]
    Mod --> Doc["4. Document in Obsidian
(15 min)"]
```
