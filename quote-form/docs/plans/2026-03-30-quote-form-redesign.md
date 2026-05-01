# Quote Form v9 Redesign

## Problem
The v8 form has functional issues (no backend, too many photos), design inconsistencies (wrong brand colours, emojis instead of icons, text-on-colour-blocks instead of real images), and a suboptimal flow (contact details collected last, losing abandoned leads).

## Design

### 5-Step Flow

**Step 1 — About You** (lead capture first)
- First name (required)
- Phone (required, validated AU mobile 04XX)
- Email (required)
- Customer type: Homeowner / Property Manager / Builder / Tenant (required)
- Company name (shown only if PM or Builder)
- If Tenant: landlord approval notice + optional landlord email

**Step 2 — Where's the Job?**
- Address/suburb (required, NSW validation)
- Property type: House / Apartment / Commercial
- If Apartment: Lift access yes/no
- If PM: How many bathrooms? (1 / 2-5 / 6+)

**Step 3 — What Needs Fixing?**
- Area selection: Whole bathroom / individual areas / Not sure
- Same area options as v8 (shower, bath, basin, vanity, mould, floor)
- "Not sure" path with textarea

**Step 4 — Tell Us More** (per-area services)
- Service cards per selected area with REAL before/after photos
- Photo on top, description box underneath (not text overlaid on colour)
- Epoxy upsell on grout services
- Basin count question
- Compact card design (less vertical space)

**Step 5 — Photos + Submit**
- Capped at 4-6 photos max:
  - 1 wide bathroom overview (always)
  - 1 close-up per selected area (max 3-4)
  - 1 optional extra
- Urgency selector (No rush / This month / This week)
- Full summary review (contact + address + services + photos)
- Submit button

### Design Changes
- Brand colours: navy #041534 (primary), #1b2a4a (container), #e7c08b (accent/gold)
- Font: Inter (matches website)
- SVG icons replacing all emojis, in brand navy colour
- Service cards: real placeholder images on top, description box below
- Trust bar: "NSW Licensed | $20M Insured | 2-Year Warranty" visible in form header
- Step indicator: "Step 2 of 5" with numbered progress, not just a bar
- Mobile-first responsive design

### Photo Logic (Simplified)
- Always: 1 wide bathroom shot from doorway
- Per area: 1 close-up of worst damage (max 4 areas shown)
- Always: 1 optional extra
- Total: 3-6 photos max (down from 9-16)
- Smart merge: if 3+ areas, the overview replaces individual full-area shots

### Data Submission
- POST to GoHighLevel webhook (to be configured)
- Photos uploaded to cloud storage, URLs sent in webhook payload
- Rate limiting: 3 submissions per IP per hour
- Nonce verification for CSRF protection
