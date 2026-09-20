---
title: "CH03_VID18 — DB Mirroring"
aliases:
  - "CH03_VID18"
  - "DB Mirroring"
chapter: "CH03 — Advanced Query Techniques and High Availability"
lesson: "VID18"
tags:
  - sql-server
  - dbre
  - data-engineering
  - advanced-queries-ha
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17571"
code_reference: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03_VID18 — DB Mirroring

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH03_VID17 — Set Up Instances](vid17-set-up-instances.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH03_VID19 — Demo Database Mirroring](vid19-demo-database-mirroring.md)  
> 📌 **Chapter:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md) · **Official Lesson:** [MaharaTech 17571](https://maharatech.gov.eg/mod/hvp/view.php?id=17571)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] 🔄 Views, XML & High Availability
> Database mirroring is a legacy SQL Server HA technology. Microsoft documents it as deprecated and recommends Always On availability groups for new high-availability development.

## SQL Pattern

```sql
-- Legacy concept
-- Principal <-> Mirror (+ optional Witness)
-- Full recovery model
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **DB Mirroring** enforce? |
| **Performance** | How does this affect query abstraction, data partitioning, or failover topology? |
| **Trade-offs** | When is this the wrong tool? What's the alternative? |

## My Notes

> [!note] Observations
> <!-- What did you notice while reproducing this? -->

> [!warning] Gotchas
> <!-- Edge cases, silent failures, or unintuitive behavior -->

> [!tip] Production Tip
> <!-- How would you apply this in a real data platform? -->

---

## Related Lessons

```dataview
LIST
FROM "video-notes/ch03"
WHERE file.path != this.file.path
SORT file.name ASC
LIMIT 5
```

## Links

| Resource | Link |
| :--- | :--- |
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17571) |
| Production Code | `src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md` |
| Live Platform | [OmniFlow High-Throughput Data Flow](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#data-flow) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md) |
