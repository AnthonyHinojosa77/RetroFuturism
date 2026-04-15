# Retro Universe

A retro-futuristic, point-and-click social web app. Three worlds — **Astro Diner**,
**Cosmic Voyages**, and **Atomic Expo** — each packed with five clickable hotspots
that invite visitors to discover lore, leave postcards, invent dishes, and seal
predictions into a time capsule.

Built with:

- **Next.js 15** (App Router, Server & Client Components)
- **TypeScript** (strict)
- **Prisma + SQLite** (file-based dev database)
- **Playwright** (end-to-end tests)
- SVG illustrations (placeholders; designed to be swapped in place)
- CSS Modules + CSS custom properties (no Tailwind)

## Quick Start

```bash
make setup   # npm install, copy env, run migrations, install Playwright browsers
make dev     # start Next.js on http://localhost:3000
```

In another terminal:

```bash
make test    # run Playwright E2E tests
```

## Project Layout

```
src/
  app/            App Router pages + API routes
    page.tsx         Hub with three world portals
    diner/           Astro Diner (5 hotspots + dish workshop)
    voyages/         Cosmic Voyages (5 hotspots + postcard wall)
    expo/            Atomic Expo (5 hotspots + 2050 time capsule)
    api/             Route handlers — visitor-log, postcards, predictions, community-dishes
  components/      Shared UI: Nav, SceneContainer, Hotspot, DiscoveryPanel, RetroButton, ...
  illustrations/   Per-world SVG scenes (1200x580, swap-in placeholders)
  lib/             db.ts (Prisma client), session.ts (visitor id/name), hotspots.ts (positions)
  styles/          globals.css + CSS modules (scene, panels, components)
  types/           Shared TypeScript interfaces
prisma/            schema.prisma
tests/e2e/         Playwright specs per world + hub
```

## Data Model

| Model           | Purpose                                                             |
| --------------- | ------------------------------------------------------------------- |
| `VisitorLog`    | Rolling feed of what visitors did and where                         |
| `Postcard`      | Voyages: postcards sent from a chosen destination                   |
| `Prediction`    | Expo: 2050 time-capsule predictions, upvotable                      |
| `CommunityDish` | Diner: fan-invented dishes on the chrome counter, upvotable         |

All models are stored in SQLite at `prisma/dev.db` via `DATABASE_URL=file:./dev.db`.

## API Surface

| Method | Path                            | Purpose                               |
| ------ | ------------------------------- | ------------------------------------- |
| GET    | `/api/visitor-log`              | 5 most recent visitor log entries     |
| POST   | `/api/visitor-log`              | Record `{visitorId,visitorName,world,action}` |
| GET    | `/api/postcards`                | All postcards, newest first           |
| POST   | `/api/postcards`                | Send postcard `{visitorName,destination,message}` |
| GET    | `/api/predictions`              | All predictions, newest first         |
| POST   | `/api/predictions`              | Seal prediction `{visitorName,prediction}` |
| PATCH  | `/api/predictions/:id`          | Increment prediction vote count       |
| GET    | `/api/community-dishes`         | All community dishes, newest first    |
| POST   | `/api/community-dishes`         | Invent dish `{visitorName,dishName,description}` |
| PATCH  | `/api/community-dishes/:id`     | Increment dish vote count             |

All routes set `export const dynamic = 'force-dynamic'` to opt out of Next.js static caching.

## Hotspots

Each world exposes five hotspots, positioned over the background SVG via percentage
coordinates in `src/lib/hotspots.ts`. Clicking a hotspot opens a `DiscoveryPanel`
with world-specific content. Discovery counters (`Discovered: N/5 ✦`) track unique
hotspot clicks per visit.

| World    | Hotspots                                                                |
| -------- | ----------------------------------------------------------------------- |
| Diner    | `jukebox` · `menuBoard` · `servo` · `counter` · `window`                |
| Voyages  | `travelPosters` · `ticketCounter` · `captainCosmo` · `launchWindow` · `brochureRack` |
| Expo     | `jetpackDemo` · `robotButler` · `timeCapsule` · `moonColony` · `videophone` |

The Diner `counter`, Voyages `ticketCounter`, and Expo `timeCapsule` hotspots open
interactive forms that write to the database.

## Makefile targets

```
make setup         # one-time: install, env, migrate, Playwright browsers
make dev           # next dev (with prisma generate)
make build         # next build (production)
make start         # next start
make migrate       # prisma migrate dev
make migrate-prod  # prisma migrate deploy
make studio        # prisma studio
make test          # playwright test
make test-ui       # playwright --ui
make lint          # tsc --noEmit type check
make clean         # purge .next + node_modules/.cache
```

## Swapping the Illustrations

Each illustration is a React component in `src/illustrations/` rendering inline SVG
at a 1200×580 viewBox with `width="100%"` and `height="auto"`. Every region is a
labeled `<g>` with a `<text>` placeholder — drop in your final illustration by
replacing the shapes inside each group, keeping the same viewBox. The hotspot
overlay positions are defined separately in `src/lib/hotspots.ts`, so you can tune
percentages without touching the SVG itself.

## Environment

`.env` (see `.env.example`):

```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```
