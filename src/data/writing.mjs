// Articles published on the Hustle Data newsletter (Substack). Dates and
// word counts come from the newsletter's RSS feed; reading time assumes
// ~230 words per minute.

export const posts = [
  {
    title: '20 SQL Commands For Your Next Data Science Job',
    url: 'https://hustledata.substack.com/p/20-sql-commands-for-your-next-data',
    date: '2025-02-14',
    words: 658,
    category: 'Data Science',
    excerpt:
      'The SQL you are most likely to be asked about in a data science interview, one command at a time.',
  },
  {
    title: 'How to Evaluate Machine Learning Models using Classification Metrics: ROC, AUC, Precision, Recall, and Beyond',
    url: 'https://hustledata.substack.com/p/how-to-evaluate-machine-learning',
    date: '2024-11-18',
    words: 563,
    category: 'Machine Learning',
    excerpt: 'What each classification metric actually measures, with reusable code for every one of them.',
  },
  {
    title: 'Deep Learning is all about Gradient Descent Algorithm',
    url: 'https://hustledata.substack.com/p/deep-learning-is-all-about-gradient',
    date: '2023-10-25',
    words: 711,
    category: 'Machine Learning',
    excerpt: 'Backpropagation, gradient descent and stochastic gradient descent, and how they drive learning in neural networks.',
  },
  {
    title: 'Multiclass Classification using Neural Networks',
    url: 'https://hustledata.substack.com/p/multiclass-classification-using-neural',
    date: '2023-07-27',
    words: 1779,
    category: 'Tutorials',
    excerpt: 'Predicting La Liga match outcomes (win, draw, loss) with a neural network built in PyTorch.',
  },
  {
    title: 'Python Development Best Practices: Virtual Environments and requirements.txt',
    url: 'https://hustledata.substack.com/p/python-development-best-practices',
    date: '2023-07-10',
    words: 825,
    category: 'Engineering',
    excerpt: 'Why isolated environments and pinned dependencies keep Python projects from breaking.',
  },
  {
    title: 'From Underdog to Top Contender: How I Surpassed 76% of Teams on Kaggle',
    url: 'https://hustledata.substack.com/p/from-underdog-to-top-contender-how',
    date: '2023-07-01',
    words: 2319,
    category: 'Data Science',
    excerpt: 'A write-up of the GoDaddy microbusiness density forecasting competition: the data, the models and what worked.',
  },
  {
    title: 'Unleashing the Power of Dask: Conquer Data at Lightning Speed!',
    url: 'https://hustledata.substack.com/p/unleashing-the-power-of-dask-conquer',
    date: '2023-06-22',
    words: 696,
    category: 'Engineering',
    excerpt: 'Using Dask for data preprocessing and manipulation when a dataset outgrows pandas.',
  },
];

export const readingMinutes = (words) => Math.max(1, Math.ceil(words / 230));
