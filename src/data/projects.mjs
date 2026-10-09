// The project registry. Every card, filter, case study and sitemap entry is
// generated from this file, so project facts live in exactly one place.
//
// Content rule: every claim here comes from the project's README, its code,
// or output that was run while writing it. Anything unverified is left out
// and tracked separately in local, uncommitted notes.

import { html } from '../lib/html.mjs';

const GH = 'https://github.com/sudhanshumukherjeexx';

/** Filter categories, in display order. */
export const categories = [
  { id: 'ai-ml', label: 'AI / ML' },
  { id: 'genai', label: 'Generative AI' },
  { id: 'data-tools', label: 'Data tools' },
  { id: 'web', label: 'Web apps' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'education', label: 'Education' },
  { id: 'research', label: 'Research' },
];

/**
 * @typedef {{ type: 'image', name: string, alt: string }
 *   | { type: 'terminal' } | { type: 'pipeline' }
 *   | { type: 'cover', glyph: string, tone: string }} Visual
 * @typedef {{ label: string, href: string }} Link
 * @typedef {{ id: string, title: string, body: unknown }} Section
 * @typedef {{
 *   slug: string, title: string, kicker: string, summary: string,
 *   categories: string[], tech: string[], visual: Visual,
 *   repo?: string, demo?: Link, links?: Link[],
 *   featured?: number, caseStudy?: { lead: string, facts: [string, string][], sections: Section[] },
 *   tone: string,
 * }} Project
 */

/** @type {Project[]} */
export const projects = [
  // ---------------------------------------------------------------- RI2
  {
    slug: 'ri2',
    title: 'RI2 — Rapid Insights Data Engine',
    shortTitle: 'RI2',
    kicker: 'Data tool · Web app',
    summary:
      'A no-code workspace for cleaning, visualizing and statistically testing tabular data, with real pandas and scikit-learn running in the browser through WebAssembly.',
    categories: ['data-tools', 'web'],
    tech: ['React', 'TypeScript', 'Pyodide', 'WebAssembly'],
    tone: 'sage',
    visual: {
      type: 'image',
      name: 'ri2',
      alt: 'RI2’s Data Overview page with the Titanic sample loaded: a pipeline from Raw to Insight above a preview table of 898 rows and 12 columns.',
    },
    repo: `${GH}/ri2`,
    demo: { label: 'Open the app', href: 'https://sudhanshumukherjeexx.github.io/ri2/' },
    featured: 1,
    caseStudy: {
      lead:
        'RI2 turns a messy CSV or Excel file into a cleaned, feature-engineered, charted and statistically tested dataset without writing code, and without the data ever leaving the browser tab.',
      facts: [
        ['Type', 'Static web application'],
        ['Stack', 'React 19 · TypeScript · Vite · Pyodide · Plotly'],
        ['Runs on', 'GitHub Pages, no backend'],
        ['License', 'Apache 2.0'],
      ],
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          body: html`
            <p>RI2 is a guided pipeline for tabular data (CSV, XLSX and XLS). You upload a file or pick a bundled sample (Iris, Titanic, Heart Disease or Retail Sales) and work through it stage by stage: overview, cleanup and type conversion, imputation, encoding, scaling, exploratory charts, distribution diagnostics and statistical tests.</p>
            <p>It is written for people who need real statistical methods but don’t want to set up a Python environment: students, analysts and researchers who work with spreadsheets.</p>`,
        },
        {
          id: 'motivation',
          title: 'Motivation',
          body: html`
            <p>RI2 is the second life of <strong>RIDE</strong>, the no-code platform I built for my master’s thesis, <em>Rapid Insight Data Engine: Open-Source Framework for Agentic Automated Tabular Data Analysis</em>. The original was a Streamlit app deployed on Kubernetes, with an AutoML page and two LLM chat pages.</p>
            <p>Streamlit keeps a server process alive for every visitor, so a tool meant to be free had to run on paid, self-managed infrastructure. The chat pages also executed model-generated Python on the server, which was a real security risk. RI2 was rebuilt to remove the server entirely.</p>`,
        },
        {
          id: 'architecture',
          title: 'Architecture',
          body: html`
            <ol class="flow" aria-label="How a request travels through RI2">
              <li><span class="flow__k">UI</span>React pages, one per pipeline stage</li>
              <li><span class="flow__k">Bridge</span><code>callPy(fn, args)</code> RPC to a Web Worker</li>
              <li><span class="flow__k">Worker</span>Pyodide: CPython compiled to WebAssembly</li>
              <li><span class="flow__k">Python</span>pandas · numpy · scipy · scikit-learn · plotly</li>
            </ol>
            <ul>
              <li><strong>Python in a worker.</strong> <code>pyodide.worker.ts</code> loads Pyodide and the scientific stack, then executes the project’s own Python modules into a shared namespace. A <code>dispatch()</code> registry exposes those functions to the UI.</li>
              <li><strong>One source of truth for the pipeline.</strong> <code>pagesConfig.ts</code> defines the stage order and drives the sidebar, the completion dots and the previous/next cards.</li>
              <li><strong>Dataset state.</strong> A React context tracks loaded and derived dataset previews and which stages are complete.</li>
              <li><strong>Deployment.</strong> Every push to <code>main</code> builds with Vite and publishes static files to GitHub Pages through GitHub Actions.</li>
            </ul>`,
        },
        {
          id: 'implementation',
          title: 'Implementation and trade-offs',
          body: html`
            <ul>
              <li><strong>Privacy by architecture.</strong> Every transform runs locally, so uploaded data is never sent anywhere. The trade-off is a slower first load while the Python runtime boots, which the app shows as a kernel status indicator.</li>
              <li><strong>Features that didn’t survive the move.</strong> AutoML depended on xgboost, lightgbm and multiprocessing, which have no WebAssembly equivalent, so it was cut along with the chat pages rather than shipped half-working.</li>
              <li><strong>AI explanations without a shared key.</strong> The optional “AI Insight” buttons call OpenAI with the visitor’s own key through a stateless Cloudflare Worker that only forwards CORS requests. Until it is configured, those buttons show a notice instead of an error, and the rest of the app works without it.</li>
            </ul>`,
        },
        {
          id: 'results',
          title: 'What it does today',
          body: html`
            <ul class="checklist">
              <li>Feature engineering: type fixes, duplicate removal, 8 imputation strategies, categorical encoding and 8 scaling or transformation methods</li>
              <li>15+ chart types across basic, advanced, specialized and geospatial categories</li>
              <li>Skewness and kurtosis, normality tests and IQR outlier detection</li>
              <li>6 hypothesis tests: t-test, ANOVA, chi-square, Mann–Whitney, Wilcoxon and Kruskal–Wallis</li>
            </ul>`,
        },
        {
          id: 'next',
          title: 'Lessons and next steps',
          body: html`
            <p>Moving computation into the browser removed the hosting cost and the security risk, but it moved the cost onto first load. The open work listed in the repository is code-splitting: Plotly currently lands in one large JavaScript chunk, and loading it lazily would speed up the first visit.</p>`,
        },
      ],
    },
  },

  // ---------------------------------------------------------------- WRANG
  {
    slug: 'wrang',
    title: 'WRANG',
    shortTitle: 'WRANG',
    kicker: 'Data tool · CLI',
    summary:
      'Terminal-native data wrangling on Polars: inspect, clean, transform, query with SQL and export datasets from an interactive menu, a scriptable CLI or a Python API.',
    categories: ['data-tools'],
    tech: ['Python', 'Polars', 'DuckDB', 'Rich'],
    tone: 'butter',
    visual: { type: 'terminal' },
    repo: `${GH}/wrang`,
    demo: { label: 'PyPI', href: 'https://pypi.org/project/wrang/' },
    featured: 2,
    caseStudy: {
      lead:
        'WRANG loads, inspects, cleans, transforms and exports datasets from the terminal with no boilerplate, interactively, from a script or in CI.',
      facts: [
        ['Type', 'Python package and CLI'],
        ['Stack', 'Python 3.10+ · Polars · Rich · DuckDB (optional)'],
        ['Install', 'pip install wrang'],
        ['License', 'MIT'],
      ],
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          body: html`
            <p>WRANG is a data-wrangling toolkit with three ways in: an interactive, menu-driven terminal session; non-interactive flags for scripts and CI; and a Python library whose modules can be imported on their own. It reads and writes CSV, Excel, Parquet and JSON or JSON Lines.</p>`,
        },
        {
          id: 'motivation',
          title: 'Where it came from',
          body: html`
            <p>WRANG succeeds <a href="${GH}/ride-cli">RIDE-CLI</a>, the command-line half of my master’s project. Installing it adds both a <code>wrang</code> and a <code>ride</code> command, identical aliases, so existing <code>ride</code> scripts keep working.</p>`,
        },
        {
          id: 'architecture',
          title: 'Architecture',
          body: html`
            <ul>
              <li><strong>Core modules</strong>: loader, inspector, explorer, cleaner, transformer and validator, each built on Polars DataFrames, with lazy scanning for large files.</li>
              <li><strong>CLI layer</strong>: an interface, menus and formatters that render tables and panels with Rich.</li>
              <li><strong>Optional extras</strong>: <code>wrang[viz]</code> adds matplotlib and seaborn, and <code>wrang[advanced]</code> adds DuckDB and ConnectorX.</li>
              <li><strong>Configuration</strong>: user preferences such as the outlier factor and chunk size are kept in <code>~/.wrang/config.json</code>.</li>
            </ul>`,
        },
        {
          id: 'implementation',
          title: 'Implementation',
          body: html`
            <ul>
              <li><strong>Chainable cleaning and transforms.</strong> <code>DataCleaner</code> and <code>DataTransformer</code> return themselves, so a pipeline reads top to bottom. There are nine imputation strategies, including distribution sampling and KNN.</li>
              <li><strong>SQL on any file.</strong> <code>--sql</code> runs DuckDB against the loaded file as a table named <code>data</code>.</li>
              <li><strong>Built for automation.</strong> <code>--inspect --output-format json</code> prints a machine-readable overview. <code>--chunk-size</code> streams large files, and <code>--compare</code> diffs two datasets.</li>
              <li><strong>Data contracts.</strong> A schema can be inferred from data, saved as JSON or YAML, and validated later, with violations reported by severity.</li>
              <li><strong>Reports.</strong> <code>--profile</code> writes a self-contained HTML profile of a dataset.</li>
            </ul>`,
        },
        {
          id: 'results',
          title: 'In use',
          body: html`
            <p>Real output from <code>wrang</code> 0.2.2, installed from PyPI and run on the Titanic dataset bundled with the repository:</p>
            <figure class="term" aria-label="Terminal output of a DuckDB SQL query in WRANG">
              <div class="term__bar" aria-hidden="true"><span></span><span></span><span></span></div>
              <pre tabindex="0"><code><span class="term__p">$</span> wrang titanic.csv --sql "SELECT Pclass, COUNT(*) AS n,
    ROUND(AVG(Survived),3) AS survival_rate
    FROM data GROUP BY Pclass ORDER BY Pclass"

  Pclass   n     survival_rate
 ──────────────────────────────
  1        216   0.63
  2        184   0.473
  3        491   0.242

3 row(s)</code></pre>
            </figure>
            <p>The repository’s README reports a test suite of 217 passing tests (plus 2 expected failures), and releases are published to PyPI from GitHub Actions.</p>`,
        },
      ],
    },
  },

  // ---------------------------------------------------------------- TinyLM
  {
    slug: 'tiny-language-models',
    title: 'TinyLM Lab',
    shortTitle: 'TinyLM Lab',
    kicker: 'Language models · Research',
    summary:
      'Pretraining a 26.7M-parameter Llama-style model from random initialization on one laptop GPU, then checking what it learned against memorization, leakage and controlled ablations.',
    categories: ['genai', 'research', 'ai-ml'],
    tech: ['PyTorch', 'Transformers', 'BPE tokenizer', 'TinyStories'],
    tone: 'lavender',
    visual: {
      type: 'image',
      name: 'tiny-language-models',
      alt: 'The TinyLM Lab project page: headline figures of 1.384 test loss, 29.9% of the official validation split copied from training, −0.194 loss gained by the modern recipe, and a 6.3-hour training run.',
    },
    repo: `${GH}/tiny-language-models`,
    demo: { label: 'Read the findings', href: 'https://sudhanshumukherjeexx.github.io/tiny-language-models/' },
    featured: 3,
    caseStudy: {
      lead:
        'How much language-modelling ability can a modern 27M-parameter decoder learn from random initialization, and how do you tell real ability apart from memorization?',
      facts: [
        ['Model', '26,747,392 parameters, 8 layers, d = 512'],
        ['Data', 'TinyStories, 442M training tokens'],
        ['Hardware', 'One RTX 3050 Ti Laptop GPU, 6.26 h'],
        ['Result', 'Test loss 1.3842 (perplexity 3.99)'],
      ],
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          body: html`
            <p>TinyLM Lab is a complete, tested pretraining pipeline: data preparation with exact token accounting, a custom tokenizer, a training loop that resumes exactly, a three-way train/validation/test protocol, generation evaluation, memorization and leakage analysis, hardware benchmarks and controlled architecture ablations.</p>
            <p>The tokenizer and every weight are trained from random initialization. The production model uses Hugging Face’s <code>LlamaForCausalLM</code> class. A framework-free implementation of every component is included for learning, and a test confirms it reproduces the Hugging Face model’s logits exactly.</p>`,
        },
        {
          id: 'motivation',
          title: 'Motivation',
          body: html`
            <p>Running a training notebook is easy. Knowing what the trained model can and cannot do is harder. An earlier notebook run reported a validation loss of 1.4148, but about 30% of that validation split also appeared in the training data, the same split had selected the checkpoint, and the run had been resumed partway through in a way that showed up as a jump in the loss curve. This project rebuilt the experiment so that every reported number can be traced to a recorded output file.</p>`,
        },
        {
          id: 'architecture',
          title: 'Architecture',
          body: html`
            <div class="table-wrap" role="region" aria-label="Model architecture" tabindex="0">
              <table>
                <thead><tr><th scope="col">Component</th><th scope="col">Choice</th></tr></thead>
                <tbody>
                  <tr><td>Decoder</td><td>8 pre-norm blocks, d = 512, no biases</td></tr>
                  <tr><td>Attention</td><td>Grouped-query: 8 query / 2 KV heads, head dim 64</td></tr>
                  <tr><td>Positions</td><td>RoPE, θ = 10,000</td></tr>
                  <tr><td>Normalization</td><td>RMSNorm</td></tr>
                  <tr><td>Feed-forward</td><td>SwiGLU, 512 → 1,408 → 512 (64.7% of parameters)</td></tr>
                  <tr><td>Embeddings</td><td>Tied input/output, 8,192 × 512</td></tr>
                  <tr><td>Tokenizer</td><td>8,192-token byte-level BPE trained on the train split only</td></tr>
                  <tr><td>Context</td><td>512 tokens, which holds about 95% of stories end to end</td></tr>
                </tbody>
              </table>
            </div>`,
        },
        {
          id: 'implementation',
          title: 'Implementation',
          body: html`
            <ul>
              <li><strong>A decontaminated test set.</strong> 6,582 of the 21,989 stories in TinyStories’ official validation split (29.9%) have an exact copy in the training split. Those stories are removed, and the rest becomes the test set, which is evaluated once, after model selection.</li>
              <li><strong>A hand-written training loop</strong> instead of <code>transformers.Trainer</code>: AdamW, a 6e-4 peak learning rate with warmup and cosine decay, bf16 autocast, and validation every 250 steps.</li>
              <li><strong>Exact resume.</strong> Checkpoints hold the model, optimizer, scheduler, RNG states and data position. A test checks that stopping and resuming gives bitwise-identical weights on CPU.</li>
              <li><strong>Memorization checks.</strong> Every 8-, 16- and 32-token n-gram of each generation is checked against all ~460M training tokens. Held-out human-written stories serve as the baseline, not zero.</li>
            </ul>`,
        },
        {
          id: 'results',
          title: 'Results',
          body: html`
            <figure class="figure">
              <img src="/assets/img/work/tinylm-training-curve-1600.webp" srcset="/assets/img/work/tinylm-training-curve-900.webp 900w, /assets/img/work/tinylm-training-curve-1600.webp 1600w" sizes="(min-width: 960px) 880px, 100vw" width="1600" height="427" loading="lazy" decoding="async" alt="Three charts from the 12,000-step run: training and validation loss falling smoothly from about 8.4 to 1.4, a cosine learning-rate schedule peaking at 0.0006, and throughput mostly near 21,700 tokens per second with dips between steps 5,200 and 6,800.">
              <figcaption>Loss, learning-rate schedule and throughput for the main run. The dips in throughput were not instrumented; laptop thermal throttling is the likely cause.</figcaption>
            </figure>
            <ul class="checklist">
              <li><strong>Test loss 1.3842 (perplexity 3.99)</strong> on 15,388 held-out stories, 3.13M predicted tokens</li>
              <li>Validation loss improved at all 48 evaluations, with no sign of overfitting at 0.95 epochs</li>
              <li>Generations are no closer to their nearest training story than held-out human stories are (median TF-IDF similarity 0.255 vs. 0.250). 2.2% contain a verbatim 32-token span, against 7.5% of held-out stories.</li>
              <li>On a Core i5-11300H CPU, generation decodes at 89 tokens per second with a 25 ms time to first token</li>
            </ul>
            <h3>Ablations</h3>
            <p>Five parameter-matched variants, three seeds each, with the same implementation and data order:</p>
            <div class="table-wrap" role="region" aria-label="Ablation results" tabindex="0">
              <table>
                <thead><tr><th scope="col">Variant</th><th scope="col" class="num">Val loss (mean ± sd)</th><th scope="col" class="num">Δ vs. previous</th></tr></thead>
                <tbody>
                  <tr><td>GPT-style baseline</td><td class="num">2.2208 ± 0.0019</td><td class="num">—</td></tr>
                  <tr><td>+ RoPE</td><td class="num">2.0848 ± 0.0042</td><td class="num">−0.136</td></tr>
                  <tr><td>+ RMSNorm</td><td class="num">2.0887 ± 0.0028</td><td class="num">+0.004</td></tr>
                  <tr><td>+ SwiGLU</td><td class="num">2.0600 ± 0.0183</td><td class="num">−0.029</td></tr>
                  <tr><td>+ GQA (production)</td><td class="num">2.0268 ± 0.0143</td><td class="num">−0.033</td></tr>
                </tbody>
              </table>
            </div>
            <p>RoPE was the single most important change, at about 50× the seed-to-seed spread. RMSNorm made no difference to quality at this scale. These are early-training comparisons, at about 5.6% of the main run’s token budget.</p>`,
        },
        {
          id: 'next',
          title: 'Lessons',
          body: html`
            <p>Most of the work went into evaluation, not training. The number that first looked best came from a contaminated split. The measurements that held up came from deciding up front which split answers which question and recording where every figure came from.</p>`,
        },
      ],
    },
  },

  // ---------------------------------------------------------------- Kaku
  {
    slug: 'tiny-editor',
    title: 'Kaku — Tiny Editor',
    shortTitle: 'Kaku',
    kicker: 'Web app · Product design',
    summary:
      'A calm, private writing room in a browser tab: rich text, stationery-inspired themes and local export, with nothing ever saved or uploaded.',
    categories: ['web'],
    tech: ['React 19', 'TypeScript', 'Tiptap', 'Playwright'],
    tone: 'sakura',
    visual: {
      type: 'image',
      name: 'tiny-editor',
      alt: 'The Kaku editor: a quiet toolbar above a single sheet of paper holding a short note in a typewriter font and a two-item checklist, with a “Nothing is saved” notice above.',
    },
    repo: `${GH}/tiny-editor`,
    demo: { label: 'Start writing', href: 'https://sudhanshumukherjeexx.github.io/tiny-editor/' },
    featured: 4,
    caseStudy: {
      lead:
        'Kaku (書く, “to write”) is somewhere between a notepad, a minimal rich-text editor, Japanese stationery and a retro typewriter. Open, write, make it beautiful, export, leave.',
      facts: [
        ['Type', 'Static web application'],
        ['Stack', 'React 19 · TypeScript · Vite · Tiptap 3 · Tailwind CSS 4'],
        ['Tested with', 'Vitest and Playwright (desktop and mobile)'],
        ['License', 'MIT'],
      ],
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          body: html`
            <p>Kaku is a single continuous sheet of paper with a quiet toolbar. There are no accounts and no cloud storage. When the tab closes, the page is blank again, and that is deliberate.</p>`,
        },
        {
          id: 'motivation',
          title: 'Motivation',
          body: html`
            <p>Most writing tools want you to sign in, sync and keep everything forever. Kaku is for the opposite case: a short piece you want to write well, format nicely and take with you as a file, without leaving a copy anywhere.</p>`,
        },
        {
          id: 'architecture',
          title: 'Architecture',
          body: html`
            <ul>
              <li><strong>Memory only.</strong> The document lives in the tab’s memory and is never written to <code>localStorage</code>, <code>sessionStorage</code>, IndexedDB or cookies. Preferences reset with the tab too. If there is text on the page, the browser asks before you leave.</li>
              <li><strong>Local export.</strong> Markdown, plain text, standalone HTML (with a restrictive Content-Security-Policy) and print-to-PDF are generated in the browser and downloaded through <code>Blob</code> URLs. To-do lists can also be exported as a 1080px PNG card drawn with the Canvas API.</li>
              <li><strong>No third-party requests.</strong> Fonts are bundled through Fontsource and loaded only when you pick them, and there are no analytics.</li>
            </ul>`,
        },
        {
          id: 'implementation',
          title: 'Implementation',
          body: html`
            <ul>
              <li>A rich-text editor built on Tiptap and ProseMirror: headings, lists, checklists, quotes, code, links, alignment, highlighter and ink colours, plus a floating toolbar on selection, a <kbd>/</kbd> slash menu and a command palette.</li>
              <li>Eight themes (Typewriter, Sakura, Matcha, Seoul Morning, Peach Milk, Lavender Study, Tokyo Night and AR Console), nine curated fonts including Noto Sans JP and KR, and five paper styles.</li>
              <li>Writing aids: focus and typewriter modes, a word goal and a writing timer, and live counts that handle Japanese and Korean text.</li>
              <li>Optional typewriter sounds synthesized at runtime, with no audio files. Decorative effects are CSS-driven and respect <code>prefers-reduced-motion</code>.</li>
            </ul>`,
        },
        {
          id: 'results',
          title: 'How it’s verified',
          body: html`
            <p>Unit tests cover the exporters, word counts, file names and URLs. Playwright browser tests cover formatting, export and printing, and check that nothing survives a reload or reaches browser storage. The deploy workflow runs both suites before publishing to GitHub Pages.</p>`,
        },
      ],
    },
  },

  // ---------------------------------------------------------------- Power BI
  {
    slug: 'power-bi',
    title: 'The Power BI Fellowship',
    shortTitle: 'Power BI Fellowship',
    kicker: 'Education · Analytics',
    summary:
      'A free, open-source way to learn Power BI by doing the job: checkable skill exercises, then tickets, incidents and architecture decisions at a fictional company.',
    categories: ['education', 'analytics', 'web'],
    tech: ['Power BI', 'DAX', 'SQL', 'Static site'],
    tone: 'butter',
    visual: {
      type: 'image',
      name: 'power-bi',
      alt: 'The Power BI Fellowship home page: “Learn Power BI by doing the work.” above three paths: learn the skills, practise real work and prepare for interviews.',
    },
    repo: `${GH}/power-bi`,
    demo: { label: 'Open the site', href: 'https://sudhanshumukherjeexx.github.io/power-bi/' },
    featured: 5,
    caseStudy: {
      lead:
        'Most Power BI courses teach features. This one teaches the job: the vague requests, disputed numbers, failed refreshes and design decisions that BI developers usually meet only after years at work.',
      facts: [
        ['Type', 'Open-source learning platform'],
        ['Content', '3 levels · 7 tracks · 18 scenarios · 30 guides'],
        ['Runs on', 'GitHub Pages; progress stays in the browser'],
        ['License', 'MIT'],
      ],
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          body: html`
            <p>The Fellowship is organized as Learn → Practise → Debug → Ship → Operate → Architect. It needs no account and no server, and it tracks nothing by default.</p>
            <ul>
              <li><strong>Skill Mode</strong>: three levels and seven tracks (SQL for BI, warehousing, testing, automation and APIs, governance, Fabric and modern Power BI). Each assignment has an expected result you can check and a worked solution.</li>
              <li><strong>Experience Mode</strong>: ten connected sprints and eight drills at Northwind Outdoors, a fictional retailer, with emails, chat messages, evidence files, progressive hints, a rubric and a model answer.</li>
              <li><strong>BI Developer Toolkit</strong>: one search across 30 guides, including “what’s broken?” decision trees, a performance clinic, a production runbook and an error decoder, plus a library of templates and datasets.</li>
            </ul>`,
        },
        {
          id: 'motivation',
          title: 'Motivation',
          body: html`
            <p>I spent several years building and administering Power BI reports. Most of the hard parts of that job are not features. They are judgment calls: reconciling a number Finance disputes, finding why a page takes 18 seconds, deciding between a hotfix and a rollback. The Fellowship hands you the evidence and makes you decide.</p>`,
        },
        {
          id: 'architecture',
          title: 'How it’s built',
          body: html`
            <figure class="figure">
              <img src="/assets/img/work/power-bi-experience-1200.webp" srcset="/assets/img/work/power-bi-experience-640.webp 640w, /assets/img/work/power-bi-experience-1200.webp 1200w" sizes="(min-width: 960px) 880px, 100vw" width="1200" height="750" loading="lazy" decoding="async" alt="An Experience Mode incident ticket, INC-2044: “The executive dashboard takes 18 seconds”, reported by the fictional CEO, with priority, a five-hour time box, and a Take the ticket button.">
              <figcaption>An Experience Mode incident. Labels read the way a reporter writes them and never name the cause.</figcaption>
            </figure>
            <ul>
              <li>Content lives as JSON in <code>content/</code>, and a build step in <code>tools/</code> generates the static site.</li>
              <li>Pages are readable without JavaScript, and the build fails if a hint, rubric or model answer leaks into them.</li>
              <li>Any scenario can be made available offline.</li>
            </ul>`,
        },
        {
          id: 'implementation',
          title: 'Tested, not trusted',
          body: html`
            <ul class="checklist">
              <li>Every dataset is generated from a fixed seed, and its counts, nulls, duplicates, keys and planted defects are asserted. Expected results are computed from that data at build time.</li>
              <li>SQL answers are executed on SQLite and on SQL Server 2022, and both engines must return the same rows.</li>
              <li>Critical journeys, accessibility (axe-core, both themes) and layout at four widths are tested in a real browser on every push. Nothing deploys unless everything passes.</li>
              <li>Fast-moving content carries a verification date, and an issue opens automatically when its review is due.</li>
            </ul>`,
        },
        {
          id: 'results',
          title: 'Progress you can trust',
          body: html`
            <p>Progress is shown separately as <em>verified</em> (your first quiz answer), <em>self-assessed</em> and <em>recall</em> (spaced repetition), and each figure explains how it is calculated. Professional stages, from Data Analyst to Architect, are cleared by finishing well-rated scenarios, not by ticking boxes.</p>`,
        },
      ],
    },
  },

  // ---------------------------------------------------------------- RAG
  {
    slug: 'self-correcting-rag',
    title: 'Self-Correcting Multi-Document RAG',
    shortTitle: 'Self-Correcting RAG',
    kicker: 'Generative AI · Document intelligence',
    summary:
      'Question answering and summarization over multiple documents, with agents that filter irrelevant context, score each answer’s factual consistency and regenerate weak answers.',
    categories: ['genai', 'ai-ml'],
    tech: ['LangChain', 'OpenAI', 'FAISS', 'Gradio'],
    tone: 'sky',
    visual: { type: 'pipeline' },
    repo: `${GH}/mutiple-document-rag-system`,
    demo: { label: 'Hugging Face Space', href: 'https://huggingface.co/spaces/sudhanshumukherjeexx/rag-chatbot' },
    featured: 6,
    caseStudy: {
      lead:
        'A retrieval-augmented generation system that doesn’t trust its first answer: it filters what it retrieves, grades what it writes, and tries again when the grade is low.',
      facts: [
        ['Type', 'Python application: CLI and Gradio web UI'],
        ['Stack', 'LangChain · OpenAI · FAISS · Sentence Transformers'],
        ['Inputs', 'PDF, TXT and Markdown'],
        ['License', 'MIT'],
      ],
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          body: html`
            <p>You give the system several documents. It can summarize them, or build a knowledge base you can question from the command line, an interactive session or a Gradio web interface. The demo runs on Hugging Face Spaces, which puts it to sleep when idle, so the first request may take a moment.</p>`,
        },
        {
          id: 'architecture',
          title: 'Pipeline',
          body: html`
            <ol class="flow" aria-label="The self-correcting pipeline">
              <li><span class="flow__k">1 · Retrieve</span>Vector similarity search over FAISS (top 5 chunks)</li>
              <li><span class="flow__k">2 · Guardrail</span>An agent drops irrelevant chunks; checks run in parallel</li>
              <li><span class="flow__k">3 · Generate</span>A context-aware answer from the filtered chunks</li>
              <li><span class="flow__k">4 · Evaluate</span>Factual consistency scored 1–5; below 3, back to step 3</li>
            </ol>
            <p>Regeneration is capped at three attempts, and the best-scoring answer is returned. The threshold, attempt count, models and chunking are all set in YAML: by default, GPT-4o generates answers and GPT-4o-mini summarizes. Summaries use a map-reduce strategy, so long documents are summarized in chunks and then combined.</p>`,
        },
        {
          id: 'implementation',
          title: 'Engineering',
          body: html`
            <ul>
              <li>Modules for loaders, processing (summarizer and vector store), agents and pipeline, behind a CLI with <code>summarize</code>, <code>create-kb</code>, <code>query</code>, <code>interactive</code> and <code>metrics</code> commands.</li>
              <li>Input validation with path-traversal protection and suspicious-pattern detection.</li>
              <li>Structured, rotating logs, plus metrics for per-stage latency, score distribution, token usage and filter rejection rates, saved to <code>logs/metrics.json</code>.</li>
              <li>Caching for the vector store and embeddings.</li>
            </ul>`,
        },
        {
          id: 'next',
          title: 'Limitations',
          body: html`
            <p>It needs an OpenAI API key and an internet connection, and it accepts PDF, TXT and Markdown only. A self-assigned consistency score is a useful filter, not a guarantee. The evaluator is itself a language model, so a confident wrong answer can still pass.</p>`,
        },
      ],
    },
  },

  // ---------------------------------------------------------------- CIFAR
  {
    slug: 'cifar100-architecture-comparison',
    title: 'Deep Learning Architectures on CIFAR-100',
    shortTitle: 'CIFAR-100 benchmark',
    kicker: 'Computer vision · Benchmark',
    summary:
      'Fourteen architectures, from logistic regression and LeNet to EfficientNet and Vision Transformers, compared on accuracy, training time and parameter efficiency.',
    categories: ['ai-ml', 'research'],
    tech: ['PyTorch', 'Transfer learning', 'Mixed precision', 'Colab L4'],
    tone: 'lavender',
    visual: { type: 'cover', glyph: 'grid', tone: 'lavender' },
    repo: `${GH}/deep-learning-architecture-comparison-on-CIFAR100`,
    detail: {
      bars: [
        ['EfficientNet-B2', 85.48],
        ['EfficientNet-B0', 84.6],
        ['EfficientNet-Lite0', 83.14],
        ['ResNet-50', 82.9],
        ['RegNet-Y-400MF', 81.95],
        ['MobileNet-V3-Small', 79.35],
        ['ResNet-18', 78.56],
        ['DeiT-Small', 64.21],
        ['ViT-Base-16', 54.79],
        ['SimpleCNN', 38.95],
        ['AlexNet', 33.81],
        ['LeNet', 30.16],
        ['Logistic regression', 11.9],
        ['Swin-Tiny', 3.03],
      ],
      note:
        'Images were resized to 224×224, and the strongest models start from ImageNet-pretrained weights, so the top results measure transfer learning rather than training from scratch. Swin-Tiny’s 3.03% most likely reflects a failed run; the repository marks itself as experimental.',
    },
  },

  // ---------------------------------------------------------------- Medical VQA
  {
    slug: 'medical-vqa',
    title: 'Multimodal Medical Visual Question Answering',
    shortTitle: 'Medical VQA',
    kicker: 'Multimodal AI · Research',
    summary:
      'Fine-tuning LLaVA-1.5-7B with LoRA to answer questions about radiology images, evaluated with a custom token-level F1 pipeline.',
    categories: ['genai', 'research', 'ai-ml'],
    tech: ['LLaVA-1.5-7B', 'LoRA', 'PEFT', 'Hugging Face'],
    tone: 'sky',
    visual: { type: 'cover', glyph: 'eye', tone: 'sky' },
    links: [
      { label: 'Colab notebook', href: 'https://colab.research.google.com/drive/1IYagJe_EAu6_iaw1I0S3CgOp2hqubw06?usp=sharing' },
    ],
  },

  // ---------------------------------------------------------------- GoDaddy
  {
    slug: 'godaddy-microbusiness-forecasting',
    title: 'GoDaddy Microbusiness Density Forecasting',
    shortTitle: 'GoDaddy forecasting',
    kicker: 'Forecasting · Kaggle',
    summary:
      'Forecasting monthly microbusiness density for U.S. counties in a Kaggle competition, finishing in the top 24% of teams.',
    categories: ['analytics', 'ai-ml'],
    tech: ['Time series', 'Extra Trees', 'XGBoost', 'LightGBM'],
    tone: 'sage',
    visual: { type: 'cover', glyph: 'line', tone: 'sage' },
    detail: {
      points: [
        ['Objective', 'Forecast microbusinesses per 100 adults, by county and month, from GoDaddy’s Venture Forward data.'],
        ['Features', 'County history plus Census ACS indicators: broadband access, college education, foreign-born population, IT workforce and median income.'],
        ['Approach', 'Tree-based regressors compared on the same features; the write-up covers why Extra Trees stood out.'],
        ['Metric', 'SMAPE, the competition’s official metric.'],
        ['Outcome', 'Top 24% of teams on the leaderboard.'],
      ],
    },
    links: [
      { label: 'Write-up', href: 'https://hustledata.substack.com/p/from-underdog-to-top-contender-how' },
      { label: 'Competition', href: 'https://www.kaggle.com/competitions/godaddy-microbusiness-density-forecasting' },
    ],
  },

  // ---------------------------------------------------------------- Soccer
  {
    slug: 'la-liga-soccer-analytics',
    title: 'Soccer Analytics: La Liga',
    shortTitle: 'La Liga analytics',
    kicker: 'Sports analytics · Deep learning',
    summary:
      'A PyTorch classifier that predicts La Liga match results (win, draw or loss) from FBref match statistics, with a Streamlit dashboard for exploring team performance.',
    categories: ['analytics', 'ai-ml'],
    tech: ['PyTorch', 'Streamlit', 'Plotly', 'pandas'],
    tone: 'butter',
    visual: { type: 'cover', glyph: 'pitch', tone: 'butter' },
    detail: {
      points: [
        ['Data', 'La Liga match statistics from FBref: 2015–2021 seasons for training, 2022–23 for testing.'],
        ['Features', 'Goals, expected goals (xG and xGA), possession, shots, and shot- and goal-creating actions.'],
        ['Model', 'A multi-class neural network in PyTorch on min–max normalized features, predicting win, draw or loss.'],
        ['Dashboard', 'A Streamlit and Plotly dashboard for team performance. The hosted copy currently asks for a sign-in, so it isn’t linked here.'],
      ],
    },
    repo: `${GH}/Soccer_Analytics_La_Liga_Data`,
    links: [{ label: 'Write-up', href: 'https://hustledata.substack.com/p/multiclass-classification-using-neural' }],
  },

  // ---------------------------------------------------------------- PyTorch Playground
  {
    slug: 'pytorch-playground',
    title: 'PyTorch Playground',
    shortTitle: 'PyTorch Playground',
    kicker: 'Learning lab · Education',
    summary:
      'An interactive PyTorch curriculum in a single HTML file: 21 chapters, checkpoint quizzes and five live labs that run real forward passes and backpropagation in the browser.',
    categories: ['education', 'web', 'ai-ml'],
    tech: ['PyTorch', 'Vanilla JS', 'Single file'],
    tone: 'sakura',
    visual: {
      type: 'image',
      name: 'pytorch-playground',
      alt: 'PyTorch Playground: a chapter sidebar in four acts beside the headline “Learn PyTorch the way PyTorch learns: by backpropagating.” and a live Autograd Tape lab showing a computational graph.',
    },
    repo: `${GH}/PyTorch-Playground`,
    demo: { label: 'Open the playground', href: 'https://sudhanshumukherjeexx.github.io/PyTorch-Playground/' },
  },
];

/** Earlier work, kept for the record and superseded or smaller in scope. */
export const archive = [
  {
    title: 'RIDE-CLI',
    note: 'The first command-line data analysis tool from my master’s project, now succeeded by WRANG.',
    links: [
      { label: 'Source', href: `${GH}/ride-cli` },
      { label: 'Docs', href: 'https://sudhanshumukherjeexx.github.io/ride-cli/' },
    ],
  },
  {
    title: 'RIDE (Streamlit)',
    note: 'The original no-code platform from my thesis, with AutoML and LLM chat pages. It is preserved in RI2’s Archive folder.',
    links: [{ label: 'Archive', href: `${GH}/ri2/tree/main/Archive` }],
  },
  {
    title: 'American Express default prediction',
    note: 'Gradient-boosted and linear models for credit default prediction on the AmEx Kaggle dataset, built for an advanced data mining course.',
    links: [{ label: 'Source', href: `${GH}/American_Express_Deafult_Prediction` }],
  },
  {
    title: 'High-performance sorting visualizer',
    note: 'Parallel sorting algorithms and scaling tests, built for a High Performance Scientific Computing class.',
    links: [{ label: 'Source', href: `${GH}/high_performance_sorting_visualizer` }],
  },
];

export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => a.featured - b.featured);

export const caseStudies = projects.filter((p) => p.caseStudy);

export const projectUrl = (p) => (p.caseStudy ? `/work/${p.slug}/` : null);
