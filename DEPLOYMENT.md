# CLOCKWYRD deployment map

## 1. Vercel = website + OAuth

Deploy the repository root to Vercel.

Vercel environment variables:

```env
VITE_RENDER_URL=https://saint-host-1.onrender.com
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
GUILD_ID=...
BOT_TOKEN=...
OWNER_USER_ID=...
# OWNER_ROLE_ID=...   # optional alternative to OWNER_USER_ID
SESSION_SECRET=...
SITE_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
```

The Discord OAuth redirect URI is:

```text
https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback
```

Add that exact URL under Discord Developer Portal → OAuth2 → Redirects.

## 2. Render = Discord bot/API

Deploy the `server/` directory as its own Render Web Service.

Environment variables:

```env
NODE_ENV=production
BOT_TOKEN=...
GUILD_ID=...
CLIENT_ORIGIN=https://YOUR-VERCEL-DOMAIN.vercel.app
```

Render endpoints:

- `GET /api/ping` — lightweight monitor endpoint
- `GET /api/health` — bot readiness/uptime
- `GET /api/server-stats` — server snapshot used by the CLOCKWYRD dashboard

Do not put the Discord OAuth client secret or session secret in Render for this architecture.

## 3. UptimeRobot

Create an HTTP(s) monitor pointed directly at:

```text
https://saint-host-1.onrender.com/api/ping
```

Expected HTTP status: `200`.

UptimeRobot is a monitor/alerting service. A ping can also help keep an HTTP service active depending on the hosting provider's current policy, but it should not be treated as a guaranteed anti-sleep mechanism.
