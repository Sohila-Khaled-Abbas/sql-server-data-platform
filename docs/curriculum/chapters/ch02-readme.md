---
title: "CH02 — SQL Programming Essentials"
aliases:
  - "CH02"
  - "CH02 — SQL Programming Essentials"
tags:
  - sql-server
  - dbre
  - data-engineering
  - curriculum-chapter
  - sql-programming
  - maharatech
chapter: "CH02"
total_lessons: 15
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH02 — SQL Programming Essentials

> [!abstract] Navigation & Chapter Overview
> ⬅️ **Previous:** [CH01 — Database Creation and Management](ch01-readme.md) | 📑 **Curriculum Overview:** [Curriculum README](../README.md) | ➡️ **Next:** [CH03 — Advanced Query Techniques and High Availability](ch03-readme.md)

> [!info] Chapter Focus & Scope
> Procedural T-SQL without row-by-row anti-patterns: variable scoping, control flow, functions (Scalar vs Inline TVF vs MSTVF), system databases, temporary tables, batches, and ACID transaction boundaries.

---

## 1. Chapter Mastery Objectives

At the end of this chapter, be able to articulate and demonstrate how the objects and architectural patterns affect the four core pillars of database engineering:

> [!check] Engineering Dimensions
> 1. **Correctness:** Enforce relational integrity, domain invariants, and explicit ACID boundaries.
> 2. **Performance:** Eliminate lock contention, minimize buffer page churn, and maximize execution plan efficiency.
> 3. **Recoverability:** Design resilient RPO/RTO backup chains, NTFS sparse snapshots, and high-availability topologies.
> 4. **Maintainability:** Ensure transparent DDL governance, change capture audit trails, and idempotent scripts.

---

## 2. Production Code Artifacts

The following production scripts in the repository implement the patterns covered across this chapter:

* 💾 **[`05_scalar_vs_table_functions.sql`](../../../src/03_programmability_and_elt/05_scalar_vs_table_functions.sql):** Execution plan benchmark: Scalar UDF inlining vs iTVFs vs MSTVFs
* 💾 **[`03_stored_procedures_etl.sql`](../../../src/03_programmability_and_elt/03_stored_procedures_etl.sql):** Transactional procedural pipelines with XACT_ABORT and TRY...CATCH
* 💾 **[`03_execution_plan_analysis.sql`](../../../src/02_indexing_and_performance/03_execution_plan_analysis.sql):** Set-based execution plans vs RBAR procedural cursor bottlenecks

---

## 3. Lesson Index & Study Notes (15 Modules)

| Lesson Code | Topic & Study Note | Status | Note Link |
| :--- | :--- | :---: | :--- |
| `CH02_VID01` | [Variables](../video-notes/ch02/vid01-variables.md) | ☐ | [note](../video-notes/ch02/vid01-variables.md) |
| `CH02_VID02` | [Local Variables](../video-notes/ch02/vid02-local-variables.md) | ☐ | [note](../video-notes/ch02/vid02-local-variables.md) |
| `CH02_VID03` | [Global Variables](../video-notes/ch02/vid03-global-variables.md) | ☐ | [note](../video-notes/ch02/vid03-global-variables.md) |
| `CH02_VID04` | [Control of Flow_Part(1)](../video-notes/ch02/vid04-control-of-flow-part-1.md) | ☐ | [note](../video-notes/ch02/vid04-control-of-flow-part-1.md) |
| `CH02_VID05` | [Control of Flow_Part(2)](../video-notes/ch02/vid05-control-of-flow-part-2.md) | ☐ | [note](../video-notes/ch02/vid05-control-of-flow-part-2.md) |
| `CH02_VID06` | [Functions](../video-notes/ch02/vid06-functions.md) | ☐ | [note](../video-notes/ch02/vid06-functions.md) |
| `CH02_VID07` | [Scalar Function](../video-notes/ch02/vid07-scalar-function.md) | ☐ | [note](../video-notes/ch02/vid07-scalar-function.md) |
| `CH02_VID08` | [Inline Statement Table-Valued Functions](../video-notes/ch02/vid08-inline-statement-table-valued-functions.md) | ☐ | [note](../video-notes/ch02/vid08-inline-statement-table-valued-functions.md) |
| `CH02_VID09` | [Multi-Statement Table-Valued Functions](../video-notes/ch02/vid09-multi-statement-table-valued-functions.md) | ☐ | [note](../video-notes/ch02/vid09-multi-statement-table-valued-functions.md) |
| `CH02_VID10` | [System databases](../video-notes/ch02/vid10-system-databases.md) | ☐ | [note](../video-notes/ch02/vid10-system-databases.md) |
| `CH02_VID11` | [Types of Table](../video-notes/ch02/vid11-types-of-table.md) | ☐ | [note](../video-notes/ch02/vid11-types-of-table.md) |
| `CH02_VID12` | [Script & Batch](../video-notes/ch02/vid12-script-batch.md) | ☐ | [note](../video-notes/ch02/vid12-script-batch.md) |
| `CH02_VID13` | [Types of Transactions](../video-notes/ch02/vid13-types-of-transactions.md) | ☐ | [note](../video-notes/ch02/vid13-types-of-transactions.md) |
| `CH02_VID14` | [Demo on Transactions](../video-notes/ch02/vid14-demo-on-transactions.md) | ☐ | [note](../video-notes/ch02/vid14-demo-on-transactions.md) |
| `CH02_VID15` | [Assignment 02](../video-notes/ch02/vid15-assignment-02.md) | ☐ | [note](../video-notes/ch02/vid15-assignment-02.md) |

---

## 4. Next Steps & Navigation

* 🗺️ **Full Course Tracker:** [Interactive Learning Tracker](../LEARNING_TRACKER.md)
* 📅 **8-Week Schedule:** [8-Week Mentor Study Plan](../8-WEEK-STUDY-PLAN.md)
* 🌐 **Interactive Portfolio Showcase:** [OmniFlow Web Application](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
