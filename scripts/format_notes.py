import os
import re
import glob

def clean_note(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()

    fm_match = re.match(r'^---\n(.*?)\n---\n', text, re.DOTALL)
    if not fm_match:
        print(f"Skipping {filepath}: No frontmatter found")
        return False
    
    fm = fm_match.group(1)
    body = text[fm_match.end():]

    # Extract title
    title_match = re.search(r'^#\s+(.+)$', body, re.MULTILINE)
    title = title_match.group(1) if title_match else os.path.splitext(os.path.basename(filepath))[0]

    # Extract Navigation & Metadata callout
    nav_match = re.search(r'(> \[!abstract\] Navigation & Metadata\n(?:> .*\n)+)', body)
    nav_callout = nav_match.group(1).strip() if nav_match else ''

    # Extract status from frontmatter
    status_match = re.search(r'status:\s*"?([a-zA-Z_-]+)"?', fm)
    status = status_match.group(1) if status_match else 'planned'
    is_completed = (status == 'completed')

    # Check state of individual checklist items
    w_check = 'x' if is_completed or re.search(r'\[[xX]\]\s*📺', body) else ' '
    r_check = 'x' if is_completed or re.search(r'\[[xX]\]\s*💻', body) else ' '
    m_check = 'x' if is_completed or re.search(r'\[[xX]\]\s*🧪', body) else ' '
    d_check = 'x' if is_completed or re.search(r'\[[xX]\]\s*📝', body) else ' '

    # Extract code reference
    code_match = re.search(r'code_reference:\s*"?([^\n"]+)"?', fm)
    code_ref = code_match.group(1) if code_match else 'src/'

    # Extract Learning Objectives
    obj_match = re.search(r'## 1\. Learning Objectives\s*\n\s*(.*?)(?=\n##|\Z)', body, re.DOTALL)
    obj_text = obj_match.group(1).strip() if obj_match else ''

    # Extract Core Architectural Concept
    concept_match = re.search(r'## 2\. Core Architectural Concept\s*\n\s*(.*?)(?=\n##|\Z)', body, re.DOTALL)
    concept_text = concept_match.group(1).strip() if concept_match else ''
    # Clean redundant nested '>>>' to single '>'
    concept_text = re.sub(r'>\s*>\s*>\s*', '> ', concept_text)

    # Extract SQL Implementation Pattern
    sql_match = re.search(r'## 3\. SQL Implementation Pattern\s*\n\s*(.*?)(?=\n##|\Z)', body, re.DOTALL)
    sql_text = sql_match.group(1).strip() if sql_match else ''

    # Extract Hands-on Reproduction & Modification Drill
    drill_match = re.search(r'## 5\. Hands-on Reproduction & Modification Drill\s*\n\s*(.*?)(?=\n##|\Z)', body, re.DOTALL)
    drill_text = drill_match.group(1).strip() if drill_match else ''

    # Extract Mentor Checkpoint challenge question
    mentor_match = re.search(r'## 7\. Mentor Checkpoint & Interview Drill\s*\n\s*(.*?)(?=\n##|\Z)', body, re.DOTALL)
    mentor_text = mentor_match.group(1).strip() if mentor_match else ''
    q_match = re.search(r'\*\*Explain without SQL:\*\*[^\n]+', mentor_text)
    q_str = q_match.group(0) if q_match else '**Explain without SQL:** What problem would this feature solve in a production data platform, and what would you use instead when the feature is the wrong tool?'

    # Extract Evidence Links
    ev_match = re.search(r'## 10\. Evidence & Production Artifact Links\s*\n\s*(.*?)(?=\n##|\Z)', body, re.DOTALL)
    ev_text = ev_match.group(1).strip() if ev_match else ''

    new_content = f"""---
{fm}
---

# {title}

{nav_callout}

## 🎯 Engineering Mastery Checklist
- [{w_check}] 📺 **Architectural Concept** · Core engine mechanics, internals, and storage allocation
- [{r_check}] 💻 **Hands-On Execution** · Script executed and validated against SQL Server 2022 / SSMS
- [{m_check}] 🧪 **Edge Case & Stress Testing** · Tested boundary limits, error traps (`XACT_ABORT`), and constraints
- [{d_check}] 🚀 **Production Code Verified** · Documented implementation tracked in `{code_ref}`

---

## 1. Learning Objectives & Architectural Focus

{obj_text}

{concept_text}

---

## 2. Production T-SQL Implementation Pattern

{sql_text}

---

## 3. Production Engineering Evaluation Matrix

| Dimension | Critical Engineering Evaluation |
| :--- | :--- |
| **Correctness** | What data invariant, operational behavior, or ACID guarantee does it enforce? |
| **Performance** | How does this affect I/O operations, page allocation, buffer cache, CPU, or lock contention? |
| **Operations** | How does this behave under disaster recovery, failover, backup chains, and migration? |
| **Maintainability** | Can another engineer easily diagnose, extend, or alter this object without breaking dependent callers? |

---

## 4. Hands-on Reproduction & Edge Case Drill

{drill_text}

---

## 5. Architectural Synthesis & Mentor Checkpoint

> [!question] Senior DBRE / Architect Challenge
> {q_str}

*My Engineering Synthesis:*
<!-- Document your synthesized mental model, architectural trade-offs, and operational lessons here -->

---

## 6. Observation & SSMS Notes

- **Key demonstration observed:**
- **Important SSMS / Engine setting:**
- **Critical syntax nuance:**
- **Failure mode or trap avoided:**
- **Research item for deeper inquiry:**

---

## 7. Evidence & Production Artifact Links

{ev_text}
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True

def main():
    notes = glob.glob('docs/curriculum/video-notes/**/*.md', recursive=True)
    print(f"Processing {len(notes)} video notes...")
    count = 0
    for note_path in notes:
        if clean_note(note_path):
            count += 1
    print(f"Successfully cleaned and standardized {count} video notes.")

if __name__ == '__main__':
    main()
