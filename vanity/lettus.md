## Lettus Update
*AUG 2026 - actively updated*

> This is the current build and under active development - it changes often, so details here may move ahead of what's written.

The consolidation build - two bots that used to live apart, pulled into one project so there aren't a handful of Vanitys running at once. Lettus is the **Minecraft** player and the **Discord** bot under one roof, and as of this build they finally share the thing that matters: one brain. Mention her in Discord and mention her in game and you get the same Vanity - same voice, same knowledge, same models - because both surfaces call into a single chat pipeline that neither one owns.

The other headline: **she can play modded Minecraft now.** Point her at a server and she works out what it is and how to get in, including big Forge modpacks that used to slam the door on her. That part's new, it's the piece moving fastest, and it's covered further down.

### The Minecraft player

The heart of Lettus, and the direct continuation of the standalone Minecraft bot. Vanity is an autonomous player - not a server NPC, nobody driving her. She logs in like a real account and plays like a careful, slightly opinionated regular: mostly you'll find her at the water's edge fishing, but she takes care of herself around it. She eats when she's hungry, walks to her bed at night or in a storm, deposits her catch when her inventory fills, cooks what she caught, and builds whatever she's missing - hunting for a bed, chopping trees for a rod, mining for stone tools, crafting a shield, setting up chests near her spot. Every 250ms she stops, looks around, and picks the most important thing to do, with staying alive (lava, drowning) always winning out.

She remembers every player on a scale from **-10 to +10**, starting neutral and drifting back toward zero over time. Punch her bare-handed once and she treats it as an accident - one warning jab, then she backs off. Do it again inside the window, or hit her holding *anything* at all, and she fights for real, picking her weapon for the moment (bow at range, melee up close, shield between swings) and breaking off to run if her health gets low. Kindness climbs the other way: netherite, diamonds, food all raise how she sees you, and earn +3 and she'll never raise a hand to you - she'll even hold out a valuable, and toss it over if you crouch twice in front of her. Two commands are open to anyone (^^!status^^ and ^^!rep^^); the rest are the owner's.

**New in this build:** she was taken apart and rebuilt out of small pieces. Everything she can *do* is now its own little skill - mine a block, craft something, cook, hunt, place a block - and everything she can *notice* is its own little check: am I hungry, is there lava, is my bag full of junk. What she does for a living is then just a list of which of those she's allowed to pick from. Right now that list says "fisher". Swapping it for something else is a matter of writing a new list, not rewriting her.

### She plays modded now

The newest thing in Lettus, and the one still moving fastest. Vanity used to only be able to join ordinary vanilla servers. Now you give her an address and she works out the rest herself.

Before she connects at all, she asks the server what it is - a quick, harmless question that takes about a quarter of a second and doesn't involve logging in. From the answer she learns which version of Minecraft it actually speaks and whether it's modded, and she adjusts before knocking on the door. That matters more than it sounds: servers routinely *describe* themselves as one version while actually speaking another, and guessing wrong means being turned away with a very unhelpful error.

If it turns out to be a **Forge** server - the most common way big modpacks are put together - she does something she genuinely couldn't do before. Forge servers hold a private conversation with the game client at the door, checking it's a proper modded client before letting it in, and a normal bot fails this instantly. There was no existing tool that could handle it; the one that claimed to hadn't worked since about 2018. So this was written from scratch by reading Forge's own source code, and she now gets through that conversation - **169 back-and-forth messages** on the test server - and walks in.

She's currently logging into a **SkyFactory 5** world running **283 mods**, which is about as far from vanilla as Minecraft gets.

**Being honest about where this is:** getting *in* is solved. Being *useful* in there isn't yet. She can log in, walk around, chat and defend herself, but her day job assumes a normal Minecraft world - and SkyFactory is a void with a single floating platform, no trees, no ground, no ore. She'll happily announce she's off to find wood on a map where there is no such thing. She also can't recognise most modded blocks and items, because she only knows the vanilla ones.

So she now knows *what kind of world she's in* - each server is labelled as ordinary survival, or skyblock, or whatever it is, with a short description she can read - and she'll tell you honestly that her usual plan won't work there. Teaching her to actually play these packs is the next stretch of work, and it's expected to keep going for a while. **Fabric** servers (a lighter, different way of modding) already work with no special handling at all. **NeoForge**, a newer offshoot of Forge, is recognised but not yet supported - she'll say so plainly rather than failing in a confusing way.

**She keeps each world separate.** Her bed, her chests, her progress and her map notes are now filed per server, so sending her to a modded world and back doesn't wipe what she built at home. What she remembers about *people*, though, follows her everywhere - a person is a person regardless of which world you met her in.

### One shared brain

Whatever she knows, she knows on both Discord and Minecraft, because there's now only one copy of it. Her personality, her facts and her manners live in one place, and each side just gets told how much room it has to talk - a single short line in Minecraft, where chat is cramped, a sentence or two on Discord.

- **Two brains, whoever answers first.** She asks a big model over the internet and a smaller one running on my own PC at the same moment. The online one gets a few seconds of head start; if it's being slow, the home-grown answer is already waiting and she uses that instead. Either way you're not left staring at nothing
- **She won't wreck your computer to talk.** The local model is a few gigabytes and wants a good chunk of your graphics card. Before she loads it she checks whether there's actually room to spare - if you're in the middle of a game or a render, she just says she's busy instead of making everything stutter
- **She actually looked it up.** She's read the entire Minecraft wiki - **over 3,200 pages** - and searches it before answering a question. If she finds the answer she's under orders to stick to what it says, and if she doesn't, to admit she isn't sure rather than make something up

### The Discord side

Not a separate personality anymore - the same Vanity, reachable from Discord. Mention her and she answers with everything above. Beyond that:

- **^^/minecraft^^** puts up a row of buttons - log in, log out, restart, status, and a kill switch for when she's wedged. A dropdown picks which world she joins, and there are four set up now: her home survival server, the SkyFactory pack, and two others
- **She knows what she's up to.** Ask her in Discord what she's doing and she'll tell you honestly, because the Minecraft side is leaving her a note about it four times a second
- **Proving who you are.** Just typing your Minecraft name into Discord proves nothing - anyone could type anyone's. So instead: message her ^^link^^, she hands you a short code, and you whisper that code to her in game. It works starting from either side. Both halves are private, and she takes your identity from the server itself rather than anything you typed - so the worst someone can do by lying is fail. Only then does your Discord account inherit your in-game reputation

### Odds and ends

- She has a **live status window** - a second terminal that opens beside her and shows her current state, health, what's in her bag and what she just decided to do, ticking over four times a second. There was a browser version of this for a while; it turned out to be more trouble than the plain window it replaced, so it's gone
- **Over 500 automatic checks** across 32 files now test her machinery every time something changes - reputation, crash recovery, conversation, wiki lookups, pathfinding, and the modded connection. It's a nice feeling to break something and be told about it immediately instead of finding out three days later in game
- Everything she does in-world is still **set in plain text files** - which mobs count as dangerous, what she considers food, what gear she keeps on her, every line she says. Adding a new mob or retuning her behaviour doesn't mean touching code
- She runs on **mineflayer** for the Minecraft half and **discord.js** for the Discord half, and either one can run on its own without the other
