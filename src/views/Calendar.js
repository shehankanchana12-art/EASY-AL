export function renderCalendar(container) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let html = `<div class="glass-panel card"><div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 12px;">`;

  days.forEach(
    (d) =>
      (html += `<div style="text-align: center; font-weight: bold; color: var(--text-secondary); padding: 8px;">${d}</div>`),
  );

  // Mock 30 days starting on Wednesday
  let startBlanks = 3;
  for (let i = 0; i < startBlanks; i++) html += `<div></div>`;

  for (let i = 1; i <= 31; i++) {
    const isToday = i === 15; // Mock today
    const studied = [2, 5, 8, 12, 19, 22, 26].includes(i); // Mock study days
    html += `
      <div style="
        aspect-ratio: 1; 
        background: ${isToday ? "var(--accent-gradient)" : "var(--bg-tertiary)"}; 
        border-radius: 12px; 
        display: flex; 
        flex-direction: column;
        align-items: center; 
        justify-content: center;
        ${studied ? "box-shadow: inset 0 0 0 2px #34C759;" : ""}
      ">
        <span>${i}</span>
        ${studied ? '<span style="font-size: 10px; color: #34C759;">●</span>' : ""}
      </div>
    `;
  }

  html += `</div></div>`;
  container.innerHTML = html;
}
