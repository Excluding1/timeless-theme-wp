#!/bin/bash
#
# Material Symbols Icon Audit
# ----------------------------
# Scans ALL theme PHP files (including functions.php, header, footer, etc.)
# AND js/ files to find every Material Symbols icon name used.
#
# Outputs to /tmp/icons-used.txt for the subset script to consume.
#
# Three discovery patterns:
#   1. <span class="material-symbols-outlined">ICON_NAME</span>  (static HTML)
#      — also matches single-quoted class attributes
#   2. 'icon' => 'ICON_NAME'  in PHP arrays (dynamic widgets, e.g. functions.php:670)
#   3. textContent = 'ICON_NAME'  in JS (icons injected after AJAX/DOM events)
#
# Run this BEFORE regenerating the icon font subset whenever:
#   - You add new icons to templates
#   - You add icons inside functions.php (e.g. a widget)
#   - You add icons inserted from JS
#   - You add new pages or sections
#
# Lessons learned (audit history):
#   - v1.2.0 first build: only scanned page-templates/, missed `chat` in functions.php
#   - v1.2.0 audit:      missed `faucet` (dynamic in PHP array) and `check_circle`
#                        injected via JS in main.js (audit only saw HTML markup)
#   - Regex was [a-z_]+ — silently dropped digit-named icons (123, 360, 2k, etc.)
#                        Now [a-z][a-z0-9_]* matches PHP filter regex.

set -e

cd "$(dirname "$0")/.."

echo "=== Material Symbols icon audit ==="
echo ""

# ── Source files to scan ──────────────────────────────────────────────
php_files=$(find . -name "*.php" \
    -not -path "./node_modules/*" \
    -not -path "./.git/*" \
    -not -path "./.claude/*" \
    -not -path "./vendor/*" \
    -not -path "./inc/material-symbols-codepoints.php")

js_files=$(find . -name "*.js" \
    -not -path "./node_modules/*" \
    -not -path "./.git/*" \
    -not -path "./.claude/*" \
    -not -path "./vendor/*" \
    -not -path "./assets/main.min.js" 2>/dev/null || true)

# Helper: count non-empty lines in a multiline variable.
# `grep -c .` counts non-empty lines but exits 1 when the input is empty.
# Under `set -e` that aborts the script, AND `|| echo 0` produces "0\n0"
# (because grep already wrote "0" to stdout before exiting non-zero).
# This wrapper handles both cases cleanly.
count_lines() { [[ -n "$1" ]] && printf '%s\n' "$1" | grep -c . || printf '0'; }

php_count=$(count_lines "$php_files")
js_count=$(count_lines "$js_files")
echo "Scanning $php_count PHP files + $js_count JS files..."
echo ""

# ── Pattern 1: Static <span class="material-symbols-outlined">name</span> ──
# Tolerates single OR double quotes in the class attribute.
# The `[^a-zA-Z0-9_-]` after the class name guards against false-matching
# `material-symbols-outlined-extra` or similar suffixed class names
# (POSIX BREs/EREs don't have lookaheads, so we use a negated char class instead).
icons_html=$(echo "$php_files" | xargs grep -hoE \
    "<span[^>]*material-symbols-outlined[^a-zA-Z0-9_-][^>]*>[a-z][a-z0-9_]*</span>" 2>/dev/null \
    | grep -oE '>[a-z][a-z0-9_]*<' \
    | tr -d '<>' \
    | sort -u)

# ── Pattern 2: PHP array entries — 'icon' => 'name' ──
# Catches widgets/loops that inject icons by variable.
icons_php=$(echo "$php_files" | xargs grep -hoE \
    "'icon'[[:space:]]*=>[[:space:]]*'[a-z][a-z0-9_]*'" 2>/dev/null \
    | grep -oE "'[a-z][a-z0-9_]*'$" \
    | tr -d "'" \
    | sort -u)

# ── Pattern 3: JS textContent = 'name' for material-symbols spans ──
# Catches DOM-inserted icons (AJAX success states, etc.).
# Heuristic: if a JS file mentions material-symbols anywhere AND assigns
# textContent or innerHTML, scoop those string assignments.
icons_js=""
if [[ -n "$js_files" ]]; then
    icons_js=$(echo "$js_files" | xargs grep -l "material-symbols" 2>/dev/null \
        | xargs grep -hoE "(textContent|innerHTML)[[:space:]]*=[[:space:]]*['\"][a-z][a-z0-9_]*['\"]" 2>/dev/null \
        | grep -oE "['\"][a-z][a-z0-9_]*['\"]$" \
        | tr -d "'\"" \
        | sort -u)
fi

# ── Merge all sources ─────────────────────────────────────────────────
icons=$(printf "%s\n%s\n%s\n" "$icons_html" "$icons_php" "$icons_js" \
    | grep -v '^$' \
    | sort -u)

count=$(echo "$icons" | wc -l | tr -d ' ')
echo "Found $count unique icons:"
echo "$icons" | nl

# Show breakdown by source for transparency
echo ""
echo "Source breakdown:"
echo "  HTML spans (PHP):      $(count_lines "$icons_html")"
echo "  PHP array values:      $(count_lines "$icons_php")"
echo "  JS textContent:        $(count_lines "$icons_js")"

echo ""
echo "$icons" > /tmp/icons-used.txt
echo "✅ Written to /tmp/icons-used.txt"
echo ""
echo "Next: run python3 scripts/subset-material-symbols.py to regenerate the font"
