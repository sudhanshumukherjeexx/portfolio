// Small shared pieces: section headings, post rows, dates.
import { html } from '../lib/html.mjs';
import { icon } from './icons.mjs';
import { readingMinutes } from '../data/writing.mjs';

/**
 * @param {{ num: string, eyebrow: string, title: string, id: string, aside?: unknown, lead?: string }} o
 */
export function sectionHead({ num, eyebrow, title, id, aside, lead }) {
  return html`
    <div class="section-head">
      <div>
        <p class="eyebrow"><span class="eyebrow__num">${num}</span>${eyebrow}</p>
        <h2 class="section-title" id="${id}">${title}</h2>
        ${lead ? html`<p class="section-lead">${lead}</p>` : ''}
      </div>
      ${aside ?? ''}
    </div>`;
}

export const textLink = (href, label, { external = false } = {}) =>
  html`<a class="text-link" href="${href}"${external ? html` rel="noopener"` : ''}>${label}${icon(external ? 'arrowUpRight' : 'arrowRight', { size: 16 })}</a>`;

const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (iso) => fmt.format(new Date(`${iso}T00:00:00Z`));

export function postItem(post, headingLevel = 3) {
  const h = headingLevel === 2 ? 'h2' : 'h3';
  const title = html`<a class="post__link" href="${post.url}" rel="noopener">${post.title}${icon('arrowUpRight', { size: 16, className: 'icon post__arrow' })}</a>`;
  return html`
    <li class="post">
      <p class="post__meta"><time datetime="${post.date}">${formatDate(post.date)}</time><span aria-hidden="true">·</span><span>${post.category}</span><span aria-hidden="true">·</span><span>${readingMinutes(post.words)} min read</span></p>
      ${h === 'h2' ? html`<h2 class="post__title">${title}</h2>` : html`<h3 class="post__title">${title}</h3>`}
      <p class="post__excerpt">${post.excerpt}</p>
    </li>`;
}
