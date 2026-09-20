---
title: "CH04_VID05 — Stored Procedure with Parameters and Return Values"
aliases:
  - "CH04_VID05"
  - "Stored Procedure with Parameters and Return Values"
chapter: "CH04 — Procedures, Triggers, and SQL Automation"
lesson: "VID05"
tags:
  - sql-server
  - dbre
  - data-engineering
  - procedures-triggers-automation
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17582"
code_reference: "src/03_programmability_and_elt/03_stored_procedures_etl.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH04_VID05 — Stored Procedure with Parameters and Return Values

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH04_VID04 — DML Statements in Stored Procedures](vid04-dml-statements-in-stored-procedures.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH04_VID06 — Functions vs Stored Procedures](vid06-functions-vs-stored-procedures.md)  
> 📌 **Chapter:** [CH04 — Procedures, Triggers, and SQL Automation](../../chapters/ch04-readme.md) · **Official Lesson:** [MaharaTech 17582](https://maharatech.gov.eg/mod/hvp/view.php?id=17582)

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

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17582)
- `src/03_programmability_and_elt/03_stored_procedures_etl.sql`
