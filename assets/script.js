document.getElementById("orderForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent default form submission

  // Get form data
  var formData = new FormData(this);

  // Format form data as text
  var textContent = "";
  formData.forEach(function(value, key) {
    textContent += key + ": " + value + "\n";
  });

  // Create a Blob containing the text
  var blob = new Blob([textContent], { type: "text/plain" });

  // Create a download link
  var link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "order.txt";

  // Append link to the document and trigger click event
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
});