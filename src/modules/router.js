import { renderDashboard } from "../views/Dashboard.js";
import { renderPastPapers } from "../views/PastPapers.js";
import { renderSubjects } from "../views/Subjects.js";
import { renderPlanner } from "../views/planner.js";
import { renderFocusMode } from "../views/FocusMode.js";
import { renderAnalytics } from "../views/Analytics.js";
import { renderCalendar } from "../views/Calendar.js";
import { renderSettings } from "../views/Settings.js";
import { renderAIAssistant } from "../views/AIAssistant.js";

const routes = {
  "/": renderDashboard,
  "/papers": renderPastPapers,
  "/subjects": renderSubjects,
  "/planner": renderPlanner,
  "/focus": renderFocusMode,
  "/analytics": renderAnalytics,
  "/calendar": renderCalendar,
  "/settings": renderSettings,
  "/ai": renderAIAssistant,
};

export function initRouter() {
  const navMenu = document.getElementById("nav-menu");

  const navItems = [
    { path: "/", icon: "🏠", label: "Dashboard" },
    { path: "/subjects", icon: "📚", label: "Subjects" },
    { path: "/planner", icon: "📅", label: "Planner" },
    { path: "/papers", icon: "📄", label: "Past Papers" },
    { path: "/focus", icon: "🎯", label: "Focus Mode" },
    { path: "/analytics", icon: "📊", label: "Analytics" },
    { path: "/calendar", icon: "🗓️", label: "Calendar" },
    { path: "/ai", icon: "🤖", label: "AI Assistant" },
    { path: "/settings", icon: "⚙️", label: "Settings" },
  ];

  navMenu.innerHTML = navItems
    .map(
      (item) => `
    <div class="nav-item" data-path="${item.path}">
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${item.label}</span>
    </div>
  `,
    )
    .join("");

  navMenu.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      navigateTo(item.getAttribute("data-path"));
    });
  });

  window.addEventListener("popstate", () => {
    renderRoute(window.location.pathname);
  });

  renderRoute(window.location.pathname);
}

function navigateTo(path) {
  window.history.pushState({}, "", path);
  renderRoute(path);
}

function renderRoute(path) {
  const viewContainer = document.getElementById("view-container");
  const routeHandler = routes[path] || routes["/"];

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.getAttribute("data-path") === path);
  });

  viewContainer.style.opacity = "0";
  viewContainer.style.transform = "translateY(10px)";

  setTimeout(() => {
    routeHandler(viewContainer);
    viewContainer.style.opacity = "1";
    viewContainer.style.transform = "translateY(0)";
    viewContainer.classList.add("fade-in");
  }, 300);
}
