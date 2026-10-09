import { html } from '../lib/html.mjs';
import { site } from '../data/site.mjs';
import { projects, categories, archive, caseStudies } from '../data/projects.mjs';
import { projectCard, linkPill } from '../components/project.mjs';

export function workPage() {
  const counts = Object.fromEntries(
    categories.map((c) => [c.id, projects.filter((p) => p.categories.includes(c.id)).length]),
  );

  const body = html`
<header class="page-head">
  <div class="container">
    <p class="eyebrow">Work</p>
    <h1 class="page-title">Projects and experiments</h1>
    <p class="page-lead">${projects.length} projects across language models, developer tools, analytics and teaching. The ${caseStudies.length} with case studies are the ones I’d most like you to see.</p>
  </div>
</header>

<section class="section section--tight" aria-label="All projects">
  <div class="container">
    <div class="filters" role="group" aria-label="Filter projects by category" data-filters>
      <button type="button" class="filter" aria-pressed="true" data-filter="all">All <span class="filter__n">${projects.length}</span></button>
      ${categories.map(
        (c) => html`<button type="button" class="filter" aria-pressed="false" data-filter="${c.id}">${c.label} <span class="filter__n">${counts[c.id]}</span></button>`,
      )}
    </div>
    <p class="filters__status" data-filter-status>Showing all ${projects.length} projects</p>
    <div class="grid-3" data-project-grid>
      ${projects.map((p) => projectCard(p, { headingLevel: 2, withDetail: true }))}
    </div>
  </div>
</section>

<section class="section section--muted" aria-labelledby="archive-title">
  <div class="container">
    <p class="eyebrow">Archive</p>
    <h2 class="section-title" id="archive-title">Earlier work</h2>
    <p class="section-lead">Projects that have been superseded or were smaller in scope, kept here for the record.</p>
    <ul class="archive">
      ${archive.map(
        (a) => html`
        <li class="archive__item">
          <h3 class="archive__title">${a.title}</h3>
          <p class="archive__note">${a.note}</p>
          <div class="archive__links">${a.links.map((l) => linkPill(l))}</div>
        </li>`,
      )}
    </ul>
  </div>
</section>`;

  return {
    path: '/work/',
    out: 'work/index.html',
    title: 'Work',
    description: `Projects by ${site.name}: RI2, WRANG, TinyLM Lab, Kaku, the Power BI Fellowship, a self-correcting RAG system, and more.`,
    active: 'work',
    body,
  };
}
