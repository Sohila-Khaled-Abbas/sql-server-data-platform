---
title: "SQL Server Objects — Curriculum & Second Brain"
aliases:
  - "Curriculum Hub"
tags:
  - sql-server
  - curriculum-hub
  - maharatech
  - second-brain
total_chapters: 5
total_lessons: 102
total_concepts: 33
total_patterns: 18
---

# 🧠 SQL Server Objects — Curriculum & Second Brain Hub

Welcome to the **Personal Knowledge Management (PKM) Second Brain** for **[MaharaTech Course 2305: Implementing and Developing SQL Server Objects](https://maharatech.gov.eg/course/view.php?id=2305)** (Information Technology Institute - ITI), instructed by Eng. Rami Mohamed Abonagi.

This vault is systematically structured according to an enterprise 10-folder PKM hierarchy designed to serve as both an intensive learning accelerator and a long-term production reference for Database Reliability Engineering (DBRE).

---

## 🚀 Quick Navigation

| Hub / Dashboard | Description | Target |
| :--- | :--- | :--- |
| 🏠 **Home** | Master Launchpad & Quick Links | [`00 - HOME/Home.md`](00%20-%20HOME/Home.md) |
| 📊 **Course Dashboard** | Dynamic Dataview Progress & Metrics | [`00 - HOME/Course Dashboard.md`](00%20-%20HOME/Course%20Dashboard.md) |
| 🗺️ **Learning Roadmap** | 6-Phase DBRE Career Progression Path | [`00 - HOME/Learning Roadmap.md`](00%20-%20HOME/Learning%20Roadmap.md) |
| 📅 **Weekly Review** | Spaced Repetition Cadence & Reflection | [`00 - HOME/Weekly Review.md`](00%20-%20HOME/Weekly%20Review.md) |
| 💼 **Interview Dashboard** | T-SQL & DBRE Scenario Interview Tracker | [`00 - HOME/Interview Dashboard.md`](00%20-%20HOME/Interview%20Dashboard.md) |
| 📑 **Course Index** | Complete Hierarchical Tree of 102 Lessons | [`01 - COURSE/Course Index.md`](01%20-%20COURSE/Course%20Index.md) |
| 🛡️ **Course Audit** | Discrepancy & Validation Report | [`01 - COURSE/Course Audit - Discrepancies and Validation.md`](01%20-%20COURSE/Course%20Audit%20-%20Discrepancies%20and%20Validation.md) |
| 🌐 **Live Web Platform** | Interactive Browser SQL Studio & Showcase | [Launch Platform](https://sohila-khaled-abbas.github.io/sql-server-data-platform/) |

---

## 📂 Vault Hierarchy Overview

```text
docs/curriculum/
├── 00 - HOME/          # Central launchpad, dynamic Dataview dashboards, roadmap, weekly review
├── 01 - COURSE/        # 102 structured video notes across CH01–CH05 + Final Project + Course Audit
├── 02 - CONCEPTS/      # 33 atomic concept notes across 10 architectural domains
├── 03 - SQL PATTERNS/  # 18 production T-SQL pattern cookbook notes
├── 04 - LAB/           # Lab assignments 01–05, physical storage diagrams, Kimball bus matrix
├── 05 - PROJECTS/      # 5 Chapter mini-projects + 11-part final project suite + case study
├── 06 - REVISION/      # 20 syntax cheat sheets, flashcards, interview handbook, mistake journal
├── 07 - RESOURCES/     # Official Microsoft SQL Server docs, course resources, DBRE bibliography
├── 08 - TEMPLATES/     # 7 standardized templates for notes, concepts, patterns, and reviews
└── 99 - ATTACHMENTS/   # Visual architecture diagrams and media assets
```

---

## 📚 Curriculum Chapters

| Chapter | Focus Area | Lessons | Primary Concepts | Code Reference |
| :--- | :--- | :---: | :--- | :--- |
| **CH01** | Database Creation & Management | 16 | Filegroups, Extents, Constraints, Snapshots, Backups | [`src/01_storage_and_schema/`](../../src/01_storage_and_schema/) |
| **CH02** | SQL Programming Essentials | 15 | Control of Flow, Inline vs MSTVF vs Scalar, Variables | [`src/03_programmability_and_elt/`](../../src/03_programmability_and_elt/) |
| **CH03** | Advanced Query & High Availability | 23 | B-Trees, Covering Indexes, Indexed Views, XML, Log Shipping | [`src/02_indexing_and_performance/`](../../src/02_indexing_and_performance/) |
| **CH04** | Procedures, Triggers & Automation | 27 | Stored Procedures, Audit Triggers, DDL Defense, CLR, SMO | [`src/04_governance_and_audit/`](../../src/04_governance_and_audit/) |
| **CH05** | Reporting & Data Warehousing | 20 | SSRS, Matrix Reports, OLTP vs OLAP, Star Schema, SCD 2 | [`src/07_warehousing_and_reporting/`](../../src/07_warehousing_and_reporting/) |
| **Capstone** | Enterprise Data Platform Project | 1 | End-to-end integration, performance tuning, testing | [`tests/`](../../tests/) |

---

## 🎯 The 4-Stage Mastery Workflow

For every lesson module, follow the four-stage engineering methodology:

1. **Stage 1: Watched** — Watch the official MaharaTech lecture video and verify the core concepts.
2. **Stage 2: Reproduced** — Run and validate the **Mentor Example** in SSMS or containerized SQL Server 2022.
3. **Stage 3: Modified** — Solve the **Hands-On Lab** and **Challenge**, testing edge cases and boundary failures.
4. **Stage 4: Documented & Explained** — Complete the **Mentor Challenge**, capture execution plans, and synthesize findings in **My Notes**.

---

## 🎨 Obsidian Setup & Customization

This vault includes a pre-configured theme snippet:
- **Location:** [`.obsidian/snippets/second-brain.css`](.obsidian/snippets/second-brain.css)
- **Palette:** Dark charcoal base (`#16181D`), elevated panel cards (`#1E222B`), and Microsoft SQL Red accents (`#CC292B`).
- **Plugins Supported:** Dataview, Tasks, Omnisearch, Smart Connections, and Templater.
