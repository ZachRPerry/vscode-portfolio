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

## Perry Pantry
**A keeping-place for the recipes the family passes around the table**
`Active` · Next.js 16 · TypeScript · Postgres · Better Auth · Tailwind 4 · Vercel

Cozy retro-vintage cookbook UI — sage green, paper texture, drop caps, ink-stamps — wrapped around a real recipe data model. Built so the family stops losing grandma's tweaks in iMessage threads.

- **Invite-only auth** — no public sign-up; every account is created from a valid invite token. Better Auth's admin plugin handles roles, banning, password reset, and email change from a single admin page.
- **Recipes with structure** — ingredient *groups* + items, step-by-step methods, tags, badges, occasions; **variations** modeled as diff-style changes (add / replace / remove / change) and shown as tabs on the recipe page so a cook can browse the base recipe alongside someone's tweak without losing either.
- **Family layer** — per-cook profile pages, favorites, ratings, comments, and a full-screen **cook mode** for hands-busy walkthroughs.
- **Dev → prod parity** — local Postgres in OrbStack/Docker, Neon Postgres via the Vercel Marketplace in prod; emails log to the console in dev when `RESEND_API_KEY` is unset, so the invite flow is testable without external services.

A small product, but a chance to design every domain decision cleanly: invite tokens not public sign-up, append-only variations not destructive edits, family-as-namespace not flat user list.

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

---

## MDA Virtual
**Compliance-first virtual classroom for Myers Driving Academy**
`Active · 2026 – present` · Next.js 16 · TypeScript · Drizzle · Postgres (Neon) · Clerk · Daily.co · Pusher · Cloudflare R2 · Inngest · Vercel

A purpose-built online delivery of Ohio's BMV-certified 24-hour Driver Training Program — verifiable attendance, randomized engagement checks, instructor supervision, locked-down exams, and audit-ready records. Single-tenant, but every domain decision is shaped by what an Ohio BMV auditor will eventually ask.

**The three journeys it has to nail:**
- **Student** — onboarding → real system check (`getUserMedia` + Network Info + Geolocation) → selfie capture → live classroom (Daily.co video tiles, instructor-driven slide sync, engagement prompts) → lockdown exam (fullscreen + tab/blur/paste violation logging + server-authoritative timer + auto-submit) → completion certificate (real PDF).
- **Instructor** — preflight (license + IP/GPS + camera + roster) → live monitor with slide control, prompt issuance, and hand-raise queue → class report with sign-and-submit-to-BMV.
- **Admin** — operations overview (KPIs, trend chart, flags, cohort health) → cohort detail + scheduling (auto-firing 24h + 1h reminders) → live compliance ledger → BMV audit pack (signed PDF + CSV).

**Compliance backbone:** every state-changing event flows through a single `recordEvent` into an append-only `audit_events` table; per-(session, student) compliance is *derived* from heartbeats × engagement responses, so the audit pack is a function of recorded data — not narrative.

**Architecture choices that matter:**
- Roles live in the DB (`users.role`), not Clerk session claims — sidesteps JWT-staleness loops on first sign-in.
- Daily.co writes recordings directly to **Cloudflare R2** (S3-compatible), skipping Daily's storage tier; the recording webhook handles both delivery shapes (`recording.ready-to-download` and `recording.s3-uploaded`).
- DB driver auto-detects `*.neon.tech` URLs and switches to the HTTP driver — Postgres is Docker locally, Neon in prod, no manual swap.
- Inngest handles class reminders, missed-prompt sweeps, and license renewals so the request path stays simple.
- The whole stack **gracefully degrades** — missing Pusher / Daily / R2 / Resend keys silently skip those features instead of throwing — so dev and preview environments stay usable. The DB is the only hard requirement.
