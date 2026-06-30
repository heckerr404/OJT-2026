// script.js - Live News Feed
// Uses only college syllabus topics: fetch, async/await, try/catch,
// getElementById, innerHTML, createElement, appendChild, forEach, template literals

// Base URL for RSS-to-JSON conversion service (no API key needed)
const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

// RSS feed URLs for each category
const FEEDS = {
  technology:    "https://www.hindustantimes.com/feeds/rss/technology/rssfeed.xml",
  general:       "https://www.hindustantimes.com/feeds/rss/topnews/rssfeed.xml",
  sports:        "https://www.hindustantimes.com/feeds/rss/sports/rssfeed.xml",
  business:      "https://www.hindustantimes.com/feeds/rss/business/rssfeed.xml",
  entertainment: "https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml"
};

// Grab the elements we will update frequently
const grid    = document.getElementById("news-grid");
const spinner = document.getElementById("spinner");
const errorEl = document.getElementById("error-msg");

// Shows the loading spinner and clears old content
function showLoading() {
  spinner.style.display = "block";
  grid.innerHTML        = "";
  errorEl.textContent   = "";
}

// Hides the loading spinner
function hideLoading() {
  spinner.style.display = "none";
}

// Returns a nicely formatted date string like "16 Jun 2026"
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Strips HTML tags from a string (RSS descriptions often contain HTML)
function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// Builds and returns a single news card DOM element
function createCard(item) {
  const card = document.createElement("div");
  card.className = "news-card";

  const desc   = stripHtml(item.description || "").substring(0, 120) + "...";
  const imgSrc = item.thumbnail || "";

  const imgHTML = imgSrc
    ? `<img class="card-img" src="${imgSrc}" alt="" onerror="this.style.display='none'" />`
    : `<div class="card-img"></div>`;

  card.innerHTML = `
    ${imgHTML}
    <div class="card-body">
      <p class="card-source">Hindustan Times</p>
      <p class="card-title">${item.title}</p>
      <p class="card-desc">${desc}</p>
      <p class="card-date">${formatDate(item.pubDate)}</p>
      <a class="card-link" href="${item.link}" target="_blank" rel="noopener">Read More \u2192</a>
    </div>
  `;

  return card;
}

// Fetches and displays news articles for the given category
async function fetchNews(category) {
  showLoading();
  try {
    const rssUrl = FEEDS[category] || FEEDS.general;
    const url    = RSS2JSON + encodeURIComponent(rssUrl);

    const res = await fetch(url);
    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();
    hideLoading();

    if (!data.items || data.items.length === 0) {
      errorEl.textContent = "No articles found. Try another category.";
      return;
    }

    // Show up to 9 articles
    data.items.slice(0, 9).forEach(function (item) {
      grid.appendChild(createCard(item));
    });

  } catch (err) {
    hideLoading();
    errorEl.textContent = "Could not load news. Please try again.";
  }
}

// Removes the active class from all category buttons, adds it to the clicked one
function loadCategory(category, btn) {
  document.querySelectorAll(".cat-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  btn.classList.add("active");
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = "";
  }
  fetchNews(category);
}

// Apply saved theme and load the default category on page start
applyTheme();
fetchNews("technology");
