---
title: "CH02_VID09 — Multi-Statement Table-Valued Functions"
aliases:
  - "CH02_VID09"
  - "Multi-Statement Table-Valued Functions"
chapter: "CH02 — SQL Programming Essentials"
lesson: "VID09"
tags:
  - sql-server
  - dbre
  - data-engineering
  - sql-programming
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17545"
code_reference: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH02_VID09 — Multi-Statement Table-Valued Functions

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH02_VID08 — Inline Statement Table-Valued Functions](vid08-inline-statement-table-valued-functions.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH02_VID10 — System databases](vid10-system-databases.md)  
> 📌 **Chapter:** [CH02 — SQL Programming Essentials](../../chapters/ch02-readme.md) · **Official Lesson:** [MaharaTech 17545](https://maharatech.gov.eg/mod/hvp/view.php?id=17545)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Functions return a value or table and are generally side-effect constrained compared with procedures.

## SQL Pattern

```sql
CREATE FUNCTION dbo.fn_AddTax(@Amount decimal(18,2))
RETURNS decimal(18,2)
AS
BEGIN
    RETURN @Amount * 1.14;
END;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17545)
- `src/03_programmability_and_elt/05_scalar_vs_table_functions.sql`
