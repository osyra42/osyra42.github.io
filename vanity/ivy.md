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
