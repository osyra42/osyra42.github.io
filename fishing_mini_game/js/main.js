// Main game loop and initialization

let canvas, ctx;

function update(time) {
  updateMovement();
  handleKeyboardMovement(time);
  updateFishing();
  updateCaughtFish();
  updateAngryFish();
  updateConfusedFish();
}

function gameLoop(timestamp) {
  update(timestamp);
  draw(ctx, canvas, timestamp);
  drawMinimap();
  requestAnimationFrame(gameLoop);
}

function init() {
  canvas = document.getElementById('game');
  ctx = canvas.getContext('2d');

  canvas.width = VIEWPORT_WIDTH * TILE_SIZE;
  canvas.height = VIEWPORT_HEIGHT * TILE_SIZE;

  const previewCanvas = document.getElementById('previewCanvas');

  generateTerrain();
  generateObjects();
  spawnMerchant();
  findSpawnPoint();
  initMinimap();
  renderMinimapTerrain();
  setupCustomization(previewCanvas);
  setupInputHandlers(canvas);

  requestAnimationFrame(gameLoop);
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
