---
title: "CH03_VID22 — Log Shipping vs Mirroring"
aliases:
  - "CH03_VID22"
  - "Log Shipping vs Mirroring"
chapter: "CH03 — Advanced Query Techniques and High Availability"
lesson: "VID22"
tags:
  - sql-server
  - dbre
  - data-engineering
  - advanced-queries-ha
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17575"
code_reference: "src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03_VID22 — Log Shipping vs Mirroring

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH03_VID21 — Steps to Configure SQL Server Log Shipping](vid21-steps-to-configure-sql-server-log-shipping.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH03_VID23 — Assignment 03](vid23-assignment-03.md)  
> 📌 **Chapter:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md) · **Official Lesson:** [MaharaTech 17575](https://maharatech.gov.eg/mod/hvp/view.php?id=17575)

> [!todo] Mastery Progress Checklist
> - [ ] 📺 **Watched** (Core mechanics & architectural nuances)
> - [ ] 💻 **Reproduced** (Hands-on execution in SQL Server 2022 / SSMS)
> - [ ] 🧪 **Modified** (Tested boundary conditions, failure states & edge cases)
> - [ ] 📝 **Documented & Explained** (Grounding without hand-waving)

---

## 1. Learning Objectives

By the end of this lesson, I should be able to explain the core idea behind **Log Shipping vs Mirroring**, write/reproduce a small working example, and describe when the feature is useful in a real SQL Server data platform.

## 2. Core Architectural Concept

> [!info] Architectural Principle
> > > Database mirroring is a legacy SQL Server HA technology. Microsoft documents it as deprecated and recommends Always On availability groups for new high-availability development.

**2026 lens:** Study this for legacy-system literacy and exam/interview understanding. Microsoft says database mirroring is deprecated and will be removed in a future SQL Server version; new high-availability designs should use Always On availability groups. [Microsoft Learn: Database Mirroring](https://learn.microsoft.com/en-us/sql/database-engine/database-mirroring/setting-up-database-mirroring-sql-server?view=sql-server-ver17) · [Business Continuity and DR](https://learn.microsoft.com/en-us/sql/database-engine/sql-server-business-continuity-dr?view=sql-server-ver17)

> [!tip] 2026 Data Engineering & DBRE Lens
> Distinguish transient UI actions from durable database engineering invariants. Ensure all schema definitions in CH03_VID22 are captured in declarative T-SQL scripts rather than unrepeatable SSMS clicks.

## 3. SQL Implementation Pattern

```sql
-- Legacy concept
-- Principal <-> Mirror (+ optional Witness)
-- Full recovery model
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
-- Legacy concept
-- Principal <-> Mirror (+ optional Witness)
-- Full recovery model
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

* 🔗 **Official Course Module:** [MaharaTech Lesson 17575](https://maharatech.gov.eg/mod/hvp/view.php?id=17575)
* 💾 **Production Script:** [`src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md`](../../../../src/06_reliability_and_dr/03_high_availability_docs/log_shipping_and_ag_guide.md)
* 📖 **Chapter Mastery Guide:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md)
* 🗺️ **Curriculum Tracker:** [Interactive Learning Tracker](../../LEARNING_TRACKER.md)
* 🚀 **Interactive Showcase:** [OmniFlow Platform Web App](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
