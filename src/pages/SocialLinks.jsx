const socials = [
  ["Discord", "Community and server updates.", "https://discord.gg/4KWauvZeSN"],
  ["Instagram", "Visual updates and announcements.", "https://instagram.com"],
  ["TikTok", "Short clips and community moments.", "https://tiktok.com"],
  ["YouTube", "Longer videos and events.", "https://youtube.com"],
  ["GitHub", "Code and project work.", "https://github.com"],
];

export default function SocialLinks() {
  return (
    <main className="cw-page pt-24">
      <section className="cw-section">
        <div className="cw-wrap">
          <p className="cw-label text-[#6fa8ff]">Social</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-bold tracking-[-0.06em] sm:text-7xl">
            Find CLOCKWYRD elsewhere.
          </h1>

          <div className="mt-14 border-t border-[rgba(183,214,255,.14)]">
            {socials.map(([name, copy, href], index) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="grid gap-4 border-b border-[rgba(183,214,255,.1)] py-7 no-underline transition hover:bg-[rgba(111,168,255,.045)] sm:grid-cols-[60px_220px_1fr_30px]"
              >
                <span className="cw-label text-[#6fa8ff]">0{index + 1}</span>
                <span className="font-semibold">{name}</span>
                <span className="text-sm text-[#8ea2ba]">{copy}</span>
                <span className="text-[#6fa8ff]">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
