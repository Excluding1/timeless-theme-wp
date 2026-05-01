-- ============================================================================
-- Timeless Resurfacing — Launch Task Seed Data
-- Run in Supabase SQL Editor (bypasses RLS)
-- ============================================================================

-- Week 1 — Legal, brand & money
INSERT INTO tasks (title, description, visibility, status, priority, category, checklist, sort_order) VALUES

('Register partnership ABN', 'Allan & Marko | Go to abr.business.gov.au, apply as a Partnership. Need both partners full legal names, TFNs and a business address. Activity: Building and other installation services. ABN usually instant. Save to dashboard.', 'shared', 'todo', 'urgent', 'Week 1', '[]', 1),

('Register business name', 'Allan | $105 for 3 years at connectonline.asic.gov.au. Register under the partnership ABN. Pick a name that says exactly what you do immediately. Save to dashboard.', 'shared', 'todo', 'urgent', 'Week 1', '[]', 2),

('Register domain (.com.au and .com)', 'Allan | ~$50 total via Namecheap. Get both versions. Save Namecheap login and domain credentials to the dashboard.', 'shared', 'todo', 'high', 'Week 1', '[]', 3),

('Open a business bank account', 'Allan & Marko | Up Business or CBA Business Smart Access. Open online using the partnership ABN and both partners ID. Every business dollar in and out through this account only — never mix personal and business money. Save to dashboard.', 'shared', 'todo', 'urgent', 'Week 1', '[]', 4),

('Get public liability insurance', 'Allan | Must be active before the first job — non-negotiable. Sub insurance covers their physical work but not you as coordination business. Go month-by-month via BizCover. Target $10M public liability. Research BizCover, Upcover and Bsurance. Professional indemnity can follow shortly after. Save policy number and provider login to dashboard.', 'shared', 'todo', 'urgent', 'Week 1', '[]', 5),

('Set up Stripe with booking fee and payment links', 'Allan | Verify partnership ABN, bank details and both partners ID. Takes 1-2 business days. Create two payment links: 10% booking deposit and remaining 90% on completion. Save Stripe login and both link URLs to the dashboard.', 'shared', 'todo', 'high', 'Week 1', '[]', 6),

('Set up Xero', 'Allan | $35/month Ignite plan. Connect the business bank account for live transaction feeds. GST: only register when expecting to exceed $75k/year. Create two invoice templates — customer invoice and contractor payment. Save Xero login to the dashboard.', 'shared', 'todo', 'high', 'Week 1', '[]', 7),

('Set up pay.com.au', 'Allan | Free to join. Connect a rewards credit card (Amex Explorer or Westpac Altitude Business recommended). All subcontractor payments routed through this card to earn points. ~1.5-2% fee per transaction, absorbed by your 50%+ margin. Save login and card reference to the dashboard.', 'shared', 'todo', 'medium', 'Week 1', '[]', 8),

('Design brand assets in Canva', 'Allan | Logo, colours, square and horizontal versions, white variant for dark backgrounds. Write down your one-liner brand promise and never deviate from it. Save Canva login to the dashboard.', 'shared', 'todo', 'high', 'Week 1', '[]', 9),

('Set up Google Workspace email', 'Allan | $8.40/month. Create hello@yourdomain.com.au and personal addresses for both. This also covers Google Ads and Google Business Profile access. Save admin login to the dashboard.', 'shared', 'todo', 'high', 'Week 1', '[]', 10),

('Set up Slack with six channels', 'Allan | Free. Create: #new-jobs, #quotes-in, #job-updates, #subs, #weekly-numbers, #general. Install on both phones. Permanent notifications on #new-jobs and #job-updates. Save to dashboard.', 'shared', 'todo', 'medium', 'Week 1', '[]', 11),

('Purchase subcontractor agreement template', 'Marko | ~$200 via Sprintlaw. Must include: non-solicitation 24 months, confidentiality, ABN/contractor confirmation, $5M minimum insurance requirement, photo upload requirement, asbestos and strata clauses. Use DocuSign. No sub works without this signed, zero exceptions.', 'shared', 'todo', 'high', 'Week 1', '[]', 12),

('Research Pty Ltd formation', 'Allan & Marko | Later. ASIC direct $611 + $329 annual, or Sprintlaw ~$600 guided. Both co-founders equal directors, 50/50 shareholders. Convert when consistent monthly revenue exceeds $5k. Partnership ABN gets replaced by company ABN — update all accounts and dashboard accordingly.', 'shared', 'todo', 'low', 'Week 1', '[]', 13),

-- Week 2 — Business dashboard setup
('Set up business dashboard (Supabase, Cloudinary, Netlify)', 'Allan | Build this first in Week 2 so every credential from every other task flows straight into it. Supabase: create project for job data, sub records and structured business data. Cloudinary: set up for before/after photo storage. Netlify: deploy and host the dashboard. Every other credential from this point gets stored here.', 'shared', 'todo', 'urgent', 'Week 2', '[]', 14),

-- Week 2 — Tech stack, website & automations
('Build pricing plan sheet', 'Allan | Master pricing document covering every service type (shower regrout, bath resurface, shower over bath combo, silicone replacement, full bathroom) with three columns: sub cost, quoted price, and gross margin. Include minimum margin threshold. Store in Google Sheets and link from dashboard.', 'shared', 'todo', 'high', 'Week 2', '[]', 15),

('Build quote form document', 'Allan | Internal document defining exactly what fields exist, conditional logic, warnings, and what complete vs incomplete submission looks like. Used to brief anyone who joins later and to QA the live form. Store in Google Drive and link from dashboard.', 'shared', 'todo', 'high', 'Week 2', '[]', 16),

('Build sub criteria sheet', 'Allan | Single reference document covering everything a subcontractor must meet before getting a job. Columns: criteria, required standard, how verified, pass/fail. Criteria include: ABN verified, $5M PL certificate, min 5 before/after jobs reviewed, suburb coverage, skills, asbestos training, ServiceM8 invite, agreement signed, bank details in pay.com.au, tier assigned. Share with Marko.', 'shared', 'todo', 'high', 'Week 2', '[]', 17),

('Set up GoHighLevel account', 'Allan | $155 AUD/month, 14-day free trial. Set business profile, connect Google Workspace email and Australian mobile for automated SMS, timezone Australia/Sydney, business hours Mon-Sat 8am-6pm. Save login, API key and SMS number to dashboard.', 'shared', 'todo', 'urgent', 'Week 2', '[]', 18),

('Build two-step quote request form in GoHighLevel', 'Allan | Step 1: name, mobile, suburb (captures contact before dropout). Step 2: property type, service needed, size, surface material, photos (optional), scheduling preference. Add conditional warnings for strata, pre-1987 asbestos, natural stone and active leaks.', 'shared', 'todo', 'high', 'Week 2', '[]', 19),

('Build 17-stage pipeline in GoHighLevel', 'Allan | Quote Requested > Q&A/Pre-Check > Sub Availability Checked > Sub Confirmed > Quote Sent > Follow-Up Sent > Quote Accepted > Site Inspection > Pre-Payment > Job in ServiceM8 > Job on Hold > Job Issue > Job Booked > Job Complete > NPS Sent > Final Payment Received > Sub Paid/Closed. Document which co-founder owns each stage.', 'shared', 'todo', 'high', 'Week 2', '[]', 20),

('Set minimum job margin threshold', 'Allan & Marko | Once sub costs per service type are confirmed, set the hard floor below which you never accept a job. Define the number before any jobs come in. Store in pricing plan sheet and reference in pipeline Stage 2.', 'shared', 'todo', 'high', 'Week 2', '[]', 21),

('Build all 12 GoHighLevel automations', 'Allan | 1) Instant quote ack SMS + Slack. 2) Abandoned form recovery at 5hrs. 3) 24hr quote follow-up. 4) 72hr final follow-up. 5) Booking fee trigger on quote accepted. 6) BOOM Slack on Stripe deposit. 7) Job issue alert. 8) Day-before reminder. 9) Cure time warning. 10) NPS routing (9-10 review request, 7-8 improvement ask, 1-6 immediate Slack alert + call within 60min). 11) Referral offer 24hrs after Promoter. 12) Warranty confirmation on final payment.', 'shared', 'todo', 'high', 'Week 2', '[]', 22),

('Add photo-request automation for missing uploads', 'Allan | If Step 2 submitted without photos, fire separate SMS asking for two photos of damage with direct upload link. Keeps form completion high without blocking mobile submits.', 'shared', 'todo', 'medium', 'Week 2', '[]', 23),

('Set up ServiceM8', 'Allan & Marko | $29/month Starter. Both as admins. Build job completion form: before/after photos, grout colour, issues, confirmation tick. Create 5 job templates. Set up sub tier tag system (Tier 1/2/3). Save login and API key to dashboard.', 'shared', 'todo', 'high', 'Week 2', '[]', 24),

('Build website with 6 service landing pages', 'Allan | Hostinger + WordPress Starter. Install Elementor, Yoast SEO, WP Rocket. One page per service: shower regrouting, bath resurfacing, shower over bath, tile regrouting, silicone replacement, full bathroom. Each needs: headline, benefits, 3-step process, pricing from, before/after, 2-year warranty, FAQs, embedded quote form. Save logins to dashboard.', 'shared', 'todo', 'high', 'Week 2', '[]', 25),

('Set up after-hours AI chat widget', 'Allan | Collect name, phone, suburb and service type — never give a price. Creates GoHighLevel contact, posts to Slack with AFTER HOURS flag, moves to pipeline Stage 1. Closing: "All done. You will hear from us first thing tomorrow."', 'shared', 'todo', 'medium', 'Week 2', '[]', 26),

('Create and verify Google Business Profile', 'Allan | Primary category: Tile Contractor. Secondary: Bathroom Remodeler. Hidden home address. Service areas: Greater Sydney, Wollongong, Central Coast. Upload logo and 4 initial stock before/after photos. Save profile URL to dashboard.', 'shared', 'todo', 'high', 'Week 2', '[]', 27),

('Set up Google Business Maps account', 'Allan | Verify business on Google Maps through Business Profile. Set service area (no pin address since no shopfront). Confirm both co-founders have management access. Critical for "near me" searches and local 3-pack. Save Maps login to dashboard.', 'shared', 'todo', 'high', 'Week 2', '[]', 28),

('Set up Google review system', 'Allan & Marko | Create short direct review link from Google Business Profile. Build into NPS automation (9-10 scores get link via SMS). Add to warranty confirmation email. Brief Marko on manual review requests after positive on-site feedback. Track count and average weekly in #weekly-numbers.', 'shared', 'todo', 'high', 'Week 2', '[]', 29),

('Set up Zapier with 3 Zaps', 'Allan | 1) GoHighLevel form > Slack #quotes-in. 2) Stripe payment > GoHighLevel stage update > Slack #new-jobs. 3) GoHighLevel contact created > Google Sheets backup row. Test all three before going live. Save Zapier login and Zap IDs to dashboard.', 'shared', 'todo', 'high', 'Week 2', '[]', 30),

('Build Google Sheets job tracker', 'Allan | Columns: Job ID, Date, Customer, Suburb, Property Type, Strata/Asbestos/Stone flags, Service, Tier, Quote Value, Booking Fee, Job Date, Sub Name, Sub Tier, Sub Payment, pay.com.au fee, Net Profit, Margin %, NPS, Review Left, Referral Source, Cumulative Revenue. Summary metrics. Conditional formatting: profit under $300 red, NPS under 7 orange.', 'shared', 'todo', 'high', 'Week 2', '[]', 31),

('Add referral tracking flow to Sheets and Stripe', 'Allan | Add Referred By field to quote form. When referral confirmed: verify name in tracker, apply $50 Stripe credit at next booking for both referee and referrer. Three-step verification prevents goodwill leaks.', 'shared', 'todo', 'medium', 'Week 2', '[]', 32),

-- Week 3 — Subs
('Recruit subs via Hipages, Airtasker and Facebook groups', 'Marko | Search "bathroom resurfacing Sydney" and "shower regrouting Sydney." Message every active operator. Minimum 3 vetted, signed, test-job-passed subs before a single ad goes live.', 'shared', 'todo', 'urgent', 'Week 3', '[]', 33),

('Run Meta recruitment ad at $7/day', 'Marko | Target NSW, interests: bathroom renovation, tiling, home improvement. Behaviours: self-employed, small business owner. Link to GoHighLevel application form collecting name, phone, ABN, years experience, suburb coverage, services offered and asbestos training status.', 'shared', 'todo', 'high', 'Week 3', '[]', 34),

('Audit competitor businesses for sub leads', 'Marko | Search Google and Hipages continuously for resurfacing and regrouting operators across Sydney. Approach discoverable subs directly. Permanent weekly activity, not one-off.', 'shared', 'todo', 'high', 'Week 3', '[]', 35),

('Contact TAFE NSW for graduate leads', 'Marko | Email Certificate III Surface Preparation and Coating Application coordinators. Ask them to share recruitment post with recent graduates. Low effort, high quality leads.', 'shared', 'todo', 'medium', 'Week 3', '[]', 36),

('Onboard and vet each subcontractor', 'Marko | Before any sub gets a job: verify ABN, check $5M PL certificate, review min 5 before/after jobs, confirm suburb coverage and skills, confirm asbestos training, ServiceM8 invite accepted, agreement signed via DocuSign, bank details in pay.com.au, assign Tier 2. Every sub does one test job first. Pass = live, fail = done.', 'shared', 'todo', 'urgent', 'Week 3', '[]', 37),

('Set up monthly sub tier review process', 'Marko | Review each sub monthly: quality score, acceptance rate, unresolved complaints. Under 4/5 average gets a call before downgrade. Tier 3 subs with no improvement after 2+ months are removed. Never send Tier 3 to complex, large or strata jobs.', 'shared', 'todo', 'high', 'Week 3', '[]', 38),

-- Week 3 — Google Ads
('Calculate ad spend math before launching', 'Allan | Three numbers required: cost per lead, lead-to-customer conversion rate, average profit per job. Cost per lead / conversion rate = cost per customer. Decide customers per day x cost per customer = daily budget. Derive from unit economics — never guess.', 'shared', 'todo', 'high', 'Week 3', '[]', 39),

('Set up Google Ads account and conversion tracking', 'Allan | No conversions tracked = no point running campaigns. Conversion event fires on thank-you page URL after form submission. Set up before any campaign goes live. Save Google Ads login and conversion ID to dashboard.', 'shared', 'todo', 'urgent', 'Week 3', '[]', 40),

('Build Google Ads campaigns — search only', 'Allan | No Performance Max, no AI Max. Search campaigns only. One service per ad group, each to its own landing page. Max 3-4 campaigns total so Google pools conversion data. Start at $5/day and increase incrementally as data builds.', 'shared', 'todo', 'high', 'Week 3', '[]', 41),

('Track POAS not ROAS', 'Allan | POAS = gross profit from ad-driven jobs / ad spend. High revenue does not mean high profit. Set a POAS target and use it to determine max cost per lead. Add formula to Google Sheets tracker.', 'shared', 'todo', 'high', 'Week 3', '[]', 42),

('Consolidate campaigns if fragmented', 'Allan | If 8-9 campaigns, Google sees conversion data individually only. Consolidate to 3-4 max so learnings pool. Jordan flags this as one of the most common and costly Google Ads mistakes.', 'shared', 'todo', 'medium', 'Week 3', '[]', 43),

-- Month 2-3 — Data infrastructure & structure
('Set up Google Cloud data warehouse with BigQuery', 'Allan | Move all CRM data outside GoHighLevel into Google Cloud so you own it regardless of CRM provider. Any GoHighLevel update auto-syncs to BigQuery. ~$50/month max. Lets you query any data and plug into Claude for analysis. Save project ID, dataset name and service account key to dashboard.', 'shared', 'todo', 'medium', 'Admin', '[]', 44),

('Form Pty Ltd company', 'Allan & Marko | Later. Both co-founders equal directors, 50/50 shareholders. Do when consistent monthly revenue exceeds $5k. Partnership ABN replaced by company ABN — update all accounts, Stripe, Xero, insurance and dashboard.', 'shared', 'todo', 'low', 'Admin', '[]', 45),

('Set up virtual office address', 'Allan & Marko | Later. Research Servcorp, Regus, Hub Australia for Sydney CBD street address. ~$60-150/month. Start month-by-month. Do around same time as Pty Ltd formation so you update ABN records, ASIC, Google Business Profile, website footer, Xero, insurance and dashboard all in one sweep.', 'shared', 'todo', 'low', 'Admin', '[]', 46);
