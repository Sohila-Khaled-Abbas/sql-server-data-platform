# 8-Week Mentor Study Plan

The portal lists about 11h47m of recorded video, but the target is mastery, not playlist completion. Plan roughly 4–7 hours/week including coding and documentation.

## Week 1 — Database foundations
**Lessons:** CH01 VID01–VID16

Focus: files/filegroups, integrity, constraints, indexes, backups, SQL Agent, snapshots.

**Deliverable:** create a small SQL Server database entirely from scripts and document the backup/recovery plan.

Checkpoint: explain why a database can be logically correct while still being operationally unsafe.

## Week 2 — T-SQL programming
**Lessons:** CH02 VID01–VID15

Focus: variables, scope, control flow, functions, system databases, temporary objects, batches, transactions.

**Deliverable:** transactional order workflow with validation and rollback behavior.

Checkpoint: rewrite one procedural solution as a set-based solution where possible.

## Week 3 — Views + advanced querying
**Lessons:** CH03 VID01–VID15

Focus: views, indexed views, partitioning, XML, hierarchy, recursive CTEs, pagination, sequences, TVPs.

**Deliverable:** build an API-like SQL access layer using views/procedures/TVPs and document the trade-offs.

Checkpoint: identify the grain of every important query before optimizing it.

## Week 4 — High availability & DR
**Lessons:** CH03 VID16–VID23

Focus: RPO/RTO, instances, mirroring, log shipping, failure scenarios.

**Deliverable:** a one-page DR runbook showing primary, secondary, backup/copy/restore flow, monitoring, and failover assumptions.

**Modern lens:** Database mirroring is a legacy/deprecated SQL Server feature; Microsoft recommends Always On availability groups for new high-availability development. Study the legacy lesson for conceptual and maintenance literacy, while learning the modern architecture separately.

Checkpoint: answer “What happens to data loss and recovery time when the secondary is asynchronous?”

## Week 5 — Stored procedures & triggers
**Lessons:** CH04 VID01–VID14

Focus: reusable database APIs, parameters, dynamic SQL, triggers, auditing, OUTPUT.

**Deliverable:** stored-procedure API for an operational database plus an auditable DML workflow.

Checkpoint: list two ways a trigger can make a system safer and two ways it can make a system harder to maintain.

## Week 6 — Cursors, CLR & SMO
**Lessons:** CH04 VID15–VID27

Focus: cursors, SQL CLR, SMO automation, administration through code.

**Deliverable:** one small automation script/application and a decision note explaining why automation is better than manual SSMS steps for that task.

Checkpoint: defend whether a row-by-row cursor, set-based SQL, or external application code is the right tool for a given workload.

## Week 7 — SSRS + reporting
**Lessons:** CH05 VID01–VID16

Focus: datasets, expressions, parameters, grouping, actions, deployment, RDLC.

**Deliverable:** one paginated report with a clean parameter model and a documented query/data grain.

Checkpoint: explain the difference between a report parameter and a SQL query parameter.

## Week 8 — Data warehousing + final project
**Lessons:** CH05 VID17–VID20 + Final Project

Focus: warehouse architecture, OLTP vs OLAP, dimensional modeling, integration.

**Deliverable:** final GitHub case study with architecture, SQL scripts, tests, warehouse model, report output, and README.

Checkpoint: explain why “define the grain first” is one of the most important steps in dimensional modeling.
