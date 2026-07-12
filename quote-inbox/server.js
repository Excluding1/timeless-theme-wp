#!/usr/bin/env node
/* Timeless QUOTE INBOX — a clean, readable view of every quote-form request.
 *
 * Why this exists: new quotes land in GoHighLevel as "opportunities" with ~30 raw
 * custom fields + Cloudinary image LINKS. Reading one means scrolling GHL and opening
 * Cloudinary tabs. This shows each request as ONE card: who, where, how many bathrooms,
 * what they want, and the actual PHOTOS inline (HEIC auto-converted so they display) —
 * so you can quote or call in seconds.
 *
 * Start:  node quote-inbox/server.js   →   http://localhost:4319
 * Zero dependencies, localhost only, dev tooling — NEVER deployed.
 * The GHL token is read from .secrets/ and used server-side ONLY; it is never sent
 * to the browser. */
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

function readPIT() {
  try { return fs.readFileSync(SECRET_FILE, 'utf8').trim(); }
  catch { return null; }
}
function loadReviewed() {
  try { return new Set(JSON.parse(fs.readFileSync(REVIEWED_FILE, 'utf8'))); }
  catch { return new Set(); }
}
function saveReviewed(set) {
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(REVIEWED_FILE, JSON.stringify([...set], null, 0)); } catch {}
}

/* Minimal GHL GET helper (Promise<json>). */
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
      res.on('end', () => { try { resolve(JSON.parse(buf)); } catch (e) { reject(new Error('bad json from GHL: ' + buf.slice(0, 200))); } });
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('GHL timeout')));
    req.end();
  });
}

/* Cloudinary: force browser-displayable JPEG (source may be .heic) at a sane size.
 * Insert a transformation segment right after /upload/. */
function cloudinaryTransform(url, transform) {
  if (typeof url !== 'string' || !url.includes('/image/upload/')) return url;
  return url.replace('/image/upload/', `/image/upload/${transform}/`);
}
function toDisplay(url) { return cloudinaryTransform(url, 'f_jpg,q_auto:good,w_1600'); }
function toThumb(url)   { return cloudinaryTransform(url, 'f_jpg,q_auto,w_600,h_600,c_fill'); }

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
  // fallback: pull any cloudinary/http urls out of the raw string
  const m = s.match(/https?:\/\/[^\s",\]]+/g);
  return m ? m : [];
}

/* Map an opportunity + its custom fields (by human name) into a clean quote object. */
function buildQuote(opp, defsById, stagesById, reviewed) {
  const cf = {};
  for (const f of (opp.customFields || [])) {
    const name = defsById[f.id] ? defsById[f.id].trim() : f.id;
    let v = f.fieldValueString;
    if (v === undefined) v = f.fieldValueNumber;
    if (v === undefined) v = f.fieldValueArray;
    cf[name] = v;
  }
  const contact = opp.contact || {};
  // collect every "*Urls" photo field into one gallery, de-duped
  const photoSet = new Set();
  for (const [name, val] of Object.entries(cf)) {
    if (/Urls?$/i.test(name) || /Photos/i.test(name)) {
      for (const u of parseUrls(val)) photoSet.add(u);
    }
  }
  const photos = [...photoSet].map(u => ({ full: toDisplay(u), thumb: toThumb(u), raw: u,
    heic: /\.heic(\?|$)/i.test(u) }));

  const desc = [cf['Not Sure Description'], cf['Issue Description'], cf['Customer Notes']]
    .map(s => (s || '').trim()).filter(Boolean);

  const min = cf['Quote Total Min'], max = cf['Quote Total Max'];
  const stage = stagesById[opp.pipelineStageId] || '';
  const brokenFields = Object.entries(cf)
    .filter(([, v]) => typeof v === 'string' && v.includes('[object Object]'))
    .map(([k]) => k);

  return {
    id: opp.id,
    name: opp.name || contact.name || 'Unnamed',
    customer: contact.name || (opp.name || '').split(' - ')[0],
    phone: contact.phone || '',
    email: contact.email || '',
    address: cf['property_address'] || (opp.name || '').split(' - ').slice(1).join(' - '),
    createdAt: opp.createdAt,
    stage,
    stageId: opp.pipelineStageId,
    status: opp.status,
    bathroomCount: cf['Bathroom Count'] || '',
    bathroomIndex: cf['Bathroom Index'] || '',
    propertyType: cf['Property Type'] || '',
    tier: cf['Pricing Tier Resolved'] || '',
    fullBathroomMode: cf['Full Bathroom Mode'] || '',
    basinFinish: cf['Basin Finish'] || '',
    liftAccess: cf['Lift Access'] || '',
    ventilation: cf['Has Ventilation'] || '',
    builtBefore1990: cf['Built Before 1990'] || '',
    photosUploaded: cf['Photos Uploaded'] || '',
    photoCount: cf['Photo Count Total'] || photos.length,
    selectedAreas: cf['Selected Areas'] || '',
    servicesSummary: (cf['Services Summary'] || '').trim(),
    quoteSummaryShort: (cf['quote_summary_short'] || '').trim(),
    description: desc,
    quoteMin: (min != null && min !== '') ? Number(min) : null,
    quoteMax: (max != null && max !== '') ? Number(max) : null,
    photos,
    reviewed: reviewed.has(opp.id),
    ghlUrl: `https://app.gohighlevel.com/v2/location/${LOCATION_ID}/opportunities/list?opportunity=${opp.id}`,
    _brokenFields: brokenFields, // form-side data bug: per-area objects stringified
  };
}

let _defsCache = null, _defsAt = 0;
async function getDefs(pit) {
  if (_defsCache && Date.now() - _defsAt < 10 * 60 * 1000) return _defsCache;
  const d = await ghlGet(`/locations/${LOCATION_ID}/customFields?model=opportunity`, pit);
  const map = {};
  for (const f of (d.customFields || [])) map[f.id] = f.name;
  _defsCache = map; _defsAt = Date.now();
  return map;
}

async function getPipelineStages(pit) {
  const d = await ghlGet(`/opportunities/pipelines?locationId=${LOCATION_ID}`, pit);
  const stages = {};
  for (const p of (d.pipelines || [])) for (const s of (p.stages || [])) stages[s.id] = s.name;
  return stages;
}

async function handleQuotes(res) {
  const pit = readPIT();
  if (!pit) return json(res, 500, { error: 'no GHL token found at .secrets/ghl-pit.key' });
  try {
    const [defs, stages] = await Promise.all([getDefs(pit), getPipelineStages(pit)]);
    const reviewed = loadReviewed();
    const search = await ghlGet(
      `/opportunities/search?location_id=${LOCATION_ID}&pipeline_id=${SALES_PIPELINE}&limit=100`, pit);
    const opps = (search.opportunities || [])
      .map(o => buildQuote(o, defs, stages, reviewed))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    json(res, 200, { count: opps.length, quotes: opps });
  } catch (e) {
    json(res, 502, { error: String(e.message || e) });
  }
}

function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(body);
}

function serveStatic(req, res) {
  let p = req.url.split('?')[0];
  if (p === '/') p = '/index.html';
  const file = path.join(PUBLIC, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end('no'); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'text/plain' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/quotes')) return handleQuotes(res);
  if (req.url.startsWith('/api/review') && req.method === 'POST') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      try {
        const { id, reviewed } = JSON.parse(body || '{}');
        const set = loadReviewed();
        if (reviewed) set.add(id); else set.delete(id);
        saveReviewed(set);
        json(res, 200, { ok: true, reviewed: [...set] });
      } catch (e) { json(res, 400, { error: String(e) }); }
    });
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  Timeless Quote Inbox → http://localhost:${PORT}\n  (localhost only · GHL token stays server-side)\n`);
});
