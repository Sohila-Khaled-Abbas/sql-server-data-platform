---
title: "CH05_VID09 — Using Stored Procedures & Map dataset to report parameter"
aliases:
  - "CH05_VID09"
  - "Using Stored Procedures & Map dataset to report parameter"
chapter: "CH05 — Reporting and Data Warehousing"
lesson: "VID09"
tags:
  - sql-server
  - dbre
  - data-engineering
  - warehousing-and-reporting
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17618"
code_reference: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH05_VID09 — Using Stored Procedures & Map dataset to report parameter

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH05_VID08 — Join many tables using query designer & Add indicators](vid08-join-many-tables-using-query-designer-add-indicators.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH05_VID10 — Go to another report action](vid10-go-to-another-report-action.md)  
> 📌 **Chapter:** [CH05 — Reporting and Data Warehousing](../../chapters/ch05-readme.md) · **Official Lesson:** [MaharaTech 17618](https://maharatech.gov.eg/mod/hvp/view.php?id=17618)

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

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17618)
- `src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl`
