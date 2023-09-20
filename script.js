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
