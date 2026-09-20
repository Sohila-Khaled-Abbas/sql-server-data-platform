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

> Parameterized dynamic SQL improves safety and plan reuse compared with concatenating user input into a query string.

## SQL Pattern

```sql
DECLARE @sql nvarchar(max) =
    N'SELECT * FROM dbo.Customer WHERE City = @City;';
EXEC sys.sp_executesql @sql, N'@City nvarchar(100)', @City = N'Cairo';
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17584)
- `src/04_governance_and_audit/03_dynamic_sql_guardrails.sql`
