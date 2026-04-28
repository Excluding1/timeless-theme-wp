# AI Blog Automation — Future Build Idea

**Status:** Deferred. Revisit when sales velocity is established.
**Saved:** 2026-04-28

---

## The original idea

Build a full-stack AI workflow that:
- Scrapes competitor articles + research material
- Generates blog posts in our brand voice
- Audits + edits the output
- Sources/generates images
- Auto-publishes to WordPress
- Runs the whole thing without human input

End goal: scale blog content without manual writing time.

---

## Why we DON'T build this now (expert verdict)

### 1. Google penalty risk is real

**March 2024 "Helpful Content Update"** specifically targeted AI-generated SEO spam. Sites running automated AI blog farms lost 60-90% of organic traffic overnight. Google's algorithm now actively detects:

- Common AI sentence patterns ("In conclusion...", "It's important to note...")
- Lack of personal experience markers
- Hallucinated facts
- Generic stock-style structure
- Image inconsistency (AI-generated vs actual photography)

For a service business (trades), the penalty is amplified because Google weights E-E-A-T (Experience, Expertise, Authoritativeness, Trust) heavily on YMYL-adjacent content.

### 2. Trades businesses need real expertise signals

Customers searching "bath resurfacing" or "how long does resurfacing last" want to read someone who has actually done the work. AI content reads as generic and erodes brand trust by association — even your service pages lose authority if the blog feels fake.

### 3. Image generation has bigger problems than text

AI-generated bathroom photos have detectable artifacts:
- Surreal faucet placements
- Impossible angles
- Generic "stock-style" rendering
- Inconsistent style across posts

Customers want to see YOUR work (real before/after photos from real jobs), not AI fakes. The competitive advantage of trades businesses is "we've done this exact job before" — AI photos undermine that.

### 4. Successful competitor blogs are human-written

Surface Care (Jordan Schofield) blog — looks like volume could be AI, but the depth of insider knowledge in each post (specific brand names, real cost figures, technique nuances) gives away that humans with real industry experience wrote them. They built authority over 5+ years of consistent quality output, not by automation.

---

## What we DO build instead (when ready)

### AI-Assisted Workflow (NOT autopublish)

```
1. AI suggests topic (keyword research + competitor gaps + Sydney-specific)
   ↓
2. AI does research (web scraping, competitor analysis, FAQ harvesting)
   ↓
3. AI generates outline (H2/H3 structure + target keywords)
   ↓
4. AI writes first draft (1500 words, in brand voice)
   ↓
5. ★ HUMAN edits (15-20 min) ★
     - Add real insights from actual jobs
     - Verify warranty terms, prices, processes
     - Add specific local examples
     - Mark photo placeholders
   ↓
6. AI polishes (grammar, flow, SEO meta)
   ↓
7. ★ HUMAN adds real before/after photos from actual jobs ★
   ↓
8. AI generates meta description, social snippets, FAQ schema
   ↓
9. ★ HUMAN reviews + clicks publish ★
```

**Result:** 70% AI heavy lifting + 30% real expertise = passes Google's
"helpful content" filter, ranks well, builds genuine brand trust.

**Time per post:** ~30-45 minutes (vs. 4-6 hrs fully manual, vs. 0 min
fully AI but ranks nowhere).

**Output:** 4-8 quality posts/month sustainably.

---

## Components to build when ready

| Component | Effort | What it does |
|---|---|---|
| **Topic generator prompt** | 2 hr | Custom Claude/GPT prompt outputs 10 weekly topic ideas based on services + Sydney searches + competitor gaps. Run weekly, pick what resonates. |
| **Article draft generator prompt** | 3 hr | Custom prompt takes topic + outline → outputs draft in our brand voice. References actual service pages for tone. |
| **Brand-voice style guide** | 2 hr | Markdown file documenting tone, vocabulary, sentence patterns, banned phrases. Fed into every prompt. |
| **WordPress draft import script** | 4 hr | Node/Python script: takes markdown draft, converts to Gutenberg blocks, creates DRAFT post in WP via REST API (NOT publish — human reviews first). |
| **Image checklist for jobs** | 30 min | Document what photos to take at every job (before, after, mid-process, problem area, finished detail). Build photo library over time. |
| **Editor's pre-publish checklist** | 30 min | What to verify in every AI draft before publish (facts, brand voice, photos, schema, CTAs). |

**Total build effort:** ~12 hours.

---

## When to revisit (criteria)

Build the AI-assisted workflow when 2+ of these are true:

1. **Sales velocity is established** — getting 10+ qualified leads per month from existing channels (so blog is scaling existing demand, not creating it from zero)
2. **You've manually published 3-5 blog posts** — proven you can do it, established your brand voice, have a content production pattern
3. **You have a backlog of content ideas** — too many to write manually
4. **Photo library has 50+ real before/after pairs** — visual content for AI drafts to reference
5. **Search Console shows blog topics getting organic impressions** — proving the channel works for your niche

If <2 of these are true, the AI workflow is premature. Focus elsewhere.

---

## Tools we'd use (when built)

### LLM APIs
- **Claude Opus 4.x** (Anthropic) — best for long-form writing in brand voice
- **GPT-4** fallback / variation
- **Cost:** ~$0.50-2 per draft article

### Research / scraping
- **Apify** or **ScraperAPI** — competitor article research
- **Ahrefs API** or **DataForSEO** — keyword research
- **Cost:** $50-100/month (depends on volume)

### Workflow orchestration
- **n8n** (self-hosted, free) — chains the AI calls
- **Make.com** or **Zapier** (paid SaaS) — easier setup
- **Cost:** $0-30/month

### Image (when we revisit)
- **Real photos from jobs** (free, best for trust)
- **Pexels / Unsplash** API for stock fillers (free)
- ~~AI generation~~ — skip for trades content

### WordPress integration
- **WP REST API** (built-in, free)
- Custom plugin or external script

**Total monthly cost** (if built): $50-150/month + 12 hours build.

---

## What we're focusing on instead (right now)

Sales first. Specific priorities:

1. **Convert the visitors we already have**
   - Verify GA4 + Clarity firing → see actual user behavior
   - End-of-article CTA + sidebar CTA box (already shipped) drives quote requests
   - Watch Clarity recordings for drop-off points → fix them

2. **Get more reviews**
   - 3 → 30 reviews is the single biggest local pack ranking lever
   - Post-job review request system (potential next build)

3. **Capture the leads we get**
   - Quote form submission tracking (GA4 events)
   - Email/SMS follow-up automation
   - Conversion rate optimization based on real data

4. **Operational consistency**
   - Take real photos at every job (builds the image library for future blog)
   - Note customer questions that come up repeatedly (becomes blog topic ideas later)

The blog is a long-term play (4-8 weeks for posts to start ranking). Sales velocity is immediate-term. Right priorities.

---

## Reference notes

- Original conversation: 2026-04-28 session
- Related files: `single-article.php`, `archive-article.php`, `archive.php`, `functions.php` (1f section)
- Related shortcodes (already built, ready to use in AI drafts): `[before_after]`, `[icon_callout]`, `[process_step]`, `[stat_grid]`
- The content production system (CPT, templates, shortcodes, sidebar CTAs, end-of-article CTAs) is already in place. AI workflow plugs INTO this — doesn't replace it.

When ready to build, this MD has everything needed. Until then: **focus on sales**.
