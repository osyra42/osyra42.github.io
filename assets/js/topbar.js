// topbar.js — turns the existing .download-bar into a technical header bar.
//
// Every page already ships:
//     <div class="download-bar">
//       <h1>Page Title</h1>
//       <button class="download-btn" onclick="window.print()">Save as PDF</button>
//     </div>
//
// This rewrites that into a breadcrumb + metadata strip, following the merged
// beta prototype (beta/merged.html), WITHOUT touching any page's markup:
//
//     SECTION / PAGE TITLE          1,240 WORDS · 3 MIN · UPD 2026.07.18  [PDF]
//
// The <h1> is replaced by the breadcrumb because the sheet's own H1 already
// carries the page title — two titles stacked was the redundancy the prototype
// removed. The Save as PDF button is preserved, restyled as a small outlined
// button.
//
// Values come from window.MANIFEST via util.js, so manifest.js and util.js MUST
// load first. A page with no manifest entry (mcupdates, the legal pages) keeps
// its original bar untouched — nothing to show, nothing broken.
//
// Order: variables, then functions, then execution (site convention).

// ---------------------------------------------------------------------------
// Variables
// ---------------------------------------------------------------------------

const TOPBAR_FALLBACK_SECTION = 'Archive';
const TOPBAR_PRINT_BUTTON =
    '<button class="download-btn" onclick="window.print()">Save as PDF</button>';

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

// "1,240 words · 3 min · upd 2026.07.18", skipping anything the record lacks.
function topbarMeta(rec) {
    return [
        rec.words ? `${rec.words.toLocaleString()} words` : '',
        rec.minutes ? `${rec.minutes} min` : '',
        rec.date ? `upd ${rec.date}` : '',
    ].filter(Boolean).join(' · ');
}

function initTopbar() {
    const bar = document.querySelector('main .download-bar');
    if (!bar) return;

    const rec = currentRecord();
    if (!rec) return;   // unlisted page: leave the bar exactly as authored

    const meta = topbarMeta(rec);

    // Keep the existing print button if the page has one, so its behaviour and
    // any per-page onclick survive; otherwise synthesise one.
    const existing = bar.querySelector('.download-btn');
    const btnHtml = existing ? existing.outerHTML : TOPBAR_PRINT_BUTTON;

    bar.innerHTML =
        '<span class="crumb">'
        + `<span class="crumb-sec">${escapeHtml(rec.section || TOPBAR_FALLBACK_SECTION)}</span>`
        + '<span class="sep">/</span>'
        + `<b class="crumb-doc">${escapeHtml(rec.title || currentPage())}</b>`
        + '</span>'
        + '<span class="bar-grow"></span>'
        + (meta ? `<span class="bar-meta">${escapeHtml(meta)}</span>` : '')
        + btnHtml;
}

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', initTopbar);
