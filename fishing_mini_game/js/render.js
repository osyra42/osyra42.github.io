// Rendering functions

// Simple hash for consistent random-looking tile colors
function tileHash(x, y) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return h ^ (h >> 16);
}

function drawTile(ctx, screenX, screenY, terrain, tileX, tileY, time) {
  const colors = COLORS[terrain];
  const colorIndex = Math.abs(tileHash(tileX, tileY)) % colors.length;
  ctx.fillStyle = colors[colorIndex];
  ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);

  // Add subtle texture variation
  const hash = tileHash(tileX, tileY);
  if ((hash & 7) < 2) {
    // Small highlight spots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    const spotX = screenX + (Math.abs(hash >> 3) % 20) + 4;
    const spotY = screenY + (Math.abs(hash >> 8) % 20) + 4;
    ctx.beginPath();
    ctx.arc(spotX, spotY, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if ((hash & 7) < 4) {
    // Small shadow spots
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    const spotX = screenX + (Math.abs(hash >> 4) % 20) + 4;
    const spotY = screenY + (Math.abs(hash >> 9) % 20) + 4;
    ctx.beginPath();
    ctx.arc(spotX, spotY, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  if (terrain === TERRAIN.WATER) {
    const shimmer = waterShimmer.find(s => s.x === tileX && s.y === tileY);
    if (shimmer) {
      const alpha = 0.15 + Math.sin(time * 0.003 + shimmer.offset) * 0.1;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(screenX + 6, screenY + 6, 8, 3);
    }
  }
}

function drawTree(ctx, screenX, screenY) {
  const px = screenX + TILE_SIZE / 2;
  const py = screenY + TILE_SIZE / 2;

  ctx.fillStyle = '#5d4037';
  ctx.fillRect(px - 4, py + 2, 8, 14);

  ctx.fillStyle = '#2e7d32';
  ctx.beginPath();
  ctx.arc(px, py - 4, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#388e3c';
  ctx.beginPath();
  ctx.arc(px - 4, py + 2, 8, 0, Math.PI * 2);
  ctx.fill();
}

function drawDeadTree(ctx, screenX, screenY) {
  const px = screenX + TILE_SIZE / 2;
  const py = screenY + TILE_SIZE / 2;

  ctx.fillStyle = '#4a4a4a';
  ctx.fillRect(px - 3, py - 8, 6, 22);

  ctx.strokeStyle = '#4a4a4a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(px, py - 6);
  ctx.lineTo(px - 10, py - 14);
  ctx.moveTo(px, py - 2);
  ctx.lineTo(px + 8, py - 12);
  ctx.stroke();
}

function drawStone(ctx, screenX, screenY) {
  const px = screenX + TILE_SIZE / 2;
  const py = screenY + TILE_SIZE / 2;

  ctx.fillStyle = '#757575';
  ctx.beginPath();
  ctx.ellipse(px, py + 6, 12, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#9e9e9e';
  ctx.beginPath();
  ctx.ellipse(px - 2, py + 3, 9, 5, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawMerchant(ctx, screenX, screenY, time) {
  const px = screenX + TILE_SIZE / 2;
  const py = screenY + TILE_SIZE / 2;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(px, py + 12, 10, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body (purple robe)
  ctx.fillStyle = '#7b1fa2';
  ctx.beginPath();
  ctx.moveTo(px - 10, py + 10);
  ctx.lineTo(px - 6, py - 4);
  ctx.lineTo(px + 6, py - 4);
  ctx.lineTo(px + 10, py + 10);
  ctx.closePath();
  ctx.fill();

  // Head
  ctx.fillStyle = '#ffcc80';
  ctx.beginPath();
  ctx.arc(px, py - 8, 8, 0, Math.PI * 2);
  ctx.fill();

  // Hat (pointy merchant hat)
  ctx.fillStyle = '#4a148c';
  ctx.beginPath();
  ctx.moveTo(px, py - 24);
  ctx.lineTo(px + 10, py - 10);
  ctx.lineTo(px - 10, py - 10);
  ctx.closePath();
  ctx.fill();

  // Hat brim
  ctx.fillStyle = '#4a148c';
  ctx.fillRect(px - 12, py - 12, 24, 4);

  // Eyes
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(px - 3, py - 9, 1.5, 0, Math.PI * 2);
  ctx.arc(px + 3, py - 9, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(px, py - 6, 3, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Floating coin indicator
  const bobOffset = Math.sin(time * 0.005) * 3;
  ctx.fillStyle = '#ffd700';
  ctx.beginPath();
  ctx.ellipse(px, py - 32 + bobOffset, 6, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#b8860b';
  ctx.font = 'bold 8px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('$', px, py - 29 + bobOffset);
}

function draw(ctx, canvas, time) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update camera
  const camOffsetX = player.x - VIEWPORT_WIDTH / 2;
  const camOffsetY = player.y - VIEWPORT_HEIGHT / 2;

  camera.x += (camOffsetX - camera.x) * 0.1;
  camera.y += (camOffsetY - camera.y) * 0.1;

  camera.x = Math.max(0, Math.min(MAP_WIDTH - VIEWPORT_WIDTH, camera.x));
  camera.y = Math.max(0, Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT, camera.y));

  const startTileX = Math.floor(camera.x);
  const startTileY = Math.floor(camera.y);
  const offsetX = (camera.x - startTileX) * TILE_SIZE;
  const offsetY = (camera.y - startTileY) * TILE_SIZE;

  // Draw terrain
  for (let y = -1; y <= VIEWPORT_HEIGHT + 1; y++) {
    for (let x = -1; x <= VIEWPORT_WIDTH + 1; x++) {
      const tileX = startTileX + x;
      const tileY = startTileY + y;
      if (tileX >= 0 && tileX < MAP_WIDTH && tileY >= 0 && tileY < MAP_HEIGHT) {
        const screenX = x * TILE_SIZE - offsetX;
        const screenY = y * TILE_SIZE - offsetY;
        drawTile(ctx, screenX, screenY, map[tileY][tileX], tileX, tileY, time);
      }
    }
  }

  // Draw objects
  const visibleObjects = objects.filter(obj =>
    obj.x >= startTileX - 1 && obj.x <= startTileX + VIEWPORT_WIDTH + 1 &&
    obj.y >= startTileY - 1 && obj.y <= startTileY + VIEWPORT_HEIGHT + 1
  ).sort((a, b) => a.y - b.y);

  for (const obj of visibleObjects) {
    const screenX = (obj.x - camera.x) * TILE_SIZE;
    const screenY = (obj.y - camera.y) * TILE_SIZE;
    if (obj.type === 'tree') drawTree(ctx, screenX, screenY);
    else if (obj.type === 'deadTree') drawDeadTree(ctx, screenX, screenY);
    else if (obj.type === 'stone') drawStone(ctx, screenX, screenY);
  }

  // Draw merchant
  const merchantScreenX = (merchant.x - camera.x) * TILE_SIZE;
  const merchantScreenY = (merchant.y - camera.y) * TILE_SIZE;
  if (merchant.x >= startTileX - 1 && merchant.x <= startTileX + VIEWPORT_WIDTH + 1 &&
      merchant.y >= startTileY - 1 && merchant.y <= startTileY + VIEWPORT_HEIGHT + 1) {
    drawMerchant(ctx, merchantScreenX, merchantScreenY, time);
  }

  // Draw player
  const playerScreenX = (player.x - camera.x) * TILE_SIZE;
  const playerScreenY = (player.y - camera.y) * TILE_SIZE;
  drawPlayer(ctx, playerScreenX, playerScreenY, time);

  // Draw merchant dialog
  if (showMerchantDialog) {
    drawMerchantDialog(ctx, canvas);
  }
}

// Store button bounds for click detection
let tradeButtonBounds = null;

function drawMerchantDialog(ctx, canvas) {
  // Darken background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dialog box
  const boxWidth = 280;
  const boxHeight = 160;
  const boxX = (canvas.width - boxWidth) / 2;
  const boxY = (canvas.height - boxHeight) / 2;

  // Box background
  ctx.fillStyle = '#2a2a4a';
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
  ctx.strokeStyle = '#7b1fa2';
  ctx.lineWidth = 3;
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

  // Title
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Fish Merchant', canvas.width / 2, boxY + 25);

  // Info text
  ctx.fillStyle = '#eee';
  ctx.font = '12px Arial';
  ctx.fillText(`Your fish: ${fishCount}`, canvas.width / 2, boxY + 50);
  ctx.fillText(`Rod range: ${rodRange} tiles`, canvas.width / 2, boxY + 68);

  // Trade button
  const btnWidth = 180;
  const btnHeight = 32;
  const btnX = (canvas.width - btnWidth) / 2;
  const btnY = boxY + 85;

  tradeButtonBounds = { x: btnX, y: btnY, width: btnWidth, height: btnHeight };

  if (fishCount >= 10) {
    // Active button
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
    ctx.strokeStyle = '#388e3c';
    ctx.lineWidth = 2;
    ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('Trade 10 Fish for +1 Range', canvas.width / 2, btnY + 21);
  } else {
    // Disabled button
    ctx.fillStyle = '#555';
    ctx.fillRect(btnX, btnY, btnWidth, btnHeight);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);

    ctx.fillStyle = '#888';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(`Need ${10 - fishCount} more fish`, canvas.width / 2, btnY + 21);
  }

  // Close hint
  ctx.fillStyle = '#888';
  ctx.font = '10px Arial';
  ctx.fillText('Click outside to close', canvas.width / 2, boxY + boxHeight - 12);
}

function getTradeButtonBounds() {
  return tradeButtonBounds;
}

// Minimap constants
const MINIMAP_SCALE = 2; // 1 tile = 2x2 pixels
const MINIMAP_COLORS = {
  [TERRAIN.WATER]: '#2d7ab3',
  [TERRAIN.SAND]: '#d4b896',
  [TERRAIN.GRASS]: '#4a8c42',
  [TERRAIN.DIRT]: '#7d5c3a'
};

let minimapCanvas, minimapCtx;
let minimapImageData = null;

function initMinimap() {
  minimapCanvas = document.getElementById('minimap');
  minimapCtx = minimapCanvas.getContext('2d');
  minimapCanvas.width = MAP_WIDTH * MINIMAP_SCALE;
  minimapCanvas.height = MAP_HEIGHT * MINIMAP_SCALE;
}

function renderMinimapTerrain() {
  // Only render terrain once when map is generated
  minimapImageData = minimapCtx.createImageData(minimapCanvas.width, minimapCanvas.height);

  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      const terrain = map[y][x];
      const color = MINIMAP_COLORS[terrain];
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      // Fill 4x4 pixel block
      for (let py = 0; py < MINIMAP_SCALE; py++) {
        for (let px = 0; px < MINIMAP_SCALE; px++) {
          const idx = ((y * MINIMAP_SCALE + py) * minimapCanvas.width + (x * MINIMAP_SCALE + px)) * 4;
          minimapImageData.data[idx] = r;
          minimapImageData.data[idx + 1] = g;
          minimapImageData.data[idx + 2] = b;
          minimapImageData.data[idx + 3] = 255;
        }
      }
    }
  }
}

function drawMinimap() {
  if (!minimapImageData) return;

  // Draw cached terrain
  minimapCtx.putImageData(minimapImageData, 0, 0);

  // Draw merchant (purple dot)
  minimapCtx.fillStyle = '#7b1fa2';
  minimapCtx.fillRect(
    merchant.x * MINIMAP_SCALE,
    merchant.y * MINIMAP_SCALE,
    MINIMAP_SCALE,
    MINIMAP_SCALE
  );

  // Draw player (white dot with outline)
  minimapCtx.fillStyle = '#fff';
  minimapCtx.fillRect(
    Math.round(player.x) * MINIMAP_SCALE,
    Math.round(player.y) * MINIMAP_SCALE,
    MINIMAP_SCALE,
    MINIMAP_SCALE
  );

  // Draw viewport rectangle
  minimapCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  minimapCtx.lineWidth = 1;
  minimapCtx.strokeRect(
    camera.x * MINIMAP_SCALE,
    camera.y * MINIMAP_SCALE,
    VIEWPORT_WIDTH * MINIMAP_SCALE,
    VIEWPORT_HEIGHT * MINIMAP_SCALE
  );
}
