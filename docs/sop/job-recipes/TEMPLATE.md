# {SKU-CODE}: {Service Name}

```yaml
sku: {CODE}
category: {CATEGORY}
service_name: "{Full service name}"
status: active  # active | deprecated | trial
last_updated: 2026-MM-DD
last_audited: 2026-MM-DD
hours: {N.N}
days: {1 or 2}
t1_price_inc_gst: {NNNN}
t2_price_inc_gst: {NNNN}
t3_price_inc_gst: {NNNN}
sub_hr_pure_labour: {NN}
warranty_terms: "{e.g., up-to-5-year private home / 6mo rental}"
sub_skills_required:
  - resurfacing  # or regrouting, silicone, etc
  - asbestos_aware  # if pre-1990 jobs possible
photos_required:
  before: 3
  during: 2
  after: 4
```

---

## 1. Customer-facing summary

**One-paragraph description (used in quote drafting + landing page):**
> {Plain-English description of what the customer gets. Avoid jargon. 2-3 sentences.}

**Scope (what's included at T2 Recommended tier):**
- {bullet 1}
- {bullet 2}
- {bullet 3}

**What's NOT included:**
- {explicit exclusions to set expectation}

---

## 2. Pre-job checklist

**Office must verify before dispatch:**
- [ ] Customer photos clear + show full surface
- [ ] Property year built confirmed (if pre-1990 → asbestos check per [auditor-compliance-aus](../../roles/auditor-compliance-aus.md))
- [ ] Scope matches what customer agreed to (no surprises)
- [ ] Tier chosen (T1/T2/T3) recorded in GHL `tier_chosen`
- [ ] Sub assigned has skills required (per yaml `sub_skills_required`)
- [ ] Sub has current PL insurance ($10M+) — per [sub-ongoing-quality-monitoring § 8](../sub-ongoing-quality-monitoring.md)
- [ ] Customer prep instructions sent (24hr before per [customer-comms-templates § 3B](../../templates/customer-comms-templates.md))

**Customer instructions sent before job (Day-Before Reminder SMS):**
- {Specific to this SKU — e.g., "Clear bathroom of personal items"}

---

## 3. Materials list (parseable)

| Brand / Product | Supplier | Qty per job | Unit cost | Cost/job |
|---|---|---|---|---|
| {Product 1} | {Bunnings/Bert/Reece} | {qty} | ${X} | ${Y} |
| {Product 2} | {} | {} | {} | {} |
| **TOTAL** | | | | **${total}** |

**Approved alternatives** (per [sub-materials-standard.md](../sub-materials-standard.md)):
- {alternative 1}
- {alternative 2}

**NEVER use** (will trigger Stage 1 warning per [sub-ongoing-quality-monitoring § 6](../sub-ongoing-quality-monitoring.md)):
- {prohibited brand 1 — e.g., White Knight Bathroom Tile Paint}
- {prohibited brand 2}

---

## 4. Tools required (sub must own)

| Tool | Purpose | Brand examples |
|---|---|---|
| {Tool 1} | {what it's used for} | {brand options} |

---

## 5. Time breakdown (parseable)

| Phase | Duration | Notes |
|---|---|---|
| Travel (round trip) | ~Xmin | Zone 1 free; Zone 2+ extra |
| Setup + masking | Xmin | |
| {phase 3} | Xmin | |
| {phase 4} | Xmin | |
| Cleanup + photos | Xmin | |
| Aftercare card delivery + customer chat | 5min | |
| **Active sub time** | **X.Xhr** | Per Excel `Avg Hours` |
| Cure (passive — customer doesn't use) | Xhr | Don't-use SMS sent at completion |

---

## 6. Step-by-step recipe

### Phase 1: Arrival (0-15min)
1. Sub texts customer "On my way — 30min" (per [customer-comms § 3C](../../templates/customer-comms-templates.md))
2. Park considerately (no blocking driveways, no apartment-loading-zone parking)
3. Greet customer — confirm name, scope, tier chosen
4. Photo: front of property + front of bathroom door (job-start record)

### Phase 2: Surface assessment (5-10min)
1. Walk through scope with customer — point out: {what we're doing, what we're NOT doing}
2. Identify any surprise issues (cracks, soft spots, suspected asbestos pre-1990)
3. **STOP triggers:** {list scenarios that require immediate office call}
   - Asbestos suspected
   - Scope materially different from quote
   - Safety concern

### Phase 3: Setup + masking (Xmin)
1. {Specific masking pattern for this SKU}
2. {Drop sheets where}
3. {Ventilation setup}

### Phase 4: {Main work phase 1}
1. {Step by step}

### Phase 5: {Main work phase 2}
1. {Step by step}

### Phase 6: Quality check (10min)
1. Self-inspect against [sub-quality-rubric.md](../sub-quality-rubric.md) criteria
2. Photo: 4 angles of finished work (per yaml `photos_required.after`)

### Phase 7: Cleanup + handover (15min)
1. Remove all masking + drop sheets
2. Clean any overspray on customer's surfaces
3. Leave {applicable aftercare card per [customer-aftercare-cards.md](../../templates/customer-aftercare-cards.md)}
4. Walk customer through cure-time + DO/DON'T list verbally
5. Photo upload to ServiceM8 (before/during/after)
6. Mark job complete in SM8

---

## 7. Quality criteria

**Per [sub-quality-rubric.md](../sub-quality-rubric.md), this SKU scored on 10 criteria:**

| Criterion | What's "good" (8-10) | What fails (<6) |
|---|---|---|
| {criterion 1} | {} | {} |
| {criterion 2} | {} | {} |

**Photo requirements** (per yaml `photos_required`):
- **Before:** {specific angles + what to capture}
- **During:** {key milestones to photograph}
- **After:** {final-state photos}

---

## 8. Common issues + handling

| Issue | What to do | Escalate? |
|---|---|---|
| {Issue 1 — e.g., chip discovered mid-prep} | {Action} | Office call if cost/scope shift >10% |
| {Issue 2} | {} | {} |

---

## 9. Cost breakdown (parseable)

### Direct costs
| Line | Amount | Source |
|---|---|---|
| Materials (sub buys, we reimburse) | ${X} | Excel + Bert/Bunnings |
| PPE we pay (separate) | ${Y} | Excel |
| Sub labour (pure labour, ex-GST) | ${Z} | Hours × Sub $/hr |
| Travel allowance (avg, weighted by zone mix) | ${A} | Travel zones table |
| **Direct subtotal** | **${dir}** | |

### Indirect costs (allocated, Year 1 target = 10 jobs/mo)
| Line | Amount | Notes |
|---|---|---|
| Google Ads | $70-200/job | Year 1 target $70; early ramp $150-200 |
| GHL CRM | $15.50 | $155/mo ÷ 10 |
| ServiceM8 | $2.90 | $29/mo ÷ 10 |
| Stripe (1.75% + $0.30 × 2 transactions) | ~${B} | Variable on T2 |
| Twilio SMS (~8/job) | $1.60 | |
| pay.com.au (1% on sub payment) | ~${C} | |
| Insurance amortisation ($2K/yr ÷ 96 jobs) | $21 | |
| Westpac account | $1 | |
| Xero + accountant | $31 | |
| Cloudinary | $0 | Free tier |
| Domain + hosting | $2 | |
| Phone | $3 | |
| **Indirect subtotal** | **${ind}** | |

### Net P&L per T2 job
| Line | Amount |
|---|---|
| Customer pays inc GST | ${T2} |
| Less GST → ATO | -${gst} |
| **Revenue we keep (ex-GST)** | **${rev}** |
| Direct costs | -${dir} |
| Indirect costs | -${ind} |
| **NET PROFIT** | **${net}** |
| **NET MARGIN** | **{X}%** |

---

## 10. Pricing tiers — what each includes

**T1 Premium (${T1} inc GST):** {extras over T2 — e.g., epoxy grout upgrade, full silicone redo, 24h priority booking}

**T2 Recommended (${T2} inc GST):** {standard scope — what's listed in § 1}

**T3 Budget (${T3} inc GST):** {scope reductions — e.g., spot regrout vs full, single coat vs 2-coat}

**Suburb-tier alignment** (per Allan's strategy — affluent vs price-sensitive):
- T1 typically chosen in: {affluent suburbs — e.g., Mosman, Vaucluse, North Shore}
- T2 typically chosen in: {middle suburbs — most jobs land here}
- T3 typically chosen in: {price-sensitive — e.g., Western Sydney}

---

## 11. Warranty

**Terms specific to this SKU** (per [customer-aftercare-cards.md](../../templates/customer-aftercare-cards.md)):
- **{Warranty type 1}:** {duration} ({when applies})
- **{Warranty type 2}:** {duration}

**ACL discipline:** "in addition to your rights under Australian Consumer Law" — never override statutory rights.

**Exclusions** (must be communicated upfront):
- {exclusion 1 — e.g., damage from misuse}
- {exclusion 2 — e.g., abrasive cleaner damage}

---

## 12. Failure modes + protections

Cross-referenced to [sub-risk-scenarios-playbook.md](../sub-risk-scenarios-playbook.md):

| If this happens | Cross-ref | Protection in place |
|---|---|---|
| Sub does bad work (peeling, rough finish) | Scenario 1 | Clauses 5 (warranty) + 6 (rectification) |
| Asbestos disturbance suspected | Scenario 6 | STOP work, asbestos assessor, Clause 19 |
| Materials cost surprise (out of stock) | (new) | Sub photos discrepancy, calls office, we adjust quote |
| {Other SKU-specific} | | |

---

## 13. App integration notes (future)

When the sub-facing job card app is built (Phase 6+ per [FUTURE-PLAN](../../FUTURE-PLAN.md)):

**Sub experience flow:**
1. Sub receives push notification: "New job offer — {SKU} in {Suburb} on {Date}"
2. Tap → opens this recipe in app (rendered from MD)
3. Sub sees: scope summary + materials list + estimated time + their pay
4. Tap "Accept" or "Decline" (decline = no penalty per Clause 1)
5. If accepted → recipe + customer photos available offline in field
6. Step-by-step checklist mode (tick as you go); photo upload at each checkpoint
7. Final: quality self-check + customer chat + complete

**App data extraction from this MD:**
- yaml frontmatter → app filtering/display
- § 1 customer summary → quote-page display + sub job-summary
- § 3 materials → sub shopping list (link to Bunnings cart / Bert order)
- § 5 time breakdown → calendar block estimation
- § 6 step-by-step → in-app checklist
- § 7 quality criteria → self-inspection questionnaire
- § 8 issues → contextual help triggers

**Build trigger:** when 50+ jobs/mo make manual SM8 dispatch fragile. Until then, ServiceM8 + this MD as PDF attachment is sufficient.
