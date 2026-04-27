#!/bin/bash
#
# Material Symbols Icon Audit
# ----------------------------
# Scans ALL theme PHP files (including functions.php, header, footer, etc.)
# to find every <span class="material-symbols-outlined">ICON_NAME</span> usage.
#
# Outputs to /tmp/icons-used.txt for the subset script to consume.
#
# Run this BEFORE regenerating the icon font subset whenever:
#   - You add new icons to templates
#   - You add icons inside functions.php (e.g. a widget)
#   - You add new pages or sections
#
# Lesson learned (v1.2.0 build): originally only scanned page-templates/,
# missed `chat` icon hardcoded in functions.php. Now scans everything.

set -e

cd "$(dirname "$0")/.."

echo "=== Material Symbols icon audit ==="
echo ""

# Find ALL .php files in theme (excluding generated codepoints map and dev tooling)
files=$(find . -name "*.php" \
    -not -path "./node_modules/*" \
    -not -path "./.git/*" \
    -not -path "./.claude/*" \
    -not -path "./inc/material-symbols-codepoints.php")

count=$(echo "$files" | wc -l | tr -d ' ')
echo "Scanning $count PHP files..."
echo ""

# Comprehensive regex catches different attribute orders, multi-line whitespace, etc.
icons=$(echo "$files" | xargs grep -hoE '<span[^>]*material-symbols-outlined[^>]*>[a-z_]+</span>' 2>/dev/null \
    | grep -oE '>[a-z_]+<' \
    | tr -d '<>' \
    | sort -u)

count=$(echo "$icons" | wc -l | tr -d ' ')
echo "Found $count unique icons:"
echo "$icons" | nl

echo ""
echo "$icons" > /tmp/icons-used.txt
echo "✅ Written to /tmp/icons-used.txt"
echo ""
echo "Next: run scripts/subset-material-symbols.js to regenerate the font"
