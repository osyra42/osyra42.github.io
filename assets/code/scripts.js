// scripts.js

// CHANGELOG
// Register the `changelog` language for highlight.js and expose the prefix
// palette. Colors are tuned for the paper sheet (light background), not the
// dark shell, because changelog code blocks render inside .brewdown-rendered.
if (typeof hljs !== 'undefined') {
  const PREFIXES = {
    timestamp: { re: /^#.*$/m, color: '#6b6b6b' },
    project:   { re: /^@.*$/m, color: '#7a1fa0' },
    add:       { re: /^\+.*$/m, color: '#1a7a1a' },
    del:       { re: /^-.*$/m,  color: '#a01a1a' },
    note:      { re: /^>.*$/m,  color: '#1a6aa0' },
    fix:       { re: /^\$.*$/m, color: '#a06a1a' },
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

// ---------------------------------------------------------------------------
// PAGE TITLE
// Reads the first line of the current paper's markdown and stores the icon and
// title on `window`, then updates `document.title` and the download bar.
// This is page-level metadata, so it belongs here — not in brewdown.js, which
// only renders the paper content.
//
// The leading token is only treated as an icon if it is actually an emoji.
// Titles without an emoji keep their full text.
// ---------------------------------------------------------------------------

const EMOJI_RE = /\p{Extended_Pictographic}/u;

function splitIconAndTitle(text) {
  const m = text.match(/^(\S+)\s+(.+)$/);
  if (!m) return { icon: '', title: text.trim() };
  const [, first, rest] = m;
  if (EMOJI_RE.test(first)) return { icon: first, title: rest.trim() };
  return { icon: '', title: text.trim() };
}

async function loadPaperTitle() {
  const md = await (await fetch(`papers/${PAPER}.md`)).text();
  const firstLine = md.split('\n')[0];
  const match = firstLine.match(/^#\s+(.+?)\s*$/);
  if (!match) return;

  const { icon, title } = splitIconAndTitle(match[1]);

  window.icon  = icon;
  window.title = title;

  document.title = title + ' - Coffee Byte Dev';

  const h1 = document.querySelector('.download-bar h1');
  if (h1) h1.textContent = title;
}

// ---------------------------------------------------------------------------
// SIDEBAR
// ---------------------------------------------------------------------------

async function loadNavigation() {
  const response = await fetch("./site_navigation.csv");

  if (!response.ok) {
    throw new Error("Could not load navigation CSV.");
  }

  const csv = await response.text();

  // Ignore blank lines and whole-line comments beginning with #.
  // Comments may appear before the header or between navigation sections.
  const lines = csv
    .split(/\r?\n/)
    .filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('#');
    });

  // First remaining non-comment line is the CSV header.
  const rows = lines.slice(1).map(parseCsvLine);

  const nav = document.getElementById("sidebar-nav");
  const categories = new Map();

  for (const row of rows) {
    const [category, icon, title, href, paper, date, words, minutes] = row;

    if (!categories.has(category)) {
      categories.set(category, []);
    }

    categories.get(category).push({
      icon,
      title,
      href,
      paper,
      date,
      words,
      minutes,
    });
  }

  nav.innerHTML = [...categories.entries()].map(([category, pages]) => `
    <h3>
      <span class="sec-name">${escapeHtml(category)}</span>
      <span class="sec-rule"></span>
      <span class="sec-count">${String(pages.length).padStart(2, "0")}</span>
    </h3>
    <ul>
      ${pages.map(page => `
        <li>
          <a href="index.html?paper=${encodeURIComponent(page.paper)}"
            data-date="${escapeHtml(page.date)}"
            data-words="${escapeHtml(page.words)}"
            data-minutes="${escapeHtml(page.minutes)}">
            ${escapeHtml(page.icon)} ${escapeHtml(page.title)}
          </a>
        </li>
      `).join("")}
    </ul>
  `).join("");
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

// Uses the global escapeHtml assigned at the bottom of this file.
function escapeHtml(value) {
  return window.escapeHtml(value);
}

// ---------------------------------------------------------------------------
// SIDEBAR DECORATION
// Adds current-page marker, "new" sparkle, and hover metadata. Runs after
// loadNavigation() has rendered the CSV rows into #sidebar-nav.
// ---------------------------------------------------------------------------

function initSidebarNavigation() {
  const FRESH_DAYS = 14;
  const cutoff = Date.now() - FRESH_DAYS * 86400000;

  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').trim();
    const query = href.includes('?') ? href.split('?')[1] : '';
    const linkPaper = new URLSearchParams(query).get('paper');

    if (linkPaper === PAPER) {
      a.setAttribute('aria-current', 'page');
    }

    const date = (a.dataset.date || '').trim();

    if (date) {
      const dt = Date.parse(date.replace(/\./g, '-'));

      if (
        Number.isFinite(dt)
        && dt >= cutoff
        && !a.querySelector('.sidebar-new')
      ) {
        a.insertAdjacentHTML(
          'beforeend',
          ' <span class="sidebar-new">✨</span>',
        );
      }
    }

    const words = (a.dataset.words || '').trim();
    const minutes = (a.dataset.minutes || '').trim();
    const parts = [];

    if (words) {
      parts.push(`${Number(words).toLocaleString()} WORDS`);
    }

    if (minutes) {
      parts.push(`${minutes} MIN`);
    }

    if (date) {
      parts.push(`UPD ${date}`);
    }

    if (parts.length) {
      const meta = parts.join(' · ');
      a.title = meta.replace(/·/g, '-');

      const li = a.closest('li');

      if (li && !li.querySelector('.nav-meta')) {
        li.insertAdjacentHTML(
          'beforeend',
          `<span class="nav-meta"><span>${meta}</span></span>`,
        );
      }
    }
  });
}

// ---------------------------------------------------------------------------
// HASH SCROLL
// A ?paper= link with a #fragment arrives before brewdown.js has rendered the
// target element, so the browser's native anchor scroll misses. Poll until the
// element exists, then scroll to it. Uses scrollIntoView so scroll-padding-top
// on <main> is respected.
// ---------------------------------------------------------------------------
 
function restoreHashScroll() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;

  const mainEl = document.querySelector('main');

  const tryScroll = () => {
    const target = document.getElementById(id);
    if (!target) return false;
    // Direct property assignment bypasses CSS scroll-behavior: smooth, which
    // was deferring (and then cancelling) the scroll during the sheet-in
    // animation. scrollIntoView and scrollTo() both respect that property.
    const y = target.getBoundingClientRect().top + mainEl.scrollTop - 100;
    mainEl.scrollTop = y;
    return true;
  };

  if (tryScroll()) return;

  let tries = 0;
  const timer = setInterval(() => {
    if (tryScroll() || ++tries >= 100) clearInterval(timer);
  }, 50);
}

// ---------------------------------------------------------------------------
// BOOTSTRAP
// Title and navigation must both be loaded before the topbar can be built,
// because the topbar reads window.title and queries the sidebar for the
// current page's metadata. The two fetches run in parallel.
// ---------------------------------------------------------------------------

Promise.all([loadPaperTitle(), loadNavigation()])
  .then(() => {
    initSidebarNavigation();
    initTopbar();
    restoreHashScroll();
  })
  .catch(console.error);

// ---------------------------------------------------------------------------
// THEME PICKER
// Populated on DOMContentLoaded so Themes (loaded with `defer`) exists.
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const picker = document.querySelector('.theme-picker');
  if (!picker || typeof Themes === 'undefined') return;

  Themes.FLAVORS.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'theme-swatch';
    btn.type = 'button';
    btn.dataset.themeId = t.id;
    btn.dataset.tooltip = t.label;
    btn.dataset.tooltipColor = t.hex;
    btn.setAttribute('aria-label', t.label + ' theme');
    btn.style.setProperty('--sw', t.hex);
    picker.appendChild(btn);
  });

  const swatches = picker.querySelectorAll('.theme-swatch');
  const markActive = id => swatches.forEach(b =>
    b.classList.toggle('active', b.dataset.themeId === id));

  markActive(Themes.resolve());

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
});

// ---------------------------------------------------------------------------
// PRINT — open all <details> before printing, restore afterward.
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// BACK TO TOP
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// TOOLTIP — site chrome only (never inside <main>).
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// GLOBAL UTILITIES
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// TOPBAR
// Rebuilds the download bar with a breadcrumb, metadata, and the print button.
// Requires window.title (set by loadPaperTitle) and the sidebar DOM (set by
// loadNavigation) to be ready; both are guaranteed by the Promise.all above.
// ---------------------------------------------------------------------------

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

  const title = window.title || splitIconAndTitle(rec.title).title;

  document.title = title + ' - Coffee Byte Dev';

  const meta = topbarMeta(rec);
  const existing = bar.querySelector('.download-btn');
  const btnHtml = existing ? existing.outerHTML : TOPBAR_PRINT_BUTTON;

  bar.innerHTML =
    '<span class="crumb">'
     + '<span class="crumb-site">CBD</span>'
     + '<span class="sep">/</span>'
    + `<span class="crumb-sec">${escapeHtml(rec.section || TOPBAR_FALLBACK_SECTION)}</span>`
    + '<span class="sep">/</span>'
    + `<b class="crumb-doc">${escapeHtml(title)}</b>`
    + '</span>'
    + '<span class="bar-grow"></span>'
    + (meta ? `<span class="bar-meta">${escapeHtml(meta)}</span>` : '')
    + btnHtml;
}