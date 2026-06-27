import { account, databases, DATABASE_ID, COLLECTION_USERS } from "../lib/appwrite.js";
import { renderAuth } from "../views/auth.js";

export let currentUser = null;

export async function checkAuth() {
  const authContainer = document.getElementById("auth-container");
  const appShell = document.getElementById("app-shell");
  const userProfileMini = document.getElementById("user-profile-mini");

  try {
    currentUser = await account.get();

    // Check/create user document in database safely (database error shouldn't block login)
    try {
      try {
        await databases.getDocument(DATABASE_ID, COLLECTION_USERS, currentUser.$id);
      } catch (e) {
        // Document doesn't exist (404/NotFound), create it
        const guestData = JSON.parse(
          localStorage.getItem("zephyros_guest_data") || "{}",
        );
        await databases.createDocument(DATABASE_ID, COLLECTION_USERS, currentUser.$id, {
          email: currentUser.email || "guest@zephyros.lk",
          createdAt: new Date().toISOString(),
          ...guestData,
        });
        localStorage.removeItem("zephyros_guest_data");
      }
    } catch (dbError) {
      console.warn("Appwrite database user doc sync skipped/failed:", dbError.message);
    }

    // Hide Login, Show App
    authContainer.innerHTML = "";
    authContainer.style.display = "none";
    appShell.style.display = "grid";

    // Update Mini Profile
    userProfileMini.innerHTML = `
      <div class="avatar" style="background-image: url('${currentUser.prefs?.photoURL || ""}')"></div>
      <span>${currentUser.name || currentUser.email || "Guest"}</span>
    `;
  } catch (error) {
    currentUser = null;
    appShell.style.display = "none";
    authContainer.style.display = "flex";
    renderAuth(authContainer, checkAuth);
  }
}

export function initAuth() {
  checkAuth();
}
