---
title: "CH03_VID15 — Table Valued Parameters"
aliases:
  - "CH03_VID15"
  - "Table Valued Parameters"
chapter: "CH03 — Advanced Query Techniques and High Availability"
lesson: "VID15"
tags:
  - sql-server
  - dbre
  - data-engineering
  - advanced-queries-ha
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17567"
code_reference: "src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03_VID15 — Table Valued Parameters

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH03_VID14 — Sequence](vid14-sequence.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH03_VID16 — High Availability](vid16-high-availability.md)  
> 📌 **Chapter:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md) · **Official Lesson:** [MaharaTech 17567](https://maharatech.gov.eg/mod/hvp/view.php?id=17567)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Table-valued parameters are a clean way to send sets of rows into routines without string concatenation.

## SQL Pattern

```sql
CREATE TYPE dbo.OrderLineType AS TABLE(
    ProductID int,
    Qty int
);
-- pass a variable of this type to a stored procedure
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17567)
- `src/03_programmability_and_elt/01_tvps_and_bulk_ingestion.sql`
