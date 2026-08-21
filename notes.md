# how to do digital art
clip studio art
paint tools sai

# cheat engine
# dvd flick

---

# SHIP CHECKLIST — 2026 AUG 21

## Done

- [x] `rel="noopener noreferrer"` on all external links (6 brewdown templates + librecounter)
- [x] Changelog CSS moved into `changelog.html` — the only page with a unique look
- [x] Site name centralised in `signature.js` (`SIGNATURE.site`), was hardcoded in 3 places
- [x] All JS follows imports → variables → functions → execution
      (`scripts.js`, `back-to-top.js`, `topbar.js` restructured; the rest already did)
- [x] `util.js` added — shared `escapeHtml` / `currentPage` / `manifestDate`,
      removing three-way duplication
- [x] `theme.css` + `tooltip.css` folded into `styles.css`; 7 imports → 5
- [x] CSS already follows `:root` → element → class → id; section banners added to `styles.css`
- [x] `theme.css` trimmed 63 → 40 lines: 9 values were being overwritten by
      `themes.js` on every load, `--raspberry` had zero uses
- [x] Tip boxes now follow the chosen accent instead of a fixed mint
- [x] **Deleted ~150 lines of dead CSS** — ten callout classes (`.tip-box`,
      `.warning-box`, `.info-box`, `.executive-summary`, `.journal-entry`,
      `.links-box`, `.works-cited`, `.note-text`, `.section-divider`,
      `.page-break`) used by zero pages and emitted by zero brewdown tokens

- [x] Pre-ship sweep: all JS/CSS parse, no unreferenced files, no dead classes
      (removed `mcByCode`, `RULE_COLOR`, `.indent`, `.no-indent`)
- [x] Manifest verified against disk; script load order correct on all 33 pages
- [x] 26 flavors, rainbow-ordered, all passing WCAG AA

## Before pushing

- [ ] **Commit.** ~50 modified files, uncommitted since the start of this work.
      New: `themes.js` `mc-colors.js` `tooltip.js` `topbar.js` `manifest.js`
      `tools/inspect_page.py` `assets/fonts/ocr-a/` `beta/`
      Deleted: `update.js`, `assets/images/profiles/` (34 files), `satisfy.regular.ttf`
- [ ] Click through 3-4 pages on the live URL after deploy — GitHub Pages caches
      aggressively and a stale `manifest.js` would empty the sidebar
- [ ] Check one page on a real phone; the headless screenshots only approximate it

## Known, not blocking

- `atelier-dune-light` code blocks are low contrast by design (body text 3.4:1).
  `stackoverflow-light` is the swap-back if code ever reads badly.
- `+ added` in the changelog uses `§a green` — on the dark wash that is fine, but
  if the wash is ever removed, `dark_green` fails on paper (2.11:1).
- `beta/` is now the outdated copy: `merged.html` loads the deleted `update.js`
  and the port lists describe finished work. Delete or keep as a record.
- `CLAUDE.md` still calls the site "a portfolio and content hub" — it is a
  knowledge base now.
- `manifest.js` word counts are stale the moment a page is edited. Re-run
  `python tools/inspect_page.py <page>` and paste the line.

## Single source of truth — current state

| Thing | Lives in |
|---|---|
| Page titles, dates, sections, word counts | `assets/js/manifest.js` |
| Flavor colours (one hex each) | `assets/js/themes.js` |
| Minecraft chat colours | `assets/js/mc-colors.js` |
| Site name, author, contact, licence | `assets/js/signature.js` |
| Changelog look | `changelog.html` (page-local) |

Shared helpers now live in `assets/js/util.js`: `escapeHtml`, `currentPage`,
`manifestDate`, `currentRecord`. `sidebar.js`, `topbar.js` and `brewdown.js`
all call into it rather than keeping their own copies.

`brewdown.js` keeps its own `escapeHtml` — it escapes via a DOM text node,
which handles markdown edge cases the string version does not.

## Security

Static GitHub Pages site, no user input, no forms, no backend. The only
meaningful item was `rel="noopener"`, now done. `librecounter.org` is the single
third-party request (the referrer badge in the sidebar footer).
