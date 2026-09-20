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

## 🎯 Engineering Mastery Checklist
- [ ] 📺 **Architectural Concept** · Core engine mechanics, internals, and storage allocation
- [ ] 💻 **Hands-On Execution** · Script executed and validated against SQL Server 2022 / SSMS
- [ ] 🧪 **Edge Case & Stress Testing** · Tested boundary limits, error traps (`XACT_ABORT`), and constraints
- [ ] 🚀 **Production Code Verified** · Documented implementation tracked in `src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql`

---

## 1. Learning Objectives & Architectural Focus

By the end of this lesson, I should be able to explain the core idea behind **Integrity constraints**, write/reproduce a small working example, and describe when the feature is useful in a real SQL Server data platform.

> [!info] Architectural Principle
> Prefer declarative constraints for invariants that must always hold. Put business rules in the database when they are truly universal and enforceable there.

> [!tip] 2026 Data Engineering & DBRE Lens
> While watching, note which steps are product-specific UI actions versus durable SQL/database-engineering concepts. Your GitHub notes should preserve the latter.

---

## 2. Production T-SQL Implementation Pattern

```sql
CREATE TABLE dbo.Customer (
    CustomerID int PRIMARY KEY,
    Email varchar(255) NOT NULL UNIQUE,
    Age int CHECK (Age >= 0)
);
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
CREATE TABLE dbo.Customer (
    CustomerID int PRIMARY KEY,
    Email varchar(255) NOT NULL UNIQUE,
    Age int CHECK (Age >= 0)
);
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

* 🔗 **Official Course Module:** [MaharaTech Lesson 17524](https://maharatech.gov.eg/mod/hvp/view.php?id=17524)
* 💾 **Production Script:** [`src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql`](../../../../src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql)
* 📖 **Chapter Mastery Guide:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md)
* 🗺️ **Curriculum Tracker:** [Interactive Learning Tracker](../../LEARNING_TRACKER.md)
* 🚀 **Interactive Showcase:** [OmniFlow Platform Web App](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
