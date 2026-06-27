import { client, account, databases } from "./lib/appwrite.js";
import { syllabus } from "./data/syllabus.js";
import { pastPapersIndex } from "./data/pastPapersIndex.js";
import { initRouter } from "./modules/router.js";
import { initAuth } from "./modules/auth.js";
import { initUI } from "./modules/ui.js";

window.addEventListener("DOMContentLoaded", () => {
  initUI();
  initAuth();
  initRouter();

  // Ping Appwrite backend server to verify the setup
  try {
    client.ping();
  } catch (e) {
    console.error("Appwrite ping failed:", e);
  }

  window.Zephyros = {
    client,
    account,
    databases,
    syllabus,
    pastPapersIndex,
  };
});
