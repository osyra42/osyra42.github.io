// scripts.js

// Define your reading speed here (e.g., 200 words per minute)
const WORDS_PER_MINUTE = 180;

// ---------------------------------------------------------------------------
// PAGE TITLE
// ---------------------------------------------------------------------------

const EMOJI_RE = /\p{Extended_Pictographic}/u;

function splitIconAndTitle(text) {
  const m = text.match(/^(\S+)\s+(.+)$/);
  if (!m) return { icon: '', title: text.trim() };
  const [, first, rest] = m;
  if (EMOJI_RE.test(first)) return { icon: first, title: rest.trim() };
  return { icon: '', title: text.trim() };
}

async function loadDocumentTitle() {
  const md = await (await fetch(`documents/${CURRENT_DOC}.md`)).text();
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

  const lines = csv
    .split(/\r?\n/)
    .filter(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('#');
    });

  const rows = lines.slice(1).map(parseCsvLine);

  const nav = document.getElementById("sidebar-nav");
  const categories = new Map();

  for (const row of rows) {
    // Notice we removed 'minutes' from the destructuring
    const [category, icon, title, href, date, words] = row;

    if (!categories.has(category)) {
      categories.set(category, []);
    }

    // Extract the document ID from the href
    const docMatch = href.match(/document=([^&]+)/);
    const doc = docMatch ? docMatch[1] : '';

    categories.get(category).push({
      icon,
      title,
      href,
      doc,
      date,
      words
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
          <a href="index.html?document=${encodeURIComponent(page.doc)}"
            data-date="${escapeHtml(page.date)}"
            data-words="${escapeHtml(page.words)}">
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

function escapeHtml(value) {
  return window.escapeHtml(value);
}

// ---------------------------------------------------------------------------
// SIDEBAR DECORATION
// ---------------------------------------------------------------------------

const FRESH_STOPS = [
  { label: 'Off',      days: 0        },
  { label: '1 day',    days: 1        },
  { label: '2 days',   days: 2        },
  { label: '3 days',   days: 3        },
  { label: '4 days',   days: 4        },
  { label: '5 days',   days: 5        },
  { label: '6 days',   days: 6        },
  { label: '1 week',   days: 7        },
  { label: '10 days',  days: 10       },
  { label: '2 weeks',  days: 14       },
  { label: '3 weeks',  days: 21       },
  { label: '1 month',  days: 30       },
  { label: '6 weeks',  days: 45       },
  { label: '2 months', days: 60       },
  { label: '3 months', days: 90       },
  { label: '6 months', days: 180      },
  { label: '1 year',   days: 365      },
  { label: 'All',      days: Infinity },
];

const FRESH_KEY = 'sidebarFreshIndex';
const DEFAULT_FRESH_LABEL = '2 weeks';

function defaultFreshIndex() {
  const i = FRESH_STOPS.findIndex(s => s.label === DEFAULT_FRESH_LABEL);
  return i >= 0 ? i : 0;
}

function readStoredFreshIndex() {
  try {
    const raw = localStorage.getItem(FRESH_KEY);
    if (raw == null) return null;
    const n = Number(raw);
    return Number.isInteger(n) && n >= 0 && n < FRESH_STOPS.length ? n : null;
  } catch (_) {
    return null;
  }
}

function writeStoredFreshIndex(i) {
  try {
    localStorage.setItem(FRESH_KEY, String(i));
  } catch (_) {}
}

function getFreshIndex() {
  return readStoredFreshIndex() ?? defaultFreshIndex();
}

function decorateSidebarLinks(explicitIndex) {
  const idx = explicitIndex ?? getFreshIndex();
  const days = FRESH_STOPS[idx].days;
  const cutoff = days === Infinity ? -Infinity : Date.now() - days * 86400000;

  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').trim();
    const query = href.includes('?') ? href.split('?')[1] : '';
    const linkDoc = new URLSearchParams(query).get('document');

    if (linkDoc === CURRENT_DOC) {
      a.setAttribute('aria-current', 'page');
    }

    const date = (a.dataset.date || '').trim();
    const existingSparkle = a.querySelector('.sidebar-new');

    if (date && days > 0) {
      const dt = Date.parse(date.replace(/\./g, '-'));
      const isFresh = Number.isFinite(dt) && dt >= cutoff;

      if (isFresh && !existingSparkle) {
        a.insertAdjacentHTML('beforeend', ' <span class="sidebar-new">✨</span>');
      } else if (!isFresh && existingSparkle) {
        existingSparkle.remove();
      }
    } else if (existingSparkle) {
      existingSparkle.remove();
    }

    const words = (a.dataset.words || '').trim();
    const parts = [];

    if (words) parts.push(`${Number(words).toLocaleString()}`);
    
    // Calculate reading time dynamically here!
    if (words) parts.push(formatReadingTime(words)); 
    
    if (date) parts.push(`${date}`);

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

// Build the slider once and wire it up.
function initFreshSlider() {
  const host = document.getElementById('sidebar-fresh-slider');
  if (!host) return;

  const idx = getFreshIndex();

  host.innerHTML = `
    <label class="fresh-slider-label" for="fresh-range">
      <span>New badge:</span>
      <span class="fresh-slider-value" data-value>${FRESH_STOPS[idx].label}</span>
    </label>
    <input
      id="fresh-range"
      type="range"
      min="0"
      max="${FRESH_STOPS.length - 1}"
      step="1"
      value="${idx}"
      aria-valuetext="${FRESH_STOPS[idx].label}"
    />
    <div class="fresh-ticks" aria-hidden="true">
      ${FRESH_STOPS.map(() => '<span></span>').join('')}
    </div>
  `;

  const range = host.querySelector('#fresh-range');
  const valueEl = host.querySelector('[data-value]');
  const ticks = host.querySelectorAll('.fresh-ticks span');

  const paintTicks = i => {
    ticks.forEach((t, n) => t.classList.toggle('on', n <= i));
  };

  paintTicks(idx);

  range.addEventListener('input', () => {
    const i = Number(range.value);
    const stop = FRESH_STOPS[i];
    valueEl.textContent = stop.label;
    range.setAttribute('aria-valuetext', stop.label);
    paintTicks(i);
    decorateSidebarLinks(i);
  });

  range.addEventListener('change', () => {
    writeStoredFreshIndex(Number(range.value));
  });
}

function initSidebarNavigation() {
  initFreshSlider();
  decorateSidebarLinks();
}

// ---------------------------------------------------------------------------
// HASH SCROLL
// ---------------------------------------------------------------------------
 
function restoreHashScroll() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;

  const mainEl = document.querySelector('main');

  const tryScroll = () => {
    const target = document.getElementById(id);
    if (!target) return false;
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
// ---------------------------------------------------------------------------

Promise.all([loadDocumentTitle(), loadNavigation()])
  .then(() => {
    initSidebarNavigation();
    initTopbar();
    restoreHashScroll();
  })
  .catch(console.error);

// ---------------------------------------------------------------------------
// THEME PICKER
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
// PRINT
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
// TOOLTIP
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

window.currentDocument = function () {
  return new URLSearchParams(location.search).get('document') || 'main/index';
};

window.currentRecord = function () {
  const doc = window.currentDocument();
  const link = [...document.querySelectorAll('.sidebar-nav a')]
    .find(a => {
      const q = (a.getAttribute('href') || '').split('?')[1] || '';
      return new URLSearchParams(q).get('document') === doc;
    });
  if (!link) return null;
  const h3 = link.closest('ul')?.previousElementSibling;
  
  const words = link.dataset.words || '';
  
  return {
    title:   window.title || link.textContent.trim(),
    icon:    window.icon  || '',
    section: h3?.querySelector('.sec-name')?.textContent || 'Archive',
    date:    link.dataset.date    || '',
    words:   words,
    minutes: calculateMinutes(words) // Calculate dynamically here too!
  };
};

// This takes raw words and converts it to minutes
function calculateMinutes(words) {
  const w = Number(words);
  if (!Number.isFinite(w) || w <= 0) return 0;
  return w / WORDS_PER_MINUTE;
}

function formatReadingTime(minutes) {
  const m = Number(minutes);
  if (!Number.isFinite(m) || m <= 0) return '';

  const totalMinutes = Math.round(m);
  const days  = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const mins  = totalMinutes % 60;

  const parts = [];
  if (days)  parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (mins)  parts.push(`${mins}m`);
  return parts.join('');
}

// ---------------------------------------------------------------------------
// TOPBAR
// ---------------------------------------------------------------------------

const TOPBAR_FALLBACK_SECTION = 'Archive';
const TOPBAR_PRINT_BUTTON =
  '<button class="download-btn" onclick="window.print()">Save as PDF</button>';

function topbarMeta(rec) {
  return [
    rec.words   ? `📝 ${(+rec.words).toLocaleString()} ` : '',
    rec.minutes ? `⏱️ ${formatReadingTime(rec.minutes)}` : '',
    rec.date    ? `📅 ${rec.date}` : '',
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