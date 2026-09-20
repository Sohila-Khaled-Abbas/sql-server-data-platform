---
title: "CH03_VID11 — Hierarchical Data"
aliases:
  - "CH03_VID11"
  - "Hierarchical Data"
chapter: "CH03 — Advanced Query Techniques and High Availability"
lesson: "VID11"
tags:
  - sql-server
  - dbre
  - data-engineering
  - advanced-queries-ha
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17563"
code_reference: "src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03_VID11 — Hierarchical Data

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH03_VID10 — Querying XML data](vid10-querying-xml-data.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH03_VID12 — CTE: Common Table Expression](vid12-cte-common-table-expression.md)  
> 📌 **Chapter:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md) · **Official Lesson:** [MaharaTech 17563](https://maharatech.gov.eg/mod/hvp/view.php?id=17563)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Hierarchical data can be modeled with adjacency lists, recursive CTEs, hierarchyid, or other patterns depending on access requirements.

## SQL Pattern

```sql
CREATE TABLE dbo.Employee(
  EmployeeID int PRIMARY KEY,
  ManagerID int NULL REFERENCES dbo.Employee(EmployeeID)
);
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17563)
- `src/03_programmability_and_elt/04_hierarchical_data_and_ctes.sql`
