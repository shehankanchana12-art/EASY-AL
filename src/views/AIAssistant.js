export function renderAIAssistant(container) {
  container.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 85%;">
      <div class="glass-panel" id="chat-box" style="flex: 1; overflow-y: auto; padding: 24px; margin-bottom: 16px;">
        <div class="ai-message">Hello! I am your Zephyros AI Assistant. How can I help you study today?</div>
      </div>
      <div class="glass-panel" style="display: flex; gap: 12px; padding: 12px;">
        <input type="text" id="chat-input" class="auth-input" style="margin: 0; flex: 1;" placeholder="Ask me anything..." />
        <button id="chat-send" class="btn-primary">Send</button>
      </div>
    </div>
  `;

  document.getElementById("chat-send").addEventListener("click", () => {
    const input = document.getElementById("chat-input");
    const txt = input.value.trim();
    if (!txt) return;

    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div class="user-message">${txt}</div>`;
    input.value = "";

    // Mock AI Response
    setTimeout(() => {
      chatBox.innerHTML += `<div class="ai-message">Based on your syllabus, I recommend focusing on the fundamental concepts first. Would you like me to generate a quiz?</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
  });
}
