---
title: "CH05_VID18 — Difference between OLAP and OLTP"
aliases:
  - "CH05_VID18"
  - "Difference between OLAP and OLTP"
chapter: "CH05 — Reporting and Data Warehousing"
lesson: "VID18"
tags:
  - sql-server
  - dbre
  - data-engineering
  - warehousing-and-reporting
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17627"
code_reference: "src/07_warehousing_and_reporting/01_oltp_source_schema.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH05_VID18 — Difference between OLAP and OLTP

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH05_VID17 — Data Warehousing](vid17-data-warehousing.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH05_VID19 — Dimensional Modeling](vid19-dimensional-modeling.md)  
> 📌 **Chapter:** [CH05 — Reporting and Data Warehousing](../../chapters/ch05-readme.md) · **Official Lesson:** [MaharaTech 17627](https://maharatech.gov.eg/mod/hvp/view.php?id=17627)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> OLTP optimizes operational correctness and concurrency; OLAP optimizes analytical access patterns. The same database design does not automatically serve both workloads well.

## SQL Pattern

```sql
-- OLTP focus
INSERT/UPDATE/DELETE, concurrency, integrity

-- OLAP focus
large scans, aggregates, historical analysis
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17627)
- `src/07_warehousing_and_reporting/01_oltp_source_schema.sql`
