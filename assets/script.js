// Example: Add interactivity to art category buttons
const buttons = document.querySelectorAll(".category-buttons button");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    alert(`You clicked: ${button.textContent}`);
  });
});
