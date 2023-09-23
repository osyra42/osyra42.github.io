// script.js
// JavaScript to handle the popup

const shareButton = document.getElementById("shareButton");
const popup = document.getElementById("popup");
const copyButton = document.getElementById("copyButton");
const textToCopy = "https://osyra42.github.io/";

shareButton.addEventListener("click", () => {
    popup.style.display = "block";
});

function closePopup() {
    popup.style.display = "none";
}

function copyToClipboard() {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    alert("Copied to clipboard: " + textToCopy);
}

// Close the popup when clicking outside of it
window.addEventListener("click", (event) => {
    if (event.target === popup) {
        closePopup();
    }
});



// script.js
const colorSlider = document.getElementById("colorSlider");
const colorOutput = document.getElementById("colorOutput");

colorSlider.addEventListener("input", () => {
    // Get the selected color position
    const colorPosition = colorSlider.value;

    // Set background color based on the position
    const backgroundColors = [
        "#000000", "#111111", "#222222", "#333333",
        "#444444", "#555555", "#666666", "#777777",
        "#888888", "#999999", "#aaaaaa", "#bbbbbb",
        "#cccccc", "#dddddd", "#eeeeee", "#ffffff"
    ];

    document.body.style.backgroundColor = backgroundColors[colorPosition - 1];

    // Set font color based on the background color position
    document.body.style.color = colorPosition > 10 ? "#000000" : "#ffffff";
});
