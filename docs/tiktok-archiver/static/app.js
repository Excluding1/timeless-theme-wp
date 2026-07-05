/* TikTok Profile Archiver — frontend. All rendering via DOM APIs (no innerHTML with data). */
"use strict";

const $ = (id) => document.getElementById(id);

const state = {
  profiles: [],
  settings: {},
  whisperModels: [],
  cookieFilePresent: false,
  job: null,
  lastJobState: null,
  videos: [],
};

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
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
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
    state.profiles = s.profiles;
    state.settings = s.settings;
    state.whisperModels = s.whisper_models;
    state.cookieFilePresent = s.cookie_file_present;
    state.job = s.job;
    renderProfiles();
    renderJob();
    syncSettingsForm();
    // refresh the library when a job progresses or finishes
    const js = s.job ? `${s.job.state}:${s.job.phase}:${s.job.done}` : "idle";
    if (js !== state.lastJobState) {
      state.lastJobState = js;
      loadVideos();
    }
  } catch (e) { /* server briefly unavailable — keep polling */ }
  setTimeout(poll, 1500);
}

/* ---------- settings ---------- */

let settingsDirty = false;
let cookieMsgUntil = 0; // keep transient save feedback from being clobbered by the poll

function syncSettingsForm() {
  if (settingsDirty) return; // don't clobber edits in progress
  if (!$("whisperModel").options.length && state.whisperModels.length) {
    for (const m of state.whisperModels) $("whisperModel").append(el("option", { value: m, text: m }));
  }
  $("cookieMode").value = state.settings.cookie_mode || "none";
  $("cookieBrowser").value = state.settings.cookie_browser || "chrome";
  if (state.settings.whisper_model) $("whisperModel").value = state.settings.whisper_model;
  $("language").value = state.settings.language || "auto";
  $("autoSync").value = state.settings.auto_sync || "0";
  updateSettingsVisibility();
}

function updateSettingsVisibility() {
  const mode = $("cookieMode").value;
  $("browserRow").style.display = mode === "browser" ? "" : "none";
  $("browserHint").hidden = mode !== "browser";
  $("cookiePaste").hidden = mode !== "file";
  if (Date.now() > cookieMsgUntil) {
    $("cookieStatus").textContent = state.cookieFilePresent ? "A cookies.txt is saved ✓" : "";
  }
}

function wireSettings() {
  $("settingsBtn").addEventListener("click", () => { $("settings").hidden = !$("settings").hidden; });
  for (const id of ["cookieMode", "cookieBrowser", "whisperModel", "language", "autoSync"]) {
    $(id).addEventListener("change", () => { settingsDirty = true; updateSettingsVisibility(); });
  }
  const saveSettings = async () => {
    await api("/api/settings", {
      method: "POST",
      body: JSON.stringify({
        cookie_mode: $("cookieMode").value,
        cookie_browser: $("cookieBrowser").value,
        whisper_model: $("whisperModel").value,
        language: $("language").value,
        auto_sync: $("autoSync").value,
      }),
    });
    settingsDirty = false;
  };
  $("saveSettings").addEventListener("click", async () => {
    try {
      await saveSettings();
      $("settingsStatus").textContent = "Saved ✓";
      setTimeout(() => { $("settingsStatus").textContent = ""; }, 2500);
    } catch (e) { $("settingsStatus").textContent = "Error: " + e.message; }
  });
  $("checkLogin").addEventListener("click", async () => {
    const out = $("loginStatus");
    out.textContent = "Saving settings, then asking TikTok… " +
      "(if macOS asks about Keychain access for browser cookies, click Always Allow)";
    try {
      await saveSettings();
      const r = await api("/api/login-check");
      out.textContent = (r.ok ? "✅ " : "❌ ") + r.detail;
    } catch (e) { out.textContent = "❌ Check failed: " + e.message; }
  });
  $("saveCookies").addEventListener("click", async () => {
    try {
      await api("/api/cookies", { method: "POST", body: JSON.stringify({ content: $("cookieText").value }) });
      $("cookieText").value = "";
      settingsDirty = false;
      cookieMsgUntil = Date.now() + 5000;
      $("cookieStatus").textContent = "Cookies saved ✓ (mode set to cookies.txt)";
    } catch (e) {
      cookieMsgUntil = Date.now() + 15000;
      $("cookieStatus").textContent = "Error: " + e.message;
    }
  });
}

/* ---------- profiles ---------- */

let lastProfilesKey = "";

function renderProfiles() {
  const busy = !!(state.job && state.job.state === "running");
  // only rebuild when data changed — a rebuild on every poll would wipe
  // whatever the user typed into the limit box
  const key = JSON.stringify(state.profiles) + busy;
  if (key === lastProfilesKey) return;
  lastProfilesKey = key;

  const box = $("profiles");
  // preserve per-row inputs across rebuilds (counts change during a sync)
  const prev = {};
  for (const row of box.querySelectorAll(".profile")) {
    prev[row.dataset.username] = {
      limit: row.querySelector("input.limit").value,
      transcribe: row.querySelector("input[type=checkbox]").checked,
    };
  }
  box.replaceChildren();
  const filter = $("filterProfile");
  const selected = filter.value;
  filter.replaceChildren(el("option", { value: "", text: "All profiles" }));

  for (const p of state.profiles) {
    filter.append(el("option", { value: p.username, text: "@" + p.username }));

    const limitInput = el("input", { class: "limit", type: "number", min: "1", placeholder: "all" });
    const transcribeBox = el("input", { type: "checkbox" });
    limitInput.value = prev[p.username] ? prev[p.username].limit : "";
    transcribeBox.checked = prev[p.username] ? prev[p.username].transcribe : true;

    const counts = `${p.known} known · ${p.downloaded} downloaded · ${p.transcribed} transcribed` +
      (p.errors ? ` · ${p.errors} errors` : "") +
      (p.last_sync_at ? ` · last sync ${p.last_sync_at.slice(0, 16)}` : " · never synced");

    const card = el("div", { class: "profile" },
      el("div", { class: "row" },
        el("span", { class: "name", text: "@" + p.username }),
        el("span", { class: "counts", text: counts }),
        limitInput,
        el("label", { class: "sub" }, transcribeBox, "transcribe"),
        el("button", { class: "small", text: busy ? "Busy…" : "Sync", disabled: busy ? "" : null,
          onclick: () => startSync(p.username, limitInput.value, transcribeBox.checked) }),
        el("button", { class: "small danger", text: "Remove",
          onclick: () => removeProfile(p.username) }),
      ),
    );
    card.dataset.username = p.username;
    box.append(card);
  }
  filter.value = selected;
  if (filter.value !== selected) { // selected profile was removed — reset the filter
    filter.value = "";
    loadVideos();
  }
}

async function startSync(username, limit, transcribe) {
  try {
    await api("/api/sync", {
      method: "POST",
      body: JSON.stringify({ username, limit: limit ? Number(limit) : null, transcribe }),
    });
  } catch (e) { alert("Sync failed to start: " + e.message); }
}

async function removeProfile(username) {
  if (!confirm(`Remove @${username} from the library? Downloaded files stay on disk.`)) return;
  try { await api(`/api/profiles/${encodeURIComponent(username)}`, { method: "DELETE" }); }
  catch (e) { alert(e.message); }
  loadVideos();
}

function wireAddProfile() {
  const add = async () => {
    const value = $("profileInput").value.trim();
    if (!value) return;
    $("addStatus").textContent = "Adding…";
    try {
      const r = await api("/api/profiles", { method: "POST", body: JSON.stringify({ profile: value }) });
      $("profileInput").value = "";
      $("addStatus").textContent = `Added @${r.username} — hit Sync to fetch videos.`;
    } catch (e) { $("addStatus").textContent = "Error: " + e.message; }
  };
  $("addProfile").addEventListener("click", add);
  $("profileInput").addEventListener("keydown", (e) => { if (e.key === "Enter") add(); });
}

/* ---------- job banner ---------- */

function renderJob() {
  const j = state.job;
  $("jobCard").hidden = !j;
  if (!j) return;
  $("jobTitle").textContent = (j.kind === "sync" ? "Syncing @" : "Transcribing for @") + j.username;
  const phase = $("jobPhase");
  phase.textContent = j.state === "running" ? j.phase : j.state;
  phase.className = "chip " + (j.state === "running" ? "running" : j.state === "done" ? "done" : "error");
  $("jobStop").hidden = j.state !== "running";
  const pct = j.total ? Math.round((j.done / j.total) * 100) : (j.state === "running" ? 5 : 100);
  $("jobBar").style.width = pct + "%";
  $("jobCurrent").textContent = j.state === "error" ? j.message : j.current;
  $("jobLog").textContent = (j.log || []).join("\n");
}

function wireJob() {
  $("jobStop").addEventListener("click", async () => {
    try { await api("/api/job/cancel", { method: "POST" }); }
    catch (e) { alert(e.message); }
  });
}

/* ---------- library ---------- */

async function loadVideos() {
  const params = new URLSearchParams();
  if ($("filterProfile").value) params.set("username", $("filterProfile").value);
  if ($("search").value.trim()) params.set("q", $("search").value.trim());
  try {
    const r = await api("/api/videos?" + params.toString());
    state.videos = r.videos;
  } catch (e) { return; }
  renderVideos();
  $("exportBtn").href = "/api/export?" + params.toString();
}

function fmtDate(d) { return d && d.length === 8 ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}` : ""; }
function fmtDur(s) {
  if (!s && s !== 0) return "";
  const m = Math.floor(s / 60), sec = Math.round(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}
function fmtViews(n) {
  if (n === null || n === undefined) return "";
  return n >= 1e6 ? (n / 1e6).toFixed(1) + "M views" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K views" : n + " views";
}

function renderVideos() {
  const grid = $("videos");
  $("libraryEmpty").hidden = state.videos.length > 0;

  // keyed reconcile: untouched cards keep their DOM (a playing <video>,
  // an expanded transcript) instead of being rebuilt on every poll tick
  const byId = new Map();
  for (const node of [...grid.children]) byId.set(node.dataset.id, node);
  const seen = new Set();
  let prev = null;
  for (const v of state.videos) {
    const id = String(v.id);
    seen.add(id);
    const key = JSON.stringify(v);
    let node = byId.get(id);
    if (!node || node.dataset.key !== key) {
      const fresh = buildVideoCard(v);
      fresh.dataset.id = id;
      fresh.dataset.key = key;
      if (node) node.replaceWith(fresh);
      else grid.append(fresh);
      node = fresh;
    }
    if (prev) { if (prev.nextSibling !== node) prev.after(node); }
    else if (grid.firstChild !== node) grid.prepend(node);
    prev = node;
  }
  for (const [id, node] of byId) if (!seen.has(id)) node.remove();
}

function buildVideoCard(v) {
  const media = el("div", { class: "media" });
  if (v.media_url) {
    if (v.thumb_url) {
      media.append(el("img", { src: v.thumb_url, loading: "lazy", alt: "" }), el("div", { class: "play", text: "▶" }));
    } else {
      media.append(el("div", { class: "noThumb", text: "▶ play" }));
    }
    media.addEventListener("click", () => {
      media.replaceChildren(el("video", { src: v.media_url, controls: "", autoplay: "", poster: v.thumb_url || null }));
    }, { once: true });
  } else {
    media.append(el("div", { class: "noThumb", text: v.status === "pending" ? "queued" : "no file" }));
  }

  const body = el("div", { class: "body" },
    el("div", { class: "title", text: v.title || "(no title)" }),
    el("div", { class: "meta" },
      el("span", { text: "@" + v.username }),
      el("span", { text: fmtDate(v.upload_date) }),
      el("span", { text: fmtDur(v.duration) }),
      el("span", { text: fmtViews(v.view_count) }),
      el("span", { class: "chip " + v.status, text: v.status }),
    ),
  );

  if (v.error) body.append(el("div", { class: "err", text: v.error }));

  if (v.has_transcript && v.snippet) {
    const snip = el("div", { class: "snippet", text: v.snippet });
    body.append(snip);
    body.append(el("div", { class: "actions" },
      el("a", { href: "#", text: "Full transcript", onclick: async (e) => {
        e.preventDefault();
        try {
          const d = await api("/api/videos/" + encodeURIComponent(v.id));
          snip.textContent = d.transcript || "(empty)";
          snip.classList.add("full");
          e.target.remove();
        } catch (err) { alert("Could not load transcript: " + err.message); }
      } }),
      el("a", { href: "#", text: "Copy", onclick: async (e) => {
        e.preventDefault();
        const link = e.target;
        try {
          const d = await api("/api/videos/" + encodeURIComponent(v.id));
          await navigator.clipboard.writeText(d.transcript || "");
          link.textContent = "Copied ✓";
        } catch (err) { link.textContent = "Copy failed"; }
        setTimeout(() => { link.textContent = "Copy"; }, 1500);
      } }),
      el("a", { href: `/api/videos/${encodeURIComponent(v.id)}/download/txt`, text: ".txt" }),
      el("a", { href: `/api/videos/${encodeURIComponent(v.id)}/download/srt`, text: ".srt" }),
      el("a", { href: "#", text: "Re-transcribe", onclick: async (e) => {
        e.preventDefault();
        if (!confirm("Overwrite this transcript using the current Whisper model?")) return;
        try { await api("/api/transcribe/" + encodeURIComponent(v.id), { method: "POST" }); }
        catch (err) { alert(err.message); }
      } }),
      v.url ? el("a", { href: v.url, target: "_blank", rel: "noopener", text: "TikTok ↗" }) : null,
    ));
  } else {
    const actions = el("div", { class: "actions" });
    if (v.media_url) {
      actions.append(el("a", { href: "#", text: "Transcribe", onclick: async (e) => {
        e.preventDefault();
        try { await api("/api/transcribe/" + encodeURIComponent(v.id), { method: "POST" }); }
        catch (err) { alert(err.message); }
      } }));
    }
    if (v.url) actions.append(el("a", { href: v.url, target: "_blank", rel: "noopener", text: "TikTok ↗" }));
    if (actions.children.length) body.append(actions);
  }

  return el("div", { class: "video" }, media, body);
}

function applyView() {
  const list = localStorage.getItem("view") === "list";
  $("videos").classList.toggle("list", list);
  $("viewToggle").textContent = list ? "▦ Grid" : "☰ List";
}

function wireLibrary() {
  let t;
  $("search").addEventListener("input", () => { clearTimeout(t); t = setTimeout(loadVideos, 300); });
  $("filterProfile").addEventListener("change", loadVideos);
  $("viewToggle").addEventListener("click", () => {
    localStorage.setItem("view", localStorage.getItem("view") === "list" ? "grid" : "list");
    applyView();
  });
  applyView();
}

/* ---------- boot ---------- */

wireSettings();
wireAddProfile();
wireJob();
wireLibrary();
poll();
loadVideos();
