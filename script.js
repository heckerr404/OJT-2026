// =====================================================
// script.js - Team Agency Portfolio
// Plain JavaScript - no libraries, no frameworks
// Written in simple beginner style
// =====================================================


// this variable stores all repos fetched from GitHub
// we keep it global so we can re-sort without fetching again
var allRepos = [];


// =====================================================
// FUNCTION: enterSite
// Hides the landing page and shows the main page
// Called when user clicks "Enter Site" button
// =====================================================
function enterSite() {
  // get both page divs
  var landing = document.getElementById("landing-page");
  var mainPg  = document.getElementById("main-page");

  // hide landing, show main
  landing.style.display = "none";
  mainPg.style.display  = "block";
}


// =====================================================
// FUNCTION: showSection
// Shows either the portfolio section or github section
// Called from sidebar links
// =====================================================
function showSection(name) {
  var portfolio = document.getElementById("section-portfolio");
  var github    = document.getElementById("section-github");

  if (name === "portfolio") {
    portfolio.style.display = "block";
    github.style.display    = "none";
  } else if (name === "github") {
    portfolio.style.display = "none";
    github.style.display    = "block";
  }
}


// =====================================================
// FUNCTION: setActive
// Removes "active" class from all sidebar links
// then adds it to the one that was just clicked
// =====================================================
function setActive(linkId) {
  // get all the links inside the sidebar nav
  var allLinks = document.querySelectorAll("#sidebar-nav ul li a");

  // loop through and remove active class from each
  for (var i = 0; i < allLinks.length; i++) {
    allLinks[i].classList.remove("active");
  }

  // add active class to the clicked link
  var clicked = document.getElementById(linkId);
  if (clicked) {
    clicked.classList.add("active");
  }
}


// =====================================================
// FUNCTION: collapseSidebar
// Toggles the "collapsed" class on the sidebar
// CSS handles hiding the text labels and shrinking width
// =====================================================
function collapseSidebar() {
  var sidebar = document.getElementById("sidebar");

  // if already collapsed, expand it; otherwise collapse
  if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
  } else {
    sidebar.classList.add("collapsed");
  }
}


// =====================================================
// FUNCTION: toggleTheme
// Switches between dark mode and light mode
// Saves the choice in localStorage so it stays on reload
// =====================================================
function toggleTheme() {
  var body = document.body;
  var btn  = document.getElementById("theme-btn");

  // check if dark mode class is already on the body
  if (body.classList.contains("dark-mode")) {
    // switch to light mode
    body.classList.remove("dark-mode");
    btn.textContent = "\uD83C\uDF19 Dark Mode";
    // save choice in localStorage
    localStorage.setItem("theme", "light");
  } else {
    // switch to dark mode
    body.classList.add("dark-mode");
    btn.textContent = "\u2600\uFE0F Light Mode";
    // save choice in localStorage
    localStorage.setItem("theme", "dark");
  }
}


// =====================================================
// FUNCTION: loadSavedTheme
// Reads theme from localStorage and applies it
// Called when the page first loads
// =====================================================
function loadSavedTheme() {
  var saved = localStorage.getItem("theme");
  var btn   = document.getElementById("theme-btn");

  if (saved === "dark") {
    document.body.classList.add("dark-mode");
    btn.textContent = "\u2600\uFE0F Light Mode";
  }
}


// =====================================================
// FUNCTION: submitForm
// Validates the contact form fields
// Shows error if any field is empty
// Does NOT send data anywhere (just a frontend demo)
// =====================================================
function submitForm(event) {
  // stop the form from actually submitting / reloading page
  event.preventDefault();

  var name    = document.getElementById("c-name").value;
  var email   = document.getElementById("c-email").value;
  var message = document.getElementById("c-message").value;
  var msgBox  = document.getElementById("form-msg");

  // check if name field is empty
  if (name.trim() === "") {
    msgBox.textContent = "Please enter your name.";
    msgBox.style.color = "tomato";
    return;
  }

  // check if email field is empty
  if (email.trim() === "") {
    msgBox.textContent = "Please enter your email.";
    msgBox.style.color = "tomato";
    return;
  }

  // check if message field is empty
  if (message.trim() === "") {
    msgBox.textContent = "Please write a message.";
    msgBox.style.color = "tomato";
    return;
  }

  // if all fields are filled, show success message
  msgBox.textContent = "Thank you! Your message has been received.";
  msgBox.style.color = "seagreen";

  // clear the form fields after success
  document.getElementById("c-name").value    = "";
  document.getElementById("c-email").value   = "";
  document.getElementById("c-message").value = "";
}


// =====================================================
// FUNCTION: searchGitHub
// Fetches GitHub user profile and repos using the API
// GitHub API allows 60 requests per hour without authentication
// Docs: https://api.github.com/users/USERNAME
// =====================================================
async function searchGitHub() {
  // get the username the user typed
  var username = document.getElementById("gh-username").value.trim();

  // if input is empty, alert the user
  if (username === "") {
    alert("Please type a GitHub username first.");
    return;
  }

  // get all the elements we will need
  var loading  = document.getElementById("gh-loading");
  var errBox   = document.getElementById("gh-error");
  var profile  = document.getElementById("gh-profile");
  var sortCtrl = document.getElementById("sort-controls");
  var repoList = document.getElementById("repo-list");

  // reset everything before new search
  errBox.style.display   = "none";
  errBox.textContent     = "";
  profile.style.display  = "none";
  sortCtrl.style.display = "none";
  repoList.innerHTML     = "";
  allRepos               = [];

  // show loading message while fetching
  loading.style.display = "block";

  // build the API URLs
  var userUrl = "https://api.github.com/users/" + username;
  var repoUrl = "https://api.github.com/users/" + username + "/repos?per_page=100";

  try {
    // fetch user profile first
    var userRes = await fetch(userUrl);

    // check if user was found (status 404 means not found)
    if (userRes.status === 404) {
      loading.style.display = "none";
      errBox.textContent    = "User not found. Please check the username.";
      errBox.style.display  = "block";
      return;
    }

    var userData = await userRes.json();

    // fill in the profile card
    document.getElementById("gh-avatar").src       = userData.avatar_url;
    document.getElementById("gh-name").textContent = userData.name || userData.login;
    document.getElementById("gh-bio").textContent  = userData.bio || "No bio available.";
    document.getElementById("gh-followers").textContent = userData.followers;
    document.getElementById("gh-following").textContent = userData.following;
    document.getElementById("gh-repos").textContent     = userData.public_repos;

    // show the profile card
    profile.style.display = "flex";

    // now fetch the list of repos
    var repoRes  = await fetch(repoUrl);
    var repoData = await repoRes.json();

    // save repos to global variable so we can sort later
    allRepos = repoData;

    // hide loading
    loading.style.display = "none";

    // show sort controls and render repos
    sortCtrl.style.display = "block";
    renderRepos(allRepos);

  } catch (err) {
    // if fetch itself fails (network error etc)
    loading.style.display = "none";
    errBox.textContent    = "Something went wrong. Please try again.";
    errBox.style.display  = "block";
  }
}


// =====================================================
// FUNCTION: renderRepos
// Takes an array of repo objects and builds the list HTML
// Called after fetching repos and also after sorting
// =====================================================
function renderRepos(repos) {
  var list = document.getElementById("repo-list");
  list.innerHTML = ""; // clear list before adding

  // if there are no repos
  if (repos.length === 0) {
    list.innerHTML = "<li>This user has no public repositories.</li>";
    return;
  }

  // loop through each repo and make a list item
  for (var i = 0; i < repos.length; i++) {
    var repo = repos[i];

    var name     = repo.name;
    var stars    = repo.stargazers_count;
    var language = repo.language || "Not specified";

    var li = document.createElement("li");
    li.innerHTML = "<strong>" + name + "</strong>"
                 + "<span>&#11088; " + stars + " stars</span>"
                 + "<span>&#128196; " + language + "</span>";

    list.appendChild(li);
  }
}


// =====================================================
// FUNCTION: sortRepos
// Sorts the global allRepos array based on dropdown choice
// Then re-renders the list
// =====================================================
function sortRepos() {
  var sortBy = document.getElementById("sort-select").value;

  // make a copy of the array so we don't mess up original order
  var sorted = allRepos.slice();

  if (sortBy === "name") {
    // sort alphabetically by repo name
    sorted.sort(function(a, b) {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  } else if (sortBy === "stars") {
    // sort by star count, highest first
    sorted.sort(function(a, b) {
      return b.stargazers_count - a.stargazers_count;
    });
  }

  // render the sorted list
  renderRepos(sorted);
}


// =====================================================
// Run when page loads
// Load saved theme from localStorage
// =====================================================
window.onload = function() {
  loadSavedTheme();
};