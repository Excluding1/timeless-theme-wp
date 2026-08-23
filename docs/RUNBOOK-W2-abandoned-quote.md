# W2 — abandoned-quote SMS: the fix, step by step

**For Allan, 2026-08-23.** Everything on the website side is live and verified. What is left is
three edits inside GHL. Nothing here needs a theme deploy **except** the property-address line,
which is called out where it matters.

---

## Before you start: what is already working

| | |
|---|---|
| `/finish-quote/` page | ✅ live, returns 200, `noindex`, form mounts, no nav to escape through |
| Draft store | ✅ saves and restores on the live site |
| Resume links | ✅ **63 characters** — one SMS segment |
| Idle clock | ✅ 90 minutes (30 to confirm + 60 grace), resets if they come back |
| Sweep | ✅ runs every 10 minutes |
| Webhook payload | ✅ carries `resume_link_sms`, `form_status`, `reach_by` |
| `property_address` | ⏳ **needs the next theme deploy** |

---

## Step 0 — the two things that will silently stop this working

Audited before writing the steps, because "fix once and it works" means finding these now.

### 0a. WP-Cron will not fire reliably. Add a real one.

The 90-minute sweep is a WordPress cron event, and **WP-Cron only runs when PHP runs**.
Cloudflare serves this site's HTML from cache (`cf-cache-status: HIT`, `max-age=3600`), so most
visits never reach PHP at all. Form activity does — `admin-ajax.php` is `DYNAMIC` — but the
sweep needs to fire *90 minutes after activity stops*, which is exactly when nothing is hitting
the origin.

Left alone, the text arrives late or whenever the next uncached request happens to land.

**Fix, in cPanel → Cron Jobs, every 10 minutes** (`*/10` `*` `*` `*` `*` — every one of the five
time fields needs a value, cPanel rejects blanks):

```
curl -s "https://timelessresurfacing.com.au/wp-cron.php?doing_wp_cron&cb=$(date +\%s)" > /dev/null 2>&1
```

⚠️ **The cache-buster must be a SEPARATE parameter (`cb`), never a value on `doing_wp_cron`.** Measured 2026-08-23: Cloudflare caches `wp-cron.php`
itself — three consecutive requests to the bare URL returned `cf-cache-status: HIT`, `age: 121`.
A cron hitting the bare URL fires every 10 minutes, gets an empty cached response, and **PHP never
runs**. cPanel reports success the whole time. The unique timestamp makes every request a distinct
URL, which returns `MISS` and reaches the origin — verified.

**Why `cb` and not `doing_wp_cron=<timestamp>`** (corrected 2026-08-23 after shipping it wrong):
`wp-cron.php` treats a NON-EMPTY `doing_wp_cron` as a lock key handed over by WordPress itself,
and exits unless it matches the `doing_cron` transient:

```php
} else {
    $doing_wp_cron = $_GET['doing_wp_cron'];   // our value
}
if ( $doing_cron_transient !== $doing_wp_cron ) {
    return;                                    // an external value can never match
}
```
(WordPress core, `wp-cron.php` lines 94-113.)

So `?doing_wp_cron=1755914400` returns HTTP 200, misses Cloudflare, reaches PHP — **and runs
nothing.** The parameter must stay present-but-empty so core takes the "called from external
script" branch and grabs its own lock. Put the cache-buster in any other parameter name.

The backslash in `+\%s` is required: in a crontab a bare `%` means "newline" and truncates the
command. `2>&1` stops cPanel emailing you every 10 minutes.

A free UptimeRobot check every 5 minutes does the same job if cPanel cron is awkward — but it must
carry the same cache-busting query string.

**Verify it is genuinely running** (added in theme v1.5.3):

```
curl -s "https://timelessresurfacing.com.au/wp-admin/admin-ajax.php?action=timeless_sweep_status&k=<TIMELESS_GHL_SECRET>"
```

Returns `last_run_utc`, `seconds_ago`, `scanned`, `sent`, `next_due_utc`. If `seconds_ago` keeps
climbing past ~600, the cron is not reaching PHP. This exists so that "no text arrived" can be told
apart from "GHL is misconfigured" — without it the two are indistinguishable from outside.

⚠️ **The check perturbs the thing it measures.** `admin-ajax.php` is uncached, so reading the
heartbeat is itself a PHP request, and WordPress spawns due cron events on any PHP request. Measured
2026-08-23: a heartbeat read at 02:32:32 produced a sweep at 02:32:33. A run appearing *right after*
your check therefore proves nothing about the cron — it may just be your own request.

**To judge the cron honestly:** read the heartbeat once, note `next_due_utc`, then leave the site
completely alone until a few minutes past that time and read again. If `last_run_utc` has not moved
past `next_due_utc` without you having touched anything, the cron is not working.

### 0b. `abandoned_confirmed` is not a valid option on the GHL dropdown

`form_status` is specced as a **Dropdown** with `partial`, `complete`, `waitlist`
(`ghl_setup_spec_v2_2026-05-05.md:196`). The sweep sends **`abandoned_confirmed`**, which is not
one of them.

The trigger *filter* reads the raw webhook payload and will be fine. The risk is the
**Create/Update Contact** step, if it maps `form_status` into that custom field — an unknown
option can be rejected or silently dropped.

**Fix:** Settings → Custom Fields → `form_status` → add **`abandoned_confirmed`** as a fourth
option before touching the workflow.

---

## Step 1 — teach GHL the payload shape

GHL only offers a field in the merge-field picker once it has seen it. Open the **W2 Trigger —
Partial Form Fill** step and use its sample-payload / test-request box. Paste this:

```json
{
  "secret_token": "PASTE_THE_REAL_TOKEN",
  "firstName": "Test",
  "lastName": "Customer",
  "email": "test@example.com",
  "phone": "+61400000000",
  "customData": {
    "form_status": "abandoned_confirmed",
    "property_address": "12 Smith St, Penrith NSW 2750",
    "resume_link_sms": "https://timelessresurfacing.com.au/finish-quote/?r=0067483a9d11",
    "idle_minutes": 92,
    "reach_by": "sms"
  }
}
```

The real token is **`TR_secret_v2_ByJJ9B0FAy8oG95mlzclaKsZsCHYzZnqILo3z3pk4Mc`** — it matches the
gate in the workflow ("If secret_token is TR_secret_v2_By…"). A wrong one is rejected silently
and looks exactly like a broken webhook.

⚠️ Use the trigger's **sample/test** box, not a live send. A live send creates a real contact and
starts a real timer.

---

## Step 2 — gate the SMS, do NOT filter the trigger

My first version of this said to filter the trigger on `abandoned_confirmed`. **That was wrong**
and Cleo caught it. W2 also owns **Create/Update Contact (partial)** and the
**`form-partial-pending`** tag. Filtering at the trigger means browser `partial` events never
enter the workflow at all, so people who abandon early stop being captured as contacts entirely.
That trades a duplicate text for a lost lead, which is the worse bug.

**Leave the trigger unfiltered.** Add an **If/Else** step *after* the tag and *before* the SMS:

> **`customData.form_status`** — is — **`abandoned_confirmed`**
> - **Yes** → continue to the SMS
> - **No** → END

Now every partial still creates and tags a contact, and only the 90-minute sweep sends a text.

**Recommended second condition on the same branch**, as belt and braces: also require that the
contact does **not** carry the completed/submitted tag. The form marks a draft finished with a
fire-and-forget request after submitting; if that request is blocked or lost, the draft still
looks abandoned and someone who finished could get a text.

## Step 3 — delete the Wait

Delete **"Wait 4 hours (abandoned cart timer)"** entirely.

It predates the current design. It came from the May spec, which copied Surface Care's 4-5 hour
abandoned-cart timing before we had our own server-side clock. The 90 minutes is already served
before GHL hears anything, so leaving it stacks to **5.5 hours** — not what was agreed, and long
enough that the moment has passed.

---

## Step 4 — replace the SMS body

Open **Send SMS T2** and replace the body with:

```
Hi {{contact.first_name}}, Allan here from Timeless Resurfacing. I can see the quote for {{property_address}} didn't get finished off, here's the link back to where you got up to: {{resume_link_sms}}

Just after a couple of photos and a quick note on what needs doing, then I'll get your quote sorted as soon as possible.
```

**Insert both tokens with the merge-field picker**, not by typing. GHL's exact path differs
between accounts — some expose `inboundWebhookRequest.body.customData.*`, some
`inboundWebhookRequest.customData.*` — and a typed token that resolves to nothing sends a text
with a gap where the link should be.

Both fields are now sent **twice**, at the top level and inside `customData`, so whichever the
picker offers will resolve. If you see both, take the top-level one.

**The empty-address case is handled.** Someone can abandon before ever reaching the address
step, which would have produced *"I can see the quote for didn't get finished off"*. Both paths
now fall back to **"your bathroom"**, so the sentence always reads. GHL merge fields cannot do a
conditional, so this belongs server-side and does.

**Until the next theme deploy**, `property_address` does not arrive at all and the merge field
renders empty. Use this version in the meantime and add the address afterwards:

```
Hi {{contact.first_name}}, Allan here from Timeless Resurfacing. I can see your bathroom quote didn't get finished off, here's the link back to where you got up to: {{resume_link_sms}}

Just after a couple of photos and a quick note on what needs doing, then I'll get your quote sorted as soon as possible.
```

The old body goes entirely. *"Reply YES and I'll reopen it"* was the workaround from before
resume links existed — asking someone to send a text before they get a link is friction we built
this to remove.

---

## Step 5 — leave the rest alone

Security gate, Create/Update Contact (partial), and `Tag: form-partial-pending` all stay exactly
as they are. Save and publish.

---

## Step 6 — test it for real

1. On the live site, start a quote **with your own mobile number**
2. Get two steps in, enter the address, then close the tab
3. Wait. The sweep runs every 10 minutes and fires at 90 minutes idle, so expect the text
   **90-100 minutes** later
4. Tap the link. It should land on `/finish-quote/` with your answers already filled in
5. Finish the quote and confirm no second text arrives

**If nothing comes:**

| Symptom | Cause |
|---|---|
| No text at all | Trigger filter typo, or the security gate rejected a wrong `secret_token` |
| Text arrives but link is blank | `resume_link_sms` typed rather than picked from the field list |
| Text arrives with a gap where the address should be | Expected until the theme deploy |
| Two texts | The If/Else condition is not saved, or sits after the SMS instead of before it |
| Address says "your bathroom" for someone who entered one | Draft saved before this fix; only affects drafts created before the deploy |
| Nothing at all, and you want to know why | Check `tr_draft_last_sweep` in wp_options. It now records `at`, `scanned` and `sent` on **every** run, so "cron never fired" and "cron ran, found nothing" look different |

---

## What this changes

Before: someone abandons, and either nothing happens or they get a text 4+ hours later asking
them to reply YES before anything useful arrives.

After: **one text, 90 minutes after they genuinely go quiet, from a named person, naming their
property, with a one-tap link straight back into their part-filled form.**

It is the first automation that recovers a lead rather than just recording one.
