# Cleo Form Audit — 2026-05-05

## 60-second summary
**Ship with fixes, not as-is.** The form is materially better than the May 3 audits in copy and SKU pools, but the conversion gate still has quote-breaking holes: shower-over-bath, combo/ensuite packages, submit failure handling, and full-bathroom resolver mismatch.

**P0 before ad spend:** do not show success when webhook fails; make full-bathroom inventory actually affect SKU resolution; add shower-over-bath routing; add PM multi-unit/maintenance path; add safety/specialist paths for anti-slip and efflorescence.

## Lens 1: Persona walkthrough

| # | Persona | Path | Verdict | Issue (if any) |
|---|---|---|---|---|
| 1 | Stained acrylic bath, owner, suburban house | Owner → house → bath → chip/stain repair or resurface → bath photos | PASS | Bath card now says “stains” and resolver includes `POL-01/HWD-01/RST-01`; current form fixed most of `audit_form_bath_2026-05-03.md`. |
| 2 | Mouldy shower grout, owner, apartment | Owner → apartment/lift → shower → full regrout → photos | NEEDS-FIX | Customer path is clear, but screen-only silicone and shower-floor-only work are over-routed to full regrout; confirmed by `audit_form_shower_2026-05-03.md`. |
| 3 | Single chipped basin, owner, powder room | Owner → house/apt → basin/vanity → chip-only → 2 photos | PASS | Current code added `chip_only` and routes `CHR-03/CHR-08`; May 3 basin gap mostly fixed. |
| 4 | Cracked floor tile, owner, suburban house | Owner → house → floor → chip/crack repair → photos | NEEDS-FIX | Customer can ask for repair, but resolver only has `CHR-04/05`, not tile replacement `TRP-01/02`; cracked tile replacement still unquoted. |
| 5 | Spa bath wants resurface, owner, large bathroom | Owner → house → bath → resurface → photos | NEEDS-FIX | Copy says spa and photo prompt asks for jets, but there is no explicit spa flag; quoter may miss `BTV-05/06`/`CHR-09`. |
| 6 | Shower-over-bath in 1970s house, owner | Owner → house → before 1990 → probably shower + bath | FAIL | No direct shower-over-bath path. Resolver has no `SOB-01..04`; old-property asbestos warning adds friction before the key scope is captured. |
| 7 | Property manager, multiple units | PM → company optional → bathroom count 3+ → repeat same form | FAIL | Captures 3 bathrooms, not 3 units/jobs. No bulk unit workflow, no `AMP-02`, no recurring maintenance prompt. |
| 8 | Strata apartment, walk-in shower only, owner | Owner → apartment/no lift? → shower → regrout/resurface | NEEDS-FIX | Photos may show walk-in, but no customer-level shower type. Resolver can include `RGC-04/RSC-04`, but not ensuite packages `ENS-01/02`. |
| 9 | Coastal property with white efflorescence | Owner → house/apt → shower/walls/floor → likely regrout | FAIL | Photo prompt mentions white residue, but no service/add-on routes `EFF-01`; customer gets wrong regrout expectation. |
| 10 | Custom basin/vanity request | Owner → basin/vanity → custom → cabinet tick | PASS | The custom checklist works for cabinet-only resurfacing; quoter can infer `VCR-01/02` from photos. |
| 11 | Tenant requesting work | Tenant → approval choice → landlord email optional/required by mode | NEEDS-FIX | Landlord auth is captured at [QuoteForm.jsx:1162](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:1162), but “I’ll get it” allows submission with no landlord contact, so ops still needs follow-up. |
| 12 | “Not sure” customer | Owner → not sure → text → generic photos | NEEDS-FIX | Converts well, but resolver gets no structured service pool; quoter can quote only by manual triage. Acceptable escape hatch, bad primary path. |

## Lens 2: UI/CSS/responsive findings
The app does **not use Tailwind**. It is almost entirely inline styles plus minimal global CSS; see [QuoteForm.jsx:327](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:327) onward and package deps in `package.json`.

- **Mobile 375px:** likely fits horizontally because the form wrapper is `maxWidth: 480` with `padding: 0 20px` at [QuoteForm.jsx:1119](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:1119), and global `#root` is `max-width:100%` at [index.css:57](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/index.css:57). Risk: two-column photo grid with very small 9-10px prompt text at [QuoteForm.jsx:524](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:524) becomes cramped for long prompts.
- **Touch targets:** most primary controls hit 44px (`OptGrid` at [QuoteForm.jsx:348](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:348), bathroom count at [QuoteForm.jsx:1274](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:1274)). Exceptions: Back button is only `padding: 4px 0` at [QuoteForm.jsx:346](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:346); lift buttons at [QuoteForm.jsx:1266](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:1266) have no `minHeight`.
- **Tablet/Desktop:** form remains a 480px centered column at [QuoteForm.jsx:1119](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:1119). That is efficient, but at 1024+ it will look like a mobile form floating in a wide page unless embedded in a stronger landing context.
- **Step transitions:** only the progress bar animates (`transition: width 0.3s`) at [QuoteForm.jsx:335](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:335). Screen swaps are instant; not broken, just abrupt.
- **Photo upload:** no drag-drop. It is file-input only at [QuoteForm.jsx:469](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:469) and [QuoteForm.jsx:494](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:494). Compression exists, but no hard file size limit and no user-visible failure state; [compressImage](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:303) silently returns the original file on failure.
- **Continue on mobile:** currently a stub with fake QR/SMS at [QuoteForm.jsx:1848](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:1848). Do not ship that CTA as functional.

## Lens 3: Pricing coverage gaps (confirmed + new)
I read both symlinked workbooks; `MASTER_PRICING_UPDATED_111.xlsx` has 146 service rows. Resolver reachable SKUs are defined in [pricing-resolver.js:33](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/lib/pricing-resolver.js:33).

**Confirmed from May 3 audits, still not properly reachable:** `SOB-01..04`, `EFF-01`, `ASL-01`, `AMP-01/02`, `TRP-01/02`. `BTV-05/06`, `CHR-09`, `SFL-01` are now in resolver pools/add-ons, but spa remains photo-only, so quote accuracy is still weak.

**New/expanded gaps from current workbook vs resolver:**
- Combo/package SKUs absent: `CMB-01..11`, `MIX-01..03`, `ENS-01..03`, `TBC-01..04`, `TRC-01..03`.
- Shower sub-scope/specialist SKUs absent: `SIL-03/04/05`, `GCS-01..04`, `SBR-01/02`, `FLR-01/02`, `WLL-01/02`, `CHR-06/07`, `HWD-02`.
- Detail/maintenance/spot-work absent: `DTL-01/02`, `GRS-01/02`, `GSP-01/02`, `POL-02/03`.
- Full tile resurface package SKUs absent: `TSR-12/13/14`.

Contrarian point: the form has become broader, but the resolver is still SKU-family first. That is fine for human quote review; it is not enough for “accurate quoting without follow-up calls.”

## Lens 4: Code quality & edge cases
- **Network failure lies to the customer.** `handleSubmit` retries 3 times, logs failure, then still clears storage and shows success at [QuoteForm.jsx:1039](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:1039). This is the most dangerous bug in the form.
- **Full bathroom detail is collected then ignored by resolver.** Form sends `full_bathroom_inventory` and `full_area_services` at [QuoteForm.jsx:928](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:928), but resolver full-bathroom path only emits one generic `FULL_BATHROOM_SKUS` pool at [pricing-resolver.js:318](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/lib/pricing-resolver.js:318).
- **Double-submit mostly handled:** submit button disables on `submitting` at [QuoteForm.jsx:1843](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:1843), but `handleSubmit` itself has no early `if (submitting) return`, so programmatic double calls can still race.
- **Validation blocks empty submit:** `can1..can5` are reasonably strict at [QuoteForm.jsx:786](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:786). Gap: `prevResurfaced` and `hasVentilation` are optional even when shown, so modifier `R5/R19` can be missed.
- **localStorage failure is tolerated:** read/write are wrapped in `try/catch` at [QuoteForm.jsx:624](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:624). But only contact/address persist; photos and service choices do not.
- **Honeypot is weak but harmless:** field is visually hidden and `tabIndex=-1` at [QuoteForm.jsx:1831](/Users/angelapham/codex-peer-workspace/master-repo/quote-form/src/QuoteForm.jsx:1831). Bots that execute JS and submit empty honeypots pass; no timing check/rate limit.
- **Photo failure handling:** compression failure is silent, upload payload never actually includes files, only counts. If GHL expects actual photos elsewhere, I don’t see that wiring in this component.

## TOP 5 P0 ITEMS — must fix before ad spend
1. Stop showing success when the webhook fails; keep the lead visible to the user and provide a retry/contact fallback.
2. Add explicit shower-over-bath path and resolver routing for `SOB-01..04`.
3. Make full-bathroom inventory/service overrides drive resolver output, including `ENS`, `CMB`, `TBC`, `TRC`, and `TSR-12..14`.
4. Add specialist/safety paths for `EFF-01`, `ASL-01/02`, and true tile replacement `TRP-01/02`.
5. Replace or hide the stub “Continue on mobile” flow until QR/session/SMS state transfer is real.

## Where I might be wrong
I did a code/workbook audit, not a live browser pass at 375/768/1024. I also judged “reachable” from the React state and resolver pools, not from any downstream CRM/manual quote process that may override these gaps after submission.

— Cleo
