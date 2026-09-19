# 📀 How to Burn a DVD
::toc::
> ⚠️ **Legal Notice:** This guide is for educational purposes only. Only burn video files that you own, have created yourself, or have explicit permission to distribute. Burning copyrighted movies, TV shows, or other protected content to DVD without authorization may violate copyright law in your country. DVD Flick is a tool — how you use it is your responsibility.

---

## 📀 What is DVD Flick?

DVD Flick is a free, open-source Windows program that takes raw video files (AVI, MP4, MKV, MOV, and dozens more) and converts them into a proper DVD-Video disc — the kind that plays in a standard set-top DVD player, not just on a computer. It handles the transcoding to MPEG-2, audio conversion to AC3 or PCM, DVD menu creation, chapter points, and burning — all in one tool.

Think of it as the bridge between "I have a bunch of video files on my PC" and "I have a disc that works in my DVD player."

Download the latest version from the official SourceForge page: [https://sourceforge.net/projects/dvdflick/](https://sourceforge.net/projects/dvdflick/)

**✅ Why use DVD Flick?**

- **All-in-one** — Transcodes, authors, and burns in a single workflow
- **Huge format support** — It uses FFmpeg under the hood, so if FFmpeg can read it, DVD Flick can probably burn it
- **DVD menus** — Auto-generates a simple menu with title thumbnails
- **Chapter support** — Automatically creates chapter points at regular intervals
- **Subtitle support** — Can burn in subtitle tracks from .srt files
- **Free and open-source** — No watermarks, no trial limits, no nag screens

**🔍 Key terms you'll encounter:**

- **Transcode** — Converting your video file into the MPEG-2 format that DVDs require
- **Author** — Building the DVD-Video file structure (VIDEO_TS folder, .VOB files, .IFO files)
- **Burn** — Writing the authored DVD structure to a physical disc
- **ISO** — A single disc image file that contains the entire DVD structure — you can burn this later with any burning tool
- **VOB** — The actual video files on a DVD (MPEG-2 video + AC3/PCM audio in a VOB container)
- **Title** — Each video file you add becomes a "title" on the DVD menu

---

## ⚙️ How It Works

**1. 📁 Gather Your Video Files**

Collect the video files you want on the DVD. DVD Flick supports a wide range of formats including AVI, MP4, MKV, MOV, WMV, FLV, and more. If you're not sure if your format is supported, just try adding it — FFmpeg handles most containers and codecs.

A standard single-layer DVD-R holds about 4.7 GB, which translates to roughly 1–2 hours of video depending on the bitrate. A dual-layer DVD-R DL holds about 8.5 GB (roughly 3–4 hours). Plan accordingly.

---

**2. 📀 Open DVD Flick and Add Titles**

Launch DVD Flick. The interface is straightforward — you'll see a large empty area in the middle.

- Click **New Project** if starting fresh
- Drag and drop your video files into the main window, or click the **Add title** button on the right panel

Each file you add becomes a "title" on your DVD. You can add multiple videos to a single disc — they'll each get their own entry on the menu.

---

**3. ⚙️ Project Settings**

Click the **Project settings** button (the gear icon on the right panel). Here's what to set:

- **Target size** — Choose DVD-5 (4.7 GB single-layer) or DVD-9 (8.5 GB dual-layer) depending on your disc
- **Encoder priority** — Keep it at **Normal** for a balance of speed and quality. Use **Best** if you don't mind waiting
- **Threads** — Set this to the number of CPU cores you have for faster encoding
- **Burning options** — Check **Burn project to disc** if you want to burn directly. Uncheck it if you just want an ISO file

---

**4. 🏷️ Title Settings (Optional)**

Click on any title in the list, then click **Edit title settings** to customize:

- **Title name** — What shows up on the menu
- **Chapters** — Set how often chapter markers appear (every 5, 10, or 15 minutes is common)
- **Subtitles** — Add .srt subtitle files for each title
- **Aspect ratio** — 4:3 for old TVs, 16:9 for widescreen (most modern content)
- **Audio** — DVD Flick can normalize audio levels across titles for consistent volume

---

**5. 🎨 DVD Menu**

DVD Flick can auto-generate a simple DVD menu. Click **Menu settings** to customize:

- **Menu title** — The text shown at the top of the menu screen
- **Background** — You can set a custom background image
- **Font** — Choose a font and color for menu text

If you don't want a menu at all, there's usually an option to skip directly to playback or set a title to auto-play on disc insertion.

---

**6. 🔥 Burn It**

Once everything is configured:

- Insert a blank DVD-R or DVD-RW into your drive
- Click the **Create DVD** button at the bottom toolbar
- DVD Flick will show a progress window as it transcodes each title, authors the DVD structure, and burns the disc

The transcoding step is the longest part — expect it to take anywhere from 20 minutes to several hours depending on your CPU, the number of videos, and the quality settings. A modern multi-core CPU will handle it faster.

If you chose to create an ISO instead of burning directly, you'll get an .iso file you can burn later with [ImgBurn](https://www.imgburn.com/) or any other burning software.

---

**7. ❓ ???**

**8. 🏆 Profit!**

---

## 📁 Troubleshooting

**The disc won't play in my DVD player:**

- Make sure you used the right disc format — some older players only read DVD-R, others only DVD+R. Check your player's manual
- Try finalizing the disc if your burning software offers that option
- Some very old DVD players don't support burned discs at all (commercial pressed discs are different from burned ones)

**The video quality looks bad:**

- You may have tried to fit too much video on one disc. DVD Flick lowers the bitrate to fit, which reduces quality. Try splitting across two discs or using a dual-layer disc
- Make sure your source video is at least DVD resolution (720x480 NTSC or 720x576 PAL). Upscaling lower-resolution video won't make it look better

**DVD Flick crashes or fails to encode:**

- Make sure you have enough free disk space — DVD Flick needs temporary workspace for the transcoded files, typically several GB
- Try updating to the latest version of DVD Flick and its bundled FFmpeg
- If a specific file won't encode, try converting it to MP4 with [HandBrake](https://handbrake.fr/) first, then add that to DVD Flick

**No audio on the burned DVD:**

- Some audio codecs (like AAC in MP4 containers) may not transcode cleanly. Try converting the audio to MP3 or AC3 first using [FFmpeg](https://ffmpeg.org/) directly
- Check that the title's audio settings in DVD Flick aren't set to a weird sample rate — 48000 Hz is the DVD standard

---

## 💡 Tips and Best Practices

- **Use DVD-RW for testing** — Burn to a rewritable disc first to check everything works before committing to a permanent DVD-R
- **Keep source files organized** — DVD Flick doesn't save copies of your videos, so don't move or delete the source files until the burn is complete
- **Close other programs** — Transcoding is CPU-intensive. Close browsers, games, and other heavy apps while encoding
- **Check disc space first** — DVD Flick needs temporary workspace. Make sure you have at least 10–15 GB free on your system drive
- **Verify your burn** — After burning, pop the disc back in and check that it plays correctly in your computer's DVD player software before trying it on a set-top player
- **Label your discs** — Use a marker on the top of the disc. Don't use adhesive labels — they can unbalance the disc and cause read errors
- **Store discs properly** — Keep them in cases or sleeves, away from sunlight and heat. Burned DVDs degrade over time faster than commercial pressed ones
- **Back up your projects** — DVD Flick can save project files so you don't have to reconfigure everything if you want to re-burn later
- **Don't expect HD quality** — DVD is a standard-definition format (480i/576i). If your source is 1080p, it will be downscaled. For HD video on a disc, you'd need Blu-ray, which is a different toolchain entirely
