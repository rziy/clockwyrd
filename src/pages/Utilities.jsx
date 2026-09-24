import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const tools = [
  ["Server information", "Public server snapshot, channel breakdown, roles, boosts, and live state.", "/server-info"],
  ["Events", "A home for community dates, schedules, and upcoming activity.", "/events"],
  ["Discord utilities", "Generators and helpers for the everyday pieces of Discord work.", null],
  ["Community utilities", "Tools for discovery, promotion, and community operations.", null],
  ["Bot utilities", "A growing layer for CLOCKWYRD bot-powered features.", "/add-bot"],
  ["Creator utilities", "Small tools for people making content and running communities.", null],
];

export default function Utilities() {
  return (
    <main className="cw-page pt-20">
      <section className="cw-section">
        <div className="cw-wrap">
          <p className="cw-label text-[#6fa8ff]">Utilities</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-[-0.06em] sm:text-7xl">Useful things, without the clutter.</h1>
          <p className="cw-copy mt-6 max-w-2xl">A growing toolbox for Discord users, community owners, creators, and people who just want to get something done.</p>

          <div className="mt-14 grid gap-0 border-y border-[rgba(183,214,255,.14)] md:grid-cols-2 lg:grid-cols-3">
            {tools.map(([title, copy, href], index) => {
              const content = (
                <>
                  <p className="cw-label text-[#6fa8ff]">{String(index + 1).padStart(2, "0")}</p>
                  <h2 className="mt-5 text-xl font-semibold">{title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#8ea2ba]">{copy}</p>
                  <p className="mt-6 text-xs text-[#62748b]">{href ? "Open utility →" : "Coming online"}</p>
                </>
              );

              return href ? (
                <Link key={title} to={href} className="border-b border-[rgba(183,214,255,.1)] p-7 transition hover:bg-[rgba(111,168,255,.035)] lg:border-r">{content}</Link>
              ) : (
                <div key={title} className="border-b border-[rgba(183,214,255,.1)] p-7 lg:border-r">{content}</div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
