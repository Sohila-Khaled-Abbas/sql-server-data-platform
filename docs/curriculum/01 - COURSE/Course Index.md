---
type: course-index
title: "Master Course Index"
tags:
  - course/sql-server
  - type/index
---

# 📑 Master Course Index — 102 Lessons

```dataview
TABLE WITHOUT ID
  file.link AS "Lesson",
  chapter AS "Chapter",
  difficulty AS "Difficulty",
  choice(status = "mastered", "✅ Mastered", choice(status = "practiced", "🔄 Practiced", "⏳ Remaining")) AS "Status",
  code_reference AS "Code Artifact"
FROM "01 - COURSE"
WHERE type = "video"
SORT chapter ASC, file.name ASC
```
