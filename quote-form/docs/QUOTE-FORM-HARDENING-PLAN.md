# Quote Form — Production Hardening Audit-Fix-Audit Plan

**Date:** 2026-04-29
**Starting state:** 4 P0 critical bugs + 15+ P1/P2 from prior audit (covered in `QUOTE-FORM-GHL-MIGRATION-PLAN.md`)
**Goal:** Phase 1 hardening — every change possible WITHOUT external setup (GHL webhooks + Cloudinary come later)
**Reference:** WORKFLOW.md Rule 4a — audit-fix-audit until convergence

---

## Expert lenses applied

- **React frontend engineer** — code quality, hooks, state, render correctness
- **UX / CRO specialist** — form abandonment, conversion, trust signals
- **Accessibility specialist** — WCAG AA, keyboard nav, screen readers, touch targets
- **Privacy / compliance** — Privacy Act 1988 (NSW), Spam Act 2003 (commercial messages)
- **Security engineer** — anti-spam, input validation, injection-safe rendering

---

## Audit-fix-audit cycle log

### Cycle 1: Validation hardening — ✅ DONE

- [x] Added `isNSWPostcode()` helper covering 1000-1999 (PO boxes), 2000-2599, 2619-2898, 2921-2999. ACT carve-outs (2600-2618, 2900-2920) explicitly rejected. Plus VIC/QLD/SA/WA/TAS/NT postcode rejections.
- [x] `chkAddr()` now postcode-first (more reliable), falls back to suburb keyword match.
- [x] Extracted `EMAIL_RE` constant. Added `llEmOk` gate (tenant + send mode requires valid landlord email). Added `tenantOk` gate (tenant must choose I'll-get-it OR send-to-landlord).
- [x] `can1` includes both new gates.
- [x] Honeypot anti-spam field: hidden input, off-screen position, `tabIndex={-1}`, `aria-hidden="true"`, `autoComplete="off"`. `handleSubmit` silently fakes success if filled (so bots don't iterate).
- [x] **Verified live:** Melbourne 3000 → blocked. Sydney 2000 → passes. Canberra 2601 → blocked (ACT carve-out). Newcastle (no postcode) → passes (suburb fallback). Tenant + no auth → submit disabled. Tenant + send + invalid email → submit disabled. Tenant + send + valid email → submit enabled.

### Cycle 2: Privacy compliance — ✅ DONE

- [x] Landlord email field gets live validation feedback (red border + error message).
- [x] Disclosure text under landlord email: "By providing this address, you confirm you have authority to share it. Your landlord/agent can request not to be contacted at any time."
- [x] Privacy Policy link added near submit button (links to `/privacy/` on main site).
- [x] Marketing consent checkbox label clarified as optional with unsubscribe note.
- [x] **Verified live:** Disclosure text visible under landlord email input.

### Cycle 3: Performance & UX — ✅ DONE

- [x] Client-side image compression: `compressImage()` uses `createImageBitmap` + canvas to resize max 1920px long edge + JPEG q0.8. Skips files <500 KB. Returns original if compression made it bigger or failed. PhotoUp shows "Compressing…" UI state.
- [x] Partial webhook: investigated; only fires on Next-button click (not keystroke), guarded by `partialSent` ref. No debounce needed.
- [x] localStorage persistence with key `timeless_quote_form_v1`: saves fn/ln/ph/em/addr (500ms debounce). Restores on mount. Clears on submit success. Excluded: photos, landlord email, consent (privacy + practical reasons).
- [x] **Verified live:** Filled form → reload → all fields restored. localStorage cleared after submit success path.

### Cycle 4: Accessibility — ✅ DONE

- [x] `OptGrid` component (used for cust + prop selectors) gets `role="group"` + `aria-label` on wrapper + `aria-pressed={selected}` on each button.
- [x] `minHeight: 44` added to OptGrid buttons (WCAG 2.5.8 AA target size).
- [x] Tenant auth buttons (I'll get it / Send to landlord) get same treatment.
- [x] Text-link buttons ("I don't have a mobile" / "I have a mobile number") padded to 32px height (was 14px).
- [x] H1/H2/H3 hierarchy: form has 1 H2 ("Bathroom resurfacing quote") which is correct since it's embedded in a WP page that owns H1.
- [x] **Verified live:** Customer buttons report `aria-pressed=true` after click (was false initially), heights 71px confirmed.

### Cycle 5: Error handling + confirmation UX — ✅ DONE

- [x] Submit retry: 3 attempts with exponential backoff (1s, 2s, 4s). Bails on 4xx (won't succeed). Logs loudly if all 3 fail (Phase 4 will add WP REST fallback).
- [x] Phone CTA on confirmation page: prominent "Need it sooner? Call 0451 110 154" `tel:` link in primary color above the "Have another bathroom" button. Captures impatient leads.
- [x] Confirmation page already had clear messaging ("We'll text by next business day") — kept as is.
- [x] **Verified:** Retry logic + phone CTA confirmed in source. Form still shows clean confirmation state on success.

### Cycle 6: UI polish + responsive — ✅ DONE

- [x] Mobile (375×812): clean, all elements visible, button grid 2 columns ✓
- [x] Tablet (768×1024): centered with max-width: 480px container, breathing room ✓
- [x] Desktop (~1280): same centered container, scales fine ✓
- [x] No horizontal scroll at any viewport.
- [x] No console errors after reloading at any viewport.

### Cycle 7: Customer persona testing — ✅ DONE

| Persona | Result |
|---|---|
| 🏡 **First-time homeowner (Owner)** | ✅ Happy path advanced through Step 1 → 2 → 3 → 4 cleanly |
| 🔑 **Tenant w/ landlord auth (send)** | ✅ Cycle 1: tenAuth=send + valid landlord email → submit enabled |
| 🚫 **Tenant w/o auth (none chosen)** | ✅ Cycle 1: tenantOk gate blocks submit until auth path chosen |
| 🏢 **Property manager** | ✅ Same flow as Owner, code-verified company name field present |
| 🛁 **Multi-area renovation** | ✅ Step 3 renders all 7 area buttons + multi-select toggle |
| ❓ **Unsure customer** | ✅ "Not sure what it needs?" link visible on step 3 |
| 📱 **Mobile shaky thumbs** | ✅ Cycle 4: all OptGrid buttons ≥44px, link buttons ≥32px |
| 👴 **Senior, low vision** | ✅ Cycle 4: aria-pressed states + role=group + aria-label |
| 🌏 **NSW out-of-area** | ✅ Cycle 1: Melbourne 3000 + Canberra 2601 (ACT carve-out) blocked |
| 🔄 **Returning visitor** | ✅ Cycle 3: localStorage restores 5 fields across reload |
| 📶 **Spotty network** | ✅ Cycle 5: 3-retry exponential backoff (1s/2s/4s) on 5xx + network err |
| 🤖 **Bot / spammer** | ✅ Cycle 1: honeypot fills → silent fake-success bail |

---

## Phase 2 / 3 / 4 / 5 (after Phase 1 — needs external setup)

These are NOT part of this cycle — captured for tracking:

### Phase 2 (need GHL webhook URLs from user)
- [ ] Wire actual webhook URLs (replaces `REPLACE_ME`)
- [ ] Map form fields → GHL custom fields
- [ ] Test partial-capture firing on real GHL endpoint

### Phase 3 (need Cloudinary credentials from user)
- [ ] Cloudinary unsigned upload preset
- [ ] Wire photo URLs into submission payload
- [ ] Progress indicator per photo

### Phase 4 (testing on real services)
- [ ] E2E with photos hitting real Cloudinary + GHL
- [ ] Partial capture flow with real GHL workflow
- [ ] Network failure → WP REST API fallback path
- [ ] 24-hour soak

### Phase 5 (deploy)
- [ ] `npm run build` for Vite production
- [ ] Embed in WP front-page.php (replace existing form)
- [ ] 48h soak monitor

### Long-term (architectural — discussed with user)
- [ ] Decision: GHL-direct vs backend-buffered (Cloudflare Worker / WP REST endpoint storing leads BEFORE forwarding to GHL — protects against GHL downtime)

---

## Final results (will fill at end)

| Issue | Before | After |
|---|---|---|
| TBD | | |

## Success criteria

- [ ] All Cycle 1-7 fixes land
- [ ] All 12 customer personas can complete (or are correctly blocked) without errors
- [ ] Form still submits (with REPLACE_ME webhooks, just won't reach GHL — Phase 2)
- [ ] No console errors at any viewport
- [ ] Visual smoke test passes mobile + tablet + desktop
