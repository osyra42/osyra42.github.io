// Define an array of filenames
var fileArray = [
  "wm-blue.html"
  // Add more filenames as needed
];

var fileList = $('#fileList');
        var contentDiv = $('#content');

        // Loop through the list of files and create buttons
        $.each(fileArray, function(index, file) {
            // Extract the file name without extension
            var fileNameWithoutExtension = file.split('.').slice(0, -1).join('.');

            // Create a button element for each file
            var fileButton = $('<button>', {
                text: fileNameWithoutExtension, // Use the name without extension
            });

            // Attach a click event handler to the button
            fileButton.click(function() {
                // Make an AJAX request to load the file content
                $.ajax({
                    url: 'mods/' + file, // Set the correct path to the file
                    dataType: 'text', // Assuming it's plain text, adjust if needed
                    success: function(fileContent) {
                        // Display the file content in the contentDiv
                        contentDiv.text(fileContent);
                    },
                    error: function() {
                        // Handle errors, e.g., file not found
                        contentDiv.text('Error: File not found');
                    }
                });
            });

            // Append the button to the file list
            fileList.append(fileButton);
        });