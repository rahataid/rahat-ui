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
    let num: number;
    if (typeof value === 'number') {
      num = value;
    } else if (typeof value === 'bigint') {
      return formatter.number(value, locale === 'ne' ? { numberingSystem: 'deva' } : {});
    } else if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)) {
      num = Number(value);
    } else {
      return String(value);
    }
    if (locale === 'ne') {
      return formatter.number(num, { numberingSystem: 'deva' });
    }
    return formatter.number(num);
  };

  return format;
}

/** ApexCharts axis/tooltip formatters wired to the locale-aware number formatter — the repeated `chartOpts` block. */
export function useChartNumberOptions() {
  const formatNum = useNumberFormat();
  const chartOptions = {
    xaxis: { labels: { formatter: (val: string) => formatNum(val) } },
    yaxis: { labels: { formatter: (val: number) => formatNum(val) } },
    tooltip: { y: { formatter: (val: number) => formatNum(val) } },
  };
  return { formatNum, chartOptions };
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

  return (label: string | number | null | undefined): string => {
    if (label === null || label === undefined || label === '') return '';
    const text = String(label);
    if (locale !== 'ne') return text;
    return text.replace(/[0-9]/g, (digit) => DEVANAGARI_DIGITS[Number(digit)]);
  };
}
