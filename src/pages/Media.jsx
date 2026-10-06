import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { getArticles } from "../lib/content";

export default function Media() {
  const { id } = useParams();
  const [articles, setArticles] = useState(getArticles);
  useEffect(() => { const f = () => setArticles(getArticles()); window.addEventListener("clockwyrd-content-updated", f); return () => window.removeEventListener("clockwyrd-content-updated", f); }, []);
  const published = articles.filter((a) => a.status === "published");
  const article = id ? published.find((a) => a.id === id) : null;

  if (id) return <main className="cw-page pt-20"><section className="cw-section"><div className="cw-wrap max-w-4xl">{article ? <><Link to="/media" className="text-sm text-[#8ea2ba] hover:text-white">← Back to media</Link><p className="cw-label mt-10 text-[#6fa8ff]">{article.category}</p><h1 className="mt-5 text-5xl font-bold tracking-[-0.06em] sm:text-7xl">{article.title}</h1>{article.excerpt && <p className="cw-copy mt-6 text-lg">{article.excerpt}</p>}<div className="mt-12 whitespace-pre-wrap border-t border-white/10 pt-10 text-base leading-8 text-[#d7e3f2]">{article.content}</div></> : <><p className="cw-label text-[#6fa8ff]">404</p><h1 className="mt-5 text-5xl font-bold">Story not found.</h1><Link to="/media" className="cw-button mt-8">Back to media</Link></>}</div></section><Footer /></main>;

  return <main className="cw-page pt-20"><section className="cw-section"><div className="cw-wrap"><p className="cw-label text-[#6fa8ff]">Media</p><h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-[-0.06em] sm:text-7xl">Stories from the Discord ecosystem.</h1><p className="cw-copy mt-6 max-w-2xl">Published stories from CLOCKWYRD, with the editorial workspace feeding this public layer.</p>
    <div className="mt-14 border-y border-white/10">{published.length ? published.map((article, index) => <Link key={article.id} to={`/media/${article.id}`} className="grid gap-4 border-b border-white/10 py-8 transition hover:bg-white/[.025] sm:grid-cols-[64px_220px_1fr_30px]"><span className="cw-label text-[#6fa8ff]">{String(index + 1).padStart(2, "0")}</span><div><p className="cw-label">{article.category}</p><h2 className="mt-2 text-xl font-semibold">{article.title}</h2></div><p className="m-0 text-sm leading-6 text-[#8ea2ba]">{article.excerpt || article.content.slice(0, 140)}</p><span className="text-[#6fa8ff]">↗</span></Link>) : <div className="p-10 text-center"><p className="cw-label">EDITORIAL SIGNAL</p><h2 className="mt-3 text-xl font-semibold">No stories published yet.</h2><p className="mt-2 text-sm text-[#64758b]">The public media feed will populate as articles are published.</p></div>}</div></div></section><Footer /></main>;
}
