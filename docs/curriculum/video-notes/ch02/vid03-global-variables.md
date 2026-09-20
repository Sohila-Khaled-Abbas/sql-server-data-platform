---
title: "CH02_VID03 — Global Variables"
aliases:
  - "CH02_VID03"
  - "Global Variables"
chapter: "CH02 — SQL Programming Essentials"
lesson: "VID03"
tags:
  - sql-server
  - dbre
  - data-engineering
  - sql-programming
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17539"
code_reference: "src/03_programmability_and_elt/03_stored_procedures_etl.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH02_VID03 — Global Variables

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH02_VID02 — Local Variables](vid02-local-variables.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH02_VID04 — Control of Flow_Part(1)](vid04-control-of-flow-part-1.md)  
> 📌 **Chapter:** [CH02 — SQL Programming Essentials](../../chapters/ch02-readme.md) · **Official Lesson:** [MaharaTech 17539](https://maharatech.gov.eg/mod/hvp/view.php?id=17539)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] ⚙️ T-SQL Programming & ACID
> Variables make T-SQL procedural. Track type, scope, initialization, and NULL behavior.

## SQL Pattern

```sql
DECLARE @TotalSales decimal(18,2);
SET @TotalSales = 0;
SELECT @TotalSales = SUM(Amount) FROM dbo.Sales;
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Global Variables** enforce? |
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
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17539) |
| Production Code | `src/03_programmability_and_elt/03_stored_procedures_etl.sql` |
| Live Platform | [OmniFlow SQL Engineering Showcase](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#sql-engineering) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/03_programmability_and_elt/03_stored_procedures_etl.sql) |
