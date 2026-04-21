# Side Projects

Things I've built outside of day-job work, usually to scratch my own itch or explore a problem space.

---

## StreamArc
**[www.streamarc.live](https://www.streamarc.live)**
`Active · 2026 – present` · TypeScript · Next.js · Tauri · Rust · Prisma · Postgres · Docker

A polished desktop studio + web dashboard for TikTok Live creators who want pro-quality overlays, alerts, and audience-engagement widgets without the complexity of OBS scene setups. Purpose-built for streamers who are on-camera and under pressure — the tool has to work without making them think.

**Architecture:** Monorepo (pnpm workspaces).
- **Next.js dashboard** (Vercel) — Clerk auth, Prisma, Vercel Blob, Stripe billing with trial flows and tiered plans.
- **Tauri v2 desktop studio** (Rust backend) — custom TikTok WebSocket + protobuf decoder, widget SDK with authoring UI, live preview, and runtime sandboxing.
- **Node relay service** — Docker container that fans out compact overlay payloads to hosted overlays via WebSocket so a streamer's browser source stays in sync with their desktop state.
- **Hosted TTS service** — Docker container wrapping Piper voices behind a small API so lower-spec streamer machines can offload synthesis instead of running it locally.
- **Admin console** — internal ops for plan overrides, feature flags, billing support.

**Cost discipline as a product pillar:** a key focus is keeping operating cost per user low enough to support generous free tiers without bleeding money. Shipping choices reflect it:
- **Self-hosted containers** for relay and TTS (cheap VPS) instead of managed SaaS that bills per request.
- **Vercel + Clerk + Stripe free tiers** do the heavy lifting on the dashboard side.
- **Client-side rendering** for overlays wherever possible so a streamer's own browser does the work instead of a paid render farm.
- **Docker Compose dev stack** mirrors the prod shape — same Postgres, relay, and TTS containers locally — so cost-sensitive architecture decisions aren't deferred until after launch.

**Product thinking:** every design decision has a single filter — "does this help a streamer who's live right now?" That shapes onboarding, the overlay builder, the alert preview tooling, and the default settings.

---

## Raid Roulette
**[raidroulette.com](https://www.raidroulette.com)** · [github.com/ZachRPerry/arcapp](https://github.com/ZachRPerry/arcapp)
`Shipped` · Next.js 16 · Tailwind 4 · Radix UI · Vercel

A randomizer for **Arc Raiders** players — spins up a random loadout (weapons, maps, special rules) so a group can jump into a match without arguing over who picks what. Dark-mode-first, responsive, SEO-optimized, and deployed on Vercel with analytics.

---

## VSCode Portfolio
**This site**
`Active` · React 18 · TypeScript · Vite · Tailwind · Monaco Editor

A portfolio styled as a Visual Studio Code window — Explorer, Tabs, Monaco-powered editor, Command Palette (⌘⇧P), a real terminal pane, theme switcher, and a gamified achievements system. Built because most portfolios fade into a sea of landing-page templates, and a dev hiring manager should feel immediately at home.

Currently in active iteration — expect rough edges.

---

## Myers Driving Academy
**[myersdrivingacademy.net](https://myersdrivingacademy.net)**
`Shipped` · Next.js · Keystatic CMS · Vercel

Full redesign and launch of an Ohio-state-certified driving school's website. Reworked the information architecture around how people actually shop for driver's ed — upcoming class dates, the Class D process, and registration flow surfaced up front — then shipped it end-to-end on Next.js + Vercel with **Keystatic** as a git-backed CMS so the owners can edit schedules and copy through a UI without touching code.
