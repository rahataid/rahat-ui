# rahat-ui

The frontend. Next.js (App Router) + Turborepo/Nx-style Nx monorepo (uses Nx, like `rahat-project-aa`/`rahat-platform`, unlike the Turborepo-based `rahat-project-triggers`). Talks to **core** (`rahat-platform`) over HTTP — never directly to project microservices (`rahat-project-aa`, `rahat-project-triggers`). See `rahat-platform`'s `docs/agent/action-dispatch.md` for the full mechanism this UI drives; this file covers the UI-side half of that call.

**New to this repo?** This file → [coding-patterns.md](./docs/agent/coding-patterns.md) → `rahat-platform`'s `action-dispatch.md` (to understand what a mutation here actually triggers) → whichever other doc matches your area.

## UI / UX tasks

For **any UI task** (new page, section, component, layout change, restyle, dashboard or admin screen, "make it look better"), use these skills before writing markup or styles:

- `design-taste-frontend` ([Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)): art direction and a no-slop house style. Covers app screens such as dashboards, settings and lists.
- `impeccable` ([pbakaus/impeccable](https://github.com/pbakaus/impeccable)): UI design quality and polish.
- `frontend-design` ([anthropics/skills](https://github.com/anthropics/skills)): Anthropic's frontend design skill.

Fit them to this repo: build with the existing shadcn/ui components in `libs/shadcn` and the Tailwind setup already in use, and follow the patterns in [coding-patterns.md](./docs/agent/coding-patterns.md). Do not add a new UI library or a one-off visual language to satisfy a skill. Pure logic, data-fetching and type changes with no visual effect don't need them.

If a skill isn't installed in this environment, install it first:

```bash
npx skills add Leonxlnx/taste-skill
npx skills add pbakaus/impeccable
npx skills add anthropics/skills --skill "frontend-design"
```

## How a UI action reaches a backend project

```
component → useProjectAction() (libs/query/src/lib/projects/projects.service.ts)
  → projectClient.projectActions({ uuid, data: { action, payload } })   (@rahataid/sdk/clients — getProjectClient)
    → HTTP POST /v1/projects/actions on rahat-platform
      → (see rahat-platform's action-dispatch.md from here)
```

`action` is a flat string key (e.g. `'settings.list'`, or an `MS_ACTIONS.*` constant from `@rahataid/sdk`) matched against a `*.action.ts` map in `rahat-platform`. `uuid` is the target project's `PROJECT_ID`. Per-project query hooks live under `libs/query/src/lib/<project>/` (`aa/`, `cva/`, `el-kenya/`, `rp/`, `c2c/`, `cambodia/`, `comms/`, etc) and wrap `useProjectAction` with project-specific types/caching — they don't call `fetch`/`axios` directly.

**Known inconsistency, confirmed by grep**: some hooks pass the literal string (`action: 'settings.list'`) instead of the `MS_ACTIONS.SETTINGS.LIST` constant — both happen to resolve to the same value today, but new code should import the constant, not inline the string (same risk `rahat-platform`'s `coding-patterns.md` flags: the string has to match exactly, by convention, with nothing enforcing it at build time).

## Repo structure

```
apps/
  rahat-ui/            # the main project-management UI (Next.js App Router)
  rahat-ui-e2e/
  community-tool-ui/   # separate app — beneficiary targeting/survey tool (formBuilder, targetingFormBuilder)
  community-tool-ui-e2e/
libs/
  auth/            # @rahat-ui/auth — role auth (roleAuth.tsx, systemUserAuth.tsx, accessDenied.tsx), aaRoles enum
  query/           # @rahat-ui/query (check exact pkg name) — React Query hooks, one folder per project type, this is where every backend call is defined
  community-query/ # query hooks for community-tool-ui
  shadcn/          # shared shadcn/ui component library
  types/           # @rahat-ui/types — shared TS types
```

### `apps/rahat-ui/src` — module map

| Folder | Purpose |
|---|---|
| `app/` | Next.js App Router routes — `app/projects/<project-type>/...`, `app/beneficiary/`, `app/communications/`, `app/dashboard/`, etc. Route files are thin — real page content lives in `sections/`. |
| `sections/` | Page-level components, organized the same way as `app/` — `sections/projects/<project-type>/<feature>/`. This is where to look for a page's actual UI logic. |
| `sections/projects/aa/` vs `sections/projects/aa-2/` | **Two parallel AA UI implementations exist side by side** — `aa/` (older: `trigger-statements`, `data-sources`, `waterlevel`, `phase`, `groups`) and `aa-2/` (newer: `triggerStatement`, `dataSources`, `siteInfo`, `groupCashTransfer`, `inkindManagement`, `ivr`, `payout`). **Check `app/projects/aa/` routing before assuming which one is actually live** — don't edit one assuming it's the active implementation without verifying. |
| `stats-components/`, `sidebar-components/`, `components/`, `common/` | Shared UI building blocks |
| `routes/`, `guards/` | Routing + route guards |
| `providers/` | React context providers |
| `hooks/`, `utils/` | Generic hooks/utilities |
| `i18n/`, `messages/` (sibling to `src/`) | Internationalization (`next-intl`) |
| `constants/`, `types/` | App-local constants/types |

## Coding patterns

See [coding-patterns.md](./docs/agent/coding-patterns.md). Summary: Next.js App Router (route = thin, logic lives in `sections/`), React Query via `@tanstack/react-query` wrapped by `@rumsan/react-query`'s `useRSQuery`, all backend calls go through `libs/query`'s per-project hooks (never ad-hoc `fetch` in a component), `@rahataid/sdk` is the shared contract with the backend (same package `rahat-project-aa` consumes externally and `rahat-platform` publishes).

## Docs (`docs/agent/`)

| Doc | Covers |
|---|---|
| [coding-patterns.md](./docs/agent/coding-patterns.md) | Architecture intent + canonical examples |

## Keeping docs in sync

Same convention as the other three repos in this ecosystem.

## Commits and pull requests

Commits and PRs in this repo are authored by the developer. When writing them:

- Do not add `Co-Authored-By` trailers or "Generated with ..." lines for any AI agent or tool.
- Do not name or mention an AI agent, assistant, or model in commit messages, PR titles, or PR descriptions.
- Commit as the configured git user; never set the author or committer to an agent identity.
- Describe the change itself, in the developer's voice.
