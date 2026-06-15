// script.js - Team Agency Portfolio

// Shortcut for document.getElementById()
function getElement(id) {
  return document.getElementById(id);
}

// Hide landing page and show the main page
function enterSite() {
  getElement("landing-page").style.display = "none";
  getElement("main-page").style.display = "block";
}

// Show a section by name (currently supports "portfolio")
function showSection(sectionName) {
  if (sectionName === "portfolio") {
    getElement("section-portfolio").style.display = "block";
  }
}

// Remove "active" from all sidebar links, then highlight the clicked one
function setActive(linkId) {
  document.querySelectorAll("#sidebar-nav ul li a").forEach(function(link) {
    link.classList.remove("active");
  });

  const clickedLink = getElement(linkId);
  if (clickedLink) {
    clickedLink.classList.add("active");
  }
  }

// Toggle sidebar open/closed
function collapseSidebar() {
  getElement("sidebar").classList.toggle("collapsed");
}

// Switch between dark and light mode, and save the choice
function toggleTheme() {
  const isDarkMode = document.body.classList.toggle("dark-mode");

  getElement("theme-btn").textContent = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

// On page load, apply dark mode if the user previously chose it
function loadSavedTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    getElement("theme-btn").textContent = "☀️ Light Mode";
  }
}

// Validate form fields and show success or error message
function submitForm(event) {
  event.preventDefault(); // Stop page from refreshing on submit

  const nameField    = getElement("c-name");
  const emailField   = getElement("c-email");
  const messageField = getElement("c-message");
  const messageBox   = getElement("form-msg");

  // Check each field and show an error if empty
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

  // All fields valid — show success and clear the form
  messageBox.textContent = "Thank you! Your message has been received.";
  messageBox.style.color = "seagreen";
  nameField.value = emailField.value = messageField.value = "";
}

// Apply saved theme when the page first loads
window.onload = loadSavedTheme;