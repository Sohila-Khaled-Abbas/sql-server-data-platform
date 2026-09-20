import os
import sys
import json
import re

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURRICULUM_DIR = os.path.join(ROOT_DIR, "docs", "curriculum")
OUTPUT_DIR = os.path.join(ROOT_DIR, "web", "public", "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "curriculum_manifest.json")

REPO_BASE_RAW = "https://raw.githubusercontent.com/Sohila-Khaled-Abbas/sql-server-data-platform/master"
REPO_BASE_BLOB = "https://github.com/Sohila-Khaled-Abbas/sql-server-data-platform/blob/master"

def parse_frontmatter(content):
    """Parses YAML frontmatter from markdown content."""
    if not content.startswith("---"):
        return {}, content
    
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content
    
    yaml_text = parts[1]
    body = parts[2].strip()
    meta = {}
    
    current_key = None
    current_list = None
    
    for line in yaml_text.splitlines():
        line = line.rstrip()
        if not line:
            continue
        
        # Check for list item
        if line.startswith("  - ") or line.startswith("- "):
            val = line.lstrip(" -").strip()
            if current_list is not None:
                current_list.append(val)
            continue
        
        if ":" in line:
            key, val = line.split(":", 1)
            key = key.strip()
            val = val.strip()
            
            # Check for inline list [a, b, c]
            if val.startswith("[") and val.endswith("]"):
                items = [x.strip().strip("'\"") for x in val[1:-1].split(",") if x.strip()]
                meta[key] = items
                current_key = None
                current_list = None
            elif val == "":
                current_key = key
                current_list = []
                meta[key] = current_list
            else:
                val = val.strip("'\"")
                if val.lower() == "true":
                    val = True
                elif val.lower() == "false":
                    val = False
                elif val.isdigit():
                    val = int(val)
                meta[key] = val
                current_key = None
                current_list = None
                
    return meta, body

def extract_section(body, section_header):
    """Extracts text under a markdown section until the next section header."""
    pattern = rf"##\s+{re.escape(section_header)}.*?\n(.*?)(?=\n##\s+|\Z)"
    match = re.search(pattern, body, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return ""

def extract_checklist(body):
    """Extracts interactive checklist items."""
    checklist_text = extract_section(body, "What I Should Be Able to Do")
    items = []
    for line in checklist_text.splitlines():
        line = line.strip()
        if line.startswith("- [ ]") or line.startswith("- [x]"):
            is_checked = line.startswith("- [x]")
            text = line[5:].strip()
            items.append({"text": text, "completed": is_checked})
    return items

def extract_learning_goal(body):
    """Extracts learning goal callout text."""
    match = re.search(r"> \[!abstract\] Learning Goal\s*\n(.*?)(?=\n\n|\n## |\Z)", body, re.DOTALL)
    if match:
        lines = [l.lstrip("> ").strip() for l in match.group(1).splitlines() if l.strip()]
        return " ".join(lines)
    return ""

def extract_core_idea(body):
    """Extracts core idea text."""
    return extract_section(body, "Core Idea")

def build_manifest():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    manifest = {
        "version": "2.0.0",
        "generated_at": "2026-09-20T21:35:00Z",
        "total_lessons": 0,
        "total_concepts": 0,
        "total_patterns": 0,
        "total_cheat_sheets": 0,
        "chapters": [],
        "lessons": [],
        "concepts": [],
        "sql_patterns": [],
        "cheat_sheets": [],
        "vault_metrics": {
            "pkm_folders": 10,
            "theme": "Dark Charcoal & SQL-Red",
            "snippet": "second-brain.css"
        }
    }
    
    # 1. Parse Course Lessons
    course_dir = os.path.join(CURRICULUM_DIR, "01 - COURSE")
    chapter_folders = [
        ("CH01 - Database Creation and Management", "CH01", "Database Creation & Storage Architecture", "#38bdf8", "HardDrive"),
        ("CH02 - SQL Programming Essentials", "CH02", "T-SQL Programming Essentials & ACID", "#10b981", "Code2"),
        ("CH03 - Advanced Query Techniques and High Availability", "CH03", "Views, Partitioning & High Availability", "#8b5cf6", "Layers"),
        ("CH04 - Procedures, Triggers, and SQL Automation", "CH04", "Procedures, Triggers & CLR/SMO", "#f59e0b", "Cpu"),
        ("CH05 - Reporting and Data Warehousing", "CH05", "SSRS & Kimball Data Warehousing", "#ec4899", "BarChart3"),
        ("Final Project", "FINAL", "Enterprise Data Platform Capstone", "#CC292B", "GitBranch")
    ]
    
    for folder_name, ch_id, ch_title, ch_color, ch_icon in chapter_folders:
        folder_path = os.path.join(course_dir, folder_name)
        if not os.path.exists(folder_path):
            continue
            
        ch_files = sorted([f for f in os.listdir(folder_path) if f.endswith(".md") and f != "README.md"])
        
        manifest["chapters"].append({
            "id": ch_id,
            "title": ch_title,
            "folder": folder_name,
            "color": ch_color,
            "icon": ch_icon,
            "lesson_count": len(ch_files),
            "readme_url": f"{REPO_BASE_BLOB}/docs/curriculum/01%20-%20COURSE/{folder_name.replace(' ', '%20')}/README.md"
        })
        
        for f in ch_files:
            file_path = os.path.join(folder_path, f)
            with open(file_path, "r", encoding="utf-8") as file:
                content = file.read()
                
            meta, body = parse_frontmatter(content)
            
            clean_title = f[:-3]
            lesson_id = meta.get("lesson_id", "")
            if " - " in clean_title:
                parts = clean_title.split(" - ", 1)
                if not lesson_id:
                    lesson_id = parts[0].strip()
                display_title = parts[1].strip()
            else:
                display_title = clean_title
                
            relative_path = f"docs/curriculum/01 - COURSE/{folder_name}/{f}"
            raw_url = f"{REPO_BASE_RAW}/docs/curriculum/01%20-%20COURSE/{folder_name.replace(' ', '%20')}/{f.replace(' ', '%20')}"
            github_url = f"{REPO_BASE_BLOB}/docs/curriculum/01%20-%20COURSE/{folder_name.replace(' ', '%20')}/{f.replace(' ', '%20')}"
            
            learning_goal = extract_learning_goal(body)
            core_idea = extract_core_idea(body)
            abilities = extract_checklist(body)
            
            manifest["lessons"].append({
                "id": lesson_id or f"VID_{len(manifest['lessons'])+1:02d}",
                "title": meta.get("title", display_title),
                "filename": f,
                "chapter": meta.get("chapter", ch_id),
                "chapter_title": ch_title,
                "chapter_color": ch_color,
                "lesson_number": meta.get("lesson_number", len(manifest["lessons"]) + 1),
                "status": meta.get("status", "In Progress"),
                "difficulty": meta.get("difficulty", "medium"),
                "confidence": meta.get("confidence", 0),
                "topics": meta.get("topics", []),
                "skills": meta.get("skills", []),
                "tags": meta.get("tags", []),
                "source": meta.get("source", ""),
                "code_reference": meta.get("code_reference", ""),
                "learning_goal": learning_goal,
                "core_idea": core_idea,
                "abilities": abilities,
                "relative_path": relative_path,
                "raw_url": raw_url,
                "github_url": github_url
            })
            
    manifest["total_lessons"] = len(manifest["lessons"])
    
    # 2. Parse Concepts (02 - CONCEPTS)
    concepts_dir = os.path.join(CURRICULUM_DIR, "02 - CONCEPTS")
    if os.path.exists(concepts_dir):
        for domain in sorted(os.listdir(concepts_dir)):
            domain_path = os.path.join(concepts_dir, domain)
            if not os.path.isdir(domain_path):
                continue
            for cf in sorted(os.listdir(domain_path)):
                if not cf.endswith(".md"):
                    continue
                c_path = os.path.join(domain_path, cf)
                with open(c_path, "r", encoding="utf-8") as file:
                    c_content = file.read()
                cmeta, cbody = parse_frontmatter(c_content)
                summary = extract_section(cbody, "What It Is") or extract_section(cbody, "Definition & Intuition")
                
                rel_path = f"docs/curriculum/02 - CONCEPTS/{domain}/{cf}"
                raw_url = f"{REPO_BASE_RAW}/docs/curriculum/02%20-%20CONCEPTS/{domain.replace(' ', '%20')}/{cf.replace(' ', '%20')}"
                github_url = f"{REPO_BASE_BLOB}/docs/curriculum/02%20-%20CONCEPTS/{domain.replace(' ', '%20')}/{cf.replace(' ', '%20')}"
                
                manifest["concepts"].append({
                    "id": cf[:-3],
                    "title": cmeta.get("title", cf[:-3]),
                    "domain": domain,
                    "summary": summary[:200] + "..." if len(summary) > 200 else summary,
                    "tags": cmeta.get("tags", []),
                    "relative_path": rel_path,
                    "raw_url": raw_url,
                    "github_url": github_url
                })
    manifest["total_concepts"] = len(manifest["concepts"])
    
    # 3. Parse SQL Patterns (03 - SQL PATTERNS)
    patterns_dir = os.path.join(CURRICULUM_DIR, "03 - SQL PATTERNS")
    if os.path.exists(patterns_dir):
        for cat in sorted(os.listdir(patterns_dir)):
            cat_path = os.path.join(patterns_dir, cat)
            if not os.path.isdir(cat_path):
                continue
            for pf in sorted(os.listdir(cat_path)):
                if not pf.endswith(".md"):
                    continue
                p_path = os.path.join(cat_path, pf)
                with open(p_path, "r", encoding="utf-8") as file:
                    p_content = file.read()
                pmeta, pbody = parse_frontmatter(p_content)
                prob = extract_section(pbody, "Problem")
                
                rel_path = f"docs/curriculum/03 - SQL PATTERNS/{cat}/{pf}"
                raw_url = f"{REPO_BASE_RAW}/docs/curriculum/03%20-%20SQL%20PATTERNS/{cat.replace(' ', '%20')}/{pf.replace(' ', '%20')}"
                github_url = f"{REPO_BASE_BLOB}/docs/curriculum/03%20-%20SQL%20PATTERNS/{cat.replace(' ', '%20')}/{pf.replace(' ', '%20')}"
                
                manifest["sql_patterns"].append({
                    "id": pf[:-3],
                    "title": pmeta.get("title", pf[:-3]),
                    "category": cat,
                    "problem": prob[:200] + "..." if len(prob) > 200 else prob,
                    "tags": pmeta.get("tags", []),
                    "relative_path": rel_path,
                    "raw_url": raw_url,
                    "github_url": github_url
                })
    manifest["total_patterns"] = len(manifest["sql_patterns"])
    
    # 4. Parse Revision Cheat Sheets (06 - REVISION/Cheat Sheets)
    cheats_dir = os.path.join(CURRICULUM_DIR, "06 - REVISION", "Cheat Sheets")
    if os.path.exists(cheats_dir):
        for csf in sorted(os.listdir(cheats_dir)):
            if not csf.endswith(".md"):
                continue
            cs_path = os.path.join(cheats_dir, csf)
            with open(cs_path, "r", encoding="utf-8") as file:
                cs_content = file.read()
            csmeta, _ = parse_frontmatter(cs_content)
            
            rel_path = f"docs/curriculum/06 - REVISION/Cheat Sheets/{csf}"
            raw_url = f"{REPO_BASE_RAW}/docs/curriculum/06%20-%20REVISION/Cheat%20Sheets/{csf.replace(' ', '%20')}"
            github_url = f"{REPO_BASE_BLOB}/docs/curriculum/06%20-%20REVISION/Cheat%20Sheets/{csf.replace(' ', '%20')}"
            
            manifest["cheat_sheets"].append({
                "id": csf[:-3],
                "title": csmeta.get("title", csf[:-3]),
                "relative_path": rel_path,
                "raw_url": raw_url,
                "github_url": github_url
            })
    manifest["total_cheat_sheets"] = len(manifest["cheat_sheets"])
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        json.dump(manifest, out, indent=2, ensure_ascii=False)
        
    print(f"Manifest written successfully to: {OUTPUT_FILE}")
    print(f"Stats: {manifest['total_lessons']} Lessons, {manifest['total_concepts']} Concepts, {manifest['total_patterns']} Patterns, {manifest['total_cheat_sheets']} Cheat Sheets.")

if __name__ == "__main__":
    build_manifest()
