import { client, databases, DATABASE_ID, COLLECTION_PLANNER, ID, Query } from "../lib/appwrite.js";
import { currentUser } from "../modules/auth.js";

export function renderPlanner(container) {
  container.innerHTML = `
    <div style="padding: 8px;">
      <div class="glass-panel card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2>Daily Planner</h2>
        <button id="add-task-btn" class="btn-primary">+ Add Task</button>
      </div>
      <div id="task-list" class="dashboard-grid"></div>
    </div>
  `;

  const taskList = document.getElementById("task-list");

  // Add Task Logic
  document
    .getElementById("add-task-btn")
    .addEventListener("click", async () => {
      if (!currentUser) return;
      const title = prompt("Enter task title:");
      if (!title) return;

      try {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_PLANNER,
          ID.unique(),
          {
            userId: currentUser.$id,
            title: title,
            completed: false,
            createdAt: new Date().toISOString(),
          }
        );
      } catch (e) {
        console.error("Error adding task: ", e);
      }
    });

  // Load and Render Tasks
  async function loadTasks() {
    if (!currentUser) return;
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_PLANNER,
        [Query.equal("userId", currentUser.$id)]
      );

      if (response.documents.length === 0) {
        taskList.innerHTML = `<div class="glass-panel card"><p>No tasks yet. Add your first task!</p></div>`;
        return;
      }

      taskList.innerHTML = "";
      response.documents.forEach((doc) => {
        const card = document.createElement("div");
        card.className = "glass-panel card task-item";
        card.style.justifyContent = "space-between";
        card.innerHTML = `
          <span style="${doc.completed ? "text-decoration: line-through; color: var(--text-secondary);" : ""}">${doc.title}</span>
          <button class="btn-icon" data-id="${doc.$id}">🗑️</button>
        `;
        taskList.appendChild(card);

        card.querySelector("button").addEventListener("click", async () => {
          try {
            await databases.deleteDocument(DATABASE_ID, COLLECTION_PLANNER, doc.$id);
          } catch (e) {
            console.error("Error deleting task:", e);
          }
        });
      });
    } catch (e) {
      console.error("Error loading tasks:", e);
      taskList.innerHTML = `<div class="glass-panel card"><p style="color: var(--text-secondary)">Could not load tasks. Ensure database is configured.</p></div>`;
    }
  }

  // Run initial fetch
  loadTasks();

  // Appwrite Real-time Sync
  let unsubscribe = null;
  if (currentUser) {
    unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_PLANNER}.documents`,
      () => {
        loadTasks();
      }
    );
  }

  // Cleanup subscription when view changes/unmounts (optional but good practice)
  // We can attach it to the container or simply rely on navigation.
}
