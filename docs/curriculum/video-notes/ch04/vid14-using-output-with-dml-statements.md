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

> OUTPUT can expose affected rows from INSERT/UPDATE/DELETE/MERGE and is useful for auditing, capturing generated keys, and moving affected rows.

## SQL Pattern

```sql
DELETE FROM dbo.Customer
OUTPUT deleted.CustomerID, deleted.Email
INTO dbo.CustomerArchive(CustomerID, Email)
WHERE CustomerID = 10;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17591)
- `src/03_programmability_and_elt/03_stored_procedures_etl.sql`
