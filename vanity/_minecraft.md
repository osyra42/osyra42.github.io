## Vanity Minecraft

Vanity is an autonomous Minecraft player. She isn't a server NPC and nobody is controlling her - she logs into the server the same way a real player does, walks around, fights, fishes, sleeps, and remembers things between sessions. Under the hood she's a Node.js program built on the [mineflayer](https://github.com/PrismarineJS/mineflayer) library, with pathfinding for getting around, a bow-aiming helper for ranged shots, and armor handling for keeping her gear on.

Most of the time you'll find her at the water's edge, casting and reeling. She takes care of everything else herself: she eats when she's hungry, walks to her bed at night (or during a thunderstorm), and drops her fish into her chests when her inventory fills up. If something she needs is missing she'll go make it - hunting animals for a bed, chopping trees down for planks and sticks to build a fishing rod, cooking her catch, even putting together a shield if she has the iron for it. She never mines for that iron herself; she works with what's already around her. Roughly four times a second she stops, looks at what's nearby, and picks the most important thing to do next.

The way she decides is a strict priority list. Staying alive beats everything, so lava or drowning will yank her out of whatever she was doing. Below that comes eating, then fighting, then a few warning behaviors, then sleep, then picking up loot, then her chores, and right at the bottom - fishing, her default when nothing else needs doing. Because each task finishes cleanly before the next is chosen, an emergency can cut in within about a quarter of a second.

### How she treats people

She remembers every player she meets, tied to their account rather than their name so nobody can impersonate someone she trusts. Her opinion of you runs from **-10 to +10** and starts at zero - neutral. Every ten minutes, opinions quietly drift back toward zero, so nothing you do sticks forever.

Hit her once with your bare fists and she treats it as an accident: she punches back a single time as a warning, backs off, and holds no grudge. Hit her a second time within a minute - or hit her even once while holding *anything*, even a torch or a piece of bread - and she takes it as intent, drops your standing hard, and fights back for real. She picks her weapon for the moment: a bow if you're at range, an axe against a single target, a sword against a crowd (for the sweep), and her shield up between swings. If her health drops too low she breaks off and runs, and she'll scramble away from a creeper before it goes off.

Kindness moves the needle the other way. Drop her a netherite ingot and her opinion of you jumps; a diamond or emerald is worth a bit less; iron, gold, or food a little each. She figures out that the item was for her by watching who dropped it near her. Earn her trust - a standing of +3 or higher - and she'll never raise a hand to you, and she'll even hold out something valuable in her off-hand as a gesture. Crouch twice quickly in front of her while she's doing that and she'll toss it to you.

### Talking to her

Chat commands start with `!`. Anyone can use ^^!status^^ to see what she's up to and ^^!rep^^ to check where they stand with her. Trusted players (and her owner) can ask her to ^^!fetch^^ an item and she'll dig it out of her chests and toss it over. The rest - moving her home, setting fishing spots, hand-adjusting reputations, calling her to come, and starting or stopping specific jobs - are reserved for her owner.

She's built to run for days on her own: she reconnects on her own if she's kicked, saves her memory of the world safely so a crash doesn't corrupt it, and works around a couple of the well-known physics quirks in recent Minecraft versions that trip other bots up.
