// scripts.js - small page-wide behaviours.
//
// Layout convention (all site JS follows this order):
//   1. imports / dependencies      2. variables / config
//   3. functions                   4. execution
// Keeping executions last means every function and value a handler touches is
// already defined when it runs, which avoids ordering bugs.

// ---------------------------------------------------------------------------
// 2. Variables
// ---------------------------------------------------------------------------

// Marks a <details> that WE opened for printing, so afterprint only closes
// those and leaves ones the reader opened themselves alone.
const PRINT_OPENED = 'printOpened';

// ---------------------------------------------------------------------------
// 3. Functions
// ---------------------------------------------------------------------------

// Collapsed <details> print as just their summary line, silently dropping the
// content. Open them all for the print pass.
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

// ---------------------------------------------------------------------------
// 4. Execution
// ---------------------------------------------------------------------------

window.addEventListener('beforeprint', openDetailsForPrint);
window.addEventListener('afterprint', restoreDetailsAfterPrint);
