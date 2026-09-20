---
title: "CH04_VID12 — Track User Activity Using Audit Table"
aliases:
  - "CH04_VID12"
  - "Track User Activity Using Audit Table"
chapter: "CH04 — Procedures, Triggers, and SQL Automation"
lesson: "VID12"
tags:
  - sql-server
  - dbre
  - data-engineering
  - procedures-triggers-automation
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17589"
code_reference: "src/04_governance_and_audit/01_audit_change_capture_triggers.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH04_VID12 — Track User Activity Using Audit Table

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH04_VID11 — Using Inserted and Deleted Tables Within Triggers](vid11-using-inserted-and-deleted-tables-within-triggers.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH04_VID13 — Creating Server-Level and Database-Level Triggers](vid13-creating-server-level-and-database-level-triggers.md)  
> 📌 **Chapter:** [CH04 — Procedures, Triggers, and SQL Automation](../../chapters/ch04-readme.md) · **Official Lesson:** [MaharaTech 17589](https://maharatech.gov.eg/mod/hvp/view.php?id=17589)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] 🤖 Programmability & Automation
> Use this lesson to understand the concept, then reproduce it from scratch without copying the instructor step-for-step.

## SQL Pattern

```sql
-- Add the exact demo code you write while watching the lesson.
SELECT 1;
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Track User Activity Using Audit Table** enforce? |
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
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17589) |
| Production Code | `src/04_governance_and_audit/01_audit_change_capture_triggers.sql` |
| Live Platform | [OmniFlow Technical Deep Dive & Governance](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#deep-dive) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/04_governance_and_audit/01_audit_change_capture_triggers.sql) |
