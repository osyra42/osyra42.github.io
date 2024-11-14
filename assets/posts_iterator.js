document.addEventListener("DOMContentLoaded", function () {
  // Fetch the JSON data
  fetch("assets/posts_database.json")
    .then((response) => response.json())
    .then((data) => {
      // Extract the articles from the fetched data
      const articles = data.articles;
      // Get the current time in milliseconds
      const currentTime = Date.now();

      // Filter posts that are lower than or equal to the current timestamp
      const filteredPosts = articles.filter((article) => article.timestamp <= currentTime);

      // Sort the filtered posts by timestamp in descending order
      filteredPosts.sort((a, b) => b.timestamp - a.timestamp);

      // Function to create a post card
      function createPostCard(article) {
        // Get the post template element
        const postTemplate = document.getElementById("post-template");
        // Clone the template to create a new post card
        const postCard = postTemplate.cloneNode(true);
        // Make the cloned post card visible
        postCard.style.display = "block";
        // Remove the id attribute to avoid duplicate ids in the DOM
        postCard.removeAttribute("id");

        // Get the post title element and set its text content
        const postTitle = postCard.querySelector(".post-title");
        postTitle.textContent = article.title;

        // Get the post content element and set its text content
        postCard.querySelector(".post-content").textContent = article.content;

        // Get the post time element and set its text content to the relative time
        const postTime = postCard.querySelector(".post-time");
        const relativeTime = formatRelativeTime(article.timestamp);
        postTime.textContent = relativeTime;

        // Get the post link element
        const postLink = postCard.querySelector(".post-link");
        // Check if the article has a link
        if (article.link) {
          // Set the href and text content of the post link
          postLink.href = article.link.url;
          postLink.textContent = article.link.text;
          postLink.ariaLabel = `Read more about ${article.link.text}`;
        } else {
          // If no link exists, set the href to "#" to avoid broken link
          postLink.href = "#";
          // Set the text content to an empty string
          postLink.textContent = " ";
          postLink.title = " ";
        }

        // Get the share button element (if needed for future functionality)
        const shareButton = postCard.querySelector("button");

        // Return the created post card
        return postCard;
      }

      // Helper function to format relative time
      function formatRelativeTime(timestamp) {
        // Get the current time in milliseconds
        const now = Date.now();
        // Calculate the difference between the current time and the timestamp
        const diff = now - timestamp;
        // Convert the difference to seconds
        const seconds = Math.floor(diff / 1000);
        // Convert the difference to minutes
        const minutes = Math.floor(seconds / 60);
        // Convert the difference to hours
        const hours = Math.floor(minutes / 60);
        // Convert the difference to days
        const days = Math.floor(hours / 24);

        // Format the relative time based on the difference
        if (days >= 30) {
          // If more than 30 days, return the date in local string format
          return new Date(timestamp).toLocaleString();
        } else if (days > 0) {
          // If more than 0 days, return the number of days ago
          return `${days} day${days > 1 ? "s" : ""} ago`;
        } else if (hours > 0) {
          // If more than 0 hours, return the number of hours ago
          return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else if (minutes > 0) {
          // If more than 0 minutes, return the number of minutes ago
          return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        } else {
          // If less than 1 minute, return the number of seconds ago
          return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
        }
      }

      // Add the posts to the DOM
      filteredPosts.forEach((article) => {
        // Create a post card for each article
        const postCard = createPostCard(article);
        // Append the created post card to the all-posts container
        document.querySelector(".all-posts").appendChild(postCard);
      });
    })
    .catch((error) => console.error("Error fetching the JSON file:", error));
});
