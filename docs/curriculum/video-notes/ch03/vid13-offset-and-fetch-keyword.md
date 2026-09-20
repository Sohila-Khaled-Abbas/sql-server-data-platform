---
title: "CH03_VID13 — Offset and Fetch keyword"
aliases:
  - "CH03_VID13"
  - "Offset and Fetch keyword"
chapter: "CH03 — Advanced Query Techniques and High Availability"
lesson: "VID13"
tags:
  - sql-server
  - dbre
  - data-engineering
  - advanced-queries-ha
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17565"
code_reference: "src/02_indexing_and_performance/03_execution_plan_analysis.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03_VID13 — Offset and Fetch keyword

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH03_VID12 — CTE: Common Table Expression](vid12-cte-common-table-expression.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH03_VID14 — Sequence](vid14-sequence.md)  
> 📌 **Chapter:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md) · **Official Lesson:** [MaharaTech 17565](https://maharatech.gov.eg/mod/hvp/view.php?id=17565)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> OFFSET/FETCH requires deterministic ordering. For large pagination workloads, compare it with keyset/seek pagination.

## SQL Pattern

```sql
SELECT CustomerID, Name
FROM dbo.Customer
ORDER BY CustomerID
OFFSET 50 ROWS FETCH NEXT 25 ROWS ONLY;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17565)
- `src/02_indexing_and_performance/03_execution_plan_analysis.sql`
