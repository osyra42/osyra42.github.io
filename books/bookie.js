document.addEventListener("DOMContentLoaded", () => {
  const wordThreshold = 1000; // Define word threshold as a variable for easy changes
  const pre = document.querySelector("pre");
  if (pre) {
    const text = pre.innerHTML; // Get the inner HTML to preserve newlines
    const words = text.split(/(\s+)/); // Split text including whitespace
    let wordCount = 0;
    let sentenceEndIndex = 0;
    let insertIndex = 0;
    let bookmarkId = 1;
    let modifiedContent = "";
    let lastInsertIndex = 0;

    for (let i = 0; i < words.length; i++) {
      if (!words[i].match(/^\s+$/)) {
        wordCount += 1;
      }

      if (words[i].includes(".")) {
        sentenceEndIndex = i;
      }

      if (wordCount >= wordThreshold && sentenceEndIndex > insertIndex) {
        insertIndex = sentenceEndIndex + 1;
        wordCount = 0;

        // Construct the bookmark button with the anchor
        const bookmarkButton = `<br><a href="#bookmark-${bookmarkId}"><button id="bookmark-${bookmarkId}" class="bookmark">&#128278; Bookmark </button></a><br>`;
        bookmarkId++;

        // Insert button at the end of the sentence
        const partBefore = words.slice(lastInsertIndex, insertIndex + 1).join("");
        modifiedContent += partBefore + bookmarkButton;
        lastInsertIndex = insertIndex + 1;
      }
    }

    // Add any remaining words after the last bookmark button
    modifiedContent += words.slice(lastInsertIndex).join("");

    // Update pre content
    pre.innerHTML = modifiedContent;
  }

  document.querySelectorAll("button.bookmark").forEach((button) => {
    button.addEventListener("click", async function () {
      // Add a 0.1 second delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        // Append bookmark ID to the URL and copy to clipboard
        const bookmarkId = this.id.split("-")[1];
        const newUrl = `${window.location.href.split("#")[0]}#bookmark-${bookmarkId}`;

        // Update the browser's URL without reloading the page
        window.history.pushState(null, "", newUrl);

        await navigator.clipboard.writeText(newUrl);

        // Optional: Notify the user that the URL has been copied
        alert("URL copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Create the slider container
  const sliderContainer = document.createElement("div");
  sliderContainer.id = "color-slider-container";

  // Create the moon icon
  const moonIcon = document.createElement("span");
  moonIcon.innerHTML = "&#9790;"; // Unicode for moon icon
  moonIcon.style.marginRight = "10px";
  moonIcon.style.fontSize = "24px"; // Adjust the size as needed

  // Create the sun icon
  const sunIcon = document.createElement("span");
  sunIcon.innerHTML = "&#9728;"; // Unicode for sun icon
  sunIcon.style.marginLeft = "10px";
  sunIcon.style.fontSize = "24px"; // Adjust the size as needed

  // Create the slider input
  const slider = document.createElement("input");
  slider.type = "range";
  slider.id = "color-slider";
  slider.min = "0";
  slider.max = "15";
  slider.value = "0";
  slider.style.width = "300px";

  // Append the moon icon, slider, and sun icon to the container
  sliderContainer.appendChild(moonIcon);
  sliderContainer.appendChild(slider);
  sliderContainer.appendChild(sunIcon);

  // Append the container to the body
  document.body.insertBefore(sliderContainer, document.body.firstChild);

  // Apply styles to the slider container
  const style = document.createElement("style");
  style.innerHTML = `
    #color-slider-container {
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px;
      z-index: 1000;
      display: flex;
      align-items: center;
      transition: background-color 0.5s, border-color 0.5s;
      border: 2px solid; /* Border width and default color */
      border-radius: 15px; /* Rounded corners */
    }
    body {
      margin-top: 50px; /* To avoid content overlapping the slider */
      transition: background-color 0.5s, color 0.5s;
    }
    #color-slider {
      -webkit-appearance: none;
      appearance: none;
      height: 8px;
      border-radius: 5px;
      outline: none;
      transition: background-color 0.5s;
    }
    #color-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
    }
    #color-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // Hexadecimal characters
  const hexChars = "0123456789abcdef";

  function updateBackgroundColor(value) {
    const hexValue = hexChars[value];
    const color = `#${hexValue.repeat(6)}`;
    const textColor = value < 8 ? "#ffffff" : "#000000";
    document.body.style.backgroundColor = color;
    document.body.style.color = textColor;
    sliderContainer.style.backgroundColor = color; // Update container background
    sliderContainer.style.borderColor = textColor; // Update container border color

    // Update the slider track and thumb colors
    slider.style.backgroundColor = textColor;
    slider.style.setProperty("--slider-thumb-color", textColor);

    // Update thumb color
    const thumbStyles = `
      #color-slider::-webkit-slider-thumb {
        background: ${textColor};
      }
      #color-slider::-moz-range-thumb {
        background: ${textColor};
      }
    `;
    const thumbStyleSheet = document.createElement("style");
    thumbStyleSheet.innerHTML = thumbStyles;
    document.head.appendChild(thumbStyleSheet);
  }

  // Add event listener for the slider
  slider.addEventListener("input", function () {
    const value = parseInt(slider.value, 10);
    updateBackgroundColor(value);
  });

  // Initialize the background color based on the slider's default value
  updateBackgroundColor(slider.value);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});
