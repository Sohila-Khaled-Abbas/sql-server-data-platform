---
type: mistake-journal
title: "SQL Server Mistake Journal & Prevention Models"
tags:
  - revision
  - mistakes
---

# ⚠️ SQL Server Mistake Journal & Prevention Models

## Mistake 1: Placing Primary Keys on Non-Clustered Indexes Accidentally
- **What I Did**: Defined `CREATE TABLE ... (ID INT PRIMARY KEY NONCLUSTERED)`.
- **Why It Was Wrong**: Left the table as a Heap (without a clustered index), causing forward pointers, fragmentation, and poor range scan performance.
- **Correct Mental Model**: In SQL Server, a PRIMARY KEY creates a clustered index by default unless specified otherwise. Keep the primary key clustered on narrow, sequential, unique, unchanging keys (e.g. `IDENTITY` or `BIGINT`).
- **How I Avoid It**: Explicitly review table DDL for `CLUSTERED` index definition.

## Mistake 2: Non-SARGable WHERE Clauses
- **What I Did**: `WHERE YEAR(CreatedAt) = 2026` or `WHERE ISNULL(Status, '') = 'Active'`.
- **Why It Was Wrong**: Wrapping indexed columns in scalar functions forces the query engine to evaluate the function for every row in the table, preventing index seeks and causing full index scans.
- **Correct Mental Model**: Keep column references pure on the left side of comparisons: `WHERE CreatedAt >= '2026-01-01' AND CreatedAt < '2027-01-01'`.
