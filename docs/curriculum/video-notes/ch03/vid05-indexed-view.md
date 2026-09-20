---
title: "CH03_VID05 — Indexed View"
aliases:
  - "CH03_VID05"
  - "Indexed View"
chapter: "CH03 — Advanced Query Techniques and High Availability"
lesson: "VID05"
tags:
  - sql-server
  - dbre
  - data-engineering
  - advanced-queries-ha
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17557"
code_reference: "src/02_indexing_and_performance/02_indexed_views.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03_VID05 — Indexed View

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH03_VID04 — DML Operations on Views](vid04-dml-operations-on-views.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH03_VID06 — Partitioning](vid06-partitioning.md)  
> 📌 **Chapter:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md) · **Official Lesson:** [MaharaTech 17557](https://maharatech.gov.eg/mod/hvp/view.php?id=17557)

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

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17557)
- `src/02_indexing_and_performance/02_indexed_views.sql`
