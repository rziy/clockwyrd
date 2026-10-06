# CLOCKWYRD

CLOCKWYRD is a Discord-centered digital ecosystem combining media, community, utilities, events, and Discord infrastructure.

## What changed in this version

- Fixed the broken dashboard JSX/navigation markup.
- Added a real 404 page and a global React error recovery screen.
- Reworked Discord authentication to use a backend authorization-code flow and an HTTP-only session cookie instead of storing an OAuth access token in `localStorage`.
- Removed real server credentials from the shared project; use `server/.env.example`.
- Added dashboard health/Discord status, content metrics, recent work, and quick actions.
- Expanded the content system with search, filters, edit, delete, preview, local autosave, word count, read-time estimate, slugs, and public article pages.
- Turned Utilities into working timestamp, Discord snowflake, and JSON tools.
- Turned Events into a local calendar/event manager with date selection and event creation.
- Improved bot installation so permissions are configurable instead of silently requesting Administrator.
- Added graceful API errors and safer server configuration.

## Stack

- React 19 + Vite
- React Router
- Tailwind CSS
- Express + discord.js

## Local development

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
node index.js
```

Create `server/.env` from `server/.env.example` and fill in:

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `DISCORD_REDIRECT_URI`
- `BOT_TOKEN`
- `GUILD_ID`
- `OWNER_USER_ID` and/or `OWNER_ROLE_ID`
- `SESSION_SECRET`
- `CLIENT_ORIGIN`

Create the frontend `.env` from `.env.example` and set `VITE_API_URL`.

For local development, the Discord OAuth redirect should be:

```text
http://localhost:10000/api/auth/callback
```

Add that exact redirect URI to the Discord application's OAuth2 settings.

## Security notes

Never commit `.env` or `server/.env`. The distributable ZIP intentionally contains only examples. If a real bot token or client secret was previously exposed in a ZIP, repository, log, or chat, rotate it in the Discord Developer Portal before using the project again.

## Content storage

The editorial library and events currently use browser `localStorage`, so they are intentionally local to the browser. This keeps the project dependency-free while it is still in its early stage. A database/API persistence layer can be added later without changing the editor UI.
