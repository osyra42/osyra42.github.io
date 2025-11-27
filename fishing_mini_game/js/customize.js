// Character customization

function setupCustomization(previewCanvas) {
  const previewCtx = previewCanvas.getContext('2d');

  document.getElementById('playerName').addEventListener('input', (e) => {
    character.name = e.target.value || 'Player';
    drawPreview(previewCtx);
  });

  document.getElementById('bodyColor').addEventListener('input', (e) => {
    character.bodyColor = e.target.value;
    drawPreview(previewCtx);
  });

  document.getElementById('bodyShape').addEventListener('change', (e) => {
    character.shape = e.target.value;
    drawPreview(previewCtx);
  });

  document.getElementById('accessory').addEventListener('change', (e) => {
    character.accessory = e.target.value;
    document.getElementById('accessoryColorGroup').style.display =
      e.target.value === 'none' ? 'none' : 'block';

    if (e.target.value === 'hat') {
      character.accessoryColor = '#5d4037';
      document.getElementById('accessoryColor').value = '#5d4037';
    } else if (e.target.value === 'bow') {
      character.accessoryColor = '#e91e63';
      document.getElementById('accessoryColor').value = '#e91e63';
    }
    drawPreview(previewCtx);
  });

  document.getElementById('accessoryColor').addEventListener('input', (e) => {
    character.accessoryColor = e.target.value;
    drawPreview(previewCtx);
  });

  document.getElementById('eyeColor').addEventListener('input', (e) => {
    character.eyeColor = e.target.value;
    drawPreview(previewCtx);
  });

  // Initial draw
  drawPreview(previewCtx);
}

function drawPreview(previewCtx) {
  previewCtx.clearRect(0, 0, 60, 70);
  const px = 30;
  const py = 35;

  // Body based on shape
  previewCtx.fillStyle = character.bodyColor;
  if (character.shape === 'circle') {
    previewCtx.beginPath();
    previewCtx.arc(px, py, 12, 0, Math.PI * 2);
    previewCtx.fill();
  } else if (character.shape === 'square') {
    previewCtx.fillRect(px - 10, py - 10, 20, 20);
  } else if (character.shape === 'triangle') {
    previewCtx.beginPath();
    previewCtx.moveTo(px, py - 12);
    previewCtx.lineTo(px + 12, py + 10);
    previewCtx.lineTo(px - 12, py + 10);
    previewCtx.closePath();
    previewCtx.fill();
  }

  // Eyes
  previewCtx.fillStyle = character.eyeColor;
  previewCtx.beginPath();
  previewCtx.arc(px - 4, py - 2, 2, 0, Math.PI * 2);
  previewCtx.arc(px + 4, py - 2, 2, 0, Math.PI * 2);
  previewCtx.fill();

  // Accessory
  if (character.accessory === 'hat') {
    previewCtx.fillStyle = character.accessoryColor;
    previewCtx.fillRect(px - 10, py - 16, 20, 5);
    previewCtx.fillRect(px - 6, py - 22, 12, 6);
  } else if (character.accessory === 'bow') {
    previewCtx.fillStyle = character.accessoryColor;
    previewCtx.beginPath();
    previewCtx.ellipse(px - 8, py - 14, 6, 4, -0.3, 0, Math.PI * 2);
    previewCtx.fill();
    previewCtx.beginPath();
    previewCtx.ellipse(px + 8, py - 14, 6, 4, 0.3, 0, Math.PI * 2);
    previewCtx.fill();
    previewCtx.beginPath();
    previewCtx.arc(px, py - 14, 3, 0, Math.PI * 2);
    previewCtx.fill();
  }
}
