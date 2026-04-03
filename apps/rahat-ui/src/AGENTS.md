# RAHAT UI APP KNOWLEDGE BASE

## OVERVIEW
Main Rahat admin dashboard source. Next.js 14 App Router.

## STRUCTURE
- app/ — Route definitions (auth, beneficiary, communications, dashboard, projects, treasury, users, vendors, etc.)
- sections/ — Page section components (audit, beneficiary, dashboard, projects, settings, users, etc.)
- components/ — 25 shared UI components
- hooks/ — Custom React hooks
- providers/ — QueryProvider, SecondPanelProvider, ServiceProvider, Wagmi
- guards/ — Route guards
- routes/ — Route definitions
- sidebar-components/ — Sidebar UI components
- stats-components/ — Statistics display components
- types/ — Local type definitions
- utils/ — 13 utility files + zustand-store.ts
- lib/ — Utility functions
- constants/ — App constants

## WHERE TO LOOK
| Task | Location |
|------|----------|
| New route | app/{route}/page.tsx + layout.tsx |
| New project type view | sections/projects/{type}/ |
| Shared component | components/ |
| Route guard | guards/ |
| Global state | utils/zustand-store.ts |
| Navigation config | app/config-nav.tsx |
| Sidebar items | sidebar-components/ |

## CONVENTIONS
- Routes in app/ map 1:1 to sections/ for logic separation
- page.tsx files are thin; delegate to sections/ components
- Project types: rp, cva, aa, aa-2, c2c, el, el-kenya, el-crm, cambodia, sms-voucher
- Each project type has dedicated beneficiary, vendor, dashboard, and disbursement views
- sections/projects/components/ contains 26 shared cross-project components
- useNavItems.tsx in sections/projects/ handles type-specific navigation

## NOTES
- middleware.ts at src root for Next.js middleware
- chain-custom.ts for blockchain configuration
- config-nav.tsx defines sidebar navigation structure
- globals.css for global styles
- Projects use deeply nested routes: /projects/{type}/{id}/beneficiary/{id}
