(function () {
  // CSS styles
  const styles = `
    body {
      font-family: ""Courier New", Courier, monospace;"
    }

    pre {
      white-space: pre-wrap;
      font-family: "Times New Roman", Times, serif;
      margin: 30px;
      font-size: 16px;
    }

    pre p {
      text-indent: 20px;
      padding: 4px;
    }

    pre span {
      font-family: "Brush Script MT", cursive;
      font-size: 24px;
    }

    /* Button styles */
    pre button {
      background-color: #343434;
      color: #ff2200;
      font-family: "Courier New", Courier, monospace;
      font-size: 16px;
    }

    a:link {
      color: #0080ff;
    }
    a:visited {
      color: #ff8000;
    }

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
      border: 2px solid;
      border-radius: 15px;
    }

    body {
      margin-top: 50px;
      transition: background-color 0.5s, color 0.5s;
    }

    #color-slider {
      -webkit-appearance: none;
      appearance: none;
      height: 8px;
      border-radius: 5px;
      outline: none;
      transition: background-color 0.5s;
      width: 300px;
    }

    #color-slider::-webkit-slider-thumb,
    #color-slider::-moz-range-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
    }
  `;

  // Function to initialize the library
  function initializeLibrary() {
    const styleElement = document.createElement("style");
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    const wordThreshold = 800; // Change this to 800 for the new requirement
    const pre = document.querySelector("pre");

    const sliderContainer = document.createElement("div");
    sliderContainer.id = "color-slider-container";
    sliderContainer.innerHTML = `
      <span style="margin-right:10px;font-size:24px;">&#9790;</span>
      <input type="range" id="color-slider" min="0" max="15" value="0" style="width:300px;">
      <span style="margin-left:10px;font-size:24px;">&#9728;</span>
    `;
    document.body.insertBefore(sliderContainer, document.body.firstChild);

    const updateBackgroundColor = (value) => {
      const hexValue = "0123456789abcdef"[value];
      const color = `#${hexValue.repeat(6)}`;
      const textColor = value < 8 ? "#ffffff" : "#000000"; // Adjusted for 0-7 white, 8-f black

      document.body.style.backgroundColor = color;
      document.body.style.color = textColor;
      sliderContainer.style.backgroundColor = color;
      sliderContainer.style.borderColor = textColor;
      document.getElementById("color-slider").style.backgroundColor = textColor;

      // Update the slider thumb color
      document.head.appendChild(
        Object.assign(document.createElement("style"), {
          textContent: `#color-slider::-webkit-slider-thumb,#color-slider::-moz-range-thumb{background:${textColor};}`,
        })
      );

      // Calculate the opposite color for the highlight
      const oppositeColor = invertColor(textColor);
      document.head.appendChild(
        Object.assign(document.createElement("style"), {
          textContent: `.highlight { background-color: ${textColor}80;
          color: ${oppositeColor}}`,
        })
      );
    };

    // Function to invert the color
    function invertColor(hex) {
      if (hex == "#000000") {
        return "#ffffff";
      } else {
        return "#000000";
      }
    }

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

    // Function to highlight sentence under mouse
    document.addEventListener("DOMContentLoaded", () => {
      const pre = document.querySelector("pre");
      const lines = pre.textContent.split("\n");

      pre.innerHTML = ""; // Clear the pre element

      lines.forEach((line) => {
        const p = document.createElement("p");
        p.textContent = line.trim();
        p.setAttribute("onmouseover", 'this.classList.add("highlight")');
        p.setAttribute("onmouseout", 'this.classList.remove("highlight")');
        pre.appendChild(p);
      });

      // Insert bookmarks after paragraphs have been created
      const paragraphs = pre.querySelectorAll("p");
      let wordCount = 0;
      let bookmarkId = 1;

      paragraphs.forEach((paragraph) => {
        const words = paragraph.textContent.split(/(\s+)/);
        words.forEach((word) => {
          if (!word.match(/^\s+$/)) wordCount++;
        });

        if (wordCount >= wordThreshold) {
          const bookmarkButton = document.createElement("a");
          bookmarkButton.href = `#bookmark-${bookmarkId}`;
          bookmarkButton.innerHTML = `<button id="bookmark-${bookmarkId}" class="bookmark">&#128278; Bookmark </button>`;
          paragraph.insertAdjacentElement("afterend", bookmarkButton);
          wordCount = 0;
          bookmarkId++;
        }
      });

      // Add event listeners to the bookmark buttons
      document.querySelectorAll("button.bookmark").forEach((button) => {
        button.addEventListener("click", async function () {
          await new Promise((resolve) => setTimeout(resolve, 100));
          const newUrl = `${window.location.href.split("#")[0]}#${this.id}`;
          window.history.pushState(null, "", newUrl);
          await navigator.clipboard.writeText(newUrl);
          alert("URL copied to clipboard!");
        });
      });
    });
  }

  // Expose the initializeLibrary function
  window.initializeLibrary = initializeLibrary;
})();

initializeLibrary();

console.log("bookie v2024.10.11 loaded");
