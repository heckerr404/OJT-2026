var allRepos = [];

function toggleTheme() {
  var isDark = document.body.classList.toggle("dark-mode");
  document.getElementById("theme-btn").textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function loadSavedTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("theme-btn").textContent = "☀️ Light Mode";
  }
}

async function searchGitHub() {
  var username = document.getElementById("gh-username").value.trim();
  if (!username) { alert("Please enter a GitHub username."); return; }

  // grab elements
  var loading      = document.getElementById("gh-loading");
  var errBox       = document.getElementById("gh-error");
  var profileBox   = document.getElementById("gh-profile");
  var sortControls = document.getElementById("sort-controls");
  var repoCount    = document.getElementById("repo-count");
  var repoList     = document.getElementById("repo-list");

  // reset UI
  errBox.style.display = profileBox.style.display = "none";
  sortControls.style.display = repoCount.style.display = "none";
  errBox.textContent = repoList.innerHTML = "";
  allRepos = [];
  loading.style.display = "block";

  try {
    var userRes = await fetch("https://api.github.com/users/" + username);

    if (userRes.status === 404) {
      errBox.textContent = 'User "' + username + '" not found. Check the spelling.';
      errBox.style.display = "block";
      loading.style.display = "none";
      return;
    }

    var user = await userRes.json();

    // fill profile card
    document.getElementById("gh-avatar").src          = user.avatar_url;
    document.getElementById("gh-name").textContent    = user.name || user.login;
    document.getElementById("gh-bio").textContent     = user.bio || "No bio available.";
    document.getElementById("gh-followers").textContent = user.followers;
    document.getElementById("gh-following").textContent = user.following;
    document.getElementById("gh-repos").textContent   = user.public_repos;
    document.getElementById("gh-profile-link").href   = user.html_url;
    profileBox.style.display = "flex";

    // fetch repos
    var repoRes = await fetch("https://api.github.com/users/" + username + "/repos?per_page=100&sort=updated");
    allRepos = await repoRes.json();

    loading.style.display = "none";
    repoCount.textContent = "Showing " + allRepos.length + " public repositories";
    repoCount.style.display = sortControls.style.display = "block";
    renderRepos(allRepos);

  } catch (err) {
    loading.style.display = "none";
    errBox.textContent = "Something went wrong. Check your internet connection.";
    errBox.style.display = "block";
  }
}

function renderRepos(repos) {
  var list = document.getElementById("repo-list");
  list.innerHTML = "";

  if (repos.length === 0) {
    list.innerHTML = "<li>No public repositories found.</li>";
    return;
  }

  for (var i = 0; i < repos.length; i++) {
    var r  = repos[i];
    var li = document.createElement("li");
    li.innerHTML =
      "<a class='repo-name' href='" + r.html_url + "' target='_blank'>" + r.name + "</a>" +
      "<div class='repo-meta'>" +
        "<span>⭐ " + r.stargazers_count + "</span>" +
        "<span>🍴 " + r.forks_count + "</span>" +
        "<span>📄 " + (r.language || "N/A") + "</span>" +
      "</div>";
    list.appendChild(li);
  }
}

function sortRepos() {
  var sortBy = document.getElementById("sort-select").value;
  var sorted = allRepos.slice();

  if (sortBy === "name") {
    sorted.sort(function(a, b) { return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1; });
  } else {
    sorted.sort(function(a, b) { return b.stargazers_count - a.stargazers_count; });
  }

  renderRepos(sorted);
}

window.onload = function() {
  loadSavedTheme();
  document.getElementById("gh-username").addEventListener("keyup", function(e) {
    if (e.keyCode === 13) searchGitHub();
  });
};