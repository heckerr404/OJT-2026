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

// Caching configuration
const CACHE_KEY_PREFIX = "news_feed_";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Read cached feed items
function getCachedData(category) {
  try {
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + category);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    const age = Date.now() - parsed.timestamp;
    if (age < CACHE_TTL) {
      return parsed.data;
    }
    localStorage.removeItem(CACHE_KEY_PREFIX + category);
  } catch (e) {
    console.error("Cache read error", e);
  }
  return null;
}

// Write feed items to local storage cache
function setCachedData(category, data) {
  try {
    const cacheObj = {
      timestamp: Date.now(),
      data: data
    };
    localStorage.setItem(CACHE_KEY_PREFIX + category, JSON.stringify(cacheObj));
  } catch (e) {
    console.error("Cache write error", e);
  }
}

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

// Calculate estimated reading time in minutes
function getReadingTime(title, description) {
  const text = (title || "") + " " + (description || "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Copy article link to clipboard and show toast
function shareArticle(event, link) {
  event.preventDefault();
  event.stopPropagation();
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link).then(function() {
      showToast("Link copied to clipboard!");
    }).catch(function() {
      showToast("Failed to copy link.");
    });
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = link;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      showToast("Link copied to clipboard!");
    } catch (err) {
      showToast("Failed to copy link.");
    }
    document.body.removeChild(textarea);
  }
}

// Display temporary popup toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = "show";
  setTimeout(function () {
    toast.className = "";
  }, 2500);
}

// Builds and returns a single news card DOM element
function createCard(item, category) {
  const card = document.createElement("div");
  card.className = "news-card";

  const cleanDesc = stripHtml(item.description || "");
  const desc   = cleanDesc.substring(0, 120) + "...";
  const imgSrc = extractImage(item);
  const readingTime = getReadingTime(item.title, cleanDesc);

  const imgHTML = imgSrc
    ? `<img class="card-img" src="${imgSrc}" alt="" onerror="handleImgError(this, '${category}')" loading="lazy" />`
    : `<div class="card-img placeholder" style="background: ${getCategoryGradient(category)}">
         <span class="placeholder-icon">${getCategoryIcon(category)}</span>
       </div>`;

  card.innerHTML = `
    ${imgHTML}
    <div class="card-body">
      <div class="card-meta">
        <span class="card-source">Hindustan Times</span>
        <span class="card-reading-time">⏱️ ${readingTime} min read</span>
      </div>
      <p class="card-title">${item.title}</p>
      <p class="card-desc">${desc}</p>
      <div class="card-footer">
        <p class="card-date">${formatDate(item.pubDate)}</p>
        <div class="card-actions">
          <button class="card-share-btn" onclick="shareArticle(event, '${item.link}')" title="Copy article link">
            &#128203; Share
          </button>
          <a class="card-link" href="${item.link}" target="_blank" rel="noopener">Read More &rarr;</a>
        </div>
      </div>
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

// Fetches and displays news articles for the given category (with localStorage cache check)
async function fetchNews(category) {
  showLoading();
  currentCategory = category;

  // Check cache first
  const cachedData = getCachedData(category);
  if (cachedData) {
    grid.innerHTML = ""; // Clear skeletons
    fetchedArticles = cachedData;
    if (fetchedArticles.length === 0) {
      errorEl.textContent = "No articles found. Try another category.";
      return;
    }
    fetchedArticles.slice(0, 12).forEach(function (item) {
      grid.appendChild(createCard(item, category));
    });
    return;
  }

  try {
    const rssUrl = FEEDS[category] || FEEDS.general;
    const url    = RSS2JSON + encodeURIComponent(rssUrl);

    const res = await fetch(url);
    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();
    grid.innerHTML = ""; // Clear skeletons

    fetchedArticles = data.items || [];
    setCachedData(category, fetchedArticles);

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
