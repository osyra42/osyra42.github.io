// themes.js — flavor themes, derived from a single hex each.
//
// Add a flavor by adding ONE hex to FLAVORS. Every other shade it needs — the
// lighter and darker accents, the paper tint, the ink, the grid lines — is
// calculated from that hex at load. There are no per-theme colour blocks in
// theme.css any more; this file is the only place colour is defined.
//
// WHY OKLCH: HSL's "lightness" is a maths midpoint, not a measure of how bright
// something looks — L 54% yellow reads far brighter than L 54% purple. So a
// fixed HSL step lands differently on every hue and needs hand-correcting per
// theme. OKLCH's lightness is perceptually uniform, so one L step looks like
// the same step on all 17 flavors. Hex in, hex out; OKLCH is only the space the
// maths happens in.
//
// WHAT IS NOT DERIVED: the espresso / mocha / chocolate backgrounds. This is a
// coffee site — flavor is a tint applied over a coffee base, not a replacement
// for it. Warning red and tip mint also stay fixed, because they carry meaning.
//
// Load order: before sidebar.js (which calls Themes.resolve() and Themes.apply).

const Themes = (function () {

    // -----------------------------------------------------------------------
    // The roster. One hex per flavor - that is the whole definition.
    // -----------------------------------------------------------------------
    // Ordered red -> purple like a rainbow, then the browns as their own run.
    // Hand-ordered: a new flavor goes wherever it belongs by eye.
    //
    // Brown is just a dark, desaturated orange, so on a pure hue sort chai,
    // mocha and espresso land between peach and caramel and the rainbow falls
    // apart. They get their own run at the end instead - fitting for a coffee
    // site, where those three are the house colours.
    const FLAVORS = [
        { id: 'cherry',       label: 'Cherry',        hex: '#d63030' },
        { id: 'blood_orange', label: 'Blood Orange',  hex: '#e0561f' },
        { id: 'peach',        label: 'Peach',         hex: '#f0a071' },
        { id: 'caramel',      label: 'Caramel',       hex: '#c9651a' },
        { id: 'pumpkin',      label: 'Pumpkin Spice', hex: '#d1802a' },
        { id: 'hazelnut',     label: 'Hazelnut',      hex: '#b08948' },
        { id: 'honey',        label: 'Honey',         hex: '#e0a92b' },
        { id: 'vanilla',      label: 'Vanilla',       hex: '#dfc994' },
        { id: 'lemon',        label: 'Lemon',         hex: '#d9c231' },
        { id: 'pistachio',    label: 'Pistachio',     hex: '#a8c44a' },
        { id: 'matcha',       label: 'Matcha',        hex: '#7fa832' },
        { id: 'mint',         label: 'Mint',          hex: '#4fbf95' },
        { id: 'spearmint',    label: 'Spearmint',     hex: '#3fc7b4' },
        { id: 'blue_curacao', label: 'Blue Curacao',  hex: '#2f9fd6' },
        { id: 'blueberry',    label: 'Blueberry',     hex: '#4a5fb5' },
        { id: 'blackberry',   label: 'Blackberry',    hex: '#6b4f9e' },
        { id: 'lavender',     label: 'Lavender',      hex: '#9b8ede' },
        { id: 'ube',          label: 'Ube',           hex: '#8b5fc4' },
        { id: 'plum',         label: 'Plum',          hex: '#8a3f6b' },
        { id: 'fig',          label: 'Fig',           hex: '#a8447a' },
        { id: 'rose',         label: 'Rose',          hex: '#d4708f' },
        { id: 'raspberry',    label: 'Raspberry',     hex: '#c72e5a' },
        { id: 'chai',         label: 'Chai',          hex: '#b5643a' },
        { id: 'mocha',        label: 'Mocha',         hex: '#6b4230' },
        { id: 'espresso',     label: 'Espresso',      hex: '#4a3226' },
        { id: 'double_espresso', label: 'Double Espresso', hex: '#120a06' },
    ];

    // Shown to anyone who has never picked a flavor. Change by hand for the
    // season. A visitor's own choice is kept in localStorage and always wins -
    // this never overwrites it.
    const DEFAULT_THEME = 'pumpkin';

    // -----------------------------------------------------------------------
    // Tuning. These are the only numbers to touch when the palette feels off.
    // -----------------------------------------------------------------------
    const TUNE = {
        // Accent shades: perceptual lightness steps from the base hex.
        lightStep: 0.09,
        darkStep: -0.14,
        // Shades drift slightly toward grey as they lighten and hold colour as
        // they darken, which is how ink and pigment actually behave.
        lightChroma: 0.88,
        darkChroma: 1.04,

        // Paper tint. Chroma is absolute in OKLCH; ~0.010-0.015 is the "is that
        // tinted or am I imagining it" range that was asked for.
        paperChroma: 0.006,
        shadeChroma: 0.008,
        edgeChroma: 0.011,
        // Ink takes the same hue at a sliver of the strength - paper going warm
        // while the ink stays neutral reads as a printing fault.
        inkChroma: 0.005,
        inkSoftChroma: 0.007,

        // Neutral lightness of each paper surface. Hue and chroma come from the
        // flavor; these stay put so contrast does not move between themes.
        paperL: 0.872,
        shadeL: 0.838,
        edgeL: 0.784,
        inkL: 0.246,
        inkSoftL: 0.436,

        // Link colour on paper: the accent hue, darkened and slightly muted.
        // linkL is a STARTING point, not a fitted constant - the derivation
        // below darkens from here until the contrast target is met, so a newly
        // added flavor corrects itself instead of needing this number retuned.
        linkL: 0.470,
        linkChroma: 1.15,

        // Minimum contrast for text on paper. WCAG AA for body text is 4.5:1;
        // the small margin absorbs rounding when a colour is clamped to sRGB.
        minContrast: 4.6,

        // Alpha for the hairline decorations drawn in the flavor's hue.
        gridAlpha: 0.13,
        tickAlpha: 0.18,
        hatchAlpha: 0.10,

        // Sidebar row washes and the active-row connector glow.
        // The row washes start strong at the left edge and fade to nothing, so
        // the text has a solid ground where it begins rather than sitting on a
        // uniform tint.
        //
        // 0.35 is the ceiling: past it the LIGHT flavours (lemon, honey,
        // pistachio) turn the row into a bright band and the white link text
        // drops under 4.5:1 against it. Measured across all 25.
        hoverAlpha: 0.22,
        activeAlpha: 0.35,
        glowAlpha: 0.80,
    };

    // =======================================================================
    // Colour conversion: sRGB <-> OKLCH.
    // Ottosson's OKLab matrices; OKLCH is OKLab in polar form.
    // =======================================================================

    const srgbToLinear = c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    const linearToSrgb = c => c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

    function hexToOklch(hex) {
        const n = parseInt(hex.slice(1), 16);
        const r = srgbToLinear((n >> 16 & 255) / 255);
        const g = srgbToLinear((n >> 8 & 255) / 255);
        const b = srgbToLinear((n & 255) / 255);

        const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
        const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
        const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

        const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
        const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
        const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;

        return {
            L,
            C: Math.hypot(A, B),
            H: (Math.atan2(B, A) * 180 / Math.PI + 360) % 360,
        };
    }

    // Returns {r,g,b} in 0-255 plus `clipped`, true when the colour fell outside
    // what sRGB can show. Used by the gamut walk below.
    function oklchToRgbRaw({ L, C, H }) {
        const h = H * Math.PI / 180;
        const A = Math.cos(h) * C;
        const B = Math.sin(h) * C;

        const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
        const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
        const s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3;

        const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
        const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
        const lb = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

        const clipped = [lr, lg, lb].some(v => v < -0.0001 || v > 1.0001);
        const to255 = v => Math.round(Math.min(1, Math.max(0, linearToSrgb(v))) * 255);

        return { r: to255(lr), g: to255(lg), b: to255(lb), clipped };
    }

    // OKLCH can describe colours sRGB cannot display. Rather than let those clip
    // to a flat, wrong colour, walk the chroma down until the result fits -
    // preserving hue and lightness, which is what the eye notices most.
    function oklchToHex(colour) {
        let { L, C, H } = colour;
        let out = oklchToRgbRaw({ L, C, H });

        for (let i = 0; i < 24 && out.clipped && C > 0; i++) {
            C *= 0.92;
            out = oklchToRgbRaw({ L, C, H });
        }

        return '#' + [out.r, out.g, out.b]
            .map(v => v.toString(16).padStart(2, '0')).join('');
    }

    // WCAG relative luminance + contrast ratio, used to keep derived text
    // colours legible on their own derived paper without hand-fitting.
    function luminance({ r, g, b }) {
        const f = v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    }

    function contrast(a, b) {
        const x = luminance(a), y = luminance(b);
        return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    }

    // Darken a colour step by step until it clears `target` against `onRgb`.
    // This is what makes a NEW flavor safe without retuning anything: whatever
    // hue is added, its text colour walks down to a legible lightness on its
    // own. Yellows and greens need more darkening than blues; the loop finds
    // that per hue instead of a constant guessing for all of them.
    function darkenToContrast(colour, onRgb, target) {
        let c = { ...colour };
        for (let i = 0; i < 40; i++) {
            const rgb = oklchToRgbRaw(c);
            if (contrast(rgb, onRgb) >= target || c.L <= 0.05) break;
            c.L -= 0.015;
        }
        return c;
    }

    function oklchToRgba(colour, alpha) {
        const { r, g, b } = oklchToRgbRaw(colour);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // =======================================================================
    // colorize — every surface tinted by the chosen flavor.
    //
    // Each entry maps a CSS custom property to a rule that builds its value
    // from the base colour. Adding a newly tinted surface is one entry here,
    // not new code anywhere else.
    // =======================================================================
    const colorize = {
        // ---- Accents: the flavor at three lightnesses --------------------
        '--accent': base => oklchToHex(base),

        '--accent-light': base => oklchToHex({
            L: base.L + TUNE.lightStep,
            C: base.C * TUNE.lightChroma,
            H: base.H,
        }),

        '--accent-dark': base => oklchToHex({
            L: base.L + TUNE.darkStep,
            C: base.C * TUNE.darkChroma,
            H: base.H,
        }),

        // ---- Paper: fixed neutral lightness, flavor hue at low chroma ----
        // Lightness is held constant across themes so text contrast never
        // moves; only the hue and a trace of chroma change.
        '--paper':      base => oklchToHex({ L: TUNE.paperL, C: TUNE.paperChroma, H: base.H }),
        '--paper-shade': base => oklchToHex({ L: TUNE.shadeL, C: TUNE.shadeChroma, H: base.H }),
        '--paper-edge':  base => oklchToHex({ L: TUNE.edgeL,  C: TUNE.edgeChroma,  H: base.H }),

        // ---- Ink: the same hue, a sliver of it -----------------------------
        '--paper-ink':      base => oklchToHex({ L: TUNE.inkL,     C: TUNE.inkChroma,     H: base.H }),
        '--paper-ink-soft': base => oklchToHex({ L: TUNE.inkSoftL, C: TUNE.inkSoftChroma, H: base.H }),

        // ---- Links on paper ------------------------------------------------
        // Darkens from linkL until it clears minContrast against this flavor's
        // own paper. Self-correcting, so adding a flavor never needs a retune.
        '--paper-link': base => {
            const paper = oklchToRgbRaw({ L: TUNE.paperL, C: TUNE.paperChroma, H: base.H });
            const start = { L: TUNE.linkL, C: base.C * TUNE.linkChroma, H: base.H };
            return oklchToHex(darkenToContrast(start, paper, TUNE.minContrast));
        },

        // ---- Hairline decorations, drawn in the flavor's hue ---------------
        '--grid-line': base => oklchToRgba({ L: 0.72, C: base.C * 0.5, H: base.H }, TUNE.gridAlpha),
        '--tick-line': base => oklchToRgba({ L: 0.76, C: base.C * 0.5, H: base.H }, TUNE.tickAlpha),
        '--hatch-line': base => oklchToRgba(base, TUNE.hatchAlpha),

        // ---- Sidebar row states -------------------------------------------
        // Washed behind the hovered and current rows, and the glow on the
        // connector line. These were hardcoded orange and did not follow the
        // theme; deriving them keeps the selection in the flavor's colour.
        '--row-hover': base => oklchToRgba(base, TUNE.hoverAlpha),
        '--row-active': base => oklchToRgba(base, TUNE.activeAlpha),
        '--accent-glow': base => oklchToRgba(base, TUNE.glowAlpha),
    };

    // =======================================================================
    // Public API
    // =======================================================================

    function byId(id) {
        return FLAVORS.find(f => f.id === id);
    }

    // The one place "which theme is active" is answered. Both the applied
    // palette and the highlighted swatch read this, so they cannot disagree -
    // a stored choice always beats DEFAULT_THEME.
    function resolve() {
        let stored = null;
        try { stored = localStorage.getItem('theme'); } catch (e) { /* private mode */ }
        return (stored && byId(stored)) ? stored : DEFAULT_THEME;
    }

    // Compute every derived value for a flavor and write it onto :root.
    function apply(id) {
        const flavor = byId(id) || byId(DEFAULT_THEME) || FLAVORS[0];
        const base = hexToOklch(flavor.hex);
        const root = document.documentElement;

        for (const [prop, derive] of Object.entries(colorize)) {
            root.style.setProperty(prop, derive(base));
        }

        // Kept for any CSS that wants to target a specific flavor by name.
        root.setAttribute('data-theme', flavor.id);
        return flavor;
    }

    // Forget the saved choice and fall back to DEFAULT_THEME. Used by the
    // reset swatch, so a visitor can hand the seasonal default back rather than
    // being stuck with whatever they picked months ago.
    function clear() {
        try { localStorage.removeItem('theme'); } catch (e) { /* private mode */ }
        return apply(DEFAULT_THEME);
    }

    function save(id) {
        try { localStorage.setItem('theme', id); } catch (e) { /* private mode */ }
        return apply(id);
    }

    // Preview a flavor's derived palette without applying it - used by the
    // swatches to paint themselves in their own colours.
    function palette(id) {
        const flavor = byId(id) || FLAVORS[0];
        const base = hexToOklch(flavor.hex);
        const out = {};
        for (const [prop, derive] of Object.entries(colorize)) out[prop] = derive(base);
        return out;
    }

    // Apply immediately, before DOMContentLoaded, so the page never paints in
    // one palette and then flips to another.
    apply(resolve());

    return { FLAVORS, DEFAULT_THEME, TUNE, resolve, apply, save, clear, palette, hexToOklch, oklchToHex };
})();
