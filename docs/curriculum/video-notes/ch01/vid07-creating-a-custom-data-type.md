---
title: "CH01_VID07 — Creating a Custom Data Type"
aliases:
  - "CH01_VID07"
  - "Creating a Custom Data Type"
chapter: "CH01 — Database Creation and Management"
lesson: "VID07"
tags:
  - sql-server
  - dbre
  - data-engineering
  - storage-and-schema
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17526"
code_reference: "src/01_storage_and_schema/02_custom_types_and_rules.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH01_VID07 — Creating a Custom Data Type

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH01_VID06 — Constraints, Rules, and Default Values](vid06-constraints-rules-and-default-values.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH01_VID08 — Clustered Index](vid08-clustered-index.md)  
> 📌 **Chapter:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md) · **Official Lesson:** [MaharaTech 17526](https://maharatech.gov.eg/mod/hvp/view.php?id=17526)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> [!info] 🏗️ Storage & Physical Architecture
> Use this lesson to understand the concept, then reproduce it from scratch without copying the instructor step-for-step.

## SQL Pattern

```sql
-- Add the exact demo code you write while watching the lesson.
SELECT 1;
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **Creating a Custom Data Type** enforce? |
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
| Official Lesson | [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17526) |
| Production Code | `src/01_storage_and_schema/02_custom_types_and_rules.sql` |
| Live Platform | [OmniFlow Physical Storage Architecture](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#architecture) |
| Platform Curriculum | [OmniFlow Curriculum Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |
| Source on GitHub | [Repository](https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master/src/01_storage_and_schema/02_custom_types_and_rules.sql) |
