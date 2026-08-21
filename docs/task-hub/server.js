/**
 * Task Hub — static server.
 *
 * Restored 2026-08-22. `Task Hub.command` launches `node server.js` from this
 * directory on port 4334; that file had gone missing from disk and was never
 * committed, so the launcher started nothing and the browser opened onto a
 * connection error.
 *
 * index.html keeps all task/note/habit state in localStorage, so serving the
 * directory is enough to make the app work again. The reminder/notification
 * layer that wrote reminders.json is NOT restored here — see NOTES below.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 4334;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

http
  .createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    const rel = url === '/' ? 'index.html' : url.replace(/^\/+/, '');

    // Resolve inside ROOT only. Without this, a path such as /../../.ssh/id_rsa
    // would escape the directory and serve arbitrary files off the disk.
    const file = path.resolve(ROOT, rel);
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('Forbidden');
    }

    fs.readFile(file, (err, buf) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not found');
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      res.end(buf);
    });
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`Task Hub on http://127.0.0.1:${PORT}`);
  });

/*
 * NOTES — what is still missing
 * -----------------------------
 * reminders.json (last written 2026-08-04) holds `fired` and `snapshot` keys,
 * so the lost server.js also ran a reminder loop that fired real Mac
 * notifications via osascript and drove the Claude-CLI assistant. index.html
 * makes no fetch() calls, so that layer was a background process rather than a
 * UI feature, and nothing in the repo records its logic. It needs rebuilding
 * from scratch rather than guessing. Ask Allan before rebuilding it.
 */
