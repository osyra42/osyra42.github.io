// manifest.js - the single source of truth for the sidebar, page footers,
// and per-page stats. HAND-MAINTAINED - edit it directly.
//
// Fields:
//   title    shown in the sidebar and the ::signature:: footer
//   icon     emoji shown before the title
//   section  sidebar group; order controlled by window.SECTIONS below
//   date     "Last Updated" in the footer; drives the sidebar's 14-day ✨ badge
//   words    prose word count (code blocks and markup excluded)
//   minutes  read time at 220 wpm, shown as a tooltip on sidebar links
//
// To add a page: run `python tools/inspect_page.py <page>` and paste the line
// it prints. That tool only reads - it never writes this file.
//
// Pages absent from this map are simply not indexed (mcupdates.html and the
// legal pages). MUST load before brewdown.js and sidebar.js.
window.SECTIONS = ["Site", "Books", "Games", "Guides & How-Tos", "DevTools"];

window.MANIFEST = {
    "index.html":                { title: "Welcome",                icon: "🏠", section: "Site",             date: "2026.08.11", words:   292, minutes:  2 },
    "about_me.html":             { title: "About Me",               icon: "👋", section: "Site",             date: "2026.08.11", words:   591, minutes:  3 },
    "changelog.html":            { title: "Changelog",              icon: "📰", section: "Site",             date: "2026.08.11", words:  7950, minutes: 37 },
    "minecraft.html":            { title: "Minecraft Server",       icon: "⛏️", section: "Site",             date: "2026.08.22", words:  1159, minutes:  6 },
    "recommendations.html":      { title: "Recommendations",        icon: "⭐", section: "Site",             date: "2026.07.18", words:  1024, minutes:  5 },
    "support_me.html":           { title: "Support Me",             icon: "☕", section: "Site",             date: "2026.07.18", words:   286, minutes:  2 },
    "ever_diamond.html":         { title: "Ever Diamond",           icon: "💎", section: "Books",            date: "2026.07.18", words: 12951, minutes: 59 },
    "glitched.html":             { title: "Glitched",               icon: "⚡", section: "Books",            date: "2026.07.18", words:  9603, minutes: 44 },
    "infinite_devastation.html": { title: "Infinite Devastation",   icon: "⚔️", section: "Books",            date: "2026.07.18", words:  7196, minutes: 33 },
    "operation_chimera.html":    { title: "Operation Chimera",      icon: "📖", section: "Books",            date: "2026.08.06", words:   400, minutes:  2 },
    "blank_pixel_game.html":     { title: "Blank Pixel Game",       icon: "🕹️", section: "Games",            date: "2026.07.18", words:  1535, minutes:  7 },
    "clutter.html":              { title: "Clutter",                icon: "🎄", section: "Games",            date: "2026.07.18", words:   427, minutes:  2 },
    "sipsip.html":               { title: "Sip Sip",                icon: "🧋", section: "Games",            date: "2026.07.24", words:   230, minutes:  2 },
    "3d_prints.html":            { title: "3D Prints",              icon: "🖨️", section: "Guides & How-Tos", date: "2026.07.24", words:   744, minutes:  4 },
    "better_for_free.html":      { title: "Better for Free",        icon: "💡", section: "Guides & How-Tos", date: "2026.07.18", words:  2564, minutes: 12 },
    "comfyui_guide.html":        { title: "How to Use ComfyUI",     icon: "🎨", section: "Guides & How-Tos", date: "2026.07.18", words:   955, minutes:  5 },
    "how_magnets_work.html":     { title: "How Magnets Work",       icon: "🧲", section: "Guides & How-Tos", date: "2026.07.18", words:   623, minutes:  3 },
    "video_editing.html":        { title: "How to Edit Videos",     icon: "🎬", section: "Guides & How-Tos", date: "2026.07.24", words:   516, minutes:  3 },
    "urbex_safety.html":         { title: "How to Urbex Safely",    icon: "🏚️", section: "Guides & How-Tos", date: "2026.07.18", words:  1054, minutes:  5 },
    "vtuber_guide.html":         { title: "How to Become a VTuber", icon: "🎭", section: "Guides & How-Tos", date: "2026.07.21", words:  1092, minutes:  5 },
    "worksheets.html":           { title: "Homeschool Worksheets",  icon: "📝", section: "Guides & How-Tos", date: "2026.07.18", words:   395, minutes:  2 },
    "become_the_problem.html":   { title: "Become the Problem",     icon: "🔓", section: "DevTools",         date: "2026.07.24", words:  2231, minutes: 11 },
    "blender_resources.html":    { title: "Blender Resources",      icon: "🧊", section: "DevTools",         date: "2026.07.18", words:   268, minutes:  2 },
    "brewdown.html":             { title: "Brewdown",               icon: "☕", section: "DevTools",         date: "2026.06.27", words:   977, minutes:  5 },
    "casio_code.html":           { title: "Casio Code",             icon: "🔢", section: "DevTools",         date: "2026.07.18", words:   543, minutes:  3 },
    "code_resources.html":       { title: "Code Resources",         icon: "🐍", section: "DevTools",         date: "2026.07.18", words:   172, minutes:  1 },
    "media_mimic.html":          { title: "Media Mimic",            icon: "🎬", section: "DevTools",         date: "2026.07.18", words:   671, minutes:  4 },
    "zzz_launcher.html":         { title: "Sleep Launcher",         icon: "😴", section: "DevTools",         date: "2026.07.18", words:  1643, minutes:  8 },
    "vanity.html":               { title: "Vanity",                 icon: "🤖", section: "DevTools",         date: "2026.07.14", words:  4138, minutes: 19 },
    "yt_dlp_tool.html":          { title: "yt-dlp Tool",            icon: "🎬", section: "DevTools",         date: "2026.07.24", words:   635, minutes:  3 }
};
