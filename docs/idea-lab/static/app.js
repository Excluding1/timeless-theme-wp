/* Idea Lab frontend. DOM-built rendering (no innerHTML with data). */
"use strict";

const $ = (id) => document.getElementById(id);

const state = { ideas: [], analyses: [], job: null, lastJob: "" };

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
    renderJob();
    const key = s.job ? `${s.job.state}:${s.job.phase}` : "idle";
    if (key !== state.lastJob) {
      state.lastJob = key;
      loadIdeas();
      loadAnalyses();
    }
  } catch (_) {}
  setTimeout(poll, 2000);
}

function renderJob() {
  const j = state.job;
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
  if ($("search").value.trim()) p.set("q", $("search").value.trim());
  try { state.ideas = (await api("/api/ideas?" + p)).ideas; } catch (_) { return; }
  renderIdeas();
}

const ORIGIN = { hn: "Show HN", ph: "Product Hunt", custom: "Mine" };

function renderIdeas() {
  const box = $("ideas");
  box.replaceChildren();
  const busy = !!(state.job && state.job.state === "running");
  for (const i of state.ideas.slice(0, 120)) {
    const row = el("div", { class: "idea" },
      el("div", { class: "col grow" },
        el("div", { class: "ititle" },
          el("span", { class: "obadge " + i.origin, text: ORIGIN[i.origin] || i.origin }),
          i.url ? el("a", { href: i.url, target: "_blank", rel: "noopener", text: " " + i.title })
                : el("span", { text: " " + i.title }),
        ),
        i.description ? el("div", { class: "idesc", text: i.description.slice(0, 220) }) : null,
        el("div", { class: "imeta" },
          el("span", { text: i.points != null ? `▲ ${i.points} · ${i.comments} comments` : "" }),
          el("span", { text: i.traction ? `traction ${i.traction}` : "" }),
          i.composite != null ? el("span", { class: "score " + vclass(i.verdict), text: `AI ${i.composite}/100 · ${i.verdict}` }) : null,
        ),
      ),
      el("button", { class: "small", text: i.an_status === "running" ? "…" : (i.composite != null ? "Re-analyze" : "Analyze"),
        disabled: busy ? "" : null,
        onclick: () => analyze(i.id) }),
    );
    box.append(row);
  }
  if (!state.ideas.length) {
    box.append(el("p", { class: "hint", text: "Nothing yet — fetch a source above." }));
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
      a.status === "done"
        ? el("span", { class: "score big " + vclass(a.verdict), text: `${a.composite}/100 ${a.verdict}` })
        : el("span", { class: "chip " + (a.status === "running" ? "running" : "error"), text: a.status }),
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
  $("fetchPh").addEventListener("click", async () => {
    $("fetchStatus").textContent = "Fetching Product Hunt…";
    try {
      const r = await api("/api/fetch/ph", { method: "POST", body: "{}" });
      $("fetchStatus").textContent = `Fetched ${r.fetched} Product Hunt launches.`;
      loadIdeas();
    } catch (e) { $("fetchStatus").textContent = "Error: " + e.message; }
  });
  let t;
  $("search").addEventListener("input", () => { clearTimeout(t); t = setTimeout(loadIdeas, 300); });
  $("originFilter").addEventListener("change", loadIdeas);
}

wireSources();
wireTester();
poll();
loadIdeas();
loadAnalyses();
