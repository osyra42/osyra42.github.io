// signature.js - Shared config for the page footer rendered by the ::signature:: brewdown token.
//
// MUST load BEFORE brewdown.js (brewdown runs as soon as it executes and reads window.SIGNATURE).
// Each page ends its content with a single `::signature::` line; brewdown expands it into the
// footer using the shared fields below.
//
// NOTE: per-page "Last Updated" dates live in assets/js/manifest.js (window.MANIFEST), NOT here -
// that one map feeds this footer, the sidebar nav, and the ✨ badge.
window.SIGNATURE = {
    site: "Coffee Byte Dev",     // the site's display name - used by the sidebar
                                 // brand block and the mobile banner too
    domain: "coffeebyte.dev",
    author: "osyra42",
    contact: "coffeebytedev@proton.me",
    license: "© 2026 Coffee Byte Dev - personal use, please don't redistribute"
};
