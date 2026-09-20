---
title: "CH05_VID01 — Overview of SQL Server Reporting Services (SSRS) & installation"
aliases:
  - "CH05_VID01"
  - "Overview of SQL Server Reporting Services (SSRS) & installation"
chapter: "CH05 — Reporting and Data Warehousing"
lesson: "VID01"
tags:
  - sql-server
  - dbre
  - data-engineering
  - warehousing-and-reporting
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17610"
code_reference: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH05_VID01 — Overview of SQL Server Reporting Services (SSRS) & installation

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH04_VID27 — Assignment 04](../ch04/vid27-assignment-04.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH05_VID02 — Create a report server project](vid02-create-a-report-server-project.md)  
> 📌 **Chapter:** [CH05 — Reporting and Data Warehousing](../../chapters/ch05-readme.md) · **Official Lesson:** [MaharaTech 17610](https://maharatech.gov.eg/mod/hvp/view.php?id=17610)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> SSRS is a paginated-reporting platform. Think in terms of datasets, report parameters, expressions, grouping, rendering, security, and deployment.

## SQL Pattern

```sql
-- Example report query
SELECT Region, SUM(SalesAmount) AS Sales
FROM dbo.Sales
GROUP BY Region;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17610)
- `src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl`
