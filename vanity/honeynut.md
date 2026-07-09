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
