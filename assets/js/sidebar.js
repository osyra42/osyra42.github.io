// sidebar.js - builds the sidebar from window.MANIFEST (assets/js/manifest.js),
// the single source of truth for every page's title, icon, section, date and
// word count.
//
// To add a page to the sidebar: add its entry to manifest.js. There is no nav
// list here to edit. Run `python tools/inspect_page.py <page>` to get a
// ready-to-paste manifest line with the word count already computed.
//
// Depends on: util.js, manifest.js, signature.js, themes.js - all load first.
//
// Order: variables, then functions, then execution (site convention).

// ---------------------------------------------------------------------------
// Variables
// ---------------------------------------------------------------------------

// A page is flagged ✨ in the sidebar if its manifest date is within this many
// days of today.
const FRESH_DAYS = 14;

// Site name comes from signature.js so it is written once, not repeated in the
// sidebar, the footer and the mobile banner.
const SITE_NAME = (window.SIGNATURE && window.SIGNATURE.site) || 'Coffee Byte Dev';

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

// Swatches are a flat list. The CSS wraps them and each cell keeps a fixed
// size, so the layout follows the roster on its own - add colours to themes.js
// and they lay themselves out. No row logic anywhere.
function themePickerSwatches() {
    const flavors = Themes.FLAVORS.map(t =>
        `<button class="theme-swatch" type="button" data-theme-id="${t.id}"`
        + ` data-tooltip="${t.label}" data-tooltip-color="${t.hex}"`
        + ` aria-label="${t.label} theme" style="--sw:${t.hex}"></button>`
    ).join('');

    // Reset swatch, FIRST in the row: forgets the saved choice and hands back
    // whatever DEFAULT_THEME is set to that season. White with a no-entry mark
    // so it reads as "no flavor" rather than as another colour to pick.
    const reset =
        '<button class="theme-swatch theme-swatch--reset" type="button"'
        + ' data-theme-reset data-tooltip="Reset to default"'
        + ' aria-label="Reset theme to the site default" style="--sw:#ffffff">'
        + '<span aria-hidden="true">🚫</span></button>';

    return reset + flavors;
}

// Group manifest entries by section, preserving window.SECTIONS order. Any
// section not listed there is appended alphabetically so a new group still
// renders instead of vanishing.
function groupBySection(manifest, order) {
    const groups = new Map();
    for (const [href, rec] of Object.entries(manifest)) {
        // Every manifest entry is listed. A page that should not appear in the
        // sidebar simply has no entry (mcupdates.html, the legal pages).
        const key = rec.section || 'Misc';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push({ href, ...rec });
    }

    const known = (order || []).filter(s => groups.has(s));
    const extra = [...groups.keys()].filter(s => !known.includes(s)).sort();

    return [...known, ...extra].map(name => ({ name, pages: groups.get(name) }));
}

function renderNav(manifest, sections, currentPageHref) {
    const cutoff = Date.now() - FRESH_DAYS * 24 * 60 * 60 * 1000;

    // Document index, continuous across the whole nav rather than restarting per
    // section - each number is a unique ID for that page. Derived from the
    // manifest's own ordering, so adding a page renumbers everything below it
    // automatically; nothing is stored or hardcoded.
    let index = 0;

    // Pad to the width of the largest number so the column stays aligned
    // (2 digits up to 99 pages, 3 beyond that).
    const total = Object.values(manifest).length;
    const width = Math.max(2, String(total).length);

    return groupBySection(manifest, sections).map(group => {
        const links = group.pages.map(p => {
            const dt = manifestDate(p.date);
            const fresh = Number.isFinite(dt) && dt >= cutoff;
            const isCurrent = p.href === currentPageHref;
            const idx = String(++index).padStart(width, '0');

            const label = `${p.icon || '📄'} ${escapeHtml(p.title || p.href)}`;

            // Metadata line, revealed on hover (and always shown for the current
            // page). Every value comes from the manifest - nothing derived here.
            // Kept as a native title= as well, so touch users and screen readers
            // still get it without the hover affordance.
            const meta = [
                p.words ? `${p.words.toLocaleString()} WORDS` : '',
                p.minutes ? `${p.minutes} MIN` : '',
                p.date ? `UPD ${escapeHtml(p.date)}` : '',
            ].filter(Boolean).join(' · ');

            const tip = meta ? ` title="${meta.replace(/·/g, '-')}"` : '';

            return `<li><span class="row-top">`
                + `<span class="nav-idx">${idx}</span>`
                + `<a href="${escapeHtml(p.href)}"${tip}`
                + `${isCurrent ? ' aria-current="page"' : ''}>${label}</a>`
                + `${fresh ? '<span class="sidebar-new"> ✨</span>' : ''}`
                + `</span>`
                + (meta ? `<span class="nav-meta"><span>${meta}</span></span>` : '')
                + `</li>`;
        }).join('\n');

        // Count is group.pages.length, so it can never drift from the number of
        // links actually rendered below it. Zero-padded to match the row index.
        const count = String(group.pages.length).padStart(2, '0');

        return `<h3><span class="sec-name">${escapeHtml(group.name)}</span>`
            + `<span class="sec-rule"></span>`
            + `<span class="sec-count">${count}</span></h3>\n`
            + `<ul>\n${links}\n</ul>`;
        // No <hr> between groups: each h3 draws its own hairline out to the
        // edge (sidebar.css), so a separator as well would double the rule.
    }).join('\n');
}

function initSidebar() {
    const sidebar = document.querySelector('sidebar');
    if (!sidebar) return;

    const manifest = window.MANIFEST || {};
    const sections = window.SECTIONS || [];

    if (!Object.keys(manifest).length) {
        console.error('sidebar.js: window.MANIFEST is empty - is manifest.js loaded before sidebar.js?');
    }

    // Highlight the link for whichever page we are on.
    const thisPage = currentPage();

    // Brand stats, derived from the manifest so they can never go stale.
    const docCount = Object.keys(manifest).length;
    const wordTotal = Object.values(manifest)
        .reduce((sum, r) => sum + (r.words || 0), 0);
    const wordsK = Math.round(wordTotal / 1000);

    // Index stamp: the most recent update date in the manifest, as YYYY.MM.
    const latest = Object.values(manifest)
        .map(r => r.date)
        .filter(Boolean)
        .sort()
        .pop() || '';
    const idx = latest.split('.').slice(0, 2).join('.');

    sidebar.innerHTML = `
<div class="text-center">
    <a href="index.html">
        <div class="brand-id">CBD // ARCHIVE</div>
        <h1>${SITE_NAME}</h1>
    </a>
    <div class="brand-sub">${docCount} DOCS · ${wordsK}K WORDS${idx ? ` · IDX ${idx}` : ''}</div>
    <div class="theme-menu">
      <span class="theme-menu-label">Flavors</span>
      <div class="theme-picker" role="group" aria-label="Color theme">
${themePickerSwatches()}
      </div>
    </div>
</div>
<nav class="sidebar-nav">
${renderNav(manifest, sections, thisPage)}
</nav>
<hr/>
<p class="sidebar-footer">
    CoffeeByteDev@proton.me - Legal: <a href="website_legal.html">Website</a> | <a href="vanity_legal.html">Vanity</a>
    <br>
    ${SITE_NAME} &copy; 2019 - 2026; All rights reserved.
    <a href="https://librecounter.org/referer/show" target="_blank" rel="noopener noreferrer">
          <img src="https://librecounter.org/outline-orange.svg" referrerPolicy="unsafe-url" />
        </a>
</p>`;

    // Theme picker: highlight the active swatch and switch theme on click.
    // Themes.resolve() is the single answer to "which theme is active" - the
    // applied palette and the highlighted swatch read the SAME function, so a
    // seasonal change to DEFAULT_THEME can never leave them disagreeing.
    const current = Themes.resolve();
    const swatches = sidebar.querySelectorAll('.theme-swatch');

    // The reset swatch never shows as active - it is an action, not a choice.
    // After it runs, the swatch for DEFAULT_THEME lights up instead.
    const markActive = id => swatches.forEach(b =>
        b.classList.toggle('active', b.dataset.themeId === id));

    markActive(current);

    swatches.forEach(btn => {
        btn.addEventListener('click', () => {
            if ('themeReset' in btn.dataset) {
                markActive(Themes.clear().id);
                return;
            }
            Themes.save(btn.dataset.themeId);
            markActive(btn.dataset.themeId);
        });
    });
}

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', initSidebar);
