// script.js — Team Agency Portfolio
// Uses only topics from college JS syllabus

// ─── Helper ────────────────────────────────────────────────────────────────

// Returns an element from the page using its id
const getElement = (id) => document.getElementById(id);

// ─── Landing Page ───────────────────────────────────────────────────────────

// Hides the landing page and shows the main dashboard
function enterSite() {
  getElement("landing-page").style.display = "none";
  getElement("main-page").style.display = "block";
}

// ─── Section Navigation ─────────────────────────────────────────────────────

// Shows a specific content section based on the section name passed in
function showSection(sectionName) {
  if (sectionName === "portfolio") {
    getElement("section-portfolio").style.display = "block";
  }
}

// Removes "active" class from all sidebar links, then adds it to the clicked one
function setActive(linkId) {
  document.querySelectorAll("#sidebar-nav ul li a").forEach(function (link) {
    link.classList.remove("active");
  });

  const clickedLink = getElement(linkId);
  if (clickedLink) {
    clickedLink.classList.add("active");
  }
}

// ─── Sidebar ────────────────────────────────────────────────────────────────

// Toggles the sidebar between open and collapsed states
function collapseSidebar() {
  getElement("sidebar").classList.toggle("collapsed");
}

// ─── Theme Toggle ────────────────────────────────────────────────────────────

// Switches between dark and light mode, and saves the user's choice to localStorage
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  getElement("theme-btn").textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Reads the saved theme from localStorage and applies it when the page loads
function loadSavedTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    getElement("theme-btn").textContent = "☀️ Light Mode";
  }
}

// ─── Contact Form ────────────────────────────────────────────────────────────

// Validates the contact form fields and shows a success or error message
function submitForm(event) {
  event.preventDefault(); // Stop the page from refreshing on form submit

  const nameField    = getElement("c-name");
  const emailField   = getElement("c-email");
  const messageField = getElement("c-message");
  const messageBox   = getElement("form-msg");

  // Check each field — show an error and stop if any field is empty
  if (!nameField.value.trim()) {
    messageBox.textContent = "Please enter your name.";
    messageBox.style.color = "tomato";
    return;
  }
  if (!emailField.value.trim()) {
    messageBox.textContent = "Please enter your email.";
    messageBox.style.color = "tomato";
    return;
  }
  if (!messageField.value.trim()) {
    messageBox.textContent = "Please write a message.";
    messageBox.style.color = "tomato";
    return;
  }

  // All fields valid — show success and reset the form
  messageBox.textContent = "Thank you! Your message has been received.";
  messageBox.style.color = "seagreen";
  nameField.value = "";
  emailField.value = "";
  messageField.value = "";
}

// ─── Init ────────────────────────────────────────────────────────────────────

// Run loadSavedTheme as soon as the page finishes loading
window.addEventListener("load", loadSavedTheme);