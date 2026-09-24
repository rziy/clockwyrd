import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  Client,
  GatewayIntentBits,
  ChannelType,
} from "discord.js";

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 10000;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

let botReady = false;

// =========================
// DISCORD READY
// =========================

client.once("ready", () => {
  console.log(`CLOCKWYRD API READY AS ${client.user.tag}`);
  botReady = true;
});

client.on("error", (err) => {
  console.log("CLIENT ERROR:", err);
});

client.on("warn", (msg) => {
  console.log("CLIENT WARN:", msg);
});

// =========================
// ROOT
// =========================

app.get("/", (_req, res) => {
  res.json({
    name: "CLOCKWYRD",
    status: "online",
  });
});

// =========================
// HEALTH
// =========================

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    botReady,
  });
});

// =========================
// CHECK MEMBER / OWNER AUTH
// =========================

app.get("/api/check-member", async (req, res) => {
  try {
    const header = req.headers.authorization || "";

    const accessToken = header.startsWith("Bearer ")
      ? header.slice("Bearer ".length)
      : null;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        error: "Missing token",
      });
    }

    const userResponse = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!userResponse.ok) {
      return res.status(401).json({
        success: false,
        error: "Invalid Discord token",
      });
    }

    const user = await userResponse.json();

    const guildId = process.env.GUILD_ID;
    const ownerUserId = process.env.OWNER_USER_ID;
    const ownerRoleId = process.env.OWNER_ROLE_ID;

    if (!guildId || (!ownerUserId && !ownerRoleId)) {
      return res.status(500).json({
        success: false,
        error: "Owner access is not configured",
      });
    }

    let allowed = ownerUserId === user.id;

    // Check owner role if direct owner ID does not match
    if (!allowed && ownerRoleId) {
      const memberResponse = await fetch(
        `https://discord.com/api/guilds/${guildId}/members/${user.id}`,
        {
          headers: {
            Authorization: `Bot ${process.env.BOT_TOKEN}`,
          },
        },
      );

      if (memberResponse.ok) {
        const member = await memberResponse.json();

        allowed =
          member.roles?.includes(ownerRoleId) ?? false;
      }
    }

    if (!allowed) {
      return res.status(403).json({
        success: false,
        error: "Owner only access",
      });
    }

    return res.json({
      success: true,

      user: {
        id: user.id,
        username: user.global_name || user.username,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log("AUTH ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Authentication service unavailable",
    });
  }
});

// =========================
// SERVER STATS
// =========================

app.get("/api/server-stats", async (_req, res) => {
  try {
    if (!botReady) {
      return res.json({
        success: false,
        error: "Bot not ready yet",
      });
    }

    const guild = client.guilds.cache.get(
      process.env.GUILD_ID,
    );

    if (!guild) {
      return res.status(404).json({
        success: false,
        error: "Guild not found",
      });
    }

    // =========================
    // ONLINE MEMBERS
    // =========================

    const online = guild.members.cache.filter(
      (member) =>
        member.presence?.status &&
        member.presence.status !== "offline",
    ).size;

    // =========================
    // CHANNEL BREAKDOWN
    // =========================

    const textChannels = guild.channels.cache.filter(
      (channel) =>
        channel.type === ChannelType.GuildText ||
        channel.type === ChannelType.GuildAnnouncement,
    ).size;

    const voiceChannels = guild.channels.cache.filter(
      (channel) =>
        channel.type === ChannelType.GuildVoice ||
        channel.type === ChannelType.GuildStageVoice,
    ).size;

    const categories = guild.channels.cache.filter(
      (channel) =>
        channel.type === ChannelType.GuildCategory,
    ).size;

    // =========================
    // OWNER
    // =========================

    const ownerId = guild.ownerId;

    const ownerMember = guild.members.cache.get(ownerId);

    const ownerName =
      ownerMember?.user?.globalName ||
      ownerMember?.user?.username ||
      null;

    // =========================
    // BOT LATENCY
    // =========================

    const latency = client.ws.ping;

    // =========================
    // SERVER ICON
    // =========================

    const icon = guild.iconURL({
      size: 256,
      extension: "png",
    });

    // =========================
    // BOOST INFORMATION
    // =========================

    const boostLevel = guild.premiumTier || 0;

    const boostCount =
      guild.premiumSubscriptionCount || 0;

    // =========================
    // VERIFICATION
    // =========================

    const verificationLevel =
      guild.verificationLevel;

    // =========================
    // RESPONSE
    // =========================

    return res.json({
      success: true,

      // Basic
      serverName: guild.name,
      serverId: guild.id,
      icon,

      // Members
      members: guild.memberCount,
      online,

      // Channels
      channels: guild.channels.cache.size,
      textChannels,
      voiceChannels,
      categories,

      // Roles
      roles: guild.roles.cache.size,

      // Owner
      ownerId,
      ownerName,

      // Discord settings
      verificationLevel,

      // Boost
      boostLevel,
      boostCount,

      // Bot
      latency,
    });
  } catch (error) {
    console.log("API ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// =========================
// START API
// =========================

app.listen(PORT, () => {
  console.log(
    `CLOCKWYRD API running on port ${PORT}`,
  );
});

// =========================
// LOGIN DISCORD BOT
// =========================

client.login(process.env.BOT_TOKEN);