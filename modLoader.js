var dirArray = [
  "wm-blue",
  "counter",
  "b-room",
  // Add more directory names as needed
];

var fileList = $('#fileList');
var contentDiv = $('#content');

// Loop through the list of directories and create buttons
$.each(dirArray, function(index, dir) {
    // Create a button element for each directory
    var dirButton = $('<button>', {
        text: dir,
    });

    // Attach a click event handler to the button
    dirButton.click(function() {
        // Make an AJAX request to load the 'index.html' content from the directory
        $.ajax({
            url: 'mods/' + dir + '/index.html', // Set the correct path to the 'index.html' file
            dataType: 'text', // Assuming it's plain text, adjust if needed
            success: function(fileContent) {
                // Display the file content in the contentDiv
                contentDiv.html(fileContent);
            },
            error: function() {
                // Handle errors, e.g., file not found
                contentDiv.text('Error: File not found');
            }
        });
    });

    // Append the button to the file list
    fileList.append(dirButton);
});
