---
title: "CH04_VID07 — Dynamic Query in Stored Procedure"
aliases:
  - "CH04_VID07"
  - "Dynamic Query in Stored Procedure"
chapter: "CH04 — Procedures, Triggers, and SQL Automation"
lesson: "VID07"
tags:
  - sql-server
  - dbre
  - data-engineering
  - procedures-triggers-automation
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17584"
code_reference: "src/04_governance_and_audit/03_dynamic_sql_guardrails.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH04_VID07 — Dynamic Query in Stored Procedure

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH04_VID06 — Functions vs Stored Procedures](vid06-functions-vs-stored-procedures.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH04_VID08 — Stored Procedures and Triggers Types](vid08-stored-procedures-and-triggers-types.md)  
> 📌 **Chapter:** [CH04 — Procedures, Triggers, and SQL Automation](../../chapters/ch04-readme.md) · **Official Lesson:** [MaharaTech 17584](https://maharatech.gov.eg/mod/hvp/view.php?id=17584)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] 🤖 Programmability & Automation
> Parameterized dynamic SQL improves safety and plan reuse compared with concatenating user input into a query string.

## SQL Pattern

```sql
DECLARE @sql nvarchar(max) =
    N'SELECT * FROM dbo.Customer WHERE City = @City;';
EXEC sys.sp_executesql @sql, N'@City nvarchar(100)', @City = N'Cairo';
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Dynamic Query in Stored Procedure** enforce? |
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
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17584) |
| Production Code | `src/04_governance_and_audit/03_dynamic_sql_guardrails.sql` |
| Live Platform | [OmniFlow Technical Deep Dive & Governance](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#deep-dive) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/04_governance_and_audit/03_dynamic_sql_guardrails.sql) |
