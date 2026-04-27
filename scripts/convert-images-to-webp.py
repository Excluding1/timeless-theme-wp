"""
WebP Companion Generator (Day 3 Task C)
=======================================

Generates a .webp companion file alongside every .jpg/.jpeg/.png in images/.
Naming convention: `path/image.jpg` → `path/image.jpg.webp` (double extension).

WHY THIS APPROACH:
------------------
- **Original URLs unchanged** — every existing `<img src="x.jpg">` in PHP keeps
  working. External backlinks, social shares, CDN caches all stay valid.
- **Easy rollback** — delete the .webp files, the site reverts to JPG/PNG
  delivery instantly. No data loss.
- **Modern browsers get WebP** via the PHP output buffer filter that wraps
  every `<img>` in a `<picture>` with `<source type="image/webp">`. Browsers
  that don't support WebP transparently fall through to the original `<img>`.
- **96%+ of users** see WebP delivered (Chrome, Firefox, Safari 14+, Edge).
  Older Safari, IE, and rare browsers get the original JPG/PNG.

QUALITY TUNING:
---------------
- **JPGs**: encoded at q=75 — visually equivalent to JPEG q=82-85, typically
  20-30% smaller than the source JPG (which is usually already at q=75-85).
- **PNGs with photo content** (no transparency or simple alpha): lossy WebP
  q=85 — typically 50-70% smaller than the PNG.
- **PNGs with full alpha transparency**: lossless WebP — typically 25-30%
  smaller than the PNG, no quality loss.

We also use `method=6` (max compression effort) since this script runs offline,
not on every request. Trades CPU time during build for smaller files forever.

USAGE:
------
  python3 scripts/convert-images-to-webp.py            # convert all
  python3 scripts/convert-images-to-webp.py --check    # show would-do, no writes
  python3 scripts/convert-images-to-webp.py --force    # re-encode existing .webp

Re-run when you add new images. Existing .webp files are skipped unless --force.
"""
import os
import sys
from pathlib import Path
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = REPO_ROOT / 'images'

# Quality settings — see "QUALITY TUNING" above for rationale
JPG_QUALITY = 75
PNG_LOSSY_QUALITY = 85
ENCODE_METHOD = 6  # 0..6 — higher = slower encode but smaller output

# CLI flags
DRY_RUN = '--check' in sys.argv
FORCE = '--force' in sys.argv


def has_significant_alpha(img):
    """True if the image has more than trivial transparency.
    Simple PNGs with full opacity (alpha=255 everywhere) → safely convert to lossy.
    PNGs with real transparency → keep lossless to preserve alpha edges."""
    if img.mode not in ('RGBA', 'LA', 'PA'):
        return False
    # Quick check: get alpha channel and see if any pixel < 255
    alpha = img.split()[-1] if img.mode == 'RGBA' else img.convert('RGBA').split()[-1]
    extrema = alpha.getextrema()
    return extrema[0] < 250  # tolerance for near-opaque


def _try_encoding(img, dst, **save_args):
    """Try one WebP encoding, return resulting file size (or sys.maxsize on failure)."""
    try:
        img.save(dst, 'WebP', method=ENCODE_METHOD, **save_args)
        return dst.stat().st_size
    except Exception:
        return sys.maxsize


def convert(src: Path) -> dict:
    """Try multiple WebP encodings, keep the smallest one — but ONLY if it beats
    the original source. Writing a .webp larger than the original would WASTE
    bytes (PHP filter would still serve it to WebP-capable browsers)."""
    dst = src.with_suffix(src.suffix + '.webp')

    if dst.exists() and not FORCE:
        return {'status': 'skipped', 'src': src, 'src_size': src.stat().st_size, 'dst_size': dst.stat().st_size}

    src_size = src.stat().st_size

    if DRY_RUN:
        return {'status': 'would_convert', 'src': src, 'src_size': src_size, 'dst_size': 0}

    img = Image.open(src)
    ext = src.suffix.lower()

    # Try multiple encodings — pick the smallest. PNGs in particular benefit
    # from trying both lossless and lossy and seeing which wins.
    # Each candidate writes to a temp path; we promote the winner to dst.
    tmp_paths = [dst.with_suffix(f'.webp.tmp{i}') for i in range(3)]
    candidates = []  # list of (size, tmp_path, label)

    if ext in ('.jpg', '.jpeg'):
        # JPGs: lossy at q=75 is almost always best
        size = _try_encoding(img, tmp_paths[0], quality=JPG_QUALITY)
        candidates.append((size, tmp_paths[0], f'lossy q={JPG_QUALITY}'))
    elif ext == '.png':
        has_alpha = has_significant_alpha(img)
        # Try 1: lossless (best for graphics/UI/already-optimized PNGs)
        size_ll = _try_encoding(img, tmp_paths[0], lossless=True)
        candidates.append((size_ll, tmp_paths[0], 'lossless'))
        # Try 2: lossy with alpha if needed
        try_img = img
        if not has_alpha and img.mode in ('RGBA', 'LA', 'PA'):
            bg = Image.new('RGB', img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            try_img = bg
        size_ly = _try_encoding(try_img, tmp_paths[1], quality=PNG_LOSSY_QUALITY)
        candidates.append((size_ly, tmp_paths[1], f'lossy q={PNG_LOSSY_QUALITY}'))
    else:
        return {'status': 'unsupported', 'src': src}

    # Pick the smallest candidate
    candidates.sort()
    winner_size, winner_path, winner_label = candidates[0]

    # Clean up losing candidates
    for s, p, _ in candidates[1:]:
        if p.exists():
            p.unlink()

    # Only keep the WebP if it actually beats the source
    if winner_size >= src_size:
        if winner_path.exists():
            winner_path.unlink()
        return {'status': 'no_benefit', 'src': src, 'src_size': src_size, 'dst_size': winner_size, 'tried': winner_label}

    # Promote winner to final dst
    winner_path.rename(dst)
    return {'status': 'converted', 'src': src, 'src_size': src_size, 'dst_size': winner_size, 'mode': winner_label}


def main():
    if not IMAGES_DIR.exists():
        print(f"❌ Images directory not found: {IMAGES_DIR}")
        sys.exit(1)

    candidates = []
    for ext in ('.jpg', '.jpeg', '.png'):
        candidates.extend(IMAGES_DIR.rglob(f'*{ext}'))

    print(f"Mode: {'DRY-RUN (no writes)' if DRY_RUN else ('FORCE re-encode' if FORCE else 'normal (skip existing)')}")
    print(f"Source files found: {len(candidates)}")
    print()

    results = {'converted': 0, 'skipped': 0, 'no_benefit': 0, 'unsupported': 0, 'would_convert': 0}
    total_src_kept = 0   # source size for files where webp won
    total_dst_kept = 0   # webp size for files where webp won
    total_src_skip = 0   # source size for files where webp didn't help (= bytes still served as original)

    for src in sorted(candidates):
        r = convert(src)
        results[r['status']] = results.get(r['status'], 0) + 1
        if r['status'] in ('converted', 'skipped'):
            total_src_kept += r['src_size']
            total_dst_kept += r['dst_size']
        elif r['status'] == 'no_benefit':
            total_src_skip += r['src_size']
        if r['status'] == 'converted':
            saved = r['src_size'] - r['dst_size']
            pct = saved / r['src_size'] * 100
            mode = r.get('mode', '')
            print(f"  ✓ {src.relative_to(REPO_ROOT)}: {r['src_size']/1024:.1f} → {r['dst_size']/1024:.1f} KB (−{pct:.0f}%, {mode})")

    print()
    print("=== Summary ===")
    for k, v in results.items():
        if v:
            print(f"  {k}: {v}")
    if total_src_kept > 0:
        print(f"\nWebP companions written for {results['converted']} files:")
        print(f"  Original source bytes: {total_src_kept/1024:.0f} KB")
        print(f"  WebP companion bytes:  {total_dst_kept/1024:.0f} KB")
        print(f"  Savings (over the wire to WebP-capable browsers): "
              f"{(total_src_kept - total_dst_kept)/1024:.0f} KB ({(1 - total_dst_kept/total_src_kept)*100:.1f}%)")
    if results.get('no_benefit', 0):
        print(f"\n  {results['no_benefit']} files SKIPPED (WebP wouldn't beat original):")
        print(f"  These keep serving as JPG/PNG, totalling {total_src_skip/1024:.0f} KB")


if __name__ == '__main__':
    main()
