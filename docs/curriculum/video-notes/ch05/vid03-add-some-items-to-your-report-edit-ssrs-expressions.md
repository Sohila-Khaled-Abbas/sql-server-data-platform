---
title: "CH05_VID03 — Add some items to your report & edit SSRS expressions"
aliases:
  - "CH05_VID03"
  - "Add some items to your report & edit SSRS expressions"
chapter: "CH05 — Reporting and Data Warehousing"
lesson: "VID03"
tags:
  - sql-server
  - dbre
  - data-engineering
  - warehousing-and-reporting
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17612"
code_reference: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH05_VID03 — Add some items to your report & edit SSRS expressions

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH05_VID02 — Create a report server project](vid02-create-a-report-server-project.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH05_VID04 — Change Report Properties & Styling](vid04-change-report-properties-styling.md)  
> 📌 **Chapter:** [CH05 — Reporting and Data Warehousing](../../chapters/ch05-readme.md) · **Official Lesson:** [MaharaTech 17612](https://maharatech.gov.eg/mod/hvp/view.php?id=17612)

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

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17612)
- `src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl`
