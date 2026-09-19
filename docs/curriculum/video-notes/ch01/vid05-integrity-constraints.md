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

> [!todo] Mastery Progress Checklist
> - [ ] 📺 **Watched** (Core mechanics & architectural nuances)
> - [ ] 💻 **Reproduced** (Hands-on execution in SQL Server 2022 / SSMS)
> - [ ] 🧪 **Modified** (Tested boundary conditions, failure states & edge cases)
> - [ ] 📝 **Documented & Explained** (Grounding without hand-waving)

---

## 1. Learning Objectives

By the end of this lesson, I should be able to explain the core idea behind **Integrity constraints**, write/reproduce a small working example, and describe when the feature is useful in a real SQL Server data platform.

## 2. Core Architectural Concept

> [!info] Architectural Principle
> > > Prefer declarative constraints for invariants that must always hold. Put business rules in the database when they are truly universal and enforceable there.

> [!tip] 2026 Data Engineering & DBRE Lens
> While watching, note which steps are product-specific UI actions versus durable SQL/database-engineering concepts. Your GitHub notes should preserve the latter.

## 3. SQL Implementation Pattern

```sql
CREATE TABLE dbo.Customer (
    CustomerID int PRIMARY KEY,
    Email varchar(255) NOT NULL UNIQUE,
    Age int CHECK (Age >= 0)
);
```

## 4. Production Engineering Evaluation Matrix

| Dimension | Critical Engineering Evaluation |
| :--- | :--- |
| **Correctness** | What data invariant, operational behavior, or ACID guarantee does it enforce? |
| **Performance** | How does this affect I/O operations, page allocation, buffer cache, CPU, or lock contention? |
| **Operations** | How does this behave under disaster recovery, failover, backup chains, and migration? |
| **Maintainability** | Can another engineer easily diagnose, extend, or alter this object without breaking dependent callers? |

## 5. Hands-on Reproduction & Modification Drill

Rebuild the core pattern from memory in SSMS or Docker container. Test boundary conditions, edge cases, and failure modes.

```sql
-- Hands-on Verification & Edge Case Drill
CREATE TABLE dbo.Customer (
    CustomerID int PRIMARY KEY,
    Email varchar(255) NOT NULL UNIQUE,
    Age int CHECK (Age >= 0)
);
```

## 6. Definition of Done Checklist

> [!check] Validation Checklist
> - [ ] I can define the feature in one sentence.
> - [ ] I can explain why it exists.
> - [ ] I reproduced the basic example successfully.
> - [ ] I tested at least one edge case.
> - [ ] I can explain one performance/operational trade-off.
> - [ ] I linked the final script from my learning repo.

## 7. Mentor Checkpoint & Interview Drill

> [!question] Conceptual & Practical Challenge
> **Explain without SQL:** What problem would this feature solve in a production data platform, and what would you use instead when the feature is the wrong tool?
>
> *My Synthesis:*
> <!-- Document your synthesized mental model and engineering decision here -->
>
> *My Synthesis:*
> <!-- Document your synthesized mental model and engineering decision here -->
>
> *My Synthesis:*
> <!-- Document your synthesized mental model and engineering decision here -->

## 8. Observation & SSMS Notes

- **Key demonstration observed:**
- **Important SSMS / Engine setting:**
- **Critical syntax nuance:**
- **Failure mode or trap avoided:**
- **Research item for deeper inquiry:**

## 9. Interview Drill & Trade-Off Analysis

> [!example] Production Scenario Question
> [!example] Production Scenario Question

## 10. Evidence & Production Artifact Links

* 🔗 **Official Course Module:** [MaharaTech Lesson 17524](https://maharatech.gov.eg/mod/hvp/view.php?id=17524)
* 💾 **Production Script:** [`src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql`](../../../../src/01_storage_and_schema/ch01_vid05_integrity_constraints.sql)
* 📖 **Chapter Mastery Guide:** [CH01 — Database Creation and Management](../../chapters/ch01-readme.md)
* 🗺️ **Curriculum Tracker:** [Interactive Learning Tracker](../../LEARNING_TRACKER.md)
* 🚀 **Interactive Showcase:** [OmniFlow Platform Web App](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
