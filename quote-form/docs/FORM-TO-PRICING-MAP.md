# Quote Form v10 → Master Pricing SKU Map

**Source:** `data/pricing/master-pricing-2026-05-01-snapshot.xlsx` — sheet "All Services & Pricing" (141 SKUs)
**Form:** `src/QuoteForm.jsx` v10 — locked spec (5 areas, multi-bathroom loop, inline photos)
**Resolver:** `src/lib/pricing-resolver.js`

---

## Spec changes from v9.2 → v10

**Removed**
- Mould-as-a-separate-area (silicone is bundled into shower / bath services)
- Spa flag (CHR-09 / BTV-05/06 routing now happens server-side from photos)
- Size selectors (photos disambiguate)
- Tile material selectors (ceramic / porcelain / stone / mosaic visible in photos)
- Hollow-tile question (tradesperson check at site visit)
- Urgency question (customer puts in notes if rush)
- Shower-over-bath question (photos show this)
- Multi-mode dichotomy (single vs multi UI replaced with single per-area-section flow)
- "Not sure" / unsure description path (customers describe in notes textarea)

**Added**
- Bathroom count question on Step 2 (1 / 2 / 3+)
- Multi-bathroom loop on confirmation screen (preserves person + property; clears bathroom-specific state)
- Multi-bathroom discount logic (-$200 for #2, -$300 for #3+)
- Full bathroom makeover toggle with 3 scope chips (regrout-only / resurface-only / both)
- Inline per-area photos with "+" extras button (max 6 per area)
- Pricing resolver module producing line_items + modifiers + rejection_flags + tier_default

**Kept**
- Pre-1990 asbestos screen (NSW Excel rejection #8)
- Tenant landlord-auth flow
- Out-of-NSW waitlist
- Phone validation (mobile + landline + +61 normalisation)
- Address autocomplete (Google Places, NSW bounding box)
- Image compression (1920px JPEG q0.8)
- Webhook retry (3× exponential backoff)
- localStorage persistence
- Honeypot anti-spam
- Tracking (UTM/GCLID)
- Marketing consent (Spam Act 2003)

---

## How the mapping works

The form is a **lead intake** that gathers everything needed to build a quote without forcing customers to learn tradesperson taxonomy. Customers pick:
1. **Areas** they want worked on (5 options + full bathroom toggle)
2. **Service per area** in plain English (with trade term in italic)
3. **Photos** that disambiguate the SKU pool

The resolver narrows the SKU pool based on form data; the tradesperson picks the final SKU after photo review.

Mapping legend:
- **1:1** — Form pick maps to exactly one Excel SKU
- **1:N** — Form pick maps to several SKUs, photo review picks final
- **Photo-disambiguated** — pool narrowed by visible properties

---

## Per-area SKU pools

### Shower
| Form pick | Trade term | SKU pool | Type |
|---|---|---|---|
| Full shower regrouting — grout lines + corner silicone | regrouting + siliconing | RGC-01..04 (cement) OR RGE-01..04 (epoxy) + SIL-01 | 1:N + bundled silicone |
| Change the tile colour | tile resurfacing | TSR-01..06 | 1:N (sized by photo) |
| Both — full regrout and tile colour change | full transformation | RSC-01..04 OR RSE-01..04 (combo) | 1:N |

### Bath
| Form pick | Trade term | SKU pool | Type |
|---|---|---|---|
| Resurface — make it look new | bath resurfacing | BTH-01/02/03 OR BTV-01..06 + SIL-02 | 1:N (acrylic / porcelain / cast iron / fibreglass / spa from photo) |
| Just fix a chip or two | chip repair | CHR-01 (1 chip <20mm) OR CHR-02 (2-5) OR CHR-09 (spa) | 1:N (count + spa from photo) |
| Full restoration — resurface + chip repair | full restoration | BTH-01..03 + CHR-01/02 | 1:N (chips covered by resurface) |

### Basin & vanity (combined area)
| Form pick | Trade term | SKU pool | Type |
|---|---|---|---|
| Resurface basin and vanity top | top resurfacing | BSN-01/02/03 + VAN-01/02 | 1:N (single / double / moulded from photo) |
| Resurface doors and sides too | full vanity resurfacing | BSN + VAN + VCR-01/02 + LBR-01/02 | 1:N (cabinet style from photo) |

### Bathroom walls (tiled, outside shower)
| Form pick | Trade term | SKU pool | Type |
|---|---|---|---|
| Refresh the grout lines | wall regrouting | BWR-01 (cement) OR BWR-02 (epoxy) | 1:1 by epoxy flag |
| Change the tile colour | wall tile resurfacing | TSR-10 (half-height) OR TSR-11 (full-height) | 1:N (sized by photo) |
| Both — regrout + tile colour change | full wall refresh | BWR + TSR-10/11 | 1:N |

### Floor tiles
| Form pick | Trade term | SKU pool | Type |
|---|---|---|---|
| Refresh the grout lines | floor regrouting | BFR-01/02 (cement) OR BFR-03/04 (epoxy) | 1:N |
| Change the tile colour | floor tile resurfacing | TSR-07/08/09 + anti-slip additive | 1:N (sized by photo) |
| Both — regrout + tile colour change | full floor refresh | BFR + TSR-07..09 | 1:N |

---

## Full bathroom makeover (toggle)

When customer toggles "Full bathroom makeover" on Step 3, the 5-area selector is replaced with one of three scope chips. The pool is the matching FBR/FBP package.

| Scope | Trade term | SKU pool |
|---|---|---|
| Just refresh the grout everywhere | full regrout | FBR-01/02 (cement) OR FBR-03/04 (epoxy) |
| Just change the colour of everything | full resurface | FBP-03/04 |
| Full transformation — both | regrout + resurface | FBP-01/02 OR FBP-05/06 |

Implicit pool extensions (resolver picks based on photo evidence):
- CMB-01..11 (Shower + Bath combos) when shower-resurface AND bath-resurface
- MIX-01..03 (Mixed shower + bath variants)
- ENS-01..03 (Ensuite packages — `prop="apt"` + small bathroom)
- TBC-01..04 (Tile + Bath combo)
- TRC-01..03 (Tile + Regrout combo)

---

## Modifiers (auto-applied by resolver from form data)

| Modifier ID | Label | Trigger from form | Delta |
|---|---|---|---|
| R5 | Strip-back previous coating | `previously_resurfaced === "yes"` | +$250 |
| R6 | Epoxy grout upgrade | `epoxy_mode === "epoxy"` AND any regrout service | +$250 |
| R14 | Multi-storey access (no lift) | `property_type === "apt"` AND `lift_access === "no"` | +$80 |
| R19 | Temporary ventilation setup | `has_ventilation === "no"` AND chemical work | +$100 |
| DISC-MB | Multi-bathroom discount | `bathroom_index > 1` | -$200 (#2), -$300 (#3+) |

### Modifiers applied at quote stage (not from form data)

These come from photo review by the tradesperson, not from the form:
- Extreme mould (+$150)
- Natural stone (+$300)
- Mosaic (+$350)
- Niche / seat (+$100 each)
- Cast-iron bath (+$200)
- Hard water (+$50)
- Weekend booking (+$200) — only if customer requests it

---

## Rejection flags (warn, don't block)

| Flag ID | Severity | Trigger | Action |
|---|---|---|---|
| REJ-08 | warn | `built_before_1990 === "yes"` | Confirm asbestos clearance certificate before disturbing tile adhesive |
| REJ-08-UNSURE | info | `built_before_1990 === "unsure"` | Check property age on quote call |

### Site-visit-only rejections (not asked in form)

These are tradesperson checks, not customer questions:
- Hollow tiles (tap test on site)
- Active leak behind walls (visual + moisture meter)
- Glass / stone / Corian basin (visible at quote visit, not from form)
- Substrate movement / structural cracks
- Pre-existing waterproofing failure
- Damage by other trades

---

## Customer tier defaults

| Customer type | Tier | Logic |
|---|---|---|
| owner | T2 | Standard owner-occupier (~80% of jobs) |
| pm | T1 | Property managers expect trade pricing |
| builder | T1 | Builders bundle multiple jobs |
| tenant | T2 | Owner-equivalent (or routed via landlord) |

Tradesperson can override at quote build time.

---

## Webhook payload schema (v10)

```jsonc
{
  "firstName": "Allan", "lastName": "Pham", "email": "...", "phone": "+61451110154",
  "customData": {
    // Customer
    "customer_type": "owner|pm|builder|tenant",
    "company_name": "",
    "tenant_auth": "self|send|",
    "landlord_email": "",

    // Property
    "property_type": "house|apt|comm",
    "property_address": "...",
    "lift_access": "yes|no|n/a|not_specified",
    "built_before_1990": "yes|no|unsure|not_asked",

    // Multi-bathroom
    "bathroom_count": "1|2|3+",
    "bathroom_index": "1|2|...",

    // Services
    "full_bathroom_mode": "yes|no",
    "full_bathroom_scope": "regrout_only|resurface_only|both|",
    "selected_areas": "shower, bath, basin_vanity, walls, floor",
    "area_services_json": "{\"shower\":[\"full_regrout\"], \"bath\":[\"resurface\"]}",
    "services_summary": "Shower: ... | Bath: ...",
    "epoxy_mode": "standard|epoxy",

    // Conditional
    "previously_resurfaced": "yes|no|unsure|not_asked",
    "ventilation": "yes|no|not_asked",

    // Notes & consent
    "customer_notes": "free text",
    "marketing_consent": "yes|no",

    // Photos
    "photo_count_total": "5",
    "photo_count_by_area": "{\"shower\":3, \"bath\":2}",
    "photos_uploaded": "yes|no",

    // Resolved quote skeleton (for downstream automation)
    "resolved_line_items_json": "[{\"area\":\"shower\", ...}]",
    "resolved_modifiers_json": "[{\"key\":\"epoxy_upgrade\", ...}]",
    "resolved_rejection_flags_json": "[]",
    "resolved_tier_default": "T2",
    "resolved_multi_bathroom_discount": "-200",

    // Tracking + meta
    "gclid": "...", "utm_source": "...", "landing_page": "/quote",
    "form_status": "complete",
    "form_version": "v10.0",
    "submitted_at": "2026-05-02T14:30:00Z",
    "user_agent": "...",
    "device_type": "mobile|desktop"
  }
}
```

---

## Expert verdict

**v10 captures everything needed to build an accurate quote, with fewer customer questions than v9.2.**

Wins from the locked spec:
- 5 areas instead of 7 (mould collapsed into bundled silicone, walls scope clarified)
- Single-section UI replaces single/multi-mode dichotomy
- Photos shifted from end-of-form pool to inline per-area sections — customer associates each photo with each area mentally
- Multi-bathroom loop preserves person + property data, only resets bathroom-specific state
- Conditional fields (epoxy upgrade, prev resurfaced, ventilation) only appear when relevant

Form completion estimate: **75-90 seconds** for single-bathroom owner with 1 photo per area, vs ~2 minutes in v9.2.

Outstanding items (deferred to follow-up):
- Privacy Policy update for photo handling + APP 8 cross-border disclosure (still outstanding from v9.2)
- Live AI vision pre-screening (Phase 2)
- Backend resolver test suite (resolver is a stub; integration tests vs real master pricing recommended before launch)

The form is doing its job: structured intake that doesn't lose any pricing-critical data while staying mobile-first and conversion-friendly.
