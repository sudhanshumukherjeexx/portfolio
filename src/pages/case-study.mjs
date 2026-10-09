import { html } from '../lib/html.mjs';
import { site } from '../data/site.mjs';
import { caseStudies } from '../data/projects.mjs';
import { icon } from '../components/icons.mjs';
import { visual } from '../components/project.mjs';

const pad = (n) => String(n).padStart(2, '0');

export function caseStudyPages() {
  return caseStudies.map((p, i) => {
    const cs = p.caseStudy;
    const prev = caseStudies[(i - 1 + caseStudies.length) % caseStudies.length];
    const next = caseStudies[(i + 1) % caseStudies.length];

    const body = html`
<article class="case tone-${p.tone}">
  <header class="case__head">
    <div class="container">
      <nav class="crumbs" aria-label="Breadcrumb">
        <ol><li><a href="/work/">Work</a></li><li><span aria-current="page">${p.shortTitle}</span></li></ol>
      </nav>
      <p class="eyebrow">${p.kicker}</p>
      <h1 class="page-title case__title">${p.title}</h1>
      <p class="page-lead">${cs.lead}</p>
      <div class="case__actions">
        ${p.demo ? html`<a class="btn btn--primary" href="${p.demo.href}" rel="noopener">${p.demo.label}${icon('arrowUpRight')}</a>` : ''}
        ${p.repo ? html`<a class="btn btn--ghost" href="${p.repo}" rel="noopener">${icon('github')}Source code</a>` : ''}
      </div>
      <dl class="case__facts">${cs.facts.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
    </div>
  </header>

  <div class="container">
    <div class="case__visual">${visual(p, { sizes: '(min-width: 1180px) 1100px, 100vw', eager: true })}</div>
  </div>

  <div class="container case__layout">
    <nav class="toc" aria-labelledby="toc-title">
      <p class="toc__title" id="toc-title">On this page</p>
      <ol>${cs.sections.map((s) => html`<li><a href="#${s.id}">${s.title}</a></li>`)}</ol>
    </nav>
    <div class="case__body prose">
      ${cs.sections.map(
        (s, n) => html`
        <section class="case__section" aria-labelledby="${s.id}">
          <h2 id="${s.id}"><span class="h-num" aria-hidden="true">${pad(n + 1)}</span>${s.title}</h2>
          ${s.body}
        </section>`,
      )}
    </div>
  </div>

  <nav class="container case__pager" aria-label="More case studies">
    <a class="pager pager--prev" href="/work/${prev.slug}/"><span class="pager__label">${icon('arrowLeft', { size: 16 })}Previous</span><span class="pager__title">${prev.shortTitle}</span></a>
    <a class="pager pager--next" href="/work/${next.slug}/"><span class="pager__label">Next${icon('arrowRight', { size: 16 })}</span><span class="pager__title">${next.shortTitle}</span></a>
  </nav>
</article>`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareSourceCode',
      name: p.title,
      description: p.summary,
      url: `${site.origin}/work/${p.slug}/`,
      codeRepository: p.repo,
      author: { '@type': 'Person', name: site.name, url: site.origin + '/' },
      keywords: p.tech.join(', '),
    };

    return {
      path: `/work/${p.slug}/`,
      out: `work/${p.slug}/index.html`,
      title: p.shortTitle === p.title ? p.title : `${p.shortTitle}: case study`,
      description: p.summary,
      active: 'work',
      ogType: 'article',
      body,
      jsonLd,
    };
  });
}
