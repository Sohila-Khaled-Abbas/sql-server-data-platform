---
title: "CH05_VID15 — Create custom reports using Microsoft RDLC Report Designer"
aliases:
  - "CH05_VID15"
  - "Create custom reports using Microsoft RDLC Report Designer"
chapter: "CH05 — Reporting and Data Warehousing"
lesson: "VID15"
tags:
  - sql-server
  - dbre
  - data-engineering
  - warehousing-and-reporting
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17624"
code_reference: "src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH05_VID15 — Create custom reports using Microsoft RDLC Report Designer

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH05_VID14 — View reports with a browser (Report Builder and SSRS)](vid14-view-reports-with-a-browser-report-builder-and-ssrs.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH05_VID16 — Link parameters to your custom report](vid16-link-parameters-to-your-custom-report.md)  
> 📌 **Chapter:** [CH05 — Reporting and Data Warehousing](../../chapters/ch05-readme.md) · **Official Lesson:** [MaharaTech 17624](https://maharatech.gov.eg/mod/hvp/view.php?id=17624)

> [!todo] Mastery Progress Checklist
> - [ ] 📺 **Watched** (Core mechanics & architectural nuances)
> - [ ] 💻 **Reproduced** (Hands-on execution in SQL Server 2022 / SSMS)
> - [ ] 🧪 **Modified** (Tested boundary conditions, failure states & edge cases)
> - [ ] 📝 **Documented & Explained** (Grounding without hand-waving)

---

## 1. Learning Objectives

By the end of this lesson, I should be able to explain the core idea behind **Create custom reports using Microsoft RDLC Report Designer**, write/reproduce a small working example, and describe when the feature is useful in a real SQL Server data platform.

## 2. Core Architectural Concept

> [!info] Architectural Principle
> > > RDLC is client-side report definition technology commonly used when the application supplies the data rather than a centralized report server.

> [!tip] 2026 Data Engineering & DBRE Lens
> While watching, note which steps are product-specific UI actions versus durable SQL/database-engineering concepts. Your GitHub notes should preserve the latter.

## 3. SQL Implementation Pattern

```sql
-- RDLC concept
-- report definition embedded/managed by an application
-- dataset supplied by the application
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
-- RDLC concept
-- report definition embedded/managed by an application
-- dataset supplied by the application
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

* 🔗 **Official Course Module:** [MaharaTech Lesson 17624](https://maharatech.gov.eg/mod/hvp/view.php?id=17624)
* 💾 **Production Script:** [`src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl`](../../../../src/07_warehousing_and_reporting/ssrs_reports/SalesExecutiveSummary.rdl)
* 📖 **Chapter Mastery Guide:** [CH05 — Reporting and Data Warehousing](../../chapters/ch05-readme.md)
* 🗺️ **Curriculum Tracker:** [Interactive Learning Tracker](../../LEARNING_TRACKER.md)
* 🚀 **Interactive Showcase:** [OmniFlow Platform Web App](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
