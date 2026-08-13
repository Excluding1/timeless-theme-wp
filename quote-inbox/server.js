#!/usr/bin/env node
/* Timeless QUOTE INBOX — a clean, readable view of every quote-form request.
 *
 * Why this exists: new quotes land in GoHighLevel as "opportunities" with ~100 raw
 * custom fields + Cloudinary image LINKS. Reading one means scrolling GHL and opening
 * Cloudinary tabs. This shows each request as ONE card: who, where, the per-area SCOPE,
 * priced modifiers, risk/missing-info flags, and the actual PHOTOS inline (HEIC
 * auto-converted so they display) — so you can decide/quote or call in seconds.
 *
 * Start:  node quote-inbox/server.js   →   http://localhost:4319
 * Zero dependencies, localhost only, dev tooling — NEVER deployed.
 * The GHL token is read from .secrets/ and used server-side ONLY; it is never sent
 * to the browser (the browser only ever receives cleaned quote data). */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.QUOTE_INBOX_PORT || 4319;
const REPO = path.join(__dirname, '..');
const SECRET_FILE = path.join(REPO, '.secrets/ghl-pit.key');
const PUBLIC = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const REVIEWED_FILE = path.join(DATA_DIR, 'reviewed.json');

const LOCATION_ID = 'Uz8fQwDiUxAHVtlruspD';
const SALES_PIPELINE = 'YTgWxSeFt2oyd3zBe2Xr';
// Chrome UA required or Cloudflare returns 1010 on the GHL API.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const MIME = { '.js':'application/javascript', '.css':'text/css', '.html':'text/html; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.ico':'image/x-icon' };

// ── reviewed state: in-memory Set is the source of truth, mirrored to disk atomically ──
let REVIEWED = loadReviewed();
function loadReviewed() {
  try { return new Set(JSON.parse(fs.readFileSync(REVIEWED_FILE, 'utf8'))); }
  catch (e) { if (e.code !== 'ENOENT') console.warn('[quote-inbox] could not read reviewed.json:', e.message); return new Set(); }
}
function saveReviewed() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = REVIEWED_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify([...REVIEWED]));
    fs.renameSync(tmp, REVIEWED_FILE); // atomic replace
  } catch (e) { console.warn('[quote-inbox] could not write reviewed.json:', e.message); }
}

function readPIT() {
  try { return fs.readFileSync(SECRET_FILE, 'utf8').trim(); }
  catch { return null; }
}

/* Minimal GHL GET helper (Promise<json>). Rejects on non-2xx so auth/permission
 * failures surface as a visible error instead of a fake empty inbox. */
function ghlGet(pathAndQuery, pit) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'services.leadconnectorhq.com',
      path: pathAndQuery,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${pit}`, 'Version': '2021-07-28', 'User-Agent': UA, 'Accept': 'application/json' },
    }, res => {
      let buf = '';
      res.on('data', d => buf += d);
      res.on('error', e => reject(new Error('GHL response error: ' + e.message)));
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300)
          return reject(new Error(`GHL HTTP ${res.statusCode}: ${buf.slice(0, 180)}`));
        try { resolve(JSON.parse(buf)); }
        catch { reject(new Error('GHL returned non-JSON (Cloudflare block?): ' + buf.slice(0, 120))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('GHL timeout')));
    req.end();
  });
}

/* Cloudinary: force browser-displayable JPEG (source may be .heic) at a sane size.
 * Insert a transformation segment right after /image/upload/. */
function cloudinaryTransform(url, transform) {
  if (typeof url !== 'string' || !url.includes('/image/upload/')) return url;
  return url.replace('/image/upload/', `/image/upload/${transform}/`);
}
const toDisplay = u => cloudinaryTransform(u, 'f_jpg,q_auto:good,w_1600');
const toThumb   = u => cloudinaryTransform(u, 'f_jpg,q_auto,w_600,h_600,c_fill');

/* Parse a field that should be a JSON array of URLs but may be "[]", a JSON string,
 * or the broken "[object Object]" sentinel. Returns array of url strings. */
function parseUrls(val) {
  if (!val || typeof val !== 'string') return [];
  if (val.includes('[object Object]')) return [];
  const s = val.trim();
  try {
    const j = JSON.parse(s);
    if (Array.isArray(j)) return j.filter(x => typeof x === 'string' && x.startsWith('http'));
  } catch {}
  const m = s.match(/https?:\/\/[^\s",\]]+/g);
  return m ? m : [];
}
function parseJsonArray(val) {
  if (!val || typeof val !== 'string' || val.includes('[object Object]')) return [];
  try { const j = JSON.parse(val); return Array.isArray(j) ? j : []; } catch { return []; }
}
/* The quote form corrupts em-dashes into runs of U+FFFD before writing to GHL
 * (same form-side encoding bug as [object Object]). Restore a clean dash so the
 * quoter reads the scope, not mojibake. Cosmetic only — the source stays as-is. */
function cleanText(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/\s*�+\s*/g, ' — ').trim();
}

// ── human labels ──
const AREA_LABEL = { walls:'Walls', shower:'Shower', basin_vanity:'Basin & vanity', bath:'Bath',
  floor:'Floor', full_bathroom:'Full bathroom', unsure:'Not sure / other', tiles:'Tiles' };
const SERVICE_LABEL = { regrout:'Regrout', full_regrout:'Full regrout', resurface:'Resurface',
  both:'Regrout + resurface', custom:'Custom scope', chip_only:'Chip repair only', chip:'Chip repair' };
const areaLabel = a => AREA_LABEL[a] || titleCaseKey(a);
const serviceLabel = s => SERVICE_LABEL[s] || titleCaseKey(s);
function titleCaseKey(s){ return String(s||'').replace(/[_-]+/g,' ').replace(/\b\w/g, c=>c.toUpperCase()); }

// which photo fields map to which area (for grouping)
const PHOTO_FIELDS = [
  ['Photos Basin Vanity Urls','basin_vanity'], ['Photos Shower Urls','shower'],
  ['Photos Walls Urls','walls'], ['Photos Bath Urls','bath'], ['Photos Floor Urls','floor'],
  ['Photos Unsure Urls','unsure'], ['Photos Full Bathroom Urls','full_bathroom'],
];

/* Map an opportunity + its custom fields (by human name) into a clean quote object. */
function buildQuote(opp, defsById, stagesById) {
  const cf = {};
  for (const f of (opp.customFields || [])) {
    const name = defsById[f.id] ? defsById[f.id].trim() : f.id;
    let v = f.fieldValueString;
    if (v === undefined) v = f.fieldValueNumber;
    if (v === undefined) v = f.fieldValueArray;
    if (v === undefined) v = f.fieldValue; // some field types surface here
    cf[name] = v;
  }
  const contact = opp.contact || {};

  // photos grouped by area
  const photosByArea = [];
  const seen = new Set();
  for (const [field, area] of PHOTO_FIELDS) {
    const urls = parseUrls(cf[field]);
    const shots = [];
    for (const u of urls) {
      if (seen.has(u)) continue; seen.add(u);
      shots.push({ full: toDisplay(u), thumb: toThumb(u), raw: u, heic: /\.heic(\?|$)/i.test(u) });
    }
    if (shots.length) photosByArea.push({ area, label: areaLabel(area), photos: shots });
  }
  const photoTotalShown = photosByArea.reduce((n, g) => n + g.photos.length, 0);
  const photoCountClaimed = Number(cf['Photo Count Total'] || 0) || 0;
  const fullBathMode = (cf['Full Bathroom Mode'] || '') === 'yes';
  // Photos genuinely lost: full-bathroom submissions store only in the broken field.
  const photosLost = (fullBathMode && photoCountClaimed > 0 && photoTotalShown === 0) ? photoCountClaimed : 0;

  // structured scope + priced modifiers (the closest thing to a quote in the data)
  const lineItems = parseJsonArray(cf['Resolved Line Items']).map(li => ({
    area: areaLabel(li.area), service: serviceLabel(li.service),
    description: cleanText(li.description || ''), skuCount: Array.isArray(li.sku_pool) ? li.sku_pool.length : 0,
  }));
  const modifiers = parseJsonArray(cf['Resolved Modifiers']).map(m => ({
    label: cleanText(m.label || m.key || 'Modifier'), delta: typeof m.delta === 'number' ? m.delta : null,
  }));
  const rejectionFlags = parseJsonArray(cf['Resolved Rejection Flags']).map(r => ({
    label: cleanText(r.label || r.id || 'Flag'), severity: r.severity || 'info',
  }));

  const desc = [cf['Not Sure Description'], cf['Customer Notes']]
    .map(s => cleanText((s || '').trim())).filter(Boolean);
  const brokenFields = Object.entries(cf)
    .filter(([, v]) => typeof v === 'string' && v.includes('[object Object]'))
    .map(([k]) => k);

  const phone = contact.phone || '';
  const bathCount = Number(cf['Bathroom Count'] || 0) || 0;
  const liftAccess = (cf['Lift Access'] || '').toLowerCase();
  const ventilation = (cf['Has Ventilation'] || '').toLowerCase();

  // risk / missing-info checklist — what the quoter must watch or chase
  const flags = [];
  // (photosLost is surfaced by its own prominent banner in the card, not duplicated here)
  if (!phone) flags.push({ sev:'high', text:'No phone on file — reply by email in GHL' });
  if (!photoTotalShown && !photosLost) flags.push({ sev:'info', text:'No photos uploaded — worth a call to see the bathroom' });
  for (const r of rejectionFlags) flags.push({ sev: r.severity === 'critical' ? 'high':'info', text: r.label });
  if (bathCount > 1) flags.push({ sev:'info', text:`${bathCount} bathrooms — price the whole job` });
  if (liftAccess && liftAccess !== 'n/a' && liftAccess !== 'no') flags.push({ sev:'info', text:`Access: ${titleCaseKey(liftAccess)}` });
  if (ventilation === 'not_asked') flags.push({ sev:'info', text:'Ventilation not captured' });
  if (brokenFields.length) flags.push({ sev:'info', text:'Some per-area detail did not save (form bug) — confirm scope' });

  const stage = stagesById[opp.pipelineStageId] || '';
  const min = cf['Quote Total Min'], max = cf['Quote Total Max'];

  return {
    id: opp.id,
    name: opp.name || contact.name || 'Unnamed',
    customer: contact.name || (opp.name || '').split(' - ')[0],
    phone,
    email: contact.email || '',
    address: cf['property_address'] || (opp.name || '').split(' - ').slice(1).join(' - '),
    createdAt: opp.createdAt || opp.updatedAt || null,
    stage, stageId: opp.pipelineStageId, status: opp.status,
    bathroomCount: bathCount || '',
    bathroomIndex: cf['Bathroom Index'] || '',
    tier: cf['Pricing Tier Resolved'] || '',
    fullBathroomMode: cf['Full Bathroom Mode'] || '',
    fullBathroomScope: cf['Full Bathroom Scope'] || '',
    basinFinish: cf['Basin Finish'] || '',
    epoxyMode: cf['Epoxy Mode'] || '',
    prevResurfaced: cf['Prev Resurfaced'] || '',
    liftAccess: cf['Lift Access'] || '',
    ventilation: cf['Has Ventilation'] || '',
    photosUploaded: cf['Photos Uploaded'] || '',
    photoCountClaimed, photosLost,
    selectedAreas: cf['Selected Areas'] || '',
    servicesSummary: cleanText((cf['Services Summary'] || '').trim()),
    description: desc,
    lineItems, modifiers, flags,
    multiBathDiscount: (cf['Multi Bathroom Discount'] != null && cf['Multi Bathroom Discount'] !== '') ? Number(cf['Multi Bathroom Discount']) : null,
    quoteMin: (min != null && min !== '') ? Number(min) : null,
    quoteMax: (max != null && max !== '') ? Number(max) : null,
    photosByArea,
    reviewed: REVIEWED.has(opp.id),
    ghlUrl: `https://app.gohighlevel.com/v2/location/${LOCATION_ID}/opportunities/list?opportunity=${opp.id}`,
    _brokenFields: brokenFields,
  };
}

// ── cached lookups ──
let _defsCache = null, _defsAt = 0, _stagesCache = null, _stagesAt = 0;
async function getDefs(pit) {
  if (_defsCache && Date.now() - _defsAt < 10 * 60 * 1000) return _defsCache;
  const d = await ghlGet(`/locations/${LOCATION_ID}/customFields?model=opportunity`, pit);
  const map = {};
  for (const f of (d.customFields || [])) map[f.id] = f.name;
  _defsCache = map; _defsAt = Date.now();
  return map;
}
async function getPipelineStages(pit) {
  if (_stagesCache && Date.now() - _stagesAt < 10 * 60 * 1000) return _stagesCache;
  const d = await ghlGet(`/opportunities/pipelines?locationId=${LOCATION_ID}`, pit);
  const stages = {};
  for (const p of (d.pipelines || [])) for (const s of (p.stages || [])) stages[s.id] = s.name;
  _stagesCache = stages; _stagesAt = Date.now();
  return stages;
}

/* Fetch ALL open opportunities in the Sales pipeline, following the cursor. */
async function fetchAllOpps(pit) {
  const out = [];
  let url = `/opportunities/search?location_id=${LOCATION_ID}&pipeline_id=${SALES_PIPELINE}&limit=100`;
  for (let i = 0; i < 10; i++) { // hard cap 1000 opps
    const d = await ghlGet(url, pit);
    const batch = d.opportunities || [];
    out.push(...batch);
    const m = d.meta || {};
    if (!batch.length || !m.startAfterId || out.length >= 1000) break;
    url = `/opportunities/search?location_id=${LOCATION_ID}&pipeline_id=${SALES_PIPELINE}&limit=100&startAfter=${m.startAfter}&startAfterId=${m.startAfterId}`;
  }
  return out;
}

async function handleQuotes(res) {
  const pit = readPIT();
  if (!pit) return json(res, 500, { error: 'no GHL token found at .secrets/ghl-pit.key' });
  try {
    const [defs, stages] = await Promise.all([getDefs(pit), getPipelineStages(pit)]);
    const opps = (await fetchAllOpps(pit))
      .map(o => buildQuote(o, defs, stages))
      .sort((a, b) => (new Date(b.createdAt || 0)) - (new Date(a.createdAt || 0)));
    json(res, 200, { count: opps.length, quotes: opps });
  } catch (e) {
    json(res, 502, { error: String(e.message || e) });
  }
}

/* ── ZIP of every photo on a quote — rebuilt 2026-08-13 (lost in the repo incident) ──
 * Hand-rolled ZIP (STORE only, CRC32), zero dependencies. Only Cloudinary URLs are
 * fetched, and only server-side, so the browser never talks to Cloudinary directly. */
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function makeZip(files) {          // files: [{name, data:Buffer}]
  const locals = [], centrals = [];
  let offset = 0;
  for (const f of files) {
    const nameB = Buffer.from(f.name, 'utf8');
    const crc = crc32(f.data);
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0); head.writeUInt16LE(20, 4);
    head.writeUInt16LE(0x0800, 6);     head.writeUInt16LE(0, 8);   // UTF-8 names, STORE
    head.writeUInt32LE(crc, 14);
    head.writeUInt32LE(f.data.length, 18); head.writeUInt32LE(f.data.length, 22);
    head.writeUInt16LE(nameB.length, 26);
    locals.push(head, nameB, f.data);
    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(20, 4); cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0x0800, 8);     cen.writeUInt16LE(0, 10);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(f.data.length, 20); cen.writeUInt32LE(f.data.length, 24);
    cen.writeUInt16LE(nameB.length, 28);
    cen.writeUInt32LE(offset, 42);
    centrals.push(cen, nameB);
    offset += 30 + nameB.length + f.data.length;
  }
  const cenSize = centrals.reduce((a, b) => a + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(cenSize, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}
function fetchBin(url, redirects) {
  return new Promise((resolve, reject) => {
    if ((redirects || 0) > 3) return reject(new Error('too many redirects'));
    https.get(url, { headers: { 'User-Agent': UA } }, r => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location)
        return resolve(fetchBin(r.headers.location, (redirects || 0) + 1));
      if (r.statusCode !== 200) { r.resume(); return reject(new Error('HTTP ' + r.statusCode)); }
      const chunks = [];
      r.on('data', d => chunks.push(d));
      r.on('end', () => resolve(Buffer.concat(chunks)));
      r.on('error', reject);
    }).on('error', reject);
  });
}
async function handleZip(res, body) {
  const { name, urls } = JSON.parse(body || '{}');
  if (!Array.isArray(urls) || !urls.length || urls.length > 60) return json(res, 400, { error: 'bad urls' });
  if (!urls.every(u => typeof u === 'string' && /^https:\/\/res\.cloudinary\.com\//.test(u)))
    return json(res, 400, { error: 'cloudinary urls only' });
  const files = [];
  let i = 0;
  for (const u of urls) {
    i++;
    try {
      const data = await fetchBin(u);
      const extM = u.match(/\.(jpe?g|png|webp|heic)(?=$|[?#])/i);
      files.push({ name: `photo-${String(i).padStart(2, '0')}${extM ? '.' + extM[1].toLowerCase() : '.jpg'}`, data });
    } catch (e) { console.warn('[zip] skipped', u.slice(0, 80), e.message); }
  }
  if (!files.length) return json(res, 502, { error: 'no photos could be fetched' });
  const zip = makeZip(files);
  const safe = String(name || 'photos').replace(/[^\w \-]/g, '').trim() || 'photos';
  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename="${safe}.zip"`,
    'Content-Length': zip.length,
  });
  res.end(zip);
}

function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

function serveStatic(req, res) {
  let p = req.url.split('?')[0];
  if (p === '/') p = '/index.html';
  const file = path.join(PUBLIC, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  if (file !== PUBLIC && !file.startsWith(PUBLIC + path.sep)) { res.writeHead(403); return res.end('no'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'text/plain' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // belt-and-braces: only serve local hosts (blocks DNS-rebinding to this dev tool)
  const host = (req.headers.host || '').split(':')[0];
  if (host && host !== 'localhost' && host !== '127.0.0.1') { res.writeHead(403); return res.end('local only'); }

  if (req.url.startsWith('/api/quotes')) return handleQuotes(res);

  if (req.url.startsWith('/api/zip') && req.method === 'POST') {
    let body = '';
    let tooBig = false;
    req.on('data', d => {
      body += d;
      if (body.length > 200000) { tooBig = true; req.destroy(); }
    });
    req.on('close', () => { if (tooBig && !res.headersSent) json(res, 413, { error: 'body too large' }); });
    req.on('end', () => { handleZip(res, body).catch(e => { if (!res.headersSent) json(res, 500, { error: String(e.message || e) }); }); });
    return;
  }

  if (req.url.startsWith('/api/review') && req.method === 'POST') {
    let body = '';
    let tooBig = false;
    req.on('data', d => {
      body += d;
      if (body.length > 100000) { tooBig = true; req.destroy(); }
    });
    req.on('close', () => { if (tooBig && !res.headersSent) json(res, 413, { error: 'body too large' }); });
    req.on('end', () => {
      try {
        const { id, reviewed } = JSON.parse(body || '{}');
        if (typeof id !== 'string' || !id || id.length > 200) return json(res, 400, { error: 'bad id' });
        if (reviewed) REVIEWED.add(id); else REVIEWED.delete(id);
        saveReviewed();
        json(res, 200, { ok: true, count: REVIEWED.size });
      } catch (e) { json(res, 400, { error: String(e.message || e) }); }
    });
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  Timeless Quote Inbox → http://localhost:${PORT}\n  (localhost only · GHL token stays server-side)\n`);
});
