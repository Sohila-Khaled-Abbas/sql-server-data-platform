---
title: "CH05 — Reporting and Data Warehousing"
aliases:
  - "CH05"
  - "CH05 — Reporting and Data Warehousing"
tags:
  - sql-server
  - dbre
  - data-engineering
  - curriculum-chapter
  - warehousing-and-reporting
  - maharatech
chapter: "CH05"
total_lessons: 20
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH05 — Reporting and Data Warehousing

> [!abstract] Navigation & Chapter Overview
> ⬅️ **Previous:** [CH04 — Procedures, Triggers, and SQL Automation](ch04-readme.md) | 📑 **Curriculum Overview:** [Curriculum README](../README.md)

> [!info] Chapter Focus & Scope
> Enterprise reporting and dimensional modeling: SQL Server Reporting Services (SSRS), matrix groupings, expressions, cascading parameters, OLTP 3NF vs OLAP Star Schema, Kimball dimensional modeling, and SCD Type 1 & 2 tracking.

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

* 💾 **[`01_oltp_source_schema.sql`](../../../src/07_warehousing_and_reporting/01_oltp_source_schema.sql):** Normalized 3NF transactional source tables
* 💾 **[`02_dimensional_star_schema.sql`](../../../src/07_warehousing_and_reporting/02_dimensional_star_schema.sql):** Kimball dimensional star schema: FactSales and SCD2 DimCustomer
* 💾 **[`03_etl_staging_to_dw.sql`](../../../src/07_warehousing_and_reporting/03_etl_staging_to_dw.sql):** Staging load procedures with MERGE and SCD2 validity tracking
* 💾 **[`SalesExecutiveSummary.rdl`](../../../src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl):** Paginated enterprise SSRS report XML definition

---

## 3. Lesson Index & Study Notes (20 Modules)

| Lesson Code | Topic & Study Note | Status | Note Link |
| :--- | :--- | :---: | :--- |
| `CH05_VID01` | [Overview of SQL Server Reporting Services (SSRS) & installation](../video-notes/ch05/vid01-overview-of-sql-server-reporting-services-ssrs-installation.md) | ☐ | [note](../video-notes/ch05/vid01-overview-of-sql-server-reporting-services-ssrs-installation.md) |
| `CH05_VID02` | [Create a report server project](../video-notes/ch05/vid02-create-a-report-server-project.md) | ☐ | [note](../video-notes/ch05/vid02-create-a-report-server-project.md) |
| `CH05_VID03` | [Add some items to your report & edit SSRS expressions](../video-notes/ch05/vid03-add-some-items-to-your-report-edit-ssrs-expressions.md) | ☐ | [note](../video-notes/ch05/vid03-add-some-items-to-your-report-edit-ssrs-expressions.md) |
| `CH05_VID04` | [Change Report Properties & Styling](../video-notes/ch05/vid04-change-report-properties-styling.md) | ☐ | [note](../video-notes/ch05/vid04-change-report-properties-styling.md) |
| `CH05_VID05` | [Use count and interactive sorting functions](../video-notes/ch05/vid05-use-count-and-interactive-sorting-functions.md) | ☐ | [note](../video-notes/ch05/vid05-use-count-and-interactive-sorting-functions.md) |
| `CH05_VID06` | [Choose how to group data in the table, matrix and chart report](../video-notes/ch05/vid06-choose-how-to-group-data-in-the-table-matrix-and-chart-report.md) | ☐ | [note](../video-notes/ch05/vid06-choose-how-to-group-data-in-the-table-matrix-and-chart-report.md) |
| `CH05_VID07` | [Create a free form report](../video-notes/ch05/vid07-create-a-free-form-report.md) | ☐ | [note](../video-notes/ch05/vid07-create-a-free-form-report.md) |
| `CH05_VID08` | [Join many tables using query designer & Add indicators](../video-notes/ch05/vid08-join-many-tables-using-query-designer-add-indicators.md) | ☐ | [note](../video-notes/ch05/vid08-join-many-tables-using-query-designer-add-indicators.md) |
| `CH05_VID09` | [Using Stored Procedures & Map dataset to report parameter](../video-notes/ch05/vid09-using-stored-procedures-map-dataset-to-report-parameter.md) | ☐ | [note](../video-notes/ch05/vid09-using-stored-procedures-map-dataset-to-report-parameter.md) |
| `CH05_VID10` | [Go to another report action](../video-notes/ch05/vid10-go-to-another-report-action.md) | ☐ | [note](../video-notes/ch05/vid10-go-to-another-report-action.md) |
| `CH05_VID11` | [Link datasets has parameter depend on another parameter](../video-notes/ch05/vid11-link-datasets-has-parameter-depend-on-another-parameter.md) | ☐ | [note](../video-notes/ch05/vid11-link-datasets-has-parameter-depend-on-another-parameter.md) |
| `CH05_VID12` | [Add a sparkline to your report](../video-notes/ch05/vid12-add-a-sparkline-to-your-report.md) | ☐ | [note](../video-notes/ch05/vid12-add-a-sparkline-to-your-report.md) |
| `CH05_VID13` | [How to deploy reports & configure report server](../video-notes/ch05/vid13-how-to-deploy-reports-configure-report-server.md) | ☐ | [note](../video-notes/ch05/vid13-how-to-deploy-reports-configure-report-server.md) |
| `CH05_VID14` | [View reports with a browser (Report Builder and SSRS)](../video-notes/ch05/vid14-view-reports-with-a-browser-report-builder-and-ssrs.md) | ☐ | [note](../video-notes/ch05/vid14-view-reports-with-a-browser-report-builder-and-ssrs.md) |
| `CH05_VID15` | [Create custom reports using Microsoft RDLC Report Designer](../video-notes/ch05/vid15-create-custom-reports-using-microsoft-rdlc-report-designer.md) | ☐ | [note](../video-notes/ch05/vid15-create-custom-reports-using-microsoft-rdlc-report-designer.md) |
| `CH05_VID16` | [Link parameters to your custom report](../video-notes/ch05/vid16-link-parameters-to-your-custom-report.md) | ☐ | [note](../video-notes/ch05/vid16-link-parameters-to-your-custom-report.md) |
| `CH05_VID17` | [Data Warehousing](../video-notes/ch05/vid17-data-warehousing.md) | ☐ | [note](../video-notes/ch05/vid17-data-warehousing.md) |
| `CH05_VID18` | [Difference between OLAP and OLTP](../video-notes/ch05/vid18-difference-between-olap-and-oltp.md) | ☐ | [note](../video-notes/ch05/vid18-difference-between-olap-and-oltp.md) |
| `CH05_VID19` | [Dimensional Modeling](../video-notes/ch05/vid19-dimensional-modeling.md) | ☐ | [note](../video-notes/ch05/vid19-dimensional-modeling.md) |
| `CH05_VID20` | [Assignment 05](../video-notes/ch05/vid20-assignment-05.md) | ☐ | [note](../video-notes/ch05/vid20-assignment-05.md) |

---

## 4. Next Steps & Navigation

* 🗺️ **Full Course Tracker:** [Interactive Learning Tracker](../LEARNING_TRACKER.md)
* 📅 **8-Week Schedule:** [8-Week Mentor Study Plan](../8-WEEK-STUDY-PLAN.md)
* 🌐 **Interactive Portfolio Showcase:** [OmniFlow Web Application](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
