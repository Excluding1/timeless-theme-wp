import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════
   TIMELESS RESURFACING — QUOTE FORM v9.1
   Covers all 135 services from Master Pricing
   Matches QUOTE_FORM_SPEC_v4_FINAL
   ═══════════════════════════════════════════════ */

/* ─── BRAND PALETTE ─── */
const C = {
  pri: "#041534", priC: "#1b2a4a", acc: "#e7c08b", accDk: "#281800",
  sec: "#44495a", brd: "#d5d8db", surf: "#f7f9fb", surfC: "#eceef0",
  surfLow: "#f2f4f6", white: "#ffffff", err: "#ba1a1a", errBg: "#ffdad6",
  warn: "#854F0B", warnBg: "#FFF8E1", green: "#0F6E56", greenBg: "#e1f5ee",
};

/* ─── LUCIDE ICONS (all navy, professional) ─── */
const I = {
  shower: (s=26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 4 2.5 2.5"/><path d="M13.5 6.5a4.95 4.95 0 0 0-7 7"/><path d="M15 5 5 15"/><path d="M14 17v.01"/><path d="M10 16v.01"/><path d="M13 13v.01"/><path d="M16 10v.01"/><path d="M11 20v.01"/><path d="M17 14v.01"/><path d="M20 11v.01"/></svg>,
  bath: (s=26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 4 8 6"/><path d="M17 19v2"/><path d="M2 12h20"/><path d="M7 19v2"/><path d="M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/></svg>,
  basin: (s=26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16"/><path d="M5 12v1a7 7 0 0 0 14 0v-1"/><path d="M12 5v4"/><circle cx="12" cy="4" r="1" fill={C.pri} stroke="none"/><path d="M9 20h6"/><path d="M12 17v3"/></svg>,
  vanity: (s=26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 6v12"/><path d="M2 12h20"/><path d="M7 18v3M17 18v3"/><circle cx="7.5" cy="9" r=".5" fill={C.pri}/><circle cx="16.5" cy="9" r=".5" fill={C.pri}/></svg>,
  mould: (s=26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><circle cx="8" cy="14" r="1.5" fill={C.pri} stroke="none" opacity=".6"/><circle cx="12" cy="10" r="2" fill={C.pri} stroke="none" opacity=".4"/><circle cx="7" cy="8" r="1" fill={C.pri} stroke="none" opacity=".7"/><circle cx="15" cy="14" r="1" fill={C.pri} stroke="none" opacity=".5"/><circle cx="10" cy="17" r="1.5" fill={C.pri} stroke="none" opacity=".3"/></svg>,
  floor: (s=26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>,
  wall: (s=26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M8 3v6M16 3v6M6 9v6M12 9v6M18 9v6M8 15v6M16 15v6"/></svg>,
  sparkle: (s=26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>,
  question: (s=26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.sec} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  camera: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.sec} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".35"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  check: (s=20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  house: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  apt: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2M10 18h4"/></svg>,
  comm: (s=22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  multi: (s=26) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><path d="m7.5 7.5 2 2m5-2 2 2m-9 5 2 2m5-2 2 2"/></svg>,
};

/* ─── SINGLE-AREA OPTIONS ─── */
const AREAS = [
  { id: "shower", label: "Shower", desc: "Regrouting, silicone, tile resurfacing, or deep clean", icon: I.shower },
  { id: "bath", label: "Bath", desc: "Resurfacing, chip repair, or stain removal", icon: I.bath },
  { id: "basin", label: "Sink / Basin", desc: "Resurfacing, chip repair, or restoration", icon: I.basin },
  { id: "vanity", label: "Vanity / Benchtop", desc: "Benchtop resurfacing, cabinet respray, or chip repair", icon: I.vanity },
  { id: "mould", label: "Mould & Corners", desc: "Silicone replacement — corners, edges, junctions", icon: I.mould },
  { id: "floor", label: "Bathroom Floor", desc: "Floor regrouting, tile resurfacing, or anti-slip", icon: I.floor },
  { id: "walls", label: "Wall Tiles", desc: "Wall regrouting or resurfacing outside the shower", icon: I.wall },
];

/* ─── MULTIPLE AREAS CHECKLIST (from spec 01 — 📦 Multiple) ─── */
const MULTI_ITEMS = [
  { id: "m_shower_regrout", label: "Shower — fix tiles & corners", trade: "regrouting", area: "shower", icon: I.shower },
  { id: "m_shower_recoat", label: "Shower — change tile colour", trade: "resurfacing", area: "shower", icon: I.shower },
  { id: "m_bath_resurface", label: "Bath — make it look new", trade: "resurfacing", area: "bath", icon: I.bath },
  { id: "m_bath_chip", label: "Bath — fix a chip or dent", trade: "chip repair", area: "bath", icon: I.bath },
  { id: "m_basin", label: "Sink — make it look new", trade: "resurfacing", area: "basin", icon: I.basin },
  { id: "m_vanity", label: "Vanity — refresh benchtop or cabinet", trade: "resurfacing/respray", area: "vanity", icon: I.vanity },
  { id: "m_floor", label: "Floor tiles — fix lines or change colour", trade: "regrouting/resurfacing", area: "floor", icon: I.floor },
  { id: "m_full", label: "The whole bathroom needs a refresh", trade: "full makeover", area: "full", icon: I.sparkle },
  { id: "m_regrout_all", label: "Fix all tile lines in the whole bathroom", trade: "full regrout", area: "regrout_all", icon: I.floor },
];
const MULTI_PM = { id: "m_maintenance", label: "Annual maintenance check", trade: "inspection", area: "maintenance", icon: I.comm };

/* ─── SERVICES PER AREA (with before/after) ─── */
const SVCS = {
  shower: [
    { id: "sh1", label: "Fix tiles + corners", trade: "grout lines + corner silicone — the full job", tip: "Remove old grout and silicone, replace fresh. Our bread & butter — 60%+ of shower jobs.", epoxy: true, star: true, befImg: "/images/services/shower/sh1-before.png", aftImg: "/images/services/shower/sh1-after.png", befTxt: "Mouldy grout lines", aftTxt: "Bright white grout" },
    { id: "sh2", label: "Fix just the tile lines", trade: "grout lines only — no corners", tip: "Remove and replace grout only — no silicone corners.", epoxy: true, befImg: "/images/services/shower/sh2-before.png", aftImg: "/images/services/shower/sh2-after.png", befTxt: "Discoloured grout", aftTxt: "Clean uniform lines" },
    { id: "sh3", label: "Fix mouldy corners only", trade: "corners + edges only — no grout lines", tip: "Cut out old mouldy sealant, apply fresh silicone. Quick job.", befImg: "https://placehold.co/200x140/2e2218/fff?text=Before", aftImg: "https://placehold.co/200x140/f0eeea/333?text=After", befTxt: "Black mould corners", aftTxt: "Fresh white silicone" },
    { id: "sh4", label: "Resurface — change the tile colour", trade: "tile resurfacing", tip: "Spray coating over your existing tiles — any colour you want.", befImg: "/images/services/shower/sh4-before.png", aftImg: "/images/services/shower/sh4-after.png", befTxt: "Dated tile colour", aftTxt: "Modern white finish" },
    { id: "sh5", label: "Fix a cracked tile", trade: "tile repair", tip: "Replace or repair broken tiles. You supply the replacement tile.", befImg: "/images/services/shower/sh5-before.png", aftImg: "/images/services/shower/sh5-after.png", befTxt: "Cracked tile", aftTxt: "Seamless repair" },
    { id: "sh6", label: "Deep clean & protect", trade: "grout cleaning + sealing", tip: "Professional clean + invisible protective seal. Great for newer bathrooms.", befImg: "https://placehold.co/200x140/6a6050/fff?text=Before", aftImg: "https://placehold.co/200x140/e8e4de/333?text=After", befTxt: "Built-up grime", aftTxt: "Professionally sealed" },
  ],
  bath: [
    { id: "bt1", label: "Resurface — make it look new", trade: "bath resurfacing", tip: "Spray coating over your existing bath. Looks brand new.", star: true, befImg: "/images/services/bath/bt1-before.png", aftImg: "/images/services/bath/bt1-after.png", befTxt: "Yellowed enamel", aftTxt: "Glossy white finish" },
    { id: "bt2", label: "Fix a chip or dent", trade: "chip repair", tip: "Fill and colour-match chips. Invisible when done.", befImg: "/images/services/bath/bt2-before.png", aftImg: "/images/services/bath/bt2-after.png", befTxt: "Visible chip", aftTxt: "Invisible repair" },
    { id: "bt3", label: "Remove scratches / stains", trade: "polishing / stain removal", tip: "Buff out scratches, remove hard water stains, rust marks, or heat damage.", befImg: "/images/services/bath/bt3-before.png", aftImg: "/images/services/bath/bt3-after.png", befTxt: "Stains & scratches", aftTxt: "Polished smooth" },
    { id: "bt4", label: "Fix the mouldy seal", trade: "silicone replacement", tip: "Replace silicone around bath rim — stops leaks and removes mould.", befImg: "https://placehold.co/200x140/3a2e22/fff?text=Before", aftImg: "https://placehold.co/200x140/f0eeea/333?text=After", befTxt: "Peeling silicone", aftTxt: "Fresh sealed edge" },
  ],
  basin: [
    { id: "bs1", label: "Resurface — make it look new", trade: "basin resurfacing", tip: "Professional coating over your existing basin.", befImg: "/images/services/basin/bs1-before.png", aftImg: "/images/services/basin/bs1-after.png", befTxt: "Stained porcelain", aftTxt: "Bright white" },
    { id: "bs2", label: "Fix a chip or dent", trade: "chip repair", tip: "Fill and colour-match. Invisible when done.", befImg: "/images/services/basin/bs2-before.png", aftImg: "/images/services/basin/bs2-after.png", befTxt: "Chip on rim", aftTxt: "Colour matched" },
  ],
  vanity: [
    { id: "vn1", label: "Resurface the benchtop", trade: "benchtop resurfacing", tip: "New coating on your existing benchtop surface.", befImg: "/images/services/vanity/vn1-before.png", aftImg: "/images/services/vanity/vn1-after.png", befTxt: "Worn laminate", aftTxt: "Smooth new surface" },
    { id: "vn2", label: "Repaint the cabinet", trade: "cabinet respray", tip: "2-pack paint on doors and drawers. Any colour.", cabinet: true, befImg: "/images/services/vanity/vn2-before.png", aftImg: "/images/services/vanity/vn2-after.png", befTxt: "Dated timber", aftTxt: "Modern painted" },
    { id: "vn3", label: "Give it a stone look", trade: "stone-fleck finish", tip: "Granite/marble-effect premium coating.", befImg: "https://placehold.co/200x140/8a7a6a/fff?text=Before", aftImg: "https://placehold.co/200x140/9a9590/333?text=After", befTxt: "Plain laminate", aftTxt: "Granite finish" },
    { id: "vn4", label: "Fix a chip or scratch", trade: "chip repair", tip: "Fill and colour-match surface damage.", befImg: "/images/services/vanity/vn4-before.png", aftImg: "/images/services/vanity/vn4-after.png", befTxt: "Surface damage", aftTxt: "Repaired smooth" },
  ],
  mould: [
    { id: "ml1", label: "Just the shower corners", trade: "silicone replacement", tip: "Shower joints only. Fixed price.", befImg: "https://placehold.co/200x140/1e1a14/fff?text=Before", aftImg: "https://placehold.co/200x140/f0eeea/333?text=After", befTxt: "Black mould", aftTxt: "Mould free" },
    { id: "ml2", label: "Shower + bath corners", trade: "silicone replacement", tip: "Both shower and bath joints. Fixed price.", befImg: "https://placehold.co/200x140/2a2218/fff?text=Before", aftImg: "https://placehold.co/200x140/eeecea/333?text=After", befTxt: "Mould both areas", aftTxt: "All joints fresh" },
    { id: "ml3", label: "Everywhere in bathroom", trade: "full silicone + clean", tip: "Shower + bath + basin + toilet base. Complete mould removal.", befImg: "https://placehold.co/200x140/1a1610/fff?text=Before", aftImg: "https://placehold.co/200x140/f0eeea/333?text=After", befTxt: "Mould throughout", aftTxt: "Full refresh" },
  ],
  floor: [
    { id: "fl1", label: "Fix lines between tiles", trade: "floor regrouting", tip: "Replace floor tile grout. Floor tiles outside shower only.", epoxy: true, befImg: "/images/services/floor/fl1-before.png", aftImg: "/images/services/floor/fl1-after.png", befTxt: "Dark cracked grout", aftTxt: "Clean uniform grout" },
    { id: "fl2", label: "Resurface — change the tile colour", trade: "floor tile resurfacing", tip: "Coating over floor tiles + anti-slip additive.", befImg: "https://placehold.co/200x140/6a5e4e/fff?text=Before", aftImg: "https://placehold.co/200x140/dcd8d2/333?text=After", befTxt: "Outdated colour", aftTxt: "Modern colour" },
    { id: "fl3", label: "Make floor less slippery", trade: "anti-slip treatment", tip: "Invisible chemical grip treatment. Doesn't change the look.", befImg: "https://placehold.co/200x140/8a8a8a/fff?text=Before", aftImg: "https://placehold.co/200x140/c8c8c8/333?text=After", befTxt: "Slippery when wet", aftTxt: "Safe invisible grip" },
    { id: "fl4", label: "Fix a cracked tile", trade: "tile repair", tip: "Replace broken tiles. You supply the replacement tile.", befImg: "/images/services/floor/fl4-before.png", aftImg: "/images/services/floor/fl4-after.png", befTxt: "Cracked floor tile", aftTxt: "Seamless match" },
    { id: "fl5", label: "White powdery buildup", trade: "efflorescence removal", tip: "Specialist removal of salt/mineral deposits on tiles.", befImg: "https://placehold.co/200x140/b0b0b0/fff?text=Before", aftImg: "https://placehold.co/200x140/d8d4ce/333?text=After", befTxt: "White powder stains", aftTxt: "Clean tiles" },
  ],
  walls: [
    { id: "wl1", label: "Fix lines between wall tiles", trade: "wall regrouting", tip: "Regrout bathroom wall tiles outside the shower area. Splashback, behind vanity, around toilet.", epoxy: true, star: true, befImg: "https://placehold.co/200x140/5a4a3a/fff?text=Before", aftImg: "https://placehold.co/200x140/e4e0da/333?text=After", befTxt: "Stained wall grout", aftTxt: "Clean white grout" },
    { id: "wl2", label: "Resurface — change the wall tile colour", trade: "wall tile resurfacing", tip: "Spray coating over existing wall tiles. Half-height (splashback) or full floor-to-ceiling. Any colour.", befImg: "https://placehold.co/200x140/7a6a5a/fff?text=Before", aftImg: "https://placehold.co/200x140/f0ece6/333?text=After", befTxt: "Dated wall tiles", aftTxt: "Modern colour" },
    { id: "wl3", label: "Fix a cracked wall tile", trade: "tile repair", tip: "Replace broken wall tiles. You supply the replacement tile.", befImg: "https://placehold.co/200x140/6a5a4a/fff?text=Before", aftImg: "https://placehold.co/200x140/e0dcd6/333?text=After", befTxt: "Cracked wall tile", aftTxt: "Seamless repair" },
  ],
};

/* ─── PHOTO REQUIREMENTS PER AREA (matching spec exactly) ─── */
const PHOTOS = {
  shower: [
    { id: "ps1", l: "Full shower from doorway", d: "Whole shower visible — we use this to determine size", req: true },
    { id: "ps2", l: "Close-up of worst grout or corner", d: "Get close to the problem area", req: true },
    { id: "ps3", l: "Shower floor from above", d: "Straight down — shows floor condition", req: true },
  ],
  shower_sil: [
    { id: "ps4", l: "Corner / silicone junction close-up", d: "Where tiles meet in the corner", req: true },
  ],
  bath: [
    { id: "pb1", l: "Full bath from the end", d: "Whole tub visible", req: true },
    { id: "pb2", l: "Close-up of worst damage", d: "Most damaged spot — chips, stains, peeling", req: true },
    { id: "pb3", l: "Side view full length", d: "Shows entire bath from the side", req: true },
    { id: "pb4", l: "Underneath / feet area", d: "Is it freestanding or built-in? This affects pricing", req: true },
  ],
  basin: [
    { id: "pbs1", l: "Overhead view into sink", d: "Straight down — shows condition", req: true },
    { id: "pbs2", l: "Close-up of worst damage", d: "Chips, stains, or cracks", req: true },
  ],
  vanity: [
    { id: "pv1", l: "Full vanity from front", d: "Doors + benchtop visible", req: true },
    { id: "pv2", l: "Close-up of benchtop surface", d: "Surface condition", req: true },
  ],
  vanity_cabinet: [
    { id: "pv3", l: "Close-up of cabinet door", d: "Door condition, handle style", req: true },
  ],
  mould: [
    { id: "pm1", l: "Full bathroom / shower area", d: "Shows all affected areas", req: true },
    { id: "pm2", l: "Close-up of worst mould", d: "Get close to the worst spots", req: true },
    { id: "pm3", l: "Floor corner junction", d: "Where floor meets wall", req: true },
  ],
  floor: [
    { id: "pf1", l: "Full floor from doorway", d: "Whole floor area — we use this to estimate size", req: true },
    { id: "pf2", l: "Close-up of worst area", d: "Dirtiest or most damaged grout/tile", req: true },
    { id: "pf3", l: "Corner where floor meets wall", d: "Shows moisture and junction condition", req: true },
  ],
  walls: [
    { id: "pw1", l: "Full wall tile area", d: "Wall tiles outside the shower", req: true },
    { id: "pw2", l: "Close-up of worst grout line", d: "Most damaged area on wall tiles", req: true },
    { id: "pw3", l: "Where wall meets floor", d: "Junction corner close-up", req: true },
  ],
  not_sure: [
    { id: "pns1", l: "Photo of the problem", d: "Any angle — show us what's wrong", req: false },
    { id: "pns2", l: "Second angle", d: "Different view of the same area", req: false },
    { id: "pns3", l: "Wide room shot", d: "From the doorway", req: false },
  ],
  extra: [
    { id: "pex1", l: "Extra photo 1", d: "Optional — anything else", req: false },
    { id: "pex2", l: "Extra photo 2", d: "Optional — different angle", req: false },
    { id: "pex3", l: "Extra photo 3", d: "Optional — other damage", req: false },
  ],
};

/* ─── NSW ADDRESS VALIDATION ───
   Two-tier check (postcode-first, suburb-keyword fallback):
   1. Extract 4-digit postcode and check authoritative NSW ranges.
      Per Australia Post: NSW = 1000-1999 (PO boxes) + 2000-2599 + 2619-2898 + 2921-2999.
      ACT carve-outs (must exclude): 2600-2618, 2900-2920.
   2. If no postcode, fall back to suburb keyword matching (handles
      addresses typed without a postcode — common when user starts typing).
   Returns: true (NSW), false (not NSW), null (can't tell yet — keep submit enabled). */
const NSW_W = ["nsw","sydney","parramatta","wollongong","newcastle","penrith","liverpool","blacktown","bondi","manly","chatswood","bankstown","campbelltown","hornsby","cronulla","surry hills","redfern","strathfield","burwood","ryde","epping","castle hill","kellyville","baulkham hills","westmead","auburn","fairfield","hurstville","kogarah","sutherland","caringbah","marrickville","leichhardt","mosman","dee why","brookvale","mona vale","macquarie park","north sydney","crows nest","gladesville","drummoyne","rhodes","homebush","lidcombe","granville","merrylands","guildford","cabramatta","mount druitt","st marys","emu plains","springwood","katoomba","blue mountains","gosford","central coast","kiama","shellharbour","nowra","camden","narellan","oran park","leppington","casula","ingleburn","miranda","sylvania","engadine","petersham","annandale","rozelle","balmain","pyrmont","glebe","newtown","erskineville","alexandria","mascot","botany","maroubra","coogee","randwick","paddington","woollahra","double bay","rose bay","bronte","darlinghurst","potts point","ultimo","chippendale","camperdown","wagga wagga","tamworth","orange","dubbo","albury","bathurst","armidale","lismore","coffs harbour","port macquarie","maitland","cessnock","queanbeyan","broken hill","griffith","mudgee","young","cowra","goulburn","moss vale","bowral","berry","ulladulla","batemans bay","moruya","taree","forster","tuncurry","singleton","muswellbrook","kurri kurri","raymond terrace","nelson bay","lake macquarie","wyong","the entrance","toukley","woy woy","umina","terrigal","erina","tuggerah"];
const NOT_NSW = ["victoria","queensland","melbourne","brisbane","perth","adelaide","hobart","darwin","canberra","gold coast","geelong"];
function isNSWPostcode(pc) {
  // 1000-1999 = NSW PO boxes, 2000-2599 = NSW (excl ACT 2600-2618),
  // 2619-2898 = NSW, 2899 = Norfolk Is (NSW admin), 2921-2999 = NSW
  if (pc >= 1000 && pc <= 1999) return true;
  if (pc >= 2000 && pc <= 2599) return true;
  if (pc >= 2619 && pc <= 2899) return true;
  if (pc >= 2921 && pc <= 2999) return true;
  return false;
}
function chkAddr(v) {
  if (v.length < 4) return null;
  // Tier 1 — Postcode (highest confidence). Match a 4-digit number on word boundary.
  const m = v.match(/\b(\d{4})\b/);
  if (m) {
    const pc = parseInt(m[1], 10);
    if (isNSWPostcode(pc)) return true;
    if ((pc >= 200 && pc <= 299) || (pc >= 2600 && pc <= 2618) || (pc >= 2900 && pc <= 2920)) return false; // ACT
    if (pc >= 3000 && pc <= 3999) return false; // VIC
    if (pc >= 4000 && pc <= 4999) return false; // QLD
    if (pc >= 5000 && pc <= 5999) return false; // SA
    if (pc >= 6000 && pc <= 6999) return false; // WA
    if (pc >= 7000 && pc <= 7999) return false; // TAS
    if (pc >= 800 && pc <= 999) return false; // NT
  }
  // Tier 2 — State code (Google Places suggestions include ", VIC, Australia" etc.).
  // Word-boundary + adjacent space/comma to avoid false positives like "South Australia".
  // Crucially this catches Google Places picks even when postcode isn't in the text.
  const stateMatch = v.match(/(?:^|[\s,])(NSW|VIC|QLD|SA|WA|TAS|NT|ACT)(?=[\s,]|$|\s+\d)/i);
  if (stateMatch) {
    return stateMatch[1].toUpperCase() === "NSW";
  }
  // Tier 3 — Suburb keyword (handles bare "Sydney" / "Melbourne" without state code).
  const l = v.toLowerCase();
  if (NSW_W.some(w => l.includes(w))) return true;
  if (NOT_NSW.some(w => l.includes(w))) return false;
  return null;
}

/* ─── REUSABLE UI COMPONENTS ─── */
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
  return <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "12px 0 8px", flexWrap: "wrap" }}>{["NSW Licensed","$20M Insured","5yr Warranty"].map((t,i) => <span key={i} style={{ fontSize: 11, fontWeight: 600, color: C.green, display: "flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}><span style={{ width: 14, height: 14, borderRadius: "50%", background: C.greenBg, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, flexShrink: 0 }}>✓</span>{t}</span>)}</div>;
}
function Btn({ children, onClick, disabled, secondary }) {
  return <button onClick={onClick} disabled={disabled} style={{ width: "100%", padding: "16px 20px", borderRadius: 12, border: secondary ? `1.5px solid ${C.brd}` : "none", background: disabled ? C.surfC : secondary ? C.white : C.pri, color: disabled ? C.sec : secondary ? C.pri : C.white, fontSize: 16, fontWeight: 600, cursor: disabled ? "default" : "pointer", fontFamily: "inherit", marginTop: 12, transition: "all 0.15s", letterSpacing: "-0.01em" }}>{children}</button>;
}
function Back({ onClick }) { return <button onClick={onClick} style={{ fontSize: 14, color: C.pri, background: "none", border: "none", cursor: "pointer", fontWeight: 500, marginBottom: 12, padding: "4px 0" }}>← Back</button>; }
function OptGrid({ opts, val, set, cols = 3, label }) {
  // role="group" + aria-label gives screen readers context for the choice set.
  // aria-pressed on each button announces selection state ("Selected, Owner / Landlord").
  return <div role="group" aria-label={label || "Selection"} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>{opts.map(o => <button key={o.id} type="button" onClick={() => set(o.id)} aria-pressed={val === o.id} style={{ padding: "12px 6px", borderRadius: 10, textAlign: "center", cursor: "pointer", border: val === o.id ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: val === o.id ? `${C.pri}08` : C.white, transition: "all 0.15s", minHeight: 44 }}><div style={{ marginBottom: 4 }}>{o.icon}</div><div style={{ fontSize: 12, fontWeight: 500, color: val === o.id ? C.pri : C.sec }}>{o.label}</div></button>)}</div>;
}
function SvcCard({ s, on, toggle, epV, setEp }) {
  const [tip, showTip] = useState(false);
  return (
    <div onClick={toggle} style={{ background: C.white, border: on ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, borderRadius: 12, cursor: "pointer", overflow: "hidden", position: "relative", transition: "all 0.15s" }}>
      {s.star && <div style={{ position: "absolute", top: 8, right: 8, background: C.pri, color: C.white, fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 6, zIndex: 3 }}>POPULAR</div>}
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, position: "relative" }}><span style={{ position: "absolute", top: 6, left: 6, fontSize: 9, fontWeight: 700, color: C.white, background: "rgba(186,26,26,.8)", padding: "2px 7px", borderRadius: 4, zIndex: 2 }}>BEFORE</span><img src={s.befImg} alt="" style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} loading="lazy" /></div>
        <div style={{ flex: 1, position: "relative" }}><span style={{ position: "absolute", top: 6, left: 6, fontSize: 9, fontWeight: 700, color: C.white, background: "rgba(15,110,86,.8)", padding: "2px 7px", borderRadius: 4, zIndex: 2 }}>AFTER</span><img src={s.aftImg} alt="" style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} loading="lazy" /></div>
      </div>
      <div style={{ display: "flex", borderTop: `1px solid ${C.brd}` }}>
        <div style={{ flex: 1, padding: "6px 10px", fontSize: 11, color: C.sec, borderRight: `1px solid ${C.brd}`, fontWeight: 500 }}>{s.befTxt}</div>
        <div style={{ flex: 1, padding: "6px 10px", fontSize: 11, color: C.green, fontWeight: 500 }}>{s.aftTxt}</div>
      </div>
      <div style={{ padding: "10px 12px 12px", borderTop: `1px solid ${C.brd}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <input type="checkbox" checked={on} readOnly style={{ width: 18, height: 18, accentColor: C.pri, marginTop: 1, pointerEvents: "none", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.pri }}>{s.label}</div>
            <div style={{ fontSize: 12, color: C.sec, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>{s.trade}<span onClick={e => { e.stopPropagation(); showTip(!tip); }} style={{ display: "inline-flex", width: 16, height: 16, borderRadius: "50%", border: `1px solid ${C.brd}`, fontSize: 9, color: C.sec, cursor: "pointer", alignItems: "center", justifyContent: "center" }}>i</span></div>
          </div>
        </div>
        {tip && <div style={{ marginTop: 6, marginLeft: 26, padding: "6px 10px", background: C.surfLow, borderRadius: 8, fontSize: 11, color: C.sec, lineHeight: 1.5 }}>{s.tip}</div>}
        {on && s.epoxy && (
          <div onClick={e => e.stopPropagation()} style={{ marginTop: 8, marginLeft: 26, padding: 10, background: C.greenBg, borderRadius: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.green }}>Premium grout? <span style={{ fontWeight: 400 }}>Epoxy — lasts 20+ years</span></div>
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              {["standard", "epoxy"].map(v => <button key={v} onClick={() => setEp(v)} style={{ flex: 1, padding: 7, borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: "pointer", border: epV === v ? `2px solid ${C.green}` : `1.5px solid ${C.brd}`, background: epV === v ? C.greenBg : C.white, color: epV === v ? C.green : C.sec }}>{v === "standard" ? "Standard" : "Premium (Epoxy)"}</button>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
/* ─── CLIENT-SIDE IMAGE COMPRESSION ───
   Resize to max 1920px on long edge + JPEG q0.8. Cuts iPhone HEIC/RAW
   photos from 5-30 MB down to ~200-500 KB without visible quality loss
   for our use case (showing damage on a bathroom fixture). Without this,
   a 12-photo upload over 4G hangs the form for minutes. */
async function compressImage(file) {
  if (!file.type.startsWith("image/")) return file;
  if (file.size < 500 * 1024) return file; // already small enough — skip
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
    if (!blob || blob.size >= file.size) return file; // compression made it bigger — keep original
    return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg", lastModified: file.lastModified });
  } catch {
    return file; // any failure = keep original, never block the user
  }
}

function PhotoUp({ photos, onFilesChange }) {
  const [files, setFiles] = useState({});
  const [busy, setBusy] = useState({}); // photoId -> compressing flag
  const handleFile = async (photoId, file) => {
    setBusy(b => ({ ...b, [photoId]: true }));
    try {
      const compressed = await compressImage(file);
      const next = { ...files, [photoId]: compressed };
      setFiles(next);
      if (onFilesChange) onFilesChange(next);
    } finally {
      setBusy(b => ({ ...b, [photoId]: false }));
    }
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {photos.map(p => {
        const uid = "u_" + p.id; const f = files[p.id]; const isBusy = busy[p.id];
        return <div key={p.id}><input type="file" id={uid} accept="image/*" capture="environment" disabled={isBusy} style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} onChange={e => { if (e.target.files?.[0]) handleFile(p.id, e.target.files[0]); }} /><label htmlFor={uid} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, minHeight: 90, border: `1.5px dashed ${f ? C.green : C.brd}`, borderRadius: 10, padding: "12px 8px", textAlign: "center", background: f ? C.greenBg : C.surfLow, cursor: isBusy ? "wait" : "pointer", opacity: isBusy ? 0.7 : 1 }}>{isBusy ? <span style={{ fontSize: 11, color: C.sec, fontWeight: 500 }}>Compressing&hellip;</span> : f ? <>{I.check()}<span style={{ fontSize: 11, color: C.green, fontWeight: 500 }}>{f.name.length > 18 ? f.name.substring(0, 16) + "..." : f.name}</span></> : <>{I.camera()}<span style={{ fontSize: 12, fontWeight: 500, color: C.pri }}>{p.l}{p.req ? <span style={{ color: C.err }}> *</span> : ""}</span><span style={{ fontSize: 10, color: C.sec }}>{p.d}</span></>}</label></div>;
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN FORM COMPONENT
   ═══════════════════════════════════════════════ */
export default function QuoteForm() {
  // Step 1
  const [fn, setFn] = useState(""); const [ln, setLn] = useState("");
  const [ph, setPh] = useState(""); const [em, setEm] = useState("");
  // Unified phone field accepts mobile (04) OR landline (02/03/05/07/08/09).
  // noPhone = true → email-only contact path (rare edge case for elderly /
  // overseas customers who don't want to provide a phone).
  const [noPhone, setNoPhone] = useState(false);
  const [cust, setCust] = useState(null); const [co, setCo] = useState("");
  const [tenAuth, setTenAuth] = useState(null); const [llEm, setLlEm] = useState("");
  // Step 2
  const [addr, setAddr] = useState(""); const [addrOk, setAddrOk] = useState(null);
  const [prop, setProp] = useState(null); const [lift, setLift] = useState(null);
  // Asbestos screening (NSW Excel rejection #8). Restoring parity with the
  // existing WP-side quote form which has been asking this since launch.
  const [builtBefore1990, setBuiltBefore1990] = useState(null); // "yes" | "no" | "unsure"
  // Address autocomplete (Google Places Autocomplete New — REST API).
  // Free with session tokens since Nov 2024. Falls back to plain text
  // input if VITE_GOOGLE_PLACES_KEY isn't set (no error, just no suggestions).
  const [addrSuggestions, setAddrSuggestions] = useState([]);
  const [showAddrDropdown, setShowAddrDropdown] = useState(false);
  const addrDebounce = useRef();
  const addrSessionToken = useRef(typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
  async function fetchAddrSuggestions(text) {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_KEY || "";
    if (!apiKey || text.length < 3) { setAddrSuggestions([]); return; }
    try {
      const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Goog-Api-Key": apiKey },
        body: JSON.stringify({
          input: text,
          includedRegionCodes: ["AU"],
          languageCode: "en",
          sessionToken: addrSessionToken.current,
          // Restrict to mainland NSW bounding box. Without this, Google's
          // IP-based location bias surfaces nearby suggestions — so a NSW
          // resident on holiday in QLD/VIC types "15 King St" and gets
          // wrong-state results promoted. With restriction, Google never
          // suggests non-NSW addresses regardless of user location.
          // Bounds: -37.51..-28.16 lat, 140.999..153.64 lng (excludes
          // Lord Howe Is + Norfolk Is — out of service area anyway).
          locationRestriction: {
            rectangle: {
              low: { latitude: -37.51, longitude: 140.999 },
              high: { latitude: -28.16, longitude: 153.64 },
            },
          },
        }),
      });
      if (!res.ok) { setAddrSuggestions([]); return; }
      const data = await res.json();
      const preds = (data.suggestions || []).filter(s => s.placePrediction).slice(0, 5);
      setAddrSuggestions(preds);
      setShowAddrDropdown(preds.length > 0);
    } catch {
      setAddrSuggestions([]);
    }
  }
  // Step 3
  const [mode, setMode] = useState(null); // "single" | "multi" | "unsure"
  const [selArea, setSelArea] = useState(null); // single area id
  const [selAreas, setSelAreas] = useState([]); // area checkboxes (new unified step 3)
  const [multiPicks, setMultiPicks] = useState([]); // multi checklist ids
  const [unsureTxt, setUnsureTxt] = useState("");
  // Step 4
  const [svcPicks, setSvcPicks] = useState({}); const [epoxyPicks, setEpoxyPicks] = useState({});
  const [basinCnt, setBasinCnt] = useState(null);
  const [showerOverBath, setShowerOverBath] = useState(null); // "yes" | "no" | null
  // Spa bath flag — Excel BTV-05/06 vs BTH-01 is ~+$440 pricing delta.
  // Only shown when bath area is being serviced + bath resurface (bt1) picked.
  const [isSpa, setIsSpa] = useState(null); // "yes" | "no"
  // Step 5
  const [notes, setNotes] = useState("");
  const [prevResurfaced, setPrevResurfaced] = useState(null); // yes/no/unsure
  const [hasVentilation, setHasVentilation] = useState(null); // yes/no
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false); const [done, setDone] = useState(false);
  // Honeypot anti-spam — hidden from real users (off-screen + aria-hidden + tabindex=-1).
  // Bots that auto-fill every <input> will populate this; we silently "succeed"
  // so they don't iterate and try to bypass.
  const [honeypot, setHoneypot] = useState("");
  // Waitlist state — for users whose address is outside NSW. One-click capture
  // using the email they already provided in Step 1 + their typed address.
  const [waitlistSent, setWaitlistSent] = useState(false);
  // Reset counter — incremented when user clicks "Have another bathroom?" on
  // the confirmation page. Used as React `key` on PhotoUp so its internal
  // `files`/`busy` state forcibly resets (otherwise old photos stay "selected"
  // after the parent reset).
  const [resetCount, setResetCount] = useState(0);
  // Photos — collected from PhotoUp children
  const allPhotos = useRef({});
  const onPhotosChange = (newFiles) => { allPhotos.current = { ...allPhotos.current, ...newFiles }; };
  // Tracking — GCLID + UTM (captured on mount)
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

  // ─── localStorage persistence (selective) ─────────────────────────
  // Saves the cheap-to-restore fields so a user who closes the tab mid-form
  // doesn't lose their typing. NOT saved: photos (too big), landlord email
  // (third-party PII — re-enter for safety), consent checkboxes (re-consent
  // each session), customer/property/service picks (cheap to re-click and
  // avoids reviving stale selections after price/service changes).
  const STORAGE_KEY = "timeless_quote_form_v1";
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
    } catch { /* corrupted storage — ignore */ }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ fn, ln, ph, em, addr }));
      } catch { /* quota or private mode — silently skip */ }
    }, 500);
    return () => clearTimeout(t);
  }, [fn, ln, ph, em, addr]);
  // Nav
  const [step, setStep] = useState("about");

  // Helpers
  // Normalise AU phone: strip +61/61 prefix, spaces, dashes, brackets → 04XXXXXXXX
  const normPhone = (raw) => {
    let n = raw.replace(/[\s\-\(\)\.]/g, ""); // strip spaces, dashes, brackets, dots
    if (n.startsWith("+61")) n = "0" + n.slice(3);
    else if (n.startsWith("61") && n.length >= 11) n = "0" + n.slice(2);
    return n;
  };
  // Format-as-you-type for AU phone (mobile OR landline). Auto-detects by
  // first 2 digits: "04" → mobile (4-3-3 grouping), else landline (2-4-4).
  // normPhone handles +61 paste-in. Caps at 10 digits.
  const formatAUPhone = (raw) => {
    const n = normPhone(raw);
    const d = n.slice(0, 10);
    if (d.length === 0) return "";
    if (d.startsWith("04")) {
      if (d.length <= 4) return d;
      if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
      return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
    }
    // Landline: 2-4-4 (e.g. "02 9876 5432")
    if (d.length <= 2) return d;
    if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2)}`;
    return `${d.slice(0, 2)} ${d.slice(2, 6)} ${d.slice(6)}`;
  };
  // Spam pattern detection: rejects junk inputs like 0411111111, 0400000000,
  // 0412345678 (common test number from Telstra tutorials). Honeypot catches
  // bots; this catches bored testers + casual spam without triggering false
  // positives on real numbers.
  const isSpamPhone = (n) => {
    if (/^04(\d)\1{7}$/.test(n)) return true; // all same digit after 04
    if (n === "0412345678" || n === "0498765432") return true; // sequential test patterns
    return false;
  };
  const phNorm = normPhone(ph);
  const phIsMobile = /^04\d{8}$/.test(phNorm);
  const phIsLandline = /^0[235789]\d{8}$/.test(phNorm); // 02/03/05/07/08/09 — excludes 04 mobile + 06 (unused)
  const phFormatOk = phIsMobile || phIsLandline;
  const phSpam = phFormatOk && isSpamPhone(phNorm);
  const phOk = phFormatOk && !phSpam;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const emOk = EMAIL_RE.test(em);
  // Phone requirement: either a valid phone number, OR noPhone=true with valid email.
  // Landline always requires email anyway (can't text a quote to a landline).
  const phoneOk = noPhone ? emOk : (phOk && (phIsMobile || emOk));
  // Landlord email is required only when tenant chooses "Send to landlord" flow.
  // Without this gate, a tenant could submit "x" as landlord email and we'd
  // attempt to email a garbage address (Privacy Act + Spam Act exposure).
  const llEmOk = cust !== "tenant" || tenAuth !== "send" || EMAIL_RE.test(llEm);
  // Tenant must choose an authorization path (self vs send) before continuing.
  const tenantOk = cust !== "tenant" || tenAuth !== null;
  const can1 = fn.length >= 2 && ln.length >= 2 && phoneOk && emOk && cust && tenantOk && llEmOk;
  const can2 = addr.length >= 6 && addrOk !== false && prop && builtBefore1990;
  const can3 = mode === "single" ? !!selArea : mode === "multi" ? multiPicks.length > 0 : mode === "unsure" ? unsureTxt.length >= 10 : false;

  const toggleArea = id => setSelAreas(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleMulti = id => setMultiPicks(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleSvc = (a, sid) => setSvcPicks(p => { const c = p[a] || []; return { ...p, [a]: c.includes(sid) ? c.filter(x => x !== sid) : [...c, sid] }; });

  // Determine which areas have been selected (for photos)
  // Unified active areas — combines selAreas (checkboxes) + multiPicks (packages) + selArea (single mode legacy)
  const activeAreas = (() => {
    const areas = [...selAreas]; // from checkbox selections
    // Add areas from multi picks (packages like full makeover, wall tiles)
    multiPicks.forEach(id => {
      const item = [...MULTI_ITEMS, MULTI_PM].find(m => m.id === id);
      if (item) areas.push(item.area);
    });
    // Single mode fallback
    if (mode === "single" && selArea && !areas.includes(selArea)) areas.push(selArea);
    return [...new Set(areas)];
  })();

  // Build photo list based on active areas + service selections
  const buildPhotos = () => {
    const pl = [];
    let areas = mode === "single" ? [selArea] : [...activeAreas];

    // "full" makeover or "regrout_all" means all main areas
    if (areas.includes("full")) {
      areas = [...new Set([...areas.filter(a => a !== "full"), "shower", "bath", "basin", "vanity", "floor"])];
    }
    if (areas.includes("regrout_all")) {
      areas = [...new Set([...areas.filter(a => a !== "regrout_all"), "shower", "floor"])];
    }
    // Remove non-photo areas and deduplicate
    areas = [...new Set(areas.filter(a => a !== "maintenance"))];

    for (const a of areas) {
      if (PHOTOS[a]) {
        pl.push(...PHOTOS[a]);
        // Conditional: silicone junction for shower regrout+sil (single mode)
        if (a === "shower" && mode === "single") {
          const picks = svcPicks.shower || [];
          if (picks.includes("sh1")) pl.push(...(PHOTOS.shower_sil || []));
        }
        // Conditional: silicone junction for shower in multi mode (regrout = includes silicone)
        if (a === "shower" && mode === "multi" && multiPicks.includes("m_shower_regrout")) {
          pl.push(...(PHOTOS.shower_sil || []));
        }
        // Conditional: cabinet door for vanity respray (single mode)
        if (a === "vanity" && mode === "single") {
          const picks = svcPicks.vanity || [];
          if (picks.includes("vn2")) pl.push(...(PHOTOS.vanity_cabinet || []));
        }
      }
    }
    pl.push(...PHOTOS.extra);
    // Deduplicate by photo ID (safety net — prevents React key errors)
    const seen = new Set();
    return pl.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
  };

  // Build summary
  const buildSummary = () => {
    if (mode === "unsure") return [{ label: `"${unsureTxt}"`, area: "Description" }];
    if (mode === "multi") return multiPicks.map(id => {
      const item = [...MULTI_ITEMS, MULTI_PM].find(m => m.id === id);
      return item ? { label: item.label, area: item.trade } : null;
    }).filter(Boolean);
    // Single area with service picks
    return (svcPicks[selArea] || []).map(sid => {
      const svc = (SVCS[selArea] || []).find(s => s.id === sid);
      const area = AREAS.find(a => a.id === selArea);
      return svc ? { label: svc.label, area: area?.label, ep: epoxyPicks[selArea] } : null;
    }).filter(Boolean);
  };

  const totalSteps = 5; // Always show 5 — multi/unsure skip step 4 but customer sees consistent progress
  const stepNum = step === "about" ? 1 : step === "where" ? 2 : step === "what" ? 3 : step === "services" ? 4 : 5;

  const back = () => {
    if (step === "where") setStep("about");
    else if (step === "what") setStep("where");
    else if (step === "services") setStep("what");
    // Photos → services for both single + multi modes (multi now has services
    // step). Unsure mode skips services so back from photos goes to "what".
    else if (step === "photos") { if (mode === "unsure") setStep("what"); else setStep("services"); }
  };

  /* ─── WEBHOOK CONFIG ─── */
  const GHL_WEBHOOK = "https://services.leadconnectorhq.com/hooks/LOCATION_ID/webhook-trigger/REPLACE_ME";
  const GHL_PARTIAL = "https://services.leadconnectorhq.com/hooks/LOCATION_ID/webhook-trigger/REPLACE_ME_PARTIAL";

  /* ─── PARTIAL LEAD (abandoned form recovery) ─── */
  const partialSent = useRef(false);
  const sendPartialLead = () => {
    if (partialSent.current) return;
    partialSent.current = true;
    const phone = noPhone ? "" : `+61${phNorm.replace(/^0/, "")}`;
    fetch(GHL_PARTIAL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: fn, lastName: ln, email: em, phone, customData: { form_status: "partial", step_reached: step, customer_type: cust, ...tracking } }),
    }).catch(() => {});
  };

  /* ─── WAITLIST CAPTURE (out-of-NSW user clicks "Notify me") ─── */
  // Reuses GHL_PARTIAL with form_status="waitlist" so the GHL workflow can
  // branch on the flag (welcome-when-we-expand sequence vs. quote follow-up).
  const sendWaitlistSignup = () => {
    if (waitlistSent) return;
    setWaitlistSent(true); // optimistic UI — show thanks immediately
    const phone = noPhone ? "" : `+61${phNorm.replace(/^0/, "")}`;
    fetch(GHL_PARTIAL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: fn, lastName: ln, email: em, phone,
        customData: { form_status: "waitlist", out_of_area_address: addr, customer_type: cust || "", ...tracking },
      }),
    }).catch(() => {}); // optimistic — never block UX on webhook errors
  };

  /* ─── FULL SUBMIT ─── */
  const handleSubmit = async () => {
    // Honeypot trip: bot filled the hidden field. Fake success so they don't retry.
    if (honeypot) {
      setSubmitting(false);
      setDone(true);
      return;
    }
    setSubmitting(true);
    const phone = noPhone ? "" : `+61${phNorm.replace(/^0/, "")}`;

    // Build services string
    let servicesStr = "";
    if (mode === "single") {
      servicesStr = (svcPicks[selArea] || []).map(sid => {
        const svc = (SVCS[selArea] || []).find(s => s.id === sid);
        return svc ? `${svc.label} (${svc.trade})` : sid;
      }).join(", ");
    } else if (mode === "multi") {
      servicesStr = multiPicks.map(id => {
        const item = [...MULTI_ITEMS, MULTI_PM].find(m => m.id === id);
        return item ? item.label : id;
      }).join(", ");
    } else if (mode === "unsure") {
      servicesStr = `Not sure: ${unsureTxt}`;
    }

    // Count photos selected
    const photoCount = Object.keys(allPhotos.current).length;

    const payload = {
      firstName: fn,
      lastName: ln,
      email: em,
      phone,
      customData: {
        // Customer info
        customer_type: cust || "",
        company_name: co || "",
        tenant_auth: tenAuth || "",
        landlord_email: llEm || "",
        // Property
        property_type: prop || "",
        property_address: addr,
        lift_access: prop === "apt" ? (lift || "not_specified") : "n/a",
        built_before_1990: builtBefore1990 || "not_asked",
        // Bathroom
        areas_selected: activeAreas.join(", "),
        services_selected: servicesStr,
        mode: mode || "",
        shower_over_bath: showerOverBath || "not_specified",
        epoxy_preference: Object.entries(epoxyPicks).filter(([,v]) => v).map(([area, val]) => `${area}: ${val}`).join(", ") || "standard",
        basin_count: basinCnt || "1",
        bath_type: isSpa === "yes" ? "spa" : isSpa === "no" ? "standard" : "not_specified",
        // Condition questions
        previously_resurfaced: prevResurfaced || "not_asked",
        ventilation: hasVentilation || "not_asked",
        // Notes + consent
        customer_notes: notes,
        marketing_consent: consent ? "yes" : "no",
        // Photos
        photo_count: String(photoCount),
        photos_uploaded: photoCount > 0 ? "yes" : "no",
        // TODO: Upload photos to cloud storage and pass URLs here
        // photo_urls: uploadedUrls.join(", "),
        // Tracking
        ...tracking,
        // Meta
        form_status: "complete",
        form_version: "v9.2",
        submitted_at: new Date().toISOString(),
        user_agent: navigator.userAgent,
        device_type: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
      },
    };

    // Retry on network errors and 5xx with exponential backoff (1s, 2s, 4s).
    // 4xx responses (bad request, auth) don't retry — they'll never succeed.
    // We keep showing success regardless so a flaky network never punishes the
    // customer; the worst case is a missed lead, which we surface via console
    // (replace with Sentry / WP REST fallback in Phase 4).
    let succeeded = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(GHL_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) { succeeded = true; break; }
        // 4xx = won't succeed on retry; bail
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
      // Lead may be lost. Log loudly so dev tools / Sentry / Cloudflare logs
      // capture it. Future Phase 4: POST to a WP REST fallback endpoint that
      // emails Allan directly so a lead never disappears.
      console.error("All webhook retries failed — lead at risk:", { firstName: fn, phone, email: em });
    }
    // Clear localStorage on success — no point keeping data if they've submitted
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setSubmitting(false);
    setDone(true);
  };

  if (done) return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", maxWidth: 480, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>{I.check(32)}</div>
      <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: C.pri, letterSpacing: "-0.02em" }}>Thanks {fn}!</h2>
      {noPhone || phIsLandline ? (
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 20px" }}>We&rsquo;ll email your quote to <strong style={{ color: C.pri }}>{em}</strong> by the next business day.</p>
      ) : (<>
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 6px" }}>We&rsquo;ll text <strong style={{ color: C.pri }}>{phNorm.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}</strong> by the next business day with your quote.</p>
        <p style={{ fontSize: 13, color: C.sec, margin: "0 0 20px" }}>A copy is on its way to <strong>{em}</strong> too.</p>
      </>)}
      <div style={{ padding: 12, background: C.surfLow, borderRadius: 10, fontSize: 12, color: C.sec, marginBottom: 16 }}><span style={{ color: C.acc }}>&#9733;</span> 4.9 from Sydney bathrooms</div>

      {/* Phone CTA — captures impatient leads who don't want to wait
          for a callback. Tel: link launches dialer on mobile. */}
      <a href="tel:+61451110154" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: 14, borderRadius: 10, background: C.pri, color: C.white, fontSize: 14, fontWeight: 700, textDecoration: "none", marginBottom: 10, boxSizing: "border-box" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        Need it sooner? Call 0451 110 154
      </a>

      <button type="button" onClick={() => {
        // Reset bathroom-specific state. Persona-level data (name, phone, email,
        // customer type, address, property type, tenancy) intentionally KEPT
        // because "another bathroom" implies same property + same person.
        setDone(false);
        setStep("what");
        setMode(null);
        setSelAreas([]); setSelArea(null); setMultiPicks([]);
        setSvcPicks({}); setEpoxyPicks({});
        setBasinCnt(null); setLift(null); setIsSpa(null);
        setShowerOverBath(null); setPrevResurfaced(null); setHasVentilation(null);
        setUnsureTxt(""); setNotes(""); setConsent(false);
        // builtBefore1990 NOT reset — same property, same age; user already answered.
        // Photos collected via ref need explicit clearing (otherwise old photos
        // re-submit with the next job).
        allPhotos.current = {};
        // Allow partial-lead webhook to fire again on the next abandoned form.
        partialSent.current = false;
        // Force PhotoUp to remount — its internal files/busy state is local
        // and survives parent state resets without this trick.
        setResetCount(c => c + 1);
      }} style={{ width: "100%", padding: 14, borderRadius: 10, border: `1.5px solid ${C.brd}`, background: C.white, color: C.pri, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
        Have another bathroom? Quote it here &rarr;
      </button>
      <p style={{ fontSize: 11, color: C.sec, marginTop: 6 }}>Your contact details are saved &mdash; just pick the areas</p>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", maxWidth: 480, margin: "0 auto", padding: "0 20px 32px" }}>
      <Trust />
      <StepBar n={stepNum} total={totalSteps} label={step === "about" ? "About you" : step === "where" ? "Location" : step === "what" ? "Your bathroom" : step === "services" ? "Services" : "Photos & submit"} />
      {step !== "about" && <Back onClick={back} />}

      {/* ═══ STEP 1 — ABOUT YOU ═══ */}
      {step === "about" && <>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: C.pri, letterSpacing: "-0.02em" }}>Bathroom resurfacing quote</h2>
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 20px" }}>We'll text your quote by the next business day — no obligation</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div><label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>First name *</label><input type="text" value={fn} onChange={e => setFn(e.target.value)} placeholder="First name" style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: `1.5px solid ${C.brd}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }} /></div>
            <div><label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Last name *</label><input type="text" value={ln} onChange={e => setLn(e.target.value)} placeholder="Last name" style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: `1.5px solid ${C.brd}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }} /></div>
          </div>
          {!noPhone ? (
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Phone *</label>
              <input type="tel" inputMode="numeric" autoComplete="tel" value={ph} onChange={e => setPh(formatAUPhone(e.target.value))} placeholder="Mobile or landline" style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: `1.5px solid ${ph.length > 3 && !phOk ? C.err : C.brd}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }} />
              {ph.length > 3 && !phFormatOk && <p style={{ fontSize: 12, color: C.err, marginTop: 5 }}>{ph.replace(/[\s\-\(\)\.]/g,"").startsWith("61") || ph.startsWith("+61") ? "We&rsquo;ll convert +61 to 0X format &mdash; keep typing" : "Enter an Australian phone (mobile starts 04, landline starts 02/03/07/08)"}</p>}
              {phSpam && <p style={{ fontSize: 12, color: C.err, marginTop: 5 }}>That doesn&rsquo;t look like a real phone number. Please enter your actual contact number.</p>}
              {phIsMobile && phOk && <p style={{ fontSize: 12, color: C.green, marginTop: 5 }}>We&rsquo;ll text your quote to {phNorm.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}</p>}
              {phIsLandline && phOk && <p style={{ fontSize: 12, color: C.green, marginTop: 5 }}>We&rsquo;ll email your quote (landline can&rsquo;t receive SMS)</p>}
              <button type="button" onClick={() => { setNoPhone(true); setPh(""); }} style={{ fontSize: 12, color: C.sec, background: "none", border: "none", cursor: "pointer", marginTop: 6, textDecoration: "underline", padding: "8px 4px", minHeight: 32 }}>I don&rsquo;t have a phone number</button>
            </div>
          ) : (
            <div style={{ padding: 14, background: C.greenBg, borderRadius: 10, borderLeft: `3px solid ${C.green}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>{I.check(18)}<div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>That&rsquo;s okay &mdash; we&rsquo;ll email you</div></div>
              <p style={{ fontSize: 12, color: C.sec, margin: "4px 0 8px", lineHeight: 1.4 }}>Your quote will be sent to your email below. No phone needed.</p>
              <button type="button" onClick={() => setNoPhone(false)} style={{ fontSize: 12, color: C.sec, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: "4px 0", minHeight: 32 }}>Actually, I do have a phone</button>
            </div>
          )}
          <div><label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Email *</label><input type="email" value={em} onChange={e => setEm(e.target.value)} placeholder="your@email.com" style={{ width: "100%", padding: "13px 14px", borderRadius: 10, border: `1.5px solid ${em.length > 3 && !emOk ? C.err : C.brd}`, fontSize: 15, fontFamily: "inherit", boxSizing: "border-box" }} />{em.length > 3 && !emOk && <p style={{ fontSize: 12, color: C.err, marginTop: 5 }}>Please enter a valid email address</p>}</div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Who are you? *</label>
            <OptGrid label="Who are you?" opts={[{ id: "owner", icon: I.house(), label: "Owner / Landlord" }, { id: "pm", icon: I.apt(), label: "Property Mgr" }, { id: "builder", icon: I.comm(), label: "Builder" }, { id: "tenant", icon: <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={C.pri} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4"/><circle cx="10" cy="11" r="3"/><path d="M21 10.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14"/><path d="M16 7h2M16 11h2"/></svg>, label: "Tenant" }]} val={cust} set={setCust} cols={2} />
            {(cust === "pm" || cust === "builder") && <input type="text" value={co} onChange={e => setCo(e.target.value)} placeholder="Company name (optional)" style={{ width: "100%", marginTop: 8, padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.brd}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }} />}
            {cust === "tenant" && <div style={{ marginTop: 8, padding: 10, background: C.warnBg, borderRadius: 10 }}><div style={{ fontSize: 12, fontWeight: 600, color: C.warn, marginBottom: 6 }}>Landlord approval needed</div><div role="group" aria-label="How will you get landlord approval?" style={{ display: "flex", gap: 6 }}>{[{ id: "self", l: "I'll get it" }, { id: "send", l: "Send to landlord" }].map(o => <button key={o.id} type="button" onClick={() => setTenAuth(o.id)} aria-pressed={tenAuth === o.id} style={{ flex: 1, padding: "12px 8px", minHeight: 44, borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: "pointer", border: tenAuth === o.id ? `2px solid ${C.warn}` : `1.5px solid ${C.brd}`, background: tenAuth === o.id ? C.warnBg : C.white, color: tenAuth === o.id ? C.warn : C.sec }}>{o.l}</button>)}</div>{tenAuth === "send" && <><p style={{ fontSize: 11, color: C.warn, marginTop: 6, marginBottom: 4 }}>We&rsquo;ll email them a copy of your quote for approval</p><input type="email" value={llEm} onChange={e => setLlEm(e.target.value)} placeholder="Landlord/agent email" style={{ width: "100%", padding: 8, borderRadius: 8, border: `1.5px solid ${llEm.length > 3 && !EMAIL_RE.test(llEm) ? C.err : C.brd}`, fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" }} />{llEm.length > 3 && !EMAIL_RE.test(llEm) && <p style={{ fontSize: 11, color: C.err, marginTop: 4 }}>Enter a valid email address</p>}<p style={{ fontSize: 10, color: C.sec, marginTop: 6, lineHeight: 1.4 }}>By providing this address, you confirm you have authority to share it. Your landlord/agent can request not to be contacted at any time.</p></>}</div>}
          </div>
        </div>
        <Btn onClick={() => { sendPartialLead(); setStep("where"); }} disabled={!can1}>{
          can1 ? "Next — where's the job? →"
          : (fn.length < 2 || ln.length < 2) ? "Add your name to continue"
          : (!phoneOk && !noPhone) ? "Enter a valid phone (or click “I don’t have a phone”)"
          : !emOk ? "Enter a valid email to continue"
          : !cust ? "Pick who you are above"
          : !tenantOk ? "Choose how to get landlord approval"
          : !llEmOk ? "Enter your landlord’s email"
          : "Fill required fields above"
        }</Btn>
        <p style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: C.sec }}>Takes ~90 seconds. No obligation.</p>
      </>}

      {/* ═══ STEP 2 — WHERE ═══ */}
      {step === "where" && <>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: C.pri, letterSpacing: "-0.02em" }}>Where's the job?</h2>
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 20px" }}>We service all of Greater Sydney & NSW</p>
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
                clearTimeout(addrDebounce.current);
                addrDebounce.current = setTimeout(() => fetchAddrSuggestions(v), 300);
              }}
              onFocus={() => addrSuggestions.length > 0 && setShowAddrDropdown(true)}
              onBlur={() => setTimeout(() => setShowAddrDropdown(false), 200)}
              placeholder="Start typing your full address&hellip;"
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
                    <div style={{ fontSize: 11, color: C.sec, marginBottom: 8, lineHeight: 1.4 }}>We&rsquo;re growing &mdash; want a heads-up when we expand to your area? We&rsquo;ll use the email + phone you already entered.</div>
                    <button
                      type="button"
                      onClick={sendWaitlistSignup}
                      disabled={!emOk || fn.length < 2}
                      style={{ padding: "10px 14px", borderRadius: 8, border: "none", background: emOk && fn.length >= 2 ? C.pri : C.brd, color: C.white, fontSize: 12, fontWeight: 600, cursor: emOk && fn.length >= 2 ? "pointer" : "not-allowed", fontFamily: "inherit" }}
                    >
                      Notify me when we expand &rarr;
                    </button>
                    {(!emOk || fn.length < 2) && <div style={{ fontSize: 10, color: C.sec, marginTop: 6 }}>Fill in your name + email above first.</div>}
                  </>
                ) : (
                  <div style={{ fontSize: 12, color: C.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    {I.check(16)} Thanks {fn}! We&rsquo;ll email you when we&rsquo;re servicing your area.
                  </div>
                )}
              </div>
            )}
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Property type *</label>
            <OptGrid label="Property type" opts={[{ id: "house", icon: I.house(), label: "House" }, { id: "apt", icon: I.apt(), label: "Apartment" }, { id: "comm", icon: I.comm(), label: "Commercial" }]} val={prop} set={setProp} />
            {prop === "apt" && <div style={{ display: "flex", gap: 6, marginTop: 8 }}>{["yes", "no"].map(v => <button key={v} onClick={() => setLift(v)} style={{ flex: 1, padding: 9, borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: lift === v ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: lift === v ? `${C.pri}08` : C.white, color: lift === v ? C.pri : C.sec }}>{v === "yes" ? "Has lift access" : "No lift (stairs)"}</button>)}</div>}
          </div>

          {/* Asbestos check (NSW) — restoring parity with the WP-side form.
              Excel rejection #8: pre-1990 properties may contain asbestos in
              tile adhesive / fibro sheeting. We don't BLOCK booking — just
              flag for the tradie to discuss clearance during quote call. */}
          <div style={{ padding: 12, background: C.warnBg, borderRadius: 10, borderLeft: `3px solid ${C.warn}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.warn, marginBottom: 4 }}>Asbestos check (NSW) *</div>
            <div style={{ fontSize: 12, color: C.sec, marginBottom: 8, lineHeight: 1.4 }}>Was the property built before 1990?</div>
            <div role="group" aria-label="Built before 1990?" style={{ display: "flex", gap: 6 }}>
              {[{ id: "no", l: "No" }, { id: "yes", l: "Yes" }, { id: "unsure", l: "Unsure" }].map(o => (
                <button key={o.id} type="button" onClick={() => setBuiltBefore1990(o.id)} aria-pressed={builtBefore1990 === o.id} style={{ flex: 1, padding: "10px 8px", minHeight: 44, borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", border: builtBefore1990 === o.id ? `2px solid ${C.warn}` : `1.5px solid ${C.brd}`, background: builtBefore1990 === o.id ? C.white : C.white, color: builtBefore1990 === o.id ? C.warn : C.sec }}>{o.l}</button>
              ))}
            </div>
            {builtBefore1990 === "yes" && <p style={{ fontSize: 11, color: C.sec, marginTop: 8, lineHeight: 1.4 }}>Got it &mdash; we&rsquo;ll discuss asbestos clearance during the quote call before we book.</p>}
            {builtBefore1990 === "unsure" && <p style={{ fontSize: 11, color: C.sec, marginTop: 8, lineHeight: 1.4 }}>No problem &mdash; we&rsquo;ll check with you during the quote call.</p>}
          </div>
        </div>
        <Btn onClick={() => setStep("what")} disabled={!can2}>Next — what does your bathroom need? →</Btn>
      </>}

      {/* ═══ STEP 3 — WHAT DOES YOUR BATHROOM NEED ═══ */}
      {step === "what" && <>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: C.pri, letterSpacing: "-0.02em" }}>What does your bathroom need?</h2>
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 6px" }}>Tick every area that needs work</p>
        <p style={{ fontSize: 11, color: C.sec, margin: "0 0 16px" }}>This quote is for one bathroom. Have more? You can submit again after.</p>

        {mode !== "unsure" ? (<>
          {/* Quick select: Full bathroom — at the top like v8 */}
          {(() => {
            const allMainAreas = ["shower","bath","basin","vanity","floor","walls"];
            const isFullSelected = allMainAreas.every(a => selAreas.includes(a));
            return <div onClick={() => {
              setMode("areas");
              if (isFullSelected) { setSelAreas([]); setMultiPicks(p => p.filter(id => id !== "m_full")); }
              else { setSelAreas([...allMainAreas]); setMultiPicks(p => [...new Set([...p, "m_full"])]); }
            }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", border: isFullSelected ? `2px solid ${C.pri}` : `1.5px solid ${C.acc}50`, borderRadius: 12, cursor: "pointer", background: isFullSelected ? `${C.pri}06` : `${C.acc}10`, marginBottom: 12, transition: "all 0.15s" }}>
              <input type="checkbox" checked={isFullSelected} readOnly style={{ width: 20, height: 20, accentColor: C.pri, pointerEvents: "none" }} />
              {I.sparkle()}<div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.pri }}>Full bathroom makeover</div>
                <div style={{ fontSize: 12, color: C.sec }}>Regrout, resurface, restore — the whole bathroom done</div>
              </div>
            </div>;
          })()}

          <div style={{ textAlign: "center", fontSize: 11, color: C.brd, margin: "0 0 10px" }}>or pick specific areas</div>

          {/* All areas as a flat list — including wall tiles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {AREAS.map(a => {
              const on = selAreas.includes(a.id);
              return <div key={a.id} onClick={() => { setMode("areas"); toggleArea(a.id); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: on ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, borderRadius: 12, cursor: "pointer", background: on ? `${C.pri}06` : C.white, transition: "all 0.15s" }}>
                <input type="checkbox" checked={on} readOnly style={{ width: 18, height: 18, accentColor: C.pri, pointerEvents: "none" }} />
                {typeof a.icon === 'function' ? a.icon() : a.icon}<div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 500, color: C.pri }}>{a.label}</div><div style={{ fontSize: 12, color: C.sec }}>{a.desc}</div></div>
              </div>;
            })}
          </div>

          {/* Shower vs Mould helper */}
          {selAreas.includes("shower") && !selAreas.includes("mould") && (
            <p style={{ fontSize: 11, color: C.sec, marginTop: 8, padding: "6px 10px", background: C.surfLow, borderRadius: 8 }}>
              Tip: "Shower" covers grout lines AND corner silicone. Only tick "Mould & Corners" if mould is OUTSIDE the shower (bath rim, toilet base).
            </p>
          )}

          {/* Shower-over-bath — only shows when both ticked */}
          {selAreas.includes("shower") && selAreas.includes("bath") && (
            <div style={{ marginTop: 12, padding: 12, background: C.surfLow, borderRadius: 10, border: `1px solid ${C.brd}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.pri, marginBottom: 8 }}>Is your bath also your shower?</div>
              <div style={{ display: "flex", gap: 6 }}>
                {[{ id: "yes", l: "Yes — shower over the bath" }, { id: "no", l: "No — they're separate" }].map(o => (
                  <button key={o.id} onClick={() => setShowerOverBath(o.id)} style={{ flex: 1, padding: 10, borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", border: showerOverBath === o.id ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: showerOverBath === o.id ? `${C.pri}08` : C.white, color: showerOverBath === o.id ? C.pri : C.sec }}>{o.l}</button>
                ))}
              </div>
            </div>
          )}

          {/* Not sure link */}
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button onClick={() => { setMode("unsure"); setSelAreas([]); }} style={{ fontSize: 13, color: C.sec, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Not sure what it needs? Describe it instead</button>
          </div>

          <Btn onClick={() => {
            if (selAreas.length === 1) { setMode("single"); setSelArea(selAreas[0]); }
            else { setMode("multi"); setSelArea(null); }
            setStep("services");
          }} disabled={selAreas.length === 0}>
            {selAreas.length === 0 ? "Tick at least one area" : selAreas.length === 1 ? "Next — tell us more →" : `Next — services for ${selAreas.length} areas →`}
          </Btn>
        </>) : null}

        {/* Not sure — describe it */}
        {mode === "unsure" && <div>
          <button onClick={() => { setMode(null); setUnsureTxt(""); }} style={{ fontSize: 12, color: C.sec, background: "none", border: "none", cursor: "pointer", textAlign: "left", marginBottom: 8 }}>← Back to area selection</button>
          <label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Describe your bathroom problem</label>
          <textarea value={unsureTxt} onChange={e => setUnsureTxt(e.target.value)} placeholder="e.g. Black mould everywhere, yellowed bath, grout cracking, tiles look dated..." rows={4} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1.5px solid ${C.brd}`, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
          {unsureTxt.length > 0 && unsureTxt.length < 10 && <p style={{ fontSize: 11, color: C.sec, marginTop: 4 }}>Tell us a bit more ({10 - unsureTxt.length} more characters)</p>}
          <Btn onClick={() => setStep("photos")} disabled={unsureTxt.length < 10}>Next — upload photos →</Btn>
        </div>}
      </>}

      {/* ═══ STEP 4 — SERVICES (single area) ═══ */}
      {step === "services" && mode === "single" && selArea && <>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: C.pri, letterSpacing: "-0.02em" }}>Your {AREAS.find(a => a.id === selArea)?.label.toLowerCase()}</h2>
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 16px" }}>Select all that apply</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(SVCS[selArea] || []).map(s => <SvcCard key={s.id} s={s} on={(svcPicks[selArea] || []).includes(s.id)} toggle={() => toggleSvc(selArea, s.id)} epV={epoxyPicks[selArea] || "standard"} setEp={v => setEpoxyPicks(p => ({ ...p, [selArea]: v }))} />)}
        </div>
        {selArea === "basin" && (svcPicks.basin || []).length > 0 && <div style={{ marginTop: 12, padding: 12, background: C.surfLow, borderRadius: 10 }}><div style={{ fontSize: 12, fontWeight: 600, color: C.pri, marginBottom: 6 }}>How many basins?</div><div style={{ display: "flex", gap: 6 }}>{[{ id: "1", l: "Just 1" }, { id: "2", l: "Double / 2" }].map(o => <button key={o.id} type="button" onClick={() => setBasinCnt(o.id)} aria-pressed={basinCnt === o.id} style={{ flex: 1, padding: 9, minHeight: 44, borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: basinCnt === o.id ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: basinCnt === o.id ? `${C.pri}08` : C.white, color: basinCnt === o.id ? C.pri : C.sec }}>{o.l}</button>)}</div></div>}
        {selArea === "bath" && (svcPicks.bath || []).includes("bt1") && <div style={{ marginTop: 12, padding: 12, background: C.surfLow, borderRadius: 10 }}><div style={{ fontSize: 12, fontWeight: 600, color: C.pri, marginBottom: 6 }}>Is this a spa bath (with jets)?</div><div style={{ display: "flex", gap: 6 }}>{[{ id: "no", l: "No — standard bath" }, { id: "yes", l: "Yes — spa with jets" }].map(o => <button key={o.id} type="button" onClick={() => setIsSpa(o.id)} aria-pressed={isSpa === o.id} style={{ flex: 1, padding: 9, minHeight: 44, borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: isSpa === o.id ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: isSpa === o.id ? `${C.pri}08` : C.white, color: isSpa === o.id ? C.pri : C.sec }}>{o.l}</button>)}</div></div>}
        <Btn onClick={() => setStep("photos")} disabled={(svcPicks[selArea] || []).length === 0 || (selArea === "bath" && (svcPicks.bath || []).includes("bt1") && !isSpa)}>Next — upload photos →</Btn>
      </>}

      {/* ═══ STEP 4 — SERVICES (multi area) ═══
          Renders services for each picked area on one screen. Compact rows
          (no before/after card images) keeps the page short. Wired into the
          existing svcPicks state — same data shape as single mode. */}
      {step === "services" && mode === "multi" && <>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: C.pri, letterSpacing: "-0.02em" }}>What does each area need?</h2>
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 16px" }}>Tick at least one service per area.</p>
        {selAreas.map(areaId => {
          const area = AREAS.find(a => a.id === areaId);
          const services = SVCS[areaId] || [];
          if (!area || services.length === 0) return null;
          const picked = svcPicks[areaId] || [];
          return (
            <div key={areaId} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                {typeof area.icon === 'function' ? area.icon(22) : area.icon}
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.pri, margin: 0 }}>{area.label}</h3>
                {picked.length === 0 && <span style={{ fontSize: 10, color: C.err, fontWeight: 600, marginLeft: "auto" }}>Pick at least one</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {services.map(s => {
                  const on = picked.includes(s.id);
                  return (
                    <label key={s.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 10, border: on ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: on ? `${C.pri}06` : C.white, cursor: "pointer" }}>
                      <input type="checkbox" checked={on} onChange={() => toggleSvc(areaId, s.id)} style={{ marginTop: 3, accentColor: C.pri, width: 16, height: 16, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: on ? C.pri : C.priC }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: C.sec, marginTop: 2 }}>{s.trade}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
              {/* Basin count nested */}
              {areaId === "basin" && picked.length > 0 && (
                <div style={{ marginTop: 8, padding: 10, background: C.surfLow, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.pri, marginBottom: 6 }}>How many basins?</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[{ id: "1", l: "Just 1" }, { id: "2", l: "Double / 2" }].map(o => <button key={o.id} type="button" onClick={() => setBasinCnt(o.id)} aria-pressed={basinCnt === o.id} style={{ flex: 1, padding: 8, minHeight: 44, borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: basinCnt === o.id ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: basinCnt === o.id ? `${C.pri}08` : C.white, color: basinCnt === o.id ? C.pri : C.sec }}>{o.l}</button>)}
                  </div>
                </div>
              )}
              {/* Spa flag nested — only when bath area + bt1 (resurface) picked */}
              {areaId === "bath" && picked.includes("bt1") && (
                <div style={{ marginTop: 8, padding: 10, background: C.surfLow, borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.pri, marginBottom: 6 }}>Is this a spa bath (with jets)?</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[{ id: "no", l: "No — standard bath" }, { id: "yes", l: "Yes — spa with jets" }].map(o => <button key={o.id} type="button" onClick={() => setIsSpa(o.id)} aria-pressed={isSpa === o.id} style={{ flex: 1, padding: 8, minHeight: 44, borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: "pointer", border: isSpa === o.id ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`, background: isSpa === o.id ? `${C.pri}08` : C.white, color: isSpa === o.id ? C.pri : C.sec }}>{o.l}</button>)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <Btn
          onClick={() => setStep("photos")}
          disabled={selAreas.some(a => (svcPicks[a] || []).length === 0) || (selAreas.includes("bath") && (svcPicks.bath || []).includes("bt1") && !isSpa)}
        >
          {selAreas.some(a => (svcPicks[a] || []).length === 0)
            ? "Pick at least one service per area"
            : (selAreas.includes("bath") && (svcPicks.bath || []).includes("bt1") && !isSpa)
              ? "Spa bath? answer above"
              : "Next — upload photos →"}
        </Btn>
      </>}

      {/* ═══ STEP 5 — PHOTOS + URGENCY + SUBMIT ═══ */}
      {step === "photos" && <>
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 6px", color: C.pri, letterSpacing: "-0.02em" }}>Almost done!</h2>
        <p style={{ fontSize: 14, color: C.sec, margin: "0 0 8px" }}>A few photos so we can quote accurately</p>
        <div style={{ padding: "8px 12px", background: C.warnBg, borderRadius: 10, fontSize: 11, color: C.warn, marginBottom: 16, lineHeight: 1.5 }}>Tip: Daylight or bathroom lights on — no flash. Stand back for wide shots, get close for damage.</div>

        {/* Quick details — only show for services where photos can't tell us enough */}
        {(selAreas.includes("bath") || selAreas.includes("walls") || activeAreas.includes("bath") || activeAreas.includes("walls") ||
          (svcPicks.shower || []).some(id => ["sh4"].includes(id)) || (svcPicks.walls || []).some(id => ["wl2"].includes(id))) && (
          <div style={{ marginBottom: 16, padding: 14, background: C.surfLow, borderRadius: 12, border: `1px solid ${C.brd}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.pri, marginBottom: 10 }}>Quick details to help us quote accurately</div>

            {/* Previously resurfaced — shows for bath, tile resurface, basin */}
            {(selAreas.includes("bath") || activeAreas.includes("bath") ||
              (svcPicks.shower || []).some(id => ["sh4"].includes(id)) ||
              (svcPicks.walls || []).some(id => ["wl2"].includes(id))) && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.pri, display: "block", marginBottom: 6 }}>Has this surface been resurfaced or recoated before?</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[{ id: "no", l: "No" }, { id: "yes", l: "Yes — it's been resurfaced" }, { id: "unsure", l: "Not sure" }].map(o => (
                    <button key={o.id} onClick={() => setPrevResurfaced(o.id)} style={{
                      flex: 1, padding: 9, borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: "pointer",
                      border: prevResurfaced === o.id ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`,
                      background: prevResurfaced === o.id ? `${C.pri}08` : C.white,
                      color: prevResurfaced === o.id ? C.pri : C.sec,
                    }}>{o.l}</button>
                  ))}
                </div>
                {prevResurfaced === "yes" && <p style={{ fontSize: 11, color: C.warn, marginTop: 6, padding: "4px 8px", background: C.warnBg, borderRadius: 6 }}>Previous coatings need to be stripped back first — we'll factor this into your quote.</p>}
              </div>
            )}

            {/* Ventilation — shows for any resurfacing (bath, tiles, walls, vanity spray) */}
            {(selAreas.includes("bath") || activeAreas.includes("bath") ||
              (svcPicks.shower || []).some(id => ["sh4"].includes(id)) ||
              (svcPicks.walls || []).some(id => ["wl2"].includes(id)) ||
              (svcPicks.vanity || []).some(id => ["vn2"].includes(id))) && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.pri, display: "block", marginBottom: 6 }}>Does the bathroom have a window or exhaust fan?</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[{ id: "yes", l: "Yes — window or fan" }, { id: "no", l: "No ventilation" }].map(o => (
                    <button key={o.id} onClick={() => setHasVentilation(o.id)} style={{
                      flex: 1, padding: 9, borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: "pointer",
                      border: hasVentilation === o.id ? `2px solid ${C.pri}` : `1.5px solid ${C.brd}`,
                      background: hasVentilation === o.id ? `${C.pri}08` : C.white,
                      color: hasVentilation === o.id ? C.pri : C.sec,
                    }}>{o.l}</button>
                  ))}
                </div>
                {hasVentilation === "no" && <p style={{ fontSize: 11, color: C.warn, marginTop: 6, padding: "4px 8px", background: C.warnBg, borderRadius: 6 }}>No worries — our technician will set up temporary ventilation. This may add a small amount to the quote.</p>}
              </div>
            )}
          </div>
        )}

        {mode === "unsure" ? <PhotoUp key={`unsure-${resetCount}`} photos={[...PHOTOS.not_sure, ...PHOTOS.extra]} onFilesChange={onPhotosChange} /> : <>
          {/* Group photos by area with headers */}
          {(() => {
            const photoList = buildPhotos();
            // Group by area prefix
            const groups = {};
            photoList.forEach(p => {
              const prefix3 = p.id.substring(0, 3);
              const prefix2 = p.id.substring(0, 2);
              const areaName = prefix3 === "pbs" ? "Basin" : prefix3 === "pns" ? "Photos" : prefix3 === "pex" ? "Extra" : prefix2 === "ps" ? "Shower" : prefix2 === "pb" ? "Bath" : prefix2 === "pv" ? "Vanity" : prefix2 === "pm" ? "Mould & Corners" : prefix2 === "pf" ? "Floor" : prefix2 === "pw" ? "Wall Tiles" : "Other";
              if (!groups[areaName]) groups[areaName] = [];
              groups[areaName].push(p);
            });
            return Object.entries(groups).map(([name, photos]) => (
              <div key={name} style={{ marginBottom: 16 }}>
                {Object.keys(groups).length > 1 && <div style={{ fontSize: 14, fontWeight: 600, color: C.pri, marginBottom: 8 }}>{name}</div>}
                <PhotoUp key={`photos-${resetCount}`} photos={photos} onFilesChange={onPhotosChange} />
              </div>
            ));
          })()}
        </>}

        {/* Summary */}
        <div style={{ marginTop: 20, padding: 14, background: C.surfLow, borderRadius: 12, border: `1px solid ${C.brd}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.pri, marginBottom: 10 }}>Quote summary</div>
          <div style={{ fontSize: 12, color: C.sec, marginBottom: 4 }}><strong style={{ color: C.pri }}>{fn} {ln}</strong>{co ? ` (${co})` : ""} {noPhone ? "" : `· ${phIsMobile ? phNorm.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3") : phNorm.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3")}`} · {em}</div>
          <div style={{ fontSize: 12, color: C.sec, marginBottom: 4 }}>{cust === "owner" ? "🏠 Homeowner" : cust === "pm" ? "🏢 Property Manager" : cust === "builder" ? "🔨 Builder" : cust === "tenant" ? "🔑 Tenant" : ""}{prop ? ` · ${prop === "house" ? "House" : prop === "apt" ? "Apartment" : "Commercial"}` : ""}{prop === "apt" && lift === "no" ? " · No lift (stairs)" : ""}</div>
          <div style={{ fontSize: 12, color: C.sec, marginBottom: 8 }}>{addr}</div>
          {buildSummary().map((s, i) => <div key={i} style={{ fontSize: 12, color: C.sec, padding: "3px 0" }}>• {s.area}: {s.label}{s.ep === "epoxy" ? <span style={{ fontSize: 9, background: C.greenBg, color: C.green, padding: "1px 6px", borderRadius: 4, fontWeight: 600, marginLeft: 4 }}>EPOXY</span> : ""}</div>)}
          {basinCnt === "2" && <div style={{ fontSize: 11, color: C.sec, padding: "3px 0" }}>• Double basin (2 basins)</div>}
          {showerOverBath === "yes" && <div style={{ fontSize: 11, color: C.pri, padding: "3px 0" }}>• Shower-over-bath (combined unit)</div>}
          {prevResurfaced && <div style={{ fontSize: 11, color: prevResurfaced === "yes" ? C.warn : C.sec, padding: "3px 0" }}>• Previously resurfaced: {prevResurfaced === "yes" ? "Yes — strip-back needed" : prevResurfaced === "unsure" ? "Not sure — will check on-site" : "No"}</div>}
          {hasVentilation && <div style={{ fontSize: 11, color: hasVentilation === "no" ? C.warn : C.sec, padding: "3px 0" }}>• Ventilation: {hasVentilation === "yes" ? "Window or fan" : "No ventilation — temp setup needed"}</div>}
          {tenAuth === "send" && llEm && <div style={{ fontSize: 11, color: C.sec, padding: "3px 0" }}>• Landlord approval: will email {llEm}</div>}
          {notes.trim() && <div style={{ fontSize: 11, color: C.sec, padding: "3px 0", fontStyle: "italic" }}>• Note: "{notes.trim().substring(0, 80)}{notes.trim().length > 80 ? "..." : ""}"</div>}
        </div>

        {/* Optional notes */}
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: C.pri, display: "block", marginBottom: 6 }}>Anything else we should know? <span style={{ fontWeight: 400, color: C.sec }}>(optional)</span></label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Built in the 1970s, only available Wednesdays, need a specific colour, have a deadline..." rows={2} style={{ width: "100%", padding: 12, borderRadius: 10, border: `1.5px solid ${C.brd}`, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", lineHeight: 1.5 }} />
        </div>

        {/* Marketing consent — Spam Act 2003 compliance */}
        <label style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 14, cursor: "pointer" }}>
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ width: 17, height: 17, marginTop: 2, accentColor: C.pri, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: C.sec, lineHeight: 1.5 }}>Optional: send me bathroom maintenance tips &amp; special offers (you can unsubscribe anytime)</span>
        </label>

        {/* Honeypot — invisible to humans, irresistible to dumb bots. Off-screen
            position + aria-hidden + tabindex=-1 keeps it out of the keyboard
            tab order and screen reader output, so real users never encounter it. */}
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

        <Btn onClick={handleSubmit} disabled={submitting}>{submitting ? "Sending..." : "Get my free quote →"}</Btn>
        <p style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: C.sec }}>Quote by the next business day. No obligation.</p>
        <p style={{ textAlign: "center", marginTop: 4, fontSize: 10, color: C.sec, lineHeight: 1.5 }}>By submitting, you agree we&rsquo;ll contact you about this quote. Your details are handled per our <a href="https://timelessresurfacing.com.au/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: C.pri, textDecoration: "underline" }}>Privacy Policy</a>.</p>
      </>}
    </div>
  );
}
