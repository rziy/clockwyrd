import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function snowflakeInfo(value) {
  try {
    const id = BigInt(value.trim());
    const discordEpoch = 1420070400000n;
    const timestamp = Number((id >> 22n) + discordEpoch);
    const worker = Number((id >> 17n) & 31n);
    const process = Number((id >> 12n) & 31n);
    const increment = Number(id & 4095n);
    return { timestamp: new Date(timestamp), worker, process, increment };
  } catch { return null; }
}

export default function Utilities() {
  const [timestampDate, setTimestampDate] = useState(() => new Date(Date.now() + 3600000).toISOString().slice(0, 16));
  const [snowflake, setSnowflake] = useState("");
  const [json, setJson] = useState('{"clockwyrd":true}');
  const [jsonOutput, setJsonOutput] = useState("");
  const info = useMemo(() => snowflake ? snowflakeInfo(snowflake) : null, [snowflake]);
  const unix = Math.floor(new Date(timestampDate).getTime() / 1000);
  const timestampTags = [`<t:${unix}:F>`, `<t:${unix}:R>`, `<t:${unix}:d>`, `<t:${unix}:T>`];

  const formatJson = () => { try { setJsonOutput(JSON.stringify(JSON.parse(json), null, 2)); } catch (error) { setJsonOutput(`Invalid JSON: ${error.message}`); } };
  const copy = async (value) => { try { await navigator.clipboard.writeText(value); } catch {} };

  return <main className="cw-page pt-20"><section className="cw-section"><div className="cw-wrap"><p className="cw-label text-[#6fa8ff]">Utilities</p><h1 className="mt-5 max-w-4xl text-5xl font-bold tracking-[-0.06em] sm:text-7xl">Useful things, without the clutter.</h1><p className="cw-copy mt-6 max-w-2xl">Small Discord helpers you can use immediately—no account, extension, or external service required.</p>
    <div className="mt-14 grid gap-4 lg:grid-cols-2">
      <section className="cw-panel p-6"><p className="cw-label text-[#6fa8ff]">Timestamp generator</p><h2 className="mt-3 text-xl font-semibold">Make Discord timestamps</h2><input type="datetime-local" value={timestampDate} onChange={(e) => setTimestampDate(e.target.value)} className="mt-5 w-full border border-white/10 bg-[#0a1727] px-4 py-3 text-sm" /><div className="mt-5 grid gap-2">{timestampTags.map((tag) => <button key={tag} onClick={() => copy(tag)} className="flex items-center justify-between border border-white/10 px-4 py-3 text-left text-sm hover:bg-white/5"><code>{tag}</code><span className="text-xs text-[#64758b]">Copy</span></button>)}</div><p className="mt-4 text-xs text-[#64758b]">Preview: <span className="text-[#b8d8ff]">{new Date(unix * 1000).toLocaleString()}</span></p></section>
      <section className="cw-panel p-6"><p className="cw-label text-[#6fa8ff]">Snowflake decoder</p><h2 className="mt-3 text-xl font-semibold">Inspect a Discord ID</h2><input value={snowflake} onChange={(e) => setSnowflake(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 123456789012345678" className="mt-5 w-full border border-white/10 bg-[#0a1727] px-4 py-3 text-sm" />{info ? <div className="mt-5 grid gap-3 text-sm">{[["Created", info.timestamp.toLocaleString()], ["Worker", info.worker], ["Process", info.process], ["Increment", info.increment]].map(([k, v]) => <div key={k} className="flex justify-between border-b border-white/10 py-2"><span className="text-[#8ea2ba]">{k}</span><span>{v}</span></div>)}</div> : <p className="mt-5 text-xs text-[#64758b]">Paste a valid Discord snowflake to decode its creation time.</p>}</section>
      <section className="cw-panel p-6 lg:col-span-2"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="cw-label text-[#6fa8ff]">JSON formatter</p><h2 className="mt-3 text-xl font-semibold">Clean up API payloads</h2></div><button onClick={formatJson} className="cw-button">Format JSON</button></div><div className="mt-5 grid gap-4 lg:grid-cols-2"><textarea value={json} onChange={(e) => setJson(e.target.value)} className="min-h-48 border border-white/10 bg-[#0a1727] p-4 font-mono text-xs outline-none focus:border-[#6fa8ff]" /><pre className="min-h-48 overflow-auto border border-white/10 bg-[#06101b] p-4 font-mono text-xs text-[#b8d8ff]">{jsonOutput || "Formatted output appears here."}</pre></div></section>
    </div>
    <div className="mt-10 grid gap-4 sm:grid-cols-3"><Link to="/server-info" className="border border-white/10 p-5 hover:bg-white/[.02]"><p className="font-semibold">Server information</p><p className="mt-2 text-xs text-[#64758b]">Live server snapshot →</p></Link><Link to="/events" className="border border-white/10 p-5 hover:bg-white/[.02]"><p className="font-semibold">Events</p><p className="mt-2 text-xs text-[#64758b]">Community scheduling →</p></Link><Link to="/add-bot" className="border border-white/10 p-5 hover:bg-white/[.02]"><p className="font-semibold">Bot setup</p><p className="mt-2 text-xs text-[#64758b]">Install CLOCKWYRD →</p></Link></div>
  </div></section><Footer /></main>;
}
