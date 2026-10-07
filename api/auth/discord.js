import { env, configured, redirectUri } from "../_auth.js";

export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ success: false, error: "Method not allowed" });
  if (!configured()) return res.status(503).send("Discord OAuth is not configured on Vercel.");
  const params = new URLSearchParams({
    client_id: env("DISCORD_CLIENT_ID"),
    response_type: "code",
    redirect_uri: redirectUri(req),
    scope: "identify",
  });
  res.redirect(`https://discord.com/oauth2/authorize?${params.toString()}`);
}
