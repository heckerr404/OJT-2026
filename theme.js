// theme.js - Shared theme helpers for all sub-app pages
// Uses only college syllabus topics: localStorage, classList, getElementById

// Returns an element by its id (shortcut helper)
function getEl(id) {
  return document.getElementById(id);
}

// Reads the saved theme from localStorage and applies it when the page loads
function applyTheme() {
  const savedTheme = localStorage.getItem("theme");
  const themeBtn = getEl("theme-btn");

  // Default theme is "light" to match the home page on first load
  if (savedTheme === "dark") {
    document.body.classList.remove("light");
    document.body.classList.add("dark-mode");
    if (themeBtn) {
      themeBtn.textContent = "☀️ Light Mode";
    }
  } else {
    document.body.classList.add("light");
    document.body.classList.remove("dark-mode");
    if (themeBtn) {
      themeBtn.textContent = "🌙 Dark Mode";
    }
  }
}

// Toggles between dark and light mode and saves the user's choice
function toggleTheme() {
  const isDark = document.body.classList.contains("dark-mode");
  const themeBtn = getEl("theme-btn");

  if (isDark) {
    // Switch to light mode
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light");
    if (themeBtn) {
      themeBtn.textContent = "🌙 Dark Mode";
    }
    localStorage.setItem("theme", "light");
  } else {
    // Switch to dark mode
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light");
    if (themeBtn) {
      themeBtn.textContent = "☀️ Light Mode";
    }
    localStorage.setItem("theme", "dark");
  }
}

// Compatibility alias for loadSavedTheme (used by legacy handlers or github-explorer)
function loadSavedTheme() {
  applyTheme();
}

// Run applyTheme immediately to minimize the visual flash of theme transition
applyTheme();

// Also run applyTheme on load to ensure button states match fully loaded state
window.addEventListener("load", applyTheme);
