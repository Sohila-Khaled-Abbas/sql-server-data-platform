import os
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COURSE_DIR = os.path.join(ROOT_DIR, "docs", "curriculum", "01 - COURSE")

CHAPTERS = [
    {
        "folder": "CH01 - Database Creation and Management",
        "id": "CH01",
        "title": "Database Creation and Management",
        "desc": "Physical storage architecture, data pages, extents, multi-filegroups (PRIMARY, DATA_FG, INDEX_FG), declarative constraints, B-Tree indexes, backup chains, and database snapshots.",
        "code": "src/01_storage_and_schema/"
    },
    {
        "folder": "CH02 - SQL Programming Essentials",
        "id": "CH02",
        "title": "SQL Programming Essentials",
        "desc": "Variable scoping, control-of-flow conditional logic, scalar and table-valued functions (MSTVF vs Inline TVF), system databases, script batches, and ACID transaction isolation.",
        "code": "src/03_programmability_and_elt/"
    },
    {
        "folder": "CH03 - Advanced Query Techniques and High Availability",
        "id": "CH03",
        "title": "Advanced Query Techniques and High Availability",
        "desc": "Schema-bound indexed views, sliding window horizontal partitioning, XML generation (FOR XML PATH) and XQuery shredding, recursive CTEs, sequences, TVPs, and high availability architectures.",
        "code": "src/02_indexing_and_performance/"
    },
    {
        "folder": "CH04 - Procedures, Triggers, and SQL Automation",
        "id": "CH04",
        "title": "Procedures, Triggers, and SQL Automation",
        "desc": "Enterprise stored procedures with output parameters, DML & DDL event triggers, inserted/deleted pseudo-tables, audit logging, cursors, C# SQL CLR assemblies, and PowerShell SMO automation.",
        "code": "src/04_governance_and_audit/"
    },
    {
        "folder": "CH05 - Reporting and Data Warehousing",
        "id": "CH05",
        "title": "Reporting and Data Warehousing",
        "desc": "Enterprise reporting with SSRS, matrix aggregation, drill-down actions, OLTP vs OLAP architecture, Kimball star schema dimensional modeling, and capstone platform implementation.",
        "code": "src/07_warehousing_and_reporting/"
    }
]

for ch in CHAPTERS:
    ch_path = os.path.join(COURSE_DIR, ch["folder"])
    if not os.path.exists(ch_path):
        continue
    
    files = sorted([f for f in os.listdir(ch_path) if f.endswith(".md") and f != "README.md"])
    
    lines = [
        "---",
        f"title: \"{ch['id']} — {ch['title']}\"",
        f"chapter: {ch['id']}",
        f"lessons_count: {len(files)}",
        f"code_reference: {ch['code']}",
        "tags:",
        "  - sql-server",
        f"  - chapter/{ch['id'].lower()}",
        "  - pkm",
        "---",
        "",
        f"# {ch['id']} — {ch['title']}",
        "",
        "> [!abstract] Navigation & Hub",
        "> 🏠 [Vault Home](../../00%20-%20HOME/Home.md) · 📊 [Course Dashboard](../../00%20-%20HOME/Course%20Dashboard.md) · 📑 [Course Index](../Course%20Index.md) · 🌐 [Live Platform](https://sohila-khaled-abbas.github.io/sql-server-data-platform/)",
        f"> **Production Code:** [`{ch['code']}`](../../../../{ch['code']})",
        "",
        "## 🎯 Engineering Focus",
        ch["desc"],
        "",
        "---",
        "",
        f"## 📑 Lessons in {ch['id']} ({len(files)} Lessons)",
        "",
        "| # | Lesson Title | Note File | Status |",
        "| :-: | :--- | :--- | :-: |"
    ]
    
    for idx, f in enumerate(files, start=1):
        clean_title = f[:-3]
        if " - " in clean_title:
            clean_title = clean_title.split(" - ", 1)[1]
        lines.append(f"| {idx:02d} | {clean_title} | [{f}]({f.replace(' ', '%20')}) | In Progress |")
    
    lines.extend([
        "",
        "---",
        "",
        "## 📊 Chapter Progress (Dataview)",
        "",
        "```dataview",
        "TABLE status AS \"Status\", difficulty AS \"Difficulty\", code_reference AS \"Code\"",
        f"FROM \"01 - COURSE/{ch['folder']}\"",
        "WHERE type = \"video\"",
        "SORT file.name ASC",
        "```",
        ""
    ])
    
    readme_file = os.path.join(ch_path, "README.md")
    with open(readme_file, "w", encoding="utf-8") as rf:
        rf.write("\n".join(lines))
    print(f"Generated: {readme_file}")

print("All chapter READMEs generated successfully!")
