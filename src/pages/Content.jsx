import { useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "clockwyrd_content";

function getArticles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function Content() {
  const navigate = useNavigate();

  const [articles] = useState(() => getArticles());

  const published = articles.filter(
    (article) => article.status === "published"
  );

  const drafts = articles.filter(
    (article) => article.status === "draft"
  );

  return (
    <main className="min-h-[100dvh] bg-[#07101d] text-[#edf5ff]">
      <div className="mx-auto w-[min(100%-32px,1100px)] py-10 sm:py-14">

        {/* HEADER */}
        <header className="flex flex-col gap-6 border-b border-[rgba(183,214,255,.12)] pb-8 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="cw-label text-[#6fa8ff]">
              CLOCKWYRD / MEDIA
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-[-0.05em] sm:text-6xl">
              Content.
            </h1>

            <p className="cw-copy mt-4 max-w-xl">
              Publish, manage, and organize the editorial layer
              of the CLOCKWYRD ecosystem.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="self-start border border-[rgba(183,214,255,.14)] px-4 py-3 text-sm text-[#8ea2ba] transition hover:bg-[#0d1b2d] hover:text-white"
          >
            ← Dashboard
          </button>

        </header>

        {/* OVERVIEW */}
        <section className="mt-10 grid gap-px overflow-hidden border border-[rgba(183,214,255,.12)] bg-[rgba(183,214,255,.08)] sm:grid-cols-3">

          <div className="bg-[#081321] p-6">
            <p className="cw-label">Published</p>
            <p className="mt-3 text-3xl font-semibold">
              {published.length}
            </p>
          </div>

          <div className="bg-[#081321] p-6">
            <p className="cw-label">Drafts</p>
            <p className="mt-3 text-3xl font-semibold">
              {drafts.length}
            </p>
          </div>

          <div className="bg-[#081321] p-6">
            <p className="cw-label">Views</p>
            <p className="mt-3 text-3xl font-semibold">
              —
            </p>
          </div>

        </section>

        {/* CREATE */}
        <section className="mt-12">

          <div className="flex items-end justify-between">
            <div>
              <p className="cw-label text-[#6fa8ff]">
                Create
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                Start publishing
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <button
              onClick={() => navigate("/content/new")}
              className="group border border-[rgba(183,214,255,.14)] p-7 text-left transition hover:border-[rgba(183,214,255,.3)] hover:bg-[#0a1727]"
            >
              <p className="cw-label text-[#6fa8ff]">
                Article
              </p>

              <h3 className="mt-4 text-xl font-semibold">
                Write an article
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-[#8ea2ba]">
                Create editorial content for the public
                CLOCKWYRD media platform.
              </p>

              <span className="mt-6 block text-sm text-[#b8d8ff]">
                Open editor →
              </span>
            </button>

            <button
              className="group border border-[rgba(183,214,255,.14)] p-7 text-left transition hover:border-[rgba(183,214,255,.3)] hover:bg-[#0a1727]"
            >
              <p className="cw-label text-[#6fa8ff]">
                Announcement
              </p>

              <h3 className="mt-4 text-xl font-semibold">
                Publish an announcement
              </h3>

              <p className="mt-3 max-w-md text-sm leading-6 text-[#8ea2ba]">
                Share important updates with the CLOCKWYRD
                community.
              </p>

              <span className="mt-6 block text-sm text-[#64758b]">
                Publishing coming soon →
              </span>
            </button>

          </div>
        </section>

        {/* CONTENT LIBRARY */}
        <section className="mt-14">

          <div>
            <p className="cw-label text-[#6fa8ff]">
              Library
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Content library
            </h2>
          </div>

          {articles.length === 0 ? (
            <div className="mt-6 border border-dashed border-[rgba(183,214,255,.16)] p-10 text-center">

              <p className="cw-label">
                EMPTY LIBRARY
              </p>

              <h3 className="mt-4 text-xl font-semibold">
                Nothing published yet.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#64758b]">
                Your articles and drafts will appear here once
                you start creating content.
              </p>

              <button
                onClick={() => navigate("/content/new")}
                className="mt-6 bg-[#b8d8ff] px-5 py-3 text-sm font-semibold text-[#07101d] transition hover:bg-white"
              >
                Write your first article →
              </button>

            </div>
          ) : (
            <div className="mt-6 space-y-3">

              {articles.map((article) => (
                <article
                  key={article.id}
                  className="border border-[rgba(183,214,255,.12)] bg-[#081321] p-5 transition hover:border-[rgba(183,214,255,.25)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="cw-label text-[#6fa8ff]">
                          {article.category}
                        </span>

                        <span
                          className={
                            article.status === "published"
                              ? "cw-label text-[#9fe0b5]"
                              : "cw-label text-[#d8b978]"
                          }
                        >
                          {article.status}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-semibold">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8ea2ba]">
                          {article.excerpt}
                        </p>
                      )}

                    </div>

                    <div className="shrink-0 text-xs text-[#52647a]">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </div>

                  </div>
                </article>
              ))}

            </div>
          )}

        </section>

        {/* ROADMAP */}
        <section className="mt-14 border-t border-[rgba(183,214,255,.12)] pt-8">

          <p className="cw-label text-[#6fa8ff]">
            Media system
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">

            <div className="border border-[rgba(183,214,255,.1)] p-5">
              <p className="text-sm font-medium">
                Editor
              </p>
              <p className="mt-2 text-xs leading-5 text-[#64758b]">
                Active
              </p>
            </div>

            <div className="border border-[rgba(183,214,255,.1)] p-5">
              <p className="text-sm font-medium">
                Publishing
              </p>
              <p className="mt-2 text-xs leading-5 text-[#64758b]">
                Local publishing active
              </p>
            </div>

            <div className="border border-[rgba(183,214,255,.1)] p-5">
              <p className="text-sm font-medium">
                Analytics
              </p>
              <p className="mt-2 text-xs leading-5 text-[#64758b]">
                Backend connection coming soon
              </p>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}