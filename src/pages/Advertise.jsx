import Footer from "../components/Footer";

const placements = [
  ["Sponsored community", "Put a server or community in front of people exploring the ecosystem."],
  ["Featured story", "Support an editorial feature, launch, event, or community spotlight."],
  ["Partner placement", "Build a longer-term presence across CLOCKWYRD surfaces."],
];

export default function Advertise() {
  return (
    <main className="cw-page pt-20">
      <section className="cw-section">
        <div className="cw-wrap grid gap-14 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <div>
            <p className="cw-label text-[#6fa8ff]">Advertising</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-[-0.06em] sm:text-7xl">Promotion that belongs inside the ecosystem.</h1>
            <p className="cw-copy mt-6 max-w-2xl">CLOCKWYRD will make room for communities, creators, and brands to reach an audience through useful content and community discovery.</p>
          </div>

          <div className="cw-panel p-7">
            <p className="cw-label">Campaigns</p>
            <p className="mt-4 text-2xl font-semibold">Advertising tools are being built.</p>
            <p className="mt-3 text-sm leading-6 text-[#8ea2ba]">For now, this page defines the direction. Campaign creation, placements, and analytics will connect to the control dashboard later.</p>
            <a href="mailto:hello@clockwyrd.com" className="cw-button mt-7">Talk to CLOCKWYRD</a>
          </div>
        </div>

        <div className="cw-wrap mt-16">
          <p className="cw-label text-[#6fa8ff]">Potential placements</p>
          <div className="mt-5 border-y border-[rgba(183,214,255,.14)]">
            {placements.map(([title, copy], index) => (
              <div key={title} className="grid gap-4 border-b border-[rgba(183,214,255,.1)] py-7 last:border-b-0 sm:grid-cols-[64px_220px_1fr]">
                <span className="cw-label text-[#6fa8ff]">0{index + 1}</span>
                <h2 className="font-semibold">{title}</h2>
                <p className="m-0 text-sm leading-6 text-[#8ea2ba]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
