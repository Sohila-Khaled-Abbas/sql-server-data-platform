---
title: "CH01_VID03 — Create Database Using Code"
aliases:
  - "CH01_VID03"
  - "Create Database Using Code"
chapter: "CH01 — Database Creation and Management"
lesson: "VID03"
tags:
  - sql-server
  - dbre
  - data-engineering
  - storage-and-schema
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17522"
code_reference: "src/01_storage_and_schema/ch01_vid03_create_database_code.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH01_VID03 — Create Database Using Code

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH01_VID02 — Create Database Using Wizard](vid02-create-database-using-wizard.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH01_VID04 — Database Integrity](vid04-database-integrity.md)  
> 📌 **Chapter:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md) · **Official Lesson:** [MaharaTech 17522](https://maharatech.gov.eg/mod/hvp/view.php?id=17522)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] 🏗️ Storage & Physical Architecture
> Understand the distinction between logical file names, physical files, filegroups, and the transaction log.

## SQL Pattern

```sql
CREATE DATABASE DemoDB
ON PRIMARY (NAME = N'DemoDB_Data', FILENAME = N'C:\SQLData\DemoDB.mdf', SIZE = 50MB, FILEGROWTH = 10MB)
LOG ON (NAME = N'DemoDB_Log', FILENAME = N'C:\SQLData\DemoDB.ldf', SIZE = 25MB, FILEGROWTH = 10MB);
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Create Database Using Code** enforce? |
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
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17522) |
| Production Code | `src/01_storage_and_schema/ch01_vid03_create_database_code.sql` |
| Live Platform | [OmniFlow Physical Storage Architecture](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#architecture) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/01_storage_and_schema/ch01_vid03_create_database_code.sql) |
