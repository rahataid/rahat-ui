# AGENTS.md — LIBS KNOWLEDGE BASE

## OVERVIEW
Shared frontend libraries consumed by rahat-ui and community-tool-ui apps.

## LIBRARY MAP
| Library | Alias | Purpose | Usage |
|---------|-------|---------|-------|
| query/ | @rahat-ui/query | React Query hooks + services for all API domains | 399+ imports |
| shadcn/ | @rahat-ui/shadcn/* | 43+ UI components (Radix + Tailwind) | 734+ imports |
| community-query/ | @rahat-ui/community-query | Community-specific query hooks | 52+ imports |
| types/ | @rahat-ui/types | Shared TypeScript type definitions | 68+ imports |

## CONVENTIONS
- query/ exports hooks per domain: useBeneficiaryList, useProjectList, etc.
- query/ uses Zustand stores alongside React Query for hybrid state.
- shadcn/ components accessed via @rahat-ui/shadcn/components/{component-name}.
- shadcn/ charts via @rahat-ui/shadcn/charts (chart-components/ subdir).
- shadcn/ maps via @rahat-ui/shadcn/maps.
- shadcn/ utils via @rahat-ui/shadcn/utils.
- types/ exports from single barrel index.ts.
- community-query/ mirrors query/ structure for community-specific domains.

## NOTES
- query/src/lib/ has subdirectories per domain: beneficiary/, projects/, users/, vendors/, communications/, treasury/, settings/, c2c/.
- shadcn/ includes custom components: audio recorder, charts, maps.
- All libs export via src/index.ts barrel files.
