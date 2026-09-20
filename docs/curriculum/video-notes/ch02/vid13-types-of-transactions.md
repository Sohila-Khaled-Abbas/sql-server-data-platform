---
title: "CH02_VID13 — Types of Transactions"
aliases:
  - "CH02_VID13"
  - "Types of Transactions"
chapter: "CH02 — SQL Programming Essentials"
lesson: "VID13"
tags:
  - sql-server
  - dbre
  - data-engineering
  - sql-programming
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17549"
code_reference: "src/03_programmability_and_elt/03_stored_procedures_etl.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH02_VID13 — Types of Transactions

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH02_VID12 — Script & Batch](vid12-script-batch.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH02_VID14 — Demo on Transactions](vid14-demo-on-transactions.md)  
> 📌 **Chapter:** [CH02 — SQL Programming Essentials](../../chapters/ch02-readme.md) · **Official Lesson:** [MaharaTech 17549](https://maharatech.gov.eg/mod/hvp/view.php?id=17549)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Transactions provide atomicity and coordinate consistency, isolation, and durability. Learn COMMIT, ROLLBACK, isolation levels, and error handling together.

## SQL Pattern

```sql
BEGIN TRAN;
UPDATE dbo.Account SET Balance = Balance - 100 WHERE AccountID = 1;
UPDATE dbo.Account SET Balance = Balance + 100 WHERE AccountID = 2;
COMMIT;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17549)
- `src/03_programmability_and_elt/03_stored_procedures_etl.sql`
