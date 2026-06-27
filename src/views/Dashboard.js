import { currentUser } from "../modules/auth.js";
import { databases, DATABASE_ID, COLLECTION_PLANNER, Query } from "../lib/appwrite.js";

export function renderDashboard(container) {
  const name = currentUser ? (currentUser.name || "Student") : "Student";
  const email = currentUser ? (currentUser.email || "Guest") : "Guest";

  container.innerHTML = `
    <div class="dashboard-grid">
      <div class="glass-panel card" style="grid-column: span 2;">
        <h2>Welcome back, ${name} 👋</h2>
        <p>${email === "Guest" ? "Guest Mode Study Session" : `Account: ${email}`}</p>
        <div style="display: flex; gap: 20px; margin-top: 20px;">
          <div>
            <span id="studied-hours" style="font-size: 24px; font-weight: bold;">0h</span>
            <p style="color: var(--text-secondary)">Studied this week</p>
          </div>
          <div>
            <span id="syllabus-completion" style="font-size: 24px; font-weight: bold;">0%</span>
            <p style="color: var(--text-secondary)">Syllabus Completion</p>
          </div>
        </div>
      </div>

      <div class="glass-panel card">
        <h3>Today's Goal</h3>
        <div style="display: flex; justify-content: center; margin: 20px 0;">
          <svg class="progress-ring" width="120" height="120">
            <circle stroke="rgba(255,255,255,0.1)" stroke-width="8" fill="transparent" r="52" cx="60" cy="60" />
            <circle class="progress-ring__circle" stroke="url(#grad)" stroke-width="8" fill="transparent" r="52" cx="60" cy="60" />
            <defs>
              <linearGradient id="grad">
                <stop offset="0%" stop-color="#007AFF" />
                <stop offset="100%" stop-color="#00C6FF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div class="glass-panel card">
        <h3>Upcoming Tasks</h3>
        <div id="dashboard-tasks-list" style="margin-top: 12px;">
          <p style="color: var(--text-secondary)">Loading tasks...</p>
        </div>
      </div>

      <div class="glass-panel card">
        <h3>✨ AI Recommendation</h3>
        <p id="ai-rec-text" style="margin: 12px 0; color: var(--text-secondary)">Add tasks to your planner to get personalized study recommendations!</p>
      </div>
    </div>
  `;

  // Draw progress ring
  const circle = container.querySelector(".progress-ring__circle");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;

  setTimeout(() => {
    const progress = 0.0;
    circle.style.strokeDashoffset = circumference * (1 - progress);
  }, 500);

  // Load upcoming tasks dynamically from database
  const tasksListEl = document.getElementById("dashboard-tasks-list");
  const aiRecText = document.getElementById("ai-rec-text");
  const syllabusCompletion = document.getElementById("syllabus-completion");

  if (currentUser) {
    databases.listDocuments(
      DATABASE_ID,
      COLLECTION_PLANNER,
      [Query.equal("userId", currentUser.$id), Query.limit(3)]
    ).then((response) => {
      if (response.documents.length === 0) {
        tasksListEl.innerHTML = `<p style="color: var(--text-secondary)">No upcoming tasks. Add some in the planner!</p>`;
        return;
      }
      tasksListEl.innerHTML = response.documents.map(doc => `
        <div class="task-item" style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span class="task-dot" style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${doc.completed ? "#34C759" : "#FF9500"}"></span>
          <span style="${doc.completed ? "text-decoration: line-through; color: var(--text-secondary);" : ""}">${doc.title}</span>
        </div>
      `).join("");

      // Dynamically calculate completion
      const completedCount = response.documents.filter(d => d.completed).length;
      const totalCount = response.documents.length;
      const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      syllabusCompletion.textContent = `${completionPercentage}%`;
      
      // Update progress ring with actual completion
      const progress = completionPercentage / 100;
      circle.style.strokeDashoffset = circumference * (1 - progress);

      // Simple recommendation update
      const pendingTask = response.documents.find(d => !d.completed);
      if (pendingTask) {
        aiRecText.innerHTML = `Based on your recent planner tasks, we suggest focusing on completing <strong>${pendingTask.title}</strong> today!`;
      }
    }).catch((err) => {
      console.error("Dashboard tasks fetch failed:", err);
      tasksListEl.innerHTML = `<p style="color: var(--text-secondary)">Unable to load tasks.</p>`;
    });
  } else {
    tasksListEl.innerHTML = `<p style="color: var(--text-secondary)">Please log in to see tasks.</p>`;
  }
}
