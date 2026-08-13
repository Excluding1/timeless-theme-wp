/* Quote Inbox front-end — one decision-ready card per quote request. No dependencies. */
const $ = s => document.querySelector(s);
let QUOTES = [];        // all quotes from server
let VIEW = [];          // filtered + searched list
let idx = 0;            // current card in VIEW
let filter = 'new';
let query = '';
let viewMode = localStorage.getItem('qi_view') || 'card';   // 'card' | 'list'
let lb = { photos: [], i: 0, lastFocus: null };

const FILTERS = [
  { key: 'new', label: 'New', test: q => q.stage === 'Quote Requested' && !q.reviewed },
  { key: 'qa', label: 'Q&A', test: q => q.stage === 'Q&A' && !q.reviewed },
  { key: 'open', label: 'All open', test: q => q.status === 'open' },
  { key: 'reviewed', label: 'Reviewed', test: q => q.reviewed },
];

function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function money(n){ return n==null ? null : (n<0?'−$':'$') + Math.abs(Number(n)).toLocaleString('en-AU'); }
function ago(iso){
  if(!iso) return '';
  const d = (Date.now() - new Date(iso)) / 1000;
  if (isNaN(d)) return '';
  if (d < 3600) return Math.max(1,Math.round(d/60)) + 'm ago';
  if (d < 86400) return Math.round(d/3600) + 'h ago';
  return Math.round(d/86400) + 'd ago';
}
function titleCase(s){ return String(s||'').replace(/[_-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); }
function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),1600); }

async function load(preserve){
  const keepId = preserve ? (VIEW[idx] && VIEW[idx].id) : null;
  const keepFilter = preserve ? filter : 'new';
  if(!preserve) $('#stage').innerHTML = '<div class="skel"></div>';
  try{
    const r = await fetch('/api/quotes');
    const d = await r.json();
    if (d.error) throw new Error(d.error);
    QUOTES = d.quotes || [];
    filter = keepFilter;
    applyFilter(filter, keepId);
  }catch(e){
    $('#counter').style.display='none'; $('#nav').style.display='none'; $('#hint').style.display='none';
    $('#stage').innerHTML = `<div class="status">Couldn't reach GoHighLevel right now.<br><b>${esc(e.message)}</b><br>
      <button class="retry" id="retry">Try again</button></div>`;
    $('#retry').onclick = ()=>load();
  }
}

function renderTabs(){
  $('#tabs').innerHTML = FILTERS.map(f=>{
    const n = QUOTES.filter(f.test).length;
    return `<button class="tab${f.key===filter?' active':''}" data-k="${f.key}">${f.label}<span class="n">${n}</span></button>`;
  }).join('');
  document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>applyFilter(t.dataset.k));
}

function applyFilter(k, keepId){
  filter = k;
  const f = FILTERS.find(x=>x.key===k) || FILTERS[0];
  VIEW = QUOTES.filter(f.test).filter(matchQuery);
  idx = keepId ? Math.max(0, VIEW.findIndex(q=>q.id===keepId)) : 0;
  renderTabs();
  render();
}
function matchQuery(q){
  if(!query) return true;
  const s = (q.customer+' '+q.address).toLowerCase();
  return s.includes(query);
}

function render(){
  document.querySelectorAll('#viewtoggle button').forEach(b=>b.classList.toggle('on', b.dataset.mode===viewMode));
  if(!VIEW.length){
    const msg = query ? `No matches for “${esc(query)}”.` : `Nothing in <b>${FILTERS.find(f=>f.key===filter).label}</b>.<br>🎉 All caught up.`;
    $('#stage').innerHTML = `<div class="status">${msg}</div>`;
    $('#counter').style.display='none'; $('#nav').style.display='none'; $('#hint').style.display='none';
    return;
  }
  if(viewMode==='list'){ renderList(); return; }
  idx = Math.max(0, Math.min(idx, VIEW.length-1));
  const q = VIEW[idx];
  $('#counter').style.display='flex';
  $('#pos').textContent = `${idx+1} of ${VIEW.length}`;
  $('#sub').textContent = q.reviewed ? 'Reviewed' : (q.stage||'');
  $('#stage').innerHTML = card(q);
  wireCard(q);
  $('#nav').style.display='flex';
  $('#prev').disabled = idx===0;
  $('#next').disabled = idx===VIEW.length-1;
  $('#hint').style.display='block';
}

/* compact list of all quotes in the current filter; click a row to open its full card */
function renderList(){
  $('#counter').style.display='flex';
  $('#pos').textContent = `${VIEW.length} ${VIEW.length===1?'quote':'quotes'}`;
  $('#sub').textContent = FILTERS.find(f=>f.key===filter).label;
  $('#nav').style.display='none';
  $('#hint').style.display='none';
  $('#stage').innerHTML = `<div class="qlist">${VIEW.map((q,i)=>{
    const nShots = q.photosByArea.reduce((n,g)=>n+g.photos.length,0);
    const thumb = nShots ? `<img class="thumb" loading="lazy" src="${esc(q.photosByArea[0].photos[0].thumb)}" alt="">` : `<span class="thumb none">📷</span>`;
    const highFlags = (q.flags||[]).filter(f=>f.sev==='high').length + (q.photosLost?1:0);
    const meta = [
      q.reviewed?'<span class="badge rev">Reviewed</span>':(q.stage==='Quote Requested'?'<span class="badge new">New</span>':`<span class="badge">${esc(q.stage)}</span>`),
      q.tier?`<span class="badge tier">${esc(q.tier)}</span>`:'',
      nShots?`<span class="badge">📷 ${nShots}</span>`:'',
      highFlags?`<span class="flag" title="${highFlags} thing(s) to check before quoting">▲ ${highFlags}</span>`:''
    ].join(' ');
    return `<button class="qrow" data-i="${i}">
      ${thumb}
      <span class="main"><span class="nm">${esc(q.customer)}</span><span class="ad">${esc(q.address||'No address')}</span></span>
      <span class="rmeta">${meta}<span class="when">${ago(q.createdAt)}</span></span>
    </button>`;
  }).join('')}</div>`;
  document.querySelectorAll('.qrow').forEach(el=>el.onclick=()=>{ idx=Number(el.dataset.i); viewMode='card'; localStorage.setItem('qi_view','card'); render(); window.scrollTo({top:0}); });
}

function card(q){
  // header badges — the quoting-decision trio up top: tier · bathrooms · photos · estimate
  const badges = [];
  if(q.stage==='Quote Requested' && !q.reviewed) badges.push('<span class="badge new">New request</span>');
  else if(q.reviewed) badges.push('<span class="badge rev">Reviewed</span>');
  else badges.push(`<span class="badge">${esc(q.stage)}</span>`);
  if(q.tier) badges.push(`<span class="badge tier">Tier ${esc(q.tier)}</span>`);
  if(q.bathroomCount) badges.push(`<span class="badge">${esc(q.bathroomCount)} bathroom${q.bathroomCount==1?'':'s'}</span>`);
  const nShots = q.photosByArea.reduce((n,g)=>n+g.photos.length,0);
  if(nShots) badges.push(`<span class="badge">📷 ${nShots} photo${nShots==1?'':'s'}</span>`);
  if(q.quoteMin!=null||q.quoteMax!=null) badges.push(`<span class="badge gold">Est ${money(q.quoteMin)||'?'}–${money(q.quoteMax)||'?'}</span>`);
  if(q.phone) badges.push(`<span class="badge">📞 ${esc(q.phone)}</span>`);

  // scope panel (Resolved Line Items) + priced modifiers
  let scope = '';
  if(q.lineItems.length){
    scope = `<div class="section"><p class="label">Job scope</p><div class="scope">${
      q.lineItems.map(li=>`<div class="li"><span class="area">${esc(li.area)}</span><span class="svc">${esc(li.service)}${li.description?`<span class="d">${esc(li.description)}</span>`:''}</span></div>`).join('')
    }</div>${modifiers(q)}</div>`;
  } else if(q.servicesSummary && !q.servicesSummary.includes('[object')){
    scope = `<div class="section"><p class="label">What they want</p><div class="scope"><div class="li"><span class="svc">${esc(q.servicesSummary)}</span></div></div>${modifiers(q)}</div>`;
  }

  // lost-photos loud warning
  const lost = q.photosLost ? `<div class="section"><div class="lost">⚠ ${q.photosLost} photo${q.photosLost>1?'s were':' was'} uploaded but lost before reaching us (a known full-bathroom form bug). Call the customer and ask them to text the photos, or book an inspection.</div></div>` : '';

  // risk / missing-info checklist
  const flags = q.flags.length ? `<div class="section"><p class="label">Before you quote</p><div class="flags">${
    q.flags.map(f=>`<div class="flag ${f.sev==='high'?'high':''}"><span class="ic">${f.sev==='high'?'▲':'•'}</span><span>${esc(f.text)}</span></div>`).join('')
  }</div></div>` : '';

  // customer's own words
  const desc = q.description.length ? q.description.map(esc).join('\n\n') : null;
  const reqBlock = `<div class="section"><p class="label">Customer's request${desc?`<button class="copy" data-copy="req">Copy</button>`:''}</p>
    ${desc?`<div class="req">${desc}</div>`:`<div class="req empty">No written description — see the scope and photos.</div>`}</div>`;

  // photos grouped by area
  let photos;
  if(nShots){
    const multi = q.photosByArea.length>1;
    photos = q.photosByArea.map(g=>`<div class="areagroup">${multi?`<p class="ah">${esc(g.label)} · ${g.photos.length}</p>`:''}
      <div class="gallery">${g.photos.map((p,i)=>`<button class="shot" data-full="${esc(p.full)}" data-area="${esc(g.area)}" aria-label="${esc(g.label)} photo ${i+1}"><img loading="lazy" src="${esc(p.thumb)}" alt="${esc(g.label)} photo ${i+1}"/>${p.heic?'<span class="tag">HEIC→JPG</span>':''}</button>`).join('')}</div></div>`).join('');
  } else if(!q.photosLost){
    photos = `<div class="nophoto">No photos uploaded${q.photosUploaded==='no'?' (customer skipped)':''} — worth a call.</div>`;
  } else photos = '';
  const photoSection = (nShots||(!q.photosLost)) ? `<div class="section"><div class="photohead"><p class="label">Photos${nShots?` (${nShots})`:''}</p>${nShots?`<button class="zipbtn" id="bZip">⬇ Download all (.zip)</button>`:''}</div>${photos}</div>` : '';

  // extra facts
  const facts=[];
  const raw=(k,v,sk=[])=>{ v=(v==null?'':String(v)).trim(); if(!v||sk.includes(v.toLowerCase())||['not_asked','n/a','no','none',''].includes(v.toLowerCase())) return; facts.push([k,titleCase(v)]); };
  raw('Basin finish', q.basinFinish, ['standard']);
  raw('Epoxy', q.epoxyMode==='epoxy'?'Epoxy upgrade':'');
  raw('Full bathroom scope', q.fullBathroomScope);
  raw('Previously resurfaced', q.prevResurfaced==='yes'?'Yes':'');
  const factsBlock = facts.length ? `<div class="section"><p class="label">Extra detail</p><div class="facts">${facts.map(([k,v])=>`<div class="fact"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join('')}</div></div>` : '';

  const mapHref = q.address ? `https://maps.google.com/?q=${encodeURIComponent(q.address)}` : null;

  return `
  <div class="card">
    <div class="chead">
      <div class="crow">
        <div class="who">
          <h2>${esc(q.customer)}</h2>
          ${mapHref?`<a class="addr" href="${esc(mapHref)}" target="_blank" rel="noopener">📍 ${esc(q.address)}</a>`:`<span class="addr">📍 No address given</span>`}
        </div>
        <span class="when">${ago(q.createdAt)}</span>
      </div>
      <div class="badges">${badges.join('')}</div>
    </div>
    <div class="cbody">
      ${lost}${flags}${scope}${reqBlock}${photoSection}${factsBlock}
    </div>
    <div class="footer-actions">
      ${q.phone?`<a class="btn call" id="bCall" href="tel:${esc(q.phone.replace(/\s/g,''))}">📞 <span class="full">Call </span>${esc((q.customer||'').split(' ')[0]||'customer')}</a>`:''}
      <a class="btn ghl" id="bGhl" href="${esc(q.ghlUrl)}" target="_blank" rel="noopener">Open in GHL</a>
      <button class="btn pdf" id="bPdf" title="Save this request as a PDF">⇩ PDF</button>
      <button class="btn done${q.reviewed?' is':''}" id="bDone">${q.reviewed?'✓ Reviewed':'Mark reviewed'}</button>
    </div>
  </div>`;
}

function modifiers(q){
  const chips=[];
  for(const m of q.modifiers) chips.push(`<span class="mod ${m.delta<0?'minus':''}">${esc(m.label)}${m.delta!=null?`<span class="delta">${money(m.delta)}</span>`:''}</span>`);
  if(q.multiBathDiscount && !q.modifiers.some(m=>/multi/i.test(m.label))) chips.push(`<span class="mod minus">Multi-bathroom<span class="delta">${money(-Math.abs(q.multiBathDiscount))}</span></span>`);
  return chips.length?`<div class="mods">${chips.join('')}</div>`:'';
}

function wireCard(q){
  document.querySelectorAll('.shot').forEach(el=>{
    el.onclick=()=>{
      const area=el.dataset.area;
      const group=q.photosByArea.find(g=>g.area===area)||{photos:[]};
      const flat=q.photosByArea.flatMap(g=>g.photos);
      openLb(flat, flat.findIndex(p=>p.full===el.dataset.full));
    };
  });
  const copyBtn=document.querySelector('.copy[data-copy="req"]');
  if(copyBtn) copyBtn.onclick=()=>{ navigator.clipboard.writeText(q.description.join('\n\n')).then(()=>toast('Request copied')); };
  const done=$('#bDone'); if(done) done.onclick=()=>toggleReviewed();
  const zipB=$('#bZip'); if(zipB) zipB.onclick=async()=>{
    const urls=q.photosByArea.flatMap(g=>g.photos.map(p=>p.full));
    zipB.disabled=true; zipB.textContent='Zipping…';
    try{
      const r=await fetch('/api/zip',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:'Photos - '+(q.customer||'customer'),urls})});
      if(!r.ok) throw new Error((await r.json().catch(()=>({}))).error||('HTTP '+r.status));
      const blob=await r.blob();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(blob);
      a.download=('Photos - '+(q.customer||'customer')).replace(/[^\w \-]/g,'')+'.zip';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(a.href),4000);
      toast('ZIP downloaded');
    }catch(e){ toast('ZIP failed: '+e.message); }
    zipB.disabled=false; zipB.textContent='⬇ Download all (.zip)';
  };
  const pdf=$('#bPdf'); if(pdf) pdf.onclick=()=>{
    // browsers use document.title as the default "Save as PDF" filename
    const t=document.title;
    document.title='Quote request - '+String(q.customer||'customer').replace(/[^\w \-]/g,'').trim();
    window.print();
    setTimeout(()=>{document.title=t;},800);
  };
}

/* ---- navigation ---- */
function move(d){ idx=Math.max(0,Math.min(VIEW.length-1,idx+d)); render(); window.scrollTo({top:0,behavior:'smooth'}); }
async function toggleReviewed(){
  const q=VIEW[idx]; const now=!q.reviewed;
  q.reviewed=now;
  const orig=QUOTES.find(x=>x.id===q.id); if(orig) orig.reviewed=now;
  try{ await fetch('/api/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:q.id,reviewed:now})}); }
  catch{ toast('Saved locally only'); }
  renderTabs();
  if(now && filter!=='open' && filter!=='reviewed'){ VIEW=VIEW.filter(x=>x.id!==q.id); if(idx>=VIEW.length) idx=VIEW.length-1; render(); toast('Reviewed · next'); }
  else render();
}
function callCustomer(){ const q=VIEW[idx]; if(q&&q.phone) location.href='tel:'+q.phone.replace(/\s/g,''); }
function openGhl(){ const q=VIEW[idx]; if(q) window.open(q.ghlUrl,'_blank','noopener'); }

/* ---- lightbox ---- */
function openLb(photos,i){ lb={photos,i:Math.max(0,i),lastFocus:document.activeElement}; renderLb(); const el=$('#lb'); el.classList.add('open'); $('#lbx').focus(); }
function closeLb(){ $('#lb').classList.remove('open'); if(lb.lastFocus&&lb.lastFocus.focus) lb.lastFocus.focus(); }
function renderLb(){ const p=lb.photos[lb.i]; if(!p)return; $('#lbimg').src=p.full; $('#lbdl').href=p.raw; $('#lbcount').textContent=`${lb.i+1} / ${lb.photos.length}`; }
$('#lbx').onclick=closeLb;
$('#lbprev').onclick=()=>{ lb.i=(lb.i-1+lb.photos.length)%lb.photos.length; renderLb(); };
$('#lbnext').onclick=()=>{ lb.i=(lb.i+1)%lb.photos.length; renderLb(); };
$('#lb').onclick=e=>{ if(e.target.id==='lb') closeLb(); };

$('#prev').onclick=()=>move(-1);
$('#next').onclick=()=>move(1);
$('#refresh').onclick=()=>load(true);
document.querySelectorAll('#viewtoggle button').forEach(b=>b.onclick=()=>{ viewMode=b.dataset.mode; localStorage.setItem('qi_view',viewMode); render(); });
const qInput=$('#q');
qInput.oninput=()=>{ query=qInput.value.trim().toLowerCase(); applyFilter(filter); };

/* keyboard */
document.addEventListener('keydown',e=>{
  if($('#lb').classList.contains('open')){
    if(e.key==='Escape')closeLb();
    if(e.key==='ArrowLeft')$('#lbprev').click();
    if(e.key==='ArrowRight')$('#lbnext').click();
    return;
  }
  if(document.activeElement===qInput){ if(e.key==='Escape'){qInput.blur();} return; }
  if(e.key==='/'){ e.preventDefault(); qInput.focus(); return; }
  if(e.key==='ArrowLeft')move(-1);
  if(e.key==='ArrowRight')move(1);
  if(e.key.toLowerCase()==='c')callCustomer();
  if(e.key.toLowerCase()==='r')toggleReviewed();
  if(e.key.toLowerCase()==='g')openGhl();
});

/* touch swipe on the card (not while lightbox open) */
let tx=0,ty=0;
document.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});
document.addEventListener('touchend',e=>{
  if($('#lb').classList.contains('open'))return;
  const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
  if(Math.abs(dx)>70 && Math.abs(dx)>Math.abs(dy)*1.6) move(dx<0?1:-1);
},{passive:true});

load();
