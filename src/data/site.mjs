// Identity, links and navigation shared by every page.

export const site = {
  origin: 'https://www.sudhanshumukherjee.com',
  name: 'Sudhanshu Mukherjee',
  firstName: 'Sudhanshu',
  nameBengali: 'সুধাংশু মুখার্জি',
  role: 'Data scientist and AI/ML engineer',
  location: 'Massachusetts, USA',
  email: 'sudhanshumukherjee@proton.me',
  resume: '/pages/sudhanshu_mukherjee_resume.pdf',
  description:
    'Sudhanshu Mukherjee is a data scientist and AI/ML engineer building intelligent applications, language models, and practical developer tools.',
  ogImage: '/assets/img/og.png',
  links: {
    github: 'https://github.com/sudhanshumukherjeexx',
    linkedin: 'https://www.linkedin.com/in/sudhanshumukherjeexx/',
    newsletter: 'https://hustledata.substack.com/',
  },
};

export const nav = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/work/', label: 'Work', key: 'work' },
  { href: '/about/', label: 'About', key: 'about' },
  { href: '/writing/', label: 'Writing', key: 'writing' },
  { href: site.resume, label: 'Resume', key: 'resume', file: 'PDF' },
];
