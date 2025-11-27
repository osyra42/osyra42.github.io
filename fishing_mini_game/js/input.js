// Input handling

function isNextToMerchant() {
  const dx = Math.abs(player.tileX - merchant.x);
  const dy = Math.abs(player.tileY - merchant.y);
  return dx <= 1 && dy <= 1 && (dx + dy <= 1);
}

function tradeWithMerchant() {
  if (fishCount >= 10) {
    fishCount -= 10;
    rodRange += 1;
    document.getElementById('fishCount').textContent = fishCount;
    document.getElementById('rodRangeDisplay').textContent = rodRange;
  }
}

function setupInputHandlers(canvas) {
  document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    // ESC to close merchant dialog
    if (e.key === 'Escape' && showMerchantDialog) {
      showMerchantDialog = false;
      return;
    }

    // Space in merchant dialog to trade
    if (e.key === ' ' && showMerchantDialog) {
      tradeWithMerchant();
      return;
    }

    // Space to reel in while fishing (handles both early and on-time)
    if (e.key === ' ' && isFishing) {
      reelIn();
      return;
    }

    // Space to interact with merchant
    if (e.key === ' ' && !isFishing && isNextToMerchant()) {
      showMerchantDialog = true;
      return;
    }

    // Space to fish if near water
    if (e.key === ' ' && !isFishing && isNearWater(player.tileX, player.tileY)) {
      const dir = DIRECTIONS[player.facing];
      let waterX = player.tileX + dir.x;
      let waterY = player.tileY + dir.y;

      if (!isWater(waterX, waterY)) {
        const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
        for (const [dx, dy] of dirs) {
          if (isWater(player.tileX + dx, player.tileY + dy)) {
            waterX = player.tileX + dx;
            waterY = player.tileY + dy;
            player.facing = getFacingDirection(player.tileX, player.tileY, waterX, waterY);
            break;
          }
        }
      }

      if (isWater(waterX, waterY)) {
        startFishing(waterX, waterY);
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  canvas.addEventListener('click', (e) => {
    // Handle merchant dialog clicks
    if (showMerchantDialog) {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Check if clicking trade button
      const btn = getTradeButtonBounds();
      if (btn && clickX >= btn.x && clickX <= btn.x + btn.width &&
          clickY >= btn.y && clickY <= btn.y + btn.height) {
        tradeWithMerchant();
        return;
      }

      // Dialog box dimensions (must match render.js)
      const boxWidth = 280;
      const boxHeight = 160;
      const boxX = (canvas.width - boxWidth) / 2;
      const boxY = (canvas.height - boxHeight) / 2;

      // Check if click is outside the dialog box
      if (clickX < boxX || clickX > boxX + boxWidth ||
          clickY < boxY || clickY > boxY + boxHeight) {
        showMerchantDialog = false;
      }
      return;
    }

    // Click to reel in while fishing (handles both early and on-time)
    if (isFishing) {
      reelIn();
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const clickX = Math.floor((e.clientX - rect.left) / TILE_SIZE + camera.x);
    const clickY = Math.floor((e.clientY - rect.top) / TILE_SIZE + camera.y);

    // Click on merchant
    if (isMerchant(clickX, clickY)) {
      if (isNextToMerchant()) {
        showMerchantDialog = true;
      } else {
        // Walk to merchant
        walkToMerchant();
      }
      return;
    }

    // Click on water to fish
    if (isWater(clickX, clickY)) {
      if (canFishAt(clickX, clickY)) {
        startFishing(clickX, clickY);
      } else {
        walkToFishingSpot(clickX, clickY);
      }
      return;
    }

    // Normal movement
    if (isWalkable(clickX, clickY)) {
      const path = findPath(player.tileX, player.tileY, clickX, clickY);
      if (path.length > 0) {
        pathQueue = path;
      }
    }
  });
}

function walkToMerchant() {
  const adjacentTiles = [];
  const dirs = [[-1,0], [1,0], [0,-1], [0,1]];

  for (const [dx, dy] of dirs) {
    const ax = merchant.x + dx;
    const ay = merchant.y + dy;
    if (isWalkable(ax, ay)) {
      adjacentTiles.push({ x: ax, y: ay });
    }
  }

  if (adjacentTiles.length > 0) {
    adjacentTiles.sort((a, b) => {
      const distA = Math.abs(a.x - player.tileX) + Math.abs(a.y - player.tileY);
      const distB = Math.abs(b.x - player.tileX) + Math.abs(b.y - player.tileY);
      return distA - distB;
    });

    const target = adjacentTiles[0];
    const path = findPath(player.tileX, player.tileY, target.x, target.y);

    if (path.length > 0) {
      pathQueue = path;

      setTimeout(function checkPathAndTalk() {
        if (pathQueue.length === 0 && !showMerchantDialog) {
          showMerchantDialog = true;
        } else if (pathQueue.length > 0) {
          setTimeout(checkPathAndTalk, 100);
        }
      }, 100);
    }
  }
}

function handleKeyboardMovement(time) {
  if (showMerchantDialog || isFishing || pathQueue.length > 0 || time - lastMoveTime <= MOVE_COOLDOWN) {
    return;
  }

  if (Math.abs(player.x - player.tileX) >= 0.1 || Math.abs(player.y - player.tileY) >= 0.1) {
    return;
  }

  let dx = 0, dy = 0;
  if (keys['w'] || keys['arrowup']) dy = -1;
  if (keys['s'] || keys['arrowdown']) dy = 1;
  if (keys['a'] || keys['arrowleft']) dx = -1;
  if (keys['d'] || keys['arrowright']) dx = 1;

  if (dx !== 0 || dy !== 0) {
    const newX = player.tileX + dx;
    const newY = player.tileY + dy;

    if (isWalkable(newX, newY)) {
      if (dx === 1) player.facing = 'right';
      else if (dx === -1) player.facing = 'left';
      else if (dy === 1) player.facing = 'down';
      else if (dy === -1) player.facing = 'up';

      player.tileX = newX;
      player.tileY = newY;
      lastMoveTime = time;
      triggerHop();
    }
  }
}
