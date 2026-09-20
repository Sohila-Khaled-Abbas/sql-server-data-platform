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

> [!info] ⚙️ T-SQL Programming & ACID
> Know the operational roles of master, model, msdb, and tempdb; system databases are part of SQL Server administration and recovery planning.

## SQL Pattern

```sql
SELECT name, recovery_model_desc
FROM sys.databases;
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **System databases** enforce? |
| **Performance** | How does this affect variable scope, transaction isolation, or batch execution? |
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
FROM "video-notes/ch02"
WHERE file.path != this.file.path
SORT file.name ASC
LIMIT 5
```

## Links

| Resource | Link |
| :--- | :--- |
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17546) |
| Production Code | `src/01_storage_and_schema/01_filegroups_and_files.sql` |
| Live Platform | [OmniFlow SQL Engineering Showcase](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#sql-engineering) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/01_storage_and_schema/01_filegroups_and_files.sql) |
