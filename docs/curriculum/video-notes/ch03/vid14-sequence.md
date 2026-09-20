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

> Sequences generate numbers independently of a table. Learn their caching, gaps, concurrency, and when identity columns are simpler.

## SQL Pattern

```sql
CREATE SEQUENCE dbo.OrderNumber AS bigint START WITH 1 INCREMENT BY 1;
SELECT NEXT VALUE FOR dbo.OrderNumber;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17566)
- `src/01_storage_and_schema/02_custom_types_and_rules.sql`
