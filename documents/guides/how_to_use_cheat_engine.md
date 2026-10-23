# 🧪 How to Use Cheat Engine
::toc::
> ⚖️ **Legal Notice:** This guide is for educational purposes only. Only use Cheat Engine on games you own and in single-player or offline modes. Using Cheat Engine on online multiplayer games violates the Terms of Service of virtually every game platform and can result in permanent bans, account suspension, or legal action. This guide does not encourage or endorse cheating in online games or any form of unfair advantage over other players.

---

## 🧪 What is Cheat Engine?

Cheat Engine is a free, open-source memory scanner and debugger for Windows. It lets you inspect and modify the values stored in a running program's memory — things like your health, gold, ammo, or experience points. By searching for a known value, changing it in-game, and searching again, you can narrow down the exact memory address that holds that value and then freeze or modify it.

Think of it as a live hex editor for any application. It doesn't modify game files on disk — it reads and writes to the program's RAM while it's running.

Download the latest version from the official website: [https://cheatengine.org/](https://cheatengine.org/)

**✅ What Cheat Engine is good for:**

- **Single-player games** — Give yourself extra gold, max health, or unlimited items
- **Learning how memory works** — Understand how programs store and manage data
- **Debugging** — Developers use it to inspect variables during testing
- **Speed hacks** — Slow down or speed up a game (great for bullet-hell or timing-based games)
- **Creating trainers** — Build standalone cheat trainers to share with others

**🔍 Key terms you'll encounter:**

- **Value** — A number stored in memory (e.g., your current gold: 500)
- **Address** — The location in RAM where that value lives
- **Scan** — Searching memory for a specific number
- **Pointer** — An address that points to another address (useful when addresses change between sessions)
- **Freeze** — Locking a value so it stops changing
- **Process** — The running game or program you're attaching to

---

## ⚙️ How Does It Work?

**1. ⚠️ Read the Warning First**

Before doing anything, understand the golden rule:

> 🚫 **Never use Cheat Engine on online multiplayer games.** If a game uses server-side networking — matchmaking, leaderboards, cloud saves, real-time PvP, or even simple server-side stat tracking — modifying memory will be detected. Anti-cheat systems like Easy Anti-Cheat, BattlEye, and Valve Anti-Cheat (VAC) actively scan for Cheat Engine and similar tools. You will get banned, and the ban is almost always permanent with no appeal.

**Games where Cheat Engine is safe to use:**

- Single-player games with no online component
- Offline mode in games that support it (e.g., offline mode in some RPGs)
- Games you own and run locally
- Emulated or retro games

**Games where Cheat Engine will get you banned:**

- Any competitive multiplayer game (CS2, Valorant, Apex Legends, etc.)
- Games with always-online DRM or server-side saves (Diablo IV, MMOs, etc.)
- Games with kernel-level anti-cheat (even in single-player modes in some cases)
- Any game with a Terms of Service that prohibits memory modification

When in doubt: **don't.**

---

**2. 🎮 Launch the Game First**

Start your game and get to the point where you can see the value you want to change (e.g., you're in-game and can see your gold is 500).

Alt-tab out of the game — Cheat Engine needs the game running so it can scan live memory.

---

**3. 🔗 Attach to the Process**

Open Cheat Engine. Click the glowing computer icon in the top-left corner (the "Select a process to open" button). A list of running processes will appear. Find your game's executable name and double-click it.

Cheat Engine is now attached to your game's memory.

---

**4. 🔍 First Scan**

Let's say your in-game gold is **500**.

- Set the **Value Type** dropdown to **4 Bytes** (this is the default and works for most integers)
- Enter **500** in the **Value** box
- Click **First Scan**

Cheat Engine will search the game's entire memory space for the number 500. You'll likely get thousands or tens of thousands of results — that's normal. Every one of those addresses currently holds the value 500.

---

**5. 🎯 Narrow It Down**

Go back into the game and change that value — earn or spend some gold so the number is now different (e.g., buy something so gold becomes **450**).

- Alt-tab back to Cheat Engine
- Change the **Value** box to **450**
- Click **Next Scan**

Cheat Engine will filter the previous results to only those addresses that now hold 450. The list should shrink dramatically. Repeat this process — change the value in-game, come back, enter the new value, click Next Scan — until you have just a few or a single address left.

---

**6. ✏️ Modify and Freeze**

Once you've identified the address:

- Double-click it to add it to the bottom panel
- Double-click the value column to change it to whatever you want (e.g., **999999**)
- Check the **Active** box to **freeze** the value — this prevents the game from changing it back

Alt-tab back into the game and check — your gold should now be 999999 and stay there.

---

**7. ❓ ???**

**8. 🏆 Profit!**

---

## 📁 Beyond Basic Scans

**Unknown Initial Value scans:**

Sometimes you don't know the exact number (like health bars that display as a visual bar instead of a number). Use **Unknown Initial Value** as your first scan type, then use **Increased Value** or **Decreased Value** on subsequent scans to track changes.

**Floating point values:**

Health, stamina, and timers are often stored as floats (decimals). Change the **Value Type** to **Float** when searching for these.

**Pointers and pointer scans:**

Addresses often change when you restart a game. A pointer scan finds a stable reference that points to the dynamic address, so your cheats survive restarts. This is more advanced but essential for making reusable trainers.

**Speedhack:**

Cheat Engine includes a built-in speedhack (the Enable Speedhack checkbox at the bottom). This hooks into the game's timing functions and lets you speed up or slow down the entire game — useful for grinding or for slowing down fast-paced games.

---

## 💡 Tips and Best Practices

- **Save your scan results** — Cheat Engine can save address lists (.CT files) so you don't have to re-scan next time
- **Scan in small increments** — Changing a value too drastically (e.g., gold from 500 to 999999999) can crash the game or trigger anti-cheat in some single-player games
- **Use 4 Bytes first** — Most game values are 4-byte integers. Try Float if 4 Bytes doesn't find anything
- **Close Cheat Engine when not in use** — Some anti-cheat systems scan for Cheat Engine's process even if it's not attached to anything
- **Make backup saves** — Before messing with memory values, always save your game so you can revert if something breaks
- **Some values are server-side** — If you change a value and it immediately reverts, the game is likely validating it against a server. This is common in always-online games and is another sign you shouldn't be using Cheat Engine on that game
- **Read the game's ToS** — Even some single-player games prohibit memory modification in their Terms of Service. Check before you use it
- **Don't share cheated save files** — If you cheat in a game and then upload or share your save file, others can detect it and may report you
- **Use trainers for convenience** — If you don't want to scan manually, sites like [FearLessRevolution](https://fearlessrevolution.com/) host pre-made Cheat Engine tables (.CT files) for thousands of games
- **Learn from the community** — The [Cheat Engine Forum](https://forum.cheatengine.org/) has decades of tutorials, tables, and discussions
