// Page shell: <head>, header, contact section and footer.
import { html, raw, cx } from '../lib/html.mjs';
import { site, nav } from '../data/site.mjs';
import { icon } from './icons.mjs';
import { bitSvg, companionTemplate } from './bit.mjs';

// Runs before first paint: applies a saved theme and mascot preference so
// nothing flashes. Kept tiny because it blocks rendering.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);if(localStorage.getItem('bit')==='off')d.classList.add('bit-off')}catch(e){}})();`;

function head({ title, description, path, ogType = 'website', jsonLd, assets, noindex }) {
  const url = site.origin + path;
  const fullTitle = path === '/' ? `${site.name} — ${site.role}` : `${title} · ${site.name}`;
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${fullTitle}</title>
<meta name="description" content="${description}">
${noindex ? raw('<meta name="robots" content="noindex">') : html`<link rel="canonical" href="${url}">`}
<meta name="author" content="${site.name}">
<meta name="color-scheme" content="light">
<meta name="theme-color" content="#FAF9F6">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${fullTitle}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${site.origin}${site.ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Sudhanshu Mukherjee — data scientist and AI/ML engineer, with Bit, the site’s pixel mascot">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${assets.css}">
<script>${raw(bootScript)}</script>
<script src="${assets.js}" defer></script>
${jsonLd ? raw(`<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`) : ''}
</head>`;
}

function navLinks(active, { mobile = false } = {}) {
  return nav.map(
    (item) => html`<li><a class="${mobile ? 'mnav__link' : 'nav__link'}" href="${item.href}"${item.key === active ? raw(' aria-current="page"') : ''}>${item.label}${item.file ? html`<span class="visually-hidden"> (${item.file})</span>` : ''}</a></li>`,
  );
}

const toggles = () => html`
  <button class="icon-btn" type="button" data-theme-toggle aria-label="Switch to dark theme">
    <span class="theme-icon theme-icon--sun">${icon('sun')}</span><span class="theme-icon theme-icon--moon">${icon('moon')}</span>
  </button>
  <button class="icon-btn bit-toggle" type="button" data-bit-toggle aria-pressed="true" aria-label="Bit, the animated mascot" title="Bit, the animated mascot">
    ${icon('bit')}
  </button>`;

function header(active) {
  return html`
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="brand" href="/" aria-label="${site.name}, home">
      <span class="brand__mark" aria-hidden="true">${bitSvg('bit--mark')}</span>
      <span class="brand__name">Sudhanshu<span class="brand__last"> Mukherjee</span></span>
    </a>
    <nav class="nav" aria-label="Primary">
      <ul class="nav__list">${navLinks(active)}</ul>
    </nav>
    <div class="site-header__tools">
      <a class="btn btn--small btn--ghost nav-cta" href="#contact">Say hello</a>
      ${toggles()}
      <button class="icon-btn menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav" data-menu-button>
        <span class="menu-btn__open">${icon('menu', { size: 20 })}</span><span class="menu-btn__close">${icon('close', { size: 20 })}</span>
        <span class="visually-hidden">Menu</span>
      </button>
    </div>
  </div>
  <nav class="mnav" id="mobile-nav" aria-label="Primary" hidden data-menu>
    <ul class="mnav__list container">${navLinks(active, { mobile: true })}
      <li><a class="mnav__link" href="#contact">Contact</a></li>
    </ul>
  </nav>
</header>`;
}

export function contactSection() {
  return html`
<section class="contact" id="contact" aria-labelledby="contact-title" data-contact>
  <div class="container contact__inner">
    <div class="contact__text">
      <p class="eyebrow">Contact</p>
      <h2 id="contact-title" class="contact__title">Have something interesting in mind?</h2>
      <p class="contact__lead">I’m always interested in thoughtful collaborations, interesting research problems, and opportunities to build useful things.</p>
      <ul class="contact__links">
        <li><a class="btn btn--primary" href="mailto:${site.email}">${icon('mail')}${site.email}</a></li>
        <li><a class="btn btn--ghost" href="${site.links.github}" rel="noopener">${icon('github')}GitHub</a></li>
        <li><a class="btn btn--ghost" href="${site.links.linkedin}" rel="noopener">${icon('linkedin')}LinkedIn</a></li>
        <li><a class="btn btn--ghost" href="${site.resume}">${icon('file')}Résumé <span class="btn__meta">PDF</span></a></li>
      </ul>
    </div>
    <div class="contact__bit" aria-hidden="true" data-bit-wave>${bitSvg('bit--contact')}</div>
  </div>
</section>`;
}

function footer() {
  return html`
<footer class="site-footer">
  <div class="container site-footer__inner">
    <p class="site-footer__quote"><a href="https://en.wikipedia.org/wiki/Ars_longa,_vita_brevis" rel="noopener"><i lang="la">Ars longa, vita brevis.</i></a></p>
    <ul class="site-footer__links">
      <li><a href="/work/">Work</a></li>
      <li><a href="/about/">About</a></li>
      <li><a href="/writing/">Writing</a></li>
      <li><a href="${site.links.newsletter}" rel="noopener">Hustle Data newsletter</a></li>
    </ul>
    <p class="site-footer__fine">© ${new Date().getFullYear()} ${site.name}. Hand-built, statically generated, served by GitHub Pages.</p>
  </div>
</footer>`;
}

/**
 * @param {{ title: string, description: string, path: string, active?: string,
 *   body: unknown, ogType?: string, jsonLd?: object, assets: {css: string, js: string},
 *   contact?: boolean, noindex?: boolean, bodyClass?: string }} page
 */
export function layout(page) {
  const { active, body, contact = true, bodyClass } = page;
  return `<!doctype html>
<html lang="en">
${head(page)}
<body class="${cx(bodyClass)}">
${header(active)}
<main id="main" tabindex="-1">
${body}
</main>
${contact ? contactSection() : ''}
${footer()}
${companionTemplate()}
<div class="visually-hidden" aria-live="polite" data-announcer></div>
</body>
</html>
`;
}
