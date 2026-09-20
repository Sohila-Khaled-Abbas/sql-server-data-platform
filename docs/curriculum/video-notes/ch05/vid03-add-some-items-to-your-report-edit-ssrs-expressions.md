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

> [!info] 📊 Reporting & Data Warehousing
> SSRS is a paginated-reporting platform. Think in terms of datasets, report parameters, expressions, grouping, rendering, security, and deployment.

## SQL Pattern

```sql
-- Example report query
SELECT Region, SUM(SalesAmount) AS Sales
FROM dbo.Sales
GROUP BY Region;
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Add some items to your report & edit SSRS expressions** enforce? |
| **Performance** | How does this affect report rendering, dimensional modeling, or ETL pipeline design? |
| **Trade-offs** | When is this the wrong tool? What's the alternative? |

## My Notes

> [!note] Observations
> <!-- What did you notice while reproducing this? -->

> [!warning] Gotchas
> <!-- Edge cases, silent failures, or unintuitive behavior -->

> [!tip] Production Tip
> <!-- How would you apply this in a real data platform? -->

---

## Related Lessons

```dataview
LIST
FROM "video-notes/ch05"
WHERE file.path != this.file.path
SORT file.name ASC
LIMIT 5
```

## Links

| Resource | Link |
| :--- | :--- |
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17612) |
| Production Code | `src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl` |
| Live Platform | [OmniFlow Dimensional Star Schema](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#database-design) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl) |
