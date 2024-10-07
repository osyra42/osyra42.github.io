document.addEventListener("DOMContentLoaded", () => {
  const wordThreshold = 1000;
  const pre = document.querySelector("pre");
  if (pre) {
    const words = pre.innerHTML.split(/(\s+)/);
    let wordCount = 0;
    let sentenceEndIndex = 0;
    let bookmarkId = 1;
    let modifiedContent = "";
    let lastInsertIndex = 0;

    for (let i = 0; i < words.length; i++) {
      if (!words[i].match(/^\s+$/)) wordCount++;
      if (words[i].includes(".")) sentenceEndIndex = i;

      if (wordCount >= wordThreshold && sentenceEndIndex > lastInsertIndex) {
        const insertIndex = sentenceEndIndex + 1;
        const bookmarkButton = `<br><a href="#bookmark-${bookmarkId}"><button id="bookmark-${bookmarkId}" class="bookmark">&#128278; Bookmark </button></a><br>`;
        modifiedContent += words.slice(lastInsertIndex, insertIndex).join("") + bookmarkButton;
        lastInsertIndex = insertIndex;
        wordCount = 0;
        bookmarkId++;
      }
    }

    modifiedContent += words.slice(lastInsertIndex).join("");
    pre.innerHTML = modifiedContent;
  }

  document.querySelectorAll("button.bookmark").forEach((button) => {
    button.addEventListener("click", async function () {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const newUrl = `${window.location.href.split("#")[0]}#${this.id}`;
      window.history.pushState(null, "", newUrl);
      await navigator.clipboard.writeText(newUrl);
      alert("URL copied to clipboard!");
    });
  });

  const sliderContainer = document.createElement("div");
  sliderContainer.id = "color-slider-container";
  sliderContainer.innerHTML = `
    <span style="margin-right:10px;font-size:24px;">&#9790;</span>
    <input type="range" id="color-slider" min="0" max="15" value="0" style="width:300px;">
    <span style="margin-left:10px;font-size:24px;">&#9728;</span>
  `;
  document.body.insertBefore(sliderContainer, document.body.firstChild);

  const style = document.createElement("style");
  style.textContent = `
    #color-slider-container{position:fixed;top:0;left:50%;transform:translateX(-50%);padding:10px;z-index:1000;display:flex;align-items:center;transition:background-color 0.5s,border-color 0.5s;border:2px solid;border-radius:15px;}
    body{margin-top:50px;transition:background-color 0.5s,color 0.5s;}
    #color-slider{-webkit-appearance:none;appearance:none;height:8px;border-radius:5px;outline:none;transition:background-color 0.5s;}
    #color-slider::-webkit-slider-thumb,#color-slider::-moz-range-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;cursor:pointer;}
  `;
  document.head.appendChild(style);

  const updateBackgroundColor = (value) => {
    const hexValue = "0123456789abcdef"[value];
    const color = `#${hexValue.repeat(6)}`;
    const textColor = value < 8 ? "#ffffff" : "#000000";
    document.body.style.backgroundColor = color;
    document.body.style.color = textColor;
    sliderContainer.style.backgroundColor = color;
    sliderContainer.style.borderColor = textColor;
    document.getElementById("color-slider").style.backgroundColor = textColor;
    document.head.appendChild(
      Object.assign(document.createElement("style"), {
        textContent: `#color-slider::-webkit-slider-thumb,#color-slider::-moz-range-thumb{background:${textColor};}`,
      })
    );
  };

  document
    .getElementById("color-slider")
    .addEventListener("input", (e) => updateBackgroundColor(parseInt(e.target.value, 10)));
  updateBackgroundColor(0);

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute("href")).scrollIntoView({ behavior: "smooth" });
    });
  });
});
