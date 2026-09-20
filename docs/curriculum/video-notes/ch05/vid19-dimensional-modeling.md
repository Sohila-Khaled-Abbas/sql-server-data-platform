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

> Dimensional modeling begins with business processes and grain, then defines facts, dimensions, keys, measures, and history strategy. Grain is the foundation.

## SQL Pattern

```sql
-- Star schema example
DimDate -> FactSales <- DimCustomer
                 <- DimProduct
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17628)
- `src/07_warehousing_and_reporting/02_dimensional_star_schema.sql`
