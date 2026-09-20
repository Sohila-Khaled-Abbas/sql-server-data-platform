---
title: "CH01_VID08 — Clustered Index"
aliases:
  - "CH01_VID08"
  - "Clustered Index"
chapter: "CH01 — Database Creation and Management"
lesson: "VID08"
tags:
  - sql-server
  - dbre
  - data-engineering
  - storage-and-schema
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17527"
code_reference: "src/02_indexing_and_performance/01_clustered_nonclustered.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH01_VID08 — Clustered Index

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH01_VID07 — Creating a Custom Data Type](vid07-creating-a-custom-data-type.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH01_VID09 — Non-Clustered Index](vid09-non-clustered-index.md)  
> 📌 **Chapter:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md) · **Official Lesson:** [MaharaTech 17527](https://maharatech.gov.eg/mod/hvp/view.php?id=17527)

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

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17527)
- `src/02_indexing_and_performance/01_clustered_nonclustered.sql`
