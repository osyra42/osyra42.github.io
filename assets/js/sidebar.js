//sidebar.js

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('sidebar');
    if (!sidebar) return;
    
    // Configuration
    const DAYS_TO_KEEP_NEW = 14;
    
    // Links data - easy to maintain and update
    const linksData = [
        // Navigation
        { section: 'Navigation', href: 'index.html', text: 'Home Page', icon: 'home.png', alt: 'Home', title: 'Click to return to the home page', updateDate: 20251121 },
        { section: 'Navigation', href: 'recommendations.html', text: 'Recommendations', icon: 'address-card.png', alt: 'Recommendations', title: 'Click to see my curated recommendations', updateDate: 20251121 },
        { section: 'Navigation', href: 'commissions.html', text: 'Commissions', icon: 'cart.png', alt: 'Commissions', title: 'Click to submit a commission request', updateDate: 20251121 },
        { section: 'Navigation', href: 'changelog.html', text: 'Changelog', icon: 'changelog.png', alt: 'Changelog', title: 'Click to see the changelog', updateDate: 20251125 },

        // Projects
        { section: 'Projects', href: 'school/index.html', text: 'Home School', icon: 'school.png', alt: 'Home School', title: 'Click to view information about the school', updateDate: 20251125 },
        { section: 'Projects', href: 'fishing_mini_game/index.html', text: 'Fishing Mini Game', icon: 'fish.png', alt: 'Fishing Game', title: 'Click to play the fishing mini game', updateDate: 20251127 },
        { section: 'Projects', href: 'minecraft.html', text: 'Minecraft Server', icon: 'server.png', alt: 'Minecraft', title: 'Click to view information about the Minecraft server', updateDate: 20251015 },
        { section: 'Projects', href: 'vanity.html', text: 'Vanity Bot', icon: 'robot.png', alt: 'Vanity Bot', title: 'Click to view information about the Vanity', updateDate: 20251018 },
        { section: 'Projects', href: 'my_books.html', text: 'My Books', icon: 'book.png', alt: 'Books', title: 'Click to the page with my books', updateDate: 20251010 },
        { section: 'Projects', href: 'my_creations.html', text: 'My Creations', icon: 'floppy-disk.png', alt: 'Creations', title: 'Click to view information about all my creations', updateDate: 20251024 },

        // Legal Links
        { section: 'Legal Links', href: 'website_legal.html', text: 'Website Legal', icon: 'shield-halved.png', alt: 'Privacy', title: 'Click to view our privacy policy', updateDate: 20251012 },
        { section: 'Legal Links', href: 'vanity_legal.html', text: 'Vanity Legal', icon: 'scroll.png', alt: 'Vanity Legal', title: 'Click to get help or view frequently asked questions', updateDate: 20251008 },
        { section: 'Legal Links', href: 'donate.html', text: 'Donate', icon: 'hand-holding-dollar.png', alt: 'Donate', title: 'Support my work through donations and wishlists', updateDate: 20251121 }
    ];
    
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
        <img src="assets/images/icons/${link.icon}" alt="${link.alt}" class="nav-icon">${link.text}
    </a><br>`;
        });
        
        return html;
    }
    
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
<span id="clutter-toggle" style="font-size: 8px;float: right; background-color: var(--toasted-almond); color: var(--half-and-half); border: 2px solid var(--espresso); border-radius: 5px; padding: 3px; cursor: pointer;"> with clutter.js?</span>
    ${generateSectionHTML('Navigation', link => link.section === 'Navigation')}
    <hr>
    ${generateSectionHTML('Projects', link => link.section === 'Projects')}
    <hr>
    ${generateSectionHTML('Legal Links', link => link.section === 'Legal Links')}
</nav>
<hr/>
<p style="position: relative; font-size: 8px; color: var(--pumpkin-spice); text-align: center; margin: 0; padding: 0;">
    Contact Email - <a href="mailto:coffeebytedev@proton.me" style="color: var(--caramel); font-size: 10px;">CoffeeByteDev@proton.me</a>
    <br>
    Coffee Byte Dev &copy; 2019 - 2025; All rights reserved.
    <a href="https://librecounter.org/referer/show" target="_blank">
          <img style="position: absolute; bottom: 0; right: 0; width:20px;" src="https://librecounter.org/outline-orange.svg" referrerPolicy="unsafe-url" />
        </a>
</p>`;

    }
    
    sidebar.innerHTML = generateNavHTML();
});