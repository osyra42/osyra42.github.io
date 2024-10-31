// Handle pageshow event
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    console.log("Page was restored from bfcache");
    // Restore any state from sessionStorage
    const savedState = sessionStorage.getItem("myState");
    if (savedState) {
      myState = JSON.parse(savedState);
    }
    // Reinitialize any necessary components or data
    initializePage();
  }
});

// Handle pagehide event
window.addEventListener("pagehide", function (event) {
  if (event.persisted) {
    console.log("Page is being stored in bfcache");
    // Save any state to sessionStorage
    sessionStorage.setItem("myState", JSON.stringify(myState));
    // Clean up any resources or event listeners
    cleanupPage();
  }
});

// Example functions to initialize and cleanup the page
function initializePage() {
  // Reinitialize any components or data
}

function cleanupPage() {
  // Clean up any resources or event listeners
}
