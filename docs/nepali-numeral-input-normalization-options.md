# Nepali-Numeral Input Normalization — Implementation Options

Companion note to the English/Nepali language-toggle work. The toggle
(`src/components/language-toggle.tsx`) only swaps which translation bundle is loaded via the
`locale` cookie — it doesn't restrict what a user can type into a form field. Once Nepali is
selectable as a UI language, nothing stops a user from typing Devanagari numerals (०-९) into
any field, regardless of locale.

Scope: **every numeric-intent field app-wide** — not just phone numbers. Phone was the field
where the clearest concrete bug was found, but the same risk applies to age, cash-transfer
amounts, bank account numbers, ward numbers, GPS coordinates, trigger thresholds, token
counts, and stock quantities — anywhere a form treats a typed string as if it's guaranteed to
be ASCII digits. Free-text fields (names, descriptions) need no fix — Devanagari script stores
and transmits as plain UTF-8 like any other string, with no parsing or type coercion involved.

## Where this lands today

An app-wide audit of numeric-intent fields found the same three failure modes repeating across
every feature area — phone is just one instance of each:

```ts
// stakeholders.helpers.ts:3-8 — normalizePhone()
// \D matches "not an ASCII digit" — Devanagari digits are stripped, not converted
phone.replace(/\D/g, '')
// "९८१२३४५६७८" silently becomes ""
```

```ts
// grievances/add/add.grievances.view.tsx:73 — strict ASCII-only regex
const phoneRegex = /^[0-9]{10,15}$/;
// beneficiary add/edit "age" (addBeneficiary.tsx:69, beneficiary.edit.page.tsx:87)
// uses the same ASCII-only pattern: z.string().refine(/^[1-9]\d*$/)
// Devanagari digits fail outright — user sees a generic "invalid" error
// for a value they typed correctly in their own script, with no hint why
```

```ts
// amount / threshold / token-count fields across GCT, fund management,
// trigger statements (gct.schemas.ts, fund.management.add.tsx,
// trigger.statement.schema.ts) — z.string().refine(!isNaN(Number(v))...)
// or z.coerce.number() / z.union([z.coerce.number().finite(), z.literal('')])
// Number('१२३') / z.coerce.number() both yield NaN on Devanagari input,
// so it's rejected — safe, but same generic-error UX problem as above
```

```ts
// the highest-risk bucket: fields with NO numeric validation at all —
// age (editBeneficiary.tsx:60, rp/beneficiary/add/add-beneficiary.tsx:55),
// accountNumber and ward (gct.schemas.ts), latitude/longitude
// (c2c/cva/rp edit forms), amountPerBeneficiary (Aidlink disbursement) —
// all plain z.string(), so Devanagari digits pass client-side validation
// untouched, reach the backend as literal Unicode, and either fail an
// ASCII-based NestJS validator or get silently persisted as unusable data
```

Existing infrastructure is display-only and one-directional (ASCII → Devanagari), with the
digit map duplicated across two files:

- `apps/rahat-ui/src/utils/useNumberFormat.ts:33-49` — `DEVANAGARI_DIGITS` array +
  `useLabelDigits()` / `useNumberFormat()`
- `apps/rahat-ui/src/utils/usePhoneFormat.ts:5-36` — a second, duplicate `DEVANAGARI_DIGITS`
  array + `usePhoneFormat()`

No reverse (Devanagari → ASCII) utility exists anywhere yet.

Also confirmed: the stakeholder Excel bulk-import already funnels phone values through the
same helper as manually-typed fields —

```ts
// import.stakeholders.tsx:176-180, 290-292, 700-702
// parses phone cells from an uploaded XLSX and calls normalizePhone()
// directly — this path never touches a React <input>, so any fix that
// only lives in a UI component would miss it
```

Inkind stock `quantity` (`inkindManagement/components/inkind.list.tsx:150-224`,
`inKindTracker/stock.tsx:105`) shows a fourth flavor of the same bug — plain component state
parsed with `parseInt`/`isNaN` at submit time, same generic-error UX as the amount/age fields
above, entirely separate from React Hook Form.

## Option A — Shared keystroke-level input component

Add a `<NumeralInput>` component that wraps the existing `Input`, transliterating Devanagari
digits to ASCII on every `onChange` so React Hook Form state always holds ASCII digits. Swap
it in for `<Input>` on every numeric-intent field found in the audit — phone, age, amount,
accountNumber, ward, latitude/longitude, token counts, thresholds, stock quantity.

- **Pros**: best possible UX — the user sees ASCII digits appear as they type (WYSIWYG), so
  there's no confusing gap between what they typed and what gets validated. React Hook Form
  state is clean from the first keystroke; nothing downstream (schema, backend) needs to
  change.
- **Cons**: still an explicit swap per field, with no structural guard against a new field
  being added later with plain `<Input>` and silently missing the fix — and with ~15+ fields
  spread across beneficiary, GCT, fund management, trigger statements, and inkind tracking,
  that adoption surface is real, not hypothetical. Doesn't reach numeric input paths that
  aren't a React Hook Form field at all: the stakeholder Excel bulk-import
  (`import.stakeholders.tsx`) parses phone cells directly, and inkind `quantity`
  (`inkind.list.tsx:150-224`) is plain component state parsed with `parseInt` — neither goes
  through an `<Input>` this option could wrap.
- **Effort**: moderate-to-high — one new component, then a swap across every flagged field in
  every feature area found in the audit.

## Option B — Centralized Zod preprocessing utility

Add one `toAsciiDigits()` function (deduping the `DEVANAGARI_DIGITS` array currently
duplicated in `useNumberFormat.ts` and `usePhoneFormat.ts` into a single shared constant), and
build an `asciiDigitString()` Zod helper on top of it using `z.preprocess()`. Swap it in for
`z.string()` on every numeric-intent schema field found in the audit (age, amount,
accountNumber, ward, latitude/longitude, threshold `value`, `numberOfTokens`, etc.), and reuse
`toAsciiDigits()` directly inside the non-schema parsing call sites — `normalizePhone()` and
the `parseInt`/`parseFloat` calls in inkind quantity and Aidlink disbursement amount — to fix
those the same way.

- **Pros**: centralizes the actual conversion logic in one utility, reusing the pattern this
  codebase already follows — validation and normalization co-located in the Zod schema per
  form. No new UI component to build or teach to future form authors. Directly closes the
  highest-risk bucket from the audit — the fields with *no* numeric validation at all
  (`accountNumber`, `ward`, `latitude`/`longitude`, some `age` fields) that currently let
  Devanagari digits reach the backend unnoticed.
- **Cons**: the user still sees raw Devanagari digits in the input box while typing; nothing
  corrects it until submit-time validation runs, which is a worse UX than seeing ASCII appear
  live — the fields with the ASCII-only regex (`age`'s `/^[1-9]\d*$/`, `phoneRegex`) will still
  show a generic "invalid" error rather than something legible. Same "touch every call site"
  adoption risk as Option A, just scoped to schemas/parsers instead of components.
- **Effort**: low-to-moderate — one utility function, then per-schema and per-parse-site edits
  across the same ~15+ fields.

## Option C — Hybrid: shared input component + shared utility as a data-integrity backstop

Build one `toAsciiDigits()` utility (dedupe `DEVANAGARI_DIGITS` as in Option B). Use it in two
places:

1. Inside `<NumeralInput>` (Option A) for real-time keystroke correction on every UI-driven
   numeric field from the audit — the primary UX fix, and the one that also fixes the generic
   "invalid" error problem, since the field never holds an un-parseable value in the first
   place.
2. Directly inside the non-UI parsing call sites as defense-in-depth: `normalizePhone()`
   (`stakeholders.helpers.ts:3-9`), which is already the shared choke point for both
   manually-typed phone fields *and* the Excel bulk-import
   (`import.stakeholders.tsx:176-180, 290-292, 700-702`); and the `parseInt`/`parseFloat`
   call sites for inkind quantity and Aidlink disbursement amount, which bypass React Hook
   Form entirely.

- **Pros**: best UX where a form exists (live ASCII feedback, no more generic "invalid"
  errors), plus a non-UI safety net (bulk import, component-state fields, pasted values) with
  minimal additional integration work, since most of those non-UI paths already call a small,
  identifiable number of shared functions.
- **Cons**: two moving pieces instead of one — a component to adopt across ~15+ JSX fields and
  a utility to wire into a handful of non-UI parse sites — so more up-front surface than either
  option alone, though each piece individually is simpler than forcing everything through a
  single mechanism. Given the field count, this is worth sequencing (see recommendation) rather
  than shipping as one large change.
- **Effort**: moderate-to-high — Option A's full component rollout plus a small, well-contained
  set of non-UI fixes.

## Recommendation: **Option C, sequenced by risk**

Options A and B each solve half the problem alone: A fixes UX for typed input but misses every
non-UI numeric-input path (bulk import, component-state quantity fields); B protects data
integrity everywhere it's wired in but leaves a confusing UX gap between typing and
validation. Given the audit surfaced ~15+ fields across five feature areas, don't ship this as
one big-bang change — sequence it by actual risk:

1. **First**, apply Option B to the highest-risk bucket: fields with *no* numeric validation
   today (`accountNumber`, `ward`, `latitude`/`longitude`, the unvalidated `age` fields,
   `amountPerBeneficiary`). These are the ones silently persisting bad data right now, so
   they're the actual bug fix, not just a UX improvement.
2. **Then**, roll out `<NumeralInput>` (Option A) across the same field set plus the
   already-validated-but-ungracefully-failing ones (`age`'s ASCII regex, amount/threshold
   `Number()`/`z.coerce.number()` fields), for the live-correction UX win.
3. **Throughout**, reuse the same `toAsciiDigits()` utility everywhere — it's one function
   used twice (component + parser), not two features to build, and the non-UI backstop
   (`normalizePhone()`, inkind `parseInt`) is cheap precisely because it's a small, already-
   identified set of call sites.

## Summary table

| Option | UX (live correction) | Covers bulk-import / non-UI parsing | Fixes unvalidated fields (real bug) | Effort |
|---|---|---|---|---|
| A — Input component only | Yes | No | No (component-only, misses non-UI paths) | Moderate-high |
| B — Zod preprocessing only | No (submit-time only) | Yes (wired into shared parse sites) | Yes | Low-moderate |
| C — Hybrid, sequenced (recommended) | Yes | Yes | Yes | Moderate-high, phased |

## Field inventory from the audit

| Field | File | Validation today | Risk |
|---|---|---|---|
| Phone | `stakeholders.helpers.ts:3-8` (`normalizePhone`) | Strips non-ASCII digits | Data loss — Devanagari number becomes `""` |
| Phone | `grievances/add/add.grievances.view.tsx:73` | ASCII-only regex | Rejected with generic error |
| Age | `addBeneficiary.tsx:69`, `beneficiary.edit.page.tsx:87` | ASCII-only regex `/^[1-9]\d*$/` | Rejected with generic error |
| Age | `editBeneficiary.tsx:60`, `rp/beneficiary/add/add-beneficiary.tsx:55` | None (`z.string()`) | Unvalidated — reaches backend as-is |
| Cash-transfer amount | `gct.schemas.ts`, `edit.gct.record.tsx` | `z.string().refine(!isNaN(Number(v)))` | Rejected with generic error |
| Bank account number | `gct.schemas.ts` | None (`z.string().min(1)`) | Unvalidated — reaches backend as-is |
| Ward | `gct.schemas.ts` | None (`z.string().min(1)`) | Unvalidated — reaches backend as-is |
| Token count | `fund.management.add.tsx:72` | `z.coerce.number().gte(1)` | Rejected with generic error |
| Budget/transfer amount | `cashTracker/budget.tsx`, `initiate.fund.transfer.tsx`, `assign.funds.form.tsx` | None (raw state, `parseFloat` at submit) | Unvalidated until submit; `NaN` silently mishandled |
| Trigger threshold value | `trigger.statement.schema.ts:67` | `z.union([z.coerce.number().finite(), z.literal('')])` | Rejected with generic error |
| Amount per beneficiary | `beneficiaryDisbursementForm.tsx`, `groupsDisbursementForm.tsx` | None (`register()` string, `parseFloat` for display) | Unvalidated — reaches backend as-is |
| Inkind quantity | `inkind.list.tsx:150-224`, `inKindTracker/stock.tsx:105` | Component state, `parseInt` + `isNaN` check | Rejected with generic error |
| Latitude / longitude | c2c/cva/rp edit forms | None (`z.string()`) | Unvalidated — reaches backend as-is |
