---
title: "CH02_VID11 — Types of Table"
aliases:
  - "CH02_VID11"
  - "Types of Table"
chapter: "CH02 — SQL Programming Essentials"
lesson: "VID11"
tags:
  - sql-server
  - dbre
  - data-engineering
  - sql-programming
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17547"
code_reference: "src/01_storage_and_schema/01_filegroups_and_files.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH02_VID11 — Types of Table

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH02_VID10 — System databases](vid10-system-databases.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH02_VID12 — Script & Batch](vid12-script-batch.md)  
> 📌 **Chapter:** [CH02 — SQL Programming Essentials](../../chapters/ch02-readme.md) · **Official Lesson:** [MaharaTech 17547](https://maharatech.gov.eg/mod/hvp/view.php?id=17547)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] ⚙️ T-SQL Programming & ACID
> Temporary tables, table variables, and permanent tables have different optimization, scope, tempdb, and lifecycle characteristics.

## SQL Pattern

```sql
DECLARE @T TABLE (ID int PRIMARY KEY, Name sysname);
CREATE TABLE #T (ID int, Name sysname);
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Types of Table** enforce? |
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
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17547) |
| Production Code | `src/01_storage_and_schema/01_filegroups_and_files.sql` |
| Live Platform | [OmniFlow SQL Engineering Showcase](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#sql-engineering) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/01_storage_and_schema/01_filegroups_and_files.sql) |
