import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes, FaDiscord } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";

const links = [["/media", "Media"], ["/discover", "Discover"], ["/utilities", "Utilities"], ["/events", "Events"], ["/advertise", "Advertise"]];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const { user, loading, login, logout } = useAuth();

  useEffect(() => {
    const close = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#07101d]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center border border-[#6fa8ff]/35 bg-[#0d1b2d] text-xs font-bold text-[#b8d8ff]">C</span>
          <span className="text-sm font-bold tracking-[0.2em] text-white transition group-hover:text-[#b8d8ff]">CLOCKWYRD</span>
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {links.map(([path, label]) => <Link key={path} to={path} className={`text-sm transition ${isActive(path) ? "text-white" : "text-[#8ea2ba] hover:text-white"}`}>{label}</Link>)}
          {!loading && (user ? (
            <div ref={profileRef} className="relative">
              <button onClick={() => setProfileOpen((v) => !v)} className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10">
                {user.avatar ? <img src={user.avatar} alt="" className="h-6 w-6 rounded-full" /> : <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5865F2] text-[10px] font-bold">{user.username?.[0]?.toUpperCase()}</span>}
                <span>{user.username}</span>
              </button>
              {profileOpen && <div className="absolute right-0 mt-2 w-48 overflow-hidden border border-white/10 bg-[#07101d] shadow-2xl">
                <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-3 text-sm text-[#b8d8ff] hover:bg-white/5">Control dashboard</Link>
                <Link to="/server-info" onClick={() => setProfileOpen(false)} className="block px-4 py-3 text-sm text-[#8ea2ba] hover:bg-white/5 hover:text-white">Server control</Link>
                <button onClick={() => { setProfileOpen(false); logout(); }} className="w-full px-4 py-3 text-left text-sm text-red-300 hover:bg-red-500/10">Logout</button>
              </div>}
            </div>
          ) : <button onClick={login} className="flex items-center gap-2 border border-[#5865F2]/50 bg-[#5865F2] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4752C4]"><FaDiscord /> Login</button>)}
        </div>
        <button className="text-xl text-white lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">{open ? <FaTimes /> : <FaBars />}</button>
      </div>
      {open && <div className="border-t border-white/10 bg-[#07101d]/98 px-4 py-4 lg:hidden"><div className="flex flex-col gap-1">
        {links.map(([path, label]) => <Link key={path} to={path} onClick={() => setOpen(false)} className={`px-3 py-3 text-sm ${isActive(path) ? "bg-white/5 text-white" : "text-[#8ea2ba]"}`}>{label}</Link>)}
        {user ? <><Link to="/dashboard" onClick={() => setOpen(false)} className="mt-2 px-3 py-3 text-sm text-[#b8d8ff]">Control dashboard</Link><button onClick={() => { setOpen(false); logout(); }} className="px-3 py-3 text-left text-sm text-red-300">Logout</button></> : !loading ? <button onClick={() => { setOpen(false); login(); }} className="mt-2 flex items-center justify-center gap-2 bg-[#5865F2] px-4 py-3 text-sm font-semibold text-white"><FaDiscord /> Login with Discord</button> : null}
      </div></div>}
    </nav>
  );
}
