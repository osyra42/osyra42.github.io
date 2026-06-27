// signature.js - Shared config for the page footer rendered by the ::signature:: brewdown token.
//
// MUST load BEFORE brewdown.js (brewdown runs as soon as it executes and reads window.SIGNATURE).
// Each page ends its content with a single `::signature::` line; brewdown expands it into the
// footer using the shared fields below.
//
// NOTE: per-page "Last Updated" dates live in assets/js/update.js (window.UPDATES), NOT here -
// that one map feeds both this footer and the sidebar's ✨ badge.
window.SIGNATURE = {
    domain: "coffeebyte.dev",
    author: "osyra42",
    contact: "coffeebytedev@proton.me",
    license: "© 2026 Coffee Byte Dev - personal use, please don't redistribute"
};
