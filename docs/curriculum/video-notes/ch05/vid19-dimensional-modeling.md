---
title: "CH05_VID19 — Dimensional Modeling"
aliases:
  - "CH05_VID19"
  - "Dimensional Modeling"
chapter: "CH05 — Reporting and Data Warehousing"
lesson: "VID19"
tags:
  - sql-server
  - dbre
  - data-engineering
  - warehousing-and-reporting
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17628"
code_reference: "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH05_VID19 — Dimensional Modeling

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH05_VID18 — Difference between OLAP and OLTP](vid18-difference-between-olap-and-oltp.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH05_VID20 — Assignment 05](vid20-assignment-05.md)  
> 📌 **Chapter:** [CH05 — Reporting and Data Warehousing](../../chapters/ch05-readme.md) · **Official Lesson:** [MaharaTech 17628](https://maharatech.gov.eg/mod/hvp/view.php?id=17628)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] 📊 Reporting & Data Warehousing
> Dimensional modeling begins with business processes and grain, then defines facts, dimensions, keys, measures, and history strategy. Grain is the foundation.

## SQL Pattern

```sql
-- Star schema example
DimDate -> FactSales <- DimCustomer
                 <- DimProduct
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Dimensional Modeling** enforce? |
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
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17628) |
| Production Code | `src/07_warehousing_and_reporting/02_dimensional_star_schema.sql` |
| Live Platform | [OmniFlow Dimensional Star Schema](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#database-design) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/07_warehousing_and_reporting/02_dimensional_star_schema.sql) |
