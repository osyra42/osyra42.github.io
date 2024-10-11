const leafImages = ["images/leaf1.png", "images/leaf2.png", "images/leaf3.png", "images/leaf4.png"];
const leafCount = 20;
const fadeOutDuration = 3000; // 3 seconds

// Create a style element and add it to the head
const style = document.createElement("style");
style.textContent = `
    .leaf {
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

function createLeaf() {
  const leaf = document.createElement("div");
  leaf.className = "leaf";
  leaf.style.left = `${Math.random() * window.innerWidth}px`;
  leaf.style.top = `${Math.random() * window.innerHeight}px`;
  leaf.style.backgroundImage = `url(${leafImages[Math.floor(Math.random() * leafImages.length)]})`;
  leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
  document.body.appendChild(leaf);

  const duration = 5000 + Math.random() * 10000; // 5-15 seconds
  const startTime = Date.now();
  const speed = Math.random() * 2 + 1; // Random speed between 1 and 3

  function animate() {
    const elapsedTime = Date.now() - startTime;
    const progress = elapsedTime / duration;

    if (progress < 1) {
      const newY = leaf.offsetTop + speed;
      leaf.style.top = `${newY}px`;

      if (newY > window.innerHeight) {
        leaf.style.top = `0px`;
        leaf.style.left = `${Math.random() * window.innerWidth}px`;
      }

      requestAnimationFrame(animate);
    } else {
      fadeOutLeaf(leaf);
    }
  }

  requestAnimationFrame(animate);
}

function fadeOutLeaf(leaf) {
  const startOpacity = parseFloat(getComputedStyle(leaf).opacity);
  const startTime = Date.now();

  function fade() {
    const elapsedTime = Date.now() - startTime;
    const progress = elapsedTime / fadeOutDuration;

    if (progress < 1) {
      leaf.style.opacity = startOpacity * (1 - progress);
      requestAnimationFrame(fade);
    } else {
      leaf.remove();
      createLeaf();
    }
  }

  requestAnimationFrame(fade);
}

for (let i = 0; i < leafCount; i++) {
  createLeaf();
}
