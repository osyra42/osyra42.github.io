document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".link-container a");
  const pages = document.querySelectorAll(".page");
  const pageContainer = document.getElementById("page-container");
  const backButtons = document.querySelectorAll(".back-button");

  // Set initial state for pages
  pages.forEach((page) => {
    page.style.left = "100%";
  });

  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetPage = this.getAttribute("data-page");
      const currentPage = document.querySelector('.page:not([style*="left: 100%"])');

      if (currentPage) {
        currentPage.style.left = "-100%";
      }

      setTimeout(() => {
        pages.forEach((page) => {
          page.style.left = "100%";
        });
        document.getElementById(`${targetPage}-page`).style.left = "0";
      }, 500);
    });
  });

  backButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const currentPage = document.querySelector('.page:not([style*="left: 100%"])');

      if (currentPage) {
        currentPage.style.left = "100%";
      }

      setTimeout(() => {
        pages.forEach((page) => {
          page.style.left = "100%";
        });
        document.getElementById("main-section").style.left = "0";
      }, 500);
    });
  });

  document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    document.getElementById("contact-form").reset();
  });
});
