---
title: "CH04_VID08 — Stored Procedures and Triggers Types"
aliases:
  - "CH04_VID08"
  - "Stored Procedures and Triggers Types"
chapter: "CH04 — Procedures, Triggers, and SQL Automation"
lesson: "VID08"
tags:
  - sql-server
  - dbre
  - data-engineering
  - procedures-triggers-automation
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17585"
code_reference: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH04_VID08 — Stored Procedures and Triggers Types

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH04_VID07 — Dynamic Query in Stored Procedure](vid07-dynamic-query-in-stored-procedure.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH04_VID09 — Creating a Table Level Trigger](vid09-creating-a-table-level-trigger.md)  
> 📌 **Chapter:** [CH04 — Procedures, Triggers, and SQL Automation](../../chapters/ch04-readme.md) · **Official Lesson:** [MaharaTech 17585](https://maharatech.gov.eg/mod/hvp/view.php?id=17585)

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

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17585)
- `src/04_governance_and_audit/01_audit_change_capture_triggers.sql`
