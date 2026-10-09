// Captures screenshots of live project sites. Raw PNGs go to the directory
// given as the first argument; scripts/optimize-images.py turns them into
// the WebP files under assets/img/work/.
//
//   node scripts/capture-projects.mjs <out-dir> [id ...]
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const [outDir, ...only] = process.argv.slice(2);
if (!outDir) {
  console.error('usage: node scripts/capture-projects.mjs <out-dir> [id ...]');
  process.exit(1);
}

const targets = [
  {
    id: 'ri2',
    url: 'https://sudhanshumukherjeexx.github.io/ri2/',
    async prepare(page) {
      await page.waitForTimeout(4000);
      await page.getByRole('button', { name: 'Titanic' }).click();
      await page.waitForTimeout(25000);
    },
  },
  {
    id: 'tiny-editor',
    url: 'https://sudhanshumukherjeexx.github.io/tiny-editor/',
    async prepare(page) {
      await page.waitForTimeout(1500);
      await page.locator('.ProseMirror').first().click();
      const k = page.keyboard;
      await k.type('Notes from a quiet morning');
      await k.press('Enter');
      await k.type('Small tools, made with care, tend to outlive big ones. Keep the page calm; let the words do the work.');
      await k.press('Enter');
      await k.type('[ ] Draft the essay');
      await k.press('Enter');
      await k.type('Export as Markdown');
      await page.mouse.click(5, 450);
      await page.waitForTimeout(800);
    },
  },
  { id: 'power-bi', url: 'https://sudhanshumukherjeexx.github.io/power-bi/' },
  { id: 'tiny-language-models', url: 'https://sudhanshumukherjeexx.github.io/tiny-language-models/' },
  { id: 'pytorch-playground', url: 'https://sudhanshumukherjeexx.github.io/PyTorch-Playground/' },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge' });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
for (const t of targets.filter((t) => only.length === 0 || only.includes(t.id))) {
  const page = await context.newPage();
  await page.goto(t.url, { waitUntil: 'networkidle', timeout: 60000 });
  await (t.prepare ? t.prepare(page) : page.waitForTimeout(3000));
  await page.screenshot({ path: path.join(outDir, `${t.id}.png`) });
  console.log(`captured ${t.id}`);
  await page.close();
}
await browser.close();
