export default function AddBot() {
  return (
    <main className="cw-page pt-24">
      <section className="cw-section">
        <div className="cw-wrap grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="cw-label text-[#6fa8ff]">Installation</p>
            <h1 className="mt-5 text-5xl font-bold tracking-[-0.06em] sm:text-7xl">
              Put the system on your server.
            </h1>
            <p className="cw-copy mt-6 max-w-xl">
              Connect CLOCKWYRD to a Discord server and give it room to handle the useful routine work.
            </p>
            <a
              href="https://discord.com/oauth2/authorize?client_id=1465978664419065920"
              target="_blank"
              rel="noopener noreferrer"
              className="cw-button mt-8"
            >
              Add CLOCKWYRD
            </a>
          </div>

          <div className="border-t border-[rgba(183,214,255,.14)]">
            {[
              ["Moderation", "Keep routine moderation tools close to the people running the server."],
              ["Utility", "Commands and automation for the everyday work around a community."],
              ["Community", "Build space for events, conversation, and the people behind the server."],
            ].map(([title, copy], index) => (
              <div key={title} className="grid gap-4 border-b border-[rgba(183,214,255,.1)] py-7 sm:grid-cols-[56px_170px_1fr]">
                <span className="cw-label text-[#6fa8ff]">0{index + 1}</span>
                <h2 className="font-semibold">{title}</h2>
                <p className="m-0 text-sm leading-6 text-[#8ea2ba]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
