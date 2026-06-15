// script.js - Team Agency Portfolio

const $ = id => document.getElementById(id);

function enterSite() {
  $("landing-page").style.display = "none";
  $("main-page").style.display = "block";
}

function showSection(name) {
  if (name === "portfolio") $("section-portfolio").style.display = "block";
}

function setActive(linkId) {
  document.querySelectorAll("#sidebar-nav ul li a").forEach(a => a.classList.remove("active"));
  $(linkId)?.classList.add("active");
}

function collapseSidebar() {
  $("sidebar").classList.toggle("collapsed");
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  $("theme-btn").textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function loadSavedTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    $("theme-btn").textContent = "☀️ Light Mode";
  }
}

function submitForm(event) {
  event.preventDefault();
  const [name, email, msg] = ["c-name", "c-email", "c-message"].map($);
  const msgBox = $("form-msg");

  const errorMsg = !name.value.trim() ? "Please enter your name." :
                   !email.value.trim() ? "Please enter your email." :
                   !msg.value.trim() ? "Please write a message." : "";

  msgBox.textContent = errorMsg || "Thank you! Your message has been received.";
  msgBox.style.color = errorMsg ? "tomato" : "seagreen";

  if (!errorMsg) [name, email, msg].forEach(f => f.value = "");
}

window.onload = loadSavedTheme;