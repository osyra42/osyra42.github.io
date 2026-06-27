//sidebar.js

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('sidebar');
    if (!sidebar) return;

    // Sidebar navigation as one brewdown document.
    // Per-page dates are NOT written here - they come from assets/js/update.js (window.UPDATES),
    // matched by each link's href. The post-process below adds a ✨ badge to any link whose
    // update date is within 4 weeks (28 days) of today.
    const navMarkdown = `
**Site**
- [🏠 Home Page](index.html)
- [📰 Changelog](changelog.html)
- [⛏️ Minecraft Server](minecraft.html)
- [⭐ Recommendations](recommendations.html)
- [☕ Support Me](support_me.html)

---
**Books**
- [📖 Operation Chimera](operation_chimera.html)
- [💎 Ever Diamond](ever_diamond.html)
- [⚔️ Infinite Devastation](infinite_devastation.html)
- [⚡ Glitched](glitched.html)

---
**Games**
- [🕹️ Blank Pixel Game](blank_pixel_game.html)
- [🧋 Sip Sip](sipsip/index.html)

---
**Guides & How-Tos**
- [🏚️ Urbex Safety](urbex_safety.html)
- [🎭 VTuber Guide](vtuber_guide.html)
- [🧲 How Magnets Work](how_magnets_work.html)
- [📝 Worksheets](worksheets.html)
- [💡 Better for Free](better_for_free.html)
- [🎨 ComfyUI Guide](comfyui_guide.html)

---
**Dev & Tools**
- [☕ Brewdown](brewdown.html)
- [🧊 Blender Resources](blender_resources.html)
- [🚀 Zen Launcher](zen_launcher.html)
- [🤖 Vanity Bot](vanity.html)
- [🔢 Casio Code](casio_code.html)
- [🐍 Code Resources](code_resources.html)

---
**Creations**
- [🖨️ 3D Prints](3d_prints.html)
- [🎬 Media Mimic](media_mimic.html)
- [🎄 Clutter](clutter.html)
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
    // If that page's update date is within 4 weeks (28 days) of today, append a ✨ after the link.
    // This transform is scoped to the sidebar — do not generalize it to other brewdown output.
    const updates = (typeof window !== 'undefined' && window.UPDATES) ? window.UPDATES : {};
    const cutoff = Date.now() - 28 * 24 * 60 * 60 * 1000;
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
});
