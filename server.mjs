import http from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('.', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8' };

export async function createAppServer({ rootDir = projectRoot } = {}) {
  const root = await realpath(resolve(rootDir));
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const path = resolve(root, `.${decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)}`);
      if (!path.startsWith(root + sep) || /(?:^|[\\/])\./.test(path.slice(root.length + 1))) { res.writeHead(403); return res.end('Forbidden'); }
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end(); }
      const canonical = await realpath(path);
      if (!canonical.startsWith(root + sep) || /(?:^|[\\/])\./.test(canonical.slice(root.length + 1))) { res.writeHead(403); return res.end('Forbidden'); }
      const data = await readFile(canonical);
      res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'same-origin' });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch { res.writeHead(404); res.end('Not found'); }
  });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = await createAppServer();
  const port = Number(process.env.PORT) || 4173;
  server.on('error', error => { console.error(`Server could not start (${error.code || 'ERROR'}).`); process.exitCode = 1; });
  server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`Fret & Flow ready at http://127.0.0.1:${port}`));
}
