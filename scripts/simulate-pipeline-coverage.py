#!/usr/bin/env python3
"""1,000-scenario Monte-Carlo coverage simulation — Timeless Resurfacing full stack.
Walks each simulated customer through every lifecycle touchpoint and classifies coverage:
  LIVE    = built + proven automation handles it
  MANUAL  = a written SOP/template handles it by hand today (operable)
  PLANNED = handled manually today, automated by a named pipeline step (cockpit/data/pipeline.json)
  GAP     = nothing handles it (a real hole)
Deterministic: seed 20260612. Usage: python3 scripts/simulate-pipeline-coverage.py [N]
Outputs: stdout summary + docs/specs/sim-results-2026-06-12.json
"""
import json, random, sys, collections

N = int(sys.argv[1]) if len(sys.argv) > 1 else 1000
rng = random.Random(20260612)

def pick(table):
    r = rng.random(); acc = 0
    for k, w in table:
        acc += w
        if r <= acc: return k
    return table[-1][0]

# ---------------- AXES (weights from the 64-family matrix + Sydney trade reality) ----------------
LEAD = [("form_complete",.46),("form_partial",.13),("phone_call",.13),("sms_photos",.07),
        ("agency_pm",.07),("referral_warm",.08),("spam_bot",.03),("invalid_phone",.03)]
PERSONA = [("owner_occupier",.46),("property_manager",.22),("landlord_self",.15),
           ("builder",.08),("tenant_authorised",.05),("strata_rep",.04)]
PROP_AGE = [("pre_1990",.22),("1990_2000",.35),("2000_2010",.25),("2010_plus",.18)]
CONSENT = [("yes",.70),("no",.20),("not_asked",.10)]
SERVICE = [("shower_regrout",.27),("bath_resurface",.18),("basin",.10),("silicone",.12),
           ("tile_resurface",.08),("chip_repair",.08),("full_bathroom",.09),("combo",.08)]
PROPERTY = [("house",.52),("apartment_strata",.22),("rental_tenanted",.14),("pre1990",.07),
            ("commercial",.03),("outside_area",.02)]
BATHROOMS = [(1,.80),(2,.15),(3,.05)]
PHOTOS = [("clear",.74),("blurry",.16),("missing_angle",.10)]
QUOTE_PATH = [("photo_priced",.78),("site_inspection",.10),("below_floor_reject",.05),
              ("rejection_criteria",.04),("negotiation",.03)]
OUTCOME = [("accept_fast",.30),("accept_after_cadence",.22),("no_reply_expire",.28),
           ("winback_return",.07),("decline",.13)]
DEPOSIT = [("pays",.74),("delays",.12),("cancels_pre_deposit",.10),("cancels_post_deposit",.04)]
SCHED = [("smooth",.74),("reschedule",.14),("customer_no_show",.06),("access_issue",.06)]
EXECUTOR = [("marko",.55),("external_sub",.45)]   # blend: today's world (Marko) + post-gate world (subs)
SUB_EVENT = [("accepts",.70),("declines_all",.08),("handback",.08),("no_show",.05),("runs_long",.07),("misconduct",.02)]
JOB_EVENT = [("clean",.70),("extra_scope",.12),("damage",.04),("unhappy_midjob",.06),("asbestos_found",.08)]
PAYMENT = [("immediate",.55),("late_7d",.16),("late_14d",.08),("late_30d",.05),("partial",.06),
           ("fail_retry",.05),("refund_request",.03),("chargeback",.02)]
POST = [("quiet",.36),("nps_promoter_review",.30),("nps_detractor",.10),("warranty_claim",.07),
        ("repeat_customer",.09),("referral_given",.06),("review_complaint",.02)]
FAILURE = [("none",.83),("w1_webhook_down",.02),("cloudinary_fail",.02),("make_error",.02),
           ("sm8_down",.02),("ghl_outage",.01),("twilio_undelivered",.02),("sheet_fail",.01),
           ("double_fire",.01),("cache_stale",.01),("supabase_down",.01),("email_bounce_dkim",.02)]

# ---------------- COVERAGE MAP: touchpoint -> (class, pipeline step that automates/hardens it) ----------------
LIVE, MAN, PLAN, GAP = "LIVE", "MANUAL", "PLANNED", "GAP"
C = {
 "intake.form_complete":(LIVE,None), "intake.form_partial":(LIVE,None),
 "intake.phone_call":(MAN,"1.9"), "intake.sms_photos":(MAN,"1.13"), "intake.agency_pm":(MAN,"1.13"),
 "intake.referral_warm":(MAN,None), "intake.spam_bot":(MAN,"3.2"), "intake.invalid_phone":(MAN,"3.2"),
 "intake.duplicate":(MAN,"3.4"), "lead.out_of_area":(MAN,"1.13"),
 "lead.ack":(LIVE,None), "lead.photo_resend":(MAN,"1.13"), "lead.qna_stage02":(MAN,"1.11"),
 "quote.priced":(MAN,"6.11"), "quote.site_inspection":(MAN,"1.11"), "quote.below_floor":(MAN,None),
 "quote.rejection":(MAN,"1.13"), "quote.negotiation":(MAN,"1.13"), "quote.multi_bathroom":(MAN,"3.3"),
 "quote.sent_sms":(MAN,"4.2"), "quote.cadence":(PLAN,"1.1"), "quote.expiry_winback":(PLAN,"1.2"),
 "accept.terms_trail":(MAN,"3.5"), "money.deposit_link":(MAN,"5.3"),
 "money.deposit_chase":(MAN,"5.2"), "pipeline.stage11_dispatch":(LIVE,None),
 "book.confirm":(MAN,"1.3"), "book.day_before":(MAN,"1.4"), "book.reschedule":(MAN,None),
 "book.no_show_sop":(MAN,"1.13"), "book.access_issue":(MAN,"1.12"),
 "dispatch.marko":(MAN,"6.1"), "dispatch.sub_offer":(LIVE,None), "dispatch.sub_decline_all":(MAN,"6.6"),
 "dispatch.sub_handback":(LIVE,None), "dispatch.sub_no_show":(MAN,"8.2"), "dispatch.runs_long":(LIVE,None),
 "job.extra_scope":(MAN,None), "job.damage":(MAN,None), "job.unhappy_midjob":(MAN,None),
 "job.asbestos_found":(MAN,"1.12"), "job.complete_backsync":(LIVE,None),
 "post.cure_sms":(MAN,"1.5"), "money.invoice":(MAN,"2.1"), "money.payment_ok":(MAN,"2.2"),
 "money.late_chase":(MAN,"5.2"), "money.partial":(MAN,"5.1"), "money.fail_retry":(MAN,"2.2"),
 "money.refund":(MAN,"5.5"), "money.chargeback":(MAN,"5.5"),
 "post.nps":(MAN,"1.6"), "post.review_ask":(MAN,"1.7"), "post.detractor_callback":(MAN,"1.6"),
 "post.warranty_cert":(PLAN,"1.15"), "post.warranty_claim":(MAN,None),
 "post.repeat_match":(MAN,"2.4"), "post.referral":(MAN,"10.6"), "post.photo_consent":(PLAN,"4.4"),
 "fail.w1_webhook_down":(MAN,"8.2"), "fail.cloudinary_fail":(MAN,"3.2"), "fail.make_error":(MAN,"2.5"),
 "fail.sm8_down":(MAN,"8.2"), "fail.ghl_outage":(MAN,"8.2"), "fail.twilio_undelivered":(MAN,"8.2"),
 "fail.sheet_fail":(MAN,"8.2"), "fail.double_fire":(LIVE,None), "fail.cache_stale":(MAN,"3.6"),
 "fail.supabase_down":(MAN,"8.2"),
 "gate.external_sub_legal":(PLAN,"6.5"),
 "lead.landlord_approval_hold":(MAN,"1.12"),
 "post.review_complaint_crisis":(MAN,None),
 "post.repeat_requote":(MAN,"2.4"),
 "money.deposit_negotiation":(MAN,"1.13"),
 "book.cancel_post_deposit":(MAN,None),
 "job.multiday_day2":(MAN,None),
 "dispatch.sub_misconduct":(MAN,None),
 "fail.email_bounce_dkim":(MAN,"4.1"),
}

def walk(s):
    """Return the ordered touchpoint list this scenario actually hits."""
    t = []
    t.append("intake."+s["lead"])
    if s["lead"] in ("form_complete","form_partial"):
        if rng.random()<.04: t.append("intake.duplicate")
    if s["property"]=="outside_area": t.append("lead.out_of_area"); return t  # politely declined
    t.append("lead.ack")
    if s["photos"]!="clear": t.append("lead.photo_resend")
    if s["property"] in ("apartment_strata","rental_tenanted","commercial") or s["lead"]=="agency_pm":
        t.append("lead.qna_stage02")
    if s["persona"]=="tenant_authorised": t.append("lead.landlord_approval_hold")
    if s["quote_path"]=="below_floor_reject": t.append("quote.below_floor"); return t
    if s["quote_path"]=="rejection_criteria": t.append("quote.rejection"); return t
    if s["quote_path"]=="site_inspection": t.append("quote.site_inspection")
    if s["quote_path"]=="negotiation": t.append("quote.negotiation")
    t.append("quote.priced")
    if s["bathrooms"]>1: t.append("quote.multi_bathroom")
    t.append("quote.sent_sms")
    if s["outcome"] in ("accept_after_cadence","no_reply_expire","winback_return"): t.append("quote.cadence")
    if s["outcome"]=="no_reply_expire": return t
    if s["outcome"]=="winback_return": t.append("quote.expiry_winback")
    if s["outcome"]=="decline": return t
    t.append("accept.terms_trail"); t.append("money.deposit_link")
    if rng.random()<.12: t.append("money.deposit_negotiation")
    if s["deposit"]=="cancels_pre_deposit": return t
    if s["deposit"]=="delays": t.append("money.deposit_chase")
    if s["deposit"]=="cancels_post_deposit": t.append("book.cancel_post_deposit"); t.append("money.refund"); return t
    t.append("pipeline.stage11_dispatch"); t.append("book.confirm"); t.append("book.day_before")
    if s["sched"]=="reschedule": t.append("book.reschedule")
    if s["sched"]=="customer_no_show": t.append("book.no_show_sop")
    if s["sched"]=="access_issue": t.append("book.access_issue")
    if s["executor"]=="marko": t.append("dispatch.marko")
    else:
        t.append("gate.external_sub_legal"); t.append("dispatch.sub_offer")
        if s["sub_event"]=="declines_all": t.append("dispatch.sub_decline_all")
        if s["sub_event"]=="handback": t.append("dispatch.sub_handback")
        if s["sub_event"]=="no_show": t.append("dispatch.sub_no_show")
        if s["sub_event"]=="runs_long": t.append("dispatch.runs_long")
        if s["sub_event"]=="misconduct": t.append("dispatch.sub_misconduct")
    if s["service"] in ("full_bathroom","combo"): t.append("job.multiday_day2")
    if s["property"]=="pre1990" and s["job_event"]=="asbestos_found": t.append("job.asbestos_found")
    elif s["job_event"]!="clean" and s["job_event"]!="asbestos_found": t.append("job."+s["job_event"])
    elif s["job_event"]=="asbestos_found": t.append("job.asbestos_found")
    t.append("job.complete_backsync"); t.append("post.cure_sms"); t.append("money.invoice")
    pay = s["payment"]
    if pay=="immediate": t.append("money.payment_ok")
    elif pay in ("late_7d","late_14d","late_30d"): t.append("money.late_chase"); t.append("money.payment_ok")
    elif pay=="partial": t.append("money.partial"); t.append("money.payment_ok")
    elif pay=="fail_retry": t.append("money.fail_retry"); t.append("money.payment_ok")
    elif pay=="refund_request": t.append("money.refund")
    elif pay=="chargeback": t.append("money.chargeback")
    t.append("post.warranty_cert")
    if s["post"]=="nps_promoter_review": t.append("post.nps"); t.append("post.review_ask"); t.append("post.photo_consent")
    if s["post"]=="nps_detractor": t.append("post.nps"); t.append("post.detractor_callback")
    if s["post"]=="warranty_claim": t.append("post.warranty_claim")
    if s["post"]=="repeat_customer": t.append("post.repeat_match"); t.append("post.repeat_requote")
    if s["post"]=="referral_given": t.append("post.referral")
    if s["post"]=="review_complaint": t.append("post.review_complaint_crisis")
    if s["post"] in ("nps_promoter_review",) and s["consent"]!="not_asked": pass  # consent handled at photo step
    if s["failure"]!="none":
        t.append("fail."+s["failure"])
        if rng.random()<.10:  # simultaneous second failure (Cleo: real outages cluster)
            f2 = pick(FAILURE)
            if f2 not in ("none", s["failure"]): t.append("fail."+f2)
    return t

def gen():
    s = {"lead":pick(LEAD),"persona":pick(PERSONA),"service":pick(SERVICE),"property":pick(PROPERTY),
         "prop_age":pick(PROP_AGE),"bathrooms":pick(BATHROOMS),"photos":pick(PHOTOS),
         "quote_path":pick(QUOTE_PATH),"outcome":pick(OUTCOME),"deposit":pick(DEPOSIT),
         "sched":pick(SCHED),"executor":pick(EXECUTOR),"sub_event":pick(SUB_EVENT),"job_event":pick(JOB_EVENT),
         "payment":pick(PAYMENT),"post":pick(POST),"consent":pick(CONSENT),"failure":pick(FAILURE)}
    # today-vs-scale split (Cleo): half the runs = today's world (legal gate uncleared, Marko-only)
    s["mode"] = "today" if rng.random()<.5 else "scale"
    s["executor"] = (pick([("marko",.97),("external_sub",.03)]) if s["mode"]=="today"
                     else pick([("marko",.20),("external_sub",.80)]))
    # conditional reality couplings (panel rules)
    if s["lead"]=="agency_pm":
        s["persona"]="property_manager"; s["property"]=pick([("rental_tenanted",.7),("apartment_strata",.3)])
        if rng.random()<.5: s["bathrooms"]=pick([(2,.6),(3,.4)])
    if s["persona"]=="tenant_authorised": s["property"]="rental_tenanted"
    if s["persona"]=="strata_rep": s["property"]="apartment_strata"
    if s["prop_age"]=="pre_1990":
        s["property"]="pre1990" if rng.random()<.6 else s["property"]
        if rng.random()<.4: s["job_event"]="asbestos_found"
    if s["property"]=="pre1990" and rng.random()<.5: s["job_event"]="asbestos_found"
    if s["lead"] in ("spam_bot","invalid_phone"): s["outcome"]="decline"
    if s["service"]=="basin" and rng.random()<.3: s["quote_path"]="below_floor_reject"  # the floor-clash zone
    if s["executor"]=="marko": s["sub_event"]="accepts"  # Marko doesn't no-show his own job
    return s

rank = {LIVE:0, MAN:1, PLAN:2, GAP:3}
counts = collections.Counter(); step_demand = collections.Counter(); tp_hits = collections.Counter()
gaps = []; samples = []
for n in range(N):
    s = gen(); path = walk(s)
    worst = LIVE; planned_steps = set()
    for tp in path:
        cls, step = C.get(tp, (GAP, None))
        tp_hits[tp] += 1
        if step: step_demand[step] += 1
        if rank[cls] > rank[worst]: worst = cls
        if tp not in C: gaps.append((n, tp, s))
    if worst==LIVE: counts["fully_automated_today"] += 1
    elif worst==MAN: counts["operable_today_manual_SOP"] += 1
    elif worst==PLAN: counts["operable_manual_automated_by_planned_step"] += 1
    else: counts["UNCOVERED"] += 1
    if n < 8 or (worst==GAP and len(samples)<20): samples.append({"n":n,"worst":worst,"s":s,"path":path})

out = {"runs":N,"classification":dict(counts),
       "uncovered_touchpoints":sorted({t for _,t,_ in gaps}),
       "planned_step_demand":step_demand.most_common(15),
       "touchpoint_hits":tp_hits.most_common(20),"samples":samples}
json.dump(out, open("docs/specs/sim-results-2026-06-12.json","w"), indent=1, default=str)
print(f"RUNS: {N}")
for k,v in counts.most_common(): print(f"  {k}: {v} ({v/N*100:.1f}%)")
print(f"UNCOVERED touchpoints: {sorted({t for _,t,_ in gaps}) or 'NONE — every touchpoint has a home'}")
print("\nTop planned-step demand (which builds unlock the most scenarios):")
for step,c in step_demand.most_common(12): print(f"  step {step}: touched by {c} scenarios ({c/N*100:.0f}%)")
print("\nBusiest touchpoints:"); [print(f"  {t}: {c}") for t,c in tp_hits.most_common(10)]
