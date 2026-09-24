import { useEffect } from "react";

export default function DiscordCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace("#", ""));
    const accessToken = params.get("access_token");

    if (!accessToken || !import.meta.env.VITE_API_URL) {
      window.location.href = "/";
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/check-member`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Owner only access");
        const data = await res.json();
        if (!data.success) throw new Error("Owner only access");
        localStorage.setItem("discord_token", accessToken);
        window.location.href = "/dashboard";
      })
      .catch(() => {
        localStorage.removeItem("discord_token");
        alert("Owner only access");
        window.location.href = "/";
      });
  }, []);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#07101d] px-5 text-[#edf5ff]">
      <div className="w-full max-w-md border border-[rgba(183,214,255,.16)] bg-[#0d1b2d] p-8">
        <p className="cw-label text-[#6fa8ff]">CLOCKWYRD</p>
        <h1 className="mt-4 text-3xl font-bold">Authenticating.</h1>
        <p className="mt-3 text-sm leading-6 text-[#8ea2ba]">Checking Discord access and preparing your dashboard session.</p>
        <div className="mt-7 h-1 overflow-hidden bg-[#10233a]">
          <div className="h-full w-1/2 animate-pulse bg-[#6fa8ff]" />
        </div>
      </div>
    </main>
  );
}
