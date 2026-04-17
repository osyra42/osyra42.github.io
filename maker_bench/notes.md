# Notes

## Project Concept
Maker Bench is a personal inventory + project system for a physical workspace. Browse components on the website, then build things in real life from a library of schematics.

**External branding:** Maker Bench (non-Minecraft name)
**Internal theming:** Minecraft / modded Minecraft terminology throughout

**Status:** Secret project. Not linked from the main site yet. Will be made public later. Do not add Maker Bench to the changelog or sidebar.

## File Structure
```
maker_bench/
├── notes.md           — this file
├── tools.md           — physical tools at the bench
├── materials/
│   ├── dye_component.md         — pens, markers, color stuff
│   ├── fabricated_component.md  — 3D printed parts
│   ├── redstone_component.md    — electronics, PC parts, cables, memory
│   └── trinket_component.md     — fasteners, chains, adhesives, small hardware
├── schematics/        — build recipes (e.g. keychain_knife.md)
└── icons/             — (empty, for future use)
```

## Naming Conventions
- Category files keep `_component` suffix because each file holds multiple items
- Individual items are NOT renamed to Minecraft terms — only headers and subheaders
- Minecraft-themed category names: redstone, dye, trinket, fabricated
- "Fabricated" kept because no clean Minecraft term fits 3D printing (ingots = metal only)

## Quantity Legend
Used inline at the end of each item to show rough stock:

- 🔴 **Empty** — none available, need to restock
- 🟠 **Scarce** — only a few left, use sparingly
- 🟡 **Enough** — have what I need for current projects
- 🟢 **Stocked** — comfortable supply, no concern
- 🔵 **Overflowing** — way more than needed, consider giving some away

Format: `- Coil Spring 🟢`

Not yet applied to items — user will tag them as they assess physical inventory.

## Schematic Format
Lives in `schematics/`. Current structure (see `keychain_knife.md`):

```
# <Project Name>

## Components
- <Category>
  - <Qty>x <Specific Item>
- <Category>
  - <Qty>x <Specific Item>

## Crafting
1. <Step>
2. <Step>
```

Notes:
- Category labels (Fabricated, Trinket, etc.) are parent nodes with no quantity
- Quantities only on actual items
- No Tools section needed — user said keychain knife assembles without tools
- KUT acronym refers to the 3D print file name; no need to define it

## Special Touches
- `fabricated_component.md` has the placeholder: "A creeper blew up the fabricator. We'll have to fix that in a moment. The 3D printer is not working." — keeping it playful since there are no prints in stock yet.

## What's Next
- Tag items with quantity circles (user will do this)
- Add more schematics as builds are made
- Eventually link Maker Bench to the main site (sidebar + index) when ready to go public
- Add icons to `icons/` folder if desired
