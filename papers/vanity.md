# 🤖 Vanity

[Vanity's Legal Documents](?paper=vanity_legal)

Vanity started life back in 2017 as a little Discord bot and has been rebuilt, from the ground up, more times than I can count - each version named after a vegetable, in order, A to Z. What follows is the whole run of them, newest first, with what each one could actually do.

These days the lineage has folded back together. The newest build, **Lettus**, runs both the in-game Minecraft player and the Discord side from one project so there aren't a pile of separate Vanity's going at once; **Vanity Kale** is the assistant that lives in your terminal and does real work on your computer. The story below traces how she got from a tutorial-following chat bot to all of that.

She's also becoming the face of the tools I build - the assistant, helper, and repair tech working behind the scenes of a lot of my projects. When something breaks, she's the one who shows up to fix it (the [yt-dlp Tool](?paper=yt_dlp_tool) is the first place you'll see this: its self-healing "doctor" is Vanity's job). If you want to run her yourself, her reusable personality - the system prompt that turns any capable AI into Vanity - lives here: [Vanity's Personality](?paper=vanitys_personality).

>>> Asparagus Update
## Asparagus Update
*DEC 2017*

The very first Vanity. Built in JavaScript on Node.js with the discord.js library, mostly by following a tutorial - the foundation everything else grew from. She handled the basics: pruning chat and a handful of simple commands. Small, but it's where the whole thing started.
<<<

>>> Broccoli Update
## Broccoli Update
*MAY 2018*

The second iteration, where Vanity started actually reacting to what people said instead of just running commands.

**What was new:**

- **Pattern recognition** - she watched for certain phrasings in messages and fired back a randomized reply
- **Announcement repeater** - she could echo out announcements and important messages
- **Direct messages** - she could DM people for a more personal touch
<<<

>>> Carrot Update
## Carrot Update
*AUG 2023*

The third iteration, and the first time Vanity set foot in Minecraft. Her chat got a rework too - built around arrays and dictionaries so her replies could be more varied and fit the moment better.

**What was new:**

- **Minecraft, first steps** - using Mineflayer.js, Vanity could log into a Minecraft world and play alongside people. Early days, but the door was open
- **Smarter chat** - responses became more dynamic and context-aware than the simple pattern-matching before it
<<<

>>> Diakon Update
## Diakon Update
*NOV 2023*

The fourth iteration, and a step deeper into Minecraft. Diakon logged Vanity into a server as a real player and connected cleanly to modded (Forge) servers, auto-negotiating the right version to join them.

Honestly, though, this was groundwork more than gameplay. Once she was in, the only thing she actually *did* was echo the chat - repeat back what players said. The real machinery for moving, eating, gathering, and fighting was all installed and sitting ready (pathfinding, armor handling, auto-eating), but it wasn't wired up to anything yet. Diakon was the plumbing; the plumbing just didn't have the taps turned on.

**Under the hood:**

- JavaScript on Node.js, using the **mineflayer** library to act as a Minecraft client
- Logged in with a real Microsoft account and could auto-detect a **Forge** server's version to join modded worlds
- Carried the pathfinding, armor, and auto-eat plugins as scaffolding for later versions

At this point the AI-chat side of Vanity and the Minecraft side were two separate projects on two separate tracks - they hadn't been brought together yet.
<<<

>>> Eggplant Update
## Eggplant Update
*JAN 2024*

A ground-up rewrite, and the moment Vanity became a proper AI. Everything moved to Python, a real language model went in behind her, and her features got split into clean, swappable pieces.

**What changed:**

- **Rebuilt in Python** - the whole thing was moved off JavaScript to take advantage of Python's AI and machine-learning libraries
- **A real brain** - her replies now came from the **Nous-Hermes-2 SOLAR 10.7B** model running locally through GPT4All, so she could actually hold a context-aware conversation instead of matching patterns
- **A voice** - **OpenVoice** was built in for spoken replies alongside the text, cloned to a reference voice
- **Different faces for different people** - the Discord role you held changed her personality; a friend, an enemy, and so on each got a distinctly different Vanity
- **Modular by design** - features lived in separate plug-in modules ("cogs") that the owner could load, unload, and reload on the fly without restarting her - chat, greetings, a little math command, and system controls each stood on their own
- **Minecraft set aside** - the in-game bot was pulled out for now to keep the focus on getting the conversation and voice right (it came back later)

This is the fifth iteration, and the foundation the next several versions were all built on top of.
<<<

>>>Fennel Update
## Fennel Update
*JUN 2024*

The version where Vanity found her voice - literally. Fennel ran a language model on the home PC and then *spoke* every reply back in a cloned synthetic voice, all inside Discord.

**What she could do:**

- **Chat in character** - she answered when mentioned or replied to, in two set channels, reading back several messages up the reply chain to keep her footing in the conversation
- **Speak her replies** - every answer was turned into audio and attached to the message. The text got cleaned up first for pronunciation (so "minecraft" came out as "mine craft," and so on)
- **Change with your role** - the Discord role you held changed *who she was to you*. A friend got a supportive Vanity; an "enemy" got a Vanity who roasted you; the tone and even her focus shifted to match
- **A fake verify gag** - the same theatrical "account verification" stall-and-reward bit

**Under the hood:**

- Python on **discord.py**, all in one file
- Ran a local model - the **Nous-Hermes-2 SOLAR 10.7B** model - through GPT4All, on the home machine's graphics card
- The voice came from **OpenVoice**, bundled right into the project: it synthesized the speech and then converted it to match a reference voice clip, sped up slightly
- Processed messages one at a time through a queue so the model and the voice engine never tripped over each other

This is the version where the "talks back out loud, in her own voice" idea first really landed.
<<<

>>> Garlic Update
## Garlic Update
*SEP 2024*

A back-to-basics Discord version, and the only one that ran entirely on your own machine with no cloud service behind it at all. Everything happened locally.

**What she could do:**

- **Chat in character** - she only spoke up in a couple of set channels, and only when you mentioned her or replied to her. She'd read back up the reply chain to follow the thread of a conversation
- **A "sanity" dial** - a single setting controlled how loose or focused her replies were, by turning the model's randomness up or down
- **A couple of gags** - a fake ^^/verify^^ "account verification" that stalls dramatically before handing out a Verified role, plus an ^^/about^^ card and a ^^/ping^^

**Under the hood:**

- Python on the standard **discord.py** library, all in a single file - no modules, no database, no cloud
- Ran the model **locally through Ollama**, using an uncensored 9B model (with a Dolphin Mixtral 8x7B option sitting commented-out as an alternative). Because it was local, there was no API key and nothing left your computer
- Handled one message at a time through a queue so the model never got overwhelmed
- She already massaged her text for eventual speech - swapping tricky words into how they should sound - even though this version didn't speak out loud

Deliberately lean, and a clean-slate reset after the heavier voice-cloning versions before it.
<<<

>>> Honeynut Update
## Honeynut Update
*NOV 2024*

The most properly *built* Discord version - the one where Vanity got real structure under her, with her features split into tidy modules and, for the first time, a database remembering things about people.

**What she could do:**

- **Chat in character** - mention her and she'd reply, then speak that reply out loud if you were in a voice channel
- **Remember your conversations** - she kept a per-person history so her ^^/chat^^ answers had some memory behind them
- **Take feedback** - you could 👍 or 👎 her replies, and her mood actually shifted with the score: more thumbs-up made her playful, more thumbs-down made her formal
- **Play games** - a little collection of them: guessing, rock-paper-scissors, hangman, and trivia
- **Look things up** - a ^^/search^^ that pulled the top web results and summarized them for you
- **Handle voice** - join and leave voice channels and read text aloud on command
- **Keep house** - welcome new members with a detailed intro card, and set up its own logging channels to mirror what it was doing

**Under the hood:**

- Written in Python on the **disnake** Discord library, organized into separate modules ("cogs") so each feature stood on its own
- Ran on **Groq's** cloud for speed, using the **Llama 3.3 70B** model
- Kept a **SQLite** database with a handful of tables - every message seen, per-user chat history, how often each command got used, and the thumbs-up/down feedback
- Spoke through Google's British text-to-speech, same as the rest of the line

A few things were sketched in but not finished - a points economy and a music queue among them - but the bones here were the strongest of any version up to this point.
<<<

>>> Ivy Update
## Ivy Update
*MAY 2025*

The most ambitious version to date, and the one that really chased the "AI VTuber" idea. Ivy wasn't one bot - it was three, run side by side from a little desktop control panel with Start and Stop buttons for each. She could be on Twitch, in Discord, and in Minecraft all at once.

**What she could do:**

- **Stream on Twitch** - she read live chat, answered in character, and spoke her replies out through a virtual audio cable so a rigged avatar could lip-sync to her. She even wrote her captions to a file, timed to the speech, so subtitles could show on stream
- **Talk in Discord** - mention her and she'd join your voice channel and reply out loud, sentence by sentence, then leave on her own after a stretch of quiet
- **Play Minecraft** - a separate in-game bot that hunted down hostile mobs, grabbed valuable dropped loot, and kept its own armor equipped. This one was a fighter and a scavenger, not a talker
- **Keep it clean** - a content filter caught slurs and rule-breaking phrases before they ever went out

**Under the hood:**

- A mix of Python for the chat and voice, plus Node.js for the Minecraft player
- Ran on **OpenRouter** using **DeepSeek's v3.1** model, with backup providers lined up in case one was busy
- Spoke through Google's text-to-speech in a sped-up British voice - the same voice that ran through the whole family of versions
- A **PySide6** desktop dashboard tied it all together and launched each service as its own process

Worth being honest about: the voice *input* - having her listen to you and take spoken commands - was scaffolded but never actually finished in this build. What shipped and worked was everything above.
<<<

>>> Jicama Update
## Jicama Update
*JAN 2026*

The version where the pieces of the big VTuber dream were all laid out on the table at once - a chat brain, a Discord bot, a voice, and a Minecraft player - even if only the Minecraft part was really finished. Think of it as the wide, shallow draft that the two versions after it narrowed down and deepened.

**What was actually here:**

- **A chat Vanity you talk to in a terminal** - a simple back-and-forth REPL running an uncensored model through OpenRouter, reading her personality from a character file
- **A Minecraft bot** - the direct ancestor of today's standalone bot, but a leaner build: she fishes (chopping trees and hunting spiders for the string she needs to craft a rod), picks up loot, fights hostile mobs, and pulls herself out of lava or deep water. She kites enemies at a set distance and raises a shield against ranged attackers
- **A Discord skeleton** - a bare bot with a single ^^/ping^^ command, wired for voice "for later," waiting to be built out
- **A voice test** - a small proof-of-concept that turns text into speech using the Kokoro voice engine, not yet plugged into anything

**What it did *not* have yet** is everything that later made the Minecraft bot feel alive: there was no reputation or opinion system at all, no warning-punch, no sense of who to trust, no sleeping, and its chat commands were open to anyone with no owner reserved for the important ones. Jicama proved the shape of the whole thing; the versions that followed picked one corner of it and made it real.
<<<

>>> Kale Update
## Kale Update
*MAR 2026*

The biggest leap so far, and a change in what Vanity even *is*. Kale isn't a chat bot that lives in Discord - it's a full assistant you run in a terminal window on your own computer, in the same spirit as tools like Claude Code or Aider. You type what you want in plain language, and instead of just replying, she goes and does it: reads your files, edits them, runs commands, searches the web, and keeps working until the job's actually finished.

The way she gets things done is a loop. You ask, she thinks, she reaches for whatever tool fits, sees the result, and decides what to do next - up to twenty-five steps of that per request before she hands the answer back. You can watch her reasoning as it streams in.

**What she can actually do:**

- **Read and edit your files** - open a file, rewrite it whole, or make a small surgical change to one spot
- **Run commands for you** - runs real shell commands (PowerShell or cmd on Windows, bash elsewhere), with a time limit so nothing hangs forever
- **Search and read the web** - looks things up through DuckDuckGo and can pull down a specific page when she needs it
- **Find things in a project** - locates files by pattern and searches inside them for text
- **Remember where you left off** - conversations are saved automatically as you go, so a crash won't lose your work, and she picks the right one back up based on which folder you're in
- **Stay tidy over long sessions** - when a conversation gets too big to hold, she summarizes it down and carries on without losing the thread
- **Learn new tricks** - you can hand her "skills" (little instruction files) and she'll fold them into how she works

**Under the hood:**

- Written in Python, with a proper full-screen terminal interface built on **Textual**
- Runs on **OpenRouter**, and pointedly sticks to the *free* models - by default a large Nemotron model, with a Llama 4 fallback. The model picker won't even show you paid options
- Comes with a set of built-in commands (^^/model^^ to swap brains, ^^/tools^^, ^^/skills^^, ^^/status^^, ^^/cost^^, ^^/compact^^ and more), plus a ^^/init^^ that scans a project and writes itself a notes file about it
- A safety switch decides whether she runs things automatically or asks you first before anything that touches your files or your shell

No voice this time, and nothing to do with streaming or avatars - Kale is heads-down, hands-on, get-work-done Vanity.
<<<

>>> Lettus Update
## Lettus Update
*AUG 2026*

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
<<<

>>> Mushroom Update
## Mushroom Update
*UPCOMING*

> This is the next upcoming build for Vanity. Is intended to be built with Azalea.rs
<<<