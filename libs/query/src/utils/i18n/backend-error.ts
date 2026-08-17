import { useTranslations } from 'next-intl';

// Some backend error templates interpolate a raw schema/DB field name, e.g.
// "A group with this {field} already exists" + params: { field: 'name' } —
// the English sentence reads fine with the raw identifier, but the Nepali
// template ("यो {field} भएको...") ends up with a stray English word glued
// into an otherwise-Nepali sentence. Translate just that one param (via the
// shared GLOBAL field-name keys, e.g. NAME/EMAIL/PHONE) before interpolating,
// leaving every other param untouched since those are usually real values
// (amounts, bank names) that shouldn't be translated.
function translateFieldParam(
  t: ReturnType<typeof useTranslations>,
  params: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!params || typeof params['field'] !== 'string') return params;
  const slug = params['field']
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const key = `GLOBAL.${slug}`;
  if (!t.has(key as never)) return params;
  return { ...params, field: t(key as never) };
}

// Resolves a backend error `code` (or, for third-party packages that only
// send a stable `name` field, e.g. @rumsan/user's RSError) against one or
// more BACKEND.<GROUP> catalog namespaces (checked in order), falling back
// to the raw English message when nothing matches in any namespace.
export const resolveBackendErrorMessage = (
  t: ReturnType<typeof useTranslations>,
  identifier: string | undefined,
  params: Record<string, unknown> | undefined,
  groups: string[],
  rawMessage: string,
): string => {
  if (!identifier) return rawMessage;
  for (const group of groups) {
    const key = `BACKEND.${group}.${identifier}`;
    if (t.has(key as never)) {
      return t(key as never, translateFieldParam(t, params) as never);
    }
  }
  return rawMessage;
};

// For services whose exception filter drops `code`/`params` before the
// response reaches the frontend (confirmed for apps/beneficiary, whose
// registered @rumsan/extensions filter rebuilds RpcException from `.message`
// alone), the backend instead prefixes the message itself with the code,
// e.g. `"[PHONE_NUMBER_SHOULD_BE_UNIQUE] Phone number should be unique"` —
// `.message` is the one field that filter doesn't discard. This parses that
// prefix back out and resolves it the same way as `resolveBackendErrorMessage`,
// stripping the prefix from the fallback text either way so raw English
// never shows a leftover `[CODE]` tag. Generic and group-scoped by parameter
// — add a service's own prefix convention at its own throw sites, not a new
// function here, if this pattern is needed elsewhere later.
export const resolveBackendErrorMessageByPrefix = (
  t: ReturnType<typeof useTranslations>,
  group: string,
  rawMessage: string,
  params?: Record<string, unknown>,
): string => {
  const match = /^\[([A-Z0-9_]+)\]\s*(.*)$/s.exec(rawMessage);
  if (!match) return rawMessage;
  const [, code, textWithoutPrefix] = match;
  const key = `BACKEND.${group}.${code}`;
  if (t.has(key as never)) {
    return t(key as never, translateFieldParam(t, params) as never);
  }
  return textWithoutPrefix || rawMessage;
};

// Some endpoints (e.g. `POST /beneficiaries`, `/beneficiaries/groups`,
// `/beneficiaries/upload`) are served by a mix of apps/rahat (preserves a
// real `code` field) and apps/beneficiary (whose filter strips `code`, so
// the backend prefixes the message itself with `[CODE]` instead). The
// frontend can't know in advance which one handled a given request, so try
// the `code` field first, then fall back to parsing the `[CODE]` prefix —
// and even without a match, strip a leaked prefix so raw English never
// shows a bracket tag.
export const resolveBeneficiaryErrorMessage = (
  t: ReturnType<typeof useTranslations>,
  code: string | undefined,
  params: Record<string, unknown> | undefined,
  groups: string[],
  rawMessage: string,
): string => {
  const byCode = resolveBackendErrorMessage(t, code, params, groups, rawMessage);
  if (byCode !== rawMessage) return byCode;
  for (const group of groups) {
    const byPrefix = resolveBackendErrorMessageByPrefix(t, group, rawMessage, params);
    if (byPrefix !== rawMessage) return byPrefix;
  }
  const match = /^\[([A-Z0-9_]+)\]\s*(.*)$/s.exec(rawMessage);
  return match ? match[2] || rawMessage : rawMessage;
};
