//mobile.js
// Create and inject mobile banner + overlay, CSS handles when to show them.
//
// Order: variables, then functions, then execution (site convention).

// Read at call time rather than declaring another SITE_NAME - a top-level
// const would collide with sidebar.js, which shares the same global scope.
function siteName() {
    return (window.SIGNATURE && window.SIGNATURE.site) || 'Coffee Byte Dev';
}

function initMobile() {
    if (document.querySelector('.mobile-banner')) return;

    const mobileBanner = document.createElement('div');
    mobileBanner.className = 'mobile-banner';
    mobileBanner.innerHTML = `
        <h1>${siteName()}</h1>
        <div class="burger-btn" id="burgerBtn">
            <div class="burger-line"></div>
            <div class="burger-line"></div>
            <div class="burger-line"></div>
        </div>
    `;
    document.body.insertBefore(mobileBanner, document.body.firstChild);

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    const sidebar = document.querySelector('sidebar');
    const burgerBtn = document.getElementById('burgerBtn');

    if (!sidebar || !burgerBtn) return;

    burgerBtn.addEventListener('click', function(event) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
        burgerBtn.classList.toggle('active');
        event.stopPropagation();
    });

    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
        burgerBtn.classList.remove('active');
    });

    document.addEventListener('click', function(event) {
        if (sidebar.classList.contains('active') && event.target.matches('nav a')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
            burgerBtn.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', initMobile);
