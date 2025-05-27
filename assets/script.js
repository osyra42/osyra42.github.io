document.addEventListener("DOMContentLoaded", function () {
  // Checklist data
  const checklistData = {
    sweepFront: ["GM Side", "Grocery Side", "Under Produce", "Between Regisers"],
    vacuum: ["GM Ice", "Grocery Ice", "Produce Near", "Produce Far"],
    trash: [
      "GM Side",
      "Female Restroom",
      "Male Restroom",
      "Customer Service",
      "Bank",
      "Grocery Side",
      "Dressing Room",
      "Back Restroom",
    ],
    bathroom: ["paper towel", "toilet paper", "feminine hygiene", "Mirror", "Chrome", "Sink"],
  };

  // Create checklists
  for (const [sectionId, items] of Object.entries(checklistData)) {
    const sectionElement = document.getElementById(sectionId);

    items.forEach((item) => {
      const itemId = `${sectionId}-${item.replace(/\s+/g, "-").toLowerCase()}`;

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

      sectionElement.appendChild(itemElement);
    });
  }

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
