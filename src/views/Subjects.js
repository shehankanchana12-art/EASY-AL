import { syllabus } from "../data/syllabus.js";

export function renderSubjects(container) {
  container.innerHTML = `
    <div style="padding: 8px;">
      ${Object.entries(syllabus)
        .map(
          ([key, subject]) => `
        <div class="subject-accordion glass-panel">
          <div class="subject-header" style="border-left: 4px solid ${subject.color}">
            <span style="font-size: 24px;">${subject.icon}</span>
            <h2>${subject.name}</h2>
          </div>
          <div class="subject-units">
            ${subject.units
              .map(
                (unit) => `
              <div class="unit-item">
                <div>
                  <h4>${unit.name}</h4>
                  <div style="font-size: 12px; color: var(--text-secondary); display: flex; gap: 10px;">
                    <span>Difficulty: ${unit.difficulty}</span>
                    <span>Est. Time: ${unit.estHours}h</span>
                  </div>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `;

  container.querySelectorAll(".subject-header").forEach((header) => {
    header.addEventListener("click", () => {
      const units = header.nextElementSibling;
      units.style.display = units.style.display === "block" ? "none" : "block";
    });
  });
}
