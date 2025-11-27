// Game configuration and constants

const TILE_SIZE = 32;
const MAP_WIDTH = 60;
const MAP_HEIGHT = 60;
const VIEWPORT_WIDTH = 25;
const VIEWPORT_HEIGHT = 18;

// Terrain types
const TERRAIN = {
  WATER: 0,
  SAND: 1,
  GRASS: 2,
  DIRT: 3
};

// Colors for each terrain type (subtle variations)
const COLORS = {
  [TERRAIN.WATER]: ['#2d7ab3', '#3182b8', '#2878ad'],
  [TERRAIN.SAND]: ['#d4b896', '#cfb48f', '#d1b088'],
  [TERRAIN.GRASS]: ['#4a8c42', '#4f9147', '#458740'],
  [TERRAIN.DIRT]: ['#7d5c3a', '#795838', '#755436']
};

// Direction vectors
const DIRECTIONS = {
  down: { x: 0, y: 1 },
  up: { x: 0, y: -1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

// Movement settings
const MOVE_COOLDOWN = 250; // Time between keyboard moves (ms)
