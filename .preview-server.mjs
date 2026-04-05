import http from 'http';
import https from 'https';
import zlib from 'zlib';

const PORT = 8787;
const TARGET = 'https://timelessresurfacing.com.au';

const server = http.createServer((req, res) => {
  const url = new URL(req.url, TARGET);

  const reqHeaders = {
    host: 'timelessresurfacing.com.au',
    'accept-encoding': 'gzip, deflate',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'accept-language': 'en-AU,en;q=0.9',
  };

  https.get(url.toString(), { headers: reqHeaders }, (proxyRes) => {
    const contentType = proxyRes.headers['content-type'] || '';
    const encoding = proxyRes.headers['content-encoding'] || '';
    let body = [];

    // Decompress if needed
    let stream = proxyRes;
    if (encoding === 'gzip') {
      stream = proxyRes.pipe(zlib.createGunzip());
    } else if (encoding === 'deflate') {
      stream = proxyRes.pipe(zlib.createInflate());
    } else if (encoding === 'br') {
      stream = proxyRes.pipe(zlib.createBrotliDecompress());
    }

    stream.on('data', chunk => body.push(chunk));
    stream.on('end', () => {
      let data = Buffer.concat(body);

      // For HTML, rewrite absolute URLs to point to our local proxy
      // but keep CDN/external resources pointing to their origins
      if (contentType.includes('text/html')) {
        let html = data.toString('utf-8');
        html = html.replace(/https:\/\/timelessresurfacing\.com\.au/g, `http://localhost:${PORT}`);
        data = Buffer.from(html, 'utf-8');
      }

      const headers = { ...proxyRes.headers };
      delete headers['content-length'];
      delete headers['content-encoding'];
      delete headers['transfer-encoding'];
      res.writeHead(proxyRes.statusCode, headers);
      res.end(data);
    });

    stream.on('error', (err) => {
      res.writeHead(502);
      res.end('Decompression error: ' + err.message);
    });
  }).on('error', (err) => {
    res.writeHead(502);
    res.end('Proxy error: ' + err.message);
  });
});

server.listen(PORT, () => {
  console.log(`Preview proxy running on http://localhost:${PORT}`);
});
