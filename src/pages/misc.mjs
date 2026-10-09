import { html } from '../lib/html.mjs';
import { site } from '../data/site.mjs';
import { bitSvg } from '../components/bit.mjs';

export function notFoundPage() {
  const body = html`
<section class="lost">
  <div class="container lost__inner">
    <div class="lost__bit" aria-hidden="true">${bitSvg('bit--lost')}</div>
    <p class="eyebrow">404</p>
    <h1 class="page-title">This page wandered off.</h1>
    <p class="page-lead">The address may have changed when the site was redesigned. These should get you back on track:</p>
    <ul class="lost__links">
      <li><a class="btn btn--primary" href="/">Home</a></li>
      <li><a class="btn btn--ghost" href="/work/">Work</a></li>
      <li><a class="btn btn--ghost" href="/writing/">Writing</a></li>
    </ul>
  </div>
</section>`;
  return {
    path: '/404.html',
    out: '404.html',
    title: 'Page not found',
    description: 'This page could not be found.',
    body,
    noindex: true,
  };
}

/** Old URLs from the previous site, kept alive as redirects. */
export const redirects = [
  { out: 'pages/projects.html', to: '/work/' },
  { out: 'pages/blogs.html', to: '/writing/' },
  { out: 'pages/archives.html', to: '/writing/' },
];

export function redirectHtml(to) {
  const url = site.origin + to;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved · ${site.name}</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${url}">
<meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.hash);</script>
</head>
<body>
<p>This page has moved to <a href="${to}">${url}</a>.</p>
</body>
</html>
`;
}
