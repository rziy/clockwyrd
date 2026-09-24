import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const areas = [
  ["Servers", "Find communities and public spaces worth exploring.", "/partner"],
  ["Events", "See what is happening around the CLOCKWYRD community.", "/events"],
  ["Partners", "Explore communities and projects connected to the ecosystem.", "/partner"],
];

export default function Discover() {
  return (
    <main className="cw-page pt-20">
      <section className="cw-section">
        <div className="cw-wrap">
          <p className="cw-label text-[#6fa8ff]">Discover</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-[-0.06em] sm:text-7xl">Find people, places, and things worth joining.</h1>
          <p className="cw-copy mt-6 max-w-2xl">The community layer of CLOCKWYRD. Discovery starts small and grows with the ecosystem.</p>

          <div className="mt-14 border-t border-[rgba(183,214,255,.14)]">
            {areas.map(([title, copy, href], index) => (
              <Link key={title} to={href} className="grid gap-4 border-b border-[rgba(183,214,255,.1)] py-8 transition hover:bg-[rgba(111,168,255,.035)] sm:grid-cols-[64px_220px_1fr_30px]">
                <span className="cw-label text-[#6fa8ff]">0{index + 1}</span>
                <h2 className="font-semibold">{title}</h2>
                <p className="m-0 text-sm leading-6 text-[#8ea2ba]">{copy}</p>
                <span className="text-[#6fa8ff]">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
