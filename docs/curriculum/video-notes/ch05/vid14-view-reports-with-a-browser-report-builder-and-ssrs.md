---
title: "CH05_VID14 — View reports with a browser (Report Builder and SSRS)"
aliases:
  - "CH05_VID14"
  - "View reports with a browser (Report Builder and SSRS)"
chapter: "CH05 — Reporting and Data Warehousing"
lesson: "VID14"
tags:
  - sql-server
  - dbre
  - data-engineering
  - warehousing-and-reporting
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17623"
code_reference: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH05_VID14 — View reports with a browser (Report Builder and SSRS)

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH05_VID13 — How to deploy reports & configure report server](vid13-how-to-deploy-reports-configure-report-server.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH05_VID15 — Create custom reports using Microsoft RDLC Report Designer](vid15-create-custom-reports-using-microsoft-rdlc-report-designer.md)  
> 📌 **Chapter:** [CH05 — Reporting and Data Warehousing](../../chapters/ch05-readme.md) · **Official Lesson:** [MaharaTech 17623](https://maharatech.gov.eg/mod/hvp/view.php?id=17623)

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

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17623)
- `src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl`
