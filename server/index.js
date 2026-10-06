import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client, GatewayIntentBits, ChannelType } from "discord.js";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 10000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const SESSION_SECRET = process.env.SESSION_SECRET;
const COOKIE_NAME = "clockwyrd_session";
const DISCORD_API = "https://discord.com/api/v10";

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.disable("x-powered-by");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });
let botReady = false;

client.once("ready", () => { botReady = true; console.log(`CLOCKWYRD API READY AS ${client.user.tag}`); });
client.on("error", (error) => console.error("DISCORD CLIENT ERROR:", error));

function requireConfig(keys) {
  return keys.every((key) => Boolean(process.env[key]));
}
function sign(value) { return crypto.createHmac("sha256", SESSION_SECRET || "missing-secret").update(value).digest("base64url"); }
function makeSession(user) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
function readCookies(header = "") {
  const result = {};
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 1) continue;
    const key = part.slice(0, index).trim();
    try { result[key] = decodeURIComponent(part.slice(index + 1)); } catch {}
  }
  return result;
}
function readSession(req) {
  if (!SESSION_SECRET) return null;
  const raw = readCookies(req.headers.cookie || "")[COOKIE_NAME];
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) return null;
  try { const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")); return data.exp > Date.now() ? data : null; } catch { return null; }
}
function setSession(res, user) { res.setHeader("Set-Cookie", `${COOKIE_NAME}=${encodeURIComponent(makeSession(user))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800${process.env.NODE_ENV === "production" ? "; Secure" : ""}`); }
function clearSession(res) { res.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${process.env.NODE_ENV === "production" ? "; Secure" : ""}`); }
function requireSession(req, res, next) { const session = readSession(req); if (!session) return res.status(401).json({ success: false, error: "Not authenticated" }); req.session = session; next(); }

app.get("/", (_req, res) => res.json({ name: "CLOCKWYRD", status: "online", version: "2.0" }));
app.get("/api/health", (_req, res) => res.json({ success: true, botReady, uptime: Math.round(process.uptime()), timestamp: new Date().toISOString() }));

app.get("/api/auth/discord", (_req, res) => {
  if (!requireConfig(["DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET", "DISCORD_REDIRECT_URI", "GUILD_ID"])) return res.status(503).send("Discord OAuth is not configured.");
  const params = new URLSearchParams({ client_id: process.env.DISCORD_CLIENT_ID, response_type: "code", redirect_uri: process.env.DISCORD_REDIRECT_URI, scope: "identify" });
  res.redirect(`https://discord.com/oauth2/authorize?${params.toString()}`);
});

app.get("/api/auth/callback", async (req, res) => {
  try {
    if (!req.query.code || !requireConfig(["DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET", "DISCORD_REDIRECT_URI", "GUILD_ID", "BOT_TOKEN", "SESSION_SECRET"])) return res.status(503).send("Authentication is not configured.");
    const body = new URLSearchParams({ client_id: process.env.DISCORD_CLIENT_ID, client_secret: process.env.DISCORD_CLIENT_SECRET, grant_type: "authorization_code", code: req.query.code, redirect_uri: process.env.DISCORD_REDIRECT_URI });
    const tokenResponse = await fetch(`${DISCORD_API}/oauth2/token`, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
    if (!tokenResponse.ok) throw new Error("Discord authorization failed");
    const token = await tokenResponse.json();
    const userResponse = await fetch(`${DISCORD_API}/users/@me`, { headers: { Authorization: `Bearer ${token.access_token}` } });
    if (!userResponse.ok) throw new Error("Could not read Discord user");
    const user = await userResponse.json();
    let allowed = process.env.OWNER_USER_ID === user.id;
    if (!allowed && process.env.OWNER_ROLE_ID) {
      const memberResponse = await fetch(`${DISCORD_API}/guilds/${process.env.GUILD_ID}/members/${user.id}`, { headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` } });
      if (memberResponse.ok) { const member = await memberResponse.json(); allowed = member.roles?.includes(process.env.OWNER_ROLE_ID) ?? false; }
    }
    if (!allowed) return res.redirect(`${CLIENT_ORIGIN}/?auth=denied`);
    setSession(res, { id: user.id, username: user.global_name || user.username, avatar: user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64` : null });
    res.redirect(`${CLIENT_ORIGIN}/dashboard`);
  } catch (error) {
    console.error("OAUTH ERROR:", error);
    res.redirect(`${CLIENT_ORIGIN}/?auth=error`);
  }
});

app.get("/api/auth/me", requireSession, (req, res) => res.json({ success: true, user: { id: req.session.id, username: req.session.username, avatar: req.session.avatar } }));
app.post("/api/auth/logout", (_req, res) => { clearSession(res); res.json({ success: true }); });

app.get("/api/check-member", requireSession, (req, res) => res.json({ success: true, user: { id: req.session.id, username: req.session.username, avatar: req.session.avatar } }));

app.get("/api/server-stats", async (_req, res) => {
  try {
    if (!botReady) return res.status(503).json({ success: false, error: "Bot not ready yet" });
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) return res.status(404).json({ success: false, error: "Guild not found" });
    const online = guild.members.cache.filter((member) => member.presence?.status && member.presence.status !== "offline").size;
    const count = (types) => guild.channels.cache.filter((channel) => types.includes(channel.type)).size;
    const ownerMember = guild.members.cache.get(guild.ownerId);
    res.json({ success: true, serverName: guild.name, serverId: guild.id, icon: guild.iconURL({ size: 256, extension: "png" }), members: guild.memberCount, online, channels: guild.channels.cache.size, textChannels: count([ChannelType.GuildText, ChannelType.GuildAnnouncement]), voiceChannels: count([ChannelType.GuildVoice, ChannelType.GuildStageVoice]), categories: count([ChannelType.GuildCategory]), roles: guild.roles.cache.size, ownerId: guild.ownerId, ownerName: ownerMember?.user?.globalName || ownerMember?.user?.username || null, verificationLevel: guild.verificationLevel, boostLevel: guild.premiumTier || 0, boostCount: guild.premiumSubscriptionCount || 0, latency: client.ws.ping });
  } catch (error) { console.error("SERVER STATS ERROR:", error); res.status(500).json({ success: false, error: "Failed to read server state" }); }
});

app.use((_req, res) => res.status(404).json({ success: false, error: "Endpoint not found" }));

app.listen(PORT, () => console.log(`CLOCKWYRD API running on port ${PORT}`));
if (!process.env.BOT_TOKEN) console.warn("BOT_TOKEN is not configured; Discord bot will not start.");
else client.login(process.env.BOT_TOKEN).catch((error) => console.error("DISCORD LOGIN ERROR:", error));
