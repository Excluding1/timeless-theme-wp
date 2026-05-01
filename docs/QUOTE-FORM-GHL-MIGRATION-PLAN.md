# Quote Form Migration: WordPress AJAX → GoHighLevel + ServiceM8 + BigQuery

**Status:** PENDING — Angela building the GHL form in a separate session.
**My role when ready:** Audit, then replace the current WP form.
**Saved:** 2026-04-28

---

## The plan (Angela's words)

> "Quote form that connects to GoHighLevel are built on a separate session.
> And once I fully complete it, I will transfer over to you, and then you
> can use your expert opinion to audit it. And once good, replace the
> quote form. Because I'm planning on using GoHighLevel, ServiceM8, and
> BigQuery to save all the data, so we can also see it, like, build apps
> and see the data behind it."

---

## The stack she's building

| Tool | Role |
|---|---|
| **GoHighLevel (GHL)** | CRM + marketing automation hub. Captures lead from form, sends auto-responses (SMS/email), assigns to sales pipeline, drip nurture sequences, conversation tracking. |
| **ServiceM8** | Trades-specific job management. After lead converts: quote → schedule → invoice → tradesman mobile app. |
| **BigQuery** | Data warehouse. Stores lead events, conversion data, job data, customer LTV. Powers custom analytics + apps later. |

This is a **sophisticated stack for a trades business** — well-considered for scaling.
GHL handles top-of-funnel + nurture, ServiceM8 handles operations,
BigQuery is the data brain underneath.

---

## Current quote form state (what I'll replace)

### Where it lives
- **Custom AJAX form** in WordPress theme
- Submission goes to `/wp-admin/admin-ajax.php` via the WP `admin_ajax` hook
- Stored in WP database as a custom post type or option, or sent via email
- File: `functions.php` (search for `wp_ajax_timeless_quote` or similar)

### Form fields (current)
- Name, phone, email
- "What customer are you?" (Home Owner / Renter / Construction / Real Estate / Business)
- Photos upload
- Message / details
- SMS/email consent checkbox

### Pain points current form has
- Submissions stay in WP, no CRM
- No automated follow-up (manual email reply only)
- No SMS notifications
- No lead scoring or nurture sequences
- Data isolated from BigQuery — can't analyze trends
- Photos go to WordPress media library — not synced to ServiceM8

### Where the form is embedded (must keep all entry points working post-migration)
- **Homepage** (`front-page.php`) — `#quote` anchor
- **Contact page** (`page-contact.php`)
- **Every service page** (19 pages, `#quote` section)
- **Suburb pages** (`page-suburb-service.php`)
- **Single article pages** (end-of-article CTA links to `/contact/`)

---

## Audit checklist (when Angela hands it over)

### Stage 1: Form rendering
- [ ] GHL form renders correctly inline on a test page
- [ ] Mobile rendering looks clean (no overflow, fields tap-friendly)
- [ ] Matches site brand (colors, font, button styling) OR has a customizable
      style we can override with theme CSS
- [ ] Loads fast (don't iframe a 500KB external form on every page)
- [ ] Doesn't break Lighthouse score (currently 97 on mobile — protect this)
- [ ] Works without JavaScript fallback OR gracefully degrades

### Stage 2: Submission flow
- [ ] Form submits successfully → confirmation message shown
- [ ] Lead appears in GHL within 30 seconds
- [ ] Auto-response email/SMS fires (if configured)
- [ ] Photos upload OR a way for customers to send them after
- [ ] All form fields map to GHL custom fields cleanly
- [ ] Spam protection (CAPTCHA / honeypot / rate-limit)

### Stage 3: Data pipeline
- [ ] GHL → ServiceM8 sync working (when lead converts to job)
- [ ] GHL → BigQuery data export (for analytics)
- [ ] No duplicate lead creation
- [ ] PII handling compliant (Australian Privacy Act 1988)
- [ ] GA4 event fires on form submit (so we can track conversion rate
      in our existing analytics)

### Stage 4: Integration with site
- [ ] Form embeddable on all pages where current form lives
- [ ] `#quote` anchor still works (scrolling to form section)
- [ ] CTAs throughout the site (header "Get a Free Quote", footer,
      service page CTAs, blog CTAs) still link correctly
- [ ] Thank-you/confirmation flow leads users to next action
      (review request? more services? phone call?)
- [ ] Mobile sticky CTA bar still functions

### Stage 5: SEO + accessibility
- [ ] Form has proper labels (not just placeholder text — fails WCAG)
- [ ] Required fields marked correctly
- [ ] Error messages screen-reader accessible
- [ ] No render-blocking scripts hurting Core Web Vitals
- [ ] No SEO downside (e.g., iframes can't be indexed but that's OK
      for forms — just verify nothing else gets blocked)

### Stage 6: Backup + rollback
- [ ] Old WP AJAX form code commented out (not deleted) for fast revert
- [ ] Test the rollback path BEFORE deploying — if GHL form breaks,
      can we restore the WP form within 5 minutes?
- [ ] Test submission backup — if GHL is down, where do leads go?

---

## What Angela needs to share when handing over

When ready to audit, send me:

1. **GHL form embed code** (HTML/JS snippet OR iframe URL)
2. **GHL account login** (read-only access to verify submissions appear)
3. **Test lead** — submit a test through the form so I can verify end-to-end
4. **ServiceM8 → GHL connection status** (working? planned? scope?)
5. **BigQuery integration status** (set up? planned? scope?)
6. **Existing analytics events you want fired** (GA4 conversion event, Clarity event, etc.)
7. **Confirmation page / thank-you page** plan
   - Stay on site? Redirect to GHL hosted page?
8. **Auto-response template** copy (so we can match brand voice)

---

## Integration considerations (expert flags)

### 🟢 Pros of this stack
- **GHL handles nurture** — most leads need 5-7 touches before converting.
  Manual follow-up doesn't scale; GHL automation does.
- **ServiceM8 is the trades industry standard** — used by thousands of AU
  tradesmen. Job scheduling, invoicing, mobile app, inventory tracking.
- **BigQuery is the right choice** for keeping options open. SQL-friendly,
  scales infinitely, integrates with Google Data Studio / Looker Studio for
  free dashboards.
- **All three play well together** — GHL → ServiceM8 (Zapier or native),
  GHL → BigQuery (via Make/n8n/Zapier or direct webhook).

### 🟡 Watch out for
- **Form load time.** GHL forms can be heavy if you embed via iframe.
  Audit Lighthouse score before/after — protect that 97 mobile.
- **CSS conflicts.** GHL forms come with their own styles that may clash
  with our Tailwind theme. May need overrides or a custom-styled form
  using GHL's API instead of their default embed.
- **Lock-in concerns.** GHL is a great tool but switching costs are real.
  Make sure you can export all data periodically (BigQuery solves this — good).
- **Compliance.** Phone numbers + emails are PII. Australian Privacy Act
  applies. Make sure GHL's data residency works for AU customers
  (probably in US — disclosed in Privacy Policy?).
- **Spam.** GHL has anti-spam but check if rate-limiting is on by default.
  Trades businesses get hit hard by form spam.
- **Photo upload.** GHL's default form may not handle photo uploads well.
  May need separate upload field or post-form follow-up email asking
  for photos.

### 🔴 Don't skip
- **Test the failure mode.** What happens if GHL is down when a customer
  submits? Where do leads go? Don't lose leads to outages.
- **Track form abandonment.** Microsoft Clarity should already be capturing
  this — verify after deploy.
- **A/B test forms after deploy.** GHL native A/B testing exists. Test
  fields, copy, button text. Iterate based on data.

---

## Replacement steps (when audit passes)

Once Angela's GHL form is verified, the replacement is:

1. **Find current quote form code** in `front-page.php`, `page-contact.php`,
   all service pages, suburb template, blog templates.
2. **Replace each instance** with GHL embed code (or shortcode if we make
   it reusable).
3. **Remove `timeless_handle_quote_submission` function** (or whatever the
   AJAX handler is) from `functions.php` — but COMMENT OUT, don't delete,
   so rollback is easy.
4. **Update GA4 event tracking** to fire on GHL form submit (use postMessage
   or GHL webhook → server-side GA4 Measurement Protocol).
5. **Update Privacy Policy** to disclose GHL/ServiceM8/BigQuery data handling.
6. **Test all entry points** end-to-end before Cloudflare purge.
7. **Cloudflare purge.**
8. **Monitor for 48 hours** — confirm leads arriving in GHL, no broken pages,
   conversion rate not dropped.
9. **After 30 days**, remove commented-out old code if all stable.

---

## Out-of-scope for this migration

These are deferred to later phases:

- ServiceM8 → BigQuery direct sync (build after GHL → ServiceM8 stable)
- Custom dashboards / apps using BigQuery data (build after data accumulates)
- Lead scoring rules in GHL (set up after seeing real lead patterns)
- Nurture email sequence content (Angela writes; I can review for tone)
- Custom GHL workflows for different lead types (Home Owner vs Property
  Manager vs Construction etc.)

---

## Why this is the right move (validation)

Angela's instinct to use GHL + ServiceM8 + BigQuery for a trades business
is correct. The pattern is:

- **Top of funnel** (website + ads + GBP) → **GHL** captures + nurtures
- **Mid funnel** (qualified lead) → **ServiceM8** quotes + schedules + invoices
- **Data layer** → **BigQuery** stores everything for analysis

This separates concerns properly. Each tool does one thing well.

The current WP-only setup was fine for a brand new business but doesn't scale
beyond ~50 leads/month. This migration prepares the business for 200+
leads/month without losing any.

---

## Status checkpoint

When Angela returns with the GHL form ready to audit, this MD has
everything needed to:
- Run the 6-stage audit
- Identify integration risks
- Execute the replacement
- Roll back if needed

Until then: focus on sales velocity using existing tools.
