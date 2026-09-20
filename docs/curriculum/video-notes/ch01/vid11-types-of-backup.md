---
title: "CH01_VID11 — Types of Backup"
aliases:
  - "CH01_VID11"
  - "Types of Backup"
chapter: "CH01 — Database Creation and Management"
lesson: "VID11"
tags:
  - sql-server
  - dbre
  - data-engineering
  - storage-and-schema
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17530"
code_reference: "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH01_VID11 — Types of Backup

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH01_VID10 — Demo on Index](vid10-demo-on-index.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH01_VID12 — Backup Database Using Wizard](vid12-backup-database-using-wizard.md)  
> 📌 **Chapter:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md) · **Official Lesson:** [MaharaTech 17530](https://maharatech.gov.eg/mod/hvp/view.php?id=17530)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Know recovery objectives first. Full, differential, and log backups solve different recovery and storage problems and require an appropriate recovery model.

## SQL Pattern

```sql
BACKUP DATABASE SalesDB
TO DISK = 'D:\Backup\SalesDB_full.bak'
WITH INIT, COMPRESSION;
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17530)
- `src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql`
