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

> [!info] 🏗️ Storage & Physical Architecture
> Know recovery objectives first. Full, differential, and log backups solve different recovery and storage problems and require an appropriate recovery model.

## SQL Pattern

```sql
BACKUP DATABASE SalesDB
TO DISK = 'D:\Backup\SalesDB_full.bak'
WITH INIT, COMPRESSION;
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Backup Database Using Wizard** enforce? |
| **Performance** | How does this affect page allocation, filegroup isolation, or backup chain integrity? |
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
FROM "video-notes/ch01"
WHERE file.path != this.file.path
SORT file.name ASC
LIMIT 5
```

## Links

| Resource | Link |
| :--- | :--- |
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17531) |
| Production Code | `src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql` |
| Live Platform | [OmniFlow Physical Storage Architecture](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#architecture) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/06_reliability_and_dr/01_backup_and_maintenance_jobs.sql) |
