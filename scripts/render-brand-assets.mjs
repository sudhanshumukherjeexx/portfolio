// Renders the Open Graph image and PNG icons from the site's own fonts and
// mascot. Run after `npm run build` (it needs favicon.svg and the fonts):
//
//   node scripts/render-brand-assets.mjs
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bitSvg } from '../src/components/bit.mjs';
import { startServer } from './serve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 4190;
const css = await readFile(path.join(ROOT, 'assets/css/site.css'), 'utf8');
const favicon = await readFile(path.join(ROOT, 'favicon.svg'), 'utf8');

const og = `<!doctype html><html><head><meta charset="utf-8"><style>${css}
  body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: #faf9f6; }
  .og { position: relative; display: grid; grid-template-columns: 1fr 380px; align-items: center; height: 100%; padding: 0 80px; }
  .og h1 { font-size: 76px; line-height: 1.02; letter-spacing: -0.04em; font-weight: 800; }
  .og p { margin-top: 26px; font-size: 26px; color: #5c635f; max-width: 30ch; line-height: 1.45; }
  .og .eyebrow { display: block; max-width: none; font-size: 18px; margin-bottom: 26px; white-space: nowrap; }
  .og-art { position: relative; width: 380px; height: 380px; }
  .og-art .sun { position: absolute; inset: 20px; border-radius: 50%; background: #f2dce2; }
  .og-art .m { position: absolute; left: 50%; bottom: 40px; width: 230px; translate: -50% 0; }
  .og-url { position: absolute; left: 80px; bottom: 44px; font-family: var(--font-mono); font-size: 18px; color: #5c635f; }
</style></head><body>
<div class="og">
  <div>
    <p class="eyebrow">Data scientist · AI/ML engineer</p>
    <h1>Sudhanshu<br>Mukherjee</h1>
    <p>Language models, developer tools and data products, built with care.</p>
  </div>
  <div class="og-art"><div class="sun"></div><div class="m">${bitSvg()}</div></div>
  <span class="og-url">sudhanshumukherjee.com</span>
</div></body></html>`;

const icon = (size, pad) => `<!doctype html><html><body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;background:${pad ? '#f2dce2' : 'transparent'}">
<div style="width:${pad ? size * 0.74 : size}px">${favicon}</div></body></html>`;

const server = await startServer(PORT);
const browser = await chromium.launch({ channel: 'msedge' });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(`http://localhost:${PORT}/404.html`); // same origin, so the fonts resolve
  await page.setContent(og, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(ROOT, 'assets/img/og.png') });

  for (const [file, size, pad] of [['favicon-32.png', 32, false], ['apple-touch-icon.png', 180, true]]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(icon(size, pad));
    await page.screenshot({ path: path.join(ROOT, file), omitBackground: !pad });
  }
  console.log('Rendered og.png, favicon-32.png and apple-touch-icon.png');
} finally {
  await browser.close();
  server.close();
}
