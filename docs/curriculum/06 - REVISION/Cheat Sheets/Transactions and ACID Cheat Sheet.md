---
type: cheat-sheet
topic: "Transactions and ACID"
tags:
  - course/sql-server
  - type/cheat-sheet
  - revision
---

# Transactions and ACID — Engineering Cheat Sheet

## 🎯 Quick Syntax Reference
```sql
-- Rapid reference syntax for Transactions and ACID
```

## ⚡ High-Frequency Patterns
- Key Pattern 1: Always verify transaction state with `@@TRANCOUNT`.
- Key Pattern 2: Eliminate bookmark lookups using `INCLUDE` on non-clustered indexes.
- Key Pattern 3: Use `SET NOCOUNT ON` in all procedural routines.

## ⚠️ Critical Pitfalls to Avoid
- Avoid non-SARGable expressions in WHERE clauses (`WHERE YEAR(OrderDate) = 2026`).
- Avoid multi-statement table-valued functions in performance-critical queries.

## 🔗 Deep-Dive Concepts
- Concept Note: [[Transactions and ACID]]
