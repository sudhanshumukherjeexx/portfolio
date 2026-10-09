// Browser checks against the built site, using the locally installed
// Microsoft Edge (or Chrome with BROWSER_CHANNEL=chrome) via playwright-core.
//
//   npm run test:browser
//
// Covers: horizontal overflow at the target widths, console errors and
// failed requests, axe-core accessibility in both themes, the mascot on
// desktop/touch/reduced-motion, project filters, the mobile menu, theme
// persistence and legacy redirects.
import { chromium } from 'playwright-core';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { startServer } from './serve.mjs';
import { projects, caseStudies } from '../src/data/projects.mjs';

const require = createRequire(import.meta.url);
const axeSource = await readFile(require.resolve('axe-core/axe.min.js'), 'utf8');

const PORT = 4173 + Math.floor(Math.random() * 500);
const BASE = `http://localhost:${PORT}`;
const PAGES = ['/', '/work/', ...caseStudies.map((p) => `/work/${p.slug}/`), '/about/', '/writing/', '/404.html'];
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];

let failures = 0;
const results = [];
function check(name, ok, detail = '') {
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
  if (!ok) failures += 1;
}

const server = await startServer(PORT);
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge' });

async function withPage(options, fn) {
  const context = await browser.newContext(options);
  const page = await context.newPage();
  const problems = [];
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('response', (r) => {
    const url = r.url();
    if (url.startsWith(BASE) && r.status() >= 400 && !url.endsWith('/404.html')) problems.push(`${r.status()} ${url}`);
  });
  try {
    await fn(page, problems);
  } finally {
    await context.close();
  }
}

/* 1. Layout at every width, with motion reduced so nothing is mid-animation. */
for (const width of WIDTHS) {
  await withPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' }, async (page, problems) => {
    for (const path of PAGES) {
      await page.goto(BASE + path, { waitUntil: 'networkidle' });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) check(`no horizontal overflow ${path} @${width}`, false, `${overflow}px`);
    }
    check(`no console errors or failed requests @${width}`, problems.length === 0, problems.slice(0, 3).join('; '));
  });
}
check(`no horizontal overflow on ${PAGES.length} pages × ${WIDTHS.length} widths`, !results.some((r) => r.includes('FAIL  no horizontal')));

/* 2. Accessibility (axe-core, WCAG 2.2 A/AA rules) in light and dark themes. */
for (const scheme of ['light', 'dark']) {
  for (const width of [390, 1280]) {
    await withPage({ viewport: { width, height: 900 }, colorScheme: scheme, reducedMotion: 'reduce' }, async (page) => {
      await page.addInitScript((t) => localStorage.setItem('theme', t), scheme);
      for (const path of PAGES) {
        await page.goto(BASE + path, { waitUntil: 'networkidle' });
        await page.addScriptTag({ content: axeSource });
        const { violations } = await page.evaluate(() =>
          window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }),
        );
        const summary = violations.map((v) => `${v.id}[${v.impact}]×${v.nodes.length}: ${v.nodes[0]?.target.join(' ')}`);
        check(`axe ${scheme} @${width} ${path}`, violations.length === 0, summary.join(' | '));
      }
    });
  }
}

/* Light theme is the default even when the system prefers dark. */
await withPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'dark' }, async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check('light theme by default with a dark system preference', bg === 'rgb(250, 249, 246)', bg);
});

/* 3. Bit on a desktop with a fine pointer. */
await withPage({ viewport: { width: 1280, height: 900 } }, async (page, problems) => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const companion = page.locator('.companion');
  check('companion appears on desktop', (await companion.count()) === 1 && (await page.evaluate(() => document.documentElement.classList.contains('companion-on'))));
  const style = await companion.evaluate((el) => ({ pe: getComputedStyle(el).pointerEvents, hidden: el.getAttribute('aria-hidden') }));
  check('companion ignores the pointer and assistive tech', style.pe === 'none' && style.hidden === 'true');

  await page.mouse.move(300, 300);
  await page.mouse.move(640, 420, { steps: 12 });
  await page.waitForTimeout(1500);
  const box = await companion.boundingBox();
  const near = box && Math.abs(box.x - (640 + 18)) < 12 && Math.abs(box.y - (420 + 18)) < 12;
  check('companion trails the cursor and settles beside it', near, box ? `at ${Math.round(box.x)},${Math.round(box.y)}` : 'no box');
  const hit = await page.evaluate(({ x, y }) => !document.elementFromPoint(x, y)?.closest('.companion'), { x: box.x + 20, y: box.y + 20 });
  check('elements under the companion stay clickable', hit);
  const look = await page.evaluate(() => document.querySelector('.companion svg').style.getPropertyValue('--lx'));
  check('eyes follow the cursor', look !== '');

  const card = page.locator('.card').nth(1);
  await card.scrollIntoViewIfNeeded();
  const cb = await card.locator('.card__media').boundingBox();
  await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 2, { steps: 5 });
  await page.waitForTimeout(300);
  check('curious over project cards', (await page.locator('.companion svg').getAttribute('data-state')) === 'curious');

  const toggle = page.locator('header [data-bit-toggle]');
  await toggle.click();
  check('toggle hides the companion', (await page.locator('.companion').count()) === 0 && (await toggle.getAttribute('aria-pressed')) === 'false');
  await page.reload({ waitUntil: 'networkidle' });
  check('hidden preference persists', (await page.locator('.companion').count()) === 0 && (await page.evaluate(() => document.documentElement.classList.contains('bit-off'))));
  await page.locator('header [data-bit-toggle]').click();
  check('toggle brings the companion back', (await page.locator('.companion').count()) === 1);
  check('no errors during mascot interaction', problems.length === 0, problems.join('; '));
});

/* 4. Touch devices and reduced motion get no cursor companion. */
await withPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }, async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  check('no companion on touch devices', (await page.locator('.companion').count()) === 0);
  const opacity = await page.locator('.hero-photo__bit').evaluate((el) => getComputedStyle(el).opacity);
  check('hero Bit stays perched on touch devices', opacity === '1');
});
await withPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' }, async (page) => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  check('no companion with reduced motion', (await page.locator('.companion').count()) === 0);
});

/* 5. Project filters. */
await withPage({ viewport: { width: 1280, height: 900 } }, async (page) => {
  await page.goto(BASE + '/work/', { waitUntil: 'networkidle' });
  const expected = projects.filter((p) => p.categories.includes('genai')).length;
  const btn = page.locator('[data-filter="genai"]');
  await btn.focus();
  await page.keyboard.press('Enter');
  const visible = await page.locator('[data-project-grid] .card:not([hidden])').count();
  check('filter shows matching projects (keyboard)', visible === expected && (await btn.getAttribute('aria-pressed')) === 'true', `${visible}/${expected}`);
  check('filter updates the URL', page.url().includes('category=genai'));
  await page.reload({ waitUntil: 'networkidle' });
  check('filter restored from URL', (await page.locator('[data-project-grid] .card:not([hidden])').count()) === expected);
  await page.locator('[data-filter="all"]').click();
  check('"All" shows every project', (await page.locator('[data-project-grid] .card:not([hidden])').count()) === projects.length);
});

/* 6. Mobile menu, skip link and theme. */
await withPage({ viewport: { width: 390, height: 844 } }, async (page) => {
  await page.goto(BASE + '/about/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  check('first Tab reaches the skip link', (await page.evaluate(() => document.activeElement?.className)) === 'skip-link');
  const button = page.locator('[data-menu-button]');
  await button.click();
  check('menu opens', (await button.getAttribute('aria-expanded')) === 'true' && (await page.locator('#mobile-nav').isVisible()));
  check('current page marked in menu', (await page.locator('#mobile-nav [aria-current="page"]').textContent()) === 'About');
  await page.keyboard.press('Escape');
  check('Escape closes the menu and restores focus',
    (await button.getAttribute('aria-expanded')) === 'false' && (await page.evaluate(() => document.activeElement?.hasAttribute('data-menu-button'))));
  const touchTargets = await page.$$eval('header a, header button, .contact a', (els) =>
    els.filter((e) => e.offsetParent && e.getBoundingClientRect().height < 40).map((e) => e.textContent.trim() || e.getAttribute('aria-label')));
  check('header and contact touch targets ≥ 40px', touchTargets.length === 0, touchTargets.join(', '));

  await page.locator('[data-theme-toggle]').click();
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.reload({ waitUntil: 'networkidle' });
  check('theme choice persists', theme === 'dark' && (await page.evaluate(() => document.documentElement.dataset.theme)) === 'dark');
});

/* 7. Legacy URLs redirect. */
await withPage({}, async (page) => {
  for (const [from, to] of [['/pages/projects.html', '/work/'], ['/pages/blogs.html', '/writing/'], ['/pages/archives.html', '/writing/']]) {
    await page.goto(BASE + from, { waitUntil: 'networkidle' });
    check(`redirect ${from} → ${to}`, new URL(page.url()).pathname === to);
  }
  const res = await page.goto(BASE + '/pages/sudhanshu_mukherjee_resume.pdf');
  check('résumé PDF still served at its old URL', res.status() === 200);
});

await browser.close();
server.close();

console.log(results.join('\n'));
console.log(`\n${results.length - failures} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
