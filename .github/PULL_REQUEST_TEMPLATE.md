## Description
<!-- Briefly describe the architectural change, feature, or bug fix introduced by this PR -->

## Category of Change
- [ ] **Storage & Schema** (Filegroups, partitioning, UDTs, constraints, tables)
- [ ] **Indexing & Performance** (Covering indexes, columnstore, plan optimizations)
- [ ] **Programmability & ELT** (Stored procedures, TVPs, XML/JSON parsing, functions)
- [ ] **Governance & Auditing** (Triggers, CDC, dynamic SQL security)
- [ ] **Automation & SMO** (PowerShell, Python, CLR assemblies)
- [ ] **Disaster Recovery & Reliability** (Backup jobs, snapshots, HA guides)
- [ ] **Analytics & Warehousing** (Star schema, SCD dimensions, SSRS reports)
- [ ] **CI/CD & Documentation** (Workflows, diagrams, guides)

## DBRE & Performance Checklist
- [ ] **Idempotency**: All DDL statements use `IF NOT EXISTS`, `DROP ... IF EXISTS`, or `CREATE OR ALTER`.
- [ ] **Explicit Filegroups**: Non-system objects are explicitly assigned to `DATA_FG` or `INDEX_FG` (never default to `PRIMARY`).
- [ ] **Connection Settings**: Script explicitly sets `SET ANSI_NULLS ON;` and `SET QUOTED_IDENTIFIER ON;`.
- [ ] **ACID & Error Handling**: DML stored procedures enforce `SET XACT_ABORT ON;` and include `TRY...CATCH` blocks with `THROW`.
- [ ] **Execution Plan Verified**: Query execution plans inspected for unintentional table scans, key lookups, or high-cost spills.
- [ ] **Referential Integrity**: All foreign keys and check constraints are deterministically named (no system auto-generated names).
- [ ] **Local Deployment Verified**: Verified against local SQL Server using `deploy.ps1 -Environment Local`.
- [ ] **Docker Deployment Verified**: Verified against SQL Server container using `deploy.ps1 -Environment Docker`.

## Related Issue / Course Topic
<!-- Link related issue or MaharaTech course topic (e.g. Closes #12, References CH01_VID02) -->
Closes #

## Screenshots / Execution Telemetry
<!-- Paste output from sqlcmd, SSMS execution plan, or deploy.ps1 results below -->
```text

```
