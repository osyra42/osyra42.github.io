//sidebar.js

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('sidebar');
    if (!sidebar) return;

    // Parse markdown links: - [text](url) → <a href="url">- text</a><br>
    function mdLinks(md) {
        return md.trim().split('\n').map(line => {
            const match = line.trim().match(/^- \[(.+?)\]\((.+?)\)$/);
            if (!match) return '';
            const isExternal = match[2].endsWith('.pdf') || match[2].startsWith('http');
            const attrs = isExternal ? ' target="_blank" rel="noopener"' : '';
            return `<a href="${match[2]}"${attrs}>- ${match[1]}</a><br>`;
        }).join('');
    }

    // Navigation sections in markdown format
    const nav = {
        Navigation: `
- [🏠 Home Page](index.html)
- [📋 Changelog](changelog.html)
- [💼 Commissions](commissions.html)
- [⭐ Recommendations](recommendations.html)
- [⛏️ Minecraft Server](minecraft.html)`,

        Projects: `
- [🧲 How Magnets Work](how_magnets_work.html)
- [🎨 ComfyUI Guide](comfyui_guide.html)
- [📖 Osyra's Tale](osyras_tale.html)
- [🎣 Fishing Mini Game](fishing_mini_game/index.html)
- [🤖 Vanity Bot](vanity.html)
- [🏫 Home School](school/index.html)`,

        Support: `
- [☕ Donate](donate.html)`,

        Legal: `
- [📜 Vanity Legal](vanity_legal.html)
- [📜 Website Legal](website_legal.html)`
    };

    // Archive links in markdown format
    const archives = `
- [🎄 Clutter](clutter.html)
- [🤖 All About AI](all_about_ai.html)
- [💡 Do It Better For Free](do_it_better_for_free.html)
- [🏚️ Urbex Safety](urbex_safety.html)
- [🎭 VTuber Guide](vtuber_guide.html)
- [🎬 Media Mimic](media_mimic.html)
- [⚡ Glitched](glitched.html)
- [⚔️ Infinite Devastation](infinite_devastation.html)
- [💎 Ever Diamond](ever_diamond.html)
- [🔢 Casio Programs](assets/jail/[osyra42] - casio_programs.pdf)`;

    function archiveDropdown() {
        const links = archives.trim().split('\n').map(line => {
            const match = line.trim().match(/^- \[(.+?)\]\((.+?)\)$/);
            if (!match) return '';
            const isExternal = match[2].endsWith('.pdf') || match[2].startsWith('http');
            const attrs = isExternal ? ' target="_blank" rel="noopener"' : '';
            return `<a href="${match[2]}" class="nav-dropdown-item"${attrs}>${match[1]}</a>`;
        }).join('');

        return `
    <div class="nav-dropdown">
        <span class="nav-dropdown-toggle">
            - 📦 Archives
            <span class="dropdown-arrow">&#9662;</span>
        </span>
        <div class="nav-dropdown-menu">${links}</div>
    </div><br>`;
    }

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
<nav>
    <h3>Navigation</h3>
    ${mdLinks(nav.Navigation)}
    <hr>
    <h3>Projects</h3>
    ${mdLinks(nav.Projects)}
    ${archiveDropdown()}
    <hr>
    <h3>Support</h3>
    ${mdLinks(nav.Support)}
    <hr>
    <h3>Legal</h3>
    ${mdLinks(nav.Legal)}
</nav>
<hr/>
<p style="position: relative; font-size: 8px; color: var(--pumpkin-spice); text-align: center; margin: 0; padding: 0;">
    Contact Email - <a href="mailto:coffeebytedev@proton.me" style="color: var(--caramel); font-size: 10px;">CoffeeByteDev@proton.me</a>
    <br>
    Coffee Byte Dev &copy; 2019 - 2026; All rights reserved.
    <a href="https://librecounter.org/referer/show" target="_blank">
          <img style="position: absolute; bottom: 0; right: 0; width:20px;" src="https://librecounter.org/outline-orange.svg" referrerPolicy="unsafe-url" />
        </a>
</p>`;

    // Dropdown toggle behavior
    sidebar.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.closest('.nav-dropdown');
            dropdown.classList.toggle('open');
        });
    });
});
