//mobile.js
// Create and inject mobile banner HTML
function createMobileBanner() {
    if (document.querySelector('.mobile-banner')) {
        return;
    }

    const mobileBanner = document.createElement('div');
    mobileBanner.className = 'mobile-banner';
    mobileBanner.innerHTML = `
        <h1>Coffee Byte Dev</h1>
        <div class="burger-btn" id="burgerBtn">
            <div class="burger-line"></div>
            <div class="burger-line"></div>
            <div class="burger-line"></div>
        </div>
    `;
    document.body.insertBefore(mobileBanner, document.body.firstChild);
}

// Create and inject overlay
function createOverlay() {
    if (document.querySelector('.overlay')) {
        return;
    }

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
}

// Initialize mobile functionality
function initMobileMenu() {
    const sidebar = document.querySelector('sidebar');
    const overlay = document.querySelector('.overlay');
    const burgerBtn = document.getElementById('burgerBtn');
    const body = document.body;

    if (!sidebar || !overlay || !burgerBtn) {
        return;
    }

    // Burger button click handler
    burgerBtn.addEventListener('click', function(event) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('sidebar-open');
        burgerBtn.classList.toggle('active');
        event.stopPropagation();
    });

    // Close sidebar when clicking on the overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('sidebar-open');
        burgerBtn.classList.remove('active');
    });

    // Close sidebar when clicking on a nav link
    document.addEventListener('click', function(event) {
        if (sidebar.classList.contains('active') && event.target.matches('nav a')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('sidebar-open');
            burgerBtn.classList.remove('active');
        }
    });

    // Close sidebar when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            body.classList.remove('sidebar-open');
            burgerBtn.classList.remove('active');
        }
    });
}

// Check if we should initialize mobile features
function shouldInitializeMobile() {
    return window.innerWidth <= 768;
}

// Main initialization function
let mobileInitialized = false;
function initializeMobile() {
    if (mobileInitialized) return;
    mobileInitialized = true;
    createMobileBanner();
    createOverlay();

    // Small delay to ensure DOM is updated
    setTimeout(() => {
        initMobileMenu();
    }, 100);
}

// Document ready handler
document.addEventListener('DOMContentLoaded', function() {
    if (shouldInitializeMobile()) {
        initializeMobile();
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (shouldInitializeMobile()) {
                if (!document.querySelector('.mobile-banner')) {
                    initializeMobile();
                }
            } else {
                // Desktop - ensure mobile elements are hidden
                const mobileBanner = document.querySelector('.mobile-banner');
                const overlay = document.querySelector('.overlay');
                if (mobileBanner) mobileBanner.style.display = 'none';
                if (overlay) overlay.style.display = 'none';
            }
        }, 250);
    });
});

// Also try initializing if script loads after DOM is already ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    if (shouldInitializeMobile()) {
        setTimeout(initializeMobile, 500);
    }
}
