import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes, FaDiscord } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

const links = [
  ["/media", "Media"],
  ["/discover", "Discover"],
  ["/utilities", "Utilities"],
  ["/events", "Events"],
  ["/advertise", "Advertise"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const discordLogin = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_DISCORD_REDIRECT_URI;

    if (!clientId || !redirectUri) return;

    const url =
      `https://discord.com/oauth2/authorize?client_id=${clientId}` +
      `&response_type=token` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=identify%20guilds%20guilds.members.read`;

    window.location.href = url;
  };

  useEffect(() => {
    const token = localStorage.getItem("discord_token");

    if (!token || !import.meta.env.VITE_API_URL) {
      setLoadingUser(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/check-member`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Login failed");
        }
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("discord_token");
        setUser(null);
      })
      .finally(() => setLoadingUser(false));
  }, []);

  useEffect(() => {
    const close = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const logout = () => {
    localStorage.removeItem("discord_token");
    setUser(null);
    setProfileOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#07101d]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center border border-[#6fa8ff]/35 bg-[#0d1b2d] text-xs font-bold text-[#b8d8ff]">C</span>
          <span className="text-sm font-bold tracking-[0.2em] text-white transition group-hover:text-[#b8d8ff]">CLOCKWYRD</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map(([path, label]) => (
            <Link
              key={path}
              to={path}
              className={`text-sm transition ${isActive(path) ? "text-white" : "text-[#8ea2ba] hover:text-white"}`}
            >
              {label}
            </Link>
          ))}

          {!loadingUser && (
            user ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  {user.avatar ? (
                    <img
                      src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`}
                      alt={user.username}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5865F2] text-[10px] font-bold">
                      {user.username?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                  <span>{user.username}</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 overflow-hidden border border-white/10 bg-[#07101d]/98 shadow-2xl">
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-3 text-sm text-[#b8d8ff] hover:bg-white/5">
                      Control dashboard
                    </Link>
                    <Link to="/server-info" onClick={() => setProfileOpen(false)} className="block px-4 py-3 text-sm text-[#8ea2ba] hover:bg-white/5 hover:text-white">
                      Server control
                    </Link>
                    <button onClick={logout} className="w-full px-4 py-3 text-left text-sm text-red-300 hover:bg-red-500/10">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={discordLogin} className="flex items-center gap-2 border border-[#5865F2]/50 bg-[#5865F2] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4752C4]">
                <FaDiscord />
                Login
              </button>
            )
          )}
        </div>

        <button className="text-xl text-white lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#07101d]/98 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map(([path, label]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                className={`px-3 py-3 text-sm ${isActive(path) ? "bg-white/5 text-white" : "text-[#8ea2ba]"}`}
              >
                {label}
              </Link>
            ))}

            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="mt-2 px-3 py-3 text-sm text-[#b8d8ff]">
                  Control dashboard
                </Link>
                <button onClick={() => { setOpen(false); logout(); }} className="px-3 py-3 text-left text-sm text-red-300">
                  Logout
                </button>
              </>
            ) : !loadingUser ? (
              <button onClick={() => { setOpen(false); discordLogin(); }} className="mt-2 flex items-center justify-center gap-2 bg-[#5865F2] px-4 py-3 text-sm font-semibold text-white">
                <FaDiscord />
                Login with Discord
              </button>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
}
