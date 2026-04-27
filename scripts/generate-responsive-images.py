"""
Responsive Image Variant Generator (Day 3 follow-up — mobile speed)
==================================================================

Generates resized variants of every JPG/PNG ≥ 800px wide so mobile devices
download a smaller file instead of the full desktop-sized original.

NAMING CONVENTION:
------------------
Source:    images/foo/bar.jpg   (e.g. 1824×2356)
Generated: images/foo/bar-400w.jpg       (mobile)
           images/foo/bar-400w.jpg.webp  (mobile, modern browsers)
           images/foo/bar-800w.jpg       (tablet)
           images/foo/bar-800w.jpg.webp  (tablet, modern browsers)
           images/foo/bar-1600w.jpg      (desktop hi-res)
           images/foo/bar-1600w.jpg.webp (desktop, modern browsers)

The `-NNNw.` suffix follows the same pattern as the WebP companion approach:
original URLs stay valid, no broken links, easy rollback (delete -NNNw.* files).

WHY THIS MATTERS:
-----------------
A 1824×2356 hero JPG is ~220 KB. On mobile the rendered size is ~600×800 (~50 KB at
the same quality). Browser STILL downloads the full 1824×2356 unless we tell it
"here are smaller versions, pick the right one for the screen size."

After this script + the matching <picture><source srcset> markup, mobile users
download ~6-15 KB for the hero (the 400w WebP variant) instead of 80 KB.
Cuts mobile bandwidth ~80% on hero images.

GATING:
-------
- Only processes images ≥ 800px wide (smaller already optimal for mobile)
- Skips a target width if it's ≥ source width × 0.85 (avoid near-duplicate variants)
- Uses Lanczos resampling (best quality for downscaling photos)
- JPG quality 75 / WebP quality 75 — same as the companion script

PIPELINE:
---------
  python3 scripts/generate-responsive-images.py            # generate all
  python3 scripts/generate-responsive-images.py --check    # dry-run
  python3 scripts/generate-responsive-images.py --force    # re-encode existing

Re-run after adding new large images.
"""
import os
import sys
from pathlib import Path
from PIL import Image

REPO_ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = REPO_ROOT / 'images'

# Variant widths to generate. Browsers pick the right one based on
# the device + viewport via srcset/sizes attributes.
TARGET_WIDTHS = [400, 800, 1600]

# Source images smaller than this threshold are skipped (already small enough)
MIN_SOURCE_WIDTH = 800

# Quality settings (match scripts/convert-images-to-webp.py)
JPG_QUALITY = 75
WEBP_QUALITY = 75
ENCODE_METHOD = 6

DRY_RUN = '--check' in sys.argv
FORCE = '--force' in sys.argv


def is_variant_filename(p: Path) -> bool:
    """Check if a path is itself a -NNNw variant (avoid recursing into our own outputs)."""
    stem = p.stem  # "bar-400w" or "bar-400w.jpg" depending on suffix order
    return any(stem.endswith(f'-{w}w') for w in TARGET_WIDTHS) or '-w.webp' in p.name


def should_generate_variant(source_w: int, target_w: int) -> bool:
    """Skip if target is too close to source (waste) or larger (don't upscale)."""
    if target_w >= source_w:
        return False
    if target_w >= source_w * 0.85:
        return False
    return True


def generate_variants(src: Path) -> dict:
    """Generate all qualifying responsive variants for one source image.
    Returns counters: {generated, skipped, total_bytes_saved}."""
    if is_variant_filename(src):
        return {'status': 'skip_self_variant'}

    # Open once, get dimensions, then process all target widths
    try:
        src_img = Image.open(src)
    except Exception as e:
        return {'status': 'open_failed', 'error': str(e)}
    src_w, src_h = src_img.size
    if src_w < MIN_SOURCE_WIDTH:
        return {'status': 'too_small', 'src_w': src_w}

    src_size = src.stat().st_size
    has_alpha = src_img.mode in ('RGBA', 'LA', 'PA')

    results = {'generated': 0, 'skipped_existing': 0, 'skipped_too_close': 0, 'bytes_total': 0}

    for target_w in TARGET_WIDTHS:
        if not should_generate_variant(src_w, target_w):
            results['skipped_too_close'] += 1
            continue

        target_h = round(target_w * src_h / src_w)
        ext = src.suffix.lower()  # .jpg, .png, etc.
        # Variant filenames: bar-400w.jpg + bar-400w.jpg.webp
        variant_jpg  = src.with_name(f'{src.stem}-{target_w}w{ext}')
        variant_webp = variant_jpg.with_suffix(variant_jpg.suffix + '.webp')

        if variant_jpg.exists() and variant_webp.exists() and not FORCE:
            results['skipped_existing'] += 1
            continue

        if DRY_RUN:
            results['generated'] += 1
            continue

        # Resize with Lanczos (best quality for downscaling)
        resized = src_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

        # Write traditional format (JPG or PNG)
        if ext in ('.jpg', '.jpeg'):
            # Drop alpha if any (JPG can't have it)
            if resized.mode in ('RGBA', 'LA', 'PA'):
                bg = Image.new('RGB', resized.size, (255, 255, 255))
                bg.paste(resized, mask=resized.split()[-1])
                resized_for_jpg = bg
            else:
                resized_for_jpg = resized.convert('RGB') if resized.mode != 'RGB' else resized
            resized_for_jpg.save(variant_jpg, 'JPEG', quality=JPG_QUALITY, optimize=True, progressive=True)
        elif ext == '.png':
            # PNG keeps alpha; use optimize for smaller output
            resized.save(variant_jpg, 'PNG', optimize=True)
        else:
            continue

        # Write WebP companion of the resized variant
        save_args = {'method': ENCODE_METHOD}
        if has_alpha and ext == '.png':
            save_args['lossless'] = True
        else:
            save_args['quality'] = WEBP_QUALITY
        webp_input = resized
        if not has_alpha and webp_input.mode in ('RGBA', 'LA', 'PA'):
            bg = Image.new('RGB', webp_input.size, (255, 255, 255))
            bg.paste(webp_input, mask=webp_input.split()[-1])
            webp_input = bg
        webp_input.save(variant_webp, 'WebP', **save_args)

        # Sanity: only keep variants that are actually smaller than source
        v_jpg_size = variant_jpg.stat().st_size
        v_webp_size = variant_webp.stat().st_size
        if v_jpg_size >= src_size and v_webp_size >= src_size:
            # Both bigger than source — variant pointless. Delete.
            variant_jpg.unlink(missing_ok=True)
            variant_webp.unlink(missing_ok=True)
            results['skipped_too_close'] += 1
            continue

        results['generated'] += 1
        results['bytes_total'] += v_jpg_size + v_webp_size

    return results


def main():
    if not IMAGES_DIR.exists():
        print(f"❌ Images directory not found: {IMAGES_DIR}")
        sys.exit(1)

    candidates = []
    for ext in ('.jpg', '.jpeg', '.png'):
        for f in IMAGES_DIR.rglob(f'*{ext}'):
            if not is_variant_filename(f) and not f.name.endswith('.webp'):
                candidates.append(f)

    print(f"Mode: {'DRY-RUN' if DRY_RUN else ('FORCE' if FORCE else 'normal')}")
    print(f"Source images found: {len(candidates)} (will skip variants <800px wide)")
    print()

    totals = {'generated': 0, 'skipped_existing': 0, 'skipped_too_close': 0,
              'too_small': 0, 'open_failed': 0, 'skip_self_variant': 0,
              'bytes_total': 0}

    for src in sorted(candidates):
        r = generate_variants(src)
        if 'status' in r:
            totals[r['status']] = totals.get(r['status'], 0) + 1
            continue
        totals['generated']         += r.get('generated', 0)
        totals['skipped_existing']  += r.get('skipped_existing', 0)
        totals['skipped_too_close'] += r.get('skipped_too_close', 0)
        totals['bytes_total']       += r.get('bytes_total', 0)
        if r.get('generated', 0) > 0:
            print(f"  ✓ {src.relative_to(REPO_ROOT)}: {r['generated']} new variant(s)")

    print()
    print("=== Summary ===")
    for k, v in totals.items():
        if v and k != 'bytes_total':
            print(f"  {k}: {v}")
    if totals['bytes_total'] > 0:
        print(f"  Total bytes generated: {totals['bytes_total']/1024:.0f} KB across all variants")
    print()
    if not DRY_RUN and totals['generated'] > 0:
        print("Next: PHP `timeless_webp_picture_filter()` will detect the variants and")
        print("      emit <picture><source srcset='... 400w, ... 800w, ... 1600w' sizes='...'>")
        print("      so mobile browsers fetch the right size automatically.")


if __name__ == '__main__':
    main()
