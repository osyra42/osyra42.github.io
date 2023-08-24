// Get all the span elements with class "timestamp"
const timestampSpans = document.querySelectorAll(".timestamp");

// Function to convert timestamp text to readable date
function convertTimestampToReadableDate(timestampText) {
  const timestamp = parseInt(timestampText); // Parse the text as an integer
  const date = new Date(timestamp);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthIndex = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Determine whether it's AM or PM
  const amOrPm = hours >= 12 ? "PM" : "AM";
  
  // Convert to 12-hour format
  hours = hours % 12 || 12;
  
  // Format the hours and minutes with leading zeros if needed
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  
  return formattedDate = `${monthNames[monthIndex]} ${day}, ${year} @ ${formattedHours}:${formattedMinutes} ${amOrPm}`;
}

// Iterate through each span and update its content with the readable date
timestampSpans.forEach(span => {
  const timestampText = span.textContent;
  const readableDate = convertTimestampToReadableDate(timestampText);
  span.textContent = readableDate; // Update the content of the span
});