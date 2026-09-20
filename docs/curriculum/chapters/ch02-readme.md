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

> [!tip] 🔄 Dynamic Course Content Matrix (Auto-queries note frontmatter)
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Lesson Note",
>   choice(status = "completed", "✅ Completed", choice(status = "in-progress", "🔄 In Progress", "⏳ Planned")) AS "Status",
>   code_reference AS "Production Code",
>   last_modified AS "Modified"
> FROM "video-notes/ch02"
> SORT file.name ASC
> ```

### 📋 Interactive Course Content Checklist

> [!todo] Clickable Lesson Progress Checklist (Updates in real-time)
> - [ ] **CH02_VID01**: [[vid01-variables|Variables]] · `src/03_programmability_and_elt/01_user_defined_functions.sql`
> - [ ] **CH02_VID02**: [[vid02-local-variables|Local Variables]] · `src/03_programmability_and_elt/01_user_defined_functions.sql`
> - [ ] **CH02_VID03**: [[vid03-global-variables|Global Variables]] · `src/03_programmability_and_elt/01_user_defined_functions.sql`
> - [ ] **CH02_VID04**: [[vid04-control-of-flow-part-1|Control of Flow Part 1]] · `src/03_programmability_and_elt/01_user_defined_functions.sql`
> - [ ] **CH02_VID05**: [[vid05-control-of-flow-part-2|Control of Flow Part 2]] · `src/03_programmability_and_elt/01_user_defined_functions.sql`
> - [ ] **CH02_VID06**: [[vid06-functions|Functions Overview]] · `src/03_programmability_and_elt/01_user_defined_functions.sql`
> - [ ] **CH02_VID07**: [[vid07-scalar-function|Scalar Functions]] · `src/03_programmability_and_elt/01_user_defined_functions.sql`
> - [ ] **CH02_VID08**: [[vid08-inline-statement-table-valued-functions|Inline Table-Valued Functions (iTVF)]] · `src/03_programmability_and_elt/01_user_defined_functions.sql`
> - [ ] **CH02_VID09**: [[vid09-multi-statement-table-valued-functions|Multi-Statement Table-Valued Functions (mTVF)]] · `src/03_programmability_and_elt/01_user_defined_functions.sql`
> - [ ] **CH02_VID10**: [[vid10-system-databases|System Databases (master, msdb, tempdb, model)]]
> - [ ] **CH02_VID11**: [[vid11-types-of-table|Types of Tables (#Temp, ##Global, @Table)]]
> - [ ] **CH02_VID12**: [[vid12-script-batch|Scripts, Batches & GO Delimiters]]
> - [ ] **CH02_VID13**: [[vid13-types-of-transactions|Types of Transactions & ACID Isolation]] · `src/03_programmability_and_elt/03_stored_procedures_etl.sql`
> - [ ] **CH02_VID14**: [[vid14-demo-on-transactions|Demo on Transactions & Rollbacks]] · `src/03_programmability_and_elt/03_stored_procedures_etl.sql`
> - [ ] **CH02_VID15**: [[vid15-assignment-02|Assignment 02: Transactional Pipeline Engineering]]

> [!check] 🎯 Active Unfinished Tasks Across Chapter Notes
> ```dataview
> TASK
> FROM "video-notes/ch02"
> WHERE !completed
> ```

---

## 4. Next Steps & Navigation

* 🗺️ **Full Course Tracker:** [Interactive Learning Tracker](../LEARNING_TRACKER.md)
* 📅 **8-Week Schedule:** [8-Week Mentor Study Plan](../8-WEEK-STUDY-PLAN.md)
* 🌐 **Interactive Portfolio Showcase:** [OmniFlow Web Application](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
