// scripts.js

// CHANGELOG
if (typeof hljs !== 'undefined') {
  const PREFIXES = {
    timestamp: { re: /^#.*$/m, color: '#888888' },
    project:   { re: /^@.*$/m, color: '#AA00FF' },
    add:       { re: /^\+.*$/m, color: '#00AA00' },
    del:       { re: /^-.*$/m,  color: '#AA0000' },
    note:      { re: /^>.*$/m,  color: '#00AAFF' },
    fix:       { re: /^\$.*$/m, color: '#FFAA00' },
  };

  hljs.registerLanguage('changelog', function () {
    return {
      name: 'Changelog',
      contains: Object.entries(PREFIXES).map(([name, p]) => ({
        className: `chg-${name}`,
        begin: p.re,
      })),
    };
  });

  const style = document.createElement('style');
  style.textContent = Object.entries(PREFIXES)
    .map(([name, p]) => `.hljs-chg-${name} { color: ${p.color}; }`)
    .join('\n');
  document.head.appendChild(style);
}

// PRINTS
const PRINT_OPENED = 'printOpened';

function openDetailsForPrint() {
  document.querySelectorAll('details:not([open])').forEach(d => {
    d.setAttribute('open', '');
    d.dataset[PRINT_OPENED] = '';
  });
}

function restoreDetailsAfterPrint() {
  document.querySelectorAll('details[data-print-opened]').forEach(d => {
    d.removeAttribute('open');
    delete d.dataset[PRINT_OPENED];
  });
}

window.addEventListener('beforeprint', openDetailsForPrint);
window.addEventListener('afterprint', restoreDetailsAfterPrint);

// BACK TO TOP
const BTT_MOBILE_QUERY = '(max-width: 768px)';
const BTT_THRESHOLD_DESKTOP = 1600;
const BTT_THRESHOLD_MOBILE = 800;

function initBackToTop() {
  const mainEl = document.querySelector('main');
  const btn = document.getElementById('back-to-top');
  if (!mainEl || !btn) return;

  const isMobile = window.matchMedia(BTT_MOBILE_QUERY).matches;
  const scroller = isMobile ? window : mainEl;
  const threshold = isMobile ? BTT_THRESHOLD_MOBILE : BTT_THRESHOLD_DESKTOP;
  const offset = () => (isMobile ? window.scrollY : mainEl.scrollTop);

  scroller.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', offset() > threshold);
  });

  btn.addEventListener('click', () => {
    scroller.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.addEventListener('DOMContentLoaded', initBackToTop);

// TOOLTIP — chrome only, for [data-tooltip] elements outside <main>.
(function () {
  let tip = null;

  function getTip() {
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'tooltip-chrome';
      tip.setAttribute('role', 'tooltip');
      document.body.appendChild(tip);
    }
    return tip;
  }

  function chromeTarget(node) {
    const el = node.closest('[data-tooltip]');
    if (!el || el.closest('main')) return null;
    return el;
  }

  function show(el) {
    const text = el.getAttribute('data-tooltip');
    if (!text) return;
    const t = getTip();
    t.textContent = text;
    const color = el.getAttribute('data-tooltip-color');
    t.style.borderColor = color || '';
    t.style.color = color || '';
    const r = el.getBoundingClientRect();
    const tr = t.getBoundingClientRect();
    let left = r.left + r.width / 2 - tr.width / 2;
    let top = r.top - tr.height - 8;
    if (top < 6) top = r.bottom + 8;
    left = Math.max(6, Math.min(left, window.innerWidth - tr.width - 6));
    t.style.left = (left + window.scrollX) + 'px';
    t.style.top = (top + window.scrollY) + 'px';
    t.classList.add('tooltip-chrome--visible');
  }

  function hide() {
    if (tip) tip.classList.remove('tooltip-chrome--visible');
  }

  document.addEventListener('mouseover', e => {
    const el = chromeTarget(e.target);
    if (el) show(el);
  });
  document.addEventListener('mouseout', e => {
    if (chromeTarget(e.target)) hide();
  });
  document.addEventListener('focusin', e => {
    const el = chromeTarget(e.target);
    if (el) show(el);
  });
  document.addEventListener('focusout', hide);
  window.addEventListener('scroll', hide, true);
})();

// UTILS
window.escapeHtml = function (s) {
  return String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
};

window.currentPaper = function () {
  return new URLSearchParams(location.search).get('paper') || 'index';
};

window.currentRecord = function () {
  const link = document.querySelector(`.sidebar-nav a[href="?paper=${window.currentPaper()}"]`);
  if (!link) return null;
  const h3 = link.closest('ul')?.previousElementSibling;
  return {
    title:   window.title || link.textContent.trim(),
    icon:    window.icon  || '',
    section: h3?.querySelector('.sec-name')?.textContent || 'Archive',
    date:    link.dataset.date    || '',
    words:   link.dataset.words   || '',
    minutes: link.dataset.minutes || '',
  };
};

// TOP BAR
const TOPBAR_FALLBACK_SECTION = 'Archive';
const TOPBAR_PRINT_BUTTON =
  '<button class="download-btn" onclick="window.print()">Save as PDF</button>';

function topbarMeta(rec) {
  return [
    rec.words ? `${(+rec.words).toLocaleString()} words` : '',
    rec.minutes ? `${rec.minutes} min` : '',
    rec.date ? `upd ${rec.date}` : '',
  ].filter(Boolean).join(' · ');
}

function initTopbar() {
  const bar = document.querySelector('main .download-bar');
  if (!bar) return;

  const rec = currentRecord();
  if (!rec) return;
  const title = (window.title || rec.title).replace(/^\S+\s+/, '');

  document.title = title + ' - Coffee Byte Dev';

  const meta = topbarMeta(rec);
  const existing = bar.querySelector('.download-btn');
  const btnHtml = existing ? existing.outerHTML : TOPBAR_PRINT_BUTTON;

  bar.innerHTML =
    '<span class="crumb">'
    + `<span class="crumb-sec">${escapeHtml(rec.section || TOPBAR_FALLBACK_SECTION)}</span>`
    + '<span class="sep">/</span>'
    + `<b class="crumb-doc">${escapeHtml(title)}</b>`
    + '</span>'
    + '<span class="bar-grow"></span>'
    + (meta ? `<span class="bar-meta">${escapeHtml(meta)}</span>` : '')
    + btnHtml;
}

document.addEventListener('DOMContentLoaded', initTopbar);