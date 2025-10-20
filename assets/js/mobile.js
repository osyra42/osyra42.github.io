//mobile.js
// Create and inject mobile banner HTML
function createMobileBanner() {
    
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
    console.log('Mobile banner created');
}

// Create and inject overlay
function createOverlay() {
    // Check if overlay already exists
    if (document.querySelector('.overlay')) {
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    console.log('Overlay created');
}

// Inject mobile CSS styles with higher specificity
function injectMobileStyles() {
    // Check if styles already injected
    if (document.querySelector('style[data-mobile-styles]')) {
        return;
    }
    
    const style = document.createElement('style');
    style.setAttribute('data-mobile-styles', 'true');
    style.textContent = `
    /* Mobile Styles - Forced Display */
    @media (max-width: 768px) {
      body {
        overflow-y: auto !important;
        grid-template-columns: 1fr !important;
        margin-top: 60px !important;
      }

      .mobile-banner {
        display: flex !important;
        justify-content: space-between;
        align-items: center;
        background-color: #38271e !important;
        padding: 10px !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        z-index: 1001 !important;
        border-bottom: 2px solid #5c4937 !important;
        box-sizing: border-box !important;
      }

      .mobile-banner h1 {
        color: #d2691e !important;
        margin: 0 !important;
        font-size: 18px !important;
      }

      sidebar {
        position: fixed !important;
        top: 0 !important;
        height: 100vh !important;
        width: calc(100% - 100px) !important;
        z-index: 1002 !important;
        transition: transform 0.3s ease-in-out !important;
        overflow-y: auto !important;
        left: calc(-100% + 100px) !important;
        border-right: 2px solid #5c4937 !important;
        background-color: #38271e !important;
      }

      sidebar h1 {
        margin-left: 65px !important;
      }
      
      sidebar.active {
        transform: translateX(calc(100% - 100px)) !important;
        margin-left: 100px !important;
      }

      .overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background-color: rgba(0, 0, 0, 0.5) !important;
        z-index: 1000 !important;
        display: none !important;
      }

      .overlay.active {
        display: block !important;
      }

      body.sidebar-open {
        overflow: hidden !important;
      }

      main {
        padding: 20px 8px !important;
        height: auto !important;
        margin-top: 50px !important;
      }

      /* Burger menu button */
      .burger-btn {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          width: 40px !important;
          height: 40px !important;
          cursor: pointer !important;
          border-radius: 50% !important;
          transition: all 0.3s ease !important;
          z-index: 1005 !important;
          background: transparent !important;
          border: none !important;
      }

      .burger-line {
          width: 30px !important;
          height: 3px !important;
          background: white !important;
          margin: 3px 0 !important;
          border-radius: 2px !important;
          transition: all 0.3s ease !important;
          transform-origin: center !important;
      }

      /* Animation when active */
      .burger-btn.active .burger-line:nth-child(1) {
          transform: translateY(8px) rotate(45deg) !important;
      }

      .burger-btn.active .burger-line:nth-child(2) {
          opacity: 0 !important;
          transform: translateX(-10px) !important;
      }

      .burger-btn.active .burger-line:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg) !important;
      }
    }

    /* Hide mobile elements on desktop */
    @media (min-width: 769px) {
      .mobile-banner {
        display: none !important;
      }
      .overlay {
        display: none !important;
      }
    }
    `;
    document.head.appendChild(style);
    console.log('Mobile styles injected');
}

// Initialize mobile functionality
function initMobileMenu() {
    const sidebar = document.querySelector('sidebar');
    const overlay = document.querySelector('.overlay');
    const burgerBtn = document.getElementById('burgerBtn');
    const body = document.body;

    console.log('Initializing mobile menu:', { sidebar, overlay, burgerBtn });

    if (!sidebar || !overlay || !burgerBtn) {
        console.error('Required elements not found:', {
            sidebar: !!sidebar,
            overlay: !!overlay,
            burgerBtn: !!burgerBtn
        });
        return;
    }

    // Burger button click handler
    burgerBtn.addEventListener('click', function(event) {
        console.log('Burger button clicked');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('sidebar-open');
        burgerBtn.classList.toggle('active');
        event.stopPropagation();
    });

    // Close sidebar when clicking on the overlay
    overlay.addEventListener('click', function() {
        console.log('Overlay clicked');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('sidebar-open');
        burgerBtn.classList.remove('active');
    });

    // Close sidebar when clicking on a nav link
    document.addEventListener('click', function(event) {
        if (sidebar.classList.contains('active') && event.target.matches('.nav-link')) {
            console.log('Nav link clicked, closing sidebar');
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

    console.log('Mobile menu initialized successfully');
}

// Check if we should initialize mobile features
function shouldInitializeMobile() {
    return window.innerWidth <= 768;
}

// Main initialization function
function initializeMobile() {
    console.log('Initializing mobile features...');
    
    createMobileBanner();
    createOverlay();
    injectMobileStyles();
    
    // Small delay to ensure DOM is updated
    setTimeout(() => {
        initMobileMenu();
    }, 100);
}

// Document ready handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking mobile initialization');
    
    if (shouldInitializeMobile()) {
        console.log('Mobile device detected, initializing mobile features');
        initializeMobile();
    } else {
        console.log('Desktop device detected, skipping mobile features');
        // Still inject hide styles for mobile elements that might exist
        const style = document.createElement('style');
        style.textContent = `
            .mobile-banner { display: none !important; }
            .overlay { display: none !important; }
        `;
        document.head.appendChild(style);
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            console.log('Window resized to:', window.innerWidth);
            
            if (shouldInitializeMobile()) {
                if (!document.querySelector('.mobile-banner')) {
                    console.log('Switched to mobile, initializing features');
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
        console.log('DOM already ready, initializing mobile features');
        setTimeout(initializeMobile, 500);
    }
}