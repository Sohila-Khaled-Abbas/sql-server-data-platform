---
title: "CH02_VID05 — Control of Flow_Part(2)"
aliases:
  - "CH02_VID05"
  - "Control of Flow_Part(2)"
chapter: "CH02 — SQL Programming Essentials"
lesson: "VID05"
tags:
  - sql-server
  - dbre
  - data-engineering
  - sql-programming
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17541"
code_reference: "src/03_programmability_and_elt/03_stored_procedures_etl.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH02_VID05 — Control of Flow_Part(2)

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH02_VID04 — Control of Flow_Part(1)](vid04-control-of-flow-part-1.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH02_VID06 — Functions](vid06-functions.md)  
> 📌 **Chapter:** [CH02 — SQL Programming Essentials](../../chapters/ch02-readme.md) · **Official Lesson:** [MaharaTech 17541](https://maharatech.gov.eg/mod/hvp/view.php?id=17541)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] ⚙️ T-SQL Programming & ACID
> Use procedural control flow sparingly. Prefer set-based operations for data manipulation unless row-by-row logic is genuinely required.

## SQL Pattern

```sql
IF @Rows > 0
    PRINT 'Rows exist';
ELSE
    PRINT 'No rows';

WHILE @Counter <= 10
BEGIN
    SET @Counter += 1;
END;
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Control of Flow_Part(2)** enforce? |
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
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17541) |
| Production Code | `src/03_programmability_and_elt/03_stored_procedures_etl.sql` |
| Live Platform | [OmniFlow SQL Engineering Showcase](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#sql-engineering) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/03_programmability_and_elt/03_stored_procedures_etl.sql) |
