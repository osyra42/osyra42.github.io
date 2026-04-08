//sidebar.js

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('sidebar');
    if (!sidebar) return;

    // Sidebar navigation as one brewdown document
    const navMarkdown = `
**Navigation**
- [🏠 Home Page](index.html)
- [📋 Changelog](changelog.html)
- [💼 Commissions 🆕](commissions.html)
- [⭐ Recommendations](recommendations.html)
- [⛏️ Minecraft Server 🆕](minecraft.html)

---
**Projects**
- [🕹️ Blank Pixel Game 🆕](blank_pixel_game.html)
- [🤖 Vanity Bot 🆕](vanity.html)
- [📖 Operation Chimera](operation_chimera.html)
- [☕ Brewdown 🆕](brewdown.html)
- [🧲 How Magnets Work](how_magnets_work.html)
>>> 📦 Archives
    - [🤖 All About AI](all_about_ai.html)
    - [🔢 Casio Code](casio_code.html)
    - [🎄 Clutter](clutter.html)
    - [🐍 Code Resources](code_resources.html)
    - [🎨 ComfyUI Guide](comfyui_guide.html)
    - [💡 Do It Better For Free](do_it_better_for_free.html)
    - [💎 Ever Diamond](ever_diamond.html)
    - [⚡ Glitched](glitched.html)
    - [⚔️ Infinite Devastation](infinite_devastation.html)
    - [🎬 Media Mimic](media_mimic.html)
    - [🏚️ Urbex Safety](urbex_safety.html)
    - [🎭 VTuber Guide](vtuber_guide.html)
    - [📝 Worksheets](worksheets.html)
<<<

---
**Support**
- [☕ Donate](donate.html)

---
**Legal**
- [📜 Vanity Legal](vanity_legal.html)
- [📜 Website Legal](website_legal.html)
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
<p style="position: relative; font-size: 8px; color: var(--pumpkin-spice); text-align: center; margin: 0; padding: 0;">
    Contact Email - <a href="mailto:coffeebytedev@proton.me" style="color: var(--caramel); font-size: 10px;">CoffeeByteDev@proton.me</a>
    <br>
    Coffee Byte Dev &copy; 2019 - 2026; All rights reserved.
    <a href="https://librecounter.org/referer/show" target="_blank">
          <img style="position: absolute; bottom: 0; right: 0; width:20px;" src="https://librecounter.org/outline-orange.svg" referrerPolicy="unsafe-url" />
        </a>
</p>`;

    // Render nav through brewdown
    const navEl = sidebar.querySelector('.sidebar-nav');
    navEl.innerHTML = Brewdown.brewdown(navMarkdown);
});
