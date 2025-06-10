document.addEventListener("DOMContentLoaded", function () {
  // Get container element
  const container = document.getElementById("checklistContainer");

  // Create main title
  const titleElement = document.createElement("h1");
  titleElement.textContent = appConfig.title;
  container.appendChild(titleElement);

  // Create all sections
  appConfig.sections.forEach((section) => {
    // Create section container
    const sectionElement = document.createElement("div");
    sectionElement.className = "checklist-section";

    // Create section title
    const titleElement = document.createElement("h2");
    titleElement.textContent = section.title;
    titleElement.classList.add('collapsible-header'); // Add class for styling and targeting
    titleElement.style.cursor = 'pointer'; // Indicate clickable
    titleElement.style.userSelect = 'none'; // Prevent text selection on click

    // Create checklist content container
    const checklistContent = document.createElement("div");
    checklistContent.classList.add('collapsible-content'); // Add class for styling and toggling

    // Create checklist container
    const checklistElement = document.createElement("div");
    checklistElement.className = "checklist";
    checklistElement.id = section.id;
    checklistContent.appendChild(checklistElement); // Append checklist to content container

    sectionElement.appendChild(titleElement); // Append title to section
    sectionElement.appendChild(checklistContent); // Append content container to section

    // Add section to main container
    container.appendChild(sectionElement);

    // Add click event listener to the header
    titleElement.addEventListener('click', function() {
      checklistContent.classList.toggle('collapsed');
      // Optional: Update indicator text (can be replaced with CSS arrow)
      // if (checklistContent.classList.contains('collapsed')) {
      //   titleElement.textContent = section.title + ' [+]';
      // } else {
      //   titleElement.textContent = section.title + ' [-]';
      // }
    });


    // Create checklist items
    section.items.forEach((item) => {
      const itemId = `${section.id}-${item.replace(/\s+/g, "-").toLowerCase()}`;

      const itemElement = document.createElement("div");
      itemElement.className = "checklist-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = itemId;

      itemElement.addEventListener("click", function () {
        checkbox.checked = !checkbox.checked;
        updateProgress();
        if (checkbox.checked) {
          itemElement.classList.add("completed");
        } else {
          itemElement.classList.remove("completed");
        }
      });

      const label = document.createElement("label");
      label.htmlFor = itemId;
      label.textContent = item;

      itemElement.appendChild(checkbox);
      itemElement.appendChild(label);

      checklistElement.appendChild(itemElement);
    });
  });

  // Progress bar functionality
  function updateProgress() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const totalItems = checkboxes.length;
    const checkedItems = document.querySelectorAll('input[type="checkbox"]:checked').length;

    const progressPercentage = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

    document.getElementById("progressBar").style.width = `${progressPercentage}%`;

    // Optional: Update text display (uncomment if you want to show numbers)
    document.getElementById("progressText").textContent = `${checkedItems} of ${totalItems} completed (${Math.round(
      progressPercentage
    )}%)`;
  }

  // Initialize progress bar
  updateProgress();
});