
$(document).ready(function() {
  const shareButton = $("#shareButton");
  const popup = $("#popup");
  const copyButton = $("#copyButton");
  const textToCopy = "https://osyra42.github.io/";

  shareButton.on("click", function() {
    popup.css("display", "block");
  });

  function closePopup() {
    popup.css("display", "none");
  }

  function copyToClipboard() {
    const textArea = $("<textarea>");
    textArea.val(textToCopy);
    $("body").append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    alert("Copied to clipboard: " + textToCopy);
  }

  // Close the popup when clicking outside of it
  $(window).on("click", function(event) {
    if (event.target === popup[0]) {
      closePopup();
    }
  });

  const colorSlider = $("#colorSlider");
  const colorOutput = $("#colorOutput");

  colorSlider.on("input", function() {
    // Get the selected color position
    const colorPosition = colorSlider.val();

    // Set background color based on the position
    const backgroundColors = [
      "#000000", "#111111", "#222222", "#333333",
      "#444444", "#555555", "#666666", "#777777",
      "#888888", "#999999", "#aaaaaa", "#bbbbbb",
      "#cccccc", "#dddddd", "#eeeeee", "#ffffff"
    ];

    $("body").css("background-color", backgroundColors[colorPosition - 1]);

    // Set font color based on the background color position
    $("body").css("color", colorPosition > 10 ? "#000000" : "#ffffff");
  });
});
