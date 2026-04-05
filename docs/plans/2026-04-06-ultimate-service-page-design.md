# Ultimate Service Page Design

**Date:** 2026-04-06
**Status:** Approved for prototype build
**Branch:** preview (prototype) -> main (WP PHP)

## Design Philosophy

Every section maps to the customer's decision journey:

```
ZONE 1: CAPTURE    -> "This is exactly what I searched for"
ZONE 2: PROVE      -> "These results are incredible"
ZONE 3: EDUCATE    -> "Now I understand why I need this"
ZONE 4: TRUST      -> "These people clearly know what they're doing"
ZONE 5: ANSWER     -> "All my concerns are addressed"
ZONE 6: CONVERT    -> "Getting a quote is easy and risk-free"
```

## Section Order (16 sections)

```
 1. Schema (Service + Breadcrumb + FAQ)
 2. Breadcrumb
 3. Hero (problem-first copy, price, stats, B/A slider, rating badge)
 4. Trust Bar (4 badges)
 5. Before & After Gallery (3 cards with mini testimonials)  <- NEW
 6. Mid-page CTA #1
 7. "Signs You Need This" (4 symptom cards)                  <- REFRAMED
 8. Our Process (5 steps with process images)                <- UPGRADED
 9. Service Comparison (Epoxy vs Cement / Resurface vs Reno)
10. Testimonials (3 service-specific reviews)                <- NEW
11. Why Timeless (3 value props)                             <- MOVED
12. What Affects the Cost (pricing transparency)             <- NEW
13. FAQ (5-8 questions)
14. Service Areas (compact grid)                             <- NEW
15. Quote Form (service-specific + photo prompt)             <- UPGRADED
16. Other Services (3 cross-sell cards)
```

## Key Changes from Current Pages

### New Sections
- **Before/After Gallery** (Zone 2) - 3 transformation cards with suburb + mini testimonial
- **Testimonials** (Zone 4) - 3 service-specific reviews (currently only on homepage)
- **What Affects the Cost** (Zone 5) - Pricing transparency to address #1 objection
- **Service Areas** (Zone 5) - Compact grid for local SEO

### Upgraded Sections
- **Hero** - Static image -> Before/After slider (matches homepage pattern)
- **Hero** - Added Google rating badge below CTAs
- **"Why You Need This"** -> **"Signs You Need This"** - Reframed as symptoms customer recognises
- **Our Process** - Added circular process step images
- **Quote Form** - Added photo upload prompt + micro-copy

### Reordered Sections
- "Why Timeless" value props moved from Zone 3 to Zone 4 (after testimonials)
- This is because social proof is most powerful AFTER customer understands your differentiators

## Navigation Update

### Mega-Menu Restructure
- 3 service category columns remain (Resurfacing | Regrouting & Sealing | Repairs & Packages)
- NEW: Service Areas compact row along the bottom of the mega-menu
- Service Areas shown as inline links: Sydney CBD, Eastern Suburbs, Inner West, etc.
- "View All Services" button moves to bottom-right of areas row

## Image Requirements Per Service Page

| Slot | Filename | Dimensions | Purpose |
|------|----------|------------|---------|
| Hero Before | before-hero.jpg | 3:4 portrait | B/A slider left |
| Hero After | after-hero.jpg | 3:4 portrait | B/A slider right |
| Gallery Before 1-3 | before-1.jpg to before-3.jpg | 16:9 landscape | Gallery cards |
| Gallery After 1-3 | after-1.jpg to after-3.jpg | 16:9 landscape | Gallery cards |
| Process 1-5 | process-1.jpg to process-5.jpg | 1:1 square (120px) | Process thumbnails |

Total: 13 images per service (process images can be shared across similar services)

## Customer Segments Addressed

1. **Expert** (5-10%) - Speed to CTA, differentiators, review count
2. **Semi-informed** (20-30%) - B/A photos, comparison content, FAQ
3. **Problem-aware** (30-40%) - Symptom-matching copy, empathy, solution reveal
4. **Unaware** (20-30%) - Cost shock comparison, time savings, full transformations

## Prototype File

`preview/service-page.html` - Shower Regrouting as reference template
