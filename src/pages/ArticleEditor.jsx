import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "clockwyrd_content";

function getArticles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveArticles(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

export default function ArticleEditor() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("News");
  const [status, setStatus] = useState("");

  useEffect(() => {
  const draft = localStorage.getItem("clockwyrd_article_draft");

  if (!draft) return;

  try {
    const data = JSON.parse(draft);

    const timer = setTimeout(() => {
      setTitle(data.title || "");
      setExcerpt(data.excerpt || "");
      setContent(data.content || "");
      setCategory(data.category || "News");
    }, 0);

    return () => clearTimeout(timer);
  } catch {
    localStorage.removeItem("clockwyrd_article_draft");
  }
}, []);

  const buildArticle = (articleStatus) => ({
    id: Date.now().toString(),
    title: title.trim() || "Untitled article",
    excerpt: excerpt.trim(),
    content,
    category,
    status: articleStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const saveDraft = () => {
    const article = buildArticle("draft");

    const articles = getArticles();

    articles.unshift(article);
    saveArticles(articles);

    localStorage.removeItem("clockwyrd_article_draft");

    setStatus("Draft saved.");

    setTimeout(() => {
      navigate("/content");
    }, 500);
  };

  const publish = () => {
    if (!title.trim()) {
      setStatus("Give the article a title first.");
      return;
    }

    if (!content.trim()) {
      setStatus("Write some content before publishing.");
      return;
    }

    const article = buildArticle("published");

    const articles = getArticles();

    articles.unshift(article);
    saveArticles(articles);

    localStorage.removeItem("clockwyrd_article_draft");

    setStatus("Article published.");

    setTimeout(() => {
      navigate("/content");
    }, 500);
  };

  const saveTemporaryDraft = () => {
    localStorage.setItem(
      "clockwyrd_article_draft",
      JSON.stringify({
        title,
        excerpt,
        content,
        category,
      })
    );

    setStatus("Draft saved locally.");
  };

  return (
    <main className="min-h-[100dvh] bg-[#07101d] text-[#edf5ff]">
      <div className="mx-auto w-[min(100%-32px,1000px)] py-10 sm:py-14">

        {/* HEADER */}
        <header className="flex flex-col gap-6 border-b border-[rgba(183,214,255,.12)] pb-8 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="cw-label text-[#6fa8ff]">
              CLOCKWYRD / MEDIA / EDITOR
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-[-0.05em] sm:text-6xl">
              Write.
            </h1>

            <p className="cw-copy mt-4 max-w-xl">
              Create a new article for the CLOCKWYRD media ecosystem.
            </p>
          </div>

          <button
            onClick={() => navigate("/content")}
            className="self-start border border-[rgba(183,214,255,.14)] px-4 py-3 text-sm text-[#8ea2ba] transition hover:bg-[#0d1b2d] hover:text-white"
          >
            ← Back to content
          </button>

        </header>

        {/* EDITOR */}
        <section className="mt-10">

          {/* TITLE */}
          <div>
            <label className="cw-label">
              Title
            </label>

            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Article title..."
              className="mt-3 w-full border-b border-[rgba(183,214,255,.16)] bg-transparent py-4 text-3xl font-semibold outline-none placeholder:text-[#33465e] focus:border-[#6fa8ff] sm:text-4xl"
            />
          </div>

          {/* META */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">

            <div>
              <label className="cw-label">
                Category
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-3 w-full border border-[rgba(183,214,255,.14)] bg-[#0a1727] px-4 py-3 text-sm text-white outline-none focus:border-[#6fa8ff]"
              >
                <option>News</option>
                <option>Culture</option>
                <option>Community</option>
                <option>Technology</option>
                <option>Opinion</option>
                <option>Announcement</option>
              </select>
            </div>

            <div>
              <label className="cw-label">
                Excerpt
              </label>

              <input
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                placeholder="Short description..."
                className="mt-3 w-full border border-[rgba(183,214,255,.14)] bg-[#0a1727] px-4 py-3 text-sm text-white outline-none placeholder:text-[#52647a] focus:border-[#6fa8ff]"
              />
            </div>

          </div>

          {/* CONTENT */}
          <div className="mt-8">

            <label className="cw-label">
              Article
            </label>

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Start writing..."
              className="mt-3 min-h-[420px] w-full resize-y border border-[rgba(183,214,255,.14)] bg-[#0a1727] p-5 text-base leading-8 text-white outline-none placeholder:text-[#52647a] focus:border-[#6fa8ff]"
            />

          </div>

          {/* ACTION BAR */}
          <div className="mt-6 flex flex-col gap-4 border-y border-[rgba(183,214,255,.12)] py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              {status ? (
                <p className="text-sm text-[#8ea2ba]">
                  {status}
                </p>
              ) : (
                <p className="text-sm text-[#52647a]">
                  Changes are stored locally until published.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={saveTemporaryDraft}
                className="border border-[rgba(183,214,255,.14)] px-5 py-3 text-sm text-[#8ea2ba] transition hover:bg-[#0d1b2d] hover:text-white"
              >
                Save draft
              </button>

              <button
                onClick={saveDraft}
                className="border border-[#6fa8ff]/30 bg-[#0d1b2d] px-5 py-3 text-sm text-[#b8d8ff] transition hover:bg-[#132740]"
              >
                Save & exit
              </button>

              <button
                onClick={publish}
                className="bg-[#b8d8ff] px-6 py-3 text-sm font-semibold text-[#07101d] transition hover:bg-white"
              >
                Publish
              </button>

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}