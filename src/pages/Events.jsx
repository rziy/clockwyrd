import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "../calendar.css";

const KEY = "clockwyrd_events";
const seed = [{ id: "seed-1", title: "Nobar", description: "Community watch party and voice chat.", date: new Date().toISOString().slice(0, 10) }, { id: "seed-2", title: "Mabar", description: "Friendly games and late-night sessions.", date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10) }];
function load() { try { const data = JSON.parse(localStorage.getItem(KEY) || "null"); return Array.isArray(data) ? data : seed; } catch { return seed; } }

export default function Events() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState(load);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const selected = date.toISOString().slice(0, 10);
  const dayEvents = useMemo(() => events.filter((event) => event.date === selected), [events, selected]);
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(events)), [events]);
  const add = (e) => { e.preventDefault(); if (!title.trim()) return; setEvents((items) => [...items, { id: `${Date.now()}`, title: title.trim(), description: description.trim(), date: selected }]); setTitle(""); setDescription(""); };
  const remove = (id) => setEvents((items) => items.filter((item) => item.id !== id));

  return <main className="cw-page pt-24"><section className="cw-section pb-16"><div className="cw-wrap"><p className="cw-label text-[#6fa8ff]">Events</p><h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-[-0.06em] sm:text-7xl">Things happening around the server.</h1><p className="cw-copy mt-6 max-w-xl">Create a lightweight local event board and use the calendar to jump between dates.</p>
    <div className="mt-14 grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div className="cw-panel p-6"><p className="cw-label">Calendar</p><div className="mt-6 overflow-x-auto"><Calendar onChange={setDate} value={date} tileContent={({ date: tileDate }) => events.some((event) => event.date === tileDate.toISOString().slice(0, 10)) ? <span className="mx-auto mt-1 block h-1 w-1 rounded-full bg-[#6fa8ff]" /> : null} /></div></div><div><div className="flex items-center justify-between gap-4"><div><p className="cw-label text-[#6fa8ff]">{date.toLocaleDateString()}</p><h2 className="mt-2 text-2xl font-semibold">Schedule</h2></div><span className="text-xs text-[#64758b]">{dayEvents.length} event{dayEvents.length === 1 ? "" : "s"}</span></div><div className="mt-5 border-t border-white/10">{dayEvents.length ? dayEvents.map((event) => <div key={event.id} className="flex items-start justify-between gap-4 border-b border-white/10 py-6"><div><h3 className="font-semibold">{event.title}</h3><p className="mt-2 text-sm leading-6 text-[#8ea2ba]">{event.description || "No description."}</p></div><button onClick={() => remove(event.id)} className="text-xs text-red-300">Delete</button></div>) : <p className="py-8 text-sm text-[#64758b]">No events on this date.</p>}</div><form onSubmit={add} className="mt-8 border border-white/10 bg-[#081321] p-5"><p className="cw-label">Add event</p><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event name" className="mt-4 w-full border border-white/10 bg-[#0a1727] px-4 py-3 text-sm" /><input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" className="mt-3 w-full border border-white/10 bg-[#0a1727] px-4 py-3 text-sm" /><button className="cw-button mt-4">Add to {date.toLocaleDateString()}</button></form></div></div>
  </div></section></main>;
}
