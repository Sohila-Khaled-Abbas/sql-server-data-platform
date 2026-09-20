---
title: "CH05_VID17 — Data Warehousing"
aliases:
  - "CH05_VID17"
  - "Data Warehousing"
chapter: "CH05 — Reporting and Data Warehousing"
lesson: "VID17"
tags:
  - sql-server
  - dbre
  - data-engineering
  - warehousing-and-reporting
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17626"
code_reference: "src/07_warehousing_and_reporting/02_dimensional_star_schema.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH05_VID17 — Data Warehousing

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH05_VID16 — Link parameters to your custom report](vid16-link-parameters-to-your-custom-report.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH05_VID18 — Difference between OLAP and OLTP](vid18-difference-between-olap-and-oltp.md)  
> 📌 **Chapter:** [CH05 — Reporting and Data Warehousing](../../chapters/ch05-readme.md) · **Official Lesson:** [MaharaTech 17626](https://maharatech.gov.eg/mod/hvp/view.php?id=17626)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> A data warehouse is designed for analytical workloads, historical context, conformed dimensions, and predictable reporting—not transactional OLTP behavior.

## SQL Pattern

```sql
-- Typical warehouse flow
Source -> Staging -> Transform -> Dimension/Fact -> BI
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17626)
- `src/07_warehousing_and_reporting/02_dimensional_star_schema.sql`
