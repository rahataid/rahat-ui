'use client';

import { useFormatter, useLocale } from 'next-intl';

export function useNumberFormat() {
  const formatter = useFormatter();
  const locale = useLocale();

  const format = (value: unknown): string => {
    if (value === null || value === undefined || value === '') return '';
    // Chart libraries sometimes pass category labels (e.g. bank names)
    // through the same numeric-axis formatter as actual values — guard
    // against that instead of letting Intl.NumberFormat produce "NaN".
    if (typeof value !== 'number' && typeof value !== 'bigint') {
      return String(value);
    }
    if (locale === 'ne') {
      return formatter.number(value, { numberingSystem: 'deva' });
    }
    return formatter.number(value);
  };

  return format;
}

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

/**
 * Transliterates ASCII digits inside a label string (e.g. backend category
 * labels like "20-30" or "<20") to Devanagari numerals for the Nepali locale.
 * Unlike useNumberFormat, this works on strings that mix digits with other
 * characters, since Intl.NumberFormat only accepts numeric values.
 */
export function useLabelDigits() {
  const locale = useLocale();

  return (label: string | null | undefined): string => {
    if (!label) return '';
    if (locale !== 'ne') return label;
    return label.replace(/[0-9]/g, (digit) => DEVANAGARI_DIGITS[Number(digit)]);
  };
}
