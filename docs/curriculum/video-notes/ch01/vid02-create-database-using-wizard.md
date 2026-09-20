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

## 🎯 Engineering Mastery Checklist
- [ ] 📺 **Architectural Concept** · Core engine mechanics, internals, and storage allocation
- [ ] 💻 **Hands-On Execution** · Script executed and validated against SQL Server 2022 / SSMS
- [ ] 🧪 **Edge Case & Stress Testing** · Tested boundary limits, error traps (`XACT_ABORT`), and constraints
- [ ] 🚀 **Production Code Verified** · Documented implementation tracked in `src/01_storage_and_schema/ch01_vid02_ititest_case_study_schema.sql`

---

## 1. Learning Objectives & Architectural Focus

By the end of this lesson, I should be able to explain the core idea behind **Create Database Using Wizard**, write/reproduce a small working example, and describe when the feature is useful in a real SQL Server data platform.

> [!info] Architectural Principle
> Understand the distinction between logical file names, physical files, filegroups, and the transaction log.

> [!tip] 2026 Data Engineering & DBRE Lens
> While watching, note which steps are product-specific UI actions versus durable SQL/database-engineering concepts. Your GitHub notes should preserve the latter.

---

## 2. Production T-SQL Implementation Pattern

```sql
CREATE DATABASE DemoDB
ON PRIMARY (NAME = N'DemoDB_Data', FILENAME = N'C:\SQLData\DemoDB.mdf', SIZE = 50MB, FILEGROWTH = 10MB)
LOG ON (NAME = N'DemoDB_Log', FILENAME = N'C:\SQLData\DemoDB.ldf', SIZE = 25MB, FILEGROWTH = 10MB);
```

---

## 3. Production Engineering Evaluation Matrix

| Dimension | Critical Engineering Evaluation |
| :--- | :--- |
| **Correctness** | What data invariant, operational behavior, or ACID guarantee does it enforce? |
| **Performance** | How does this affect I/O operations, page allocation, buffer cache, CPU, or lock contention? |
| **Operations** | How does this behave under disaster recovery, failover, backup chains, and migration? |
| **Maintainability** | Can another engineer easily diagnose, extend, or alter this object without breaking dependent callers? |

---

## 4. Hands-on Reproduction & Edge Case Drill

Rebuild the core pattern from memory in SSMS or Docker container. Test boundary conditions, edge cases, and failure modes.

```sql
-- Hands-on Verification & Edge Case Drill
CREATE DATABASE DemoDB
ON PRIMARY (NAME = N'DemoDB_Data', FILENAME = N'C:\SQLData\DemoDB.mdf', SIZE = 50MB, FILEGROWTH = 10MB)
LOG ON (NAME = N'DemoDB_Log', FILENAME = N'C:\SQLData\DemoDB.ldf', SIZE = 25MB, FILEGROWTH = 10MB);
```

---

## 5. Architectural Synthesis & Mentor Checkpoint

> [!question] Senior DBRE / Architect Challenge
> **Explain without SQL:** What problem would this feature solve in a production data platform, and what would you use instead when the feature is the wrong tool?

*My Engineering Synthesis:*
<!-- Document your synthesized mental model, architectural trade-offs, and operational lessons here -->

---

## 6. Observation & SSMS Notes

- **Key demonstration observed:**
- **Important SSMS / Engine setting:**
- **Critical syntax nuance:**
- **Failure mode or trap avoided:**
- **Research item for deeper inquiry:**

---

## 7. Evidence & Production Artifact Links

* 🔗 **Official Course Module:** [MaharaTech Lesson 17521](https://maharatech.gov.eg/mod/hvp/view.php?id=17521)
* 💾 **Production Script:** [`src/01_storage_and_schema/ch01_vid02_ititest_case_study_schema.sql`](../../../../src/01_storage_and_schema/ch01_vid02_ititest_case_study_schema.sql)
* 📖 **Chapter Mastery Guide:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md)
* 🗺️ **Curriculum Tracker:** [Interactive Learning Tracker](../../LEARNING_TRACKER.md)
* 🚀 **Interactive Showcase:** [OmniFlow Platform Web App](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
