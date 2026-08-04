# Timeless Pipeline — plan, research and build spec (2026-07-31)

Written by Clifford after Allan's brief: *"build a web app that's like our sales pipeline but in a
web app form, connected and easier to run and manage… a mini questionnaire pipeline… handling
between two people is messy… also cut the tech stack we don't use… mobile responsive mainly."*

---

## Executive decision box

| Decision | Recommendation |
|---|---|
| **Build new app or evolve Quote Inbox?** | **Evolve Quote Inbox.** It already pulls GHL, already has a list view, already handles photos. A third app contradicts the goal of cutting stack. |
| **Local or hosted?** | **Hosted.** This is the single biggest fix. A localhost app on Allan's Mac cannot solve "messy between two people" — Marko has to see the same board on his phone. Netlify + Supabase (both already paid for). |
| **Missed calls / messages** | **GHL already does this.** Missed-call text-back is free on the plan and is currently OFF. Turn it on today (5 min). |
| **ServiceM8** | **Pause it.** Its purpose was dispatch to a 20+ sub network. That network is not happening (see §1.2). Not used today. ~$14.50/mo. |
| **The bottleneck to fix first** | **Sub rate card.** Every quote currently waits on a sub price. That single wait is what makes the whole pipeline feel messy. |

---

## 1. What we actually learned (the premises changed)

### 1.1 The subcontractor network is not the model
Evidence, from Allan directly:
- **Only 1–2 subs price well.** The rest quoted **$880–980 on a $1,540 job** (57–64%), which is
  worse than Surface Care's 54% and with none of their volume leverage.
- **Good subs are booked ~3 weeks out.** Surface Care hit the same wall: 3–4 week lead times, and
  **only 20–25% of leads will wait.**
- Allan currently **middle-mans every booking** to find someone sooner.

So the "20+ subs" plan is retired. The real crew is **Marko + 2 good subs**, heading toward the
already-ratified employee plan (E1 Marko trains → E2 employees).

### 1.2 What this means for the tooling
ServiceM8 was kept (LOCKED 2026-06-05, unanimous) as the **dispatch backbone for a sub network**.
That premise no longer holds: no network, no dispatch, and it is not being used at all today.

> ⚠️ **This is a deliberate reversal of a locked decision, on changed facts — not a drift.**
> Recommendation: **pause, don't cancel** (keeps data + the promo rate). Revisit if the crew ever
> exceeds ~5 people. The pipeline app becomes the job record in the meantime.

### 1.3 The 3-week problem is a *communication* problem
Losing a customer because they don't know when you can start is worse than a long lead time.
The pipeline must show the **real lead time up front** and carry a **"waiting / waitlisted"**
state, so nobody silently goes cold.

---

## 2. The core design: a questionnaire pipeline

The insight behind Allan's "mini questionnaire" idea: **at any moment, each customer has exactly
one open question with 2–3 possible answers.** The app asks that question. You tap the answer.
The answer both records what happened and sets the next question.

That is what removes the mess: neither partner ever has to work out what to do next, and both can
see who did what.

### 2.1 The stages

| # | Stage | The one question | Answers |
|---|---|---|---|
| 1 | **New** | Have we contacted them? | Called ✓ · Texted ✓ · No answer → follow-up |
| 2 | **Contacted** | Enough info to quote? | Yes · Need more photos · Need a site visit |
| 3 | **Scope OK** | What's our cost? | Marko doing it · Sub + $cost · **Waiting on sub** |
| 4 | **Priced** | Quote sent? | Sent ✓ (stamps date) |
| 5 | **Quote sent** | Response? | Accepted · Declined · No response → follow-up 1/2/3 |
| 6 | **Accepted** | Deposit paid? | Paid ✓ · Waiting |
| 7 | **Deposit paid** | Booked? | Date + who · Waiting on availability |
| 8 | **Booked** | Job done? | Done ✓ · Rescheduled |
| 9 | **Done** | Final invoice sent? | Sent ✓ |
| 10 | **Invoiced** | Paid in full? | Paid ✓ · Chase |
| 11 | **Paid** | Wrap-up | Warranty sent ✓ · Review asked ✓ |
| 12 | **Closed** | — | (won / lost, with reason) |

**Hard rules baked in (not optional):**
- Stage 7 **cannot** be reached without stage 6 — no booking before a deposit.
- Stage 3 shows the **margin** live: quote − cost. Under $300 profit → the app warns before quoting.
- Every action stamps **who + when**, so two people never duplicate or wonder.

### 2.2 Lead sources (the list view)
One list, newest first, each row showing **source · name · suburb · age · stage · next action**:

- 📝 **Quote form completed** (GHL opportunity — what Quote Inbox already reads)
- ⚠️ **Quote form abandoned** (GHL already captures partials via W2 — currently unused as a list)
- 📞 **Missed call** (needs GHL missed-call text-back ON)
- 💬 **Message** (SMS/email inbound via GHL conversations)

**Ageing is the alarm:** any row with no action in 48h turns amber, 5 days red. That is what stops
an 18-day-old lead going quiet.

---

## 3. Calls — what it costs and what to turn on

Researched 2026-07-31.

### 3.1 Missed-call text-back — DO THIS TODAY, it's free
Included on all GHL plans, off by default. **Settings → Business Profile → Missed Call Text Back →
toggle on → write the message → save.** ~5 minutes, no workflow needed. Replies in ~15 seconds.
You only pay the SMS (~$0.008/segment).

> Suggested text: *"Sorry we missed you, this is Timeless Resurfacing. We'll call you back shortly.
> If it's easier, reply here with a photo of the bathroom and we can get you a price."*

### 3.2 Call forwarding — cheap
| Item | USD |
|---|---|
| AU local number | $3.00 / month |
| Inbound to the number | $0.0100 / min |
| Outbound leg to an AU **mobile** | $0.0750 / min |
| Outbound leg to an AU **landline** | $0.0252 / min |

Forwarding = **both legs**: inbound + outbound ≈ **$0.085/min USD ≈ 13c AUD/min**.

**Estimate:** 50 calls/month × 4 min ≈ 200 min ≈ **$17 USD ≈ $26 AUD/month.** Immaterial.

### 3.3 What this buys
Every missed call becomes a lead row with an automatic text already sent. Right now a missed call
is simply a lost customer, and there is no record it ever happened.

---

## 4. Architecture

```
  GHL  ──(API)──►  Pipeline app  ──►  both phones
   │                    │
   │                    ├── stages + actions      → Supabase (already paid)
   │                    ├── hosted on Netlify     (already paid)
   └── forms, SMS,      └── quote app link-out    (existing)
       calls, contacts
```

**GHL stays the source of contacts and messaging. The app owns stage + next action.** No third
system, no duplicate data entry.

**Mobile-first**, since most use is on a phone between jobs: single column, big tap targets, the
current question as a sticky card at the bottom.

---

## 5. Build plan (phased, each phase useful on its own)

| Phase | What | Effort |
|---|---|---|
| **0** | Missed-call text-back ON. Sub rate card agreed with both good subs. *(No code. Highest value.)* | 1 hr, Allan |
| **1** | Quote Inbox → stage model + guided questions + activity log. Still local. | ~1 day |
| **2** | Host it: Supabase + Netlify + sign-in, so Marko sees the same board on his phone. | ~1 day |
| **3** | Multi-source ingest: abandoned forms, missed calls, inbound messages. | ~1 day |
| **4** | Reporting: this-week board, ageing alarms, win rate, margin per job. | ~half day |
| **5** | Stack cull: pause SM8, audit Make scenarios, retire the contractor dispatch app. | 2 hrs |

**Phase 0 matters more than all the code.** Without a rate card, every job still stalls at stage 3.

---

## 6. Risks and considerations

| Risk | Note |
|---|---|
| **Building instead of selling** | The audit already flagged the estate is ahead of the business. This app must stay small: 12 stages, one question each. Resist feature creep. |
| **Reversing the SM8 decision** | Documented above as a premise change, not drift. Pause, don't cancel. |
| **Two sources of truth** | GHL owns contact + messaging; app owns stage. Never both. |
| **The app becomes another thing to update** | Mitigated only if it is genuinely faster than the current method. If it isn't, it has failed. |
| **Sub availability** | The app should record each sub's next free date so quoting can promise a real lead time. |

---

## 7. Conclusion

The mess is not caused by missing software. It is caused by **two people with no shared answer to
"what happens next with this customer"**, plus a quoting step that always waits on a phone call to
a subcontractor.

Fix the wait (rate card), turn on the free thing you already pay for (missed-call text-back), then
build one small hosted board where every customer has exactly one open question. That is the whole
plan.


---

## 8. LOCKED design (Allan, 2026-07-31)

**The principle:** a *filter questionnaire pipeline* whose only goal is that **every lead reaches a
door.** There are two doors and both count as finished:

| 🟢 Won | 🔴 Closed |
|---|---|
| done · paid · reviewed | not interested · too expensive · went elsewhere · not our work · no answer after 3 tries |

A clean **"no" is a success.** It closes the loop, frees attention, and records *why* (which is the
most valuable field in the app). The failure state is neither: a lead sitting in limbo. That is
exactly what is broken today (Lisa 40 days, mick 35, Maria 18 — none won, none lost, just nowhere).

**The health metric is therefore NOT conversion rate.** It is *how many leads are unresolved and
how old is the oldest*. The home screen shows "6 need you today", not a dashboard.

### 8.1 Triage comes before the pipeline
Not every enquiry is a job. Forcing name/address on someone asking "do you do laundry tubs?" is
pushy and loses them.

```
everything inbound → INBOX → triage
                              ├── 🔧 a job       → enters the pipeline
                              ├── ❓ a question   → answer, close (KEEP, don't delete)
                              └── 🚫 not for us  → refer out, close
```
Questions are kept because (a) they may convert later — one tap promotes to a job, and (b) repeated
questions reveal missing service pages (SEO).

### 8.2 Progressive fields — only ask for what the NEXT step needs
| To do this | Needs |
|---|---|
| Reply | phone **or** email |
| Quote | what they want · photos · suburb |
| Book | address · access |
| Invoice | name · email |

**Name is optional throughout; phone or email is the key.** Many leads start as just a number.
Property age and owner/tenant are NOT manual checklist items — the quote form already captures them.

### 8.3 Contacts for non-form leads
GHL already auto-creates a contact from any inbound call or SMS. From there either **text them the
quote form link** (cheapest — they fill in the whole profile and add photos themselves, the Surface
Care move) or type details inline as you talk.

### 8.4 Source is tracked on every lead
quote form complete · quote form abandoned · missed call · answered call · inbound SMS · inbound
email · referral (+ who) · GBP/social · property manager. After ~30 leads this shows which channel
actually pays, and whether signage/ads are worth funding.

### 8.5 Notes
- **Quick note** — timestamped, stamped with who wrote it.
- **📌 Pinned fact** — permanently true about the property/customer, always visible:
  *"base cracked, cannot resurface"* · *"rear lane parking"*. Tagged by type so it becomes data.
- A note that changes scope pushes the job **back to stage 3 (costing)** automatically.

---

## 9. Attempt caps (added 2026-08-04)

Allan: *"do we have a limit for this section — how many calls is too much, or if no response on text?"*
We didn't. Every "try again" answer looped forever with no counter, so nothing ever forced a decision.

**The evidence.** Velocify, across 3.5M leads: **93% of leads that convert are reached by the 6th
call**, and a lead needing more than 7 calls is **45% less likely to convert**. But the average team
quits after **1.3 attempts** — so the cap exists as much to stop us giving up early as to stop us
pestering. Quote follow-ups on day 1 / 3 / 7 capture ~93% of all replies.

| Step | Cap | Wait between goes | Recorded if we stop |
|---|---|---|---|
| 1 · New — make contact | **6** | 0, 1, 2, 4, 6, 8 days | No answer after 6 tries |
| 2 · Qualified — chase photos | 3 | 1, 3, 5 | Never sent the photos |
| 3 · Costing — chase a sub | 3 | 1, 2, 4 | Could not get a price |
| 5 · Follow-up — chase the quote | **3** | 1, 3, 7 | No response to the quote ♻︎ |
| 6 · Accepted — chase deposit | 3 | 2, 4, 7 | Deposit never paid |
| 7 · Booking — chase a date | 4 | 3, 7, 14, 21 | Never found a date ♻︎ |
| 10 · Payment — chase money | 4 | 3, 7, 14, 21 | Never paid |

Stage 8 (job day) and 11 (wrap up) are uncapped — one is a same-day status, the other is admin.

**How it behaves.** The card shows *"2 of 6 tries used · next one due in 2 days"*. Each retry answer
is labelled with which go it is. At the cap the counter turns red, a channel-switch hint appears
(*"Two calls unanswered? Send a text instead"*), a one-tap **Stop here** button records the reason,
and the assistant promotes the lead to top priority telling you to stop rather than keep dialling.

♻︎ = marked **revivable**. 15–25% of non-converters convert on a later reactivation, so a "too
expensive", "went elsewhere", "changed their mind" or a quote that just went quiet is flagged for a
future revisit. A wrong number is not.
