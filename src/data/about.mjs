// About-page content. Roles and dates follow the résumé linked from the site
// (pages/sudhanshu_mukherjee_resume.pdf) and the previous version of this
// website. Where the two disagree, the linked résumé wins.

export const journey = [
  {
    when: 'Sep 2025 – Jul 2026',
    role: 'Data Analyst',
    org: 'Community Dreams Foundation',
    place: 'Remote',
    note: 'Built a multi-agent analytics system in Python and LangChain, with four specialized agents that process biomedical data and generate recommendations. Reconciled BI dashboards against source databases with SQL.',
  },
  {
    when: 'Sep 2022 – May 2025',
    role: 'M.S. in Data Science',
    org: 'University of Massachusetts Dartmouth',
    place: 'Dartmouth, MA',
    note: 'Thesis: Rapid Insight Data Engine, an open-source framework for agentic, automated tabular data analysis. That work continues in RI2 and WRANG.',
  },
  {
    when: 'Sep 2023 – May 2025',
    role: 'Teaching Assistant',
    org: 'UMass Dartmouth',
    place: 'Dartmouth, MA',
    note: 'High Performance Scientific Computing (DSC 520): mentored graduate students on PyTorch, Python optimization and parallel computing. Earlier, ran C programming labs for CIS 190.',
  },
  {
    when: 'Dec 2023 – Aug 2024',
    role: 'Data Instructor',
    org: 'Digital Scholarship Hub, UMass Dartmouth',
    place: 'Dartmouth, MA',
    note: 'Taught hands-on workshops on data visualization with Plotly, LangChain and LLMs, SQL, machine learning basics and ArcGIS for faculty, students and staff.',
  },
  {
    when: 'Jun – Sep 2023',
    role: 'Data Science Intern',
    org: 'Camping World – Good Sam',
    place: 'Chicago, IL',
    note: 'Grouped 10,000+ RV floorplans into 344 categories with a clustering model, and extended an executive Power BI dashboard with custom DAX metrics.',
  },
  {
    when: 'Jul 2019 – Jul 2022',
    role: 'BI Developer',
    org: 'Maestro Intellect Private Limited',
    place: 'India',
    note: 'Delivered executive Power BI dashboards end to end, from requirements to DAX tuning, consolidated 30+ reports into one, and administered Power BI Report Server.',
  },
  {
    when: 'Summer 2018',
    role: 'Software Engineering Intern',
    org: 'Cojag Smart Technologies',
    place: 'India',
    note: 'Front-end interfaces and an IoT-based restaurant ordering system in Python and MySQL.',
  },
  {
    when: '2015 – 2019',
    role: 'B.E. in Computer Science',
    org: 'G.H. Raisoni College of Engineering',
    place: 'Nagpur, India',
    note: null,
  },
];

export const credentials = [
  'AWS Certified Machine Learning – Specialty (2025)',
  'Data Carpentry Certified Instructor (The Carpentries)',
];

export const interests = [
  {
    title: 'Language models & NLP',
    tone: 'lavender',
    text: 'Pretraining small models, retrieval-augmented generation, multimodal fine-tuning, and evaluation that holds up.',
    evidence: ['tiny-language-models', 'self-correcting-rag', 'medical-vqa'],
  },
  {
    title: 'Machine & deep learning',
    tone: 'sky',
    text: 'Architecture comparisons, forecasting, and the fundamentals of how networks actually learn.',
    evidence: ['cifar100-architecture-comparison', 'godaddy-microbusiness-forecasting', 'pytorch-playground'],
  },
  {
    title: 'Data engineering & analytics',
    tone: 'butter',
    text: 'Polars, SQL and DuckDB, Power BI and DAX, and the unglamorous work of making numbers reconcile.',
    evidence: ['wrang', 'power-bi', 'la-liga-soccer-analytics'],
  },
  {
    title: 'Developer tools',
    tone: 'sage',
    text: 'Small tools that remove a step from someone’s day, preferably without needing a server.',
    evidence: ['ri2', 'wrang'],
  },
  {
    title: 'Interactive applications',
    tone: 'sakura',
    text: 'Interfaces that are calm, private and fast, where the design is part of the function.',
    evidence: ['tiny-editor', 'power-bi'],
  },
];

export const offDuty = [
  { label: 'Swimming', glyph: 'wave' },
  { label: 'Gaming', glyph: 'pad' },
  { label: 'Reading', glyph: 'book' },
  { label: 'Building small things', glyph: 'spark' },
];
