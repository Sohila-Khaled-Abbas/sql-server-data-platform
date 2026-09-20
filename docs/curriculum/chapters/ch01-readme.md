---
title: "CH01 — Database Creation and Management"
aliases:
  - "CH01"
  - "CH01 — Database Creation and Management"
tags:
  - sql-server
  - dbre
  - data-engineering
  - curriculum-chapter
  - storage-and-schema
  - maharatech
chapter: "CH01"
total_lessons: 16
date_created: 2026-09-19
last_modified: 2026-09-20
---

# CH01 — Database Creation and Management

> [!abstract] Navigation & Chapter Overview
> 📑 **Curriculum Overview:** [Curriculum README](../README.md) | ➡️ **Next:** [CH02 — SQL Programming Essentials](ch02-readme.md)

> [!info] Chapter Focus & Scope
> Physical storage architecture, 8 KB pages, 64 KB extents, multi-filegroup I/O isolation, relational constraints, B-Tree indexes, backup chains, and sparse database snapshots.

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

* 💾 **[`01_filegroups_and_files.sql`](../../../src/01_storage_and_schema/01_filegroups_and_files.sql):** Dynamic path allocation for PRIMARY, DATA_FG, INDEX_FG, ARCHIVE_FG
* 💾 **[`03_integrity_constraints.sql`](../../../src/01_storage_and_schema/03_integrity_constraints.sql):** Foreign keys, CHECK constraints, and cascading rules
* 💾 **[`ch01_vid06_constraints_rules_defaults.sql`](../../../src/01_storage_and_schema/ch01_vid06_constraints_rules_defaults.sql):** ITI Instructor table, global rules (myrule) & defaults
* 💾 **[`01_clustered_nonclustered.sql`](../../../src/02_indexing_and_performance/01_clustered_nonclustered.sql):** Clustered B-Trees and covering non-clustered indexes
* 💾 **[`01_backup_and_maintenance_jobs.sql`](../../../src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql):** SQL Agent maintenance jobs for Full/Diff/Log backups
* 💾 **[`02_snapshot_lifecycle.sql`](../../../src/06_reliability_and_dr/02_snapshot_lifecycle.sql):** NTFS copy-on-write database snapshots for instant rollback

---

## 3. Lesson Index & Study Notes (16 Modules)

> [!tip] 🔄 Dynamic Course Content Matrix (Auto-queries note frontmatter)
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Lesson Note",
>   choice(status = "completed", "✅ Completed", choice(status = "in-progress", "🔄 In Progress", "⏳ Planned")) AS "Status",
>   code_reference AS "Production Code",
>   last_modified AS "Modified"
> FROM "video-notes/ch01"
> SORT file.name ASC
> ```

### 📋 Interactive Course Content Checklist

> [!todo] Clickable Lesson Progress Checklist (Updates in real-time)
> - [ ] **CH01_VID01**: [[vid01-create-database-and-filegroups|Create Database and Filegroups]] · `src/01_storage_and_schema/01_filegroups_and_files.sql`
> - [ ] **CH01_VID02**: [[vid02-create-database-using-wizard|Create Database Using Wizard]]
> - [ ] **CH01_VID03**: [[vid03-create-database-using-code|Create Database Using Code]] · `src/01_storage_and_schema/01_filegroups_and_files.sql`
> - [ ] **CH01_VID04**: [[vid04-database-integrity|Database Integrity]] · `src/02_data_integrity_and_ddl/01_declarative_constraints.sql`
> - [ ] **CH01_VID05**: [[vid05-integrity-constraints|Integrity constraints]] · `src/02_data_integrity_and_ddl/01_declarative_constraints.sql`
> - [ ] **CH01_VID06**: [[vid06-constraints-rules-and-default-values|Constraints, Rules, and Default Values]] · `src/02_data_integrity_and_ddl/02_check_constraints_and_defaults.sql`
> - [ ] **CH01_VID07**: [[vid07-creating-a-custom-data-type|Creating a Custom Data Type]] · `src/01_storage_and_schema/04_user_defined_types.sql`
> - [ ] **CH01_VID08**: [[vid08-clustered-index|Clustered Index]] · `src/05_indexing_and_performance/01_clustered_indexes.sql`
> - [ ] **CH01_VID09**: [[vid09-non-clustered-index|Non-Clustered Index]] · `src/05_indexing_and_performance/02_nonclustered_indexes.sql`
> - [ ] **CH01_VID10**: [[vid10-demo-on-index|Demo on Index]] · `src/05_indexing_and_performance/03_index_maintenance.sql`
> - [ ] **CH01_VID11**: [[vid11-types-of-backup|Types of Backup]] · `src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql`
> - [ ] **CH01_VID12**: [[vid12-backup-database-using-wizard|Backup Database Using Wizard]] · `src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql`
> - [ ] **CH01_VID13**: [[vid13-backup-sql-server-agent-jobs|Backup & SQL server agent jobs]] · `src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql`
> - [ ] **CH01_VID14**: [[vid14-snapshot-db|Snapshot DB]] · `src/06_reliability_and_dr/02_snapshot_lifecycle.sql`
> - [ ] **CH01_VID15**: [[vid15-demo-on-snapshot|Demo on Snapshot]] · `src/06_reliability_and_dr/02_snapshot_lifecycle.sql`
> - [ ] **CH01_VID16**: [[vid16-assignment-01|Assignment 01]] · `src/01_storage_and_schema/05_company_case_study_schema.sql`

> [!check] 🎯 Active Unfinished Tasks Across Chapter Notes
> ```dataview
> TASK
> FROM "video-notes/ch01"
> WHERE !completed
> ```

---

## 4. Next Steps & Navigation

* 🗺️ **Full Course Tracker:** [Interactive Learning Tracker](../LEARNING_TRACKER.md)
* 📅 **8-Week Schedule:** [8-Week Mentor Study Plan](../8-WEEK-STUDY-PLAN.md)
* 🌐 **Interactive Portfolio Showcase:** [OmniFlow Web Application](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
