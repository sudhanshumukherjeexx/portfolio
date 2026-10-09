// Static checks on the built site:
//  - every internal href/src resolves to a file, and every #anchor exists
//  - every page has a title, description, canonical (unless noindex) and one <h1>
//  - every <img> has an alt attribute
//  - no placeholder links (href="#" or empty)
// With --external, also requests every external link once.
//
//   npm run check [-- --external]
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['node_modules', 'src', 'scripts', '.git']);
const errors = [];
const external = new Map();

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const exists = async (p) => stat(p).then(() => true, () => false);

async function targetFile(urlPath) {
  const file = path.join(ROOT, decodeURIComponent(urlPath));
  if (urlPath.endsWith('/')) return path.join(file, 'index.html');
  return file;
}

const ids = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

const files = await htmlFiles(ROOT);
const cache = new Map();
const read = async (f) => {
  if (!cache.has(f)) cache.set(f, await readFile(f, 'utf8'));
  return cache.get(f);
};

for (const file of files) {
  const rel = path.relative(ROOT, file).replaceAll('\\', '/');
  const html = await read(file);
  const isRedirect = html.includes('http-equiv="refresh"');

  if (!isRedirect) {
    if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${rel}: missing <title>`);
    if (!/<meta name="description" content="[^"]{20,}">/.test(html)) errors.push(`${rel}: missing meta description`);
    const noindex = html.includes('content="noindex"');
    if (!noindex && !html.includes('rel="canonical"')) errors.push(`${rel}: missing canonical`);
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) errors.push(`${rel}: expected one <h1>, found ${h1s}`);
    for (const img of html.match(/<img\b[^>]*>/g) || []) {
      if (!/\salt="/.test(img)) errors.push(`${rel}: <img> without alt: ${img.slice(0, 80)}`);
    }
  }

  const pageIds = ids(html);
  for (const m of html.matchAll(/\s(href|src|srcset)="([^"]*)"/g)) {
    const values = m[1] === 'srcset' ? m[2].split(',').map((s) => s.trim().split(/\s+/)[0]) : [m[2]];
    for (const raw of values) {
      if (raw === '' || raw === '#') {
        errors.push(`${rel}: empty or placeholder link`);
        continue;
      }
      if (/^(mailto:|tel:|data:)/.test(raw)) continue;
      if (/^https?:/.test(raw)) {
        if (!raw.startsWith('https://www.sudhanshumukherjee.com')) external.set(raw, rel);
        continue;
      }
      const [pathPart, hash] = raw.split('#');
      if (!pathPart) {
        if (hash && !pageIds.has(hash)) errors.push(`${rel}: missing anchor #${hash}`);
        continue;
      }
      const clean = pathPart.split('?')[0];
      const resolved = clean.startsWith('/') ? clean : '/' + path.posix.join(path.posix.dirname(rel), clean);
      const target = await targetFile(resolved);
      if (!(await exists(target))) {
        errors.push(`${rel}: broken link ${raw}`);
        continue;
      }
      if (hash && target.endsWith('.html') && !ids(await read(target)).has(hash)) {
        errors.push(`${rel}: missing anchor ${raw}`);
      }
    }
  }
}

if (process.argv.includes('--external')) {
  console.log(`Checking ${external.size} external links…`);
  const results = await Promise.all(
    [...external].map(async ([url, from]) => {
      try {
        const res = await fetch(url, {
          redirect: 'follow',
          headers: { 'user-agent': 'Mozilla/5.0 (link check for sudhanshumukherjee.com)' },
          signal: AbortSignal.timeout(20000),
        });
        // LinkedIn answers bots with 999; treat it as reachable.
        return { url, from, ok: res.ok || res.status === 999, status: res.status };
      } catch (err) {
        return { url, from, ok: false, status: err.name };
      }
    }),
  );
  for (const r of results) if (!r.ok) errors.push(`${r.from}: external link ${r.url} -> ${r.status}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s) in ${files.length} HTML files.`);
  process.exit(1);
}
console.log(`OK: ${files.length} HTML files, internal links and anchors resolve${process.argv.includes('--external') ? `, ${external.size} external links reachable` : ''}.`);
