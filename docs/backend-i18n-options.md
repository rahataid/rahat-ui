# Backend i18n — Implementation Options

Companion to the backend-i18n request doc. That doc states the *what* (three requests to
the backend team); this doc digs into the *how* — three concrete implementation options per
request, grounded in the current codebase, with a recommended approach for each.

Scope: **Anticipatory Action (AA) project only**, same as the parent doc.

---

## Angle 1 — `code` + `params` alongside `message`

### Where this lands today

Across `libs/query/src/lib/aa/*` the frontend already follows one consistent pattern for
API responses:

```ts
// vendors/vendors.service.ts:258, groupCashTransfer/services.ts:37, inkinds/service.ts:213, ...
const errorMessage = error?.response?.data?.message || t('ERROR');
toast.fire({ title: errorMessage, icon: 'error' });

// success path, same files — already uses a local translation key:
toast.fire({ title: t('STOCK_ADDED_SUCCESSFULLY'), icon: 'success' });
```

Success messages are already translated locally. Only the **error path** leaks raw backend
English straight to the user — that's the seam `code` + `params` needs to fill.

On the backend (`rahat-platform`), error responses funnel through one shared pipeline, not
17 independent ones:

- `libs/extensions/src/utils/exception/GlobalCustomException.filter.ts` — global `@Catch()`
  filter, builds a single `ExceptionResponse` shape
- `libs/extensions/src/utils/exception/exception.handler.ts` — `handleHttpException` /
  `handleRpcException` / `handleGenericError` / `handleMicroserviceError`, each just sets
  `responseData.message = exception.message`
- No AA-specific exception logic exists — `apps/rahat/src/projects/actions/aa.action.ts` is a
  thin dispatcher

**This matters for scoping the work**: adding `code`/`params` support to the *type* is a
one-file, central change. The only thing that's genuinely spread across 17 modules is
populating `code` at each individual `throw` site.

### Option A — Central auto-derivation

`exception.handler.ts` auto-slugifies `exception.message` into a `code` at the point the
response is built — e.g. `"Bank not reachable"` → `BANK_NOT_REACHABLE` — via a simple
uppercase/underscore transform. No per-throw-site change anywhere.

- **Pros**: zero backend dev time per endpoint, instant 100% coverage of all 68 sites (and
  everything shipped after), nothing to remember to do when adding a new error.
- **Cons**: the code is only as stable as the English string. A copy edit ("Bank not
  reachable" → "Bank is not reachable") silently produces a new code and desyncs the
  `ne.json` mapping with no error, no warning — it just silently falls back to English for
  that one message again. No support for `params`, since the handler only ever sees a
  formatted string, never structured data — so messages with an interpolated bank name or
  amount still can't be translated.
- **Effort**: very low (one function, one place).

### Option B — Explicit per-throw-site codes

Each `throw new BadRequestException({ message, code, params })` across the 17 AA service
modules is updated explicitly, following the rollout order the parent doc already proposed:
trigger-statements → groupCashTransfer → funManagement/payout → activities/stakeholders/
groups/inkinds/daily-monitoring/vendors.

- **Pros**: codes are stable and intentional, `params` works everywhere it's added,
  self-documenting (a reviewer sees the code right next to the message).
- **Cons**: real, non-trivial effort — touches dozens of call sites — though bounded and
  incremental. Nothing breaks mid-migration since `message` ships unchanged throughout.
- **Effort**: moderate, but matches a rollout plan that already exists.

### Option C — Hybrid (auto-derivation + explicit override)

Extend the shared `ExceptionResponse` type once, centrally, to carry optional
`code?: string` and `params?: Record<string, unknown>`. Ship Option A's auto-slugify as a
blanket fallback immediately for all 68 sites. Then layer Option B's explicit codes on top,
but only for the subset of messages that actually need `params` interpolation (bank name,
amount, count, etc.) — the ones on the parent doc's priority list.

- **Pros**: immediate full coverage at near-zero cost, explicit effort is spent only where
  it buys something (interpolation), stability risk is contained to the messages that
  *haven't* been explicitly frozen yet.
- **Cons**: requires one guardrail to avoid the Option A stability trap — e.g. a lint rule
  or snapshot test that fails CI if a message's derived code changes without the code being
  bumped explicitly. Without that guardrail this quietly degrades to Option A's cons for the
  un-migrated majority.
- **Effort**: low upfront (the type + auto-slugify), then paid down incrementally per the
  existing priority list.

### Recommendation: **Option C**

The type extension is centralized and cheap regardless of which option is chosen — that's
confirmed by the actual code shape (one filter, one handler file, no AA-specific logic to
touch). Auto-slugify gets every one of the 68 sites covered on day one with no backend
sprint allocated to it, and the explicit-code work only needs to happen where `params` is
genuinely required — which is a much shorter list than "all 68." The one non-negotiable: pair
this with a stability guardrail (test or lint) so a message rewrite doesn't silently orphan
a translation.

---

## Angle 2 — enums as slugs, not display text

### Where this lands today

The frontend already implements the consuming side of this contract in several places:

```ts
// dataSources/main.tsx:238-240
// fundManagement/components/tabs.tsx:129
// triggerStatement/components/automated.trigger.add.form.tsx:200-202
//   comment: "Subtype slugs map to AA Project keys; fall back to the derived
//             English label for any slug not yet translated"
// groupCashTransfer/components/gct.detail.tsx:60
return t.has(key as never) ? t(key as never) : message;

// activities/list/activities.table.filters.tsx:73
{t.has(catKey) ? t(catKey) : item.name}
```

This pattern is solid and already shipped — the open question is purely whether the
**backend** consistently sends the slug (`NOT_STARTED`) rather than a prettified label
(`"Not Started"`). That hasn't been audited yet.

### Option A — One-time audit + regression test

Grep AA controllers/serializers for anything that prettifies an enum before it leaves the
API (`.replace(/_/g, ' ')`, title-case helpers, hardcoded display strings mapped from an
enum). Remove any found. Add a contract/integration test asserting AA enum-bearing fields
match `^[A-Z_]+$` in the response body, so a regression fails CI instead of shipping.

- **Pros**: cheap, fast, directly answers the open question in the parent doc ("do any AA
  endpoints already return display text?"), and the regression test prevents backsliding.
- **Cons**: doesn't prevent a *new* enum value from being added with a display-text default
  — it only catches existing sites and re-catches known fields.
- **Effort**: low — a day or two including the audit.

### Option B — Shared enum constants package

Promote AA enum values (status, source, type fields) into a package consumed by both
`rahat-platform` and `rahat-ui`, so both sides import the same literal union type instead of
each maintaining its own copy. Structurally prevents drift instead of testing for it after
the fact.

- **Pros**: the strongest guarantee — a new enum value literally can't exist on one side
  without existing on the other (TypeScript won't compile), which also solves "tell us the
  slug when you add one" from the parent doc's Request 2 without relying on anyone
  remembering to send an email.
- **Cons**: this is a genuine cross-repo dependency to set up (publish/consume story between
  two separate repos, `rahat-platform` and `rahat-ui`) if nothing like it exists yet — that's
  unconfirmed and worth checking before committing to this option. It's more infrastructure
  than the i18n problem alone justifies if such a package doesn't already exist for other
  reasons.
- **Effort**: unknown until the "does a shared package already exist" question is answered —
  low if yes, moderate-to-high if it needs to be built from scratch.

### Option C — Backend changelog for new enum values

Pure process fix: whenever a new enum value ships, backend notifies frontend with the slug
before it reaches real users (this is exactly what the parent doc's Request 2 already asks
for). No code changes on either side beyond what already exists.

- **Pros**: zero engineering cost.
- **Cons**: weakest guarantee of the three — relies entirely on someone remembering, no CI
  or compiler catches a miss, and a missed notification means a slug renders as-is (via the
  `t.has()` fallback) until someone notices it's untranslated.
- **Effort**: none, but the ongoing reliability cost is real.

### Recommendation: **Option A now, Option B as the durable fix — contingent on a quick check**

Option A is nearly free and closes the actual open question today. Option B is the right
long-term answer *if* a shared-types package between the two repos already exists or is
already planned for other reasons — worth a direct question to backend before proposing it,
rather than bundling "build cross-repo infra" into an i18n ask. Option C (the process-only
fallback) should stay in place regardless, as the safety net for whatever gap remains between
A and B.

---

## Angle 3 — admin-created content & outbound comms

### Where this lands today

The `locale` cookie — the single source of truth for the user's language — is written
client-side and already sent on every same-origin request:

```ts
// src/components/language-toggle.tsx
document.cookie = `locale=${nextLocale};path=/;max-age=31536000`;
router.refresh();
```

```ts
// src/i18n/request.ts
cookies().get('locale')?.value // validated via hasLocale(routing.locales, raw),
                                // falls back to routing.defaultLocale
```

So a server-side resolution approach has a real, already-working signal to key off of for
anything that goes through the browser. The gap is content the frontend has no static key
for (admin-typed record names) and content that never reaches the browser at all (SMS,
voice, email).

### Option A — Bilingual JSON columns (parent doc's option "a")

Per-record translated fields: `name: { "en": "...", "ne": "..." }`. Admin UI gains a
per-field language toggle for anything an admin creates at runtime — fund-management tabs,
data-source tabs, activity categories, phase names, payment providers, in-kind item names.

- **Pros**: explicit, works with zero runtime resolution logic, admin has direct control
  over both translations.
- **Cons**: a real migration + admin-UI change *per entity* — six-plus entities listed in the
  parent doc, each needing its own schema and form update. Does nothing for SMS/voice/email,
  since those never pass through a browser session with a `locale` cookie.
- **Effort**: moderate-to-high, and scales linearly with the number of entity types covered.

### Option B — Accept-Language / cookie resolution (parent doc's option "b")

Backend translation files per key (e.g. via `nestjs-i18n` or similar), resolved server-side
from the `locale` cookie (confirmed live today, see above) for browser requests, or an
`Accept-Language` header for non-browser callers. One resolution layer, no per-entity
database migration.

- **Pros**: single implementation, not one-per-entity; reuses the cookie that's already
  flowing on every request today.
- **Cons**: only works for a **bounded, backend-defined set of labels** — it requires the
  backend to own a fixed key space, the same constraint that makes this unsuitable for
  arbitrary admin-typed text (an admin's custom tab name has no pre-existing key to resolve).
- **Effort**: low-to-moderate — one resolution layer, but real work to build if no i18n
  library is in place on the backend yet.

### Option C — Hybrid, split by content shape

Distinguish two categories that the parent doc currently treats as one bucket:

1. **Bounded/platform-defined categories** — phase names, the payment-provider list, a fixed
   activity-category taxonomy — go through Option B's translation-file resolution, since
   these are a closed set the backend already owns and enumerates.
2. **Genuinely free-typed admin content** — a custom fund-management tab name an admin
   invents at runtime — uses Option A's bilingual columns, since there's no fixed key to
   translate against.
3. **Outbound SMS/voice/email** use the same translation-file mechanism as (1), templated per
   locale, but keyed off a **stored per-recipient language preference** (a field on the
   beneficiary/contact record) rather than the browser `locale` cookie — there's no browser
   session for an SMS recipient, so the cookie mechanism doesn't apply here at all.

- **Pros**: matches implementation cost to what each content type actually needs instead of
  over- or under-building; directly answers the parent doc's open Q4 (are outbound comms
  templated anywhere) by proposing where that lives and what it keys off.
- **Cons**: three moving pieces instead of one, so it's more to specify and coordinate up
  front, even though each piece individually is simpler than forcing everything through a
  single mechanism.
- **Effort**: moderate — roughly the sum of "the closed-set portion of B" + "the free-text
  portion of A" + "a new recipient-language field," but each piece is scoped to only the
  content that actually needs it.

### Recommendation: **Option C**

Treating "admin-created content" as one uniform bucket forces a false choice between A and
B — closed taxonomies and free text have genuinely different translation stories, and
conflating them means either over-building (bilingual columns for things the backend already
enumerates) or under-building (trying to resolve free text against a fixed key space, which
can't work). SMS/voice/email need a recipient-language field regardless of which path is
picked for UI-facing content, since neither cookie-based approach can reach a phone number.
This also gives backend a concrete answer to volunteer on Q3/Q4 of the parent doc, rather
than an open-ended "your call."

---

## Summary table

| Angle | Recommended | Why |
|---|---|---|
| 1. Error/success codes | **C — hybrid auto-derive + explicit override** | Type change is centralized and cheap; auto-slugify gets full coverage day one, explicit codes only where `params` is needed |
| 2. Enum slugs | **A now, B as durable fix (pending a check)** | A closes the immediate gap cheaply; B is the real fix only if cross-repo shared types already exist or are already planned |
| 3. Admin content + comms | **C — split by content shape** | Closed taxonomies vs. free text need different mechanisms; SMS/voice need a recipient-language field either way |
