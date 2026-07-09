## Fennel Update
*JUN 2024*

The version where Vanity found her voice - literally. Fennel ran a language model on the home PC and then *spoke* every reply back in a cloned synthetic voice, all inside Discord.

**What she could do:**

- **Chat in character** - she answered when mentioned or replied to, in two set channels, reading back several messages up the reply chain to keep her footing in the conversation
- **Speak her replies** - every answer was turned into audio and attached to the message. The text got cleaned up first for pronunciation (so "minecraft" came out as "mine craft," and so on)
- **Change with your role** - the Discord role you held changed *who she was to you*. A friend got a supportive Vanity; an "enemy" got a Vanity who roasted you; the tone and even her focus shifted to match
- **A fake verify gag** - the same theatrical "account verification" stall-and-reward bit

**Under the hood:**

- Python on **discord.py**, all in one file
- Ran a local model - the **Nous-Hermes-2 SOLAR 10.7B** model - through GPT4All, on the home machine's graphics card
- The voice came from **OpenVoice**, bundled right into the project: it synthesized the speech and then converted it to match a reference voice clip, sped up slightly
- Processed messages one at a time through a queue so the model and the voice engine never tripped over each other

This is the version where the "talks back out loud, in her own voice" idea first really landed.
