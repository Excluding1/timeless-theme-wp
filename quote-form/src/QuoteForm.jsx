import { useState, useEffect, useRef, useMemo } from "react";
import { resolveQuote } from "./lib/pricing-resolver";

/* ═══════════════════════════════════════════════
   TIMELESS RESURFACING — QUOTE FORM v10
   Locked spec:
     - 5-area picker (shower / bath / basin & vanity / walls / floor)
     - Full bathroom toggle with 3 scope chips (regrout / resurface / both)
     - Multi-bathroom loop (count on step 2, increment + reset on confirmation)
     - Inline per-area photos (1 required + up to 5 extras)
     - No spa flag, size selector, material selector, hollow-tile, urgency
     - Asbestos screen kept on step 2 with property data
     - 1 business day SLA
   ═══════════════════════════════════════════════ */

/* ─── BRAND PALETTE ─── */
const C = {
  pri: "#041534", priC: "#1b2a4a", acc: "#e7c08b", accDk: "#281800",
  sec: "#44495a", brd: "#d5d8db", surf: "#f7f9fb", surfC: "#eceef0",
  surfLow: "#f2f4f6", white: "#ffffff", err: "#ba1a1a", errBg: "#ffdad6",
  warn: "#854F0B", warnBg: "#FFF8E1", green: "#0F6E56", greenBg: "#e1f5ee",
};

/* ─── ICONS ─── */
const I = {
  shower: (s = 26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 4 2.5 2.5"/><path d="M13.5 6.5a4.95 4.95 0 0 0-7 7"/><path d="M15 5 5 15"/><path d="M14 17v.01"/><path d="M10 16v.01"/><path d="M13 13v.01"/><path d="M16 10v.01"/><path d="M11 20v.01"/><path d="M17 14v.01"/><path d="M20 11v.01"/></svg>,
  bath: (s = 26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 4 8 6"/><path d="M17 19v2"/><path d="M2 12h20"/><path d="M7 19v2"/><path d="M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/></svg>,
  vanity: (s = 26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 6v12"/><path d="M2 12h20"/><path d="M7 18v3M17 18v3"/><circle cx="7.5" cy="9" r=".5" fill={C.pri}/><circle cx="16.5" cy="9" r=".5" fill={C.pri}/></svg>,
  wall: (s = 26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M8 3v6M16 3v6M6 9v6M12 9v6M18 9v6M8 15v6M16 15v6"/></svg>,
  floor: (s = 26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
  sparkle: (s = 26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>,
  camera: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.sec} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  check: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  house: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  apt: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2M10 18h4"/></svg>,
  comm: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  basinVanity: (s = 26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="14" rx="1"/><path d="M3 11h18"/><circle cx="12" cy="14" r="1.5"/><path d="M9 18v3M15 18v3"/></svg>,
};

// Image base — set by WP shortcode in production via window.TIMELESS_FORM_BASE.
// In Vite dev (localhost:5174), this is undefined and IMG_BASE is empty so the
// public/ folder serves images from the site root (e.g. /images/areas/shower.jpg).
const IMG_BASE = (typeof window !== "undefined" && window.TIMELESS_FORM_BASE) ? window.TIMELESS_FORM_BASE : "";
const img = (path) => `${IMG_BASE}${path}`;

/* ─── 5 AREAS — customer-language-first labels (Step 3 picture cards) ─── */
const AREAS = [
  { id: "shower",       label: "Shower",         desc: "Grout, silicone, or tile colour",                icon: I.shower,      img: img("/images/areas/shower.jpg") },
  { id: "bath",         label: "Bathtub / spa bath", desc: "Resurface, repair chips or stains",          icon: I.bath,        img: img("/images/areas/bath.jpg") },
  { id: "basin_vanity", label: "Basin / vanity", desc: "Basin, benchtop, or full vanity",                icon: I.basinVanity, img: img("/images/areas/basin-vanity.jpg") },
  { id: "walls",        label: "Tiled walls",    desc: "Splashback, behind vanity, or full-height",      icon: I.wall,        img: img("/images/areas/walls.jpg") },
  { id: "floor",        label: "Floor",          desc: "Grout, tile colour, or fix chips & small cracks", icon: I.floor,       img: img("/images/areas/floor.jpg") },
];

const FULL_BATHROOM_HERO = img("/images/areas/full-bathroom.jpg");

/* ─── PHOTO PROMPTS PER AREA — 3 specifically-named shots that capture what questions would, then "+" extras ─── */
const PHOTO_PROMPTS = {
  shower:       ["Wide shot — stand at the bathroom door, capture the whole shower (and the bath if it sits next to or under the shower)", "Close-up — corner where walls meet (silicone seal)", "Close-up — tile grout lines"],
  bath:         ["Wide shot — whole bath from above, including the rim and surroundings",                                                  "Side angle — the bath rim, side panel, and any jets (if it's a spa)",     "Close-up — interior surface (any chips, stains, scratches or burns)"],
  basin_vanity: ["Wide shot — all basins and the full vanity benchtop in one shot",                                                        "Close-up — basin interior (and any chips on the rim)",                    "Close-up — vanity top edge (so we can see the material — laminate, solid, or moulded)"],
  walls:        ["Wide shot — full wall, stand back so we can see the size",                                                               "Close-up — grout lines and any surface chips or small cracks",                  "Close-up — any white chalky residue, discolouration or unusual marks"],
  floor:        ["Wide shot — stand in the doorway, capture the whole floor (the doorway gives us scale)",                                 "Close-up — grout lines and any surface chips or small cracks",                  "Close-up — any white chalky residue, discolouration or unusual marks"],
  unsure:       ["Wide shot — whole bathroom from the doorway",                                                                            "Close-up — main concern area",                                            "Any other angle that shows what you want done"],
  // full bathroom prompts are dynamic — see getFullBathroomPrompts() below.
};

/**
 * Build full-bathroom photo SECTIONS from the customer's inventory of fixtures.
 * Returns an array of { id, label, icon, prompts } — one section per area type.
 * Step 5 renders each as its own card (divider header + photo grid + counter), mirroring
 * the per-area photo pattern so the page doesn't become a 10-cell flat grid.
 *
 * Photos are stored under per-section keys (e.g. `full-shower-1`, `full-bath-1`, `full-vanity-2`)
 * so multi-fixture bathrooms get clean per-card grids and counts.
 */
function getFullBathroomSections(inv, services = {}, chipRepairOn = false) {
  // Filter out sections the customer marked as "skip" — they don't need quoting OR photos.
  const skip = (areaKey) => services[areaKey] === "skip";
  const sections = [{
    id: "full-overview",
    label: "Bathroom overview",
    icon: I.sparkle,
    prompts: ["Wide shot — from the doorway, capture the whole bathroom"],
  }];
  if (!skip("shower")) {
    for (let i = 0; i < (inv.showers || 0); i++) {
      const tag = inv.showers > 1 ? ` ${i + 1}` : "";
      sections.push({
        id: `full-shower-${i + 1}`,
        label: `Shower${tag}`,
        icon: I.shower,
        prompts: [
          "Wide shot — from outside the shower screen, whole shower visible",
          "Inside — tiles, grout, base, corners (step in for the detail shot)",
        ],
      });
    }
  }
  if (!skip("bath")) {
    for (let i = 0; i < (inv.baths || 0); i++) {
      const tag = inv.baths > 1 ? ` ${i + 1}` : "";
      sections.push({
        id: `full-bath-${i + 1}`,
        label: inv.baths > 1 ? `Bath${tag}` : "Bath / spa bath",
        icon: I.bath,
        prompts: [
          "Interior wide from above — any chips, stains, scratches",
          "Rim and side panel",
        ],
      });
    }
  }
  if (!skip("basin_vanity")) {
    for (let i = 0; i < (inv.vanities || 0); i++) {
      const tag = inv.vanities > 1 ? ` ${i + 1}` : "";
      sections.push({
        id: `full-vanity-${i + 1}`,
        label: inv.vanities > 1 ? `Vanity${tag}` : "Basin / vanity",
        icon: I.basinVanity,
        prompts: [
          "Basin and benchtop",
          "Cabinet doors and drawer fronts",
        ],
      });
    }
  }
  if (!skip("walls") && (inv.tiledWalls || 0) > 0) {
    sections.push({
      id: "full-walls",
      label: inv.tiledWalls > 1 ? `Tiled walls (${inv.tiledWalls === 2 ? "2+" : inv.tiledWalls})` : "Tiled walls",
      icon: I.wall,
      prompts: inv.tiledWalls > 1
        ? ["Wide shot — main tiled wall (splashback or behind vanity)", "Wide shot — second tiled wall", "Close-up — grout lines or any damage"]
        : ["Wide shot — full tiled wall outside shower (splashback or behind vanity)", "Close-up — grout lines or any damage"],
    });
  }
  if (!skip("floor") && (inv.tiledFloor || 0) > 0) {
    sections.push({
      id: "full-floor",
      label: "Tiled floor",
      icon: I.floor,
      prompts: [
        "Wide shot — from the doorway, whole floor",
        "Close-up — grout lines or any surface chips/cracks (no full tile replacement — we're not tilers)",
      ],
    });
  }
  // Chip / scratch / crack damage close-ups — only when the chip-repair upgrade is toggled on.
  // We need photos to colour-match the filler, so this section's photos are required.
  if (chipRepairOn) {
    sections.push({
      id: "full-chip-damage",
      label: "Chip / crack damage close-ups",
      icon: I.camera,
      prompts: [
        "Close-up — first chip, crack or scratch (so we can colour-match)",
      ],
    });
  }
  return sections;
}

/* ─── SERVICE OPTIONS PER AREA (trade name on top, plain English in parens below) ─── */
// Feature flag: hides the "Continue on mobile" CTA + modal until the QR/SMS
// session-transfer backend is real (see modal block + planning notes for the wiring needed).
const ENABLE_MOBILE_HANDOFF = false;

// Compliance audit trail: pin the version of the consent line the customer sees on the submit button.
// If you edit the consent text in the Step 5 submit caption, BUMP THIS VERSION. The webhook payload
// includes this so we can prove which version of the consent text the customer agreed to at submit.
// Inferred-consent path under Spam Act 2003 — the form is a quote REQUEST, not marketing.
const CONSENT_COPY_VERSION = "v1.0-2026-05-05";

// GA4 conversion event helper. Defensive: when window.gtag isn't loaded (e.g. local dev,
// page without GA4 snippet), this no-ops with a console.debug instead of throwing. WordPress
// landing pages load GA4 globally so window.gtag will exist in production.
const fireGA4Event = (eventName, params = {}) => {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") {
    if (typeof console !== "undefined") console.debug(`[GA4 stub] ${eventName}`, params);
    return;
  }
  try { window.gtag("event", eventName, params); } catch { /* swallow */ }
};

const SVCS = {
  shower: {
    question: "What needs doing in your shower?",
    options: [
      { id: "both", tradeName: "Resurfacing + Regrouting", easy: "the works — full regrout AND new tile colour", regrout: true, popular: true, bundle: true,
        befImg: img("/images/services/shower/bundle-before.jpg"), aftImg: img("/images/services/shower/bundle-after.jpg"),
        befTxt: "Tired and dated", aftTxt: "Brand new shower" },
      { id: "resurface", tradeName: "Just tile resurfacing", easy: "change the tile colour — includes spot grout repair, not a full regrout",
        befImg: img("/images/services/shower/resurface-before.jpg"), aftImg: img("/images/services/shower/resurface-after.jpg"),
        befTxt: "Dated tile colour", aftTxt: "Modern white finish" },
      { id: "full_regrout", tradeName: "Just full shower regrouting", easy: "every grout line replaced + new silicone — keeps the same tile colour", regrout: true,
        befImg: img("/images/services/shower/regrout-before.jpg"), aftImg: img("/images/services/shower/regrout-after.jpg"),
        befTxt: "Mouldy grout lines", aftTxt: "Bright white grout" },
    ],
  },
  bath: {
    question: "What needs doing with your bathtub or spa bath?",
    options: [
      { id: "both", tradeName: "Resurface + repair", easy: "resurface AND fix any chips, scratches, burns or stains", popular: true, bundle: true,
        befImg: img("/images/services/bath/bundle-before.jpg"), aftImg: img("/images/services/bath/bundle-after.jpg"),
        befTxt: "Worn and chipped", aftTxt: "Like new" },
      { id: "resurface", tradeName: "Just bath resurfacing", easy: "make it look brand new — works on baths and spas", popular: true,
        befImg: img("/images/services/bath/resurface-before.jpg"), aftImg: img("/images/services/bath/resurface-after.jpg"),
        befTxt: "Yellowed enamel", aftTxt: "Glossy white finish" },
      { id: "chip", tradeName: "Just chip, scratch, burn or stain repair", easy: "fix any damage or marks, colour-matched",
        befImg: img("/images/services/bath/chip-before.jpg"), aftImg: img("/images/services/bath/chip-after.jpg"),
        befTxt: "Visible damage", aftTxt: "Invisible repair" },
    ],
  },
  basin_vanity: {
    question: "What needs doing with your basin or vanity?",
    options: [
      { id: "full", tradeName: "Full vanity resurfacing", easy: "basin, top, doors and drawer fronts all coated", popular: true, bundle: true,
        befImg: img("/images/services/vanity/full-before.jpg"), aftImg: img("/images/services/vanity/full-after.jpg"),
        befTxt: "Dated vanity", aftTxt: "Like new" },
      // "custom" = expandable checklist below the card. SVCS render handles the expander.
      // Has before/after images so the card has visual context even though the chooser opens below.
      { id: "custom", tradeName: "Custom — pick what needs work", easy: "tick(s) the surfaces you want resurfaced (basin / bench / cabinet)",
        befImg: img("/images/services/vanity/custom-before.jpg"), aftImg: img("/images/services/vanity/custom-after.jpg"),
        befTxt: "Mix-and-match", aftTxt: "Pick your scope" },
      { id: "chip_only", tradeName: "Just chip or scratch repair", easy: "fix damage on the basin or top — no resurfacing",
        befImg: img("/images/services/basin/chip-before.jpg"), aftImg: img("/images/services/basin/chip-after.jpg"),
        befTxt: "Chipped surface", aftTxt: "Invisible repair" },
    ],
  },
  walls: {
    question: "What needs doing with your tiled walls?",
    options: [
      { id: "both", tradeName: "Resurfacing + Regrouting", easy: "the works — full regrout AND new tile colour", regrout: true, popular: true, bundle: true,
        befImg: img("/images/services/walls/bundle-before.jpg"), aftImg: img("/images/services/walls/bundle-after.jpg"),
        befTxt: "Tired walls", aftTxt: "Like new walls" },
      { id: "resurface", tradeName: "Just wall tile resurfacing", easy: "change the tile colour",
        befImg: img("/images/services/walls/resurface-before.jpg"), aftImg: img("/images/services/walls/resurface-after.jpg"),
        befTxt: "Dated wall tiles", aftTxt: "Modern colour" },
      { id: "regrout", tradeName: "Just wall regrouting", easy: "refresh the grout lines on tiled walls", regrout: true,
        befImg: img("/images/services/walls/regrout-before.jpg"), aftImg: img("/images/services/walls/regrout-after.jpg"),
        befTxt: "Stained wall grout", aftTxt: "Clean new grout" },
      { id: "chip_repair", tradeName: "Just chip or small-crack repair", easy: "fix surface chips and small cracks — colour-matched (we don't replace whole tiles)",
        befImg: img("/images/services/walls/chip-before.jpg"), aftImg: img("/images/services/walls/chip-after.jpg"),
        befTxt: "Damaged tile", aftTxt: "Repaired and matched" },
    ],
  },
  floor: {
    question: "What needs doing with your bathroom floor?",
    options: [
      { id: "both", tradeName: "Resurfacing + Regrouting", easy: "the works — full regrout AND new tile colour", regrout: true, popular: true, bundle: true,
        befImg: img("/images/services/floor/bundle-before.jpg"), aftImg: img("/images/services/floor/bundle-after.jpg"),
        befTxt: "Tired floor", aftTxt: "Like new floor" },
      { id: "resurface", tradeName: "Just floor tile resurfacing", easy: "change the tile colour with anti-slip coating",
        befImg: img("/images/services/floor/resurface-before.jpg"), aftImg: img("/images/services/floor/resurface-after.jpg"),
        befTxt: "Outdated colour", aftTxt: "Modern colour" },
      { id: "regrout", tradeName: "Just floor regrouting", easy: "refresh the grout lines", regrout: true,
        befImg: img("/images/services/floor/regrout-before.jpg"), aftImg: img("/images/services/floor/regrout-after.jpg"),
        befTxt: "Dark cracked grout", aftTxt: "Clean uniform grout" },
      { id: "chip_repair", tradeName: "Just chip or small-crack repair", easy: "fix surface chips and small cracks — colour-matched (we don't replace whole tiles)",
        befImg: img("/images/services/floor/chip-before.jpg"), aftImg: img("/images/services/floor/chip-after.jpg"),
        befTxt: "Damaged tile", aftTxt: "Repaired and matched" },
    ],
  },
};

/* ─── FULL BATHROOM SCOPE OPTIONS (bundle first, "Just" prefix on individuals; same pattern as shower/bath/walls/floor) ─── */
const FULL_SCOPE_OPTIONS = [
  { id: "both",           tradeName: "Resurfacing + Regrouting", easy: "the works — full regrout AND new tile colour everywhere",                                desc: "Like a brand new bathroom",                                              bundle: true, popular: true },
  { id: "regrout_only",   tradeName: "Just full regrouting",     easy: "every grout line replaced + new silicone — keeps the same tile colour",                  desc: "All grout lines and every silicone joint redone, no colour change" },
  { id: "resurface_only", tradeName: "Just full resurfacing",    easy: "change the colour of everything — includes spot grout repair, not a full regrout",       desc: "Bath, tiles and vanity all coated; grout cleaned up but not replaced" },
];

/**
 * Map a Full-Bathroom scope choice + an area to the default service for that area.
 * "skip" means the area shouldn't be included in this scope (e.g. you can't regrout a bath — it has no grout).
 * Customer can override any default in the inventory dropdowns.
 */
function scopeDefaultForArea(scope, area) {
  const M = {
    both: { shower: "both", bath: "both", basin_vanity: "full", walls: "both", floor: "both" },
    regrout_only: { shower: "full_regrout", bath: "skip", basin_vanity: "skip", walls: "regrout", floor: "regrout" },
    resurface_only: { shower: "resurface", bath: "resurface", basin_vanity: "full", walls: "resurface", floor: "resurface" },
  };
  return M[scope]?.[area] ?? "both";
}

/* ─── NSW ADDRESS VALIDATION ─── */
const NSW_W = ["nsw","sydney","parramatta","wollongong","newcastle","penrith","liverpool","blacktown","bondi","manly","chatswood","bankstown","campbelltown","hornsby","cronulla","surry hills","redfern","strathfield","burwood","ryde","epping","castle hill","kellyville","baulkham hills","westmead","auburn","fairfield","hurstville","kogarah","sutherland","caringbah","marrickville","leichhardt","mosman","dee why","brookvale","mona vale","macquarie park","north sydney","crows nest","gladesville","drummoyne","rhodes","homebush","lidcombe","granville","merrylands","guildford","cabramatta","mount druitt","st marys","emu plains","springwood","katoomba","blue mountains","gosford","central coast","kiama","shellharbour","nowra","camden","narellan","oran park","leppington","casula","ingleburn","miranda","sylvania","engadine","petersham","annandale","rozelle","balmain","pyrmont","glebe","newtown","erskineville","alexandria","mascot","botany","maroubra","coogee","randwick","paddington","woollahra","double bay","rose bay","bronte","darlinghurst","potts point","ultimo","chippendale","camperdown","wagga wagga","tamworth","orange","dubbo","albury","bathurst","armidale","lismore","coffs harbour","port macquarie","maitland","cessnock","queanbeyan","broken hill","griffith","mudgee","young","cowra","goulburn","moss vale","bowral","berry","ulladulla","batemans bay","moruya","taree","forster","tuncurry","singleton","muswellbrook","kurri kurri","raymond terrace","nelson bay","lake macquarie","wyong","the entrance","toukley","woy woy","umina","terrigal","erina","tuggerah"];
const NOT_NSW = ["victoria","queensland","melbourne","brisbane","perth","adelaide","hobart","darwin","canberra","gold coast","geelong"];
function isNSWPostcode(pc) {
  if (pc >= 1000 && pc <= 1999) return true;
  if (pc >= 2000 && pc <= 2599) return true;
  if (pc >= 2619 && pc <= 2899) return true;
  if (pc >= 2921 && pc <= 2999) return true;
  return false;
}
function chkAddr(v) {
  if (v.length < 4) return null;
  const m = v.match(/\b(\d{4})\b/);
  if (m) {
    const pc = parseInt(m[1], 10);
    if (isNSWPostcode(pc)) return true;
    if ((pc >= 200 && pc <= 299) || (pc >= 2600 && pc <= 2618) || (pc >= 2900 && pc <= 2920)) return false;
    if (pc >= 3000 && pc <= 3999) return false;
    if (pc >= 4000 && pc <= 4999) return false;
    if (pc >= 5000 && pc <= 5999) return false;
    if (pc >= 6000 && pc <= 6999) return false;
    if (pc >= 7000 && pc <= 7999) return false;
    if (pc >= 800 && pc <= 999) return false;
  }
  const stateMatch = v.match(/(?:^|[\s,])(NSW|VIC|QLD|SA|WA|TAS|NT|ACT)(?=[\s,]|$|\s+\d)/i);
  if (stateMatch) return stateMatch[1].toUpperCase() === "NSW";
  const l = v.toLowerCase();
  if (NSW_W.some(w => l.includes(w))) return true;
  if (NOT_NSW.some(w => l.includes(w))) return false;
  return null;
}

/* ─── IMAGE COMPRESSION ─── */
async function compressImage(file) {
  if (!file.type.startsWith("image/")) return file;
  if (file.size < 500 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const MAX = 1920;
    let { width, height } = bitmap;
    if (width > MAX || height > MAX) {
      if (width >= height) { height = Math.round(height * (MAX / width)); width = MAX; }
      else { width = Math.round(width * (MAX / height)); height = MAX; }
    }
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    const blob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.8));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg", lastModified: file.lastModified });
  } catch {
    return file;
  }
}

/* ─── UI HELPERS ─── */
function StepBar({ n, total, label }) {
  return (
    <div style={{ padding: "16px 0 14px", borderBottom: `1px solid ${C.brd}`, marginBottom: 22, position: "sticky", top: 0, zIndex: 10, background: C.surf }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.pri, letterSpacing: "-0.01em" }}>Step {n} of {total}</span>
        <span style={{ fontSize: 13, color: C.sec, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ height: 5, background: C.surfC, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", background: C.pri, borderRadius: 3, width: `${Math.round((n / total) * 100)}%`, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}
function Trust() {
  return <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "12px 0 8px", flexWrap: "wrap" }}>{["Sydney Local","$20M Insured","Up to 5yr Warranty"].map((t,i) => <span key={i} style={{ fontSize: 11, fontWeight: 600, color: C.green, display: "flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}><span style={{ width: 14, height: 14, borderRadius: "50%", background: C.greenBg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, flexShrink: 0 }}>✓</span>{t}</span>)}</div>;
}
function Btn({ children, onClick, disabled, secondary }) {
  return <button onClick={onClick} disabled={disabled} style={{ width: "100%", padding: "16px 20px", borderRadius: 12, border: secondary ? `1.5px solid ${C.brd}` : "none", background: disabled ? C.surfC : secondary ? C.white : C.pri, color: disabled ? C.sec : secondary ? C.pri : C.white, fontSize: 16, fontWeight: 600, cursor: disabled ? "default" : "pointer", fontFamily: "inherit", marginTop: 12, transition: "all 0.15s", letterSpacing: "-0.01em" }}>{children}</button>;
}
function Back({ onClick }) { return <button onClick={onClick} style={{ fontSize: 14, color: C.pri, background: "none", border: "none", cursor: "pointer", fontWeight: 500, marginBottom: 12, padding: "4px 0" }}>← Back</button>; }
function OptGrid({ opts, val, set, cols = 3, label }) {
  return <div role="group" aria-label={label || "Selection"} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>{opts.map(o => <button key={o.id} type="button" onClick={() => set(o.id)} aria-pressed={val === o.id} style={{ padding: "12px 6px", borderRadius: 10, textAlign: "center", cursor: "pointer", border: val === o.id ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: val === o.id ? `${C.pri}08` : C.white, transition: "all 0.15s", minHeight: 44 }}><div style={{ marginBottom: 4 }}>{o.icon}</div><div style={{ fontSize: 12, fontWeight: 500, color: val === o.id ? C.pri : C.sec }}>{o.label}</div></button>)}</div>;
}

/* ─── SERVICE CARD (before/after visual when available, else clean text-only card) ─── */
function SvcCard({ s, on, onClick, expanded }) {
  const hasImages = s.befImg && s.aftImg;
  return (
    <div onClick={onClick} style={{ background: C.white, border: s.bundle ? (on ? `2px solid ${C.pri}` : `1.5px solid ${C.acc}80`) : (on ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`), borderRadius: 12, cursor: "pointer", overflow: "hidden", position: "relative", transition: "all 0.15s" }}>
      {/* ALL-IN-ONE top banner: full-width gold strip above the card content. Communicates
          "this card is the services above + below combined" without competing with POPULAR for the corner.
          Customer's eye reads: banner first → BEFORE/AFTER → trade name. */}
      {s.bundle && (
        <div style={{ background: C.acc, color: C.accDk, fontSize: 10, fontWeight: 800, padding: "6px 12px", textAlign: "center", letterSpacing: "0.08em" }}>
          ALL-IN-ONE — BOTH SERVICES COMBINED
        </div>
      )}
      {/* POPULAR badge: top-right corner of the image, doesn't conflict with the all-in-one banner. */}
      {s.popular && (
        <div style={{ position: "absolute", top: s.bundle ? 32 : 8, right: 8, zIndex: 3, background: C.pri, color: C.white, fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, letterSpacing: "0.04em" }}>POPULAR</div>
      )}
      {hasImages && (
        <>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", top: 6, left: 6, fontSize: 9, fontWeight: 700, color: C.white, background: "rgba(186,26,26,.8)", padding: "2px 7px", borderRadius: 4, zIndex: 2 }}>BEFORE</span>
              <img src={s.befImg} alt="" style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} loading="lazy" />
            </div>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", top: 6, left: 6, fontSize: 9, fontWeight: 700, color: C.white, background: "rgba(15,110,86,.8)", padding: "2px 7px", borderRadius: 4, zIndex: 2 }}>AFTER</span>
              <img src={s.aftImg} alt="" style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} loading="lazy" />
            </div>
          </div>
          <div style={{ display: "flex", borderTop: `1px solid ${C.brd}` }}>
            <div style={{ flex: 1, padding: "6px 10px", fontSize: 11, color: C.sec, borderRight: `1px solid ${C.brd}`, fontWeight: 500 }}>{s.befTxt}</div>
            <div style={{ flex: 1, padding: "6px 10px", fontSize: 11, color: C.green, fontWeight: 500 }}>{s.aftTxt}</div>
          </div>
        </>
      )}
      <div style={{ padding: "10px 12px 12px", borderTop: hasImages ? `1px solid ${C.brd}` : "none" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <input type="radio" checked={on} readOnly style={{ width: 18, height: 18, accentColor: C.pri, marginTop: 1, pointerEvents: "none", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.pri }}>{s.tradeName}</div>
            <div style={{ fontSize: 12, color: C.sec, marginTop: 2, lineHeight: 1.4 }}>({s.easy})</div>
          </div>
        </div>
        {/* Expanded content (e.g. Custom basin/vanity checklist) — rendered INSIDE the card so it
            visually belongs to the same selection rather than being a separate panel below. */}
        {on && expanded && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${C.brd}` }} onClick={e => e.stopPropagation()}>
            {expanded}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── THUMBNAIL — renders a File as an <img> using a blob URL, cleaned up on unmount/file change ─── */
function ThumbImage({ file, alt, style }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return <img src={url} alt={alt} style={style} loading="lazy" />;
}

/* ─── PER-AREA PHOTOS — N required slots + tap "+" to spawn an empty extras slot, then tap the slot to upload.
       Filled slots show the actual photo as a thumbnail (not just a check icon). ─── */
function PerAreaPhotos({ areaId, photos, setPhotos, prompts = ["Add a photo"], maxExtras = 3 }) {
  const [busy, setBusy] = useState(false);
  const current = photos[areaId] || [];
  const required = prompts.length;

  // Place a file at any absolute slot index (works for both required slots and pre-allocated extras slots).
  const fillSlotAt = async (file, idx) => {
    setBusy(true);
    try {
      const compressed = await compressImage(file);
      setPhotos(prev => {
        const arr = [...(prev[areaId] || [])];
        while (arr.length <= idx) arr.push(undefined);
        arr[idx] = compressed;
        return { ...prev, [areaId]: arr };
      });
    } finally {
      setBusy(false);
    }
  };

  // "+" handler — appends an empty extras slot to the current array. The slot itself opens the picker on click.
  const addExtraSlot = () => {
    setPhotos(prev => ({ ...prev, [areaId]: [...(prev[areaId] || []), undefined] }));
  };

  // Remove a slot. Required slots clear in place (so the prompt label stays); extras slots splice out.
  const removeSlot = (idx) => {
    setPhotos(prev => {
      const arr = [...(prev[areaId] || [])];
      if (idx < required) arr[idx] = undefined;
      else arr.splice(idx, 1);
      return { ...prev, [areaId]: arr };
    });
  };

  const filledRequiredCount = prompts.filter((_, i) => current[i]).length;
  const allRequiredFilled = filledRequiredCount === required;
  const extraSlots = current.slice(required); // includes empty (undefined) extras placeholders too
  const canAddMoreExtras = extraSlots.length < maxExtras;

  // Filled slot — shows actual photo thumbnail with × to remove
  const renderFilledSlot = (file, idx) => (
    <div key={`filled-${idx}`} style={{ position: "relative", border: `2px solid ${C.green}`, borderRadius: 10, minHeight: 96, overflow: "hidden", background: C.greenBg }}>
      <ThumbImage file={file} alt="" style={{ width: "100%", height: 96, objectFit: "cover", display: "block" }} />
      <button type="button" onClick={() => removeSlot(idx)} aria-label="Remove photo" style={{ position: "absolute", top: 4, right: 4, width: 24, height: 24, borderRadius: "50%", border: "none", background: C.err, color: "white", fontSize: 14, cursor: "pointer", lineHeight: 1, fontWeight: 700, boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>×</button>
    </div>
  );

  // Empty REQUIRED slot — camera icon + "Photo N *" + prompt; click → file picker
  const renderRequiredEmpty = (idx, label) => {
    const slotId = `photo-${areaId}-req-${idx}`;
    return (
      <div key={`req-empty-${idx}`}>
        <input type="file" id={slotId} accept="image/*" capture="environment" disabled={busy}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
          onChange={e => { if (e.target.files?.[0]) fillSlotAt(e.target.files[0], idx); }} />
        <label htmlFor={slotId} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, minHeight: 96, border: `1.5px dashed ${C.brd}`, borderRadius: 10, padding: "8px 6px", textAlign: "center", background: C.surfLow, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
          {busy ? (
            <span style={{ fontSize: 11, color: C.sec, fontWeight: 500 }}>Compressing…</span>
          ) : (
            <>
              {I.camera(20)}
              <span style={{ fontSize: 10, fontWeight: 700, color: C.pri, lineHeight: 1.2, padding: "0 2px" }}>Photo {idx + 1}<span style={{ color: C.err }}> *</span></span>
              <span style={{ fontSize: 9, color: C.sec, lineHeight: 1.3, padding: "0 2px" }}>{label}</span>
            </>
          )}
        </label>
      </div>
    );
  };

  // Empty EXTRAS slot — looks identical to required slots (grey dashed border, surfLow bg) so the
  // grid stays visually consistent. No × — empty extras are harmless (filtered out on submit).
  const renderExtraEmpty = (eidx) => {
    const absIdx = required + eidx;
    const slotId = `photo-${areaId}-extra-${eidx}`;
    return (
      <div key={`extra-empty-${eidx}`}>
        <input type="file" id={slotId} accept="image/*" capture="environment" disabled={busy}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
          onChange={e => { if (e.target.files?.[0]) fillSlotAt(e.target.files[0], absIdx); }} />
        <label htmlFor={slotId} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, minHeight: 96, border: `1.5px dashed ${C.brd}`, borderRadius: 10, padding: "8px 6px", textAlign: "center", background: C.surfLow, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
          {busy ? (
            <span style={{ fontSize: 11, color: C.sec, fontWeight: 500 }}>Compressing…</span>
          ) : (
            <>
              {I.camera(20)}
              <span style={{ fontSize: 10, fontWeight: 700, color: C.pri, lineHeight: 1.2, padding: "0 2px" }}>Tap to add photo</span>
              <span style={{ fontSize: 9, color: C.sec, lineHeight: 1.3 }}>(optional)</span>
            </>
          )}
        </label>
      </div>
    );
  };

  // "+" button — borderless action button (visually distinct from the slots). Spawns an empty extras slot.
  const renderPlusButton = () => (
    <button key="plus-btn" type="button" onClick={addExtraSlot}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, minHeight: 96, border: "none", borderRadius: 10, padding: "8px 6px", textAlign: "center", background: "transparent", cursor: "pointer", color: "inherit", fontFamily: "inherit" }}>
      <span style={{ fontSize: 44, color: C.acc, fontWeight: 700, lineHeight: 1 }}>+</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: C.pri, lineHeight: 1.2 }}>Add extra photos</span>
      <span style={{ fontSize: 9, color: C.sec, lineHeight: 1.3 }}>(optional)</span>
    </button>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {prompts.map((label, idx) => current[idx] ? renderFilledSlot(current[idx], idx) : renderRequiredEmpty(idx, label))}
        {extraSlots.map((file, eidx) => file ? renderFilledSlot(file, required + eidx) : renderExtraEmpty(eidx))}
        {canAddMoreExtras && renderPlusButton()}
      </div>
      {!allRequiredFilled && (
        <p style={{ fontSize: 11, color: C.sec, marginTop: 6, textAlign: "center" }}>{filledRequiredCount} of {required} required photos added</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN FORM COMPONENT
   ═══════════════════════════════════════════════ */
export default function QuoteForm() {
  /* ─── STEP 1: ABOUT YOU ─── */
  const [fn, setFn] = useState("");
  const [ln, setLn] = useState("");
  const [ph, setPh] = useState("");
  const [em, setEm] = useState("");
  const [noPhone, setNoPhone] = useState(false);
  const [cust, setCust] = useState(null);
  const [co, setCo] = useState("");
  const [tenAuth, setTenAuth] = useState(null);
  const [llEm, setLlEm] = useState("");

  /* ─── STEP 2: WHERE ─── */
  const [addr, setAddr] = useState("");
  const [addrOk, setAddrOk] = useState(null);
  const [prop, setProp] = useState(null);
  const [lift, setLift] = useState(null);
  const [bathroomCount, setBathroomCount] = useState(null);
  const [bathroomIndex, setBathroomIndex] = useState(1);
  const [builtBefore1990, setBuiltBefore1990] = useState(null);

  // Address autocomplete
  const [addrSuggestions, setAddrSuggestions] = useState([]);
  const [showAddrDropdown, setShowAddrDropdown] = useState(false);
  const addrDebounce = useRef();
  const addrSessionToken = useRef(typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
  const addrCache = useRef(new Map());
  const addrAbort = useRef(null);

  /* ─── STEP 3: WHAT NEEDS WORK ─── */
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [fullBathroomMode, setFullBathroomMode] = useState(false);
  const [fullScope, setFullScope] = useState(null);
  // Full-bathroom inventory — every bathroom is different. Customer tells us what's in their room
  // so we can ask for the right photos and scope the quote accurately. Sensible defaults: typical AU bathroom = 1 shower + 1 bath + 1 vanity.
  const [fullBathroomInventory, setFullBathroomInventory] = useState({ showers: 1, baths: 1, vanities: 1, tiledWalls: 1, tiledFloor: 1 });
  // Per-fixture SERVICE override inside Full Bathroom mode. Defaults are derived from the scope picked
  // at Step 3 (see scopeDefaultForArea below). Customer can override any fixture or skip it. This gives
  // Marko structured data per fixture so he can quote without follow-up calls.
  const [fullAreaServices, setFullAreaServices] = useState({ shower: "both", bath: "both", basin_vanity: "full", walls: "both", floor: "both" });
  const [notSureMode, setNotSureMode] = useState(false);
  const [notSureText, setNotSureText] = useState("");

  /* ─── STEP 4: PER-AREA DETAILS ─── */
  const [areaServices, setAreaServices] = useState({});
  const [perAreaPhotos, setPerAreaPhotos] = useState({});
  const [epoxyMode, setEpoxyMode] = useState("standard");
  // Per-area chip/crack repair add-on (walls, floor, basin_vanity). Toggled below the area's service cards
  // when the customer picks a service that's NOT the chip-only one (so it stacks rather than duplicates).
  const [chipRepairAddon, setChipRepairAddon] = useState({});
  // Basin/vanity finish upgrade — only shown when a basin/vanity resurface card is picked.
  const [basinFinish, setBasinFinish] = useState("standard");
  // Basin/vanity "Custom" card — checklist state for which surfaces the customer wants resurfaced.
  // Active only when areaServices.basin_vanity[0] === "custom".
  const [basinCustomSurfaces, setBasinCustomSurfaces] = useState({ basin: false, bench: false, cabinet: false });
  // "Continue on mobile" modal — skeletal Phase 2 feature. Backend wiring documented in
  // ~/.claude/.../memory/quote_form_requirements.md (D2). For now: UI only, no real session token.
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [mobileModalTab, setMobileModalTab] = useState("qr"); // "qr" | "link"
  const [smsSent, setSmsSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  /* ─── STEP 5: NOTES & SUBMIT ─── */
  const [notes, setNotes] = useState("");
  const [prevResurfaced, setPrevResurfaced] = useState(null);
  const [hasVentilation, setHasVentilation] = useState(null);
  // Marketing opt-in checkbox dropped Allan 2026-05-05 — form is a quote request, not marketing.
  // If we ever add newsletter / promotional outreach, re-add a checkbox + state then.
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  // Webhook-failure error state (set when all 3 webhook attempts fail; surfaces a recovery UI
  // above the submit button instead of falsely showing a success screen). Cleo audit 2026-05-05.
  const [submitError, setSubmitError] = useState(null);
  const [honeypot, setHoneypot] = useState("");
  const [waitlistSent, setWaitlistSent] = useState(false);
  const [resetCount, setResetCount] = useState(0);

  /* ─── TRACKING ─── */
  const [tracking, setTracking] = useState({});
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setTracking({
      gclid: p.get("gclid") || "", gbraid: p.get("gbraid") || "", wbraid: p.get("wbraid") || "",
      utm_source: p.get("utm_source") || "", utm_medium: p.get("utm_medium") || "",
      utm_campaign: p.get("utm_campaign") || "", utm_content: p.get("utm_content") || "",
      landing_page: window.location.pathname,
    });
  }, []);

  /* ─── localStorage PERSISTENCE ─── */
  const STORAGE_KEY = "timeless_quote_form_v10";
  const restoredOnce = useRef(false);
  useEffect(() => {
    if (restoredOnce.current) return; restoredOnce.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (typeof d.fn === "string") setFn(d.fn);
      if (typeof d.ln === "string") setLn(d.ln);
      if (typeof d.ph === "string") setPh(d.ph);
      if (typeof d.em === "string") setEm(d.em);
      if (typeof d.addr === "string") setAddr(d.addr);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ fn, ln, ph, em, addr })); }
      catch { /* ignore */ }
    }, 500);
    return () => clearTimeout(t);
  }, [fn, ln, ph, em, addr]);

  // When the Full Bathroom scope changes, sync default services per fixture. Customer can still
  // override individual fixtures after this — this just sets a sensible starting state.
  useEffect(() => {
    if (!fullScope) return;
    setFullAreaServices({
      shower: scopeDefaultForArea(fullScope, "shower"),
      bath: scopeDefaultForArea(fullScope, "bath"),
      basin_vanity: scopeDefaultForArea(fullScope, "basin_vanity"),
      walls: scopeDefaultForArea(fullScope, "walls"),
      floor: scopeDefaultForArea(fullScope, "floor"),
    });
  }, [fullScope]);

  /* ─── NAV ─── */
  const [step, setStep] = useState("about");

  /* ─── PHONE / EMAIL VALIDATION ─── */
  // Accepts 10-digit AU numbers (mobile 04XXXXXXXX, landline 0[2-9]XXXXXXXX)
  // AND 8-digit landlines without area code (9XXXXXXX, 8XXXXXXX) — auto-prepends 02 (Sydney NSW).
  const normPhone = (raw) => {
    let n = raw.replace(/[\s\-\(\)\.]/g, "");
    if (n.startsWith("+61")) n = "0" + n.slice(3);
    else if (n.startsWith("61") && n.length >= 11) n = "0" + n.slice(2);
    // 8-digit landline without area code — assume Sydney (02) for now since we're NSW-only
    if (/^[2-9]\d{7}$/.test(n)) n = "02" + n;
    return n;
  };
  const formatAUPhone = (raw) => {
    const n = normPhone(raw);
    const d = n.slice(0, 10);
    if (d.length === 0) return "";
    if (d.startsWith("04")) {
      if (d.length <= 4) return d;
      if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
      return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
    }
    if (d.length <= 2) return d;
    if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2)}`;
    return `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}`;
  };
  const isSpamPhone = (n) => {
    if (/^04(\d)\1{7}$/.test(n)) return true;
    if (n === "0412345678" || n === "0498765432") return true;
    return false;
  };
  const phNorm = normPhone(ph);
  const phIsMobile = /^04\d{8}$/.test(phNorm);
  const phIsLandline = /^0[235789]\d{8}$/.test(phNorm);
  const phFormatOk = phIsMobile || phIsLandline;
  const phSpam = phFormatOk && isSpamPhone(phNorm);
  const phOk = phFormatOk && !phSpam;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const emOk = EMAIL_RE.test(em);
  const phoneOk = noPhone ? emOk : (phOk && (phIsMobile || emOk));
  const llEmOk = cust !== "tenant" || tenAuth !== "send" || EMAIL_RE.test(llEm);
  const tenantOk = cust !== "tenant" || tenAuth !== null;
  const fnOk = fn.trim().length >= 1;
  const lnOk = ln.trim().length >= 1;

  /* ─── ADDRESS AUTOCOMPLETE — tuned for instant-feel response ─── */
  async function fetchAddrSuggestions(text) {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_KEY || "";
    // 2-char minimum (was 3) — kicks in sooner, feels more responsive.
    if (!apiKey || text.length < 2) { setAddrSuggestions([]); return; }
    const cached = addrCache.current.get(text);
    if (cached) {
      setAddrSuggestions(cached);
      setShowAddrDropdown(cached.length > 0);
      return;
    }
    if (addrAbort.current) addrAbort.current.abort();
    const ctrl = new AbortController();
    addrAbort.current = ctrl;
    try {
      const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Goog-Api-Key": apiKey },
        signal: ctrl.signal,
        body: JSON.stringify({
          input: text,
          includedRegionCodes: ["AU"],
          languageCode: "en",
          sessionToken: addrSessionToken.current,
          locationRestriction: { rectangle: { low: { latitude: -37.51, longitude: 140.999 }, high: { latitude: -28.16, longitude: 153.64 } } },
        }),
      });
      if (!res.ok) { setAddrSuggestions([]); return; }
      const data = await res.json();
      const preds = (data.suggestions || []).filter(s => s.placePrediction).slice(0, 5);
      if (addrCache.current.size >= 50) {
        const firstKey = addrCache.current.keys().next().value;
        addrCache.current.delete(firstKey);
      }
      addrCache.current.set(text, preds);
      setAddrSuggestions(preds);
      setShowAddrDropdown(preds.length > 0);
    } catch (err) {
      if (err.name !== "AbortError") setAddrSuggestions([]);
    }
  }

  /* ─── STEP HELPERS ─── */
  const toggleArea = (areaId) => {
    setSelectedAreas(prev => prev.includes(areaId) ? prev.filter(a => a !== areaId) : [...prev, areaId]);
    if (fullBathroomMode) { setFullBathroomMode(false); setFullScope(null); }
    if (notSureMode) { setNotSureMode(false); setNotSureText(""); }
  };
  const toggleFullBathroom = () => {
    setFullBathroomMode(prev => {
      const next = !prev;
      if (next) { setSelectedAreas([]); setNotSureMode(false); setNotSureText(""); }
      else { setFullScope(null); }
      return next;
    });
  };
  const toggleNotSure = () => {
    setNotSureMode(prev => {
      const next = !prev;
      if (next) { setSelectedAreas([]); setFullBathroomMode(false); setFullScope(null); }
      else { setNotSureText(""); }
      return next;
    });
  };
  const setServiceForArea = (areaId, serviceId) => {
    setAreaServices(prev => ({ ...prev, [areaId]: [serviceId] }));
    // Clear add-ons that no longer make sense for the new base service.
    // Chip-repair add-on is hidden when base = chip-only/chip_repair, so it'd be stale otherwise.
    if (serviceId === "chip_only" || serviceId === "chip_repair") {
      setChipRepairAddon(prev => ({ ...prev, [areaId]: false }));
      if (areaId === "basin_vanity") setBasinFinish("standard");
    }
    // Clear basin-vanity custom surfaces when leaving the custom card (avoids stale checklist state)
    if (areaId === "basin_vanity" && serviceId !== "custom") {
      setBasinCustomSurfaces({ basin: false, bench: false, cabinet: false });
    }
  };

  /* ─── GATING ─── */
  const can1 = fnOk && lnOk && phoneOk && emOk && cust && tenantOk && llEmOk;
  const can2 = addr.length >= 6 && addrOk !== false && prop && bathroomCount && builtBefore1990 && (prop !== "apt" || lift);
  const can3 = notSureMode ? notSureText.trim().length >= 10 : fullBathroomMode ? !!fullScope : selectedAreas.length > 0;

  // Step 4 (services): each selected area needs a service picked.
  // Full-bathroom mode picks one scope chip on step 3, no per-area service needed.
  // Not-sure mode skips this step entirely (route from step 3 → step 5).
  // Custom basin/vanity card requires at least one surface ticked. Other cards just need a service ID.
  const basinCustomValid = !selectedAreas.includes("basin_vanity")
    || (areaServices.basin_vanity || [])[0] !== "custom"
    || Object.values(basinCustomSurfaces).some(Boolean);
  // Full-bathroom inventory must have at least 1 fixture or tiled surface total — otherwise the
  // photos collapse to just the doorway wide shot which doesn't give enough quote signal.
  const fullInventoryValid = !fullBathroomMode
    || (fullBathroomInventory.showers + fullBathroomInventory.baths + fullBathroomInventory.vanities + fullBathroomInventory.tiledWalls + fullBathroomInventory.tiledFloor) >= 1;
  // If Full Bathroom mode picked "custom" for the vanity AND has a vanity in inventory, at least
  // one surface (basin/bench/cabinet) must be ticked — same rule as per-area mode.
  const fullBasinCustomValid = !fullBathroomMode
    || fullBathroomInventory.vanities === 0
    || fullAreaServices.basin_vanity !== "custom"
    || Object.values(basinCustomSurfaces).some(Boolean);
  const can4 = notSureMode
    ? true
    : fullBathroomMode
      ? !!fullScope && fullInventoryValid && fullBasinCustomValid
      : selectedAreas.every(a => (areaServices[a] || []).length > 0) && basinCustomValid;

  // Step 5 (photos): each area needs ALL required prompt slots filled (3 each, defined in PHOTO_PROMPTS).
  // Full-bathroom + not-sure modes collect photos under a single key ("full"/"unsure").
  const requiredPhotosFilled = (areaId, prompts) => {
    const arr = perAreaPhotos[areaId] || [];
    return prompts.every((_, i) => arr[i]);
  };
  const can5 = notSureMode
    ? requiredPhotosFilled("unsure", PHOTO_PROMPTS.unsure)
    : fullBathroomMode
      ? getFullBathroomSections(fullBathroomInventory, fullAreaServices, !!chipRepairAddon.full).every(s => requiredPhotosFilled(s.id, s.prompts))
      : selectedAreas.every(a => {
          const baseFilled = requiredPhotosFilled(a, PHOTO_PROMPTS[a] || []);
          // If chip-repair add-on is on for this area, also require its dedicated close-up photo.
          const chipFilled = !chipRepairAddon[a] || requiredPhotosFilled(`${a}-chip`, ["close-up"]);
          return baseFilled && chipFilled;
        });

  // Conditional: epoxy upgrade question shows only when at least one regrout service is picked
  const hasRegroutWork = (() => {
    if (fullBathroomMode) return fullScope === "regrout_only" || fullScope === "both";
    return Object.entries(areaServices).some(([area, services]) => {
      const areaCfg = SVCS[area];
      if (!areaCfg) return false;
      return services.some(sId => areaCfg.options.find(o => o.id === sId)?.regrout);
    });
  })();

  // Conditional: previously-resurfaced question (only matters for resurface jobs)
  const hasResurfaceWork = (() => {
    if (fullBathroomMode) return fullScope === "resurface_only" || fullScope === "both";
    const resurfaceServices = ["resurface", "both", "top_only", "full"];
    return Object.values(areaServices).flat().some(s => resurfaceServices.includes(s));
  })();

  /* ─── NAV ─── */
  const back = () => {
    if (step === "where") setStep("about");
    else if (step === "what") setStep("where");
    else if (step === "services") setStep("what");
    else if (step === "photos") setStep(notSureMode ? "what" : "services");
  };

  /* ─── WEBHOOK CONFIG ─── */
  const GHL_WEBHOOK = "https://services.leadconnectorhq.com/hooks/LOCATION_ID/webhook-trigger/REPLACE_ME";
  const GHL_PARTIAL = "https://services.leadconnectorhq.com/hooks/LOCATION_ID/webhook-trigger/REPLACE_ME_PARTIAL";

  /* ─── PARTIAL LEAD ─── */
  const partialSent = useRef(false);
  const sendPartialLead = () => {
    if (partialSent.current) return;
    partialSent.current = true;
    const phone = noPhone ? "" : `+61${phNorm.replace(/^0/, "")}`;
    fetch(GHL_PARTIAL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: fn, lastName: ln, email: em, phone, customData: { form_status: "partial", step_reached: step, customer_type: cust, consent_copy_version: CONSENT_COPY_VERSION, ...tracking } }),
    }).catch(() => {});
    // GA4 conversion event for abandoned-quote / partial-fire path. Used for funnel analysis +
    // Google Ads optimisation (recover partial leads via the abandoned-quote SMS workflow W2).
    fireGA4Event("quote_partial", { step_reached: step, customer_type: cust || "unknown" });
  };

  /* ─── WAITLIST ─── */
  const sendWaitlistSignup = () => {
    if (waitlistSent) return;
    setWaitlistSent(true);
    const phone = noPhone ? "" : `+61${phNorm.replace(/^0/, "")}`;
    fetch(GHL_PARTIAL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: fn, lastName: ln, email: em, phone,
        customData: { form_status: "waitlist", out_of_area_address: addr, customer_type: cust || "", ...tracking },
      }),
    }).catch(() => {});
  };

  /* ─── BUILD QUOTE SUMMARY ─── */
  const buildSummaryItems = () => {
    if (notSureMode) {
      const txt = notSureText.trim();
      const preview = txt.length > 80 ? txt.slice(0, 80) + "…" : txt;
      return [{ area: "Description", tradeName: `"${preview}"`, easy: "we'll work it out from your photos" }];
    }
    if (fullBathroomMode) {
      const opt = FULL_SCOPE_OPTIONS.find(s => s.id === fullScope);
      return opt ? [{ area: "Full bathroom makeover", tradeName: opt.tradeName, easy: opt.easy }] : [];
    }
    const items = [];
    for (const a of selectedAreas) {
      const areaCfg = AREAS.find(x => x.id === a);
      const serviceIds = areaServices[a] || [];
      for (const sId of serviceIds) {
        const opt = SVCS[a]?.options.find(o => o.id === sId);
        if (!opt || !areaCfg) continue;
        // Custom basin/vanity — synthesise tradeName + easy from the ticked surfaces
        if (a === "basin_vanity" && sId === "custom") {
          const ticked = Object.entries(basinCustomSurfaces).filter(([, v]) => v).map(([k]) => k);
          if (!ticked.length) continue;
          const labelMap = { basin: "Basin", bench: "Benchtop", cabinet: "Vanity cabinet" };
          const easyMap = { basin: "the basin", bench: "the benchtop", cabinet: "the cabinet doors and drawers" };
          const label = ticked.map(t => labelMap[t]).join(" + ");
          const easy = "resurface " + ticked.map(t => easyMap[t]).join(", ").replace(/, ([^,]*)$/, " and $1");
          items.push({ areaId: a, area: areaCfg.label, tradeName: label + " resurfacing", easy });
          continue;
        }
        items.push({ areaId: a, area: areaCfg.label, tradeName: opt.tradeName, easy: opt.easy });
      }
    }
    return items;
  };

  /* ─── BUILD FORM PAYLOAD FOR RESOLVER ─── */
  const buildResolverInput = () => ({
    customer_type: cust || "",
    property_type: prop || "",
    lift_access: prop === "apt" ? (lift || "") : "",
    bathroom_count: bathroomCount,
    bathroom_index: bathroomIndex,
    built_before_1990: builtBefore1990,
    full_bathroom_scope: fullBathroomMode ? fullScope : null,
    full_bathroom_inventory: fullBathroomMode ? fullBathroomInventory : null,
    full_area_services: fullBathroomMode ? fullAreaServices : null,
    area_services: fullBathroomMode ? {} : areaServices,
    epoxy_mode: epoxyMode,
    chip_repair_addon: chipRepairAddon, // both per-area AND fullBathroomMode "full" flag
    basin_finish: basinFinish,
    basin_custom_surfaces: (areaServices.basin_vanity || [])[0] === "custom" ? basinCustomSurfaces : null,
    previously_resurfaced: prevResurfaced,
    has_ventilation: hasVentilation,
  });

  /* ─── COUNT PHOTOS (filter undefineds — required-slot model creates sparse arrays) ─── */
  const totalPhotoCount = () => Object.values(perAreaPhotos).reduce((sum, arr) => sum + (arr || []).filter(Boolean).length, 0);

  /* ─── SUBMIT ─── */
  const handleSubmit = async () => {
    if (honeypot) {
      setSubmitting(false);
      setDone(true);
      return;
    }
    setSubmitting(true);
    const phone = noPhone ? "" : `+61${phNorm.replace(/^0/, "")}`;

    // Resolve quote (narrows SKU pools, applies modifiers, rejection flags)
    const resolverInput = buildResolverInput();
    const resolved = resolveQuote(resolverInput);

    // Services text summary for human reading in CRM
    const servicesText = buildSummaryItems().map(i => `${i.area}: ${i.tradeName} (${i.easy})`).join(" | ");

    const payload = {
      firstName: fn,
      lastName: ln,
      email: em,
      phone,
      customData: {
        // Customer
        customer_type: cust || "",
        company_name: co || "",
        tenant_auth: tenAuth || "",
        landlord_email: llEm || "",
        // Property
        property_type: prop || "",
        property_address: addr,
        lift_access: prop === "apt" ? (lift || "not_specified") : "n/a",
        built_before_1990: builtBefore1990 || "not_asked",
        // Multi-bathroom
        bathroom_count: bathroomCount || "1",
        bathroom_index: String(bathroomIndex),
        // Services
        full_bathroom_mode: fullBathroomMode ? "yes" : "no",
        full_bathroom_scope: fullScope || "",
        full_bathroom_inventory_json: fullBathroomMode ? JSON.stringify(fullBathroomInventory) : "",
        full_area_services_json: fullBathroomMode ? JSON.stringify(fullAreaServices) : "",
        not_sure_mode: notSureMode ? "yes" : "no",
        not_sure_description: notSureMode ? notSureText.trim() : "",
        selected_areas: selectedAreas.join(", "),
        area_services_json: JSON.stringify(areaServices),
        services_summary: servicesText,
        epoxy_mode: epoxyMode,
        chip_repair_addon_json: JSON.stringify(chipRepairAddon),
        basin_finish: basinFinish,
        basin_custom_surfaces_json: JSON.stringify(basinCustomSurfaces),
        // Conditional
        previously_resurfaced: prevResurfaced || "not_asked",
        ventilation: hasVentilation || "not_asked",
        // Notes & consent (inferred-consent only; pinned version of consent copy for audit trail)
        customer_notes: notes,
        consent_copy_version: CONSENT_COPY_VERSION,
        // Photos
        photo_count_total: String(totalPhotoCount()),
        photo_count_by_area: JSON.stringify(Object.fromEntries(Object.entries(perAreaPhotos).map(([k, v]) => [k, v?.length || 0]))),
        photos_uploaded: totalPhotoCount() > 0 ? "yes" : "no",
        // Resolved quote skeleton (for downstream automation)
        resolved_line_items_json: JSON.stringify(resolved.line_items),
        resolved_modifiers_json: JSON.stringify(resolved.modifiers),
        resolved_rejection_flags_json: JSON.stringify(resolved.rejection_flags),
        resolved_tier_default: resolved.tier_default,
        resolved_multi_bathroom_discount: String(resolved.multi_bathroom_discount),
        // Tracking
        ...tracking,
        // Meta
        form_status: "complete",
        form_version: "v10.0",
        submitted_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        device_type: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
      },
    };

    let succeeded = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(GHL_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) { succeeded = true; break; }
        if (res.status >= 400 && res.status < 500) {
          console.error("Webhook 4xx, not retrying:", res.status);
          break;
        }
        throw new Error(`HTTP ${res.status}`);
      } catch (err) {
        console.warn(`Webhook attempt ${attempt + 1}/3 failed:`, err.message);
        if (attempt < 2) await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
    if (!succeeded) {
      // CRITICAL: do NOT clear storage and do NOT show success when the webhook fails. Cleo audit
      // 2026-05-05 (auditor-webhook-integrity lens): the prior code lied to the customer by setting
      // done=true even after all retries failed, so leads vanished while customers thought they
      // had submitted. Now we keep their entered data + show an actionable recovery screen.
      console.error("All webhook retries failed — lead at risk:", { firstName: fn, phone, email: em });
      setSubmitError({
        message: "We had trouble sending your quote. Please email us at quotes@timelessresurfacing.com.au with your details, or call/text 0451 110 154 — we'll respond within 24 hours.",
      });
      setSubmitting(false);
      return;
    }
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    // GA4 conversion event — fires on a successful webhook submit. This is THE conversion
    // signal for Google Ads attribution. Includes minimal context (no PII).
    fireGA4Event("quote_submit", {
      areas_count: selectedAreas.length,
      photo_count: Object.values(perAreaPhotos).reduce((sum, arr) => sum + (arr || []).filter(Boolean).length, 0),
      customer_type: cust || "unknown",
      full_bathroom: fullBathroomMode ? "yes" : "no",
      bathroom_index: bathroomIndex,
    });
    setSubmitting(false);
    setDone(true);
  };

  /* ─── MULTI-BATHROOM RESET (preserves person + property; clears bathroom-specific state) ─── */
  const startNextBathroom = () => {
    setDone(false);
    setStep("what");
    setSelectedAreas([]);
    setFullBathroomMode(false);
    setFullScope(null);
    setFullBathroomInventory({ showers: 1, baths: 1, vanities: 1, tiledWalls: 1, tiledFloor: 1 });
    setFullAreaServices({ shower: "both", bath: "both", basin_vanity: "full", walls: "both", floor: "both" });
    setNotSureMode(false);
    setNotSureText("");
    setAreaServices({});
    setPerAreaPhotos({});
    setEpoxyMode("standard");
    setChipRepairAddon({});
    setBasinFinish("standard");
    setBasinCustomSurfaces({ basin: false, bench: false, cabinet: false });
    setPrevResurfaced(null);
    setHasVentilation(null);
    setNotes("");
    // setConsent removed — marketing opt-in checkbox dropped 2026-05-05
    setBathroomIndex(prev => prev + 1);
    partialSent.current = false;
    setResetCount(c => c + 1);
  };

  /* ─── CONFIRMATION SCREEN ─── */
  if (done) {
    const totalBathrooms = bathroomCount === "3+" ? 3 : parseInt(bathroomCount || "1", 10);
    const moreBathroomsRemaining = bathroomIndex < totalBathrooms;
    return (
      <div style={{ fontFamily: "'Inter',system-ui,sans-serif", maxWidth: 480, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{I.check(32)}</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: C.pri, letterSpacing: "-0.02em" }}>Thanks {fn}!</h2>
        {bathroomCount && bathroomCount !== "1" && (
          <p style={{ fontSize: 12, color: C.acc, fontWeight: 600, margin: "0 0 8px" }}>Bathroom {bathroomIndex} of {bathroomCount === "3+" ? "3+" : bathroomCount} submitted</p>
        )}
        {noPhone || phIsLandline ? (
          <p style={{ fontSize: 14, color: C.sec, margin: "0 0 20px" }}>We&rsquo;ll email your quote to <strong style={{ color: C.pri }}>{em}</strong> within 1 business day.</p>
        ) : (<>
          <p style={{ fontSize: 14, color: C.sec, margin: "0 0 6px" }}>We&rsquo;ll text <strong style={{ color: C.pri }}>{phNorm.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}</strong> within 1 business day with your quote.</p>
          <p style={{ fontSize: 13, color: C.sec, margin: "0 0 20px" }}>A copy is on its way to <strong>{em}</strong> too.</p>
        </>)}
        <div style={{ padding: 12, background: C.surfLow, borderRadius: 10, fontSize: 12, color: C.sec, marginBottom: 16 }}><span style={{ color: C.acc }}>&#9733;</span> 4.9 from Sydney bathrooms</div>

        <a href="tel:+61451110154" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: 14, borderRadius: 10, background: C.pri, color: C.white, fontSize: 14, fontWeight: 700, textDecoration: "none", marginBottom: 10, boxSizing: "border-box" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          Need it sooner? Call 0451 110 154
        </a>

        {moreBathroomsRemaining ? (
          <button type="button" onClick={startNextBathroom} style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: C.acc, color: C.accDk, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Quote bathroom {bathroomIndex + 1}{bathroomCount !== "3+" ? ` of ${bathroomCount}` : ""} →
          </button>
        ) : (
          <button type="button" onClick={() => { setBathroomIndex(1); startNextBathroom(); }} style={{ width: "100%", padding: 14, borderRadius: 10, border: `1.5px solid ${C.brd}`, background: C.white, color: C.pri, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            Have another bathroom? Quote it here →
          </button>
        )}
        <p style={{ fontSize: 11, color: C.sec, marginTop: 6 }}>Your contact details are saved — just pick the areas</p>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     RENDER FORM
     ═══════════════════════════════════════════════ */
  const totalSteps = 5;
  const stepNum = step === "about" ? 1 : step === "where" ? 2 : step === "what" ? 3 : step === "services" ? 4 : 5;
  const stepLabel = step === "about" ? "About you" : step === "where" ? "Location" : step === "what" ? "Your bathroom" : step === "services" ? "Service details" : "Photos & submit";

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", maxWidth: 480, margin: "0 auto", padding: "0 20px 32px" }}>
      <Trust />
      <StepBar n={stepNum} total={totalSteps} label={stepLabel} />
      {step !== "about" && <Back onClick={back} />}
      {/* Multi-bathroom context banner — shows whenever the customer is past bathroom 1
          OR when they originally said multiple bathrooms. Covers both flows:
          (a) "I have 2 bathrooms" → banner from bathroom 1 of 2 onwards
          (b) "Just 1" → submit → "Have another bathroom?" → banner appears on bathroom 2 (no total since they originally said 1) */}
      {((bathroomCount && bathroomCount !== "1") || bathroomIndex > 1) && step !== "about" && (
        <div style={{ padding: "8px 12px", background: `${C.acc}25`, borderRadius: 8, fontSize: 12, color: C.accDk, fontWeight: 600, marginBottom: 12, textAlign: "center" }}>
          Quoting bathroom {bathroomIndex}{bathroomCount && bathroomCount !== "1" ? ` of ${bathroomCount === "3+" ? "3+" : bathroomCount}` : ""}
        </div>
      )}

      {/* ═══ STEP 1 — ABOUT YOU ═══ */}
      {step === "about" && <>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: C.pri, letterSpacing: "-0.02em" }}>Bathroom resurfacing quote</h2>
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 20px" }}>We&rsquo;ll get back to you within 1 business day with your quote — no obligation</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>First name *</label><input type="text" value={fn} onChange={e => setFn(e.target.value)} placeholder="First name" autoComplete="given-name" style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: `1.5px solid ${C.brd}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }} /></div>
            <div><label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Last name *</label><input type="text" value={ln} onChange={e => setLn(e.target.value)} placeholder="Last name" autoComplete="family-name" style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: `1.5px solid ${C.brd}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }} /></div>
          </div>
          {!noPhone ? (
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Phone *</label>
              <input type="tel" inputMode="numeric" autoComplete="tel" value={ph} onChange={e => setPh(formatAUPhone(e.target.value))} placeholder="Mobile or landline" style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: `1.5px solid ${ph.length > 3 && !phOk ? C.err : C.brd}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }} />
              {ph.length > 3 && !phFormatOk && <p style={{ fontSize: 12, color: C.err, marginTop: 5 }}>{ph.replace(/[\s\-\(\)\.]/g,"").startsWith("61") || ph.startsWith("+61") ? "We&rsquo;ll convert +61 to 0X format — keep typing" : "Enter an Australian phone (mobile starts 04, landline starts 02/03/07/08)"}</p>}
              {phSpam && <p style={{ fontSize: 12, color: C.err, marginTop: 5 }}>That doesn&rsquo;t look like a real phone number. Please enter your actual contact number.</p>}
              {phIsMobile && phOk && <p style={{ fontSize: 12, color: C.green, marginTop: 5 }}>We&rsquo;ll text your quote to {phNorm.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}</p>}
              {phIsLandline && phOk && <p style={{ fontSize: 12, color: C.green, marginTop: 5 }}>We&rsquo;ll email your quote (landline can&rsquo;t receive SMS)</p>}
              <button type="button" onClick={() => { setNoPhone(true); setPh(""); }} style={{ fontSize: 12, color: C.sec, background: "none", border: "none", cursor: "pointer", marginTop: 6, textDecoration: "underline", padding: "8px 4px", minHeight: 32 }}>I don&rsquo;t have a phone number</button>
            </div>
          ) : (
            <div style={{ padding: 14, background: C.greenBg, borderRadius: 10, borderLeft: `3px solid ${C.green}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>{I.check(18)}<div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>That&rsquo;s okay — we&rsquo;ll email you</div></div>
              <p style={{ fontSize: 12, color: C.sec, margin: "4px 0 8px", lineHeight: 1.4 }}>Your quote will be sent to your email below. No phone needed.</p>
              <button type="button" onClick={() => setNoPhone(false)} style={{ fontSize: 12, color: C.sec, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: "4px 0", minHeight: 32 }}>Actually, I do have a phone</button>
            </div>
          )}
          <div><label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Email *</label><input type="email" value={em} onChange={e => setEm(e.target.value)} placeholder="your@email.com" autoComplete="email" style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: `1.5px solid ${em.length > 3 && !emOk ? C.err : C.brd}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }} />{em.length > 3 && !emOk && <p style={{ fontSize: 12, color: C.err, marginTop: 5 }}>Please enter a valid email address</p>}</div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Who are you? *</label>
            <OptGrid label="Who are you?" opts={[{ id: "owner", icon: I.house(), label: "Owner / Landlord" }, { id: "pm", icon: I.apt(), label: "Property Manager" }, { id: "builder", icon: I.comm(), label: "Builder" }, { id: "tenant", icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4"/><circle cx="10" cy="11" r="3"/><path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14"/><path d="M16 7h2M16 11h2"/></svg>, label: "Tenant" }]} val={cust} set={(v) => { setCust(v); if (v !== "tenant") { setTenAuth(null); setLlEm(""); } }} cols={2} />
            {(cust === "pm" || cust === "builder") && <input type="text" value={co} onChange={e => setCo(e.target.value)} placeholder="Company name (optional)" style={{ width: "100%", marginTop: 8, padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.brd}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />}
            {cust === "tenant" && <div style={{ marginTop: 8, padding: 10, background: C.warnBg, borderRadius: 10 }}><div style={{ fontSize: 12, fontWeight: 600, color: C.warn, marginBottom: 6 }}>Landlord approval needed</div><div role="group" aria-label="How will you get landlord approval?" style={{ display: "flex", gap: 6 }}>{[{ id: "self", l: "I'll get it" }, { id: "send", l: "Send to landlord" }].map(o => <button key={o.id} type="button" onClick={() => setTenAuth(o.id)} aria-pressed={tenAuth === o.id} style={{ flex: 1, padding: "12px 8px", minHeight: 44, borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: "pointer", border: tenAuth === o.id ? `2px solid ${C.warn}` : `1.5px solid ${C.brd}`, background: tenAuth === o.id ? C.warnBg : C.white, color: tenAuth === o.id ? C.warn : C.sec }}>{o.l}</button>)}</div>{tenAuth === "send" && <><p style={{ fontSize: 11, color: C.warn, marginTop: 6, marginBottom: 4 }}>We&rsquo;ll email them a copy of your quote for approval</p><input type="email" value={llEm} onChange={e => setLlEm(e.target.value)} placeholder="Landlord/agent email" style={{ width: "100%", padding: 8, borderRadius: 8, border: `1.5px solid ${llEm.length > 3 && !EMAIL_RE.test(llEm) ? C.err : C.brd}`, fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" }} />{llEm.length > 3 && !EMAIL_RE.test(llEm) && <p style={{ fontSize: 11, color: C.err, marginTop: 4 }}>Enter a valid email address</p>}<p style={{ fontSize: 10, color: C.sec, marginTop: 6, lineHeight: 1.4 }}>By providing this address, you confirm you have authority to share it. Your landlord/agent can request not to be contacted at any time.</p></>}</div>}
          </div>
        </div>
        <Btn onClick={() => { sendPartialLead(); setStep("where"); }} disabled={!can1}>
          {can1 ? "Next — where's the job? →"
            : (!fnOk || !lnOk) ? "Add your name to continue"
            : (!phoneOk && !noPhone) ? "Enter a valid phone (or click \"I don't have a phone\")"
            : !emOk ? "Enter a valid email to continue"
            : !cust ? "Pick who you are above"
            : !tenantOk ? "Choose how to get landlord approval"
            : !llEmOk ? "Enter your landlord's email"
            : "Fill required fields above"}
        </Btn>
        <p style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: C.sec }}>Takes ~90 seconds. No obligation.</p>
      </>}

      {/* ═══ STEP 2 — WHERE ═══ */}
      {step === "where" && <>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: C.pri, letterSpacing: "-0.02em" }}>Where&rsquo;s the job?</h2>
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 20px" }}>We service all of Greater Sydney &amp; NSW</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ position: "relative" }}>
            <label htmlFor="addr-input" style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Property address *</label>
            <input
              id="addr-input"
              type="text"
              value={addr}
              autoComplete="off"
              onChange={e => {
                const v = e.target.value;
                setAddr(v);
                setAddrOk(chkAddr(v));
                // Synchronous cache check — if we've seen this exact prefix before, render
                // suggestions IMMEDIATELY (0 ms) before any debounce. Re-typing common
                // queries (e.g. backspace + retype) feels instant.
                const cached = addrCache.current.get(v);
                if (cached) {
                  setAddrSuggestions(cached);
                  setShowAddrDropdown(cached.length > 0);
                }
                // 50 ms debounce on the network call (was 150) — fast enough to feel instant
                // while avoiding 1 Google Places request per keystroke. Session token caps
                // the billable cost regardless of how many keystrokes hit the API.
                clearTimeout(addrDebounce.current);
                addrDebounce.current = setTimeout(() => fetchAddrSuggestions(v), 50);
              }}
              onFocus={() => addrSuggestions.length > 0 && setShowAddrDropdown(true)}
              onBlur={() => setTimeout(() => setShowAddrDropdown(false), 200)}
              placeholder="Start typing your full address…"
              aria-autocomplete="list"
              aria-expanded={showAddrDropdown}
              aria-controls="addr-suggestions"
              style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: `1.5px solid ${addrOk === false ? C.err : C.brd}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }}
            />
            {showAddrDropdown && addrSuggestions.length > 0 && (
              <div id="addr-suggestions" role="listbox" style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: C.white, border: `1.5px solid ${C.brd}`, borderRadius: 10, marginTop: 4, boxShadow: "0 4px 16px rgba(4,21,52,0.12)", overflow: "hidden", maxHeight: 240, overflowY: "auto" }}>
                {addrSuggestions.map((s, i) => {
                  const main = s.placePrediction.structuredFormat?.mainText?.text || s.placePrediction.text.text;
                  const secondary = s.placePrediction.structuredFormat?.secondaryText?.text || "";
                  const fullText = s.placePrediction.text.text;
                  return (
                    <button
                      key={s.placePrediction.placeId || i}
                      type="button"
                      role="option"
                      aria-selected="false"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => {
                        setAddr(fullText);
                        setAddrOk(chkAddr(fullText));
                        setShowAddrDropdown(false);
                        setAddrSuggestions([]);
                        addrSessionToken.current = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
                      }}
                      style={{ display: "block", width: "100%", padding: "10px 14px", background: "none", border: "none", borderBottom: i < addrSuggestions.length - 1 ? `1px solid ${C.surfC}` : "none", textAlign: "left", fontSize: 13, color: C.pri, cursor: "pointer", fontFamily: "inherit" }}
                    >
                      <div style={{ fontWeight: 600 }}>{main}</div>
                      {secondary && <div style={{ fontSize: 11, color: C.sec, marginTop: 2 }}>{secondary}</div>}
                    </button>
                  );
                })}
              </div>
            )}
            {addrOk === false && (
              <div style={{ marginTop: 6, padding: 12, background: C.errBg, borderRadius: 10 }}>
                <div style={{ fontSize: 12, color: C.err, fontWeight: 600, marginBottom: waitlistSent ? 0 : 8 }}>We only service NSW currently.</div>
                {!waitlistSent ? (
                  <>
                    <div style={{ fontSize: 11, color: C.sec, marginBottom: 8, lineHeight: 1.4 }}>We&rsquo;re growing — want a heads-up when we expand to your area? We&rsquo;ll use the email + phone you already entered.</div>
                    <button type="button" onClick={sendWaitlistSignup} disabled={!emOk || !fnOk} style={{ padding: "10px 14px", borderRadius: 8, border: "none", background: emOk && fnOk ? C.pri : C.brd, color: C.white, fontSize: 12, fontWeight: 600, cursor: emOk && fnOk ? "pointer" : "not-allowed", fontFamily: "inherit" }}>Notify me when we expand →</button>
                    {(!emOk || !fnOk) && <div style={{ fontSize: 10, color: C.sec, marginTop: 6 }}>Fill in your name + email above first.</div>}
                  </>
                ) : (
                  <div style={{ fontSize: 12, color: C.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>{I.check(16)} Thanks {fn}! We&rsquo;ll email you when we&rsquo;re servicing your area.</div>
                )}
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Property type *</label>
            <OptGrid label="Property type" opts={[{ id: "house", icon: I.house(), label: "House" }, { id: "apt", icon: I.apt(), label: "Apartment" }, { id: "comm", icon: I.comm(), label: "Commercial" }]} val={prop} set={setProp} />
            {prop === "apt" && <div style={{ display: "flex", gap: 6, marginTop: 8 }}>{["yes", "no"].map(v => <button key={v} onClick={() => setLift(v)} style={{ flex: 1, padding: 9, borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: lift === v ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: lift === v ? `${C.pri}08` : C.white, color: lift === v ? C.pri : C.sec }}>{v === "yes" ? "Has lift access" : "No lift (stairs)"}</button>)}</div>}
          </div>

          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>How many bathrooms need work? *</label>
            <p style={{ fontSize: 11, color: C.sec, margin: "0 0 8px", lineHeight: 1.4 }}>You&rsquo;ll fill out one form per bathroom. We bundle them into a single quote with multi-bathroom discount.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[{ id: "1", l: "Just 1" }, { id: "2", l: "2 bathrooms" }, { id: "3+", l: "3 or more" }].map(o => (
                <button key={o.id} type="button" onClick={() => setBathroomCount(o.id)} aria-pressed={bathroomCount === o.id} style={{ padding: "12px 6px", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer", border: bathroomCount === o.id ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: bathroomCount === o.id ? `${C.pri}08` : C.white, color: bathroomCount === o.id ? C.pri : C.sec, minHeight: 44 }}>{o.l}</button>
              ))}
            </div>
            {bathroomCount && bathroomCount !== "1" && (
              <p style={{ fontSize: 11, color: C.acc, marginTop: 6, fontWeight: 600 }}>You&rsquo;ll get a discount of $200 off bathroom 2 and $300 off bathroom 3+.</p>
            )}
          </div>

          <div style={{ padding: 12, background: C.warnBg, borderRadius: 10, borderLeft: `3px solid ${C.warn}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.warn, marginBottom: 4 }}>When was the property built? *</div>
            <div style={{ fontSize: 11, color: C.sec, marginBottom: 8, lineHeight: 1.4 }}>NSW asbestos check — pre-1990 properties may need clearance</div>
            <div role="group" aria-label="When was the property built?" style={{ display: "flex", gap: 6 }}>
              {[{ id: "no", l: "After 1990" }, { id: "yes", l: "Before 1990" }, { id: "unsure", l: "Not sure" }].map(o => (
                <button key={o.id} type="button" onClick={() => setBuiltBefore1990(o.id)} aria-pressed={builtBefore1990 === o.id} style={{ flex: 1, padding: "10px 8px", minHeight: 44, borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", border: builtBefore1990 === o.id ? `2px solid ${C.warn}` : `1.5px solid ${C.brd}`, background: C.white, color: builtBefore1990 === o.id ? C.warn : C.sec }}>{o.l}</button>
              ))}
            </div>
            {builtBefore1990 === "yes" && (
              <div style={{ marginTop: 8, padding: "10px 12px", background: C.white, borderRadius: 8, border: `1px solid ${C.warn}30` }}>
                <p style={{ fontSize: 11, color: C.pri, lineHeight: 1.5, margin: "0 0 6px", fontWeight: 600 }}>What this means for you:</p>
                <p style={{ fontSize: 11, color: C.sec, lineHeight: 1.5, margin: "0 0 6px" }}>Pre-1990 properties may contain asbestos in tile adhesive or fibro sheeting. Before we can disturb the surface to regrout or resurface, NSW SafeWork rules say we need a licensed asbestos test (~$300–500, takes half a day).</p>
                <p style={{ fontSize: 11, color: C.sec, lineHeight: 1.5, margin: "0 0 6px" }}>We&rsquo;ll recommend a tester and walk you through the steps when we send your quote — <strong style={{ color: C.pri }}>by call or text, whichever you prefer</strong>. If the test comes back clear, we proceed normally. If asbestos is found, we coordinate a licensed remover for the affected area first.</p>
                <p style={{ fontSize: 10, color: C.sec, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>Adds 3–7 days to scheduling. No charge from us for the consultation.</p>
              </div>
            )}
            {builtBefore1990 === "unsure" && <p style={{ fontSize: 11, color: C.sec, marginTop: 8, lineHeight: 1.4 }}>No problem — we&rsquo;ll check with you when we send your quote (by call or text, your choice).</p>}
          </div>
        </div>
        <Btn onClick={() => setStep("what")} disabled={!can2}>Next — what does your bathroom need? →</Btn>
      </>}

      {/* ═══ STEP 3 — WHAT NEEDS WORK ═══ */}
      {step === "what" && <>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: C.pri, letterSpacing: "-0.02em" }}>What needs work?</h2>
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 16px" }}>Pick everything that applies, or choose a full bathroom makeover.</p>

        {/* Full bathroom picture card */}
        <div onClick={toggleFullBathroom} style={{ background: C.white, border: fullBathroomMode ? `2px solid ${C.pri}` : `2px solid ${C.acc}80`, borderRadius: 12, cursor: "pointer", overflow: "hidden", marginBottom: 14, transition: "all 0.15s", position: "relative" }}>
          <div style={{ position: "relative" }}>
            <img src={FULL_BATHROOM_HERO} alt="" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} loading="lazy" />
            <span style={{ position: "absolute", top: 8, left: 8, background: C.acc, color: C.accDk, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 6, letterSpacing: "0.02em" }}>BUNDLE</span>
          </div>
          <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, borderTop: `1px solid ${C.brd}` }}>
            <input type="checkbox" checked={fullBathroomMode} readOnly style={{ width: 20, height: 20, accentColor: C.pri, pointerEvents: "none", flexShrink: 0 }} />
            {I.sparkle(22)}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.pri }}>Full bathroom makeover</div>
              <div style={{ fontSize: 12, color: C.sec, marginTop: 2 }}>Whole bathroom done in one go</div>
            </div>
          </div>
        </div>

        {fullBathroomMode ? (
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.pri, marginBottom: 8 }}>What kind of makeover?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {FULL_SCOPE_OPTIONS.map(o => {
                const on = fullScope === o.id;
                return (
                  <div key={o.id} onClick={() => setFullScope(o.id)} style={{ borderRadius: 12, cursor: "pointer", background: C.white, border: o.bundle ? (on ? `2px solid ${C.pri}` : `1.5px solid ${C.acc}80`) : (on ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`), overflow: "hidden", position: "relative", transition: "all 0.15s" }}>
                    {o.bundle && (
                      <div style={{ background: C.acc, color: C.accDk, fontSize: 10, fontWeight: 800, padding: "6px 12px", textAlign: "center", letterSpacing: "0.08em" }}>
                        ALL-IN-ONE — BOTH SERVICES COMBINED
                      </div>
                    )}
                    <div style={{ padding: "12px 14px", background: on ? `${C.pri}06` : "transparent", position: "relative" }}>
                      {o.popular && (
                        <div style={{ position: "absolute", top: 8, right: 8, background: C.pri, color: C.white, fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, letterSpacing: "0.04em" }}>POPULAR</div>
                      )}
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <input type="radio" checked={on} readOnly style={{ marginTop: 2, accentColor: C.pri }} />
                        <div style={{ flex: 1, paddingRight: o.popular ? 60 : 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.pri }}>{o.tradeName}</div>
                          <div style={{ fontSize: 12, color: C.sec, marginTop: 2, lineHeight: 1.4 }}>({o.easy}) — {o.desc}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", fontSize: 11, color: C.sec, margin: "4px 0 14px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>or pick specific areas</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {AREAS.map(a => {
                const on = selectedAreas.includes(a.id);
                return (
                  <div key={a.id} onClick={() => toggleArea(a.id)} style={{ background: C.white, border: on ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, borderRadius: 12, cursor: "pointer", overflow: "hidden", transition: "all 0.15s", position: "relative" }}>
                    <div style={{ position: "relative" }}>
                      <img src={a.img} alt="" style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} loading="lazy" />
                      <div style={{ position: "absolute", top: 6, left: 6, width: 22, height: 22, borderRadius: 5, background: on ? C.pri : "rgba(255,255,255,0.92)", border: on ? "none" : `1.5px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}>
                        {on && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                    </div>
                    <div style={{ padding: "8px 10px 10px", borderTop: `1px solid ${C.brd}`, background: on ? `${C.pri}06` : C.white }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        {typeof a.icon === "function" ? a.icon(18) : a.icon}
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.pri, lineHeight: 1.2 }}>{a.label}</div>
                      </div>
                      <div style={{ fontSize: 11, color: C.sec, lineHeight: 1.3 }}>{a.desc}</div>
                    </div>
                  </div>
                );
              })}

              {/* Not sure escape hatch — last tile in the grid, big "?" graphic. Border matches other area cards. */}
              <div onClick={toggleNotSure} style={{ background: C.white, border: notSureMode ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, borderRadius: 12, cursor: "pointer", overflow: "hidden", transition: "all 0.15s", position: "relative" }}>
                <div style={{ position: "relative", height: 110, background: notSureMode ? `${C.pri}10` : C.surfLow, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 72, fontWeight: 800, color: C.pri, lineHeight: 1, letterSpacing: "-0.06em", fontFamily: "'Inter',system-ui,sans-serif" }}>?</span>
                  <div style={{ position: "absolute", top: 6, left: 6, width: 22, height: 22, borderRadius: 5, background: notSureMode ? C.pri : "rgba(255,255,255,0.92)", border: notSureMode ? "none" : `1.5px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}>
                    {notSureMode && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                </div>
                <div style={{ padding: "8px 10px 10px", borderTop: `1px solid ${C.brd}`, background: notSureMode ? `${C.pri}06` : C.white }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.pri, lineHeight: 1.2, marginBottom: 2 }}>Not sure</div>
                  <div style={{ fontSize: 11, color: C.sec, lineHeight: 1.3 }}>Describe it and we&rsquo;ll work it out</div>
                </div>
              </div>
            </div>

            {/* Inline textarea when "Not sure" is selected */}
            {notSureMode && (
              <div style={{ marginTop: 14, padding: 14, background: `${C.pri}06`, border: `1.5px solid ${C.pri}30`, borderRadius: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Describe your bathroom problem *</label>
                <textarea value={notSureText} onChange={e => setNotSureText(e.target.value)} placeholder="e.g. Black mould everywhere, yellowed bath, grout cracking, tiles look dated…" rows={3} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1.5px solid ${C.brd}`, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
                {notSureText.length > 0 && notSureText.trim().length < 10 && <p style={{ fontSize: 11, color: C.sec, marginTop: 4 }}>Tell us a bit more ({10 - notSureText.trim().length} more characters)</p>}
                {notSureText.trim().length >= 10 && <p style={{ fontSize: 11, color: C.green, marginTop: 4, fontWeight: 600 }}>Got it — photos on the next step will help us quote.</p>}
              </div>
            )}
          </>
        )}

        {/* Nudge: when customer has ticked 4+ of the 5 areas, suggest the Full Bathroom Makeover
            fast-track instead. Saves them per-area service decisions if they really want the works. */}
        {!fullBathroomMode && !notSureMode && selectedAreas.length >= 4 && (
          <div style={{ marginTop: 12, padding: 12, background: `${C.acc}1a`, border: `1.5px solid ${C.acc}`, borderRadius: 10, display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ fontSize: 18, lineHeight: 1, marginTop: 2 }} aria-hidden="true">💡</span>
            <div style={{ flex: 1, fontSize: 12, color: C.pri, lineHeight: 1.5 }}>
              Looks like you want most of the bathroom done. Want to switch to{" "}
              <button type="button" onClick={() => { setSelectedAreas([]); setFullBathroomMode(true); }}
                style={{ background: "none", border: "none", color: C.accDk, fontWeight: 700, textDecoration: "underline", cursor: "pointer", fontSize: 12, padding: 0, fontFamily: "inherit" }}>
                Full Bathroom Makeover
              </button>{" "}
              instead? One scope decision covers the lot — faster than picking a service per area.
            </div>
          </div>
        )}

        <Btn onClick={() => setStep(notSureMode ? "photos" : "services")} disabled={!can3}>
          {!can3
            ? (notSureMode
                ? `Describe your problem (${Math.max(0, 10 - notSureText.trim().length)} more chars)`
                : fullBathroomMode
                  ? "Pick a makeover scope above"
                  : "Tick(s) at least one area")
            : notSureMode
              ? "Next — upload photos →"
              : "Next — service details →"}
        </Btn>
      </>}

      {/* ═══ STEP 4 — SERVICE DETAILS (before/after cards per area, no photos) ═══ */}
      {step === "services" && <>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: C.pri, letterSpacing: "-0.02em" }}>{fullBathroomMode ? "Your full bathroom makeover" : "Service details"}</h2>
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 16px" }}>{fullBathroomMode ? `You picked: ${FULL_SCOPE_OPTIONS.find(s => s.id === fullScope)?.tradeName}. Photos come next.` : "Pick the service for each area. We'll grab photos on the next step."}</p>

        {fullBathroomMode ? (
          <>
            <div style={{ padding: 16, border: `2px solid ${C.acc}`, borderRadius: 12, background: `${C.acc}10`, marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                {I.sparkle(22)}
                <div style={{ fontSize: 15, fontWeight: 700, color: C.pri }}>{FULL_SCOPE_OPTIONS.find(s => s.id === fullScope)?.tradeName}</div>
              </div>
              <div style={{ fontSize: 13, color: C.sec, lineHeight: 1.5 }}>({FULL_SCOPE_OPTIONS.find(s => s.id === fullScope)?.easy}) — {FULL_SCOPE_OPTIONS.find(s => s.id === fullScope)?.desc}</div>
            </div>

            {/* Inventory — every bathroom is different. Customer tells us how many of each fixture
                they have so the photo prompts on the next step ask for the right shots. */}
            <div style={{ padding: 14, border: `1.5px solid ${C.brd}`, borderRadius: 12, background: C.white, marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.pri, marginBottom: 4 }}>What&rsquo;s in your bathroom?</div>
              <div style={{ fontSize: 12, color: C.sec, marginBottom: 12, lineHeight: 1.5 }}>So we know what photos to ask for and what to quote. Pick the count for each.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  // Each row maps the inventory count key to its corresponding service-decision area key.
                  // serviceArea = which SVCS bucket this fixture's service options come from.
                  { id: "showers", label: "Showers", options: [0, 1, 2], serviceArea: "shower" },
                  { id: "baths", label: "Baths / spa baths", options: [0, 1, 2], serviceArea: "bath" },
                  { id: "vanities", label: "Vanities (basin areas)", options: [0, 1, 2], serviceArea: "basin_vanity" },
                  { id: "tiledWalls", label: "Tiled walls (outside shower)", options: [0, 1, 2], serviceArea: "walls" },
                  { id: "tiledFloor", label: "Tiled floor", options: [0, 1], serviceArea: "floor" },
                ].map(row => {
                  const count = fullBathroomInventory[row.id];
                  const showService = count > 0;
                  const serviceOptions = SVCS[row.serviceArea]?.options || [];
                  const currentService = fullAreaServices[row.serviceArea];
                  return (
                    <div key={row.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.pri }}>{row.label}</div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {row.options.map(n => {
                            const on = count === n;
                            return (
                              <button key={n} type="button" onClick={() => setFullBathroomInventory(prev => ({ ...prev, [row.id]: n }))} aria-pressed={on}
                                style={{ minWidth: 44, padding: "8px 10px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", border: on ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: on ? `${C.pri}08` : C.white, color: on ? C.pri : C.sec }}>
                                {row.options.length === 2 ? (n === 0 ? "No" : "Yes") : (n === Math.max(...row.options) ? `${n}+` : String(n))}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {showService && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 0 }}>
                          <span style={{ fontSize: 11, color: C.sec, fontWeight: 600, flexShrink: 0 }}>Service:</span>
                          <select
                            value={currentService}
                            onChange={e => setFullAreaServices(prev => ({ ...prev, [row.serviceArea]: e.target.value }))}
                            style={{ flex: 1, padding: "8px 10px", fontSize: 12, borderRadius: 7, border: `1.5px solid ${currentService === "skip" ? C.warn : C.brd}`, background: currentService === "skip" ? C.warnBg : C.white, color: currentService === "skip" ? C.warn : C.pri, fontFamily: "inherit", fontWeight: 600, cursor: "pointer" }}
                          >
                            {serviceOptions.map(o => (
                              <option key={o.id} value={o.id}>{o.tradeName}</option>
                            ))}
                            <option value="skip">— Skip this fixture (already done / not needed)</option>
                          </select>
                        </div>
                      )}
                      {/* Vanity "Custom" — when picked, expose basin/bench/cabinet checkboxes inline so
                          customer can specify which surfaces they want resurfaced. Same data model as
                          per-area mode (basinCustomSurfaces). */}
                      {showService && row.serviceArea === "basin_vanity" && currentService === "custom" && (
                        <div style={{ marginTop: 4, padding: 10, background: C.surfLow, borderRadius: 8, border: `1px dashed ${C.acc}` }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.pri, marginBottom: 8 }}>Tick(s) what needs resurfacing</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            {[
                              { id: "basin", l: "Basin", sub: "the bowl itself" },
                              { id: "bench", l: "Benchtop", sub: "the surrounding vanity top" },
                              { id: "cabinet", l: "Vanity cabinet", sub: "doors and drawer fronts" },
                            ].map(s => {
                              const checked = basinCustomSurfaces[s.id];
                              return (
                                <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: checked ? `${C.acc}1a` : C.white, border: checked ? `1.5px solid ${C.acc}` : `1px solid ${C.brd}`, cursor: "pointer", fontSize: 12 }}>
                                  <input type="checkbox" checked={checked} onChange={e => setBasinCustomSurfaces(prev => ({ ...prev, [s.id]: e.target.checked }))} style={{ accentColor: C.acc, width: 14, height: 14, flexShrink: 0 }} />
                                  <div>
                                    <span style={{ fontWeight: 700, color: C.pri }}>{s.l}</span>
                                    <span style={{ color: C.sec, fontStyle: "italic" }}> — {s.sub}</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                          {!Object.values(basinCustomSurfaces).some(Boolean) && (
                            <div style={{ marginTop: 6, fontSize: 11, color: C.warn, fontWeight: 600 }}>Tick(s) at least one surface above</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chip / scratch repair upgrade for full bathroom — same pattern as per-area. Stacks on top of
                the resurface/regrout scope. Only meaningful when there's at least one fixture. */}
            <div style={{ padding: 12, background: C.surfLow, borderRadius: 10, border: `1px solid ${C.brd}`, marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.pri, marginBottom: 4 }}>
                Any chips, scratches or burns to fix as well? <span style={{ fontWeight: 400, color: C.sec }}>Filled and colour-matched on bath, basin, or tile</span>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {[{ id: false, l: "No, just the work above" }, { id: true, l: "Yes — add chip/crack repair (+)" }].map(o => (
                  <button key={String(o.id)} type="button" onClick={() => setChipRepairAddon(prev => ({ ...prev, full: o.id }))} aria-pressed={!!chipRepairAddon.full === o.id}
                    style={{ flex: 1, padding: 10, minHeight: 44, borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: !!chipRepairAddon.full === o.id ? `2px solid ${C.acc}` : `1.5px solid ${C.brd}`, background: !!chipRepairAddon.full === o.id ? `${C.acc}1a` : C.white, color: !!chipRepairAddon.full === o.id ? C.accDk : C.sec }}>{o.l}</button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {selectedAreas.map(areaId => {
              const areaCfg = AREAS.find(a => a.id === areaId);
              const svcCfg = SVCS[areaId];
              const selectedService = (areaServices[areaId] || [])[0];
              return (
                <div key={areaId}>
                  {/* Centered divider header — clearer section break when multiple areas selected.
                      Pattern: ───── icon Label ───── with horizontal lines flanking the centered label. */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "0 0 6px" }}>
                    <div style={{ flex: 1, height: 1, background: C.brd }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px", whiteSpace: "nowrap" }}>
                      {typeof areaCfg.icon === "function" ? areaCfg.icon(20) : areaCfg.icon}
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.pri, letterSpacing: "-0.01em" }}>{areaCfg.label}</div>
                    </div>
                    <div style={{ flex: 1, height: 1, background: C.brd }} />
                  </div>
                  <div style={{ fontSize: 13, color: C.sec, marginBottom: 12, textAlign: "center" }}>{svcCfg.question}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {svcCfg.options.map(o => {
                      // Inline expander content for the basin/vanity Custom card — passed INTO SvcCard
                      // so the checklist is visually part of the same card (one unit, not two).
                      const isCustomCard = areaId === "basin_vanity" && o.id === "custom";
                      const expanded = isCustomCard ? (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.pri, marginBottom: 8 }}>Tick(s) what needs resurfacing</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {[
                              { id: "basin", l: "Basin", sub: "the bowl itself" },
                              { id: "bench", l: "Benchtop", sub: "the surrounding vanity top" },
                              { id: "cabinet", l: "Vanity cabinet", sub: "doors and drawer fronts" },
                            ].map(s => {
                              const checked = basinCustomSurfaces[s.id];
                              return (
                                <label key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: checked ? `${C.acc}1a` : C.surfLow, border: checked ? `1.5px solid ${C.acc}` : `1px solid ${C.brd}`, cursor: "pointer" }}>
                                  <input type="checkbox" checked={checked} onChange={e => setBasinCustomSurfaces(prev => ({ ...prev, [s.id]: e.target.checked }))} style={{ accentColor: C.acc, width: 16, height: 16, flexShrink: 0 }} />
                                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                                    <span style={{ fontWeight: 700, color: C.pri }}>{s.l}</span>
                                    <span style={{ color: C.sec, fontStyle: "italic" }}> — {s.sub}</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                          {basinCustomSurfaces.basin && basinCustomSurfaces.bench && basinCustomSurfaces.cabinet && (
                            <div style={{ marginTop: 10, padding: 10, background: `${C.green}15`, borderRadius: 8, fontSize: 11, color: C.green, fontWeight: 600 }}>
                              ✓ That's the same as <button type="button" onClick={() => { setBasinCustomSurfaces({ basin: false, bench: false, cabinet: false }); setServiceForArea("basin_vanity", "full"); }} style={{ background: "none", border: "none", color: C.green, fontWeight: 700, textDecoration: "underline", cursor: "pointer", fontSize: 11, padding: 0 }}>Full vanity resurfacing</button> — switch to the bundle?
                            </div>
                          )}
                        </div>
                      ) : null;
                      return (
                        <SvcCard key={o.id} s={o} on={selectedService === o.id} onClick={() => setServiceForArea(areaId, o.id)} expanded={expanded} />
                      );
                    })}
                  </div>


                  {/* Chip/crack repair add-on — for walls, floor, basin_vanity. Only shown when the
                      customer picked a base service that's NOT the chip/repair-only card (so the add-on
                      stacks the work rather than duplicating it). Same upgrade pattern as epoxy. */}
                  {(areaId === "walls" || areaId === "floor" || areaId === "basin_vanity")
                    && selectedService
                    && selectedService !== "chip_repair"
                    && selectedService !== "chip_only" && (
                    <div style={{ marginTop: 10, padding: 12, background: C.surfLow, borderRadius: 10, border: `1px solid ${C.brd}` }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.pri, marginBottom: 4 }}>
                        {areaId === "basin_vanity" ? "Any chips or scratches to fix as well?" : "Any chips or cracks to fix as well?"}
                        <span style={{ fontWeight: 400, color: C.sec }}> Filled and colour-matched</span>
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        {[{ id: false, l: "No, just the work above" }, { id: true, l: "Yes — add chip/crack repair (+)" }].map(o => (
                          <button key={String(o.id)} type="button" onClick={() => setChipRepairAddon(prev => ({ ...prev, [areaId]: o.id }))} aria-pressed={!!chipRepairAddon[areaId] === o.id} style={{ flex: 1, padding: 10, minHeight: 44, borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: !!chipRepairAddon[areaId] === o.id ? `2px solid ${C.acc}` : `1.5px solid ${C.brd}`, background: !!chipRepairAddon[areaId] === o.id ? `${C.acc}1a` : C.white, color: !!chipRepairAddon[areaId] === o.id ? C.accDk : C.sec }}>{o.l}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stone-fleck premium finish — basin/vanity only, applies to the BENCHTOP.
                      Hidden when chip-only and when Custom card has no bench ticked (no benchtop in scope). */}
                  {areaId === "basin_vanity" && selectedService && selectedService !== "chip_only"
                    && (selectedService !== "custom" || basinCustomSurfaces.bench) && (
                    /* Stone-fleck: bench in scope check (Custom needs bench ticked; full + top_only have it implicitly) */
                    <div style={{ marginTop: 10, padding: 12, background: C.surfLow, borderRadius: 10, border: `1px solid ${C.brd}` }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.pri, marginBottom: 4 }}>
                        Finish? <span style={{ fontWeight: 400, color: C.sec }}>Standard solid colour, or speckled stone-look</span>
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        {[{ id: "standard", l: "Standard finish" }, { id: "stone_fleck", l: "Stone-fleck premium (+)" }].map(o => (
                          <button key={o.id} type="button" onClick={() => setBasinFinish(o.id)} aria-pressed={basinFinish === o.id} style={{ flex: 1, padding: 10, minHeight: 44, borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: basinFinish === o.id ? `2px solid ${C.acc}` : `1.5px solid ${C.brd}`, background: basinFinish === o.id ? `${C.acc}1a` : C.white, color: basinFinish === o.id ? C.accDk : C.sec }}>{o.l}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Epoxy upgrade — shown when at least one regrout service is selected */}
        {hasRegroutWork && (
          <div style={{ marginTop: 18, padding: 12, background: C.greenBg, borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 4 }}>Premium grout? <span style={{ fontWeight: 400 }}>Epoxy lasts 20+ years vs cement's 5-7</span></div>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {[{ id: "standard", l: "Standard cement" }, { id: "epoxy", l: "Premium epoxy (+)" }].map(o => (
                <button key={o.id} type="button" onClick={() => setEpoxyMode(o.id)} aria-pressed={epoxyMode === o.id} style={{ flex: 1, padding: 10, minHeight: 44, borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: epoxyMode === o.id ? `2px solid ${C.green}` : `1.5px solid ${C.brd}`, background: epoxyMode === o.id ? C.greenBg : C.white, color: epoxyMode === o.id ? C.green : C.sec }}>{o.l}</button>
              ))}
            </div>
          </div>
        )}

        <Btn onClick={() => setStep("photos")} disabled={!can4}>
          {!can4 ? (fullBathroomMode ? "Pick a scope on previous step" : "Pick a service for each area") : "Next — upload photos →"}
        </Btn>
      </>}

      {/* ═══ STEP 5 — PHOTOS + DETAILS + SUBMIT ═══ */}
      {step === "photos" && <>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: C.pri, letterSpacing: "-0.02em" }}>Almost done!</h2>
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 8px" }}>A few photos so we can quote accurately.</p>

        {/* Continue-on-mobile button — gated behind ENABLE_MOBILE_HANDOFF feature flag because the QR + SMS
            backend (session-token + state-save API + Twilio/GHL SMS) is not yet wired. Cleo audit 2026-05-05. */}
        {ENABLE_MOBILE_HANDOFF && (
          <button type="button" onClick={() => { setShowMobileModal(true); setSmsSent(false); setLinkCopied(false); }}
            style={{ width: "100%", padding: "10px 14px", marginBottom: 12, borderRadius: 10, border: `1.5px solid ${C.acc}`, background: `${C.acc}15`, color: C.accDk, fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📱</span>
            <span>Continue on mobile?</span>
            <span style={{ fontSize: 11, fontWeight: 500, color: C.sec }}>Switch device to use your phone camera</span>
          </button>
        )}

        <div style={{ padding: "8px 12px", background: C.warnBg, borderRadius: 10, fontSize: 11, color: C.warn, marginBottom: 16, lineHeight: 1.5 }}>Tip: Daylight or bathroom lights on — no flash. Stand back for wide shots, get close for damage.</div>

        {notSureMode ? (
          <div style={{ padding: 14, border: `1.5px solid ${C.brd}`, borderRadius: 12, background: C.white, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: C.pri, lineHeight: 1, letterSpacing: "-0.04em" }}>?</span>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.pri }}>Photos of your bathroom</div>
            </div>
            <p style={{ fontSize: 12, color: C.sec, marginBottom: 10, lineHeight: 1.4 }}>Show us what&rsquo;s wrong. Wide shots + close-ups of any damage. We&rsquo;ll work out what&rsquo;s needed from your photos and your description.</p>
            <PerAreaPhotos key={`unsure-${resetCount}`} areaId="unsure" photos={perAreaPhotos} setPhotos={setPerAreaPhotos} prompts={PHOTO_PROMPTS.unsure} />
          </div>
        ) : fullBathroomMode ? (
          // Render the full-bathroom photo step as MULTIPLE per-section cards (same visual structure
          // as per-area mode below). Each section gets its own card with divider header + grid + counter,
          // so a 10-photo full job reads as 5 clean blocks rather than one messy 10-cell flat grid.
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 16 }}>
            {getFullBathroomSections(fullBathroomInventory, fullAreaServices, !!chipRepairAddon.full).map(section => (
              <div key={section.id} style={{ padding: 14, border: `1.5px solid ${C.brd}`, borderRadius: 12, background: C.white }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  {typeof section.icon === "function" ? section.icon(22) : section.icon}
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.pri }}>{section.label}</div>
                </div>
                <PerAreaPhotos key={`${section.id}-${resetCount}`} areaId={section.id} photos={perAreaPhotos} setPhotos={setPerAreaPhotos} prompts={section.prompts} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 16 }}>
            {selectedAreas.map(areaId => {
              const areaCfg = AREAS.find(a => a.id === areaId);
              return (
                <div key={areaId} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ padding: 14, border: `1.5px solid ${C.brd}`, borderRadius: 12, background: C.white }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      {typeof areaCfg.icon === "function" ? areaCfg.icon(22) : areaCfg.icon}
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.pri }}>{areaCfg.label} photos</div>
                    </div>
                    <PerAreaPhotos key={`${areaId}-${resetCount}`} areaId={areaId} photos={perAreaPhotos} setPhotos={setPerAreaPhotos}
                      prompts={(() => {
                        // Basin/vanity dynamic prompts based on the chosen service (avoids asking for
                        // benchtop/cabinet photos when scope doesn't include them, or top-edge photos
                        // for a chip-only customer).
                        if (areaId === "basin_vanity") {
                          const svc = (areaServices.basin_vanity || [])[0];
                          if (svc === "custom") {
                            const ticked = Object.entries(basinCustomSurfaces).filter(([, v]) => v).map(([k]) => k);
                            const p = ["Wide shot — the whole vanity area for context"];
                            if (ticked.includes("basin")) p.push("Close-up — basin interior (and any chips on the rim)");
                            if (ticked.includes("bench")) p.push("Close-up — benchtop edge (so we can see the material)");
                            if (ticked.includes("cabinet")) p.push("Close-up — cabinet doors and drawer fronts");
                            return p.length > 1 ? p : ["Wide shot — the whole vanity area", "Close-up — main concern"];
                          }
                          if (svc === "chip_only") {
                            return [
                              "Wide shot — the area with the damage (for context)",
                              "Close-up — the chip or scratch (so we can colour-match)",
                            ];
                          }
                        }
                        return PHOTO_PROMPTS[areaId] || PHOTO_PROMPTS.unsure;
                      })()} />
                  </div>
                  {/* Chip-repair add-on photo section — appears when the customer toggled chip-repair upgrade
                      for this area. We need a close-up to colour-match the filler. */}
                  {chipRepairAddon[areaId] && (
                    <div style={{ padding: 14, border: `1.5px solid ${C.acc}`, borderRadius: 12, background: `${C.acc}08` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        {I.camera(22)}
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.pri }}>Chip / scratch close-up</div>
                      </div>
                      <PerAreaPhotos key={`${areaId}-chip-${resetCount}`} areaId={`${areaId}-chip`} photos={perAreaPhotos} setPhotos={setPerAreaPhotos} prompts={["Close-up of the chip, scratch or crack to fix (so we can colour-match)"]} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Conditional details — only show questions photos can't fully answer */}
        {hasResurfaceWork && (
          <div style={{ marginBottom: 14, padding: 14, background: C.surfLow, borderRadius: 12, border: `1px solid ${C.brd}` }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.pri, display: "block", marginBottom: 6 }}>Has any surface been resurfaced or recoated before?</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ id: "no", l: "No" }, { id: "yes", l: "Yes — previously resurfaced" }, { id: "unsure", l: "Not sure" }].map(o => (
                <button key={o.id} onClick={() => setPrevResurfaced(o.id)} style={{ flex: 1, padding: 9, borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: "pointer", border: prevResurfaced === o.id ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: prevResurfaced === o.id ? `${C.pri}08` : C.white, color: prevResurfaced === o.id ? C.pri : C.sec }}>{o.l}</button>
              ))}
            </div>
            {prevResurfaced === "yes" && <p style={{ fontSize: 11, color: C.warn, marginTop: 6, padding: "4px 8px", background: C.warnBg, borderRadius: 6 }}>Previous coatings need to be stripped back first — we&rsquo;ll factor this into your quote.</p>}
          </div>
        )}

        {(hasResurfaceWork || hasRegroutWork) && (
          <div style={{ marginBottom: 14, padding: 14, background: C.surfLow, borderRadius: 12, border: `1px solid ${C.brd}` }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.pri, display: "block", marginBottom: 6 }}>Does the bathroom have a window or exhaust fan?</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[{ id: "yes", l: "Yes — window or fan" }, { id: "no", l: "No ventilation" }].map(o => (
                <button key={o.id} onClick={() => setHasVentilation(o.id)} style={{ flex: 1, padding: 9, borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: "pointer", border: hasVentilation === o.id ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: hasVentilation === o.id ? `${C.pri}08` : C.white, color: hasVentilation === o.id ? C.pri : C.sec }}>{o.l}</button>
              ))}
            </div>
            {hasVentilation === "no" && <p style={{ fontSize: 11, color: C.warn, marginTop: 6, padding: "4px 8px", background: C.warnBg, borderRadius: 6 }}>No worries — our technician will set up temporary ventilation. This may add a small amount to the quote.</p>}
          </div>
        )}


        {/* Summary — receipt-style, left-aligned list. Each area block is stacked: area label, service, easy text.
            Separator lines between blocks make it scannable. */}
        <div style={{ padding: "14px 16px", background: C.surfLow, borderRadius: 10, border: `1px solid ${C.brd}`, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.pri, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${C.brd}` }}>Quote summary</div>
          {bathroomCount && bathroomCount !== "1" && (
            <div style={{ fontSize: 12, color: C.acc, fontWeight: 700, marginBottom: 10 }}>
              Bathroom {bathroomIndex} of {bathroomCount === "3+" ? "3+" : bathroomCount}
            </div>
          )}
          {buildSummaryItems().map((s, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, textAlign: "left", paddingBottom: i < arr.length - 1 ? 10 : 0, marginBottom: i < arr.length - 1 ? 10 : 0, borderBottom: i < arr.length - 1 ? `1px dashed ${C.brd}` : "none" }}>
              <span style={{ flexShrink: 0, color: C.green, fontSize: 14, fontWeight: 800, lineHeight: 1.5, marginTop: 1 }} aria-hidden="true">✓</span>
              <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5, color: C.pri }}>
                <span style={{ fontWeight: 700 }}>{s.area}:</span>{" "}
                <span style={{ fontWeight: 700 }}>{s.tradeName}</span>{" "}
                <span style={{ color: C.sec, fontStyle: "italic" }}>({s.easy})</span>
                {chipRepairAddon[s.areaId] && (
                  <div style={{ fontSize: 11, color: C.accDk, fontWeight: 600, marginTop: 4 }}>+ Chip / crack repair add-on</div>
                )}
                {s.areaId === "basin_vanity" && basinFinish === "stone_fleck" && (
                  <div style={{ fontSize: 11, color: C.accDk, fontWeight: 600, marginTop: 4 }}>+ Stone-fleck premium finish</div>
                )}
              </div>
            </div>
          ))}
          {hasRegroutWork && epoxyMode === "epoxy" && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${C.brd}`, fontSize: 12, color: C.green, fontWeight: 600 }}>+ Epoxy grout upgrade</div>
          )}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${C.brd}`, fontSize: 11, color: C.sec }}>
            {totalPhotoCount()} photo{totalPhotoCount() === 1 ? "" : "s"} attached
          </div>
        </div>

        {/* Optional notes */}
        <div>
          <label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Anything else we should know? <span style={{ fontWeight: 400, color: C.sec }}>(optional)</span></label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Built in the 1970s, only available Wednesdays, need a specific colour, have a deadline…" rows={2} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1.5px solid ${C.brd}`, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
        </div>

        {/* Marketing opt-in checkbox dropped 2026-05-05 (Allan): the form is a quote request, not
            marketing. The submit-button caption below carries the inferred-consent line under
            Spam Act 2003. If we add newsletter/promotional outreach later, add a checkbox here. */}

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={e => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" }}
        />

        {/* Webhook-failure recovery surface — shows when submitError is set (all 3 retry attempts failed).
            Don't redirect to the success screen; keep the user's data + give them a real way to reach us.
            Cleo audit 2026-05-05 (auditor-webhook-integrity lens). */}
        {submitError && (
          <div role="alert" style={{ padding: "14px 16px", marginBottom: 12, borderRadius: 12, border: `1.5px solid ${C.err}`, background: `${C.err}10`, color: C.pri }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: C.err }}>We couldn't send your quote</div>
            <p style={{ fontSize: 13, margin: "0 0 10px", lineHeight: 1.5 }}>{submitError.message}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <a href="mailto:quotes@timelessresurfacing.com.au?subject=Quote%20request%20(form%20backup)" style={{ flex: "1 1 140px", padding: "10px 14px", textAlign: "center", borderRadius: 10, background: C.pri, color: C.white, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Email us</a>
              <a href="tel:0451110154" style={{ flex: "1 1 140px", padding: "10px 14px", textAlign: "center", borderRadius: 10, background: C.white, color: C.pri, border: `1.5px solid ${C.pri}`, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Call/text 0451 110 154</a>
            </div>
          </div>
        )}

        <Btn onClick={() => { setSubmitError(null); handleSubmit(); }} disabled={submitting || !can5}>{submitting ? "Sending…" : submitError ? "Try again" : !can5 ? (fullBathroomMode ? "Add at least one photo of your bathroom" : "Add at least one photo for each area above") : "Get my free quote →"}</Btn>
        <p style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: C.sec }}>Quote within 1 business day. No obligation.</p>
        <p style={{ textAlign: "center", marginTop: 4, fontSize: 10, color: C.sec, lineHeight: 1.5 }}>By submitting, you agree we&rsquo;ll contact you about this quote. Your details are handled per our <a href="https://timelessresurfacing.com.au/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: C.pri, textDecoration: "underline" }}>Privacy Policy</a>.</p>
      </>}

      {/* ═══ CONTINUE-ON-MOBILE MODAL — skeletal Phase 2 feature ═══
          UI only. The QR points at a fake URL (/?qf=stub). The "Send SMS" button shows a "coming soon"
          confirmation but doesn't actually send. Production wiring needs:
          1. POST /wp-json/timeless/v1/quote-state — save state, return UUID token (24hr WP transient)
          2. GET /wp-json/timeless/v1/quote-state/{token} — fetch state on mobile resume
          3. POST /wp-json/timeless/v1/quote-state/{token}/sms — send SMS via Twilio/GHL using phone in state
          4. Form rehydrates from URL ?qf=token on mount if present
          5. QR rendered with a self-hosted lib (qrcode-svg) instead of the api.qrserver.com stub */}
      {ENABLE_MOBILE_HANDOFF && showMobileModal && (
        <div onClick={() => setShowMobileModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(4, 21, 52, 0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 14, maxWidth: 420, width: "100%", maxHeight: "90vh", overflow: "auto", padding: 20, position: "relative", boxShadow: "0 12px 40px rgba(0,0,0,0.25)" }}>
            <button type="button" onClick={() => setShowMobileModal(false)} aria-label="Close" style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", border: "none", background: C.surfLow, color: C.sec, fontSize: 20, lineHeight: 1, cursor: "pointer", fontWeight: 700 }}>×</button>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: C.pri, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Continue on another device</h2>
            <p style={{ fontSize: 12, color: C.sec, margin: "0 0 16px", lineHeight: 1.5 }}>Pick up where you left off on your phone — handy for taking photos with your phone camera. No app to download.</p>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 14, padding: 4, background: C.surfLow, borderRadius: 10 }}>
              {[{ id: "qr", l: "QR code" }, { id: "link", l: "Link" }].map(t => (
                <button key={t.id} type="button" onClick={() => setMobileModalTab(t.id)} style={{ flex: 1, padding: "8px 10px", borderRadius: 7, border: "none", background: mobileModalTab === t.id ? C.white : "transparent", color: mobileModalTab === t.id ? C.pri : C.sec, fontSize: 12, fontWeight: 700, cursor: "pointer", boxShadow: mobileModalTab === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>{t.l}</button>
              ))}
            </div>

            {mobileModalTab === "qr" ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "inline-block", padding: 16, background: C.white, border: `1px solid ${C.brd}`, borderRadius: 10 }}>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https%3A%2F%2Ftimelessresurfacing.com.au%2F%3Fqf%3Dstub-token-abc123" alt="QR code (skeleton — points at stub URL)" width={200} height={200} style={{ display: "block" }} />
                </div>
                <p style={{ fontSize: 12, color: C.sec, margin: "12px 0 4px", lineHeight: 1.5 }}>Open your phone&rsquo;s camera and point it at the code.</p>
                <p style={{ fontSize: 10, color: C.sec, fontStyle: "italic", margin: 0 }}>Skeleton — QR points at a stub URL until backend is wired.</p>
              </div>
            ) : (
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.sec, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Your link</label>
                <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                  <input type="text" readOnly value="https://timelessresurfacing.com.au/?qf=stub-token-abc123" style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${C.brd}`, background: C.surfLow, fontSize: 12, fontFamily: "monospace", color: C.pri, minWidth: 0 }} />
                  <button type="button" onClick={() => { navigator.clipboard?.writeText("https://timelessresurfacing.com.au/?qf=stub-token-abc123"); setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); }} style={{ padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${linkCopied ? C.green : C.brd}`, background: linkCopied ? C.greenBg : C.white, color: linkCopied ? C.green : C.pri, fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{linkCopied ? "✓ Copied" : "Copy"}</button>
                </div>

                <div style={{ paddingTop: 14, borderTop: `1px dashed ${C.brd}` }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: C.sec, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Or text it to your phone</label>
                  <p style={{ fontSize: 12, color: C.sec, margin: "0 0 10px", lineHeight: 1.5 }}>We&rsquo;ll send the link via SMS to <strong style={{ color: C.pri }}>{ph || "your phone number"}</strong></p>
                  <button type="button" onClick={() => { setSmsSent(true); setTimeout(() => setSmsSent(false), 3000); }} disabled={!ph || smsSent} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "none", background: smsSent ? C.green : C.pri, color: C.white, fontSize: 13, fontWeight: 700, cursor: smsSent || !ph ? "default" : "pointer", opacity: !ph ? 0.5 : 1 }}>{smsSent ? "✓ SMS sent" : !ph ? "Enter phone in Step 1 first" : "Send SMS to my phone"}</button>
                  <p style={{ fontSize: 10, color: C.sec, fontStyle: "italic", margin: "8px 0 0", textAlign: "center" }}>Skeleton — no SMS is actually sent until backend is wired.</p>
                </div>
              </div>
            )}

            <p style={{ fontSize: 10, color: C.sec, margin: "16px 0 0", lineHeight: 1.5, textAlign: "center" }}>Link works on the same form for 24 hours. Your progress (photos, choices) carries over.</p>
          </div>
        </div>
      )}
    </div>
  );
}
