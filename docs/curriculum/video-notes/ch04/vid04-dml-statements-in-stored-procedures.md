---
title: "CH04_VID04 — DML Statements in Stored Procedures"
aliases:
  - "CH04_VID04"
  - "DML Statements in Stored Procedures"
chapter: "CH04 — Procedures, Triggers, and SQL Automation"
lesson: "VID04"
tags:
  - sql-server
  - dbre
  - data-engineering
  - procedures-triggers-automation
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17581"
code_reference: "src/03_programmability_and_elt/03_stored_procedures_etl.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH04_VID04 — DML Statements in Stored Procedures

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH04_VID03 — Demo on stored procedures](vid03-demo-on-stored-procedures.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH04_VID05 — Stored Procedure with Parameters and Return Values](vid05-stored-procedure-with-parameters-and-return-values.md)  
> 📌 **Chapter:** [CH04 — Procedures, Triggers, and SQL Automation](../../chapters/ch04-readme.md) · **Official Lesson:** [MaharaTech 17581](https://maharatech.gov.eg/mod/hvp/view.php?id=17581)

## 🎯 Engineering Mastery Checklist
- [ ] 📺 **Architectural Concept** · Core engine mechanics, internals, and storage allocation
- [ ] 💻 **Hands-On Execution** · Script executed and validated against SQL Server 2022 / SSMS
- [ ] 🧪 **Edge Case & Stress Testing** · Tested boundary limits, error traps (`XACT_ABORT`), and constraints
- [ ] 🚀 **Production Code Verified** · Documented implementation tracked in `src/03_programmability_and_elt/03_stored_procedures_etl.sql`

---

## 1. Learning Objectives & Architectural Focus

By the end of this lesson, I should be able to explain the core idea behind **DML Statements in Stored Procedures**, write/reproduce a small working example, and describe when the feature is useful in a real SQL Server data platform.

> [!info] Architectural Principle
> Stored procedures package database-side operations, can accept parameters, and are useful for reusable application/data-access workflows.

> [!tip] 2026 Data Engineering & DBRE Lens
> While watching, note which steps are product-specific UI actions versus durable SQL/database-engineering concepts. Your GitHub notes should preserve the latter.

---

## 2. Production T-SQL Implementation Pattern

```sql
CREATE OR ALTER PROCEDURE dbo.usp_GetCustomerSales
    @CustomerID int
AS
BEGIN
    SET NOCOUNT ON;
    SELECT CustomerID, SUM(Amount) AS Sales
    FROM dbo.Sales
    WHERE CustomerID = @CustomerID
    GROUP BY CustomerID;
END;
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
CREATE OR ALTER PROCEDURE dbo.usp_GetCustomerSales
    @CustomerID int
AS
BEGIN
    SET NOCOUNT ON;
    SELECT CustomerID, SUM(Amount) AS Sales
    FROM dbo.Sales
    WHERE CustomerID = @CustomerID
    GROUP BY CustomerID;
END;
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

* 🔗 **Official Course Module:** [MaharaTech Lesson 17581](https://maharatech.gov.eg/mod/hvp/view.php?id=17581)
* 💾 **Production Script:** [`src/03_programmability_and_elt/03_stored_procedures_etl.sql`](../../../../src/03_programmability_and_elt/03_stored_procedures_etl.sql)
* 📖 **Chapter Mastery Guide:** [CH04 — Procedures, Triggers, and SQL Automation](../../chapters/ch04-readme.md)
* 🗺️ **Curriculum Tracker:** [Interactive Learning Tracker](../../LEARNING_TRACKER.md)
* 🚀 **Interactive Showcase:** [OmniFlow Platform Web App](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
