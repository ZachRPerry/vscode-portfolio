# Side Projects

Things I've built outside of day-job work, usually to scratch my own itch or explore a problem space.

Most of them live under **[Remidy Labs](https://www.remidylabs.com)** — **Tego**, **Josephine**, and **Freeish** are consumer apps sharing one Supabase backend shape, one Swift/Kotlin library (`RemiKit` — auth, push, entitlements, caching, on-device AI gates), and one release pipeline. Pieces get extracted into the shared kit only when a second app actually needs them, which keeps the abstraction honest. **Remidy Control** is the internal system that coordinates the work across all of them.

Two threads run through everything below. First: **how do you decide a feature is ready to launch when its core output comes from a model you can't fully trust?** — which turns launch readiness into a measured gate rather than a judgment call. Second: **how do you keep a portfolio of products moving in parallel?** — which is what Control is for.

---

## Remidy Control
**`control.remidylabs.com`** · internal, auth-gated
`Active · 2026 – present` · Next.js · TypeScript · Postgres · MCP over HTTP · Vercel

A program-management system for the whole portfolio — the coordination layer between me and every coding agent working in a Remidy Labs repo. It answers one question well:

> What can move now, what is blocked, who must act next, and what does completing this unlock?

**The graph is the product.** Not "what tasks are open?" but *"what is preventing the next meaningful group of work from moving, and which action releases the largest group?"* Readiness, blocked counts, downstream impact, and **critical path are all derived from the dependency graph** — nothing computable is stored as a field someone has to remember to update. Stale status is the failure mode of every tracker I've used; the fix was to stop storing status at all.

**Human work is structured work.** The bottleneck in an agent-heavy workflow is the human, so the human's queue gets the most design attention. A gate task can't say "set up Apple" — it carries exact instructions, links, the `requiredInputs` that must be populated, what it blocks downstream, and how completion is verified. Vague blockers are how programs quietly stall.

**Completion requires evidence.** `complete_task` refuses to close a task without an artifact — a commit, a PR, a deployment URL, a recorded decision, populated gate inputs. *An agent asserting completion is not evidence of completion.* GitHub webhooks now attach much of that evidence on their own.

**Cross-team requests are routed, not improvised.** Work needing a change in another project files a `cross_project` request; Control creates the task in the target repo, links the dependency, and resumes the requesting task when the commit lands. It's a convention rather than an enforced boundary — held in place by written instructions in each repo plus an append-only event log that makes violations visible.

**Adoption is a design problem, not a mandate.** A `SessionStart` hook in each repo injects project context and the ready queue into every agent session automatically. Without it, agents forget Control exists and the system decays into a database nobody writes to. **That hook is the adoption mechanism, not a nicety** — the same reason a status process nobody is prompted into stops being followed by week three.

**Scope discipline is written down.** Revision 1 specified ~4 apps, 8 packages, 40 tables, and 7 build phases — a multi-month system for a one-person shop. Revision 2 cut the extension SDK entirely: *that's infrastructure for untrusted third-party authors, and this system has one author.* The alternative is "add a table and a route, and review the diff" — identical outcome, no runtime. The document keeps a standing section on what was cut and why, and one feature was descoped mid-flight when its central justification "did not survive contact."

Under the hood it's an **MCP server (~27 tools)** with per-agent bearer auth, plus a CLI over the same HTTP API. Control tracks its own development — the commit log is `CTL-##` all the way down.

---

## Tego
**[tego.family](https://www.tego.family)**
`Active · 2026 – present` · SwiftUI · TypeScript · Supabase (Postgres + RLS, Auth, Edge Functions) · Claude · Vercel

*Life takes coordination. Tego helps.*

A coordination layer for households — custody schedules, handoffs, chores, bills — built so the messy inputs of family life (a photo of a school calendar, a screenshot, a voice note) become shared state without anyone typing it in. Currently a two-person dogfood heading for a small beta.

**The AI problem, stated honestly:** capture is a vision-extraction pipeline whose output is *proposed*, never asserted. A photo produces a schema-bound extraction with **per-field confidence**; low-confidence fields route into a progressive confirmation sheet where the user edits before anything is written; corrections are logged as telemetry so the failure modes are measurable instead of anecdotal. Nothing the model produces reaches shared state without a human gate.

**Launch readiness is measured, not argued.** There's a 63-check eval harness over labeled documents (`spike/extract.mjs` + `score.mjs`) and a written model comparison — so "is this good enough to ship?" has an answer with a number attached:

| Model | Checks | Cost/capture | Avg latency |
|---|---|---|---|
| Claude Opus 4.8 | 63/63 | $0.043 | 7.4s |
| Claude Sonnet 5 | 63/63 | $0.031 | 10.7s |
| Claude Haiku 4.5 | 59/62 | $0.005 | 5.1s |

Opus stays on capture — Sonnet matched it at −28% cost but +45% latency, the wrong trade for someone waiting on a review sheet, and it's the documented fallback if cost pressure arrives. Haiku is **disqualified for a specific, non-obvious reason**: it silently dropped an RSVP deadline from a birthday invite. A confidence-based router can't catch a field that was never extracted at all — there's no low-confidence flag on an absence. That's the kind of limitation you only find by building the eval.

**Cost as an architecture constraint:** at plausible scale the dominant cost is inference, not infrastructure (~10k households ≈ low-thousands/month of model spend vs. hundreds of infra). The levers are written down in pull order — prompt caching on the invariant system prompt, Batch API for the async fact pass, per-task model routing *gated by per-task evals*, a classification pre-pass so cost becomes per-capture-worth-understanding. Standing guardrail: **no down-tier without that task's eval green.** Quality bar beats cost bar.

**Trust architecture, because the product is other people's private life:**
- **Private-by-default visibility** enforced as a query predicate plus Postgres RLS — not a UI filter. AI code paths are given no handle to membership tables at all.
- **The event log is the record; state tables are the view.** Every consequential mutation writes an append-only `change_event` in the same transaction as the state change. `status = accepted` is the current state; `created → viewed → accepted → schedule_changed` is what happened — and what happened is what history, the ledger, and any future export read.
- **Attestations are reported, never asserted:** "Zach marked this complete at 6:03 PM," never "this happened." The system records claims about the world; it doesn't certify them.
- **Deviation is derived, never flagged.** "What's unusual today?" is a query over rule + exception, not a boolean someone sets.
- **Silence preserves the standing state** — an unanswered request resolves to the existing rule, so the failure mode of inattention is *nothing changed*.

**Portability discipline:** only open-source-backed Supabase components through standard interfaces, no vendor-specific SQL, and the iOS client talks to *our* API rather than to Supabase directly — so leaving is an ops project (dump/restore + bucket sync + repoint config), not a rewrite. Migrations replay from scratch on every deploy.

**Domain actions, not screens:** core behavior lives in reusable server capabilities behind the authorization boundary — `proposeScheduleChange()`, not `PickupChangeView → update database`. Every future surface (widgets, App Intents, notification actions, agent integrations) is an adapter over the same capabilities under the same auth. None of that is built yet; the rule exists so it won't require a rewrite when it is.

---

## Josephine
**[josephine.family](https://josephine.family)**
`Active · 2026 – present` · Next.js 16 · SwiftUI · Kotlin/Compose · Supabase (Postgres + RLS, Auth, Storage) · Claude vision · Vercel

*Preserve the people you love through the food they made.*

A family heritage platform for preserving handwritten recipe cards — the handwriting, the stains, the margin notes, the voice explaining the trick to the crust — before they disappear. Named for my grandmother. It's the multi-tenant consumer expansion of Perry Pantry; the concepts port, the code doesn't.

**The thesis is a timing argument:** the cards are still in the drawers and the people who remember are still here to ask. The customer motivation isn't "I need somewhere to save recipes" — it's *"I don't want my grandmother's recipes to disappear."* Every decision optimizes for the second sentence.

**Product principles with hard engineering consequences:**
- **Originals are sacred.** The card is never replaced. Originals are stored immutably at full resolution and never overwritten, recompressed, or "cleaned up"; every derived form (searchable text, cookable steps, scaled versions) points back to its original; deleting one takes the kind of friction deleting a family photo deserves.
- **Say preservation, not technology.** The product never says "AI," "OCR," or "scanning pipeline" — it says *"we preserve the original card, and make it searchable and cookable."* The magic is the outcome. Internal docs name the technology; user-facing surfaces never do. A useful discipline: it forces the AI to be judged on whether the *outcome* holds up, with no "it's AI, be forgiving" escape hatch.
- **People, not users.** Grandma Ruth doesn't need an account to be in the family cookbook. Attribution, memory, and memorial belong to *people*; login belongs to *users*. The two are never conflated.
- **Private by default, no growth hacks on grief.** Family content is private unless explicitly shared; memorial surfaces get invitations, not notifications. Nothing viral touches the deceased.
- **Built for grandparents.** The buyer is usually an adult child onboarding their parents. Big type, plain words, link/QR invites that survive a text message. If a 70-year-old can't do it unassisted, it isn't done.

**Architecture:** Next.js on Vercel (marketing site + `/api/v1`) over Supabase — Postgres with tenancy enforced as RLS *beneath* the data-access layer rather than trusting the DAL alone, transactional flows as `SECURITY DEFINER` RPCs, private Storage buckets for originals, Auth via passwordless email codes + Sign in with Apple. Native iOS (SwiftUI) and Android (Kotlin/Compose) clients share `RemiKit`. Extraction is a direct Claude vision call behind a typed contract: original image → structured recipe JSON with confidence flags → **user confirms or edits before anything saves**, same as Tego. The migration off the original stack (Neon, Better Auth, Vercel Blob, AI SDK) is written up as an ADR with a phase log rather than lost to git archaeology.

**Features that only exist because the domain was taken seriously:** variations modeled as append-only diffs instead of destructive edits; recipe timelines with year-only date precision, because *"sometime in the 70s"* is how families actually remember; **Missing Recipes** — placeholders for the recipe nobody has, that relatives thread contributions onto until someone finds it, at which point the placeholder *becomes* the recipe and the recovery becomes part of its history.

---

## Freeish
**[freeish.app](https://www.freeish.app)**
`Shipped · App Store` · SwiftUI · Kotlin/Compose · Supabase (Postgres + RLS, Auth, Edge Functions) · Expo/RN (legacy)

*Share your week with the people who matter — so they always know when you're free. Ish.*

For people whose week is never the same twice — servers, nurses, retail workers, students — and the people who love them. Add shifts, or just photograph the schedule posted on the breakroom wall, and a small circle of family and friends always knows when you're free.

- **Privacy enforced at the database, not the UI.** Every event carries a public/private toggle backed by Postgres row-level security — a private event *physically cannot be read* by a follower, regardless of what any client asks for.
- **Photo import** — snap a posted schedule; an Edge Function extracts structured shifts and returns them **for review before saving**. Accuracy corrections land in an `import_feedback` table. This one runs on a free-tier vision model deliberately: the consequence of an error is a wrong row on a review sheet the user is already reading, which is a different risk class than Tego's silently-dropped deadline. Consequence sets the model tier.
- **Plain-language availability** — "Busy till 4, then free" — because the answer people want is a sentence, not a grid.
- **Cost discipline as a design constraint.** Local notifications for "starts soon" and weekly reminders (zero server cost, timezone-correct via a stored profile timezone); push only for genuine schedule changes, throttled to 1/10min per owner via a DB trigger → Edge Function. The whole thing is designed to run on free tiers.
- **Three clients, one backend.** iOS 2.0 (native SwiftUI) and Android 2.0 (Kotlin/Compose) over shared `RemiKit`, with the original Expo/RN app still serving as the live App Store build until the 2.0 cutover — a real, boring, in-flight migration with users on the old version.
- **Everything is Git-driven.** Migrations, Edge Functions, and auth templates deploy from `main` via GitHub Actions; schema is *never* changed in the dashboard. (We drifted once. It wasn't fun.) pgTAP tests cover the RLS policies.

---

## Perry Pantry
**A keeping-place for the recipes the family passes around the table**
`Active` · Next.js 16 · TypeScript · Postgres · Better Auth · Tailwind 4 · Vercel

Cozy retro-vintage cookbook UI — sage green, paper texture, drop caps, ink-stamps — wrapped around a real recipe data model. Built so the family stops losing grandma's tweaks in iMessage threads. Later became the proving ground for **Josephine**.

- **Invite-only auth** — no public sign-up; every account is created from a valid invite token. Better Auth's admin plugin handles roles, banning, password reset, and email change from a single admin page.
- **Recipes with structure** — ingredient *groups* + items, step-by-step methods, tags, badges, occasions; **variations** modeled as diff-style changes (add / replace / remove / change) and shown as tabs on the recipe page so a cook can browse the base recipe alongside someone's tweak without losing either.
- **Family layer** — per-cook profile pages, favorites, ratings, comments, and a full-screen **cook mode** for hands-busy walkthroughs.
- **Dev → prod parity** — local Postgres in OrbStack/Docker, Neon Postgres via the Vercel Marketplace in prod; emails log to the console in dev when `RESEND_API_KEY` is unset, so the invite flow is testable without external services.

A small product, but a chance to design every domain decision cleanly: invite tokens not public sign-up, append-only variations not destructive edits, family-as-namespace not flat user list.

---

## Myers Driving Academy
**[myersdrivingacademy.net](https://myersdrivingacademy.net)**
`Shipped` · Next.js · Keystatic CMS · Vercel

Full redesign and launch of an Ohio-state-certified driving school's website. Reworked the information architecture around how people actually shop for driver's ed — upcoming class dates, the Class D process, and registration flow surfaced up front — then shipped it end-to-end on Next.js + Vercel with **Keystatic** as a git-backed CMS so the owners can edit schedules and copy through a UI without touching code.

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
