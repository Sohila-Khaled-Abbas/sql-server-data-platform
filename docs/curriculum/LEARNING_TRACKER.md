---
title: "Learning Tracker"
aliases:
  - "Learning Tracker"
  - "Progress Tracker"
tags:
  - sql-server
  - curriculum-tracker
  - maharatech
total_lessons: 102
date_created: 2026-09-19
last_modified: 2026-09-20
---

# Learning Tracker

> [!abstract] Navigation
> [Curriculum Overview](README.md) · [8-Week Study Plan](8-WEEK-STUDY-PLAN.md) · [Video Index](VIDEO_INDEX.md)

---

## Course Progress

```dataview
TABLE WITHOUT ID
  file.folder AS "Chapter",
  length(rows) AS "Total",
  length(filter(rows, (r) => r.status = "completed")) AS "✅",
  length(filter(rows, (r) => r.status = "in-progress")) AS "🔄",
  length(filter(rows, (r) => r.status = "planned" OR !r.status)) AS "⏳",
  round((length(filter(rows, (r) => r.status = "completed")) / length(rows)) * 100) + "%" AS "%"
FROM "video-notes"
GROUP BY file.folder
SORT file.folder ASC
```

---

## All Lessons

```dataview
TABLE WITHOUT ID
  file.link AS "Lesson",
  choice(status = "completed", "✅", choice(status = "in-progress", "🔄", "⏳")) AS "Status",
  chapter AS "Chapter"
FROM "video-notes"
SORT file.name ASC
```

---

## Open Tasks

```dataview
TASK
FROM "video-notes"
WHERE !completed
GROUP BY file.link
LIMIT 30
```

---

## Links

| Resource | Link |
| :--- | :--- |
| Curriculum Overview | [README](README.md) |
| 8-Week Study Plan | [8-Week Plan](8-WEEK-STUDY-PLAN.md) |
| 102 Video Index | [Video Index](VIDEO_INDEX.md) |
| Live Platform | [OmniFlow Web App](https://sohila-khaled-abbas.github.io/sql-server-data-platform/) |
| Platform Curriculum | [OmniFlow Curriculum & Second Brain](https://sohila-khaled-abbas.github.io/sql-server-data-platform/#curriculum) |

