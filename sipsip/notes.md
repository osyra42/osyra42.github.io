# Sip Sip — Notes & Brainstorm

Working doc for names, mechanics, theming, and concepts. Not finalized — scratch pad.

## Name Ideas

### Coffee-branded (fits coffeebyte.dev)
- **Sippuccino**
- **Brew Up**
- **Drip Drip** (coffee drip + dripping with style)
- **Sip Sip** (current working name — already cute, on-brand)

### Gaming-flavored
- **Press F to Drink** (meme reference)
- **GG Sip**
- **Crit Sip** / **Critical Sip**
- **1-Up Drink**
- **Mana Sip**
- **HP Pots** / **Sip Pots**
- **Quaff** (D&D term for drinking a potion)
- **Combo Sip**
- **Sip & Drop**

### Anime / VTuber-flavored
- **Kanpai** (Japanese for "cheers" — clean, evocative)
- **Kanpai Cards**
- **Sippu Sippu** (anime romanization joke)
- **Tea Time** (VTuber-leaning)
- **Senpai Sip**
- **Otaku Sip**
- **Nyan Sip**
- **Stream & Sip**

### Generic / punny
- **Gulp**
- **Drink.exe**
- **Fizz** (Buzz-style sibling word)
- **Slurp**

### Top picks (gut-feel shortlist)
- **Sip Sip** — clean, friendly, already drink-neutral feeling
- **Kanpai** — short, anime-coded, sounds like a real product
- **Sippuccino** — most on-brand for coffeebyte.dev
- **Press F to Drink** — funny, memorable, leans gaming-hard

---

## Card Categories (mechanics)

Looking at the existing `cards.txt`, the cards roughly fall into these patterns. Worth tagging/categorizing for variety:

- **Drink-if** — personal trivia, opt-in ("drink if you've ever...")
- **Vote** — group judgment ("vote on who is most...")
- **Most/least likely** — group ranking
- **Reader action** — the player who drew the card does something specific
- **Group action** — everyone does a thing together
- **Trivia / dare** — perform a task or sip
- **Status effect** — "until your next turn, you must..."
- **Targeted** — give out drinks to chosen players

---

## Mechanic Ideas (parking lot)

- **Edginess toggle** — SFW / spicy switch so the deck is mixed-crowd safe
- **Theme filters** — VTuber-only deck, anime-only, gaming-only, mixed-all
- **Streamer mode** — extra-PG, no innuendo, safe to play on stream
- **Card rarity** — common/uncommon/rare for flavor (rare = bigger group challenges)
- **Card "type" icons** — sword for action, scroll for trivia, etc. (TCG-style framing)
- **Combo cards** — chain into the next card if condition is met
- **Boss cards** — once-per-deck big group event
- **Skip / re-draw cost** — sip to skip a card you don't want to do (this is the core "Buzz alternative" mechanic the user mentioned)
- **No deck tracking needed** — could be pure random draw, or could be a shuffled finite deck
- **Player roster** — optional input list of player names so cards can `@` someone
- **No accounts, no server** — fully client-side, refresh = new game

---

## Theming Concepts

### VTuber
- Streaming life: chat mods, donations, superchats, "yabe" moments
- Model glitches, rigging issues, "my Live2D is broken"
- ASMR, karaoke streams, member-only content
- Specific tropes: "Pekora laugh," "Watame's no bully," "Mori's rap drops"
- Generic enough to age well: "drink if you've ever stayed up for a stream in another timezone"

### Anime
- Sub vs dub debates
- Opening themes (name 3 or sip)
- Dramatic monologues
- "Main character energy"
- Tropes: tsundere, isekai truck-kun, beach episode, training arc
- Studios: Ghibli, Trigger, MAPPA, Kyoto Animation

### Video Games
- Mains, classes, ranks
- Lag and ping jokes
- Souls-like rage, speedrun any%
- Achievement hunting
- "Drink if you've rage-quit in the last week"
- Gacha pulls, pity timers
- MMO/raid lingo

### Crossover prompts
- "If you've ever cosplayed, sip"
- "Name 5 [thing] or sip"
- "Show your phone — sip if your wallpaper is anime/game/VTuber art"

---

## Open Questions

- **Edginess** — PG-13, adult, or configurable toggle? (Existing cards.txt skews adult.)
- **Visual style** — coffee theme (matches site), anime cards, TCG cards, plain readable cards?
- **Card draw UX** — single button on screen, deck pile, swipe-style? (Decide later when building.)
- **Naming** — pick one or keep "Sip Sip" as working name forever?

---

## Workflow Notes

- User is typing up rest of physical cards into `cards.txt` first
- Then we'll re-theme each card (VTuber/anime/gaming flavor) and strip alcohol-specific references
- Drink-neutral language: "sip" / "drink" / "take a drink" — never "shot," "beer," "blackout," "hungover"
