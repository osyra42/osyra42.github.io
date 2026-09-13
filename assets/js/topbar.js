
const TOPBAR_FALLBACK_SECTION = 'Archive';
const TOPBAR_PRINT_BUTTON =
    '<button class="download-btn" onclick="window.print()">Save as PDF</button>';

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

document.addEventListener('DOMContentLoaded', initTopbar);
