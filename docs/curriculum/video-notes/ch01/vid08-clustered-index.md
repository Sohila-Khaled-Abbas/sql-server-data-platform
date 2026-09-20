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

> [!info] 🏗️ Storage & Physical Architecture
> A clustered index determines the physical/logical ordering of leaf-level table data. A table can have at most one clustered index.

## SQL Pattern

```sql
CREATE CLUSTERED INDEX CX_Order_OrderID
ON dbo.[Order](OrderID);
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Clustered Index** enforce? |
| **Performance** | How does this affect page allocation, filegroup isolation, or backup chain integrity? |
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
FROM "video-notes/ch01"
WHERE file.path != this.file.path
SORT file.name ASC
LIMIT 5
```

## Links

| Resource | Link |
| :--- | :--- |
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17527) |
| Production Code | `src/02_indexing_and_performance/01_clustered_nonclustered.sql` |
| Live Platform | [OmniFlow Physical Storage Architecture](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#architecture) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/02_indexing_and_performance/01_clustered_nonclustered.sql) |
