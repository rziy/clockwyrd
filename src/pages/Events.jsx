import { useState } from "react";
import Calendar from "react-calendar";
import "../calendar.css";

const logs = [
  ["Nobar", "Community watch party and voice chat."],
  ["Mabar", "Friendly games and late-night sessions."],
  ["Rezeki Dadakan", "Community rewards and small surprises."],
];

export default function Events() {
  const [date, setDate] = useState(new Date());

  return (
    <main className="cw-page pt-24">
      <section className="cw-section pb-16">
        <div className="cw-wrap">
          <p className="cw-label text-[#6fa8ff]">Events</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-[-0.06em] sm:text-7xl">
            Things happening around the server.
          </h1>
          <p className="cw-copy mt-6 max-w-xl">
            A simple place for community schedules, dates, and recent activity.
          </p>

          <div className="mt-14 grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div className="cw-panel p-6">
              <p className="cw-label">Calendar</p>
              <div className="mt-6 overflow-x-auto">
                <Calendar onChange={setDate} value={date} />
              </div>
            </div>

            <div>
              <div className="border-t border-[rgba(183,214,255,.14)]">
                {logs.map(([title, copy], index) => (
                  <div key={title} className="grid gap-4 border-b border-[rgba(183,214,255,.1)] py-7 sm:grid-cols-[60px_190px_1fr]">
                    <span className="cw-label text-[#6fa8ff]">0{index + 1}</span>
                    <h2 className="font-semibold">{title}</h2>
                    <p className="m-0 text-sm leading-6 text-[#8ea2ba]">{copy}</p>
                  </div>
                ))}
              </div>
              <p className="mt-7 text-xs text-[#62748b]">
                Selected date: {date.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
