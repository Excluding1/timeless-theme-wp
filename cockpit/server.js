#!/usr/bin/env node
/* Timeless CEO Cockpit — zero-dependency local command-center.
 * Auto-syncs with the current Claude Code session + Cleo (codex) runs.
 * Start:  node cockpit/server.js   →   http://localhost:4317
 * No npm install, no cloud, no DB. Localhost only. Dev tooling — never deployed. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.COCKPIT_PORT || 4317;
const HOME = os.homedir();
const PROJECT_DIR = path.join(HOME, '.claude/projects/-Users-excluding-Downloads-timeless-theme-wp');
const CODEX_SESSIONS = path.join(HOME, '.codex/sessions');
const CLEO_RUNS = '/tmp/cleo-runs';
const TASK_MD = '/tmp/task-checklist.md';
const TECH_STACK = '/Users/excluding/Downloads/timeless-theme-wp/docs/specs/tech-stack-explainer.html';
const QUOTE_DIR = '/Users/excluding/Downloads/timeless-theme-wp/assets/quote-form';
const MIME = { '.js':'application/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.html':'text/html; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.gif':'image/gif', '.json':'application/json', '.woff2':'font/woff2' };
const PUBLIC = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const CONFIG_DIR = path.join(DATA_DIR, 'config');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const NEEDS_FILE = path.join(DATA_DIR, 'needs.json');
const PIPELINE_FILE = path.join(DATA_DIR, 'pipeline.json');
const SCOREBOARD_FILE = path.join(DATA_DIR, 'scoreboard.json');
const ATLAS_FILE = path.join(DATA_DIR, 'business-map.json');
const JOURNEY_FILE = path.join(DATA_DIR, 'journey.json');

const trunc = (s, n) => { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n) + '…' : s; };

function newest(dir, test) {
  try {
    return fs.readdirSync(dir).map(f => path.join(dir, f))
      .filter(p => { try { return test(p); } catch { return false; } })
      .map(p => ({ p, t: fs.statSync(p).mtimeMs })).sort((a, b) => b.t - a.t)[0]?.p || null;
  } catch { return null; }
}
const newestJsonl = () => newest(PROJECT_DIR, p => p.endsWith('.jsonl') && fs.statSync(p).isFile());
const newestCleoRun = () => newest(CLEO_RUNS, p => fs.statSync(p).isDirectory());
function newestRollout() {
  let best = null, bt = 0;
  const walk = d => { let es; try { es = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of es) { const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.startsWith('rollout-') && e.name.endsWith('.jsonl')) { try { const t = fs.statSync(p).mtimeMs; if (t > bt) { bt = t; best = p; } } catch {} } } };
  walk(CODEX_SESSIONS); return best;
}

function toolSummary(b) {
  const n = b.name || 'tool', i = b.input || {};
  const base = f => trunc(String(f || '').split('/').pop(), 60);
  if (n === 'Bash') return '⌘ ' + trunc(i.description || i.command, 90);
  if (n === 'Edit' || n === 'Write' || n === 'NotebookEdit') return '✎ ' + n + ' ' + base(i.file_path);
  if (n === 'Read') return '◰ Read ' + base(i.file_path);
  if (n === 'Agent') return '⛏ Agent: ' + trunc(i.description, 80);
  if (n === 'TodoWrite') return '☑ updated the task list';
  if (n === 'Grep' || n === 'Glob') return '⌕ ' + n + ' ' + trunc(i.pattern, 50);
  if (/^mcp__/.test(n)) return '⚙ ' + n.replace(/^mcp__/, '');
  return '⛏ ' + n;
}

function parseSession() {
  const file = newestJsonl();
  if (!file) return { events: [], tasks: [], agents: [], file: null };
  let lines; try { lines = fs.readFileSync(file, 'utf8').split('\n'); } catch { return { events: [], tasks: [], agents: [], file: null }; }
  const events = []; let tasks = null; const agents = [];
  for (const line of lines) {
    if (!line) continue; let o; try { o = JSON.parse(line); } catch { continue; }
    const msg = o.message; if (!msg) continue;
    const ts = o.timestamp || ''; const role = msg.role || o.type; const who = role === 'user' ? 'You' : 'Clifford';
    const c = msg.content;
    if (typeof c === 'string') { if (c.trim() && !c.startsWith('<')) events.push({ ts, who, kind: 'text', text: c }); }
    else if (Array.isArray(c)) {
      for (const b of c) {
        if (b.type === 'text' && b.text && b.text.trim()) events.push({ ts, who, kind: 'text', text: b.text });
        else if (b.type === 'tool_use') {
          if (b.name === 'TodoWrite' && b.input && Array.isArray(b.input.todos)) tasks = b.input.todos;
          if (b.name === 'Agent' && b.input) agents.push({ ts, desc: trunc(b.input.description || 'agent', 44) });
          events.push({ ts, who: 'Clifford', kind: 'tool', text: toolSummary(b) });
        }
      }
    }
  }
  return { events: events.slice(-40).map(e => ({ ...e, text: trunc(e.text, 600) })), tasks: tasks || [], agents: agents.slice(-6), file: path.basename(file) };
}

function parseCleoFeed() {
  const file = newestRollout(); if (!file) return { events: [], file: null };
  let lines; try { lines = fs.readFileSync(file, 'utf8').split('\n'); } catch { return { events: [], file: null }; }
  const ev = [];
  const pick = p => p.message || p.text || p.summary || (typeof p.content === 'string' ? p.content : '') || '';
  for (const line of lines) {
    if (!line) continue; let o; try { o = JSON.parse(line); } catch { continue; }
    if (o.type === 'event_msg' && o.payload) {
      const p = o.payload, ts = o.timestamp || '';
      if (p.type === 'agent_message') { const t = pick(p); if (t.trim()) ev.push({ ts, kind: 'text', text: trunc(t, 500) }); }
      else if (/reasoning/.test(p.type || '')) { const t = pick(p); if (t.trim()) ev.push({ ts, kind: 'think', text: trunc(t, 280) }); }
      else if (p.type === 'task_started') ev.push({ ts, kind: 'tool', text: '▶ task started' });
      else if (p.type === 'exec_command_begin' && p.command) ev.push({ ts, kind: 'tool', text: '⌘ ' + trunc([].concat(p.command).join(' '), 80) });
    }
  }
  let mtime = null; try { mtime = fs.statSync(file).mtimeMs; } catch {}
  return { events: ev.slice(-30), file: path.basename(file), mtime };
}

function parseCleo() {
  const dir = newestCleoRun(); if (!dir) return { status: 'idle', run: null };
  const read = f => { try { return fs.readFileSync(path.join(dir, f), 'utf8'); } catch { return ''; } };
  let meta = {}; try { meta = JSON.parse(read('meta.json') || '{}'); } catch {}
  const diag = read('diagnostic.log'); const stdout = read('stdout.log').trim();
  let status = 'running';
  if (/Exit:\s*0\b/.test(diag)) status = 'done';
  else if (/Exit:\s*124|TIMEOUT/.test(diag)) status = 'timed-out';
  else if (/Exit:\s*\d/.test(diag)) status = 'exited';
  return { status, run: path.basename(dir), model: meta.model || '', diagTail: diag.split('\n').filter(Boolean).slice(-4).join('\n'), answer: trunc(stdout, 1400) };
}

function readBoard() { try { return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8')); } catch { return { updated: null, tasks: [] }; } }
function writeBoard(o) { o.updated = new Date().toISOString().slice(0, 10); fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(TASKS_FILE, JSON.stringify(o, null, 2)); return o; }
function readNeeds() { try { return JSON.parse(fs.readFileSync(NEEDS_FILE, 'utf8')); } catch { return { updated: null, items: [] }; } }
function writeNeeds(o) { o.updated = new Date().toISOString().slice(0, 10); fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(NEEDS_FILE, JSON.stringify(o, null, 2)); return o; }
function readPipeline() { try { return JSON.parse(fs.readFileSync(PIPELINE_FILE, 'utf8')); } catch { return { updated: null, source: '', phases: [] }; } }
function writePipeline(o) { o.updated = new Date().toISOString().slice(0, 10); fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(PIPELINE_FILE, JSON.stringify(o, null, 2)); return o; }
function readScoreboard() { try { return JSON.parse(fs.readFileSync(SCOREBOARD_FILE, 'utf8')); } catch { return { updated: null, weeks: {} }; } }
function writeScoreboard(o) { o.updated = new Date().toISOString().slice(0, 10); fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(SCOREBOARD_FILE, JSON.stringify(o, null, 2)); return o; }
const AGENT_CARDS_DIR = path.join(HOME, '.timeless', 'cards'); // launchd agents spool here (TCC keeps them out of ~/Downloads)
function listConfig() {
  const dirs = [CONFIG_DIR, AGENT_CARDS_DIR];
  const seen = new Map();
  for (const dir of dirs) {
    let files = []; try { files = fs.readdirSync(dir).filter(f => f.endsWith('.md')); } catch { continue; }
    for (const f of files) {
      try {
        const p = path.join(dir, f); const st = fs.statSync(p); const content = fs.readFileSync(p, 'utf8');
        const m = content.match(/Last updated:\s*(\d{4}-\d{2}-\d{2})/i); const stamp = m ? m[1] : null;
        const ageDays = Math.floor((Date.now() - (stamp ? new Date(stamp).getTime() : st.mtimeMs)) / 86400000);
        seen.set(f.replace(/\.md$/, ''), { name: f.replace(/\.md$/, ''), content, stamp, ageDays }); // later dir (agent spool) wins on name clash
      } catch { /* unreadable card — skip */ }
    }
  }
  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
}
function saveConfig(name, content) {
  const safe = String(name || '').replace(/[^a-z0-9_-]/gi, '').toLowerCase(); if (!safe) throw new Error('bad config name');
  const today = new Date().toISOString().slice(0, 10); let body = String(content || '');
  body = /Last updated:/i.test(body) ? body.replace(/Last updated:.*/i, 'Last updated: ' + today) : 'Last updated: ' + today + '\n\n' + body;
  fs.mkdirSync(CONFIG_DIR, { recursive: true }); fs.writeFileSync(path.join(CONFIG_DIR, safe + '.md'), body); return safe;
}
function tasksFromMd() { try { return fs.readFileSync(TASK_MD, 'utf8').split('\n').filter(l => /^\s*[-*]\s*\[[ xX]\]|^\s*\d+\.\s|^#{1,3}\s/.test(l)).slice(0, 60).join('\n'); } catch { return ''; } }
const readBody = req => new Promise(resolve => { let d = ''; req.on('data', c => { d += c; if (d.length > 2e6) req.destroy(); }); req.on('end', () => resolve(d)); });

const json = (res, obj) => { res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
const sendFile = (res, file, type) => { try { res.writeHead(200, { 'Content-Type': type }); res.end(fs.readFileSync(file)); } catch { res.writeHead(404); res.end('not found'); } };

http.createServer(async (req, res) => {
  const url = req.url.split('?')[0]; const m = req.method;
  try {
    if (url === '/' || url === '/index.html') return sendFile(res, path.join(PUBLIC, 'index.html'), 'text/html; charset=utf-8');
    if (url === '/api/session') return json(res, parseSession());
    if (url === '/api/cleo') return json(res, parseCleo());
    if (url === '/api/cleo-feed') return json(res, parseCleoFeed());
    if (url === '/api/board' && m === 'GET') return json(res, readBoard());
    if (url === '/api/board' && m === 'POST') return json(res, writeBoard(JSON.parse((await readBody(req)) || '{}')));
    if (url === '/api/needs' && m === 'GET') return json(res, readNeeds());
    if (url === '/api/needs' && m === 'POST') return json(res, writeNeeds(JSON.parse((await readBody(req)) || '{}')));
    if (url === '/api/pipeline' && m === 'GET') return json(res, readPipeline());
    if (url === '/api/pipeline' && m === 'POST') return json(res, writePipeline(JSON.parse((await readBody(req)) || '{}')));
    if (url === '/api/scoreboard' && m === 'GET') return json(res, readScoreboard());
    if (url === '/api/scoreboard' && m === 'POST') return json(res, writeScoreboard(JSON.parse((await readBody(req)) || '{}')));
    if (url === '/api/config' && m === 'GET') return json(res, { items: listConfig() });
    if (url === '/api/config' && m === 'POST') { const b = JSON.parse((await readBody(req)) || '{}'); return json(res, { ok: true, name: saveConfig(b.name, b.content) }); }
    if (url === '/api/sprint') return json(res, { md: tasksFromMd() });
    if (url === '/tech-stack') return sendFile(res, TECH_STACK, 'text/html; charset=utf-8');
    if (url === '/map') return sendFile(res, path.join(PUBLIC, 'business-map.html'), 'text/html; charset=utf-8');
    if (url === '/journey') return sendFile(res, path.join(PUBLIC, 'journey.html'), 'text/html; charset=utf-8');
    if (url === '/atlas.js') return sendFile(res, path.join(PUBLIC, 'atlas.js'), 'application/javascript');
    if (url === '/atlas.css') return sendFile(res, path.join(PUBLIC, 'atlas.css'), 'text/css');
    if (url === '/api/atlas') { try { return json(res, JSON.parse(fs.readFileSync(ATLAS_FILE, 'utf8'))); } catch { return json(res, { updated: null, tree: [] }); } }
    if (url === '/api/journey') { try { return json(res, JSON.parse(fs.readFileSync(JOURNEY_FILE, 'utf8'))); } catch { return json(res, { updated: null, tree: [] }); } }
    if (url === '/quote' || url === '/quote/') return sendFile(res, path.join(QUOTE_DIR, 'index.html'), 'text/html; charset=utf-8');
    if (/^\/(quote-form\.(js|css)|favicon\.svg|icons\.svg)$/.test(url) || url.startsWith('/images/')) { const qp = path.join(QUOTE_DIR, url.replace(/^\//, '')); return sendFile(res, qp, MIME[path.extname(qp)] || 'application/octet-stream'); }
    if (url === '/api/health') return json(res, { ok: true, now: Date.now() });
    res.writeHead(404); res.end('not found');
  } catch (e) { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: String(e && e.message || e) })); }
}).listen(PORT, () => console.log(`Timeless CEO Cockpit → http://localhost:${PORT}  (Ctrl+C to stop)`));
