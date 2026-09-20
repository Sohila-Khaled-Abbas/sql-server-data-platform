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

> [!tip] 🔄 Dynamic Course Content Matrix (Auto-queries note frontmatter)
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Lesson Note",
>   choice(status = "completed", "✅ Completed", choice(status = "in-progress", "🔄 In Progress", "⏳ Planned")) AS "Status",
>   code_reference AS "Production Code",
>   last_modified AS "Modified"
> FROM "video-notes/ch05"
> SORT file.name ASC
> ```

### 📋 Interactive Course Content Checklist

> [!todo] Clickable Lesson Progress Checklist (Updates in real-time)
> - [ ] **CH05_VID01**: [[vid01-overview-of-sql-server-reporting-services-ssrs-installation|Overview of SSRS & Report Server Setup]]
> - [ ] **CH05_VID02**: [[vid02-create-a-report-server-project|Create Report Server Project in Visual Studio]]
> - [ ] **CH05_VID03**: [[vid03-add-some-items-to-your-report-edit-ssrs-expressions|Report Items & SSRS Expressions]]
> - [ ] **CH05_VID04**: [[vid04-change-report-properties-styling|Report Properties, Page Layout & Styling]]
> - [ ] **CH05_VID05**: [[vid05-use-count-and-interactive-sorting-functions|Aggregate Functions & Interactive Sorting]]
> - [ ] **CH05_VID06**: [[vid06-choose-how-to-group-data-in-the-table-matrix-and-chart-report|Tablix, Matrix & Chart Groupings]]
> - [ ] **CH05_VID07**: [[vid07-create-a-free-form-report|Free-Form Invoices & Subreports]]
> - [ ] **CH05_VID08**: [[vid08-join-many-tables-using-query-designer-add-indicators|Multi-Table Joins & KPI Visual Indicators]]
> - [ ] **CH05_VID09**: [[vid09-using-stored-procedures-map-dataset-to-report-parameter|Stored Procedures & Report Parameter Mapping]]
> - [ ] **CH05_VID10**: [[vid10-go-to-another-report-action|Drill-Through Actions & Document Map Links]]
> - [ ] **CH05_VID11**: [[vid11-link-datasets-has-parameter-depend-on-another-parameter|Cascading Dependent Parameters]]
> - [ ] **CH05_VID12**: [[vid12-add-a-sparkline-to-your-report|Sparklines & Data Bars in Tablix]]
> - [ ] **CH05_VID13**: [[vid13-how-to-deploy-reports-configure-report-server|Deploy Reports & Web Portal Configuration]]
> - [ ] **CH05_VID14**: [[vid14-view-reports-with-a-browser-report-builder-and-ssrs|Report Builder & Browser Export Formats]]
> - [ ] **CH05_VID15**: [[vid15-create-custom-reports-using-microsoft-rdlc-report-designer|Local RDLC Client Reports]]
> - [ ] **CH05_VID16**: [[vid16-link-parameters-to-your-custom-report|Link Parameters in Local RDLC Reports]]
> - [ ] **CH05_VID17**: [[vid17-data-warehousing|Enterprise Data Warehousing Architecture]] · `src/07_analytical_dw/01_dim_date_and_star_schema.sql`
> - [ ] **CH05_VID18**: [[vid18-difference-between-olap-and-oltp|OLTP 3NF vs OLAP Dimensional Marts]] · `src/07_analytical_dw/01_dim_date_and_star_schema.sql`
> - [ ] **CH05_VID19**: [[vid19-dimensional-modeling|Kimball Dimensional Modeling & Conformed Dimensions]] · `src/07_analytical_dw/01_dim_date_and_star_schema.sql`
> - [ ] **CH05_VID20**: [[vid20-assignment-05|Assignment 05: Star Schema Mart & Analytical Reporting]]

> [!check] 🎯 Active Unfinished Tasks Across Chapter Notes
> ```dataview
> TASK
> FROM "video-notes/ch05"
> WHERE !completed
> ```

---

## 4. Next Steps & Navigation

* 🗺️ **Full Course Tracker:** [Interactive Learning Tracker](../LEARNING_TRACKER.md)
* 📅 **8-Week Schedule:** [8-Week Mentor Study Plan](../8-WEEK-STUDY-PLAN.md)
* 🌐 **Interactive Portfolio Showcase:** [OmniFlow Web Application](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
