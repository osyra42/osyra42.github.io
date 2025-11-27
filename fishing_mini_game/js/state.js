// Game state management

// Map and objects
let map = [];
let objects = [];
let waterShimmer = [];

// Player state
let player = {
  x: 0, y: 0,
  tileX: 0, tileY: 0,
  speed: 0.15,
  facing: 'down',
  hopOffset: 0,
  isHopping: false
};

// Camera state
let camera = { x: 0, y: 0 };

// Fishing state
let fishCount = 0;
let isFishing = false;
let fishingTimer = 0;
let fishingTarget = { x: 0, y: 0 };
let fishBiting = false;
let caughtFish = null;
let angryFish = null; // Shows red # when too slow to reel in
let confusedFish = null; // Shows blue ? when clicked too early
let waitingForReel = false;
let biteWindow = 0;
let biteTime = 0;
let rodRange = 2; // Starting fishing range

// Merchant state
let merchant = { x: 0, y: 0 };
let showMerchantDialog = false;

// Input state
let keys = {};
let pathQueue = [];
let lastMoveTime = 0;

// Character customization
let character = {
  name: 'Player',
  bodyColor: '#ff7043',
  shape: 'circle',
  accessory: 'hat',
  accessoryColor: '#5d4037',
  eyeColor: '#333333'
};
