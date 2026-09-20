"""
scripts/validate_vault.py
Validates integrity of the SQL Server Obsidian Second Brain vault.
"""

import os
import glob
import re
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

VAULT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'docs', 'curriculum'))

def validate():
    errors = []
    warnings = []

    # 1. Validate Video Notes count
    video_notes = glob.glob(os.path.join(VAULT_DIR, "01 - COURSE", "**", "*.md"), recursive=True)
    # Exclude overview, index, audit
    actual_video_notes = [n for n in video_notes if "CH0" in os.path.basename(n) or "FINAL" in os.path.basename(n) or "Final Project —" in os.path.basename(n)]
    
    print(f"Discovered {len(actual_video_notes)} lesson notes in 01 - COURSE/")
    if len(actual_video_notes) != 102:
        errors.append(f"Expected exactly 102 video notes, but found {len(actual_video_notes)}")

    # 2. Check Frontmatter and Required Headings
    required_headings = [
        "Learning Goal",
        "Core Idea",
        "What I Need to Understand",
        "SQL Syntax",
        "Data Engineering Perspective",
        "What I Should Be Able to Do",
        "Hands-On Lab",
        "Challenge",
        "Mentor Challenge",
        "Common Mistakes",
        "Production Considerations",
        "Related Concepts",
        "Interview Questions",
        "My Notes",
        "Knowledge Check",
        "Status"
    ]

    for note_path in actual_video_notes:
        with open(note_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check frontmatter
        if not content.startswith('---'):
            errors.append(f"Missing YAML frontmatter in {os.path.basename(note_path)}")
            continue

        fm_match = re.match(r'^---\r?\n(.*?)\r?\n---\r?\n', content, re.DOTALL)
        if not fm_match:
            errors.append(f"Malformed YAML frontmatter in {os.path.basename(note_path)}")
            continue

        fm = fm_match.group(1)
        for req_field in ["type: video", "course:", "chapter:", "lesson_id:", "status:", "difficulty:"]:
            if req_field not in fm:
                errors.append(f"Missing '{req_field}' in frontmatter of {os.path.basename(note_path)}")

        # Check headings
        for h in required_headings:
            if h not in content:
                warnings.append(f"Missing section '{h}' in {os.path.basename(note_path)}")

    # 3. Check Concept Notes
    concepts = glob.glob(os.path.join(VAULT_DIR, "02 - CONCEPTS", "**", "*.md"), recursive=True)
    print(f"Discovered {len(concepts)} Concept notes in 02 - CONCEPTS/")
    if len(concepts) < 25:
        errors.append(f"Expected at least 25 concepts, found {len(concepts)}")

    # 4. Check Pattern Notes
    patterns = glob.glob(os.path.join(VAULT_DIR, "03 - SQL PATTERNS", "**", "*.md"), recursive=True)
    print(f"Discovered {len(patterns)} SQL Pattern notes in 03 - SQL PATTERNS/")
    if len(patterns) < 15:
        errors.append(f"Expected at least 15 SQL patterns, found {len(patterns)}")

    # 5. Check Home Dashboards
    home_files = ["Home.md", "Course Dashboard.md", "Learning Roadmap.md", "Weekly Review.md", "Interview Dashboard.md", "README.md"]
    for hf in home_files:
        p = os.path.join(VAULT_DIR, "00 - HOME", hf)
        if not os.path.exists(p):
            errors.append(f"Missing Home dashboard: 00 - HOME/{hf}")

    # 6. Check Templates
    tmpl_files = ["Video Note Template.md", "Concept Template.md", "SQL Pattern Template.md", "Exercise Template.md", "Project Template.md", "Weekly Review Template.md", "Interview Question Template.md"]
    for tf in tmpl_files:
        p = os.path.join(VAULT_DIR, "08 - TEMPLATES", tf)
        if not os.path.exists(p):
            errors.append(f"Missing template: 08 - TEMPLATES/{tf}")

    # 7. Check CSS Snippet
    css_path = os.path.join(VAULT_DIR, ".obsidian", "snippets", "second-brain.css")
    if not os.path.exists(css_path):
        errors.append("Missing .obsidian/snippets/second-brain.css")

    # Report results
    print("\n--- Validation Results ---")
    if errors:
        print(f"❌ {len(errors)} Errors found:")
        for e in errors[:10]:
            print(f"  - {e}")
        return False
    else:
        print("✅ Zero critical errors found!")

    if warnings:
        print(f"⚠️ {len(warnings)} Warnings:")
        for w in warnings[:5]:
            print(f"  - {w}")
    else:
        print("✅ Zero warnings found!")

    print("Vault structural and content validation PASSED!\n")
    return True

if __name__ == '__main__':
    success = validate()
    sys.exit(0 if success else 1)
