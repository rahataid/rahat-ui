# Translation Guide — `apps/rahat-ui` (Project AA)

> **Audience:** Any developer assigned to translate a new screen / component in `apps/rahat-ui`, especially inside `sections/projects/aa-2/**` (Project AA).
> **Scope:** Only `apps/rahat-ui` is translated. `libs/shadcn`, `community-tool-ui`, backend services are out of scope.
> **Stack:** `next-intl@^4.13.2` + `next@14.1.3` · Locales: `en` (default), `ne` (Nepali) · Cookie-based, **no** `/en` or `/ne` URL prefix.
> **Companion doc:** `TRANSLATION-IMPLEMENTATION-GUIDE.md:1` covers deeper AA-specific review history. This guide is the **hands-on cookbook** for the next translator.

---

## TL;DR — Which Util When?

| You need to… | Use this | File | Never use |
|---|---|---|---|
| Show a **static** label/button/placeholder/title | `t('KEY')` with `useTranslations('…')` | `next-intl` | Hard-coded English string |
| Show a **dynamic** value from props/API (status, enum, category) | `translateValue(t, value, opts)` | `src/utils/i18n/translateValue.ts:42` | `t(value)` or manual `t.has()?t():fallback` |
| Show a **number / count / amount** | `useNumberFormat()` | `src/utils/i18n/number.ts:5` | `Intl.NumberFormat` directly, `formatNumber` from `utils/string.ts:3` |
| Show **digits inside a label** like `"20-30"`, `"<20"` | `useLabelDigits()` | `src/utils/i18n/number.ts:52` | `useNumberFormat()` (it will return `"NaN"` or passthrough) |
| Show a **phone number** | `usePhoneFormat()` | `src/utils/i18n/phone.ts:11` | `useNumberFormat()` (strips `+`, adds grouping) |
| Format a **date** in a hook/component | `useDateFormat()` | `src/utils/i18n/date.ts:256` | `dateFormate.ts:11` (`date-fns`), `new Date().toLocaleString()` |
| Format a **date** outside a hook (util / server) | `intlFormatDate(dateStr, locale)` | `src/utils/index.ts:141` | `dateFormate.ts` |
| Accept **user-typed digits** in `ne` locale | `toAsciiDigits()` / `normalizeNumeralsPreprocessor` | `src/utils/i18n/numeral.ts:30` | Nothing (otherwise `१२३` → `NaN`) |
| Translate **PhoneInput dropdown** | `usePhoneCountrySelectProps()` | `src/utils/i18n/phone.ts:28` | Hard-coded English dropdown |
| Show a **backend error** (global toast) | Already handled by `useError()` | `src/utils/i18n/useErrors.ts:43` | Manual `toast(error.message)` |
| Show a **backend error** inline / per-mutation | `resolveBackendErrorMessage()` etc. | `libs/query/src/utils/i18n/backend-error.ts:45` | Raw `error.response.data.message` |

If you only remember one rule: **static text → `t()`, dynamic value → `translateValue()`, numbers → `useNumberFormat()`, labels with digits → `useLabelDigits()`, phones → `usePhoneFormat()`, dates → `useDateFormat()`.**

---

## 1. How Translation Works in This App

### 1.1 Message files

```
apps/rahat-ui/messages/en.json  — 4,215 leaf keys, 84 namespaces
apps/rahat-ui/messages/ne.json  — 4,215 leaf keys, identical key set (0 drift)
```

- Top-level keys are **namespaces**: `GLOBAL` (shared, 556 keys), `AA_PROJECT` (AA-specific, 1,978 keys), `AA_PROJECT_WITH_CASH_TRACKER` (327), `AA_PROJECT_WITH_GNOSIS` (209), `BACKEND` (342 error codes in 18 groups), plus ~50 small feature slices (`LOGIN`, `BENEFICIARY_*`, `TREASURY_*`, etc.).
- Inside each namespace: `SCREAMING_SNAKE` keys → ICU string values with `{placeholder}` interpolation.
- Both files must stay in **perfect parity** — every key exists in both, same `{placeholder}` names. CI does not auto-check; dev warns at runtime if a key is missing.

```json
// en.json
{
  "GLOBAL": { "SAVE": "Save", "PENDING": "Pending", "PAGE_CURRENT_OF_TOTAL": "Page {current} of {total}" },
  "AA_PROJECT": { "TOKEN_STATUS": "Token Status", "SOURCES_HEALTHY_RATIO": "{count}/{total} sources healthy" },
  "BACKEND": { "GROUP_CASH_TRANSFER": { "INSUFFICIENT_TREASURY_BUDGET": "Insufficient budget: treasury balance {balance} is less than requested {amount}" } }
}
```

### 1.2 Locale resolution (3 tiers)

Defined in `src/i18n/config.ts:1` (`locales=['en','ne']`, `defaultLocale='en'`), wired through:

1. **Cookie `locale`** — checked first in `src/middleware.ts:43` and `src/i18n/request.ts:8`. Set on first visit, `maxAge=365 days` (`middleware.ts:6`).
2. **`x-detected-locale` request header** — set by middleware on first visit (`middleware.ts:57`) so the *current* SSR render already uses the detected locale. Without it the cookie would only take effect on the next request.
3. **`Accept-Language` negotiation** — RFC 4647 `q=`-aware parsing in `resolveLocaleFromAcceptLanguage()` (`middleware.ts:19`). Falls back to `defaultLocale` (`request.ts:17`).

Middleware matcher: `/((?!api|_next/static|_next/image|favicon.ico|.*\..*).*)` (`middleware.ts:70`) — every page, skipping APIs/assets.

`localePrefix: 'never'` in `src/i18n/routing.ts:7` — URLs never contain `/en` or `/ne`. The language toggle writes `document.cookie = locale=…` and does `window.location.reload()` (`src/components/language-toggle.tsx:99`) rather than `router.refresh()` to re-propagate locale into already-mounted client subtrees.

### 1.3 How messages reach components

- **Server** (`request.ts:19`): `getRequestConfig()` dynamically imports `../../messages/${locale}.json`.
- **Root layout** (`src/app/layout.tsx:29`): `getLocale()` + `getMessages()` → `<NextIntlClientProvider locale messages>` + `<html lang={locale}>` + `<TranslationBridge />`.
- **`TranslationBridge`** (`src/providers/translation-bridge.tsx:6`): pushes `useTranslations('GLOBAL')` into a singleton (`libs/community-query/src/translate.ts:1`) so query-layer `Swal.fire(getTranslate()('BENEFICIARY_CREATED_SUCCESSFULLY'))` works outside React.
- **Client components**: `useTranslations(namespace)`, `useLocale()`, `useFormatter()`, `useMessages()`.
- **Server components**: `await getTranslations(namespace)`.
- **Plugin** (`next.config.js:8`): `createNextIntlPlugin('./src/i18n/request.ts')`.

> **Gotcha:** `next-intl.config.ts` at the app root sets `localePrefix:'as-needed'` but is **never imported** — runtime uses `src/i18n/routing.ts`. Delete or align it if you touch routing.

---

## 2. The Core Question — Why Two Utils? Which to Use When?

The codebase has several pairs of utilities that look like they do the same job. They don't — each pair exists because the **input shape** or **call-site context** is different and merging them would create subtle bugs. This section is the heart of this guide.

### 2.1 Pair 1 — `t('KEY')` vs `translateValue(t, value, opts)` — Static vs Dynamic

**Why two?** `t()` is for keys you know at write time. `translateValue()` is for keys derived from runtime data (API responses, props, enums). The old codebase hand-rolled `t.has(key) ? t(key) : fallback` ~30 times with inconsistent regex and no dev warning. `translateValue` (`src/utils/i18n/translateValue.ts:42`) centralizes that pattern.

| Technique | When | What it does | Risk if misused |
|---|---|---|---|
| `t('PENDING')` | Static UI text: headings, buttons, placeholders | Direct lookup. Missing key → renders `"PENDING"` + `next-intl` error | Crashes/hard-fails if key missing, but that's intentional — you catch it in QA |
| `t.has(k) ? t(k) : fallback` | Legacy — do not write new code this way | Manual guard | Verbose, duplicated `toUpperCase().replace()` across 30 sites |
| `translateValue(t, value, opts)` | **Any dynamic value**: `row.status`, `category.name`, `gender`, backend enums, tab labels | Normalizes `raw → KEY` via `toKey()` (`translateValue.ts:11`: `toUpperCase().replace(/[\s-]+/g,'_')`), checks `t.has(key)`, returns `t(key)` or fallback, dev-warns once per missing key via `warnedKeys` Set (`translateValue.ts:8`) | None — this is the canonical path |

**API `translateValue.ts:24`:**

```ts
translateValue(
  t: Translator,                // from useTranslations('NAMESPACE')
  value: unknown,               // raw string / enum / number / null
  options?: {
    keyMap?: Record<string,string>;           // collision escape hatch: { Payout: 'PAYOUT2' }
    fallback?: string;                        // explicit fallback when key !== desired text
    fallbackStyle?: 'humanized' | 'raw';      // default 'humanized' (SOME_VALUE → Some Value), 'raw' (pass through)
    silent?: boolean;                         // suppress dev warning (expected misses)
  }
): string
```

- `fallbackStyle:'humanized'` (default) — for **closed enums** where a missing translation is a bug you want to notice. `toLabel()` title-cases the key as fallback so UI is still readable + warning fires.
- `fallbackStyle:'raw'` — for **open / admin-authored / free-text** values where a miss is expected. Returns raw trimmed value unchanged, with warning only if `silent` is false.
- `silent:true` — for high-frequency misses (e.g. admin-created phase names rendered in a list) to avoid spamming console per row. Still returns fallback.
- `keyMap` — when two different English words slug to the same key (e.g. `Payout` the noun vs `Payout` the action), or a key collides with an existing unrelated key.

**Usage — copy-paste:**

```tsx
import { useTranslations } from 'next-intl';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

// Static — always t()
const t = useTranslations('AA_PROJECT');
const tg = useTranslations('GLOBAL');
return <h1>{t('TOKEN_STATUS')}</h1>           // AA key
       <button>{tg('SAVE')}</button>          // shared key

// Dynamic — always translateValue()
const status = row.getValue('status');        // e.g. "PENDING" from API
<Badge>{translateValue(tg, status)}</Badge>  // humanized fallback + warning if key missing

// Dynamic with explicit fallback (when fallback text != humanized key)
{translateValue(tg, row.getValue('status'), { fallback: String(status ?? '') })}

// Open vocabulary — admin-authored, expected miss
{translateValue(t, category.name, { fallbackStyle: 'raw', silent: true })}

// Collision
{translateValue(t, item.title, { keyMap: { Payout: 'PAYOUT2' } })}
```

**When NOT to use `translateValue`:** static keys known at write time. `t('SAVE')` is cheaper and gives you a TypeScript/IDE-verifiable key. `translateValue` is for values you cannot enumerate at build time.

---

### 2.2 Pair 2 — `useNumberFormat` vs `useLabelDigits` vs `usePhoneFormat` — Three Number Utils, Not Two

**Why three?** All three render Devanagari digits (`०-९`) in `ne` locale, but their **input domains** are disjoint and `Intl.NumberFormat` cannot handle two of them. A single function would need heuristics and silently produce wrong output.

| Hook | Tech | Input domain | Grouping | Example | File |
|---|---|---|---|---|---|
| `useNumberFormat` | `next-intl` `formatter.number(n, {numberingSystem:'deva'})` → `Intl.NumberFormat` | `number \| bigint \| numeric string` | ✅ `1,234` | `1234 → "१,२३४"` (ne) | `src/utils/i18n/number.ts:5` |
| `useLabelDigits` | Manual `str.replace(/[0-9]/g → DEVANAGARI)` | Mixed strings: `"20-30"`, `"<20"`, `"Ward 5"` | ❌ | `"20-30" → "२०-३०"` | `src/utils/i18n/number.ts:52` |
| `usePhoneFormat` | Manual `str.replace(/[0-9]/g → DEVANAGARI)` | E.164 phone strings: `"+9779810100000"` | ❌ (would corrupt phone) | `"+977981…" → "+९७७९८१…"` | `src/utils/i18n/phone.ts:11` |

- `useNumberFormat` (`number.ts:9`) guards against chart libraries piping category labels through the numeric axis formatter: `null/undefined/''→''`, non-numeric string → `String(value)` passthrough, `bigint` handled separately to avoid overflow. `locale==='ne'` adds `{numberingSystem:'deva'}`.
- `useLabelDigits` (`number.ts:52`) exists because `Intl.NumberFormat` rejects strings containing non-digits. It is the only correct choice for age ranges, bucket labels, `formatDigits(ward_no)`, etc.
- `usePhoneFormat` (`phone.ts:11`) exists because phones look numeric but must **never** go through grouping (`+977 981...` → `NaN` in `Intl`). It also preserves the leading `+`.
- `useChartNumberOptions()` (`number.ts:34`) is sugar for ApexCharts: pre-wired `{xaxis,yaxis,tooltip}` formatters that call `useNumberFormat` internally.

**Decision flowchart:**

```
Is it a phone number (with +, country code)?
  yes → usePhoneFormat()
  no  → Is it purely numeric (typeof number / bigint / "1234")?
          yes → useNumberFormat()
          no  → Does it mix digits with text ("20-30", "<20", "Ward 5")?
                  yes → useLabelDigits()
                  no  → It's likely an enum — use translateValue()
```

**Examples in AA:**

```tsx
// Counts/amounts — sections/beneficiary/beneficiaryDetail.tsx:55
const formatNum = useNumberFormat();
<p>{beneficiary.extras.age ? formatNum(beneficiary.extras.age) : g('N_A')}</p>

// Chart bucket labels — sections/dashboard/component/beneficiaryDemographics.tsx:22
const formatLabel = useLabelDigits();
categories={ageGroups.map(i => formatLabel(i.label))} // "20-30" → "२०-३०"

// Phones — sections/beneficiary/beneficiaryDetail.tsx:56
const formatPhone = usePhoneFormat();
<p>{formatPhone(beneficiary.piiData.phone)}</p>

// Chart — token overview uses all three via useChartNumberOptions
const { formatNum, chartOptions } = useChartNumberOptions();
<DynamicPieChart pieData={genderData} options={chartOptions} />
```

Also available: `<PhoneInput {...usePhoneCountrySelectProps()} …>` (`phone.ts:28`) translates the 6-country dropdown (`NP/KE/MW/PK/KH/SG` + search/empty text via `GLOBAL.NEPAL`, `SEARCH_COUNTRY`, etc.) — always spread this when rendering `PhoneInput`.

---

### 2.3 Pair 3 — Display (`number.ts`/`phone.ts`) vs Input Normalization (`numeral.ts`) — Opposite Directions

**Why two?** Display utils convert **ASCII → Devanagari** for rendering. Input utils convert **Devanagari → ASCII** before validation/submission. The `ne` locale lets users *type* `०१२३` on a Nepali keyboard; the backend and `isValidPhoneNumber`/`z.number()` assume ASCII. Both directions are required for round-trip correctness.

| Direction | Util | When | Signature | File |
|---|---|---|---|---|
| **ASCII → Devanagari** (display) | `useNumberFormat`, `useLabelDigits`, `usePhoneFormat` | Rendering table cells/charts/phones | hooks, `useLocale()`-aware | `number.ts`, `phone.ts` |
| **Devanagari → ASCII** (input) | `toAsciiDigits`, `normalizeNumeralsPreprocessor`, `normalizeNumeralsToNumberPreprocessor` | `onChange`, Zod schemas | pure functions, no hook | `src/utils/i18n/numeral.ts:30` |

- `toAsciiDigits(value: string): string` (`numeral.ts:30`) — regex `/[०-९]/g` → `0-9`, leaves Devanagari letters untouched. Safe on mixed content: `toAsciiDigits("name १२३") → "name 123"`, Devanagari prose unchanged.
- `normalizeNumeralsPreprocessor(value: unknown): unknown` (`numeral.ts:44`) — `z.preprocess` for `z.string()`: `typeof string ? toAsciiDigits(trim().trim()) : value`.
- `normalizeNumeralsToNumberPreprocessor(value: unknown): unknown` (`numeral.ts:59`) — `z.preprocess` for `z.coerce.number()`: returns string so `z.coerce` still coerces; empty strings pass through so `z.string().min(1)` still catches.

**Copy-paste:**

```tsx
// Imperative onChange — app/auth/login/page.tsx:184
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/i18n/numeral';
import { useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
const formatDigits = useLabelDigits();
<Input value={formatDigits(otp)} onChange={e => { const v = toAsciiDigits(e.target.value); if(/^\d*$/.test(v)) setOtp(v); }} />

// Zod schema — sections/beneficiary/editBeneficiary.tsx:35
import { normalizeNumeralsPreprocessor } from 'apps/rahat-ui/src/utils/i18n/numeral';
phone: z.preprocess(normalizeNumeralsPreprocessor, z.string().refine(isValidPhoneNumber, { message: t('INVALID_PHONE') })),
amount: z.preprocess(normalizeNumeralsPreprocessor, z.string().min(1))

// Number schema
amountNum: z.preprocess(normalizeNumeralsToNumberPreprocessor, z.coerce.number().positive())

// Numeric <Input> — fundManagement/components/inKindTracker/stock.tsx:31
<Input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: toAsciiDigits(e.target.value) })} />
```

> **Pitfall:** The `triggerStatement` and `groupCashTransfer` forms have several `<Input type="number">` that lack `toAsciiDigits` on `onChange` — Devanagari `१००` would submit as `NaN`. Add normalization whenever the field accepts Nepali input.

---

### 2.4 Pair 4 — Date Formatters — `useDateFormat` vs `intlFormatDate` vs Legacy `dateFormate.ts`

**Why multiple?** Strata from migration. Only one is correct for new AA code.

| Util | Locale source | `deva` digits | Nepali weekday/month patch | Tech | When to use |
|---|---|---|---|---|---|
| `useDateFormat()` | `useLocale()` hook | ✅ | ✅ `localizeNepaliParts` | `Intl.DateTimeFormat` + `PATTERN_MAP` | **New client components — always** |
| `intlFormatDate(dateStr, locale)` / `intlDateFormat` | Explicit `locale` param | ✅ | ✅ | `Intl` — splits into 4 formatters then re-joins | Outside hooks (server utils, non-React) |
| `dateFormate.ts:dateFormat` | None | ❌ | ❌ | `date-fns/format` — always English | **Never** in new code — legacy `aidlink` vertical only |

`useDateFormat` (`date.ts:256`) is the final form:

```ts
const formatDate = (date: Date|string|number|undefined|null, pattern: DateFormatPattern = 'MMMM d, yyyy, h:mm:ss a'): string
// PATTERN_MAP: Record<string, Intl.DateTimeFormatOptions> maps 20 date-fns-style pattern strings → Intl options
// e.g. 'MMM d, yyyy, h:mm a' → { year:'numeric', month:'short', day:'numeric', hour:'numeric', minute:'2-digit', hour12:true }
// unknown pattern → falls back to 'MMMM d, yyyy, h:mm:ss a'
// locale==='ne' → { ...options, numberingSystem:'deva' } + 'ne-NP' formatter
// if (locale==='ne' && (options.weekday || options.month)) → localizeNepaliParts(d, options, formatter.formatToParts(d))
// handles invalid/falsy → '' with try/catch
```

`localizeNepaliParts` (`date.ts:227`) exists because some browsers ship incomplete `ne` CLDR: `numberingSystem:'deva'` localizes digits but weekday/month still fall back to English (`"Sun, २७ जनवरी"`). It substitutes `NEPALI_WEEKDAYS_SHORT/LONG` (`date.ts:178`) and `NEPALI_MONTHS_SHORT/LONG` (`date.ts:184`) via timezone-aware helpers `getWeekdayIndex`/`getMonthIndex` (`date.ts:208`) that re-derive through `Intl.DateTimeFormat('en-US',{weekday:'short', timeZone})` to stay consistent when `options.timeZone` is pinned (e.g. `Asia/Kathmandu`).

**Copy-paste:**

```tsx
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
const formatDate = useDateFormat();
<span>{formatDate(row.createdAt, 'MMM d, yyyy, h:mm a')}</span>
<span>{formatDate(beneficiary.createdAt, 'dd MMMM, yyyy')}</span>
<span>{formatDate(payout.time, 'hh:mm a')}</span>

// Outside a component — src/sections/projects/aa-2/payout/benefTransactionDetails/benefTransactionDetails.tsx:239
import { intlFormatDate } from 'apps/rahat-ui/src/utils';
intlFormatDate(dateStr, locale)
```

Available patterns (`date.ts:5` union): `'MMMM d, yyyy, h:mm:ss a'`, `'dd MMMM, yyyy'`, `'hh:mm:ss a'`, `'MMMM dd, yyyy, hh:mm:ss a'`, `'eee, MMMM d, yyyy, h:mm:ss'`, `'eee, MMM d yyyy, hh:mm:ss a'`, `'eee, MMMM d, yyyy'`, `'eee, MMMM d, yyyy, h:mm a'`, `'MMM dd'`, `'MMM dd, yyyy'`, `'MMMM d, yyyy, h:mm:ss'`, `'hh:mm a'`, `'MMMM dd, yyyy'`, `'MMM d, yyyy, h:mm a'`, `'MMM dd, yyyy, hh:mm a'`, `'MMMM dd, yyyy HH:mm'`, `'PPP'`, `'dd MMM yyyy, HH:mm'`, `'dd MMM yyyy, HH:mm:ss'`, `'MMM d, yyyy, h:mm:ss a'`.

---

### 2.5 Pair 5 — Backend Errors — Global Toast vs Per-Mutation Inline

**Why two?** Different consumers, different context.

| Layer | File | What it does | Search scope | When it fires |
|---|---|---|---|---|
| **A — Global catch-all toast** | `src/utils/i18n/useErrors.ts:43` `useError()` | Subscribes to `useErrorStore` (Zustand via `@rumsan/react-query`), shows destructive toast with `tg('ERROR')` title | Scans **every** `BACKEND.<GROUP>` blindly (`useErrors.ts:9` `findBackendTranslation`) | Any unhandled API error — correct for "something failed and we don't know where" |
| **B — Per-mutation precise resolver** | `libs/query/src/utils/i18n/backend-error.ts:45` `resolveBackendErrorMessage` / `resolveBackendErrorMessageByPrefix` / `resolveBeneficiaryErrorMessage` | Called explicitly inside `try/catch` or `onError`, given the service's own `BACKEND.<GROUP>` list | Scans only the listed groups, in order | Inline field errors, confirmation dialogs, controlled toasts where domain is known |

```
Service hook (knows its domain) ──→ resolveBackendErrorMessage(t, code, params, ['AA_PROJECT','USERS'], raw)
                                    ──→ t('BACKEND.AA_PROJECT.AMOUNT_MUST_BE_POSITIVE')  (ne: "रकम सकारात्मक…")
                                    ──→ string shown as field error / thrown

Unhandled error (knows nothing) ──→ useError() scans every BACKEND.GROUP for code/name/[CODE]/slug
                                    ──→ toast with tg('ERROR') title
```

`useError` resolution chain (`useErrors.ts:59`): `data.code` → `data.name` → `[BRACKET_CODE]` from message prefix → `toMessageSlug(rawMessage)` (`useErrors.ts:23`: `toUpperCase().replace(/[^A-Z0-9]+/g,'_')`) → fallback `bracket?.text || rawMessage || name`.

Library helpers (`backend-error.ts:45`): additionally handle `translateFieldParam` (`backend-error.ts:11` — if `params.field==='name'`, translates `GLOBAL.NAME` before interpolating so Nepali template `"यो {field} भएको..."` doesn't glue an English word into Nepali), and `resolveBeneficiaryErrorMessage` (`backend-error.ts:105`) for endpoints served by mixed backends (`apps/rahat` preserves `code`; `apps/beneficiary` strips it and prefixes message as `[CODE] text`).

**You generally do not need to touch Layer A** — `useError()` is mounted once in `providers/service.provider.tsx:127`. For your feature's mutation, use Layer B:

```tsx
import { resolveBackendErrorMessage } from '@rahat-ui/query/src/utils/i18n/backend-error';
try { await createPayout(payload); }
catch (error: any) {
  const raw = error?.response?.data?.message || '';
  const code = error?.response?.data?.code;
  const params = error?.response?.data?.params;
  const msg = resolveBackendErrorMessage(t, code, params, ['AA_PROJECT'], raw);
  setFieldError(msg); // or toast
}
```

---

### 2.6 Pair 6 — `useTranslations('AA_PROJECT')` vs `useTranslations('GLOBAL')` — Namespace Choice

**Why two?** `GLOBAL` holds cross-cutting strings (toasts, table chrome, enums like `MALE/FEMALE/PENDING`, `N/A`, pagination). `AA_PROJECT` holds AA workflow strings (phase/trigger/activity/fund keys). Using the wrong namespace silently renders the key in English-mostly-ne locale.

- Generic/shared → `GLOBAL` (e.g. `tg('SAVE')`, `tg('PENDING')`, `tg('PHONE')`, `tg('N_A')`, `tg('PAGE_CURRENT_OF_TOTAL')`).
- AA workflow → `AA_PROJECT` (e.g. `t('TOKEN_STATUS')`, `t('CANNOT_ADD_TRIGGERS_ACTIVE_PHASE')`, `t('PHASE_REVERTED_SUCCESS')`).
- Alternate rails → `AA_PROJECT_WITH_CASH_TRACKER` / `AA_PROJECT_WITH_GNOSIS` when rendering cash-tracker/Gnosis-specific UIs (e.g. `payout/table/usePayoutTransactionLogTableColumn.tsx:28`).

Convention in AA (`sections/projects/aa-2/**`): `t` for `AA_PROJECT`, `tg` for `GLOBAL`, `tc`/`tv` for the specialized overlay. Multiple translators coexist per file — e.g. `token.overview.tsx` uses `t` (`AA_PROJECT`), `tg` (`GLOBAL`), `tc` (`AA_PROJECT_WITH_CASH_TRACKER`) side by side.

> Avoid duplicating a `GLOBAL` key into `AA_PROJECT` with the same English value — it creates drift (165 overlapping keys already diverge in casing/punctuation) and inflates the catalog.

---

## 3. The Rule — What to Translate vs What Not To

This is the most review-sensitive part. Use this **Category** test before writing `translateValue`:

### Category A — Frontend-authored UI text → always translate via `t()`

Headings, button labels, placeholders, tooltips, empty-state text. The frontend owns this text.

```tsx
// Before
<Label>GCT Group Name <Req /></Label>
<Input placeholder="Enter GCT Group Name" {...field} />
// After
<Label>{t('GCT_GROUP_NAME')} <Req /></Label>
<Input placeholder={t('ENTER_GCT_GROUP_NAME')} {...field} />
```

### Category B — Backend-owned values with NO frontend enum → never translate

Example: `registeredApps` returns `"INKIND"`/`"CASH"` — no TypeScript enum or dropdown backs it; backend could add a third value tomorrow. Translating would mean the frontend decides what the backend vocabulary means in Nepali.

```tsx
// vendor/table.columns.tsx — deliberately left untranslated
{apps.map((app) => <Badge>{app}</Badge>)}
```

**Why not `t.has()` guard anyway?** Safety ≠ correctness. `t.has()` prevents crashes, but a mistranslation that *looks intentional* is worse than showing the raw English. This was learned the hard way — an earlier pass over-translated Category B values and had to be reverted (`BACKEND-VALUE-TRANSLATION-REVERT.md`).

### Category C — Backend-owned values WITH a real frontend enum/const → translate via `translateValue()`

The value comes from the backend, but a closed enum exists and is used in this repo's own forms — so the value set is known and frontend-owned.

```ts
// libs/*/enums or local const: enum Gender { MALE="MALE", FEMALE="FEMALE", OTHER="OTHER", UNKNOWN="UNKNOWN" }
// libs/query/src/lib/grievance/types/grievance.ts : enum GrievanceStatus { ... }
// sections/projects/aa-2/triggerStatement/utils.ts : const SOURCE_MAPPING = { ... }
```

```tsx
// users.detail.split.view.tsx — guarded display
const label = translateValue(tg, userDetail?.gender, { fallback: userDetail?.gender ?? tg('N_A') });
// Or simpler: translateValue(tg, userDetail?.gender, { fallbackStyle: 'raw' })
// "MALE" → tg.has('MALE')? tg('MALE') : humanized "Male" (en) / devanagari (ne) + warning
```

Other Category C in AA: `bankedStatus`/`phoneStatus`/`internetStatus` (`@rumsan/sdk` enums), `GrievanceStatus` (local), DHM/GFH/GLOFAS trigger sources (`SOURCE_MAPPING`).

**How to tell B from C:** grep for the value as a string literal. If it only appears as raw text from an API response → B. If a `.ts`/`.tsx` imports or declares it as enum/const → C. `translateValue` still handles both safely — `fallbackStyle:'raw'` + `silent:true` for B, default `humanized` for C.

---

## 4. Step-by-Step — Translating a New Screen (Cookbook)

Assume you are assigned `sections/projects/aa-2/myFeature/**`. Adapt the feature name per your ticket.

### Step 0 — Identify the scope

- Is it `sections/projects/aa-2/myFeature/**` (AA), or a shared/global area? AA screens use `AA_PROJECT` namespace; shared components use `GLOBAL`.
- Skim `TRANSLATION-IMPLEMENTATION-GUIDE.md:48` namespace list to pick the right one.

### Step 1 — Add keys to both message files

Open `apps/rahat-ui/messages/en.json` and `ne.json` side-by-side.

- Add under `AA_PROJECT` (or `GLOBAL` if shared) — one key per string, `SCREAMING_SNAKE`, value is the English/Nepali copy.
- For ICU interpolation (numbers inside sentences), include `{varName}` placeholders (lowerCamel). **Same placeholder names in both files** — `en: "Page {current} of {total}"` + `ne: "पृष्ठ {current} / {total}"`, never `ne: "पृष्ठ {हाल} को {जम्मा}"`.
- Populate `ne.json` with the reviewed Nepali translation (or English as placeholder if translator hasn't delivered — but never ship `en===ne` silently; flag it).
- Keep both JSON valid, sorted near related keys (no strict order enforced, but `restructure-csv.mjs` can re-sort the CSV sidecar).

### Step 2 — Wire `useTranslations` in the component

```tsx
'use client'; // required for next-intl hooks in App Router client components
import { useTranslations } from 'next-intl';
export default function MyFeatureList() {
  const t  = useTranslations('AA_PROJECT'); // feature's own namespace
  const tg = useTranslations('GLOBAL');     // shared namespace (N_A, actions, enums)
  // ...
}
```

Server components: `import { getTranslations } from 'next-intl/server'; const t = await getTranslations('AA_PROJECT');`

### Step 3 — Replace hard-coded static text with `t()`

```tsx
// Find every JSX text node, placeholder=, title=, alt=, toast message
<h1>{t('MY_FEATURE_TITLE')}</h1>
<Input placeholder={t('ENTER_MY_FEATURE_NAME')} {...field} />
<Button>{t('ADD_MY_FEATURE')}</Button>
<Badge>{tg('PENDING')}</Badge>  // shared enum uses GLOBAL
{items.length === 0 && <p>{t('NO_DATA_AVAILABLE')}</p>}
```

Use `grep` to sweep: `rg -n '>[A-Z][a-z ]+<|placeholder="|title="|toast\.' apps/rahat-ui/src/sections/projects/aa-2/myFeature`.

### Step 4 — Replace dynamic backend values with `translateValue()`

```tsx
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';

// Closed enum → default humanized fallback + warning if key missing
<Badge>{translateValue(tg, row.getValue('status'))}</Badge>
// e.g. "PENDING" → tg('PENDING') → "लम्बित" (ne) / "Pending" (en)

// Open/admin-authored → raw + silent
<Badge>{translateValue(t, row.categoryName, { fallbackStyle: 'raw', silent: true })}</Badge>

// Collision or alias
{translateValue(t, item.title, { keyMap: { Payout: 'PAYOUT2' } })}
```

Deriving keys from values? `translateValue` already does `toUpperCase().replace(/[\s-]+/g,'_')`. For punctuated titles (`"Gnosis (Multi-sig)" → "GNOSIS_MULTI_SIG"`), it still matches — but if the backend label has punctuation you need to preserve, normalize explicitly:

```tsx
// fundManagement/components/tabs.tsx pattern — backend tab label → key
const labelKey = tab.label.toUpperCase().replace(/[^A-Z0-9]+/g,'_').replace(/^_+|_+$/g,'');
{translateValue(t, labelKey, { fallback: tab.label })}
```

### Step 5 — Localize numbers, phones, dates

```tsx
import { useNumberFormat, useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/i18n/phone';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';

const formatNum    = useNumberFormat();  // counts/amounts
const formatLabel  = useLabelDigits();   // "20-30", "<20"
const formatPhone  = usePhoneFormat();   // phones
const formatDate   = useDateFormat();    // dates

<span>{formatNum(row.getValue('amount'))}</span>          // 1250 → "१,२५०" in ne
<span>{formatLabel(row.rangeLabel)}</span>                // "20-30" → "२०-३०"
<span>{formatPhone(row.getValue('phone'))}</span>
<span>{formatDate(row.getValue('createdAt'), 'MMM d, yyyy, h:mm a')}</span>

// ICU inside sentence — formatted number *inside* placeholder
{t('SOURCES_HEALTHY_RATIO', { count: formatNum(healthy), total: formatNum(total) })}

// Chart — token.overview.tsx pattern
const { formatNum, chartOptions } = useChartNumberOptions();
<DynamicPieChart options={{ ...chartOptions, plotOptions: { pie: { donut: { labels: { total: { label: t('TOTAL'), formatter: w => formatNum(w.globals.seriesTotals.reduce(...)) } } } } } }} />

// PhoneInput — always spread translated props
const phoneProps = usePhoneCountrySelectProps();
<PhoneInput {...field} {...phoneProps} placeholder={t('ENTER_PHONE_NUMBER')} />
```

### Step 6 — Normalize inputs that accept Nepali digits

```tsx
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/i18n/numeral';
// or for Zod:
import { normalizeNumeralsPreprocessor } from 'apps/rahat-ui/src/utils/i18n/numeral';

// Imperative (numeric <Input>)
<Input type="text" value={value} onChange={e => setValue(toAsciiDigits(e.target.value))} />

// Zod schema — sections/beneficiary/editBeneficiary.tsx:35
phone: z.preprocess(normalizeNumeralsPreprocessor, z.string().refine(isValidPhoneNumber, { message: t('INVALID_PHONE') })),
```

Every `type="number"` / amount / age / OTP / bank field that a `ne`-locale user can type into should normalize on `onChange` or via `z.preprocess`. Otherwise `१२३` → `NaN`.

### Step 7 — Handle backend error display (if your screen has mutations)

You typically do nothing — `useErrors.ts:43` global toast handles unhandled errors. For inline field errors, use the **precise** helper:

```tsx
import { resolveBackendErrorMessage } from '@rahat-ui/query/src/utils/i18n/backend-error';
catch (error: any) {
  const tForError = useTranslations(); // bare, for BACKEND.* lookup
  const msg = resolveBackendErrorMessage(tForError, error?.response?.data?.code, error?.response?.data?.params, ['AA_PROJECT'], error?.response?.data?.message || '');
  form.setError('amount', { message: msg });
}
```

### Step 8 — Verify

- [ ] `grep -rn '"[A-Z][a-z ]' sections/projects/aa-2/myFeature` shows no remaining hard-coded English.
- [ ] `ne.json` and `en.json` have same key set (quick check: `node -e "const j=require('./messages/en.json');const k=require('./messages/ne.json');console.log(Object.keys(j).sort().join()==Object.keys(k).sort().join())"` or check dev console for `[i18n] No translation for "…"` warnings).
- [ ] Toggle `EN ↔ NP` via `LanguageToggle` (`src/components/language-toggle.tsx:90`) and walk the screen: numbers → `०-९`, dates → Devanagari + Nepali month/weekday, phones → `+९७७`, dropdowns → translated.
- [ ] Charts/tooltips: y-axis numbers Devanagari when `ne`.
- [ ] Inputs: type `१२३` → submits as `123`.

---

## 5. Recipes — Copy-Paste for Common Cases

### Table with mixed static + dynamic + numbers + dates

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { useNumberFormat, useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/i18n/phone';

export function useMyColumns() {
  const t  = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum   = useNumberFormat();
  const formatLabel = useLabelDigits();
  const formatDate  = useDateFormat();
  const formatPhone = usePhoneFormat();

  return [
    { accessorKey: 'title',    header: t('TITLE'),    cell: ({row}) => translateValue(t, row.getValue('title'), { fallbackStyle: 'raw', silent: true }) },
    { accessorKey: 'status',   header: tg('STATUS'),  cell: ({row}) => translateValue(tg, row.getValue('status')) },
    { accessorKey: 'amount',   header: t('AMOUNT'),   cell: ({row}) => formatNum(row.getValue('amount')) },
    { accessorKey: 'range',    header: t('RANGE'),    cell: ({row}) => formatLabel(row.getValue('range')) }, // "20-30"
    { accessorKey: 'phone',    header: tg('PHONE'),   cell: ({row}) => formatPhone(row.getValue('phone')) },
    { accessorKey: 'createdAt',header: tg('CREATED_AT'), cell: ({row}) => formatDate(row.getValue('createdAt'), 'MMM d, yyyy, h:mm a') },
  ];
}
```

### Chart with translated labels + Devanagari axis

```tsx
const { formatNum, chartOptions } = useChartNumberOptions();
const formatLabel = useLabelDigits();
const genderData = raw.map(i => ({ label: translateValue(g, i.id, { fallbackStyle: 'raw' }), value: i.count }));
<DynamicPieChart pieData={genderData} options={chartOptions} /> // y-axis already Devanagari
<BarChart categories={ageGroups.map(i => formatLabel(i.label))} series={values} options={chartOptions} />
```

### Detail card with ICU + lead-time pattern

```tsx
// activities/details/activity.detail.cards.tsx:27 pattern — "1 Days" → "१ Days" + translated unit
const formatLeadTime = (value?: string) => {
  if (!value) return undefined;
  const m = value.match(/^(\d+)\s*(hours?|days?)$/i);
  if (!m) return value;
  const [, num, unit] = m;
  const unitKey = unit.toLowerCase().startsWith('hour') ? 'HOURS' : 'DAYS';
  return `${formatDigits(num)} ${t(unitKey)}`;
};
// ICU count
{t('BENEFICIARIES_ASSIGNED_UNDER_THIS_GROUP', { count: formatNum(count) })}
```

### Form with phone + digit normalization

```tsx
import { normalizeNumeralsPreprocessor } from 'apps/rahat-ui/src/utils/i18n/numeral';
import { usePhoneCountrySelectProps } from 'apps/rahat-ui/src/utils/i18n/phone';
const phoneProps = usePhoneCountrySelectProps();
const schema = z.object({
  phone: z.preprocess(normalizeNumeralsPreprocessor, z.string().refine(isValidPhoneNumber, { message: t('INVALID_PHONE') })),
  amount: z.preprocess(normalizeNumeralsPreprocessor, z.string().min(1, t('FIELD_IS_REQUIRED', { field: t('AMOUNT') }))),
});
<PhoneInput {...field} {...phoneProps} placeholder={t('ENTER_PHONE_NUMBER')} />
<Input {...field} onChange={e => field.onChange(toAsciiDigits(e.target.value))} placeholder={t('ENTER_AMOUNT')} />
```

---

## 6. Good vs Bad — 8 Pairs from the Real Codebase

| # | ✅ Good | ❌ Bad | Why |
|---|---|---|---|
| 1 | `t('SAVE')` for static `"Save"` button | `<button>Save</button>` | Hard-coded breaks `ne` |
| 2 | `translateValue(tg, row.status)` for dynamic enum | `t(row.status)` (throws if missing) or `row.status` raw | Direct `t(dynamic)` crashes on unknown key; raw loses translation |
| 3 | `translateValue(t, category, {fallbackStyle:'raw', silent:true})` for admin-authored | `translateValue(t, category)` (default `humanized` `"My Category" → "My Category"` hides missing key as humanized) | Free-text should stay raw; silent avoids spam |
| 4 | `formatNum(count)` for amount, `formatLabel("20-30")` for bucket | `formatNum("20-30")` → passthrough unchanged, not Devanagari; `useNumberFormat` on phone → strips `+` | Wrong util for shape |
| 5 | `formatDate(d, 'MMM d, yyyy, h:mm a')` | `dateFormate.ts:dateFormat(d,'MMM dd')` or `d.toLocaleString()` | Legacy formatter ignores locale, shows English month + ASCII digits in `ne` |
| 6 | `toAsciiDigits(e.target.value)` on `onChange` for numeric inputs | No normalization — `१२३` submits as `NaN`, Zod fails | Bidirectional digit requirement |
| 7 | `t('PAGE_CURRENT_OF_TOTAL', {current:formatNum(c), total:formatNum(t)})` | `` `Page ${c} of ${t}` `` concatenation | Breaks Nepali word order (SOV vs SVO); ICU placeholder is required |
| 8 | `countByBankStats` bank names raw (proper nouns) with comment | Translating proper nouns like `"Global IME Bank"` via `translateValue` with humanized fallback | Proper nouns must stay raw — but document intent (`// proper noun, intentional raw`) |

---

## 7. ICU Interpolation — Don't Concatenate

222 keys use `{placeholder}`. Always pass **formatted** values into ICU, never raw numbers:

```tsx
// ✅ correct — digits already Devanagari inside interpolation
t('SOURCES_HEALTHY_RATIO', { count: formatNum(calcHEALTHY), total: formatNum(sources.length) })
// en: "3/10 sources healthy"  ne: "३/१० sources healthy" (placeholder positions preserved)

// ❌ wrong — concatenation breaks word order and loses Devanagari
count + "/" + total + " sources healthy"
t('SOURCES_HEALTHY_RATIO', { count: String(count) }) // loses Devanagari
```

Only two keys use `{count, plural, one {…} other {…}}` (`GROUP_CONFLICT_DESCRIPTION`, `STAKEHOLDER_CONFLICT_DESCRIPTION`) — their `ne` translations intentionally drop the plural branch (Nepali doesn't inflect the same way). Do not transliterate the ICU syntax (`{count, plural, …}`) when editing `ne.json`.

---

## 8. Before You Open a PR — Checklist

- [ ] Keys added to **both** `messages/en.json` and `messages/ne.json` (0 drift; check with `warnedKeys` console or quick `Object.keys` diff).
- [ ] Placeholder names (`{varName}`) identical in `en` and `ne` — never transliterate var names (`{total}` stays `{total}`, not `{कुल}`).
- [ ] `useTranslations('GLOBAL')` for shared keys (`PENDING`, `N_A`, `SAVE`, `STATUS`, `PHONE`, `PAGINATION:*`); `AA_PROJECT` for AA workflow.
- [ ] Static text → `t()`, dynamic/API value → `translateValue()`, numbers → `useNumberFormat()`, mixed labels → `useLabelDigits()`, phones → `usePhoneFormat()`, dates → `useDateFormat()`.
- [ ] Numeric inputs normalize Devanagari → ASCII (`toAsciiDigits` or `z.preprocess(normalizeNumeralsPreprocessor,…)`).
- [ ] `<PhoneInput>` spreads `...usePhoneCountrySelectProps()`.
- [ ] No hard-coded English in JSX (`grep -n '>[A-Za-z ]\+<'`) nor unguarded `t(dynamicValue)`.
- [ ] Toggled `EN ↔ NP` manually: digits `०-९`, dates with Nepali months/weekdays, phones `+९७७`, charts/tooltips numeric axis Devanagari, no raw English bleed-through.
- [ ] For backend errors: let `useError()` handle global toasts; use `resolveBackendErrorMessage(t, code, params, ['AA_PROJECT'], raw)` only for inline/field-specific errors. No raw `error.response.data.message` shown directly.
- [ ] For new `BACKEND.<GROUP>.<CODE>` errors, add to `BACKEND` tree and to `messages/backend-text-inventory.csv` (run `node messages/restructure-csv.mjs` to resort).

---

## 9. Pitfalls & FAQ

**Q: Why not just use `t.has(key) ? t(key) : fallback` directly?**
A: You can, but `translateValue` does the normalization, key collision handling, deduped dev warnings (`warnedKeys` Set prevents 500 warnings for a 500-row table), and `fallbackStyle` consistently. The legacy ternary existed ~30 times with inconsistent regex — migrating to one util eliminated that drift. See `translateValue.ts:41` doc.

**Q: Why three digit hooks instead of one `formatNumber(value)`?**
A: `Intl.NumberFormat` only accepts numbers. `useLabelDigits`/`usePhoneFormat` handle strings with non-digit characters (`"20-30"`, `"+977…"`) that `Intl` cannot parse. Phones additionally must never be grouped. Splitting by intent prevents `formatNum(phone)` stripping `+` and makes call sites self-documenting. See `number.ts:44`, `phone.ts:11`.

**Q: `useLabelDigits` vs `useNumberFormat` for `formatDigits(ward_no)` — which?**
A: If the value is embedded in text or the type is `string` that may contain non-numeric chars → `useLabelDigits`. If it's a pure numeric count/amount → `useNumberFormat` (grouping). When in doubt check the source: `ward_no` is a digit inside a localized sentence `"{formatDigits(ward_no)}"` — use `formatDigits` (label).

**Q: Is `t.has()` expensive?**
A: No — synchronous object-property check on the already-loaded message object (`src/utils/i18n/translateValue.ts:41` uses it internally). The guard exists specifically to avoid `next-intl`'s noisy missing-key rendering.

**Q: Why `window.location.reload()` instead of `router.refresh()` in `language-toggle.tsx:99`?**
A: `router.refresh()` only re-fetches RSC payload; some mounted client subtrees stay on the old locale. Reload re-runs `middleware.ts → request.ts → layout.tsx` consistently (`language-toggle.tsx:100` comment).

**Q: My value is an enum but also looks like a proper noun (bank name) — translate?**
A: Proper nouns (bank names, district/municipality names, user-created group names) are intentionally raw. Chart example `dashboard/charts.container.tsx:137` renders `countByBankStats` bank names raw — correct. Use `translateValue(..., {fallbackStyle:'raw', silent:true})` if you want the dev warning gated.

**Q: Can I use `humanizeString` / `formatUnderScoredString` / `dateFormate.ts:dateFormat` instead?**
A: No. `humanizeString`/`formatUnderScoredString` (`utils/string.ts:3`) title-cases without translation and hides missing keys. `dateFormate.ts` is English-only legacy (18 uses, all `aidlink` vertical). New AA code must use `translateValue` + `useNumberFormat` / `useDateFormat`.

**Q: What about `getColumnLabel` (`utils/getColumnLabel.ts:1`)?**
A: Prefer already-translated `columnDef.header` (a `t('KEY')` string) over `column.id` for "Toggle Columns" menus. It complements `translateValue`'s `fallback: column.id` path — header already translated, fallback is raw id.

**Q: Where do `BACKEND` error codes come from?**
A: Backend NestJS services return `{ code, params, message }`. `resolveBackendErrorMessage` maps `code` → `BACKEND.<GROUP>.<CODE>`; if no `code`, it slugifies `message` (`toMessageSlug` `backend-error.ts:30`) or parses `[CODE] prefix` (`resolveBackendErrorMessageByPrefix` `backend-error.ts:81`). Add missing codes to `messages/en.json` → `BACKEND.<GROUP>` and run `restructure-csv.mjs`.

**Q: How do I not re-introduce hard-coded strings later?**
A: No ESLint rule currently enforces this (process/review only). Propose `eslint-plugin-i18n` forbidding string literals in `sections/projects/aa-2/**` JSX as follow-up.

---

## 10. File Map — Where Everything Lives

| Concern | Path | Key line |
|---|---|---|
| Locale list | `src/i18n/config.ts` | `config.ts:1` |
| Routing (cookie, never) | `src/i18n/routing.ts` | `routing.ts:7` |
| Server locale + messages | `src/i18n/request.ts` | `request.ts:19` |
| Edge middleware + `Accept-Language` | `src/middleware.ts` | `middleware.ts:19,43,57` |
| Root layout + provider + bridge | `src/app/layout.tsx` | `layout.tsx:29,45` |
| Bridge to `libs/community-query` | `src/providers/translation-bridge.tsx` | `translation-bridge.tsx:6` |
| `libs/community-query` singleton | `libs/community-query/src/translate.ts` | `translate.ts:1` |
| English / Nepali catalogs | `messages/en.json`, `messages/ne.json` | ~4,215 keys each |
| Backend inventory CSV | `messages/backend-text-inventory.csv` | 241 rows |
| Language toggle | `src/components/language-toggle.tsx` | `language-toggle.tsx:96` |
| **Dynamic value → translation** | `src/utils/i18n/translateValue.ts` | `translateValue.ts:42` |
| **Numbers (counts/amounts)** | `src/utils/i18n/number.ts` | `number.ts:5,34` |
| **Labels with digits** | `src/utils/i18n/number.ts` | `number.ts:52` |
| **Phones** | `src/utils/i18n/phone.ts` | `phone.ts:11,28` |
| **Input normalization (Devanagari→ASCII)** | `src/utils/i18n/numeral.ts` | `numeral.ts:30,44,59` |
| **Dates + CLDR patch** | `src/utils/i18n/date.ts` | `date.ts:256,227` |
| **Global error toast** | `src/utils/i18n/useErrors.ts` | `useErrors.ts:43` |
| **Per-mutation error helpers** | `libs/query/src/utils/i18n/backend-error.ts` | `backend-error.ts:45,81,105` |
| **Column label helper** | `src/utils/getColumnLabel.ts` | `getColumnLabel.ts:1` |
| Existing deep references | `TRANSLATION-IMPLEMENTATION-GUIDE.md`, `BACKEND-DYNAMIC-MESSAGES.md`, `BACKEND-VALUE-TRANSLATION-REVERT.md`, `TRANSLATION-USAGE-AUDIT.md` | `apps/rahat-ui/` |

---

## 11. Minimal Template — Copy This to Start a New File

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { useNumberFormat, useLabelDigits } from 'apps/rahat-ui/src/utils/i18n/number';
import { useDateFormat } from 'apps/rahat-ui/src/utils/i18n/date';
import { usePhoneFormat } from 'apps/rahat-ui/src/utils/i18n/phone';
import { translateValue } from 'apps/rahat-ui/src/utils/i18n/translateValue';
import { toAsciiDigits } from 'apps/rahat-ui/src/utils/i18n/numeral';

export function MyFeatureCard({ row }: { row: any }) {
  const t  = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const formatNum    = useNumberFormat();   // pure numbers
  const formatDigits = useLabelDigits();    // "20-30", "Ward 5"
  const formatDate   = useDateFormat();     // pattern-keyed
  const formatPhone  = usePhoneFormat();    // phones

  // Category C — closed enum
  const status = translateValue(tg, row.status);
  // Category B — open / admin-authored
  const category = translateValue(t, row.category, { fallbackStyle: 'raw', silent: true });

  return (
    <>
      <h1>{t('MY_FEATURE_TITLE')}</h1>
      <p>{t('SOURCES_HEALTHY_RATIO', { count: formatNum(3), total: formatNum(10) })}</p>
      <span>{status}</span>
      <span>{category}</span>
      <span>{formatPhone(row.phone)}</span>
      <span>{formatDate(row.createdAt, 'MMM d, yyyy, h:mm a')}</span>
      <span>{formatNum(row.amount)}</span>
      <span>{formatDigits(row.rangeLabel)}</span>
      <input onChange={e => field.onChange(toAsciiDigits(e.target.value))} />
    </>
  );
}
```

---

*Last verified: 2026-09-14 · Branch: `develop` · Messages parity: 4,215 ↔ 4,215.*
*If you change `src/i18n/routing.ts`, also align `next-intl.config.ts` or delete it.*
