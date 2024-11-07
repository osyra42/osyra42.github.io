document.addEventListener("DOMContentLoaded", function () {
  // Fetch the JSON data
  fetch("assets/posts_database.json")
    .then((response) => response.json())
    .then((data) => {
      const articles = data.articles;
      const currentTime = Date.now();

      // Filter posts that are lower than the current timestamp
      const filteredPosts = articles.filter((article) => article.timestamp <= currentTime);

      // Sort the posts by timestamp
      filteredPosts.sort((a, b) => b.timestamp - a.timestamp);

      // Function to create a post card
      function createPostCard(article) {
        const postTemplate = document.getElementById("post-template");
        const postCard = postTemplate.cloneNode(true);
        postCard.style.display = "block";
        postCard.removeAttribute("id");

        const postTitle = postCard.querySelector(".post-title");
        if (article.pinned) {
          const pinnedIcon = document.createElement("i");
          pinnedIcon.className = "fas fa-thumbtack";
          postTitle.insertBefore(pinnedIcon, postTitle.firstChild);
        }
        postTitle.textContent = article.title;

        postCard.querySelector(".post-content").textContent = article.content;
        const postTime = postCard.querySelector(".post-time");
        const relativeTime = formatRelativeTime(article.timestamp);
        postTime.textContent = relativeTime;
        postTime.style.float = "right";

        const shareButton = postCard.querySelector("button");
        shareButton.style.float = "right";
        shareButton.style.marginRight = "8px";

        return postCard;
      }

      // Helper function to format relative time
      function formatRelativeTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days >= 30) {
          return new Date(timestamp).toLocaleString();
        } else if (days > 0) {
          return `${days} day${days > 1 ? "s" : ""} ago`;
        } else if (hours > 0) {
          return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else if (minutes > 0) {
          return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        } else {
          return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
        }
      }

      // Add pinned post first
      const pinnedPost = filteredPosts.find((article) => article.pinned);
      if (pinnedPost) {
        const pinnedPostCard = createPostCard(pinnedPost);
        document.querySelector(".all-posts").appendChild(pinnedPostCard);
      }

      // Add the rest of the posts
      filteredPosts.forEach((article) => {
        if (!article.pinned) {
          const postCard = createPostCard(article);
          document.querySelector(".all-posts").appendChild(postCard);
        }
      });
    })
    .catch((error) => console.error("Error fetching the JSON file:", error));
});
