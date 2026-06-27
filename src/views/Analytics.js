export function renderAnalytics(container) {
  container.innerHTML = `
    <div class="dashboard-grid">
      <div class="glass-panel card" style="grid-column: span 2;">
        <h3>Weekly Study Hours</h3>
        <div style="display: flex; align-items: flex-end; height: 200px; gap: 16px; margin-top: 24px;">
          <div class="chart-bar" style="height: 40%;">Mon<div class="chart-val">2h</div></div>
          <div class="chart-bar" style="height: 60%;">Tue<div class="chart-val">3h</div></div>
          <div class="chart-bar" style="height: 20%;">Wed<div class="chart-val">1h</div></div>
          <div class="chart-bar" style="height: 80%;">Thu<div class="chart-val">4h</div></div>
          <div class="chart-bar" style="height: 50%;">Fri<div class="chart-val">2.5h</div></div>
          <div class="chart-bar" style="height: 100%;">Sat<div class="chart-val">5h</div></div>
          <div class="chart-bar" style="height: 30%;">Sun<div class="chart-val">1.5h</div></div>
        </div>
      </div>
      <div class="glass-panel card">
        <h3>Subject Distribution</h3>
        <div style="margin-top: 24px;">
          <p>Physics</p>
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 45%; background: #AF52DE;"></div></div>
          <p style="margin-top: 16px;">Chemistry</p>
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 30%; background: #FF9500;"></div></div>
          <p style="margin-top: 16px;">Biology</p>
          <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 25%; background: #34C759;"></div></div>
        </div>
      </div>
    </div>
  `;
}
