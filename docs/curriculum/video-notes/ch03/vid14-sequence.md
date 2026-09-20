---
title: "CH03_VID14 — Sequence"
aliases:
  - "CH03_VID14"
  - "Sequence"
chapter: "CH03 — Advanced Query Techniques and High Availability"
lesson: "VID14"
tags:
  - sql-server
  - dbre
  - data-engineering
  - advanced-queries-ha
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17566"
code_reference: "src/01_storage_and_schema/02_custom_types_and_rules.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03_VID14 — Sequence

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH03_VID13 — Offset and Fetch keyword](vid13-offset-and-fetch-keyword.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH03_VID15 — Table Valued Parameters](vid15-table-valued-parameters.md)  
> 📌 **Chapter:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md) · **Official Lesson:** [MaharaTech 17566](https://maharatech.gov.eg/mod/hvp/view.php?id=17566)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] 🔄 Views, XML & High Availability
> Sequences generate numbers independently of a table. Learn their caching, gaps, concurrency, and when identity columns are simpler.

## SQL Pattern

```sql
CREATE SEQUENCE dbo.OrderNumber AS bigint START WITH 1 INCREMENT BY 1;
SELECT NEXT VALUE FOR dbo.OrderNumber;
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Sequence** enforce? |
| **Performance** | How does this affect query abstraction, data partitioning, or failover topology? |
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
FROM "video-notes/ch03"
WHERE file.path != this.file.path
SORT file.name ASC
LIMIT 5
```

## Links

| Resource | Link |
| :--- | :--- |
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17566) |
| Production Code | `src/01_storage_and_schema/02_custom_types_and_rules.sql` |
| Live Platform | [OmniFlow High-Throughput Data Flow](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#data-flow) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/01_storage_and_schema/02_custom_types_and_rules.sql) |
