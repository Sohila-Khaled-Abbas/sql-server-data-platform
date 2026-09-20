import os
import re
import glob

def simplify_note(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    fm_match = re.match(r'^---\r?\n(.*?)\r?\n---\r?\n', text, re.DOTALL)
    if not fm_match:
        return False

    fm = fm_match.group(1)
    body = text[fm_match.end():]

    # Extract key fields from frontmatter
    def fm_val(key):
        m = re.search(rf'{key}:\s*"?([^\n"]+)"?', fm)
        return m.group(1).strip() if m else ''

    title = fm_val('title')
    status = fm_val('status').split('#')[0].strip().strip('"')
    course_url = fm_val('course_url')
    code_ref = fm_val('code_reference')

    # Extract navigation callout (keep as-is, it's useful)
    nav_match = re.search(r'(> \[!abstract\] Navigation.*?\n(?:> .*\n)*)', body)
    nav = nav_match.group(1).rstrip() if nav_match else ''

    # Extract checklist states from body
    w = 'x' if re.search(r'\[[xX]\]\s*📺', body) else ' '
    r = 'x' if re.search(r'\[[xX]\]\s*💻', body) else ' '
    m = 'x' if re.search(r'\[[xX]\]\s*🧪', body) else ' '
    d = 'x' if re.search(r'\[[xX]\]\s*🚀', body) else ' '

    # Extract the architectural principle (the one unique piece per note)
    principle = ''
    p_match = re.search(r'>\s*(?:\[!info\].*?\n)?>\s*(.+?)(?:\n|$)', body)
    if p_match:
        # Look for the actual principle text after [!info] Architectural Principle
        p_match2 = re.search(r'\[!info\].*?\n>\s*(.+)', body)
        if p_match2:
            principle = p_match2.group(1).strip()

    # Extract SQL code block (first one only)
    sql_match = re.search(r'```sql\r?\n(.*?)```', body, re.DOTALL)
    sql_code = sql_match.group(1).strip() if sql_match else ''

    # Trim frontmatter: keep only essential properties
    new_fm_lines = []
    for line in fm.split('\n'):
        stripped = line.strip()
        # Skip verbose/redundant properties
        if stripped.startswith('aliases:') or stripped.startswith('- "CH') or stripped.startswith('- "'):
            continue
        new_fm_lines.append(line)
    
    # Actually, keep frontmatter as-is since Dataview queries depend on it
    # Just simplify the body

    # Build clean note
    code_line = f'`{code_ref}`' if code_ref else ''
    course_link = f'[MaharaTech]({course_url})' if course_url else ''

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

> {principle}

## SQL Pattern

```sql
{sql_code}
```

## Notes

<!-- Write your observations, gotchas, and edge cases here -->

## Links

- {course_link}
- {code_line}
"""

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(output)
    return True


def simplify_chapter(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    fm_match = re.match(r'^---\r?\n(.*?)\r?\n---\r?\n', text, re.DOTALL)
    if not fm_match:
        return False
    
    fm = fm_match.group(1)
    body = text[fm_match.end():]

    # Extract title
    title_match = re.search(r'^#\s+(.+)$', body, re.MULTILINE)
    title = title_match.group(1) if title_match else os.path.basename(filepath)

    # Extract navigation callout
    nav_match = re.search(r'(> \[!abstract\].*?\n(?:> .*\n)*)', body)
    nav = nav_match.group(1).rstrip() if nav_match else ''

    # Extract chapter focus
    focus_match = re.search(r'> \[!info\] Chapter Focus.*?\n> (.+)', body)
    focus = focus_match.group(1).strip() if focus_match else ''

    # Extract chapter number for dataview
    ch_match = re.search(r'ch(\d+)', filepath)
    ch_num = f"ch0{ch_match.group(1)}" if ch_match and len(ch_match.group(1)) == 1 else f"ch{ch_match.group(1)}" if ch_match else ''

    # Extract the interactive checklist (keep all the `- [ ]` and `- [x]` lines with wikilinks)
    checklist_lines = re.findall(r'^- \[[xX ]\] .+$', body, re.MULTILINE)
    checklist = '\n'.join(checklist_lines) if checklist_lines else ''

    output = f"""---
{fm}
---

# {title}

{nav}

> {focus}

---

## Lesson Checklist

{checklist}

---

## Progress

```dataview
TABLE WITHOUT ID
  file.link AS "Lesson",
  choice(status = "completed", "✅", choice(status = "in-progress", "🔄", "⏳")) AS "Status"
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
"""

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(output)
    return True


def main():
    # Simplify all 102 video notes
    notes = glob.glob('docs/curriculum/video-notes/**/*.md', recursive=True)
    count = 0
    for n in notes:
        if simplify_note(n):
            count += 1
    print(f"Simplified {count} video notes.")

    # Simplify chapter readmes
    chapters = glob.glob('docs/curriculum/chapters/ch*-readme.md')
    ch_count = 0
    for c in chapters:
        if simplify_chapter(c):
            ch_count += 1
    print(f"Simplified {ch_count} chapter readmes.")


if __name__ == '__main__':
    main()
