---
title: "CH03_VID21 — Steps to Configure SQL Server Log Shipping"
aliases:
  - "CH03_VID21"
  - "Steps to Configure SQL Server Log Shipping"
chapter: "CH03 — Advanced Query Techniques and High Availability"
lesson: "VID21"
tags:
  - sql-server
  - dbre
  - data-engineering
  - advanced-queries-ha
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17574"
code_reference: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03_VID21 — Steps to Configure SQL Server Log Shipping

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH03_VID20 — Overview of Ship Transaction Log](vid20-overview-of-ship-transaction-log.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH03_VID22 — Log Shipping vs Mirroring](vid22-log-shipping-vs-mirroring.md)  
> 📌 **Chapter:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md) · **Official Lesson:** [MaharaTech 17574](https://maharatech.gov.eg/mod/hvp/view.php?id=17574)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Log shipping continuously backs up transaction logs on a primary, copies them, and restores them on a secondary. It remains useful for DR patterns and can be combined with replication.

## SQL Pattern

```sql
-- Conceptual sequence
-- BACKUP LOG -> COPY -> RESTORE WITH NORECOVERY/STANDBY
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17574)
- `src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md`
