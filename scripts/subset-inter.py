"""
Inter Variable Font Subset Generator
====================================

Builds assets/fonts/inter-variable-latin.woff2 from the upstream Inter Variable
woff2 (rsms/inter v4), keeping the wght (weight) and opsz (optical size) axes
but tight-subsetting the character set to Basic Latin + essential punctuation.

WHY THIS EXISTS — Day 3 Task B (self-hosting):
-----------------------------------------------
Theme previously loaded Inter from fonts.googleapis.com, costing:
  • 1 DNS lookup + 1 TLS handshake to fonts.googleapis.com (the CSS file)
  • 1 DNS lookup + 1 TLS handshake to fonts.gstatic.com (the actual fonts)
  • Multiple HTTP requests for individual weight files (one per used weight)
  • Total over-the-wire: ~200–300 KB uncached, ~30–50 KB cached per weight

Self-hosting via this subset:
  • 0 third-party requests (eliminates the privacy/perf hit of Google Fonts)
  • 1 HTTP request to our own domain (already has DNS/TLS in flight)
  • Single file, ~99 KB, contains ALL weights via wght variable axis
  • Browser loads once, renders every weight Tailwind asks for instantly

PIPELINE:
---------
  1. (Manual once) — fetch upstream Inter Variable from rsms/inter on GitHub:
       curl -L -o /tmp/Inter-test.woff2 \\
         "https://github.com/rsms/inter/raw/v4.0/docs/font-files/InterVariable.woff2"
  2. python3 scripts/subset-inter.py

OUTPUT:
-------
  - assets/fonts/inter-variable-latin.woff2  (~99 KB, wght+opsz axes preserved)

Italic variant: NOT subset because the theme has zero italic usage anywhere
(verified via `grep -rE '\\bitalic\\b' --include='*.php' --include='*.js' .`).
If italic is ever introduced, also subset InterVariable-Italic.woff2 with the
same script and add a second @font-face declaration with `font-style: italic`.
"""
import os
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options

# ── Paths ─────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).resolve().parent.parent
INPUT = Path('/tmp/Inter-test.woff2')
OUTPUT = REPO_ROOT / 'assets' / 'fonts' / 'inter-variable-latin.woff2'

# ── Character coverage ────────────────────────────────────────────────
# Tight English-focused Latin subset. Covers ~99% of typical Australian web copy.
# Excludes Cyrillic, Greek, Vietnamese, Latin Extended-B beyond ı, math operators,
# dingbats, arrows beyond ↑↓→, geometric shapes — all unused in this theme.
UNICODE_RANGES = [
    (0x0020, 0x007E),   # Basic Latin printable (ASCII)
    (0x00A0, 0x00FF),   # Latin-1 Supplement (é, ñ, ü, £, °, ½, ¾, etc.)
    (0x0131, 0x0131),   # ı (Turkish dotless i)
    (0x0152, 0x0153),   # Œ œ
    (0x02B0, 0x02FF),   # Spacing modifier letters
    (0x2010, 0x2015),   # hyphens, em-dash, en-dash
    (0x2018, 0x201E),   # smart quotes ' ' " " „
    (0x2020, 0x2022),   # dagger †, double dagger ‡, bullet •
    (0x2026, 0x2026),   # ellipsis …
    (0x2030, 0x2030),   # per-mille ‰
    (0x2039, 0x203A),   # single guillemets ‹ ›
    (0x20AC, 0x20AC),   # euro €
    (0x2122, 0x2122),   # ™
    (0x2191, 0x2193),   # arrows ↑ → ↓ (used in CTAs like "Get Quote →")
    (0x2605, 0x2606),   # ★ (U+2605 — used in "4.9★", "★★★★★" rating badges)
                        # + ☆ (U+2606 — included for free, future use for partial-star ratings)
    (0xFEFF, 0xFEFF),   # ZWNBSP (BOM)
    (0xFFFD, 0xFFFD),   # replacement char
]


def main():
    if not INPUT.exists():
        print(f"❌ Missing input: {INPUT}")
        print("   Fetch with: curl -L -o /tmp/Inter-test.woff2 \\")
        print("     'https://github.com/rsms/inter/raw/v4.0/docs/font-files/InterVariable.woff2'")
        sys.exit(1)

    unicodes = []
    for start, end in UNICODE_RANGES:
        unicodes.extend(range(start, end + 1))
    print(f"📋 Codepoints to keep: {len(unicodes)}")

    orig_size = INPUT.stat().st_size
    print(f"📦 Input: {orig_size:,} bytes ({orig_size/1024:.1f} KB)")

    # ── Subset, keeping the variable axes intact ──────────────────────
    print("\n🔧 Subsetting (keep wght + opsz axes, drop unused codepoints)…")
    font = TTFont(str(INPUT))

    options = Options()
    options.flavor = 'woff2'
    options.layout_features = ['*']    # Keep kerning, ligatures, etc. — needed for body text
    options.glyph_names = False
    options.symbol_cmap = True
    options.legacy_cmap = True
    options.notdef_glyph = True
    options.notdef_outline = False
    options.recommended_glyphs = False
    options.name_IDs = ['*']
    options.name_legacy = False
    options.name_languages = ['*']
    options.hinting = True             # TT hinting helps small-size rendering on Windows

    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)
    font.flavor = 'woff2'

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    font.save(str(OUTPUT))

    new_size = OUTPUT.stat().st_size
    print(f"\n✅ Wrote {OUTPUT.relative_to(REPO_ROOT)}")
    print(f"   {orig_size:,} → {new_size:,} bytes ({new_size/1024:.1f} KB)")
    print(f"   Reduction: {(1 - new_size/orig_size)*100:.1f}%")

    # ── Verify ─────────────────────────────────────────────────────────
    print("\n=== Verification ===")
    verify = TTFont(str(OUTPUT))
    has_fvar = 'fvar' in verify
    print(f"  fvar present (variable axes): {has_fvar}")
    if has_fvar:
        for axis in verify['fvar'].axes:
            print(f"    {axis.axisTag}: {axis.minValue}-{axis.maxValue} (default {axis.defaultValue})")
    print(f"  Glyphs in subset: {verify['maxp'].numGlyphs}")
    print(f"  Codepoints in CMAP: {len(verify.getBestCmap())}")
    print(f"  GSUB present (kerning/ligatures): {'GSUB' in verify}")
    print(f"  Italic? {'italic' in (verify['name'].getDebugName(2) or '').lower()}")


if __name__ == '__main__':
    main()
