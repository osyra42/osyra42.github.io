const Themes = (function () {

    const FLAVORS = [
        { id: 'cherry',          label: 'Cherry',          hex: '#d63030' },
        { id: 'blood_orange',    label: 'Blood Orange',    hex: '#e0561f' },
        { id: 'peach',           label: 'Peach',           hex: '#f0a071' },
        { id: 'caramel',         label: 'Caramel',         hex: '#c9651a' },
        { id: 'pumpkin',         label: 'Pumpkin Spice',   hex: '#d1802a' },
        { id: 'hazelnut',        label: 'Hazelnut',        hex: '#b08948' },
        { id: 'honey',           label: 'Honey',           hex: '#e0a92b' },
        { id: 'vanilla',         label: 'Vanilla',         hex: '#dfc994' },
        { id: 'lemon',           label: 'Lemon',           hex: '#d9c231' },
        { id: 'pistachio',       label: 'Pistachio',       hex: '#a8c44a' },
        { id: 'matcha',          label: 'Matcha',          hex: '#7fa832' },
        { id: 'mint',            label: 'Mint',            hex: '#4fbf95' },
        { id: 'spearmint',       label: 'Spearmint',       hex: '#3fc7b4' },
        { id: 'blue_curacao',    label: 'Blue Curacao',    hex: '#2f9fd6' },
        { id: 'blueberry',       label: 'Blueberry',       hex: '#4a5fb5' },
        { id: 'blackberry',      label: 'Blackberry',      hex: '#6b4f9e' },
        { id: 'lavender',        label: 'Lavender',        hex: '#9b8ede' },
        { id: 'ube',             label: 'Ube',             hex: '#8b5fc4' },
        { id: 'plum',            label: 'Plum',            hex: '#8a3f6b' },
        { id: 'fig',             label: 'Fig',             hex: '#a8447a' },
        { id: 'rose',            label: 'Rose',            hex: '#d4708f' },
        { id: 'raspberry',       label: 'Raspberry',       hex: '#c72e5a' },
        { id: 'chai',            label: 'Chai',            hex: '#b5643a' },
        { id: 'mocha',           label: 'Mocha',           hex: '#6b4230' },
        { id: 'espresso',        label: 'Espresso',        hex: '#4a3226' },
        { id: 'double_espresso', label: 'Double Espresso', hex: '#120a06' },
    ];

    const DEFAULT_THEME = 'pumpkin';

    const TUNE = {
        lightStep: 0.09,
        darkStep: -0.14,
        lightChroma: 0.88,
        darkChroma: 1.04,

        paperChroma: 0.006,
        shadeChroma: 0.008,
        edgeChroma: 0.011,
        inkChroma: 0.005,
        inkSoftChroma: 0.007,

        paperL: 0.872,
        shadeL: 0.838,
        edgeL: 0.784,
        inkL: 0.246,
        inkSoftL: 0.436,

        linkL: 0.470,
        linkChroma: 1.15,
        minContrast: 4.6,

        gridAlpha: 0.13,
        tickAlpha: 0.18,
        hatchAlpha: 0.10,

        hoverAlpha: 0.22,
        activeAlpha: 0.35,
        glowAlpha: 0.80,
    };

    // ---- sRGB <-> OKLCH ---------------------------------------------------

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

        return { L, C: Math.hypot(A, B), H: (Math.atan2(B, A) * 180 / Math.PI + 360) % 360 };
    }

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

    // Walk chroma down until the colour fits inside sRGB.
    function oklchToHex(colour) {
        let { L, C, H } = colour;
        let out = oklchToRgbRaw({ L, C, H });
        for (let i = 0; i < 24 && out.clipped && C > 0; i++) {
            C *= 0.92;
            out = oklchToRgbRaw({ L, C, H });
        }
        return '#' + [out.r, out.g, out.b].map(v => v.toString(16).padStart(2, '0')).join('');
    }

    function oklchToRgba(colour, alpha) {
        const { r, g, b } = oklchToRgbRaw(colour);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // ---- WCAG luminance / contrast ---------------------------------------

    function luminance({ r, g, b }) {
        const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    }

    function contrast(a, b) {
        const x = luminance(a), y = luminance(b);
        return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    }

    // Darken until the colour clears `target` contrast against `onRgb`.
    function darkenToContrast(colour, onRgb, target) {
        const c = { ...colour };
        for (let i = 0; i < 40; i++) {
            const rgb = oklchToRgbRaw(c);
            if (contrast(rgb, onRgb) >= target || c.L <= 0.05) break;
            c.L -= 0.015;
        }
        return c;
    }

    // ---- Palette derivation ----------------------------------------------

    const colorize = {
        '--accent':       base => oklchToHex(base),
        '--accent-light': base => oklchToHex({ L: base.L + TUNE.lightStep, C: base.C * TUNE.lightChroma, H: base.H }),
        '--accent-dark':  base => oklchToHex({ L: base.L + TUNE.darkStep,  C: base.C * TUNE.darkChroma,  H: base.H }),

        '--paper':       base => oklchToHex({ L: TUNE.paperL, C: TUNE.paperChroma, H: base.H }),
        '--paper-shade': base => oklchToHex({ L: TUNE.shadeL, C: TUNE.shadeChroma, H: base.H }),
        '--paper-edge':  base => oklchToHex({ L: TUNE.edgeL,  C: TUNE.edgeChroma,  H: base.H }),

        '--paper-ink':      base => oklchToHex({ L: TUNE.inkL,     C: TUNE.inkChroma,     H: base.H }),
        '--paper-ink-soft': base => oklchToHex({ L: TUNE.inkSoftL, C: TUNE.inkSoftChroma, H: base.H }),

        '--paper-link': base => {
            const paper = oklchToRgbRaw({ L: TUNE.paperL, C: TUNE.paperChroma, H: base.H });
            const start = { L: TUNE.linkL, C: base.C * TUNE.linkChroma, H: base.H };
            return oklchToHex(darkenToContrast(start, paper, TUNE.minContrast));
        },

        '--grid-line':  base => oklchToRgba({ L: 0.72, C: base.C * 0.5, H: base.H }, TUNE.gridAlpha),
        '--tick-line':  base => oklchToRgba({ L: 0.76, C: base.C * 0.5, H: base.H }, TUNE.tickAlpha),
        '--hatch-line': base => oklchToRgba(base, TUNE.hatchAlpha),

        '--row-hover':  base => oklchToRgba(base, TUNE.hoverAlpha),
        '--row-active': base => oklchToRgba(base, TUNE.activeAlpha),
        '--accent-glow': base => oklchToRgba(base, TUNE.glowAlpha),
    };

    // ---- Public API ------------------------------------------------------

    const byId = id => FLAVORS.find(f => f.id === id);

    function resolve() {
        let stored = null;
        try { stored = localStorage.getItem('theme'); } catch (e) {}
        return (stored && byId(stored)) ? stored : DEFAULT_THEME;
    }

    function apply(id) {
        const flavor = byId(id) || byId(DEFAULT_THEME) || FLAVORS[0];
        const base = hexToOklch(flavor.hex);
        const root = document.documentElement;
        for (const [prop, derive] of Object.entries(colorize)) {
            root.style.setProperty(prop, derive(base));
        }
        root.setAttribute('data-theme', flavor.id);
        return flavor;
    }

    function clear() {
        try { localStorage.removeItem('theme'); } catch (e) {}
        return apply(DEFAULT_THEME);
    }

    function save(id) {
        try { localStorage.setItem('theme', id); } catch (e) {}
        return apply(id);
    }

    function palette(id) {
        const flavor = byId(id) || FLAVORS[0];
        const base = hexToOklch(flavor.hex);
        const out = {};
        for (const [prop, derive] of Object.entries(colorize)) out[prop] = derive(base);
        return out;
    }

    apply(resolve());

    return { FLAVORS, DEFAULT_THEME, TUNE, resolve, apply, save, clear, palette, hexToOklch, oklchToHex };
})();