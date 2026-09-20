---
title: "CH02_VID04 — Control of Flow_Part(1)"
aliases:
  - "CH02_VID04"
  - "Control of Flow_Part(1)"
chapter: "CH02 — SQL Programming Essentials"
lesson: "VID04"
tags:
  - sql-server
  - dbre
  - data-engineering
  - sql-programming
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17540"
code_reference: "src/03_programmability_and_elt/03_stored_procedures_etl.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH02_VID04 — Control of Flow_Part(1)

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH02_VID03 — Global Variables](vid03-global-variables.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH02_VID05 — Control of Flow_Part(2)](vid05-control-of-flow-part-2.md)  
> 📌 **Chapter:** [CH02 — SQL Programming Essentials](../../chapters/ch02-readme.md) · **Official Lesson:** [MaharaTech 17540](https://maharatech.gov.eg/mod/hvp/view.php?id=17540)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Use procedural control flow sparingly. Prefer set-based operations for data manipulation unless row-by-row logic is genuinely required.

## SQL Pattern

```sql
IF @Rows > 0
    PRINT 'Rows exist';
ELSE
    PRINT 'No rows';

WHILE @Counter <= 10
BEGIN
    SET @Counter += 1;
END;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17540)
- `src/03_programmability_and_elt/03_stored_procedures_etl.sql`
