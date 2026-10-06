import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteArticle, getArticles } from "../lib/content";

export default function Content() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState(getArticles);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const refresh = () => setArticles(getArticles());
  useEffect(() => { window.addEventListener("clockwyrd-content-updated", refresh); return () => window.removeEventListener("clockwyrd-content-updated", refresh); }, []);

  const filtered = useMemo(() => articles.filter((article) => {
    const matchesStatus = filter === "all" || article.status === filter;
    const needle = query.trim().toLowerCase();
    return matchesStatus && (!needle || `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(needle));
  }), [articles, filter, query]);

  const remove = (id) => { if (window.confirm("Delete this article? This cannot be undone.")) { deleteArticle(id); refresh(); } };

  return <main className="min-h-[100dvh] bg-[#07101d] text-[#edf5ff]"><div className="mx-auto w-[min(100%-32px,1100px)] py-10 sm:py-14">
    <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="cw-label text-[#6fa8ff]">CLOCKWYRD / MEDIA</p><h1 className="mt-4 text-4xl font-bold tracking-[-0.05em] sm:text-6xl">Content.</h1><p className="cw-copy mt-4 max-w-xl">Create, edit, filter, preview, and publish the editorial layer.</p></div><button onClick={() => navigate("/dashboard")} className="self-start border border-white/10 px-4 py-3 text-sm text-[#8ea2ba] hover:bg-[#0d1b2d] hover:text-white">← Dashboard</button></header>
    <section className="mt-10 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-3">{[["Published", articles.filter((a) => a.status === "published").length], ["Drafts", articles.filter((a) => a.status === "draft").length], ["Total", articles.length]].map(([label, value]) => <div key={label} className="bg-[#081321] p-6"><p className="cw-label">{label}</p><p className="mt-3 text-3xl font-semibold">{value}</p></div>)}</section>
    <section className="mt-10 flex flex-col gap-3 sm:flex-row"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, category, excerpt…" className="min-h-11 flex-1 border border-white/10 bg-[#0a1727] px-4 text-sm outline-none focus:border-[#6fa8ff]" /><select value={filter} onChange={(e) => setFilter(e.target.value)} className="min-h-11 border border-white/10 bg-[#0a1727] px-4 text-sm"><option value="all">All content</option><option value="published">Published</option><option value="draft">Drafts</option></select><button onClick={() => navigate("/content/new")} className="cw-button">+ New article</button></section>
    <section className="mt-8">{filtered.length === 0 ? <div className="border border-dashed border-white/15 p-10 text-center"><p className="cw-label">NO RESULTS</p><h2 className="mt-3 text-xl font-semibold">Nothing matches this view.</h2><button onClick={() => { setQuery(""); setFilter("all"); }} className="mt-5 text-sm text-[#b8d8ff]">Reset filters</button></div> : <div className="space-y-3">{filtered.map((article) => <article key={article.id} className="border border-white/10 bg-[#081321] p-5 hover:border-white/20"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap gap-3"><span className="cw-label text-[#6fa8ff]">{article.category}</span><span className={`cw-label ${article.status === "published" ? "text-[#9fe0b5]" : "text-[#d8b978]"}`}>{article.status}</span></div><h2 className="mt-3 text-xl font-semibold">{article.title}</h2>{article.excerpt && <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8ea2ba]">{article.excerpt}</p>}<p className="mt-3 text-xs text-[#52647a]">Updated {new Date(article.updatedAt || article.createdAt).toLocaleString()}</p></div><div className="flex shrink-0 flex-wrap gap-2"><button onClick={() => navigate(`/content/${article.id}/edit`)} className="border border-white/10 px-3 py-2 text-xs text-[#b8d8ff] hover:bg-white/5">Edit</button>{article.status === "published" && <button onClick={() => navigate(`/media/${article.id}`)} className="border border-white/10 px-3 py-2 text-xs text-[#8ea2ba] hover:text-white">View</button>}<button onClick={() => remove(article.id)} className="border border-red-400/20 px-3 py-2 text-xs text-red-300 hover:bg-red-500/5">Delete</button></div></div></article>)}</div>}</section>
  </div></main>;
}
