# Blog image generation pack (2026-07-10)

**✅ DONE 2026-07-11 — all 12 generated via ChatGPT (Allan's Plus subscription, no API cost).**
Saved with exact filenames (1672x941, 16:9) in `~/Downloads/blog-images/` and mirrored to
`images/blog/` (gitignored, localhost preview only). All 8 heroes are set as featured images
on the wp-now localhost (:8881/blog/). For LIVE: upload from `~/Downloads/blog-images/` to the
Media Library per the workflow below — the live posts must use Media Library URLs, not theme paths.

**Tool: ChatGPT** (Allan's pick — best realism results). Gemini works too — same
prompts. Higgsfield = video, not stills. Generate at the largest size offered, landscape.


## ⚠️ Real photos beat the AI pack, and Allan can tell (2026-08-23)

Allan looked at an AI pack image in article 5 and said it "looks so fake". He was right, and
the fix he gave is the more useful half: **use the real before/after photos already on the
site.** We have 68 of them across `images/gallery/`, all from actual jobs, and they were
sitting unused while AI renders carried captions like *"what a properly stripped, prepared
and resurfaced finish looks like"* — which reads as our work and is not.

Then he rejected my first real replacement too, for a better reason: I had picked a bath
shedding coating in dramatic sheets. He sent an ordinary worn white bath instead — surface
gone through to grey patches in the middle where people stand, yellowing round the waste —
and said it was **"more aligned with people and more common and relatable"**. That is the
sharper editorial instinct. The dramatic photo shows the extreme case; the ordinary one shows
what the reader will recognise in their own bathroom, which is the whole job of the image.

**The rules that follow:**
1. A real job photo beats an AI illustration every time an equivalent exists.
2. Pick the **typical** case over the **worst** case. The reader has to see their own bathroom.
3. An AI image may never carry a caption implying it is our work. If the caption says "ours",
   the photo has to be.
4. Covers stay illustrated — that is a deliberate, disclosed style choice, and different from
   passing a render off as a photograph of a job.

**Remaining AI images in the body copy, to swap as real equivalents are picked:**
rental-property 2 · mouldy-shower-grout 3 · cracked-bath-basin 3 · paint-tiles 1 · peeling 0.

---
## COVER ILLUSTRATIONS (added 2026-08-22) — the per-article hero

The 12 photographs below stay as they are, for use INSIDE the posts. What sits at the
TOP of each post is now a generated **flat 2D editorial illustration**, one per article.

**Why the change.** Allan: with a shared photographic look, ten posts read as ten
versions of the same page in the archive grid and in social previews, which costs
click-through. The cover is the one image that has to be unmistakably about THIS
article. Clifford's counter-argument, that illustration would read as more
AI-generated rather than less, was tested and was wrong: see `cover-rental-property.jpg`.

**Keep only two constraints across all ten covers.** Everything else varies per
article, on purpose. Over-specified prompts come back technically compliant and
lifeless, so resist adding rules:
  1. **Navy and gold palette** (with soft off-white and muted grey-blue). This is what
     stops ten covers looking like ten different websites.
  2. **No text anywhere.** Text in a hero image is invisible to search, breaks on
     translation, and image models render it badly.

**Prompt shape** — subject, palette, one taste reference. That is all:

> A flat 2D editorial illustration for a blog article header, 16:9. [THE ARTICLE'S
> SPECIFIC SUBJECT, as a scene with a person doing something]. Deep navy and warm gold,
> soft off-white, muted grey-blue. Calm and premium, the way a good fintech blog
> illustrates a story. No text anywhere.

If a cover comes back looking like vector clip art, the one useful nudge is
*"less vector clip art, more editorial illustration"*. Do not add another paragraph of
constraints; that is what produces the lifeless version.

**Naming and size.** `cover-<article-slug-fragment>.jpg`, 1672x941, same as the photos.
ChatGPT returns PNG at roughly 1.5 MB; convert with
`sips -s format jpeg -s formatOptions 88 in.png --out cover-x.jpg` (~300 KB, in line
with the rest of the pack). Upload to the Media Library and set as the post's Featured
Image; the theme uses it for the hero, og:image and the schema image.

**The cover REPLACES the photo hero, it does not stack above it.** Two full-width
images at the top push the first real sentence below the fold. The article's photos
belong in the body.

### Covers generated so far
| File | Post | Notes |
|---|---|---|
| `cover-rental-property.jpg` | bathroom-resurfacing-rental-property | Property manager photographing a worn bath. ChatGPT failed once and succeeded on retry. |
| `cover-mould.jpg` | mouldy-shower-grout-fix | Person with a brush at a mouldy corner, two circular insets. Established the inset device the set now uses. |
| `cover-crack.jpg` | cracked-bath-basin-repair | Person crouched at a bath, fingertip on a crack across the tub floor, two gold-ringed insets showing a chip and a crazed patch. **Replaced 2026-08-22** after a first attempt came back photoreal — a six-panel photographic grid. It was a good image and the wrong one: covers 1 and 2 are flat illustration, and one photoreal cover in the archive grid breaks the set. Naming a person *doing* something in the prompt is what keeps the model in illustration mode; a prompt that is only a list of objects drifts photoreal. |
| `cover-paint-tiles.jpg` | can-you-paint-bathroom-tiles | Person rolling paint onto tile, gold-ringed inset showing the same wall peeling a year later. Article 4's whole argument in one image. Its featured image had been pointing at `failed-tile-paint.jpg`, the same photo used in the body, so the hero and the first figure were the same picture. |
| `cover-peeling-bathtub.jpg` | why-is-my-bathtub-peeling | Person leaning over a bath at a patch where the coating has curled away, gold-ringed inset showing the same bath resurfaced. Took four attempts across the evening — the extension wedged three times before recovering. |

---

## The two rules
1. **AI images are ILLUSTRATIVE only.** They show *a* tired bath or *a* mouldy shower — never
   "our work". Captions in the posts are already written to be truthful either way. **Never**
   put an AI image in a before/after slider or caption it as a Timeless job (trust + Australian
   Consumer Law). The before/after slots stay reserved for REAL job photos (Claremont Meadows).
2. **Consistency = professionalism.** Paste the STYLE BLOCK below at the end of every prompt so
   all images feel like one photographer shot them.

## Style block (append to every prompt)
> Photorealistic photograph, shot on a full-frame camera with a 24mm lens, natural window light,
> soft shadows, realistic reflections, Australian suburban home interior, subtle imperfections,
> no people's faces, no text, no logos, no watermark, 16:9 landscape.

## Workflow (per image, ~1 min each)
1. Paste the prompt + style block into Gemini → generate → pick the most believable one
   (check: taps look Australian, tiles look real, no warped edges or six-fingered hands).
2. Download → rename to the EXACT filename below.
3. WordPress admin → Media → upload.
4. Hero images: open the post → set as Featured Image. Section images: replace the TODO comment
   spot in the post body (Insert → Image), keep the alt text listed below.

---

## HERO IMAGES (set as Featured Image — one per post)

**1. `hero-resurface-or-replace.jpg`** — post: resurface-or-replace-bathtub
Prompt: A worn white enamel bathtub in a 1980s Australian suburban bathroom, visible surface
wear, dull patches and a few small chips near the drain, beige wall tiles, morning light from a
frosted window, honest documentary real-estate photography style.
Alt: Worn enamel bathtub in a Sydney home before restoration work

**2. `hero-how-long-resurfacing-lasts.jpg`** — post: how-long-does-bath-resurfacing-last
Prompt: A freshly restored glossy white bathtub in a clean Australian bathroom, smooth
mirror-like surface reflecting soft window light, water droplets on the rim, chrome mixer tap,
crisp white subway wall tiles.
Alt: Glossy resurfaced bathtub finish in an Australian bathroom

**3. `hero-regrout-or-retile.jpg`** — post: regrout-or-retile-shower
Prompt: Close-up of a shower wall corner in an Australian home where old cement grout lines are
cracked and discoloured between sound white ceramic tiles, shower head blurred in the
background, natural bathroom light.
Alt: Cracked and discoloured grout lines between sound shower tiles

**4. `hero-peeling-bathtub.jpg`** — post: why-is-my-bathtub-peeling
Prompt: Close-up of a bathtub surface where an old DIY coating is peeling and flaking away in
thin white curls revealing the darker original surface underneath, harsh honest lighting,
documentary style.
Alt: Old bathtub coating peeling and flaking from a failed DIY resurface

**5. `hero-chip-repair.jpg`** — post: bathtub-chip-repair
Prompt: Macro photograph of a single coin-sized chip in the enamel of a white bathtub rim,
exposed dark metal visible in the centre of the chip, shallow depth of field, bathroom light.
Alt: Coin-sized enamel chip on a bathtub rim showing exposed metal

**6. `hero-mouldy-grout.jpg`** — post: mouldy-shower-grout-fix
Prompt: A shower corner in an Australian rental bathroom with black mould speckled along the
silicone bead and lower grout lines of white tiles, slightly damp surfaces, realistic and
unglamorous, documentary style.
Alt: Black mould along shower silicone and grout lines

**7. `hero-rental-property.jpg`** — post: bathroom-resurfacing-rental-property
Prompt: A dated but tidy bathroom in an Australian rental apartment, beige 1990s wall tiles,
worn white bathtub, simple vanity, empty and clean as if between tenants, bright neutral
daylight, real-estate photography style.
Alt: Dated bathroom in a rental property between tenants

**8. `hero-leaking-shower.jpg`** — post: leaking-shower-repair-without-removing-tiles
Prompt: Water pooling on the floor beside a shower screen in an Australian bathroom, wet tile
grout lines visible near the shower base, moody realistic lighting suggesting a slow leak,
documentary style.
Alt: Water escaping a shower onto the bathroom floor near the screen

---

## SECTION IMAGES (optional but recommended — one mid-post visual break each)

**9. `spray-application.jpg`** — use in posts 1, 2, 4
Prompt: A professional applicator in white protective coveralls and a respirator spraying a fine
even coat onto a masked-off bathtub, plastic masking sheets taped over surrounding wall tiles,
extraction fan hose visible, workshop-quality lighting, face not visible.
Alt: Professional two-part coating being sprayed onto a masked bathtub

**10. `raking-grout.jpg`** — use in posts 3, 6, 8
Prompt: Close-up of a grout removal tool raking old cracked grout out of the joint between white
wall tiles, fine dust falling, tile edges intact, shallow depth of field.
Alt: Old grout being raked out to proper depth before regrouting

**11. `fresh-silicone.jpg`** — use in posts 6, 8
Prompt: A perfectly smooth new white silicone bead running along the junction of a shower wall
and floor tiles, glossy and freshly tooled, clean bright bathroom.
Alt: Fresh mould-resistant silicone bead in a shower corner

**12. `masking-prep.jpg`** — use in posts 1, 2, 7
Prompt: An Australian bathroom mid-preparation for resurfacing, crisp masking film and tape
around a bathtub, drop sheets on the floor, tools laid out neatly, natural light.
Alt: Bathroom masked and prepared before resurfacing work

---

## What must stay REAL (do not generate)
- The Claremont Meadows before/after pair (posts 1 and 7 TODO slots) — real job records only.
- Anything used in a `[before_after]` slider.
- Google Business Profile photos — GBP is for genuine work photos only.
- Any image captioned as a specific job, suburb, or customer.

When you have the real before/afters, they REPLACE the illustrative heroes on posts 1 and 7 —
real proof always outranks perfect illustration.
