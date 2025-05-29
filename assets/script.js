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
    sectionElement.appendChild(titleElement);

    // Create checklist container
    const checklistElement = document.createElement("div");
    checklistElement.className = "checklist";
    checklistElement.id = section.id;
    sectionElement.appendChild(checklistElement);

    // Add section to main container
    container.appendChild(sectionElement);

    // Create checklist items
    section.items.forEach((item) => {
      const itemId = `${section.id}-${item.replace(/\s+/g, "-").toLowerCase()}`;

      const itemElement = document.createElement("div");
      itemElement.className = "checklist-item";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = itemId;

      checkbox.addEventListener("change", function () {
        updateProgress();
        if (this.checked) {
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
