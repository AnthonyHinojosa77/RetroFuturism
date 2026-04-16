# Retro Universe

A retro-futuristic, point-and-click social web app. Three worlds — **Astro Diner**,
**Cosmic Voyages**, and **Atomic Expo** — each packed with five clickable hotspots
that invite visitors to discover lore, leave postcards, invent dishes, and seal
predictions into a 2050 time capsule.

## Live preview

After enabling GitHub Pages (one-time, see below), the site is served at:

**https://anthonyhinojosa77.github.io/RetroFuturism/**

### Enabling GitHub Pages (one-time, ~15 seconds)

1. Open **https://github.com/AnthonyHinojosa77/RetroFuturism/settings/pages**
2. Under **Build and deployment** → **Source**, select **GitHub Actions**
3. That's it. The next push (or a manual re-run of the workflow) will deploy the
   site. You can re-run the latest workflow from the **Actions** tab.

The workflow (`.github/workflows/deploy.yml`) builds the app with
`NEXT_PUBLIC_BASE_PATH=/RetroFuturism` and publishes the static `out/` directory
to Pages.

## Built with

- **Next.js 15** (App Router, static export)
- **TypeScript** (strict)
- **localStorage** for the social features (postcards, predictions, dishes,
  visitor log) — so the site runs fully client-side with no backend
- **Playwright** (end-to-end tests)
- SVG illustrations (placeholders; designed to be swapped in place)
- CSS Modules + CSS custom properties (no Tailwind)

## Run locally

```bash
make setup     # npm install + Playwright browsers
make dev       # start Next.js on http://localhost:3000
```

Tests:

```bash
make test      # run Playwright E2E suite
```

## Project layout

```
src/
  app/             App Router pages
    page.tsx         Hub with three world portals
    diner/           Astro Diner (5 hotspots + dish workshop)
    voyages/         Cosmic Voyages (5 hotspots + postcard wall)
    expo/            Atomic Expo (5 hotspots + 2050 time capsule)
  components/      Nav, SceneContainer, Hotspot, DiscoveryPanel, RetroButton, ...
  illustrations/   Per-world SVG scenes (1200x580, swap-in placeholders)
  lib/
    hotspots.ts      Hotspot coordinates for each world
    session.ts       Visitor id/name (sessionStorage)
    storage.ts       localStorage-backed social storage (CRUD + votes)
  styles/          globals.css + CSS modules (scene, panels, components)
  types/           Shared TypeScript interfaces
tests/e2e/         Playwright specs per world + hub
.github/workflows/
  deploy.yml       Builds + deploys static site to GitHub Pages
```

## Hotspots

Each world exposes five hotspots, positioned via percentage coordinates in
`src/lib/hotspots.ts`. Clicking a hotspot opens a `DiscoveryPanel` with
world-specific content. Discovery counters (`Discovered: N/5 ✦`) track unique
hotspot clicks per visit.

| World    | Hotspots                                                                |
| -------- | ----------------------------------------------------------------------- |
| Diner    | `jukebox` · `menuBoard` · `servo` · `counter` · `window`                |
| Voyages  | `travelPosters` · `ticketCounter` · `captainCosmo` · `launchWindow` · `brochureRack` |
| Expo     | `jetpackDemo` · `robotButler` · `timeCapsule` · `moonColony` · `videophone` |

Diner `counter`, Voyages `ticketCounter`, and Expo `timeCapsule` open interactive
forms that write to `localStorage` and render the submitted entries in a wall.

## Data model (localStorage)

| Key                   | Contents                                        |
| --------------------- | ----------------------------------------------- |
| `ru.visitorLog`       | Rolling feed of recent visitor actions (max 100) |
| `ru.postcards`        | All Voyages postcards                           |
| `ru.predictions`      | All Expo time-capsule predictions (with votes)  |
| `ru.communityDishes`  | All Diner fan-submitted dishes (with votes)     |

All functions live in `src/lib/storage.ts`. Because everything is client-side,
data is per-browser: two visitors see different walls. That's intentional for a
static preview. To make it global, swap `storage.ts` for a backend (the original
Prisma + API-route scaffold is preserved in the git history of the feature
branch's earlier commit).

## Makefile targets

```
make setup         # npm install + Playwright browsers
make dev           # next dev (local)
make build         # next build (root-path)
make build-pages   # next build with /RetroFuturism base path (for Pages)
make test          # playwright test
make test-ui       # playwright --ui
make lint          # tsc --noEmit
make clean         # purge .next, out, node_modules/.cache
```

## Swapping the illustrations

Each illustration is a React component in `src/illustrations/` rendering inline
SVG at a 1200×580 viewBox with `width="100%"` and `height="auto"`. Every region
is a labeled `<g>` with a placeholder `<text>` — drop in your final illustration
by replacing the shapes inside each group, keeping the same viewBox. The hotspot
overlay positions are defined separately in `src/lib/hotspots.ts`, so you can
tune percentages without touching the SVG itself.
