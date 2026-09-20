---
title: "CH01_VID14 — Snapshot DB"
aliases:
  - "CH01_VID14"
  - "Snapshot DB"
chapter: "CH01 — Database Creation and Management"
lesson: "VID14"
tags:
  - sql-server
  - dbre
  - data-engineering
  - storage-and-schema
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17533"
code_reference: "src/06_reliability_and_dr/02_snapshot_lifecycle.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH01_VID14 — Snapshot DB

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH01_VID13 — Backup & SQL server agent jobs](vid13-backup-sql-server-agent-jobs.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH01_VID15 — Demo on Snapshot](vid15-demo-on-snapshot.md)  
> 📌 **Chapter:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md) · **Official Lesson:** [MaharaTech 17533](https://maharatech.gov.eg/mod/hvp/view.php?id=17533)

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

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17533)
- `src/06_reliability_and_dr/02_snapshot_lifecycle.sql`
