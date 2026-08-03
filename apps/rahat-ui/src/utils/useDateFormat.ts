'use client';

import { useLocale } from 'next-intl';

type DateFormatPattern =
  | 'MMMM d, yyyy, h:mm:ss a'
  | 'dd MMMM, yyyy'
  | 'hh:mm:ss a'
  | 'MMMM dd, yyyy, hh:mm:ss a'
  | 'eee, MMMM d, yyyy, h:mm:ss'
  | 'eee, MMM d yyyy, hh:mm:ss a'
  | 'eee, MMMM d, yyyy'
  | 'MMM dd'
  | 'MMMM d, yyyy, h:mm:ss'
  | 'hh:mm a'
  | 'MMMM dd, yyyy'
  | 'MMM d, yyyy, h:mm a'
  | 'MMM dd, yyyy, hh:mm a'
  | 'MMMM dd, yyyy HH:mm'
  | 'PPP'
  | 'dd MMM yyyy, HH:mm'
  | 'dd MMM yyyy, HH:mm:ss'
  | string;

const PATTERN_MAP: Record<string, Intl.DateTimeFormatOptions> = {
  'MMMM d, yyyy, h:mm:ss a': {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  },
  'dd MMMM, yyyy': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  },
  'hh:mm:ss a': {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  },
  'MMMM dd, yyyy, hh:mm:ss a': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  },
  'eee, MMMM d, yyyy, h:mm:ss': {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  },
  'eee, MMM d yyyy, hh:mm:ss a': {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  },
  'eee, MMMM d, yyyy': {
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  'MMM dd': {
    month: 'short',
    day: '2-digit',
  },
  'MMMM d, yyyy, h:mm:ss': {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  },
  'hh:mm a': {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  },
  'MMMM dd, yyyy': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  },
  'MMM d, yyyy, h:mm a': {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  },
  'MMM dd, yyyy, hh:mm a': {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  },
  'MMMM dd, yyyy HH:mm': {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  PPP: {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  'dd MMM yyyy, HH:mm': {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  },
  'dd MMM yyyy, HH:mm:ss': {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  },
};

export const NEPALI_WEEKDAYS_SHORT = [
  'आइत', 'सोम', 'मङ्गल', 'बुध', 'बिहि', 'शुक्र', 'शनि',
];
export const NEPALI_WEEKDAYS_LONG = [
  'आइतबार', 'सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार',
];
export const NEPALI_MONTHS_SHORT = [
  'जन', 'फेब्रु', 'मार्च', 'अप्रि', 'मे', 'जुन',
  'जुला', 'अग', 'सेप्ट', 'अक्टो', 'नोभे', 'डिसे',
];
export const NEPALI_MONTHS_LONG = [
  'जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन',
  'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर',
];

// Some browsers ship incomplete CLDR data for 'ne' weekday/month names and
// silently fall back to English even though numberingSystem: 'deva' still
// localizes the digits. Substitute those two parts ourselves so the output
// is consistently Nepali regardless of the runtime's ICU data completeness.
export function localizeNepaliParts(
  d: Date,
  options: Intl.DateTimeFormatOptions,
  parts: Intl.DateTimeFormatPart[],
): string {
  return parts
    .map((part) => {
      if (part.type === 'weekday') {
        return options.weekday === 'long'
          ? NEPALI_WEEKDAYS_LONG[d.getDay()]
          : NEPALI_WEEKDAYS_SHORT[d.getDay()];
      }
      if (
        part.type === 'month' &&
        options.month !== 'numeric' &&
        options.month !== '2-digit'
      ) {
        return options.month === 'long'
          ? NEPALI_MONTHS_LONG[d.getMonth()]
          : NEPALI_MONTHS_SHORT[d.getMonth()];
      }
      return part.value;
    })
    .join('');
}

export function useDateFormat() {
  const locale = useLocale();

  const formatDate = (
    date: Date | string | number | undefined | null,
    pattern: DateFormatPattern = 'MMMM d, yyyy, h:mm:ss a',
  ): string => {
    if (!date) return '';
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '';
      const options = PATTERN_MAP[pattern] || PATTERN_MAP['MMMM d, yyyy, h:mm:ss a'];
      const neOptions = locale === 'ne' ? { ...options, numberingSystem: 'deva' } : options;
      const formatter = new Intl.DateTimeFormat(
        locale === 'ne' ? 'ne-NP' : locale,
        neOptions,
      );
      if (locale === 'ne' && (options.weekday || options.month)) {
        return localizeNepaliParts(d, options, formatter.formatToParts(d));
      }
      return formatter.format(d);
    } catch {
      return '';
    }
  };

  return formatDate;
}
