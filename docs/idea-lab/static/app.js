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
    renderJob();
    renderEngine();
    renderFetch();
    const key = s.job ? `${s.job.state}:${s.job.phase}` : "idle";
    const fkey = s.fetch ? `${s.fetch.running}:${s.fetch.phase}` : "";
    if (key !== state.lastJob || fkey !== state.lastFetch) {
      state.lastJob = key;
      state.lastFetch = fkey;
      loadIdeas();
      loadAnalyses();
      loadPlans();
    }
  } catch (_) {}
  setTimeout(poll, 2000);
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

function renderEngine() {
  const e = state.engine;
  const b = $("engineBadge");
  if (!e) { b.hidden = true; return; }
  b.hidden = false;
  b.textContent = e.engine === "claude" ? "🧠 Claude + web research"
    : e.engine === "codex" ? "🧠 Codex (log into Claude CLI to upgrade)"
    : "⚠ no AI engine";
  b.title = e.detail || "";
  b.className = "chip " + (e.engine === "none" ? "error" : "");
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

const ORIGIN = { hn: "Show HN", ph: "Product Hunt", rd: "Reddit", ss: "Starter Story", custom: "Mine" };

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
          el("span", { text: i.points != null ? `▲ ${i.points}${i.comments != null ? ` · ${i.comments} comments` : ""}` : "" }),
          el("span", { text: i.traction ? `traction ${i.traction}` : "" }),
          i.category ? el("span", { class: "obadge", text: i.category }) : null,
          i.polished ? el("span", { class: "polished", text: "✦ polished", title: "Graded from the polished version of this idea" }) : null,
          i.composite != null ? el("span", { class: "score " + vclass(i.verdict), text: `AI ${i.composite}/100 · ${i.verdict}` }) : null,
          i.effort_roi != null ? el("span", { class: "score " + (i.effort_roi >= 2 ? "good" : i.effort_roi >= 0.8 ? "mid" : "bad"),
            title: "Effort ROI: estimated year-1 profit ÷ (build hours × $60 + a year of running costs)",
            text: `ROI ${i.effort_roi}×` }) : null,
        ),
      ),
      el("button", { class: "small", text: i.an_status === "running" ? "…" : (i.composite != null ? "Re-analyze" : "Analyze"),
        disabled: busy ? "" : null,
        onclick: () => analyze(i.id) }),
      el("button", { class: "small ghost", text: "Full pipeline", title: "Analyze + full execution plan in one run",
        disabled: busy ? "" : null,
        onclick: () => pipeline(i.id) }),
    );
    box.append(row);
  }
  if (!state.ideas.length) {
    box.append(el("p", { class: "hint", text: "Nothing yet — fetch a source above." }));
  } else if (state.ideas.length > 120) {
    box.append(el("p", { class: "hint",
      text: `Showing 120 of ${state.ideas.length} — use search or the source filter to narrow.` }));
  }
}

function vclass(v) {
  return { strong: "good", promising: "good", average: "mid", weak: "bad", avoid: "bad" }[v] || "mid";
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
poll();
loadIdeas();
loadAnalyses();
loadPlans();
