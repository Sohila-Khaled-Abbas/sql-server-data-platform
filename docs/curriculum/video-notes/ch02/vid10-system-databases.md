---
title: "CH02_VID10 — System databases"
aliases:
  - "CH02_VID10"
  - "System databases"
chapter: "CH02 — SQL Programming Essentials"
lesson: "VID10"
tags:
  - sql-server
  - dbre
  - data-engineering
  - sql-programming
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17546"
code_reference: "src/01_storage_and_schema/01_filegroups_and_files.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH02_VID10 — System databases

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH02_VID09 — Multi-Statement Table-Valued Functions](vid09-multi-statement-table-valued-functions.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH02_VID11 — Types of Table](vid11-types-of-table.md)  
> 📌 **Chapter:** [CH02 — SQL Programming Essentials](../../chapters/ch02-readme.md) · **Official Lesson:** [MaharaTech 17546](https://maharatech.gov.eg/mod/hvp/view.php?id=17546)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Know the operational roles of master, model, msdb, and tempdb; system databases are part of SQL Server administration and recovery planning.

## SQL Pattern

```sql
SELECT name, recovery_model_desc
FROM sys.databases;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17546)
- `src/01_storage_and_schema/01_filegroups_and_files.sql`
