# 🎬 yt-dlp Tool
::toc::
[Get it on GitHub](https://github.com/osyra42/yt-dlp-tool)

A small, self-contained YouTube-to-**MP3 or MP4** downloader with a colored console menu. Paste a link, get a file. Everything runs out of one folder using relative paths - nothing is installed system-wide - so you can copy the whole folder to another machine (or reuse it as the base for a Discord bot) and it just works.

It's a friendly front end for [yt-dlp](https://github.com/yt-dlp/yt-dlp), the well-known downloader. yt-dlp is powerful but fiddly to drive by hand; this wraps it in a simple menu, handles the awkward setup for you, and cleans up the filenames.

---

## How to Use It

Double-click **`zzz_launcher.bat`** (it ships with the same [Sleep Launcher](zzz_launcher.html) pattern I put on everything). It checks the environment, warns about anything missing, and drops you at a prompt:

```
[mp3] URL or command:
```

Paste a YouTube URL and it downloads. Type one of the commands below to do something else. You can download several things in a row - each gets its own file, saved into the `results/` folder, and **nothing is ever deleted automatically**.

---

## Commands

| Command | What it does |
|---|---|
| `mp3` | Switch to audio mode - downloads `.mp3` (this is the default) |
| `mp4` | Switch to video mode - downloads `.mp4` |
| `list` | Show the files currently sitting in `results/`, with their sizes |
| `open` | Open the `results/` folder in your file browser |
| `del` | Delete everything in `results/` (asks you to confirm first) |
| `playlist` | Toggle downloading whole playlists on or off |
| `cookies` | Use your browser's login cookies for age-restricted videos |
| `doctor` | Check and fix the setup (deno, ffmpeg, yt-dlp) |
| `menu` | Show the menu again |
| `quit` | Exit |

Paste a **playlist** link and, unless playlist mode is on, it asks before grabbing the whole thing - so you don't accidentally pull down two hundred videos. Titles are cleaned up as files are saved, so a video with a wild name full of odd characters can't produce a broken filename.

---

## The Doctor - Vanity, Setup That Fixes Itself

The part I'm proudest of: you don't really "install" anything. The tool carries a built-in **doctor** - this is [Vanity](vanity.html), the assistant and repair tech behind my projects, doing what she does. When something's broken or missing, she shows up and fixes it. The doctor checks whether Python, the virtual environment, `deno.exe`, and `ffmpeg.exe` are all present and working - and offers to fix whatever isn't. It can create the environment, install yt-dlp, and download the correct build of deno and ffmpeg for your specific computer.

That last bit matters more than it sounds: `deno.exe` and `ffmpeg.exe` aren't interchangeable between CPU types (an Intel/AMD build won't run on an ARM machine). If one fails because it's the wrong kind, the doctor notices and can fetch the right one. This is exactly the "fix it, don't just report it" idea from the Sleep Launcher page, taken all the way - the tool heals its own setup instead of handing you a checklist.

If deno or ffmpeg are missing it still starts; it just warns you, since downloads that need them may fail. You can re-run the whole check anytime by typing `doctor`.

---

## What's Under the Hood

- **Python**, wrapping yt-dlp - the only Python dependency is yt-dlp itself
- **`ffmpeg.exe`** - does the audio extraction and the video/audio merging
- **`deno.exe`** - a JavaScript runtime yt-dlp reaches for to get past some of YouTube's checks
- **Colored console output** - green for success, red for failures, dimmed live progress as a download runs
- **Cookie support** for Firefox, Vivaldi, Brave, Opera, Chrome, Edge, Chromium, Safari, and Whale (Firefox and Vivaldi are the most reliable - recent Chrome and Edge encrypt their cookies and often can't be read)
- **A self-check test suite** under `tests/`

Everything lives beside the program in its own folder - the binaries, the downloads, the environment - so it stays portable and never touches the rest of your system.

---

## A Note on Fair Use

Use this for content you actually have the right to download - "no copyright" music (like NCS tracks), your own uploads, or short reference clips. Respect creators' licenses and YouTube's Terms of Service.

---

::signature::