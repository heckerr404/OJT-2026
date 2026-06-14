// =====================================================
// script.js - GitHub Developer Explorer
// Standalone JavaScript file
// Plain beginner-style code: var, regular functions, for loops
// GitHub API allows 60 requests per hour without authentication
// API docs: https://docs.github.com/en/rest/users/users
// =====================================================


// global variable to store all repos so we can sort without re-fetching
var allRepos = [];


// =====================================================
// FUNCTION: toggleTheme
// Switches body between dark mode and light mode
// Saves the choice to localStorage so it stays on reload
// =====================================================
function toggleTheme() {
  var body = document.body;
  var btn  = document.getElementById("theme-btn");

  // check if dark mode is already active
  if (body.classList.contains("dark-mode")) {
    // remove dark mode - go to light
    body.classList.remove("dark-mode");
    btn.textContent = "\uD83C\uDF19 Dark Mode";
    localStorage.setItem("theme", "light");
  } else {
    // add dark mode class
    body.classList.add("dark-mode");
    btn.textContent = "\u2600\uFE0F Light Mode";
    localStorage.setItem("theme", "dark");
  }
}


// =====================================================
// FUNCTION: loadSavedTheme
// Reads saved theme from localStorage when page loads
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
// FUNCTION: searchGitHub
// Main function triggered when user clicks Search
// Fetches user profile first, then their repos
// NOTE: GitHub API allows 60 requests per hour without a token
// =====================================================
async function searchGitHub() {
  // read the username from the input box
  var username = document.getElementById("gh-username").value.trim();

  // do nothing if input is empty
  if (username === "") {
    alert("Please enter a GitHub username first.");
    return;
  }

  // grab all the elements we will show/hide
  var loading     = document.getElementById("gh-loading");
  var errBox      = document.getElementById("gh-error");
  var profileBox  = document.getElementById("gh-profile");
  var sortControls = document.getElementById("sort-controls");
  var repoList    = document.getElementById("repo-list");
  var repoCount   = document.getElementById("repo-count");

  // reset everything before a new search
  errBox.style.display      = "none";
  errBox.textContent        = "";
  profileBox.style.display  = "none";
  sortControls.style.display = "none";
  repoCount.style.display   = "none";
  repoList.innerHTML        = "";
  allRepos                  = [];

  // show loading message
  loading.style.display = "block";

  // build the two API URLs
  var userUrl = "https://api.github.com/users/" + username;
  var repoUrl = "https://api.github.com/users/" + username + "/repos?per_page=100&sort=updated";

  try {

    // ---- STEP 1: Fetch user profile ----
    var userResponse = await fetch(userUrl);

    // 404 means username does not exist on GitHub
    if (userResponse.status === 404) {
      loading.style.display = "none";
      errBox.textContent    = "User \"" + username + "\" not found on GitHub. Please check the spelling.";
      errBox.style.display  = "block";
      return;
    }

    // convert response to a JavaScript object
    var userData = await userResponse.json();

    // fill the profile card with fetched data
    document.getElementById("gh-avatar").src           = userData.avatar_url;
    document.getElementById("gh-name").textContent     = userData.name || userData.login;
    document.getElementById("gh-bio").textContent      = userData.bio || "No bio available.";
    document.getElementById("gh-followers").textContent = userData.followers;
    document.getElementById("gh-following").textContent = userData.following;
    document.getElementById("gh-repos").textContent    = userData.public_repos;
    document.getElementById("gh-profile-link").href    = userData.html_url;

    // show the profile card
    profileBox.style.display = "flex";

    // ---- STEP 2: Fetch user repositories ----
    var repoResponse = await fetch(repoUrl);
    var repoData     = await repoResponse.json();

    // save to global so sort function can access it
    allRepos = repoData;

    // hide loading now that data is ready
    loading.style.display = "none";

    // show how many repos were found
    repoCount.textContent  = "Showing " + allRepos.length + " public repositories";
    repoCount.style.display = "block";

    // show sort controls and render the list
    sortControls.style.display = "block";
    renderRepos(allRepos);

  } catch (err) {
    // this catches network errors (no internet, etc.)
    loading.style.display = "none";
    errBox.textContent    = "Something went wrong. Please check your internet connection and try again.";
    errBox.style.display  = "block";
  }
}


// =====================================================
// FUNCTION: renderRepos
// Takes an array of repo objects and builds the HTML list
// Called after fetching and also every time user sorts
// =====================================================
function renderRepos(repos) {
  var list = document.getElementById("repo-list");

  // clear any previous list items
  list.innerHTML = "";

  // handle empty repo list
  if (repos.length === 0) {
    list.innerHTML = "<li>This user has no public repositories.</li>";
    return;
  }

  // loop through each repo and make a list item
  for (var i = 0; i < repos.length; i++) {
    var repo = repos[i];

    // get the values we want to show
    var repoName = repo.name;
    var stars    = repo.stargazers_count;
    var lang     = repo.language || "Not specified";
    var repoLink = repo.html_url;
    var forks    = repo.forks_count;

    // create a new list item element
    var li = document.createElement("li");

    // build the inner HTML for this repo item
    li.innerHTML =
      "<a class='repo-name' href='" + repoLink + "' target='_blank'>" + repoName + "</a>" +
      "<div class='repo-meta'>" +
        "<span>&#11088; " + stars + " stars</span>" +
        "<span>&#127860; " + forks + " forks</span>" +
        "<span>&#128196; " + lang + "</span>" +
      "</div>";

    // add the item to the list
    list.appendChild(li);
  }
}


// =====================================================
// FUNCTION: sortRepos
// Sorts the global allRepos array by name or stars
// Then calls renderRepos to redraw the list
// =====================================================
function sortRepos() {
  var sortBy = document.getElementById("sort-select").value;

  // copy array so original order is not lost
  var sorted = allRepos.slice();

  if (sortBy === "name") {
    // sort A to Z by repo name
    sorted.sort(function(a, b) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    });
  } else if (sortBy === "stars") {
    // sort by stars, highest first
    sorted.sort(function(a, b) {
      return b.stargazers_count - a.stargazers_count;
    });
  }

  // re-render with sorted array
  renderRepos(sorted);
}


// =====================================================
// also allow pressing Enter key in the input box to search
// =====================================================
function handleEnterKey(event) {
  // key code 13 = Enter key
  if (event.keyCode === 13) {
    searchGitHub();
  }
}


// Run when the page finishes loading
//Run
window.onload = function() {
  // apply saved theme from localStorage
  loadSavedTheme();

  // add Enter key listener to search input
  var input = document.getElementById("gh-username");
  input.addEventListener("keyup", handleEnterKey);
};
