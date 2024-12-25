// Constants
const HOLIDAYS = [
  { month: 12, day: 25, name: "Christmas" },
  { month: 7, day: 4, name: "FourthOfJuly" },
  { month: 11, day: 28, name: "Thanksgiving" },
];

const SEASONS = [
  { start: { month: 3, day: 20 }, end: { month: 6, day: 20 }, name: "Spring" },
  { start: { month: 6, day: 21 }, end: { month: 9, day: 21 }, name: "Summer" },
  { start: { month: 9, day: 22 }, end: { month: 12, day: 20 }, name: "Fall" },
  { start: { month: 12, day: 21 }, end: { month: 3, day: 19 }, name: "Winter" },
];

const CLUTTER_COUNT = 20;
const FADE_OUT_DURATION = 3000; // 3 seconds
const ANIMATION_DURATION = { min: 5000, max: 15000 }; // 5-15 seconds
const CLUTTER_SPEED = { min: 1, max: 3 }; // Random speed between 1 and 3
const BOUNCE_FORCE = 0.5; // Force multiplier for bounce
const COLLISION_RADIUS = 50; // Collision detection radius

let successfulLoads = [];
let loadCount = 0;
let clutterElements = [];
let availableImages = [];
let mouseX = 0;
let mouseY = 0;
let mouseSpeedX = 0;
let mouseSpeedY = 0;
let lastMouseX = 0;
let lastMouseY = 0;
let lastMouseTime = Date.now();

// Functions
function getSeason() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Check for holidays
  for (const holiday of HOLIDAYS) {
    if (month === holiday.month && day === holiday.day) {
      return holiday.name;
    }
  }

  // Determine the season based on the month and day
  for (const season of SEASONS) {
    const { start, end, name } = season;
    const isWithinSeason =
      (month > start.month || (month === start.month && day >= start.day)) &&
      (month < end.month || (month === end.month && day <= end.day));

    if (isWithinSeason) {
      return name;
    }
  }

  return "Winter";
}

function createStyle() {
  const style = document.createElement("style");
  style.textContent = `
    .clutter {
      position: fixed;
      width: 30px;
      height: 30px;
      background-size: contain;
      background-repeat: no-repeat;
      opacity: 0.8;
      z-index: 9999;
    }
  `;
  document.head.appendChild(style);
}

function initializeAvailableImages(clutterTheme) {
  availableImages = [];
  for (let i = 0; i < CLUTTER_COUNT; i++) {
    availableImages.push(`${clutterTheme}${i}.png`);
  }
}

function preloadImages(clutterTheme, callback) {
  const promises = availableImages.map((image) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `assets/clutter/${image}`;
      img.onload = () => resolve(image);
      img.onerror = () => {
        console.warn(`Failed to load image: assets/clutter/${image}`);
        resolve(null); // Resolve with null for failed images
      };
    });
  });

  Promise.all(promises).then((results) => {
    // Filter out null values (failed images)
    availableImages = results.filter((image) => image !== null);
    console.log(`Available images: ${availableImages.length}`);
    callback();
  });
}

function createClutter(clutterTheme, y = null) {
  if (loadCount >= CLUTTER_COUNT || availableImages.length === 0) {
    return;
  }

  const clutter = document.createElement("div");
  clutter.className = "clutter";
  clutter.style.left = `${Math.random() * window.innerWidth}px`;
  clutter.style.top = y !== null ? `${y}px` : `${Math.random() * window.innerHeight}px`;

  const randomIndex = Math.floor(Math.random() * availableImages.length);
  const imageUrl = `assets/clutter/${availableImages[randomIndex]}`;

  clutter.style.backgroundImage = `url(${imageUrl})`;
  clutter.style.transform = `rotate(${Math.random() * 360}deg)`;
  document.body.appendChild(clutter);

  // Add velocity properties to the clutter object
  clutter.velocityX = 0;
  clutter.velocityY = CLUTTER_SPEED.min + Math.random() * (CLUTTER_SPEED.max - CLUTTER_SPEED.min);

  clutterElements.push(clutter);

  const duration = ANIMATION_DURATION.min + Math.random() * (ANIMATION_DURATION.max - ANIMATION_DURATION.min);
  const startTime = Date.now();

  function animate() {
    const elapsedTime = Date.now() - startTime;
    const progress = elapsedTime / duration;

    if (progress < 1) {
      // Update position based on velocity
      clutter.style.left = `${clutter.offsetLeft + clutter.velocityX}px`;
      clutter.style.top = `${clutter.offsetTop + clutter.velocityY}px`;

      // Wrap around the screen
      if (clutter.offsetTop > window.innerHeight) {
        clutter.style.top = `0px`;
        clutter.style.left = `${Math.random() * window.innerWidth}px`;
      }

      requestAnimationFrame(animate);
    } else {
      fadeOutClutter(clutter);
    }
  }

  requestAnimationFrame(animate);
}

function fadeOutClutter(clutter) {
  const startOpacity = parseFloat(getComputedStyle(clutter).opacity);
  const startTime = Date.now();

  function fade() {
    const elapsedTime = Date.now() - startTime;
    const progress = elapsedTime / FADE_OUT_DURATION;

    if (progress < 1) {
      clutter.style.opacity = startOpacity * (1 - progress);
      requestAnimationFrame(fade);
    } else {
      clutter.remove();
      createClutter(clutterTheme);
    }
  }

  requestAnimationFrame(fade);
}

function applyBouncePhysics() {
  document.addEventListener("mousemove", (event) => {
    const now = Date.now();
    const timeDelta = now - lastMouseTime;

    if (timeDelta > 0) {
      mouseSpeedX = (event.clientX - lastMouseX) / timeDelta;
      mouseSpeedY = (event.clientY - lastMouseY) / timeDelta;
    }

    mouseX = event.clientX;
    mouseY = event.clientY;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    lastMouseTime = now;
  });

  function checkCollisions() {
    clutterElements.forEach((clutter) => {
      const clutterRect = clutter.getBoundingClientRect();
      const clutterCenterX = clutterRect.left + clutterRect.width / 2;
      const clutterCenterY = clutterRect.top + clutterRect.height / 2;

      const distanceX = mouseX - clutterCenterX;
      const distanceY = mouseY - clutterCenterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < COLLISION_RADIUS) {
        // Collision detected
        const angle = Math.atan2(distanceY, distanceX); // Angle between mouse and clutter
        const bounceAngle = angle + Math.PI; // Opposite direction for bounce

        // Calculate bounce force based on mouse speed
        const forceMagnitude = Math.sqrt(mouseSpeedX * mouseSpeedX + mouseSpeedY * mouseSpeedY) * BOUNCE_FORCE;
        const forceX = Math.cos(bounceAngle) * forceMagnitude;
        const forceY = Math.sin(bounceAngle) * forceMagnitude;

        // Update clutter velocity
        clutter.velocityX = forceX;
        clutter.velocityY = forceY;
      }
    });

    requestAnimationFrame(checkCollisions);
  }

  checkCollisions();
}

// Main Execution
const season = getSeason();
const clutterTheme = season.toLowerCase(); // Directly use the season name as the image file prefix
createStyle();
initializeAvailableImages(clutterTheme);

// Preload images and start the animation only after validation
preloadImages(clutterTheme, () => {
  for (let i = 0; i < CLUTTER_COUNT; i++) {
    createClutter(clutterTheme);
  }

  applyBouncePhysics();
});
