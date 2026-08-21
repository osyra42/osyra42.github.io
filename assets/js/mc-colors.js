// mc-colors.js - the 16 Minecraft chat colours, by their real names.
//
// These are the § codes you type in Minecraft chat (§a for green, §c for red,
// and so on). All 16 are here whether or not a given page uses them, so any can
// be swapped in later without looking values up again.
//
// Used by changelog.html as an easter egg: the game's own conventions already
// match the changelog legend's meanings, so green really does mean added and
// red really does mean removed.
//
// `light` and `dark` group them by which background they are built for. The
// bright eight are designed for Minecraft's black chat box and wash out badly
// on a light surface; the dark eight are the ones legible on paper.

window.MC_COLORS = {
    black:        { code: '0', hex: '000000', group: 'dark'  },
    dark_blue:    { code: '1', hex: '0000AA', group: 'dark'  },
    dark_green:   { code: '2', hex: '00AA00', group: 'dark'  },
    dark_aqua:    { code: '3', hex: '00AAAA', group: 'dark'  },
    dark_red:     { code: '4', hex: 'AA0000', group: 'dark'  },
    dark_purple:  { code: '5', hex: 'AA00AA', group: 'dark'  },
    gold:         { code: '6', hex: 'FFAA00', group: 'light' },
    gray:         { code: '7', hex: 'AAAAAA', group: 'light' },
    dark_gray:    { code: '8', hex: '555555', group: 'dark'  },
    blue:         { code: '9', hex: '5555FF', group: 'dark'  },
    green:        { code: 'a', hex: '55FF55', group: 'light' },
    aqua:         { code: 'b', hex: '55FFFF', group: 'light' },
    red:          { code: 'c', hex: 'FF5555', group: 'light' },
    light_purple: { code: 'd', hex: 'FF55FF', group: 'light' },
    yellow:       { code: 'e', hex: 'FFFF55', group: 'light' },
    white:        { code: 'f', hex: 'FFFFFF', group: 'light' },
};

// Look a colour up by name and get its hex, with a leading #.
window.mcHex = name => {
    const c = window.MC_COLORS[name];
    return c ? '#' + c.hex : '#000000';
};
