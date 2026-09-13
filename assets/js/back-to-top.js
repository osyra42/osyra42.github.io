const BTT_MOBILE_QUERY = '(max-width: 768px)';
const BTT_THRESHOLD_DESKTOP = 1600;
const BTT_THRESHOLD_MOBILE = 800;

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

document.addEventListener('DOMContentLoaded', initBackToTop);
