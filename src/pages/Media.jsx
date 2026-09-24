import Footer from "../components/Footer";

const stories = [
  ["Discord culture", "A place for updates, explainers, and stories around the communities using Discord."],
  ["Community spotlight", "Feature communities, creators, projects, and the people behind them."],
  ["Guides & utility", "Practical pieces that help people build, run, and enjoy their communities."],
  ["Events & signals", "A public layer for events, launches, announcements, and things worth watching."],
];

export default function Media() {
  return (
    <main className="cw-page pt-20">
      <section className="cw-section">
        <div className="cw-wrap">
          <p className="cw-label text-[#6fa8ff]">Media</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-[-0.06em] sm:text-7xl">Stories from the Discord ecosystem.</h1>
          <p className="cw-copy mt-6 max-w-2xl">The editorial side of CLOCKWYRD: news, culture, community spotlights, guides, and useful context.</p>

          <div className="mt-14 grid gap-0 border-y border-[rgba(183,214,255,.14)] md:grid-cols-2">
            {stories.map(([title, copy], index) => (
              <article key={title} className="border-b border-[rgba(183,214,255,.1)] p-7 last:border-b-0 md:border-r md:nth-[2n]:border-r-0">
                <p className="cw-label text-[#6fa8ff]">0{index + 1}</p>
                <h2 className="mt-5 text-2xl font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#8ea2ba]">{copy}</p>
                <span className="mt-7 inline-block text-xs text-[#62748b]">Editorial space — coming online</span>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
