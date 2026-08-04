/* Timeless Pipeline — DEMO.
   Fake customers only. No GHL, no network, nothing real can be touched. Everything you tap
   saves to this browser only; "Reset demo" restores the starting set.

   The model: every lead must reach a door — WON (done, paid, reviewed) or CLOSED (with a
   reason). Limbo is the only failure. So each lead always has exactly ONE open question. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var KEY = 'tp_demo_v3';
  var DAY = 864e5;


  /* ---------- icon set ----------
     Lucide-style: 16px, 1.75 stroke, currentColor. Replaces every emoji so the UI reads as a
     product rather than a mock-up. References: Linear (icon weight + restraint), Attio (record
     rows), Stripe (metric hierarchy). */
  var P = {
    phone:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
    phoneMissed:'M23 1l-6 6M17 1l6 6M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z',
    msg:'M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5a8.4 8.4 0 0 1-.9-3.9 8.5 8.5 0 0 1 8.4-9 8.5 8.5 0 0 1 9 8.4z',
    mail:'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
    file:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
    fileAlert:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M12 11v3M12 18h.01',
    star:'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z',
    building:'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18ZM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4',
    check:'M20 6L9 17l-5-5',
    checkCircle:'M22 11.1V12a10 10 0 1 1-5.9-9.1M22 4L12 14.0l-3-3',
    x:'M18 6L6 18M6 6l12 12',
    xCircle:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM15 9l-6 6M9 9l6 6',
    clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
    rotate:'M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5',
    alert:'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
    camera:'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    pin:'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    wrench:'M14.7 6.3a4 4 0 0 0 5.3 5.3l-9 9a2.8 2.8 0 0 1-4-4l9-9a4 4 0 0 0 5.3 5.3',
    user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
    dollar:'M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6',
    calendar:'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    send:'M22 2 11 13M22 2l-7 20-4-9-9-4z',
    external:'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3',
    edit:'M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z',
    flag:'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
    truck:'M14 18V6a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h2M14 9h4l4 4v4a1 1 0 0 1-1 1h-2M7 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    trophy:'M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17a2 2 0 0 1-1 1.7L8 19v3M14 14.7V17a2 2 0 0 0 1 1.7l1 .3v3M18 2H6v7a6 6 0 0 0 12 0z',
    grid:'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    branch:'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
    chart:'M3 3v18h18M18 17V9M13 17V5M8 17v-3',
    settings:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
    search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
    chevron:'M6 9l6 6 6-6',
    arrow:'M5 12h14M12 5l7 7-7 7',
    target:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    trending:'M22 7l-8.5 8.5-5-5L2 17M16 7h6v6',
    pinned:'M12 17v5M9 10.8V4h6v6.8a2 2 0 0 0 .6 1.4l1.9 1.9a1 1 0 0 1-.7 1.7H7.2a1 1 0 0 1-.7-1.7l1.9-1.9a2 2 0 0 0 .6-1.4z',
    voicemail:'M6 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM18 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM6 16h12'
  };
  function ic(n, sz){
    var d = P[n]; if(!d) return '';
    return '<svg class="i" width="'+(sz||16)+'" height="'+(sz||16)+'" viewBox="0 0 24 24" fill="none" '+
      'stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+
      d.split('M').filter(Boolean).map(function(seg){ return '<path d="M'+seg.trim()+'"/>'; }).join('')+
      '</svg>';
  }

  /* ---------- the 11 questions ---------- */
  var STAGES = [
    { n:1, name:'New', q:'Have we made contact?', opts:[
      { t:'Spoke to them', ic:'phone', next:2, good:1 },
      { t:'Texted them', ic:'msg', next:2, good:1 },
      { t:'Left a voicemail', ic:'voicemail', next:1 },
      { t:'No answer, try again', ic:'rotate', next:1 },
      { t:'Wrong number', ic:'xCircle', next:'closed', reason:'Wrong number', bad:1 },
      { t:'Not interested', ic:'xCircle', next:'closed', reason:'Not interested', bad:1 }]},
    { n:2, name:'Qualified', q:'Is this our kind of job?', opts:[
      { t:'Yes, we can quote from the photos', ic:'checkCircle', next:3, good:1 },
      { t:'Need more photos first', ic:'camera', next:2 },
      { t:'Needs a site visit', ic:'truck', next:3 },
      { t:'Not our type of work', ic:'wrench', next:'closed', reason:'Not our work', bad:1 },
      { t:'Outside our area', ic:'pin', next:'closed', reason:'Out of area', bad:1 },
      { t:'Too big (over $5k)', ic:'alert', next:'closed', reason:'Over licence cap', bad:1 }]},
    { n:3, name:'Costing', q:'What does this cost us?', opts:[
      { t:'Marko is doing it', ic:'user', next:4, needs:'cost', good:1 },
      { t:'Sub quoted a price', ic:'dollar', next:4, needs:'cost', good:1 },
      { t:'Waiting on a sub price', ic:'⏳', next:3 },
      { t:"Can't be repaired, needs replacing", ic:'alert', next:3, pin:'Cannot be resurfaced, needs replacement or reline' },
      { t:'Nobody free for 3+ weeks', ic:'calendar', next:3 }]},
    { n:4, name:'Priced', q:'Have we sent the quote?', opts:[
      { t:'Quote sent', ic:'send', next:5, needs:'quote', good:1 },
      { t:'Under our margin floor, declining', ic:'xCircle', next:'closed', reason:'Below margin floor', bad:1 },
      { t:'Referred it out', ic:'external', next:'closed', reason:'Referred out', bad:1 }]},
    { n:5, name:'Follow-up', q:'What did they say?', opts:[
      { t:'Accepted', ic:'trophy', next:6, good:1 },
      { t:'No response, follow up again', ic:'rotate', next:5 },
      { t:'Wants changes to the quote', ic:'edit', next:3 },
      { t:'Too expensive', ic:'dollar', next:'closed', reason:'Too expensive', bad:1, revive:1 },
      { t:'Went with someone else', ic:'flag', next:'closed', reason:'Went elsewhere', bad:1, revive:1 },
      { t:'Changed their mind', ic:'xCircle', next:'closed', reason:'Changed mind', bad:1, revive:1 }]},
    { n:6, name:'Accepted', q:'Has the deposit been paid?', opts:[
      { t:'Deposit paid', ic:'checkCircle', next:7, good:1 },
      { t:'Still waiting on it', ic:'⏳', next:6 },
      { t:"They won't pay a deposit", ic:'alert', next:'closed', reason:'Would not pay deposit', bad:1 }]},
    { n:7, name:'Booking', q:'Is it booked in?', opts:[
      { t:'Booked, date set', ic:'calendar', next:8, needs:'booking', good:1 },
      { t:'Waiting on availability', ic:'⏳', next:7 },
      { t:'They want to wait, waitlist them', ic:'clock', next:7 }]},
    { n:8, name:'Job day', q:'How did the job go?', opts:[
      { t:'Done, photos taken', ic:'checkCircle', next:9, good:1 },
      { t:'On the way / on site', ic:'truck', next:8 },
      { t:'Extra work found, needs re-quote', ic:'alert', next:3 },
      { t:'Rescheduled', ic:'calendar', next:7 },
      { t:'Cancelled', ic:'xCircle', next:'closed', reason:'Cancelled after booking', bad:1 }]},
    { n:9, name:'Invoicing', q:'Has the invoice gone out?', opts:[
      { t:'Invoice sent', ic:'send', next:10, good:1 },
      { t:'Callback needed first', ic:'wrench', next:8 }]},
    { n:10, name:'Payment', q:'Have they paid in full?', opts:[
      { t:'Paid in full', ic:'dollar', next:11, good:1 },
      { t:'Chase them', ic:'rotate', next:10 },
      { t:'Disputed', ic:'alert', next:10 }]},
    { n:11, name:'Wrap up', q:'Warranty and review done?', opts:[
      { t:'Warranty sent and review asked', ic:'trophy', next:'won', good:1 },
      { t:'Warranty sent, review still to ask', ic:'file', next:11 },
      { t:'Warranty claim raised', ic:'alert', next:8 }]}
  ];
  function stageOf(n){ return STAGES.filter(function(s){return s.n===n;})[0]; }

  /* ---------- how many times we chase before we stop ----------
     Revised down 2026-08-04 after checking whether the widely-quoted numbers actually apply to us.

     The famous figure is Velocify's: 93% of leads that convert are reached by the 6th call. But
     that dataset is US mortgage, insurance and education -- price-shopping verticals where people
     expect to be chased. Trades guidance lands lower: 3-4 attempts over 7 days for a new enquiry,
     2-3 over 10 days for a quote that has gone quiet. The "5 to 12 contacts" figure often used to
     argue for more is traced to a body called the National Sales Executive Association, which does
     not exist -- so we do not build on it.

     The real point is that 6 CALLS is pestering while 4 attempts mixing call and text is not.
     So: fewer goes at the customer, and the app pushes a channel switch early instead of late.

       cap   = attempts before the app tells you to close it
       days  = how long to wait before each next attempt
       nudge = fires partway through, not only at the cap
       close = the reason recorded when we give up                                          */
  var LIMITS = {
    1:  { cap:4, days:[0,1,3,6],       close:'No answer after 4 tries',
          nudge:{ at:2, t:'Two goes with no answer. Switch channel — text them instead of calling. '+
                          'A different channel beats another call.' },
          hint:'Four attempts over a week is where trades advice stops. Close it rather than keep dialling.' },
    2:  { cap:3, days:[1,3,5],         close:'Never sent the photos' },
    3:  { cap:3, days:[1,2,4],         close:'Could not get a price',
          hint:'Third time chasing a sub. Price it yourself or use the other one.' },
    5:  { cap:3, days:[1,3,7],         close:'No response to the quote', revive:1,
          nudge:{ at:2, t:'Second nudge on the quote. Make the last one useful — offer to adjust the '+
                          'scope or the price, do not just ask again.' },
          hint:'Three follow-ups over ten days is the trades norm. Close it and keep them revivable.' },
    6:  { cap:3, days:[2,4,7],         close:'Deposit never paid' },
    7:  { cap:4, days:[3,7,14,21],     close:'Never found a date', revive:1 },
    10: { cap:4, days:[3,7,14,21],     close:'Never paid' }
  };
  /* stage 8 is a same-day status and stage 11 is admin, so neither is capped */

  function tries(l){ return (l.tries||{})[String(l.stage)] || 0; }
  function limitOf(l){ return LIMITS[String(l.stage)]; }
  function atCap(l){ var m = limitOf(l); return !!m && tries(l) >= m.cap; }
  function ord(n){ var e=['th','st','nd','rd'], v=n%100; return n+(e[(v-20)%10]||e[v]||e[0]); }
  function dueIn(l){ return l.nextTouch ? (l.nextTouch - Date.now())/DAY : null; }
  function isDue(l){ return l.nextTouch != null && l.nextTouch <= Date.now(); }

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
    form:{ic:'file',label:'Quote form'}, partial:{ic:'fileAlert',label:'Form abandoned'},
    missed:{ic:'phoneMissed',label:'Missed call'}, call:{ic:'phone',label:'Phone call'},
    sms:{ic:'msg',label:'Text message'}, email:{ic:'mail',label:'Email'},
    referral:{ic:'star',label:'Referral'}, agent:{ic:'building',label:'Property manager'}
  };
  var AVCOL = ['#eff4ff|#2563eb','#ecfdf3|#16a34a','#fff7ed|#ea8a0c','#f5f3ff|#7c3aed','#fef2f2|#dc2626'];
  /* Pick an avatar colour from any id, number or string. GoHighLevel opportunity ids are
     strings, so `id % length` would give NaN the moment we wire it up. */
  function avatarColour(id){
    var h = 0, t = String(id == null ? '' : id);
    for(var i=0;i<t.length;i++) h = (h*31 + t.charCodeAt(i)) >>> 0;
    return AVCOL[h % AVCOL.length].split('|');
  }

  /* ---------- demo data ----------
     Two records, not one. A CUSTOMER is the person or company (phone/email is the key,
     history and pinned facts live here). A JOB is one piece of work and is what moves
     through the 11 stages. One customer, many jobs. */
  function ago(d){ return Date.now() - d*DAY; }
  function seed(){
    var C = [
      { id:101, name:'', phone:'0412 884 210', notes:[] },
      { id:102, name:'Dave', phone:'0433 118 902', notes:[] },
      { id:103, name:'Ana Natividad', phone:'0408 771 233', notes:[] },
      { id:104, name:'Ben Harris', phone:'0421 665 019', notes:[] },
      { id:105, name:'Sophie Tran', phone:'0417 220 884', notes:[
        {t:'Wants it before the open home on the 14th', by:'Allan', at:ago(2), pin:1}] },
      { id:106, name:'Laura Milne', phone:'0493 239 503', notes:[] },
      { id:107, name:'Michelle', phone:'0455 907 118', notes:[] },
      { id:108, name:'Tomas Repka', phone:'0433 760 339', notes:[
        {t:'Most of this is plumbing, not our work. Only the silicone and drain are ours.', by:'Allan', at:ago(14), pin:1}] },
      { id:109, name:'Ray White Marrickville', phone:'02 9558 1200', company:1, notes:[
        {t:'Always invoice the agency, never the tenant', by:'Allan', at:ago(120), pin:1}] },
      { id:110, name:'Neil Prout', phone:'0402 118 664', notes:[] },
      { id:111, name:'Jo D', phone:'0466 330 771', notes:[] },
      { id:112, name:'Lisa Vruwink', phone:'0499 771 305', notes:[] },
      { id:113, name:'Mick Connolly', phone:'0455 221 907', notes:[
        {t:'Rear lane access only, no parking out front', by:'Marko', at:ago(60), pin:1}] },
      { id:114, name:'Rory McVeigh', phone:'0400 118 224', notes:[] }
    ];
    var J = [
      { id:1, cid:101, src:'missed', createdAt:ago(0.02), type:'untriaged', notes:[], events:[] },
      { id:2, cid:102, src:'sms', msg:'hey do you guys do laundry tubs as well?',
        createdAt:ago(0.2), type:'untriaged', notes:[], events:[] },
      { id:3, cid:103, src:'form', suburb:'Ryde', want:'Bath resurface, chips in the enamel',
        photos:4, createdAt:ago(0.4), type:'job', stage:1, owner:'Allan', notes:[], events:[] },
      { id:4, cid:104, src:'form', suburb:'Castle Hill', want:'Shower regrout, mould in the corners',
        photos:3, createdAt:ago(2.1), type:'job', stage:3, owner:'Allan',
        notes:[{t:'Ultraglaze quoted 640, can start the 18th', by:'Allan', at:ago(1)}], events:[] },
      { id:5, cid:105, src:'referral', suburb:'Epping', refBy:'Isabella (AitkenRE)',
        want:'Vanity + basin resurface', photos:5, createdAt:ago(3.2), type:'job', stage:5,
        quote:1450, cost:780, owner:'Allan', notes:[], events:[] },
      { id:6, cid:106, src:'form', suburb:'Bonnet Bay', want:'Shower walls resurface + regrout',
        photos:5, createdAt:ago(8.4), type:'job', stage:5, quote:2860, cost:1490, owner:'Allan', notes:[], events:[] },
      { id:7, cid:107, src:'partial', suburb:'Penrith', want:'Started the form, stopped at photos',
        createdAt:ago(5.6), type:'job', stage:1, owner:'Allan', notes:[], events:[] },
      { id:8, cid:108, src:'form', suburb:'Rhodes', want:'2 bathrooms, mixer taps + Caesarstone',
        photos:6, createdAt:ago(15.2), type:'job', stage:5, quote:3300, cost:1980, owner:'Allan', notes:[], events:[] },

      /* Ray White: a repeat channel — three jobs across different properties */
      { id:9, cid:109, src:'agent', suburb:'Marrickville', want:'Rental bath resurface, 14 Byrne St',
        photos:2, createdAt:ago(6.1), type:'job', stage:7, quote:1540, cost:880, owner:'Marko', notes:[], events:[] },
      { id:20, cid:109, src:'agent', suburb:'Marrickville', want:'Shower regrout, 3/88 Illawarra Rd',
        photos:3, createdAt:ago(74), type:'won', stage:11, quote:1100, cost:640, owner:'Marko',
        booking:'Thu 15 May, Ultraglaze', notes:[], events:[] },
      { id:21, cid:109, src:'agent', suburb:'Dulwich Hill', want:'Vanity resurface, 12 Wardell Rd',
        photos:2, createdAt:ago(140), type:'won', stage:11, quote:775, cost:430, owner:'Marko',
        booking:'Mon 10 Mar, Marko', notes:[], events:[] },

      { id:10, cid:110, src:'form', suburb:'Hornsby', want:'Bath resurface', photos:4,
        createdAt:ago(22), type:'job', stage:10, quote:1540, cost:880, booking:'Tue 22 Jul, Marko', owner:'Marko', notes:[], events:[] },
      { id:11, cid:111, src:'call', suburb:'Marsfield', want:'Chip repair on a bathtub',
        createdAt:ago(30), type:'job', stage:11, quote:380, cost:285, booking:'Mon 14 Jul, Ultraglaze', owner:'Marko', notes:[], events:[] },
      { id:12, cid:112, src:'form', suburb:'North Turramurra', want:'Full bathroom refresh',
        photos:4, createdAt:ago(40), type:'job', stage:5, quote:2100, cost:1200, owner:'Allan', notes:[], events:[] },

      /* Mick: came back for a second bathroom — the repeat case */
      { id:13, cid:113, src:'form', suburb:'Claremont Meadows', want:'2 bathrooms, full resurface',
        photos:12, createdAt:ago(52), type:'won', stage:11, quote:4200, cost:2400,
        booking:'Wed 18 Jun, Ultraglaze', owner:'Marko', notes:[], events:[] },
      { id:22, cid:113, src:'call', suburb:'Claremont Meadows', want:'Ensuite this time, same finish',
        createdAt:ago(0.6), type:'job', stage:2, owner:'Allan', notes:[], events:[] },

      { id:14, cid:114, src:'form', suburb:'Queens Park', want:'Bath + wall resurface', photos:11,
        createdAt:ago(35), type:'closed', reason:'Too expensive', stage:5, quote:2600, cost:1500, owner:'Allan', notes:[], events:[] }
    ];
    return { customers:C, jobs:J };
  }

  var S = { customers:[], leads:[], page:'customers', open:null, q:'', filter:'open', me:'Allan', exp:{} };
  /* the customer behind a job, and every job that customer has had */
  function cust(j){ return S.customers.filter(function(c){ return c.id===j.cid; })[0] || {}; }
  function jobsOf(cid){ return S.leads.filter(function(j){ return j.cid===cid; }); }
  function history(j){
    var all = jobsOf(j.cid), done = all.filter(function(x){ return x.type==='won'; });
    return { total: all.length, done: done.length, isRepeat: all.length > 1,
             value: done.reduce(function(a,x){ return a+(x.quote||0); },0),
             last: done.sort(function(a,b){ return b.createdAt-a.createdAt; })[0] };
  }

  function load(){
    try{ var r=JSON.parse(localStorage.getItem(KEY));
         if(r && r.jobs && r.customers){ S.leads=r.jobs; S.customers=r.customers; return; } }catch(e){}
    var d=seed(); S.leads=d.jobs; S.customers=d.customers; save();
  }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify({customers:S.customers, jobs:S.leads})); }catch(e){} }
  function reset(){ localStorage.removeItem(KEY); var d=seed(); S.leads=d.jobs; S.customers=d.customers;
                    save(); S.open=null; S.page='customers'; render(); }

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
  function initials(l){ var c=cust(l), n=(c.name||'').trim();
    if(!n) return (c.phone||'?').replace(/\D/g,'').slice(-2);
    var p=n.split(/\s+/); return ((p[0][0]||'')+(p[1]?p[1][0]:'')).toUpperCase(); }
  function logEvent(l,t){ (l.events=l.events||[]).push({t:t,by:S.me,at:Date.now()}); }
  function pct(l){ return l.type==='won'?100:Math.round(((l.stage||1)-1)/10*100); }


  /* ================= the assistant =================
     Not just a board. It ranks what to do, says WHY, flags risk, and drafts the
     message so the next action is one tap away. */
  var DRAFTS = {
    1: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", Allan from Timeless Resurfacing. Thanks for getting in touch about the "+(l.want||'bathroom')+". I'll have a price back to you within 24 to 48 hours."; },
    2: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", could you send a couple more photos so I can price it accurately? A wide shot of the whole room and a close-up of the problem area is perfect."; },
    3: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", just letting you know I'm getting the final costing sorted and will have your price across shortly."; },
    5: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+', just checking you got the quote through. Happy to talk through any of it, or adjust the scope if that helps.'; },
    6: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", great news. To lock the date in we just need the 10% deposit. I'll send the invoice through now."; },
    7: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", I'm working out the earliest date we can get to you and will confirm shortly."; },
    8: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", just a reminder we're booked in "+(l.booking||'soon')+". Could you clear the bathroom beforehand so we can get straight into it?"; },
    10:function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+', just a friendly reminder the invoice is still outstanding. Let me know if you need the details sent again.'; },
    11:function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", hope you're happy with how it turned out. If you've got a spare minute, a Google review really helps a small business like ours."; }
  };

  /* risk flags shown on the card */
  function risks(l){
    var r = [];
    if(!isOpen(l)) return r;
    var d = ageDays(l);
    if(l.quote && l.cost && (l.quote-l.cost) < 300) r.push({t:'Margin under $300', k:'bad'});
    if(l.quote && l.quote > 5000) r.push({t:'Over the $5k licence cap', k:'bad'});
    if(d > 5) r.push({t:'No action for '+Math.round(d)+' days', k:'bad'});
    else if(d > 2) r.push({t:'Going quiet', k:'warn'});
    if(l.stage===7 && !l.booking) r.push({t:'Deposit paid, still not booked', k:'warn'});
    if(l.stage===3 && d>2) r.push({t:'Sub price still outstanding', k:'warn'});
    return r;
  }

  /* what should Allan do with this lead, and how urgent is it */
  /* What to DO at each stage, in words that are not just the question repeated back.
     The card above the question used to echo it, which read like a bug. */
  var ACTION = {
    1:['Make contact','New enquiry, speed matters most here'],
    2:['Check what they sent','Work out if we can quote it from the photos'],
    3:['Get the cost','Marko or a sub still needs to price it'],
    4:['Send the quote','Priced and ready to go out'],
    5:['Follow up on the quote','Quote is with them, waiting on an answer'],
    6:['Chase the deposit','They accepted, the deposit is not in yet'],
    7:['Book it in','Deposit paid, this needs a date'],
    8:['Run the job','Booked in and coming up'],
    9:['Send the invoice','Job is done, the invoice has not gone out'],
    10:['Get paid','Invoice is out, the money is not in'],
    11:['Wrap it up','Warranty and a review request, then it is finished']
  };
  function suggest(l){
    var d = Math.round(ageDays(l));
    if(l.type==='untriaged') return { p:1, why:'Brand new, nobody has looked at it yet', do:'Sort it' };
    if(!isOpen(l)) return null;
    if(atCap(l)){
      var m = limitOf(l);
      return { p:1, why:'Tried '+tries(l)+' times already, which is where trades advice says to stop',
               do: m.hint ? 'Change approach or close it' : 'Close it off' };
    }
    var lm = limitOf(l);
    if(lm && lm.nudge && tries(l) >= lm.nudge.at && isDue(l))
      return { p:2, why:lm.nudge.t, do:'Try a different way' };
    if(isDue(l)) return { p:2, why:'The next follow-up was due '+
      (Math.abs(dueIn(l))<1 ? 'today' : Math.round(-dueIn(l))+' days ago'), do:'Chase it now' };
    if(l.stage===7 && !l.booking) return { p:2, why:'They have paid a deposit and are waiting on a date', do:'Book it in' };
    if(l.stage===10 && d>=2) return { p:3, why:'Job is done and the money is still out, '+d+' days', do:'Chase the payment' };
    if(l.stage===5 && d>=2) return { p:4, why:'Quote sent '+d+' days ago with no answer', do:'Follow up' };
    if(l.stage===3 && d>=2) return { p:5, why:'Waiting on a sub price for '+d+' days', do:'Chase the sub or price it yourself' };
    if(l.stage===1 || l.stage===2){
      var h2 = history(l);
      if(h2.isRepeat) return { p:2, why:'Repeat customer, '+h2.done+' job'+(h2.done>1?'s':'')+' before worth '+money(h2.value), do:'Get straight to costing' };
    }
    if(l.stage===1) return { p:6, why:'New enquiry, speed matters most here', do:'Make contact' };
    if(d>5) return { p:7, why:'Nothing has happened for '+d+' days', do:'Move it forward or close it' };
    var a = ACTION[l.stage] || ['Move it forward',''];
    return { p:9, why:a[1], do:a[0] };
  }

  function todayHTML(){
    var jobs = S.leads.filter(isOpen).map(function(l){
      var sg = suggest(l); return sg ? { l:l, s:sg } : null;
    }).filter(Boolean).filter(function(x){ return x.s.p <= 7; })
      .sort(function(a,b){ return a.s.p - b.s.p || ageDays(b.l) - ageDays(a.l); });
    if(!jobs.length) return '';
    var top = jobs.slice(0,5);
    return '<div class="asst"><div class="ah"><span class="aic">'+ic('target',18)+'</span>'+
      '<div><div class="at">Start here</div>'+
      '<div class="as">'+jobs.length+' need you. These '+top.length+' matter most right now.</div></div></div>'+
      top.map(function(x){
        return '<div class="ai" data-go="'+x.l.id+'">'+
          '<div class="ain"><b>'+esc(cust(x.l).name||cust(x.l).phone||'Unknown')+'</b>'+
          '<span class="aw">'+esc(x.s.why)+'</span></div>'+
          '<span class="ado">'+esc(x.s.do)+' ›</span></div>';
      }).join('')+'</div>';
  }

  /* ---------- nav ---------- */
  var NAV = [
    {k:'dashboard', ic:'grid',     t:'Dashboard'},
    {k:'customers', ic:'users',    t:'Customers'},
    {k:'pipeline',  ic:'branch',   t:'Pipeline'},
    {k:'reports',   ic:'chart',    t:'Reports'},
    {k:'settings',  ic:'settings', t:'Settings'}
  ];
  function renderNav(){
    var need = S.leads.filter(isOpen).length;
    $('#nav').innerHTML = NAV.map(function(n){
      return '<button class="nav'+(S.page===n.k?' on':'')+'" data-p="'+n.k+'">'+
        ic(n.ic,17)+'<span>'+n.t+'</span>'+
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
      if(q){ var c=cust(l); var hay=((c.name||'')+' '+(l.suburb||'')+' '+(l.want||'')+' '+(c.phone||'')).toLowerCase();
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
      cell(ic('user',13),'Owner', esc(l.owner||'Unassigned'))+
      cell(ic('dollar',13),'Value', l.quote?money(l.quote):'—')+
      cell(ic('arrow',13),'Next step', esc(l.type==='untriaged'?'Sort it':(st?st.q:'—')))+
      cell(ic('calendar',13),'Booked', esc(l.booking||'—'))+
      cell(ic('trending',13),'Margin', margin!=null?money(margin):'—', margin!=null&&margin<300)+
      '<button class="viewd" data-exp="1">'+(S.exp[l.id]?'Hide steps':'Show steps')+'</button></div>'+
      '<button class="expm" data-exp="1">'+(S.exp[l.id]?'Hide steps':'Show steps')+'</button>';
  }

  function customerCard(l){
    var s = SOURCES[l.src]||{ic:'•',label:''};
    var col = avatarColour(l.id);
    var stale = isOpen(l) && ageDays(l)>5;
    var pill = l.type==='untriaged' ? '<span class="pill triage">New enquiry</span>'
      : l.type==='won' ? '<span class="pill won">Won</span>'
      : l.type==='closed' ? '<span class="pill lost">'+esc(l.reason||'Closed')+'</span>'
      : ageDays(l)<1 ? '<span class="pill new">New</span>' : '<span class="pill active">Active</span>';
    var st = l.type==='untriaged'? null : stageOf(l.stage);
    return '<div class="cust'+(stale?' stale':'')+'" data-id="'+l.id+'">'+
      '<div class="ctop">'+
        '<div class="cav" style="background:'+col[0]+';color:'+col[1]+'">'+esc(initials(l))+'</div>'+
        '<div style="min-width:0"><div class="cname">'+esc(cust(l).name||cust(l).phone||'Unknown')+'</div>'+
        '<div class="cmeta">'+ic(s.ic,13)+'<span>'+esc(s.label)+(l.suburb?' · '+esc(l.suburb):'')+
          (l.want?' · '+esc(l.want):l.msg?' · “'+esc(l.msg)+'”':'')+'</span></div></div>'+
        '<div class="cright">'+(function(){ var h=history(l);
          return h.isRepeat ? '<span class="pill rep" title="'+h.done+' completed, $'+h.value.toLocaleString()+' lifetime">'+
            ic('rotate',12)+'Repeat'+(h.done?' · '+h.done:'')+'</span>' : ''; })()+
        '<span class="last'+(stale?' stale':'')+'">'+ageText(lastAt(l))+'</span>'+pill+'</div>'+
      '</div>'+
      trackerHTML(l)+
      '<div class="tstate">'+(l.type==='untriaged'
        ? 'Not sorted yet · <b>decide if it is a job</b>'
        : l.type==='won' ? 'Complete · <b>100%</b>'
        : l.type==='closed' ? 'Closed · <b>'+esc(l.reason||'')+'</b>'
        : 'Step '+st.n+' of 11 · <b>'+esc(st.name)+'</b> · '+pct(l)+'% complete')+'</div>'+
      (function(){ var r=risks(l); return r.length ? '<div class="rk">'+r.map(function(x){
         return '<span class="rkc '+x.k+'">'+esc(x.t)+'</span>'; }).join('')+'</div>' : ''; })()+
      stripHTML(l)+'<div class="expwrap"'+(S.exp[l.id]?'':' hidden')+'>'+breakdownHTML(l)+'</div></div>';
  }

  function renderCustomers(){
    var rows = filtered();
    var TABS=[{k:'open',t:'Open'},{k:'stale',t:'Gone quiet'},{k:'won',t:'Won'},{k:'closed',t:'Closed'}];
    $('#main').innerHTML =
      '<div class="mhead"><div><h1>Customers</h1>'+
      '<p class="sub">Every lead ends one of two ways: won, or closed with a reason.</p></div>'+
      '<button class="add" id="add">+ Add customer</button></div>'+
      '<div class="toolbar"><div class="search"><span class="mag">'+ic('search',15)+'</span>'+
      '<input id="q" placeholder="Search name, suburb or job…" value="'+esc(S.q)+'" /></div>'+
      TABS.map(function(t){ return '<button class="tbtn'+(S.filter===t.k?' on':'')+'" data-f="'+t.k+'">'+t.t+'</button>'; }).join('')+
      '</div>'+
      (S.filter==='open' && !S.q ? todayHTML() : '')+
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
          var w=$('.expwrap',c); w.hidden=!w.hidden; S.exp[c.dataset.id]=!w.hidden;
          $$('[data-exp]',c).forEach(function(b){ b.textContent = w.hidden ? 'Show steps' : 'Hide steps'; });
          return; }
        S.open=Number(c.dataset.id); render();
      };
    });
    $$('[data-go]').forEach(function(a){ a.onclick=function(){ S.open=Number(a.dataset.go); render(); }; });
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
    if(untri) counts.unshift({k:'New enquiry', c:'#ea8a0c', v:untri});
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
    var s = SOURCES[l.src]||{}, pins=((cust(l).notes)||[]).filter(function(n){return n.pin;});
    var right = '';

    var h = history(l);
    if(h.isRepeat){
      var others = jobsOf(l.cid).filter(function(x){ return x.id!==l.id; })
        .sort(function(a,b){ return b.createdAt-a.createdAt; });
      right += '<div class="box cbox"><h3>'+ic('rotate',13)+'Repeat customer</h3>'+
        '<div class="cstat"><div><b>'+h.total+'</b><span>jobs</span></div>'+
        '<div><b>'+h.done+'</b><span>completed</span></div>'+
        '<div><b>'+money(h.value)+'</b><span>lifetime</span></div></div>'+
        others.map(function(o){
          return '<div class="ojob" data-job="'+o.id+'"><div><div class="ow">'+esc(o.want||'Job')+'</div>'+
            '<div class="om">'+ageText(o.createdAt)+(o.quote?' · '+money(o.quote):'')+'</div></div>'+
            '<span class="opill '+(o.type==='won'?'won':o.type==='closed'?'lost':'open')+'">'+
            (o.type==='won'?'Won':o.type==='closed'?'Closed':'Open')+'</span></div>';
        }).join('')+'</div>';
    }
    right += '<div class="box"><h3>Details</h3>'+
      [['Source',(s.label||'')],['Phone',cust(l).phone||'—'],['Suburb',l.suburb||'—'],
       ['Wants',l.want||l.msg||'—'],['Photos',l.photos?l.photos+' photos':'—'],
       ['Owner',l.owner||'Unassigned'],['Quote',l.quote?money(l.quote):'—'],
       ['Our cost',l.cost?money(l.cost):'—'],
       ['Margin',(l.quote&&l.cost)?money(l.quote-l.cost):'—'],
       ['Booked',l.booking||'—'],['Referred by',l.refBy||'—']]
      .map(function(kv){ return '<div class="kv"><span class="k">'+kv[0]+'</span><span class="v">'+esc(kv[1])+'</span></div>'; }).join('')+
      '</div>';

    right += '<div class="box"><h3>Notes</h3>'+
      '<div class="addnote"><input id="ntext" placeholder="What happened?" />'+
      '<button class="pinbtn" id="npin" title="Pin as a permanent fact">'+ic('pinned',15)+'</button>'+
      '<button id="nadd">Add</button></div>'+
      ((l.notes||[]).length ? (l.notes||[]).slice().reverse().map(function(n){
        return '<div class="note">'+(n.pin?ic('pinned',13):'')+esc(n.t)+
          '<div class="nmeta">'+esc(n.by)+' · '+ageText(n.at)+'</div></div>'; }).join('')
        : '<div class="note" style="color:#9ca3af">No notes yet.</div>')+'</div>';

    if((l.events||[]).length){
      right += '<div class="box"><h3>Activity</h3>'+(l.events||[]).slice().reverse().map(function(e){
        return '<div class="note">'+esc(e.t)+'<div class="nmeta">'+esc(e.by)+' · '+ageText(e.at)+'</div></div>';
      }).join('')+'</div>';
    }

    var main = '<button class="backb" id="back">‹ Back to customers</button>'+
      '<div class="mhead"><div><h1>'+esc(cust(l).name||cust(l).phone||'Unknown')+'</h1>'+
      '<p class="sub">'+esc(l.suburb||'')+(l.want?' · '+esc(l.want):'')+'</p></div></div>';

    /* Built now, appended last: progress is what you check, the question is what you answer. */
    var prog = '<div class="cust progress" style="cursor:default">'+trackerHTML(l)+
      '<div class="tstate">'+(l.type==='untriaged'?'Not sorted yet'
        : l.type==='won'?'Complete · <b>100%</b>'
        : l.type==='closed'?'Closed · <b>'+esc(l.reason||'')+'</b>'
        : 'Step '+l.stage+' of 11 · <b>'+esc(stageOf(l.stage).name)+'</b> · '+pct(l)+'% complete')+'</div>'+
      breakdownHTML(l)+'</div>';

    pins.forEach(function(n){ main += '<div class="pin">'+ic('pinned',15)+'<span>'+esc(n.t)+'</span></div>'; });

    var sg = suggest(l), dr = DRAFTS[l.stage];
    if(isOpen(l) && (sg&&sg.why || dr)){
      main += '<div class="asst solo"><div class="ah"><span class="aic">'+ic('target',18)+'</span><div>'+
        '<div class="at">'+esc(sg&&sg.do?sg.do:'Next')+'</div>'+
        (sg&&sg.why?'<div class="as">'+esc(sg.why)+'</div>':'')+'</div></div>'+
        (dr&&l.type==='job' ? '<div class="draft"><div class="dl">Message you could send</div>'+
          '<textarea id="dtx" rows="3">'+esc(dr(l))+'</textarea>'+
          '<button class="dcopy" id="dcopy">Copy message</button></div>' : '')+
        '</div>';
    }
    /* everything above is context; everything below is the decision */

    if(l.type==='won'||l.type==='closed'){
      main += '<div class="endcard '+(l.type==='won'?'won':'closed')+'">'+
        '<div class="big">'+ic(l.type==='won'?'trophy':'check',20)+' '+(l.type==='won'?'Won':'Closed')+'</div><div>'+
        esc(l.type==='won'?'Job done, paid and reviewed':(l.reason||''))+'</div>'+
        '<button class="resetb" id="reopen" style="margin-top:14px">Reopen</button></div>';
    } else if(l.type==='untriaged'){
      main += '<div class="qcard"><div class="qstage">New enquiry</div>'+
        '<div class="qtext">Is this a job, a question, or not for us?</div><div class="opts">'+
        '<button class="opt good" data-tri="job">'+ic('wrench')+'<span>It\'s a job, start the pipeline</span></button>'+
        '<button class="opt" data-tri="question">'+ic('msg')+'<span>Just a question, answer and close</span></button>'+
        '<button class="opt bad" data-tri="notus">'+ic('xCircle')+'<span>Not for us, refer out</span></button></div></div>';
    } else {
      var st = stageOf(l.stage);
      /* Answers that end the job fold behind one row when there are several of them.
         We still capture WHY we lost it -- that is the most valuable field we record --
         but you are never looking at six choices on a phone. */
      var lim = limitOf(l), used = tries(l), capped = atCap(l);
      function obtn(o){ var i = st.opts.indexOf(o), again = (o.next === st.n);
        return '<button class="opt'+(o.good?' good':o.bad?' bad':'')+
               (again && capped ? ' capped':'')+'" data-opt="'+i+'">'+
               ic(o.ic)+'<span>'+esc(o.t)+
               (again && lim ? '<em>'+ord(used+1)+' try</em>' : '')+'</span></button>'; }
      var keep = st.opts.filter(function(o){ return !o.bad; });
      var end  = st.opts.filter(function(o){ return  o.bad; });
      var fold = end.length > 1;
      /* How many goes we have had, and when the next one is due. Without this the
         "try again" answers loop forever and nobody ever decides to stop. */
      var meter = '';
      if(lim && used > 0){
        var d = dueIn(l);
        meter = '<div class="qtry'+(capped?' over':'')+'">'+ic(capped?'alert':'clock',13)+
          '<span>'+used+' of '+lim.cap+' tries used'+
          (capped ? ' \u2014 past the point where more helps'
                  : d==null ? ''
                  : d <= 0 ? ' \u00b7 next one is due now'
                  : ' \u00b7 next one due in '+Math.ceil(d)+' day'+(Math.ceil(d)===1?'':'s'))+
          '</span></div>';
      }
      var say = capped ? (lim && lim.hint)
              : (lim && lim.nudge && used >= lim.nudge.at) ? lim.nudge.t : '';
      if(say) meter += '<div class="qhint">'+ic('target',13)+'<span>'+esc(say)+'</span></div>';

      main += '<div class="qcard"><div class="qstage">Step '+st.n+' of 11 · '+esc(st.name)+'</div>'+
        '<div class="qtext">'+esc(st.q)+'</div>'+meter+'<div class="opts">'+
        (capped ? '<button class="opt giveup" id="giveup">'+ic('xCircle')+
                  '<span>Stop here \u2014 '+esc(lim.close.toLowerCase())+'</span></button>' : '')+
        (fold ? keep : st.opts).map(obtn).join('')+
        (fold ? '<button class="opt fold" id="showend">'+ic('xCircle')+
                '<span>Not going ahead\u2026</span></button>'+
                '<div class="badopts" id="endopts">'+end.map(obtn).join('')+'</div>' : '')+
        '</div></div>';
    }

    main += prog;   /* progress last: you answer first, then check where it sits */

    $('#main').innerHTML = '<div class="grid2"><div>'+main+'</div><div>'+right+'</div></div>';
    $('#rail').innerHTML = '';
    document.querySelector('.app').classList.add('norail');

    $('#back').onclick=function(){ S.open=null; render(); };
    $$('[data-tri]').forEach(function(b){ b.onclick=function(){ triage(l,b.dataset.tri); }; });
    $$('[data-opt]').forEach(function(b){ b.onclick=function(){ answer(l, stageOf(l.stage).opts[Number(b.dataset.opt)]); }; });
    if($('#showend')) $('#showend').onclick=function(){
      $('#endopts').classList.add('on'); this.remove(); };
    if($('#giveup')) $('#giveup').onclick=function(){
      var m = limitOf(l);
      apply(l, { t:'Stopped after '+tries(l)+' tries', next:'closed',
                 reason:m.close, revive:m.revive }); };
    if($('#reopen')) $('#reopen').onclick=function(){ l.type='job'; l.stage=l.stage||1; delete l.reason;
      logEvent(l,'Reopened'); save(); render(); };
    var pinOn=false;
    if($('#npin')) $('#npin').onclick=function(){ pinOn=!pinOn; this.classList.toggle('on',pinOn); };
    $$('[data-job]').forEach(function(o){ o.onclick=function(){ S.open=Number(o.dataset.job); render(); }; });
    if($('#dcopy')) $('#dcopy').onclick=function(){
      var t=$('#dtx'); t.select();
      navigator.clipboard.writeText(t.value).then(function(){
        var b=$('#dcopy'); b.textContent='Copied'; setTimeout(function(){ b.textContent='Copy message'; },1600);
      });
    };
    if($('#nadd')) $('#nadd').onclick=function(){ var t=$('#ntext').value.trim(); if(!t)return;
      (l.notes=l.notes||[]).push({t:t,by:S.me,at:Date.now(),pin:pinOn?1:0}); save(); render(); };
  }

  /* ---------- actions ---------- */
  function triage(l,k){
    if(k==='job'){ l.type='job'; l.stage=1; l.owner=l.owner||S.me; logEvent(l,'Marked as a job'); }
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
    if(o.next==='won'){ l.type='won'; delete l.nextTouch; }
    else if(o.next==='closed'){
      l.type='closed'; l.reason=o.reason||'Closed'; delete l.nextTouch;
      /* a price-based or timing-based no is worth another go later; a wrong number is not */
      if(o.revive) l.revivable = 1;
    }
    else {
      var was = l.stage;
      if(o.next === was){                       /* another go at the same step */
        l.tries = l.tries || {};
        l.tries[String(was)] = tries(l) + 1;
      } else {
        l.stage = o.next;                       /* moved on, so this step starts fresh */
      }
      scheduleTouch(l);
    }
    save(); closeModal(); render();
  }

  /* When the next attempt is due, straight off the cadence for whatever step it is on now. */
  function scheduleTouch(l){
    var m = limitOf(l);
    if(!m){ delete l.nextTouch; return; }
    var n = Math.min(tries(l), m.days.length - 1);
    l.nextTouch = Date.now() + m.days[n]*DAY;
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
      $('#mwarn').innerHTML=(q.value&&m<300)?'<div class="warnbox">'+ic('alert',14)+' Margin is only '+money(m)+'. Your floor is $300.</div>':''; }
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
    document.querySelector('.app').classList.remove('norail');
    if(S.page==='customers'){ renderCustomers(); renderRail(); return; }
    if(S.page==='dashboard') return renderPlaceholder('Dashboard','What needs you today, at a glance.');
    if(S.page==='pipeline')  return renderPlaceholder('Pipeline','A board view of every stage.');
    if(S.page==='reports')   return renderPlaceholder('Reports','Win rate, margin per job, and why we lose.');
    if(S.page==='settings')  return renderPlaceholder('Settings','Subs, rate card, users and connections.');
  }

  /* test hook — the suite in ../test/suite.js drives the REAL state machine
     through these, so a passing test means the shipped code passed, not a copy. */
  window.PIPE = { S:S, STAGES:STAGES, PHASES:PHASES, SOURCES:SOURCES, KEY:KEY,
    stageOf:stageOf, phaseIdx:phaseIdx, cust:cust, jobsOf:jobsOf, history:history,
    suggest:suggest, risks:risks, apply:apply, triage:triage, seed:seed, reset:reset,
    LIMITS:LIMITS, tries:tries, atCap:atCap, limitOf:limitOf, isDue:isDue, dueIn:dueIn,
    ageDays:ageDays, lastAt:lastAt, isOpen:isOpen, pct:pct, save:save, render:render };

  load(); render();
})();
