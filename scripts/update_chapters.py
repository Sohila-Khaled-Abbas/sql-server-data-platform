import glob

chapters = glob.glob('docs/curriculum/chapters/ch*-readme.md')
for cp in chapters:
    with open(cp, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the chapter number
    import re
    m = re.search(r'ch0?(\d)-readme\.md', cp)
    if not m:
        continue
    ch_str = f"ch0{m.group(1)}" if len(m.group(1)) == 1 else f"ch{m.group(1)}"

    # Replace the dataview TASK query block cleanly
    pattern = rf'FROM "video-notes/{ch_str}"\s*\n(>\s*)?WHERE !completed\s*\n(>\s*)?```'
    replacement = f'FROM "video-notes/{ch_str}"\n> WHERE !completed\n> GROUP BY file.link\n> LIMIT 15\n> ```'
    content = re.sub(pattern, replacement, content)

    with open(cp, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {cp}")
