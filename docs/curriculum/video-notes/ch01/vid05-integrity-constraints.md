---
title: "CH01_VID05 — Integrity constraints"
aliases:
  - "CH01_VID05"
  - "Integrity constraints"
chapter: "CH01 — Database Creation and Management"
lesson: "VID05"
tags:
  - sql-server
  - dbre
  - data-engineering
  - storage-and-schema
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17524"
code_reference: "src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH01_VID05 — Integrity constraints

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH01_VID04 — Database Integrity](vid04-database-integrity.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH01_VID06 — Constraints, Rules, and Default Values](vid06-constraints-rules-and-default-values.md)  
> 📌 **Chapter:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md) · **Official Lesson:** [MaharaTech 17524](https://maharatech.gov.eg/mod/hvp/view.php?id=17524)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] 🏗️ Storage & Physical Architecture
> Prefer declarative constraints for invariants that must always hold. Put business rules in the database when they are truly universal and enforceable there.

## SQL Pattern

```sql
CREATE TABLE dbo.Customer (
    CustomerID int PRIMARY KEY,
    Email varchar(255) NOT NULL UNIQUE,
    Age int CHECK (Age >= 0)
);
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Integrity constraints** enforce? |
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
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17524) |
| Production Code | `src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql` |
| Live Platform | [OmniFlow Physical Storage Architecture](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#architecture) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql) |
