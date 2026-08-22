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

The real `secret_token` is in `.secrets/` — ask Clifford rather than guessing, the security gate
rejects a wrong one and you will think the webhook is broken.

⚠️ Use the trigger's **sample/test** box, not a live send. A live send creates a real contact and
starts a real timer.

---

## Step 2 — filter the trigger

The problem: **both** abandon paths POST to this same webhook.

| `form_status` | Path | When |
|---|---|---|
| `partial` | Browser | The instant someone tabs away — before the 30-minute confirm |
| `abandoned_confirmed` | Server sweep | After 90 minutes of genuine silence |

Without a filter the same person can get **two texts**.

On the trigger, add a filter:

> **`customData.form_status` — is — `abandoned_confirmed`**

---

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

**Insert both tokens with the merge-field picker**, not by typing. Pick them from the inbound
webhook request data; GHL's exact token text differs between accounts and a typed one renders empty.

**Until the next theme deploy**, `property_address` will be blank and the sentence reads badly.
Use this version in the meantime and add the address afterwards:

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
| Two texts | The trigger filter is not saved |

---

## What this changes

Before: someone abandons, and either nothing happens or they get a text 4+ hours later asking
them to reply YES before anything useful arrives.

After: **one text, 90 minutes after they genuinely go quiet, from a named person, naming their
property, with a one-tap link straight back into their part-filled form.**

It is the first automation that recovers a lead rather than just recording one.
