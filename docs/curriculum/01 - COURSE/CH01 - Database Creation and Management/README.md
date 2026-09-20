---
title: "CH01 — Database Creation and Management"
chapter: CH01
lessons_count: 16
code_reference: src/01_storage_and_schema/
tags:
  - sql-server
  - chapter/ch01
  - pkm
---

# CH01 — Database Creation and Management

> [!abstract] Navigation & Hub
> 🏠 [Vault Home](../../00%20-%20HOME/Home.md) · 📊 [Course Dashboard](../../00%20-%20HOME/Course%20Dashboard.md) · 📑 [Course Index](../Course%20Index.md) · 🌐 [Live Platform](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)
> **Production Code:** [`src/01_storage_and_schema/`](../../../../src/01_storage_and_schema/)

## 🎯 Engineering Focus
Physical storage architecture, data pages, extents, multi-filegroups (PRIMARY, DATA_FG, INDEX_FG), declarative ANSI constraints, legacy standalone rules & defaults (`CREATE RULE`, `sp_bindrule`, `sp_unbindrule`, `DROP RULE`, `CREATE DEFAULT`, `sp_bindefault`, `sp_unbindefault`), B-Tree indexes, backup chains, and database snapshots.

> [!tip] Verified Live Telemetry
> - [Live DB2 Integrity Constraints Telemetry (CH01_VID05)](../../../../docs/db2-integrity-constraints-live.md)
> - [Live ITI Rules & Defaults Telemetry (CH01_VID06)](../../../../docs/ch01-vid06-constraints-rules-defaults-live.md)

---

## 📑 Lessons in CH01 (16 Lessons)

| # | Lesson Title | Note File | Status |
| :-: | :--- | :--- | :-: |
| 01 | Create Database and Filegroups | [CH01_VID01 - Create Database and Filegroups.md](CH01_VID01%20-%20Create%20Database%20and%20Filegroups.md) | In Progress |
| 02 | Create Database Using Wizard | [CH01_VID02 - Create Database Using Wizard.md](CH01_VID02%20-%20Create%20Database%20Using%20Wizard.md) | In Progress |
| 03 | Create Database Using Code | [CH01_VID03 - Create Database Using Code.md](CH01_VID03%20-%20Create%20Database%20Using%20Code.md) | In Progress |
| 04 | Database Integrity | [CH01_VID04 - Database Integrity.md](CH01_VID04%20-%20Database%20Integrity.md) | In Progress |
| 05 | Integrity constraints | [CH01_VID05 - Integrity constraints.md](CH01_VID05%20-%20Integrity%20constraints.md) | In Progress |
| 06 | Constraints, Rules, and Default Values | [CH01_VID06 - Constraints, Rules, and Default Values.md](CH01_VID06%20-%20Constraints,%20Rules,%20and%20Default%20Values.md) | In Progress |
| 07 | Creating a Custom Data Type | [CH01_VID07 - Creating a Custom Data Type.md](CH01_VID07%20-%20Creating%20a%20Custom%20Data%20Type.md) | In Progress |
| 08 | Clustered Index | [CH01_VID08 - Clustered Index.md](CH01_VID08%20-%20Clustered%20Index.md) | In Progress |
| 09 | Non-Clustered Index | [CH01_VID09 - Non-Clustered Index.md](CH01_VID09%20-%20Non-Clustered%20Index.md) | In Progress |
| 10 | Demo on Index | [CH01_VID10 - Demo on Index.md](CH01_VID10%20-%20Demo%20on%20Index.md) | In Progress |
| 11 | Types of Backup | [CH01_VID11 - Types of Backup.md](CH01_VID11%20-%20Types%20of%20Backup.md) | In Progress |
| 12 | Backup Database Using Wizard | [CH01_VID12 - Backup Database Using Wizard.md](CH01_VID12%20-%20Backup%20Database%20Using%20Wizard.md) | In Progress |
| 13 | Backup & SQL server agent jobs | [CH01_VID13 - Backup & SQL server agent jobs.md](CH01_VID13%20-%20Backup%20&%20SQL%20server%20agent%20jobs.md) | In Progress |
| 14 | Snapshot DB | [CH01_VID14 - Snapshot DB.md](CH01_VID14%20-%20Snapshot%20DB.md) | In Progress |
| 15 | Demo on Snapshot | [CH01_VID15 - Demo on Snapshot.md](CH01_VID15%20-%20Demo%20on%20Snapshot.md) | In Progress |
| 16 | Assignment 01 | [CH01_VID16 - Assignment 01.md](CH01_VID16%20-%20Assignment%2001.md) | In Progress |

---

## 📊 Chapter Progress (Dataview)

```dataview
TABLE status AS "Status", difficulty AS "Difficulty", code_reference AS "Code"
FROM "01 - COURSE/CH01 - Database Creation and Management"
WHERE type = "video"
SORT file.name ASC
```
