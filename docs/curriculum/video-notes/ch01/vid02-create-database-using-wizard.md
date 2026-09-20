---
title: "CH01_VID02 — Create Database Using Wizard"
aliases:
  - "CH01_VID02"
  - "Create Database Using Wizard"
chapter: "CH01 — Database Creation and Management"
lesson: "VID02"
tags:
  - sql-server
  - dbre
  - data-engineering
  - storage-and-schema
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17521"
code_reference: "src/01_storage_and_schema/ch01_vid02_ititest_case_study_schema.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH01_VID02 — Create Database Using Wizard

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH01_VID01 — Create Database and Filegroups](vid01-create-database-and-filegroups.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH01_VID03 — Create Database Using Code](vid03-create-database-using-code.md)  
> 📌 **Chapter:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md) · **Official Lesson:** [MaharaTech 17521](https://maharatech.gov.eg/mod/hvp/view.php?id=17521)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> Understand the distinction between logical file names, physical files, filegroups, and the transaction log.

## SQL Pattern

```sql
CREATE DATABASE DemoDB
ON PRIMARY (NAME = N'DemoDB_Data', FILENAME = N'C:\SQLData\DemoDB.mdf', SIZE = 50MB, FILEGROWTH = 10MB)
LOG ON (NAME = N'DemoDB_Log', FILENAME = N'C:\SQLData\DemoDB.ldf', SIZE = 25MB, FILEGROWTH = 10MB);
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17521)
- `src/01_storage_and_schema/ch01_vid02_ititest_case_study_schema.sql`
