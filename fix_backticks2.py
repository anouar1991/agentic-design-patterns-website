#!/usr/bin/env python3
"""
Fix template literal issues in chapters.ts
This is a more aggressive fix that handles the specific damage patterns.
"""

import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    lines = content.split('\n')
    fixed_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # Fix role values with backticks
        line = re.sub(r"role: '`(input|output)`'", r"role: '\1'", line)

        # Fix descriptions with inline backticks - remove them
        if re.search(r"description:\s*'[^']*`[^']*'", line):
            line = re.sub(r"`([^`]*)`", r"\1", line)

        # Check for content lines that need fixing
        if 'content:' in line:
            # Case 1: content: text without any quotes (missing template literal)
            # Pattern: content: Some text here
            match = re.match(r'^(\s*content:\s*)([^`\'"][^\n]+)$', line)
            if match:
                prefix = match.group(1)
                text = match.group(2).strip()
                if text and not text.endswith('`'):
                    line = f"{prefix}`{text}`"

            # Case 2: content: `text with unescaped `inline` code`
            # Need to escape the inner backticks
            if 'content: `' in line and line.count('`') > 2:
                # Find content value
                parts = line.split('content: `', 1)
                if len(parts) == 2:
                    prefix = parts[0] + 'content: `'
                    rest = parts[1]
                    # If rest ends with ` or `,, the last one is the closing backtick
                    if rest.endswith('`') or rest.endswith('`,'):
                        # Content is complete on this line
                        # Escape all inner backticks
                        if rest.endswith('`,'):
                            inner = rest[:-2]
                            suffix = '`,'
                        else:
                            inner = rest[:-1]
                            suffix = '`'
                        # Escape backticks that aren't already escaped
                        inner = re.sub(r'(?<!\\)`', lambda m: '\\`', inner)
                        line = prefix + inner + suffix

        fixed_lines.append(line)
        i += 1

    with open(filepath, 'w') as f:
        f.write('\n'.join(fixed_lines))

    print(f"Fixed {filepath}")

if __name__ == '__main__':
    fix_file('src/data/chapters.ts')
