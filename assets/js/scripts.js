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
