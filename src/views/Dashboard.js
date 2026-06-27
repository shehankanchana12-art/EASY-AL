export function renderDashboard(container) {
  container.innerHTML = `
    <div class="dashboard-grid">
      <div class="glass-panel card" style="grid-column: span 2;">
        <h2>Welcome back, Student 👋</h2>
        <p>You're on a 5-day streak. Keep it up!</p>
        <div style="display: flex; gap: 20px; margin-top: 20px;">
          <div>
            <span style="font-size: 24px; font-weight: bold;">24h</span>
            <p style="color: var(--text-secondary)">Studied this week</p>
          </div>
          <div>
            <span style="font-size: 24px; font-weight: bold;">68%</span>
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
        <h3>Upcoming</h3>
        <div class="task-item">
          <span class="task-dot" style="background: #34C759"></span>
          <span>Complete Biology Unit 4</span>
        </div>
        <div class="task-item">
          <span class="task-dot" style="background: #FF9500"></span>
          <span>Chemistry Mock Paper</span>
        </div>
      </div>

      <div class="glass-panel card">
        <h3>✨ AI Recommendation</h3>
        <p style="margin: 12px 0; color: var(--text-secondary)">Based on your recent analytics, we suggest reviewing <strong>Newton's Laws of Motion</strong>.</p>
        <button class="btn-primary">Start Revision</button>
      </div>
    </div>
  `;

  const circle = container.querySelector(".progress-ring__circle");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;

  setTimeout(() => {
    const progress = 0.6;
    circle.style.strokeDashoffset = circumference * (1 - progress);
  }, 500);
}
