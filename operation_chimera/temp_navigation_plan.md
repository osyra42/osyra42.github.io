# TEMP — Operation Chimera: Navigation Rebuild

*Scratch/brainstorm file. Not canon, not merge-ready. Ideas for restructuring how the section is navigated.*

---

## Current state (the problem)

Everything lives on one page (`operation_chimera.html`):
- Every chapter of every book inlined as collapsible `>>>` blocks
- All of it loads together; the page only grows
- Wiki is a single dropdown buried at the bottom
- No scannable overview — the landing page *is* the whole library

Fine for one book. Doesn't scale as books pile up.

---

## Agreed structure (sidebar)

Parent: **Story** → three sub-sections:

- **📖 Lore** (the wiki/codex)
- **🗡️ Main** (main-quest books, read in order)
- **🧭 Side** (side-quest one-shots, optional)

So the sidebar nests one level: `Story ▸ { Lore, Main, Side }`.

---

## Direction — structure it like an MMO

Treat the section like a game's content menu. Three buckets under **Story**:

### 🗡️ Main Stories (the "main quest")
The core throughline — the canon spine of the Chimera Project conspiracy. Read these in order; they carry the overarching plot.
- Blood Relation (current main entry)
- Mireheart
- (future main books)

### 🧭 Side Stories (the "side quests")
Self-contained or tangential tales. Same world and cast, but optional — character one-offs, standalone missions, mood pieces. Don't need to be read in order, don't gate the main plot.
- (the romance / vaccine explorations could graduate into side stories)
- (future one-shots)

### 📖 Wiki = Lore (the "codex / bestiary")
Reference material, not narrative. The in-world encyclopedia: characters, locations, groups, world lore, the strain/variants. Like an MMO's lore codex you open between quests.
- Already exists in `wiki/` — just promote it to a top-level peer of the stories instead of a buried dropdown.

---

## How it maps to pages (MMO menu → site)

- **Hub page** (`operation_chimera.html`) = the game's main menu / content select. Short, scannable. Three sections — Main Stories, Side Stories, Wiki — each a list of "cards" (cover, blurb, chapter count, ✨ recently-updated badge). No chapter text on the hub.
- **One page per book** = entering a "zone." Holds just that book's chapters + its own chapter nav (jump links, prev/next) + its own "Save as PDF."
- **Wiki page** = the codex. Its own page, linkable directly and cross-linked from chapters.
- **Sidebar** = the persistent nav spine. An Operation Chimera dropdown: Hub · Main Stories · Side Stories · Wiki.

---

## Why this fits

- Mirrors how players already think: main quest vs. side quest vs. codex.
- Readers self-select: "I want the plot" → Main; "give me a one-shot" → Side; "who is this character" → Wiki/Lore.
- Each book/story is its own page → its own update date, ✨ badge, and clean PDF export.
- Chapter `.md` files and brewdown stay exactly as they are — this is mostly re-bucketing and moving blocks onto separate pages.

---

## Page rebuild (decided)

**Problem:** everything is a dropdown — the hub buries content behind nested collapsibles.

**Fix:** stop expanding in place, start navigating to real pages.

**The two-page flow (confirmed):**
1. **Main/hub page** = the shelf. No story text here.
2. **Click a section/side book → its own page** = a TOC of that page's chapters + the actual content, inline on one scrolling page.

So: hub lists the entries → each entry's page holds its TOC + content. Content never lives on the hub.

**Hierarchy (confirmed):**
```
Main Story
  Section 1   ← own page (TOC of chapters + content)
  Section 2   ← own page
  Section 3   ← own page
```
- The **Main Story** is split into **Sections**; **each Section is its own page** containing its **chapters** (TOC + inline content, one scrolling page).
- **Side** = mini side books, each its own page the same way (TOC of chapters + content).
- So the page-level unit is the **Section** (for Main) or the **mini side book** (for Side) — *not* the whole Main Story on one page.

### Hub page (`operation_chimera.html`) — a flat shelf, NO dropdowns
- Three labeled sections: 🗡️ Main · 🧭 Side · 📖 Lore
- **Main** = the main book, shown with its **sections (mini books) listed** beneath it — so you can see the spine and jump to a section.
- **Side** = the **mini side books**, listed as their own entries.
- **Lore** = link to the codex page.
- Each entry: title, one-line blurb, ✨ recently-updated badge. Clicking goes to a dedicated page (or jumps to a section). Scannable top-to-bottom, nothing hidden.

### Section / side-book page — ONE scrolling page + table of contents *(chosen reading model)*
Each page is one **Section** (Main) or one **mini side book** (Side):
- All its **chapters** render inline, full text, in order — just scroll.
- **TOC at the top** = jump links (anchors) to each chapter on that page.
- Prev/next links between chapters for flow.
- One "Save as PDF" = that one section/side book.
- No collapsibles anywhere.
- Lightest lift from the current setup — chapter `.md` files render straight instead of inside `>>>` blocks.

**Heading levels (per page):**
- `#` H1 = **Section** (or mini side book) title — the page itself
- `###` H3 = **Chapter** within it (kept light to clean up the look)

Navigation between sections happens on the **hub** (which lists Section 1/2/3) and via prev/next links, not by stacking the whole Main Story on one page.

### Lore page — its own codex page
- The wiki index promoted to a standalone page, linkable directly and cross-linked from chapters.

### Sidebar — the nav spine
- `Story ▸ { Lore, Main, Side }` dropdown (nesting only in the sidebar, not on the pages).

---

## Content assignment (decided)

- **Main Story = the Chimera Incident** — the core conspiracy spine. Currently **empty / to be written**, split into Sections (`section01`, `section02`, ...).
- **Side = everything written so far.** Blood Relation and Mireheart are Side stories: they really happened in-world, but they're **not tied to the Chimera Incident**, so they're optional side content, not the main quest.
- **Lore** = the wiki/codex.

## Naming (decided)

- Main sections: `section01`, `section02`, ... (e.g. `section01.html`).
- Side books: keep their own names.
- Lore: its own page.

## Hub presentation (decided)

- **For now, plain text** — the hub is text links/lists, not cover-image cards. Keep it simple; visuals (cards, covers) can come later.

## Still open
- How Side stories' existing chapters group into mini books (or stay as-is).
- A "start here" pointer for new readers on the hub.