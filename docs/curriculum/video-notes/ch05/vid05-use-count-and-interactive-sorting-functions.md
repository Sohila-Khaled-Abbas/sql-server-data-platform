---
title: "CH05_VID05 — Use count and interactive sorting functions"
aliases:
  - "CH05_VID05"
  - "Use count and interactive sorting functions"
chapter: "CH05 — Reporting and Data Warehousing"
lesson: "VID05"
tags:
  - sql-server
  - dbre
  - data-engineering
  - warehousing-and-reporting
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17614"
code_reference: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH05_VID05 — Use count and interactive sorting functions

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH05_VID04 — Change Report Properties & Styling](vid04-change-report-properties-styling.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH05_VID06 — Choose how to group data in the table, matrix and chart report](vid06-choose-how-to-group-data-in-the-table-matrix-and-chart-report.md)  
> 📌 **Chapter:** [CH05 — Reporting and Data Warehousing](../../chapters/ch05-readme.md) · **Official Lesson:** [MaharaTech 17614](https://maharatech.gov.eg/mod/hvp/view.php?id=17614)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Functions return a value or table and are generally side-effect constrained compared with procedures.

## SQL Pattern

```sql
CREATE FUNCTION dbo.fn_AddTax(@Amount decimal(18,2))
RETURNS decimal(18,2)
AS
BEGIN
    RETURN @Amount * 1.14;
END;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17614)
- `src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl`
