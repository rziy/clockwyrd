import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const stories = [
  ["01", "Discord culture", "Stories, updates, and useful context from the communities building on Discord.", "/media"],
  ["02", "Community radar", "Find communities, events, and people worth keeping an eye on.", "/discover"],
  ["03", "Useful tools", "Small utilities for the everyday work around a Discord community.", "/utilities"],
];

const utilities = [
  ["Server tools", "Inspect a server, read its public state, and keep useful information close."],
  ["Discord tools", "Generators and small helpers for IDs, timestamps, links, and community work."],
  ["Community tools", "A growing utility layer for events, discovery, and the people around a server."],
];

export default function Home() {
  return (
    <main className="cw-page">
      <section className="relative min-h-[100dvh] overflow-hidden border-b border-[rgba(183,214,255,.12)] pt-20">
        <div className="cw-mesh right-[-12%] top-[8%]" aria-hidden="true" />
        <div className="absolute inset-0 cw-grid opacity-60" aria-hidden="true" />

        <div className="cw-wrap relative grid min-h-[calc(100dvh-5rem)] items-center gap-16 py-16 lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative z-10">
            <div className="mb-7 flex items-center gap-3">
              <span className="cw-label text-[#6fa8ff]">Media · Community · Utility</span>
              <span className="h-px w-12 bg-[#6fa8ff]/40" />
            </div>

            <h1 className="cw-display max-w-5xl">
              The place where
              <br />
              <span className="text-[#6fa8ff]">Discord culture</span>
              <br />
              meets utility.
            </h1>

            <p className="cw-copy mt-8 max-w-2xl text-base sm:text-lg">
              CLOCKWYRD is a growing digital ecosystem for stories, communities,
              useful tools, events, and the people building around Discord.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/media" className="cw-button">Explore media</Link>
              <Link to="/utilities" className="cw-button cw-button-secondary">Open utilities</Link>
              <Link to="/discover" className="cw-button cw-button-secondary">Discover communities</Link>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-3 border-y border-[rgba(183,214,255,.14)]">
              {[
                ["MEDIA", "Stories & updates"],
                ["COMMUNITY", "Servers & events"],
                ["UTILITY", "Tools & systems"],
              ].map(([label, value]) => (
                <div key={label} className="border-r border-[rgba(183,214,255,.1)] p-4 last:border-r-0 sm:p-5">
                  <p className="cw-label text-[#6fa8ff]">{label}</p>
                  <p className="mt-2 text-xs leading-5 text-[#8ea2ba]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[430px] lg:min-h-[600px]" aria-label="CLOCKWYRD ecosystem visual">
            <div className="absolute inset-0 m-auto h-[min(64vw,570px)] w-[min(64vw,570px)] rounded-full border border-[rgba(183,214,255,.18)]" />
            <div className="absolute inset-[10%] rounded-full border border-[rgba(111,168,255,.18)]" />
            <div className="absolute inset-[23%] rounded-full border border-[rgba(183,214,255,.12)]" />
            <div className="absolute inset-[37%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#b8d8ff,transparent_12%),radial-gradient(circle_at_60%_60%,#2f80ed,transparent_40%),#0b2a5b] shadow-[inset_0_0_80px_rgba(0,0,0,.3)]" />

            <div className="absolute left-[5%] top-[18%] border-l border-[#6fa8ff] pl-3">
              <p className="cw-label text-[#6fa8ff]">media</p>
              <p className="mt-1 text-xs text-[#8ea2ba]">stories</p>
            </div>
            <div className="absolute right-[2%] top-[37%] border-l border-[#6fa8ff] pl-3">
              <p className="cw-label text-[#6fa8ff]">utility</p>
              <p className="mt-1 text-xs text-[#8ea2ba]">tools</p>
            </div>
            <div className="absolute bottom-[18%] left-[16%] border-l border-[#6fa8ff] pl-3">
              <p className="cw-label text-[#6fa8ff]">community</p>
              <p className="mt-1 text-xs text-[#8ea2ba]">people</p>
            </div>
            <div className="absolute bottom-[10%] right-[9%] border-l border-[#6fa8ff] pl-3">
              <p className="cw-label text-[#6fa8ff]">signal</p>
              <p className="mt-1 text-xs text-[#8ea2ba]">online</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cw-section">
        <div className="cw-wrap">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <div className="cw-accent-line" />
              <p className="cw-label mt-6 text-[#6fa8ff]">One ecosystem</p>
              <h2 className="mt-5 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
                Built to be useful before it asks for anything.
              </h2>
              <p className="cw-copy mt-6 max-w-md">
                Media brings people in. Utilities give them a reason to stay. Community connects the two.
              </p>
            </div>

            <div className="border-t border-[rgba(183,214,255,.14)]">
              {stories.map(([num, title, copy, href]) => (
                <Link key={num} to={href} className="grid gap-4 border-b border-[rgba(183,214,255,.1)] py-7 transition hover:bg-[rgba(111,168,255,.035)] sm:grid-cols-[64px_190px_1fr_24px]">
                  <span className="cw-label text-[#6fa8ff]">{num}</span>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="m-0 text-sm leading-6 text-[#8ea2ba]">{copy}</p>
                  <span className="text-[#6fa8ff]">↗</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cw-section border-y border-[rgba(183,214,255,.08)] bg-[#081522]">
        <div className="cw-wrap">
          <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <p className="cw-label text-[#6fa8ff]">Utility layer</p>
              <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Small tools. Real reasons to return.</h2>
            </div>
            <Link to="/utilities" className="text-sm text-[#b8d8ff] hover:text-white">View all utilities →</Link>
          </div>

          <div className="mt-10 grid gap-0 border-y border-[rgba(183,214,255,.14)] md:grid-cols-3">
            {utilities.map(([title, copy], index) => (
              <div key={title} className="border-b border-[rgba(183,214,255,.1)] p-7 last:border-b-0 md:border-b-0 md:border-l first:md:border-l-0">
                <p className="cw-label text-[#6fa8ff]">0{index + 1}</p>
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#8ea2ba]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cw-section">
        <div className="cw-wrap grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
          <div>
            <p className="cw-label text-[#6fa8ff]">Advertising</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-bold tracking-[-0.05em] sm:text-6xl">
              Put the right community in front of the right audience.
            </h2>
            <p className="cw-copy mt-6 max-w-xl">
              CLOCKWYRD is being designed with space for community promotion, partnerships, and sponsored placements without turning the experience into a billboard.
            </p>
          </div>

          <div className="cw-panel p-7">
            <p className="cw-label">For communities & brands</p>
            <p className="mt-4 text-2xl font-semibold">Advertise inside the ecosystem.</p>
            <p className="mt-3 text-sm leading-6 text-[#8ea2ba]">
              Campaign tools will connect promotion with content, community discovery, and measurable placements.
            </p>
            <Link to="/advertise" className="cw-button mt-7">Explore advertising</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
