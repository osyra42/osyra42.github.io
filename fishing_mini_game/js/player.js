// Player logic and drawing

function getFacingDirection(fromX, fromY, toX, toY) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'down' : 'up';
  }
}

function triggerHop() {
  if (!player.isHopping) {
    player.isHopping = true;
    player.hopOffset = 0;
  }
}

function updateHop() {
  if (player.isHopping) {
    player.hopOffset += 2;
    if (player.hopOffset >= 8) {
      player.hopOffset = 8;
    }
  } else if (player.hopOffset > 0) {
    player.hopOffset -= 2;
    if (player.hopOffset < 0) player.hopOffset = 0;
  }
}

function updateMovement() {
  const dx = player.tileX - player.x;
  const dy = player.tileY - player.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 0.01) {
    player.x += dx * player.speed * 2;
    player.y += dy * player.speed * 2;
    player.isHopping = true;
  } else {
    player.x = player.tileX;
    player.y = player.tileY;
    player.isHopping = false;

    if (pathQueue.length > 0 && !isFishing) {
      const next = pathQueue.shift();
      player.facing = getFacingDirection(player.tileX, player.tileY, next.x, next.y);
      player.tileX = next.x;
      player.tileY = next.y;
      triggerHop();
    }
  }

  updateHop();
}

function drawPlayer(ctx, screenX, screenY, time) {
  const px = screenX + TILE_SIZE / 2;
  const hopY = player.hopOffset;
  const py = screenY + TILE_SIZE / 2 - hopY;

  // Shadow
  const shadowScale = 1 - (hopY / 20);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(px, screenY + TILE_SIZE / 2 + 10, 10 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body based on shape
  ctx.fillStyle = character.bodyColor;
  if (character.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.fill();
  } else if (character.shape === 'square') {
    ctx.fillRect(px - 10, py - 10, 20, 20);
  } else if (character.shape === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(px, py - 12);
    ctx.lineTo(px + 12, py + 10);
    ctx.lineTo(px - 12, py + 10);
    ctx.closePath();
    ctx.fill();
  }

  // Eyes based on direction
  ctx.fillStyle = character.eyeColor;
  if (player.facing === 'down') {
    ctx.beginPath();
    ctx.arc(px - 4, py - 2, 2, 0, Math.PI * 2);
    ctx.arc(px + 4, py - 2, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (player.facing === 'left') {
    ctx.beginPath();
    ctx.arc(px - 6, py - 2, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (player.facing === 'right') {
    ctx.beginPath();
    ctx.arc(px + 6, py - 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Accessory
  if (character.accessory === 'hat') {
    ctx.fillStyle = character.accessoryColor;
    ctx.fillRect(px - 10, py - 16, 20, 5);
    ctx.fillRect(px - 6, py - 22, 12, 6);
  } else if (character.accessory === 'bow') {
    ctx.fillStyle = character.accessoryColor;
    ctx.beginPath();
    ctx.ellipse(px - 8, py - 14, 6, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(px + 8, py - 14, 6, 4, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py - 14, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Player name
  ctx.fillStyle = '#fff';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(character.name, px, screenY + TILE_SIZE / 2 + 22);

  // Fishing rod
  if (isFishing) {
    drawFishingRod(ctx, px, py, time);
  }

  // Exclamation mark when biting
  if (fishBiting) {
    ctx.fillStyle = '#ffeb3b';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('!', px, py - 35);
    ctx.strokeStyle = '#f57f17';
    ctx.lineWidth = 2;
    ctx.strokeText('!', px, py - 35);
  }

  // Caught fish floating up
  if (caughtFish !== null) {
    drawCaughtFish(ctx, px, py, time);
  }

  // Angry fish indicator (too slow)
  if (angryFish !== null) {
    drawAngryFish(ctx, px, py);
  }

  // Confused fish indicator (too early)
  if (confusedFish !== null) {
    drawConfusedFish(ctx, px, py);
  }
}

function drawFishingRod(ctx, px, py, time) {
  const rodDir = DIRECTIONS[player.facing];
  const rodLength = 35;
  const rodEndX = px + rodDir.x * rodLength;
  const rodEndY = py - 10 + rodDir.y * rodLength;

  // Rod
  ctx.strokeStyle = '#8d6e63';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(px + rodDir.x * 6, py - 6);
  ctx.lineTo(rodEndX, rodEndY);
  ctx.stroke();

  // Line to water
  const waterScreenX = (fishingTarget.x - camera.x) * TILE_SIZE + TILE_SIZE / 2;
  const waterScreenY = (fishingTarget.y - camera.y) * TILE_SIZE + TILE_SIZE / 2;

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(rodEndX, rodEndY);
  ctx.lineTo(waterScreenX, waterScreenY);
  ctx.stroke();

  // Bobber
  const bobberBob = fishBiting
    ? Math.sin(time * 0.05) * 8
    : Math.sin(time * 0.01) * 3;
  ctx.fillStyle = '#e53935';
  ctx.beginPath();
  ctx.arc(waterScreenX, waterScreenY + bobberBob, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(waterScreenX, waterScreenY + bobberBob - 2, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawCaughtFish(ctx, px, py, time) {
  const floatOffset = caughtFish.timer * 0.8;
  const alpha = Math.max(0, 1 - caughtFish.timer / 60);

  ctx.save();
  ctx.globalAlpha = alpha;

  const fishX = px;
  const fishY = py - 40 - floatOffset;

  // Fish body
  ctx.fillStyle = '#64b5f6';
  ctx.beginPath();
  ctx.ellipse(fishX, fishY, 12, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fish tail
  ctx.beginPath();
  ctx.moveTo(fishX + 10, fishY);
  ctx.lineTo(fishX + 18, fishY - 6);
  ctx.lineTo(fishX + 18, fishY + 6);
  ctx.closePath();
  ctx.fill();

  // Fish eye
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(fishX - 5, fishY - 1, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(fishX - 5, fishY - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Sparkles
  ctx.fillStyle = '#ffeb3b';
  const sparkleTime = time * 0.02;
  for (let i = 0; i < 3; i++) {
    const angle = sparkleTime + i * (Math.PI * 2 / 3);
    const sparkleX = fishX + Math.cos(angle) * 20;
    const sparkleY = fishY + Math.sin(angle) * 12;
    ctx.beginPath();
    ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawAngryFish(ctx, px, py) {
  const alpha = Math.max(0, 1 - angryFish.timer / 60);
  const floatOffset = angryFish.timer * 0.5;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Red angry # symbol (too slow)
  ctx.fillStyle = '#e53935';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('#', px, py - 35 - floatOffset);
  ctx.strokeStyle = '#b71c1c';
  ctx.lineWidth = 2;
  ctx.strokeText('#', px, py - 35 - floatOffset);

  ctx.restore();
}

function drawConfusedFish(ctx, px, py) {
  const alpha = Math.max(0, 1 - confusedFish.timer / 60);
  const floatOffset = confusedFish.timer * 0.5;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Blue confused ? symbol (too early)
  ctx.fillStyle = '#2196f3';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('?', px, py - 35 - floatOffset);
  ctx.strokeStyle = '#0d47a1';
  ctx.lineWidth = 2;
  ctx.strokeText('?', px, py - 35 - floatOffset);

  ctx.restore();
}
