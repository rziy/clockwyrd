import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, isApiConfigured } from "../lib/api";
import { getArticles } from "../lib/content";
import { useAuth } from "../lib/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [articles, setArticles] = useState(getArticles);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      if (isApiConfigured()) {
        const [server, apiHealth] = await Promise.all([apiFetch("/api/server-stats"), apiFetch("/api/health")]);
        setStats(server);
        setHealth(apiHealth);
      } else {
        setMessage("API is not configured. Public UI still works, but live Discord data is unavailable.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);
  useEffect(() => {
    const update = () => setArticles(getArticles());
    window.addEventListener("clockwyrd-content-updated", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("clockwyrd-content-updated", update); window.removeEventListener("storage", update); };
  }, []);

  const published = articles.filter((a) => a.status === "published");
  const drafts = articles.filter((a) => a.status === "draft");
  const latest = useMemo(() => [...articles].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0, 5), [articles]);

  return (
    <main className="min-h-[100dvh] bg-[#07101d] text-[#edf5ff]">
      {sidebarOpen && <button aria-label="Close dashboard navigation" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/60 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-[#07101d] p-5 transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button onClick={() => navigate("/")} className="text-left"><span className="block text-xl font-bold tracking-wide">CLOCKWYRD</span><span className="cw-label mt-1 block text-[#6fa8ff]">Control</span></button>
        <nav className="mt-12 grid gap-1 text-sm">
          {[['Overview', '/dashboard'], ['Content', '/content'], ['Server', '/server-info'], ['Events', '/events'], ['Utilities', '/utilities'], ['Add bot', '/add-bot']].map(([label, path], i) => <button key={path} onClick={() => { setSidebarOpen(false); navigate(path); }} className={`border-l-2 px-4 py-3 text-left transition ${i === 0 ? "border-[#6fa8ff] bg-[#0d1b2d] text-white" : "border-transparent text-[#8ea2ba] hover:bg-[#0d1b2d] hover:text-white"}`}>{label}</button>)}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 border-t border-white/10 pt-5"><p className="cw-label">Access</p><p className="mt-2 text-sm text-[#8ea2ba]">{user?.username || "Owner"}</p></div>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-20 flex min-h-18 items-center justify-between border-b border-white/10 bg-[#07101d]/92 px-4 backdrop-blur-md sm:px-7">
          <button onClick={() => setSidebarOpen(true)} className="text-xl text-white lg:hidden" aria-label="Open dashboard navigation">☰</button>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={refresh} disabled={loading} className="border border-white/10 px-3 py-2 text-xs text-[#8ea2ba] hover:bg-[#10233a] disabled:opacity-50">{loading ? "Refreshing…" : "Refresh"}</button>
            <button onClick={async () => { await logout(); navigate("/"); }} className="border border-white/10 px-3 py-2 text-xs text-[#8ea2ba] hover:text-white">Sign out</button>
          </div>
        </header>

        <section className="cw-section">
          <div className="mx-auto w-[min(100%-32px,1100px)]">
            <p className="cw-label text-[#6fa8ff]">CLOCKWYRD / CONTROL</p>
            <h1 className="mt-5 text-5xl font-bold tracking-[-0.06em] sm:text-7xl">Command center.</h1>
            <p className="cw-copy mt-5 max-w-2xl">One place to monitor the Discord connection, manage media, and jump into the tools that are actually ready.</p>

            {message && <div className="mt-8 border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-sm text-amber-100">{message}</div>}

            <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {[["Members", stats?.members ?? "—", "Discord server"], ["Online", stats?.online ?? "—", "Live presence"], ["Published", published.length, "Local media"], ["Drafts", drafts.length, "Needs attention"]].map(([label, value, sub]) => <div key={label} className="bg-[#081321] p-6"><p className="cw-label">{label}</p><p className="mt-3 text-3xl font-semibold">{value}</p><p className="mt-2 text-xs text-[#60748c]">{sub}</p></div>)}
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
              <section className="border border-white/10 bg-[#081321] p-6">
                <div className="flex items-center justify-between gap-4"><div><p className="cw-label text-[#6fa8ff]">Recent work</p><h2 className="mt-2 text-xl font-semibold">Content activity</h2></div><button onClick={() => navigate("/content")} className="text-xs text-[#b8d8ff]">Open library →</button></div>
                <div className="mt-6 divide-y divide-white/10">{latest.length ? latest.map((article) => <button key={article.id} onClick={() => navigate(`/content/${article.id}/edit`)} className="flex w-full items-start justify-between gap-5 py-4 text-left hover:bg-white/[.02]"><div className="min-w-0"><p className="cw-label text-[#6fa8ff]">{article.category} · {article.status}</p><p className="mt-1 truncate font-medium">{article.title}</p></div><span className="shrink-0 text-xs text-[#52647a]">{new Date(article.updatedAt || article.createdAt).toLocaleDateString()}</span></button>) : <p className="py-8 text-sm text-[#64758b]">No articles yet. Create your first piece from the content library.</p>}</div>
              </section>
              <section className="border border-white/10 bg-[#081321] p-6">
                <p className="cw-label text-[#6fa8ff]">System</p><h2 className="mt-2 text-xl font-semibold">Live connection</h2>
                <div className="mt-6 space-y-4 text-sm"><div className="flex justify-between gap-4"><span className="text-[#8ea2ba]">API</span><span>{health ? "Online" : "Unavailable"}</span></div><div className="flex justify-between gap-4"><span className="text-[#8ea2ba]">Discord bot</span><span>{health?.botReady ? "Ready" : "Offline"}</span></div><div className="flex justify-between gap-4"><span className="text-[#8ea2ba]">Latency</span><span>{stats?.latency != null ? `${stats.latency} ms` : "—"}</span></div><div className="flex justify-between gap-4"><span className="text-[#8ea2ba]">Last check</span><span>{new Date().toLocaleTimeString()}</span></div></div>
                <button onClick={() => navigate("/server-info")} className="mt-7 w-full border border-white/10 px-4 py-3 text-sm text-[#b8d8ff] hover:bg-white/5">Open server control</button>
              </section>
            </div>

            <section className="mt-10"><p className="cw-label text-[#6fa8ff]">Quick actions</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Write article", "/content/new"], ["Server state", "/server-info"], ["Community events", "/events"], ["Utilities", "/utilities"]].map(([label, path]) => <button key={path} onClick={() => navigate(path)} className="border border-white/10 p-5 text-left hover:border-white/25 hover:bg-[#0a1727]"><p className="font-semibold">{label}</p><p className="mt-2 text-xs text-[#64758b]">Open workspace →</p></button>)}</div></section>
          </div>
        </section>
      </div>
    </main>
  );
}
