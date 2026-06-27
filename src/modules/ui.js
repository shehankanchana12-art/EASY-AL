export function initUI() {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("theme-dark");
    body.classList.toggle("theme-light");
  });
}
