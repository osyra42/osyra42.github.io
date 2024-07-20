document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", async function () {
    // Add a 0.2 second delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      // Use the Clipboard API to write the current URL to the clipboard
      await navigator.clipboard.writeText(window.location.href);
      // Optional: Notify the user that the URL has been copied
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  });
});
