const $ = id => document.getElementById(id);
let allRepos = [];

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  $("theme-btn").textContent = isDark ? "Light Mode" : " Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

function loadSavedTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    $("theme-btn").textContent = "☀️ Light Mode";
  }
}

async function searchGitHub() {
  const username = $("gh-username").value.trim();
  if (!username) return alert("Please enter a GitHub username.");

  const loading = $("gh-loading"), errBox = $("gh-error"), profileBox = $("gh-profile");
  const sortControls = $("sort-controls"), repoCount = $("repo-count"), repoList = $("repo-list");

  errBox.style.display = profileBox.style.display = sortControls.style.display = repoCount.style.display = "none";
  errBox.textContent = repoList.innerHTML = "";
  allRepos = [];
  loading.style.display = "block";

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (userRes.status === 404) {
      throw new Error(`User "${username}" not found. Check the spelling.`);
    }

    const user = await userRes.json();
    $("gh-avatar").src = user.avatar_url;
    $("gh-name").textContent = user.name || user.login;
    $("gh-bio").textContent = user.bio || "No bio available.";
    $("gh-followers").textContent = user.followers;
    $("gh-following").textContent = user.following;
    $("gh-repos").textContent = user.public_repos;
    $("gh-profile-link").href = user.html_url;
    profileBox.style.display = "flex";

    const repoRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    allRepos = await repoRes.json();

    loading.style.display = "none";
    repoCount.textContent = `Showing ${allRepos.length} public repositories`;
    repoCount.style.display = sortControls.style.display = "block";
    renderRepos(allRepos);
  } catch (err) {
    loading.style.display = "none";
    errBox.textContent = err.message.includes("not found") ? err.message : "Something went wrong. Check your internet connection.";
    errBox.style.display = "block";
  }
}

function renderRepos(repos) {
  const list = $("repo-list");
  list.innerHTML = repos.length ? repos.map(r => `
    <li>
      <a class="repo-name" href="${r.html_url}" target="_blank">${r.name}</a>
      <div class="repo-meta">
        <span>⭐ ${r.stargazers_count}</span>
        <span>🍴 ${r.forks_count}</span>
        <span>📄 ${r.language || "N/A"}</span>
      </div>
    </li>
  `).join("") : "<li>No public repositories found.</li>";
}

function sortRepos() {
  const sortBy = $("sort-select").value;
  const sorted = [...allRepos].sort((a, b) =>
    sortBy === "name" ? a.name.localeCompare(b.name) : b.stargazers_count - a.stargazers_count
  );
  renderRepos(sorted);
}

window.onload = () => {
  loadSavedTheme();
  $("gh-username").addEventListener("keyup", e => e.key === "Enter" && searchGitHub());
};