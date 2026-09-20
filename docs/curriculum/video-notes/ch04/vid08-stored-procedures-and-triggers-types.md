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

> [!info] 🤖 Programmability & Automation
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

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Stored Procedures and Triggers Types** enforce? |
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
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17585) |
| Production Code | `src/04_governance_and_audit/01_audit_change_capture_triggers.sql` |
| Live Platform | [OmniFlow Technical Deep Dive & Governance](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#deep-dive) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/04_governance_and_audit/01_audit_change_capture_triggers.sql) |
