import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DRAFT_KEY, getArticle, makeSlug, upsertArticle } from "../lib/content";

export default function ArticleEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const editing = Boolean(id);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("News");
  const [status, setStatus] = useState("draft");
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (editing) {
      const article = getArticle(id);
      if (!article) { navigate("/content", { replace: true }); return; }
      setTitle(article.title || ""); setExcerpt(article.excerpt || ""); setContent(article.content || ""); setCategory(article.category || "News"); setStatus(article.status || "draft");
      return;
    }
    try {
      const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
      if (draft) { setTitle(draft.title || ""); setExcerpt(draft.excerpt || ""); setContent(draft.content || ""); setCategory(draft.category || "News"); setStatus(draft.status || "draft"); }
    } catch { localStorage.removeItem(DRAFT_KEY); }
  }, [editing, id, navigate]);

  const wordCount = useMemo(() => content.trim() ? content.trim().split(/\s+/).length : 0, [content]);
  const readTime = Math.max(1, Math.ceil(wordCount / 220));
  useEffect(() => {
    if (!title && !excerpt && !content) return;
    const timer = setTimeout(() => localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, excerpt, content, category, status })), 1200);
    return () => clearTimeout(timer);
  }, [title, excerpt, content, category, status]);
  const saveLocalDraft = () => { localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, excerpt, content, category, status })); setLastSaved(new Date()); setNotice("Local draft saved."); };

  const save = (nextStatus = status) => {
    if (!title.trim()) return setNotice("Add a title first.");
    if (nextStatus === "published" && !content.trim()) return setNotice("Write some content before publishing.");
    const now = new Date().toISOString();
    upsertArticle({ id: id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title: title.trim(), slug: makeSlug(title), excerpt: excerpt.trim(), content, category, status: nextStatus, createdAt: editing ? getArticle(id)?.createdAt || now : now, updatedAt: now });
    localStorage.removeItem(DRAFT_KEY); setStatus(nextStatus); setNotice(nextStatus === "published" ? "Published." : "Draft saved."); setTimeout(() => navigate("/content"), 350);
  };

  return <main className="min-h-[100dvh] bg-[#07101d] text-[#edf5ff]"><div className="mx-auto w-[min(100%-32px,1100px)] py-10 sm:py-14">
    <header className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="cw-label text-[#6fa8ff]">CLOCKWYRD / MEDIA / EDITOR</p><h1 className="mt-4 text-4xl font-bold tracking-[-0.05em] sm:text-6xl">{editing ? "Edit." : "Write."}</h1><p className="cw-copy mt-4 max-w-xl">Autosave locally, preview before publishing, and keep drafts recoverable.</p></div><button onClick={() => navigate("/content")} className="self-start border border-white/10 px-4 py-3 text-sm text-[#8ea2ba] hover:bg-[#0d1b2d] hover:text-white">← Content</button></header>
    {!preview ? <section className="mt-10"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title…" className="w-full border-b border-white/15 bg-transparent py-4 text-3xl font-semibold outline-none placeholder:text-[#33465e] focus:border-[#6fa8ff] sm:text-5xl" /><div className="mt-7 grid gap-5 sm:grid-cols-[180px_1fr]"><select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-white/10 bg-[#0a1727] px-4 py-3 text-sm"><option>News</option><option>Culture</option><option>Community</option><option>Technology</option><option>Opinion</option><option>Announcement</option></select><input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short description…" className="border border-white/10 bg-[#0a1727] px-4 py-3 text-sm outline-none focus:border-[#6fa8ff]" /></div><textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start writing…" className="mt-7 min-h-[480px] w-full resize-y border border-white/10 bg-[#0a1727] p-5 text-base leading-8 outline-none placeholder:text-[#52647a] focus:border-[#6fa8ff]" /><div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#62748b]"><span>{wordCount} words</span><span>~{readTime} min read</span>{lastSaved && <span>Saved {lastSaved.toLocaleTimeString()}</span>}</div></section> : <section className="mt-10 border border-white/10 bg-[#081321] p-6 sm:p-10"><p className="cw-label text-[#6fa8ff]">{category}</p><h2 className="mt-4 text-4xl font-bold">{title || "Untitled article"}</h2>{excerpt && <p className="mt-4 text-lg text-[#8ea2ba]">{excerpt}</p>}<div className="mt-8 whitespace-pre-wrap text-base leading-8 text-[#d7e3f2]">{content || "Nothing written yet."}</div></section>}
    <div className="mt-6 flex flex-col gap-4 border-y border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between"><div className="text-sm text-[#8ea2ba]">{notice || "Your work is stored locally in this browser."}</div><div className="flex flex-wrap gap-3"><button onClick={saveLocalDraft} className="border border-white/10 px-4 py-3 text-sm text-[#8ea2ba] hover:bg-[#0d1b2d]">Save local draft</button><button onClick={() => setPreview((v) => !v)} className="border border-white/10 px-4 py-3 text-sm text-[#b8d8ff]">{preview ? "Edit" : "Preview"}</button><button onClick={() => save("draft")} className="border border-[#6fa8ff]/30 bg-[#0d1b2d] px-5 py-3 text-sm text-[#b8d8ff]">Save draft</button><button onClick={() => save("published")} className="bg-[#b8d8ff] px-6 py-3 text-sm font-semibold text-[#07101d] hover:bg-white">Publish</button></div></div>
  </div></main>;
}
