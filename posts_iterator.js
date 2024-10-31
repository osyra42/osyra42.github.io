document.addEventListener("DOMContentLoaded", function () {
  // Fetch the JSON data
  fetch("posts_database.json")
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
        postCard.querySelector(".post-time").textContent = new Date(article.timestamp).toLocaleString();

        return postCard;
      }

      // Add all posts to the container
      const allPostsContainer = document.querySelector(".all-posts");
      filteredPosts.forEach((article) => {
        const postCard = createPostCard(article);
        allPostsContainer.appendChild(postCard);
      });
    })
    .catch((error) => console.error("Error fetching the JSON file:", error));
});
