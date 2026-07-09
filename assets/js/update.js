// update.js - Single source of truth for every page's title + "last updated" date.
//
// Consumed by BOTH:
//   - brewdown.js  -> the ::signature:: footer reads the date for the current page
//   - sidebar.js   -> the ✨ "recently updated" badge (within 28 days) reads these dates
//
// MUST load before brewdown.js (and therefore before sidebar.js) in each page's <head>.
//
// To bump a page's date, edit it HERE - one place updates both the footer and the sidebar.
// Keys are the page's href exactly as used in the sidebar (e.g. "sipsip/index.html").
window.UPDATES = {
    "index.html":                { title: "Home Page",            date: "2026.06.26" },
    "minecraft.html":            { title: "Minecraft Server",     date: "2026.07.04" },
    "recommendations.html":      { title: "Recommendations",      date: "2026.06.26" },
    "support_me.html":           { title: "Support Me",           date: "2026.07.04" },
    "operation_chimera.html":    { title: "Operation Chimera",    date: "2026.07.05" },
    "oc_part1.html":             { title: "The Chimera Incident - Part 1", date: "2026.07.05" },
    "oc_borne_weapon.html":      { title: "Borne Weapon",         date: "2026.07.05" },
    "oc_blood_relation.html":    { title: "Blood Relation",       date: "2026.06.29" },
    "oc_mireheart.html":         { title: "Mireheart",            date: "2026.06.28" },
    "oc_for_the_next_operator.html": { title: "For the Next Operator", date: "2026.07.04" },
    "oc_red_light.html":         { title: "Red Light",            date: "2026.07.03" },
    "oc_lore.html":              { title: "Operation Chimera Lore", date: "2026.07.03" },
    "ever_diamond.html":         { title: "Ever Diamond",         date: "2026.07.04" },
    "infinite_devastation.html": { title: "Infinite Devastation", date: "2026.07.04" },
    "glitched.html":             { title: "Glitched",             date: "2026.07.04" },
    "blank_pixel_game.html":     { title: "Blank Pixel Game",     date: "2026.06.18" },
    "3d_pixel_game.html":        { title: "3D Pixel Game",        date: "2026.07.04" },
    "sipsip.html":               { title: "Sip Sip",              date: "2026.07.04" },
    "urbex_safety.html":         { title: "Urbex Safety",         date: "2026.06.20" },
    "vtuber_guide.html":         { title: "VTuber Guide",         date: "2026.06.26" },
    "how_magnets_work.html":     { title: "How Magnets Work",     date: "2026.05.08" },
    "worksheets.html":           { title: "Worksheets",           date: "2026.06.20" },
    "better_for_free.html":      { title: "Better for Free",      date: "2026.07.04" },
    "comfyui_guide.html":        { title: "ComfyUI Guide",        date: "2026.06.29" },
    "video_editing.html":        { title: "How to Edit Videos",   date: "2026.07.04" },
    "brewdown.html":             { title: "Brewdown",             date: "2026.05.23" },
    "blender_resources.html":    { title: "Blender Resources",    date: "2026.05.08" },
    "zen_launcher.html":         { title: "Zen Launcher",         date: "2026.05.08" },
    "bounties.html":             { title: "Bounties",             date: "2026.07.04" },
    "vanity.html":               { title: "Vanity Bot",           date: "2026.05.05" },
    "casio_code.html":           { title: "Casio Code",           date: "2026.04.27" },
    "code_resources.html":       { title: "Code Resources",       date: "2026.03.07" },
    "3d_prints.html":            { title: "3D Prints",            date: "2026.07.04" },
    "media_mimic.html":          { title: "Media Mimic",          date: "2026.07.03" },
    "clutter.html":              { title: "Clutter",              date: "2026.02.19" },
    "mcupdates.html":            { title: "Minecraft Updates",    date: "2026.07.04" }
};
