// Define a function to create HTML elements from JSON data and append them to a container
function createElementsFromJSON() {
  // Get reference to the parent element
  var container = document.querySelector(".container");

  // Loop through each JSON object
  jsonData.forEach(function (item) {
    // Create HTML elements
    var div = document.createElement("div");
    div.classList.add("box");

    var h3 = document.createElement("h3");
    h3.textContent = item.title;

    var img = document.createElement("img");
    img.src = item.image;
    img.alt = "";

    var p = document.createElement("p");
    p.textContent = item.description;

    // Append elements to the parent element
    div.appendChild(h3);
    div.appendChild(img);
    div.appendChild(p);

    container.appendChild(div);
  });
}
// Call the function when the window loads
window.onload = function () {
  createElementsFromJSON();
};

function copyOshimark() {
  var precopy = "🌙🐺";
  var copyText = document.getElementById("oshimark");

  // Copy the text to the clipboard
  navigator.clipboard
    .writeText(precopy.trim())
    .then(() => {
      // Check if the input value is still "🌙🐺"
      if (copyText.value.trim() === precopy) {
        alert("Copied the text: " + precopy);
      } else {
        alert("Congratulations, you found the Easter Egg! 🎉🥚");
      }
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });

  // Remove the blur operation on the input element
}
