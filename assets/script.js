// script.js
document.addEventListener('DOMContentLoaded', function () {
  const timestamps = document.querySelectorAll('.timestamp');
  
  timestamps.forEach(timestamp => {
    const timestampValue = timestamp.getAttribute('data-timestamp');
    const date = new Date(parseInt(timestampValue) * 1000);
    const formattedDate = date.toLocaleString();
    timestamp.textContent = formattedDate;
  });
});
