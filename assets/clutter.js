function getSeasonSymbol(season) {
  switch (season) {
    case "Spring":
      return "flower"; // Flower
    case "Summer":
      return "grass"; // Grass
    case "Fall":
      return "leaf"; // Leaf
    case "Winter":
      return "snow"; // Snow
    case "Christmas":
      return "snowflake"; // Snowflake for Christmas
    case "4thOfJuly":
      return "fireworks"; // Fireworks for 4th of July
    case "Thanksgiving":
      return "turkey"; // Turkey for Thanksgiving
    default:
      return "Unknown";
  }
}

function getSeason() {
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get 1-12
  const day = now.getDate();

  // Check for holidays
  if (month === 12 && day === 25) {
    return "Christmas";
  } else if (month === 7 && day === 4) {
    return "4thOfJuly";
  } else if (month === 11 && day === 28) {
    return "Thanksgiving";
  }

  // Determine the season based on the month and day
  if ((month === 3 && day >= 20) || (month > 3 && month < 6) || (month === 6 && day <= 20)) {
    return "Spring";
  } else if ((month === 6 && day >= 21) || (month > 6 && month < 9) || (month === 9 && day <= 21)) {
    return "Summer";
  } else if ((month === 9 && day >= 22) || (month > 9 && month < 12) || (month === 12 && day <= 20)) {
    return "Fall";
  } else {
    return "Winter";
  }
}

// Get the current season or holiday
var season = getSeason();
// Allow manual override for testing purposes
// season = "Winter";

let clutterTheme = getSeasonSymbol(season); // Default theme

// Define a mapping of themes to image paths
const clutterThemes = {
  flower: [
    "assets/clutter/flower1.png",
    "assets/clutter/flower2.png",
    "assets/clutter/flower3.png",
    "assets/clutter/flower4.png",
  ],
  grass: [
    "assets/clutter/grass1.png",
    "assets/clutter/grass2.png",
    "assets/clutter/grass3.png",
    "assets/clutter/grass4.png",
  ],
  leaf: [
    "assets/clutter/leaf1.png",
    "assets/clutter/leaf2.png",
    "assets/clutter/leaf3.png",
    "assets/clutter/leaf4.png",
  ],
  snow: [
    "assets/clutter/snow1.png",
    "assets/clutter/snow2.png",
    "assets/clutter/snow3.png",
    "assets/clutter/snow4.png",
    "assets/clutter/snow5.png",
    "assets/clutter/snow6.png",
    "assets/clutter/snow7.png",
    "assets/clutter/snow8.png",
    "assets/clutter/snow9.png",
  ],
  snowflake: [
    "assets/clutter/snowflake1.png",
    "assets/clutter/snowflake2.png",
    "assets/clutter/snowflake3.png",
    "assets/clutter/snowflake4.png",
  ],
  fireworks: [
    "assets/clutter/fireworks1.png",
    "assets/clutter/fireworks2.png",
    "assets/clutter/fireworks3.png",
    "assets/clutter/fireworks4.png",
  ],
  turkey: [
    "assets/clutter/turkey1.png",
    "assets/clutter/turkey2.png",
    "assets/clutter/turkey3.png",
    "assets/clutter/turkey4.png",
    "assets/clutter/turkey5.png",
    "assets/clutter/turkey6.png",
    "assets/clutter/turkey7.png",
  ],
};

// Get the images based on the current theme
const clutterImages = clutterThemes[clutterTheme];

const clutterCount = 20;
const fadeOutDuration = 3000; // 3 seconds

// Create a style element and add it to the head
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

function createClutter() {
  const clutter = document.createElement("div");
  clutter.className = "clutter";
  clutter.style.left = `${Math.random() * window.innerWidth}px`;
  clutter.style.top = `${Math.random() * window.innerHeight}px`;
  clutter.style.backgroundImage = `url(${clutterImages[Math.floor(Math.random() * clutterImages.length)]})`;
  clutter.style.transform = `rotate(${Math.random() * 360}deg)`;
  document.body.appendChild(clutter);

  const duration = 5000 + Math.random() * 10000; // 5-15 seconds
  const startTime = Date.now();
  const speed = Math.random() * 2 + 1; // Random speed between 1 and 3

  function animate() {
    const elapsedTime = Date.now() - startTime;
    const progress = elapsedTime / duration;

    if (progress < 1) {
      const newY = clutter.offsetTop + speed;
      clutter.style.top = `${newY}px`;

      if (newY > window.innerHeight) {
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
    const progress = elapsedTime / fadeOutDuration;

    if (progress < 1) {
      clutter.style.opacity = startOpacity * (1 - progress);
      requestAnimationFrame(fade);
    } else {
      clutter.remove();
      createClutter();
    }
  }

  requestAnimationFrame(fade);
}

for (let i = 0; i < clutterCount; i++) {
  createClutter();
}
