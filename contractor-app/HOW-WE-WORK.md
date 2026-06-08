# In-app "How we work together" — sub-facing copy (panel-reviewed)

**Status:** drafted + reviewed 2026-06-08 by **both CEOs (Clifford + Cleo) + 3 expert lenses** (Fair-Work auditor, AU-compliance auditor, trades-ops + copywriter) — Rule 8 sub-facing-copy lock satisfied. **This copy must ride along to the mandatory AU employment-lawyer pre-engagement review** (`decision-sm8-keep-vs-build-2026-06-05.md` §LEGAL REVIEW) before it ships to a real sub. Goes in the app as a read-only **"How we work together"** section under Profile.

**Why this wording (the panel's binding fixes):**
- **NOT "represent Timeless" / "face of Timeless"** — reframed identity→standards (ACL §18 misleading-conduct + Fair-Work A5 "held-out-as-staff"). The sub is an independent contractor *doing a job for* Timeless, never "our staff/team."
- **NOT "what you earn"** — only the *job price* is the office's (commercial confidentiality); the sub *invoices us*, their pay is their own business.
- **Anti-poaching narrowed** — only customers *we introduce*, 12 months, + explicit "work for whoever else you like" (kills the exclusivity / unfair-restraint reading).
- **Asbestos/scope-stop attributed to the law + their own judgement** (WHS duty), never "Timeless requires"; no false assurance / no fixed response time.
- **Offer-language only**, zero penalty/warning wording on the screen (decline is silent + free), + a footer making clear this is a summary, not the contract.

---

## How we work together

You run your own business. We send you pre-quoted, pre-paid jobs — you pick the ones you want, do great work, prove it with photos, and get paid. The office handles the customer, the price and the money, so you never chase a lead or a payment.

### The 5 things that matter

**1. Every job is an offer — your call.**
Accept it, decline it, or hand it back, whenever you like. Declining costs you nothing, ever — we just offer it to someone else. You bring your own tools and gear, set your own availability, and you're free to work for whoever else you like.

**2. The office handles the customer.**
Pricing, payments and customer contact stay with us. If a customer asks what the job costs, just say: *"That's all handled through the Timeless office."* You invoice us for the work you complete — simple.

**3. The customer's details are for this job only.**
You'll see the customer's name and address — enough to get there and do the work (you won't get their phone or email; we handle all contact). Please don't save, share or reuse their details, and don't arrange private work with a customer we send you for 12 months after your last job for them. Outside of that, your business is your own.

**4. Job not as quoted, or something off? Stop and tap "I have a problem."**
If the scope's bigger than the photos, you've found damage, or you can't get access — stop on the extra work, add a photo, and flag it. We re-quote the customer and you're paid for the actual work, not the original guess. We deal with the customer — no need to call them.

**5. Asbestos or a pre-1990 home? The law says stop — so stop.**
Old tiles, adhesive or backing can contain asbestos. If you suspect it: stop, don't disturb it, photo it from a safe distance, and tap "I have a problem" → "Asbestos / pre-1990." Never cut, sand or drill it. Your safety call always comes first — you'll never be penalised for stopping a job that isn't safe.

### FAQ — what do I do when…

- **A customer asks what I'm paid, or what they paid** → "All the pricing goes through the office, mate." Friendly, but don't share numbers.
- **A customer wants extra work** → Don't quote it. Tap "I have a problem" → "Job bigger than quoted," add a photo. We re-quote them; you get paid for the real work. Tell them: "I'll get the office to sort that for you."
- **A customer wants to book me directly / asks for my number** → "Best to go through Timeless — they look after the booking and the warranty." Don't hand out your details for a customer we sent you.
- **No one's home / I can't get access** → Wait about 15 minutes, then tap "I have a problem" → "Can't get access" with a photo of the locked door/gate. We contact the customer — you don't.
- **I'm running late** → Give the office a quick heads-up as early as you can so we can let the customer know. *(via "Message the office" — see build note)*
- **I accepted a job but can't make it** → Open the job and tap "Hand back" as early as you can — we re-arrange it. (Different from Decline, which is for offers you haven't taken on, and is always free.)
- **I found asbestos / damaged something / the substrate's no good** → Tap "I have a problem" → the matching reason, add a photo, submit. The job pauses and we step in. Don't patch over a bad substrate to finish.
- **How and when do I get paid?** → Your price is shown on each job before you accept it. When the job's done, upload your photos and send us your tax invoice — we pay by bank transfer **within 7 days of you completing the job**, and we never wait on the customer to pay us first. The app doesn't show invoices or payslips, so keep your own records. *(Invoice-anchored per the pay-term reconciliation in Build notes (d) — contractor/SOPA-safe.)*
- **There's an urgent problem on site** → Contact the office — never the customer. For anything on-site, "I have a problem" alerts us and pauses the job so nothing goes wrong while you wait.

*This is a quick summary to help you on the job — your signed Subcontractor Agreement is what actually governs the work.*

---

## Build notes (decisions, not copy)
**✅ CONFIRMED by Allan 2026-06-08:** (a) **Pay term = within 7 days of JOB COMPLETION** (not customer-payment — Timeless floats the gap; faster/simpler for the sub). (b) **Build sub-payment tracking (Phase 2+):** the sub sees **"Awaiting payment → Paid ✓"** on completed jobs AND Marko gets an **office-side "subs to pay" list** (so neither side misses a payment) — it's a status indicator, **NOT a payslip/payroll** (Fair-Work A8; the sub invoices us). (c) **Add the "How we work" section + the "Message the office" button** — both approved (BUILT 2026-06-08: `web/src/pages/HowWeWork.tsx` + the booked-job "Message office" sheet).

**(d) PAY-TERM WORDING RECONCILED 2026-06-08 (Cleo + Clifford, Rule 8):** Cleo flagged that a pure "7 days of job completion, no invoice condition" promise reads **employee** (paid for time), not **contractor** (paid against an invoice), and breaks SOPA. Fix (in-app + agreement must match): keep Allan's "**7 days of you completing the job**" headline but **anchor it to the sub's tax invoice** + "we never wait on the customer" (we float). The in-app FAQ (Rule-5 FAQ above + the HowWeWork screen) is updated. **TODO for the legal brief:** patch agreement **Clause 3** (`docs/specs/sub-agreement-clauses.md:50-53`) + `docs/specs/sub-rate-schedule.md` to the same invoice-anchored wording ("7 days of completion; the clock starts when we receive your valid tax invoice + Subcontractor's Statement"), so the lawyer reviews one consistent term. *(Pending Allan's nod on the nuance.)*
1. **"Message the office" → APPROVED.** The FAQ's "running late" and "quick question" have no clean home: "I have a problem" *pauses* the job (wrong for "I'll be 40 min late"), and there's no office number/message path. **Recommend** a lightweight **"Message the office"** action on the booked-job screen that notifies Marko **without** pausing — distinct from "I have a problem" (pause) and "Hand back" (re-route). Fair-Work-safe (a contractor telling the office they're late isn't control). Until built, the running-late FAQ line is pending.
2. **Confirm with Marko (business facts, not UI):** the pay-timing wording (kept vague as "per your agreement" — confirm if a specific "X business days" should appear) and any clause references (deliberately kept OUT of the in-app copy — plain English only).
3. **Footer disclaimer is required** (above) — prevents the summary being read as a new/contradicting contract term (UCT).
4. **Legal gate:** append this screen's copy to `docs/specs/legal-review-brief-sub-engagement-2026-06-05.md` so the lawyer reviews the screen + the agreement together.
