document.addEventListener("DOMContentLoaded", function () {
  // Get the Markdown content
  const mdContent = document.getElementById("checklist-md").textContent.trim();

  // Parse the Markdown into sections and items
  const appConfig = parseMarkdown(mdContent);

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

    // Create section title with arrow
    const titleElement = document.createElement(section.sections ? "h2" : "h3");
    titleElement.textContent = section.title;
    titleElement.classList.add("collapsible-header");
    titleElement.style.cursor = "pointer";
    titleElement.style.userSelect = "none";

    // Create arrow element
    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.innerHTML = "▶";
    titleElement.appendChild(arrow);

    // Create content container
    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("collapsible-content", "collapsed");

    if (section.sections && section.sections.length > 0) {
      // This is a main section with sub-sections
      sectionElement.className = "main-section";

      // Create all sub-sections
      section.sections.forEach((subSection) => {
        const subSectionElement = createSubSection(subSection);
        contentWrapper.appendChild(subSectionElement);
      });
    } else if (section.items && section.items.length > 0) {
      // This is a standalone section with items
      const checklistElement = document.createElement("div");
      checklistElement.className = "checklist";
      checklistElement.id = section.id;

      // Create checklist items
      section.items.forEach((item) => {
        const itemElement = createChecklistItem(item, section.id);
        checklistElement.appendChild(itemElement);
      });

      contentWrapper.appendChild(checklistElement);
    }

    sectionElement.appendChild(titleElement);
    sectionElement.appendChild(contentWrapper);
    container.appendChild(sectionElement);

    // Add click event listener to the header
    titleElement.addEventListener("click", function () {
      contentWrapper.classList.toggle("collapsed");
      arrow.textContent = contentWrapper.classList.contains("collapsed") ? "▶" : "▼";
    });
  });

  // Helper function to create sub-sections
  function createSubSection(subSection) {
    const subSectionElement = document.createElement("div");
    subSectionElement.className = "checklist-section";

    // Create sub-section title with arrow
    const titleElement = document.createElement("h3");
    titleElement.textContent = subSection.title;
    titleElement.classList.add("collapsible-header");
    titleElement.style.cursor = "pointer";
    titleElement.style.userSelect = "none";

    // Create arrow element
    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.innerHTML = "▶";
    titleElement.appendChild(arrow);

    // Create content container
    const contentWrapper = document.createElement("div");
    contentWrapper.classList.add("collapsible-content", "collapsed");

    // Create checklist container
    const checklistElement = document.createElement("div");
    checklistElement.className = "checklist";
    checklistElement.id = subSection.id;

    // Create checklist items
    subSection.items.forEach((item) => {
      const itemElement = createChecklistItem(item, subSection.id);
      checklistElement.appendChild(itemElement);
    });

    contentWrapper.appendChild(checklistElement);
    subSectionElement.appendChild(titleElement);
    subSectionElement.appendChild(contentWrapper);

    // Add click event listener to the sub-section header
    titleElement.addEventListener("click", function (e) {
      e.stopPropagation();
      contentWrapper.classList.toggle("collapsed");
      arrow.textContent = contentWrapper.classList.contains("collapsed") ? "▶" : "▼";
    });

    return subSectionElement;
  }

  // Helper function to create checklist items
  function createChecklistItem(item, sectionId) {
    const itemId = `${sectionId}-${item.replace(/\s+/g, "-").toLowerCase()}`;

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

    return itemElement;
  }

  // Progress bar functionality
  function updateProgress() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const totalItems = checkboxes.length;
    const checkedItems = document.querySelectorAll('input[type="checkbox"]:checked').length;

    const progressPercentage = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

    document.getElementById("progressBar").style.width = `${progressPercentage}%`;

    document.getElementById("progressText").textContent = `${checkedItems} of ${totalItems} completed (${Math.round(
      progressPercentage
    )}%)`;
  }

  // Initialize progress bar
  updateProgress();

  // Markdown parser function (unchanged)
  function parseMarkdown(md) {
    const lines = md
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    const config = {
      title: lines[0].replace(/^#\s*/, ""),
      sections: [],
    };

    let currentMainSection = null;
    let currentSubSection = null;

    for (const line of lines.slice(1)) {
      if (line.startsWith("## ")) {
        // Main section (level 2)
        if (currentSubSection) {
          if (currentMainSection) {
            currentMainSection.sections.push(currentSubSection);
          } else {
            config.sections.push(currentSubSection);
          }
          currentSubSection = null;
        }
        currentMainSection = {
          title: line.replace(/^##\s*/, ""),
          id: line
            .replace(/^##\s*/, "")
            .replace(/\s+/g, "-")
            .toLowerCase(),
          sections: [],
          items: [],
        };
        config.sections.push(currentMainSection);
      } else if (line.startsWith("### ")) {
        // Sub-section (level 3)
        if (currentSubSection) {
          if (currentMainSection) {
            currentMainSection.sections.push(currentSubSection);
          } else {
            config.sections.push(currentSubSection);
          }
        }
        currentSubSection = {
          title: line.replace(/^###\s*/, ""),
          id: line
            .replace(/^###\s*/, "")
            .replace(/\s+/g, "-")
            .toLowerCase(),
          items: [],
        };
      } else if (line.startsWith("- ")) {
        // Item
        if (currentSubSection) {
          currentSubSection.items.push(line.replace(/^-\s*/, ""));
        } else if (currentMainSection) {
          currentMainSection.items.push(line.replace(/^-\s*/, ""));
        }
      }
    }

    // Add any remaining sections
    if (currentSubSection) {
      if (currentMainSection) {
        currentMainSection.sections.push(currentSubSection);
      } else {
        config.sections.push(currentSubSection);
      }
    }

    return config;
  }
});
