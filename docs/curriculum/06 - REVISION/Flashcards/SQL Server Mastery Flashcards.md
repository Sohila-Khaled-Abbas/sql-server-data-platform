---
type: flashcards
title: "SQL Server Mastery Flashcards"
tags:
  - flashcards
  - revision
---

# 🗂️ SQL Server Mastery Flashcards

## Card 1: Data Page Size
- **Front**: What is the size of an 8 KB data page in SQL Server, and how much space is reserved for the page header?
- **Back**: Exactly 8,192 bytes total. The page header consumes 96 bytes, leaving 8,060 bytes for data and row offset arrays.
- **Related Concept**: [[Data Pages and Extents]]

## Card 2: Clustered Index Leaf Level
- **Front**: What is physically stored at the leaf level of a Clustered Index?
- **Back**: The actual data rows of the table (the table itself is organized as a B-Tree).
- **Related Concept**: [[Clustered Index]]

## Card 3: XACT_ABORT ON
- **Front**: What does `SET XACT_ABORT ON` do when a runtime error occurs inside a transaction?
- **Back**: Immediately terminates the query and rolls back the entire transaction, preventing orphaned open transactions.
- **Related Concept**: [[Transactions and ACID]]
