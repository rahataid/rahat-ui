/**
 * Nepali (Devanagari) digit -> ASCII digit map.
 *
 * The app's Nepali locale lets users type Devanagari numerals (०-९) into any
 * form field, but numeric-intent fields (phone, amount, age, ...) and the
 * backend both assume ASCII digits (0-9). This normalizes Devanagari digits
 * to ASCII before validation/submission so that assumption still holds.
 */
const DEVANAGARI_TO_ASCII_DIGIT: Record<string, string> = {
  '०': '0',
  '१': '1',
  '२': '2',
  '३': '3',
  '४': '4',
  '५': '5',
  '६': '6',
  '७': '7',
  '८': '8',
  '९': '9',
};

const DEVANAGARI_DIGIT_PATTERN = /[०-९]/g;

/**
 * Converts any Devanagari digits in a string to their ASCII equivalents.
 * Non-digit characters (including Devanagari script letters) pass through
 * unchanged, so it's safe to run on mixed content like "name १२३" or an
 * email address that happens to contain no Devanagari digits at all.
 */
export function toAsciiDigits(value: string): string {
  return value.replace(
    DEVANAGARI_DIGIT_PATTERN,
    (digit) => DEVANAGARI_TO_ASCII_DIGIT[digit] ?? digit,
  );
}

/**
 * Zod `preprocess` step that normalizes Devanagari digits to ASCII before
 * the wrapped schema validates. Non-string input is passed through
 * untouched so it composes safely with any schema shape.
 *
 * Usage: `z.preprocess(normalizeNumeralsPreprocessor, z.string()...)`
 */
export function normalizeNumeralsPreprocessor(value: unknown): unknown {
  return typeof value === 'string' ? toAsciiDigits(value.trim()) : value;
}

/**
 * Zod `preprocess` step for number-typed schemas (`z.number()`,
 * `z.coerce.number()`). Converts a Devanagari-digit string to ASCII and
 * leaves it as a string so the wrapped `z.coerce.number()` still does the
 * actual string-to-number coercion; a plain `z.number()` also accepts the
 * resulting numeric string via JS's implicit coercion in `Number()`-based
 * refinements. Non-string input (already a number, `undefined`, etc.)
 * passes through untouched.
 *
 * Usage: `z.preprocess(normalizeNumeralsToNumberPreprocessor, z.coerce.number()...)`
 */
export function normalizeNumeralsToNumberPreprocessor(
  value: unknown,
): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (trimmed === '') return value;
  return toAsciiDigits(trimmed);
}
