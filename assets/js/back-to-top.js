// back-to-top.js - Shows a "Back to Top" button after scrolling
document.addEventListener('DOMContentLoaded', function () {
  const mainEl = document.querySelector('main');
  const btn = document.getElementById('back-to-top');
  if (!mainEl || !btn) return;

  mainEl.addEventListener('scroll', function () {
    btn.style.display = mainEl.scrollTop > 1600 ? 'block' : 'none';
  });

  btn.addEventListener('click', function () {
    mainEl.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
