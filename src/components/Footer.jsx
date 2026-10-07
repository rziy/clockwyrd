import {
  FaGithub,
  FaDiscord,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const socials = [
  ["Instagram", "https://instagram.com", FaInstagram],
  ["X", "https://x.com", FaXTwitter],
  ["YouTube", "https://youtube.com", FaYoutube],
  ["Discord", "https://discord.gg/4KWauvZeSN", FaDiscord],
  ["GitHub", "https://github.com", FaGithub],
];

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(183,214,255,.12)] py-14">
      <div className="cw-wrap grid gap-12 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <p className="text-2xl font-bold tracking-[-0.04em]">CLOCKWYRD</p>
          <p className="cw-copy mt-4 max-w-md text-sm">
            Media, community, utilities, and infrastructure for the Discord ecosystem.
          </p>
          <div className="mt-7 flex flex-wrap gap-5">
            {socials.map(([label, href, Icon]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="text-[#8ea2ba] transition hover:text-[#b8d8ff]" aria-label={label}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <p className="cw-label mb-4">Explore</p>
            <div className="grid gap-3 text-sm text-[#8ea2ba]">
              <Link to="/media">Media</Link>
              <Link to="/discover">Discover</Link>
              <Link to="/utilities">Utilities</Link>
              <Link to="/events">Events</Link>
            </div>
          </div>
          <div>
            <p className="cw-label mb-4">Connect</p>
            <div className="grid gap-3 text-sm text-[#8ea2ba]">
              <Link to="/partner">Partners</Link>
              <Link to="/advertise">Advertise</Link>
              <Link to="/social-links">Social</Link>
              <Link to="/add-bot">Add bot</Link>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="cw-label mb-4">System</p>
            <div className="grid gap-3 text-sm text-[#8ea2ba]">
              <Link to="/server-info">Server control</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="cw-wrap mt-12 border-t border-[rgba(183,214,255,.08)] pt-5 text-xs text-[#62748b]">
        © 2026 CLOCKWYRD
      </div>
    </footer>
  );
}
