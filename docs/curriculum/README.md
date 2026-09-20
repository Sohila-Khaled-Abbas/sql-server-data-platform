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
> 🏠 **Second Brain:** [Home](00%20-%20HOME/Home.md) · [Course Dashboard](00%20-%20HOME/Course%20Dashboard.md) · [Learning Roadmap](00%20-%20HOME/Learning%20Roadmap.md) · [Learning Tracker](LEARNING_TRACKER.md) · [102 Video Index](VIDEO_INDEX.md)
> **Source:** [MaharaTech Course 2305](https://maharatech.gov.eg/course/view.php?id=2305) · ITI · Eng. Rami Mohamed Abonagi
> **Scope:** 5 Chapters · 102 Videos · Production code in [`src/`](../../src/)

---

## Chapters

| Chapter | Topic | Lessons | Guide | Code |
| :--- | :--- | :---: | :--- | :--- |
| **CH01** | Database Creation & Storage | 16 | [CH01](01%20-%20COURSE/CH01%20-%20Database%20Creation%20and%20Management/) | [`src/01_storage_and_schema/`](../../src/01_storage_and_schema/) |
| **CH02** | SQL Programming & Transactions | 15 | [CH02](01%20-%20COURSE/CH02%20-%20SQL%20Programming%20Essentials/) | [`src/03_programmability_and_elt/`](../../src/03_programmability_and_elt/) |
| **CH03** | Views, Partitioning & HA | 23 | [CH03](01%20-%20COURSE/CH03%20-%20Advanced%20Query%20Techniques%20and%20High%20Availability/) | [`src/02_indexing_and_performance/`](../../src/02_indexing_and_performance/) |
| **CH04** | Procedures, Triggers & CLR | 27 | [CH04](01%20-%20COURSE/CH04%20-%20Procedures,%20Triggers,%20and%20SQL%20Automation/) | [`src/04_governance_and_audit/`](../../src/04_governance_and_audit/) |
| **CH05** | SSRS & Data Warehousing | 20 | [CH05](01%20-%20COURSE/CH05%20-%20Reporting%20and%20Data%20Warehousing/) | [`src/07_warehousing_and_reporting/`](../../src/07_warehousing_and_reporting/) |
| **Final** | Capstone Project | 1 | [Final Project](01%20-%20COURSE/Final%20Project/) | [`tests/`](../../tests/) |

---

## Progress

```dataview
TABLE length(rows) AS "Total",
      length(filter(rows, (r) => r.status = "mastered" OR r.status = "completed")) AS "✅",
      length(filter(rows, (r) => r.status = "practiced" OR r.status = "in-progress")) AS "🔄",
      length(filter(rows, (r) => r.status = "not-started" OR !r.status)) AS "⏳"
FROM "01 - COURSE"
WHERE type = "video"
GROUP BY chapter
```

## In Progress

```dataview
TABLE chapter AS "Chapter", code_reference AS "Code"
FROM "01 - COURSE"
WHERE type = "video" AND (status = "practiced" OR status = "in-progress")
SORT file.name ASC
```

---

## Links

- [OmniFlow Live Platform](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
- [OmniFlow Curriculum & Second Brain Hub](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum)
- [Learning Tracker](LEARNING_TRACKER.md)
- [102 Video Index](VIDEO_INDEX.md)
- [8-Week Study Plan](8-WEEK-STUDY-PLAN.md)
- [Mentor Workflow](MENTOR_WORKFLOW.md)
