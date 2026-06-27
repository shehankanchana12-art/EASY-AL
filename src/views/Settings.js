export function renderSettings(container) {
  container.innerHTML = `
    <div class="glass-panel card" style="max-width: 800px; margin: 0 auto;">
      <h2>Settings</h2>
      <div style="margin-top: 24px;">
        <div class="setting-item">
          <span>Dark Mode</span>
          <label class="switch">
            <input type="checkbox" id="dark-mode-toggle" checked>
            <span class="slider"></span>
          </label>
        </div>
        <div class="setting-item">
          <span>Notifications</span>
          <label class="switch">
            <input type="checkbox" checked>
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>
  `;

  document
    .getElementById("dark-mode-toggle")
    .addEventListener("change", (e) => {
      document.body.classList.toggle("theme-dark", e.target.checked);
      document.body.classList.toggle("theme-light", !e.target.checked);
    });
}
