import { account } from "../lib/appwrite.js";
import { currentUser, checkAuth } from "../modules/auth.js";

export function renderProfile(container) {
  if (!currentUser) {
    container.innerHTML = `<div class="glass-panel card"><p>Please log in to view your profile.</p></div>`;
    return;
  }

  const isAnonymous = !currentUser.email;

  container.innerHTML = `
    <div class="glass-panel card" style="max-width: 600px; margin: 0 auto; padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div class="avatar" style="width: 96px; height: 96px; margin: 0 auto 16px auto; font-size: 48px; display: flex; align-items: center; justify-content: center; background: var(--bg-tertiary); border-radius: 50%;">
          ${isAnonymous ? "👤" : "⛅"}
        </div>
        <h2>${currentUser.name || (isAnonymous ? "Guest Student" : currentUser.email)}</h2>
        <p style="color: var(--text-secondary); margin-top: 4px;">
          ${isAnonymous ? "Guest Session" : `Student Account (${currentUser.email})`}
        </p>
      </div>

      <div style="margin-top: 24px; border-top: 1px solid var(--glass-border); padding-top: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: var(--text-secondary);">User ID</span>
          <span style="font-family: monospace;">${currentUser.$id}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
          <span style="color: var(--text-secondary);">Registration Date</span>
          <span>${new Date(currentUser.$createdAt).toLocaleDateString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
          <span style="color: var(--text-secondary);">Session Type</span>
          <span>${isAnonymous ? "Anonymous Guest" : "Authenticated User"}</span>
        </div>

        <button id="signout-btn" class="btn-primary" style="width: 100%; padding: 12px; background: #FF3B30; color: #FFF; font-weight: bold; border: none; border-radius: 8px; cursor: pointer;">
          Sign Out
        </button>
      </div>
    </div>
  `;

  document.getElementById("signout-btn").addEventListener("click", async () => {
    try {
      await account.deleteSession("current");
      await checkAuth();
    } catch (e) {
      console.error("Sign out failed:", e);
    }
  });
}
