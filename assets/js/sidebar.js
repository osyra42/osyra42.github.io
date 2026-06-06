//sidebar.js

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('sidebar');
    if (!sidebar) return;

    // Sidebar navigation as one brewdown document.
    // Trailing @@YYYY.MM.DD@@ timestamps drive the auto-✨ feature:
    // within 4 weeks (28 days) of today → renders as ✨; older → hidden. See post-process below.
    const navMarkdown = `
**Navigation**
- [🏠 Home Page](index.html)
- [📰 Changelog](changelog.html)
- [⛏️ Minecraft Server](minecraft.html) @@2026.05.18@@
- [💼 Commissions](commissions.html) @@2026.05.08@@
- [⭐ Recommendations](recommendations.html) @@2026.05.06@@
- [☕ Donate](donate.html) @@2026.05.05@@

---
**Projects**
- [🕹️ Blank Pixel Game](blank_pixel_game.html) @@2026.06.06@@
- [📖 Operation Chimera](operation_chimera.html) @@2026.05.24@@
- [☕ Brewdown](brewdown.html) @@2026.05.23@@
- [🧋 Sip Sip](sipsip/index.html) @@2026.05.12@@
- [🧊 Blender Resources](blender_resources.html) @@2026.05.08@@
- [🧲 How Magnets Work](how_magnets_work.html) @@2026.05.08@@
- [🤖 Vanity Bot](vanity.html) @@2026.05.05@@
>>> 📦 Archives
    - [🤖 All About AI](all_about_ai.html) @@2026.02.19@@
    - [🔢 Casio Code](casio_code.html) @@2026.04.27@@
    - [🎄 Clutter](clutter.html) @@2026.02.19@@
    - [🐍 Code Resources](code_resources.html) @@2026.03.07@@
    - [🎨 ComfyUI Guide](comfyui_guide.html) @@2026.02.19@@
    - [💡 Do It Better For Free](do_it_better_for_free.html) @@2026.02.19@@
    - [💎 Ever Diamond](ever_diamond.html) @@2026.02.19@@
    - [⚡ Glitched](glitched.html) @@2026.02.19@@
    - [⚔️ Infinite Devastation](infinite_devastation.html) @@2026.02.19@@
    - [🎬 Media Mimic](media_mimic.html) @@2026.05.08@@
    - [🏚️ Urbex Safety](urbex_safety.html) @@2026.05.08@@
    - [🎭 VTuber Guide](vtuber_guide.html) @@2026.05.08@@
    - [📝 Worksheets](worksheets.html) @@2026.05.08@@
    - [🚀 Zen Launcher](zen_launcher.html) @@2026.05.08@@
<<<
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
    CoffeeByteDev@proton.me — Legal: <a href="website_legal.html">Website</a> | <a href="vanity_legal.html">Vanity</a>
    <br>
    Coffee Byte Dev &copy; 2019 - 2026; All rights reserved.
    <a href="https://librecounter.org/referer/show" target="_blank">
          <img src="https://librecounter.org/outline-orange.svg" referrerPolicy="unsafe-url" />
        </a>
</p>`;

    // Render nav through brewdown
    const navEl = sidebar.querySelector('.sidebar-nav');
    navEl.innerHTML = Brewdown.brewdown(navMarkdown);

    // Sidebar-only: trailing @@date@@ timestamps within 4 weeks (28 days) render as ✨, older are hidden.
    // This transform is scoped to the sidebar — do not generalize it to other brewdown output.
    const cutoff = Date.now() - 28 * 24 * 60 * 60 * 1000;
    navEl.querySelectorAll('time').forEach(t => {
        const dt = Date.parse(t.getAttribute('datetime'));
        if (Number.isFinite(dt) && dt >= cutoff) {
            const badge = document.createElement('span');
            badge.className = 'sidebar-new';
            badge.textContent = '✨';
            t.replaceWith(badge);
        } else {
            t.remove();
        }
    });
});
