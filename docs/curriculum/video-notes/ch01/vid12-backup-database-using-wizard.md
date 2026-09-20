---
title: "CH01_VID12 — Backup Database Using Wizard"
aliases:
  - "CH01_VID12"
  - "Backup Database Using Wizard"
chapter: "CH01 — Database Creation and Management"
lesson: "VID12"
tags:
  - sql-server
  - dbre
  - data-engineering
  - storage-and-schema
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17531"
code_reference: "src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH01_VID12 — Backup Database Using Wizard

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH01_VID11 — Types of Backup](vid11-types-of-backup.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH01_VID13 — Backup & SQL server agent jobs](vid13-backup-sql-server-agent-jobs.md)  
> 📌 **Chapter:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md) · **Official Lesson:** [MaharaTech 17531](https://maharatech.gov.eg/mod/hvp/view.php?id=17531)

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

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17531)
- `src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql`
