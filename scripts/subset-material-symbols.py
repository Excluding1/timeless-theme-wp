"""
Material Symbols Subset Generator (with FILL axis preserved)
============================================================

Re-builds assets/fonts/material-symbols-subset.woff2 from the upstream
variable font, keeping ONLY the icons we use AND the FILL variable axis.

WHY THIS EXISTS — the v1.2.0-dev lesson learned:
------------------------------------------------
Initial subset (~7.7 KB) instanced ALL four variable axes (FILL, wght, GRAD,
opsz) at fixed values. That broke 87+ places in the theme that use
`font-variation-settings:'FILL' 1` to switch from outlined to filled icons.
Without the FILL axis, every "filled" icon silently rendered outlined —
small ones (e.g. green check_circle in success lists) looked like horizontal
stripes because the thin outline strokes blurred together at 16-24px.

This rebuild keeps FILL as a continuous 0..1 axis. wght/GRAD/opsz are still
locked (we never use those). Final size: ~10 KB. Filled vs outlined now
toggles correctly via CSS.

PIPELINE:
---------
  1. scripts/audit-icons.sh   → /tmp/icons-used.txt
  2. (manual) curl Google's variable font + codepoints file → /tmp/
  3. python3 scripts/subset-material-symbols.py  ← this script

OUTPUT:
-------
  - assets/fonts/material-symbols-subset.woff2   (the font)
  - inc/material-symbols-codepoints.php          (PHP icon→hex map)

INPUTS:
-------
  - /tmp/icons-used.txt                  (one icon name per line)
  - /tmp/material-symbols.codepoints     (Google's "name HEX" map)
  - /tmp/material-symbols.woff2          (full Material Symbols Outlined VF)

To re-fetch the upstream files:
  curl -L -o /tmp/material-symbols.woff2 \\
    "https://fonts.gstatic.com/s/materialsymbolsoutlined/<hash>.woff2"
  curl -L -o /tmp/material-symbols.codepoints \\
    "https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/MaterialSymbolsOutlined%5BFILL%2CGRAD%2Copsz%2Cwght%5D.codepoints"
"""
import os
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.subset import Subsetter, Options

# ── Paths (relative to repo root) ─────────────────────────────────────
REPO_ROOT = Path(__file__).resolve().parent.parent
ICONS_LIST = Path('/tmp/icons-used.txt')
CODEPOINTS = Path('/tmp/material-symbols.codepoints')
FONT_INPUT = Path('/tmp/material-symbols.woff2')
FONT_OUTPUT = REPO_ROOT / 'assets' / 'fonts' / 'material-symbols-subset.woff2'
PHP_OUTPUT = REPO_ROOT / 'inc' / 'material-symbols-codepoints.php'

def main():
    # Verify all inputs exist
    for f in (ICONS_LIST, CODEPOINTS, FONT_INPUT):
        if not f.exists():
            print(f"❌ Missing input: {f}")
            sys.exit(1)

    # Read used icon names
    used_icons = sorted({l.strip() for l in ICONS_LIST.read_text().splitlines() if l.strip()})
    print(f"📋 Icons to include: {len(used_icons)}")

    # Build name → codepoint map from Google's file
    codepoint_map = {}
    for line in CODEPOINTS.read_text().splitlines():
        parts = line.strip().split()
        if len(parts) == 2:
            codepoint_map[parts[0]] = parts[1]  # hex string

    # Resolve our icons
    unicodes_to_keep = []
    missing = []
    for icon in used_icons:
        if icon in codepoint_map:
            unicodes_to_keep.append(int(codepoint_map[icon], 16))
        else:
            missing.append(icon)

    if missing:
        print(f"⚠️  Not in Google's codepoints map: {missing}")

    print(f"✅ Resolved {len(unicodes_to_keep)} codepoints")

    # ── Step 1: Instance variable font, keeping FILL axis ─────────────
    print("\n🔧 Step 1: Instancing (lock wght=400, GRAD=0, opsz=24, KEEP FILL)…")
    font = TTFont(str(FONT_INPUT))
    size_orig = FONT_INPUT.stat().st_size

    font_inst = instantiateVariableFont(font, {
        'wght': 400,
        'GRAD': 0,
        'opsz': 24,
        # FILL is intentionally NOT pinned — kept continuous 0..1
    })
    intermediate = Path('/tmp/ms-fill-axis-full.ttf')
    font_inst.save(str(intermediate))
    print(f"   {size_orig:,} → {intermediate.stat().st_size:,} bytes (FILL axis kept)")

    # ── Step 2: Subset to only our icons, drop ligature tables ────────
    print("\n🔧 Step 2: Subsetting to used codepoints + dropping GSUB/GPOS…")
    options = Options()
    options.flavor = 'woff2'
    options.layout_features = []
    options.glyph_names = False
    options.symbol_cmap = True
    options.legacy_cmap = True
    options.notdef_glyph = True
    options.notdef_outline = False
    options.recommended_glyphs = False
    options.name_IDs = []
    options.name_legacy = False
    options.name_languages = []
    options.drop_tables = ['GSUB', 'GPOS']

    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=unicodes_to_keep)

    font_to_subset = TTFont(str(intermediate))
    subsetter.subset(font_to_subset)
    font_to_subset.flavor = 'woff2'

    FONT_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    font_to_subset.save(str(FONT_OUTPUT))

    size_final = FONT_OUTPUT.stat().st_size
    print(f"\n✅ Wrote {FONT_OUTPUT.relative_to(REPO_ROOT)}")
    print(f"   {size_orig:,} → {size_final:,} bytes ({size_final/1024:.1f} KB)")
    print(f"   Reduction: {(1 - size_final/size_orig)*100:.2f}%")

    # ── Step 3: Write PHP codepoint map ───────────────────────────────
    php_lines = ["<?php",
        "/**",
        " * Material Symbols icon name → Unicode codepoint mapping",
        " *",
        " * Auto-generated by scripts/subset-material-symbols.py",
        " * Used by timeless_replace_icon_ligatures() in functions.php",
        " *",
        " * To regenerate after adding new icons:",
        " *   1. scripts/audit-icons.sh         (writes /tmp/icons-used.txt)",
        " *   2. python3 scripts/subset-material-symbols.py",
        " */",
        "",
        "return array(",
    ]
    for icon in used_icons:
        if icon in codepoint_map:
            php_lines.append(f"    '{icon}' => '{codepoint_map[icon]}',")
    php_lines.append(");")
    PHP_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    PHP_OUTPUT.write_text("\n".join(php_lines) + "\n")
    print(f"✅ Wrote {PHP_OUTPUT.relative_to(REPO_ROOT)} ({len(used_icons)} entries)")

    # ── Verify ─────────────────────────────────────────────────────────
    print("\n=== Verification ===")
    verify = TTFont(str(FONT_OUTPUT))
    has_fvar = 'fvar' in verify
    print(f"  fvar present (variable axes): {has_fvar}")
    if has_fvar:
        for axis in verify['fvar'].axes:
            print(f"    {axis.axisTag}: {axis.minValue}-{axis.maxValue} (default {axis.defaultValue})")
    print(f"  Codepoints in subset: {len(verify.getBestCmap())}")
    print(f"  GSUB stripped: {'GSUB' not in verify}")

if __name__ == '__main__':
    main()
