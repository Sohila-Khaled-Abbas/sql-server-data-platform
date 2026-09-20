---
title: "CH04_VID09 — Creating a Table Level Trigger"
aliases:
  - "CH04_VID09"
  - "Creating a Table Level Trigger"
chapter: "CH04 — Procedures, Triggers, and SQL Automation"
lesson: "VID09"
tags:
  - sql-server
  - dbre
  - data-engineering
  - procedures-triggers-automation
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17586"
code_reference: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH04_VID09 — Creating a Table Level Trigger

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH04_VID08 — Stored Procedures and Triggers Types](vid08-stored-procedures-and-triggers-types.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH04_VID10 — Triggers Features](vid10-triggers-features.md)  
> 📌 **Chapter:** [CH04 — Procedures, Triggers, and SQL Automation](../../chapters/ch04-readme.md) · **Official Lesson:** [MaharaTech 17586](https://maharatech.gov.eg/mod/hvp/view.php?id=17586)

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

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17586)
- `src/04_governance_and_audit/01_audit_change_capture_triggers.sql`
