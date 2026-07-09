## Diakon Update
*NOV 2023*

The fourth iteration, and a step deeper into Minecraft. Diakon logged Vanity into a server as a real player and connected cleanly to modded (Forge) servers, auto-negotiating the right version to join them.

Honestly, though, this was groundwork more than gameplay. Once she was in, the only thing she actually *did* was echo the chat - repeat back what players said. The real machinery for moving, eating, gathering, and fighting was all installed and sitting ready (pathfinding, armor handling, auto-eating), but it wasn't wired up to anything yet. Diakon was the plumbing; the plumbing just didn't have the taps turned on.

**Under the hood:**

- JavaScript on Node.js, using the **mineflayer** library to act as a Minecraft client
- Logged in with a real Microsoft account and could auto-detect a **Forge** server's version to join modded worlds
- Carried the pathfinding, armor, and auto-eat plugins as scaffolding for later versions

At this point the AI-chat side of Vanity and the Minecraft side were two separate projects on two separate tracks - they hadn't been brought together yet.
