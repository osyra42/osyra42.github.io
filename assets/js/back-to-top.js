// back-to-top.js - Shows a "Back to Top" button after scrolling
document.addEventListener('DOMContentLoaded', function () {
  const mainEl = document.querySelector('main');
  const btn = document.getElementById('back-to-top');
  if (!mainEl || !btn) return;

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (isMobile) {
    window.addEventListener('scroll', function () {
      btn.style.display = window.scrollY > 800 ? 'block' : 'none';
    });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  } else {
    mainEl.addEventListener('scroll', function () {
      btn.style.display = mainEl.scrollTop > 1600 ? 'block' : 'none';
    });
    btn.addEventListener('click', function () {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
