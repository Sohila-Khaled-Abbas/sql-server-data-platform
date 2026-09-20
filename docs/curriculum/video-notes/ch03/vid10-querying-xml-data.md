---
title: "CH03_VID10 — Querying XML data"
aliases:
  - "CH03_VID10"
  - "Querying XML data"
chapter: "CH03 — Advanced Query Techniques and High Availability"
lesson: "VID10"
tags:
  - sql-server
  - dbre
  - data-engineering
  - advanced-queries-ha
  - maharatech
status: "planned" # planned | in-progress | completed
course_url: "https://maharatech.gov.eg/mod/hvp/view.php?id=17562"
code_reference: "src/03_programmability_and_elt/02_xml_shredding_and_generation.sql"
date_created: 2026-09-19
last_modified: 2026-09-19
---

# CH03_VID10 — Querying XML data

> [!abstract] Navigation & Metadata
> ⬅️ **Previous:** [CH03_VID09 — Use Path Mode with For XML](vid09-use-path-mode-with-for-xml.md) | 📑 **Index:** [102 Video Index](../../VIDEO_INDEX.md) | ➡️ **Next:** [CH03_VID11 — Hierarchical Data](vid11-hierarchical-data.md)  
> 📌 **Chapter:** [CH03 — Advanced Query Techniques and High Availability](../../chapters/ch03-readme.md) · **Official Lesson:** [MaharaTech 17562](https://maharatech.gov.eg/mod/hvp/view.php?id=17562)

## Progress
- [ ] Watched
- [ ] Reproduced in SSMS
- [ ] Tested edge cases
- [ ] Documented

---

## Key Concept

> SQL Server supports generating and querying XML. Learn when XML is appropriate and distinguish it from modern JSON/API-oriented designs.

## SQL Pattern

```sql
SELECT CustomerID, Name
FROM dbo.Customer
FOR XML PATH('Customer'), ROOT('Customers');
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- [MaharaTech](https://maharatech.gov.eg/mod/hvp/view.php?id=17562)
- `src/03_programmability_and_elt/02_xml_shredding_and_generation.sql`
