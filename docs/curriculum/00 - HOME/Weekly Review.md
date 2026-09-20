---
type: review-system
title: "Weekly Review & Spaced Repetition"
tags:
  - course/sql-server
  - type/review
---

# 📅 Weekly Learning Synthesis & Review Queue

## 🔄 Concepts Due for Spaced Review

```dataview
TABLE WITHOUT ID
  file.link AS "Topic",
  chapter AS "Chapter",
  next_review AS "Due Date",
  confidence AS "Confidence (1-5)"
FROM "01 - COURSE"
WHERE next_review AND next_review <= date(today)
SORT next_review ASC
```

---

## 📝 Weekly Reflection Questions
1. **What did I learn this week?** Synthesize the core database mechanics in 3 bullet points.
2. **What did I implement in SSMS/Docker?** Which SQL scripts did I write from scratch?
3. **What confused me?** Identify concepts where mental models were unclear.
4. **What mistakes did I make?** Document them in [[SQL Server Mistake Journal]].
5. **What can I explain from memory?** Test yourself by teaching a concept out loud.
6. **What can I demonstrate in T-SQL?** Write an automated test asserting the behavior.
7. **How does this connect to Data Engineering?** Relate this week's topics to ETL, pipelines, and storage.
