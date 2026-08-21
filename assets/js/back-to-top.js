// back-to-top.js - shows a "Back to Top" button after scrolling.
//
// Order: variables, then functions, then execution (site convention).

// ---------------------------------------------------------------------------
// Variables
// ---------------------------------------------------------------------------

// Desktop scrolls <main> (it is its own scroll container); mobile scrolls the
// window, because mobile.css unsets that height and lets the page scroll.
const BTT_MOBILE_QUERY = '(max-width: 768px)';
const BTT_THRESHOLD_DESKTOP = 1600;
const BTT_THRESHOLD_MOBILE = 800;

// ---------------------------------------------------------------------------
// Functions
// ---------------------------------------------------------------------------

// Visibility is toggled with a CLASS, not an inline style, so the button's
// layout (inline-flex, for the ↑ caret drawn in CSS) stays in the stylesheet.
// Setting element.style.display here would overwrite that layout every time.
function initBackToTop() {
    const mainEl = document.querySelector('main');
    const btn = document.getElementById('back-to-top');
    if (!mainEl || !btn) return;

    const isMobile = window.matchMedia(BTT_MOBILE_QUERY).matches;
    const scroller = isMobile ? window : mainEl;
    const threshold = isMobile ? BTT_THRESHOLD_MOBILE : BTT_THRESHOLD_DESKTOP;
    const offset = () => (isMobile ? window.scrollY : mainEl.scrollTop);

    scroller.addEventListener('scroll', () => {
        btn.classList.toggle('is-visible', offset() > threshold);
    });

    btn.addEventListener('click', () => {
        scroller.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---------------------------------------------------------------------------
// Execution
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', initBackToTop);
