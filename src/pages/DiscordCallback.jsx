import { Link, useSearchParams } from "react-router-dom";

export default function DiscordCallback() {
  const [params] = useSearchParams();
  const denied = params.get("auth") === "denied";
  return <main className="flex min-h-[100dvh] items-center justify-center bg-[#07101d] px-5 text-[#edf5ff]"><div className="w-full max-w-md border border-white/10 bg-[#0d1b2d] p-8"><p className="cw-label text-[#6fa8ff]">CLOCKWYRD / AUTH</p><h1 className="mt-4 text-3xl font-bold">{denied ? "Access denied." : "Authentication complete."}</h1><p className="mt-3 text-sm leading-6 text-[#8ea2ba]">{denied ? "Your Discord account is not allowed to access the owner control area." : "Return to the dashboard to continue."}</p><Link to={denied ? "/" : "/dashboard"} className="cw-button mt-7">{denied ? "Back home" : "Open dashboard"}</Link></div></main>;
}
