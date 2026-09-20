import os
import re
import glob

PLATFORM_URL = "https://sohila-khaled-abbas.github.io/sql-server-data-platform/"
REPO_URL = "https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform"

CHAPTER_THEMES = {
    "CH01": {
        "domain": "Storage & Physical Architecture",
        "icon": "🏗️",
        "eval": "How does this affect page allocation, filegroup isolation, or backup chain integrity?",
        "platform_anchor": "#architecture",
        "platform_title": "OmniFlow Physical Storage Architecture",
        "roadmap": """```mermaid
graph LR
    A["MDF/LDF/NDF Storage & Filegroups"] --> B["Declarative Constraints & Rules"]
    B --> C["Clustered & Non-Clustered Indexes"]
    C --> D["Full, Diff & Log Backup Chains"]
    D --> E["NTFS Sparse Database Snapshots"]
```"""
    },
    "CH02": {
        "domain": "T-SQL Programming & ACID",
        "icon": "⚙️",
        "eval": "How does this affect variable scope, transaction isolation, or batch execution?",
        "platform_anchor": "#sql-engineering",
        "platform_title": "OmniFlow SQL Engineering Showcase",
        "roadmap": """```mermaid
graph LR
    A["Variable Scopes & Types"] --> B["Control-of-Flow Logic"]
    B --> C["Scalar & Table-Valued UDFs"]
    C --> D["System Catalogs & Temp Tables"]
    D --> E["Batches, Transactions & ACID"]
```"""
    },
    "CH03": {
        "domain": "Views, XML & High Availability",
        "icon": "🔄",
        "eval": "How does this affect query abstraction, data partitioning, or failover topology?",
        "platform_anchor": "#data-flow",
        "platform_title": "OmniFlow High-Throughput Data Flow",
        "roadmap": """```mermaid
graph LR
    A["Standard & Indexed Views"] --> B["Horizontal Table Partitioning"]
    B --> C["XML Parsing & Shredding"]
    C --> D["Hierarchical CTEs & TVPs"]
    D --> E["Log Shipping & DB Mirroring"]
```"""
    },
    "CH04": {
        "domain": "Programmability & Automation",
        "icon": "🤖",
        "eval": "How does this affect procedural encapsulation, audit trail integrity, or CLR safety?",
        "platform_anchor": "#deep-dive",
        "platform_title": "OmniFlow Technical Deep Dive & Governance",
        "roadmap": """```mermaid
graph LR
    A["Stored Procedures & Dynamic SQL"] --> B["DML & DDL Event Triggers"]
    B --> C["Audit Trail & OUTPUT Clause"]
    C --> D["Cursor Workflows vs Set-Based"]
    D --> E["C# SQL CLR & PowerShell SMO"]
```"""
    },
    "CH05": {
        "domain": "Reporting & Data Warehousing",
        "icon": "📊",
        "eval": "How does this affect report rendering, dimensional modeling, or ETL pipeline design?",
        "platform_anchor": "#database-design",
        "platform_title": "OmniFlow Dimensional Star Schema",
        "roadmap": """```mermaid
graph LR
    A["SSRS Server & Datasets"] --> B["Matrix Grouping & Expressions"]
    B --> C["Parameters & RDLC Reports"]
    C --> D["OLTP vs OLAP Foundations"]
    D --> E["Kimball Star Schema Mart"]
```"""
    },
}


def get_chapter_key(fm):
    m = re.search(r'chapter:\s*"?(CH\d+)', fm)
    return m.group(1) if m else "CH01"


def enrich_note(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    fm_match = re.match(r'^---\r?\n(.*?)\r?\n---\r?\n', text, re.DOTALL)
    if not fm_match:
        return False

    fm = fm_match.group(1)
    body = text[fm_match.end():]

    def fm_val(key):
        m = re.search(rf'{key}:\s*"?([^\n"]+)"?', fm)
        return m.group(1).strip() if m else ''

    title = fm_val('title')
    course_url = fm_val('course_url')
    code_ref = fm_val('code_reference')
    ch_key = get_chapter_key(fm)
    theme = CHAPTER_THEMES.get(ch_key, CHAPTER_THEMES["CH01"])

    topic = title.split('—')[-1].strip() if '—' in title else title

    nav_match = re.search(r'(> \[!abstract\].*?\n(?:> .*\n)*)', body)
    nav = nav_match.group(1).rstrip() if nav_match else ''

    w = 'x' if re.search(r'\[[xX]\]\s*Watched', body) else ' '
    r = 'x' if re.search(r'\[[xX]\]\s*Reproduced', body) else ' '
    m = 'x' if re.search(r'\[[xX]\]\s*Tested', body) else ' '
    d = 'x' if re.search(r'\[[xX]\]\s*Documented', body) else ' '

    concept = ''
    c_match = re.search(r'## Key Concept\s*\n\s*>\s*(?:\[!info\][^\n]*\n>\s*)?(.+)', body)
    if c_match:
        concept = c_match.group(1).strip()

    sql_match = re.search(r'```sql\r?\n(.*?)```', body, re.DOTALL)
    sql_code = sql_match.group(1).strip() if sql_match else ''

    ch_folder = os.path.basename(os.path.dirname(filepath))
    platform_target = f"{PLATFORM_URL}{theme['platform_anchor']}"

    output = f"""---
{fm}
---

# {title}

{nav}

## Progress
- [{w}] Watched
- [{r}] Reproduced in SSMS
- [{m}] Tested edge cases
- [{d}] Documented

---

## Key Concept

> [!info] {theme['icon']} {theme['domain']}
> {concept}

## SQL Pattern

```sql
{sql_code}
```

## Evaluation

| Aspect | Question |
| :--- | :--- |
| **Correctness** | What invariant or constraint does **{topic}** enforce? |
| **Performance** | {theme['eval']} |
| **Trade-offs** | When is this the wrong tool? What's the alternative? |

## My Notes

> [!note] Observations
> <!-- What did you notice while reproducing this? -->

> [!warning] Gotchas
> <!-- Edge cases, silent failures, or unintuitive behavior -->

> [!tip] Production Tip
> <!-- How would you apply this in a real data platform? -->

---

## Related Lessons

```dataview
LIST
FROM "video-notes/{ch_folder}"
WHERE file.path != this.file.path
SORT file.name ASC
LIMIT 5
```

## Links

| Resource | Link |
| :--- | :--- |
| Official Lesson | [MaharaTech]({course_url}) |
| Production Code | `{code_ref}` |
| Live Platform | [{theme['platform_title']}]({platform_target}) |
| Platform Curriculum | [OmniFlow Curriculum Hub]({PLATFORM_URL}#curriculum) |
| Source on GitHub | [Repository]({REPO_URL}/blob/master/{code_ref}) |
"""

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(output)
    return True


def enrich_chapter(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    fm_match = re.match(r'^---\r?\n(.*?)\r?\n---\r?\n', text, re.DOTALL)
    if not fm_match:
        return False

    fm = fm_match.group(1)
    body = text[fm_match.end():]

    title_match = re.search(r'^#\s+(.+)$', body, re.MULTILINE)
    title = title_match.group(1) if title_match else os.path.basename(filepath)

    nav_match = re.search(r'(> \[!abstract\].*?\n(?:> .*\n)*)', body)
    nav = nav_match.group(1).rstrip() if nav_match else ''

    focus_match = re.search(r'^>\s+(?!.*\[!)(.*\.)$', body, re.MULTILINE)
    focus = focus_match.group(1).strip() if focus_match else ''
    if not focus:
        f2 = re.search(r'> \[!info\] [^\n]*?\s+(.*\.)$', body, re.MULTILINE)
        focus = f2.group(1).strip() if f2 else 'Enterprise database engineering patterns and mastery path.'

    ch_match = re.search(r'ch(\d+)', filepath)
    ch_num = f"ch0{ch_match.group(1)}" if ch_match and len(ch_match.group(1)) == 1 else f"ch{ch_match.group(1)}" if ch_match else ''
    ch_key = f"CH0{ch_match.group(1)}" if ch_match and len(ch_match.group(1)) == 1 else f"CH{ch_match.group(1)}" if ch_match else ''
    theme = CHAPTER_THEMES.get(ch_key, CHAPTER_THEMES["CH01"])

    checklist_lines = re.findall(r'^- \[[xX ]\] .+$', body, re.MULTILINE)
    checklist = '\n'.join(checklist_lines)

    platform_target = f"{PLATFORM_URL}{theme['platform_anchor']}"

    output = f"""---
{fm}
---

# {title}

{nav}

> [!info] {theme['icon']} {focus}

---

## Learning Path Roadmap

{theme['roadmap']}

---

## Lesson Checklist

{checklist}

---

## Progress Dashboard

```dataview
TABLE WITHOUT ID
  file.link AS "Lesson",
  choice(status = "completed", "✅", choice(status = "in-progress", "🔄", "⏳")) AS "Status",
  code_reference AS "Code"
FROM "video-notes/{ch_num}"
SORT file.name ASC
```

## Open Tasks

```dataview
TASK
FROM "video-notes/{ch_num}"
WHERE !completed
GROUP BY file.link
LIMIT 15
```

---

## Links

| Resource | Link |
| :--- | :--- |
| Curriculum Overview | [README](../README.md) |
| Learning Tracker | [Tracker](../LEARNING_TRACKER.md) |
| 8-Week Plan | [Study Plan](../8-WEEK-STUDY-PLAN.md) |
| Live Platform Target | [{theme['platform_title']}]({platform_target}) |
| Platform Curriculum | [OmniFlow Curriculum & Second Brain]({PLATFORM_URL}#curriculum) |
"""

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(output)
    return True


def main():
    notes = glob.glob('docs/curriculum/video-notes/**/*.md', recursive=True)
    count = sum(1 for n in notes if enrich_note(n))
    print(f"Enriched {count} video notes.")

    chapters = glob.glob('docs/curriculum/chapters/ch*-readme.md')
    ch_count = sum(1 for c in chapters if enrich_chapter(c))
    print(f"Enriched {ch_count} chapter readmes.")


if __name__ == '__main__':
    main()
