# Zach Perry

Senior Software Engineer · Marietta, GA

## About

I've spent 13+ years building and shipping web products, mostly on .NET and TypeScript, and the through-line is ownership: writing the stories, building the thing, and staying accountable for it in production.

Two stories say the most. During COVID, RaceTrac needed online ordering across **500+ stores** — I estimated four weeks for an MVP, was given three, and delivered it with one other developer. And RaceTrac.com itself: when I heard marketing couldn't get small changes made, I asked to join their agency calls, found the agency couldn't actually manage a .NET site, brought the site in-house, and then pitched the rebuild that consolidated it and its microsites into one platform — backed by analytics showing 90% of visitors never made it past the landing page.

## What I'm doing now

Nights and weekends I build consumer AI products at **[Remidy Labs](https://www.remidylabs.com)**. The interesting problem: when a product's core feature is a model whose output you can't fully trust, "is this ready to launch?" has to become a **measured gate**:

- A **63-check eval harness** decides which model ships on which task — with a written comparison across accuracy, cost, and latency, and a standing rule that nothing moves to a cheaper model without that task's eval passing.
- **Decision registers and ADRs** capture what was decided, what's still unproven, and what got cut — so scope changes leave a trail instead of an argument.
- And sometimes the gate says no. **Rescript Sleep** — a clinical app for reducing recurring nightmares — carries a written **AI safety spec** where every prohibition is a deterministic check and one violation blocks the release. Its v1 ships with AI drafting switched **off** despite passing those checks, because the clinical review that feature warrants hasn't happened yet, and because a manual-first release reads user retention without model quality confounding the answer.

## What you'll find here

- **experience.md** — full work history, launches, and outcomes
- **projects.md** — the independent product work and how it's run
- **resume.md** — one page, or grab the PDF
- **contact.json** — how to reach me
- **Personal Files/** — a few extras

## Currently

Senior Software Engineer @ **Patterson Companies** (via TEKsystems) — the internal Kentico developer for their dental and vet e-commerce sites: user stories, development, QA coordination, and marketing support, end to end. Executed the Kentico 12 → 13 upgrade, including moving authentication to Microsoft Entra ID.

Nights & weekends: **[Remidy Labs](https://www.remidylabs.com)** — **Tego**, **Josephine**, and **Freeish** (live on the App Store), on one shared platform.

Product School certified.
