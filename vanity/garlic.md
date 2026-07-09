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
