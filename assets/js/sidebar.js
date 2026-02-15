//sidebar.js

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('sidebar');
    if (!sidebar) return;

    // Configuration
    const DAYS_TO_KEEP_NEW = 14;

    // Function to check if link should have "new" class
    function shouldBeNew(updateDate) {
        if (!updateDate) return false;

        const today = new Date();
        const update = new Date(
            Math.floor(updateDate / 10000), // year
            Math.floor((updateDate % 10000) / 100) - 1, // month (0-indexed)
            updateDate % 100 // day
        );

        const diffTime = today - update;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        return diffDays <= DAYS_TO_KEEP_NEW;
    }

    // Function to generate HTML for a section of links
    function generateSectionHTML(sectionTitle, linkFilter) {
        const sectionLinks = linksData.filter(linkFilter);

        if (sectionLinks.length === 0) return '';

        let html = `<h3>${sectionTitle}</h3>`;
        sectionLinks.forEach(link => {
            const newClass = shouldBeNew(link.updateDate) ? ' new' : '';
            const externalAttrs = link.external ? ' target="_blank" rel="noopener"' : '';

            html += `
    <a title="${link.title}" href="${link.href}" class="nav-link${newClass}"${externalAttrs}>
        - ${link.text}
    </a><br>`;
        });

        return html;
    }

    // Function to generate dropdown HTML for archives
    function generateArchiveDropdownHTML() {
        let html = `
    <div class="nav-dropdown">
        <span class="nav-dropdown-toggle" title="Click to view archived documents">
            - Archives
            <span class="dropdown-arrow">&#9662;</span>
        </span>
        <div class="nav-dropdown-menu">`;

        archiveLinks.forEach(link => {
            const externalAttrs = link.external ? ' target="_blank" rel="noopener"' : '';
            html += `
            <a href="${link.href}" class="nav-dropdown-item" title="${link.title}"${externalAttrs}>${link.text}</a>`;
        });

        html += `
        </div>
    </div><br>`;

        return html;
    }

    // Links data - organized by section order (Navigation, Projects, Support, Legal), alphabetical within each
    const linksData = [
        // Navigation - Core site pages
        { section: 'Navigation', href: 'index.html', text: 'Home Page', title: 'Click to return to the home page', updateDate: 20260103 },
        { section: 'Navigation', href: 'changelog.html', text: 'Changelog', title: 'Click to see the changelog', updateDate: 20260131 },
        { section: 'Navigation', href: 'commissions.html', text: 'Commissions', title: 'Click to submit a commission request', updateDate: 20260126 },
        { section: 'Navigation', href: 'recommendations.html', text: 'Recommendations', title: 'Click to see my curated recommendations', updateDate: 20260103 },
        { section: 'Navigation', href: 'how_magnets_work.html', text: 'How Magnets Work', title: 'Learn how to use magnet links for torrenting', updateDate: 20260131 },
        { section: 'Navigation', href: 'comfyui_guide.html', text: 'ComfyUI Guide', title: 'Learn how to use ComfyUI for AI image generation', updateDate: 20260131 },

        // Projects - My work and creations
        { section: 'Projects', href: 'minecraft.html', text: 'Minecraft Server', title: 'Click to view information about the Minecraft server', updateDate: 20260105 },
        { section: 'Projects', href: 'osyras_tale.html', text: "Osyra's Tale", title: "Click to read Osyra's Tale", updateDate: 20260105 },
        { section: 'Projects', href: 'fishing_mini_game/index.html', text: 'Fishing Mini Game', title: 'Click to play the fishing mini game', updateDate: 20251127 },
        { section: 'Projects', href: 'vanity.html', text: 'Vanity Bot', title: 'Click to view information about the Vanity', updateDate: 20260121 },
        { section: 'Projects', href: 'school/index.html', text: 'Home School', title: 'Click to view information about the school', updateDate: 20251125 },

        // Support - Ways to support my work
        { section: 'Support', href: 'donate.html', text: 'Donate', title: 'Support my work through donations and wishlists', updateDate: 20251121 },

        // Legal - Terms and policies
        { section: 'Legal', href: 'vanity_legal.html', text: 'Vanity Legal', title: 'Click to view Vanity bot terms and FAQ', updateDate: 20251008 },
        { section: 'Legal', href: 'website_legal.html', text: 'Website Legal', title: 'Click to view privacy policy and terms', updateDate: 20251227 }
    ];

    // Archive links - shown in dropdown
    const archiveLinks = [
        { href: 'clutter.html', text: 'Clutter', title: 'Chrome extension for festive seasonal decorations' },
        { href: 'all_about_ai.html', text: 'All About AI', title: 'A chronological examination of artificial intelligence' },
        { href: 'do_it_better_for_free.html', text: 'Do It Better For Free', title: 'Guide to free and open-source software alternatives' },
        { href: 'urbex_safety.html', text: 'Urbex Safety', title: 'Guide to urban exploration safety and ethics' },
        { href: 'vtuber_guide.html', text: 'VTuber Guide', title: 'Guide to creating and animating a VTuber avatar' },
        { href: 'media_mimic.html', text: 'Media Mimic', title: 'Desktop media library interface documentation' },
        { href: 'glitched.html', text: 'Glitched', title: 'Science fiction story by osyra42' },
        { href: 'infinite_devastation.html', text: 'Infinite Devastation', title: 'Fantasy adventure story by osyra42' },
        { href: 'ever_diamond.html', text: 'Ever Diamond', title: 'Fantasy adventure story by osyra42' },
        { href: 'assets/jail/[osyra42] - casio_programs.pdf', text: 'Casio Programs', title: 'Casio calculator code archive', external: true }
    ];

    // Generate complete sidebar HTML
    function generateNavHTML() {
        return `
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
    ${generateSectionHTML('Navigation', link => link.section === 'Navigation')}
    <hr>
    ${generateSectionHTML('Projects', link => link.section === 'Projects')}
    ${generateArchiveDropdownHTML()}
    <hr>
    ${generateSectionHTML('Support', link => link.section === 'Support')}
    <hr>
    ${generateSectionHTML('Legal', link => link.section === 'Legal')}
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

    }

    sidebar.innerHTML = generateNavHTML();

    // Dropdown toggle behavior
    sidebar.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.closest('.nav-dropdown');
            dropdown.classList.toggle('open');
        });
    });
});
