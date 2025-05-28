<template>
  <div class="page-container">
    <div class="container">
      <div class="news-feed-container">
        <div class="feed-header">
          <h2 class="feed-title">
            <span class="title-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                <path
                  d="m13 21-2.275-6.15L4.575 12.575l.025-.975.025-.975L10.725 8.35 13 2.2l2.275 6.15L21.425 10.625l-.025.975-.025.975-6.15 2.275L13 21Zm0-2.65 1.325-3.6L18.8 13l-1.325-3.6L13 5.8l-1.325 3.6L7.2 13l1.325 3.6L13 18.35Zm0-6.35Z">
                </path>
              </svg>
            </span>
            Tech & Coding Pulse
          </h2>
          <button @click="refreshNews" class="btn btn-sm refresh-btn" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18"
              height="18">
              <path
                d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8Z">
              </path>
            </svg>
            <span v-if="!isLoading">Refresh</span>
          </button>
        </div>
        <div class="header-divider"></div>

        <div v-if="isLoading && !newsItems.length" class="loading-state">
          <div class="pulsing-loader"></div>
          <p>Synthesizing digital consciousness...</p>
        </div>

        <div v-if="error" class="error-message">
          <div class="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm0 15c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1Zm1-5.03c0 .53-.47.91-1 .91s-1-.38-1-.91v-4.02c0-.54.47-.96 1-.96s1 .42 1 .96v4.02Z">
              </path>
            </svg>
          </div>
          <h3>Connection Glitch</h3>
          <p>Unable to fetch latest updates: {{ error }}</p>
          <p>Please check your connection or try refreshing.</p>
        </div>

        <div v-if="!isLoading && !newsItems.length && !error" class="empty-state">
          <div class="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM9.29 16.29L5.7 12.7a.996.996 0 1 1 1.41-1.41L10 14.17l6.88-6.88a.996.996 0 1 1 1.41 1.41l-7.59 7.59a.996.996 0 0 1-1.41 0Z">
              </path>
            </svg>
          </div>
          <h3>All Quiet on the Digital Front</h3>
          <p>No fresh news articles found at this moment. Try refreshing!</p>
        </div>

        <transition-group name="feed-list" tag="div" class="news-grid">
          <div v-for="item in newsItems" :key="item.id" class="news-card">
            <div class="card-image-container">
              <img v-if="item.urlToImage" :src="item.urlToImage" :alt="item.title" class="card-image"
                @error="handleImageError" />
              <div v-else class="card-image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                  <path
                    d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm-4.86 8.86-3 3.87L9 13.14 6 17h12l-3.86-5.14Z">
                  </path>
                </svg>
              </div>
            </div>
            <div class="card-content">
              <div class="card-header">
                <span class="category-tag" :class="`category-${item.category.toLowerCase()}`">
                  {{ item.category }}
                </span>
                <span class="card-source">{{ item.source }}</span>
              </div>
              <h3 class="card-title">
                <a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
              </h3>
              <p class="card-snippet">{{ item.snippet }}</p>
              <div class="card-footer">
                <span class="timestamp">{{ formatTimestamp(item.publishedAt) }}</span>
                <a :href="item.url" target="_blank" rel="noopener noreferrer" class="read-more-link">
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16"
                    height="16">
                    <path d="m13.293 12.707-5-5 .707-.707L14.707 12l-5.707 5.707-.707-.707 5-5Z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const newsItems = ref([]);
const isLoading = ref(false);
const error = ref(null);

const MAX_ARTICLES_PER_CATEGORY = 7; // Max articles to fetch per category from IPC
const MAX_TOTAL_ARTICLES = 12; // Max total articles to display

const fetchNewsFromIPC = async (query, categoryName) => {
  // Ensure window.electron and window.electron.fetchNews exist
  if (!window.electron || typeof window.electron.fetchNews !== 'function') {
    console.error('Electron IPC function (window.electron.fetchNews) not found.');
    throw new Error('News service bridge is not available.');
  }

  // The IPC function `fetchNews` in main.js should handle the actual API call
  // and return { status: 'ok', articles: [...] } or { status: 'error', message: '...' }
  const response = await window.electron.fetchNews(query, categoryName);

  if (response.status !== 'ok') {
    throw new Error(response.message || 'Failed to fetch data via IPC.');
  }

  console.log(response);

  // return response.articles.map(article => ({
  //   id: article.url + article.publishedAt, // Create a more unique ID
  //   category: categoryName,
  //   title: article.title || "No title available",
  //   source: article.source?.name || "Unknown Source",
  //   snippet: article.description || "No snippet available.",
  //   url: article.url,
  //   urlToImage: article.urlToImage || null, // Add image URL
  //   publishedAt: article.publishedAt,
  // })).filter(item => item.title && item.url && !item.title.toLowerCase().includes("[removed]"));

  const articles = await Promise.all(
    response.articles.map(async (article) => {
      let base64Image = null;

      if (article.urlToImage) {
        try {
          // Fetch base64 image via main process
          base64Image = await window.electron.getImageBase64(article.urlToImage);
        } catch (err) {
          console.warn('Image fetch failed:', err.message);
        }
      }

      return {
        id: article.url + article.publishedAt, // Create a more unique ID
        category: categoryName,
        title: article.title || "No title available",
        source: article.source?.name || "Unknown Source",
        snippet: article.description || "No snippet available.",
        url: article.url,
        urlToImage: base64Image, // Base64 fallback
        publishedAt: article.publishedAt,
      };
    })
  );

  // Final filtering (after async)
  const finalArticles = articles.filter(item =>
    item.title &&
    item.url &&
    !item.title.toLowerCase().includes("[removed]")
  );

  return finalArticles;
};

const fetchNews = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  error.value = null;
  console.log("Requesting news via Electron IPC...");

  try {
    // Refined queries for better relevance
    const techQuery = `("latest technology" OR "AI advancements" OR "new gadgets" OR "software innovation" OR "cybersecurity news") AND (NOT ("crypto" OR "nft" OR "stock market" OR "earnings" OR "finance"))`;
    const codingQuery = `("programming languages" OR "software development trends" OR "web development" OR "developer tools" OR "coding best practices" OR "open source projects") AND (NOT ("hiring" OR "jobs" OR "bootcamp" OR "courses"))`;

    // Fetch a bit more per category to have options after deduplication
    const [techArticles, codingArticles] = await Promise.all([
      fetchNewsFromIPC(techQuery, 'Tech'),
      fetchNewsFromIPC(codingQuery, 'Coding')
    ]);

    let combinedArticles = [...techArticles, ...codingArticles];

    const uniqueArticlesMap = new Map();
    combinedArticles.forEach(item => {
      if (!uniqueArticlesMap.has(item.url)) {
        uniqueArticlesMap.set(item.url, item);
      }
    });
    const uniqueArticles = Array.from(uniqueArticlesMap.values());



    uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    newsItems.value = uniqueArticles.slice(0, MAX_TOTAL_ARTICLES);

    if (newsItems.value.length === 0) {
      console.log("No articles found matching criteria from IPC.");
    } else {
      console.log("News fetched via IPC:", newsItems.value.length, "articles");
    }

  } catch (e) {
    console.error("Error fetching news via IPC:", e);
    error.value = e.message;
    newsItems.value = [];
  } finally {
    isLoading.value = false;
  }
};

const refreshNews = () => {
  fetchNews();
};

const gotoEditor = () => {
  router.push('/editor');
  // If this also needs IPC: window.electron.navigateTo('/editor');
};

const logoutUser = () => {
  console.log("Logout button clicked");
  alert("Logout functionality to be implemented (potentially via IPC)!");
  // Example: if (window.electron && window.electron.requestLogout) window.electron.requestLogout();
};

const formatTimestamp = (isoString) => {
  if (!isoString) return 'Just now';
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' +
    date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

const handleImageError = (event) => {
  // Replace broken image with placeholder or hide it
  event.target.style.display = 'none';
  const placeholder = event.target.closest('.card-image-container').querySelector('.card-image-placeholder');
  if (placeholder) placeholder.style.display = 'flex';
}

onMounted(() => {
  fetchNews();
});

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {}

.page-container {
  background-color: var(--bg-color);
  color: var(--text-color);
  min-height: 100vh;
  font-family: var(--font-family-main);
  background-image: url("/images/bg1.jpg");
  /* User requested background */
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  /* Keep bg fixed during scroll */
  background-color: rgba(13, 17, 23, 0.85);
  /* Darken the image for text readability */
  background-blend-mode: multiply;
  padding-bottom: 50px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.main-actions {
  display: flex;
  gap: 12px;
}

.news-feed-container {
  margin-top: 10px;
  padding: 30px;
  background-color: rgba(22, 27, 34, 0.8);
  /* Slightly more opaque for content */
  border-radius: 12px;
  border: 1px solid var(--border-color);
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  box-shadow: var(--shadow-lg);
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  /* Reduced margin, divider adds space */
}

.feed-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-color-headings);
  display: flex;
  align-items: center;
  gap: 12px;
}

.feed-title .title-icon svg {
  color: var(--accent-primary);
  filter: drop-shadow(0 0 8px rgba(88, 166, 255, 0.5));
}

.header-divider {
  height: 1px;
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary), transparent);
  margin-bottom: 30px;
  opacity: 0.5;
}


.refresh-btn {
  background: transparent;
  color: var(--accent-secondary);
  border: 1px solid var(--accent-secondary);
  padding: 8px 18px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 0.9rem;
}

.refresh-btn svg {
  transition: transform 0.5s ease;
}

.refresh-btn:hover:not(:disabled) {
  background-color: rgba(247, 120, 186, 0.1);
  box-shadow: 0 0 10px rgba(247, 120, 186, 0.3);
  transform: translateY(-1px);
}

.refresh-btn:hover:not(:disabled) svg {
  transform: rotate(180deg);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--text-color-muted);
  color: var(--text-color-muted);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--accent-secondary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* --- States: Loading, Error, Empty --- */
.loading-state,
.error-message,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-color-muted);
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  margin: 30px 0;
  background-color: rgba(0, 0, 0, 0.1);
}

.error-message h3,
.empty-state h3 {
  color: var(--text-color-headings);
  font-size: 1.3rem;
  margin-top: 15px;
  margin-bottom: 10px;
}

.error-message .error-icon svg {
  color: var(--accent-secondary);
}

.empty-state .empty-icon svg {
  color: var(--accent-tertiary);
}

.pulsing-loader {
  /* Modernized triple dot pulse */
  position: relative;
  width: 80px;
  height: 20px;
  margin: 0 auto 25px auto;
}

.pulsing-loader::before,
.pulsing-loader::after,
.pulsing-loader span {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background-color: var(--accent-primary);
  border-radius: 50%;
  animation: pulseDot 1.4s infinite ease-in-out both;
}

.pulsing-loader::before {
  left: 8px;
  animation-delay: -0.32s;
}

.pulsing-loader span {
  left: 34px;
}

/* Needs a span element in the div */
.pulsing-loader::after {
  left: 60px;
  animation-delay: -0.16s;
}

@keyframes pulseDot {

  0%,
  80%,
  100% {
    transform: translateY(-50%) scale(0.6);
    opacity: 0.5;
  }

  40% {
    transform: translateY(-50%) scale(1);
    opacity: 1;
  }
}


/* --- News Grid & Cards --- */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.news-card {
  background-color: var(--card-bg);
  border-radius: 10px;
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.news-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg), 0 0 20px rgba(88, 166, 255, 0.1);
  border-color: var(--accent-primary);
}

.card-image-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  /* For responsive images */
  background-color: var(--bg-color-lightened);
  overflow: hidden;
  position: relative;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.news-card:hover .card-image {
  transform: scale(1.05);
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-muted);
}

.card-image-placeholder svg {
  width: 50px;
  height: 50px;
  opacity: 0.5;
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.category-tag {
  padding: 4px 12px;
  border-radius: 15px;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
}

.category-tech {
  border-color: var(--accent-quaternary);
  color: var(--accent-quaternary);
  background-color: rgba(163, 113, 247, 0.1);
}

.category-coding {
  border-color: var(--accent-tertiary);
  color: var(--accent-tertiary);
  background-color: rgba(63, 185, 80, 0.1);
}

.card-source {
  font-size: 0.8rem;
  color: var(--text-color-muted);
}

.card-title {
  font-size: 1.15rem;
  margin-bottom: 10px;
  font-weight: 600;
  line-height: 1.4;
  flex-grow: 1;
  /* Allow title to take space */
}

.card-title a {
  color: var(--text-color-headings);
  text-decoration: none;
  transition: color 0.2s ease;
}

.card-title a:hover {
  color: var(--accent-primary);
}

.card-snippet {
  font-size: 0.9rem;
  color: var(--text-color-muted);
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /* Max 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}

.card-footer {
  margin-top: auto;
  /* Pushes footer to bottom */
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.timestamp {
  color: var(--text-color-muted);
}

.read-more-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s ease, gap 0.2s ease;
}

.read-more-link svg {
  transition: transform 0.2s ease;
}

.read-more-link:hover {
  color: lighten(var(--accent-primary), 10%);
  gap: 6px;
}

.read-more-link:hover svg {
  transform: translateX(2px);
}


/* --- Feed List Transitions --- */
.feed-list-enter-active,
.feed-list-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.feed-list-enter-from,
.feed-list-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.feed-list-move {
  transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>