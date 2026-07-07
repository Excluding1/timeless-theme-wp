# Social agents activation runbook (DM handler · Live chat · Comment replier)

**Status: OUR SIDE COMPLETE 2026-07-07 — everything below is paste-ready. The ONLY blocker is
Allan's 10-minute account connection (step 0).** Production path = GHL-native (no cloud function,
no extra vendors) at our scale; the full custom build in [dm-handler.md](dm-handler.md) stays the
upgrade path once DM volume justifies it. All customer-facing copy below: Rule-8 Cleo pass before
pasting live.

## Step 0 — Allan's one-time connection (~10 min)
1. GHL → Settings → **Integrations** → Facebook: sign in, grant the Timeless Resurfacing PAGE
   (pages_messaging + pages_manage_engagement when prompted). Instagram connects through the same
   flow (the IG account must be a Business account linked to the FB page — Meta side:
   Instagram app → Settings → Business tools → connect to the Facebook Page first).
2. GHL → Sites → **Chat Widget** → create widget "Timeless Website Chat" (SMS-chat type:
   visitor leaves name+mobile, replies go to their phone as SMS — no live-agent staffing needed).
   Copy the widget ID for step 3 of the live-chat section.
3. Tell Clifford "socials connected" — the flows below get built + tested the same day.

## Agent A — DM handler (FB/IG messages → quote intake)
**Mode 1 (day one, zero AI):** GHL Workflow — trigger "Customer Replied" filtered to channel
Facebook/Instagram, first-touch only (contact has no tag `dm-engaged`):
```
Hey! Thanks for messaging Timeless Resurfacing 🙌 Quickest way to a price: send us 2-3 photos of
the bathroom (or benchtop/basin) right here in the chat plus your suburb, and you'll have your
quote within 24 hours. Or if it's easier, our 2-minute form: timelessresurfacing.com.au/quote/
```
Then add tag `dm-engaged` + Slack ping to #quotes-in so Allan sees every DM thread. Photos that
arrive in the thread are on the GHL contact — quote from the quote app as usual.
**Mode 2 (AI conversation, after volume justifies):** GHL Conversation AI bot scoped to FB/IG
channels using the identity + escalation rules from [dm-handler.md](dm-handler.md) — with the
24-HOUR promise (the spec's "2 hours" line is superseded), the ACCC are-you-a-bot disclosure
verbatim, never quoting a price, and escalate-to-human on complaint/dispute/asbestos/legal.

## Agent B — Live chat (website)
1. Theme embed (Clifford does this on the next deploy): GHL widget script in `footer.php` behind a
   Customizer toggle `timeless_chat_widget_id` (empty = widget off, so it ships dark until the ID
   is pasted). One-liner embed: `<script src="https://widgets.leadconnectorhq.com/loader.js"
   data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
   data-widget-id="{ID}"></script>`
2. Behaviour: SMS-chat mode = visitor types a question + leaves mobile → lands in GHL
   Conversations → auto-ack SMS fires → Allan answers by text when free. Capture-first, exactly
   like the Trade Magnet chatbot pattern ("in case we get disconnected").
3. Auto-greeting (widget settings): "G'day 👋 Ask us anything about resurfacing — or send photos
   via our quote form for a price within 24 hours."

## Agent C — Comment replier (FB/IG post comments)
GHL Workflow — trigger "Facebook/Instagram Comment" on our posts (available on current GHL plans
under Workflow triggers → social): auto-DM the commenter Mode-1's message + like the comment +
tag `comment-lead` + Slack ping. NEVER auto-reply publicly with prices; public reply (manual, or
one canned line): "Sent you a DM! 👍". Jordan runs this 24/7 — comments are purchase intent.

## What stays deferred (and why that is correct)
Paid-ads auditor + tracking engineer: build the week ads start (Phase 8) — nothing to audit yet.
Custom Meta-webhook DM bot (dm-handler.md full build): revisit at ~20+ DMs/week or when Mode 2's
GHL Conversation AI limits chafe. Voice AI (SM8 Phone waitlist / GHL Voice AI): revisit after
missed-call-text-back proves the demand.
