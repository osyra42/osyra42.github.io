document.addEventListener("DOMContentLoaded", () => {
  const wordThreshold = 1000; // Define word threshold as a variable for easy changes
  const pre = document.querySelector("pre");
  if (pre) {
    const text = pre.innerHTML; // Get the inner HTML to preserve newlines
    const words = text.split(/(\s+)/); // Split text including whitespace
    let wordCount = 0;
    let sentenceEndIndex = 0;
    let insertIndex = 0;
    let bookmarkId = 1;
    let modifiedContent = "";
    let lastInsertIndex = 0;

    for (let i = 0; i < words.length; i++) {
      if (!words[i].match(/^\s+$/)) {
        wordCount += 1;
      }

      if (words[i].includes(".")) {
        sentenceEndIndex = i;
      }

      if (wordCount >= wordThreshold && sentenceEndIndex > insertIndex) {
        insertIndex = sentenceEndIndex + 1;
        wordCount = 0;

        // Construct the bookmark button with the anchor
        const bookmarkButton = `<br><a href="#bookmark-${bookmarkId}"><button id="bookmark-${bookmarkId}" class="bookmark">BOOKMARK</button></a><br>`;
        bookmarkId++;

        // Insert button at the end of the sentence
        const partBefore = words.slice(lastInsertIndex, insertIndex + 1).join("");
        modifiedContent += partBefore + bookmarkButton;
        lastInsertIndex = insertIndex + 1;
      }
    }

    // Add any remaining words after the last bookmark button
    modifiedContent += words.slice(lastInsertIndex).join("");

    // Update pre content
    pre.innerHTML = modifiedContent;
  }

  document.querySelectorAll("button.bookmark").forEach((button) => {
    button.addEventListener("click", async function () {
      // Add a 0.1 second delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        // Append bookmark ID to the URL and copy to clipboard
        const bookmarkId = this.id.split("-")[1];
        const newUrl = `${window.location.href.split("#")[0]}#bookmark-${bookmarkId}`;

        // Update the browser's URL without reloading the page
        window.history.pushState(null, "", newUrl);

        await navigator.clipboard.writeText(newUrl);

        // Optional: Notify the user that the URL has been copied
        alert("URL copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    });
  });
});
