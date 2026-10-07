# CLOCKWYRD

CLOCKWYRD is split into two services:

- **Vercel:** the public website, Discord OAuth/session endpoints, dashboard UI, and web utilities.
- **Render:** the Discord bot and lightweight bot API (`/api/health`, `/api/ping`, `/api/server-stats`).
- **UptimeRobot:** monitor the Render endpoint `https://saint-host-1.onrender.com/api/ping` (or `/api/health`) to detect downtime and keep the service warm where applicable. Monitoring does not guarantee a hosting provider will never sleep/restart a service.

## Local development

```bash
npm install
npm run dev
```

Set `VITE_RENDER_URL` to the Render bot API URL.

For the Render bot:

```bash
cd server
npm install
npm start
```

## Vercel OAuth configuration

Add these as **Vercel Environment Variables** (not GitHub files):

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `GUILD_ID`
- `BOT_TOKEN`
- `OWNER_USER_ID` and/or `OWNER_ROLE_ID`
- `SESSION_SECRET`
- `SITE_URL` (the production Vercel URL)

Discord Developer Portal → OAuth2 → Redirects must contain:

`https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback`

OAuth is intentionally handled by Vercel. Render is not the OAuth callback server.

## Render bot configuration

Add only bot/API secrets to Render:

- `BOT_TOKEN`
- `GUILD_ID`
- `CLIENT_ORIGIN`
- `PORT` (Render normally provides this automatically)

The Render service exposes:

- `/api/ping` — lightweight UptimeRobot monitor
- `/api/health` — bot health/status
- `/api/server-stats` — guild statistics

## Security

Never commit `.env`, `server/.env`, Discord client secrets, or bot tokens. Use Vercel/Render environment variables.
