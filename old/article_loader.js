function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function sanitizeHTML(str) {
  const temp = document.createElement("div");
  temp.textContent = str;
  return temp.innerHTML;
}

function loadArticles() {
  fetch("articles.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const container = document.getElementById("articles-container");
      if (!container) {
        throw new Error("Container not found");
      }

      // Sort articles by timestamp in descending order
      data.articles.sort((a, b) => b.timestamp - a.timestamp);

      const fragment = document.createDocumentFragment();

      data.articles.forEach((article, index) => {
        const articleElement = document.createElement("section");
        articleElement.className = "article";
        articleElement.setAttribute("aria-label", `Article: ${sanitizeHTML(article.title)}`);

        const dateTitle = document.createElement("p");
        dateTitle.className = "data-title";
        dateTitle.innerHTML = `
          <span class="timestamp">[${formatDate(article.timestamp)}]</span><br>
          <span class="project">${sanitizeHTML(article.title)}</span>
        `;

        const blockquote = document.createElement("blockquote");
        blockquote.innerHTML = `
          ${sanitizeHTML(article.content)}
          <br><span style="float: right">- ${sanitizeHTML(article.author)}</span>
        `;

        articleElement.appendChild(dateTitle);
        articleElement.appendChild(blockquote);

        if (article.links && article.links.length > 0) {
          const linksContainer = document.createElement("div");
          linksContainer.className = "links-container";

          article.links.forEach((linkData) => {
            const link = document.createElement("a");
            link.href = linkData.url;
            link.className = "button";
            link.innerHTML = `${sanitizeHTML(linkData.text)} <i class="fa-solid fa-link"></i>`;
            link.setAttribute("aria-label", `Link to ${sanitizeHTML(linkData.text)}`);
            linksContainer.appendChild(link);
          });

          articleElement.appendChild(linksContainer);
        }

        fragment.appendChild(articleElement);

        if (index < data.articles.length - 1) {
          const hr = document.createElement("hr");
          fragment.appendChild(hr);
        }

        // Log to console that the article has been loaded
        console.log(`Article ${formatDate(article.timestamp)} loaded`);
      });

      container.appendChild(fragment);
    })
    .catch((error) => {
      console.error("Error:", error);
      const errorMessage = document.createElement("p");
      errorMessage.textContent = `Failed to load articles: ${error.message}`;
      document.body.appendChild(errorMessage);
    });
}

document.addEventListener("DOMContentLoaded", loadArticles);
