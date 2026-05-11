const DECKS = [
  { id: 'buzzed', label: 'Buzzed', path: 'decks/buzzed.txt' },
  { id: 'couples', label: 'Couples', path: 'decks/couples.txt' },
  { id: 'anime', label: 'Anime', path: 'decks/anime.txt' },
  { id: 'code', label: 'Code', path: 'decks/code.txt' },
  { id: 'family', label: 'Family', path: 'decks/family.txt' },
  { id: 'food', label: 'Food', path: 'decks/food.txt' },
  { id: 'friends', label: 'Friends', path: 'decks/friends.txt' },
  { id: 'games', label: 'Games', path: 'decks/games.txt' },
  { id: 'movies', label: 'Movies', path: 'decks/movies.txt' },
  { id: 'sex', label: 'Sex', path: 'decks/sex.txt' },
];
DECKS.sort((a, b) => a.label.localeCompare(b.label));
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

class Card {
  constructor({ tag, text, deck, back = 'Sip Sip' }) {
    this.face = { tag, text, deck };
    this.back = back;
  }

  static parse(line, deck) {
    const match = line.match(/^\[([^\]]+)\]\s*(.*)$/);
    const tag = match ? match[1] : '';
    const text = match ? match[2] : line;
    return new Card({ tag, text, deck: deck.label, back: deck.back });
  }
}

function buildDeck() {
  const enabled = DECKS.filter(d => state[d.id]);
  const cards = [];
  enabled.forEach(d => {
    (cardLines[d.id] || []).forEach(line => {
      cards.push(Card.parse(line, d));
    });
  });
  return shuffle(cards);
}

function rebuildPiles() {
  drawPile = buildDeck();
  discardPile = [];
  render();
}

function updateDeckCount() {
  const el = document.getElementById('decks-count');
  const n = drawPile.length;
  el.textContent = `${n} card${n === 1 ? '' : 's'} left`;
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
  document.getElementById('discard-tag').textContent = top.face.tag;
  document.getElementById('discard-text').textContent = top.face.text;
  document.getElementById('discard-deck').textContent = top.face.deck;
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
    document.getElementById('card-tag').textContent = top.face.tag;
    cardText.textContent = top.face.text;
    cardDeck.textContent = top.face.deck;
    document.getElementById('card-back-text').textContent = top.back;
  }

  updateDiscardPile();
  updateDeckCount();
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
    const text = document.createElement('span');
    text.className = 'deck-label';
    text.textContent = d.label;
    const count = document.createElement('span');
    count.className = 'deck-count';
    count.id = `deck-count-${d.id}`;
    label.appendChild(cb);
    label.appendChild(text);
    label.appendChild(count);
    sidebar.appendChild(label);
  });
}

function updateDeckCounts() {
  DECKS.forEach(d => {
    const el = document.getElementById(`deck-count-${d.id}`);
    if (!el) return;
    const n = (cardLines[d.id] || []).length;
    el.textContent = n > 0 ? n : '';
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
    updateDeckCount();

    flip.classList.remove('drawing');

    if (drawPile.length === 0) {
      render();
      return;
    }

    document.getElementById('card-tag').textContent = drawPile[0].face.tag;
    document.getElementById('card-text').textContent = drawPile[0].face.text;
    document.getElementById('card-deck').textContent = drawPile[0].face.deck;
    document.getElementById('card-back-text').textContent = drawPile[0].back;

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
)).then(() => {
  updateDeckCounts();
  rebuildPiles();
});
