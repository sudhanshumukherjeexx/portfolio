// Static site generator. Renders src/ into plain HTML at the repository root,
// which GitHub Pages serves directly from the main branch.
//
//   npm run build
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from '../src/data/site.mjs';
import { layout } from '../src/components/layout.mjs';
import { homePage } from '../src/pages/home.mjs';
import { workPage } from '../src/pages/work.mjs';
import { caseStudyPages } from '../src/pages/case-study.mjs';
import { aboutPage } from '../src/pages/about.mjs';
import { writingPage } from '../src/pages/writing.mjs';
import { notFoundPage, redirects, redirectHtml } from '../src/pages/misc.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (rel) => path.join(ROOT, rel);

async function write(rel, content) {
  await mkdir(path.dirname(out(rel)), { recursive: true });
  await writeFile(out(rel), content);
}

const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10);

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>])\s*/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\(\s+/g, '(')
    .trim();
}

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -19 134 134" shape-rendering="crispEdges">
<g fill="#8fb8d8"><rect x="15" y="0" width="100" height="70"/><rect x="1" y="23" width="15" height="27"/><rect x="114" y="23" width="15" height="27"/>
<rect x="15" y="68" width="10" height="27"/><rect x="35" y="68" width="10" height="27"/><rect x="85" y="68" width="10" height="27"/><rect x="105" y="68" width="10" height="27"/></g>
<rect x="25" y="24" width="10" height="12" fill="#1e2a33"/><rect x="95" y="24" width="10" height="12" fill="#1e2a33"/>
</svg>
`;

async function main() {
  const cssSource = await readFile(out('src/styles/site.css'), 'utf8');
  const css = minifyCss(cssSource);
  // Normalize line endings so the cache-busting hash is the same on every OS.
  const js = (await readFile(out('src/scripts/site.js'), 'utf8')).replace(/\r\n/g, '\n');
  const assets = {
    css: `/assets/css/site.css?v=${hash(css)}`,
    js: `/assets/js/site.js?v=${hash(js)}`,
  };
  await write('assets/css/site.css', css);
  await write('assets/js/site.js', js);

  const pages = [homePage(), workPage(), ...caseStudyPages(), aboutPage(), writingPage(), notFoundPage()];
  for (const page of pages) {
    await write(page.out, layout({ ...page, assets }));
  }
  for (const r of redirects) await write(r.out, redirectHtml(r.to));

  const today = new Date().toISOString().slice(0, 10);
  const indexed = pages.filter((p) => !p.noindex);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexed.map((p) => `  <url><loc>${site.origin}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
  await write('sitemap.xml', sitemap);
  await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
  await write('favicon.svg', FAVICON);
  await write('.nojekyll', '');

  console.log(`Built ${pages.length} pages and ${redirects.length} redirects.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
