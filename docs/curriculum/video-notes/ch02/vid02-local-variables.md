---
title: "CH02_VID02 — Local Variables"
aliases:
  - "CH02_VID02"
  - "Local Variables"
chapter: "CH02 — SQL Programming Essentials"
lesson: "VID02"
tags:
  - sql-server
  - dbre
  - data-engineering
  - sql-programming
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17538"
code_reference: "src/03_programmability_and_elt/03_stored_procedures_etl.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH02_VID02 — Local Variables

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH02_VID01 — Variables](vid01-variables.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH02_VID03 — Global Variables](vid03-global-variables.md)  
> 📌 **Chapter:** [CH02 — SQL Programming Essentials](../../chapters/ch02-readme.md) · **Official Lesson:** [MaharaTech 17538](https://maharatech.gov.eg/mod/hvp/view.php?id=17538)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Variables make T-SQL procedural. Track type, scope, initialization, and NULL behavior.

## SQL Pattern

```sql
DECLARE @TotalSales decimal(18,2);
SET @TotalSales = 0;
SELECT @TotalSales = SUM(Amount) FROM dbo.Sales;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17538)
- `src/03_programmability_and_elt/03_stored_procedures_etl.sql`
