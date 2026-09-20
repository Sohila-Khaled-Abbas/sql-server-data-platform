---
title: "CH03_VID12 — CTE: Common Table Expression"
aliases:
  - "CH03_VID12"
  - "CTE: Common Table Expression"
chapter: "CH03 — Advanced Query Techniques and High Availability"
lesson: "VID12"
tags:
  - sql-server
  - dbre
  - data-engineering
  - advanced-queries-ha
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17564"
code_reference: "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03_VID12 — CTE: Common Table Expression

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH03_VID11 — Hierarchical Data](vid11-hierarchical-data.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH03_VID13 — Offset and Fetch keyword](vid13-offset-and-fetch-keyword.md)  
> 📌 **Chapter:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md) · **Official Lesson:** [MaharaTech 17564](https://maharatech.gov.eg/mod/hvp/view.php?id=17564)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> A CTE defines a named query expression for one statement. Recursive CTEs are especially useful for hierarchical traversal.

## SQL Pattern

```sql
WITH SalesByCustomer AS (
    SELECT CustomerID, SUM(Amount) AS Sales
    FROM dbo.Sales
    GROUP BY CustomerID
)
SELECT * FROM SalesByCustomer;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17564)
- `src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql`
