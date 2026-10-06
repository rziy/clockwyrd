import { useEffect, useMemo, useState } from "react";

const partners = [
  ["Normies Legacy", "https://discord.gg/m5vhd6tPRJ", "/videos/silent-train.mp4"],
  ["Constellation", "https://discord.com/invite/Ne7MW7jcBX", "/videos/tanya.mp4"],
  ["One For All", "https://discord.gg/rZ6YDya4M9", "/videos/elaina.mp4"],
  ["Nebula", "https://discord.gg/", "/videos/silent-train.mp4"],
  ["Akatsuki", "https://discord.gg/", "/videos/tanya.mp4"],
  ["Void Network", "https://discord.gg/", "/videos/elaina.mp4"],
  ["Zenith", "https://discord.gg/", "/videos/silent-train.mp4"],
  ["Solaris", "https://discord.gg/", "/videos/tanya.mp4"],
];

export default function Partner() {
  const data = useMemo(() => partners, []);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(false), [active]);

  const current = data[active];

  return (
    <main className="relative min-h-[100dvh] overflow-hidden pt-24">
      <video
        key={current[2]}
        src={current[2]}
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setReady(true)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-35" : "opacity-0"}`}
      />
      <div className="absolute inset-0 bg-[#07101d]/85" />
      <div className="cw-mesh right-[-12%] top-[8%] opacity-45" />

      <section className="cw-wrap relative grid min-h-[calc(100dvh-6rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_.7fr]">
        <div>
          <p className="cw-label text-[#6fa8ff]">Partners</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-[-0.06em] sm:text-7xl">
            Communities around the system.
          </h1>
          <p className="cw-copy mt-6 max-w-xl">
            Hover a name to preview the community, then open its server if you want to visit.
          </p>
        </div>

        <div className="border-t border-[rgba(183,214,255,.16)]">
          {data.map(([name, url], index) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setActive(index)}
              className={`grid grid-cols-[42px_1fr_20px] items-center gap-3 border-b border-[rgba(183,214,255,.1)] py-4 no-underline transition ${
                active === index ? "text-[#b8d8ff]" : "text-[#8ea2ba]"
              }`}
            >
              <span className="cw-label">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-lg font-medium">{name}</span>
              <span>↗</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
