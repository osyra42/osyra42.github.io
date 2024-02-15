// Get the select element
var select = document.getElementById("services");

// Append options to the select element
data.forEach(function(service) {
  var option = document.createElement("option");
  option.value = service.title;
  option.textContent = service.title;
  select.appendChild(option);
});




function raw() {
  // Fetch data from the file
  fetch('assets/data.js')
    .then(response => response.json()) // Assuming data.js contains JSON data
    .then(data => {
      // Convert the data object into a string in key-value style
      let rawData = '';
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          rawData += `${key}: ${data[key]}\n`;
        }
      }
      // Set the formatted data into the rawtext textarea
      document.getElementById('rawtext').value = rawData;
    })
    .catch(error => console.error('Error fetching data:', error));
}