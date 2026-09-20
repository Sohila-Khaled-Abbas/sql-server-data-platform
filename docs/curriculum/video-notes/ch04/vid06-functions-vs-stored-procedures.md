---
title: "CH04_VID06 — Functions vs Stored Procedures"
aliases:
  - "CH04_VID06"
  - "Functions vs Stored Procedures"
chapter: "CH04 — Procedures, Triggers, and SQL Automation"
lesson: "VID06"
tags:
  - sql-server
  - dbre
  - data-engineering
  - procedures-triggers-automation
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17583"
code_reference: "src/03_programmability_and_elt/05_scalar_vs_table_functions.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH04_VID06 — Functions vs Stored Procedures

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH04_VID05 — Stored Procedure with Parameters and Return Values](vid05-stored-procedure-with-parameters-and-return-values.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH04_VID07 — Dynamic Query in Stored Procedure](vid07-dynamic-query-in-stored-procedure.md)  
> 📌 **Chapter:** [CH04 — Procedures, Triggers, and SQL Automation](../../chapters/ch04-readme.md) · **Official Lesson:** [MaharaTech 17583](https://maharatech.gov.eg/mod/hvp/view.php?id=17583)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Stored procedures package database-side operations, can accept parameters, and are useful for reusable application/data-access workflows.

## SQL Pattern

```sql
CREATE OR ALTER PROCEDURE dbo.usp_GetCustomerSales
    @CustomerID int
AS
BEGIN
    SET NOCOUNT ON;
    SELECT CustomerID, SUM(Amount) AS Sales
    FROM dbo.Sales
    WHERE CustomerID = @CustomerID
    GROUP BY CustomerID;
END;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17583)
- `src/03_programmability_and_elt/05_scalar_vs_table_functions.sql`
