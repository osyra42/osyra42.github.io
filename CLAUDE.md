# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static personal website for Coffee Byte Dev (coffeebyte.dev), hosted on GitHub Pages. The site is a portfolio and content hub featuring educational tools, creative writing, project showcases, and mini-games.

## Architecture

### Core Structure
- **Root HTML pages**: Main site pages (index.html, support_me.html, etc.)
- **assets/**: Shared resources for the main site
  - `css/styles.css`: Entry stylesheet — `@import`s all the partials below in order (theme → sidebar → main → brewdown → mobile → print). Pages link only `styles.css`.
  - `css/theme.css`: `:root` CSS variables (coffee theme) and global/body layout
  - `css/sidebar.css`: Sidebar styles
  - `css/main.css`: `<main>` element / content styles
  - `css/brewdown.css`: Styling for brewdown-rendered content
  - `css/mobile.css`: ALL mobile-specific styles (768px breakpoint)
  - `css/print.css`: Print styles (used by the "Save as PDF" pages)
  - `js/sidebar.js`: Dynamic sidebar generation with navigation links
  - `js/scripts.js`: General utilities and clutter toggle functionality
  - `js/brewdown.js`: Markdown-to-HTML converter (two modes: `<div class="brewdown">` and `<script data-brewdown>`)
  - `js/mobile.js`: Mobile responsive behavior
  - `js/back-to-top.js`: Back to top button functionality

### Key Subsections
- **operation_chimera/**: Markdown story content, organized like an MMO — `main/part N - {book}/` for the main-story parts (the Chimera Incident), `side/{book}/` for side-story chapters, and `lore/` for the wiki/codex (characters, locations, world lore). Each book/part has its own root HTML page (e.g. `oc_blood_relation.html`, `oc_mireheart.html`, `oc_part1.html`, `oc_borne_weapon.html`, `oc_lore.html`); `operation_chimera.html` is the hub that links them.
- **blank_pixel_game/**: Browser game build (HTML5 export under `html5game/`)
- **sipsip/**: Sip Sip card game and its `decks/`

## Main Page Pattern

All main site pages follow this structure:
```html
<head>
  <link rel="stylesheet" href="assets/css/styles.css" />
  <link rel="stylesheet" href="assets/highlight/styles/kimbie-dark.min.css" />
  <script src="assets/highlight/highlight.min.js" defer></script>
  <script src="assets/js/signature.js" defer></script>
  <script src="assets/js/brewdown.js" defer></script>
  <script src="assets/js/sidebar.js" defer></script>
  <script src="assets/js/scripts.js" defer></script>
  <script src="assets/js/mobile.js" defer></script>
  <script src="assets/js/back-to-top.js" defer></script>
  <!-- IMPORTANT: Define image/title BEFORE sidebar.js loads -->
  <script>
    image = "page-image.jpg";  // Profile image filename (in assets/images/profiles/)
    title = "Page Title";       // Sidebar heading
  </script>
</head>
<body>
  <sidebar></sidebar>
  <main>...</main>
</body>
```

**Load order matters:** `highlight.min.js` MUST come before `brewdown.js`. Brewdown's `processAll()` calls `hljs.highlightAll()` if hljs is available — if highlight.js loads after brewdown, the check fails and code blocks render without syntax coloring. Highlight.js is loaded on every page (even ones without code blocks) so this never becomes a problem when adding code to a page later. `signature.js` and `update.js` MUST also come before `brewdown.js` — brewdown reads `window.SIGNATURE` and `window.UPDATES` when it expands the `::signature::` token (see Page Footer below).

## Page Footer (Signature) & Update Dates

Every content page ends its Brewdown body with a single `::signature::` line instead of a hand-written footer. Brewdown expands it into the Author / Source / Contact / License / Last Updated block.

Two central config files drive this, both loaded before `brewdown.js`:
- **`assets/js/update.js`** (`window.UPDATES`) — the single source of truth for every page's `{ title, date }`, keyed by href. Feeds BOTH the footer's "Last Updated" AND the sidebar's ✨ "recently updated" badge (within 28 days).
- **`assets/js/signature.js`** (`window.SIGNATURE`) — shared footer fields only: author, contact, license, domain.

- **To bump a page's "Last Updated" date:** edit that page's entry in `assets/js/update.js`. One edit updates both the footer and the sidebar. Do NOT hand-edit footers — there's only the one `::signature::` token now.
- Author / Contact / License / domain: change once in `signature.js`, applies everywhere.
- Source and "Last Updated" are derived automatically from the current filename + the date map.

## Brewdown Content

`brewdown.js` supports two ways to embed Brewdown content in pages:

### 1. `<div class="brewdown">` (preferred for most pages)
```html
<main>
  <div class="brewdown">
# Heading
Some content here
  </div>
</main>
```
The div's text content is converted to HTML on load. The div gets class `brewdown-rendered` after processing.

### 2. `<script data-brewdown>` (for archive/document pages or external files)
```html
<!-- Inline Brewdown content -->
<script type="text/markdown" data-brewdown>
# Heading
Content here
</script>

<!-- External markdown file -->
<script data-brewdown="path/to/file.md"></script>
```
The script tag is replaced with a div containing the rendered HTML.

### Archive Pages
Long-form document pages use `<main class="archive">` with dedicated styling in `main.css`. These typically use the `<script type="text/markdown" data-brewdown>` pattern and include a download bar:
```html
<main class="archive">
  <div class="download-bar">
    <h1>Page Title</h1>
    <button class="download-btn" onclick="window.print()">Save as PDF</button>
  </div>
  <script type="text/markdown" data-brewdown>
  ...
  </script>
</main>
```

## Sidebar System

The sidebar is dynamically generated by `sidebar.js` using markdown-formatted link lists:
```javascript
const nav = {
    Navigation: `
- [🏠 Home Page](index.html)
- [📰 Changelog](changelog.html)`,
    Projects: `
- [🐍 Code Resources](code_resources.html)`,
    Support: `
- [☕ Support Me](support_me.html)`,
    Legal: `
- [📜 Website Legal](website_legal.html)`
};
```

Archive links are in a separate `archives` variable and rendered as a dropdown.

To add a sidebar link, edit the `nav` object or `archives` string in `sidebar.js`.

## CSS Organization

Pages link only `styles.css`, which `@import`s the partials in this order: `theme.css` → `sidebar.css` → `main.css` → `brewdown.css` → `mobile.css` → `print.css`. Keep each partial single-purpose:
- **`theme.css`**: `:root` CSS variables (coffee theme), global + body grid layout
- **`sidebar.css`**: Sidebar styles
- **`main.css`**: `<main>` / content styles
- **`brewdown.css`**: Styles for brewdown-rendered content
- **`mobile.css`**: ALL mobile overrides (768px breakpoint). Never put mobile `@media` queries in the other files.
- **`print.css`**: Print styles for the "Save as PDF" pages

## Changelog Format

`changelog.html` uses a `<pre>` block with a symbol-based legend:
```
. decoration text
# yellow: timestamps (e.g., # 2026 MAR 07)
@ purple: project name (e.g., @ website)
+ green: added
- red: removed
> blue: description
$ bugs: known/fixed
  normal indented text
```

## Design System

CSS variables defined in `:root` follow a coffee theme:
- Background: `--espresso`, `--dark-mocha`, `--dark-chocolate`
- Text: `--steamed-milk`, `--light-cream`, `--half-and-half`
- Accent: `--caramel`, `--pumpkin-spice`, `--mocha`

Layout uses CSS Grid: `grid-template-columns: 300px 1fr` (sidebar + content).

## Workflow

- **Always update `changelog.html`** when making changes to the site. Follow the legend format (# @ + - > $) and add entries under the current date.

## Deployment

- GitHub Pages site at coffeebyte.dev (CNAME configured)
- Push to main branch deploys automatically
- No build step — all static HTML/CSS/JS

## Important Dates (tracked in scripts.js)
- 2026-01-04: Premium host expiration
- 2026-09-19: Website domain renewal

## File Locations
- Profile images: `assets/images/profiles/`
- Shop images: `assets/images/shop/` (e.g. `3d_prints/`, `vtubers/`)
- Legal documents: `assets/legal/`
