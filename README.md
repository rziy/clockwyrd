# CLOCKWYRD

CLOCKWYRD is being built as a Discord-centered digital ecosystem combining four layers:

- **Media** — stories, updates, guides, spotlights, and useful context.
- **Community** — servers, events, partners, creators, and discovery.
- **Utility** — Discord tools, server information, generators, and practical helpers.
- **Advertising** — community and brand promotion designed to live inside the ecosystem.

The Discord bot and owner dashboard are infrastructure inside the ecosystem, not the whole product.

## Stack

- React + Vite
- React Router
- Tailwind CSS
- Express
- discord.js

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

Keep real `.env` files local. Use `.env.example` and `server/.env.example` when sharing the project.
