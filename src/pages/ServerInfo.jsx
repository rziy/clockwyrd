import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ServerInfo() {
  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const navigate = useNavigate();

  // =========================
  // FETCH SERVER DATA
  // =========================
  useEffect(() => {
    console.log("API URL:", import.meta.env.VITE_API_URL);

    const fetchServer = async () => {
      if (!import.meta.env.VITE_API_URL) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/server-stats`
        );

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load server");
        }

        setServer(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("SERVER INFO ERROR:", error);
        setServer({ success: false });
      } finally {
        setLoading(false);
      }
    };

    fetchServer();

    const interval = setInterval(fetchServer, 10000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // HELPERS
  // =========================

  const verificationNames = {
    0: "None",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Very High",
  };

  const boostNames = {
    0: "None",
    1: "Level 1",
    2: "Level 2",
    3: "Level 3",
  };

  const stats = [
    ["Members", server?.members ?? "—", "Total server members"],
    ["Online", server?.online ?? "—", "Currently online"],
    ["Channels", server?.channels ?? "—", "All server channels"],
    ["Roles", server?.roles ?? "—", "All server roles"],
  ];

  const channelStats = [
    ["Text", server?.textChannels ?? "—"],
    ["Voice", server?.voiceChannels ?? "—"],
    ["Categories", server?.categories ?? "—"],
  ];

  return (
    <main className="cw-page pt-24">
      <section className="cw-section">
        <div className="cw-wrap">

          {/* =========================
              HEADER
          ========================= */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="cw-label text-[#6fa8ff]">
                Server Control
              </p>

              <h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-[-0.06em] sm:text-7xl">
                Server state.
              </h1>

              <p className="cw-copy mt-6 max-w-xl">
                A live readout from the Discord server connected to CLOCKWYRD.
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-fit border border-[rgba(183,214,255,.14)] px-4 py-2 text-sm text-[#8ea2ba] transition hover:border-[rgba(183,214,255,.3)] hover:bg-[#0d1b2d] hover:text-white"
            >
              ← Dashboard
            </button>

          </div>

          {/* =========================
              CONNECTION STATUS
          ========================= */}
          <div className="mt-12 flex flex-wrap items-center gap-3">

            <span
              className={`inline-flex items-center gap-2 border px-3 py-2 text-xs ${
                server?.success
                  ? "border-[#6fa8ff]/20 bg-[#0d1b2d] text-[#b8d8ff]"
                  : "border-red-400/20 bg-red-400/5 text-red-300"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  server?.success
                    ? "bg-[#6fa8ff]"
                    : "bg-red-400"
                }`}
              />

              {loading
                ? "Connecting"
                : server?.success
                  ? "Connected"
                  : "Offline"}
            </span>

            {lastUpdated && (
              <span className="text-xs text-[#8ea2ba]">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}

          </div>

          {/* =========================
              SERVER IDENTITY
          ========================= */}
          <div className="mt-10 border-y border-[rgba(183,214,255,.14)] py-7">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              {/* SERVER ICON */}
              {server?.icon ? (
                <img
                  src={server.icon}
                  alt={server.serverName || "Server"}
                  className="h-20 w-20 rounded-2xl border border-[rgba(183,214,255,.14)]"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[rgba(183,214,255,.14)] bg-[#0d1b2d] text-2xl font-bold">
                  C
                </div>
              )}

              <div className="min-w-0">

                <p className="cw-label">
                  Connected server
                </p>

                <h2 className="mt-2 truncate text-3xl font-semibold tracking-tight">
                  {loading
                    ? "Loading..."
                    : server?.success
                      ? server.serverName
                      : "Waiting for API"}
                </h2>

                {server?.serverId && (
                  <p className="mt-2 break-all text-xs text-[#60748c]">
                    ID: {server.serverId}
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* =========================
              LIVE METRICS
          ========================= */}
          <div className="mt-12">

            <p className="cw-label text-[#6fa8ff]">
              Live metrics
            </p>

            <div className="mt-5 grid gap-0 border-y border-[rgba(183,214,255,.14)] sm:grid-cols-2 lg:grid-cols-4">

              {stats.map(([label, value, description]) => (
                <div
                  key={label}
                  className="border-b border-[rgba(183,214,255,.1)] p-6 last:border-b-0 sm:border-l first:sm:border-l-0 lg:border-b-0"
                >
                  <p className="cw-label">
                    {label}
                  </p>

                  <p className="mt-4 text-5xl font-bold tracking-[-0.06em] text-[#b8d8ff]">
                    {value}
                  </p>

                  <p className="mt-2 text-sm text-[#8ea2ba]">
                    {description}
                  </p>
                </div>
              ))}

            </div>

          </div>

          {/* =========================
              SERVER DETAILS
          ========================= */}
          <div className="mt-14">

            <p className="cw-label text-[#6fa8ff]">
              Server details
            </p>

            <div className="mt-5 grid gap-0 border-y border-[rgba(183,214,255,.14)] sm:grid-cols-2">

              {/* OWNER */}
              <div className="border-b border-[rgba(183,214,255,.1)] p-6 sm:border-r">
                <p className="cw-label">
                  Owner
                </p>

                <p className="mt-3 text-xl font-semibold">
                  {server?.ownerName ?? "—"}
                </p>

                {server?.ownerId && (
                  <p className="mt-2 break-all text-xs text-[#60748c]">
                    {server.ownerId}
                  </p>
                )}
              </div>

              {/* VERIFICATION */}
              <div className="border-b border-[rgba(183,214,255,.1)] p-6 sm:border-b-0">
                <p className="cw-label">
                  Verification
                </p>

                <p className="mt-3 text-xl font-semibold">
                  {server?.verificationLevel != null
                    ? verificationNames[server.verificationLevel] ||
                      `Level ${server.verificationLevel}`
                    : "—"}
                </p>

                <p className="mt-2 text-xs text-[#60748c]">
                  Discord verification level
                </p>
              </div>

              {/* BOOST */}
              <div className="border-b border-[rgba(183,214,255,.1)] p-6 sm:border-r">
                <p className="cw-label">
                  Boost level
                </p>

                <p className="mt-3 text-xl font-semibold">
                  {server?.boostLevel != null
                    ? boostNames[server.boostLevel] ||
                      `Level ${server.boostLevel}`
                    : "—"}
                </p>

                <p className="mt-2 text-xs text-[#60748c]">
                  Current server boost tier
                </p>
              </div>

              {/* BOOST COUNT */}
              <div className="p-6">
                <p className="cw-label">
                  Boosts
                </p>

                <p className="mt-3 text-xl font-semibold">
                  {server?.boostCount ?? "—"}
                </p>

                <p className="mt-2 text-xs text-[#60748c]">
                  Active server boosts
                </p>
              </div>

            </div>

          </div>

          {/* =========================
              CHANNEL BREAKDOWN
          ========================= */}
          <div className="mt-14">

            <p className="cw-label text-[#6fa8ff]">
              Channel breakdown
            </p>

            <div className="mt-5 grid gap-0 border-y border-[rgba(183,214,255,.14)] sm:grid-cols-3">

              {channelStats.map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-[rgba(183,214,255,.1)] p-6 last:border-b-0 sm:border-b-0 sm:border-l first:sm:border-l-0"
                >
                  <p className="cw-label">
                    {label}
                  </p>

                  <p className="mt-4 text-4xl font-bold tracking-[-0.05em] text-[#b8d8ff]">
                    {value}
                  </p>

                  <p className="mt-2 text-sm text-[#8ea2ba]">
                    {label} channels
                  </p>
                </div>
              ))}

            </div>

          </div>

          {/* =========================
              BOT STATUS
          ========================= */}
          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_.55fr]">

            <div className="cw-panel p-7">

              <p className="cw-label">
                Bot
              </p>

              <div className="mt-4 flex items-center gap-3">

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    server?.success
                      ? "bg-[#6fa8ff]"
                      : "bg-red-400"
                  }`}
                />

                <h2 className="text-2xl font-semibold">
                  {server?.success
                    ? "Discord connection active"
                    : "Connection unavailable"}
                </h2>

              </div>

              <p className="mt-3 text-sm leading-6 text-[#8ea2ba]">
                CLOCKWYRD is receiving the current server snapshot from the Discord bot.
              </p>

            </div>

            <div className="border-l-2 border-[#6fa8ff] pl-5">

              <p className="cw-label text-[#6fa8ff]">
                Gateway
              </p>

              <p className="mt-3 text-3xl font-semibold text-[#b8d8ff]">
                {server?.latency != null && server.latency >= 0
                  ? `${server.latency} ms`
                  : "—"}
              </p>

              <p className="mt-2 text-sm text-[#8ea2ba]">
                WebSocket latency
              </p>

            </div>

          </div>

          {/* =========================
              REFRESH INFO
          ========================= */}
          <div className="mt-12 border-l-2 border-[#6fa8ff] pl-5">

            <p className="cw-label text-[#6fa8ff]">
              Refresh
            </p>

            <p className="mt-3 text-sm text-[#8ea2ba]">
              Server data automatically refreshes every 10 seconds.
            </p>

            <p className="mt-3 text-xs text-[#60748c]">
              Data source: CLOCKWYRD API
            </p>

          </div>

          {/* =========================
              CONTROL LINKS
          ========================= */}
          <div className="mt-14">

            <p className="cw-label text-[#6fa8ff]">
              Control
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              <button
                onClick={() => navigate("/dashboard")}
                className="border border-[rgba(183,214,255,.12)] p-6 text-left transition hover:border-[rgba(183,214,255,.3)] hover:bg-[#0d1b2d]"
              >
                <p className="font-semibold">
                  Dashboard
                </p>

                <p className="mt-2 text-sm leading-6 text-[#8ea2ba]">
                  Return to the main owner control panel.
                </p>
              </button>

              <button
                onClick={() => navigate("/events")}
                className="border border-[rgba(183,214,255,.12)] p-6 text-left transition hover:border-[rgba(183,214,255,.3)] hover:bg-[#0d1b2d]"
              >
                <p className="font-semibold">
                  Events
                </p>

                <p className="mt-2 text-sm leading-6 text-[#8ea2ba]">
                  Manage and view CLOCKWYRD events.
                </p>
              </button>

              <button
                onClick={() => navigate("/add-bot")}
                className="border border-[rgba(183,214,255,.12)] p-6 text-left transition hover:border-[rgba(183,214,255,.3)] hover:bg-[#0d1b2d]"
              >
                <p className="font-semibold">
                  Add bot
                </p>

                <p className="mt-2 text-sm leading-6 text-[#8ea2ba]">
                  Open the CLOCKWYRD bot setup page.
                </p>
              </button>

            </div>

          </div>

        </div>
      </section>
    </main>
  );
}