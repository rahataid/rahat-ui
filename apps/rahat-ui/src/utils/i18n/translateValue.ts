type Translator = {
  (key: any, values?: any): string;
  has: (key: any) => boolean;
};

// Dedupes the dev-mode missing-key warning below so a table with hundreds
// of rows sharing one untranslated value doesn't spam one warning per row.
const warnedKeys = new Set<string>();

/** "no phone" | "no-phone" | "NO_PHONE" -> "NO_PHONE" */
function toKey(raw: string): string {
  return raw.toUpperCase().replace(/[\s-]+/g, '_');
}

/** "SATELLITE_PHONE" -> "Satellite Phone" */
function toLabel(raw: string): string {
  return raw
    .replace(/[_-]+/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface TranslateValueOptions {
  /** Override for values whose derived key collides with an unrelated message, e.g. `{ Payout: 'PAYOUT2' }`. */
  keyMap?: Record<string, string>;
  /** Used only when `fallback` isn't given. 'humanized' (default) for closed enums; 'raw' for free-text/admin-authored values where an unmapped value is expected, not a bug. */
  fallbackStyle?: 'humanized' | 'raw';
  /**
   * Explicit string to show whenever there's nothing better: empty input,
   * or a value with no matching translation. Covers call sites where the
   * lookup key and the desired fallback text are different strings, e.g.
   * `t.has(key) ? t(key) : column.id` -> `translateValue(t, key, { fallback: column.id })`.
   * Omit to fall back to the humanized/raw form of `value` itself instead.
   */
  fallback?: string;
  /** Suppress the dev-mode missing-key warning, for values expected to often be unmapped. */
  silent?: boolean;
}

/** Central replacement for the repeated `t.has(key) ? t(key) : fallback` pattern. */
export function translateValue(
  t: Translator,
  value: unknown,
  options: TranslateValueOptions = {},
): string {
  const { keyMap, fallbackStyle = 'humanized', fallback, silent = false } = options;

  if (value === null || value === undefined) return fallback ?? '';

  const raw = String(value).trim();
  if (!raw) return fallback ?? '';

  const key = keyMap?.[raw] ?? toKey(raw);
  if (t.has(key)) return t(key);

  if (!silent && process.env.NODE_ENV !== 'production' && !warnedKeys.has(key)) {
    warnedKeys.add(key);
    console.warn(
      `[i18n] No translation for "${key}" — rendering "${fallback ?? (fallbackStyle === 'raw' ? raw : toLabel(raw))
      }". Add it to messages/en.json and messages/ne.json.`,
    );
  }

  if (fallback !== undefined) return fallback;
  return fallbackStyle === 'raw' ? raw : toLabel(raw);
}
