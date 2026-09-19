# CH05_VID10 — Go to another report action

> **Learning note:** This is a mentor-created study note based on the lesson title and SQL Server subject matter. The Mahara-Tech lesson itself may include demonstrations, terminology, screenshots, or version-specific steps that should be captured in your own observations while watching.

**Course lesson:** [Go to another report action](https://maharatech.gov.eg/mod/hvp/view.php?id=17619)  
**Chapter:** Reporting and Data Warehousing
**Status:** ☐ Watched · ☐ Reproduced · ☐ Understood · ☐ Documented

## 1. What I should learn

By the end of this lesson, I should be able to explain the core idea behind **Go to another report action**, write/reproduce a small working example, and describe when the feature is useful in a real SQL Server data platform.

## 2. Core concept

A report is a semantic and presentation layer. Validate the dataset grain and query performance before spending time on visual formatting.

**Mentor lens:** While watching, note which steps are product-specific UI actions versus durable SQL/database-engineering concepts. Your GitHub notes should preserve the latter.

## 3. SQL / implementation pattern

```sql
-- Reporting design checklist
-- dataset grain
-- filters
-- parameters
-- grouping
-- sort order
-- export format
```

## 4. Data engineering perspective

Think about this topic through four questions:

1. **Correctness:** What data invariant, operational behavior, or workload requirement does it support?
2. **Performance:** What changes the amount of I/O, CPU, memory, locking, or network traffic?
3. **Operations:** How would this behave under failure, deployment, monitoring, backup, or rollback?
4. **Maintainability:** Would another engineer understand the object and safely change it later?

## 5. Hands-on task

Rebuild the lesson example **without pausing and copying line-by-line**. Then make one meaningful modification: change the schema, add an edge case, parameterize the routine, compare two approaches, or test failure behavior.

**My modification:**

```sql
-- Write your own extension here.
```

## 6. Validation checklist

- [ ] I can define the feature in one sentence.
- [ ] I can explain why it exists.
- [ ] I reproduced the basic example successfully.
- [ ] I tested at least one edge case.
- [ ] I can explain one performance/operational trade-off.
- [ ] I linked the final script from my learning repo.

## 7. Mentor checkpoint

**Explain it without SQL:** What problem would this feature solve in a production data platform, and what would you use instead when the feature is the wrong tool?

**My answer:**

> Write your answer here before moving to the next lesson.

## 8. My notes from the video

- Key example shown by instructor:
- Important UI/SSMS step:
- Important syntax/detail:
- Mistake I made:
- Something I want to research:

## 9. Interview / practical question

> When would you choose this technique, and what alternative could solve the same requirement?

## 10. Evidence

- Lesson URL: https://maharatech.gov.eg/mod/hvp/view.php?id=17619
- My SQL script: `../scripts/ch05/vid10-go-to-another-report-action.sql`
- Related docs / links I add later:
