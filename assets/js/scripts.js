// scripts.js

// Open all <details> dropdowns before printing, restore after
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('details:not([open])').forEach(d => {
    d.setAttribute('open', '');
    d.dataset.printOpened = '';
  });
});

window.addEventListener('afterprint', () => {
  document.querySelectorAll('details[data-print-opened]').forEach(d => {
    d.removeAttribute('open');
    d.removeAttribute('data-print-opened');
  });
});

// Reusable tooltip: any element with a [data-tooltip="..."] attribute shows a
// styled bubble on hover/focus. Instant (no native title delay) and works for
// elements added later (event delegation). Styling lives in styles.css (.tooltip).
(function () {
  let tip = null;

  function getTip() {
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'tooltip';
      tip.setAttribute('role', 'tooltip');
      document.body.appendChild(tip);
    }
    return tip;
  }

  function show(el) {
    const text = el.getAttribute('data-tooltip');
    if (!text) return;
    const t = getTip();
    t.textContent = text;
    // Measure first (made displayable via .tooltip styles), then position.
    const r = el.getBoundingClientRect();
    const tr = t.getBoundingClientRect();
    let left = r.left + r.width / 2 - tr.width / 2;
    let top = r.top - tr.height - 8;
    if (top < 6) top = r.bottom + 8;               // flip below if no room above
    left = Math.max(6, Math.min(left, window.innerWidth - tr.width - 6));
    t.style.left = (left + window.scrollX) + 'px';
    t.style.top = (top + window.scrollY) + 'px';
    t.classList.add('tooltip--visible');
  }

  function hide() {
    if (tip) tip.classList.remove('tooltip--visible');
  }

  document.addEventListener('mouseover', e => {
    const el = e.target.closest('[data-tooltip]');
    if (el) show(el);
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('[data-tooltip]')) hide();
  });
  document.addEventListener('focusin', e => {
    const el = e.target.closest('[data-tooltip]');
    if (el) show(el);
  });
  document.addEventListener('focusout', hide);
  window.addEventListener('scroll', hide, true);
})();
