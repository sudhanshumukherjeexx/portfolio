import { html } from '../lib/html.mjs';
import { site } from '../data/site.mjs';
import { posts } from '../data/writing.mjs';
import { icon } from '../components/icons.mjs';
import { postItem } from '../components/bits.mjs';

export function writingPage() {
  const years = [...new Set(posts.map((p) => p.date.slice(0, 4)))];

  const body = html`
<header class="page-head">
  <div class="container narrow">
    <p class="eyebrow">Writing</p>
    <h1 class="page-title">Notes on data, models and building</h1>
    <p class="page-lead">I write <a href="${site.links.newsletter}" rel="noopener">Hustle Data</a>, a newsletter of tutorials, competition write-ups and engineering practice. Articles open on Substack.</p>
    <p><a class="btn btn--ghost btn--small" href="${site.links.newsletter}" rel="noopener">${icon('rss', { size: 16 })}Subscribe on Substack</a></p>
  </div>
</header>

<section class="section section--tight" aria-label="Articles">
  <div class="container narrow">
    ${years.map(
      (y) => html`
      <div class="year-group">
        <p class="year-group__year" aria-hidden="true">${y}</p>
        <ol class="posts" aria-label="Articles from ${y}">${posts.filter((p) => p.date.startsWith(y)).map((p) => postItem(p, 2))}</ol>
      </div>`,
    )}
  </div>
</section>`;

  return {
    path: '/writing/',
    out: 'writing/index.html',
    title: 'Writing',
    description: `Articles by ${site.name} on machine learning, data science, SQL and Python engineering, from the Hustle Data newsletter.`,
    active: 'writing',
    body,
  };
}
