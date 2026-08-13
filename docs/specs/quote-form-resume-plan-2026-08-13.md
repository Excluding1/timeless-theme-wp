# Quote form — QR handoff + SMS resume link: how it works, what's broken, and the v1.5.2 plan

**Written 2026-08-13.** Everything below was verified against the live site, the live theme backup
`timeless-theme-2_v1.5.1_2026-07-25_2252.zip`, and the live GoHighLevel API — not assumed from
older docs. Where something is unverified it says so.

---

## 0. Baseline: the repo IS the live theme

Allan's concern was working from a drifted repo. Checked file by file:

| Compared | Result |
|---|---|
| Live backup zip (912 files) vs repo | **Identical except one line** — `style.css` version (repo `1.5.0`, live `1.5.1`) |
| Form bundle `quote-form.js`: zip vs repo vs **what the website is actually serving** | All three byte-identical (`ff47a5b5…`) |
| `assets/main.min.css` (the file that got gutted once) | 5081 lines in both — intact |

So there is **no drift to fear**. The only fix needed before we start is bumping the repo's version
number, which is exactly what "build v1.5.2" means.

---

## 1. How the QR handoff actually works

**Status: LIVE and working.** Verified in the live bundle.

### The mechanism (there is no server involved)
1. Customer reaches **Step 5, "Photos & submit"**, on a desktop.
2. A button appears: **📱 Continue on mobile?**
3. The form takes its entire current draft, `JSON.stringify`s it, base64url-encodes it, and builds
   a link ending `…/contact/#qf=<encoded draft>`.
4. It renders a **QR code of that link locally** (the `qrcode-svg` library, bundled). No external QR
   service, nothing leaves the browser.
5. Customer scans it with their phone → the phone opens the form → the form reads `#qf=`, decodes
   it, restores the fields, and **removes the hash from the URL**.

### Why a URL fragment
Everything after `#` is **never sent to a server** — not to WordPress, not to Cloudflare, not into
any access log. So the customer's name, phone and address travel to their own phone without ever
being stored anywhere. That is a genuinely good design and worth keeping.

### What does NOT transfer
**Photos.** They're browser `File` objects and can't be serialised into a URL. That is deliberate —
the entire point of the handoff is that the customer takes the photos *on the phone*.

### The modal has two tabs
**QR** and **Link** (copy to clipboard). **There is no "text it to me" option** — see §3.

---

## 2. How the SMS resume link works

**Status: the form half is LIVE. The GoHighLevel half was never wired.**

### What the form does today
When a customer types a valid name + phone on Step 1 and clicks away from the field, the form
POSTs once to a GoHighLevel inbound webhook:

```
https://services.leadconnectorhq.com/hooks/Uz8fQwDiUxAHVtlruspD/webhook-trigger/11247014-…
```

carrying `secret_token` (W2's first action validates it, default-deny) plus:

| Field | What it holds |
|---|---|
| `firstName` / `lastName` / `email` / `phone` | contact details |
| `form_status` | `"partial"` |
| `step_reached` | which step they got to |
| `property_submission_id` | the fix that stopped bathroom 2 overwriting bathroom 1 |
| **`resume_link`** | the full `#qf=` deep link |
| `resume_link_short` | the bare form URL |

### What GoHighLevel does today
**W2 – Abandoned Quote Recovery** exists and is **published** (confirmed live via the API). So
abandoners *are* being texted right now — but the message body still has **no link in it**. The
old copy said "we can reopen it" with nothing to tap.

Workflow bodies cannot be edited through the API (I tried: `GET /workflows/{id}` returns 404 —
list only). **This edit has to be done by Allan in the GoHighLevel UI.** It is the single
highest-value action in this whole document and takes about ten minutes.

### Verified working
I built a draft, encoded it exactly as the form does, and loaded it cold on the live site. It
restored the draft, jumped to **Step 5 of 5**, and stripped the hash. The mechanism W2 depends on
is sound.

---

## 3. The three real problems

### 🔴 P1 — the resume link only ever contains Step 1
`sendPartialLead()` is guarded by `partialSent.current` so it **fires exactly once per session**,
on Step 1. `resume_link` is built at that moment, so it contains only name/phone/email.

**Consequence:** a customer who abandons on Step 4 and taps the SMS link lands back on **Step 1**
with just their contact details. The drafted W2 copy — *"Pick up exactly where you left off"* — is
therefore **not true**, and we should not send a claim we don't meet.

### 🔴 P2 — the link can DESTROY a customer's saved progress
The restore logic prefers the URL hash over local storage:

```js
if (hash starts with #qf=) d = decode(hash)
if (!d)                    d = localStorage      // only as a fallback
```

The form autosaves the full draft to local storage on **every** change. So a customer who filled
four steps on their phone, then taps our SMS link **on that same phone**, has their complete local
draft **overwritten by the stale Step-1 hash**. We would be actively deleting their work with our
own recovery message.

**Fix:** prefer whichever draft is further along, not whichever came from the URL.

### 🟠 P3 — the QR button doesn't reliably appear
It is gated on `window.matchMedia("(min-width: 768px)").matches`, evaluated once during render and
never re-checked. A tablet rotating portrait→landscape, or any layout that settles after first
paint, never gets the button. I reproduced it missing at 1280px wide.

---

## 4. The v1.5.2 plan

Built **from the live backup zip's state** (which, per §0, equals the repo once the version is
bumped). Ordered so the biggest win needs no code at all.

### Step 0 — Allan, in GoHighLevel (~10 min, no deploy needed)
Wire the resume link into **W2 – Abandoned Quote Recovery**. Use this body, which is honest about
what actually restores:

```
Hi {{contact.first_name}}, it's Timeless Resurfacing. Your bathroom quote request is saved but not finished.

Finish it here and your details are already filled in: {{inboundWebhookRequest.customData.resume_link}}

You'll just need a few photos of the bathroom, then your quote lands within 24 hours.
```

- Insert the merge field with GoHighLevel's picker on the **inbound webhook trigger data** so the
  token name matches exactly — typing it by hand is how these render blank.
- **Test to yourself first.** If the link arrives blank, stop and tell me before it goes to
  customers.
- Do **not** use "Pick up exactly where you left off" until P1 is fixed.

### Step 1 — code fixes (me)
| Fix | File | Risk |
|---|---|---|
| **P2** prefer the further-along draft over the stale hash | `QuoteForm.jsx` restore effect | low, pure logic |
| **P1** refresh `resume_link` as the customer advances, without re-triggering W2 | `QuoteForm.jsx` + one GoHighLevel field update | medium — needs care so W2 can't double-fire |
| **P3** make the viewport check reactive | `QuoteForm.jsx` | low |
| Version bump `1.5.0` → **`1.5.2`** | `style.css` | none |

### Step 2 — "Text me the link" (optional, decide before I build)
The modal currently offers QR + Copy only. Adding SMS needs a send path, and the honest options are:

- **Via GoHighLevel** — the form posts `form_status: "send_link"`, a workflow texts them. Costs one
  more workflow and an SMS per tap.
- **Don't build it.** On mobile they don't need it; on desktop the QR already solves it; and once
  W2 works, anyone who stalls gets the link automatically.

**Recommendation: skip it for now.** W2 covers the same ground for free. Revisit if you see people
using the Copy tab.

### Step 3 — build + deploy
1. `cd quote-form && npm run build` → refreshes `assets/quote-form/`
2. Verify `main.min.css` is still 5081 lines **inside the zip** (it was silently gutted once)
3. Build the zip named `timeless-theme-2.zip` per CLAUDE.md
4. Upload → **"Replace current with uploaded"** → confirm the active theme is the newest slug
5. Purge **SpeedyCache and Cloudflare**
6. Verify in **incognito**: version reads 1.5.2, form loads, a test `#qf=` link restores

---

## 5. What I am NOT touching
Everything else in the theme is byte-identical to what's live and working. This change set is
confined to `quote-form/src/QuoteForm.jsx`, the rebuilt bundle, and the version line in
`style.css`. No page templates, no CSS, no `functions.php`.

---

## 6. Open question for Allan
**P1's proper fix costs a GoHighLevel field write on each step.** The cheap alternative is to keep
the link as-is (contact details only) and use the honest copy above. Worth deciding which:

- **Cheap:** honest copy, link restores contact details, no extra moving parts.
- **Proper:** link restores their real position, at the cost of one field update per step and
  careful guarding so W2 cannot re-fire and double-text (the exact bug that hit Tomas Repka).
