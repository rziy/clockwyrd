import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client, GatewayIntentBits, ChannelType } from "discord.js";

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 10000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.disable("x-powered-by");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] });
let botReady = false;

client.once("ready", () => { botReady = true; console.log(`CLOCKWYRD API READY AS ${client.user.tag}`); });
client.on("error", (error) => console.error("DISCORD CLIENT ERROR:", error));


app.get("/", (_req, res) => res.json({ name: "CLOCKWYRD Bot API", status: "online", service: "discord-bot" }));
app.get("/api/health", (_req, res) => res.json({ success: true, service: "clockwyrd-bot", botReady, uptime: Math.round(process.uptime()), guildId: process.env.GUILD_ID || null, timestamp: new Date().toISOString() }));
app.get("/api/ping", (_req, res) => res.status(200).json({ status: "ok", service: "clockwyrd-bot", botReady, uptime: Math.round(process.uptime()), timestamp: new Date().toISOString() }));

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
