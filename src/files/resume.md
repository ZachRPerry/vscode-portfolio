# Zach Perry
**Senior Software Engineer · Product-minded builder**
Marietta, GA · zachrperry@outlook.com · [linkedin.com/in/zachrperry](https://linkedin.com/in/zachrperry) · [github.com/ZachRPerry](https://github.com/ZachRPerry)

---

## Summary

13+ years building and shipping web platforms with a focus on measurable customer outcomes. Partner with product and business stakeholders to turn requirements into user stories, then design, build, review, and deliver. Outside of day-job work, ship 0→1 consumer AI products end to end — extraction pipelines with eval harnesses gating model selection, confidence-gated human review, and privacy enforced at the database. Certified Product Manager (Product School).

## Experience

### Senior Software Engineer — TEKsystems (Contract, at Patterson Companies)
*Atlanta, GA · Nov 2021 – Present*

Senior engineer on Patterson's dental and vet e-commerce platforms. The stack splits along concerns: **Kentico CMS powers the marketing side**, a **custom C# / SQL app handles the e-commerce core** (catalog, cart, checkout, order management).

- Led the **Kentico 12 → 13 upgrade** for both the Dental and Vet brand sites across product, QA, and ops.
- Rebuilt the **Enterprise Marketing Solution** in Kentico, migrating a **60K+ email/week** system off vendor support to in-house management.
- Ship features across both the custom C# e-commerce app and the Kentico marketing surface, owning the handoff between the two.
- Modernizing the hosting footprint toward **Kubernetes** on the .NET / SQL stack.
- Code reviews across both codebases; onboard, train, and manage new contractors.
- Earned team spotlight award for cross-functional production-incident resolution.

### Senior Developer & Team Lead — RaceTrac
*Atlanta, GA · Sep 2015 – Nov 2021 · Promoted 2019*

Led development across the RaceTrac digital ecosystem. Mentored two developers, owned all back-end development, ran Scrum, pitched product initiatives to leadership.

- **RaceTrac.com redesign** (Kentico 12 MVC, Azure): pitched, architected, managed an external design agency. Drove monthly traffic from **90K → 200K users** (+120%) with a new customer loyalty integration. Load-tested to 30K concurrent users.
- **COVID-response contactless ordering** (`order.racetrac.com`): shipped end-to-end e-commerce for **500+ stores** in **3 weeks** — 25% under budget. Store-level product, pricing, and tax-rate customization; Payeezy + ServiceNow integrations.
- **RaceTrac Rewards VIP** (1M+ users): architected a dedicated loyalty site to validate a paid fuel-discount program, later merged into the main site.
- **SSC Portal** (internal, 1,000+ employees): Kentico 8 → 9 intranet with OnBase, HR, and AD integration; custom SignalR chat. **Won Kentico Site of the Year for Intranet (2016)**.
- Also: Field Portal (500+ stores, Kentico 11 MVC + React), Franchise site, Energy Dispatch marketing site.

### Kentico Developer — Codesummit, LLC
*Aurora, OH · May 2013 – Sep 2015*

Client-services Kentico work in Agile/Scrum. Built community-group features for corporate health challenges, localized newsletters (Spanish support via resource strings + custom macros), and migrated SQL-view-backed features to event-based flows with caching.

## Side Projects

**Remidy Labs** — consumer apps on one shared platform: one Supabase backend shape, one Swift/Kotlin library, one release pipeline, one internal coordination system.

- **Remidy Control** — the system coordinating me and every coding agent across the portfolio. **MCP server (~27 tools)** with per-agent auth and `SessionStart` hooks injecting project context and the ready queue into each session. Completion is **evidence-gated** — commit, PR, or deploy URL, because an agent asserting completion isn't evidence of it. Readiness and critical path derived from a dependency graph; append-only event log as the audit trail. Next.js + Postgres.
- **[Tego](https://www.tego.family)** — household coordination. Claude vision extraction with per-field confidence and confirm-before-write; a **63-check eval harness gates model selection** (documented Opus/Sonnet/Haiku comparison on accuracy, cost, latency). Private-by-default visibility in Postgres RLS. SwiftUI + Supabase.
- **[Josephine](https://josephine.family)** — family recipe preservation. Claude vision → structured JSON behind a typed contract, user-confirmed before save. Next.js + Supabase (RLS tenancy, `SECURITY DEFINER` RPCs), native iOS + Android.
- **[Freeish](https://www.freeish.app)** — shared availability, **live on the App Store**. Per-event privacy in row-level security (pgTAP-tested); mid-flight Expo/RN → native SwiftUI + Kotlin/Compose migration with users on the old build.
- **[Raid Roulette](https://www.raidroulette.com)** · **[Myers Driving Academy](https://myersdrivingacademy.net)** — Next.js on Vercel; MDA a full redesign + launch with Keystatic as a git-backed CMS.

## Tech

**Languages & frameworks:** C# · ASP.NET MVC · Razor · ASP.NET Web API 2 · SignalR · JavaScript · TypeScript · React · Next.js · Swift/SwiftUI · Kotlin/Compose · HTML · CSS/SCSS · Tailwind

**AI:** Claude API (vision + structured extraction) · MCP servers · schema-bound contracts · eval harnesses & model comparison · prompt caching, batching, consequence-based model routing · confidence-gated human review

**Cloud & infra:** Azure (Web Apps, SQL Database, Blob Storage, Redis Cache) · Kubernetes · Azure DevOps · Vercel · Supabase (Postgres, RLS, Auth, Edge Functions) · Postgres

**CMS:** Kentico (12 years, Certified Developer) · Kentico EMS · Kentico Xperience · Keystatic

**Practices:** Agile/Scrum · User stories · Technical requirements · Stakeholder management · Code review · Mentoring

## Certifications & Education

**Product Manager Certificate** — Product School (Feb 2022) · **Kentico Certified Developer** · **OnBase Certified** System Administrator (OCSA), Workflow Administrator (OCWA), ABI Developer

**Associate of Applied Business** — Marion Technical College (2013)
