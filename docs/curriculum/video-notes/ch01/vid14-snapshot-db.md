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

> [!info] 🏗️ Storage & Physical Architecture
> A database snapshot is read-only and transactionally consistent at creation time; it is useful for point-in-time read access but does not replace backups.

## SQL Pattern

```sql
CREATE DATABASE SalesDB_Snapshot
ON (NAME = SalesDB_Data, FILENAME = 'D:\Snapshots\SalesDB.ss')
AS SNAPSHOT OF SalesDB;
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Snapshot DB** enforce? |
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
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17533) |
| Production Code | `src/06_reliability_and_dr/02_snapshot_lifecycle.sql` |
| Live Platform | [OmniFlow Physical Storage Architecture](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#architecture) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/06_reliability_and_dr/02_snapshot_lifecycle.sql) |
