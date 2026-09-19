---
title: "CH03 — Advanced Query Techniques and High Availability"
aliases:
  - "CH03"
  - "CH03 — Advanced Query Techniques and High Availability"
tags:
  - sql-server
  - dbre
  - data-engineering
  - curriculum-chapter
  - advanced-queries-ha
  - maharatech
chapter: "CH03"
total_lessons: 23
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03 — Advanced Query Techniques and High Availability

> [!abstract] Navigation & Chapter Overview
> ⬅️ **Previous:** [CH02 — SQL Programming Essentials](ch02-readme.md) | 📑 **Curriculum Overview:** [Curriculum README](../README.md) | ➡️ **Next:** [CH04 — Procedures, Triggers, and SQL Automation](ch04-readme.md)

> [!info] Chapter Focus & Scope
> High-throughput data access and disaster recovery: standard and indexed views with SCHEMABINDING, horizontal table partitioning, XML shredding (nodes/value), recursive CTEs, sequences, TVPs, and Log Shipping / Mirroring.

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

* 💾 **[`02_indexed_views.sql`](../../../src/02_indexing_and_performance/02_indexed_views.sql):** Materialized pre-aggregated indexed views with SCHEMABINDING
* 💾 **[`04_partitioning_scheme.sql`](../../../src/01_storage_and_schema/04_partitioning_scheme.sql):** RANGE RIGHT date partition functions and zero-IO partition switching
* 💾 **[`01_tvps_and_bulk_ingestion.sql`](../../../src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql):** High-performance streaming ingestion via User-Defined Table Types
* 💾 **[`02_xml_shredding_and_generation.sql`](../../../src/03_programmability_and_elt/02_xml_shredding_and_generation.sql):** XQuery XML parsing and nested relational payload generation
* 💾 **[`04_hierarchical_data_and_ctes.sql`](../../../src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql):** Recursive CTEs for organizational hierarchy resolution
* 💾 **[`log_shipping_and_ag_guide.md`](../../../src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md):** Log shipping runbook and modern Always On Availability Group transition

---

## 3. Lesson Index & Study Notes (23 Modules)

| Lesson Code | Topic & Study Note | Status | Note Link |
| :--- | :--- | :---: | :--- |
| `CH03_VID01` | [Overview of Views](../video-notes/ch03/vid01-overview-of-views.md) | ☐ | [note](../video-notes/ch03/vid01-overview-of-views.md) |
| `CH03_VID02` | [Types of Views](../video-notes/ch03/vid02-types-of-views.md) | ☐ | [note](../video-notes/ch03/vid02-types-of-views.md) |
| `CH03_VID03` | [Creating and using Views](../video-notes/ch03/vid03-creating-and-using-views.md) | ☐ | [note](../video-notes/ch03/vid03-creating-and-using-views.md) |
| `CH03_VID04` | [DML Operations on Views](../video-notes/ch03/vid04-dml-operations-on-views.md) | ☐ | [note](../video-notes/ch03/vid04-dml-operations-on-views.md) |
| `CH03_VID05` | [Indexed View](../video-notes/ch03/vid05-indexed-view.md) | ☐ | [note](../video-notes/ch03/vid05-indexed-view.md) |
| `CH03_VID06` | [Partitioning](../video-notes/ch03/vid06-partitioning.md) | ☐ | [note](../video-notes/ch03/vid06-partitioning.md) |
| `CH03_VID07` | [Harnessing the Power of XML](../video-notes/ch03/vid07-harnessing-the-power-of-xml.md) | ☐ | [note](../video-notes/ch03/vid07-harnessing-the-power-of-xml.md) |
| `CH03_VID08` | [Use Raw and Auto Mode with For XML](../video-notes/ch03/vid08-use-raw-and-auto-mode-with-for-xml.md) | ☐ | [note](../video-notes/ch03/vid08-use-raw-and-auto-mode-with-for-xml.md) |
| `CH03_VID09` | [Use Path Mode with For XML](../video-notes/ch03/vid09-use-path-mode-with-for-xml.md) | ☐ | [note](../video-notes/ch03/vid09-use-path-mode-with-for-xml.md) |
| `CH03_VID10` | [Querying XML data](../video-notes/ch03/vid10-querying-xml-data.md) | ☐ | [note](../video-notes/ch03/vid10-querying-xml-data.md) |
| `CH03_VID11` | [Hierarchical Data](../video-notes/ch03/vid11-hierarchical-data.md) | ☐ | [note](../video-notes/ch03/vid11-hierarchical-data.md) |
| `CH03_VID12` | [CTE: Common Table Expression](../video-notes/ch03/vid12-cte-common-table-expression.md) | ☐ | [note](../video-notes/ch03/vid12-cte-common-table-expression.md) |
| `CH03_VID13` | [Offset and Fetch keyword](../video-notes/ch03/vid13-offset-and-fetch-keyword.md) | ☐ | [note](../video-notes/ch03/vid13-offset-and-fetch-keyword.md) |
| `CH03_VID14` | [Sequence](../video-notes/ch03/vid14-sequence.md) | ☐ | [note](../video-notes/ch03/vid14-sequence.md) |
| `CH03_VID15` | [Table Valued Parameters](../video-notes/ch03/vid15-table-valued-parameters.md) | ☐ | [note](../video-notes/ch03/vid15-table-valued-parameters.md) |
| `CH03_VID16` | [High Availability](../video-notes/ch03/vid16-high-availability.md) | ☐ | [note](../video-notes/ch03/vid16-high-availability.md) |
| `CH03_VID17` | [Set Up Instances](../video-notes/ch03/vid17-set-up-instances.md) | ☐ | [note](../video-notes/ch03/vid17-set-up-instances.md) |
| `CH03_VID18` | [DB Mirroring](../video-notes/ch03/vid18-db-mirroring.md) | ☐ | [note](../video-notes/ch03/vid18-db-mirroring.md) |
| `CH03_VID19` | [Demo Database Mirroring](../video-notes/ch03/vid19-demo-database-mirroring.md) | ☐ | [note](../video-notes/ch03/vid19-demo-database-mirroring.md) |
| `CH03_VID20` | [Overview of Ship Transaction Log](../video-notes/ch03/vid20-overview-of-ship-transaction-log.md) | ☐ | [note](../video-notes/ch03/vid20-overview-of-ship-transaction-log.md) |
| `CH03_VID21` | [Steps to Configure SQL Server Log Shipping](../video-notes/ch03/vid21-steps-to-configure-sql-server-log-shipping.md) | ☐ | [note](../video-notes/ch03/vid21-steps-to-configure-sql-server-log-shipping.md) |
| `CH03_VID22` | [Log Shipping vs Mirroring](../video-notes/ch03/vid22-log-shipping-vs-mirroring.md) | ☐ | [note](../video-notes/ch03/vid22-log-shipping-vs-mirroring.md) |
| `CH03_VID23` | [Assignment 03](../video-notes/ch03/vid23-assignment-03.md) | ☐ | [note](../video-notes/ch03/vid23-assignment-03.md) |

---

## 4. Next Steps & Navigation

* 🗺️ **Full Course Tracker:** [Interactive Learning Tracker](../LEARNING_TRACKER.md)
* 📅 **8-Week Schedule:** [8-Week Mentor Study Plan](../8-WEEK-STUDY-PLAN.md)
* 🌐 **Interactive Portfolio Showcase:** [OmniFlow Web Application](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
