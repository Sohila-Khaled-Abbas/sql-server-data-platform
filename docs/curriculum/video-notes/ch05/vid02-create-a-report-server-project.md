---
title: "CH05_VID02 — Create a report server project"
aliases:
  - "CH05_VID02"
  - "Create a report server project"
chapter: "CH05 — Reporting and Data Warehousing"
lesson: "VID02"
tags:
  - sql-server
  - dbre
  - data-engineering
  - warehousing-and-reporting
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17611"
code_reference: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH05_VID02 — Create a report server project

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH05_VID01 — Overview of SQL Server Reporting Services (SSRS) & installation](vid01-overview-of-sql-server-reporting-services-ssrs-installation.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH05_VID03 — Add some items to your report & edit SSRS expressions](vid03-add-some-items-to-your-report-edit-ssrs-expressions.md)  
> 📌 **Chapter:** [CH05 — Reporting and Data Warehousing](../../chapters/ch05-readme.md) · **Official Lesson:** [MaharaTech 17611](https://maharatech.gov.eg/mod/hvp/view.php?id=17611)

## 🎯 Engineering Mastery Checklist
- [ ] 📺 **Architectural Concept** · Core engine mechanics, internals, and storage allocation
- [ ] 💻 **Hands-On Execution** · Script executed and validated against SQL Server 2022 / SSMS
- [ ] 🧪 **Edge Case & Stress Testing** · Tested boundary limits, error traps (`XACT_ABORT`), and constraints
- [ ] 🚀 **Production Code Verified** · Documented implementation tracked in `src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl`

---

## 1. Learning Objectives & Architectural Focus

By the end of this lesson, I should be able to explain the core idea behind **Create a report server project**, write/reproduce a small working example, and describe when the feature is useful in a real SQL Server data platform.

> [!info] Architectural Principle
> SSRS is a paginated-reporting platform. Think in terms of datasets, report parameters, expressions, grouping, rendering, security, and deployment.

> [!tip] 2026 Data Engineering & DBRE Lens
> While watching, note which steps are product-specific UI actions versus durable SQL/database-engineering concepts. Your GitHub notes should preserve the latter.

---

## 2. Production T-SQL Implementation Pattern

```sql
-- Example report query
SELECT Region, SUM(SalesAmount) AS Sales
FROM dbo.Sales
GROUP BY Region;
```

---

## 3. Production Engineering Evaluation Matrix

| Dimension | Critical Engineering Evaluation |
| :--- | :--- |
| **Correctness** | What data invariant, operational behavior, or ACID guarantee does it enforce? |
| **Performance** | How does this affect I/O operations, page allocation, buffer cache, CPU, or lock contention? |
| **Operations** | How does this behave under disaster recovery, failover, backup chains, and migration? |
| **Maintainability** | Can another engineer easily diagnose, extend, or alter this object without breaking dependent callers? |

---

## 4. Hands-on Reproduction & Edge Case Drill

Rebuild the core pattern from memory in SSMS or Docker container. Test boundary conditions, edge cases, and failure modes.

```sql
-- Hands-on Verification & Edge Case Drill
-- Example report query
SELECT Region, SUM(SalesAmount) AS Sales
FROM dbo.Sales
GROUP BY Region;
```

---

## 5. Architectural Synthesis & Mentor Checkpoint

> [!question] Senior DBRE / Architect Challenge
> **Explain without SQL:** What problem would this feature solve in a production data platform, and what would you use instead when the feature is the wrong tool?

*My Engineering Synthesis:*
<!-- Document your synthesized mental model, architectural trade-offs, and operational lessons here -->

---

## 6. Observation & SSMS Notes

- **Key demonstration observed:**
- **Important SSMS / Engine setting:**
- **Critical syntax nuance:**
- **Failure mode or trap avoided:**
- **Research item for deeper inquiry:**

---

## 7. Evidence & Production Artifact Links

* 🔗 **Official Course Module:** [MaharaTech Lesson 17611](https://maharatech.gov.eg/mod/hvp/view.php?id=17611)
* 💾 **Production Script:** [`src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl`](../../../../src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl)
* 📖 **Chapter Mastery Guide:** [CH05 — Reporting and Data Warehousing](../../chapters/ch05-readme.md)
* 🗺️ **Curriculum Tracker:** [Interactive Learning Tracker](../../LEARNING_TRACKER.md)
* 🚀 **Interactive Showcase:** [OmniFlow Platform Web App](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
