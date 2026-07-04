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

// Current active category
let currentCategory = "technology";

// In-memory cache of current category's articles for filtering
let fetchedArticles = [];

// Grab the elements we will update frequently
const grid    = document.getElementById("news-grid");
const errorEl = document.getElementById("error-msg");

// Shows the skeleton loading shimmer cards and clears old content
function showLoading() {
  grid.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = "skeleton-card";
    skeleton.innerHTML = `
      <div class="skeleton-img shimmer"></div>
      <div class="skeleton-body">
        <div class="skeleton-source shimmer"></div>
        <div class="skeleton-title shimmer"></div>
        <div class="skeleton-desc shimmer"></div>
        <div class="skeleton-desc shimmer" style="width: 80%;"></div>
        <div class="skeleton-footer">
          <div class="skeleton-date shimmer"></div>
          <div class="skeleton-link shimmer"></div>
        </div>
      </div>
    `;
    grid.appendChild(skeleton);
  }
  errorEl.textContent = "";
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

// Extract image from thumbnail, enclosure, or HTML content
function extractImage(item) {
  if (item.thumbnail) return item.thumbnail;
  if (item.enclosure && item.enclosure.link) return item.enclosure.link;
  
  // Extract first image from description/content HTML
  const htmlString = (item.description || "") + (item.content || "");
  const match = htmlString.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && match[1]) {
    return match[1];
  }
  return "";
}

// Get modern category gradient
function getCategoryGradient(category) {
  const gradients = {
    technology: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    general: "linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)",
    sports: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    business: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)",
    entertainment: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)"
  };
  return gradients[category] || gradients.general;
}

// Get category icon
function getCategoryIcon(category) {
  const icons = {
    technology: "💻",
    general: "📰",
    sports: "⚽",
    business: "📈",
    entertainment: "🎬"
  };
  return icons[category] || "📰";
}

// Replace failed image with themed placeholder
function handleImgError(img, category) {
  const container = img.parentNode;
  if (!container) return;
  const placeholder = document.createElement("div");
  placeholder.className = "card-img placeholder";
  placeholder.style.background = getCategoryGradient(category);
  placeholder.innerHTML = `<span class="placeholder-icon">${getCategoryIcon(category)}</span>`;
  container.replaceChild(placeholder, img);
}

// Builds and returns a single news card DOM element
function createCard(item, category) {
  const card = document.createElement("div");
  card.className = "news-card";

  const desc   = stripHtml(item.description || "").substring(0, 120) + "...";
  const imgSrc = extractImage(item);

  const imgHTML = imgSrc
    ? `<img class="card-img" src="${imgSrc}" alt="" onerror="handleImgError(this, '${category}')" loading="lazy" />`
    : `<div class="card-img placeholder" style="background: ${getCategoryGradient(category)}">
         <span class="placeholder-icon">${getCategoryIcon(category)}</span>
       </div>`;

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

// Filter news based on search input
function filterNews() {
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("clear-search");
  if (!searchInput) return;

  const query = searchInput.value.toLowerCase().trim();
  
  if (clearBtn) {
    clearBtn.style.display = query ? "block" : "none";
  }

  // Filter articles
  const filtered = fetchedArticles.filter(function (item) {
    const title = (item.title || "").toLowerCase();
    const desc = stripHtml(item.description || "").toLowerCase();
    return title.includes(query) || desc.includes(query);
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    errorEl.textContent = "No articles match your search.";
    return;
  }

  errorEl.textContent = "";
  filtered.forEach(function (item) {
    grid.appendChild(createCard(item, currentCategory));
  });
}

// Clear search input and restore full list
function clearSearch() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = "";
    filterNews();
  }
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
    grid.innerHTML = ""; // Clear skeletons

    fetchedArticles = data.items || [];
    currentCategory = category;

    if (fetchedArticles.length === 0) {
      errorEl.textContent = "No articles found. Try another category.";
      return;
    }

    // Show up to 12 articles
    fetchedArticles.slice(0, 12).forEach(function (item) {
      grid.appendChild(createCard(item, category));
    });

  } catch (err) {
    grid.innerHTML = ""; // Clear skeletons
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
  const clearBtn = document.getElementById("clear-search");
  if (searchInput) {
    searchInput.value = "";
  }
  if (clearBtn) {
    clearBtn.style.display = "none";
  }
  
  fetchNews(category);
}

// Apply saved theme and load the default category on page start
applyTheme();
fetchNews("technology");
