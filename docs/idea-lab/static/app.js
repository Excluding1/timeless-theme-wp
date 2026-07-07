/* Idea Lab frontend. DOM-built rendering (no innerHTML with data). */
"use strict";

const $ = (id) => document.getElementById(id);

const state = { ideas: [], analyses: [], plans: [], job: null, lastJob: "", engine: null };

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  for (const c of children) if (c) node.append(c);
  return node;
}

async function api(path, opts = {}) {
  const res = await fetch(path, { headers: { "Content-Type": "application/json" }, ...opts });
  if (!res.ok) {
    let msg = `${res.status}`;
    try { msg = (await res.json()).detail || msg; } catch (_) {}
    throw new Error(msg);
  }
  return res.json();
}

/* ---------- polling ---------- */

async function poll() {
  try {
    const s = await api("/api/state");
    state.job = s.job;
    state.engine = s.engine;
    state.fetch = s.fetch;
    state.batch = s.batch;
    state.categorize = s.categorize;
    state.generate = s.generate;
    state.simulate = s.simulate;
    renderJob();
    renderEngine();
    renderFetch();
    renderBatch();
    renderGenerate();
    renderSimulate();
    const key = s.job ? `${s.job.state}:${s.job.phase}` : "idle";
    const fkey = s.fetch ? `${s.fetch.running}:${s.fetch.phase}` : "";
    const gkey = s.generate ? `${s.generate.running}:${s.generate.phase}` : "";
    const ckey = s.categorize ? `${s.categorize.running}:${s.categorize.done}` : "";
    const skey = s.simulate ? `${s.simulate.running}:${s.simulate.phase}` : "";
    if (key !== state.lastJob || fkey !== state.lastFetch || gkey !== state.lastGen ||
        ckey !== state.lastCat || skey !== state.lastSim) {
      state.lastJob = key; state.lastFetch = fkey; state.lastGen = gkey;
      state.lastCat = ckey; state.lastSim = skey;
      loadIdeas();
      loadAnalyses();
      loadPlans();
      loadSims();
    }
  } catch (_) {}
  setTimeout(poll, 2000);
}

function renderGenerate() {
  const g = state.generate;
  if (!g) return;
  $("generateBtn").disabled = !!g.running;
  const box = $("genStatus");
  if (g.running) box.textContent = "Generating… " + (g.phase || "");
  else if (g.phase === "error") box.textContent = "Error: " + (g.error || "generation failed");
  else if (g.made) box.textContent = `Generated ${g.made} fresh ideas — filter source to “✦ Generated” below.`;
}

function renderSimulate() {
  const s = state.simulate;
  const host = $("sims");
  if (!host) return;
  let p = $("simRunning");
  if (!p) {
    p = el("p", { class: "hint", id: "simRunning" });
    host.parentNode.insertBefore(p, host);
  }
  p.textContent = s && s.running ? `Simulating “${s.title}” — ${s.phase}…` : "";
  p.hidden = !(s && s.running);
}

function renderFetch() {
  const f = state.fetch;
  $("fetchAll").disabled = !!(f && f.running);
  if (f && f.running) {
    $("fetchStatus").textContent = "Fetching everything… " + (f.phase || "");
  } else if (f && f.phase === "done" && f.results && Object.keys(f.results).length) {
    const parts = Object.entries(f.results).map(([k, v]) => `${k}: ${v}`);
    $("fetchStatus").textContent = "Last full fetch — " + parts.join(" · ");
  }
}

function renderBatch() {
  const b = state.batch;
  if (!b) return;
  $("stopBatch").hidden = !b.running;
  $("startBatch").disabled = !!b.running;
  if (b.running) {
    $("batchStatus").textContent =
      `Batch running — ${b.done}/${b.total} done` + (b.failed ? ` (${b.failed} failed)` : "") +
      (b.current_title ? ` · now: ${b.current_title}` : "") + ` · ${b.queued} queued`;
  } else if (b.total) {
    $("batchStatus").textContent = `Last batch: ${b.done}/${b.total} completed` +
      (b.failed ? ` (${b.failed} failed)` : "") + " — see Execution Plans below.";
  }
}

function renderEngine() {
  const e = state.engine;
  const b = $("engineBadge");
  if (!e) { b.hidden = true; return; }
  b.hidden = false;
  b.textContent = e.engine === "claude" ? "🧠 Claude + web research ✓"
    : e.engine === "codex" ? "🧠 Codex — click to upgrade to Claude"
    : e.engine === "detecting" ? "🧠 detecting engine…"
    : "⚠ no AI engine";
  b.title = e.detail || "";
  b.className = "chip " + (e.engine === "none" ? "error" : e.engine === "claude" ? "good" : "");
  b.style.cursor = e.engine === "codex" ? "pointer" : "default";
  b.onclick = e.engine === "codex" ? () => {
    alert("To upgrade to Claude (better AI + live web research):\n\n" +
      "1. On your Desktop, double-click \"Log in to Claude (for Idea Lab).command\"\n" +
      "2. Approve in the browser window that opens\n\n" +
      "That's it — Idea Lab auto-connects within ~90 seconds. You never press anything here.");
  } : null;
}

function renderJob() {
  const j = state.job;
  $("testIdea").disabled = !!(j && j.state === "running");
  const badge = $("jobBadge");
  if (j && j.state === "running") {
    badge.hidden = false;
    badge.textContent = `⚙ ${j.title} — ${j.phase}`;
    badge.className = "chip running";
  } else if (j && j.state === "error") {
    badge.hidden = false;
    badge.textContent = "⚠ " + j.phase;
    badge.className = "chip error";
  } else {
    badge.hidden = true;
  }
}

/* ---------- ideas feed ---------- */

async function loadIdeas() {
  const p = new URLSearchParams();
  if ($("originFilter").value) p.set("origin", $("originFilter").value);
  if ($("categoryFilter").value) p.set("category", $("categoryFilter").value);
  if ($("search").value.trim()) p.set("q", $("search").value.trim());
  let r;
  try { r = await api("/api/ideas?" + p); } catch (_) { return; }
  state.ideas = r.ideas;
  state.ideaTotal = r.total != null ? r.total : r.ideas.length;
  state.sourceCounts = r.source_counts || {};
  renderCategories(r.categories || []);
  renderIdeas();
}

function renderCategories(cats) {
  const sel = $("categoryFilter");
  const cur = sel.value;
  sel.replaceChildren(el("option", { value: "", text: "All categories" }));
  for (const c of cats) {
    sel.append(el("option", { value: c.category, text: `${c.category} (${c.n})` }));
  }
  sel.value = cur;
}

const ORIGIN = { ih: "IndieHackers", hn: "Show HN", ahn: "Ask HN", ph: "Product Hunt",
  gh: "GitHub", dt: "Dev.to", lb: "Lobsters", rd: "Reddit", v2: "V2EX·CN", ss: "Starter Story",
  feed: "Feed", vid: "Video", gen: "Generated", custom: "Mine" };

function fmtMoney(n) {
  n = Number(n) || 0;
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return "$" + Math.round(n / 1e3) + "k";
  return "$" + Math.round(n);
}

function trendBadge(i) {
  if (i.momentum == null) return null;
  let dir = "flat", arrow = "→";
  try { const t = typeof i.trend_json === "string" ? JSON.parse(i.trend_json) : i.trend_json;
    if (t && t.direction) { dir = t.direction; arrow = dir === "rising" ? "↑" : dir === "falling" ? "↓" : "→"; } } catch (_) {}
  return el("span", { class: "trendbadge " + dir,
    title: "Google Trends interest (0-100) and direction — factors into ranking",
    text: `📈 ${Math.round(i.momentum)} ${arrow}` });
}

function safeUrl(u) {
  return u && /^https?:\/\//i.test(u) ? u : null;
}

function renderIdeas() {
  const box = $("ideas");
  box.replaceChildren();
  const busy = !!(state.job && state.job.state === "running");
  for (const i of state.ideas.slice(0, 120)) {
    const row = el("div", { class: "idea" },
      el("div", { class: "col grow" },
        el("div", { class: "ititle" },
          el("span", { class: "obadge " + i.origin, text: ORIGIN[i.origin] || i.origin }),
          safeUrl(i.url) ? el("a", { href: safeUrl(i.url), target: "_blank", rel: "noopener", text: " " + i.title })
                         : el("span", { text: " " + i.title }),
        ),
        i.description ? el("div", { class: "idesc", text: i.description.slice(0, 220) }) : null,
        el("div", { class: "imeta" },
          i.origin === "ih" && i.points > 0
            ? el("span", { class: "revbadge", title: "Reported monthly revenue on IndieHackers",
                text: `💰 ${fmtMoney(i.points)}/mo` })
            : el("span", { text: i.points != null ? `▲ ${i.points}${i.comments != null ? ` · ${i.comments} comments` : ""}` : "" }),
          el("span", { text: i.traction ? `traction ${i.traction}` : "" }),
          i.category ? el("span", { class: "obadge cat", text: i.category }) : null,
          trendBadge(i),
          i.polished ? el("span", { class: "polished", text: "✦ polished", title: "Graded from the polished version of this idea" }) : null,
          i.composite != null ? el("span", { class: "score " + vclass(i.verdict), text: `AI ${i.composite}/100 · ${i.verdict}` }) : null,
          i.effort_roi != null ? el("span", { class: "score " + (i.effort_roi >= 2 ? "good" : i.effort_roi >= 0.8 ? "mid" : "bad"),
            title: "Effort ROI: estimated year-1 profit ÷ (build hours × $60 + a year of running costs)",
            text: `ROI ${i.effort_roi}×` }) : null,
        ),
      ),
      el("div", { class: "iactions" },
        el("button", { class: "small", text: i.an_status === "running" ? "…" : (i.composite != null ? "Re-analyze" : "Analyze"),
          disabled: busy ? "" : null,
          onclick: () => analyze(i.id) }),
        el("button", { class: "small ghost", text: "Full pipeline", title: "Analyze + full execution plan in one run",
          disabled: busy ? "" : null,
          onclick: () => pipeline(i.id) }),
        el("button", { class: "small ghost", text: "🎲 Simulate", title: "Run the 500× business simulation start→exit",
          disabled: (state.simulate && state.simulate.running) ? "" : null,
          onclick: () => simulate(i.id) }),
        el("button", { class: "small ghost", text: "📈", title: "Fetch Google Trends momentum for this idea",
          onclick: (e) => refreshTrend(i.id, e.target) }),
        el("button", { class: "small ghost", text: "Similar", title: "Find related ideas",
          onclick: (e) => showSimilar(i.id, row) }),
      ),
    );
    box.append(row);
  }
  if (!state.ideas.length) {
    box.append(el("p", { class: "hint", text: "Nothing yet — fetch a source above." }));
  } else if (state.ideaTotal > 120) {
    const bySrc = Object.entries(state.sourceCounts || {})
      .sort((a, b) => b[1] - a[1]).map(([k, v]) => `${ORIGIN[k] || k} ${v}`).join(" · ");
    box.append(el("p", { class: "hint",
      text: `Showing 120 of ${state.ideaTotal.toLocaleString()} ideas — filter or search to narrow.` }));
    box.append(el("p", { class: "hint", text: bySrc }));
  }
}

function vclass(v) {
  return { strong: "good", promising: "good", average: "mid", weak: "bad", avoid: "bad" }[v] || "mid";
}

async function showSimilar(id, row) {
  let existing = row.nextSibling;
  if (existing && existing.classList && existing.classList.contains("similarbox")) {
    existing.remove(); return;   // toggle off
  }
  const box = el("div", { class: "similarbox hint", text: "Finding similar…" });
  row.after(box);
  try {
    const r = await api("/api/ideas/" + encodeURIComponent(id) + "/similar");
    box.replaceChildren();
    if (!r.similar.length) { box.textContent = "No closely-related ideas found."; return; }
    box.append(el("strong", { text: "Similar ideas:" }));
    for (const s of r.similar) {
      box.append(el("div", { class: "simrow" },
        el("span", { class: "obadge " + s.origin, text: ORIGIN[s.origin] || s.origin }),
        s.url ? el("a", { href: s.url, target: "_blank", rel: "noopener", text: " " + s.title })
              : el("span", { text: " " + s.title }),
        el("span", { class: "simscore", text: ` ${Math.round(s.similarity * 100)}% match` }),
      ));
    }
  } catch (e) { box.textContent = "Error: " + e.message; }
}

async function analyze(id) {
  try {
    await api("/api/analyze/" + encodeURIComponent(id), {
      method: "POST",
      body: JSON.stringify({ panel_size: Number($("panelSize").value) }),
    });
    state.lastJob = "";
  } catch (e) { alert(e.message); }
}

async function pipeline(id) {
  try {
    await api("/api/pipeline/" + encodeURIComponent(id), {
      method: "POST",
      body: JSON.stringify({ panel_size: Number($("panelSize").value) }),
    });
    state.lastJob = "";
  } catch (e) { alert(e.message); }
}

async function makePlan(id) {
  try {
    await api("/api/plan/" + encodeURIComponent(id), { method: "POST" });
    state.lastJob = "";
  } catch (e) { alert(e.message); }
}

async function simulate(id) {
  try {
    await api("/api/simulate/" + encodeURIComponent(id), { method: "POST", body: "{}" });
    state.lastSim = "";
    document.getElementById("sims").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (e) { alert(e.message); }
}

async function refreshTrend(id, btn) {
  const old = btn.textContent;
  btn.textContent = "…"; btn.disabled = true;
  try {
    const r = await api("/api/trends/" + encodeURIComponent(id), { method: "POST", body: "{}" });
    if (!r.trend.available) alert("Google Trends unavailable right now (" + (r.trend.reason || "blocked") +
      ").\nGoogle rate-limits automated trend lookups; the Claude research pass covers this reliably once the CLI is logged in.");
    loadIdeas();
  } catch (e) { alert(e.message); }
  finally { btn.textContent = old; btn.disabled = false; }
}

/* ---------- analyses ---------- */

async function loadAnalyses() {
  try { state.analyses = (await api("/api/analyses")).analyses; } catch (_) { return; }
  renderAnalyses();
}

function renderAnalyses() {
  const box = $("analyses");
  box.replaceChildren();
  $("analysesEmpty").hidden = state.analyses.length > 0;
  for (const a of state.analyses) {
    const head = el("div", { class: "row spread ahead" },
      el("div", {},
        el("strong", { text: a.title }),
        el("span", { class: "hint", text: `  ${a.created_at} · panel ${a.panel_size || 0}` }),
      ),
      el("div", { class: "row" },
        a.status === "done"
          ? el("span", { class: "score big " + vclass(a.verdict), text: `${a.composite}/100 ${a.verdict}` })
          : el("span", { class: "chip " + (a.status === "running" ? "running" : "error"), text: a.status }),
        a.status === "done"
          ? el("button", { class: "small ghost", text: "Plan",
              title: "Generate the full execution plan for this idea",
              disabled: (state.job && state.job.state === "running") ? "" : null,
              onclick: (e) => { e.stopPropagation(); makePlan(a.idea_id); } })
          : null,
      ),
    );
    const details = el("div", { class: "adetails", hidden: "" });
    if (a.status === "done") {
      if (a.thesis) details.append(el("p", { class: "thesis", text: a.thesis }));
      if (a.scores) {
        const grid = el("div", { class: "fgrid" });
        for (const [k, v] of Object.entries(a.scores)) {
          grid.append(el("div", { class: "factor" },
            el("div", { class: "fname", text: k.replace(/_/g, " ") }),
            el("div", { class: "fscore " + (v.score >= 7 ? "good" : v.score >= 4 ? "mid" : "bad"), text: v.score + "/10" }),
            el("div", { class: "fnote", text: v.note || "" }),
          ));
        }
        details.append(grid);
      }
      if (a.estimates) {
        const e = typeof a.estimates === "string" ? JSON.parse(a.estimates) : a.estimates;
        details.append(el("p", { class: "panelstats" },
          el("strong", { text: `Effort ROI ${a.effort_roi != null ? a.effort_roi + "×" : "—"}: ` }),
          el("span", { text: `~${Math.round(e.build_hours)}h build · $${Math.round(e.monthly_cost_usd)}/mo costs` +
            ` · est. $${Math.round(e.mrr_12mo_usd)}/mo revenue by month 12` +
            ` · year-1 profit $${Math.round(e.year1_profit_usd)} vs ~$${Math.round(e.effort_cost_usd)} of your effort` }),
        ));
      }
      if (a.adoption != null) {
        details.append(el("p", { class: "panelstats" },
          el("strong", { text: "Panel: " }),
          el("span", { text: `${a.adoption}% would use · ${a.pay_rate}% would pay` +
            (a.price_med ? ` · median $${a.price_med}/mo` : "") }),
        ));
      }
      if (a.objections && a.objections.length) {
        const ul = el("ul", { class: "objections" });
        for (const o of a.objections) ul.append(el("li", { text: o }));
        details.append(el("div", {}, el("strong", { text: "Top objections" }), ul));
      }
      if (a.risks && a.risks.length) {
        const ul = el("ul", { class: "objections" });
        for (const r of a.risks) ul.append(el("li", { text: r }));
        details.append(el("div", {}, el("strong", { text: "Key risks" }), ul));
      }
      if (a.wedge) details.append(el("p", {}, el("strong", { text: "Suggested wedge: " }), el("span", { text: a.wedge })));
    } else if (a.error) {
      details.append(el("p", { class: "err", text: a.error }));
    }
    head.addEventListener("click", () => { details.hidden = !details.hidden; });
    box.append(el("div", { class: "analysis" }, head, details));
  }
}

/* ---------- plans ---------- */

async function loadPlans() {
  try { state.plans = (await api("/api/plans")).plans; } catch (_) { return; }
  renderPlans();
}

function renderPlans() {
  const box = $("plans");
  box.replaceChildren();
  $("plansEmpty").hidden = state.plans.length > 0;
  for (const p of state.plans) {
    const head = el("div", { class: "row spread ahead" },
      el("div", {},
        el("strong", { text: p.title }),
        el("span", { class: "hint", text: `  ${p.created_at}` + (p.winner ? ` · winner: ${p.winner}` : "") }),
      ),
      el("div", { class: "row" },
        p.status === "done"
          ? el("a", { class: "button small", href: `/api/plans/${p.id}/download`, text: "⬇ .md",
              onclick: (e) => e.stopPropagation() })
          : null,
        el("span", { class: "chip " + (p.status === "running" ? "running" : p.status === "done" ? "" : "error"),
          text: p.status }),
      ),
    );
    const details = el("div", { class: "adetails", hidden: "" });
    if (p.status === "done") {
      if (p.judge_scores && p.judge_scores.totals) {
        const t = p.judge_scores.totals;
        const cand = p.candidates || {};
        const grid = el("div", { class: "fgrid" });
        for (const L of Object.keys(t)) {
          grid.append(el("div", { class: "factor" },
            el("div", { class: "fname", text: `plan ${L} — ${(cand[L] && cand[L]._posture) || ""}` }),
            el("div", { class: "fscore " + (p.winner && p.winner.startsWith(L) ? "good" : "mid"),
              text: `${Math.round(t[L] * 10) / 10} pts` }),
          ));
        }
        details.append(grid);
      }
      // pull the mermaid pipeline diagram out and render it visually (text fallback)
      const fp = p.final_plan || "";
      const m = fp.match(/```mermaid\s*([\s\S]*?)```/);
      details.append(el("pre", { class: "plantext", text: fp.replace(/```mermaid[\s\S]*?```/, "(pipeline diagram rendered below)") }));
      if (m) {
        const dia = el("div", { class: "diagram" });
        details.append(el("strong", { text: "Pipeline diagram" }), dia);
        renderMermaid(dia, m[1].trim());
      }
    } else if (p.error) {
      details.append(el("p", { class: "err", text: p.error }));
    }
    head.addEventListener("click", () => { details.hidden = !details.hidden; });
    box.append(el("div", { class: "analysis" }, head, details));
  }
}

/* ---------- simulations ---------- */

async function loadSims() {
  try { state.sims = (await api("/api/simulations")).simulations; } catch (_) { return; }
  renderSims();
}

const SIM_OUTCOMES = [
  ["breakout", "Breakout", "good"], ["scaling", "Scaling", "good"],
  ["lifestyle", "Lifestyle", "mid"], ["acquired", "Acquired", "good"],
  ["failed", "Failed", "bad"],
];

function renderSims() {
  const box = $("sims");
  box.replaceChildren();
  $("simsEmpty").hidden = (state.sims || []).length > 0;
  for (const s of state.sims || []) {
    const sum = s.summary && typeof s.summary === "object" ? s.summary : null;
    const head = el("div", { class: "row spread ahead" },
      el("div", {},
        el("strong", { text: s.title }),
        el("span", { class: "hint", text: `  ${s.created_at}` + (sum ? ` · ${sum.trials} runs · ${sum.category}` : "") }),
      ),
      el("div", { class: "row" },
        s.status === "done" && sum
          ? el("span", { class: "score big " + (sum.success_rate >= 40 ? "good" : sum.success_rate >= 20 ? "mid" : "bad"),
              text: `${sum.success_rate}% viable` })
          : el("span", { class: "chip " + (s.status === "running" ? "running" : s.status === "done" ? "" : "error"), text: s.status }),
      ),
    );
    const details = el("div", { class: "adetails", hidden: "" });
    if (s.status === "done" && sum) {
      details.append(buildOutcomeBars(sum));
      details.append(buildRevenueChart(sum));
      details.append(buildExitStats(sum));
      if (sum.failure_modes && sum.failure_modes.length) {
        const ul = el("ul", { class: "objections" });
        for (const f of sum.failure_modes.slice(0, 6)) {
          ul.append(el("li", { text: `${f.label} — ${f.pct_of_all}% of all runs` }));
        }
        details.append(el("div", {}, el("strong", { text: "What actually ends it" }), ul));
      }
      if (sum.shocks && sum.shocks.length) {
        const ul = el("ul", { class: "objections" });
        for (const sh of sum.shocks.slice(0, 5)) {
          ul.append(el("li", { text: `${sh.pct_of_all}% of runs saw ${sh.label}` }));
        }
        details.append(el("div", {}, el("strong", { text: "Shocks it will likely face (plan for these)" }), ul));
      }
      if (s.narrative) details.append(el("div", { class: "mdbox" }, ...mdToNodes(s.narrative)));
    } else if (s.error) {
      details.append(el("p", { class: "err", text: s.error }));
    }
    head.addEventListener("click", () => { details.hidden = !details.hidden; });
    box.append(el("div", { class: "analysis" }, head, details));
  }
}

function buildOutcomeBars(sum) {
  const wrap = el("div", { class: "outcomes" }, el("strong", { text: "Odds over 10 years" }));
  const bars = el("div", { class: "obars" });
  for (const [key, label, cls] of SIM_OUTCOMES) {
    const pct = (sum.odds && sum.odds[key]) || 0;
    bars.append(el("div", { class: "obar" },
      el("div", { class: "obarlabel", text: `${label} ${pct}%` }),
      el("div", { class: "obartrack" }, el("div", { class: "obarfill " + cls, style: `width:${Math.min(100, pct)}%` })),
    ));
  }
  wrap.append(bars);
  return wrap;
}

function buildRevenueChart(sum) {
  const p50 = sum.p50_arr_by_year || [], p90 = sum.p90_arr_by_year || [];
  const wrap = el("div", { class: "chartwrap" },
    el("strong", { text: "Revenue path (ARR by year — P50 solid, P90 upside band)" }));
  const W = 520, H = 150, pad = 34, n = Math.max(p50.length, p90.length) || 10;
  const maxV = Math.max(1, ...p90, ...p50);
  const x = (i) => pad + (W - pad - 8) * (i / (n - 1));
  const y = (v) => H - 24 - (H - 40) * (v / maxV);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`); svg.setAttribute("class", "revchart");
  const mk = (tag, attrs) => { const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); return e; };
  // P90 band area
  if (p90.length) {
    let d = `M ${x(0)} ${y(0)}`;
    p90.forEach((v, i) => { d += ` L ${x(i)} ${y(v)}`; });
    d += ` L ${x(p90.length - 1)} ${y(0)} Z`;
    svg.append(mk("path", { d, class: "band" }));
  }
  // P50 line
  if (p50.length) {
    let d = "";
    p50.forEach((v, i) => { d += (i ? " L" : "M") + ` ${x(i)} ${y(v)}`; });
    svg.append(mk("path", { d, class: "p50line" }));
  }
  // axis labels: year 1,3,5,10 and max ARR
  for (const i of [0, 2, 4, 9]) if (i < n) {
    const tx = mk("text", { x: x(i), y: H - 6, class: "axtx", "text-anchor": "middle" });
    tx.textContent = "Y" + (i + 1);
    svg.append(tx);
  }
  const top = mk("text", { x: 4, y: 14, class: "axtx" }); top.textContent = fmtMoney(maxV) + " ARR";
  svg.append(top);
  wrap.append(svg);
  return wrap;
}

function buildExitStats(sum) {
  const e = sum.exit || {};
  const rows = [
    ["Chance of acquisition", (e.prob_acquisition || 0) + "%"],
    ["Median exit (if acquired)", fmtMoney(e.median_exit_if_acquired || 0)],
    ["Realistic upside exit (P90)", fmtMoney(e.p90_exit_if_acquired || 0)],
    ["Rare max potential (P99)", fmtMoney(e.potential_max_value_p99 || 0)],
    ["Expected value (all runs)", fmtMoney(e.expected_value || 0)],
    ["Median months to profit", sum.median_months_to_profit != null ? sum.median_months_to_profit + " mo" : "—"],
  ];
  const grid = el("div", { class: "fgrid" });
  for (const [k, v] of rows) {
    grid.append(el("div", { class: "factor" },
      el("div", { class: "fname", text: k }),
      el("div", { class: "fscore mid", text: v }),
    ));
  }
  return el("div", {}, el("strong", { text: "Money & exit" }), grid);
}

/* very small, safe markdown → DOM (headings, bullets, bold, paragraphs) */
function mdToNodes(md) {
  const out = [];
  let list = null;
  const flush = () => { if (list) { out.push(list); list = null; } };
  for (const raw of String(md).split("\n")) {
    const line = raw.trimEnd();
    let m;
    if ((m = line.match(/^#{1,6}\s+(.*)/))) { flush(); out.push(el("h4", { class: "mdh", text: m[1] })); }
    else if ((m = line.match(/^[-*]\s+(.*)/))) {
      if (!list) list = el("ul", { class: "objections" });
      list.append(el("li", {}, ...inlineMd(m[1])));
    } else if (line.trim() === "") { flush(); }
    else { flush(); out.push(el("p", { class: "mdp" }, ...inlineMd(line))); }
  }
  flush();
  return out;
}

function inlineMd(text) {
  const nodes = [];
  const parts = String(text).split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/);
  for (const p of parts) {
    if (!p) continue;
    if (/^\*\*.*\*\*$/.test(p)) nodes.push(el("strong", { text: p.slice(2, -2) }));
    else if (/^\*.*\*$/.test(p) || /^_.*_$/.test(p)) nodes.push(el("em", { text: p.slice(1, -1) }));
    else nodes.push(document.createTextNode(p));
  }
  return nodes;
}

/* ---------- mermaid (lazy-loaded; text fallback if offline) ---------- */

let mermaidLoading = null;
function renderMermaid(target, code) {
  const fallback = () => target.replaceChildren(el("pre", { class: "plantext", text: code }));
  if (!mermaidLoading) {
    mermaidLoading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
      s.onload = () => { window.mermaid.initialize({ startOnLoad: false, theme: "dark" }); resolve(); };
      s.onerror = reject;
      document.head.append(s);
    });
  }
  mermaidLoading.then(async () => {
    try {
      const { svg } = await window.mermaid.render("mm" + Math.random().toString(36).slice(2), code);
      target.innerHTML = svg;   // mermaid's own sanitized SVG output
    } catch (_) { fallback(); }
  }).catch(fallback);
}

/* ---------- idea tester ---------- */

function wireBatch() {
  $("startBatch").addEventListener("click", async () => {
    const limit = Number($("batchLimit").value) || 10;
    const mode = $("batchMode").value;
    const what = mode === "analyze" ? "Analyze (score + panel)" : "FULL pipeline (score → panel → plan)";
    if (!confirm(`${what} on the top ${limit} ideas in the current filter?\nRuns unattended in the background and can take a while.`)) return;
    try {
      await api("/api/batch", { method: "POST",
        body: JSON.stringify({ origin: $("originFilter").value || null,
          category: $("categoryFilter").value || null, q: $("search").value.trim() || null,
          mode, limit, panel_size: Number($("panelSize").value) }) });
      state.lastJob = "";
    } catch (e) { alert(e.message); }
  });
  $("stopBatch").addEventListener("click", async () => {
    try { await api("/api/batch/stop", { method: "POST", body: "{}" }); } catch (e) { alert(e.message); }
  });
}

function wireGenerate() {
  $("generateBtn").addEventListener("click", async () => {
    const n = Number($("genCount").value) || 10;
    $("genStatus").textContent = "Starting…";
    try {
      await api("/api/generate", { method: "POST",
        body: JSON.stringify({ n, theme: $("genTheme").value.trim() || null }) });
      state.lastGen = "";
    } catch (e) { $("genStatus").textContent = "Error: " + e.message; }
  });
}

function wireTester() {
  $("testIdea").addEventListener("click", async () => {
    const title = $("ideaTitle").value.trim();
    if (!title) { $("testStatus").textContent = "Give it a one-line title first."; return; }
    $("testStatus").textContent = "Submitting…";
    try {
      const r = await api("/api/ideas", { method: "POST",
        body: JSON.stringify({ title, description: $("ideaDesc").value.trim() }) });
      await api("/api/analyze/" + encodeURIComponent(r.id), { method: "POST",
        body: JSON.stringify({ panel_size: Number($("panelSize").value) }) });
      $("testStatus").textContent = "Analyzing — watch the badge top-right; results appear below.";
      state.lastJob = "";
    } catch (e) { $("testStatus").textContent = "Error: " + e.message; }
  });
}

/* ---------- sources ---------- */

function wireSources() {
  $("fetchHn").addEventListener("click", async () => {
    $("fetchStatus").textContent = "Fetching Show HN…";
    try {
      const r = await api("/api/fetch/hn", { method: "POST",
        body: JSON.stringify({ days: Number($("hnDays").value), min_points: Number($("hnPoints").value) }) });
      $("fetchStatus").textContent = `Fetched ${r.fetched} Show HN launches.`;
      loadIdeas();
    } catch (e) { $("fetchStatus").textContent = "Error: " + e.message; }
  });
  const simpleFetch = (id, source, label) => {
    $(id).addEventListener("click", async () => {
      $("fetchStatus").textContent = `Fetching ${label}…`;
      try {
        const r = await api(`/api/fetch/${source}`, { method: "POST",
          body: JSON.stringify({ days: Number($("hnDays").value), min_points: Number($("hnPoints").value) }) });
        $("fetchStatus").textContent = `Fetched ${r.fetched} from ${label}.`;
        loadIdeas();
      } catch (e) { $("fetchStatus").textContent = "Error: " + e.message; }
    });
  };
  simpleFetch("fetchPh", "ph", "Product Hunt");
  simpleFetch("fetchRd", "rd", "Reddit");
  simpleFetch("fetchSs", "ss", "your Starter Story archive");
  $("fetchAll").addEventListener("click", async () => {
    $("fetchStatus").textContent = "Starting full fetch across every source…";
    try { await api("/api/fetch-all", { method: "POST", body: "{}" }); } catch (e) { alert(e.message); }
  });
  $("categorizeAll").addEventListener("click", async () => {
    $("fetchStatus").textContent = "Categorizing every idea by type…";
    try { await api("/api/categorize", { method: "POST", body: "{}" }); } catch (e) { alert(e.message); }
  });
  $("toggleSources").addEventListener("click", () => {
    const m = $("sourceManager");
    m.hidden = !m.hidden;
    if (!m.hidden) loadSources();
  });
  $("addRss").addEventListener("click", async () => {
    const url = $("rssUrl").value.trim();
    if (!url) return;
    try {
      await api("/api/sources/custom", { method: "POST",
        body: JSON.stringify({ kind: "rss", url, name: $("rssName").value.trim() }) });
      $("rssUrl").value = ""; $("rssName").value = "";
      loadSources();
    } catch (e) { alert(e.message); }
  });
  $("importChannel").addEventListener("click", async () => {
    const ref = $("archiveSel").value;
    if (!ref) return;
    try {
      await api("/api/sources/custom", { method: "POST",
        body: JSON.stringify({ kind: "archive-channel", ref, name: ref.split(":")[1] }) });
      await api("/api/fetch-all", { method: "POST", body: "{}" });  // pull it in now
      loadSources();
    } catch (e) { alert(e.message); }
  });
  let t;
  $("search").addEventListener("input", () => { clearTimeout(t); t = setTimeout(loadIdeas, 300); });
  $("originFilter").addEventListener("change", loadIdeas);
  $("categoryFilter").addEventListener("change", loadIdeas);
}

async function loadSources() {
  let s;
  try { s = await api("/api/sources"); } catch (_) { return; }
  $("builtinList").textContent = "Built-in: " + s.builtins.map((b) => b.name).join(" · ");
  const arch = $("archiveSel");
  arch.replaceChildren(el("option", { value: "", text: "— choose a channel —" }));
  for (const c of s.archive_channels) {
    arch.append(el("option", { value: `${c.platform}:${c.username}`,
      text: `${c.platform}/${c.username} (${c.usable} usable)` }));
  }
  const cl = $("customList");
  cl.replaceChildren();
  for (const c of s.custom) {
    cl.append(el("div", { class: "row spread srcrow" },
      el("span", { class: "sub", text: `${c.kind === "rss" ? "🔗" : "📺"} ${c.name} — ${c.ref}` }),
      el("button", { class: "small ghost", text: "Remove",
        onclick: async () => { await api("/api/sources/custom?id=" + c.id, { method: "DELETE" }); loadSources(); } }),
    ));
  }
}

wireSources();
wireTester();
wireBatch();
wireGenerate();
poll();
loadIdeas();
loadAnalyses();
loadPlans();
loadSims();
