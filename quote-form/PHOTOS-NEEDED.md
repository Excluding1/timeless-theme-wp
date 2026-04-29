# Quote Form — Photos Still Needed

**Status:** 14/27 services have real before/after photos. 13 still need them.

When you have a photo, drop the **before** image at the path in the "Save to" column and the **after** image at the matching `-after.png` path. Then refresh — the form picks them up automatically.

## ✅ Already done (14 services use real WP theme photos)

| Service | Photos used |
|---|---|
| sh1 — Fix tiles + corners | shower-regrouting/mouldy |
| sh2 — Fix grout lines only | shower-regrouting/discoloured |
| sh4 — Resurface tiles | tile-resurfacing/dated |
| sh5 — Cracked tile | tile-resurfacing/cracked |
| bt1 — Resurface bath | bath-resurfacing/colour |
| bt2 — Fix chip | bath-resurfacing/chips |
| bt3 — Remove scratches/stains | bath-resurfacing/stain |
| bs1 — Resurface basin | basin-restoration/worn |
| bs2 — Fix chip (basin) | basin-restoration/chips |
| vn1 — Resurface benchtop | vanity-refinishing/dated |
| vn2 — Repaint cabinet | vanity-refinishing/peeling |
| vn4 — Fix chip/scratch (vanity) | vanity-refinishing/scratched |
| fl1 — Floor regrouting | floor-tile-regrouting/discoloured |
| fl4 — Cracked floor tile | tile-resurfacing/cracked |

## ❌ Photos still needed (13)

### Shower (2 missing)
| ID | What it shows | Save to |
|---|---|---|
| **sh3** | Black mould in silicone corners (close-up) → fresh white silicone | `public/images/services/shower/sh3-before.png` + `sh3-after.png` |
| **sh6** | Built-up grime/soap scum on grout → professionally cleaned + sealed | `public/images/services/shower/sh6-before.png` + `sh6-after.png` |

### Bath (1 missing)
| ID | What it shows | Save to |
|---|---|---|
| **bt4** | Mouldy/peeling silicone seal around bath rim → fresh sealed edge | `public/images/services/bath/bt4-before.png` + `bt4-after.png` |

### Vanity (1 missing)
| ID | What it shows | Save to |
|---|---|---|
| **vn3** | Plain laminate benchtop → granite/marble stone-fleck finish | `public/images/services/vanity/vn3-before.png` + `vn3-after.png` |

### Mould & Corners (3 missing — separate folder)
| ID | What it shows | Save to |
|---|---|---|
| **ml1** | Mouldy shower corners (close-up) → fresh silicone | `public/images/services/mould/ml1-before.png` + `ml1-after.png` |
| **ml2** | Mould in shower + bath corners → both refreshed | `public/images/services/mould/ml2-before.png` + `ml2-after.png` |
| **ml3** | Multiple mouldy joints around bathroom → all sealed fresh | `public/images/services/mould/ml3-before.png` + `ml3-after.png` |

### Floor (3 missing)
| ID | What it shows | Save to |
|---|---|---|
| **fl2** | Outdated coloured floor tiles → modern colour after coating | `public/images/services/floor/fl2-before.png` + `fl2-after.png` |
| **fl3** | Standard wet-looking floor tile → invisible anti-slip applied (looks identical, may be hard to photograph — could use a "wet floor with grip" demo) | `public/images/services/floor/fl3-before.png` + `fl3-after.png` |
| **fl5** | White powdery efflorescence on tiles → clean tiles | `public/images/services/floor/fl5-before.png` + `fl5-after.png` |

### Wall Tiles (3 missing — separate folder)
| ID | What it shows | Save to |
|---|---|---|
| **wl1** | Stained wall tile grout (NOT shower or floor) → clean white grout | `public/images/services/walls/wl1-before.png` + `wl1-after.png` |
| **wl2** | Dated wall tiles → modern colour after spray coating | `public/images/services/walls/wl2-before.png` + `wl2-after.png` |
| **wl3** | Cracked wall tile → seamless repair | `public/images/services/walls/wl3-before.png` + `wl3-after.png` |

## Photo specs

| Spec | Value |
|---|---|
| Format | PNG or JPG |
| Recommended size | 900×600 (matches existing) |
| Display size | 200×140 (rendered at 50/50 split in card) |
| Min size | 600×400 |
| Subject framing | Tight crop on the affected area, similar lighting before/after |
| Tip | Take both photos from the same angle + distance + lighting for a clean visual transformation |

## How to add new photos later

1. Drop the file into the path shown above (matching `*-before.png` and `*-after.png`)
2. If you create a new folder (e.g. `mould/` or `walls/`), the structure handles it automatically
3. Hard-refresh the dev server (Cmd+Shift+R) — Vite picks them up
4. No code changes needed — `QuoteForm.jsx` already references these paths

## Quick reference of placeholder appearance

Services without photos still show a colored placeholder rectangle from `placehold.co` (so the form still renders). The placeholder colors hint at the missing image (dark = before/dirty, light = after/clean).
