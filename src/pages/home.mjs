import { html } from '../lib/html.mjs';
import { site } from '../data/site.mjs';
import { projects, featuredProjects, projectUrl } from '../data/projects.mjs';
import { posts } from '../data/writing.mjs';
import { icon } from '../components/icons.mjs';
import { bitSvg } from '../components/bit.mjs';
import { projectCard } from '../components/project.mjs';
import { sectionHead, textLink, postItem } from '../components/bits.mjs';

const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
const evidenceHref = (p) => projectUrl(p) ?? `/work/#${p.slug}`;

const threads = [
  {
    title: 'AI & ML engineering',
    tone: 'lavender',
    text: 'Training and evaluating models carefully: a small language model from scratch, retrieval that checks its own answers, multimodal fine-tuning and architecture benchmarks.',
    evidence: ['tiny-language-models', 'self-correcting-rag', 'medical-vqa', 'cifar100-architecture-comparison'],
  },
  {
    title: 'Developer tools & products',
    tone: 'sage',
    text: 'Software that removes a step from someone’s day: a data engine that runs in the browser, a terminal data toolkit and a private writing room.',
    evidence: ['ri2', 'wrang', 'tiny-editor'],
  },
  {
    title: 'Data, analytics & teaching',
    tone: 'butter',
    text: 'Years of BI work, forecasting and sports analytics, and passing it on through workshops and open curricula.',
    evidence: ['power-bi', 'godaddy-microbusiness-forecasting', 'la-liga-soccer-analytics', 'pytorch-playground'],
  },
];

export function homePage() {
  const [first, ...rest] = featuredProjects;
  const grid = rest.slice(0, 4);
  const last = rest[4];

  const body = html`
<section class="hero" aria-labelledby="hero-title">
  <div class="container hero__inner">
    <div class="hero__text">
      <p class="eyebrow hero__eyebrow">
        <span>Data scientist · AI/ML engineer</span>
        <span class="hero__loc">${icon('pin', { size: 14 })}${site.location}</span>
      </p>
      <h1 class="hero__title" id="hero-title">Hi, I’m Sudhanshu.<br><span class="hero__accent">I build intelligent things.</span></h1>
      <p class="hero__bn" lang="bn">${site.nameBengali}</p>
      <p class="hero__lead">I’m a data scientist and AI/ML engineer building intelligent applications, language models, and practical developer tools.</p>
      <div class="hero__actions">
        <a class="btn btn--primary" href="#work">Explore my work${icon('arrowRight')}</a>
        <a class="btn btn--ghost" href="${site.resume}">${icon('file')}Résumé <span class="btn__meta">PDF</span></a>
        <a class="btn btn--ghost btn--icon" href="${site.links.github}" rel="noopener" aria-label="GitHub profile">${icon('github')}</a>
      </div>
    </div>
    <figure class="hero-photo">
      <img src="/assets/img/hero-880.webp" srcset="/assets/img/hero-480.webp 480w, /assets/img/hero-880.webp 880w" sizes="(min-width: 860px) 440px, 80vw" width="880" height="1100" alt="Sudhanshu in a red puffer jacket and sunglasses, sitting on a wooden bench in a snowy clearing ringed by evergreen trees under a blue sky." fetchpriority="high" decoding="async">
      <div class="hero-photo__bit" data-bit-seat aria-hidden="true">${bitSvg('bit--hero')}</div>
    </figure>
  </div>
</section>

<section class="section" id="work" aria-labelledby="work-title">
  <div class="container">
    ${sectionHead({
      num: '01',
      eyebrow: 'Selected work',
      title: 'Things I’ve built recently',
      id: 'work-title',
      aside: textLink('/work/', `All ${projects.length} projects`),
    })}
    <div class="stack-lg">
      ${projectCard(first, { wide: true, eager: false })}
      <div class="grid-2">${grid.map((p) => projectCard(p))}</div>
      ${last ? projectCard(last, { wide: true, reverse: true }) : ''}
    </div>
  </div>
</section>

<section class="section section--muted" aria-labelledby="focus-title">
  <div class="container">
    ${sectionHead({ num: '02', eyebrow: 'Focus', title: 'Three threads run through my work', id: 'focus-title' })}
    <ul class="threads">
      ${threads.map(
        (t) => html`
        <li class="thread tone-${t.tone}">
          <span class="thread__dot" aria-hidden="true"></span>
          <h3 class="thread__title">${t.title}</h3>
          <p class="thread__text">${t.text}</p>
          <p class="thread__label">See</p>
          <ul class="thread__evidence">${t.evidence.map((slug) => html`<li><a href="${evidenceHref(bySlug[slug])}">${bySlug[slug].shortTitle}</a></li>`)}</ul>
        </li>`,
      )}
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="about-title">
  <div class="container about-teaser">
    <div>
      ${sectionHead({ num: '03', eyebrow: 'About', title: 'Data, models, and the details in between', id: 'about-title' })}
      <div class="prose">
        <p>I like working where natural language processing, machine learning and practical software meet. I spent three years as a BI developer turning business questions into Power BI dashboards, then did a master’s in data science at UMass Dartmouth, where my thesis became the tools behind RI2 and WRANG.</p>
        <p>I care about evidence: numbers that trace back to a file, models evaluated on data they haven’t seen, and interfaces that stay out of the way.</p>
      </div>
      <p class="mt-md">${textLink('/about/', 'More about me')}</p>
    </div>
    <dl class="facts">
      <div><dt>Education</dt><dd>M.S. Data Science, UMass Dartmouth, 2025</dd></div>
      <div><dt>Certified</dt><dd>AWS Machine Learning – Specialty</dd></div>
      <div><dt>Teaching</dt><dd>Two TA roles and a data-instructor post</dd></div>
      <div><dt>Based in</dt><dd>${site.location}</dd></div>
    </dl>
  </div>
</section>

<section class="section section--muted" aria-labelledby="writing-title">
  <div class="container">
    ${sectionHead({
      num: '04',
      eyebrow: 'Writing',
      title: 'Notes from the Hustle Data newsletter',
      id: 'writing-title',
      aside: textLink('/writing/', 'All writing'),
    })}
    <ol class="posts posts--compact">${posts.slice(0, 3).map((p) => postItem(p))}</ol>
  </div>
</section>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.origin + '/',
    jobTitle: 'Data Scientist',
    email: `mailto:${site.email}`,
    image: site.origin + '/assets/img/portrait-620.webp',
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'University of Massachusetts Dartmouth' },
      { '@type': 'CollegeOrUniversity', name: 'G.H. Raisoni College of Engineering' },
    ],
    knowsAbout: ['Machine learning', 'Natural language processing', 'Large language models', 'Data science', 'Power BI'],
    sameAs: [site.links.github, site.links.linkedin, site.links.newsletter],
  };

  return {
    path: '/',
    out: 'index.html',
    title: site.name,
    description: site.description,
    active: 'home',
    body,
    jsonLd,
  };
}
