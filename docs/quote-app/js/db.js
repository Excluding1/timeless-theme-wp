/* Timeless Resurfacing — storage layer.
   Works in two modes with the same async API:
     LOCAL (default): everything in this browser's localStorage. Zero setup, works offline.
     CLOUD: Supabase (Postgres) once connected in Settings, so quotes are saved online,
            survive the browser, and sync across devices. Photos travel inside the quote
            JSON as compressed JPEG data URLs (no storage bucket needed).                 */
(function (root) {
  var TQ = root.TQ = root.TQ || {};

  var LS_QUOTES = 'tq_quotes', LS_SETTINGS = 'tq_settings', LS_CONN = 'tq_conn';
  var client = null;   // supabase client
  var mode = 'local';

  function lsGet(k, d) {
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; }
  }
  function lsSet(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  var db = TQ.db = {
    get mode() { return mode; },
    get conn() { return lsGet(LS_CONN, null) || (root.TQ_CONN && root.TQ_CONN.url ? root.TQ_CONN : null); },

    async init() {
      /* pre-wired connection (optional config.js, kept out of git) so a deployed app points
         at Supabase with no key-pasting; a connection saved in this browser still wins */
      var conn = lsGet(LS_CONN, null);
      if (!conn && root.TQ_CONN && root.TQ_CONN.url && root.TQ_CONN.anonKey) { conn = root.TQ_CONN; }
      if (conn && conn.url && conn.anonKey && root.supabase) {
        try {
          client = root.supabase.createClient(conn.url, conn.anonKey);
          var s = await client.auth.getSession();
          if (s.data && s.data.session) { mode = 'cloud'; return { mode: mode, user: s.data.session.user.email }; }
          mode = 'local';
          return { mode: mode, needsSignIn: true };
        } catch (e) {
          mode = 'local';
          return { mode: mode, error: String(e) };
        }
      }
      mode = 'local';
      return { mode: mode };
    },

    saveConn(url, anonKey) {
      lsSet(LS_CONN, { url: url.trim().replace(/\/+$/, ''), anonKey: anonKey.trim() });
    },
    clearConn() { localStorage.removeItem(LS_CONN); client = null; mode = 'local'; },

    async signIn(email, password) {
      var conn = lsGet(LS_CONN, null);
      if (!conn) throw new Error('Enter the Supabase URL and anon key first');
      client = root.supabase.createClient(conn.url, conn.anonKey);
      var r = await client.auth.signInWithPassword({ email: email, password: password });
      if (r.error) throw r.error;
      mode = 'cloud';
      return r.data.user.email;
    },
    async signOut() {
      if (client) await client.auth.signOut();
      mode = 'local';
    },
    async userEmail() {
      if (!client) return null;
      var s = await client.auth.getSession();
      return s.data && s.data.session ? s.data.session.user.email : null;
    },

    /* ---------- quotes ---------- */
    async listQuotes() {
      if (mode === 'cloud') {
        var r = await client.from('quotes').select('id,doc_no,doc_type,customer,status,total,updated_at').order('updated_at', { ascending: false });
        if (r.error) throw r.error;
        return r.data.map(function (row) {
          return { id: row.id, docNo: row.doc_no, docType: row.doc_type, customerName: row.customer,
                   status: row.status, total: Number(row.total), updatedAt: row.updated_at };
        });
      }
      return lsGet(LS_QUOTES, []).map(function (q) {
        return { id: q.id, docNo: q.docNo, docType: q.docType, customerName: (q.customer || {}).name || '',
                 status: q.status, total: TQ.rules.docTotal(q), updatedAt: q.updatedAt };
      }).sort(function (a, b) { return (b.updatedAt || '').localeCompare(a.updatedAt || ''); });
    },

    async getQuote(id) {
      if (mode === 'cloud') {
        var r = await client.from('quotes').select('data').eq('id', id).single();
        if (r.error) throw r.error;
        return r.data.data;
      }
      return lsGet(LS_QUOTES, []).filter(function (q) { return q.id === id; })[0] || null;
    },

    async saveQuote(doc) {
      doc.updatedAt = new Date().toISOString();
      if (!doc.id) doc.id = uuid();
      if (!doc.createdAt) doc.createdAt = doc.updatedAt;
      if (mode === 'cloud') {
        var row = {
          id: doc.id, doc_no: doc.docNo || '', doc_type: doc.docType || 'quote',
          customer: (doc.customer || {}).name || '', status: doc.status || 'draft',
          total: TQ.rules.docTotal(doc), data: doc, updated_at: doc.updatedAt
        };
        var r = await client.from('quotes').upsert(row);
        if (r.error) throw r.error;
        return doc;
      }
      var all = lsGet(LS_QUOTES, []);
      var i = all.findIndex(function (q) { return q.id === doc.id; });
      if (i >= 0) all[i] = doc; else all.push(doc);
      try { lsSet(LS_QUOTES, all); }
      catch (e) { throw new Error('Browser storage is full (photos take space). Connect Supabase in Settings, or remove some photos.'); }
      return doc;
    },

    async deleteQuote(id) {
      if (mode === 'cloud') {
        var r = await client.from('quotes').delete().eq('id', id);
        if (r.error) throw r.error;
        return;
      }
      lsSet(LS_QUOTES, lsGet(LS_QUOTES, []).filter(function (q) { return q.id !== id; }));
    },

    /* ---------- settings ---------- */
    async getSettings() {
      var defaults = TQ.rules.DEFAULT_SETTINGS;
      var s;
      if (mode === 'cloud') {
        var r = await client.from('app_settings').select('data').eq('id', 1).maybeSingle();
        if (r.error) throw r.error;
        s = (r.data && r.data.data) || lsGet(LS_SETTINGS, {});
      } else {
        s = lsGet(LS_SETTINGS, {});
      }
      /* keep unknown keys too (priceBook, optionTemplates, migration flags) */
      var out = Object.assign({}, defaults, s);
      /* one-time upgrade to the 2026-07-05 defaults (7-day validity, TR-2026- numbering) */
      if (!s._v2) {
        if (out.validityDays === 30) out.validityDays = 7;
        if (!out.docPrefix) out.docPrefix = 'TR-2026-';
        if (out.nextDocNo >= 1043 && out.nextDocNo <= 1100) out.nextDocNo = 704;  // pre-v2 test counter
        out._v2 = true;
      }
      /* v3 (Allan, 2026-07-05): numbering is TR-1022 style (no year), GST registration is settled */
      if (!s._v3) {
        if (out.docPrefix === '' || out.docPrefix === 'TR-2026-') out.docPrefix = 'TR-';
        if ((out.nextDocNo >= 704 && out.nextDocNo <= 800) || (out.nextDocNo >= 1043 && out.nextDocNo <= 1100)) out.nextDocNo = 1022;
        out.gstRegistered = true;
        out._v3 = true;
      }
      return out;
    },

    async saveSettings(s) {
      lsSet(LS_SETTINGS, s);   // always keep a local copy
      if (mode === 'cloud') {
        var r = await client.from('app_settings').upsert({ id: 1, data: s, updated_at: new Date().toISOString() });
        if (r.error) throw r.error;
      }
    },

    /* sequential numbering: prefix + zero-padded counter, e.g. TR-2026-0703 -> TR-2026-0704 */
    async nextDocNo() {
      var s = await db.getSettings();
      var n = Number(s.nextDocNo) || 1022;
      s.nextDocNo = n + 1;
      await db.saveSettings(s);
      var num = String(n);
      while (num.length < 4) num = '0' + num;
      return (s.docPrefix || '') + num;
    },

    /* ---------- backup / migration ---------- */
    async exportAll() {
      var quotes;
      if (mode === 'cloud') {
        var r = await client.from('quotes').select('data');
        if (r.error) throw r.error;
        quotes = r.data.map(function (x) { return x.data; });
      } else {
        quotes = lsGet(LS_QUOTES, []);
      }
      return { exportedAt: new Date().toISOString(), settings: await db.getSettings(), quotes: quotes };
    },

    async importAll(payload) {
      var quotes = (payload && payload.quotes) || [];
      for (var i = 0; i < quotes.length; i++) await db.saveQuote(quotes[i]);
      if (payload && payload.settings) await db.saveSettings(payload.settings);
      return quotes.length;
    },

    async migrateLocalToCloud() {
      if (mode !== 'cloud') throw new Error('Sign in to Supabase first');
      var local = lsGet(LS_QUOTES, []);
      for (var i = 0; i < local.length; i++) await db.saveQuote(local[i]);
      /* one-way move: clear the local copies so a second click can never
         overwrite newer cloud edits with these stale versions */
      localStorage.removeItem(LS_QUOTES);
      var s = lsGet(LS_SETTINGS, null);
      if (s) {
        var existing = await client.from('app_settings').select('id').eq('id', 1).maybeSingle();
        if (!existing.data) await db.saveSettings(s);   // never clobber cloud settings that already exist
      }
      return local.length;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
