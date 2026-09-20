---
title: "CH04_VID13 — Creating Server-Level and Database-Level Triggers"
aliases:
  - "CH04_VID13"
  - "Creating Server-Level and Database-Level Triggers"
chapter: "CH04 — Procedures, Triggers, and SQL Automation"
lesson: "VID13"
tags:
  - sql-server
  - dbre
  - data-engineering
  - procedures-triggers-automation
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17590"
code_reference: "src/04_governance_and_audit/02_ddl_and_server_triggers.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH04_VID13 — Creating Server-Level and Database-Level Triggers

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH04_VID12 — Track User Activity Using Audit Table](vid12-track-user-activity-using-audit-table.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH04_VID14 — Using OUTPUT with DML statements](vid14-using-output-with-dml-statements.md)  
> 📌 **Chapter:** [CH04 — Procedures, Triggers, and SQL Automation](../../chapters/ch04-readme.md) · **Official Lesson:** [MaharaTech 17590](https://maharatech.gov.eg/mod/hvp/view.php?id=17590)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Triggers execute automatically in response to DML/DDL events. They are powerful but can create hidden side effects and debugging complexity.

## SQL Pattern

```sql
CREATE TRIGGER dbo.trg_Customer_Audit
ON dbo.Customer
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    -- audit logic
END;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17590)
- `src/04_governance_and_audit/02_ddl_and_server_triggers.sql`
