# Final Project — Integrated SQL Server Data Platform

**Source lesson:** https://maharatech.gov.eg/mod/hvp/view.php?id=17630

## Mentor brief

Treat the final project as a real data-platform case study. The course itself describes a comprehensive database solution integrating its concepts. [Mahara-Tech course page](https://maharatech.gov.eg/course/view.php?id=2305)

## Build sequence

### 1. Requirements
- What business process are you supporting?
- What is the operational workload?
- What reporting/analytical questions must be answered?
- What are the reliability and recovery expectations?

### 2. Operational model
- entities
- relationships
- primary/foreign keys
- constraints
- normalization decisions
- indexes based on actual query patterns

### 3. Programmability
Implement at least:
- one stored procedure with parameters
- one function where it is genuinely appropriate
- one transaction-safe workflow
- one validation/audit mechanism

### 4. Operational engineering
Document:
- backup strategy
- recovery model
- RPO / RTO assumptions
- monitoring considerations
- DR approach

Do not use database mirroring as your default modern recommendation; Microsoft currently recommends Always On availability groups for new high-availability development. [Microsoft Learn: Database Mirroring](https://learn.microsoft.com/en-us/sql/database-engine/database-mirroring/setting-up-database-mirroring-sql-server?view=sql-server-ver17) · [Business Continuity and DR](https://learn.microsoft.com/en-us/sql/database-engine/sql-server-business-continuity-dr?view=sql-server-ver17)

### 5. Analytical layer
Define the grain first, then build:
- fact table(s)
- dimensions
- surrogate/business keys as appropriate
- measures
- date dimension

### 6. Reporting
Produce at least one report/dashboard-ready dataset with clearly defined grain and KPI logic.

## GitHub deliverables

```text
final-project/
├── README.md
├── docs/
│   ├── architecture.md
│   ├── data-model.md
│   ├── recovery-and-dr.md
│   └── decisions.md
├── sql/
│   ├── 01-database.sql
│   ├── 02-schema.sql
│   ├── 03-tables.sql
│   ├── 04-constraints.sql
│   ├── 05-indexes.sql
│   ├── 06-views.sql
│   ├── 07-functions.sql
│   ├── 08-procedures.sql
│   ├── 09-triggers.sql
│   ├── 10-seed.sql
│   └── 11-validation.sql
├── warehouse/
└── reports/
```

## Definition of done

- [ ] A new engineer can clone the repository and understand the architecture.
- [ ] Database creation is reproducible from scripts.
- [ ] Constraints enforce core invariants.
- [ ] Indexes have a workload-based rationale.
- [ ] Transactions have explicit boundaries and failure behavior.
- [ ] Reusable procedures/functions are documented.
- [ ] Audit behavior is visible and testable.
- [ ] Backup/DR assumptions are documented.
- [ ] Warehouse grain is explicit.
- [ ] At least one analytical/reporting output is reproducible.
- [ ] README includes architecture, setup, examples, and lessons learned.
