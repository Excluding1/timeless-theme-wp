/* Atlas — shared interactive tree viewer for the CEO Cockpit.
 * Powers /map (Business Map) and /journey (Customer Journey).
 * Zero dependencies. All rendering via DOM APIs — no innerHTML with data (cockpit convention).
 * Shell pages set window.ATLAS_SRC ('/api/atlas' | '/api/journey') + window.ATLAS_PAGE before loading this. */
(function () {
'use strict';

/* ============================ pure logic (node-testable) ============================ */

// needs.json → alert items. Schema: { items:[{ t:string, done:bool }] } — open = !done.
function needsToItems(needs) {
  const out = [];
  if (needs && Array.isArray(needs.items)) {
    for (const i of needs.items) {
      if (i && !i.done && i.t) out.push({ src: 'needs board', text: String(i.t) });
    }
  }
  return out;
}

// tasks.json (board) → alert items. Schema: { tasks:[{ id,title,status:'doing'|'todo'|'done',subtasks:[{title,done}] }] }.
// One item per OPEN subtask of a non-done task ("Task: subtask"); a non-done task with no open
// subtasks contributes its own title once (avoids double-counting the title per subtask).
function boardToItems(board) {
  const out = [];
  if (board && Array.isArray(board.tasks)) {
    for (const t of board.tasks) {
      if (!t || t.status === 'done') continue;
      const title = String(t.title || t.id || '');
      const open = (Array.isArray(t.subtasks) ? t.subtasks : []).filter(s => s && !s.done && s.title);
      if (open.length) for (const s of open) out.push({ src: 'task board', text: title ? title + ': ' + s.title : String(s.title) });
      else if (title) out.push({ src: 'task board', text: title });
    }
  }
  return out;
}

// Case-insensitive substring match of each node's watch keywords against every item.
// nodes = [{id, watch:[..]}] → { nodeId: [matched items] } (only nodes with ≥1 hit).
function matchAlerts(items, nodes) {
  const out = {};
  for (const n of nodes) {
    if (!n || !n.id || !Array.isArray(n.watch) || !n.watch.length) continue;
    const kws = n.watch.map(k => String(k).toLowerCase().trim()).filter(Boolean);
    if (!kws.length) continue;
    const hits = items.filter(it => {
      const t = String(it.text || '').toLowerCase();
      return kws.some(k => t.includes(k));
    });
    if (hits.length) out[n.id] = hits;
  }
  return out;
}

// deep text → [{type:'p',text}|{type:'ul',items:[..]}]. "\n\n" splits blocks; "- " lines become bullets.
function parseDeep(text) {
  const out = [];
  for (const block of String(text || '').split(/\n\s*\n/)) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    let para = []; let ul = null;
    const flushPara = () => { if (para.length) { out.push({ type: 'p', text: para.join(' ') }); para = []; } };
    for (const l of lines) {
      if (/^-\s+/.test(l)) {
        flushPara();
        if (!ul || out[out.length - 1] !== ul) { ul = { type: 'ul', items: [] }; out.push(ul); }
        ul.items.push(l.replace(/^-\s+/, ''));
      } else { ul = null; para.push(l); }
    }
    flushPara();
  }
  return out;
}

// Diagram-view box height estimate used by layoutTree. Must track the .at-box CSS metrics:
// 10px vertical padding ×2 + 1.5px border ×2 + 20px icon line + 2px gap = 45px chrome,
// plus 17px per label line (CSS clamps at 3 lines). Conservative chars-per-line so we
// over-estimate wrap (extra whitespace beats clipped text).
function estimateBoxHeight(node, boxW) {
  const cpl = Math.max(8, Math.floor(((boxW || 200) - 27) / 7.5));
  const label = String((node && (node.label || node.id)) || '');
  const lines = Math.max(1, Math.min(3, Math.ceil(label.length / cpl)));
  return 45 + lines * 17;
}

// Tidy top-down org-chart layout for the diagram view. Pure — node-testable.
// roots: array of tree nodes ({id,label,children,...}) laid side-by-side at depth 0.
// opts: { boxW, gapX, levelGap, isOpen(id)→bool, heightOf(node,depth)→px }.
// Returns { boxes:[{id,x,y,w,h,cx,depth,sw,branch}], edges:[{from,to}], width, height, rowY }.
// Algorithm — classic two-pass tidy tree:
//   pass 1 (post-order): subtree width sw(n) = max(boxW, Σ sw(visible children) + gaps);
//   pass 2 (pre-order): children packed left→right inside the parent's slot (block centered
//   when there is slack), parent centered at (first.cx + last.cx)/2. Rows are top-aligned:
//   depth d sits at y = Σ over rows above of (max box height in row + levelGap).
// branch = index of the depth-1 ancestor (top-level node) — drives the colour family;
// depth-0 roots get branch -1 (single-root/virtual-root case).
function layoutTree(roots, opts) {
  opts = opts || {};
  const boxW = opts.boxW || 200;
  const gapX = opts.gapX != null ? opts.gapX : 26;
  const levelGap = opts.levelGap != null ? opts.levelGap : 64;
  const isOpen = opts.isOpen || (() => true);
  const heightOf = opts.heightOf || (n => estimateBoxHeight(n, boxW));
  const kids = n => (isOpen(n.id) && Array.isArray(n.children)) ? n.children.filter(c => c && c.id) : [];
  const tops = (roots || []).filter(n => n && n.id);

  const SW = new Map(), H = new Map(), rowH = [];
  (function measure(ns, depth) {
    for (const n of ns) {
      const cs = kids(n);
      measure(cs, depth + 1);
      let total = 0;
      cs.forEach((c, i) => { total += SW.get(c.id) + (i ? gapX : 0); });
      SW.set(n.id, Math.max(boxW, total));
      const h = heightOf(n, depth);
      H.set(n.id, h);
      rowH[depth] = Math.max(rowH[depth] || 0, h);
    }
  })(tops, 0);

  const rowY = [];
  for (let d = 0, y = 0; d < rowH.length; d++) { rowY[d] = y; y += rowH[d] + levelGap; }

  const boxes = [], edges = [];
  function place(n, x0, depth, branch) {
    const cs = kids(n), sw = SW.get(n.id);
    let cx;
    if (!cs.length) cx = x0 + sw / 2;
    else {
      let total = 0;
      cs.forEach((c, i) => { total += SW.get(c.id) + (i ? gapX : 0); });
      let x = x0 + (sw - total) / 2;
      const cxs = [];
      cs.forEach((c, i) => {
        cxs.push(place(c, x, depth + 1, depth === 0 ? i : branch));
        x += SW.get(c.id) + gapX;
        edges.push({ from: n.id, to: c.id });
      });
      cx = (cxs[0] + cxs[cxs.length - 1]) / 2;
    }
    boxes.push({ id: n.id, x: cx - boxW / 2, y: rowY[depth], w: boxW, h: H.get(n.id), cx, depth, sw, branch });
    return cx;
  }
  let x = 0;
  tops.forEach((r, i) => { place(r, x, 0, tops.length > 1 ? i : -1); x += SW.get(r.id) + gapX; });
  return {
    boxes, edges, rowY,
    width: Math.max(0, x - gapX),
    height: rowH.length ? rowY[rowH.length - 1] + rowH[rowH.length - 1] : 0
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { needsToItems, boardToItems, matchAlerts, parseDeep, estimateBoxHeight, layoutTree };
}
if (typeof document === 'undefined') return; // node test context — stop before browser app

/* ============================ browser app ============================ */

const SRC = window.ATLAS_SRC || '/api/atlas';
const PAGE = window.ATLAS_PAGE || { id: 'map', title: 'Atlas', icon: '🧭', dataFile: '', sibling: null };
const LS_EXPAND = 'atlas-expand-' + PAGE.id;
const LS_VIEW = 'atlas-view-' + PAGE.id;

let DATA = null;
const NODES = new Map();   // id → node
const PARENT = new Map();  // id → parent id
const ORDER = [];          // DFS order of ids
const NODEEL = new Map();  // id → .at-node wrapper
const ROWEL = new Map();   // id → .at-row
const BADGE = new Map();   // id → badge span
let expanded = new Set();
let selectedId = null;
let query = '';
let searchShow = new Set(), searchOpen = new Set(), searchOwn = new Set();
let ALERTS = {};           // id → [{src,text}]

/* diagram view state */
const ROOT_ID = '__atlas_root__';   // virtual root box (page title) — always open, not a data node
const PALETTE = ['#e7c08b', '#4f9cf9', '#34c98e', '#a78bfa', '#f87171', '#2dd4bf', '#fb923c', '#f472b6', '#22d3ee', '#a3e635'];
const DIAG_GAPX = 26, DIAG_LEVELGAP = 64;
const DBOX = new Map();    // id → { box: .at-box div, badge: alert badge span }
let viewMode = 'list';     // 'list' | 'diagram'
let diagBuilt = false, fitDone = false;
let diagEl, canvasEl, worldEl, drawerEl, drawerBody;
let btnList, btnDiag;
let lastLayout = null;
let view = { x: 40, y: 24, s: 1 };  // pan/zoom transform of .at-world

const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const lsGet = (k, fb) => { try { const v = localStorage.getItem(k); return v == null ? fb : JSON.parse(v); } catch { return fb; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

function copyText(t, btn) {
  const ok = () => { const old = btn.textContent; btn.textContent = '✓ copied'; setTimeout(() => { btn.textContent = old; }, 1200); };
  const fail = () => { btn.textContent = 'copy failed'; setTimeout(() => { btn.textContent = 'copy'; }, 1500); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, fail);
  else fail();
}

/* ---------- skeleton ---------- */
let treeEl, detailEl, mainEl, searchInput, updatedEl;

function buildSkeleton() {
  const head = el('header', 'at-head');
  const brand = el('div', 'at-brand');
  const title = el('div', 'at-title');
  title.append(document.createTextNode((PAGE.icon || '') + ' ' + (PAGE.title || 'Atlas') + ' '));
  const b = el('b', null, '· Timeless'); title.appendChild(b);
  updatedEl = el('div', 'at-sub', 'loading…');
  brand.append(title, updatedEl);

  const search = el('div', 'at-search');
  searchInput = el('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'search the tree… (label, summary, deep dive, personas)';
  searchInput.addEventListener('input', () => runSearch(searchInput.value.trim().toLowerCase()));
  searchInput.addEventListener('keydown', e => { if (e.key === 'Escape') { searchInput.value = ''; runSearch(''); searchInput.blur(); } });
  const clearBtn = el('button', null, '✕');
  clearBtn.type = 'button';
  clearBtn.title = 'clear search';
  clearBtn.addEventListener('click', () => { searchInput.value = ''; runSearch(''); });
  search.append(searchInput, clearBtn);

  const viewGrp = el('div', 'at-view');
  btnList = el('button', 'on', '☰ List');
  btnList.type = 'button'; btnList.title = 'tree + detail panel';
  btnList.addEventListener('click', () => setView('list'));
  btnDiag = el('button', null, '🗂 Diagram');
  btnDiag.type = 'button'; btnDiag.title = 'org-chart canvas — pan, zoom, click boxes';
  btnDiag.addEventListener('click', () => setView('diagram'));
  viewGrp.append(btnList, btnDiag);

  const links = el('nav', 'at-links');
  const back = el('a', null, '← Cockpit'); back.href = '/';
  links.appendChild(back);
  if (PAGE.sibling && PAGE.sibling.href) {
    const sib = el('a', null, PAGE.sibling.label || PAGE.sibling.href);
    sib.href = PAGE.sibling.href;
    links.appendChild(sib);
  }
  head.append(brand, search, viewGrp, links);

  const legend = el('div', 'at-legend');
  const lg = (dotCls, label) => { const s = el('span', 'lg'); s.append(el('span', 'at-dot ' + dotCls), document.createTextNode(' ' + label)); return s; };
  legend.append(lg('live', 'live'), lg('partial', 'partial'), lg('todo', 'todo'), lg('gated', 'gated'));
  const bl = el('span', 'lg');
  const bb = el('span', 'at-badge', '2');
  bl.append(bb, document.createTextNode(' open items on the needs/task boards mention this node'));
  legend.appendChild(bl);

  mainEl = el('main', 'at-main');
  treeEl = el('aside', 'at-tree');
  detailEl = el('section', 'at-detail');
  mainEl.append(treeEl, detailEl);

  const foot = el('footer', 'at-foot');
  foot.append(document.createTextNode('Data: '), el('code', null, 'cockpit/data/' + (PAGE.dataFile || '?.json')), document.createTextNode(' — edit and reload.'));

  document.body.append(head, legend, mainEl, foot);
}

function showEmptyState(msg) {
  mainEl.textContent = '';
  const box = el('div', 'at-none');
  box.appendChild(el('div', 'big', '🗒'));
  const p1 = el('p');
  p1.append(el('b', null, 'No data yet. '), document.createTextNode(msg));
  const p2 = el('p');
  p2.append(document.createTextNode('Write '), el('code', null, 'cockpit/data/' + (PAGE.dataFile || 'the data file')), document.createTextNode(' and reload this page — it will be picked up automatically.'));
  box.append(p1, p2);
  mainEl.appendChild(box);
}

/* ---------- tree ---------- */
function indexTree(nodes, parentId) {
  for (const n of nodes || []) {
    if (!n || !n.id) continue;
    NODES.set(n.id, n);
    ORDER.push(n.id);
    if (parentId) PARENT.set(n.id, parentId);
    indexTree(n.children, n.id);
  }
}

function buildNodeEl(node, depth) {
  const wrap = el('div', 'at-node');
  wrap.dataset.id = node.id;
  const row = el('div', 'at-row');
  row.style.paddingLeft = (6 + depth * 15) + 'px';

  const hasKids = Array.isArray(node.children) && node.children.length > 0;
  const caret = el('button', 'at-caret' + (hasKids ? '' : ' none'));
  caret.type = 'button';
  if (hasKids) {
    caret.setAttribute('aria-label', 'expand/collapse');
    caret.appendChild(el('span', 'at-caret-i', '▸'));
    caret.addEventListener('click', e => { e.stopPropagation(); toggleExpand(node.id); });
  }
  const ico = el('span', 'at-ico', node.icon || '·');
  const lbl = el('span', 'at-lbl', node.label || node.id);
  const dot = el('span', 'at-dot ' + (node.status || 'todo'));
  dot.title = node.status || 'todo';
  const badge = el('span', 'at-badge');
  badge.hidden = true;
  row.append(caret, ico, lbl, dot, badge);
  row.addEventListener('click', () => select(node.id, { scroll: true }));
  wrap.appendChild(row);

  if (hasKids) {
    const kids = el('div', 'at-kids');
    const inner = el('div', 'at-kids-in');
    for (const c of node.children) if (c && c.id) inner.appendChild(buildNodeEl(c, depth + 1));
    kids.appendChild(inner);
    wrap.appendChild(kids);
  }
  NODEEL.set(node.id, wrap);
  ROWEL.set(node.id, row);
  BADGE.set(node.id, badge);
  return wrap;
}

function renderTree() {
  treeEl.textContent = '';
  for (const n of DATA.tree) if (n && n.id) treeEl.appendChild(buildNodeEl(n, 0));
  applyExpand();
}

function isOpen(id) { return query ? searchOpen.has(id) : expanded.has(id); }

function applyExpand() {
  for (const [id, wrap] of NODEEL) {
    const n = NODES.get(id);
    if (!n || !Array.isArray(n.children) || !n.children.length) continue;
    wrap.classList.toggle('open', isOpen(id));
  }
}

function saveExpand() { lsSet(LS_EXPAND, [...expanded]); }

function toggleExpand(id) {
  if (query) { searchOpen.has(id) ? searchOpen.delete(id) : searchOpen.add(id); }
  else {
    expanded.has(id) ? expanded.delete(id) : expanded.add(id);
    saveExpand();
  }
  applyExpand();
  if (viewMode === 'diagram') renderDiagram();
}

function expandAncestors(id) {
  let p = PARENT.get(id), changed = false;
  while (p) {
    if (query) { if (!searchOpen.has(p)) { searchOpen.add(p); changed = true; } }
    else if (!expanded.has(p)) { expanded.add(p); changed = true; }
    p = PARENT.get(p);
  }
  if (changed) {
    if (!query) saveExpand();
    applyExpand();
    if (viewMode === 'diagram') renderDiagram();
  }
}

/* ---------- search ---------- */
function nodeSearchText(n) {
  const parts = [n.id, n.label, n.summary, n.deep, n.channel, n.customer];
  for (const p of n.personas || []) {
    parts.push(p.name, p.verdict);
    for (const f of p.findings || []) parts.push(f);
    for (const a of p.adds || []) parts.push(a);
  }
  return parts.filter(Boolean).join('  ').toLowerCase();
}

function runSearch(q) {
  query = q;
  if (!q) {
    for (const w of NODEEL.values()) w.classList.remove('hide');
    applyExpand();
    if (viewMode === 'diagram') renderDiagram();
    return;
  }
  searchShow = new Set(); searchOpen = new Set(); searchOwn = new Set();
  const walk = n => {
    const own = nodeSearchText(n).includes(q);
    if (own) searchOwn.add(n.id);
    let childHit = false;
    for (const c of n.children || []) if (c && c.id && walk(c)) childHit = true;
    if (childHit) searchOpen.add(n.id);
    if (own || childHit) searchShow.add(n.id);
    return own || childHit;
  };
  for (const n of DATA.tree) if (n && n.id) walk(n);
  for (const [id, w] of NODEEL) w.classList.toggle('hide', !searchShow.has(id));
  applyExpand();
  if (viewMode === 'diagram') renderDiagram();
}

/* ---------- selection + keyboard ---------- */
function select(id, opts) {
  const n = NODES.get(id);
  if (!n) return;
  opts = opts || {};
  if (selectedId && ROWEL.get(selectedId)) ROWEL.get(selectedId).classList.remove('sel');
  selectedId = id;
  const row = ROWEL.get(id);
  if (row) row.classList.add('sel');
  expandAncestors(id);
  try { history.replaceState(null, '', '#' + encodeURIComponent(id)); } catch {}
  renderDetail(n);
  if (viewMode === 'diagram') {
    for (const [bid, o] of DBOX) o.box.classList.toggle('sel', bid === id);
    if (opts.drawer) openDrawer();
  } else {
    if (row && opts.scroll !== false) row.scrollIntoView({ block: 'nearest' });
    if (opts.scroll && window.innerWidth < 900) detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function visibleIds() {
  const out = [];
  const walk = (nodes, shown) => {
    for (const n of nodes || []) {
      if (!n || !n.id) continue;
      const vis = shown && (!query || searchShow.has(n.id));
      if (vis) out.push(n.id);
      walk(n.children, vis && isOpen(n.id));
    }
  };
  walk(DATA ? DATA.tree : [], true);
  return out;
}

function onKey(e) {
  if (e.target && /^(input|textarea|select)$/i.test(e.target.tagName)) return;
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const rows = visibleIds();
  if (!rows.length) return;
  e.preventDefault();
  const i = rows.indexOf(selectedId);
  if (e.key === 'ArrowDown') select(rows[i < 0 ? 0 : Math.min(rows.length - 1, i + 1)], { scroll: false });
  else if (e.key === 'ArrowUp') select(rows[i < 0 ? 0 : Math.max(0, i - 1)], { scroll: false });
  else if (e.key === 'ArrowRight') {
    const n = NODES.get(selectedId);
    if (n && Array.isArray(n.children) && n.children.length) {
      if (!isOpen(n.id)) toggleExpand(n.id);
      else if (n.children[0] && n.children[0].id) select(n.children[0].id, { scroll: false });
    }
  } else if (e.key === 'ArrowLeft') {
    const n = NODES.get(selectedId);
    if (n && Array.isArray(n.children) && n.children.length && isOpen(n.id)) toggleExpand(n.id);
    else { const p = PARENT.get(selectedId); if (p) select(p, { scroll: false }); }
  }
  const r = ROWEL.get(selectedId);
  if (r) r.scrollIntoView({ block: 'nearest' });
}

/* ---------- detail panel ---------- */
let alertsSec = null; // live-refreshed slot

function section(parent, heading) {
  const s = el('div', 'at-sec');
  if (heading) s.appendChild(el('div', 'at-sec-h', heading));
  parent.appendChild(s);
  return s;
}

function renderDetail(n) {
  detailEl.textContent = '';
  alertsSec = null;

  // title row
  const tr = el('div', 'at-dt-title');
  tr.appendChild(el('span', 'big', n.icon || '·'));
  tr.appendChild(el('h2', null, n.label || n.id));
  if (n.stage != null) tr.appendChild(el('span', 'at-chip stage', 'Stage ' + n.stage));
  if (n.channel) tr.appendChild(el('span', 'at-chip channel', String(n.channel)));
  tr.appendChild(el('span', 'at-chip ' + (n.status || 'todo'), n.status || 'todo'));
  detailEl.appendChild(tr);

  if (n.summary) detailEl.appendChild(el('p', 'at-summary', n.summary));

  // ALERTS (always create the slot so the 60s refresh can fill it; hidden when empty)
  alertsSec = el('div', 'at-sec');
  detailEl.appendChild(alertsSec);
  renderAlertsSection(n.id);

  // Confirmations
  if (Array.isArray(n.confirmations) && n.confirmations.length) {
    const s = section(detailEl, 'Confirmations');
    n.confirmations.forEach((c, idx) => s.appendChild(confirmationEl(n, c, idx)));
  }

  // Copy blocks (journey)
  if (Array.isArray(n.copy) && n.copy.length) {
    const s = section(detailEl, 'Copy blocks');
    for (const c of n.copy) {
      if (!c) continue;
      const box = el('div', 'at-copy');
      const cl = el('div', 'cl');
      cl.appendChild(el('b', null, c.label || 'copy'));
      const btn = el('button', 'at-btn', 'copy');
      btn.type = 'button';
      btn.addEventListener('click', () => copyText(String(c.text || ''), btn));
      cl.appendChild(btn);
      const pre = el('pre', 'at-mono', c.text || '');
      box.append(cl, pre);
      s.appendChild(box);
    }
  }

  // What to tell the customer
  if (n.customer) {
    const s = section(detailEl, null);
    const call = el('div', 'at-cust');
    call.appendChild(el('span', 'cl2', '💬 WHAT TO TELL THE CUSTOMER'));
    call.appendChild(document.createTextNode(n.customer));
    s.appendChild(call);
  }

  // Next steps
  if (Array.isArray(n.next) && n.next.length) {
    const s = section(detailEl, 'Next steps');
    const ol = el('ol', 'at-next');
    for (const step of n.next) ol.appendChild(el('li', null, String(step)));
    s.appendChild(ol);
  }

  // Personas & expert findings
  if (Array.isArray(n.personas) && n.personas.length) {
    const s = section(detailEl, 'Personas & expert findings');
    for (const p of n.personas) {
      if (!p) continue;
      const d = el('details', 'at-persona');
      const sum = el('summary');
      sum.append(el('span', 'pc', '▸'), el('span', 'pn', p.name || 'persona'), el('span', 'pv', p.verdict || ''));
      d.appendChild(sum);
      const body = el('div', 'pb');
      if (Array.isArray(p.findings) && p.findings.length) {
        body.appendChild(el('h4', null, 'Findings'));
        const ul = el('ul');
        for (const f of p.findings) ul.appendChild(el('li', null, String(f)));
        body.appendChild(ul);
      }
      if (Array.isArray(p.adds) && p.adds.length) {
        body.appendChild(el('h4', null, 'Adds'));
        const ul = el('ul');
        for (const a of p.adds) ul.appendChild(el('li', null, String(a)));
        body.appendChild(ul);
      }
      d.appendChild(body);
      s.appendChild(d);
    }
  }

  // Deep dive
  if (n.deep) {
    const s = section(detailEl, 'Deep dive');
    const box = el('div', 'at-deep');
    for (const blk of parseDeep(n.deep)) {
      if (blk.type === 'p') box.appendChild(el('p', null, blk.text));
      else {
        const ul = el('ul');
        for (const it of blk.items) ul.appendChild(el('li', null, it));
        box.appendChild(ul);
      }
    }
    s.appendChild(box);
  }

  // Docs
  if (Array.isArray(n.docs) && n.docs.length) {
    const s = section(detailEl, 'Docs');
    for (const d of n.docs) {
      if (!d) continue;
      const row = el('div', 'at-doc');
      row.appendChild(el('span', 'dl', d.label || 'doc'));
      row.appendChild(el('code', null, d.path || ''));
      const btn = el('button', 'at-btn', 'copy');
      btn.type = 'button';
      btn.addEventListener('click', () => copyText(String(d.path || ''), btn));
      row.appendChild(btn);
      s.appendChild(row);
    }
  }
}

function confirmationEl(node, c, idx) {
  const box = el('div', 'at-conf');
  if (c.state === 'confirmed') {
    const qr = el('div', 'qrow');
    qr.appendChild(el('span', 'tick', '✓'));
    const wrap = el('div');
    wrap.appendChild(el('div', 'q', c.q || ''));
    if (c.a) {
      const a = el('div', 'a');
      a.append(el('b', null, 'confirmed: '), document.createTextNode(c.a));
      wrap.appendChild(a);
    }
    qr.appendChild(wrap);
    box.appendChild(qr);
    box.classList.add('done');
    return box;
  }
  // state:'ask' — interactive, persisted
  const key = 'atlas-confirm-' + PAGE.id + '-' + node.id + '-' + idx;
  const stored = lsGet(key, null) || {};
  const qr = el('div', 'qrow');
  const cb = el('input');
  cb.type = 'checkbox';
  cb.checked = !!stored.done;
  const wrap = el('div');
  wrap.style.flex = '1';
  wrap.appendChild(el('div', 'q', c.q || ''));
  if (c.hint) wrap.appendChild(el('div', 'hint', c.hint));
  const ans = el('input', 'ans');
  ans.type = 'text';
  ans.placeholder = 'your one-line answer…';
  ans.value = stored.a != null ? stored.a : (c.a || '');
  wrap.appendChild(ans);
  wrap.appendChild(el('div', 'cap', 'you confirm this — tick when true'));
  const save = () => { lsSet(key, { done: cb.checked, a: ans.value }); box.classList.toggle('done', cb.checked); };
  cb.addEventListener('change', save);
  ans.addEventListener('change', save);
  ans.addEventListener('input', save);
  qr.append(cb, wrap);
  box.appendChild(qr);
  box.classList.toggle('done', cb.checked);
  return box;
}

function renderAlertsSection(nodeId) {
  if (!alertsSec) return;
  alertsSec.textContent = '';
  const hits = ALERTS[nodeId];
  if (!hits || !hits.length) { alertsSec.style.display = 'none'; return; }
  alertsSec.style.display = '';
  alertsSec.appendChild(el('div', 'at-sec-h', 'Alerts — open items mentioning this node'));
  for (const h of hits) {
    const a = el('div', 'at-alert');
    a.appendChild(el('span', 'src', '⚠ from ' + h.src + ':'));
    a.appendChild(el('span', null, h.text));
    alertsSec.appendChild(a);
  }
}

/* ---------- diagram view (org-chart canvas) ---------- */
function hexToRgba(hex, a) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || ''));
  if (!m) return 'rgba(155,176,208,' + a + ')';
  const v = parseInt(m[1], 16);
  return 'rgba(' + ((v >> 16) & 255) + ',' + ((v >> 8) & 255) + ',' + (v & 255) + ',' + a + ')';
}

function setView(mode, save) {
  if (mode === 'diagram' && (!DATA || !Array.isArray(DATA.tree) || !DATA.tree.length)) mode = 'list';
  viewMode = mode === 'diagram' ? 'diagram' : 'list';
  if (save !== false) lsSet(LS_VIEW, viewMode);
  if (btnList) btnList.classList.toggle('on', viewMode === 'list');
  if (btnDiag) btnDiag.classList.toggle('on', viewMode === 'diagram');
  if (!mainEl) return;
  mainEl.classList.toggle('diagram', viewMode === 'diagram');
  if (viewMode === 'diagram') {
    ensureDiagram();
    if (detailEl && drawerBody && detailEl.parentElement !== drawerBody) drawerBody.appendChild(detailEl);
    renderDiagram();
    if (!fitDone) { fitView(); fitDone = true; }
  } else {
    closeDrawer();
    if (detailEl && detailEl.parentElement !== mainEl) mainEl.appendChild(detailEl);
  }
}

function ensureDiagram() {
  if (diagBuilt) return;
  diagBuilt = true;

  diagEl = el('section', 'at-diagram');
  canvasEl = el('div', 'at-canvas');
  worldEl = el('div', 'at-world');
  canvasEl.appendChild(worldEl);

  const ctl = el('div', 'at-cctl');
  const mk = (t, title, fn) => {
    const b = el('button', null, t);
    b.type = 'button'; b.title = title;
    b.addEventListener('click', fn);
    return b;
  };
  ctl.append(
    mk('⊹ Fit', 'fit the whole tree in view', fitView),
    mk('+', 'zoom in', () => zoomCenter(1.25)),
    mk('−', 'zoom out', () => zoomCenter(0.8))
  );
  canvasEl.appendChild(ctl);
  diagEl.appendChild(canvasEl);
  mainEl.appendChild(diagEl);

  // slide-over detail drawer (hosts detailEl while in diagram view)
  drawerEl = el('aside', 'at-drawer');
  const dh = el('div', 'at-drawer-h');
  dh.appendChild(el('span', 't', 'Detail'));
  const x = el('button', 'at-drawer-x', '✕');
  x.type = 'button'; x.title = 'close (Esc)';
  x.addEventListener('click', closeDrawer);
  dh.appendChild(x);
  drawerBody = el('div', 'at-drawer-b');
  drawerEl.append(dh, drawerBody);
  document.body.appendChild(drawerEl);

  // pan (pointer events cover mouse + touch; touch-action:none in CSS)
  let panning = null;
  canvasEl.addEventListener('pointerdown', e => {
    if (e.target.closest('.at-box, .at-cctl, .at-kchip')) return;
    panning = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: view.x, oy: view.y };
    try { canvasEl.setPointerCapture(e.pointerId); } catch {}
    canvasEl.classList.add('panning');
  });
  canvasEl.addEventListener('pointermove', e => {
    if (!panning || e.pointerId !== panning.id) return;
    view.x = panning.ox + (e.clientX - panning.sx);
    view.y = panning.oy + (e.clientY - panning.sy);
    applyView();
  });
  const endPan = e => {
    if (panning && e.pointerId === panning.id) { panning = null; canvasEl.classList.remove('panning'); }
  };
  canvasEl.addEventListener('pointerup', endPan);
  canvasEl.addEventListener('pointercancel', endPan);

  // zoom toward cursor (wheel; trackpad pinch arrives as ctrlKey+wheel with small deltas)
  canvasEl.addEventListener('wheel', e => {
    e.preventDefault();
    const r = canvasEl.getBoundingClientRect();
    const f = Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016));
    zoomAt(e.clientX - r.left, e.clientY - r.top, f);
  }, { passive: false });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (e.target && /^(input|textarea|select)$/i.test(e.target.tagName)) return;
    closeDrawer();
  });

  let rzT = null;
  window.addEventListener('resize', () => {
    if (viewMode !== 'diagram') return;
    clearTimeout(rzT);
    rzT = setTimeout(renderDiagram, 150);
  });
}

function applyView() {
  if (!worldEl) return;
  worldEl.style.transform = 'translate(' + view.x + 'px,' + view.y + 'px) scale(' + view.s + ')';
  canvasEl.style.backgroundPosition = view.x + 'px ' + view.y + 'px';
}

function zoomAt(mx, my, factor) {
  const s2 = Math.max(0.3, Math.min(2.5, view.s * factor));
  const k = s2 / view.s;
  view.x = mx - k * (mx - view.x);
  view.y = my - k * (my - view.y);
  view.s = s2;
  applyView();
}

function zoomCenter(factor) {
  const r = canvasEl.getBoundingClientRect();
  zoomAt(r.width / 2, r.height / 2, factor);
}

function fitView() {
  if (!canvasEl || !lastLayout || !lastLayout.width || !lastLayout.height) return;
  const r = canvasEl.getBoundingClientRect();
  const pad = 50;
  const s = Math.min((r.width - pad * 2) / lastLayout.width, (r.height - pad * 2) / lastLayout.height, 1);
  view.s = Math.max(0.3, Math.min(2.5, s));
  view.x = (r.width - lastLayout.width * view.s) / 2;
  view.y = Math.max(24, (r.height - lastLayout.height * view.s) / 2);
  applyView();
}

function branchColor(branch) { return PALETTE[((branch % PALETTE.length) + PALETTE.length) % PALETTE.length]; }

function renderDiagram() {
  if (!worldEl || !DATA || !Array.isArray(DATA.tree)) return;
  const boxW = window.innerWidth < 720 ? 150 : 200;
  const root = { id: ROOT_ID, label: DATA.title || PAGE.title || 'Atlas', icon: PAGE.icon || '', children: DATA.tree };
  lastLayout = layoutTree([root], {
    boxW, gapX: DIAG_GAPX, levelGap: DIAG_LEVELGAP,
    isOpen: id => id === ROOT_ID || isOpen(id)
  });

  worldEl.textContent = '';
  DBOX.clear();
  const byId = new Map(lastLayout.boxes.map(b => [b.id, b]));

  // edges — one SVG underlay, elbow connectors in the target's branch colour
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'at-edges');
  svg.setAttribute('width', String(Math.ceil(lastLayout.width)));
  svg.setAttribute('height', String(Math.ceil(lastLayout.height)));
  for (const ed of lastLayout.edges) {
    const a = byId.get(ed.from), b = byId.get(ed.to);
    if (!a || !b) continue;
    const midY = b.y - DIAG_LEVELGAP / 2;
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', 'M ' + a.cx + ' ' + (a.y + a.h) + ' L ' + a.cx + ' ' + midY + ' L ' + b.cx + ' ' + midY + ' L ' + b.cx + ' ' + b.y);
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', hexToRgba(branchColor(b.branch < 0 ? 0 : b.branch), 0.4));
    p.setAttribute('stroke-width', '2');
    p.setAttribute('stroke-linecap', 'round');
    svg.appendChild(p);
  }
  worldEl.appendChild(svg);

  // boxes — absolutely-positioned divs above the SVG
  for (const b of lastLayout.boxes) {
    const isRoot = b.id === ROOT_ID;
    const n = isRoot ? root : NODES.get(b.id);
    if (!n) continue;
    const div = el('div', 'at-box' + (isRoot ? ' root' : b.depth === 1 ? ' top' : ' kid'));
    div.style.left = b.x + 'px';
    div.style.top = b.y + 'px';
    div.style.width = b.w + 'px';
    div.style.height = b.h + 'px';
    if (!isRoot) {
      const col = branchColor(b.branch < 0 ? 0 : b.branch);
      if (b.depth === 1) { div.style.background = col; div.style.borderColor = col; }
      else {
        const a = b.depth === 2 ? 0.30 : b.depth === 3 ? 0.20 : 0.14;
        div.style.background = hexToRgba(col, a);
        div.style.borderColor = hexToRgba(col, Math.min(0.75, a + 0.32));
      }
    }
    div.appendChild(el('span', 'at-box-ico', n.icon || '·'));
    div.appendChild(el('span', 'at-box-lbl', n.label || n.id));
    div.title = (n.label || n.id) + (n.status ? ' — ' + n.status : '');

    if (!isRoot) {
      const dot = el('span', 'at-dot ' + (n.status || 'todo'));
      dot.title = n.status || 'todo';
      div.appendChild(dot);
      const badge = el('span', 'at-box-badge');
      badge.hidden = true;
      div.appendChild(badge);
      const kn = Array.isArray(n.children) ? n.children.filter(c => c && c.id).length : 0;
      if (kn && !isOpen(b.id)) {
        const chip = el('button', 'at-kchip', '+' + kn);
        chip.type = 'button';
        chip.title = 'expand ' + kn + ' child' + (kn === 1 ? '' : 'ren');
        chip.addEventListener('click', e => { e.stopPropagation(); toggleExpand(b.id); });
        div.appendChild(chip);
      }
      if (query) {
        if (searchOwn.has(b.id)) div.classList.add('glow');
        else if (!searchShow.has(b.id)) div.classList.add('faded');
      }
      if (b.id === selectedId) div.classList.add('sel');
      div.addEventListener('click', () => select(b.id, { scroll: false, drawer: true }));
      div.addEventListener('dblclick', e => { e.preventDefault(); if (kn) toggleExpand(b.id); });
      DBOX.set(b.id, { box: div, badge });
    } else {
      div.addEventListener('dblclick', fitView);
    }
    worldEl.appendChild(div);
  }

  worldEl.style.width = lastLayout.width + 'px';
  worldEl.style.height = lastLayout.height + 'px';
  applyView();
  updateDiagramBadges();
}

function updateDiagramBadges() {
  for (const [id, o] of DBOX) {
    const hits = ALERTS[id];
    if (hits && hits.length) {
      o.badge.hidden = false;
      o.badge.textContent = String(hits.length);
      o.badge.title = hits.length + ' open board item(s) mention this';
    } else { o.badge.hidden = true; o.badge.textContent = ''; }
  }
}

function openDrawer() { if (drawerEl && viewMode === 'diagram') drawerEl.classList.add('open'); }
function closeDrawer() { if (drawerEl) drawerEl.classList.remove('open'); }

/* ---------- live alerts (needs + board, every 60s) ---------- */
async function loadAlerts() {
  let needs = null, board = null;
  try { needs = await (await fetch('/api/needs')).json(); } catch {}
  try { board = await (await fetch('/api/board')).json(); } catch {}
  const items = needsToItems(needs).concat(boardToItems(board));
  const flat = [];
  for (const [id, n] of NODES) flat.push({ id, watch: n.watch });
  ALERTS = matchAlerts(items, flat);
  for (const [id, badge] of BADGE) {
    const hits = ALERTS[id];
    if (hits && hits.length) { badge.hidden = false; badge.textContent = String(hits.length); badge.title = hits.length + ' open board item(s) mention this'; }
    else { badge.hidden = true; badge.textContent = ''; }
  }
  updateDiagramBadges();
  if (selectedId) renderAlertsSection(selectedId);
  if (updatedEl && DATA) {
    updatedEl.textContent = (DATA.updated ? 'updated ' + DATA.updated : 'no updated stamp') +
      ' · alerts checked ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

/* ---------- boot ---------- */
async function boot() {
  document.title = 'Timeless · ' + (PAGE.title || 'Atlas');
  buildSkeleton();

  try { DATA = await (await fetch(SRC)).json(); }
  catch { DATA = null; }

  if (!DATA || !Array.isArray(DATA.tree) || !DATA.tree.length) {
    updatedEl.textContent = 'no data file';
    showEmptyState('The data file for this page has not been written yet.');
    return;
  }

  if (DATA.title) {
    const t = document.querySelector('.at-title');
    if (t) { t.textContent = ''; t.append(document.createTextNode((PAGE.icon || '') + ' ' + DATA.title + ' '), el('b', null, '· Timeless')); }
  }
  updatedEl.textContent = (DATA.updated ? 'updated ' + DATA.updated : '') + (DATA.subtitle ? ' · ' + DATA.subtitle : '');

  indexTree(DATA.tree, null);

  const saved = lsGet(LS_EXPAND, null);
  if (Array.isArray(saved)) expanded = new Set(saved.filter(id => NODES.has(id)));
  else for (const n of DATA.tree) if (n && n.id) expanded.add(n.id); // first visit: open the roots

  renderTree();

  // deep link via hash, else select the first root
  let initial = null;
  try { initial = decodeURIComponent((location.hash || '').slice(1)); } catch {}
  const hadHash = !!(initial && NODES.has(initial));
  if (hadHash) select(initial, { scroll: false });
  else if (DATA.tree[0] && DATA.tree[0].id) select(DATA.tree[0].id, { scroll: false });

  // restore per-page view choice; deep links open the drawer in diagram view
  if (lsGet(LS_VIEW, 'list') === 'diagram') {
    setView('diagram', false);
    if (hadHash) openDrawer();
  }

  window.addEventListener('hashchange', () => {
    let id = null;
    try { id = decodeURIComponent((location.hash || '').slice(1)); } catch {}
    if (id && NODES.has(id) && id !== selectedId) select(id, { scroll: false, drawer: true });
  });
  document.addEventListener('keydown', onKey);

  loadAlerts();
  setInterval(loadAlerts, 60000);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
