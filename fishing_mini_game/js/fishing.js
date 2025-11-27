// Fishing mechanics

function canFishAt(waterX, waterY) {
  const px = player.tileX;
  const py = player.tileY;
  const dx = Math.abs(waterX - px);
  const dy = Math.abs(waterY - py);
  return dx <= rodRange && dy <= rodRange && (dx + dy <= rodRange + 1);
}

function startFishing(waterX, waterY) {
  player.facing = getFacingDirection(player.tileX, player.tileY, waterX, waterY);
  fishingTarget = { x: waterX, y: waterY };
  isFishing = true;
  fishingTimer = 0;
  waitingForReel = false;
  biteWindow = 0;
  biteTime = 30 + Math.floor(Math.random() * 150); // Random 0.5-3 sec wait (30-180 frames)
  pathQueue = [];
}

function reelIn() {
  if (!isFishing) return;

  // Clicked too early - fish is confused
  if (!fishBiting) {
    confusedFish = { timer: 0 };
    isFishing = false;
    return;
  }

  // Successfully caught fish!
  fishCount++;
  document.getElementById('fishCount').textContent = fishCount;
  caughtFish = { timer: 0 };

  // Reset fishing state
  fishBiting = false;
  waitingForReel = false;
  isFishing = false;
}

function updateFishing() {
  if (!isFishing) return;

  fishingTimer++;

  if (!waitingForReel) {
    if (fishingTimer >= biteTime && !fishBiting) {
      // Fish starts biting - wait for player input
      fishBiting = true;
      waitingForReel = true;
      biteWindow = 0;
    }
  } else {
    // Fish is biting - player has limited time to reel in
    biteWindow++;

    // Give player ~45 frames (0.75 sec) to react
    if (biteWindow > 45) {
      // Fish escaped - too slow!
      angryFish = { timer: 0 };
      fishBiting = false;
      waitingForReel = false;
      isFishing = false;
    }
  }
}

function updateAngryFish() {
  if (angryFish !== null) {
    angryFish.timer++;
    if (angryFish.timer >= 60) {
      angryFish = null;
    }
  }
}

function updateConfusedFish() {
  if (confusedFish !== null) {
    confusedFish.timer++;
    if (confusedFish.timer >= 60) {
      confusedFish = null;
    }
  }
}

function updateCaughtFish() {
  if (caughtFish !== null) {
    caughtFish.timer++;
    if (caughtFish.timer >= 60) {
      caughtFish = null;
    }
  }
}

function walkToFishingSpot(clickX, clickY) {
  const adjacentTiles = [];
  const dirs = [[-1,0], [1,0], [0,-1], [0,1]];

  for (const [dx, dy] of dirs) {
    const ax = clickX + dx;
    const ay = clickY + dy;
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

      setTimeout(function checkPathAndFish() {
        if (pathQueue.length === 0 && !isFishing) {
          startFishing(clickX, clickY);
        } else if (pathQueue.length > 0) {
          setTimeout(checkPathAndFish, 100);
        }
      }, 100);

      return true;
    }
  }

  return false;
}
