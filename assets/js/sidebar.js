//sidebar.js

// Flavor themes — accent-only palettes (see [data-theme] blocks in theme.css).
// `color` is the swatch dot (each theme's primary accent). "caramel" is the
// default :root palette and carries no data-theme attribute.
const THEMES = [
    { id: 'caramel',   label: 'Caramel',   color: '#d2691e' },
    { id: 'mint',      label: 'Mint',      color: '#7a9e8c' },
    { id: 'blueberry', label: 'Blueberry', color: '#6d77a6' },
    { id: 'raspberry', label: 'Raspberry', color: '#b86a80' },
    { id: 'matcha',    label: 'Matcha',    color: '#97a86a' },
    { id: 'pumpkin',   label: 'Pumpkin Spice', color: '#b07a45' },
    { id: 'mocha',     label: 'Mocha',     color: '#9a6650' },
    { id: 'hazelnut',  label: 'Hazelnut',  color: '#a98a5c' },
    { id: 'honey',     label: 'Honey',     color: '#bf9f5c' },
    { id: 'ube',       label: 'Ube',       color: '#8a6fa8' },
    { id: 'rose',      label: 'Rose',      color: '#b97f8c' },
    { id: 'chai',      label: 'Chai',      color: '#b56a4a' },
    { id: 'lavender',  label: 'Lavender',  color: '#9a8fc0' },
    { id: 'peach',     label: 'Peach',     color: '#d39a78' },
    { id: 'lemon',     label: 'Lemon',     color: '#c2b34f' },
    { id: 'plum',      label: 'Plum',      color: '#97607e' },
    { id: 'espresso',  label: 'Espresso',  color: '#9a7d68' },
];

// How many rows of swatches to lay out in the picker. Themes are dealt across
// the rows round-robin, and odd rows are nudged right for a staggered look.
const THEME_ROWS = 3;

function themePickerRows() {
    const swatch = t =>
        `<button class="theme-swatch" type="button" data-theme-id="${t.id}" data-tooltip="${t.label}" data-tooltip-color="${t.color}" aria-label="${t.label} theme" style="background:${t.color}"></button>`;

    // Row sizes: spread evenly, then hand any remainder to the OUTER rows first
    // (top, bottom, then inward) so the layout stays symmetric — e.g. 17 -> 6,5,6.
    const sizes = new Array(THEME_ROWS).fill(Math.floor(THEMES.length / THEME_ROWS));
    let rem = THEMES.length % THEME_ROWS;
    for (let step = 0; rem > 0; step++) {
        sizes[step % 2 === 0 ? step / 2 : THEME_ROWS - 1 - (step - 1) / 2]++;
        rem--;
    }

    let html = '';
    let i = 0;
    for (let r = 0; r < THEME_ROWS; r++) {
        const offset = r % 2 === 1 ? ' theme-row--offset' : '';
        const dots = THEMES.slice(i, i + sizes[r]).map(swatch).join('');
        i += sizes[r];
        html += `<div class="theme-row${offset}">${dots}</div>`;
    }
    return html;
}

function applyTheme(id) {
    if (id && id !== 'caramel') {
        document.documentElement.setAttribute('data-theme', id);
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

// Apply the saved theme ASAP (before DOMContentLoaded) to minimise flash.
applyTheme(localStorage.getItem('theme') || 'caramel');

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('sidebar');
    if (!sidebar) return;

    // Sidebar navigation as one brewdown document.
    // Per-page dates are NOT written here - they come from assets/js/update.js (window.UPDATES),
    // matched by each link's href. The post-process below adds a ✨ badge to any link whose
    // update date is within 2 weeks (14 days) of today.
    // Entries within each category are ordered ALPHABETICALLY by visible label
    // (ignore the leading emoji), EXCEPT the Site group, which stays in its
    // deliberate manual order below.
    const navMarkdown = `
**Site**
- [🏠 Home Page](index.html)
- [📰 Changelog](changelog.html)
- [⛏️ Minecraft Server](minecraft.html)
- [⭐ Recommendations](recommendations.html)
- [☕ Support Me](support_me.html)

---
**Books**
- [💎 Ever Diamond](ever_diamond.html)
- [⚡ Glitched](glitched.html)
- [⚔️ Infinite Devastation](infinite_devastation.html)
- [📖 Operation Chimera](operation_chimera.html)

---
**Games**
- [🎮 3D Pixel Game](3d_pixel_game.html)
- [🕹️ Blank Pixel Game](blank_pixel_game.html)
- [🎄 Clutter](clutter.html)
- [🧋 Sip Sip](sipsip.html)

---
**Guides & How-Tos**
- [🖨️ 3D Prints](3d_prints.html)
- [💡 Better for Free](better_for_free.html)
- [🎨 ComfyUI Guide](comfyui_guide.html)
- [🧲 How Magnets Work](how_magnets_work.html)
- [🎬 How to Edit Videos](video_editing.html)
- [🏚️ Urbex Safety](urbex_safety.html)
- [🎭 VTuber Guide](vtuber_guide.html)
- [📝 Worksheets](worksheets.html)

---
**DevTools**
- [🔓 Become the Problem](become_the_problem.html)
- [🧊 Blender Resources](blender_resources.html)
- [☕ Brewdown](brewdown.html)
- [🔢 Casio Code](casio_code.html)
- [🐍 Code Resources](code_resources.html)
- [🎬 Media Mimic](media_mimic.html)
- [😴 Sleep Launcher](zzz_launcher.html)
- [🤖 Vanity Bot](vanity.html)
- [🎬 yt-dlp Tool](yt_dlp_tool.html)
`;

    // Set the header HTML directly, render nav through brewdown
    sidebar.innerHTML = `
<div class="text-center">
    <a href="index.html">
        <h1>Coffee Byte Dev</h1>
    </a>
    <p style="font-style: italic; text-align: center; font-size:12px;">
        "Progress happens one sip at a time."</p>
    <div class="avatar-container">
        <img src="assets/images/profiles/${image}" alt="${title}" />
    </div>
    <h2>${title}</h2>
    <div class="theme-menu">
      <span class="theme-menu-label">Flavors</span>
      <div class="theme-picker" role="group" aria-label="Color theme">
${themePickerRows()}
      </div>
    </div>
</div>
<nav class="sidebar-nav"></nav>
<hr/>
<p class="sidebar-footer">
    CoffeeByteDev@proton.me - Legal: <a href="website_legal.html">Website</a> | <a href="vanity_legal.html">Vanity</a>
    <br>
    Coffee Byte Dev &copy; 2019 - 2026; All rights reserved.
    <a href="https://librecounter.org/referer/show" target="_blank">
          <img src="https://librecounter.org/outline-orange.svg" referrerPolicy="unsafe-url" />
        </a>
</p>`;

    // Render nav through brewdown
    const navEl = sidebar.querySelector('.sidebar-nav');
    navEl.innerHTML = Brewdown.brewdown(navMarkdown);

    // Sidebar ✨ badge: look up each nav link's href in window.UPDATES (assets/js/update.js).
    // If that page's update date is within 2 weeks (14 days) of today, append a ✨ after the link.
    // This transform is scoped to the sidebar — do not generalize it to other brewdown output.
    const updates = (typeof window !== 'undefined' && window.UPDATES) ? window.UPDATES : {};
    const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
    navEl.querySelectorAll('a[href]').forEach(a => {
        const rec = updates[a.getAttribute('href')];
        if (!rec || !rec.date) return;
        const p = rec.date.split('.');
        const dt = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2])).getTime();
        if (Number.isFinite(dt) && dt >= cutoff) {
            const badge = document.createElement('span');
            badge.className = 'sidebar-new';
            badge.textContent = ' ✨';
            a.after(badge);
        }
    });

    // Theme picker: highlight the active swatch and switch theme on click.
    const current = localStorage.getItem('theme') || 'caramel';
    const swatches = sidebar.querySelectorAll('.theme-swatch');
    swatches.forEach(btn => {
        if (btn.dataset.themeId === current) btn.classList.add('active');
        btn.addEventListener('click', () => {
            const id = btn.dataset.themeId;
            localStorage.setItem('theme', id);
            applyTheme(id);
            swatches.forEach(b => b.classList.toggle('active', b === btn));
        });
    });
});
