import { account, ID } from "../lib/appwrite.js";

export function renderAuth(container, onLoginSuccess) {
  container.innerHTML = `
    <div class="auth-card glass-panel fade-in">
      <div class="auth-header">
        <div class="auth-logo">⛅</div>
        <h1>Zephyros Study OS</h1>
        <p>Your AI-powered A/L companion.</p>
      </div>

      <div class="auth-tabs">
        <button class="auth-tab active" data-tab="login">Login</button>
        <button class="auth-tab" data-tab="signup">Sign Up</button>
      </div>

      <div class="auth-form" id="auth-form">
        <input type="email" id="auth-email" class="auth-input" placeholder="Email Address" />
        <input type="password" id="auth-password" class="auth-input" placeholder="Password" />
        <button id="auth-submit" class="btn-primary" style="width: 100%; padding: 12px; font-size: 16px;">Login</button>
        <p id="auth-error" class="auth-error"></p>
      </div>

      <div class="auth-divider"><span>OR</span></div>

      <div class="auth-providers">
        <button id="google-login" class="auth-provider-btn">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
          Continue with Google
        </button>
        <button id="guest-login" class="auth-provider-btn">
          <span style="font-size: 18px;">👤</span> Continue as Guest
        </button>
      </div>
    </div>
  `;

  let isLogin = true;

  // Tab Switching
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document
        .querySelectorAll(".auth-tab")
        .forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      isLogin = tab.dataset.tab === "login";
      document.getElementById("auth-submit").textContent = isLogin
        ? "Login"
        : "Sign Up";
    });
  });

  // Email/Password Submit
  document.getElementById("auth-submit").addEventListener("click", async () => {
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;
    const errorEl = document.getElementById("auth-error");
    errorEl.textContent = "";

    try {
      // Clear existing session if any to avoid active session conflict
      try {
        await account.deleteSession("current");
      } catch (_) {}

      if (isLogin) {
        await account.createEmailPasswordSession(email, password);
      } else {
        await account.create(ID.unique(), email, password);
        await account.createEmailPasswordSession(email, password);
      }
      if (onLoginSuccess) await onLoginSuccess();
    } catch (error) {
      errorEl.textContent = error.message;
    }
  });

  // Google Login
  document
    .getElementById("google-login")
    .addEventListener("click", async () => {
      try {
        // Clear existing session if any
        try {
          await account.deleteSession("current");
        } catch (_) {}

        await account.createOAuth2Session(
          "google",
          window.location.origin,
          window.location.origin
        );
      } catch (error) {
        document.getElementById("auth-error").textContent = error.message;
      }
    });

  // Guest Login
  document.getElementById("guest-login").addEventListener("click", async () => {
    try {
      // Clear existing session if any to avoid active session conflict
      try {
        await account.deleteSession("current");
      } catch (_) {}

      await account.createAnonymousSession();
      if (onLoginSuccess) await onLoginSuccess();
    } catch (error) {
      document.getElementById("auth-error").textContent = error.message;
    }
  });
}

