# RAHAT UI KNOWLEDGE BASE

## OVERVIEW
Frontend workspace for Rahat. Next.js 14 (App Router) with 2 apps (rahat-ui admin dashboard, community-tool-ui). Shared libs for queries, UI components, and types.

## STRUCTURE
- apps/rahat-ui/ — Main admin dashboard
  - src/app/ — Next.js App Router (auth, beneficiary, communications, dashboard, projects, users, vendors, treasury, settings)
  - src/sections/ — Page section components (14 section dirs)
  - src/components/ — Shared page components
  - src/hooks/, src/providers/, src/guards/, src/utils/
  - src/sidebar-components/, src/stats-components/
- apps/community-tool-ui/ — Community management tool
  - src/app/ — App Router routes
  - src/sections/ — beneficiary, comms, dashboard, targeting, users
  - src/formBuilder/, src/targetingFormBuilder/ — Dynamic form builders
- libs/query/ (@rahat-ui/query) — React Query hooks + Zustand stores
- libs/shadcn/ (@rahat-ui/shadcn) — 43+ UI components (Radix + Tailwind)
- libs/community-query/ (@rahat-ui/community-query) — Community-specific queries
- libs/types/ (@rahat-ui/types) — Shared TypeScript types

## WHERE TO LOOK
| Task | Location |
|------|----------|
| New page/route | apps/rahat-ui/src/app/{route}/page.tsx |
| New section component | apps/rahat-ui/src/sections/{feature}/ |
| New API query hook | libs/query/src/lib/{domain}/ |
| New UI component | libs/shadcn/src/components/ui/ |
| New shared type | libs/types/src/ |
| New project type UI | apps/rahat-ui/src/sections/projects/{type}/ |
| Community feature | apps/community-tool-ui/src/sections/ |
| Charts | libs/shadcn/src/components/charts/ |

## CONVENTIONS
- App Router: page.tsx for routes, layout.tsx for layouts
- State management: React Query (server state) + Zustand (client state) + Context (UI state)
- UI: shadcn/ui (Radix primitives + Tailwind) — import from @rahat-ui/shadcn/components/*
- Web3: wagmi + viem + connectkit for blockchain interactions
- Prettier: singleQuote, arrowParens "always", trailingComma "all"
- Dual-panel layout via SecondPanelProvider
- Path aliases: @rahat-ui/query, @rahat-ui/shadcn/*, @rahat-ui/types, @rahat-ui/community-query
- Project-type sections: rp, cva, aa, c2c, el, el-kenya, el-crm, cambodia, sms-voucher, aa-2
- Husky pre-commit hooks installed

## NOTES
- 10 project-type section directories — each with own beneficiary, vendor, dashboard views
- PostHog analytics integrated (posthog-js, posthog-node)
- Socket.io for real-time features (community-tool-ui)
- Mapbox GL for geographic visualization
- ApexCharts + Recharts for data visualization
- Million.js for React rendering optimization
- Cypress for E2E tests (rahat-ui-e2e, community-tool-ui-e2e)
