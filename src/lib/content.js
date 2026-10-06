export const STORAGE_KEY = "clockwyrd_content";
export const DRAFT_KEY = "clockwyrd_article_draft";

export function getArticles() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function saveArticles(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  window.dispatchEvent(new CustomEvent("clockwyrd-content-updated"));
}

export function upsertArticle(article) {
  const articles = getArticles();
  const index = articles.findIndex((item) => item.id === article.id);
  if (index >= 0) articles[index] = article;
  else articles.unshift(article);
  saveArticles(articles);
  return article;
}

export function deleteArticle(id) {
  saveArticles(getArticles().filter((article) => article.id !== id));
}

export function getArticle(id) {
  return getArticles().find((article) => article.id === id) || null;
}

export function makeSlug(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}
