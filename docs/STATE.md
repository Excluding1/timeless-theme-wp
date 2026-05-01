# Business State Tracker

**Purpose:** Single source of truth for the current state of every account, asset, account credential, and known fact about the business. CEO updates when verified. Allan + Marko update when they change something.

**Status legend:**
- ✅ Done / Active / Verified
- ⏳ In progress / Pending
- ❌ Not started
- ❓ Unknown — CEO needs to ask
- 🔒 Sensitive — credentials handled separately

**Last verified:** 2026-05-01

---

## 1. Legal & Compliance

| Item | Status | Details | Last verified |
|---|---|---|---|
| ABN — Allan | ✅ | Per saved memory | 2026-05-01 |
| ABN — Marko | ❓ | CEO to ask | — |
| ABN — Pty Ltd company | ❌ | Deferred until revenue >$5K/mo for 3 months | — |
| ASIC Business Name registration | ✅ | "Timeless Resurfacing" — 1 year, paid $45 on 2026-03-27 (per finance dashboard) | 2026-05-01 |
| Business name renewal | ⏳ | Next due March 2027 | — |
| Public Liability Insurance | ✅ | $20M cover, active per saved memory | ❓ — need policy doc + expiry date |
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
| $100 bank signup bonus | ⏳ | **Expected ~mid-June 2026** (~2 months post-opening) | — |
| Current cash on hand | $1,500 | Per starting capital + $0 revenue, after $187.56 expenses tracked. **Note: NOT $1,600 — bonus is pending.** | 2026-05-01 |
| Stripe account | ❌ | Sign up Phase 1 before first quote sent | — |
| pay.com.au account | ❌ | Sign up before first subcontractor paid | — |
| Rewards credit card linked to pay.com.au | ❓ | CEO to ask which card (Amex Explorer / Westpac Altitude / ANZ Rewards Black recommended per Jordan) | — |
| Xero accounting | ❌ | Phase 1.7 in FUTURE-PLAN — connect bank feed when set up | — |
| Bookkeeping current state | ⏳ | Tracked in custom dashboard (per Allan), not yet Xero | — |

### Revenue & expenses (per Allan's dashboard, 2026-05-01)
| Type | Amount |
|---|---|
| Total Revenue | $0 (the $1,500 in dashboard is starting capital, not revenue) |
| Total Expenses | $187.56 |
| Cash on hand | $1,500 |
| Monthly recurring | $38.60 |
| Pending receivable | +$100 (bank signup bonus, within 2 months) |

### Active subscriptions (per finance dashboard)
| Subscription | Cost | Type | Renewal | Owner |
|---|---|---|---|---|
| Google Workspace Business Standard | $18.88/mo (rising to $22.95/mo from 2026-07-06) | Email | Monthly auto | Both |
| GoHighLevel Starter | $0 (trial → $136/mo from 2026-05-27, approx $99 USD) | CRM | Monthly auto | Both |
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
| Theme on live site | ✅ Verified | `timeless-theme-1` loading from /wp-content/ — latest deployed | 2026-05-01 verified |
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
| Privacy policy page | ❓ | CEO to verify exists at /privacy/ | — |
| Terms of service page | ❓ | CEO to verify | — |
| About page | ❓ | CEO to verify | — |
| Contact page | ❓ | CEO to verify | — |
| 404 page | ✅ | Custom 404.php | 2026-05-01 |
| Quote form embed location | ❓ | CEO to verify which pages have it | — |
| Mobile responsive | ✅ Tested | Per past audits | 2026-05-01 |

---

## 5. Quote Form (React)

| Item | Status | Details | Last verified |
|---|---|---|---|
| Location (NEW master hub) | `/Users/angelapham/Downloads/timeless-theme-wp/quote-form/` | Absorbed into master repo 2026-05-01 PM. Old standalone folder `/Users/angelapham/Downloads/timeless-quote-app/` preserved for safety until Allan confirms migration works (then he can delete) | 2026-05-01 PM verified |
| GitHub | `Excluding1/timeless-theme-wp` (single repo now). TimelessDash repo holds historical quote-form/react-v8 branch — to be archived per WORKFLOW.md retire policy | | 2026-05-01 PM |
| Build state | 95% complete | v9.x with NSW gating, asbestos check, multi-mode, photo upload | 2026-05-01 |
| GHL_WEBHOOK URL | ❌ | `REPLACE_ME` placeholder at QuoteForm.jsx:633 — must replace before May 27 | 2026-05-01 |
| GHL_PARTIAL URL | ❌ | `REPLACE_ME_PARTIAL` placeholder at QuoteForm.jsx:634 | 2026-05-01 |
| Cloudinary photo upload | ❌ | TODO at QuoteForm.jsx:727 — placeholder, not wired | 2026-05-01 |
| Trust badges | ✅ | "Sydney Local • $20M Insured • Up to 5yr Warranty" — corrected this session | 2026-05-01 |
| autoComplete attributes | ✅ | given-name, family-name, email — fixed this session | 2026-05-01 |
| Ventilation Q gating | ✅ | Now includes regrout services — fixed this session | 2026-05-01 |
| Bath bt4 silicone overlap note | ✅ | Fixed this session | 2026-05-01 |
| Form deployed to live site? | ❓ | CEO to verify if form is embedded on production pages or only dev preview | — |
| Google Ads conversion fires on thank-you page | ❓ | Need to verify when Google Ads is set up | — |

---

## 6. Software / SaaS Stack

| Tool | Status | Details |
|---|---|---|
| Google Workspace | ✅ Active | Email + Drive |
| GoHighLevel | ⏳ Trial active until 2026-05-27 | Both founders signed up; Allan has watched tutorial |
| Stripe | ❌ Not signed up | Need before first quote sent |
| ServiceM8 | ❌ Not signed up | Deferred per Override 2 |
| Slack | ❌ Workspace not created | Phase 1 task |
| Zapier / Make | ❌ Not signed up | Need when GHL → SM8 sync needed |
| Cloudinary | ❌ Not signed up | Need before photo upload works in form |
| Xero | ❌ Not signed up | Need when bookkeeping volume justifies (~$5K/mo revenue) |
| pay.com.au | ❌ Not signed up | Need before first subcontractor paid |
| DocuSign | ❌ Not signed up | Need before first subcontractor signs |
| Sprintlaw subcontractor template | ❌ Not purchased | Need before first subcontractor signs |

---

## 7. Marketing Assets

| Item | Status | Details |
|---|---|---|
| Google Business Profile | ✅ Active | Per saved memory |
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
| Customer enquiries received historically | ❓ | CEO to ask if anyone enquired during build phase |
| Network outreach lists (Allan) | ❌ Not built | Override 1 priority — target 25 contacts |
| Network outreach lists (Marko) | ❌ Not built | Same |
| First 3 customers booked | ❌ 0/3 | Goal by 2026-05-27 |
| Customer database (CRM contacts) | ❌ | Empty — GHL not yet connected |

### Active customer pipeline (CONFIRMED 2026-05-01 PM)

| # | Customer | Source | Service Needed | Status | Action needed |
|---|---|---|---|---|---|
| 1 | **Marko's prior regrouting customer** (name ❓) | Warm referral via Marko's previous job | Shower-over-bath resurface + strip-back (peeling existing coat) | 🟢 Soft-locked, "happy to wait until we establish business" | Marko: capture name, suburb, contact, photos. CEO: draft holding-quote message. |

**Special considerations for this customer:**
- Strip-back surcharge applies (Excel Modifier — Rejection #9 territory)
- Combo bathtub/shower unit = SOB-01..04 SKU range
- Skilled resurfacing subcontractor required (Marko's established-business network)
- High-trust customer + perfect for first case study (real before/after photos, real testimonial, real Google review)
- Willingness to wait removes timeline pressure

---

## 9. Subcontractor Pipeline

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
| hello@timelessresurfacing.com.au | ❓ | CEO to verify exists + who has access |
| Allan personal email | ✅ | allanpham106@gmail.com |
| Marko personal email | ❓ | CEO to ask |
| Business phone | ✅ | 0451 110 154 (per saved memory) |
| Twilio SMS number (via GHL) | ❌ | Set up when GHL goes paid |
| Slack workspace | ❌ | Phase 1 task |
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
| Expert role files | ✅ | 6 built (CRO, GHL, copywriters, field ops, trades ops) |
| Auditor role files | ✅ | 5 built (compliance, mobile-abandon, webhook, margin, fair-work) |
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
| FORM-TO-PRICING-MAP.md | ✅ Active | `/Users/angelapham/Downloads/timeless-quote-app/docs/` — keep in sync with form changes |
| QUOTE-FORM-HARDENING-PLAN.md | ✅ Active | Same — 12-cycle audit log, current |
| DEEP-AUDIT-2026-04-29.md | ✅ Active | Same — gap analysis, recent |

### Data files (in master repo, excluded from theme deploys)
| File | Type | Location |
|---|---|---|
| Bert/AUSTRS price list | CSV (96 lines) | `data/suppliers/austrs-bert-prices-2026-04-30.csv` |
| Master pricing schedule | Excel (140 SKUs) | **Currently external**: `/Users/angelapham/Downloads/MASTER_PRICING_UPDATED 111.xlsx` — recommend moving to `data/pricing/` per CEO Decision 2026-05-01 PM |
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
| Insurance broker | ❓ | Active per $20M PL existing | CEO to ask which broker |
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
1. **Live WP site state** — is the LATEST theme zip uploaded? Are the 25 pages created on live? Is Customizer set with real values (not placeholder phone `0400 000 000` and licence `345678C`)? **HIGH PRIORITY** — Override 1 sends customers to live site.
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
15. **www. SSL** — pending per HANDOFF; needs activation in Ventraip
16. **HTTPS redirect** — pending per HANDOFF; needs .htaccess update
17. **Warranty text bulk update** — pending per HANDOFF; "2-Year" → "Up to 5-Year" in 27 files

### Pending tasks I now know about (from HANDOFF audit)
**Pre-launch website cleanup:**
- [ ] Upload latest theme zip to wp-admin
- [ ] Create 25 WordPress pages via plugin
- [ ] Set permalinks to `/%postname%/`
- [ ] Configure Customizer real phone (0451 110 154), email (hello@timelessresurfacing.com.au), ABN, REMOVE licence placeholder
- [ ] Add HTTPS redirect to .htaccess
- [ ] Get www. SSL activated
- [ ] Bulk update warranty text "2-Year" → "Up to 5-Year" in 27 files
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
