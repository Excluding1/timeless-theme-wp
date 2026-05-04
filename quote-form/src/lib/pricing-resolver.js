/**
 * pricing-resolver.js — Quote Form v10 → Master Pricing SKU Resolver
 *
 * Pure function. No React, no DOM, no network.
 *
 * Maps a v10 form submission to:
 *  - line_items[]      — array of SKU pools per service area
 *  - modifiers[]       — applicable modifier IDs from master pricing
 *  - rejection_flags[] — pre-quote checks that block or warn
 *  - tier_default      — recommended price tier (T1/T2/T3) by customer type
 *  - multi_bathroom_discount — flat $ off when bathroom_index > 1
 *
 * The resolver narrows the SKU pool from form data; the tradesperson picks
 * the final SKU after photo review (since photos disambiguate size, material,
 * spa-vs-standard, mosaic-vs-plain, cast-iron-vs-acrylic, etc.).
 *
 * Source of truth: data/pricing/master-pricing-2026-05-01-snapshot.xlsx
 *   - 141 SKUs across 33 categories
 *   - 29 modifier rules
 *   - 24 rejection criteria
 *
 * Usage:
 *   import { resolveQuote } from "./lib/pricing-resolver";
 *   const result = resolveQuote(formData);
 */

// ─────────────────────────────────────────────────────────────────
// SKU POOLS BY (area, service)
// ─────────────────────────────────────────────────────────────────
// Each pool is the FULL set of candidate SKUs the tradesperson chooses
// from after photo review. Wider pool = more flexibility on quote.

const AREA_SERVICE_SKUS = {
  shower: {
    // Full shower regrouting = grout lines + corner silicone bundled
    full_regrout: {
      cement: ["RGC-01", "RGC-02", "RGC-03", "RGC-04", "SIL-01"],
      epoxy: ["RGE-01", "RGE-02", "RGE-03", "RGE-04", "SIL-01"],
      description: "Full shower regrouting — grout lines and corner silicone replaced",
    },
    // Tile resurface (colour change)
    resurface: {
      pool: ["TSR-01", "TSR-02", "TSR-03", "TSR-04", "TSR-05", "TSR-06"],
      description: "Shower tile resurfacing — colour change over existing tiles",
    },
    // Both = combo SKU territory
    both: {
      pool: ["RSC-01", "RSC-02", "RSC-03", "RSC-04", "RSE-01", "RSE-02", "RSE-03", "RSE-04"],
      description: "Full shower transformation — regrout + resurface",
    },
  },

  bath: {
    resurface: {
      pool: ["BTH-01", "BTH-02", "BTH-03", "BTV-01", "BTV-02", "BTV-03", "BTV-04", "BTV-05", "BTV-06", "SIL-02"],
      description: "Bath/spa resurfacing — full spray coating + silicone seal",
    },
    // Broadened "chip" — now covers chips, scratches, burns, cracks, rust, polish, hard water
    chip: {
      pool: ["CHR-01", "CHR-02", "CHR-09", "CHR-11", "BRN-01", "CRK-01", "RST-01", "POL-01", "HWD-01"],
      description: "Bath/spa damage repair — chips, scratches, burns, cracks, rust, hard-water stains",
    },
    both: {
      pool: ["BTH-01", "BTH-02", "BTH-03", "CHR-01", "CHR-02", "CHR-11", "BRN-01", "RST-01"],
      description: "Bath/spa full restoration — resurface + repair any damage",
    },
  },

  basin_vanity: {
    full: {
      pool: ["BSN-02", "BSN-03", "VAN-01", "VAN-02", "VCR-01", "VCR-02", "LBR-01", "LBR-02"],
      description: "Full vanity resurfacing — basin, top, doors, drawer fronts",
    },
    // "custom" combines per-surface SKU pools based on which checkboxes the customer ticked.
    // The form sends `basin_custom_surfaces: { basin, bench, cabinet }` — the resolver unions the matching pools.
    custom: {
      surface_pools: {
        basin:   ["BSN-01", "BSN-02", "BSN-03"],          // standalone or add-on
        bench:   ["VAN-01", "VAN-02", "LBR-01", "LBR-02"], // moulded vanity / countertop / laminate top
        cabinet: ["VCR-01", "VCR-02"],                     // cabinet doors + drawers
      },
      description: "Custom basin/vanity scope — union of ticked surfaces' SKU pools",
    },
    chip_only: {
      pool: ["CHR-03", "CHR-08"],
      description: "Basin or vanity-top chip/scratch repair only",
    },
    stone_fleck: {
      pool: ["SFL-01"],
      description: "Stone-fleck premium speckled finish on benchtop",
    },
    // Universal chip-repair add-on (any surface, same visit) — fired when chipRepairAddon[basin_vanity] is true
    chip_repair_addon: {
      pool: ["CHR-10", "CHR-03", "CHR-08"],
      description: "Chip/scratch repair add-on for basin/vanity work",
    },
  },

  walls: {
    regrout: {
      cement: ["BWR-01"],
      epoxy: ["BWR-02"],
      description: "Wall regrouting — grout lines on tiled walls outside shower",
    },
    resurface: {
      pool: ["TSR-10", "TSR-11"],
      description: "Wall tile resurfacing — colour change",
    },
    both: {
      pool: ["BWR-01", "BWR-02", "TSR-10", "TSR-11"],
      description: "Walls — regrout + tile colour change",
    },
    chip_repair: {
      pool: ["CHR-04", "CHR-05"],
      description: "Wall tile chip/crack repair — filled and colour-matched (no tile replacement)",
    },
  },

  floor: {
    regrout: {
      cement: ["BFR-01", "BFR-02"],
      epoxy: ["BFR-03", "BFR-04"],
      description: "Floor tile regrouting",
    },
    resurface: {
      pool: ["TSR-07", "TSR-08", "TSR-09"],
      description: "Floor tile resurfacing — colour change with anti-slip additive",
    },
    both: {
      pool: ["BFR-01", "BFR-02", "BFR-03", "BFR-04", "TSR-07", "TSR-08", "TSR-09"],
      description: "Floor — regrout + tile colour change",
    },
    chip_repair: {
      pool: ["CHR-04", "CHR-05"],
      description: "Floor tile chip/crack repair — filled and colour-matched (no tile replacement)",
    },
  },
};

// Full-bathroom packages (when customer toggles "Full bathroom makeover")
const FULL_BATHROOM_SKUS = {
  regrout_only: {
    cement: ["FBR-01", "FBR-02"],
    epoxy: ["FBR-03", "FBR-04"],
    description: "Full bathroom regrout — every grout line and silicone joint",
  },
  resurface_only: {
    pool: ["FBP-03", "FBP-04"],
    description: "Full bathroom resurface — bath, tiles, vanity all coated",
  },
  both: {
    pool: ["FBP-01", "FBP-02", "FBP-05", "FBP-06"],
    description: "Full bathroom transformation — regrout + resurface bundle",
  },
};

// ─────────────────────────────────────────────────────────────────
// CUSTOMER TIER DEFAULTS
// ─────────────────────────────────────────────────────────────────
// Tier defaults; tradesperson can override at quote time.
// T1 = trade/volume pricing (PMs with 5+ jobs/quarter, builders on multi-job)
// T2 = standard owner-occupier (default, ~80% of jobs)
// T3 = premium pricing (urgency, awkward access, full custom colour, etc.)

const TIER_DEFAULTS = {
  owner: "T2",
  pm: "T1",       // property managers expect trade pricing
  builder: "T1",  // builders bundle multiple jobs
  tenant: "T2",   // tenants pay owner-equivalent (or routed through landlord)
};

// ─────────────────────────────────────────────────────────────────
// MODIFIERS
// ─────────────────────────────────────────────────────────────────
// Modifier IDs match master pricing "Modifiers" sheet. Values shown for
// reference only — actual amounts come from the master pricing sheet at
// quote-build time (so price changes don't require code changes here).

const MODIFIER_RULES = {
  // R5: Strip-back coating — applies when customer reports previously resurfaced
  strip_back: {
    id: "R5",
    label: "Strip-back previous coating",
    delta: 250,
    triggers: (form) => form.previously_resurfaced === "yes",
  },
  // R6: Epoxy upgrade — applies when customer chose epoxy on regrout work
  epoxy_upgrade: {
    id: "R6",
    label: "Epoxy grout upgrade",
    delta: 250,
    triggers: (form) => form.epoxy_mode === "epoxy" && hasRegroutWork(form),
  },
  // R14: Multi-storey access — apartments without lift
  multi_storey: {
    id: "R14",
    label: "Multi-storey access (no lift)",
    delta: 80,
    triggers: (form) => form.property_type === "apt" && form.lift_access === "no",
  },
  // R19: Temporary ventilation setup — bathroom has no window or fan
  ventilation_setup: {
    id: "R19",
    label: "Temporary ventilation setup",
    delta: 100,
    triggers: (form) => form.has_ventilation === "no" && hasChemicalWork(form),
  },
  // Multi-bathroom discount — applied when this is bathroom 2+ in same submission session
  multi_bathroom: {
    id: "DISC-MB",
    label: "Multi-bathroom discount",
    delta_lookup: (form) => {
      if (form.bathroom_index === 2) return -200;
      if (form.bathroom_index >= 3) return -300;
      return 0;
    },
    triggers: (form) => form.bathroom_index > 1,
  },
};

// ─────────────────────────────────────────────────────────────────
// REJECTION FLAGS
// ─────────────────────────────────────────────────────────────────
// These don't block the quote — they flag conditions that need handling
// (asbestos clearance, hollow tile testing, leak inspection) before booking.

const REJECTION_FLAGS = {
  pre_1990_asbestos: {
    id: "REJ-08",
    severity: "warn",
    label: "Pre-1990 property — asbestos clearance check needed",
    note: "Confirm clearance certificate before disturbing tile adhesive or fibro substrate",
    triggers: (form) => form.built_before_1990 === "yes",
  },
  pre_1990_unsure: {
    id: "REJ-08-UNSURE",
    severity: "info",
    label: "Property age unsure — asbestos check on quote call",
    triggers: (form) => form.built_before_1990 === "unsure",
  },
};

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

function hasRegroutWork(form) {
  if (form.full_bathroom_scope === "regrout_only" || form.full_bathroom_scope === "both") return true;
  const regroutServices = ["full_regrout", "regrout", "both"];
  return Object.values(form.area_services || {}).flat().some((s) => regroutServices.includes(s));
}

function hasChemicalWork(form) {
  // Resurfacing AND regrouting both involve chemical fumes (per master pricing R19).
  if (form.full_bathroom_scope) return true;
  return Object.values(form.area_services || {}).flat().length > 0;
}

function poolForService(area, serviceId, form) {
  const cfg = AREA_SERVICE_SKUS[area]?.[serviceId];
  if (!cfg) return [];
  // Custom basin/vanity — union per-surface SKU pools based on what the customer ticked.
  if (cfg.surface_pools) {
    const surfaces = form.basin_custom_surfaces || {};
    const pool = [];
    for (const [surface, ticked] of Object.entries(surfaces)) {
      if (ticked && cfg.surface_pools[surface]) pool.push(...cfg.surface_pools[surface]);
    }
    return [...new Set(pool)]; // dedupe
  }
  // Cement vs epoxy — regrout services have both pools, pick by mode.
  const epoxyMode = form.epoxy_mode || "standard";
  if (cfg.cement && cfg.epoxy) {
    return epoxyMode === "epoxy" ? cfg.epoxy : cfg.cement;
  }
  return cfg.pool || [];
}

function descriptionForService(area, serviceId, form) {
  const cfg = AREA_SERVICE_SKUS[area]?.[serviceId];
  if (!cfg) return `${area} — ${serviceId}`;
  // Custom basin/vanity — describe the ticked surfaces, not the generic "Custom" label
  if (cfg.surface_pools && form?.basin_custom_surfaces) {
    const ticked = Object.entries(form.basin_custom_surfaces).filter(([, v]) => v).map(([k]) => k);
    if (ticked.length) {
      const labels = { basin: "basin", bench: "benchtop", cabinet: "vanity cabinet (doors + drawers)" };
      return `Custom basin/vanity scope: ${ticked.map(t => labels[t]).join(" + ")}`;
    }
  }
  return cfg.description || `${area} — ${serviceId}`;
}

// ─────────────────────────────────────────────────────────────────
// MAIN RESOLVER
// ─────────────────────────────────────────────────────────────────

/**
 * Resolve a v10 form submission to a structured quote skeleton.
 *
 * @param {Object} form — v10 form payload
 * @param {string} form.customer_type — "owner" | "pm" | "builder" | "tenant"
 * @param {string} form.property_type — "house" | "apt" | "comm"
 * @param {string} [form.lift_access] — "yes" | "no" (apartments only)
 * @param {string} form.bathroom_count — "1" | "2" | "3+"
 * @param {number} form.bathroom_index — 1-based index of this submission in a multi-bathroom batch
 * @param {string} form.built_before_1990 — "yes" | "no" | "unsure"
 * @param {string} [form.full_bathroom_scope] — "regrout_only" | "resurface_only" | "both"
 * @param {Object} [form.area_services] — { areaId: [serviceId] }
 * @param {string} [form.epoxy_mode] — "standard" | "epoxy"
 * @param {string} [form.previously_resurfaced] — "yes" | "no" | "unsure"
 * @param {string} [form.has_ventilation] — "yes" | "no"
 * @returns {Object} resolved quote skeleton
 */
export function resolveQuote(form) {
  const lineItems = [];
  const epoxyMode = form.epoxy_mode || "standard";

  // FULL BATHROOM PATH — overrides per-area selections
  if (form.full_bathroom_scope) {
    const cfg = FULL_BATHROOM_SKUS[form.full_bathroom_scope];
    let pool = cfg.pool || [];
    if (cfg.cement && cfg.epoxy) {
      pool = epoxyMode === "epoxy" ? cfg.epoxy : cfg.cement;
    }
    lineItems.push({
      area: "full_bathroom",
      service: form.full_bathroom_scope,
      sku_pool: pool,
      description: cfg.description,
    });
  } else {
    // PER-AREA PATH
    for (const [area, services] of Object.entries(form.area_services || {})) {
      for (const serviceId of services) {
        const pool = poolForService(area, serviceId, form);
        if (pool.length > 0) {
          lineItems.push({
            area,
            service: serviceId,
            sku_pool: pool,
            description: descriptionForService(area, serviceId, form),
          });
        }
      }
    }
    // CHIP-REPAIR ADD-ONS (per-area) — fired when customer ticked the upgrade toggle
    const chipAddons = form.chip_repair_addon || {};
    for (const [area, enabled] of Object.entries(chipAddons)) {
      if (!enabled) continue;
      // Prefer dedicated chip_repair_addon pool; fall back to area's chip_repair entry.
      const cfg = AREA_SERVICE_SKUS[area]?.chip_repair_addon || AREA_SERVICE_SKUS[area]?.chip_repair;
      if (cfg?.pool) {
        lineItems.push({
          area,
          service: "chip_repair_addon",
          sku_pool: cfg.pool,
          description: cfg.description,
          is_addon: true,
        });
      }
    }
    // STONE-FLECK PREMIUM FINISH — fired when basin_finish === "stone_fleck" and basin/vanity has resurface work
    if (form.basin_finish === "stone_fleck") {
      const cfg = AREA_SERVICE_SKUS.basin_vanity?.stone_fleck;
      if (cfg?.pool) {
        lineItems.push({
          area: "basin_vanity",
          service: "stone_fleck",
          sku_pool: cfg.pool,
          description: cfg.description,
          is_addon: true,
        });
      }
    }
  }

  // Modifiers
  const modifiers = [];
  for (const [key, rule] of Object.entries(MODIFIER_RULES)) {
    if (rule.triggers(form)) {
      modifiers.push({
        key,
        id: rule.id,
        label: rule.label,
        delta: rule.delta_lookup ? rule.delta_lookup(form) : rule.delta,
      });
    }
  }

  // Rejection flags
  const rejectionFlags = [];
  for (const [key, rule] of Object.entries(REJECTION_FLAGS)) {
    if (rule.triggers(form)) {
      rejectionFlags.push({
        key,
        id: rule.id,
        severity: rule.severity,
        label: rule.label,
        note: rule.note || "",
      });
    }
  }

  // Tier
  const tier = TIER_DEFAULTS[form.customer_type] || "T2";

  // Multi-bathroom discount (computed for convenience even though it's also in modifiers)
  const multiBathroomDiscount =
    form.bathroom_index > 1
      ? form.bathroom_index === 2
        ? -200
        : -300
      : 0;

  return {
    line_items: lineItems,
    modifiers,
    rejection_flags: rejectionFlags,
    tier_default: tier,
    multi_bathroom_discount: multiBathroomDiscount,
    bathroom_count: form.bathroom_count,
    bathroom_index: form.bathroom_index,
    epoxy_mode: epoxyMode,
    customer_type: form.customer_type,
    resolved_at: new Date().toISOString(),
  };
}

// Exported for tests and debugging
export const _internal = {
  AREA_SERVICE_SKUS,
  FULL_BATHROOM_SKUS,
  TIER_DEFAULTS,
  MODIFIER_RULES,
  REJECTION_FLAGS,
};
