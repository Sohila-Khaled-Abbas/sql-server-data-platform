---
type: dashboard
title: "Course Dashboard"
aliases:
  - "Dashboard"
tags:
  - course/sql-server
  - type/dashboard
---

# 📊 SQL Server Course Dashboard

> [!abstract] Navigation
> [Home](Home.md) · [Learning Roadmap](Learning%20Roadmap.md) · [Weekly Review](Weekly%20Review.md) · [Interview Dashboard](Interview%20Dashboard.md)

---

## 📈 Chapter Progress Summary

```dataview
TABLE WITHOUT ID
  chapter AS "Chapter",
  length(rows) AS "Total Lessons",
  length(filter(rows, (r) => r.status = "mastered" OR r.status = "completed")) AS "✅ Mastered",
  length(filter(rows, (r) => r.status = "practiced" OR r.status = "in-progress")) AS "🔄 Practiced",
  length(filter(rows, (r) => r.status = "not-started" OR !r.status)) AS "⏳ Remaining",
  round((length(filter(rows, (r) => r.status = "mastered" OR r.status = "completed")) / length(rows)) * 100) + "%" AS "Progress"
FROM "01 - COURSE"
WHERE type = "video"
GROUP BY chapter
SORT chapter ASC
```

---

## ⏳ Lessons Remaining

```dataview
TABLE WITHOUT ID
  file.link AS "Lesson",
  chapter AS "Chapter",
  difficulty AS "Difficulty",
  estimated_minutes AS "Est. Min"
FROM "01 - COURSE"
WHERE type = "video" AND (status = "not-started" OR !status)
SORT chapter ASC, file.name ASC
LIMIT 15
```

---

## 🧪 Needs Practice (Watched but not yet Reproduced)

```dataview
TABLE WITHOUT ID
  file.link AS "Lesson",
  chapter AS "Chapter",
  code_reference AS "Code Ref"
FROM "01 - COURSE"
WHERE type = "video" AND practice = false AND status != "not-started"
SORT chapter ASC
LIMIT 15
```

---

## ⚠️ Difficult Lessons Queue

```dataview
TABLE WITHOUT ID
  file.link AS "Lesson",
  chapter AS "Chapter",
  difficulty AS "Difficulty"
FROM "01 - COURSE"
WHERE type = "video" AND difficulty = "hard"
SORT chapter ASC
```
