# SQL Server Objects — Learning & Data Engineering Notes

This repository is a **study companion** for Mahara-Tech's **Implementing and Developing SQL server objects** course. The official course page currently lists 5 chapters, 104 videos, and a total video duration of 11 hours 47 minutes; it describes hands-on demonstrations, assignments, and a final project. The outline you supplied contains 102 lesson items including the final project, so this package creates notes for those 102 items rather than inventing the two items not present in your pasted list. [Mahara-Tech course page](https://maharatech.gov.eg/course/view.php?id=2305)

The course requires prior knowledge of Transact-SQL queries using SQL Server, so this repo should be used to deepen SQL Server object development and platform thinking rather than as a first exposure to SQL syntax. [Mahara-Tech course page](https://maharatech.gov.eg/course/view.php?id=2305)

## Learning philosophy

Do not optimize for finishing videos. Optimize for being able to **rebuild, explain, test, and apply** each concept.

For every lesson:

1. Watch actively and pause before demonstrations.
2. Predict what the SQL/SSMS action will do.
3. Reproduce it from scratch.
4. Change one thing and test your understanding.
5. Write the lesson note in your own words.
6. Commit the SQL and note together.

## 2026 data-engineering lens

This course contains a mixture of durable SQL Server engineering concepts and older/legacy technologies. Learn both, but distinguish **"important to understand"** from **"default choice for new production work."**

One important example is database mirroring: Microsoft currently documents it as deprecated and recommends Always On availability groups for new high-availability development. [Microsoft Learn: Database Mirroring](https://learn.microsoft.com/en-us/sql/database-engine/database-mirroring/setting-up-database-mirroring-sql-server?view=sql-server-ver17) · [Business Continuity and DR](https://learn.microsoft.com/en-us/sql/database-engine/sql-server-business-continuity-dr?view=sql-server-ver17) Database snapshots are read-only, transactionally consistent views and do not replace backups. [Microsoft Learn: Database Snapshots](https://learn.microsoft.com/en-us/sql/relational-databases/databases/database-snapshots-sql-server?view=sql-server-ver17) Log shipping remains a documented SQL Server technique for copying and restoring transaction logs to a secondary server. [Microsoft Learn: Log Shipping](https://learn.microsoft.com/en-us/sql/database-engine/log-shipping/log-shipping-and-replication-sql-server?view=sql-server-ver17) SMO remains a documented programmatic management API/object model for SQL Server. [Microsoft Learn: SMO Overview](https://learn.microsoft.com/en-us/sql/relational-databases/server-management-objects-smo/overview-smo?view=sql-server-ver17)

## Course roadmap

| Phase | Focus | Primary outcome |
|---|---|---|
| 0 | Prerequisite refresh | Strong T-SQL querying |
| 1 | Database creation & management | Reliable SQL Server database foundation |
| 2 | SQL programming | Reusable programmable T-SQL |
| 3 | Advanced querying & HA | Advanced data access + operational awareness |
| 4 | Procedures, triggers & automation | Database-side engineering + automation |
| 5 | Reporting & warehousing | Reporting + analytical modeling |
| 6 | Final project | Integrated portfolio case study |

## Study cadence

The official video time is under 12 hours, but do not study it as a 12-hour playlist. A realistic first pass is roughly **35–50 hours including reproduction, assignments, troubleshooting, and documentation**.

Recommended rhythm:
- 60–90 minutes focused study
- 20–40 minutes hands-on reproduction
- 10 minutes documentation
- every 3–4 lessons: a cumulative mini-task

## Definition of done for a lesson

A lesson is complete only when all four are true:

**Understand → Reproduce → Modify → Explain**

A GitHub check mark without those four steps is not considered complete.

## Repository Structure & Mapping to Production Implementation

```text
docs/curriculum/
├── README.md                      # Curriculum overview and architecture mapping
├── STUDY_PLAN.md                  # Conceptual engineering roadmap
├── 8-WEEK-STUDY-PLAN.md           # 8-week intensive study milestone tracker
├── LEARNING_TRACKER.md            # Interactive 102-lesson progress tracking matrix
├── MENTOR_WORKFLOW.md             # Understand → Reproduce → Modify → Explain rigor
├── VIDEO_INDEX.md                 # 102 official Mahara-Tech video catalog with deep links
├── chapters/                      # CH01-CH05 chapter mastery guidelines
│   ├── ch01-readme.md ... ch05-readme.md
├── video-notes/                   # All 102 individual lesson study & interview notes
│   ├── ch01/ (16 notes)           # Files, Filegroups, Constraints, Rules, Indexes, Backups
│   ├── ch02/ (15 notes)           # Variables, Flow of Control, TVFs, System DBs, Transactions
│   ├── ch03/ (23 notes)           # Views, Partitioning, XML, Hierarchies, CTEs, Log Shipping
│   ├── ch04/ (27 notes)           # Stored Procedures, Triggers, Cursors, CLR, SMO
│   └── ch05/ (20 notes)           # SSRS, Matrix, Expressions, OLAP vs OLTP, Kimball Star Schema
└── projects/
    └── final-project-brief.md     # Capstone enterprise data platform integration brief
```

### Production Implementation Mapping
All hands-on code and automation corresponding to these curriculum topics are fully implemented, tested, and verified in the repository root:
- **Storage & Integrity:** [`src/01_storage_and_schema/`](../../src/01_storage_and_schema/)
- **Indexes & Performance:** [`src/02_indexing_and_performance/`](../../src/02_indexing_and_performance/)
- **ELT & Programmability:** [`src/03_programmability_and_elt/`](../../src/03_programmability_and_elt/)
- **Governance & Audit:** [`src/04_governance_and_audit/`](../../src/04_governance_and_audit/)
- **CLR & SMO Automation:** [`src/05_automation_and_smo/`](../../src/05_automation_and_smo/)
- **Reliability & Backups:** [`src/06_reliability_and_dr/`](../../src/06_reliability_and_dr/)
- **Kimball Warehousing & SSRS:** [`src/07_warehousing_and_reporting/`](../../src/07_warehousing_and_reporting/)
- **Integration Tests:** [`tests/`](../../tests/)
- **Interactive Portfolio App:** [`web/`](../../web/)

## Suggested commit style

```text
learn(ch01): database filegroups and creation
learn(ch02): variables and control flow
learn(ch03): cte and pagination
learn(ch04): stored procedures and triggers
learn(ch05): ssrs and dimensional modeling
project: implement integrated sql server platform
```

## Source

Mahara-Tech course: https://maharatech.gov.eg/course/view.php?id=2305
