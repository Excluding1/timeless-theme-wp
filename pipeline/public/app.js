/* Timeless Pipeline — DEMO.
   Fake customers only. No GHL, no network, nothing real can be touched. Everything you tap
   saves to this browser only; "Reset demo" restores the starting set.

   The model: every lead must reach a door — WON (done, paid, reviewed) or CLOSED (with a
   reason). Limbo is the only failure. So each lead always has exactly ONE open question. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var KEY = 'tp_demo_v2';
  var DAY = 864e5;

  /* ---------- the 11 questions ---------- */
  var STAGES = [
    { n:1, name:'New', q:'Have we made contact?', opts:[
      { t:'Spoke to them', ic:'📞', next:2, good:1 },
      { t:'Texted them', ic:'💬', next:2, good:1 },
      { t:'Left a voicemail', ic:'📩', next:1 },
      { t:'No answer, try again', ic:'↻', next:1 },
      { t:'Wrong number', ic:'🚫', next:'closed', reason:'Wrong number', bad:1 },
      { t:'Not interested', ic:'🚫', next:'closed', reason:'Not interested', bad:1 }]},
    { n:2, name:'Qualified', q:'Is this our kind of job?', opts:[
      { t:'Yes, we can quote from the photos', ic:'✅', next:3, good:1 },
      { t:'Need more photos first', ic:'📷', next:2 },
      { t:'Needs a site visit', ic:'🚗', next:3 },
      { t:'Not our type of work', ic:'🔧', next:'closed', reason:'Not our work', bad:1 },
      { t:'Outside our area', ic:'📍', next:'closed', reason:'Out of area', bad:1 },
      { t:'Too big (over $5k)', ic:'⚠️', next:'closed', reason:'Over licence cap', bad:1 }]},
    { n:3, name:'Costing', q:'What does this cost us?', opts:[
      { t:'Marko is doing it', ic:'👷', next:4, needs:'cost', good:1 },
      { t:'Sub quoted a price', ic:'💰', next:4, needs:'cost', good:1 },
      { t:'Waiting on a sub price', ic:'⏳', next:3 },
      { t:"Can't be repaired, needs replacing", ic:'⚠️', next:3, pin:'Cannot be resurfaced, needs replacement or reline' },
      { t:'Nobody free for 3+ weeks', ic:'📅', next:3 }]},
    { n:4, name:'Priced', q:'Have we sent the quote?', opts:[
      { t:'Quote sent', ic:'📤', next:5, needs:'quote', good:1 },
      { t:'Under our margin floor, declining', ic:'🚫', next:'closed', reason:'Below margin floor', bad:1 },
      { t:'Referred it out', ic:'↗️', next:'closed', reason:'Referred out', bad:1 }]},
    { n:5, name:'Follow-up', q:'What did they say?', opts:[
      { t:'Accepted', ic:'🎉', next:6, good:1 },
      { t:'No response, follow up again', ic:'↻', next:5 },
      { t:'Wants changes to the quote', ic:'✏️', next:3 },
      { t:'Too expensive', ic:'💸', next:'closed', reason:'Too expensive', bad:1 },
      { t:'Went with someone else', ic:'🏳️', next:'closed', reason:'Went elsewhere', bad:1 },
      { t:'Changed their mind', ic:'🚫', next:'closed', reason:'Changed mind', bad:1 }]},
    { n:6, name:'Accepted', q:'Has the deposit been paid?', opts:[
      { t:'Deposit paid', ic:'✅', next:7, good:1 },
      { t:'Still waiting on it', ic:'⏳', next:6 },
      { t:"They won't pay a deposit", ic:'⚠️', next:'closed', reason:'Would not pay deposit', bad:1 }]},
    { n:7, name:'Booking', q:'Is it booked in?', opts:[
      { t:'Booked, date set', ic:'📅', next:8, needs:'booking', good:1 },
      { t:'Waiting on availability', ic:'⏳', next:7 },
      { t:'They want to wait, waitlist them', ic:'🕐', next:7 }]},
    { n:8, name:'Job day', q:'How did the job go?', opts:[
      { t:'Done, photos taken', ic:'✅', next:9, good:1 },
      { t:'On the way / on site', ic:'🚐', next:8 },
      { t:'Extra work found, needs re-quote', ic:'⚠️', next:3 },
      { t:'Rescheduled', ic:'📅', next:7 },
      { t:'Cancelled', ic:'🚫', next:'closed', reason:'Cancelled after booking', bad:1 }]},
    { n:9, name:'Invoicing', q:'Has the invoice gone out?', opts:[
      { t:'Invoice sent', ic:'📤', next:10, good:1 },
      { t:'Callback needed first', ic:'🔧', next:8 }]},
    { n:10, name:'Payment', q:'Have they paid in full?', opts:[
      { t:'Paid in full', ic:'💰', next:11, good:1 },
      { t:'Chase them', ic:'↻', next:10 },
      { t:'Disputed', ic:'⚠️', next:10 }]},
    { n:11, name:'Wrap up', q:'Warranty and review done?', opts:[
      { t:'Warranty sent and review asked', ic:'🏁', next:'won', good:1 },
      { t:'Warranty sent, review still to ask', ic:'📄', next:11 },
      { t:'Warranty claim raised', ic:'⚠️', next:8 }]}
  ];
  function stageOf(n){ return STAGES.filter(function(s){return s.n===n;})[0]; }

  /* Two levels on purpose:
       PHASES     = the 5 milestones you see at a glance on the tracker
       .steps     = the smaller things that must actually be completed inside each one
     A step is DONE when the lead has moved past it, CURRENT when it is the open one. */
  var PHASES = [
    { k:'Lead', from:1, to:2, c:'#7c3aed', steps:[
      { t:'Enquiry received',      at:0 },
      { t:'Made contact',          at:1 },
      { t:'Confirmed it is our job', at:2 } ]},
    { k:'Quoting', from:3, to:4, c:'#2563eb', steps:[
      { t:'Cost from Marko or sub', at:3 },
      { t:'Quote sent',             at:4 } ]},
    { k:'Decision', from:5, to:6, c:'#16a34a', steps:[
      { t:'Customer responded', at:5 },
      { t:'Deposit paid',       at:6 } ]},
    { k:'Booked', from:7, to:7, c:'#ea8a0c', steps:[
      { t:'Date locked in', at:7 } ]},
    { k:'Delivery', from:8, to:11, c:'#0f766e', steps:[
      { t:'Job completed',        at:8 },
      { t:'Invoice sent',         at:9 },
      { t:'Paid in full',         at:10 },
      { t:'Warranty and review',  at:11 } ]}
  ];
  function phaseIdx(st){ for(var i=0;i<PHASES.length;i++) if(st<=PHASES[i].to) return i; return 4; }

  var SOURCES = {
    form:{ic:'📝',label:'Quote form'}, partial:{ic:'⚠️',label:'Form abandoned'},
    missed:{ic:'📞',label:'Missed call'}, call:{ic:'☎️',label:'Phone call'},
    sms:{ic:'💬',label:'Text message'}, email:{ic:'✉️',label:'Email'},
    referral:{ic:'⭐',label:'Referral'}, agent:{ic:'🏢',label:'Property manager'}
  };
  var AVCOL = ['#eff4ff|#2563eb','#ecfdf3|#16a34a','#fff7ed|#ea8a0c','#f5f3ff|#7c3aed','#fef2f2|#dc2626'];

  /* ---------- demo data ---------- */
  function ago(d){ return Date.now() - d*DAY; }
  function seed(){ return [
    { id:1, src:'missed', name:'', phone:'0412 884 210', suburb:'', createdAt:ago(0.02), type:'untriaged', notes:[], events:[] },
    { id:2, src:'sms', name:'Dave', phone:'0433 118 902', msg:'hey do you guys do laundry tubs as well?',
      createdAt:ago(0.2), type:'untriaged', notes:[], events:[] },
    { id:3, src:'form', name:'Ana Natividad', phone:'0408 771 233', suburb:'Ryde',
      want:'Bath resurface, chips in the enamel', photos:4, createdAt:ago(0.4), type:'job', stage:1, owner:'Allan', notes:[], events:[] },
    { id:4, src:'form', name:'Ben Harris', phone:'0421 665 019', suburb:'Castle Hill',
      want:'Shower regrout, mould in the corners', photos:3, createdAt:ago(2.1), type:'job', stage:3, owner:'Allan',
      notes:[{t:'Ultraglaze quoted 640, can start the 18th', by:'Allan', at:ago(1)}], events:[] },
    { id:5, src:'referral', name:'Sophie Tran', phone:'0417 220 884', suburb:'Epping', refBy:'Isabella (AitkenRE)',
      want:'Vanity + basin resurface', photos:5, createdAt:ago(3.2), type:'job', stage:5, quote:1450, cost:780, owner:'Allan',
      notes:[{t:'Wants it before the open home on the 14th', by:'Allan', at:ago(2), pin:1}], events:[] },
    { id:6, src:'form', name:'Laura Milne', phone:'0493 239 503', suburb:'Bonnet Bay',
      want:'Shower walls resurface + regrout', photos:5, createdAt:ago(8.4), type:'job', stage:5, quote:2860, cost:1490, owner:'Allan', notes:[], events:[] },
    { id:7, src:'partial', name:'Michelle', phone:'0455 907 118', suburb:'Penrith',
      want:'Started the form, stopped at photos', createdAt:ago(5.6), type:'job', stage:1, owner:'Allan', notes:[], events:[] },
    { id:8, src:'form', name:'Tomas Repka', phone:'0433 760 339', suburb:'Rhodes',
      want:'2 bathrooms, mixer taps + Caesarstone', photos:6, createdAt:ago(15.2), type:'job', stage:5, quote:3300, cost:1980, owner:'Allan',
      notes:[{t:'Most of this is plumbing, not our work. Only the silicone and drain are ours.', by:'Allan', at:ago(14), pin:1}], events:[] },
    { id:9, src:'agent', name:'Ray White Marrickville', phone:'02 9558 1200', suburb:'Marrickville',
      want:'Rental bath resurface before new tenant', photos:2, createdAt:ago(6.1), type:'job', stage:7, quote:1540, cost:880, owner:'Marko', notes:[], events:[] },
    { id:10, src:'form', name:'Neil Prout', phone:'0402 118 664', suburb:'Hornsby', want:'Bath resurface', photos:4,
      createdAt:ago(22), type:'job', stage:10, quote:1540, cost:880, booking:'Tue 22 Jul, Marko', owner:'Marko', notes:[], events:[] },
    { id:11, src:'call', name:'Jo D', phone:'0466 330 771', suburb:'Marsfield', want:'Chip repair on a bathtub',
      createdAt:ago(30), type:'job', stage:11, quote:380, cost:285, booking:'Mon 14 Jul, Ultraglaze', owner:'Marko', notes:[], events:[] },
    { id:12, src:'form', name:'Lisa Vruwink', phone:'0499 771 305', suburb:'North Turramurra', want:'Full bathroom refresh',
      photos:4, createdAt:ago(40), type:'job', stage:5, quote:2100, cost:1200, owner:'Allan', notes:[], events:[] },
    { id:13, src:'form', name:'Mick Connolly', phone:'0455 221 907', suburb:'Claremont Meadows', want:'2 bathrooms, full resurface',
      photos:12, createdAt:ago(52), type:'won', stage:11, quote:4200, cost:2400, booking:'Wed 18 Jun, Ultraglaze', owner:'Marko', notes:[], events:[] },
    { id:14, src:'form', name:'Rory McVeigh', phone:'0400 118 224', suburb:'Queens Park', want:'Bath + wall resurface',
      photos:11, createdAt:ago(35), type:'closed', reason:'Too expensive', stage:5, quote:2600, cost:1500, owner:'Allan', notes:[], events:[] }
  ];}

  var S = { leads:[], page:'customers', open:null, q:'', filter:'open', me:'Allan' };

  function load(){ try{ var r=JSON.parse(localStorage.getItem(KEY)); if(r&&r.length){S.leads=r;return;} }catch(e){}
                   S.leads=seed(); save(); }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S.leads)); }catch(e){} }
  function reset(){ localStorage.removeItem(KEY); S.leads=seed(); save(); S.open=null; S.page='customers'; render(); }

  /* ---------- helpers ---------- */
  function lastAt(l){ var t=l.createdAt;
    (l.events||[]).forEach(function(e){ if(e.at>t)t=e.at; });
    (l.notes||[]).forEach(function(n){ if(n.at>t)t=n.at; }); return t; }
  function ageDays(l){ return (Date.now()-lastAt(l))/DAY; }
  function ageText(t){ var d=(Date.now()-t)/DAY;
    if(d<1/24) return Math.max(1,Math.round(d*1440))+'m ago';
    if(d<1) return Math.round(d*24)+'h ago'; return Math.round(d)+'d ago'; }
  function isOpen(l){ return l.type==='job'||l.type==='untriaged'; }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c];}); }
  function money(n){ return '$'+Number(n||0).toLocaleString(); }
  function initials(l){ var n=(l.name||'').trim();
    if(!n) return (l.phone||'?').replace(/\D/g,'').slice(-2);
    var p=n.split(/\s+/); return ((p[0][0]||'')+(p[1]?p[1][0]:'')).toUpperCase(); }
  function logEvent(l,t){ (l.events=l.events||[]).push({t:t,by:S.me,at:Date.now()}); }
  function pct(l){ return l.type==='won'?100:Math.round(((l.stage||1)-1)/10*100); }

  /* ---------- nav ---------- */
  var NAV = [
    {k:'dashboard', ic:'▤', t:'Dashboard'},
    {k:'customers', ic:'👥', t:'Customers'},
    {k:'pipeline',  ic:'⇥', t:'Pipeline'},
    {k:'reports',   ic:'▦', t:'Reports'},
    {k:'settings',  ic:'⚙', t:'Settings'}
  ];
  function renderNav(){
    var need = S.leads.filter(isOpen).length;
    $('#nav').innerHTML = NAV.map(function(n){
      return '<button class="nav'+(S.page===n.k?' on':'')+'" data-p="'+n.k+'">'+
        '<span class="ic">'+n.ic+'</span>'+n.t+
        (n.k==='customers'?'<span class="ct">'+need+'</span>':'')+'</button>';
    }).join('');
    $$('.nav').forEach(function(b){ b.onclick=function(){ S.page=b.dataset.p; S.open=null; render(); }; });
  }

  /* ---------- list ---------- */
  function filtered(){
    var q=S.q.toLowerCase();
    return S.leads.filter(function(l){
      if(S.filter==='open' && !isOpen(l)) return false;
      if(S.filter==='won' && l.type!=='won') return false;
      if(S.filter==='closed' && isOpen(l)===true) return false;
      if(S.filter==='closed' && l.type==='won') return false;
      if(S.filter==='stale' && (!isOpen(l)||ageDays(l)<=5)) return false;
      if(q){ var hay=((l.name||'')+' '+(l.suburb||'')+' '+(l.want||'')+' '+(l.phone||'')).toLowerCase();
             if(hay.indexOf(q)===-1) return false; }
      return true;
    }).sort(function(a,b){ return lastAt(b)-lastAt(a); });
  }

  function trackerHTML(l){
    var pi = l.type==='won' ? PHASES.length-1 : phaseIdx(l.stage||1);
    var doneAll = l.type==='won';
    var c = PHASES[pi].c;
    var fill = doneAll ? 100 : (pi/(PHASES.length-1))*100;
    return '<div class="track">'+
      '<div class="tlabels">'+PHASES.map(function(p,i){
        return '<span class="'+(i===pi?'on':'')+'">'+p.k+'</span>'; }).join('')+'</div>'+
      '<div class="tline"><div class="tbase"></div>'+
      '<div class="tfill" style="width:calc('+fill+'% - '+(fill?14:0)+'px);background:'+c+'"></div>'+
      '<div class="tdots">'+PHASES.map(function(p,i){
        var cls = doneAll||i<pi ? 'done' : i===pi ? 'now' : '';
        return '<div class="dot '+cls+'" style="color:'+(cls?c:'')+'"></div>'; }).join('')+
      '</div></div></div>';
  }

  /* the level-2 view: every smaller step, what is done and what is still outstanding */
  function breakdownHTML(l){
    if(l.type==='untriaged') return '';
    var cur = l.type==='won' ? 99 : (l.stage||1);
    var out = 0, html = '<div class="bd">';
    PHASES.forEach(function(p){
      var pdone = p.steps.every(function(st){ return cur > st.at; });
      html += '<div class="bdp"><div class="bdh" style="color:'+p.c+'">'+
        '<span class="bdk">'+p.k+'</span>'+(pdone?'<span class="bdt">done</span>':'')+'</div>';
      p.steps.forEach(function(st){
        var state = cur > st.at ? 'done' : cur === st.at ? 'now' : 'todo';
        if(state !== 'done') out++;
        html += '<div class="bds '+state+'" style="'+(state!=='todo'?'--c:'+p.c:'')+'">'+
          '<span class="bdi"></span><span>'+st.t+'</span>'+
          (state==='now'?'<span class="bdnow">now</span>':'')+'</div>';
      });
      html += '</div>';
    });
    html += '</div><p class="bdout">'+(out?('<b>'+out+'</b> step'+(out>1?'s':'')+' left to complete')
                                          :'Everything complete')+'</p>';
    return html;
  }

  function stripHTML(l){
    var st = l.type==='untriaged' ? null : stageOf(l.stage);
    var margin = (l.quote&&l.cost) ? l.quote-l.cost : null;
    function cell(icon,lab,val,warn){
      return '<div class="cell"><div class="clab">'+icon+' '+lab+'</div>'+
             '<div class="cval'+(warn?' warn':'')+'">'+val+'</div></div>'; }
    return '<div class="strip">'+
      cell('👤','Owner', esc(l.owner||'Unassigned'))+
      cell('💲','Value', l.quote?money(l.quote):'—')+
      cell('➡️','Next step', esc(l.type==='untriaged'?'Triage it':(st?st.q:'—')))+
      cell('📅','Booked', esc(l.booking||'—'))+
      cell('📈','Margin', margin!=null?money(margin):'—', margin!=null&&margin<300)+
      '<button class="viewd" data-exp="1">Show steps ⌄</button></div>';
  }

  function customerCard(l){
    var s = SOURCES[l.src]||{ic:'•',label:''};
    var col = AVCOL[l.id % AVCOL.length].split('|');
    var stale = isOpen(l) && ageDays(l)>5;
    var pill = l.type==='untriaged' ? '<span class="pill triage">Needs triage</span>'
      : l.type==='won' ? '<span class="pill won">Won</span>'
      : l.type==='closed' ? '<span class="pill lost">'+esc(l.reason||'Closed')+'</span>'
      : ageDays(l)<1 ? '<span class="pill new">New</span>' : '<span class="pill active">Active</span>';
    var st = l.type==='untriaged'? null : stageOf(l.stage);
    return '<div class="cust'+(stale?' stale':'')+'" data-id="'+l.id+'">'+
      '<div class="ctop">'+
        '<div class="cav" style="background:'+col[0]+';color:'+col[1]+'">'+esc(initials(l))+'</div>'+
        '<div style="min-width:0"><div class="cname">'+esc(l.name||l.phone||'Unknown')+'</div>'+
        '<div class="cmeta">'+s.ic+' '+esc(s.label)+(l.suburb?' · '+esc(l.suburb):'')+
          (l.want?' · '+esc(l.want):l.msg?' · “'+esc(l.msg)+'”':'')+'</div></div>'+
        '<div class="cright"><span class="last'+(stale?' stale':'')+'">'+ageText(lastAt(l))+'</span>'+pill+'</div>'+
      '</div>'+
      trackerHTML(l)+
      '<div class="tstate">'+(l.type==='untriaged'
        ? 'Not triaged yet · <b>decide if it is a job</b>'
        : l.type==='won' ? 'Complete · <b>100%</b>'
        : l.type==='closed' ? 'Closed · <b>'+esc(l.reason||'')+'</b>'
        : 'Step '+st.n+' of 11 · <b>'+esc(st.name)+'</b> · '+pct(l)+'% complete')+'</div>'+
      stripHTML(l)+'<div class="expwrap" hidden>'+breakdownHTML(l)+'</div></div>';
  }

  function renderCustomers(){
    var rows = filtered();
    var TABS=[{k:'open',t:'Open'},{k:'stale',t:'Gone quiet'},{k:'won',t:'Won'},{k:'closed',t:'Closed'}];
    $('#main').innerHTML =
      '<div class="mhead"><div><h1>Customers</h1>'+
      '<p class="sub">Every lead ends one of two ways: won, or closed with a reason.</p></div>'+
      '<button class="add" id="add">+ Add customer</button></div>'+
      '<div class="toolbar"><div class="search"><span class="mag">🔍</span>'+
      '<input id="q" placeholder="Search name, suburb or job…" value="'+esc(S.q)+'" /></div>'+
      TABS.map(function(t){ return '<button class="tbtn'+(S.filter===t.k?' on':'')+'" data-f="'+t.k+'">'+t.t+'</button>'; }).join('')+
      '</div>'+
      (rows.length ? rows.map(customerCard).join('')
        : '<p class="empty">Nothing here.</p>')+
      '<div style="text-align:center"><button class="resetb" id="reset">↺ Reset demo</button></div>';

    $('#q').oninput = function(){ S.q=this.value; var p=this.selectionStart; renderCustomers();
      var n=$('#q'); n.focus(); n.setSelectionRange(p,p); };
    $$('.tbtn').forEach(function(b){ b.onclick=function(){ S.filter=b.dataset.f; renderCustomers(); }; });
    $$('.cust').forEach(function(c){
      c.onclick=function(e){
        var exp = e.target.closest('[data-exp]');
        if(exp){ e.stopPropagation();
          var w=$('.expwrap',c); w.hidden=!w.hidden;
          exp.textContent = w.hidden ? 'Show steps ⌄' : 'Hide steps ⌃'; return; }
        S.open=Number(c.dataset.id); render();
      };
    });
    $('#reset').onclick=function(){ if(confirm('Reset the demo?')) reset(); };
    $('#add').onclick=function(){ alert('Demo only — in the real app this adds a lead, or GHL creates it automatically from a call, text or form.'); };
  }

  /* ---------- right rail ---------- */
  function donut(segs,total,centre,sub){
    var C=2*Math.PI*54, off=0;
    var arcs = segs.filter(function(s){return s.v>0;}).map(function(s){
      var len=(s.v/(total||1))*C, d='<circle cx="64" cy="64" r="54" fill="none" stroke="'+s.c+
        '" stroke-width="18" stroke-dasharray="'+len+' '+(C-len)+'" stroke-dashoffset="'+(-off)+
        '" transform="rotate(-90 64 64)"/>'; off+=len; return d; }).join('');
    return '<svg width="128" height="128" viewBox="0 0 128 128" style="flex:none">'+
      '<circle cx="64" cy="64" r="54" fill="none" stroke="#f3f4f6" stroke-width="18"/>'+arcs+
      '<text x="64" y="61" text-anchor="middle" font-size="22" font-weight="800" fill="#111827">'+centre+'</text>'+
      '<text x="64" y="78" text-anchor="middle" font-size="9.5" fill="#6b7280">'+sub+'</text></svg>';
  }

  function renderRail(){
    var open = S.leads.filter(isOpen);
    var counts = PHASES.map(function(p){ return { k:p.k, c:p.c,
      v: open.filter(function(l){ return l.type==='job' && phaseIdx(l.stage)===PHASES.indexOf(p); }).length }; });
    var untri = open.filter(function(l){return l.type==='untriaged';}).length;
    if(untri) counts.unshift({k:'Needs triage', c:'#ea8a0c', v:untri});
    var tot = counts.reduce(function(a,b){return a+b.v;},0);

    var won = S.leads.filter(function(l){return l.type==='won';}).length;
    var lost = S.leads.filter(function(l){return l.type==='closed';}).length;
    var rate = (won+lost) ? Math.round(won/(won+lost)*100) : 0;
    var value = open.reduce(function(a,l){return a+(l.quote||0);},0);
    var stale = open.filter(function(l){return ageDays(l)>5;}).length;
    var maxc = Math.max.apply(null, counts.map(function(c){return c.v;}).concat([1]));

    $('#rail').innerHTML =
      '<h2>Breakdown</h2>'+
      '<div class="panel"><h3>Pipeline overview</h3><div class="donutrow">'+
        donut(counts, tot, tot, 'open leads')+
        '<div class="legend">'+counts.map(function(c){
          return '<div class="lg"><span class="lgdot" style="background:'+c.c+'"></span>'+c.k+
                 '<span class="lgn">'+c.v+' ('+(tot?Math.round(c.v/tot*100):0)+'%)</span></div>'; }).join('')+
        '</div></div></div>'+

      '<div class="panel"><h3>By stage</h3>'+counts.map(function(c){
        return '<div class="bar"><div class="bhead">'+c.k+'<span class="n">'+c.v+'</span></div>'+
          '<div class="btrack"><div class="bfill" style="width:'+(c.v/maxc*100)+'%;background:'+c.c+'"></div></div></div>';
      }).join('')+'</div>'+

      '<div class="panel"><h3>Win rate</h3><div class="donutrow">'+
        donut([{c:'#16a34a',v:won},{c:'#e5e7eb',v:lost}], won+lost, rate+'%', 'of decided')+
        '<div class="legend">'+
          '<div class="lg"><span class="lgdot" style="background:#16a34a"></span>Won<span class="lgn">'+won+'</span></div>'+
          '<div class="lg"><span class="lgdot" style="background:#9ca3af"></span>Lost<span class="lgn">'+lost+'</span></div>'+
          '<div class="lg"><span class="lgdot" style="background:#2563eb"></span>In progress<span class="lgn">'+open.length+'</span></div>'+
        '</div></div></div>'+

      '<div class="panel"><h3>Snapshot</h3><div class="snap">'+
        '<div class="sbox"><div class="v">'+money(value)+'</div><div class="k">Pipeline value</div></div>'+
        '<div class="sbox"><div class="v">'+open.length+'</div><div class="k">Open leads</div></div>'+
        '<div class="sbox"><div class="v" style="color:'+(stale?'#dc2626':'#16a34a')+'">'+stale+'</div><div class="k">Gone quiet (5d+)</div></div>'+
        '<div class="sbox"><div class="v">'+won+'</div><div class="k">Won</div></div>'+
      '</div><p class="foot">Demo data only</p></div>';
  }

  /* ---------- detail ---------- */
  function lead(){ return S.leads.filter(function(l){return l.id===S.open;})[0]; }

  function renderDetail(){
    var l = lead(); if(!l){ S.open=null; return render(); }
    var s = SOURCES[l.src]||{}, pins=(l.notes||[]).filter(function(n){return n.pin;});
    var right = '';

    right += '<div class="box"><h3>Details</h3>'+
      [['Source',(s.ic||'')+' '+(s.label||'')],['Phone',l.phone||'—'],['Suburb',l.suburb||'—'],
       ['Wants',l.want||l.msg||'—'],['Photos',l.photos?l.photos+' photos':'—'],
       ['Owner',l.owner||'Unassigned'],['Quote',l.quote?money(l.quote):'—'],
       ['Our cost',l.cost?money(l.cost):'—'],
       ['Margin',(l.quote&&l.cost)?money(l.quote-l.cost):'—'],
       ['Booked',l.booking||'—'],['Referred by',l.refBy||'—']]
      .map(function(kv){ return '<div class="kv"><span class="k">'+kv[0]+'</span><span class="v">'+esc(kv[1])+'</span></div>'; }).join('')+
      '</div>';

    right += '<div class="box"><h3>Notes</h3>'+
      '<div class="addnote"><input id="ntext" placeholder="What happened?" />'+
      '<button class="pinbtn" id="npin" title="Pin as a permanent fact">📌</button>'+
      '<button id="nadd">Add</button></div>'+
      ((l.notes||[]).length ? (l.notes||[]).slice().reverse().map(function(n){
        return '<div class="note">'+(n.pin?'📌 ':'')+esc(n.t)+
          '<div class="nmeta">'+esc(n.by)+' · '+ageText(n.at)+'</div></div>'; }).join('')
        : '<div class="note" style="color:#9ca3af">No notes yet.</div>')+'</div>';

    if((l.events||[]).length){
      right += '<div class="box"><h3>Activity</h3>'+(l.events||[]).slice().reverse().map(function(e){
        return '<div class="note">'+esc(e.t)+'<div class="nmeta">'+esc(e.by)+' · '+ageText(e.at)+'</div></div>';
      }).join('')+'</div>';
    }

    var main = '<button class="backb" id="back">‹ Back to customers</button>'+
      '<div class="mhead"><div><h1>'+esc(l.name||l.phone||'Unknown')+'</h1>'+
      '<p class="sub">'+esc(l.suburb||'')+(l.want?' · '+esc(l.want):'')+'</p></div></div>'+
      '<div class="cust" style="cursor:default">'+trackerHTML(l)+
      '<div class="tstate">'+(l.type==='untriaged'?'Not triaged yet'
        : l.type==='won'?'Complete · <b>100%</b>'
        : l.type==='closed'?'Closed · <b>'+esc(l.reason||'')+'</b>'
        : 'Step '+l.stage+' of 11 · <b>'+esc(stageOf(l.stage).name)+'</b> · '+pct(l)+'% complete')+'</div>'+
      breakdownHTML(l)+'</div>';

    pins.forEach(function(n){ main += '<div class="pin"><span>📌</span><span>'+esc(n.t)+'</span></div>'; });

    if(l.type==='won'||l.type==='closed'){
      main += '<div class="done '+(l.type==='won'?'won':'closed')+'">'+
        '<div class="big">'+(l.type==='won'?'🎉 Won':'✔️ Closed')+'</div><div>'+
        esc(l.type==='won'?'Job done, paid and reviewed':(l.reason||''))+'</div>'+
        '<button class="resetb" id="reopen" style="margin-top:14px">Reopen</button></div>';
    } else if(l.type==='untriaged'){
      main += '<div class="qcard"><div class="qstage">Triage</div>'+
        '<div class="qtext">Is this a job, a question, or not for us?</div><div class="opts">'+
        '<button class="opt good" data-tri="job">🔧 It\'s a job, start the pipeline</button>'+
        '<button class="opt" data-tri="question">❓ Just a question, answer and close</button>'+
        '<button class="opt bad" data-tri="notus">🚫 Not for us, refer out</button></div></div>';
    } else {
      var st = stageOf(l.stage);
      main += '<div class="qcard"><div class="qstage">Step '+st.n+' of 11 · '+esc(st.name)+'</div>'+
        '<div class="qtext">'+esc(st.q)+'</div><div class="opts">'+
        st.opts.map(function(o,i){ return '<button class="opt'+(o.good?' good':o.bad?' bad':'')+
          '" data-opt="'+i+'">'+o.ic+' '+esc(o.t)+'</button>'; }).join('')+'</div></div>';
    }

    $('#main').innerHTML = '<div class="grid2"><div>'+main+'</div><div>'+right+'</div></div>';
    $('#rail').innerHTML = '';

    $('#back').onclick=function(){ S.open=null; render(); };
    $$('[data-tri]').forEach(function(b){ b.onclick=function(){ triage(l,b.dataset.tri); }; });
    $$('[data-opt]').forEach(function(b){ b.onclick=function(){ answer(l, stageOf(l.stage).opts[Number(b.dataset.opt)]); }; });
    if($('#reopen')) $('#reopen').onclick=function(){ l.type='job'; l.stage=l.stage||1; delete l.reason;
      logEvent(l,'Reopened'); save(); render(); };
    var pinOn=false;
    if($('#npin')) $('#npin').onclick=function(){ pinOn=!pinOn; this.classList.toggle('on',pinOn); };
    if($('#nadd')) $('#nadd').onclick=function(){ var t=$('#ntext').value.trim(); if(!t)return;
      (l.notes=l.notes||[]).push({t:t,by:S.me,at:Date.now(),pin:pinOn?1:0}); save(); render(); };
  }

  /* ---------- actions ---------- */
  function triage(l,k){
    if(k==='job'){ l.type='job'; l.stage=1; l.owner=l.owner||S.me; logEvent(l,'Triaged as a job'); }
    if(k==='question'){ l.type='closed'; l.reason='Question answered'; logEvent(l,'Answered their question'); }
    if(k==='notus'){ l.type='closed'; l.reason='Not our work'; logEvent(l,'Referred out'); }
    save(); render();
  }
  function answer(l,o){
    if(o.needs==='cost') return askCost(l,o);
    if(o.needs==='quote') return askQuote(l,o);
    if(o.needs==='booking') return askBooking(l,o);
    apply(l,o);
  }
  function apply(l,o){
    logEvent(l,o.t);
    if(o.pin) (l.notes=l.notes||[]).push({t:o.pin,by:S.me,at:Date.now(),pin:1});
    if(o.next==='won') l.type='won';
    else if(o.next==='closed'){ l.type='closed'; l.reason=o.reason||'Closed'; }
    else l.stage=o.next;
    save(); closeModal(); render();
  }

  function openModal(h){ $('#msheet').innerHTML=h; $('#modal').classList.add('on'); }
  function closeModal(){ $('#modal').classList.remove('on'); }
  $('#modal').onclick=function(e){ if(e.target.id==='modal') closeModal(); };

  function askCost(l,o){
    openModal('<h3>What does it cost us?</h3><p>What you pay Marko or the sub, including GST.</p>'+
      '<input id="mc" type="number" inputmode="decimal" placeholder="e.g. 880" value="'+(l.cost||'')+'" />'+
      '<button class="mbtn" id="mok">Save</button><button class="mbtn mcancel" id="mx">Cancel</button>');
    $('#mc').focus();
    $('#mok').onclick=function(){ l.cost=Number($('#mc').value)||0; apply(l,o); };
    $('#mx').onclick=closeModal;
  }
  function askQuote(l,o){
    openModal('<h3>What did we quote?</h3><p>Total including GST.</p>'+
      '<input id="mq" type="number" inputmode="decimal" placeholder="e.g. 1540" value="'+(l.quote||'')+'" />'+
      '<div id="mwarn"></div><button class="mbtn" id="mok">Quote sent</button>'+
      '<button class="mbtn mcancel" id="mx">Cancel</button>');
    var q=$('#mq');
    function chk(){ var m=(Number(q.value)||0)-(l.cost||0);
      $('#mwarn').innerHTML=(q.value&&m<300)?'<div class="warnbox">⚠️ Margin is only '+money(m)+'. Your floor is $300.</div>':''; }
    q.oninput=chk; chk(); q.focus();
    $('#mok').onclick=function(){ l.quote=Number(q.value)||0; apply(l,o); };
    $('#mx').onclick=closeModal;
  }
  function askBooking(l,o){
    openModal('<h3>Book it in</h3><p>Date and who is doing it.</p>'+
      '<input id="md" placeholder="e.g. Tue 12 Aug, morning" />'+
      '<select id="mw"><option>Marko</option><option>Ultraglaze</option><option>Sub B</option></select>'+
      '<button class="mbtn" id="mok">Confirm booking</button><button class="mbtn mcancel" id="mx">Cancel</button>');
    $('#md').focus();
    $('#mok').onclick=function(){ l.booking=($('#md').value||'TBC')+', '+$('#mw').value;
      l.owner=$('#mw').value==='Marko'?'Marko':l.owner; apply(l,o); };
    $('#mx').onclick=closeModal;
  }

  /* ---------- other pages (placeholders that still say something useful) ---------- */
  function renderPlaceholder(t,body){
    $('#main').innerHTML='<div class="mhead"><div><h1>'+t+'</h1>'+
      '<p class="sub">'+body+'</p></div></div>'+
      '<div class="box" style="background:#fff">Coming next. The Customers page is the working part of this demo.</div>';
    $('#rail').innerHTML='';
  }

  function render(){
    renderNav();
    if(S.open) return renderDetail();
    if(S.page==='customers'){ renderCustomers(); renderRail(); return; }
    if(S.page==='dashboard') return renderPlaceholder('Dashboard','What needs you today, at a glance.');
    if(S.page==='pipeline')  return renderPlaceholder('Pipeline','A board view of every stage.');
    if(S.page==='reports')   return renderPlaceholder('Reports','Win rate, margin per job, and why we lose.');
    if(S.page==='settings')  return renderPlaceholder('Settings','Subs, rate card, users and connections.');
  }

  load(); render();
})();
