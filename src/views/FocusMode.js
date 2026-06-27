export function renderFocusMode(container) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80%;">
      <div class="glass-panel card" style="text-align: center; padding: 48px; width: 100%; max-width: 500px;">
        <h2 style="margin-bottom: 32px;">Focus Timer</h2>
        <div id="timer-display" style="font-size: 72px; font-weight: 700; margin-bottom: 32px; font-variant-numeric: tabular-nums;">25:00</div>
        <div style="display: flex; gap: 16px; justify-content: center;">
          <button id="timer-start" class="btn-primary" style="padding: 12px 32px; font-size: 16px;">Start</button>
          <button id="timer-reset" class="btn-icon" style="border: 1px solid var(--glass-border); padding: 12px 24px; border-radius: 12px;">Reset</button>
        </div>
        <div style="margin-top: 32px; display: flex; gap: 12px; justify-content: center;">
          <button class="ambient-sound" data-sound="🌧️">🌧️ Rain</button>
          <button class="ambient-sound" data-sound="🌳">🌳 Forest</button>
          <button class="ambient-sound" data-sound="🔥">🔥 Fireplace</button>
        </div>
      </div>
    </div>
  `;

  let timeLeft = 25 * 60;
  let timerInterval = null;
  const display = document.getElementById("timer-display");

  function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  document.getElementById("timer-start").addEventListener("click", (e) => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      e.target.textContent = "Start";
    } else {
      e.target.textContent = "Pause";
      timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          alert("Focus session complete! Take a break.");
          timeLeft = 25 * 60;
          updateDisplay();
        }
      }, 1000);
    }
  });

  document.getElementById("timer-reset").addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 25 * 60;
    updateDisplay();
    document.getElementById("timer-start").textContent = "Start";
  });

  document.querySelectorAll(".ambient-sound").forEach((btn) => {
    btn.addEventListener("click", () => {
      alert(
        `Playing ${btn.dataset.sound} ambient sound... (Web Audio API integration needed)`,
      );
    });
  });
}
