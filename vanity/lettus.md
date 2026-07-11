## Lettus Update
*JUN 2026 - actively updated*

> This is the current build and under active development - it changes often, so details here may move ahead of what's written.

The consolidation build - two bots that used to live apart, pulled into one project with shared memory so there aren't a handful of Vanitys running at once. Lettus is both the **Discord** side and the **Minecraft** side under one roof.

### The Minecraft player

This is the heart of Lettus, and the direct continuation of the standalone Minecraft bot. Vanity is an autonomous player - not a server NPC, nobody driving her. She logs in like a real account and plays like a careful, slightly opinionated regular: mostly you'll find her at the water's edge fishing, but she takes care of herself around it. She eats when she's hungry, walks to her bed at night or in a storm, deposits her catch when her inventory fills, and builds whatever she's missing - hunting for a bed, chopping trees for a rod, setting up chests near her spot. Every 250ms she stops, looks around, and picks the most important thing to do, with staying alive (lava, drowning) always winning out.

She remembers every player on a scale from **-10 to +10**, starting neutral and drifting back toward zero over time. Punch her bare-handed once and she treats it as an accident - one warning jab, then she backs off. Do it again within a minute, or hit her holding *anything* at all, and she fights for real, picking her weapon for the moment (bow at range, melee up close, shield between swings) and breaking off to run if her health gets low. Kindness climbs the other way: netherite, diamonds, food all raise how she sees you, and earn +3 and she'll never raise a hand to you - she'll even hold out a valuable, and toss it over if you crouch twice in front of her. Two commands are open to anyone (^^!status^^ and ^^!rep^^); the rest are the owner's.

New in this build: her in-game chat is now **AI-driven**, so she actually talks rather than only firing set lines.

### The Discord side

The other half is the original Lettus tool, carried over intact: a single ^^/export^^ command that walks a server top to bottom and writes out a tidy Markdown map of every category and channel, with a stats line (member count, channel and category totals, creation date), then posts it to your commands channel.

**Under the hood:**

- Node.js throughout - **mineflayer** (plus pathfinder, pvp, armor, auto-eat, and a bow-aim helper) for the Minecraft player, **discord.js** for the Discord side, and **OpenAI** for her in-game chat
- One project, one shared memory, run either half on its own (`node minecraft/main.js` or `node discord/index.js`)
- Everything she does in-world is config-driven - mobs, food, loadout targets, and state priorities all live in editable files, so adding a mob or retuning her behavior needs no code change
