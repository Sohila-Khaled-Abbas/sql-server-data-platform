---
title: "CH03_VID02 — Types of Views"
aliases:
  - "CH03_VID02"
  - "Types of Views"
chapter: "CH03 — Advanced Query Techniques and High Availability"
lesson: "VID02"
tags:
  - sql-server
  - dbre
  - data-engineering
  - advanced-queries-ha
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17554"
code_reference: "src/02_indexing_and_performance/02_indexed_views.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03_VID02 — Types of Views

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH03_VID01 — Overview of Views](vid01-overview-of-views.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH03_VID03 — Creating and using Views](vid03-creating-and-using-views.md)  
> 📌 **Chapter:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md) · **Official Lesson:** [MaharaTech 17554](https://maharatech.gov.eg/mod/hvp/view.php?id=17554)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Views encapsulate reusable query logic and can provide abstraction/security boundaries. They do not automatically materialize results.

## SQL Pattern

```sql
CREATE VIEW dbo.vCustomerSales
AS
SELECT CustomerID, SUM(Amount) AS Sales
FROM dbo.Sales
GROUP BY CustomerID;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17554)
- `src/02_indexing_and_performance/02_indexed_views.sql`
