---
title: "Data Engineering & DBRE Roadmap — SQL Server Platform"
aliases:
  - "Study Plan"
  - "Engineering Roadmap"
tags:
  - sql-server
  - dbre
  - data-engineering
  - study-plan
  - roadmap
date_created: 2026-09-19
last_modified: 2026-09-19
---

# Data Engineering & DBRE Roadmap — SQL Server Platform

> [!abstract] Engineering Curriculum Roadmap
> 📑 **Navigation:** [Curriculum Overview](README.md) · [Learning Tracker](LEARNING_TRACKER.md) · [8-Week Study Plan](8-WEEK-STUDY-PLAN.md) · [Mentor Workflow](MENTOR_WORKFLOW.md)  
> 🎯 **Guiding Philosophy:** Move beyond basic query syntax to master database internals, storage allocation, transaction durability, and operational resilience.

---

## Phase 0 — Prerequisite Baseline Verification

Before progressing into database engine internals, ensure total fluency in fundamental T-SQL querying:

> [!check] Baseline Prerequisites
> * [x] Standard `SELECT`, `WHERE`, `JOIN` (INNER, LEFT, RIGHT, FULL, CROSS), `GROUP BY`, `HAVING`
> * [x] Subqueries (correlated vs non-correlated) and basic Common Table Expressions (`WITH`)
> * [x] DML statements (`INSERT`, `UPDATE`, `DELETE`) with explicit WHERE clauses
> * [x] Primary keys and Foreign key relational enforcement
> * [x] Window functions (`ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `SUM() OVER (...)`)
> * [x] Basic transaction isolation and commit/rollback mechanics

---

## Phase 1 — Database Creation & Storage Engine Internals

> [!info] Goal
> Understand what SQL Server is managing underneath tables and queries at the storage engine level.

* **Core Focus:**
  * Logical database files vs physical `.mdf`, `.ndf`, and `.ldf` files.
  * Secondary filegroup isolation (`DATA_FG`, `INDEX_FG`, `ARCHIVE_FG`).
  * Relational integrity constraints (PK, FK, CHECK, DEFAULT, cascading rules).
  * Clustered B-Trees vs Non-Clustered secondary indexes.
  * Full, Differential, and Transaction Log backup chains.
  * SQL Server Agent maintenance automation.
  * Database snapshots utilizing copy-on-write sparse NTFS files.
* **Mini-Project:** Create a database entirely via script, configure isolated filegroups, and execute a verified snapshot rollback drill.

---

## Phase 2 — SQL Programming Essentials & ACID Boundaries

> [!info] Goal
> Author modular, reusable procedural T-SQL without falling into row-by-row procedural anti-patterns.

* **Core Focus:**
  * Local vs global variable scope and lifecycle.
  * Deterministic control flow (`IF/ELSE`, `WHILE`).
  * Execution plan differentiation: Scalar functions vs Inline TVFs vs Multi-Statement TVFs.
  * System databases (`master`, `msdb`, `model`, `tempdb` allocation contention).
  * Temp tables (`#table`) vs table variables (`@table`) and cardinality estimation.
  * Batch separation (`GO`) and transaction boundaries with savepoints.
* **Mini-Project:** Construct a transactional order processing procedure with strict error trapping (`TRY...CATCH`), `XACT_ABORT`, and atomic rollback.

---

## Phase 3 — Advanced Data Access & High Availability

> [!info] Goal
> Transition from basic queries to high-throughput data access layers and operational resilience architectures.

* **Core Focus:**
  * Materialized indexed views (`WITH SCHEMABINDING`).
  * Sliding-window horizontal table partitioning and metadata-only partition switching.
  * Semi-structured XML querying via XQuery `.nodes()`, `.value()`, and `.query()`.
  * Recursive Common Table Expressions (CTEs) for hierarchical datasets.
  * High-throughput bulk ingestion using Table-Valued Parameters (TVPs).
  * High availability topologies: RPO/RTO targets, Log Shipping, and Always On Availability Groups.
* **Mini-Project:** Build an analytical view layer paired with a comprehensive disaster recovery runbook.

---

## Phase 4 — Procedures, Triggers & Automation Engineering

> [!info] Goal
> Build governed database-side logic and leverage programmatic automation APIs.

* **Core Focus:**
  * Stored procedure parameterization, optional parameters, and output parameters.
  * Dynamic SQL injection defense using `sys.sp_executesql` and `QUOTENAME()`.
  * Non-blocking change capture triggers using `inserted` and `deleted` tables.
  * Server-level DDL audit triggers capturing XML payloads from `EVENTDATA()`.
  * Non-locking streaming audit via the `OUTPUT` clause.
  * Cursors vs set-based window aggregates performance benchmark.
  * High-performance C# SQL CLR assemblies and PowerShell SMO automation.
* **Mini-Project:** Build an automated PowerShell maintenance suite using SMO to verify database checksums and script schema definitions.

---

## Phase 5 — Reporting Services & Dimensional Warehousing

> [!info] Goal
> Bridge transactional operational systems (OLTP) and analytical business intelligence platforms (OLAP).

* **Core Focus:**
  * SQL Server Reporting Services (SSRS) dataset mapping and query parameterization.
  * Tabular and matrix grouping, expressions, and sparkline indicators.
  * Reporting deployment workflows, report builder, and browser delivery.
  * 3NF transactional modeling vs Ralph Kimball dimensional star schema modeling.
  * Fact tables, dimension tables, surrogate keys, and Slowly Changing Dimensions (SCD Type 1 & 2).
* **Mini-Project:** Design a star schema data mart with automated staging ELT procedures and an executive SSRS paginated report.

---

## Phase 6 — Capstone Integrated Platform

Synthesize all five chapters into a unified enterprise data platform repository:
1. Multi-filegroup storage engine.
2. 3NF operational OLTP relational model.
3. Declarative constraints and covering B-Tree indexes.
4. Transactional stored procedures with audit logging.
5. High-availability backup chains and sparse snapshot rollbacks.
6. Kimball dimensional star schema and staging ELT.
7. Executive SSRS paginated report.
8. Comprehensive unit and integration test harnesses (tSQLt, pytest).
