---
type: course-audit
title: "Course Catalog Audit & Discrepancy Analysis"
tags:
  - course/sql-server
  - type/audit
---

# Course Catalog Audit — Discrepancies and Validation

## 🎯 Purpose
This document transparently audits the relationship between the official MaharaTech portal metadata ([Course 2305](https://maharatech.gov.eg/course/view.php?id=2305)) and the verified 102-lesson curriculum catalog implemented in this Second Brain.

## 📊 Catalog Discrepancy Analysis
- **Portal Reported Video Count**: Depending on the MaharaTech portal view, the course reports 6 chapters or up to 104–108 media items.
- **Supplied & Verified Lesson List**: Exactly **102 distinct lesson modules** spanning CH01 through CH05 plus the Capstone Final Project.
- **Root Cause of Discrepancy**:
  1. The portal counts intro overview clips, course evaluation surveys, and standalone assignment briefs as individual media objects.
  2. In this vault, all educational lecture modules and assignments are rigorously structured into 102 canonical lesson notes.
  3. **Strict Policy**: We do **NOT** invent missing lessons. Every note maps to a verified lesson title, MaharaTech module ID (17520 through 17629), and authentic repository code artifact.

## 🛡️ Evidence Hierarchy
1. **VERIFIED FROM COURSE**: Direct lecture module ID and title from MaharaTech 2305.
2. **VERIFIED FROM MICROSOFT DOCUMENTATION**: T-SQL language specifications, engine internals, and DMV behaviors.
3. **MENTOR EXPLANATION**: Data Engineering lens, architectural rationale, and production considerations.
4. **USER PRACTICE**: Hands-on labs, challenges, and personal observations.
