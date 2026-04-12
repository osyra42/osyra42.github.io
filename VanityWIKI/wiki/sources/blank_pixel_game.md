---
type: source
created: 2026-04-12
sources: [blank_pixel_game.html]
tags: [game-development, gamedev, pixel-art, dungeon-crawler, gamemaker]
---
# Blank Pixel Game (A Sundered Gem)

## Overview
A work-in-progress pixel art adventure game built in GameMaker Studio 2 by osyra42. Also referred to as "A Sundered Gem" in the portfolio, this is a dungeon crawler inspired by Diablo 1 with roguelike elements.

## Game Features

### Dungeon Generation
- Random dungeon generation using drunkard's walk algorithm
- 64x64 tile grid with floor and void placement
- 16 positional wall tiles that blend with surrounding terrain
- Wall tiles block player movement
- Safe spawning system - player and enemies only on floor tiles
- Items snap to floor tiles and don't stack

### Movement System
- Walk and run with speed-based animation differences
- Smooth 4-directional and diagonal movement
- Consistent speed in all directions

### Combat
- Directional attack action with swing
- Dummy enemies with health bars
- Floating damage values
- Enemies drop coins on death (thrown out)
- 25% chance per gift to drop loot

### Inventory System
- Pick up gifts with E (interact key)
- Items go into proper inventory slots
- Inventory sorting and equipment management
- Overflow prevention - can't pick up when full

### Economy
- Rebalanced coin distribution
- Lucky coin displays green when value exceeds loot pool
- All coins rendered with blend for reduced PC load
- Coin collection sound effect
- Floating +money text on pickup
- GUI money counter with comma-formatted numbers

### HUD
- Adjusted layout
- Scrolling chat log showing game events
- Objects have unique identity colors in chat
- Dungeon seed displayed on game start

## Controls
```yaml
Movement:
  Move: W A S D
  Run: Shift
  Dodge: Space

Combat:
  Attack: Left Click
  Use: Right Click

Interaction:
  Interact: E
  Potion: Q
  Inventory: Tab
  Pause: Escape
```

## Release History
Multiple builds from 2026.03.11 to 2026.04.04:
- Available for HTML5 (browser), Windows (EXE/ZIP), and Linux (AppImage on some versions)
- Regular iteration and updates
- Playable in browser with F11 fullscreen recommended

## Story Elements
From portfolio description:
- Pixel art dungeon crawler
- Inspired by Diablo 1
- Roguelike death loop
- Loot tables driven by enemy difficulty
- Story about reassembling a shattered gem to vanquish a trapped demon

## Related Concepts
- [[Game Development]] - GameMaker Studio 2 development
- [[Pixel Art]] - Art style and technique
- [[Dungeon Crawler]] - Game genre
- [[Roguelike]] - Death loop mechanic
- [[Procedural Generation]] - Drunkard's walk algorithm

## Last Updated
2026.04.04
