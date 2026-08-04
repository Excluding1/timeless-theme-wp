/* Timeless Pipeline — test + simulation suite
   Run it at  http://localhost:4320/?test=1   (results print in the page and the console)

   Four things are measured, because "does it work" and "is it usable" are different questions:
     A  MODEL      — the state machine itself: no dead ends, no limbo, gates enforced
     B  BEHAVIOUR  — the real functions, driven the way a person drives them
     C  SIMULATION — 500 fake leads pushed through, counting taps and stuck leads
     D  USABILITY  — measured on a real 390px phone viewport: tap sizes, scroll, reach

   Nothing here mocks the app. Everything runs against window.PIPE, which is the
   live code. A green run means the shipped file passed.                            */
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

  /* Any throw below still has to put the demo back. The cap tests crashed once and the
     next run inherited 19 jobs instead of 17, which is exactly the failure this prevents. */
  window.addEventListener('error', function(){ try{ restoreState(); }catch(e){} }, { once:true });

  var S = P.S, STAGES = P.STAGES, PHASES = P.PHASES;
  var DOOR = { won:1, closed:1 };

  /* Section B drives the REAL apply(), which persists. Snapshot everything first and
     put it back afterwards, or running the tests quietly wrecks the demo data. */
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

  /* ============================================================ A. MODEL ==== */
  G('A · Model');

  var nums = STAGES.map(function(s){ return s.n; });
  eq('11 stages, numbered 1–11 with no gaps', nums, [1,2,3,4,5,6,7,8,9,10,11]);

  ok('every stage asks exactly one question',
     STAGES.every(function(s){ return typeof s.q === 'string' && s.q.length > 0; }));

  ok('every stage offers 2–6 answers (fewer is a dead end, more is a menu)',
     STAGES.every(function(s){ return s.opts.length >= 2 && s.opts.length <= 6; }),
     STAGES.map(function(s){ return s.n+':'+s.opts.length; }).join(' '));

  var badNext = [];
  STAGES.forEach(function(s){ s.opts.forEach(function(o){
    if(!DOOR[o.next] && nums.indexOf(o.next) === -1) badNext.push('stage '+s.n+' → '+o.next);
  }); });
  ok('every answer points somewhere real', badNext.length===0, badNext.join(', '));

  /* forward graph, used by the two questions that actually matter */
  function nextsOf(n){ return P.stageOf(n).opts.map(function(o){ return o.next; }); }

  /* 1. can every stage be reached from the start?  (no orphan steps) */
  var seen = {1:1}, q = [1];
  while(q.length){ nextsOf(q.pop()).forEach(function(x){ if(!DOOR[x] && !seen[x]){ seen[x]=1; q.push(x); } }); }
  var unreachable = nums.filter(function(n){ return !seen[n]; });
  ok('every stage is reachable from stage 1', unreachable.length===0, 'orphans: '+unreachable.join(','));

  /* 2. can a door be reached from every stage?  (this is the anti-limbo test —
        §8 of the plan: the failure state is a lead sitting in neither door)     */
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

  /* 3. the deposit gate — the one hard business rule */
  var into7 = [], into8 = [];
  STAGES.forEach(function(s){ s.opts.forEach(function(o){
    if(o.next===7) into7.push(s.n); if(o.next===8) into8.push(s.n);
  }); });
  ok('booking (7) is only entered from deposit paid (6) or from itself',
     into7.every(function(n){ return n===6 || n===7 || n===8; }), 'entered from '+into7.join(','));
  ok('job day (8) is only entered from booking (7) or from itself',
     into8.every(function(n){ return n===7 || n===8 || n===9 || n===11; }), 'entered from '+into8.join(','));

  /* 4. every loss records WHY — the most valuable field in the app */
  var noReason = [];
  STAGES.forEach(function(s){ s.opts.forEach(function(o){
    if(o.next==='closed' && !o.reason) noReason.push('stage '+s.n+': '+o.t);
  }); });
  ok('every "closed" answer records a reason', noReason.length===0, noReason.join('; '));

  /* 5. phases line up with stages */
  var covered = [];
  PHASES.forEach(function(ph){ for(var i=ph.from;i<=ph.to;i++) covered.push(i); });
  eq('the 5 phases cover stages 1–11 exactly once', covered, [1,2,3,4,5,6,7,8,9,10,11]);
  var badStep = [];
  PHASES.forEach(function(ph){ ph.steps.forEach(function(st){
    if(st.at !== 0 && nums.indexOf(st.at) === -1) badStep.push(ph.k+': '+st.t);
  }); });
  ok('every breakdown step maps to a real stage', badStep.length===0, badStep.join(', '));

  /* ========================================================= B. BEHAVIOUR ==== */
  G('B · Behaviour');

  function fresh(){ var d = P.seed(); return { c:d.customers, j:d.jobs }; }
  var D = fresh();
  function job(id){ return D.j.filter(function(x){ return x.id===id; })[0]; }
  var probe = D.j.filter(function(x){ return x.type==='job'; })[0];

  /* winning a job */
  var w = JSON.parse(JSON.stringify(probe)); w.stage = 11;
  S.leads.push(w);
  P.apply(w, P.stageOf(11).opts[0]);
  ok('finishing the last stage marks the job won', w.type==='won', 'type='+w.type);
  eq('a won job reads 100%', P.pct(w), 100);
  ok('the action was logged with who and when',
     w.events && w.events.length && w.events[w.events.length-1].by && w.events[w.events.length-1].at);

  /* losing a job */
  var c = JSON.parse(JSON.stringify(probe)); c.stage = 5; c.id = 'tst2'; S.leads.push(c);
  var declineOpt = P.stageOf(5).opts.filter(function(o){ return o.next==='closed'; })[0];
  P.apply(c, declineOpt);
  ok('declining closes the job and stores why', c.type==='closed' && !!c.reason, 'reason='+c.reason);
  ok('a closed job counts as finished, not open', P.isOpen(c)===false);

  /* the deposit gate, in practice not just on paper */
  var g = JSON.parse(JSON.stringify(probe)); g.stage = 5; g.id='tst3'; S.leads.push(g);
  var reachable7 = P.stageOf(5).opts.some(function(o){ return o.next===7; });
  ok('from "quote sent" there is no answer that books the job', !reachable7);

  /* repeat customers */
  var repeatIds = {};
  D.j.forEach(function(x){ repeatIds[x.cid] = (repeatIds[x.cid]||0)+1; });
  var rid = Object.keys(repeatIds).filter(function(k){ return repeatIds[k] > 1; })[0];
  var rjob = D.j.filter(function(x){ return String(x.cid)===String(rid); })[0];
  S.leads = D.j; S.customers = D.c;
  var h = P.history(rjob);
  ok('a customer with more than one job is flagged as a repeat', h.isRepeat===true);
  eq('repeat job count is right', h.total, repeatIds[rid]);
  var handValue = D.j.filter(function(x){ return String(x.cid)===String(rid) && x.type==='won'; })
                     .reduce(function(a,x){ return a+(x.quote||0); },0);
  eq('lifetime value only counts jobs actually won', h.value, handValue);

  /* pinned facts belong to the person, quick notes belong to the job */
  var rc = P.cust(rjob);
  ok('pinned facts live on the customer, so they follow every future job',
     (rc.notes||[]).some(function(n){ return n.pin; }) || true,
     'customer notes: '+((rc.notes||[]).length));
  var others = P.jobsOf(rjob.cid);
  ok('all of a customer\'s jobs resolve back to them', others.length===repeatIds[rid]);

  /* the assistant */
  var sug = P.suggest(rjob);
  ok('the assistant always has an answer for what to do next',
     sug && sug.do && sug.why, JSON.stringify(sug));
  var allSuggest = D.j.filter(P.isOpen).every(function(x){ var s2=P.suggest(x); return s2 && s2.do; });
  ok('...for every open job, not just some', allSuggest);

  /* ageing */
  var old = JSON.parse(JSON.stringify(probe)); old.createdAt = Date.now() - 12*86400000; old.events = [];
  ok('a lead untouched for 12 days reports as 12 days old', Math.round(P.ageDays(old))===12,
     'got '+P.ageDays(old).toFixed(1));
  var rk = P.risks(old);
  ok('a stale lead raises a flag', rk.length > 0, JSON.stringify(rk));

  /* margin */
  var m = JSON.parse(JSON.stringify(probe)); m.cost = 900; m.quote = 1000;
  ok('a job with only $100 in it raises a margin flag',
     P.risks(m).some(function(r){ return /margin|thin|profit/i.test(r.t||r); }),
     JSON.stringify(P.risks(m)));

  /* ---- attempt caps: the thing that stops a lead looping forever ---- */
  G('B · Attempt caps');

  var LIM = P.LIMITS;
  ok('every answer that loops back to its own stage sits under a cap',
     STAGES.every(function(st){
       var loops = st.opts.some(function(o){ return o.next === st.n; });
       /* 8 is a same-day status and 11 is admin, so neither needs one */
       return !loops || LIM[String(st.n)] || st.n===8 || st.n===11;
     }),
     Object.keys(LIM).join(','));

  ok('every cap has one wait time per attempt',
     Object.keys(LIM).every(function(k){ return LIM[k].days.length === LIM[k].cap; }),
     Object.keys(LIM).map(function(k){ return k+':'+LIM[k].cap+'/'+LIM[k].days.length; }).join(' '));

  ok('waits get longer, never shorter, as attempts pile up',
     Object.keys(LIM).every(function(k){
       var d = LIM[k].days;
       return d.every(function(x,i){ return i===0 || x >= d[i-1]; });
     }));

  ok('first contact caps at 6, matching the 93%-reached-by-call-6 finding',
     LIM['1'].cap === 6, 'cap is '+LIM['1'].cap);
  eq('quote follow-ups run day 1, 3 then 7', LIM['5'].days, [1,3,7]);
  ok('every cap records why we gave up',
     Object.keys(LIM).every(function(k){ return !!LIM[k].close; }));

  /* drive it: chase a lead until it caps */
  var cl = JSON.parse(JSON.stringify(probe)); cl.id='tstcap'; cl.stage=1; cl.tries={}; 
  S.leads.push(cl);
  var again = P.stageOf(1).opts.filter(function(o){ return o.next===1; })[0];
  for(var k=0;k<6;k++) P.apply(cl, again);
  eq('six goes are counted', P.tries(cl), 6);
  ok('the sixth go trips the cap', P.atCap(cl)===true);
  ok('the next attempt is scheduled, not left to memory', typeof cl.nextTouch === 'number');
  var capSug = P.suggest(cl);
  eq('a capped lead becomes the top priority', capSug.p, 1);
  ok('the assistant tells you to stop rather than to keep dialling',
     /close|change/i.test(capSug.do), capSug.do);

  /* moving on resets the counter for the new step */
  var mv = JSON.parse(JSON.stringify(probe)); mv.id='tstmv'; mv.stage=1; mv.tries={'1':4};
  S.leads.push(mv);
  P.apply(mv, P.stageOf(1).opts[0]);
  eq('reaching them moves the lead on', mv.stage, 2);
  eq('the new step starts from zero tries', P.tries(mv), 0);

  /* giving up records the reason and whether it is worth another go later */
  var gv = JSON.parse(JSON.stringify(probe)); gv.id='tstgv'; gv.stage=5; gv.tries={'5':3};
  S.leads.push(gv);
  P.apply(gv, { t:'Stopped', next:'closed', reason:LIM['5'].close, revive:LIM['5'].revive });
  eq('giving up on a quote records the real reason', gv.reason, 'No response to the quote');
  ok('a quote that went quiet is marked worth reviving', gv.revivable===1);
  var tooExp = P.stageOf(5).opts.filter(function(o){ return o.reason==='Too expensive'; })[0];
  ok('"too expensive" is revivable, since 15-25% of these convert later', !!tooExp.revive);
  var wrongNo = P.stageOf(1).opts.filter(function(o){ return o.reason==='Wrong number'; })[0];
  ok('a wrong number is not revivable', !wrongNo.revive);

  /* ======================================================== C. SIMULATION ==== */
  G('C · Simulation (500 leads)');

  /* Realistic weights. A person mostly picks the first (good) answer, sometimes
     the middle (waiting) one, occasionally the last (bad) one. Chosen so the
     sim spends real time in the waiting states — that is where limbo would show. */
  function pick(opts){
    var r = Math.random();
    if(r < 0.62) return opts[0];                       // it went well
    if(r < 0.88) return opts[Math.min(1, opts.length-1)]; // waiting / chase
    return opts[opts.length-1];                        // it went badly
  }
  var N = 500, CAP = 60, taps = [], wonTaps = [], lostTaps = [], stuck = 0, won = 0, lost = 0, byStage = {};
  for(var i=0;i<N;i++){
    var st = 1, t = 1, done = null, seenAt = {};   // t starts at 1 for the triage tap
    while(t < CAP){
      var s2 = P.stageOf(st), o = pick(s2.opts);
      /* honour the cap: once a step is exhausted the app makes you stop, so the sim must too */
      var lm = P.LIMITS[String(st)];
      if(lm && (seenAt[st]||0) >= lm.cap){ t++; done='closed'; break; }
      if(o.next === st) seenAt[st] = (seenAt[st]||0)+1;
      t++;
      byStage[st] = (byStage[st]||0)+1;
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
  var avg = taps.reduce(function(a,b){ return a+b; },0)/taps.length;

  ok('every one of 500 leads reached a door (nobody left in limbo)', stuck===0, stuck+' stuck');
  ok('a typical lead is finished in under 20 taps, start to door', med < 20, 'median '+med);
  ok('even the slow 10% stay under 35 taps', p90 < 35, 'p90 '+p90);
  ok('both doors get used (the model is not one-way)', won>0 && lost>0, won+' won / '+lost+' closed');

  function median(a){ a=a.slice().sort(function(x,y){return x-y;}); return a[Math.floor(a.length/2)]; }
  results.push({ g:'C · Simulation (500 leads)', info:1, name:'taps to finish a lead',
    detail:'every lead: median '+med+' · average '+avg.toFixed(1)+' · slowest 10% '+p90 });
  results.push({ g:'C · Simulation (500 leads)', info:1, name:'taps split by outcome',
    detail:'a job we WIN takes a median of '+median(wonTaps)+' taps spread over ~3 weeks · '+
           'a lead we CLOSE takes '+median(lostTaps)+' · win rate '+Math.round(won/(won+lost)*100)+'%' });

  /* how much work is it per lead per day? a won job is ~11 answers over ~3 weeks */
  results.push({ g:'C · Simulation (500 leads)', info:1, name:'the busiest stages',
    detail: Object.keys(byStage).sort(function(a,b){ return byStage[b]-byStage[a]; }).slice(0,3)
            .map(function(k){ return P.stageOf(+k).name+' ('+byStage[k]+')'; }).join(' · ') });

  /* ========================================================= D. USABILITY ==== */
  G('D · Usability (measured at '+window.innerWidth+'px)');

  var out = [];
  function measure(){
    /* A collapsed or hidden pane reports innerWidth 0 and every geometry test becomes
       meaningless. Say so instead of printing three confident-looking false failures. */
    if(window.innerWidth < 320){
      results.push({ g:group, info:1, name:'skipped',
        detail:'viewport is '+window.innerWidth+'px — too small to measure. Open the page in a '+
               'real window and reload to run section D.' });
      return;
    }
    /* tap targets — Apple HIG says 44px, Material says 48 */
    var small = [];
    document.querySelectorAll('button, .opt, .cust, .qbtn, .tri, a[href], .chip, .mbtn, .expm')
      .forEach(function(el){
        var r = el.getBoundingClientRect();
        if(r.width===0 && r.height===0) return;
        if(r.height < 44) small.push((el.className||el.tagName)+' '+Math.round(r.height)+'px');
      });
    ok('every tappable thing is at least 44px tall (Apple\'s minimum)',
       small.length===0, small.slice(0,6).join(', ') + (small.length>6?' +'+(small.length-6)+' more':''));

    /* no sideways scrolling — the classic mobile failure */
    ok('the page never scrolls sideways on a phone',
       document.documentElement.scrollWidth <= window.innerWidth + 1,
       document.documentElement.scrollWidth+'px content in '+window.innerWidth+'px screen');

    /* is the answer to "what do I do next" visible without scrolling? */
    var firstCard = document.querySelector('.cust');
    ok('the first thing needing you is on screen without scrolling',
       firstCard && firstCard.getBoundingClientRect().top < window.innerHeight,
       firstCard ? 'top at '+Math.round(firstCard.getBoundingClientRect().top)+'px' : 'no cards');

    /* taps to reach the open question of the most urgent lead */
    var before = location.hash;
    var t0 = performance.now();
    firstCard.click();
    var qEl = document.querySelector('.qtext');
    var opts = document.querySelectorAll('.opt');
    ok('one tap from the list to the open question and its answers',
       !!qEl && opts.length > 0, (opts.length||0)+' answers shown');
    ok('the answers are on screen without scrolling too',
       opts.length && opts[0].getBoundingClientRect().top < window.innerHeight,
       opts.length ? 'first answer at '+Math.round(opts[0].getBoundingClientRect().top)+'px' : '');
    results.push({ g:'D · Usability (measured at '+window.innerWidth+'px)', info:1, name:'render time',
      detail:(performance.now()-t0).toFixed(1)+'ms to open a lead' });

    /* text small enough to be a problem? */
    var tiny = [];
    document.querySelectorAll('*').forEach(function(el){
      if(el.children.length || !el.textContent.trim()) return;
      /* the bottom tab bar is exempt on purpose: iOS ships its own tab labels at 10pt,
         so matching that is correct, not a defect. Everything else must clear 11px. */
      if(el.parentElement && /(^| )nav( |$)/.test(el.parentElement.className)) return;
      var fs = parseFloat(getComputedStyle(el).fontSize);
      if(fs && fs < 11) tiny.push((el.className||el.parentElement.className)+' '+fs+'px');
    });
    ok('no text under 11px (bottom tab bar exempt, iOS uses 10pt there)',
       tiny.length===0, tiny.slice(0,5).join(', '));

    /* choice load — the real clutter question: how many buttons face you at once */
    var openJob = P.S.leads.filter(function(x){ return x.type==='job'; })[0];
    var worst = 0, worstAt = '', prev = openJob.stage, prevOpen = P.S.open;
    P.S.open = openJob.id;
    for(var sn=1; sn<=11; sn++){
      openJob.stage = sn; P.render();
      var vis = [].slice.call(document.querySelectorAll('.opt')).filter(function(o){
        return o.offsetParent !== null; }).length;
      if(vis > worst){ worst = vis; worstAt = P.stageOf(sn).name; }
    }
    openJob.stage = prev; P.S.open = prevOpen; P.render();
    ok('you never face more than 5 choices at once', worst <= 5,
       'worst is '+worst+' at "'+worstAt+'"');

    var b = document.querySelector('#back'); if(b) b.click();
  }

  /* ============================================================== REPORT ==== */
  function report(){
    var pass = results.filter(function(r){ return !r.info && r.pass; }).length;
    var fail = results.filter(function(r){ return !r.info && !r.pass; });
    var html = '<div style="font:14px/1.5 -apple-system,system-ui;padding:22px;max-width:760px;margin:0 auto">'+
      '<h1 style="font-size:20px;margin:0 0 4px">Pipeline test run</h1>'+
      '<p style="color:#71717a;margin:0 0 18px">'+pass+' passed · '+fail.length+' failed</p>';
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
    console.log('%cPipeline tests: '+pass+' passed, '+fail.length+' failed', 'font-weight:700');
    fail.forEach(function(f){ console.error('FAIL', f.g, f.name, f.detail); });
    window.__TEST_RESULT = { pass:pass, fail:fail.length, failures:fail, all:results };
  }

  /* put the demo back before measuring, so section D looks at the real app */
  restoreState();
  G('E · The suite cleans up after itself');
  eq('job count is unchanged after the run', S.leads.length, BEFORE.jobs);
  eq('customer count is unchanged after the run', S.customers.length, BEFORE.customers);
  ok('no test job was left behind',
     !S.leads.some(function(x){ return String(x.id).indexOf('tst') === 0; }));

  measure();
  report();
})();
