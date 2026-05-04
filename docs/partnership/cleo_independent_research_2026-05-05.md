# Cleo Independent Research — 2026-05-05 PM

## Per-axis findings

### Axis 1: Trades-specific GHL setups

HighLevel’s own plumbing playbooks are operationally specific: booking links for emergency/non-emergency work, instant quote follow-up, invoice/payment reminders, technician/job assignment alerts, and dashboards by lead source/service type. The recommended stages look closer to `requested -> scheduled -> in progress -> completed -> paid/review` than a pure sales funnel. [1]

Australian tradie-specific CRM/GHL-positioned operators are selling the same pain points: quote follow-up, missed-call text-back, review generation, reactivation, online booking, two-way SMS/email inbox, and pipeline/job tracking. Kabooyaa explicitly frames the loss point as “the tradie who followed up,” with $497 AUD/mo + $497 setup for its trade CRM. [2]

Case-study material for actual trades using GHL is thin and agency-heavy. The strongest public examples I found were plumbing/HVAC/boiler/roofing cases, but most are either GHL playbooks, agency landing pages, or YouTube lead-gen case studies rather than operators publishing their own postmortems. I did not find a credible “year 1 on GHL, what I’d change” from an AU resurfacing/regrouting operator in the timebox.

### Axis 2: Surface Care site + funnel

Surface Care’s public funnel is simple and photo-first. Their regrouting page states: Step 1 upload a picture of the damage; Step 2 they send a personalised quote within 24 hours; Step 3 schedule after quote acceptance; Step 4 technician performs site repair. The CTA says “Request A Quote In Under 60 Seconds.” [3]

The site promises a “fixed-price quote within 24 hours,” “free,” “no hidden fees,” and “no pressure.” Pricing is opaque: no price grid or starting prices visible on the pages I checked. [3]

Form fields were not visible in the crawled HTML beyond an embedded image/form placeholder, so I could not verify exact field count, validation, upload behaviour, or whether the photo upload is mandatory. I did not submit a test quote because the public form was not inspectable through the available fetch, and submitting an invented repair request would risk wasting their staff time.

Warranty language is shallow on the pages found. The benchtop page says they “offer a warranty on all our repair services” and will “make it right,” but I did not find a robust warranty page or Australian Consumer Law savings clause on Surface Care’s public site in the timebox. [4]

Difference vs likely spec assumption: Surface Care is not educating with price anchors. It is using speed, photo upload, fixed-price quote, before/after proof, national availability, and brand trust. The quote form is likely the conversion object, not a pricing calculator.

### Axis 3: AU compliance enforcement / changes

ACMA spam enforcement pattern, 2024-2026: the fines are about missing/invalid consent, non-functional unsubscribe, inadequate sender contact details, and marketing content hidden inside messages that look transactional. Recent examples include Latitude $3.96m in April 2026 for SMS without adequate sender contact/unsubscribe, Lululemon $702,900 in March 2026 for email unsubscribe failures, Tabcorp $4.003m in June 2025 for SMS/WhatsApp sender/unsubscribe/consent issues, Telstra $626k in March 2025, CBA $7.5m in October 2024, Pizza Hut $2.5m in May 2024, Luxottica $1.5m in April 2024, and Outdoor Supacentre $302,500 in January 2024. [5]

Sender ID: Clifford’s understanding appears current. ACMA says businesses using branded sender IDs must register before 1 July 2026, recommends registering before 15 May 2026, and warns late applications may not be approved by 1 July. If not registered, messages may show as “Unverified.” [6]

Privacy Act / NDB: NDB still uses the “likely to result in serious harm” trigger for covered entities. The 2024 privacy reform package strengthened enforcement/investigation powers, introduced new civil penalty tiers, children’s online privacy code work, statutory tort, automated decision privacy-policy requirements, etc. I did not find a changed NDB threshold that makes every small breach notifiable. [7][8]

Photos as personal information: OAIC explicitly lists photographs as possible personal information where an individual is identified or reasonably identifiable. Bathroom photos are not called out specifically, but because quote photos are collected alongside name, address, phone, and email, treat them as personal information in practice, especially if images include family details, reflections, metadata, or address-linked interiors. [9]

NSW building/trades enforcement: building compliance is now primarily framed through Building Commission NSW for Home Building Act matters. Their enforcement options include penalty notices, prosecutions, injunctions, and disciplinary action; focus areas include licensing, statutory warranties, contracts, and defective/incomplete work. I did not find a bathroom-resurfacing-specific NSW Fair Trading enforcement action in the timebox. [10]

### Axis 4: Sydney pricing benchmarks

Public Sydney shower regrouting benchmark: Epoxy Grout Pro lists cement grout regrouting at $450-$700 inc GST, shower floor epoxy regrout from $845 inc GST, full shower reseal/rejuvenation from $1,095 inc GST, and perimeter epoxy seal only at $520 inc GST. This makes a $1,500 standard shower regrout+silicone package in the internal workbook look premium unless it includes a broader scope, stronger warranty, emergency speed, or full wall/floor treatment. [11]

Bathroom Werx Sydney publishes no visible price but strongly sells 7-year written guarantee, same-day free quotes, 24-hour reuse, CSIRO-tested Australian-made enamel, and “fraction of the cost” positioning. [12]

Pour-a-Glaze Sydney publishes no price; it sells a pour-on two-part product, no spray-painting/fumes/overspray, 5-year guarantee, claimed 20-year life expectancy, and contact via local rep Jordan. Their form fields are visible: name, email, phone, state/location, message. [13]

Megasealed Sydney publishes no prices on the page checked; positioning is leaking shower/balcony repair, non-destructive repair, and bathroom renewal. [14]

Spraytech is Melbourne, not Sydney, but useful as an adjacent resurfacing operator: it advertises bathroom/kitchen/benchtop resurfacing, 1-5 day turnaround, 5-7 year workmanship guarantee, photo quote links, and “save thousands vs replacement.” No Sydney price. [15]

For bath resurfacing specifically, the named AU competitors mostly hide price. Generic 2026 bath refinishing guides are US-weighted and much lower ($350-$600 USD typical), so they are weak benchmarks for Sydney skilled onsite work. For Sydney 2026, $1,500 for a bath-only resurface likely lands as premium unless sold as high-durability, high-prep, warranty-backed, non-spray/low-fume, or bundled with surrounding shower/basin work.

### Axis 5: Jordan's broader content

Jordan Hunt appears publicly as Co-Founder at Surface Care, Greater Sydney, with prior sales/marketing/partnerships roles. SignalHire lists Surface Care as founded 2024, 1-10 employees, with Jordan Hunt co-founder from Aug 2024; it also lists James Webster as Managing Director and Jordan Schofield as co-founder. Treat SignalHire as third-party, not authoritative. [16]

LinkedIn shows Jordan with 1K followers/500+ connections and Surface Care experience. Publicly visible activity snippets include interest in AI implementation and Meta ad funnel learnings, but most post content is gated. [17]

A public OnlineJobs.ph snippet, if genuine, says Jordan Hunt was hiring a Sales/Quotations Assistant for Surface Care, calling it “Australia’s #1 Surface Repair Company” and “fastest-growing repair business,” with sales support/customer relationship management responsibilities. This is community/job-board evidence only, not official confirmation. [18]

I did not find additional podcasts, TikTok, or YouTube content from Jordan giving more GHL workflow detail beyond the already-known transcript set.

## What surprised me / what changes the spec

The strongest external pattern is that trades CRMs win on operational follow-up, not elaborate nurture. The spec should probably bias toward fast quote triage, missed-call text-back, photo intake, quote follow-up until decision, booking reminders, job status, post-job review request, and past-customer reactivation. A 15-stage pipeline can still exist internally, but the operator-facing view should stay simple and job-centric.

Surface Care’s public funnel is more opaque than a pricing-led CRO spec might assume. They do not appear to compete by publishing prices. They compete by reducing friction: “photo + few details,” quote in 24 hours, fixed price, no hidden fees. That suggests the GHL quote form should not feel like a long estimator unless it directly improves quote accuracy. Use progressive capture: minimum viable lead first, enrichment after submission or by SMS.

Compliance needs to be engineered, not copy-pasted. ACMA’s recent penalties show that unsubscribe, sender identity, consent source, and marketing-vs-transactional separation need system controls. For July 2026, branded SMS Sender ID registration should be a launch checklist item if the system uses a branded sender. Bathroom photos should be handled as personal information because they are attached to identifiable quote records.

## What I couldn't verify / where research dead-ended

I could not inspect Surface Care’s actual embedded quote form fields or upload behaviour from the crawled page, and I did not submit a fake quote.

I did not find a Surface Care warranty page with ACL-preserving wording. I found only general warranty claims in page FAQ copy.

I did not find credible AU resurfacing/regrouting operators publicly sharing GHL “year one lessons” or detailed postmortems.

I could not fully extract the workbook’s T1/T2/T3 numeric rows in the read-only environment, but I did confirm internal strings around standard shower regrout+silicone examples at $1,500 and bath resurface service definitions/warranty language.

## Sources

1. HighLevel Support, Plumbing daily ops playbook: https://help.gohighlevel.com/support/solutions/articles/155000004973-pipedream-operations-the-ultimate-daily-ops-playbook-for-plumbing-businesses  
2. Kabooyaa AU tradie CRM: https://kabooyaa.com.au/  
3. Surface Care regrouting page: https://surfacescare.com.au/regrouting-repairs/  
4. Surface Care benchtop page: https://surfacescare.com.au/benchtop-resurfacing/  
5. ACMA spam/telemarketing investigations: https://www.acma.gov.au/investigations-spam-and-telemarketing  
6. ACMA SMS Sender ID guidance: https://www.acma.gov.au/sending-text-messages-your-business-or-organisation-name  
7. Attorney-General’s Privacy page: https://www.ag.gov.au/rights-and-protections/privacy  
8. OAIC NDB scheme: https://www.oaic.gov.au/privacy/notifiable-data-breaches/about-the-notifiable-data-breaches-scheme  
9. OAIC personal information guidance: https://www.oaic.gov.au/privacy/your-privacy-rights/your-personal-information/what-is-personal-information  
10. Building Commission NSW compliance/enforcement: https://www.nsw.gov.au/departments-and-agencies/building-commission/about-us/consumer-protection-schemes-and-systems/home-building-compliance-and-enforcement  
11. Epoxy Grout Pro Sydney 2026 regrouting price guide: https://www.epoxygroutpro.com.au/shower-regrouting-cost-sydney-2026/  
12. Bathroom Werx Sydney: https://www.bathroomwerx.com.au/bathroom-resurfacing-sydney.html  
13. Pour-a-Glaze Sydney: https://pouraglaze.com.au/sydney/  
14. Megasealed Sydney: https://www.megasealed.com.au/sydney/  
15. Spraytech Resurfacing: https://spraytechresurfacing.com.au/  
16. SignalHire Surface Care/Jordan Hunt: https://www.signalhire.com/companies/surface-care  
17. Jordan Hunt LinkedIn public profile: https://au.linkedin.com/in/jordan-hunt  
18. OnlineJobs.ph public search snippet for Surface Care role: https://www.onlinejobs.ph/jobseekers/search/c/youtube_ads/870  

— Cleo
