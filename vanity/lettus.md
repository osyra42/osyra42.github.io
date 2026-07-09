## Lettus Update
*JUN 2026*

A small, sharp Discord tool - the newest build, and a deliberate change of pace from the sprawling versions before it. It does exactly one thing and does it cleanly.

Run its single ^^/export^^ command in a server and it walks the whole place top to bottom - every category and every channel, in the order they actually sit in the sidebar - and writes it all up as a tidy Markdown map, with a little icon for each channel type (text, voice, stage, forum, announcement). At the bottom it tacks on a quick stats line: server name, member count, how many channels and categories, and when the server was created. Then it finds your commands channel and posts the report there, splitting it across a few messages if it runs past Discord's length limit, and quietly confirms to you that it's done.

**Under the hood:**

- Built in Node.js on **discord.js** - no AI, no model, nothing to configure beyond the token
- Registers its slash command straight through Discord's REST API
- One job, done properly: a clean snapshot of how a server is laid out
