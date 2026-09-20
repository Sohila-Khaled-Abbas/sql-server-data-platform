---
title: "CH01_VID09 — Non-Clustered Index"
aliases:
  - "CH01_VID09"
  - "Non-Clustered Index"
chapter: "CH01 — Database Creation and Management"
lesson: "VID09"
tags:
  - sql-server
  - dbre
  - data-engineering
  - storage-and-schema
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17528"
code_reference: "src/02_indexing_and_performance/01_clustered_nonclustered.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH01_VID09 — Non-Clustered Index

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH01_VID08 — Clustered Index](vid08-clustered-index.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH01_VID10 — Demo on Index](vid10-demo-on-index.md)  
> 📌 **Chapter:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md) · **Official Lesson:** [MaharaTech 17528](https://maharatech.gov.eg/mod/hvp/view.php?id=17528)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> A clustered index determines the physical/logical ordering of leaf-level table data. A table can have at most one clustered index.

## SQL Pattern

```sql
CREATE CLUSTERED INDEX CX_Order_OrderID
ON dbo.[Order](OrderID);
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17528)
- `src/02_indexing_and_performance/01_clustered_nonclustered.sql`
