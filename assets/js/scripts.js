const PRINT_OPENED = 'printOpened';

function openDetailsForPrint() {
    document.querySelectorAll('details:not([open])').forEach(d => {
        d.setAttribute('open', '');
        d.dataset[PRINT_OPENED] = '';
    });
}

function restoreDetailsAfterPrint() {
    document.querySelectorAll('details[data-print-opened]').forEach(d => {
        d.removeAttribute('open');
        delete d.dataset[PRINT_OPENED];
    });
}

window.addEventListener('beforeprint', openDetailsForPrint);
window.addEventListener('afterprint', restoreDetailsAfterPrint);
