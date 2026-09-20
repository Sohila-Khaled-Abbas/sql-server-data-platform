---
title: "CH03_VID19 — Demo Database Mirroring"
aliases:
  - "CH03_VID19"
  - "Demo Database Mirroring"
chapter: "CH03 — Advanced Query Techniques and High Availability"
lesson: "VID19"
tags:
  - sql-server
  - dbre
  - data-engineering
  - advanced-queries-ha
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17572"
code_reference: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03_VID19 — Demo Database Mirroring

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH03_VID18 — DB Mirroring](vid18-db-mirroring.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH03_VID20 — Overview of Ship Transaction Log](vid20-overview-of-ship-transaction-log.md)  
> 📌 **Chapter:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md) · **Official Lesson:** [MaharaTech 17572](https://maharatech.gov.eg/mod/hvp/view.php?id=17572)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Database mirroring is a legacy SQL Server HA technology. Microsoft documents it as deprecated and recommends Always On availability groups for new high-availability development.

## SQL Pattern

```sql
-- Legacy concept
-- Principal <-> Mirror (+ optional Witness)
-- Full recovery model
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17572)
- `src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md`
