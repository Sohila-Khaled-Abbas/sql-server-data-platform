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
last_modified: 2026-09-19
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

| Lesson Code | Topic & Study Note | Status | Note Link |
| :--- | :--- | :---: | :--- |
| `CH01_VID01` | [Create Database and Filegroups](../video-notes/ch01/vid01-create-database-and-filegroups.md) | ☐ | [note](../video-notes/ch01/vid01-create-database-and-filegroups.md) |
| `CH01_VID02` | [Create Database Using Wizard](../video-notes/ch01/vid02-create-database-using-wizard.md) | ☐ | [note](../video-notes/ch01/vid02-create-database-using-wizard.md) |
| `CH01_VID03` | [Create Database Using Code](../video-notes/ch01/vid03-create-database-using-code.md) | ☐ | [note](../video-notes/ch01/vid03-create-database-using-code.md) |
| `CH01_VID04` | [Database Integrity](../video-notes/ch01/vid04-database-integrity.md) | ☐ | [note](../video-notes/ch01/vid04-database-integrity.md) |
| `CH01_VID05` | [Integrity constraints](../video-notes/ch01/vid05-integrity-constraints.md) | ☐ | [note](../video-notes/ch01/vid05-integrity-constraints.md) |
| `CH01_VID06` | [Constraints, Rules, and Default Values](../video-notes/ch01/vid06-constraints-rules-and-default-values.md) | ☐ | [note](../video-notes/ch01/vid06-constraints-rules-and-default-values.md) |
| `CH01_VID07` | [Creating a Custom Data Type](../video-notes/ch01/vid07-creating-a-custom-data-type.md) | ☐ | [note](../video-notes/ch01/vid07-creating-a-custom-data-type.md) |
| `CH01_VID08` | [Clustered Index](../video-notes/ch01/vid08-clustered-index.md) | ☐ | [note](../video-notes/ch01/vid08-clustered-index.md) |
| `CH01_VID09` | [Non-Clustered Index](../video-notes/ch01/vid09-non-clustered-index.md) | ☐ | [note](../video-notes/ch01/vid09-non-clustered-index.md) |
| `CH01_VID10` | [Demo on Index](../video-notes/ch01/vid10-demo-on-index.md) | ☐ | [note](../video-notes/ch01/vid10-demo-on-index.md) |
| `CH01_VID11` | [Types of Backup](../video-notes/ch01/vid11-types-of-backup.md) | ☐ | [note](../video-notes/ch01/vid11-types-of-backup.md) |
| `CH01_VID12` | [Backup Database Using Wizard](../video-notes/ch01/vid12-backup-database-using-wizard.md) | ☐ | [note](../video-notes/ch01/vid12-backup-database-using-wizard.md) |
| `CH01_VID13` | [Backup & SQL server agent jobs](../video-notes/ch01/vid13-backup-sql-server-agent-jobs.md) | ☐ | [note](../video-notes/ch01/vid13-backup-sql-server-agent-jobs.md) |
| `CH01_VID14` | [Snapshot DB](../video-notes/ch01/vid14-snapshot-db.md) | ☐ | [note](../video-notes/ch01/vid14-snapshot-db.md) |
| `CH01_VID15` | [Demo on Snapshot](../video-notes/ch01/vid15-demo-on-snapshot.md) | ☐ | [note](../video-notes/ch01/vid15-demo-on-snapshot.md) |
| `CH01_VID16` | [Assignment 01](../video-notes/ch01/vid16-assignment-01.md) | ☐ | [note](../video-notes/ch01/vid16-assignment-01.md) |

---

## 4. Next Steps & Navigation

* 🗺️ **Full Course Tracker:** [Interactive Learning Tracker](../LEARNING_TRACKER.md)
* 📅 **8-Week Schedule:** [8-Week Mentor Study Plan](../8-WEEK-STUDY-PLAN.md)
* 🌐 **Interactive Portfolio Showcase:** [OmniFlow Web Application](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
