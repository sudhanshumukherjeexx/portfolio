// Minimal static server that behaves like GitHub Pages: directory indexes,
// /404.html for misses, and no server-side redirects.
//
//   npm run serve            -> http://localhost:4173
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
};

async function resolve(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath)).replace(/^[/\\]+/, '');
  const file = path.join(ROOT, clean);
  if (!file.startsWith(ROOT) || /(^|[/\\])(node_modules|src|scripts|\.git)([/\\]|$)/.test(clean)) return null;
  try {
    const s = await stat(file);
    if (s.isDirectory()) {
      if (!urlPath.endsWith('/')) return { redirect: `${urlPath}/` };
      return { file: path.join(file, 'index.html') };
    }
    return { file };
  } catch {
    return null;
  }
}

export function startServer(port = PORT) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const hit = await resolve(url.pathname);
    if (hit?.redirect) {
      res.writeHead(301, { Location: hit.redirect + url.search });
      return res.end();
    }
    try {
      if (!hit) throw new Error('miss');
      const body = await readFile(hit.file);
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(hit.file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      const body = await readFile(path.join(ROOT, '404.html'));
      res.writeHead(404, { 'Content-Type': TYPES['.html'] });
      res.end(body);
    }
  });
  return new Promise((ok) => server.listen(port, () => ok(server)));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await startServer();
  console.log(`Serving ${ROOT} at http://localhost:${PORT}`);
}
