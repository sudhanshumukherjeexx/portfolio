// Project cards and their visuals.
import { html, raw, cx } from '../lib/html.mjs';
import { icon } from './icons.mjs';
import { projectUrl } from '../data/projects.mjs';

const isExternal = (href) => /^https?:/.test(href);

/** The link a card's title points to: case study, then demo, then source. */
export function primaryHref(p) {
  return projectUrl(p) ?? p.demo?.href ?? p.repo ?? p.links?.[0]?.href;
}

export function projectImage(p, { sizes = '(min-width: 1100px) 540px, (min-width: 720px) 50vw, 100vw', eager = false } = {}) {
  const { name, alt } = p.visual;
  return html`<img src="/assets/img/work/${name}-1200.webp" srcset="/assets/img/work/${name}-640.webp 640w, /assets/img/work/${name}-1200.webp 1200w" sizes="${sizes}" width="1200" height="750" alt="${alt}" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
}

// Real output of `wrang titanic.csv --inspect` (wrang 0.2.2), trimmed to three rows.
const terminal = () => html`
  <div class="vis-term" role="img" aria-label="Excerpt of real WRANG output: loading titanic.csv reports 891 rows by 12 columns, and the column table shows Age 19.9%, Cabin 77.1% and Embarked 0.2% missing.">
    <div class="vis-term__bar" aria-hidden="true"><span></span><span></span><span></span></div>
    <pre aria-hidden="true"><span class="term__p">$</span> wrang titanic.csv --inspect
<span class="term__ok">✓</span> Successfully loaded 891 rows × 12 columns

 Column     Type      Missing %
 ─────────────────────────────
 Age        Float64   19.9%
 Cabin      String    77.1%
 Embarked   String    0.2%</pre>
  </div>`;

const pipeline = () => raw(`
  <div class="vis-pipe">
    <svg viewBox="0 0 440 250" role="img" aria-label="Pipeline: retrieve, guardrail, generate, evaluate. Answers scoring below 3 loop back to generation, up to three attempts.">
      <defs><marker id="pipe-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="vp-head"/></marker></defs>
      <g class="vp-node"><rect x="16" y="98" width="88" height="44" rx="22"/><text x="60" y="125">retrieve</text></g>
      <g class="vp-node"><rect x="122" y="98" width="88" height="44" rx="22"/><text x="166" y="125">guardrail</text></g>
      <g class="vp-node vp-node--hi"><rect x="228" y="98" width="88" height="44" rx="22"/><text x="272" y="125">generate</text></g>
      <g class="vp-node"><rect x="334" y="98" width="88" height="44" rx="22"/><text x="378" y="125">evaluate</text></g>
      <path class="vp-edge" d="M104 120h14" marker-end="url(#pipe-arrow)"/>
      <path class="vp-edge" d="M210 120h14" marker-end="url(#pipe-arrow)"/>
      <path class="vp-edge" d="M316 120h14" marker-end="url(#pipe-arrow)"/>
      <path class="vp-loop" d="M378 98C378 50 272 50 272 94" marker-end="url(#pipe-arrow)"/>
      <text class="vp-note" x="325" y="46">score &lt; 3 · retry ≤ 3</text>
      <path class="vp-edge" d="M378 142v40" marker-end="url(#pipe-arrow)"/>
      <text class="vp-note" x="378" y="204">best answer</text>
      <text class="vp-note vp-note--l" x="16" y="204">FAISS · top-5 chunks</text>
    </svg>
  </div>`);

const glyphs = {
  grid: '<g class="cg-grid">' +
    Array.from({ length: 25 }, (_, i) => {
      const x = 20 + (i % 5) * 22, y = 20 + Math.floor(i / 5) * 22;
      const on = [1, 7, 8, 13, 17, 19, 23].includes(i);
      return `<rect x="${x}" y="${y}" width="16" height="16" rx="4" class="${on ? 'cg-on' : ''}"/>`;
    }).join('') + '</g>',
  eye: '<rect x="22" y="30" width="108" height="92" rx="12" class="cg-frame"/><path d="M34 76c14-22 30-32 42-32s28 10 42 32c-14 22-30 32-42 32S48 98 34 76z"/><circle cx="76" cy="76" r="14" class="cg-on"/><path d="M22 54h12M118 98h12" class="cg-scan"/>',
  line: '<path d="M20 120h112M20 120V24" class="cg-axis"/><path d="M24 104l18-10 16 6 18-24 16 8 18-30 16-12"/><circle cx="126" cy="42" r="5" class="cg-on"/><path d="M110 42h-6M110 54h-6" class="cg-scan"/>',
  pitch: '<rect x="18" y="34" width="116" height="84" rx="6"/><path d="M76 34v84"/><circle cx="76" cy="76" r="14"/><rect x="18" y="56" width="16" height="40"/><rect x="118" y="56" width="16" height="40"/><circle cx="96" cy="66" r="4" class="cg-on"/>',
};

const cover = (p) => raw(`
  <div class="vis-cover vis-cover--${p.visual.tone}" aria-hidden="true">
    <svg viewBox="0 0 152 152" class="vis-cover__glyph">${glyphs[p.visual.glyph]}</svg>
    <span class="vis-cover__label">${p.shortTitle}</span>
  </div>`);

export function visual(p, opts) {
  switch (p.visual.type) {
    case 'image': return projectImage(p, opts);
    case 'terminal': return terminal();
    case 'pipeline': return pipeline();
    default: return cover(p);
  }
}

/** Secondary links shown under a card: case study, demo, source, extras. */
export function projectLinks(p, { includeCaseStudy = true } = {}) {
  const items = [];
  const cs = projectUrl(p);
  if (cs && includeCaseStudy) items.push({ label: 'Case study', href: cs });
  if (p.demo) items.push(p.demo);
  if (p.repo) items.push({ label: 'Source', href: p.repo });
  for (const l of p.links ?? []) items.push(l);
  return items;
}

export function linkPill(l, extraClass = '') {
  const ext = isExternal(l.href);
  return html`<a class="${cx('pill-link', extraClass)}" href="${l.href}"${ext ? raw(' rel="noopener"') : ''}>${l.label}${icon(ext ? 'arrowUpRight' : 'arrowRight', { size: 14 })}</a>`;
}

function detailBlock(p) {
  const d = p.detail;
  if (!d) return '';
  const max = d.bars ? Math.max(...d.bars.map((b) => b[1])) : 0;
  return html`
    <details class="card__detail">
      <summary>${d.bars ? 'Results' : 'Details'}</summary>
      ${d.points ? html`<dl class="points">${d.points.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>` : ''}
      ${d.bars ? html`<p class="bars__caption">Test accuracy on CIFAR-100, as reported in the repository</p>
      <ol class="bars">${d.bars.map(([name, value]) => html`
        <li><span class="bars__name">${name}</span><span class="bars__track" aria-hidden="true"><span class="bars__fill" style="--w:${((value / max) * 100).toFixed(1)}%"></span></span><span class="bars__val">${value.toFixed(2)}%</span></li>`)}
      </ol>` : ''}
      ${d.note ? html`<p class="card__note">${d.note}</p>` : ''}
    </details>`;
}

/**
 * @param {import('../data/projects.mjs').Project} p
 * @param {{ wide?: boolean, reverse?: boolean, headingLevel?: number, withDetail?: boolean, eager?: boolean }} [opts]
 */
export function projectCard(p, { wide = false, reverse = false, headingLevel = 3, withDetail = false, eager = false } = {}) {
  const href = primaryHref(p);
  const ext = isExternal(href);
  const h = `h${headingLevel}`;
  const sizes = wide ? '(min-width: 1100px) 620px, (min-width: 820px) 55vw, 100vw' : undefined;
  return html`
    <article id="${p.slug}" class="${cx('card', `tone-${p.tone}`, wide && 'card--wide', reverse && 'card--reverse')}" data-categories="${p.categories.join(' ')}" data-bit="curious">
      <div class="card__media">${visual(p, { sizes, eager })}</div>
      <div class="card__body">
        <p class="card__kicker">${p.kicker}</p>
        ${raw(`<${h} class="card__title">`)}<a class="card__link" href="${href}"${ext ? raw(' rel="noopener"') : ''}>${p.title}${icon(ext ? 'arrowUpRight' : 'arrowRight', { size: 18, className: 'icon card__arrow' })}</a>${raw(`</${h}>`)}
        <p class="card__summary">${p.summary}</p>
        <ul class="tags" aria-label="Technologies">${p.tech.map((t) => html`<li>${t}</li>`)}</ul>
        ${withDetail ? detailBlock(p) : ''}
        <div class="card__actions">${projectLinks(p).filter((l) => l.href !== href).map((l) => linkPill(l))}</div>
      </div>
    </article>`;
}
