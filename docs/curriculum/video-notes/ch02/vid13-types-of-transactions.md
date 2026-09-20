---
title: "CH02_VID13 — Types of Transactions"
aliases:
  - "CH02_VID13"
  - "Types of Transactions"
chapter: "CH02 — SQL Programming Essentials"
lesson: "VID13"
tags:
  - sql-server
  - dbre
  - data-engineering
  - sql-programming
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17549"
code_reference: "src/03_programmability_and_elt/03_stored_procedures_etl.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH02_VID13 — Types of Transactions

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH02_VID12 — Script & Batch](vid12-script-batch.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH02_VID14 — Demo on Transactions](vid14-demo-on-transactions.md)  
> 📌 **Chapter:** [CH02 — SQL Programming Essentials](../../chapters/ch02-readme.md) · **Official Lesson:** [MaharaTech 17549](https://maharatech.gov.eg/mod/hvp/view.php?id=17549)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] ⚙️ T-SQL Programming & ACID
> Transactions provide atomicity and coordinate consistency, isolation, and durability. Learn COMMIT, ROLLBACK, isolation levels, and error handling together.

## SQL Pattern

```sql
BEGIN TRAN;
UPDATE dbo.Account SET Balance = Balance - 100 WHERE AccountID = 1;
UPDATE dbo.Account SET Balance = Balance + 100 WHERE AccountID = 2;
COMMIT;
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Types of Transactions** enforce? |
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
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17549) |
| Production Code | `src/03_programmability_and_elt/03_stored_procedures_etl.sql` |
| Live Platform | [OmniFlow SQL Engineering Showcase](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#sql-engineering) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/03_programmability_and_elt/03_stored_procedures_etl.sql) |
