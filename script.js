// script.js - Team Agency Portfolio


function enterSite() {
  var landing = document.getElementById("landing-page");
  var mainPg  = document.getElementById("main-page");

  landing.style.display = "none";
  mainPg.style.display  = "block";
}


function showSection(name) {
  var portfolio = document.getElementById("section-portfolio");

  if (name === "portfolio") {
    portfolio.style.display = "block";
  }
}


function setActive(linkId) {
  var allLinks = document.querySelectorAll("#sidebar-nav ul li a");

  for (var i = 0; i < allLinks.length; i++) {
    allLinks[i].classList.remove("active");
  }

  var clicked = document.getElementById(linkId);
  if (clicked) {
    clicked.classList.add("active");
  }
}


function collapseSidebar() {
  var sidebar = document.getElementById("sidebar");

  if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
  } else {
    sidebar.classList.add("collapsed");
  }
}


function toggleTheme() {
  var body = document.body;
  var btn  = document.getElementById("theme-btn");

  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    btn.textContent = "\uD83C\uDF19 Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    body.classList.add("dark-mode");
    btn.textContent = "\u2600\uFE0F Light Mode";
    localStorage.setItem("theme", "dark");
  }
}


function loadSavedTheme() {
  var saved = localStorage.getItem("theme");
  var btn   = document.getElementById("theme-btn");

  if (saved === "dark") {
    document.body.classList.add("dark-mode");
    btn.textContent = "\u2600\uFE0F Light Mode";
  }
}


function submitForm(event) {
  event.preventDefault();

  var name    = document.getElementById("c-name").value;
  var email   = document.getElementById("c-email").value;
  var message = document.getElementById("c-message").value;
  var msgBox  = document.getElementById("form-msg");

  if (name.trim() === "") {
    msgBox.textContent = "Please enter your name.";
    msgBox.style.color = "tomato";
    return;
  }

  if (email.trim() === "") {
    msgBox.textContent = "Please enter your email.";
    msgBox.style.color = "tomato";
    return;
  }

  if (message.trim() === "") {
    msgBox.textContent = "Please write a message.";
    msgBox.style.color = "tomato";
    return;
  }

  msgBox.textContent = "Thank you! Your message has been received.";
  msgBox.style.color = "seagreen";

  document.getElementById("c-name").value    = "";
  document.getElementById("c-email").value   = "";
  document.getElementById("c-message").value = "";
}


window.onload = function() {
  loadSavedTheme();
};