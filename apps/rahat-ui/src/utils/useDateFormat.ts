'use client';

import { useLocale } from 'next-intl';

type DateFormatPattern =
  | 'MMMM d, yyyy, h:mm:ss a'
  | 'dd MMMM, yyyy'
  | 'hh:mm:ss a'
  | 'MMMM dd, yyyy, hh:mm:ss a'
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
      return new Intl.DateTimeFormat(
        locale === 'ne' ? 'ne-NP' : locale,
        neOptions,
      ).format(d);
    } catch {
      return '';
    }
  };

  return formatDate;
}
