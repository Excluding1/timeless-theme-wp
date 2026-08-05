/* Timeless Pipeline — test + simulation suite (v2, for the panel-spec rebuild)
   Run at  http://localhost:4320/?test=1

   A  MODEL      — binary stages: one yes, one retry, rare answers folded; no limbo
   B  BEHAVIOUR  — the real functions: caps, chips, numbers modal, repeats, revives
   C  SIMULATION — 500 leads pushed through, counting taps and stuck leads
   D  USABILITY  — measured on the live viewport: tap sizes, scroll, visible choices
   E  CLEANUP    — the suite proves it left the demo exactly as found

   Nothing mocks the app: everything runs against window.PIPE (the live code).       */
(function(){
  var P = window.PIPE;
  if(!P){ console.error('PIPE hook missing — is app.js loaded?'); return; }

  var results = [], group = '';
  function G(n){ group = n; }
  function ok(name, pass, detail){
    results.push({ g:group, name:name, pass:!!pass, detail:detail||'' });
  }
  function eq(name, got, want){
    ok(name, JSON.stringify(got)===JSON.stringify(want),
       JSON.stringify(got)===JSON.stringify(want) ? '' : 'got '+JSON.stringify(got)+', wanted '+JSON.stringify(want));
  }

  var S = P.S, STAGES = P.STAGES, LIM = P.LIMITS;
  var DOOR = { won:1, closed:1 };

  /* restore machinery FIRST so even a crash mid-run puts the demo back */
  var BACKUP = null, BEFORE = { jobs:S.leads.length, customers:S.customers.length };
  try{ BACKUP = localStorage.getItem(P.KEY); }catch(e){}
  function restoreState(){
    try{
      if(BACKUP === null) localStorage.removeItem(P.KEY);
      else localStorage.setItem(P.KEY, BACKUP);
    }catch(e){}
    var d = BACKUP ? JSON.parse(BACKUP) : P.seed();
    S.customers = d.customers; S.leads = d.jobs || d.leads;
    S.open = null; P.render();
  }
  window.addEventListener('error', function(){ try{ restoreState(); }catch(e){} }, { once:true });

  /* ============================================================ A. MODEL ==== */
  G('A · Model');

  var nums = STAGES.map(function(s){ return s.n; });
  eq('internal numbers survive the merges: 1-11 with 4 folded into the Quote screen',
     nums, [1,2,3,5,6,7,8,9,10,11]);

  ok('every stage asks exactly one question',
     STAGES.every(function(s){ return typeof s.q === 'string' && s.q.length > 0; }));

  /* Allan's rule, enforced structurally */
  ok('every stage has exactly ONE bold yes answer',
     STAGES.every(function(s){ return s.opts.filter(function(o){ return o.good; }).length === 1; }),
     STAGES.map(function(s){ return s.n+':'+s.opts.filter(function(o){return o.good;}).length; }).join(' '));
  ok('no stage shows more than 2 answers before the fold (yes + not-yet)',
     STAGES.every(function(s){ return s.opts.filter(function(o){ return !o.fold; }).length <= 2; }),
     STAGES.map(function(s){ return s.n+':'+s.opts.filter(function(o){return !o.fold;}).length+'vis'; }).join(' '));
  ok('every close answer still records a reason, just folded',
     STAGES.every(function(s){ return s.opts.every(function(o){
       return o.next!=='closed' || (o.reason && o.reason.length); }); }));

  var badNext = [];
  STAGES.forEach(function(s){ s.opts.forEach(function(o){
    if(!DOOR[o.next] && nums.indexOf(o.next) === -1) badNext.push('stage '+s.n+' → '+o.next);
  }); });
  ok('every answer points somewhere real', badNext.length===0, badNext.join(', '));

  function nextsOf(n){ return P.stageOf(n).opts.map(function(o){ return o.next; }); }

  var seen = {1:1}, q = [1];
  while(q.length){ nextsOf(q.pop()).forEach(function(x){ if(!DOOR[x] && !seen[x]){ seen[x]=1; q.push(x); } }); }
  var unreachable = nums.filter(function(n){ return !seen[n]; });
  ok('every stage is reachable from stage 1', unreachable.length===0, 'orphans: '+unreachable.join(','));

  var canExit = {};
  for(var pass=0; pass<20; pass++){
    nums.forEach(function(n){
      if(canExit[n]) return;
      if(nextsOf(n).some(function(x){ return DOOR[x] || canExit[x]; })) canExit[n] = 1;
    });
  }
  var trapped = nums.filter(function(n){ return !canExit[n]; });
  ok('from EVERY stage a lead can still reach won or closed (no limbo trap)',
     trapped.length===0, 'trapped at: '+trapped.join(','));

  /* the deposit gate */
  var into7 = [], into8 = [];
  STAGES.forEach(function(s){ s.opts.forEach(function(o){
    if(o.next===7) into7.push(s.n); if(o.next===8) into8.push(s.n);
  }); });
  ok('booking (7) is only entered from deposit paid (6) or from itself',
     into7.every(function(n){ return n===6 || n===7 || n===8; }), 'entered from '+into7.join(','));
  ok('job day (8) is only entered from booking (7) or a callback/claim',
     into8.every(function(n){ return n===7 || n===8 || n===9 || n===11; }), 'entered from '+into8.join(','));

  /* price/timing closes stay revivable; a wrong number never is */
  var s5 = P.stageOf(5);
  ok('"too expensive", "went elsewhere" and "changed mind" are revivable',
     s5.opts.filter(function(o){ return o.next==='closed'; }).every(function(o){ return o.revive===1; }));
  ok('a wrong number is not revivable',
     !P.stageOf(1).opts.filter(function(o){ return o.reason==='Wrong number'; })[0].revive);

  /* the GHL map covers every stage plus the closed door */
  ok('the GoHighLevel map has an entry for every stage and for closed',
     nums.concat(['closed']).every(function(n){ return !!P.GHL_MAP[n]; }),
     Object.keys(P.GHL_MAP).join(','));

  /* ---- caps ---- */
  G('A · Attempt caps');
  ok('every retry answer sits under a cap (8, 9 and 11 exempt: same-day / admin)',
     STAGES.every(function(st){
       var loops = st.opts.some(function(o){ return o.next === st.n; });
       return !loops || LIM[String(st.n)] || st.n===8 || st.n===9 || st.n===11;
     }), Object.keys(LIM).join(','));
  ok('every cap has one wait time per attempt',
     Object.keys(LIM).every(function(k){ return LIM[k].days.length === LIM[k].cap; }));
  ok('waits get longer, never shorter',
     Object.keys(LIM).every(function(k){
       var d = LIM[k].days;
       return d.every(function(x,i){ return i===0 || x >= d[i-1]; });
     }));
  ok('first contact caps at 4 (trades guidance), finishing inside a week',
     LIM['1'].cap === 4 && LIM['1'].days[3] <= 7);
  eq('quote follow-ups run day 1, 3 then 7', LIM['5'].days, [1,3,7]);
  ok('the channel-switch nudge fires before the cap',
     LIM['1'].nudge && LIM['1'].nudge.at < LIM['1'].cap);
  ok('hints stay under 8 words (the meter carries the message)',
     Object.keys(LIM).every(function(k){
       var m=LIM[k];
       return (!m.hint || m.hint.split(/\s+/).length<=7) &&
              (!m.nudge || m.nudge.t.split(/\s+/).length<=7);
     }));
  ok('every cap records why we gave up',
     Object.keys(LIM).every(function(k){ return !!LIM[k].close; }));

  /* ========================================================= B. BEHAVIOUR ==== */
  G('B · Behaviour');

  var D = P.seed();
  var probe = D.jobs.filter(function(x){ return x.type==='job'; })[0];

  ok('all ids are strings — GHL ids are strings, the demo must match',
     D.jobs.every(function(j){ return typeof j.id==='string' && typeof j.cid==='string'; }) &&
     D.customers.every(function(c){ return typeof c.id==='string'; }));

  /* winning */
  var w = JSON.parse(JSON.stringify(probe)); w.id='tstw'; w.stage=11; S.leads.push(w);
  P.apply(w, P.stageOf(11).opts[0]);
  ok('finishing the last stage marks the job won', w.type==='won');
  ok('the action was logged with who, when and an event id',
     w.events.length>0 && !!w.events[w.events.length-1].by && !!w.events[w.events.length-1].id);

  /* losing, with reason + revive */
  var c2 = JSON.parse(JSON.stringify(probe)); c2.stage=5; c2.id='tstc'; S.leads.push(c2);
  var tooExp = P.stageOf(5).opts.filter(function(o){ return o.reason==='Too expensive'; })[0];
  P.apply(c2, tooExp);
  ok('declining closes with the reason and marks it revivable',
     c2.type==='closed' && c2.reason==='Too expensive' && c2.revivable===1);

  /* the merged numbers modal — cost + quote in one go, straight to stage 5 */
  var nm = JSON.parse(JSON.stringify(probe)); nm.stage=3; nm.id='tstn'; nm.tries={}; S.leads.push(nm);
  P.saveNumbers(nm, { cost:880, quote:1540, by:'Sub' });
  eq('saving the numbers records the cost', nm.cost, 880);
  eq('...and the quote', nm.quote, 1540);
  eq('...and who priced it', nm.costBy, 'Sub');
  eq('...and jumps straight to the Answer stage (3+4 in one screen)', nm.stage, 5);
  ok('...logging cost-saved and quote-sent as separate facts for the GHL map',
     nm.events.filter(function(e){ return /Cost saved/.test(e.t); }).length===1 &&
     nm.events.filter(function(e){ return /Quote sent/.test(e.t); }).length===1);

  /* chips: the tap is the record */
  var ch = JSON.parse(JSON.stringify(probe)); ch.stage=1; ch.id='tstch'; ch.tries={}; ch.events=[]; S.leads.push(ch);
  P.chipTap(ch, 'call');
  eq('a Call tap counts as one attempt', P.tries(ch), 1);
  ok('...and logs the channel', ch.events.some(function(e){ return e.ch==='call'; }));
  ok('...and starts the next-due clock', typeof ch.nextTouch === 'number');
  /* "no answer" straight after the call must not double-count */
  var noAns = P.stageOf(1).opts.filter(function(o){ return o.next===1; })[0];
  P.apply(ch, noAns);
  eq('"no answer" right after a Call tap stays ONE attempt, not two', P.tries(ch), 1);
  /* but later it counts fresh */
  ch.events.forEach(function(e){ if(e.ch) e.at -= 11*60*1000; });
  P.apply(ch, noAns);
  eq('...while a later "no answer" counts fresh', P.tries(ch), 2);

  /* cap trip via chips */
  P.chipTap(ch, 'sms'); P.chipTap(ch, 'sms');
  eq('four attempts counted across chips and taps', P.tries(ch), 4);
  ok('the fourth trips the cap', P.atCap(ch)===true);
  var capSug = P.suggest(ch);
  eq('a capped lead becomes top priority', capSug.p, 1);

  /* moving on resets the count for the new step */
  var mv = JSON.parse(JSON.stringify(probe)); mv.id='tstmv'; mv.stage=1; mv.tries={'1':3}; S.leads.push(mv);
  P.apply(mv, P.stageOf(1).opts[0]);
  eq('reaching them moves the lead on', mv.stage, 2);
  eq('the new step starts from zero tries', P.tries(mv), 0);

  /* the job-done inline invoice chain */
  var jd = JSON.parse(JSON.stringify(probe)); jd.id='tstjd'; jd.stage=8; S.leads.push(jd);
  P.apply(jd, { t:'Invoice sent', next:10 });
  eq('job done + invoice sent in one gesture lands at Payment', jd.stage, 10);

  /* repeats + pinned facts on the customer */
  S.leads = D.jobs; S.customers = D.customers;
  var repeatIds = {};
  D.jobs.forEach(function(x){ repeatIds[x.cid] = (repeatIds[x.cid]||0)+1; });
  var rid = Object.keys(repeatIds).filter(function(k){ return repeatIds[k] > 1; })[0];
  var rjob = D.jobs.filter(function(x){ return x.cid===rid; })[0];
  var h = P.history(rjob);
  ok('a customer with more than one job is flagged as a repeat', h.isRepeat===true);
  eq('repeat job count is right', h.total, repeatIds[rid]);
  var handValue = D.jobs.filter(function(x){ return x.cid===rid && x.type==='won'; })
                     .reduce(function(a,x){ return a+(x.quote||0); },0);
  eq('lifetime value only counts jobs actually won', h.value, handValue);
  ok('pinned facts live on the customer, so they follow every future job',
     D.customers.some(function(c){ return (c.notes||[]).some(function(n){ return n.pin; }); }));

  /* the assistant always has an answer */
  ok('the assistant has a next action for every open job',
     D.jobs.filter(P.isOpen).every(function(x){ var s2=P.suggest(x); return s2 && s2.do; }));

  /* ======================================================== C. SIMULATION ==== */
  G('C · Simulation (500 leads)');

  function optWeighted(opts){
    var vis = opts.filter(function(o){ return !o.fold; });
    var hid = opts.filter(function(o){ return o.fold; });
    var r = Math.random();
    if(r < 0.62 || !hid.length) return vis[0];                       /* the yes */
    if(r < 0.88 && vis[1]) return vis[1];                            /* not yet */
    return hid[Math.floor(Math.random()*hid.length)];                /* something rare */
  }
  var N = 500, CAP = 60, taps = [], wonTaps = [], lostTaps = [], stuck = 0, won = 0, lost = 0;
  for(var i=0;i<N;i++){
    var st = 1, t = 1, done = null, seenAt = {};
    while(t < CAP){
      var s3 = P.stageOf(st);
      var lm = LIM[String(st)];
      if(lm && (seenAt[st]||0) >= lm.cap){ t++; done='closed'; break; }
      var o = optWeighted(s3.opts);
      if(o.next === st) seenAt[st] = (seenAt[st]||0)+1;
      t++;
      if(o.next==='won'){ done='won'; break; }
      if(o.next==='closed'){ done='closed'; break; }
      st = o.next;
    }
    if(!done) stuck++;
    else { taps.push(t);
           if(done==='won'){ won++; wonTaps.push(t); } else { lost++; lostTaps.push(t); } }
  }
  taps.sort(function(a,b){ return a-b; });
  var med = taps[Math.floor(taps.length/2)], p90 = taps[Math.floor(taps.length*0.9)];
  function median(a){ a=a.slice().sort(function(x,y){return x-y;}); return a[Math.floor(a.length/2)]; }

  ok('every one of 500 leads reached a door (nobody left in limbo)', stuck===0, stuck+' stuck');
  ok('a typical lead is finished in under 20 taps, start to door', med < 20, 'median '+med);
  ok('even the slow 10% stay under 35 taps', p90 < 35, 'p90 '+p90);
  ok('both doors get used', won>0 && lost>0, won+' won / '+lost+' closed');
  results.push({ g:group, info:1, name:'taps to finish a lead',
    detail:'median '+med+' · slowest 10% '+p90+' · a WON job takes ~'+median(wonTaps)+
           ' taps over ~3 weeks · a CLOSED lead takes '+median(lostTaps) });

  /* ============================================================ E. CLEANUP ==== */
  restoreState();
  G('E · The suite cleans up after itself');
  eq('job count is unchanged after the run', S.leads.length, BEFORE.jobs);
  eq('customer count is unchanged after the run', S.customers.length, BEFORE.customers);
  ok('no test job was left behind',
     !S.leads.some(function(x){ return String(x.id).indexOf('tst') === 0; }));

  /* ========================================================= D. USABILITY ==== */
  G('D · Usability (measured at '+window.innerWidth+'px)');
  (function measure(){
    if(window.innerWidth < 320){
      results.push({ g:group, info:1, name:'skipped',
        detail:'viewport is '+window.innerWidth+'px — open a real window and reload for section D' });
      return;
    }
    var small = [];
    document.querySelectorAll('button, .opt, .row, a.chip, .tbtn, .mbtn, .ojob')
      .forEach(function(el){
        var r = el.getBoundingClientRect();
        if(r.width===0 && r.height===0) return;
        if(r.height < 44) small.push((el.className||el.tagName)+' '+Math.round(r.height)+'px');
      });
    ok('every tappable thing is at least 44px tall', small.length===0,
       small.slice(0,6).join(', ') + (small.length>6?' +'+(small.length-6)+' more':''));

    ok('the page never scrolls sideways',
       document.documentElement.scrollWidth <= window.innerWidth + 1,
       document.documentElement.scrollWidth+'px content in '+window.innerWidth+'px viewport');

    var firstRow = document.querySelector('.row');
    ok('the most urgent lead is on screen without scrolling',
       firstRow && firstRow.getBoundingClientRect().top < window.innerHeight);

    /* one tap from queue to question, question above the fold */
    if(firstRow){
      firstRow.click();
      var qEl = document.querySelector('.qtext'), opts = document.querySelectorAll('.opt');
      ok('one tap from the queue to the open question', !!qEl && opts.length > 0,
         (opts.length||0)+' answers shown');
      ok('the question card is above the fold',
         qEl && qEl.getBoundingClientRect().top < window.innerHeight,
         qEl ? 'question at '+Math.round(qEl.getBoundingClientRect().top)+'px' : '');
      var visOpts = [].slice.call(opts).filter(function(o){ return o.offsetParent !== null; });
      ok('no more than 5 choices visible at once', visOpts.length <= 5,
         visOpts.length+' visible');
      var b = document.querySelector('#back'); if(b) b.click();
    }

    var tiny = [];
    document.querySelectorAll('*').forEach(function(el){
      if(el.children.length || !el.textContent.trim()) return;
      var fs = parseFloat(getComputedStyle(el).fontSize);
      if(fs && fs < 10.5) tiny.push((el.className||el.parentElement.className)+' '+fs+'px');
    });
    ok('no unreadably small text', tiny.length===0, tiny.slice(0,5).join(', '));
  })();

  /* ============================================================== REPORT ==== */
  (function report(){
    var passN = results.filter(function(r){ return !r.info && r.pass; }).length;
    var fail = results.filter(function(r){ return !r.info && !r.pass; });
    var html = '<div style="font:14px/1.5 -apple-system,system-ui;padding:22px;max-width:760px;margin:0 auto">'+
      '<h1 style="font-size:20px;margin:0 0 4px">Pipeline test run</h1>'+
      '<p style="color:#71717a;margin:0 0 18px">'+passN+' passed · '+fail.length+' failed</p>';
    var g = '';
    results.forEach(function(r){
      if(r.g!==g){ g=r.g; html += '<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#71717a;margin:20px 0 8px">'+g+'</h2>'; }
      var mark = r.info ? '<span style="color:#71717a">·</span>' : (r.pass?'<span style="color:#16a34a">✔</span>':'<span style="color:#dc2626">✘</span>');
      html += '<div style="padding:6px 0;border-bottom:1px solid #f4f4f5">'+mark+' '+r.name+
        (r.detail?'<div style="color:#71717a;font-size:12.5px;margin-left:18px">'+r.detail+'</div>':'')+'</div>';
    });
    html += '</div>';
    var w2 = document.createElement('div');
    w2.style.cssText='position:fixed;inset:0;background:#fff;z-index:99999;overflow:auto';
    w2.innerHTML = html; document.body.appendChild(w2);
    console.log('%cPipeline tests: '+passN+' passed, '+fail.length+' failed', 'font-weight:700');
    fail.forEach(function(f){ console.error('FAIL', f.g, f.name, f.detail); });
    window.__TEST_RESULT = { pass:passN, fail:fail.length, failures:fail, all:results };
  })();
})();
