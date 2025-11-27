// Terrain generation

function initWaterShimmer() {
  waterShimmer = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (Math.random() < 0.15) {
        waterShimmer.push({ x, y, offset: Math.random() * Math.PI * 2 });
      }
    }
  }
}

function generateTerrain() {
  map = Array(MAP_HEIGHT).fill(null).map(() => Array(MAP_WIDTH).fill(TERRAIN.GRASS));

  // Generate ponds
  const numPonds = 2 + Math.floor(Math.random() * 3);

  for (let p = 0; p < numPonds; p++) {
    const centerX = 10 + Math.floor(Math.random() * (MAP_WIDTH - 20));
    const centerY = 10 + Math.floor(Math.random() * (MAP_HEIGHT - 20));
    const pondSize = 4 + Math.floor(Math.random() * 5);

    for (let y = centerY - pondSize - 3; y <= centerY + pondSize + 3; y++) {
      for (let x = centerX - pondSize - 3; x <= centerX + pondSize + 3; x++) {
        if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) continue;

        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        const noise = (Math.sin(x * 0.5) + Math.cos(y * 0.7)) * 1.5;
        const adjustedDist = dist + noise;

        if (adjustedDist < pondSize) {
          map[y][x] = TERRAIN.WATER;
        } else if (adjustedDist < pondSize + 2) {
          if (map[y][x] === TERRAIN.GRASS) {
            map[y][x] = TERRAIN.SAND;
          }
        }
      }
    }
  }

  // Add small water streams
  for (let i = 0; i < 3; i++) {
    const startX = Math.floor(Math.random() * MAP_WIDTH);
    const startY = Math.floor(Math.random() * MAP_HEIGHT);
    let x = startX, y = startY;

    for (let step = 0; step < 15; step++) {
      if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
        if (Math.random() < 0.6) {
          map[y][x] = TERRAIN.WATER;
          const dirs = [[-1,0], [1,0], [0,-1], [0,1]];
          for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT) {
              if (map[ny][nx] === TERRAIN.GRASS && Math.random() < 0.7) {
                map[ny][nx] = TERRAIN.SAND;
              }
            }
          }
        }
      }
      x += Math.floor(Math.random() * 3) - 1;
      y += Math.floor(Math.random() * 3) - 1;
    }
  }

  // Add dirt patches
  for (let i = 0; i < Math.floor(MAP_WIDTH * MAP_HEIGHT * 0.008); i++) {
    const x = Math.floor(Math.random() * MAP_WIDTH);
    const y = Math.floor(Math.random() * MAP_HEIGHT);
    if (map[y][x] === TERRAIN.GRASS) {
      const patchSize = 2 + Math.floor(Math.random() * 2);
      for (let dy = -patchSize; dy <= patchSize; dy++) {
        for (let dx = -patchSize; dx <= patchSize; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < MAP_WIDTH && ny >= 0 && ny < MAP_HEIGHT) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < patchSize && map[ny][nx] === TERRAIN.GRASS && Math.random() < 0.6) {
              map[ny][nx] = TERRAIN.DIRT;
            }
          }
        }
      }
    }
  }

  initWaterShimmer();
}

function generateObjects() {
  objects = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const terrain = map[y][x];
      const rand = Math.random();

      if (terrain === TERRAIN.GRASS && rand < 0.10) {
        objects.push({ x, y, type: 'tree' });
      } else if (terrain === TERRAIN.DIRT && rand < 0.20) {
        objects.push({ x, y, type: 'deadTree' });
      } else if (terrain !== TERRAIN.WATER && rand < 0.02) {
        objects.push({ x, y, type: 'stone' });
      }
    }
  }
}

function spawnMerchant() {
  const validSpots = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (map[y][x] === TERRAIN.GRASS && !hasObject(x, y)) {
        validSpots.push({x, y});
      }
    }
  }
  const spot = validSpots[Math.floor(Math.random() * validSpots.length)];
  merchant.x = spot.x;
  merchant.y = spot.y;
}

function hasObject(x, y) {
  return objects.some(obj => obj.x === x && obj.y === y);
}

function isMerchant(x, y) {
  return merchant.x === x && merchant.y === y;
}

function isWalkable(x, y) {
  if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
  if (map[y][x] === TERRAIN.WATER) return false;
  if (hasObject(x, y)) return false;
  if (isMerchant(x, y)) return false;
  return true;
}

function isWater(x, y) {
  if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
  return map[y][x] === TERRAIN.WATER;
}

function isNearWater(x, y) {
  const dirs = [[-1,0], [1,0], [0,-1], [0,1]];
  for (const [dx, dy] of dirs) {
    const nx = Math.round(x) + dx;
    const ny = Math.round(y) + dy;
    if (isWater(nx, ny)) return true;
  }
  return false;
}

function findSpawnPoint() {
  const validSpots = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (map[y][x] === TERRAIN.GRASS && !hasObject(x, y)) {
        validSpots.push({x, y});
      }
    }
  }
  const spot = validSpots[Math.floor(Math.random() * validSpots.length)];
  player.x = spot.x;
  player.y = spot.y;
  player.tileX = spot.x;
  player.tileY = spot.y;
  camera.x = spot.x;
  camera.y = spot.y;
}
