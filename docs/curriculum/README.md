---
title: "SQL Server Objects — Curriculum"
aliases:
  - "Curriculum"
tags:
  - sql-server
  - curriculum-hub
  - maharatech
total_chapters: 5
total_lessons: 102
date_created: 2026-09-19
last_modified: 2026-09-20
---

# SQL Server Objects — Curriculum

> [!abstract] Navigation
> [Learning Tracker](LEARNING_TRACKER.md) · [Video Index](VIDEO_INDEX.md) · [8-Week Plan](8-WEEK-STUDY-PLAN.md) · [Study Plan](STUDY_PLAN.md)
> **Source:** [MaharaTech Course 2305](https://maharatech.gov.eg/course/view.php?id=2305) · ITI · Eng. Rami Mohamed Abonagi
> **Scope:** 5 Chapters · 102 Videos · Production code in [`src/`](../../src/)

---

## Chapters

| Chapter | Topic | Lessons | Guide | Code |
| :--- | :--- | :---: | :--- | :--- |
| **CH01** | Database Creation & Storage | 16 | [CH01](chapters/ch01-readme.md) | [`src/01_storage_and_schema/`](../../src/01_storage_and_schema/) |
| **CH02** | SQL Programming & Transactions | 15 | [CH02](chapters/ch02-readme.md) | [`src/03_programmability_and_elt/`](../../src/03_programmability_and_elt/) |
| **CH03** | Views, Partitioning & HA | 23 | [CH03](chapters/ch03-readme.md) | [`src/02_indexing_and_performance/`](../../src/02_indexing_and_performance/) |
| **CH04** | Procedures, Triggers & CLR | 27 | [CH04](chapters/ch04-readme.md) | [`src/04_governance_and_audit/`](../../src/04_governance_and_audit/) |
| **CH05** | SSRS & Data Warehousing | 20 | [CH05](chapters/ch05-readme.md) | [`src/07_warehousing_and_reporting/`](../../src/07_warehousing_and_reporting/) |
| **Final** | Capstone Project | 1 | [Brief](projects/final-project-brief.md) | [`tests/`](../../tests/) |

---

## Progress

```dataview
TABLE length(rows) AS "Total",
      length(filter(rows, (r) => r.status = "completed")) AS "✅",
      length(filter(rows, (r) => r.status = "in-progress")) AS "🔄",
      length(filter(rows, (r) => r.status = "planned" OR !r.status)) AS "⏳"
FROM "video-notes"
GROUP BY chapter
```

## In Progress

```dataview
TABLE chapter AS "Chapter", code_reference AS "Code"
FROM "video-notes"
WHERE status = "in-progress"
SORT last_modified DESC
```

---

## Links

- [OmniFlow Web App](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
- [Learning Tracker](LEARNING_TRACKER.md)
- [102 Video Index](VIDEO_INDEX.md)
- [8-Week Study Plan](8-WEEK-STUDY-PLAN.md)
- [Mentor Workflow](MENTOR_WORKFLOW.md)
