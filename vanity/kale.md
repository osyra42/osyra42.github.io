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
