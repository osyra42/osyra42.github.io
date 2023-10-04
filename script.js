$(document).ready(function () {
  const archiveButton = $('#archiveBtn');
  const archiveDiv = $('#archiveDiv');
  const archiveLinks = $('#archiveLinks');
  const contentDiv = $('#content');
  const fileTitle = $('#fileTitle');

  let isArchiveVisible = false;
  let currentFileName = ''; // Store the currently loaded file name

  archiveButton.on('click', function () {
    // Toggle visibility of archiveDiv
    isArchiveVisible = !isArchiveVisible;
    archiveDiv.css('display', isArchiveVisible ? 'block' : 'none');
    archiveButton.text(isArchiveVisible ? 'Hide Archive' : 'View Archives');
  });

  const folderPath = 'articles/';
  const fileNames = [
    '23_10_04.txt',
    '23_10_03.txt',
    // Add more file names as needed
  ];

  // Sort fileNames in descending order
  fileNames.sort(function (a, b) {
    return b.localeCompare(a);
  });

  // Function to load file content using AJAX
  function loadFile(fileName) {
    $.ajax({
      url: folderPath + fileName,
      success: function (fileContent) {
        const lines = fileContent.split('\n');

        if (lines.length > 0) {
          const firstLine = lines[0];
          const restOfContent = lines.slice(1).join('<br>'); // Use <br> to separate lines

          // Create an <h3> element for the first line
          const h3Element = $('<h3>' + firstLine + '</h3>');

          fileTitle.html(h3Element);
          contentDiv.html(restOfContent);
        }
      }
    });
  }

  // Load the first file initially
  loadFile(fileNames[0]);

  // Create links for other files, including the currently loaded file
  fileNames.forEach(function (fileName, index) {
    const listItem = $('<li></li>');
    const link = $('<a href="#">' + fileName.split('.')[0] + '</a>');

    link.on('click', function () {
      loadFile(fileName);
    });

    listItem.append(link);
    archiveLinks.append(listItem);

    // If it's the currently loaded file, add a marker
    if (fileName === currentFileName) {
      link.addClass('current-file'); // You can define a CSS class for this
    }
  });
});
