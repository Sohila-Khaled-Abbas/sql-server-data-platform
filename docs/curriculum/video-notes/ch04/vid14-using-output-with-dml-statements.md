---
title: "CH04_VID14 — Using OUTPUT with DML statements"
aliases:
  - "CH04_VID14"
  - "Using OUTPUT with DML statements"
chapter: "CH04 — Procedures, Triggers, and SQL Automation"
lesson: "VID14"
tags:
  - sql-server
  - dbre
  - data-engineering
  - procedures-triggers-automation
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17591"
code_reference: "src/03_programmability_and_elt/03_stored_procedures_etl.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH04_VID14 — Using OUTPUT with DML statements

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH04_VID13 — Creating Server-Level and Database-Level Triggers](vid13-creating-server-level-and-database-level-triggers.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH04_VID15 — Cursors](vid15-cursors.md)  
> 📌 **Chapter:** [CH04 — Procedures, Triggers, and SQL Automation](../../chapters/ch04-readme.md) · **Official Lesson:** [MaharaTech 17591](https://maharatech.gov.eg/mod/hvp/view.php?id=17591)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] 🤖 Programmability & Automation
> OUTPUT can expose affected rows from INSERT/UPDATE/DELETE/MERGE and is useful for auditing, capturing generated keys, and moving affected rows.

## SQL Pattern

```sql
DELETE FROM dbo.Customer
OUTPUT deleted.CustomerID, deleted.Email
INTO dbo.CustomerArchive(CustomerID, Email)
WHERE CustomerID = 10;
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Using OUTPUT with DML statements** enforce? |
| **Performance** | How does this affect procedural encapsulation, audit trail integrity, or CLR safety? |
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
FROM "video-notes/ch04"
WHERE file.path != this.file.path
SORT file.name ASC
LIMIT 5
```

## Links

| Resource | Link |
| :--- | :--- |
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17591) |
| Production Code | `src/03_programmability_and_elt/03_stored_procedures_etl.sql` |
| Live Platform | [OmniFlow Technical Deep Dive & Governance](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#deep-dive) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/03_programmability_and_elt/03_stored_procedures_etl.sql) |
