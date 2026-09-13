
window.escapeHtml = function (s) {
    return String(s).replace(/[&<>"']/g, c => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
};

// The current page's filename, as used for manifest lookups. One definition so
// the sidebar's "which page am I on", the topbar's breadcrumb and brewdown's
// ::signature:: footer can never disagree about it.
window.currentPage = function () {
    return location.pathname.split('/').pop() || 'index.html';
};

// "2026.08.21" -> epoch ms. Returns NaN on anything malformed, so callers can
// test with Number.isFinite rather than guessing.
window.manifestDate = function (date) {
    if (!date) return NaN;
    const p = String(date).split('.');
    if (p.length !== 3) return NaN;
    return new Date(+p[0], +p[1] - 1, +p[2]).getTime();
};

// This page's manifest record, or null when the page is unlisted (mcupdates,
// the legal pages).
window.currentRecord = function () {
    return (window.MANIFEST || {})[window.currentPage()] || null;
};
