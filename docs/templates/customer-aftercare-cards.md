# Templates: Customer Aftercare Cards (A5, double-sided)

**Source:** Migrated from `data/archive/old-drafts-2026-04/extracted-sub-onboarding/14-templates-+-ads.md` (sub-onboarding-system.xlsx Sheet 14, section A).
**Audited via:** [auditor-customer-fairness.md](../roles/auditor-customer-fairness.md) + [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md) (no over-claiming on warranty + ACCC consumer-rights compliant)
**Companion to:** [sub-onboarding-checklist.md § Step 7 Aftercare cards](../sop/sub-onboarding-checklist.md), [sub-agreement-clauses.md § Clause 5 Warranty](../specs/sub-agreement-clauses.md)

---

## Why these exist

Per [sub-onboarding-checklist.md](../sop/sub-onboarding-checklist.md): every subcontractor leaves an aftercare card on the vanity/kitchen bench after every job. Reasons:

1. **Customer education** — proper care preserves the work + reduces warranty callback rate (per [sub-ongoing-quality-monitoring.md § 4](../sop/sub-ongoing-quality-monitoring.md))
2. **Brand reinforcement** — physical artifact in customer's home keeps us top-of-mind for future jobs + referrals
3. **Warranty terms in writing** — consumer protection requires customer can see warranty terms; this card backs up email/SMS warranty mentions
4. **Review prompt** — natural moment to ask for Google review

**Format:** A5, double-sided, printed on slightly thick (180gsm+) cardstock so it doesn't get tossed. Subcontractor carries stack in van.

**⚠️ ACCC compliance check:** warranty wording must NOT over-claim. Per [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md):
- Use "up to 5-year" not "5-year guaranteed"
- Use "12-month workmanship guarantee" not "lifetime"
- Don't use phrases that override Australian Consumer Law statutory rights ("you have only 30 days" is illegal — ACL rights are non-overridable)
- Always say "this guarantee is in addition to your rights under Australian Consumer Law"

---

## Card 1: Regrout aftercare

### Front side

```
[Timeless Resurfacing Logo]

YOUR BATHROOM REGROUTING — AFTERCARE GUIDE

⏰ CURE TIME: Please do not use the shower/bath for 24 HOURS to allow grout
   and silicone to fully set.

✅ DO:
• Use gentle bathroom cleaners (spray & wipe, Shower Power, Exit Mould)
• Wipe down with a soft cloth after each use
• Run the fan or open a window after showering to reduce moisture
• Contact us if you notice any issues within your warranty period

❌ DON'T:
• Use abrasive cleaners (Ajax, Jif, steel wool)
• Use a high-pressure hose on grout lines
• Use bleach directly on coloured grout
• Pick at or scratch new silicone edges
```

### Back side

```
YOUR WARRANTY

This work is covered by a 12-month workmanship guarantee.

If you notice any grout cracking, silicone lifting, or discolouration within
the warranty period, contact us and we'll send our technician back to fix it
— at no extra cost.

This guarantee is in addition to your rights under Australian Consumer Law.

📱 Call/Text: [phone — pull from Customizer]
📧 Email: [email — pull from Customizer]
🌐 [website]

Timeless Resurfacing | ABN [pull from Customizer]

Thank you for choosing us! If you loved the result, we'd appreciate a Google
review ⭐ — search "Timeless Resurfacing Sydney" on Google.
```

**Warranty length variants:**
- Standard cement grout regrout: **12-month workmanship**
- Epoxy grout regrout: **24-month** (epoxy lasts longer than cement)
- Update card variant per service tier per [pricing tier warranty](../specs/sub-rate-schedule.md)

---

## Card 2: Resurface aftercare

### Front side

```
[Timeless Resurfacing Logo]

YOUR BATHROOM RESURFACING — AFTERCARE GUIDE

⏰ CURE TIME: Please do not use the resurfaced area for 48-72 HOURS.
   Do not place anything on the surface during this time. Do not run water
   over it.

✅ DO:
• Use ONLY gentle, non-abrasive cleaners (spray & wipe, mild bathroom cleaner)
• Use a soft cloth or sponge — no scourers
• Rinse with clean water after cleaning
• Use a bath mat (suction-cup free) to protect the surface
• Keep the area ventilated for 24 hours after our visit

❌ DON'T:
• Use abrasive cleaners (Ajax, Jif, Barkeeper's Friend, steel wool, magic erasers)
• Drop heavy objects onto the surface (metal bottles, glass jars)
• Use suction-cup bath mats (pulls on coating)
• Use nail polish remover or acetone near the surface
• Place hot objects directly on resurfaced benchtops
```

### Back side

```
YOUR WARRANTY

This work is covered by an up-to 5-year workmanship and coating guarantee
(private home; 6-month for rental properties).

Our professional-grade Hawk Glass-Tech coating system is designed to last
10-15 years with proper care. If you experience any peeling, bubbling, or
discolouration within the warranty period that is not caused by improper use,
contact us and we'll fix it at no cost.

This guarantee is in addition to your rights under Australian Consumer Law.

📱 Call/Text: [phone]
📧 Email: [email]
🌐 [website]

Timeless Resurfacing | ABN [XX XXX XXX XXX]

Loved the result? A Google review would mean the world to us ⭐
```

**Warranty length variants:**
- Bath resurface (private home): **up to 5-year**
- Bath resurface (rental property): **6-month** (high-traffic, multiple users)
- Tile recoat: **up to 5-year private / 6-month rental**
- Cabinet respray: **2-year**
- Update card variant per service per [pricing tier warranty](../specs/sub-rate-schedule.md)

---

## Card 3: Quick service / chip repair (NEW — recommended addition)

For sub-$300 quick services (silicone-only, single chip repair, mould treatment), a simpler card.

### Front side

```
[Logo]

YOUR QUICK SERVICE — AFTERCARE

⏰ CURE TIME: 24 HOURS before normal use.

✅ DO: gentle cleaners, soft cloth, ventilate
❌ DON'T: abrasive cleaners, scrub the new silicone/repair edges

Loved the result? Refer a friend, get $50 off your next service.

📱 [phone] | 📧 [email]
Timeless Resurfacing | ABN [XX XXX XXX XXX]
```

### Back side

```
YOUR WARRANTY

This work is covered by a 6-month workmanship guarantee.

Issues? We'll fix them at no cost.

This guarantee is in addition to your rights under Australian Consumer Law.

⭐ Google review: "Timeless Resurfacing Sydney"
```

---

## Variables to fill before printing

These cards have placeholders that fill from WordPress Customizer per [CLAUDE.md](../../CLAUDE.md):
- `[phone]` → `timeless_phone()` → 0451 110 154
- `[email]` → `timeless_email()` → hello@timelessresurfacing.com.au
- `[ABN]` → `timeless_abn()` → (pending Customizer field — currently in [STATE.md](../STATE.md))
- `[website]` → timelessresurfacing.com.au
- `[X]-month` / `[X]-year` → per service warranty per [sub-rate-schedule.md](../specs/sub-rate-schedule.md)

---

## Print operations

### Quantities + reorder cycle
- **Initial order:** 200 of each card variant (regrout, resurface, quick service) = 600 total
- **Reorder threshold:** subcontractor down to 20 cards = order 200 more
- **Cost estimate:** ~$80-150 for 600 A5 cards via Vistaprint or Officeworks
- **Storage:** Allan keeps master stack at home; subcontractors pick up batch of 20 each at onboarding + on quarterly review visits

### Card distribution per onboarding (per [sub-onboarding-checklist.md § Step 7](../sop/sub-onboarding-checklist.md))
- 20 of each relevant card type to each new subcontractor
- Reorder via Slack request to Allan

---

## Future enhancements

- **QR code** on back of each card → links to a customer NPS / review form (auto-Google-prompt for 9-10 raters)
- **Multilingual variants** for Sydney's diverse market (Mandarin, Cantonese, Arabic)
- **Branded magnetic card** instead of paper for fridge/laundry placement (longer brand presence)
- **Per-property variant** for strata properties — strata-specific cure-time guidance for shared facilities

---

## Cross-references

- [sub-onboarding-checklist.md § 7](../sop/sub-onboarding-checklist.md) — onboarding step where cards distributed
- [sub-agreement-clauses.md § Clause 5](../specs/sub-agreement-clauses.md) — warranty terms backing
- [sub-rate-schedule.md § A/B](../specs/sub-rate-schedule.md) — warranty length per service
- [auditor-customer-fairness.md](../roles/auditor-customer-fairness.md) — warranty wording lens
- [auditor-compliance-aus.md](../roles/auditor-compliance-aus.md) — ACCC warranty + ACL compliance
