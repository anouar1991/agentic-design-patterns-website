#!/usr/bin/env python3
"""
Fix backtick issues in chapters.ts file that were caused by a bad sed command.

The main issues are:
1. Inside template literals, backticks around inline code need to be escaped as \`
2. Code fences (```) inside template literals need to be escaped as \`\`\`
3. Some content fields are missing their template literal delimiters
4. Some role values have backticks that shouldn't be there
"""

import re
import sys

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    lines = content.split('\n')
    fixed_lines = []

    # Track if we're inside a template literal
    in_template = False
    template_start_line = 0

    i = 0
    while i < len(lines):
        line = lines[i]

        # Fix role values that have backticks - they should be plain strings
        if "role: '`input`'" in line:
            line = line.replace("role: '`input`'", "role: 'input'")
        if "role: '`output`'" in line:
            line = line.replace("role: '`output`'", "role: 'output'")

        # Fix descriptions that have unescaped backticks in regular strings
        if "description:" in line and "`" in line and "'" in line:
            # Match description: '...`...'
            desc_match = re.search(r"description:\s*'([^']*`[^']*)'", line)
            if desc_match:
                old_desc = desc_match.group(0)
                # Remove backticks from description strings
                new_desc = old_desc.replace("`", "")
                line = line.replace(old_desc, new_desc)

        # Fix content that starts a template literal but text has unescaped backticks inside
        if 'content: `' in line and not line.strip().endswith('`'):
            # Check if this line has backticks that need escaping
            # Pattern: content: `...`word`...
            content_part = line.split('content: `', 1)[1] if 'content: `' in line else ''
            if '`' in content_part and not content_part.endswith('`'):
                # This has inline backticks that need escaping
                before_content = line.split('content: `')[0] + 'content: `'
                after_content = content_part
                # Escape unescaped backticks (but not already escaped ones)
                fixed_content = re.sub(r'(?<!\\)`', r'\\`', after_content)
                line = before_content + fixed_content

        # Fix content fields that have no template literal markers
        if ('content:' in line and
            'content: `' not in line and
            "content: '" not in line and
            'content: ""' not in line and
            line.strip().startswith('content:')):
            # This content field is missing its template literal
            match = re.search(r'^(\s*content:\s*)(.+)$', line)
            if match:
                prefix = match.group(1)
                text = match.group(2).strip()
                if text and not text.startswith('`') and not text.startswith("'") and not text.startswith('"'):
                    line = f"{prefix}`{text}`"

        fixed_lines.append(line)
        i += 1

    with open(filepath, 'w') as f:
        f.write('\n'.join(fixed_lines))

    print(f"Fixed {filepath}")

if __name__ == '__main__':
    filepath = sys.argv[1] if len(sys.argv) > 1 else 'src/data/chapters.ts'
    fix_file(filepath)
