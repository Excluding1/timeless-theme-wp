import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 8788;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  let ext = path.extname(filePath);
  let contentType = MIME[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Preview at http://localhost:${PORT}`));
