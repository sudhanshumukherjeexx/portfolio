import { html, raw } from '../lib/html.mjs';
import { site } from '../data/site.mjs';
import { projects, projectUrl } from '../data/projects.mjs';
import { journey, credentials, interests, offDuty } from '../data/about.mjs';
import { icon } from '../components/icons.mjs';
import { sectionHead } from '../components/bits.mjs';

const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

const offGlyphs = {
  wave: '<path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><circle cx="15" cy="6" r="2"/><path d="M8 11l3-4 4 2"/>',
  pad: '<rect x="2" y="7" width="20" height="11" rx="5.5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r=".8" fill="currentColor"/><circle cx="18" cy="13.5" r=".8" fill="currentColor"/>',
  book: '<path d="M12 7v13"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  spark: '<path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z"/>',
};

export function aboutPage() {
  const body = html`
<header class="page-head about-head">
  <div class="container about-head__inner">
    <div>
      <p class="eyebrow">About</p>
      <h1 class="page-title">I like making data easier to use.</h1>
      <div class="prose page-prose">
        <p>I’m ${site.name} <span class="muted" lang="bn">(${site.nameBengali})</span>, a data scientist and AI/ML engineer based in Massachusetts. I enjoy automating processes and getting insight out of data, and I’m happiest where natural language processing, large language models and machine learning meet practical software.</p>
        <p>I graduated with a master’s in data science from the University of Massachusetts Dartmouth in May 2025. Before that I spent three years as a BI developer, and since then I’ve worked on multi-agent analytics and built the tools on this site. I’m open to full-time roles and to doctoral research in NLP, multimodal LLMs and machine learning.</p>
      </div>
      <div class="hero__actions">
        <a class="btn btn--primary" href="${site.resume}">${icon('file')}Download résumé <span class="btn__meta">PDF</span></a>
        <a class="btn btn--ghost" href="#contact">Get in touch</a>
      </div>
    </div>
    <figure class="portrait">
      <img src="/assets/img/portrait-620.webp" srcset="/assets/img/portrait-400.webp 400w, /assets/img/portrait-620.webp 620w" sizes="(min-width: 900px) 360px, 70vw" width="620" height="775" alt="Sudhanshu in a red winter jacket and grey beanie, standing on a lawn in front of a columned stone building." loading="eager" decoding="async">
    </figure>
  </div>
</header>

<section class="section" aria-labelledby="journey-title">
  <div class="container">
    ${sectionHead({ num: '01', eyebrow: 'Journey', title: 'Where I’ve been', id: 'journey-title' })}
    <ol class="timeline">
      ${journey.map(
        (j) => html`
        <li class="timeline__item">
          <p class="timeline__when">${j.when}</p>
          <div class="timeline__body">
            <h3 class="timeline__role">${j.role} <span class="timeline__org">· ${j.org}</span></h3>
            <p class="timeline__place">${j.place}</p>
            ${j.note ? html`<p class="timeline__note">${j.note}</p>` : ''}
          </div>
        </li>`,
      )}
    </ol>
    <h3 class="subhead">Certifications</h3>
    <ul class="cred-list">${credentials.map((c) => html`<li>${c}</li>`)}</ul>
  </div>
</section>

<section class="section section--muted" aria-labelledby="interests-title">
  <div class="container">
    ${sectionHead({ num: '02', eyebrow: 'Interests', title: 'What I keep coming back to', id: 'interests-title' })}
    <ul class="interest-grid">
      ${interests.map(
        (it) => html`
        <li class="interest tone-${it.tone}">
          <span class="thread__dot" aria-hidden="true"></span>
          <h3 class="interest__title">${it.title}</h3>
          <p class="interest__text">${it.text}</p>
          <ul class="thread__evidence">${it.evidence.map((s) => html`<li><a href="${projectUrl(bySlug[s]) ?? `/work/#${s}`}">${bySlug[s].shortTitle}</a></li>`)}</ul>
        </li>`,
      )}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="off-title">
  <div class="container off-duty">
    ${sectionHead({ num: '03', eyebrow: 'Off duty', title: 'Outside of work', id: 'off-title' })}
    <ul class="chips">
      ${offDuty.map((o) => html`<li class="chip">${raw(`<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${offGlyphs[o.glyph]}</svg>`)}${o.label}</li>`)}
    </ul>
    <p class="section-lead">You’ll find me in the pool, deep in a game or a book, or building something small for the fun of it. I also write the <a href="${site.links.newsletter}" rel="noopener">Hustle Data</a> newsletter.</p>
  </div>
</section>`;

  return {
    path: '/about/',
    out: 'about/index.html',
    title: 'About',
    description: `About ${site.name}: background, experience, teaching, and the problems I like working on in data science, machine learning and language models.`,
    active: 'about',
    body,
  };
}
