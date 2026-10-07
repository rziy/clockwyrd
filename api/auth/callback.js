import { env, configured, redirectUri, siteUrl, setSession, getDiscordUser } from "../_auth.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ success: false, error: "Method not allowed" });
  const base = siteUrl(req);
  try {
    if (!req.query.code || !configured()) return res.redirect(`${base}/?auth=error&reason=not_configured`);
    const body = new URLSearchParams({
      client_id: env("DISCORD_CLIENT_ID"),
      client_secret: env("DISCORD_CLIENT_SECRET"),
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: redirectUri(req),
    });
    const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!tokenResponse.ok) throw new Error("Discord authorization failed");
    const token = await tokenResponse.json();
    const user = await getDiscordUser(token.access_token);

    let allowed = env("OWNER_USER_ID") === user.id;
    if (!allowed && env("OWNER_ROLE_ID")) {
      if (!env("GUILD_ID") || !env("BOT_TOKEN")) throw new Error("OWNER_ROLE_ID requires GUILD_ID and BOT_TOKEN");
      const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${env("GUILD_ID")}/members/${user.id}`, {
        headers: { Authorization: `Bot ${env("BOT_TOKEN")}` },
      });
      if (memberResponse.ok) {
        const member = await memberResponse.json();
        allowed = member.roles?.includes(env("OWNER_ROLE_ID")) ?? false;
      }
    }
    if (!allowed) return res.redirect(`${base}/?auth=denied`);

    setSession(res, {
      id: user.id,
      username: user.global_name || user.username,
      avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : null,
    });
    return res.redirect(`${base}/dashboard`);
  } catch (error) {
    console.error("OAUTH ERROR:", error);
    return res.redirect(`${base}/?auth=error`);
  }
}
