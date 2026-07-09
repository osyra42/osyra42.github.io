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
