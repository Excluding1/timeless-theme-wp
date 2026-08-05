/* Timeless Pipeline — DEMO.
   Fake customers only. No GHL, no network, nothing real can be touched. Everything you tap
   saves to this browser only; "Reset demo" restores the starting set.

   The model: every lead must reach a door — WON (done, paid, reviewed) or CLOSED (with a
   reason). Limbo is the only failure. So each lead always has exactly ONE open question.

   Rebuilt 2026-08-05 to the five-expert panel spec (docs/specs/pipeline-app-plan §10):
   - every stage is ONE bold yes (with its input attached), one grey not-yet with the try
     counter, and everything rare folded behind one row — Allan's "yes/no then input" rule
   - Call/Text chips really dial / open Messages with the draft prefilled, and that same
     tap IS the record: who, when, channel, next-touch clock
   - 9 screens over the same 11 internal stage numbers (3+4 and 9+10 share a screen), so
     the GoHighLevel mapping reads facts, not menu picks
   - the queue is the home screen; the analytics rail, placeholder tabs, donuts, % complete
     and step breakdowns are gone — one line of numbers replaces the lot                    */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var KEY = 'tp_demo_v4';               /* v4: string ids, binary stages */
  var DAY = 864e5;

  /* ---------- icon set ----------
     Lucide-style: 16px, 1.75 stroke, currentColor. */
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
    xCircle:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM15 9l-6 6M9 9l6 6',
    clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
    rotate:'M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5',
    alert:'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01',
    camera:'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    pin:'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    wrench:'M14.7 6.3a4 4 0 0 0 5.3 5.3l-9 9a2.8 2.8 0 0 1-4-4l9-9a4 4 0 0 0 5.3 5.3',
    user:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    dollar:'M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6',
    calendar:'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    send:'M22 2 11 13M22 2l-7 20-4-9-9-4z',
    external:'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3',
    edit:'M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z',
    flag:'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
    trophy:'M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.7V17a2 2 0 0 1-1 1.7L8 19v3M14 14.7V17a2 2 0 0 0 1 1.7l1 .3v3M18 2H6v7a6 6 0 0 0 12 0z',
    search:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
    target:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
    pinned:'M12 17v5M9 10.8V4h6v6.8a2 2 0 0 0 .6 1.4l1.9 1.9a1 1 0 0 1-.7 1.7H7.2a1 1 0 0 1-.7-1.7l1.9-1.9a2 2 0 0 0 .6-1.4z'
  };
  function ic(n, sz){
    var d = P[n]; if(!d) return '';
    return '<svg class="i" width="'+(sz||16)+'" height="'+(sz||16)+'" viewBox="0 0 24 24" fill="none" '+
      'stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+
      d.split('M').filter(Boolean).map(function(seg){ return '<path d="M'+seg.trim()+'"/>'; }).join('')+
      '</svg>';
  }

  /* ---------- the questions ----------
     One good YES (its input rides on that tap), one grey retry, everything rare folded.
     Screens 3 and 9 cover two internal stage numbers each (3+4, 9+10) — the numbers and
     their events survive underneath so the GHL mapping reads facts, not menu picks.
       good:1  = the bold yes row          fold:1 = hidden behind the one fold row
       retry   = next === own stage        sms:1  = tapping it opens Messages prefilled  */
  var STAGES = [
    { n:1, name:'Contact', q:'Did you reach them?', opts:[
      { t:'Got them', ic:'checkCircle', next:2, good:1 },
      { t:'No answer', ic:'rotate', next:1 },
      { t:'Wrong number', ic:'xCircle', next:'closed', reason:'Wrong number', fold:1 },
      { t:'Not interested', ic:'xCircle', next:'closed', reason:'Not interested', fold:1 }]},
    { n:2, name:'Qualify', q:'Can we price it from what they sent?', opts:[
      { t:'Yes, we can price it', ic:'checkCircle', next:3, good:1 },
      { t:'Not yet — need photos', ic:'camera', next:2, sms:1 },
      { t:'Not our type of work', ic:'wrench', next:'closed', reason:'Not our work', fold:1 },
      { t:'Outside our area', ic:'pin', next:'closed', reason:'Out of area', fold:1 },
      { t:'Too big (over $5k)', ic:'alert', next:'closed', reason:'Over licence cap', fold:1 }]},
    { n:3, name:'Quote', q:'Quote sent?', opts:[
      { t:'Sent — enter the numbers', ic:'send', next:5, needs:'numbers', good:1 },
      { t:'Not yet — waiting on the cost', ic:'clock', next:3 },
      { t:"Can't be resurfaced", ic:'alert', next:'closed', reason:'Cannot be resurfaced',
        pin:'Cannot be resurfaced, needs replacement or reline', fold:1 },
      { t:'Under our margin floor, declining', ic:'xCircle', next:'closed', reason:'Below margin floor', fold:1 },
      { t:'Referred it out', ic:'external', next:'closed', reason:'Referred out', fold:1 }]},
    /* n:4 "quote sent" is an EVENT inside stage 3's numbers modal, not a screen.
       Old data at stage 4 is migrated to 3 on load. */
    { n:5, name:'Answer', q:'Did they accept?', opts:[
      { t:'Yes, accepted', ic:'trophy', next:6, good:1 },
      { t:'No word yet — nudge them', ic:'rotate', next:5, sms:1 },
      { t:'Wants changes to the quote', ic:'edit', next:3, fold:1 },
      { t:'Too expensive', ic:'dollar', next:'closed', reason:'Too expensive', fold:1, revive:1 },
      { t:'Went with someone else', ic:'flag', next:'closed', reason:'Went elsewhere', fold:1, revive:1 },
      { t:'Changed their mind', ic:'xCircle', next:'closed', reason:'Changed mind', fold:1, revive:1 }]},
    { n:6, name:'Deposit', q:'Deposit in?', opts:[
      { t:'Paid', ic:'checkCircle', next:7, good:1 },
      { t:'Not yet — chase it', ic:'rotate', next:6, sms:1 },
      { t:"Won't pay a deposit", ic:'alert', next:'closed', reason:'Would not pay deposit', fold:1 }]},
    { n:7, name:'Booked', q:'Date locked in?', opts:[
      { t:'Booked — pick date and who', ic:'calendar', next:8, needs:'booking', good:1 },
      { t:'Not yet', ic:'clock', next:7 },
      { t:'Never found a date', ic:'xCircle', next:'closed', reason:'Never found a date', fold:1, revive:1 }]},
    { n:8, name:'Job', q:'Job done?', opts:[
      { t:'Done, photos taken', ic:'checkCircle', next:9, needs:'jobdone', good:1 },
      { t:'Rescheduled', ic:'calendar', next:7, fold:1 },
      { t:'Extra work found, needs re-quote', ic:'alert', next:3, fold:1 },
      { t:'Cancelled', ic:'xCircle', next:'closed', reason:'Cancelled after booking', fold:1 }]},
    { n:9, name:'Money', q:'Invoice sent?', opts:[
      { t:'Invoice sent', ic:'send', next:10, good:1 },
      { t:'Callback needed first', ic:'wrench', next:8, fold:1 }]},
    { n:10, name:'Money', q:'Paid in full?', opts:[
      { t:'Paid', ic:'dollar', next:11, good:1 },
      { t:'Not yet — chase it', ic:'rotate', next:10, sms:1 },
      { t:'Disputed', ic:'alert', next:10, fold:1 }]},
    { n:11, name:'Wrap up', q:'Warranty and review sent?', opts:[
      { t:'Done', ic:'trophy', next:'won', needs:'wrapdone', good:1, sms:1 },
      { t:'Warranty claim raised', ic:'alert', next:8, fold:1 }]}
  ];
  function stageOf(n){ return STAGES.filter(function(s){return s.n===n;})[0]; }
  var FOLD_LABEL = { 5:'They said no…', 8:'Problem…' };

  /* ---------- how many times we chase before we stop ----------
     Trades guidance: 3-4 attempts over 7 days for a new enquiry, 2-3 over 10 for a quiet
     quote. (The "5-12 contacts" figure traces to a fabricated source; the 6-call figure is
     US mortgage data. Full reasoning: docs/specs/pipeline-app-plan §9.) Hints ≤7 words —
     the meter carries the message.
       cap = attempts before the app says stop  ·  days = wait before each next go
       nudge fires partway through, where it can still change the outcome              */
  var LIMITS = {
    1:  { cap:4, days:[0,1,3,6],   close:'No answer after 4 tries',
          nudge:{ at:2, t:'Text them this time' }, hint:'Four tries is enough' },
    2:  { cap:3, days:[1,3,5],     close:'Never sent the photos' },
    3:  { cap:3, days:[1,2,4],     close:'Could not get a price',
          hint:'Price it yourself instead' },
    5:  { cap:3, days:[1,3,7],     close:'No response to the quote', revive:1,
          nudge:{ at:2, t:'Offer to adjust the scope' }, hint:'Close it — they stay revivable' },
    6:  { cap:3, days:[2,4,7],     close:'Deposit never paid' },
    7:  { cap:4, days:[3,7,14,21], close:'Never found a date', revive:1 },
    10: { cap:4, days:[3,7,14,21], close:'Never paid' }
  };
  /* stage 8 is a same-day status and stages 9/11 are admin, so none is capped */

  function tries(l){ return (l.tries||{})[String(l.stage)] || 0; }
  function limitOf(l){ return LIMITS[String(l.stage)]; }
  function atCap(l){ var m = limitOf(l); return !!m && tries(l) >= m.cap; }
  function ord(n){ var e=['th','st','nd','rd'], v=n%100; return n+(e[(v-20)%10]||e[v]||e[0]); }
  function dueIn(l){ return l.nextTouch ? (l.nextTouch - Date.now())/DAY : null; }
  function isDue(l){ return l.nextTouch != null && l.nextTouch <= Date.now(); }

  /* the 5 milestones on the detail tracker */
  var PHASES = [
    { k:'Lead',     ic:'user',     from:1,  to:2,  c:'#7c3aed' },
    { k:'Quoting',  ic:'dollar',   from:3,  to:4,  c:'#2563eb' },
    { k:'Decision', ic:'msg',      from:5,  to:6,  c:'#16a34a' },
    { k:'Booked',   ic:'calendar', from:7,  to:7,  c:'#ea8a0c' },
    { k:'Delivery', ic:'trophy',   from:8,  to:11, c:'#0f766e' }
  ];
  function phaseIdx(st){ for(var i=0;i<PHASES.length;i++) if(st<=PHASES[i].to) return i; return 4; }

  var SOURCES = {
    form:{ic:'file',label:'Quote form'}, partial:{ic:'fileAlert',label:'Form abandoned'},
    missed:{ic:'phoneMissed',label:'Missed call'}, call:{ic:'phone',label:'Phone call'},
    sms:{ic:'msg',label:'Text message'}, email:{ic:'mail',label:'Email'},
    referral:{ic:'star',label:'Referral'}, agent:{ic:'building',label:'Property manager'}
  };
  var AVCOL = ['#eff4ff|#2563eb','#ecfdf3|#16a34a','#fff7ed|#ea8a0c','#f5f3ff|#7c3aed','#fef2f2|#dc2626'];
  /* colour from any id — GHL opportunity ids are strings */
  function avatarColour(id){
    var h = 0, t = String(id == null ? '' : id);
    for(var i=0;i<t.length;i++) h = (h*31 + t.charCodeAt(i)) >>> 0;
    return AVCOL[h % AVCOL.length].split('|');
  }

  /* ---------- the GoHighLevel mapping (read side of the future sync) ----------
     GHL stage is DERIVED from facts, never from menu picks, so screens can keep merging
     without touching the sync. Triage is local-only: nothing exists in GHL until
     "It's a job". GHL stages 8/9 (site inspection) are deliberately unused — GHL allows
     skipped stages. Finance: GHL retired its invoice/paid stages for a Payment Status
     custom field (2026-05-25), so 9/10/11 all sit in GHL 15 with that field walking
     not_invoiced → invoiced → paid.

     Sync rules (the gate before any write wiring):
       1. one owner per field — GHL owns contact + messages, this app owns stage + events
       2. events are immutable and append-only; state is computable from them
       3. offline taps queue and replay by event id, so two phones cannot clobber
       4. the GHL push is one-way and derived; a conflict shows a card, never auto-wins  */
  var GHL_MAP = {
    1:'1 Quote Requested', 2:'2 Q&A',
    3:'3/4/5 Sub-quote Requested → Received (derived: cost saved = Received)',
    4:'6 Quote Sent (the quote-sent event)', 5:'6 Quote Sent → 7 Quote Accepted on yes',
    6:'10 Prepayment Invoice Sent', 7:'11 holding → 14 Job Booked (12 Job on Hold if waiting)',
    8:'14 Job Booked (13 Job Issue on problems)',
    9:'15 Job Complete + PaymentStatus=invoiced', 10:'15 + PaymentStatus walks to paid',
    11:'15 + Status=Won', closed:'Opportunity Lost + reason'
  };

  /* ---------- demo data ----------
     A CUSTOMER is the person or company (phone is the key; history and pinned facts live
     here). A JOB is one piece of work moving through the stages. String ids throughout —
     GHL ids are strings, and the demo must break the same way the real thing would. */
  function ago(d){ return Date.now() - d*DAY; }
  function seed(){
    var C = [
      { id:'c101', name:'', phone:'0412 884 210', notes:[] },
      { id:'c102', name:'Dave', phone:'0433 118 902', notes:[] },
      { id:'c103', name:'Ana Natividad', phone:'0408 771 233', notes:[] },
      { id:'c104', name:'Ben Harris', phone:'0421 665 019', notes:[] },
      { id:'c105', name:'Sophie Tran', phone:'0417 220 884', notes:[
        {t:'Wants it before the open home on the 14th', by:'Allan', at:ago(2), pin:1}] },
      { id:'c106', name:'Laura Milne', phone:'0493 239 503', notes:[] },
      { id:'c107', name:'Michelle', phone:'0455 907 118', notes:[] },
      { id:'c108', name:'Tomas Repka', phone:'0433 760 339', notes:[
        {t:'Most of this is plumbing, not our work. Only the silicone and drain are ours.', by:'Allan', at:ago(14), pin:1}] },
      { id:'c109', name:'Ray White Marrickville', phone:'02 9558 1200', company:1, notes:[
        {t:'Always invoice the agency, never the tenant', by:'Allan', at:ago(120), pin:1}] },
      { id:'c110', name:'Neil Prout', phone:'0402 118 664', notes:[] },
      { id:'c111', name:'Jo D', phone:'0466 330 771', notes:[] },
      { id:'c112', name:'Lisa Vruwink', phone:'0499 771 305', notes:[] },
      { id:'c113', name:'Mick Connolly', phone:'0455 221 907', notes:[
        {t:'Rear lane access only, no parking out front', by:'Marko', at:ago(60), pin:1}] },
      { id:'c114', name:'Rory McVeigh', phone:'0400 118 224', notes:[] }
    ];
    var J = [
      { id:'j1', cid:'c101', src:'missed', createdAt:ago(0.02), type:'untriaged', notes:[], events:[] },
      { id:'j2', cid:'c102', src:'sms', msg:'hey do you guys do laundry tubs as well?',
        createdAt:ago(0.2), type:'untriaged', notes:[], events:[] },
      { id:'j3', cid:'c103', src:'form', suburb:'Ryde', want:'Bath resurface, chips in the enamel',
        photos:4, createdAt:ago(0.4), type:'job', stage:1, owner:'Allan', notes:[], events:[] },
      { id:'j4', cid:'c104', src:'form', suburb:'Castle Hill', want:'Shower regrout, mould in the corners',
        photos:3, createdAt:ago(2.1), type:'job', stage:3, owner:'Allan',
        notes:[{t:'Ultraglaze quoted 640, can start the 18th', by:'Allan', at:ago(1)}], events:[] },
      { id:'j5', cid:'c105', src:'referral', suburb:'Epping', refBy:'Isabella (AitkenRE)',
        want:'Vanity + basin resurface', photos:5, createdAt:ago(3.2), type:'job', stage:5,
        quote:1450, cost:780, owner:'Allan', notes:[], events:[] },
      { id:'j6', cid:'c106', src:'form', suburb:'Bonnet Bay', want:'Shower walls resurface + regrout',
        photos:5, createdAt:ago(8.4), type:'job', stage:5, quote:2860, cost:1490, owner:'Allan', notes:[], events:[] },
      { id:'j7', cid:'c107', src:'partial', suburb:'Penrith', want:'Started the form, stopped at photos',
        createdAt:ago(5.6), type:'job', stage:1, owner:'Allan', notes:[], events:[] },
      { id:'j8', cid:'c108', src:'form', suburb:'Rhodes', want:'2 bathrooms, mixer taps + Caesarstone',
        photos:6, createdAt:ago(15.2), type:'job', stage:5, quote:3300, cost:1980, owner:'Allan', notes:[], events:[] },

      /* Ray White: a repeat channel — three jobs across different properties */
      { id:'j9', cid:'c109', src:'agent', suburb:'Marrickville', want:'Rental bath resurface, 14 Byrne St',
        photos:2, createdAt:ago(6.1), type:'job', stage:7, quote:1540, cost:880, owner:'Marko', notes:[], events:[] },
      { id:'j20', cid:'c109', src:'agent', suburb:'Marrickville', want:'Shower regrout, 3/88 Illawarra Rd',
        photos:3, createdAt:ago(74), type:'won', stage:11, quote:1100, cost:640, owner:'Marko',
        booking:'Thu 15 May, Ultraglaze', notes:[], events:[] },
      { id:'j21', cid:'c109', src:'agent', suburb:'Dulwich Hill', want:'Vanity resurface, 12 Wardell Rd',
        photos:2, createdAt:ago(140), type:'won', stage:11, quote:775, cost:430, owner:'Marko',
        booking:'Mon 10 Mar, Marko', notes:[], events:[] },

      { id:'j10', cid:'c110', src:'form', suburb:'Hornsby', want:'Bath resurface', photos:4,
        createdAt:ago(22), type:'job', stage:10, quote:1540, cost:880, booking:'Tue 22 Jul, Marko', owner:'Marko', notes:[], events:[] },
      { id:'j11', cid:'c111', src:'call', suburb:'Marsfield', want:'Chip repair on a bathtub',
        createdAt:ago(30), type:'job', stage:11, quote:380, cost:285, booking:'Mon 14 Jul, Ultraglaze', owner:'Marko', notes:[], events:[] },
      { id:'j12', cid:'c112', src:'form', suburb:'North Turramurra', want:'Full bathroom refresh',
        photos:4, createdAt:ago(40), type:'job', stage:5, quote:2100, cost:1200, owner:'Allan', notes:[], events:[] },

      /* Mick: came back for a second bathroom — the repeat case */
      { id:'j13', cid:'c113', src:'form', suburb:'Claremont Meadows', want:'2 bathrooms, full resurface',
        photos:12, createdAt:ago(52), type:'won', stage:11, quote:4200, cost:2400,
        booking:'Wed 18 Jun, Ultraglaze', owner:'Marko', notes:[], events:[] },
      { id:'j22', cid:'c113', src:'call', suburb:'Claremont Meadows', want:'Ensuite this time, same finish',
        createdAt:ago(0.6), type:'job', stage:2, owner:'Allan', notes:[], events:[] },

      { id:'j14', cid:'c114', src:'form', suburb:'Queens Park', want:'Bath + wall resurface', photos:11,
        createdAt:ago(35), type:'closed', reason:'Too expensive', revivable:1, stage:5,
        quote:2600, cost:1500, owner:'Allan', notes:[], events:[] }
    ];
    return { customers:C, jobs:J };
  }

  var S = { customers:[], leads:[], open:null, q:'', filter:'open',
            me: (function(){ try{ return localStorage.getItem('tp_me')||'Allan'; }catch(e){ return 'Allan'; } })() };
  function setMe(who){ S.me = who; try{ localStorage.setItem('tp_me', who); }catch(e){} render(); }

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
         if(r && r.jobs && r.customers){
           S.leads=r.jobs; S.customers=r.customers;
           /* migrations: ids to strings, retired stage 4 to the merged Quote screen */
           S.customers.forEach(function(c){ c.id=String(c.id); });
           S.leads.forEach(function(j){ j.id=String(j.id); j.cid=String(j.cid);
             if(j.stage===4) j.stage=3; });
           return; } }catch(e){}
    var d=seed(); S.leads=d.jobs; S.customers=d.customers; save();
  }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify({customers:S.customers, jobs:S.leads})); }catch(e){} }
  function reset(){ localStorage.removeItem(KEY); var d=seed(); S.leads=d.jobs; S.customers=d.customers;
                    save(); S.open=null; render(); }

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

  /* every mutation flows through here — immutable, append-only, who+when+channel.
     This is the spine the GHL sync will read (sync rule 2). */
  var evSeq = 0;
  function logEvent(l, t, ch){
    (l.events=l.events||[]).push({ id: Date.now()+'-'+(evSeq++), t:t, by:S.me, at:Date.now(),
                                   ch: ch||undefined });
  }
  function lastChipAt(l){
    var t = 0;
    (l.events||[]).forEach(function(e){ if(e.ch && e.at>t) t=e.at; });
    return t;
  }

  /* ---------- drafts: the words for each stage's text ----------
     Job-only, no promo — that keeps them transactional under the Spam Act. */
  var DRAFTS = {
    1: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", "+S.me+" from Timeless Resurfacing. Thanks for getting in touch about the "+(l.want||'bathroom')+". I'll have a price back to you within 24 to 48 hours."; },
    2: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", could you send a couple more photos so I can price it accurately? A wide shot of the whole room and a close-up of the problem area is perfect."; },
    3: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", just letting you know I'm getting the final costing sorted and will have your price across shortly."; },
    5: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+', just checking you got the quote through. Happy to talk through any of it, or adjust the scope if that helps.'; },
    6: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", great news. To lock the date in we just need the 10% deposit. I'll send the invoice through now."; },
    7: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", I'm working out the earliest date we can get to you and will confirm shortly."; },
    8: function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", just a reminder we're booked in "+(l.booking||'soon')+". Could you clear the bathroom beforehand so we can get straight into it?"; },
    10:function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+', just a friendly reminder the invoice is still outstanding. Let me know if you need the details sent again.'; },
    11:function(l){ return 'Hi'+(cust(l).name?' '+cust(l).name.split(' ')[0]:'')+", hope you're happy with how it turned out. If you've got a spare minute, a Google review really helps a small business like ours."; }
  };
  function smsHref(l, stage){
    var d = DRAFTS[stage], num = (cust(l).phone||'').replace(/[^\d+]/g,'');
    return 'sms:'+num+'?&body='+encodeURIComponent(d ? d(l) : '');
  }
  function telHref(l){ return 'tel:'+(cust(l).phone||'').replace(/[^\d+]/g,''); }

  /* ---------- sub pay: money OUT, tracked only when a sub did the job ---------- */
  function subWho(l){
    if(l.booking){ var w = l.booking.split(',').pop().trim(); if(w && w!=='Marko') return w; }
    if(l.costBy && l.costBy!=='Marko') return 'the sub';
    return null;
  }
  function subOwed(l){ return !!subWho(l) && !!l.cost && l.subPaid!==1; }
  function paySub(l){ l.subPaid=1; logEvent(l,'Paid '+subWho(l)+' '+money(l.cost)); }

  /* ---------- the assistant: what to do next, and why ---------- */
  var ACTION = {
    1:['Make contact','New enquiry, speed matters most here'],
    2:['Check what they sent','Can we price it from the photos?'],
    3:['Get the numbers','Cost and quote still to go out'],
    5:['Follow up on the quote','Quote is with them, waiting on an answer'],
    6:['Chase the deposit','They accepted, the deposit is not in yet'],
    7:['Book it in','Deposit paid, this needs a date'],
    8:['Run the job','Booked in and coming up'],
    9:['Send the invoice','Job is done, the invoice has not gone out'],
    10:['Get paid','Invoice is out, the money is not in'],
    11:['Wrap it up','Warranty and review, then it is finished']
  };
  function suggest(l){
    var d = Math.round(ageDays(l));
    if(l.type==='untriaged') return { p:1, why:'Brand new, nobody has looked at it yet', do:'Sort it' };
    if(!isOpen(l)) return null;
    if(atCap(l)) return { p:1, why:'Tried '+tries(l)+' times — that is enough', do:'Change approach or close it' };
    var lm = limitOf(l);
    if(lm && lm.nudge && tries(l) >= lm.nudge.at && isDue(l))
      return { p:2, why:lm.nudge.t, do:'Try a different way' };
    if(isDue(l)) return { p:2, why:'Follow-up was due '+
      (Math.abs(dueIn(l))<1 ? 'today' : Math.round(-dueIn(l))+' days ago'), do:'Chase it now' };
    if(l.stage===11 && subOwed(l)) return { p:3, why:'Money is in but '+subWho(l)+' is still owed '+money(l.cost), do:'Pay the sub' };
    if(l.stage===7 && !l.booking) return { p:2, why:'Deposit paid, they are waiting on a date', do:'Book it in' };
    if(l.stage===10 && d>=2) return { p:3, why:'Job done, money still out, '+d+' days', do:'Chase the payment' };
    if(l.stage===5 && d>=2) return { p:4, why:'Quote sent '+d+' days ago, no answer', do:'Follow up' };
    if(l.stage===3 && d>=2) return { p:5, why:'Waiting on a price for '+d+' days', do:'Chase it or price it yourself' };
    if(l.stage===1 || l.stage===2){
      var h2 = history(l);
      if(h2.isRepeat) return { p:2, why:'Repeat customer, '+h2.done+' job'+(h2.done>1?'s':'')+' before worth '+money(h2.value), do:'Get straight to a price' };
    }
    if(l.stage===1) return { p:6, why:'New enquiry, speed matters most here', do:'Make contact' };
    if(d>5) return { p:7, why:'Nothing has happened for '+d+' days', do:'Move it or close it' };
    var a = ACTION[l.stage] || ['Move it forward',''];
    return { p:9, why:a[1], do:a[0] };
  }

  /* ---------- queue (the home screen) ---------- */
  function filtered(){
    var q=S.q.toLowerCase();
    var rows = S.leads.filter(function(l){
      if(S.filter==='open' && !isOpen(l)) return false;
      if(S.filter==='mine' && !(isOpen(l) && (l.owner||'')===S.me)) return false;
      if(S.filter==='won' && l.type!=='won') return false;
      if(S.filter==='closed' && l.type!=='closed') return false;
      if(S.filter==='stale' && (!isOpen(l)||ageDays(l)<=5)) return false;
      if(q){ var c=cust(l); var hay=((c.name||'')+' '+(l.suburb||'')+' '+(l.want||'')+' '+(c.phone||'')).toLowerCase();
             if(hay.indexOf(q)===-1) return false; }
      return true;
    });
    /* open views rank by urgency — the queue IS the old "Start here" list */
    if(S.filter==='open' || S.filter==='mine' || S.filter==='stale')
      return rows.sort(function(a,b){
        var sa=suggest(a)||{p:99}, sb=suggest(b)||{p:99};
        return sa.p - sb.p || ageDays(b) - ageDays(a); });
    return rows.sort(function(a,b){ return lastAt(b)-lastAt(a); });
  }

  function statsLine(){
    var open = S.leads.filter(isOpen);
    var stale = open.filter(function(l){ return ageDays(l)>5; });
    var oldest = open.length ? Math.round(Math.max.apply(null, open.map(ageDays))) : 0;
    return '<b>'+open.length+'</b> open'+
      (stale.length ? ' · <span class="bad">'+stale.length+' gone quiet</span>' : '')+
      (open.length ? ' · oldest '+oldest+'d' : '');
  }

  function rowTrack(l){
    if(!isOpen(l)) return '';
    var pi = l.type==='untriaged' ? 0 : phaseIdx(l.stage||1);
    return '<div class="rtrack">'+PHASES.map(function(p,i){
      var cls = i<pi ? 'done' : i===pi ? 'now' : '';
      return (i ? '<span class="rline'+(i<=pi?' on':'')+'" style="'+(i<=pi?'background:'+p.c:'')+'"></span>' : '')+
        '<span class="rdot '+cls+'" style="'+(cls?'color:'+p.c:'')+'" title="'+p.k+'">'+ic(p.ic,11)+'</span>';
    }).join('')+'</div>';
  }

  function rowHTML(l){
    var col = avatarColour(l.id), c = cust(l);
    var stale = isOpen(l) && ageDays(l)>5;
    var sg = isOpen(l) ? suggest(l) : null;
    var pill = l.type==='untriaged' ? '<span class="pill triage">New enquiry</span>'
      : l.type==='won' ? '<span class="pill won">Won</span>'
      : l.type==='closed' ? '<span class="pill lost">'+esc(l.reason||'Closed')+'</span>'
      : ageDays(l)<1 ? '<span class="pill new">New</span>'
      : '<span class="pill active">'+esc(stageOf(l.stage).name)+'</span>';
    var h = history(l);
    return '<div class="row'+(stale?' stale':'')+'" data-id="'+esc(l.id)+'">'+
      '<div class="rav" style="background:'+col[0]+';color:'+col[1]+'">'+esc(initials(l))+'</div>'+
      '<div class="rmain"><div class="rname">'+esc(c.name||c.phone||'Unknown')+
        (l.suburb?' <span class="sub">· '+esc(l.suburb)+'</span>':'')+
        (h.isRepeat?' <span class="pill rep">'+ic('rotate',10)+'Repeat</span>':'')+'</div>'+
      '<div class="rwhy'+(sg&&sg.p<=2?' hot':'')+'">'+
        esc(sg ? sg.why : (l.want||l.msg||''))+'</div></div>'+
      rowTrack(l)+
      '<div class="rside"><span class="rage'+(stale?' stale':'')+'">'+ageText(lastAt(l))+'</span>'+pill+'</div>'+
      '</div>';
  }

  function renderQueue(){
    var rows = filtered();
    var TABS=[{k:'open',t:'Open'},{k:'mine',t:'Mine'},{k:'stale',t:'Gone quiet'},
              {k:'won',t:'Won'},{k:'closed',t:'Closed'}];
    $('#app').innerHTML =
      '<div class="top"><div class="blogo">TR</div><div class="bname">Pipeline</div>'+
      '<div class="stats">'+statsLine()+'</div></div>'+
      '<div class="toolbar"><div class="search"><span class="mag">'+ic('search',15)+'</span>'+
      '<input id="q" placeholder="Search name, suburb or job…" value="'+esc(S.q)+'" /></div>'+
      TABS.map(function(t){ return '<button class="tbtn'+(S.filter===t.k?' on':'')+'" data-f="'+t.k+'">'+t.t+'</button>'; }).join('')+
      '</div>'+
      (rows.length ? rows.map(rowHTML).join('') : '<p class="empty">Nothing here.</p>')+
      '<div style="text-align:center"><button class="resetb" id="reset">↺ Reset demo</button></div>';

    $('#q').oninput = function(){ S.q=this.value; var p=this.selectionStart; renderQueue();
      var n=$('#q'); n.focus(); n.setSelectionRange(p,p); };
    $$('.tbtn').forEach(function(b){ b.onclick=function(){ S.filter=b.dataset.f; renderQueue(); }; });
    $$('.row').forEach(function(r){ r.onclick=function(){ S.open=r.dataset.id; render(); }; });
    $('#reset').onclick=function(){ if(confirm('Reset the demo?')) reset(); };
  }

  /* ---------- detail ---------- */
  function lead(){ return S.leads.filter(function(l){return l.id===S.open;})[0]; }

  function trackerHTML(l){
    var pi = l.type==='won' ? PHASES.length-1 : phaseIdx(l.stage||1);
    var doneAll = l.type==='won';
    var c = PHASES[pi].c;
    var fill = doneAll ? 100 : (pi/(PHASES.length-1))*100;
    return '<div class="track">'+
      '<div class="tlabels">'+PHASES.map(function(p,i){
        return '<span class="'+(i===pi?'on':'')+'">'+ic(p.ic,12)+'<b>'+p.k+'</b></span>'; }).join('')+'</div>'+
      '<div class="tline"><div class="tbase"></div>'+
      '<div class="tfill" style="width:calc('+fill+'% - '+(fill?14:0)+'px);background:'+c+'"></div>'+
      '<div class="tdots">'+PHASES.map(function(p,i){
        var cls = doneAll||i<pi ? 'done' : i===pi ? 'now' : '';
        return '<div class="dot '+cls+'" style="color:'+(cls?c:'')+'"></div>'; }).join('')+
      '</div></div></div>';
  }

  function qcardHTML(l){
    if(l.type==='won'||l.type==='closed'){
      return '<div class="endcard '+(l.type==='won'?'won':'closed')+'">'+
        '<div class="big">'+ic(l.type==='won'?'trophy':'check',20)+' '+(l.type==='won'?'Won':'Closed')+'</div><div>'+
        esc(l.type==='won'?'Job done, paid and reviewed':(l.reason||''))+'</div>'+
        (l.revivable?'<div class="revnote">Worth another go in a few months — marked revivable.</div>':'')+
        '<button class="resetb" id="reopen" style="margin-top:14px">Reopen</button></div>';
    }
    if(l.type==='untriaged'){
      return '<div class="qcard"><div class="qstage">New enquiry</div>'+
        '<div class="qtext">Is this a job, a question, or not for us?</div><div class="opts">'+
        '<button class="opt good" data-tri="job">'+ic('wrench')+'<span>It\'s a job, start the pipeline</span></button>'+
        '<button class="opt" data-tri="question">'+ic('msg')+'<span>Just a question, answer and close</span></button>'+
        '<button class="opt" data-tri="notus">'+ic('xCircle')+'<span>Not for us, refer out</span></button></div></div>';
    }
    var st = stageOf(l.stage), sg = suggest(l);
    var lim = limitOf(l), used = tries(l), capped = atCap(l);
    function obtn(o){ var i = st.opts.indexOf(o), again = (o.next === st.n);
      return '<button class="opt'+(o.good?' good':o.fold?' foldopt':'')+
             (again && capped ? ' capped':'')+'" data-opt="'+i+'">'+
             ic(o.ic)+'<span>'+esc(o.t)+'</span>'+
             (again && lim ? '<em>'+ord(used+1)+' try</em>' : '')+'</button>'; }
    var vis  = st.opts.filter(function(o){ return !o.fold; });
    var hid  = st.opts.filter(function(o){ return  o.fold; });

    var meter = '';
    if(lim && used > 0){
      var d = dueIn(l);
      meter = '<div class="qtry'+(capped?' over':'')+'">'+ic(capped?'alert':'clock',13)+
        '<span>'+used+' of '+lim.cap+' tries'+
        (capped ? ' — past the point where more helps'
                : d==null ? '' : d <= 0 ? ' · next due now'
                : ' · next in '+Math.ceil(d)+'d')+'</span></div>';
    }
    var say = capped ? (lim && lim.hint)
            : (lim && lim.nudge && used >= lim.nudge.at) ? lim.nudge.t : '';
    if(say) meter += '<div class="qhint">'+ic('target',13)+'<span>'+esc(say)+'</span></div>';

    /* Call / Text — the tap performs the contact AND records it (channel, who, when) */
    var chips = '';
    if(DRAFTS[l.stage] && cust(l).phone){
      chips = '<div class="chips">'+
        '<a class="chip" href="'+telHref(l)+'" data-chip="call">'+ic('phone',16)+'Call</a>'+
        '<a class="chip" href="'+smsHref(l, l.stage)+'" data-chip="sms">'+ic('msg',16)+'Text</a></div>';
    }
    var draftFold = DRAFTS[l.stage]
      ? '<details class="draftfold"><summary>See the message the Text button sends</summary>'+
        '<div class="draft"><textarea id="dtx" rows="3">'+esc(DRAFTS[l.stage](l))+'</textarea>'+
        '<button class="dcopy" id="dcopy">Copy message</button></div></details>'
      : '';

    return '<div class="qcard"><div class="qstage">Step '+st.n+' of 11 · '+esc(st.name)+'</div>'+
      '<div class="qtext">'+esc(st.q)+'</div>'+
      (sg && sg.why ? '<p class="qwhy">'+esc(sg.why)+'</p>' : '')+
      chips + meter +
      '<div class="opts">'+
      (capped ? '<button class="opt giveup" id="giveup">'+ic('xCircle')+
                '<span>Stop here — '+esc(lim.close.toLowerCase())+'</span></button>' : '')+
      vis.map(obtn).join('')+
      (hid.length ? '<button class="opt fold" id="showend">'+ic('xCircle')+
              '<span>'+esc(FOLD_LABEL[st.n]||'Not going ahead…')+'</span></button>'+
              '<div class="badopts" id="endopts">'+hid.map(obtn).join('')+'</div>' : '')+
      '</div>'+draftFold+'</div>';
  }

  function renderDetail(){
    var l = lead(); if(!l){ S.open=null; return render(); }
    var s = SOURCES[l.src]||{}, pins=((cust(l).notes)||[]).filter(function(n){return n.pin;});

    /* left column: name → pinned facts → THE QUESTION → progress */
    var main = '<button class="backb" id="back">‹ Back</button>'+
      '<div><h1>'+esc(cust(l).name||cust(l).phone||'Unknown')+'</h1>'+
      '<p class="sub">'+esc(l.suburb||'')+(l.want?' · '+esc(l.want):'')+'</p></div>'+
      pins.map(function(n){ return '<div class="pin">'+ic('pinned',15)+'<span>'+esc(n.t)+'</span></div>'; }).join('');

    var prog = '<div class="prog">'+trackerHTML(l)+
      '<div class="tstate">'+(l.type==='untriaged'?'Not sorted yet'
        : l.type==='won'?'Complete'
        : l.type==='closed'?'Closed · <b>'+esc(l.reason||'')+'</b>'
        : 'Step '+l.stage+' of 11 · <b>'+esc(stageOf(l.stage).name)+'</b>'+
          (l.owner?' · '+esc(l.owner)+'’s':''))+'</div></div>';

    /* right column: the x-ray, one tap deep, never on the queue */
    var right = '';
    var h = history(l);
    if(h.isRepeat){
      var others = jobsOf(l.cid).filter(function(x){ return x.id!==l.id; })
        .sort(function(a,b){ return b.createdAt-a.createdAt; });
      right += '<div class="box"><h3>'+ic('rotate',13)+'Repeat customer</h3>'+
        '<div class="cstat"><div><b>'+h.total+'</b><span>jobs</span></div>'+
        '<div><b>'+h.done+'</b><span>completed</span></div>'+
        '<div><b>'+money(h.value)+'</b><span>lifetime</span></div></div>'+
        others.map(function(o){
          return '<div class="ojob" data-job="'+esc(o.id)+'"><div><div class="ow">'+esc(o.want||'Job')+'</div>'+
            '<div class="om">'+ageText(o.createdAt)+(o.quote?' · '+money(o.quote):'')+'</div></div>'+
            '<span class="opill '+(o.type==='won'?'won':o.type==='closed'?'lost':'open')+'">'+
            (o.type==='won'?'Won':o.type==='closed'?'Closed':'Open')+'</span></div>';
        }).join('')+'</div>';
    }
    var margin = (l.quote&&l.cost) ? l.quote-l.cost : null;
    right += '<div class="box"><h3>Details</h3>'+
      [['Source',(s.label||'—')],['Phone',cust(l).phone||'—'],['Suburb',l.suburb||'—'],
       ['Wants',l.want||l.msg||'—'],['Photos',l.photos?l.photos+' photos':'—'],
       ['Owner',l.owner||'Unassigned'],['Quote',l.quote?money(l.quote):'—'],
       ['Our cost',l.cost?money(l.cost)+(l.costBy?' ('+esc(l.costBy)+')':''):'—'],
       ['Margin', margin!=null?money(margin):'—', margin!=null&&margin<300],
       ['Booked',l.booking||'—'],['Referred by',l.refBy||'—']]
      .concat(subWho(l)&&l.cost ? [['Sub paid', l.subPaid===1?'Yes':'Owed '+money(l.cost), l.subPaid!==1]] : [])
      .map(function(kv){ return '<div class="kv"><span class="k">'+kv[0]+'</span><span class="v'+
        (kv[2]?' warn':'')+'">'+esc(kv[1])+'</span></div>'; }).join('')+'</div>';

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

    $('#app').innerHTML = main +
      '<div class="grid2"><div>'+qcardHTML(l)+'<div style="height:14px"></div>'+prog+'</div>'+
      '<div>'+right+'</div></div>';

    $('#back').onclick=function(){ S.open=null; render(); };
    $$('[data-tri]').forEach(function(b){ b.onclick=function(){ triage(l,b.dataset.tri); }; });
    $$('[data-opt]').forEach(function(b){ b.onclick=function(){ answer(l, stageOf(l.stage).opts[Number(b.dataset.opt)]); }; });
    $$('[data-chip]').forEach(function(a){ a.addEventListener('click', function(){ chipTap(l, a.dataset.chip); }); });
    if($('#showend')) $('#showend').onclick=function(){ $('#endopts').classList.add('on'); this.remove(); };
    if($('#giveup')) $('#giveup').onclick=function(){
      var m = limitOf(l);
      apply(l, { t:'Stopped after '+tries(l)+' tries', next:'closed', reason:m.close, revive:m.revive }); };
    if($('#reopen')) $('#reopen').onclick=function(){ l.type='job'; l.stage=l.stage||1;
      delete l.reason; delete l.revivable; logEvent(l,'Reopened'); save(); render(); };
    var pinOn=false;
    if($('#npin')) $('#npin').onclick=function(){ pinOn=!pinOn; this.classList.toggle('on',pinOn); };
    $$('[data-job]').forEach(function(o){ o.onclick=function(){ S.open=o.dataset.job; render(); }; });
    if($('#dcopy')) $('#dcopy').onclick=function(){
      var t=$('#dtx'); t.select();
      navigator.clipboard.writeText(t.value).then(function(){
        var b=$('#dcopy'); b.textContent='Copied'; setTimeout(function(){ b.textContent='Copy message'; },1600);
      });
    };
    if($('#nadd')) $('#nadd').onclick=function(){ var t=$('#ntext').value.trim(); if(!t)return;
      /* pinned facts are about the CUSTOMER and follow them; quick notes stay on the job */
      if(pinOn){ var c=cust(l); (c.notes=c.notes||[]).push({t:t,by:S.me,at:Date.now(),pin:1}); }
      else (l.notes=l.notes||[]).push({t:t,by:S.me,at:Date.now()});
      save(); render(); };
  }

  /* ---------- actions ---------- */
  function toast(msg){
    var t=$('#toast'); t.innerHTML=ic('check',15)+' '+esc(msg); t.classList.add('on');
    clearTimeout(toast._h); toast._h=setTimeout(function(){ t.classList.remove('on'); },1800);
  }

  function triage(l,k){
    if(k==='job'){ l.type='job'; l.stage=1; l.owner=l.owner||S.me; logEvent(l,'Marked as a job'); }
    if(k==='question'){ l.type='closed'; l.reason='Question answered'; logEvent(l,'Answered their question'); }
    if(k==='notus'){ l.type='closed'; l.reason='Not our work'; logEvent(l,'Referred out'); }
    save(); render();
  }

  /* a Call/Text chip tap IS an attempt: it logs the channel, counts the try on retry-capped
     stages, and starts the next-due clock — nothing is asked that the tap already said */
  function chipTap(l, kind){
    logEvent(l, kind==='call' ? 'Called them' : 'Texted them', kind);
    if(limitOf(l)){
      l.tries = l.tries || {};
      l.tries[String(l.stage)] = tries(l) + 1;
      scheduleTouch(l);
    }
    save();
    /* re-render on return from the phone app */
    setTimeout(render, 400);
  }

  function answer(l,o){
    if(o.needs==='numbers') return askNumbers(l,o);
    if(o.needs==='booking') return askBooking(l,o);
    if(o.needs==='jobdone') return askJobdone(l,o);
    if(o.needs==='wrapdone') return askWrapdone(l,o);
    apply(l,o);
  }

  /* a job is not wrapped while we still owe the sub — one tap settles it */
  function askWrapdone(l,o){
    if(!subOwed(l)) return apply(l,o);
    openModal('<h3>One thing first</h3><p>'+esc(subWho(l))+' is still owed '+money(l.cost)+' for this job.</p>'+
      '<button class="mbtn" id="msp">Paid them — close the job</button>'+
      '<button class="mbtn mcancel" id="mx">Not yet, leave it open</button>');
    $('#msp').onclick=function(){ paySub(l); apply(l,o); };
    $('#mx').onclick=function(){ closeModal(); toast('Left open until '+subWho(l)+' is paid'); };
  }

  function apply(l,o){
    logEvent(l,o.t);
    if(o.pin){ var c=cust(l); (c.notes=c.notes||[]).push({t:o.pin,by:S.me,at:Date.now(),pin:1}); }
    if(o.next==='won'){ l.type='won'; delete l.nextTouch; }
    else if(o.next==='closed'){
      l.type='closed'; l.reason=o.reason||'Closed'; delete l.nextTouch;
      if(o.revive) l.revivable = 1;
    }
    else {
      var was = l.stage;
      if(o.next === was){
        /* another go at the same step — but a chip tap in the last 10 minutes already
           counted it, so "no answer" straight after a call is one attempt, not two */
        if(Date.now() - lastChipAt(l) > 10*60*1000){
          l.tries = l.tries || {};
          l.tries[String(was)] = tries(l) + 1;
        }
      } else {
        l.stage = o.next;
        if(isOpen(l)) toast('Moved to '+stageOf(l.stage).name);
      }
      scheduleTouch(l);
    }
    save(); closeModal(); render();
  }

  function scheduleTouch(l){
    var m = limitOf(l);
    if(!m){ delete l.nextTouch; return; }
    var n = Math.min(tries(l), m.days.length - 1);
    l.nextTouch = Date.now() + m.days[n]*DAY;
  }

  function openModal(h){ $('#msheet').innerHTML=h; $('#modal').classList.add('on'); }
  function closeModal(){ $('#modal').classList.remove('on'); }
  $('#modal').onclick=function(e){ if(e.target.id==='modal') closeModal(); };

  /* the merged 3+4 modal — Allan's rule writ large: tap yes, type two numbers, done.
     Testable without the DOM via saveNumbers. */
  function saveNumbers(l, v){
    l.cost = Number(v.cost)||0; l.quote = Number(v.quote)||0; l.costBy = v.by||'Marko';
    logEvent(l,'Cost saved: '+money(l.cost)+' ('+l.costBy+')');
    apply(l, { t:'Quote sent: '+money(l.quote), next:5 });
  }
  function askNumbers(l,o){
    openModal('<h3>The numbers</h3><p>Both including GST. Saving marks the quote as sent.</p>'+
      '<label>Our cost — who priced it?</label>'+
      '<div class="whorow"><button id="wm" class="on">Marko</button><button id="ws">A sub</button></div>'+
      '<label>Our cost $</label><input id="mc" type="number" inputmode="decimal" placeholder="e.g. 880" value="'+(l.cost||'')+'" />'+
      '<label>Quote to the customer $</label><input id="mq" type="number" inputmode="decimal" placeholder="e.g. 1540" value="'+(l.quote||'')+'" />'+
      '<div id="mwarn"></div>'+
      '<button class="mbtn" id="mok">Quote sent</button><button class="mbtn mcancel" id="mx">Cancel</button>');
    var by='Marko';
    $('#wm').onclick=function(){ by='Marko'; this.classList.add('on'); $('#ws').classList.remove('on'); };
    $('#ws').onclick=function(){ by='Sub'; this.classList.add('on'); $('#wm').classList.remove('on'); };
    function chk(){
      var cst=Number($('#mc').value)||0, q=Number($('#mq').value)||0, m=q-cst, w='';
      if(q && m<300) w='<div class="warnbox">'+ic('alert',14)+' Margin is only '+money(m)+'. Floor is $300.</div>';
      if(q>5000) w+='<div class="warnbox">'+ic('alert',14)+' Over the $5k licence cap.</div>';
      $('#mwarn').innerHTML=w;
    }
    $('#mc').oninput=chk; $('#mq').oninput=chk; chk(); $('#mc').focus();
    $('#mok').onclick=function(){ saveNumbers(l, {cost:$('#mc').value, quote:$('#mq').value, by:by}); };
    $('#mx').onclick=closeModal;
  }

  function askBooking(l,o){
    openModal('<h3>Book it in</h3><p>Date and who is doing it.</p>'+
      '<input id="md" placeholder="e.g. Tue 12 Aug, morning" />'+
      '<label>Who</label><select id="mw"><option>Marko</option><option>Ultraglaze</option><option>Sub B</option></select>'+
      '<button class="mbtn" id="mok">Confirm booking</button><button class="mbtn mcancel" id="mx">Cancel</button>');
    $('#md').focus();
    $('#mok').onclick=function(){ l.booking=($('#md').value||'TBC')+', '+$('#mw').value;
      l.owner=$('#mw').value==='Marko'?'Marko':l.owner; apply(l,o); };
    $('#mx').onclick=closeModal;
  }

  /* job done → the invoice question rides on the same tap */
  function askJobdone(l,o){
    openModal('<h3>Job done</h3><p>Nice. Has the invoice gone out yet?</p>'+
      '<button class="mbtn" id="minv">Done — invoice sent too</button>'+
      '<button class="mbtn" id="mnot" style="background:var(--greybg);color:var(--ink2)">Done — invoice still to send</button>'+
      '<button class="mbtn mcancel" id="mx">Cancel</button>');
    $('#minv').onclick=function(){
      logEvent(l,'Job done, photos taken');
      apply(l,{ t:'Invoice sent', next:10 }); };
    $('#mnot').onclick=function(){ apply(l,{ t:'Job done, photos taken', next:9 }); };
    $('#mx').onclick=closeModal;
  }

  function render(){ if(S.open) renderDetail(); else renderQueue(); }

  /* test hook — the suite drives the REAL state machine through these */
  window.PIPE = { S:S, STAGES:STAGES, PHASES:PHASES, SOURCES:SOURCES, KEY:KEY, GHL_MAP:GHL_MAP,
    stageOf:stageOf, phaseIdx:phaseIdx, cust:cust, jobsOf:jobsOf, history:history,
    suggest:suggest, apply:apply, triage:triage, seed:seed, reset:reset,
    LIMITS:LIMITS, tries:tries, atCap:atCap, limitOf:limitOf, isDue:isDue, dueIn:dueIn,
    chipTap:chipTap, saveNumbers:saveNumbers, setMe:setMe, subWho:subWho, subOwed:subOwed, paySub:paySub,
    ageDays:ageDays, lastAt:lastAt, isOpen:isOpen, save:save, render:render };

  load(); render();
})();
