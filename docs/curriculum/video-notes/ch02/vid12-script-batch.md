---
title: "CH02_VID12 — Script & Batch"
aliases:
  - "CH02_VID12"
  - "Script & Batch"
chapter: "CH02 — SQL Programming Essentials"
lesson: "VID12"
tags:
  - sql-server
  - dbre
  - data-engineering
  - sql-programming
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17548"
code_reference: "src/03_programmability_and_elt/03_stored_procedures_etl.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH02_VID12 — Script & Batch

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH02_VID11 — Types of Table](vid11-types-of-table.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH02_VID13 — Types of Transactions](vid13-types-of-transactions.md)  
> 📌 **Chapter:** [CH02 — SQL Programming Essentials](../../chapters/ch02-readme.md) · **Official Lesson:** [MaharaTech 17548](https://maharatech.gov.eg/mod/hvp/view.php?id=17548)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> A batch is a group of T-SQL statements submitted for compilation/execution together. GO is a client-side batch separator, not T-SQL itself.

## SQL Pattern

```sql
DECLARE @x int = 1;
SELECT @x;
GO
SELECT GETDATE();
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17548)
- `src/03_programmability_and_elt/03_stored_procedures_etl.sql`
