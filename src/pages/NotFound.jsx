import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="cw-page pt-20">
      <section className="cw-section">
        <div className="cw-wrap">
          <p className="cw-label text-[#6fa8ff]">404 / NOT FOUND</p>
          <h1 className="mt-5 text-6xl font-bold tracking-[-0.06em] sm:text-8xl">Lost signal.</h1>
          <p className="cw-copy mt-6 max-w-xl">That CLOCKWYRD route does not exist, or it moved.</p>
          <Link to="/" className="cw-button mt-8">Return home</Link>
        </div>
      </section>
    </main>
  );
}
