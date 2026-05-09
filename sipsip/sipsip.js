const DECKS = [
  { id: 'buzzed', label: 'Buzzed', path: 'decks/buzzed.txt' },
  { id: 'couples', label: 'Couples', path: 'decks/couples.txt' },
];
const STORAGE_KEY = 'sipsip-decks';

const cardLines = {};
let drawPile = [];
let discardPile = [];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return Object.fromEntries(DECKS.map(d => [d.id, true]));
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const state = loadState();

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck() {
  const enabled = DECKS.filter(d => state[d.id]);
  const cards = [];
  enabled.forEach(d => {
    (cardLines[d.id] || []).forEach(line => {
      cards.push({ line, deck: d.label });
    });
  });
  return shuffle(cards);
}

function rebuildPiles() {
  drawPile = buildDeck();
  discardPile = [];
  render();
}

function updateDiscardPile() {
  const discardTop = document.getElementById('discard-top');
  const placeholder = document.getElementById('discard-placeholder');
  if (discardPile.length === 0) {
    discardTop.hidden = true;
    placeholder.hidden = false;
    return;
  }
  const top = discardPile[discardPile.length - 1];
  document.getElementById('discard-text').textContent = top.line;
  document.getElementById('discard-deck').textContent = top.deck;
  discardTop.hidden = false;
  placeholder.hidden = true;
}

function render() {
  const drawPileEl = document.getElementById('draw-pile');
  const flip = document.getElementById('top-card');
  const cardText = document.getElementById('card-text');
  const cardDeck = document.getElementById('card-deck');

  flip.classList.remove('drawing', 'spawning');

  if (drawPile.length === 0) {
    drawPileEl.classList.add('empty');
    flip.style.display = 'none';
    let placeholder = drawPileEl.querySelector('.draw-empty');
    if (!placeholder) {
      placeholder = document.createElement('div');
      placeholder.className = 'pile-placeholder draw-empty';
      drawPileEl.appendChild(placeholder);
    }
    const enabled = DECKS.filter(d => state[d.id]);
    placeholder.textContent = enabled.length === 0 ? 'Choose a deck' : 'Empty';
  } else {
    drawPileEl.classList.remove('empty');
    flip.style.display = '';
    const placeholder = drawPileEl.querySelector('.draw-empty');
    if (placeholder) placeholder.remove();

    const top = drawPile[0];
    cardText.textContent = top.line;
    cardDeck.textContent = top.deck;
  }

  updateDiscardPile();
}

function buildSidebar() {
  const sidebar = document.getElementById('decks');
  DECKS.forEach(d => {
    const label = document.createElement('label');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!state[d.id];
    cb.addEventListener('change', () => {
      state[d.id] = cb.checked;
      saveState(state);
      rebuildPiles();
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(d.label));
    sidebar.appendChild(label);
  });
}

const flip = document.getElementById('top-card');

function isAnimating() {
  return flip.classList.contains('drawing') || flip.classList.contains('spawning');
}

flip.addEventListener('click', () => {
  if (isAnimating()) return;
  if (drawPile.length === 0) return;
  flip.classList.add('drawing');
});

flip.addEventListener('animationend', (e) => {
  if (e.animationName === 'draw-flip') {
    const drawn = drawPile.shift();
    discardPile.push(drawn);
    updateDiscardPile();

    flip.classList.remove('drawing');

    if (drawPile.length === 0) {
      render();
      return;
    }

    document.getElementById('card-text').textContent = drawPile[0].line;
    document.getElementById('card-deck').textContent = drawPile[0].deck;

    flip.classList.add('spawning');
  } else if (e.animationName === 'spawn-card') {
    flip.classList.remove('spawning');
  }
});

buildSidebar();
render();

Promise.all(DECKS.map(d =>
  fetch(d.path)
    .then(r => r.text())
    .then(text => {
      cardLines[d.id] = text.split('\n').map(l => l.trim()).filter(Boolean);
    })
    .catch(() => { cardLines[d.id] = []; })
)).then(rebuildPiles);
