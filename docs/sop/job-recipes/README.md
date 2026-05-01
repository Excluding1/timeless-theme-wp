# Job Recipes — per-SKU operational specs

**Purpose:** One detailed MD file per SKU (140 total in [master pricing Excel](../../../data/pricing/master-pricing-2026-05-01-snapshot.xlsx)). Each recipe contains everything a subcontractor needs to do that exact job + everything the office needs to dispatch + quote it correctly.

**Future use case (per Allan 2026-05-01 PM):** these recipes will be the canonical source for:
1. **Sub-facing job card app** — sub opens job in ServiceM8 / future app, sees the recipe inline (steps + materials + photos required + quality checks)
2. **Job acceptance flow** — sub previews recipe before accepting (sees what's required, can decline if unsuitable)
3. **AI Quote Drafter** ([Phase 6.1 spec](../../specs/ai-employees/)) — reads recipe to generate accurate 3-tier quotes
4. **Onboarding training** — new subcontractors review recipes for services they're approved to do
5. **Customer FAQ** — extract customer-facing portions for landing pages + quote pages

**Status:** template built ✅; 5 exemplar SKUs built (covering main categories); remaining ~135 SKUs queued for fill-out via [AI Trades Researcher](../../specs/ai-employees/trades-researcher.md) once that agent is live, OR built one-by-one as we encounter the SKU in a real job (just-in-time).

---

## File naming convention

`{SKU-CODE}-{kebab-case-name}.md`

Examples:
- `BTH-01-bath-resurface-standard.md`
- `RSC-02-shower-regrout-standard-cement.md`
- `FBP-01-full-bathroom-regrout-bath-basin.md`

---

## Template structure (parseable for future app)

Each recipe follows the [TEMPLATE.md](TEMPLATE.md) structure with these sections:

| Section | What it contains | Why |
|---|---|---|
| Frontmatter (top metadata) | SKU code, category, hours, T1/T2/T3, status, last_updated | App parses for filtering + display |
| 1. Customer-facing summary | What we tell the customer (1-paragraph + scope bullets) | Quote drafting + landing page extraction |
| 2. Pre-job checklist | Photo review, asbestos check, scope confirmation, customer prep instructions | Office uses before dispatch |
| 3. Materials list (parseable table) | Brand + product + qty + cost + supplier | Sub buys + we reimburse; AI can validate against approved list |
| 4. Tools required | Specific equipment with brand examples | Sub readiness check at vetting |
| 5. Time breakdown (parseable table) | Phase × duration | Realistic scheduling |
| 6. Step-by-step recipe (the "how") | Numbered procedure | Sub follows; AI can train on this |
| 7. Quality criteria | What "done well" looks like + photo requirements | Photo review automation (AI Photo Quality agent) |
| 8. Common issues + handling | What can go wrong mid-job | Sub scripts; reduces escalations |
| 9. Cost breakdown (parseable table) | Direct + indirect → net profit | CEO transparency, AI margin model |
| 10. Pricing tiers | T1/T2/T3 with what each includes | Quote drafter logic |
| 11. Warranty | Terms specific to this service | ACCC compliance |
| 12. Failure modes + protections | Cross-ref to [sub-risk-scenarios-playbook](../sub-risk-scenarios-playbook.md) | Risk awareness |
| 13. App integration notes | What this looks like in the future job card app | Future builder reference |

---

## Roster — built ✅ / pending ⬜

### Built (5 exemplars across categories)
| SKU | File | Category | Notes |
|---|---|---|---|
| ✅ BTH-01 | [BTH-01-bath-resurface-standard.md](BTH-01-bath-resurface-standard.md) | BATH RESURFACE | Premium positioning lift to $1,290 (audited 2026-05-01) |
| ✅ RSC-02 | [RSC-02-shower-regrout-standard-cement.md](RSC-02-shower-regrout-standard-cement.md) | REGROUT+SIL CEMENT | Top-volume SKU, $1,660 T2 |
| ✅ FBP-01 | [FBP-01-full-bathroom-regrout-bath-basin.md](FBP-01-full-bathroom-regrout-bath-basin.md) | FULL BATHROOM | Highest-revenue SKU, $3,200 T2 |
| ✅ SIL-01 | [SIL-01-silicone-shower-only.md](SIL-01-silicone-shower-only.md) | SILICONE | Quick add-on, $630 T2 (post-audit lift) |
| ✅ CHR-01 | [CHR-01-bath-chip-repair-single.md](CHR-01-bath-chip-repair-single.md) | CHIP REPAIR | Allan-set $380 T2; opportunistic add-on |

### Pending (top 15 by revenue priority — next batch when needed)
| SKU | Category | Trigger to build |
|---|---|---|
| ⬜ RSC-03 Large shower regrout cement | REGROUT+SIL CEMENT | First large shower regrout job |
| ⬜ RSE-02 Standard shower regrout epoxy | REGROUT+SIL EPOXY | First epoxy upgrade |
| ⬜ BTH-02 Bath resurface large | BATH RESURFACE | First large/clawfoot bath |
| ⬜ BTV-02 Porcelain/Enamel Steel bath | BATH TYPE | First enamel/cast iron bath |
| ⬜ TWL-02 Tile recoat medium | TILE RESURFACE | First tile recoat job |
| ⬜ FBP-02 Full bathroom epoxy | FULL BATHROOM | First epoxy full bathroom |
| ⬜ SLC-04 Silicone full bathroom | SILICONE | First whole-bathroom silicone |
| ⬜ SOB-01 Shower-over-bath combo | SHOWER-OVER-BATH | First shower-over-bath job |
| ⬜ TBC-02 Tile + bath combo large | TILE+BATH COMBO | First combo job |
| ⬜ ENS-01 Ensuite small | ENSUITE | First ensuite job |
| ⬜ BSN-01 Basin standalone | BASIN RESURFACE | First standalone basin |
| ⬜ FBR-01 Full bathroom regrout cement | FULL REGROUT | First full regrout job |
| ⬜ GCS-02 Grout colour seal standard | COLOUR SEAL | First colour seal job |
| ⬜ ASL-01 Anti-slip shower floor | ANTI-SLIP | First anti-slip job |
| ⬜ AMP-01 Annual maintenance package | MAINTENANCE | First annual maintenance |

### Remaining ~120 SKUs
Generated as needed via [AI Trades Researcher commission](../../specs/ai-employees/trades-researcher.md) — each recipe takes ~15-30min to generate from the master pricing row + the TEMPLATE structure. **Do NOT pre-generate all 140**; build just-in-time when:
- A real customer books that SKU (highest priority)
- A new subcontractor onboards for that SKU type (training need)
- AI Quote Drafter needs the recipe for accuracy

---

## Process for AI to fill remaining SKUs

When CEO commissions [trades-researcher](../../specs/ai-employees/trades-researcher.md) to build a recipe:

```
@ai-trades-researcher: Build job recipe for SKU [code].

Inputs:
- data/pricing/master-pricing-2026-05-01-snapshot.xlsx row for this SKU (extracts pricing, hours, materials cost, sub labour, warranty)
- data/suppliers/austrs-bert-prices-2026-04-30.csv (Bert's prices for Hawk consumables)
- docs/sop/job-recipes/TEMPLATE.md (structure)
- 5 exemplar recipes (BTH-01, RSC-02, FBP-01, SIL-01, CHR-01) for style reference
- docs/sop/sub-quality-rubric.md for quality criteria
- docs/sop/sub-materials-standard.md for approved-products list

Output: docs/sop/job-recipes/{SKU}-{name}.md per template

Confidence threshold: 75%; below → flag CEO for review

Deadline: 1hr per recipe.
```

CEO reviews + approves; recipe goes live in roster.

---

## Cross-references

- [TEMPLATE.md](TEMPLATE.md) — the structure all recipes follow
- [data/pricing/master-pricing-2026-05-01-snapshot.xlsx](../../../data/pricing/master-pricing-2026-05-01-snapshot.xlsx) — source of truth for pricing data
- [data/suppliers/austrs-bert-prices-2026-04-30.csv](../../../data/suppliers/austrs-bert-prices-2026-04-30.csv) — Bert's product prices
- [sub-quality-rubric.md](../sub-quality-rubric.md) — quality criteria each recipe references
- [sub-materials-standard.md](../sub-materials-standard.md) — approved brands list
- [sub-risk-scenarios-playbook.md](../sub-risk-scenarios-playbook.md) — failure modes
- [docs/templates/customer-aftercare-cards.md](../../templates/customer-aftercare-cards.md) — aftercare card variants per service
- [docs/specs/ai-employees/trades-researcher.md](../../specs/ai-employees/trades-researcher.md) — AI that fills remaining recipes
- [docs/specs/ghl-pipeline-13-stage.md](../../specs/ghl-pipeline-13-stage.md) — workflow that uses recipes for quote drafting
- [docs/FUTURE-PLAN.md § Phase 6.1](../../FUTURE-PLAN.md) — AI Quote Drafter that reads these
