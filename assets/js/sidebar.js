//sidebar.js

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('sidebar');
    if (!sidebar) return;
    
    // Configuration
    const DAYS_TO_KEEP_NEW = 14;
    
    // Links data - easy to maintain and update
    const linksData = [
        // Navigation
        { href: 'index.html', text: 'Home Page', icon: 'home.png', alt: 'Home', title: 'Click to return to the home page', updateDate: 20251021 },
        { href: 'about_me.html', text: 'About Me', icon: 'address-card.png', alt: 'About Me', title: 'Click to contact me or view basic information about me', updateDate: 20251024 },
        { href: 'commissions.html', text: 'Commissions', icon: 'cart.png', alt: 'Commissions', title: 'Click to submit a commission request', updateDate: 20251024 },
        { href: 'changelog.html', text: 'Changelog', icon: 'changelog.png', alt: 'Changelog', title: 'Click to see the changelog', updateDate: 20251017 },
        
        // Projects
        { href: 'minecraft.html', text: 'Minecraft Server', icon: 'server.png', alt: 'Minecraft', title: 'Click to view information about the Minecraft server', updateDate: 20251015 },
        { href: 'vanity.html', text: 'Vanity Bot', icon: 'robot.png', alt: 'Vanity Bot', title: 'Click to view information about the Vanity', updateDate: 20251018 },
        { href: 'my_books.html', text: 'My Books', icon: 'book.png', alt: 'Books', title: 'Click to the page with my books', updateDate: 20251010 },
        { href: 'my_creations.html', text: 'My Creations', icon: 'floppy-disk.png', alt: 'Creations', title: 'Click to view information about all my creations', updateDate: 20251024 },
        
        // Legal Links
        { href: 'website_legal.html', text: 'Website Legal', icon: 'shield-halved.png', alt: 'Privacy', title: 'Click to view our privacy policy', updateDate: 20251012 },
        { href: 'vanity_legal.html', text: 'Vanity Legal', icon: 'scroll.png', alt: 'Vanity Legal', title: 'Click to get help or view frequently asked questions', updateDate: 20251008 },
        { href: 'https://paypal.me/osyra42', text: 'Donate', icon: 'hand-holding-dollar.png', alt: 'Donate', title: 'Donate to me', updateDate: 20250101, external: true }
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
    ${generateSectionHTML('Navigation', link => 
        ['index.html', 'about_me.html', 'commissions.html', 'request_form.html', 'changelog.html'].includes(link.href)
    )}
    <hr>
    ${generateSectionHTML('Projects', link =>
        ['minecraft.html', 'vanity.html', 'my_books.html', 'my_creations.html'].includes(link.href)
    )}
    <hr>
    ${generateSectionHTML('Legal Links', link =>
        ['website_legal.html', 'vanity_legal.html', 'https://paypal.me/osyra42'].includes(link.href)
    )}
</nav>
<hr/>
<p id="copyright">Coffee Byte Dev &copy; 2019 - 2025; All rights reserved.</p>`;
    }
    
    sidebar.innerHTML = generateNavHTML();
});