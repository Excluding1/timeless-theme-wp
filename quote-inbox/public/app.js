/* Quote Inbox front-end — one readable card per quote request. No dependencies. */
const $ = s => document.querySelector(s);
let QUOTES = [];        // all quotes from server
let VIEW = [];          // filtered list
let idx = 0;            // current card in VIEW
let filter = 'new';     // new | qa | all | reviewed
let lb = { photos: [], i: 0 };

const FILTERS = [
  { key: 'new', label: 'New', test: q => q.stage === 'Quote Requested' && !q.reviewed },
  { key: 'qa', label: 'Q&A', test: q => q.stage === 'Q&A' && !q.reviewed },
  { key: 'all', label: 'All open', test: () => true },
  { key: 'reviewed', label: 'Reviewed', test: q => q.reviewed },
];

function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function money(n){ return n==null ? null : '$' + Number(n).toLocaleString('en-AU'); }
function ago(iso){
  if(!iso) return '';
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 3600) return Math.max(1,Math.round(d/60)) + 'm ago';
  if (d < 86400) return Math.round(d/3600) + 'h ago';
  return Math.round(d/86400) + 'd ago';
}
function titleCase(s){ return String(s||'').replace(/[_-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); }

async function load(){
  $('#stage').innerHTML = '<div class="status">Loading quotes from GoHighLevel…</div>';
  try{
    const r = await fetch('/api/quotes');
    const d = await r.json();
    if (d.error) throw new Error(d.error);
    QUOTES = d.quotes || [];
    renderTabs();
    applyFilter('new');
  }catch(e){
    $('#stage').innerHTML = `<div class="status">Couldn't load quotes.<br><b>${esc(e.message)}</b><br><br>Is the token in <code>.secrets/ghl-pit.key</code>?</div>`;
  }
}

function renderTabs(){
  $('#tabs').innerHTML = FILTERS.map(f=>{
    const n = QUOTES.filter(f.test).length;
    return `<button class="tab${f.key===filter?' active':''}" data-k="${f.key}">${f.label}<span class="n">${n}</span></button>`;
  }).join('');
  document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>applyFilter(t.dataset.k));
}

function applyFilter(k){
  filter = k;
  const f = FILTERS.find(x=>x.key===k);
  VIEW = QUOTES.filter(f.test);
  idx = 0;
  renderTabs();
  render();
}

function render(){
  if(!VIEW.length){
    $('#stage').innerHTML = `<div class="status">Nothing in <b>${FILTERS.find(f=>f.key===filter).label}</b>.<br>🎉 All caught up.</div>`;
    $('#counter').style.display='none'; $('#nav').style.display='none';
    $('#actions').style.display='none'; $('#hint').style.display='none';
    return;
  }
  idx = Math.max(0, Math.min(idx, VIEW.length-1));
  const q = VIEW[idx];
  $('#counter').style.display='flex';
  $('#pos').textContent = `${idx+1} of ${VIEW.length}`;
  $('#sub').textContent = q.reviewed ? 'Reviewed' : (q.stage||'');
  $('#stage').innerHTML = card(q);
  document.querySelectorAll('.shot').forEach((el,i)=>el.onclick=()=>openLb(q.photos,i));
  $('#nav').style.display='flex';
  $('#prev').disabled = idx===0;
  $('#next').disabled = idx===VIEW.length-1;
  $('#hint').style.display='block';
  const a = $('#actions'); a.style.display='flex';
  $('#bCall').style.display = q.phone ? 'flex':'none';
  $('#bCall').textContent = q.phone ? `📞 Call ${q.customer.split(' ')[0]}` : '';
  const done = $('#bDone');
  done.textContent = q.reviewed ? '✓ Reviewed' : 'Mark reviewed';
  done.classList.toggle('is', q.reviewed);
}

function card(q){
  const facts = [];
  const push=(k,v)=>{ if(v!=null && v!=='' && v!=='not_asked' && v!=='n/a') facts.push([k,v]); };
  push('Bathrooms', q.bathroomCount && (q.bathroomIndex? `#${q.bathroomIndex} of ${q.bathroomCount}` : q.bathroomCount));
  push('Property', titleCase(q.propertyType));
  push('Full bathroom', q.fullBathroomMode==='yes'?'Yes':(q.fullBathroomMode==='no'?'No':''));
  push('Basin finish', titleCase(q.basinFinish));
  push('Lift access', titleCase(q.liftAccess));
  push('Ventilation', titleCase(q.ventilation));
  push('Built before 1990', titleCase(q.builtBefore1990));
  push('Pricing tier', q.tier);

  const qminmax = (q.quoteMin!=null||q.quoteMax!=null)
    ? `<span class="badge gold">Est ${money(q.quoteMin)||'?'}–${money(q.quoteMax)||'?'}</span>` : '';
  const stageBadge = q.reviewed ? '<span class="badge rev">Reviewed</span>'
    : (q.stage==='Quote Requested' ? '<span class="badge new">New request</span>' : `<span class="badge">${esc(q.stage)}</span>`);
  const brokenBadge = q._brokenFields && q._brokenFields.length
    ? `<span class="badge warn" title="These per-area fields didn't save correctly in GHL: ${esc(q._brokenFields.join(', '))}">⚠ area detail incomplete</span>` : '';

  const areas = q.selectedAreas && !String(q.selectedAreas).includes('[object')
    ? `<div class="section"><p class="label">Areas selected</p><div class="summary">${esc(q.selectedAreas)}</div></div>` : '';

  const desc = q.description.length
    ? q.description.map(esc).join('\n\n')
    : null;

  const summary = q.servicesSummary && !q.servicesSummary.includes('[object')
    ? `<div class="section"><p class="label">What they want done</p><div class="summary">${esc(q.servicesSummary)}</div></div>` : '';

  const photos = q.photos.length
    ? `<div class="gallery">${q.photos.map((p,i)=>`
        <div class="shot"><img loading="lazy" src="${esc(p.thumb)}" alt="photo ${i+1}"/>${p.heic?'<span class="tag">HEIC→JPG</span>':''}</div>`).join('')}</div>`
    : `<div class="nophoto">No photos uploaded${q.photosUploaded==='no'?' (customer skipped)':''} — worth a call to see the bathroom.</div>`;

  return `
  <div class="card">
    <div class="chead">
      <div class="crow">
        <div class="who">
          <h2>${esc(q.customer)}</h2>
          <div class="addr">📍 ${esc(q.address)||'No address given'}</div>
        </div>
        <span class="when">${ago(q.createdAt)}</span>
      </div>
      <div class="badges">
        ${stageBadge}${qminmax}
        ${q.bathroomCount?`<span class="badge">${esc(q.bathroomCount)} bathroom${q.bathroomCount==1?'':'s'}</span>`:''}
        ${q.phone?`<span class="badge">📞 ${esc(q.phone)}</span>`:'<span class="badge warn">no phone</span>'}
        ${brokenBadge}
      </div>
    </div>
    <div class="cbody">
      <div class="section">
        <p class="label">Customer's request</p>
        ${desc ? `<div class="req">${desc}</div>` : `<div class="req empty">No written description — see photos and the summary below.</div>`}
      </div>
      ${summary}
      ${areas}
      <div class="section">
        <p class="label">Photos${q.photos.length?` (${q.photos.length})`:''}</p>
        ${photos}
      </div>
      <div class="section">
        <p class="label">Details</p>
        <div class="facts">
          ${facts.map(([k,v])=>`<div class="fact"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`).join('') || '<span class="nophoto">No extra details captured.</span>'}
        </div>
      </div>
    </div>
  </div>`;
}

/* ---- actions ---- */
function move(d){ idx=Math.max(0,Math.min(VIEW.length-1,idx+d)); render(); window.scrollTo({top:0,behavior:'smooth'}); }
async function toggleReviewed(){
  const q=VIEW[idx]; const nowReviewed=!q.reviewed;
  q.reviewed=nowReviewed;
  const orig=QUOTES.find(x=>x.id===q.id); if(orig) orig.reviewed=nowReviewed;
  try{ await fetch('/api/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:q.id,reviewed:nowReviewed})}); }catch{}
  renderTabs();
  // after marking reviewed from a working queue, jump to next unreviewed
  if(nowReviewed && filter!=='all' && filter!=='reviewed'){ VIEW=VIEW.filter(x=>x.id!==q.id); if(idx>=VIEW.length) idx=VIEW.length-1; render(); }
  else render();
}
function callCustomer(){ const q=VIEW[idx]; if(q.phone) location.href='tel:'+q.phone.replace(/\s/g,''); }
function openGhl(){ const q=VIEW[idx]; window.open(q.ghlUrl,'_blank'); }

/* ---- lightbox ---- */
function openLb(photos,i){ lb={photos,i}; renderLb(); $('#lb').classList.add('open'); }
function renderLb(){
  const p=lb.photos[lb.i]; if(!p)return;
  $('#lbimg').src=p.full; $('#lbdl').href=p.raw;
  $('#lbcount').textContent=`${lb.i+1} / ${lb.photos.length}`;
}
$('#lbx').onclick=()=>$('#lb').classList.remove('open');
$('#lbprev').onclick=()=>{ lb.i=(lb.i-1+lb.photos.length)%lb.photos.length; renderLb(); };
$('#lbnext').onclick=()=>{ lb.i=(lb.i+1)%lb.photos.length; renderLb(); };
$('#lb').onclick=e=>{ if(e.target.id==='lb') $('#lb').classList.remove('open'); };

$('#prev').onclick=()=>move(-1);
$('#next').onclick=()=>move(1);
$('#bCall').onclick=callCustomer;
$('#bGhl').onclick=openGhl;
$('#bDone').onclick=toggleReviewed;
$('#refresh').onclick=load;

/* keyboard */
document.addEventListener('keydown',e=>{
  if($('#lb').classList.contains('open')){
    if(e.key==='Escape')$('#lb').classList.remove('open');
    if(e.key==='ArrowLeft')$('#lbprev').click();
    if(e.key==='ArrowRight')$('#lbnext').click();
    return;
  }
  if(e.key==='ArrowLeft')move(-1);
  if(e.key==='ArrowRight')move(1);
  if(e.key.toLowerCase()==='c')callCustomer();
  if(e.key.toLowerCase()==='r')toggleReviewed();
  if(e.key.toLowerCase()==='g')openGhl();
});

/* touch swipe on the card */
let tx=0,ty=0;
document.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});
document.addEventListener('touchend',e=>{
  if($('#lb').classList.contains('open'))return;
  const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty;
  if(Math.abs(dx)>70 && Math.abs(dx)>Math.abs(dy)*1.5) move(dx<0?1:-1);
},{passive:true});

load();
