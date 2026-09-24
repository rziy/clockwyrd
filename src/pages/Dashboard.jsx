import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [serverStats, setServerStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  // =========================
  // CHECK DISCORD USER
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("discord_token");

    if (!token || !import.meta.env.VITE_API_URL) {
      navigate("/");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/check-member`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Unauthorized");
        }

        setUser(data.user);
      })
      .catch((error) => {
        console.error("DASHBOARD AUTH ERROR:", error);

        localStorage.removeItem("discord_token");
        setUser(null);
        navigate("/");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  // =========================
  // GET SERVER STATS
  // =========================
  useEffect(() => {
    if (!import.meta.env.VITE_API_URL) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/server-stats`)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load server stats");
        }

        setServerStats(data);
      })
      .catch((error) => {
        console.error("SERVER STATS ERROR:", error);
        setServerStats(null);
      });
  }, []);

  // =========================
  // CLOSE PROFILE MENU
  // =========================
  useEffect(() => {
    const close = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("discord_token");
    setUser(null);
    navigate("/");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-[#07101d] text-[#edf5ff]">
        <div className="text-center">
          <p className="cw-label text-[#6fa8ff]">
            CLOCKWYRD
          </p>

          <p className="mt-4 text-sm text-[#8ea2ba]">
            Loading control center...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-[#07101d] text-[#edf5ff]">

      {/* =========================
          MOBILE OVERLAY
      ========================= */}
      {sidebarOpen && (
        <button
          aria-label="Close dashboard navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64
          border-r border-[rgba(183,214,255,.12)]
          bg-[#07101d] p-5
          transition-transform duration-200
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* LOGO */}
        <button
          onClick={() => navigate("/")}
          className="text-left"
        >
          <span className="block text-xl font-bold tracking-wide">
            CLOCKWYRD
          </span>

          <span className="cw-label mt-1 block text-[#6fa8ff]">
            Control
          </span>
        </button>

        {/* NAVIGATION */}
        <nav className="mt-12 grid gap-1 text-sm">

          <button
            onClick={() => setSidebarOpen(false)}
            className="border-l-2 border-[#6fa8ff] bg-[#0d1b2d] px-4 py-3 text-left text-white"
          >
            Overview
          </button>

          <button
            onClick={() => {
              setSidebarOpen(false);
              navigate("/server-info");
            }}
            className="px-4 py-3 text-left text-[#8ea2ba] transition hover:bg-[#0d1b2d] hover:text-white"
          >
            <button
  onClick={() => {
    setSidebarOpen(false);
    navigate("/content");
  }}
  className="px-4 py-3 text-left text-[#8ea2ba] transition hover:bg-[#0d1b2d] hover:text-white"
>
  Content
</button>s
            Server
          </button>

          <button
            onClick={() => {
              setSidebarOpen(false);
              navigate("/events");
            }}
            className="px-4 py-3 text-left text-[#8ea2ba] transition hover:bg-[#0d1b2d] hover:text-white"
          >
            Events
          </button>

          <button
            onClick={() => {
              setSidebarOpen(false);
              navigate("/add-bot");
            }}
            className="px-4 py-3 text-left text-[#8ea2ba] transition hover:bg-[#0d1b2d] hover:text-white"
          >
            Add bot
          </button>

        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="absolute bottom-5 left-5 right-5 border-t border-[rgba(183,214,255,.1)] pt-5">
          <p className="cw-label">
            Access
          </p>

          <p className="mt-2 text-sm text-[#8ea2ba]">
            Owner control
          </p>
        </div>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <div className="lg:ml-64">

        {/* =========================
            HEADER
        ========================= */}
        <header className="sticky top-0 z-20 flex min-h-18 items-center justify-between border-b border-[rgba(183,214,255,.12)] bg-[#07101d]/92 px-4 backdrop-blur-md sm:px-7">

          {/* MOBILE MENU */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-xl text-white lg:hidden"
            aria-label="Open dashboard navigation"
          >
            ☰
          </button>

          {/* PROFILE */}
          <div
            className="relative ml-auto"
            ref={menuRef}
          >
            {user && (
              <>
                <button
                  onClick={() =>
                    setProfileOpen((value) => !value)
                  }
                  className="flex items-center gap-3 border border-[rgba(183,214,255,.16)] bg-[#0a1727] px-3 py-2 text-sm transition hover:bg-[#10233a]"
                >
                  {user.avatar ? (
                    <img
                      src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
                      alt={user.username}
                      className="h-7 w-7 rounded-full"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5865F2] text-xs font-bold">
                      {user.username
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>
                  )}

                  <span className="max-w-32 truncate">
                    {user.username}
                  </span>

                  <span className="text-[#8ea2ba]">
                    ▾
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 overflow-hidden border border-[rgba(183,214,255,.16)] bg-[#0a1727] p-2 shadow-2xl">

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/");
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-[#8ea2ba] transition hover:bg-[#10233a] hover:text-white"
                    >
                      Home
                    </button>

                    <button
                      onClick={logout}
                      className="mt-1 w-full px-3 py-2 text-left text-sm text-[#8ea2ba] transition hover:bg-[#10233a] hover:text-white"
                    >
                      Sign out
                    </button>

                  </div>
                )}
              </>
            )}
          </div>
        </header>

        {/* =========================
            ECOSYSTEM CONTENT
        ========================= */}
        <section className="cw-section">

          <div className="mx-auto w-[min(100%-32px,1100px)]">

            {/* HERO */}
            <div className="pt-4">

              <p className="cw-label text-[#6fa8ff]">
                CLOCKWYRD / CONTROL
              </p>

              <h1 className="mt-5 text-5xl font-bold tracking-[-0.06em] sm:text-7xl">
                Command center.
              </h1>

              <p className="cw-copy mt-5 max-w-2xl">
                Manage the CLOCKWYRD ecosystem across community,
                media, utilities, events, and advertising.
              </p>

            </div>

            {/* =========================
                ECOSYSTEM STATUS
            ========================= */}
            <div className="mt-12 grid gap-0 border-y border-[rgba(183,214,255,.14)] sm:grid-cols-2 lg:grid-cols-4">

              {/* COMMUNITY */}
              <div className="border-b border-[rgba(183,214,255,.1)] p-6 sm:border-r lg:border-b-0">
                <p className="cw-label text-[#6fa8ff]">
                  Community
                </p>

                <p className="mt-4 text-3xl font-semibold text-[#b8d8ff]">
                  {serverStats?.members ?? "—"}
                </p>

                <p className="mt-2 text-sm text-[#8ea2ba]">
                  Discord members
                </p>
              </div>

              {/* ONLINE */}
              <div className="border-b border-[rgba(183,214,255,.1)] p-6 lg:border-b-0 lg:border-r">
                <p className="cw-label">
                  Live
                </p>

                <p className="mt-4 text-3xl font-semibold text-[#b8d8ff]">
                  {serverStats?.online ?? "—"}
                </p>

                <p className="mt-2 text-sm text-[#8ea2ba]">
                  Members currently online
                </p>
              </div>

              {/* CONTENT */}
              <div className="border-b border-[rgba(183,214,255,.1)] p-6 sm:border-r lg:border-b-0">
                <p className="cw-label">
                  Media
                </p>

                <p className="mt-4 text-3xl font-semibold text-[#b8d8ff]">
                  —
                </p>

                <p className="mt-2 text-sm text-[#8ea2ba]">
                  Content system
                </p>
              </div>

              {/* EVENTS */}
              <div className="p-6">
                <p className="cw-label">
                  Events
                </p>

                <p className="mt-4 text-3xl font-semibold text-[#b8d8ff]">
                  —
                </p>

                <p className="mt-2 text-sm text-[#8ea2ba]">
                  Event system
                </p>
              </div>

            </div>

            {/* =========================
                PRIMARY AREAS
            ========================= */}
            <div className="mt-16">

              <p className="cw-label text-[#6fa8ff]">
                Ecosystem
              </p>

              <h2 className="mt-3 text-2xl font-semibold">
                What are you managing?
              </h2>

              <div className="mt-6 grid gap-3 md:grid-cols-2">

                {/* MEDIA */}
                <div className="border border-[rgba(183,214,255,.12)] p-7 transition hover:border-[rgba(183,214,255,.28)] hover:bg-[#0a1727]">
                  <p className="cw-label text-[#6fa8ff]">
                    01 / Media
                  </p>

                  <h3 className="mt-4 text-xl font-semibold">
                    Publish & manage content
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-[#8ea2ba]">
                    Articles, stories, announcements, and
                    editorial content for the public CLOCKWYRD
                    ecosystem.
                  </p>

                  <button
  onClick={() => navigate("/content")}
  className="mt-6 text-sm text-[#b8d8ff] transition hover:text-white"
>
  Content workspace →
</button>
                </div>

                {/* COMMUNITY */}
                <div className="border border-[rgba(183,214,255,.12)] p-7 transition hover:border-[rgba(183,214,255,.28)] hover:bg-[#0a1727]">
                  <p className="cw-label text-[#6fa8ff]">
                    02 / Community
                  </p>

                  <h3 className="mt-4 text-xl font-semibold">
                    Understand the community
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-[#8ea2ba]">
                    Discord infrastructure, members, roles,
                    channels, and community activity.
                  </p>

                  <button
                    onClick={() => navigate("/server-info")}
                    className="mt-6 text-sm text-[#b8d8ff] transition hover:text-white"
                  >
                    Open server control →
                  </button>
                </div>

                {/* UTILITIES */}
                <div className="border border-[rgba(183,214,255,.12)] p-7 transition hover:border-[rgba(183,214,255,.28)] hover:bg-[#0a1727]">
                  <p className="cw-label text-[#6fa8ff]">
                    03 / Utilities
                  </p>

                  <h3 className="mt-4 text-xl font-semibold">
                    Build useful tools
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-[#8ea2ba]">
                    Practical web utilities designed to bring
                    people into the CLOCKWYRD ecosystem.
                  </p>

                  <span className="mt-6 block text-sm text-[#64758b]">
                    Workspace coming soon
                  </span>
                </div>

                {/* ADVERTISING */}
                <div className="border border-[rgba(183,214,255,.12)] p-7 transition hover:border-[rgba(183,214,255,.28)] hover:bg-[#0a1727]">
                  <p className="cw-label text-[#6fa8ff]">
                    04 / Advertising
                  </p>

                  <h3 className="mt-4 text-xl font-semibold">
                    Manage campaigns
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-[#8ea2ba]">
                    Campaign inventory, placements, advertisers,
                    and ecosystem monetization.
                  </p>

                  <span className="mt-6 block text-sm text-[#64758b]">
                    Workspace coming soon
                  </span>
                </div>

              </div>
            </div>

            {/* =========================
                COMMUNITY SNAPSHOT
            ========================= */}
            <div className="mt-16">

              <div className="flex items-end justify-between gap-4">

                <div>
                  <p className="cw-label text-[#6fa8ff]">
                    Community
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold">
                    Discord snapshot
                  </h2>
                </div>

                <button
                  onClick={() => navigate("/server-info")}
                  className="text-sm text-[#8ea2ba] transition hover:text-white"
                >
                  View server →
                </button>

              </div>

              <div className="mt-6 grid gap-0 border-y border-[rgba(183,214,255,.14)] sm:grid-cols-3">

                <div className="border-b border-[rgba(183,214,255,.1)] p-6 sm:border-b-0 sm:border-r">
                  <p className="cw-label">
                    Members
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-[#b8d8ff]">
                    {serverStats?.members ?? "—"}
                  </p>

                  <p className="mt-2 text-sm text-[#8ea2ba]">
                    Total community
                  </p>
                </div>

                <div className="border-b border-[rgba(183,214,255,.1)] p-6 sm:border-b-0 sm:border-r">
                  <p className="cw-label">
                    Channels
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-[#b8d8ff]">
                    {serverStats?.channels ?? "—"}
                  </p>

                  <p className="mt-2 text-sm text-[#8ea2ba]">
                    Community spaces
                  </p>
                </div>

                <div className="p-6">
                  <p className="cw-label">
                    Roles
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-[#b8d8ff]">
                    {serverStats?.roles ?? "—"}
                  </p>

                  <p className="mt-2 text-sm text-[#8ea2ba]">
                    Access structure
                  </p>
                </div>

              </div>
            </div>

            {/* =========================
                QUICK ACTIONS
            ========================= */}
            <div className="mt-16">

              <p className="cw-label text-[#6fa8ff]">
                Actions
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <button
                  onClick={() => navigate("/server-info")}
                  className="border border-[rgba(183,214,255,.12)] p-5 text-left transition hover:border-[rgba(183,214,255,.3)] hover:bg-[#0d1b2d]"
                >
                  <p className="font-semibold">
                    Server control
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#8ea2ba]">
                    Manage Discord infrastructure.
                  </p>
                </button>

                <button
                  onClick={() => navigate("/events")}
                  className="border border-[rgba(183,214,255,.12)] p-5 text-left transition hover:border-[rgba(183,214,255,.3)] hover:bg-[#0d1b2d]"
                >
                  <p className="font-semibold">
                    Events
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#8ea2ba]">
                    Open the event system.
                  </p>
                </button>

                <button
                  onClick={() => navigate("/add-bot")}
                  className="border border-[rgba(183,214,255,.12)] p-5 text-left transition hover:border-[rgba(183,214,255,.3)] hover:bg-[#0d1b2d]"
                >
                  <p className="font-semibold">
                    Add bot
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#8ea2ba]">
                    Configure CLOCKWYRD bot access.
                  </p>
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="border border-[rgba(183,214,255,.12)] p-5 text-left transition hover:border-[rgba(183,214,255,.3)] hover:bg-[#0d1b2d]"
                >
                  <p className="font-semibold">
                    Public site
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#8ea2ba]">
                    Return to the public ecosystem.
                  </p>
                </button>

              </div>
            </div>

            {/* =========================
                FOOTER NOTE
            ========================= */}
            <div className="mt-20 border-t border-[rgba(183,214,255,.1)] py-10">

              <p className="cw-label">
                CLOCKWYRD CONTROL
              </p>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#64758b]">
                The control center is the operational layer of
                the CLOCKWYRD ecosystem. Features that do not
                have a backend yet are intentionally marked as
                coming soon rather than showing placeholder data.
              </p>

            </div>

          </div>
        </section>
      </div>
    </main>
  );
}