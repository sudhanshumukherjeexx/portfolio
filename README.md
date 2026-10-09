# sudhanshumukherjee.com

Personal portfolio of Sudhanshu Mukherjee. The light theme is the default; dark mode is opt-in from the header toggle. A small, dependency-free static site generator renders `src/` into plain HTML at the repository root, and GitHub Pages serves it from `main` with the custom domain in `CNAME`.

## Working on the site

```bash
npm install          # dev tooling only: playwright-core and axe-core for tests
npm run build        # render src/ into the root (index.html, work/, about/, …)
npm run serve        # http://localhost:4173, behaves like GitHub Pages
npm test             # build + static checks + browser checks
```

Commit the built files along with the source. GitHub Pages serves whatever is in the repository root, so a source change without a rebuild never goes live.

### Where things live

| Path | What it is |
| --- | --- |
| `src/data/projects.mjs` | **The project registry.** Cards, filters, case studies and the sitemap are generated from it. |
| `src/data/about.mjs` | Journey timeline, credentials, interests |
| `src/data/writing.mjs` | Newsletter posts (title, URL, date, word count) |
| `src/data/site.mjs` | Name, email, links, navigation |
| `src/pages/*.mjs` | One module per page type |
| `src/components/*.mjs` | Layout shell, project cards, Bit the mascot, icons |
| `src/lib/html.mjs` | Tagged-template HTML builder that escapes interpolated values |
| `src/styles/site.css` | Every style: tokens, light/dark themes, components, mascot |
| `src/scripts/site.js` | Theme, menu, filters, table of contents, reveal, Bit |
| `assets/` | Built CSS/JS, self-hosted fonts, images |
| `scripts/` | Build, local server, checks, screenshot capture |

### Common edits

- **Add a project:** append an entry to `projects` in `src/data/projects.mjs`. Add `featured: n` to show it on the home page, and a `caseStudy` object to give it its own page at `/work/<slug>/`.
- **Add an article:** add it to `src/data/writing.mjs`. The word count drives the reading time.
- **Refresh project screenshots:** `node scripts/capture-projects.mjs <tmp-dir>` captures the live sites, then `python scripts/optimize-images.py <tmp-dir>` writes the WebP files (requires Pillow).
- **Regenerate the social image and icons:** `node scripts/render-brand-assets.mjs` (after a build).

## Bit

Bit is the site's mascot: a small pixel creature drawn as crisp SVG (reference art in `src/assets-src/mascot-reference.png`). On the home page it perches on the hero photo. On devices with a mouse it follows the cursor with spring physics (one `requestAnimationFrame` loop that stops once Bit settles). Its eyes track the pointer, its legs step while it moves, it looks curious over project cards and happy over links, bounces on clicks, leans when you scroll, waves at the contact section, and falls asleep after 20 seconds of inactivity. The header toggle turns it off, and that choice is saved in `localStorage`. On touch devices and with `prefers-reduced-motion`, Bit stays perched on the hero photo and never follows the pointer. The companion has `pointer-events: none` and `aria-hidden="true"`.

## Checks

- `npm run check`: internal links and anchors, titles, descriptions, canonicals, one `<h1>` per page, image alt text. Add `-- --external` to request every external link.
- `npm run test:browser`: runs in a locally installed Microsoft Edge (`BROWSER_CHANNEL=chrome` for Chrome). It checks for horizontal overflow at 320–1920px, console errors, axe-core in light and dark themes, the mascot on desktop, touch and reduced motion, filters, the mobile menu, theme persistence and legacy redirects.

## Deployment

GitHub Pages builds from the `main` branch, root folder. `.nojekyll` turns off Jekyll processing. Old URLs (`/pages/projects.html`, `/pages/blogs.html`, `/pages/archives.html`) are kept as redirect pages, and the résumé stays at `/pages/sudhanshu_mukherjee_resume.pdf`.

Fonts (Manrope, Inter, JetBrains Mono) are self-hosted under the SIL Open Font License. Icon paths are adapted from Lucide (ISC License).
