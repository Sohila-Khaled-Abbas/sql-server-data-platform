---
title: "CH01_VID15 — Demo on Snapshot"
aliases:
  - "CH01_VID15"
  - "Demo on Snapshot"
chapter: "CH01 — Database Creation and Management"
lesson: "VID15"
tags:
  - sql-server
  - dbre
  - data-engineering
  - storage-and-schema
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17534"
code_reference: "src/06_reliability_and_dr/02_snapshot_lifecycle.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH01_VID15 — Demo on Snapshot

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH01_VID14 — Snapshot DB](vid14-snapshot-db.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH01_VID16 — Assignment 01](vid16-assignment-01.md)  
> 📌 **Chapter:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md) · **Official Lesson:** [MaharaTech 17534](https://maharatech.gov.eg/mod/hvp/view.php?id=17534)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> A database snapshot is read-only and transactionally consistent at creation time; it is useful for point-in-time read access but does not replace backups.

## SQL Pattern

```sql
CREATE DATABASE SalesDB_Snapshot
ON (NAME = SalesDB_Data, FILENAME = 'D:\Snapshots\SalesDB.ss')
AS SNAPSHOT OF SalesDB;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17534)
- `src/06_reliability_and_dr/02_snapshot_lifecycle.sql`
