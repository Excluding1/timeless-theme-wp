# Who already builds what we're building — teardown + gap list (2026-08-04)

Run after Allan asked: *"is there any companies that run something like this or a company who
sells this, maybe we can take inspiration or fix gaps."*

Doing this **before** more building, per the standing reference-first rule
(`feedback-reference-first-never-scratch-2026-07-11`). I skipped it once already on this app and
that's how we got the "looks too AI" round.

---

## 1. The short answer

**Yes — and the market splits cleanly in two, with our exact idea sitting in the gap between them.**

| | What it does | What it doesn't |
|---|---|---|
| **Job managers** — ServiceM8, Tradify, Jobber, Fergus, Housecall Pro | Quote → schedule → invoice → job costing | Lead follow-up is weak or locked to higher tiers. ServiceM8 is described as *"designed as a job management tool rather than a growth platform."* |
| **Lead/speed-to-lead tools** — LUNA (AU), Podium, Numa, LeadTruffle, GoHighLevel | Missed-call text-back, follow-up sequences, unified inbox | Not job management — no scheduling, costing or POs |

Nobody in the tradie space sells *"one open question per customer, answered by two people, until
every lead reaches a door."* That's the actual whitespace, and it's small — which is why it's a
good internal tool and a bad standalone product (see §5).

---

## 2. The closest match: LeadSimple

Property-management CRM, but conceptually it **is** our app. Their own marketing states the exact
problem Allan described:

- *"Another tool bolted on → another place work hides"*
- Process knowledge **concentrates in individual coordinators** — i.e. it lives in one person's head
- Calls, texts and email on **one timeline** — answered, recorded, assigned

**Their model:** Stages are the visual of where a lead sits. Each stage has a **workflow** — a
series of steps, and each step has a **type**: Todo · Call · SMS · Email · Meet. Steps are
pre-scheduled so *"you can ensure peak performance and consistent results."*

### What to take
1. **Typed steps.** Ours are untyped text. Knowing a step is a *Call* vs an *SMS* means the app can
   offer the right button and later tell us which channel actually converts.
2. **One shared timeline** of every call, text and email against the customer.
3. **Pre-scheduled steps** rather than steps you have to remember to do.
4. Their framing of the problem is better than ours: the risk isn't disorganisation, it's that the
   process only exists inside one person.

### What to reject
Their workflow builder is a configuration product — you build the process. Ours should stay
**hard-coded to our 11 stages**. Configurability is how these tools become a second job.

---

## 3. The pattern has a name — and known failure modes

"One question at a time, system tells you what to do next" is called **guided selling** /
**Next Best Action**. It's standard in enterprise CRM (Salesforce Path). Documented reasons it
fails, all of which apply to us:

| Failure mode | Where we stand |
|---|---|
| Systems that impose actions without room for judgement *"generate resistance and are quickly circumvented"* | ⚠️ Our stage gates are hard rules. The deposit gate is worth keeping; watch the rest. |
| Adoption needs a UX that feels like **an assistant, not an admin portal** | ✅ Already the framing — assistant card, draft messages, one-tap answers |
| Cannot compensate for **incomplete or outdated data** | ⚠️ Real risk — if GHL and the app disagree, the assistant confidently advises the wrong thing |
| Must live **inside the tools reps already use**, or context-switching kills it | 🔴 **Our biggest risk.** See §5. |

Note the irony: LeadSimple's own critique — *"another tool bolted on → another place work hides"* —
is the single strongest argument against our app existing alongside GHL.

---

## 4. The numbers that justify building it at all

| Finding | Source |
|---|---|
| **1 in 3 calls** to Australian trade businesses goes unanswered — ~5 missed calls/week at 15 calls | Sealy AI, via Tradie Card |
| **80% of tradies follow up zero times** after the first no | The Lead Gen Lab |
| **30–50% of leads** don't convert on first contact; structured reactivation converts **15–25%** of those | The Lead Gen Lab |
| Response time slipping 1 min → 30 min drops conversion **~80%** | US Tech Automations |
| Most buyers need **3–5 touches** on a significant purchase | ibid |
| Missed-call text-back tools charge **$99–300/month** | Capterra / Podium |

That last row matters: **we get missed-call text-back free inside GoHighLevel and it is still
switched off.** Competitors charge $99–300/mo for it alone.

---

## 5. Honest gaps in what we built

Ranked by how much evidence backs them.

1. 🔴 **No follow-up cadence.** Stage 5 offers "No response, follow up again" but schedules nothing.
   Against *80% follow up zero times* and *3–5 touches needed*, this is the single biggest miss.
   **Fix:** answering "follow up again" schedules touch 1 / 3 / 7 days and surfaces it on the day.
2. 🔴 **Second-place-to-work risk.** GHL holds contacts and messaging; the app holds stage. Two
   screens is exactly what LeadSimple warns about. **Fix:** the app must become the only screen
   either partner opens for leads — GHL runs underneath as plumbing, not as a second board.
3. 🟠 **No assignment.** Allan's founding complaint was *"handling between two people is messy."*
   We stamp who **did** something; we never say who **should**. LeadSimple assigns each step to a
   person with a due date. **Fix:** owner per job + "yours / Marko's / nobody's" filter.
4. 🟠 **No comms timeline.** No calls, texts or emails against the customer — the one thing every
   competitor treats as the core record.
5. 🟠 **Closed-lost is terminal.** 15–25% of non-converters can be reactivated. A lead closed
   "Too expensive" should be revivable after N months, not buried.
6. 🟡 **No channel data.** We record source but never which channel closed the job.

---

## 6. Should we sell this?

**No.** Three reasons:

1. **LUNA already occupies this exact AU niche** (missed-call text-back + follow-ups + unified
   inbox for tradies, custom pricing) and GoHighLevel agencies resell the same thing at scale.
2. It breaks Allan's own venture rule — *horizontal destination tools only, never another tradie
   vertical* (`feedback-horizontal-destination-tools-2026-07-18`).
3. The whitespace is real but narrow, and defending it means becoming a CRM company.

Build it for us. If it works, it becomes a **selling point for the tradie-website business**
("we set your follow-up system up too"), not a product line.

---

## 7. What this changes, concretely

- **Today, free:** turn missed-call text-back ON in GHL. Competitors charge $99–300/mo for it.
- **Next build round:** follow-up cadence (gap 1) and job owner (gap 3). Both are small.
- **Design rule folded back:** stages stay hard-coded, steps get *types*, and the app must not
  become a second board next to GHL.

Sources: [LeadSimple](https://www.leadsimple.com/) ·
[LeadSimple workflows](https://training.leadsimple.com/en/articles/2883469-creating-basic-sales-workflows) ·
[LUNA AU CRM comparison](https://lunasystems.com.au/blog/best-crm-for-tradies-australia) ·
[Jobber vs Housecall Pro](https://www.getjobber.com/comparison/jobber-vs-housecall-pro/) ·
[Tradie Card — missed calls](https://tradiecard.au/resources/why-am-i-not-getting-leads-as-a-tradie) ·
[The Lead Gen Lab](https://theleadgenlab.com.au/blog/best-lead-generation-strategies-for-tradies/) ·
[US Tech Automations — speed to lead](https://ustechautomations.com/resources/blog/automate-best-missed-call-textback-software-for-plumbing-companies-2026) ·
[Podium pricing](https://www.capterra.com/p/164285/Podium/) ·
[Guided selling / NBA adoption](https://haliro.io/en/resources/blog/next-best-action-ia-guide-commerciaux-quotidien)
