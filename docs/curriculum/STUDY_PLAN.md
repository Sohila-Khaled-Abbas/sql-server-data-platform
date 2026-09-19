# Study Plan

## Phase 0 — Prerequisite check
Before starting, make sure you can comfortably write:
- SELECT / WHERE / JOIN / GROUP BY / HAVING
- subqueries and CTEs at a basic level
- INSERT / UPDATE / DELETE
- primary and foreign keys
- basic aggregations and window functions
- basic transaction concepts

If any of those are weak, pause and refresh them before Chapter 1.

## Phase 1 — Database Creation & Management
**Goal:** understand what SQL Server is managing underneath a table/query.

Focus especially on:
- files vs filegroups
- integrity and constraints
- clustered vs nonclustered indexes
- recovery model / backup types
- SQL Server Agent
- database snapshots

**Mini-project:** create a small operational database from code, add constraints/indexes, and create a documented backup/restore procedure.

## Phase 2 — SQL Programming Essentials
**Goal:** write reusable procedural T-SQL without falling into row-by-row thinking.

Focus especially on:
- variable scope
- control-of-flow
- scalar vs table-valued functions
- system databases
- temp tables vs table variables
- batches
- transaction boundaries

**Mini-project:** create a transactional order-processing routine with validation and rollback behavior.

## Phase 3 — Advanced Queries & High Availability
**Goal:** move from basic SQL to reusable data-access objects and operational architecture.

Focus especially on:
- views and indexed views
- partitioning
- XML/hierarchical data
- recursive CTEs
- pagination
- sequences
- TVPs
- RPO/RTO and HA
- log shipping

Treat database mirroring as a legacy technology to understand, not your default 2026 HA architecture. Microsoft currently recommends Always On availability groups for new high-availability development.

**Mini-project:** create an analytics-facing view layer plus an operational runbook for backup/DR.

## Phase 4 — Procedures, Triggers & Automation
**Goal:** build controlled database-side behavior and understand automation APIs.

Focus especially on:
- stored procedure design
- parameterization
- dynamic SQL using `sp_executesql`
- trigger side effects
- `inserted` and `deleted`
- audit logging
- OUTPUT
- cursor trade-offs
- SQL CLR concepts
- SMO automation

**Mini-project:** build a stored-procedure API for a small operational database and add a transparent audit mechanism.

## Phase 5 — Reporting & Data Warehousing
**Goal:** understand how SQL Server supports both operational reporting and analytical modeling.

Focus especially on:
- SSRS datasets and parameters
- grouping and expressions
- deployment
- report actions
- OLTP vs OLAP
- warehouse architecture
- facts, dimensions, and grain

**Mini-project:** create a small star schema and one paginated report based on a stable semantic query.

## Phase 6 — Final Project
Design one integrated project that includes:
1. source data
2. operational schema
3. constraints and indexes
4. reusable procedures/functions
5. transaction handling
6. backup/DR notes
7. analytical layer
8. dimensional model
9. report or BI output
10. README + architecture diagram

The goal is a portfolio artifact that demonstrates engineering judgment, not just feature usage.
