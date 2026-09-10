# rahat-ui — System Overview & Translation Requirements

Context doc for researching an English ⇄ Nepali translation approach for the `rahat-ui` app.

## What is rahat-ui

`rahat-ui` is one app inside an Nx monorepo (`rahat-ui` workspace root). It's the main
admin/operations dashboard for the Rahat platform — used to manage projects, beneficiaries,
vendors, treasury, communications, users, etc. Sibling apps in the same monorepo include
`community-tool-ui` (separate frontend, not in scope here) and various backend/API projects.

- **Framework**: Next.js 14.1.3, App Router (`src/app`), built/served via Nx (`@nrwl/next`)
- **Language**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui components, sourced from the shared workspace package
  `@rahat-ui/shadcn` (`libs/shadcn`)
- **State/data**: Zustand (client state), TanStack React Query + `@rumsan/react-query` /
  `@rumsan/communication-query` / `@rahat-ui/query` (server state, wrapped in custom providers)
- **Forms/validation**: `react-hook-form` + `zod`
- **Web3**: `wagmi` (blockchain wallet/treasury interactions)
- **No existing i18n library** is installed anywhere in the monorepo (checked `package.json`,
  searched for `next-intl`, `react-i18next`, `*i18n*` files — none found). `<html lang="en">`
  is hardcoded in the root layout.

## Structure relevant to translation work

```
apps/rahat-ui/src/
  app/            # Next.js App Router routes (pages, layouts) — one folder per feature area:
                   # auth, beneficiary, communications, dashboard, projects, treasury,
                   # settings, users, vendors, queues, notifications, usage, ...
  sections/        # Feature-level UI composed from components, mirrors app/ folder names —
                   # this is where most user-facing copy actually lives
  components/      # Smaller reusable UI pieces (transactions, wallet, swal modals, ...)
  sidebar-components/, stats-components/
  providers/       # Context providers (query, theme, wagmi, service, second-panel)
  hooks/, utils/, constants/, guards/, types/, common/
```

- ~1,553 `.ts`/`.tsx` files in `apps/rahat-ui/src`
- ~488 files contain what looks like inline JSX text content (rough heuristic scan for
  `>Some Text<` patterns) — this is the surface area that would need string extraction
- Shared component library (`libs/shadcn`) has **no hardcoded text** — it's purely
  structural/presentational, so translation work should be scoped to the app layer only,
  not the shared UI kit

## Root layout entry point

`apps/rahat-ui/src/app/layout.tsx` wraps every page in a stack of providers (Wagmi → Query →
RSQuery → CommunicationQuery → Service → SecondPanel → Theme). Any i18n provider would need to
be added into this stack, and `<html lang="en">` would need to become dynamic based on the
active locale.

## Requirements to figure out during translation-approach research

1. **Routing strategy**: does the URL need a locale segment (`/en/...`, `/np/...`), or is
   locale a user/session preference switched without changing the URL? This affects whether
   `next-intl`'s App Router routing integration is worth adopting vs. a simpler
   client-side-only library.
2. **String source of truth**: since there's no existing extraction tooling, decide between
   (a) manually authoring `en.json`/`np.json` key files, or (b) an extraction script that
   scans `sections/`/`app/` JSX for literal strings as a starting point.
3. **Dynamic/DB-sourced content**: some copy (project names, notification templates,
   communication messages) may come from the backend rather than static UI strings — confirm
   whether those need translation too, since that's a different problem (backend-side
   localization) from static UI string translation.
4. **Date/number/currency formatting**: treasury and beneficiary sections likely render
   currency and dates — check whether Nepali locale formatting (e.g. Nepali numerals, BS
   calendar) is in scope or whether English formatting stays as-is.
5. **RTL**: not applicable (Nepali is LTR), so no bidi layout concerns.
6. **Persistence of language choice**: cookie, localStorage, or user profile setting
   (there's already a `profile` section/route that could host a language preference).
7. **Scope boundary**: confirm whether `community-tool-ui` (the sibling app) is in scope now
   or later — it currently also has no i18n setup, so a shared approach/library choice now
   could save rework.

## Candidate approaches to evaluate (not yet decided)

- `next-intl` — purpose-built for Next.js App Router, supports both URL-based and cookie-based
  locale strategies, has ICU message format for pluralization.
- `react-i18next` / `i18next` — more general-purpose, huge ecosystem, works fine in App Router
  client components but needs manual wiring for server components.
- Lighter custom solution (a simple context + JSON dictionary) — viable given the app doesn't
  currently need complex pluralization/formatting, but loses tooling (extraction, missing-key
  detection, translator-friendly file formats) that dedicated libraries provide.

No decision has been made yet — this file is scoped to describing the system as it exists
today so an approach can be chosen with full context.
