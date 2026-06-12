# Business State Tracker

**Purpose:** Single source of truth for the current state of every account, asset, account credential, and known fact about the business. CEO updates when verified. Allan + Marko update when they change something.

> **⚠️ AUTHORITY RULE (added 2026-06-07): This file is THE source of truth for "is X set up / live."** No other doc (memory logs, roadmaps, specs) may assert an integration is done/connected/live — they defer HERE. On ANY setup change, update this file the **same day** (Rule 11). It drifted once: the Twilio row read `❌` here while Twilio→GHL had actually been **LIVE since 2026-05-16**, which produced a wrong "buy a Twilio number" instruction on 2026-06-07. Build-sequence / critical-path lives in `docs/specs/FINALIZATION-ROADMAP-2026-06-07.md`; for "is it set up," THIS file wins.

**Status legend:**
- ✅ Done / Active / Verified
- ⏳ In progress / Pending
- ❌ Not started
- ❓ Unknown — CEO needs to ask
- 🔒 Sensitive — credentials handled separately

**Last verified:** 2026-06-12 (full-repo Pattern-C audit: site+form LIVE 06-11, pipeline certified ×5, first customer Lisa Vruwink, email-DNS state verified, board refreshed). Prior: 2026-06-08 (Make Scenario 1 strip-contact + Scenario 3 back-sync + PIT write-scope + contractor app building), 2026-06-05 (SM8-keep + no-contact + data-capture sheet live)
**Prior verifications:** 2026-05-01 (initial), 2026-05-16 (F-LOCKs), 2026-05-21 (Day 6 sync), 2026-05-26 PM (Day 1 sprint signups + canonical updates), 2026-06-02 ($10M PL + Cloudinary correction)

---

## 1. Legal & Compliance

| Item | Status | Details | Last verified |
|---|---|---|---|
| ABN — Allan | ✅ | Per saved memory | 2026-05-01 |
| ABN — Marko | ❓ | CEO to ask | — |
| **GST registration** | ✅ **REGISTERED** | **Allan confirmed 2026-06-12** — quotes/invoices say "inc GST"; Xero invoices must apply GST; BAS lodgement cycle applies (add to tax calendar). Resolves open design decision #3. | 2026-06-12 |
| ABN — Pty Ltd company | ❌ | Deferred until revenue >$5K/mo for 3 months | — |
| ASIC Business Name registration | ✅ | "Timeless Resurfacing" — 1 year, paid $45 on 2026-03-27 (per finance dashboard) | 2026-05-01 |
| Business name renewal | ⏳ | Next due March 2027 | — |
| Public Liability Insurance | ✅ Active | **F2 LOCK 2026-05-16, CORRECTED 2026-06-02:** Marko PL ACTIVE. Cover is **$10M PL** (Allan-confirmed 2026-06-02 — was mis-recorded as $20M; live theme + Terms corrected to $10M). Full schedule (products liability / sub extension / statutory liability) to verify against the Certificate of Currency (Allan sending). Locked in `memory/f_responses_locked_2026-05-16.md`. | 2026-06-02 |
| Professional Indemnity | ❓ | CEO to ask | — |
| WorkCover NSW | ❌ | Not required while no employees, only contractors | — |
| Builder Licence | ❌ DEFERRED INDEFINITELY | **Allan's call 2026-05-01**: lengthy process (22-27 weeks via partner cert path; 13 weeks via licensed-supervisor hire) + insufficient funds. Strategy: keep all jobs <$5K HBA threshold via per-bathroom invoice splitting. Revisit when funds + revenue allow. Future pathway documented in [CEO.md § Compliance](CEO.md). | 2026-05-01 |
| Privacy Policy (published) | ❓ | CEO to ask if exists on website + linked from quote form | — |
| Terms of Service (customer-facing) | ❌ | Need to draft before first quote | — |
| Subcontractor Agreement template | ❌ | Engage Sprintlaw (~$200) before first subcontractor signs | — |
| Founder Partnership Agreement | ❌ | Defer to Pty Ltd setup OR draft when going formal | — |

---

## 2. Financial Accounts

| Item | Status | Details | Last verified |
|---|---|---|---|
| Business bank account | ✅ | **Westpac Business partnership account**, opened mid-April 2026. Partnership agreement + IDs used to open. | 2026-05-01 |
| $100 bank signup bonus | ✅ Received | F10 LOCK 2026-05-16: $100 arrived. Cash on hand updated. | 2026-05-16 |
| Current cash on hand | $1,600 | Per starting capital + $100 bank bonus, after $187.56 expenses tracked. F10 LOCK 2026-05-16. | 2026-05-16 |
| Stripe account | ✅ **LIVE** | Production mode active since May 2 2026. Verified today (2026-05-26): "all green no banner" — full AU verification complete, Westpac payouts connected, payment methods Card + PayTo enabled (Zip skipped). | 2026-05-26 |
| pay.com.au account | ❌ DEFERRED indefinitely | **Decision 12 v2 LOCKED 2026-05-25**: defer until first external sub onboarded AND volume justifies rewards-points optimization. Phase 1 sub payouts via Westpac EFT (free, SOPA-compliant). | 2026-05-25 |
| Rewards credit card linked to pay.com.au | N/A while deferred | When pay.com.au activates (Phase 2+), revisit card choice | — |
| Xero accounting | ✅ **LIVE — Grow tier** | Signed up 2026-05-26 with 100% off 6-month referral promo (saves $450 over standard pricing first 6mo). Standard Grow $75/mo from Month 7 (2026-11-26) — calendar reminder set for 2026-11-21 review. Stripe app installed + connected; Westpac bank feed REQUESTED (pending Westpac authorization 1-24h); invoice template with virtual address (AnyTime Mailbox Ultimo) + payment advice (BSB+account for Osko backup). | 2026-05-26 |
| Bookkeeping current state | ✅ Xero LIVE | Stripe→Xero auto-sync configured. Westpac bank feed pending activation (async, no blocker). Chart of accounts default + Stripe Clearing Account added. | 2026-05-26 |

### Revenue & expenses (per Allan's dashboard, 2026-05-01)
| Type | Amount |
|---|---|
| Total Revenue | $0 (the $1,600 in dashboard is starting capital + $100 bonus, not revenue) |
| Total Expenses | $187.56 |
| Cash on hand | $1,600 (F10 LOCK 2026-05-16: $100 bonus arrived) |
| Monthly recurring | $193.60 (Google Workspace $18.88 + GHL Starter PAID $155 + small recurring $19.72 per F3 LOCK) |
| Pending receivable | $0 (bonus received) |

### Active subscriptions (per finance dashboard)
| Subscription | Cost | Type | Renewal | Owner |
|---|---|---|---|---|
| Google Workspace Business Standard | $18.88/mo (rising to $22.95/mo from 2026-07-06) | Email | Monthly auto | Both |
| GoHighLevel Starter | $155/mo AUD PAID (F3 LOCK 2026-05-16 — trial converted) | CRM | Monthly auto | Both |
| Ventraip domain timelessresurfacing.com.au | $0 (active to 23 Mar 2027, then $22.95/yr) | Domain | Annual | Both |
| Ventraip WordPress/cPanel hosting | $222/yr (next 03 Apr 2027) | Hosting | Annual | Both |
| Cloudflare .com domain | $14.68/yr (next 28 Apr 2027) | Domain | Annual | Both |

### Past one-off expenses
| Date | Item | Amount |
|---|---|---|
| 2026-04-28 | Cloudflare .com domain | $14.68 |
| 2026-04-06 | Google Workspace email | $18.88 |
| 2026-04-03 | Ventraip hosting annual | $99.00 |
| 2026-03-30 | International calls to NZ | $10.00 |
| 2026-03-27 | ASIC Business Name 1yr | $45.00 |

---

## 3. Domains & Hosting

| Item | Status | Details | Last verified |
|---|---|---|---|
| timelessresurfacing.com.au | ✅ Active | Via Ventraip, expires 23 Mar 2027 | 2026-05-01 |
| timelessresurfacing.com | ✅ Active | Via Cloudflare, expires 28 Apr 2027 | 2026-05-01 |
| Domain DNS configured | ✅ | Cloudflare proxying, hosting on Ventraip cPanel (IP 110.232.143.168) per HANDOFF.md | 2026-05-01 |
| WordPress installation | ✅ | On Ventraip cPanel, live at https://timelessresurfacing.com.au | 2026-05-01 |
| WordPress admin URL | ✅ | https://timelessresurfacing.com.au/wp-admin/ | 2026-05-01 |
| WordPress admin credentials | 🔒 | Allan has, Marko ❓ | — |
| WordPress theme | ✅ | Custom — `timeless-theme-wp/` repo at https://github.com/Excluding1/timeless-theme-wp | 2026-05-01 |
| Theme on live site | ✅ Verified | **`timeless-theme-2`** active (v1.5, deployed 2026-06-11; stale copies deleted). Deploy zip MUST be named `timeless-theme-2.zip` (CLAUDE.md runbook) | 2026-06-11 verified |
| WP pages on live | ✅ ~37 pages | Per sitemap.xml: home + 7 main + 19 service pages + 10 suburb (bath-resurfacing) + faqs + sydney + privacy | 2026-05-01 verified |
| WP Customizer phone | ✅ 0451 110 154 | Allan confirmed + curl verified | 2026-05-01 |
| WP Customizer email | ❓ | CEO to verify | — |
| WP Customizer ABN | ❓ | CEO to verify exists in footer | — |
| WP Customizer licence placeholder | ❓ | CEO to verify it's been REMOVED (Override 5: no licence claim) | — |
| URL pattern on live | ✅ `/services/X/` | NOT `/X-sydney/` despite file template names. Pattern: `/services/[service-slug]/` for services, `/services/[service]/[suburb]/` for suburb pages | 2026-05-01 |
| Suburb pages live | ✅ 10 suburbs for bath-resurfacing only | Parramatta, Penrith, Castle Hill, Chatswood, Mosman, Hornsby, Bondi, Surry Hills, Manly, Strathfield. Memory entry "suburbs are data-driven not separate pages" likely meant this implementation pattern | 2026-05-01 |
| Theme deploy workflow | ✅ | Per CLAUDE.md + WORKFLOW.md — git → zip → upload via wp-admin | 2026-05-01 |
| SSL certificate (non-www) | ✅ | AutoSSL via Let's Encrypt — validated | 2026-05-01 |
| SSL certificate (www) | ✅ | www returns 301 → non-www (handled at HTTP/2 with valid cert) | 2026-05-01 verified |
| .htaccess HTTP→HTTPS redirect | ✅ | http:// returns 301 → https:// | 2026-05-01 verified |
| Warranty text representation | ✅ Tier-aware ACL-compliant | "Up to 5-Year" headline + accurate breakdown "Epoxy: 5yr / Cement: 2yr". Not a problem. | 2026-05-01 verified |
| Tailwind CSS build | ✅ Local PostCSS | Per BUILD.md — compiled output `assets/main.min.css` committed to git | 2026-05-01 |
| Local dev environment | ✅ | wp-now on localhost:8881 per WORKFLOW.md | 2026-05-01 |
| Branch strategy | ✅ main + develop | Per WORKFLOW.md, archived branches as `archive/*` | 2026-05-01 |

---

## 4. Website & Pages

| Item | Status | Details | Last verified |
|---|---|---|---|
| Homepage (front-page.php) | ✅ Live | Hero slider, services grid, FAQ | 2026-05-01 |
| 19 service landing pages | ✅ Live | `page-templates/page-*-sydney.php` | 2026-05-01 |
| Page templates by service | ✅ | shower-regrouting, bath-resurfacing, tile-resurfacing, etc | 2026-05-01 |
| Privacy policy page | ✅ Live | /privacy/ live (62-URL audit 2026-06-11). ⏳ 3 approved-pending paragraphs (sub-disclosure, records, AI use) await Allan's "privacy yes" — text in memory/pending_copy_packs_2026-06-12.md | 2026-06-11 |
| Terms of service page | ✅ Live | /terms/ live; Allan has WIP edits in local working tree (uncommitted page-terms.php) | 2026-06-11 |
| About page | ✅ Live | Allan WIP edits local (page-about.php) | 2026-06-11 |
| Contact page | ✅ Live | Part of 62-URL audit pass | 2026-06-11 |
| 404 page | ✅ | Custom 404.php | 2026-05-01 |
| Quote form embed location | ✅ 13 pages | Homepage + sydney + 11 service pages via `[timeless_quote_form]` shortcode | 2026-06-11 |
| Mobile responsive | ✅ Tested | Per past audits | 2026-05-01 |

---

## 5. Quote Form (React)

| Item | Status | Details | Last verified |
|---|---|---|---|
| Location (NEW master hub) | `/Users/excluding/Downloads/timeless-theme-wp/quote-form/` | Absorbed into master repo 2026-05-01 PM. Old standalone folder `/Users/excluding/Downloads/timeless-quote-app/` preserved for safety until Allan confirms migration works (then he can delete) | 2026-05-01 PM verified |
| GitHub | `Excluding1/timeless-theme-wp` (single repo now). TimelessDash repo holds historical quote-form/react-v8 branch — to be archived per WORKFLOW.md retire policy | | 2026-05-01 PM |
| Build state | v10 GHL-wired (Day 8 prep complete) | v10.0 with NSW gating, asbestos check, multi-mode, photo upload + Day 8 prep applied (webhooks + secret_token + schema normalization). | 2026-05-21 |
| GHL_WEBHOOK URL | ✅ Wired Day 8 prep 2026-05-21 | W1 webhook URL at QuoteForm.jsx:876 (was REPLACE_ME at :633 pre-Day-8; file grew to 1953 lines). End-to-end verified via Vite dev test: form complete → W1 LIVE → Slack #quotes-in + Contact + Opp Stage 1. | 2026-05-21 |
| GHL_PARTIAL URL | ✅ Wired Day 8 prep 2026-05-21 | W2 webhook URL at QuoteForm.jsx:877 (was REPLACE_ME_PARTIAL at :634 pre-Day-8). W2 **PUBLISHED** (Allan screenshot 2026-06-11 — 17 enrolled, 1 active; stale DRAFT note corrected). | 2026-05-21 |
| secret_token | ✅ Wired via VITE_GHL_SECRET_TOKEN env | TR_secret_v2_<32-byte random base64url>. Validates at W1/W2 Action 1 If/Else Security Gate (default-deny on mismatch). Stored in .env.local (gitignored via *.local). Commit 856722d on feature/day8-react-form-ghl-wire-2026-05-20. | 2026-05-21 |
| Day 8 prep schema fixes | ✅ Applied 2026-05-21 | tenant_auth → tenant_authorisation (GHL key locked 2026-05-05); ventilation → has_ventilation; property_type apt/comm → apartment/commercial via propertyTypeMap; lead_source derived from UTM + referrer via deriveLeadSource() helper. Source: /tmp/day8-react-form-prep-plan-2026-05-20.md §3. | 2026-05-21 |
| Cloudinary photo upload | ✅ Wired | Wired via commit 2300503 (perAreaPhotoUrls + auto-upload to cloud `dysrfe5yh` / preset `timeless-form-photos`, unsigned Phase 1). ~~❌ TODO stub~~ superseded; matches §6 row. | 2026-06-02 |
| Trust badges | ✅ | Target: "Sydney Local • **$10M Insured** • Up to 5yr Warranty" (corrected $20M→$10M 2026-06-02 per Allan). Live PHP pages currently show generic "Fully Insured"; React form shows "$10M Insured". | 2026-06-02 |
| autoComplete attributes | ✅ | given-name, family-name, email — fixed this session | 2026-05-01 |
| Ventilation Q gating | ✅ | Now includes regrout services — fixed this session | 2026-05-01 |
| Bath bt4 silicone overlap note | ✅ | Fixed this session | 2026-05-01 |
| Form deployed to live site? | ✅ **LIVE 2026-06-11** | Theme v1.5 (timeless-theme-2) active; form on 13 pages; live e2e passed (GHL+Slack confirmed). **Mobile-handoff (desktop→phone QR) zip re-uploaded — Allan confirmed 2026-06-12 → handoff LIVE** | 2026-06-12 |
| Google Ads conversion fires on thank-you page | ❓ | Need to verify when Google Ads is set up | — |

---

## 6. Software / SaaS Stack

| Tool | Status | Details |
|---|---|---|
| Google Workspace | ✅ Active | Email + Drive |
| GoHighLevel | ✅ PAID $155/mo AUD | F3 LOCK 2026-05-16: trial converted to paid. Both founders signed up; Allan has watched tutorial. Day 1 of 2-week tech sprint kicks off 2026-05-17. **PIT (Private Integration Token): WRITE-scope VERIFIED 2026-06-07** (live opp update → HTTP 200) — Scenarios 2-5 NOT blocked on a new PIT. **workflows.readonly VERIFIED 2026-06-13** (API lists workflow names/status — W1/W2/W3/W6/W7/SM8-stage-11 all confirmed PUBLISHED; SMS bodies inside actions are NOT API-readable, eyeball in UI). contacts.readonly ABSENT (403). ⚠️ Still security-rotate before go-live (was exposed in-session). |
| Stripe | ✅ **LIVE** | Production mode active since May 2 2026, verified 2026-05-26 ("all green no banner"). Card + PayTo enabled (Zip skipped). |
| ServiceM8 | ✅ **Starter trial active — KEPT as field-service backbone** | Signed up 2026-05-26 with 50% off 12mo promo; trial converts to $14.50/mo at Day 14. Override 2 superseded by Decision 12 v2. **KEEP decision LOCKED 2026-06-05** ([decision-sm8-keep-vs-build](specs/decision-sm8-keep-vs-build-2026-06-05.md)) — do NOT build a replacement. **Pricing = per-JOB, UNLIMITED users** (the "per-staff/per-seat" assumption is STALE). **SUB-ENGAGEMENT MODEL LOCKED 2026-06-05:** subs via the **Timeless single-account dispatch app** (subs → OUR app → OUR one SM8 account; the app's own logged accept/decline); subs = app users, NOT SM8 Staff (Staff seats only for Marko/Allan/genuine employees); own ABN + ≥$10M PL gate. **SM8 Network = app-less interim/fallback only** — see [decision doc §SUB-ENGAGEMENT MODEL — LOCKED](specs/decision-sm8-keep-vs-build-2026-06-05.md). |
| Custom contractor-VIEW app | 🔨 **BUILDING — PULLED FORWARD 2026-06-08** (Allan: 1 job/wk = build window; supersedes "scheduled LAST") | A **separate, fresh** React PWA giving subs a NAME+ADDRESS-only view of offered jobs (accept/decline, availability, photos, complete), mediated by our backend (Supabase BFF/token-broker, sole SM8 key-holder). A **VIEW on the same SM8+GHL+Sheet data — ZERO migration**, NOT an SM8 replacement. **v1 feature set LOCKED + schema scaffolded** (`contractor-app/` — README + migration 0001). Next = Phase 1 backend (Supabase project). Specs: [blueprint](specs/contractor-app-blueprint-2026-06-05.md) + `contractor-app/README.md`. |
| Supabase (contractor-app backend) | ✅ **DEPLOYED + verified live 2026-06-09** | Ref `vyhtazylezuifxqlrnyw` · URL https://vyhtazylezuifxqlrnyw.supabase.co · Free tier (build phase, no real subs/legal gate). **Region ❓ confirm Sydney `ap-southeast-2`** (Allan). anon key → `contractor-app/web/.env.local` (public/RLS-gated, safe). 🔒 **service_role + DB password + access token → `.secrets/` (pending Allan)** — never chat/git. **Phases 1-3 + SM8 write-back DEPLOYED + proven 2026-06-09** (commits 84a88f2 Phase-1 live · d7bb48e Phase-2 auth/RLS/my-jobs · ba71db1 Phase-3 accept/decline/availability/handback/complete · 7762bf4 complete→SM8 write-back; contact-leak CI in place). Remaining: Phase 5 notifications (interim = Make→Twilio SMS) · accept→queue-move write-back (blocked ONLY on Marko's "which SM8 queue = booked" taxonomy) · Phase 6 final security review + first real sub (legal-gated). |
| Netlify (contractor-app frontend host) | ✅ **Preview LIVE 2026-06-09** | PWA deployed via Netlify API → **https://timeless-jobs-preview.netlify.app** (site id cccfd488; installable iOS/Android; SPA redirect + manifest + sw verified 200). **Sample/mock data** (backend not wired — Phase 2). Token → `.secrets/netlify-token.key`. ⚠️ **Exposed in chat → ROTATE before go-live** (with SM8 key + GHL PIT). Same Netlify-front/Supabase-back combo as TimelessDash. |
| Slack | ✅ Live | 6 channels (#quotes-in, #hot-leads, #pipeline-feed, #new-jobs, #job-issues, #automation-errors); +2 planned Day 2-3. |
| Make.com | ✅ **Live — Scenarios 1 + 3 built & proven** | Make Plan $9/mo. **Scenario 1 (DONE+verified live 2026-06-07):** core + SAFETY (secret gate · opp_id dedup · error→Slack) + DATA-CAPTURE + **strip-contact = DONE** (SM8 jobs show NAME + ADDRESS only, no customer phone/email — job #14 Jordan Faketest passed; `Add Job Contact` dropped). **HEARTBEAT PASSED 2026-06-11 ×5 runs: stage-11 drag → ONE SM8 job each (name+address only, 0 contact records, dedup held) + #new-jobs Slack ping CERTIFIED (TEST5 23:5x)** — Slack module lessons: the Make bot must be /invited to the channel AND the message goes in the TEXT field (plain text in the Blocks field = invalid_blocks rejection). W1→W2 disarm fix LIVE + proven (completed forms can no longer receive the abandoned-quote SMS; the Lisa bug class is dead). — root cause of the initial silence: the scenario's 'Immediately as data arrives' toggle was OFF since the Jun-7 tests (⚠️ checklist item: verify the toggle after ANY scenario editing). **Scenario 3 back-sync = DONE+PROVEN** (SM8 Completed → GHL Stage 15, idempotent + daily keep-alive). find-or-create CLIENT deferred (internal/invoicing-only). Scenario 4 buildable; Scenario 5 deferred (billing Qs). ✅ GHL "SM8 – Create Job on Stage 11" workflow **PUBLISHED** (Allan screenshot 2026-06-11; last updated Jun 04 — the earlier "DRAFT" note was stale). ✅ **Quote form DEPLOYED + live e2e PASSED 2026-06-11** (test lead → Cloudinary + W1 webhook → GHL Contact + Opp Stage 1 + Slack #quotes-in, Allan eyewitness). |
| Cloudinary | ✅ Live | Cloud `dysrfe5yh`, preset `timeless-form-photos` unsigned Phase 1; signed upload Phase 2 migration per Override 6 reasoning. |
| Per-job data-capture sheet (job log) | ✅ **Live** | Google Sheet — Make appends one row per job for future BigQuery + AI repeat-customer / household consistent-pricing. Capture-from-day-1 = one-way door; warehouse choice deferred/reversible. |
| Xero | ✅ **Grow LIVE** | Signed up 2026-05-26 with 100% off 6mo referral promo; standard Grow $75/mo from Month 7 (calendar reminder 2026-11-21). Stripe app installed + Westpac bank feed pending Westpac authorization. |
| pay.com.au | ❌ DEFERRED indefinitely | Decision 12 v2 LOCKED 2026-05-25: defer until first external sub onboarded AND volume justifies rewards-points optimization. Phase 1 sub payouts via Westpac EFT. |
| DocuSign | ❌ Defer per Decision 12 v2 | Marko-as-sub Phase 1; engage when first external sub onboards. |
| Sprintlaw subcontractor template | ❌ Deferred per Decision 12 v2 | Same trigger as DocuSign. |

---

## 7. Marketing Assets

| Item | Status | Details |
|---|---|---|
| Google Business Profile | ✅ Active | **5+ Google reviews live** (Allan 2026-06-11 — supports the site's 4.9★ claims; verify the actual average ≈4.9 and consider wiring the real count into the guarded `timeless_get_google_reviews()` schema) |
| GBP photos (real jobs) | ❌ | None — first job not done yet |
| GBP regular posts | ❌ | Not started — start Week 2 |
| Facebook Business page | ❓ | CEO to ask if exists |
| Instagram business account | ❓ | CEO to ask |
| TikTok business account | ❓ | CEO to ask |
| Logo files | ❓ | CEO to ask format/locations |
| Brand colour palette documented | ✅ | In CLAUDE.md — Navy `#041534`, Gold `#e7c08b` |
| Vehicle livery designed | ❌ | Phase 4 (with first job) |
| Branded uniforms (polos, hi-vis) | ❌ | Phase 4 |
| Photographer contact (for first-job shoot) | ❌ | Need to source local photographer |
| Stock images licensed (placeholder) | ❓ | CEO to ask if Adobe Stock or similar licensed |
| Brand voice document | ⏳ | Quick spec in CEO.md, full doc deferred |

---

## 8. Customer Pipeline

| Item | Status | Details |
|---|---|---|
| Customer enquiries received historically | ✅ At least 1 | **McGrath (real estate agency) PM called re a tenant's job** (Allan, mentioned 2026-06-11 — date/PM name/property/service/outcome ❓ CEO to capture). NOTE: an enquiry ≠ "trusted by"; no logo/endorsement use until a job completes AND written permission is obtained. |
| Network outreach lists (Allan) | ❌ Not built | Override 1 priority — target 25 contacts |
| Network outreach lists (Marko) | ❌ Not built | Same |
| First 3 customers booked | ❌ 0/3 | Goal by 2026-05-27 |
| Customer database (CRM contacts) | ✅ LIVE | GHL connected + taking leads since 2026-06-11; **first QUOTE-FORM customer Lisa Vruwink** (first website-inbound — completed form + photos, quote due 2026-06-12; the warm-referral + McGrath enquiries in the table below pre-date her) + test contacts pending purge |

### Active customer pipeline (CONFIRMED 2026-05-01 PM)

| # | Customer | Source | Service Needed | Status | Action needed |
|---|---|---|---|---|---|
| 1 | **Marko's prior regrouting customer** (name ❓) | Warm referral via Marko's previous job | Shower-over-bath resurface + strip-back (peeling existing coat) | 🟢 Soft-locked, "happy to wait until we establish business" | Marko: capture name, suburb, contact, photos. CEO: draft holding-quote message. |
| 2 | **McGrath PM (tenant job)** (PM name ❓) | Inbound call from McGrath property manager | Tenant's bathroom job (details ❓) | ❓ Status unknown (Allan mentioned 2026-06-11) | Allan: capture PM name/office, property, service needed, outcome. If it converts: first agency job → ask written logo/testimonial permission after completion. |

**Special considerations for this customer:**
- Strip-back surcharge applies (Excel Modifier — Rejection #9 territory)
- Combo bathtub/shower unit = SOB-01..04 SKU range
- Skilled resurfacing subcontractor required (Marko's established-business network)
- High-trust customer + perfect for first case study (real before/after photos, real testimonial, real Google review)
- Willingness to wait removes timeline pressure

---

## 9. Subcontractor Pipeline

**Engagement model (SUB-ENGAGEMENT MODEL LOCKED 2026-06-05 — [decision-sm8-keep-vs-build §SUB-ENGAGEMENT MODEL — LOCKED](specs/decision-sm8-keep-vs-build-2026-06-05.md)):** Subs engage via the **Timeless single-account dispatch app** — they authenticate to **OUR app** (Supabase Auth) → **OUR one SM8 account** (our backend = sole SM8 key-holder); the app's own built-in, **logged accept/decline = the right of refusal**. **Subs = app users, NOT SM8 "Staff"** (Staff seats reserved for Marko/Allan/genuine employees). **SM8 Network (subs on their own accounts) is RETIRED as the canonical model — kept ONLY as a documented app-less interim/fallback (Path A) if we launch before the app ships.** Subs supply own ABN + ≥$10M PL (verified before any offer); they invoice us per job; SM8 is per-JOB / unlimited users so subs cost nothing extra. **NO-CONTACT rule:** subs get **NAME + ADDRESS only — never customer phone/email** (anti-poaching); customer comms fire from GHL/Twilio. **Fair-Work guardrail (now applies to the app):** **never penalise a decline** — no counter/score/coaching-trigger in code; reframe any "decline >X%" idea as a capacity/fit conversation off-system. ⚖️ Legal review of the sub agreement before the first sub signs.

| Item | Status | Details |
|---|---|---|
| Subcontractors vetted + signed | ❌ 0 signed | Phase 3 target |
| Subcontractors in conversation | ❓ | CEO to ask if any informal conversations started |
| Bert (supplier) | ❓ | Voice transcripts pending — relationship type unknown |
| Hipages account (for subcontractor recruitment) | ❓ | CEO to ask |
| Airtasker account | ❓ | CEO to ask |
| Facebook trades groups joined | ❓ | CEO to ask |
| Subcontractor recruitment ad (Meta) | ❌ Not running | Override 8: deferred to Month 3 |

---

## 10. Communication Channels

| Channel | Status | Details |
|---|---|---|
| hello@timelessresurfacing.com.au | ❓ | CEO to verify exists + who has access. **quotes@/support@/billing@ aliases: ❌ not created (Allan, ~5 min in admin.google.com)** |
| Email DNS state (re-verified 2026-06-13 via dig) | ✅ GHL emails authenticated | MX → Google ✅ · SPF includes Google + LeadConnector + Mailgun ✅ · DMARC p=none ✅ · **GHL dedicated sending domain ACTIVE: `email.timelessresurfacing.com.au` → Mailgun CNAME + strict SPF + verification keys (GHL only verifies with DKIM passing) → GHL automation emails (W3 day-10 etc.) ARE authenticated** — the 06-12 "GHL sending domain ❌" row was WRONG (selectors live on the subdomain, not root). Remaining gap: **Google Workspace DKIM ❌** (manual Gmail sends sign as gappssmtp → weaker; 10-min flip = board 4.1). Definitive per-email check: Gmail → Show original → SPF/DKIM/DMARC PASS |
| Allan personal email | ✅ | allanpham106@gmail.com |
| Marko personal email | ❓ | CEO to ask |
| Business phone | ✅ | 0451 110 154 (per saved memory) |
| Twilio SMS number (via GHL, BYOT) | ✅ | **LIVE since 2026-05-16** — Twilio→GHL BYOT flip COMPLETE (Allan's team); sends from **+61 485 056 656**; ACMA **TimelessRsf** alpha-sender APPROVED 2026-05-17 (removed from pool to enforce unified-thread phone sender; kept for future bulk). Src: memory/day_3_phase_1a_emails_2026-05-06.md:21-24,303 |
| Slack workspace | ✅ Live | 6 channels live (see Software §6: #quotes-in, #hot-leads, #pipeline-feed, #new-jobs, #job-issues, #automation-errors). (Fixed 2026-06-08 — this row used to read ❌ and contradicted the Software row.) |
| WhatsApp Business | ❓ | CEO to ask if used |
| Customer SMS history (pre-launch) | ❓ | CEO to ask |
| Subcontractor conversation history | ❓ | CEO to ask |

---

## 11. Documentation & Knowledge Base

### CEO authority docs (current — updated 2026-05-01)
| Doc | Status | Location |
|---|---|---|
| CEO Playbook (CEO's brain) | ✅ | `docs/CEO.md` — supreme authority |
| State Tracker (this file) | ✅ | `docs/STATE.md` |
| OPERATING-CONTEXT.md | ✅ | `docs/OPERATING-CONTEXT.md` — comprehensive reference |
| FUTURE-PLAN.md | ✅ | `docs/FUTURE-PLAN.md` — phased task checklist |
| Specs README + form-auto-preselect | ✅ | `docs/specs/` — 1 built, 16 pending |
| Role library README | ✅ | `docs/roles/README.md` |
| Expert role files | ✅ | 8 built (per roles/README.md:28-54 — CRO, GHL, copywriters ×2, field ops, trades ops, pricing-trade, Make-automation). ⚠️ Audit 2026-06-12: pricing-trade + conversion-copywriter = built-but-never-dispatched | 2026-06-12 |
| Auditor role files | ✅ | 7 built (compliance, mobile-abandon, webhook, margin, fair-work, customer-fairness, general-operational). ⚠️ Audit 2026-06-12: margin-per-job + customer-fairness never formally run — run margin lens on first real quotes | 2026-06-12 |
| Pending role files | ⏳ | 14 stubbed in roles/README, build when phase activates |

### Pre-CEO project docs (audited 2026-05-01 — disposition decided)
| Doc | Status | Disposition | Notes |
|---|---|---|---|
| `CLAUDE.md` | ✅ KEEP | Active — primary onboarding for AI sessions | Project conventions still valid |
| `HANDOFF.md` | ⏳ INTEGRATE | Source of truth on GitHub URLs + pending tasks | Now superseded by CEO.md + STATE.md but useful as historical session-handoff format |
| `WORKFLOW.md` | ✅ KEEP | Active — branching, versioning, build/deploy rules | Aligned with CEO.md methodology; rule 4a (audit-fix-audit) matches my triple audit |
| `BUILD.md` | ✅ KEEP | Active — Tailwind PostCSS build process | Technical reference for dev sessions |
| `CHANGELOG.md` | ✅ KEEP | Active — semver release history | Tracks v1.x.x releases |
| `AUDIT.md` | 📦 ARCHIVE-EVENTUALLY | 2026-04-26 website audit | Historical baseline; findings from this should have been ticked off through CHANGELOG |
| `TASK-D-CLOUDFLARE.md` | ❓ VERIFY | Cloudflare/.htaccess cache config task | CEO to verify if implemented (commit message exists 2026-04-29 but live state ❓) |
| `docs/AI-BLOG-AUTOMATION-IDEA.md` | ✅ KEEP (deferred) | Future build idea | Revisit Month 12+ |
| `docs/PERFORMANCE-AUDIT-FIX-PLAN.md` | ⏳ VERIFY OPEN ITEMS | Lighthouse audit-fix work | CEO to check which Tier 1/2 items still pending |
| `docs/QUOTE-FORM-GHL-MIGRATION-PLAN.md` | 📦 SUPERSEDED | Older GHL plan | Replaced by CEO.md + FUTURE-PLAN.md but kept for historical context (Angela's original words on stack vision) |
| `docs/plans/2026-04-10-service-page-section-2b-fix-design.md` | 📦 ARCHIVE | One-off design doc | Likely already implemented |

### Quote app docs (separate repo)
| Doc | Status | Location |
|---|---|---|
| FORM-TO-PRICING-MAP.md | ✅ Active | `/Users/excluding/Downloads/timeless-quote-app/docs/` — keep in sync with form changes |
| QUOTE-FORM-HARDENING-PLAN.md | ✅ Active | Same — 12-cycle audit log, current |
| DEEP-AUDIT-2026-04-29.md | ✅ Active | Same — gap analysis, recent |

### Data files (in master repo, excluded from theme deploys)
| File | Type | Location |
|---|---|---|
| Bert/AUSTRS price list | CSV (96 lines) | `data/suppliers/austrs-bert-prices-2026-04-30.csv` |
| Master pricing schedule | Excel (102 SKUs, 8 sheets) | ✅ **CANONICAL: `data/pricing/master-pricing-2026-05-01-snapshot.xlsx`** (All Services & Pricing T1/T2/T3 + modifiers + travel zones + multi-bathroom + rejection criteria). Pre-audit copy archived alongside. (Old external-Downloads note resolved.) |
| Data folder index | Markdown | [data/README.md](../data/README.md) |

---

## 12. Founder Personal Context

### Allan
| Item | Status | Details |
|---|---|---|
| NSW Sydney based | ✅ | Confirmed |
| Email | ✅ | allanpham106@gmail.com |
| WordPress + React skills | ✅ | Built the quote form |
| GHL experience | ❓ Watched tutorial, never used | This session |
| Hours/week available May 2026 | ✅ | ~21 hr/week ("3hr every day") |
| Day job status | ❓ | CEO to ask |
| Personal financial pressure | ❓ | CEO to ask |
| Network depth (NSW property owners) | ❓ | CEO to ask — target 25+ |
| Lane | Marketing & customer-facing | Confirmed |

### Marko
| Item | Status | Details |
|---|---|---|
| NSW Sydney based | ❓ | Assumed yes, CEO to verify |
| Email | ❓ | CEO to ask |
| Trade/ops background | ✅ Strong | Multiple bathroom regrouts done, mowing, painting, paving (rock tile outdoor work), weeding, gardening. Works with dad. Genuine trade-adjacent profile. |
| Hours/week available May 2026 | ✅ | 10-20 hr/week |
| Day job status | ❓ | CEO to ask |
| Personal financial pressure | ❓ | CEO to ask |
| Subcontractor recruitment comfort | ✅ | Comfortable calling strangers. Already started Airtasker/Hipages search but paused waiting for onboarding materials |
| Network depth (NSW property owners) | ❓ | CEO to ask |
| Has own ABN | ❓ | CEO to ask (likely yes given existing trade work) |
| Has own PL insurance | ❓ | CEO to ask |
| Has own tools for regrouting | ❓ | CEO to ask |
| Has vehicle for getting to jobs | ❓ | CEO to ask |
| Asbestos awareness training cert | ❓ | CEO to ask (needed for pre-1990 jobs) |
| Lane | Operations & sub-facing PLUS first 1-3 jobs himself (per Override 9) | Updated 2026-05-01 |

---

## 13. Vendors / Suppliers

| Vendor | Role | Status | Notes |
|---|---|---|---|
| Bert Heynen / Australasian Resurfacing Supplies | ✅ Materials supplier + advisor | Tullamarine VIC, exclusive Hawk distributor for AU/NZ, 40+ years. info@austrs.com.au, 02 9098 0347 (Sydney), 03 9020 8127 (Melb). Equal pricing for all customers. No contract. **Will sell etch/cleaners ONLY after Marko has training cert (trip to Melbourne required).** Full spec: [specs/bert-supplier.md](specs/bert-supplier.md) | 2026-05-01 PM verified via emails + CSV + transcripts |
| Insurance broker | ❓ | Active per $10M PL (corrected 2026-06-02) | CEO to ask which broker |
| Materials suppliers (grout, silicone, paint) | ❓ | CEO to ask if any locked in |
| Photographer (for first-job shoot) | ❌ | Need to source |
| Print supplier (uniforms, livery) | ❌ | Need to source |
| Accountant | ❌ | Defer to Month 6 |
| Lawyer | ❌ | Sprintlaw for subcontractor agreement template only |

---

## 14. Existing Dashboard ("timeless-dash")

| Item | Status | Details |
|---|---|---|
| Dashboard URL (live) | ❓ | CEO to ask |
| Dashboard platform | ✅ Custom build | React frontend on Netlify + Supabase backend |
| Dashboard repo | ✅ Confirmed exists | `https://github.com/Excluding1/TimelessDash` per HANDOFF.md (NOTE: repo also contains React quote form on branch `quote-form/react-v8`) |
| Dashboard branch | ❓ | CEO to ask which branch holds dashboard code |
| Dashboard tabs | ✅ Listed | Dashboard, Tasks, Messages, Calendar, Finances, Cashflow, KPIs, Subscriptions, Subcontractors Tracker, Contacts, Credentials, Goals, Weekly Review, Notes, Links & Sheets, Notifications |
| Dashboard data flows in | Manual entry | Per Allan |
| Dashboard data flows out | None yet | No GHL/Stripe/etc connected |
| Both founders have access | ❓ | CEO to ask |
| Read/write permission split | ❓ | CEO to ask |
| Code quality state | ⚠️ "Half messy" per Allan | Needs audit + cleanup |

---

## 15. Open ❓ Items (CEO to verify, in priority order — updated 2026-05-01 PM)

### Resolved this session (✅ → moved out of ❓)
- ~~GitHub URLs~~ → ✅ `Excluding1/timeless-theme-wp` + `Excluding1/TimelessDash`
- ~~Live site URL~~ → ✅ confirmed
- ~~Hosting~~ → ✅ Ventraip cPanel
- ~~Marko's hours~~ → ✅ 10-20 hr/week
- ~~Marko's skills~~ → ✅ Multi-trade, regrouting experienced
- ~~Marko's network~~ → ✅ knows regrouting people, NOT resurfacing
- ~~Dashboard platform~~ → ✅ Netlify + Supabase + Custom React (in TimelessDash repo)
- ~~Bank cash math~~ → ✅ $1,500 cash + $100 pending in 2mo
- ~~Allan's hours~~ → ✅ 21 hr/week

### Current ❓ priority queue
1. ~~**Live WP site state**~~ ✅ RESOLVED 2026-06-11 — latest theme (v1.5, `timeless-theme-2`) live, form on 13 pages, 62-URL audit passed. Residual: Customizer email + ABN values ❓ (licence stays BLANK per Override 5).
2. **Bert (supplier) — voice transcripts** + relationship type (materials? consultant?)
3. **Pricing top-5 services** — T1/T2/T3 actual dollar values for margin audit
4. **TimelessDash repo branches** — which branch holds dashboard code (vs `quote-form/react-v8`)?
5. **Marko's ABN, PL insurance, asbestos cert, vehicle, tools** (sub-as-Marko prep for Override 9)
6. **Network depth lists** — both founders need 25-prospect outreach lists
7. **Day job status both founders** (financial pressure context)
8. **Existing customer enquiries** — any informal interest from the WP site since launch?
9. **GBP, Facebook, IG, TikTok account states** — exist? credentials shared?
10. **Insurance broker name** + PL policy expiry date
11. **Builder licence Fair Trading outcome** (after Allan calls 1300 224 988)
12. **TASK-D-CLOUDFLARE.md status** — commit exists, is .htaccess + Cloudflare cache config actually implemented on live?
13. **PERFORMANCE-AUDIT-FIX-PLAN.md open items** — Tier 1 fixes done? Tier 2 deferred or done?
14. **Logo file state** (Canva working file? Final SVG/PNG?)
15. ~~**www. SSL**~~ ✅ already verified (§3 row: www 301s to non-www with valid cert, 2026-05-01) — HANDOFF claim was stale
16. ~~**HTTPS redirect**~~ ✅ already verified (§3 row: http 301s to https, 2026-05-01) — HANDOFF claim was stale
17. ~~**Warranty text bulk update** — "2-Year" → "Up to 5-Year" in 27 files~~ **TRAP — DO NOT bulk-replace** (2026-06-02 audit, Clifford+Cleo). Live text already tier-aware/ACL-compliant per row :102. Blanket replace would over-claim silicone (1yr) + cement grout (2yr) = ACL/ACCC exposure. Re-scoped in pending-tasks list below.

### Pending tasks I now know about (from HANDOFF audit)
**Pre-launch website cleanup:**
- [ ] Upload latest theme zip to wp-admin
- [ ] Create 25 WordPress pages via plugin
- [ ] Set permalinks to `/%postname%/`
- [ ] Configure Customizer real phone (0451 110 154), email (hello@timelessresurfacing.com.au), ABN, REMOVE licence placeholder
- [ ] Add HTTPS redirect to .htaccess
- [ ] Get www. SSL activated
- [ ] ~~Bulk update warranty "2-Year" → "Up to 5-Year"~~ **RE-SCOPED 2026-06-02 (audit): do NOT bulk-replace.** Audit warranty copy per service/material — keep cement grout 2yr, silicone 1yr, chip repair 1yr, bath/basin/tile resurface up-to-5yr private / 6mo rental, epoxy grout 5yr. Use "Up to 5-Year" only on generic trust badges or resurfacing/epoxy contexts with nearby qualifying text. Fix contradictory docs (`aftercare-cards.md:77-78`, `SIL-01:188`) to the ladder.
- [ ] Replace 30 placeholder Unsplash images (replace as real before/afters land)

**Pre-Override 1:**
- [ ] These all matter because Override 1 sends customers to live site. Site must be polished BEFORE outreach starts.

---

## How to use this file

### CEO (me)
- Update when new state verified
- Mark ✅ with `Last verified` date when confirmed
- Move ❓ items to active conversation when relevant phase comes up
- Cross-reference from CEO.md when planning

### Allan + Marko
- Update when something changes (account opened, trial activated, subcontractor signed, etc)
- When in doubt, mark with note + flag CEO to verify
- This file is the source of truth — if it says ✅, that's the agreed state

### Cadence
- CEO updates after every session involving state change
- Founders glance weekly, update what's changed
- Friday review check: any ❓ items move-able?

---

*The CEO playbook says "I have my own brain". This file is the contents of that brain about facts. CEO.md is the contents of that brain about decisions and strategy.*
