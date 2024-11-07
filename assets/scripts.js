document.getElementById("search").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const postCards = document.querySelectorAll(".post-card");

  postCards.forEach((postCard) => {
    const title = postCard.querySelector(".post-title").textContent.toLowerCase();
    const content = postCard.querySelector(".post-content").textContent.toLowerCase();

    if (query === "") {
      // If the search input is empty, show all post cards
      postCard.style.display = "block";
      document.getElementById("post-template").style.display = "none";
    } else {
      // Otherwise, check if the title or content matches the query
      if (title.includes(query) || content.includes(query)) {
        postCard.style.display = "block";
      } else {
        postCard.style.display = "none";
      }
    }
  });
});
