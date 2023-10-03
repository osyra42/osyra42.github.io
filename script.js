// Get references to the button and the "tools" div
    const toolBtn = document.getElementById('toolBtn');
    const toolsDiv = document.getElementById('toolsDiv');

    // Initialize a variable to track the state
    let isToolsVisible = false;

    // Add a click event listener to the button
    toolBtn.addEventListener('click', function () {
      if (isToolsVisible) {
        // If tools are visible, hide them and change button text
        toolsDiv.style.display = 'none';
        toolBtn.textContent = 'Show Tools';
      } else {
        // If tools are hidden, show them and change button text
        toolsDiv.style.display = 'block';
        toolBtn.textContent = 'Hide Tools';
      }

      // Toggle the state
      isToolsVisible = !isToolsVisible;
    });