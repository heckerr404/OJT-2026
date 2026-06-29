const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

const FEEDS = {
  technology:    "https://www.hindustantimes.com/feeds/rss/technology/rssfeed.xml",
  general:       "https://www.hindustantimes.com/feeds/rss/topnews/rssfeed.xml",
  sports:        "https://www.hindustantimes.com/feeds/rss/sports/rssfeed.xml",
  business:      "https://www.hindustantimes.com/feeds/rss/business/rssfeed.xml",
  entertainment: "https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml"
};

const grid    = document.getElementById("news-grid");
const spinner = document.getElementById("spinner");
const errorEl = document.getElementById("error-msg");

function showLoading() {
  spinner.style.display = "block";
  grid.innerHTML        = "";
  errorEl.textContent   = "";
}

function hideLoading() {
  spinner.style.display = "none";
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

// Simple HTML stripping using regex
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, "");
}

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

    // Render first 9 items using standard loop
    const items = data.items.slice(0, 9);
    for (let i = 0; i < items.length; i++) {
      grid.appendChild(createCard(items[i]));
    }

  } catch (err) {
    hideLoading();
    errorEl.textContent = "Could not load news. Please try again.";
  }
}

function loadCategory(category, btn) {
  document.querySelectorAll(".cat-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  btn.classList.add("active");
  document.getElementById("search-input").value = "";
  fetchNews(category);
}

applyTheme();
fetchNews("technology");