import { localizeNepaliParts } from 'apps/rahat-ui/src/utils/i18n/date';

export const EMPTY_LOGS: any[] = [];

export const CHART_DATE_PATTERN_MAP: Record<string, Intl.DateTimeFormatOptions> = {
  'hh:mm:ss a': { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true },
  'hh:mm a': { hour: '2-digit', minute: '2-digit', hour12: true },
  'h:mm a': { hour: 'numeric', minute: '2-digit', hour12: true },
  'MMM d, hh:mm:ss a': { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true },
  'MMM d, hh:mm a': { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true },
  'MMM d, yyyy': { month: 'short', day: 'numeric', year: 'numeric' },
  'MMM dd, yyyy, hh:mm:ss a': { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true },
  'MMM dd, yyyy, hh:mm a': { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true },
  'MMM dd, yyyy': { month: 'short', day: '2-digit', year: 'numeric' },
  // Matches intlFormatDate (the Transactions tab's timestamp column) exactly.
  PPp: { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true },
};

export const formatChartDate = (
  value: string | number,
  pattern: string,
  locale: string,
) => {
  const options =
    CHART_DATE_PATTERN_MAP[pattern] ?? CHART_DATE_PATTERN_MAP['h:mm a'];
  const neOptions =
    locale === 'ne' ? { ...options, numberingSystem: 'deva' as const } : options;
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  const formatter = new Intl.DateTimeFormat(
    locale === 'ne' ? 'ne-NP' : locale,
    neOptions,
  );
  if (locale === 'ne' && options.month) {
    return localizeNepaliParts(d, options, formatter.formatToParts(d));
  }
  return formatter.format(d);
};

/**
 * Robust epoch-ms parser that supports:
 * - numeric epoch (milliseconds or seconds)
 * - Date objects
 * - ISO-8601 strings
 * - SQL format strings ("YYYY-MM-DD HH:mm:ss") with Safari compatibility
 */
export const toEpochMs = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value <= 0) return null;
    return value < 1e12 ? value * 1000 : value;
  }
  if (value instanceof Date) {
    const t = value.getTime();
    return Number.isFinite(t) ? t : null;
  }
  const str = String(value).trim();
  if (!str) return null;

  // Handle SQL timestamps "YYYY-MM-DD HH:mm:ss" for Safari WebKit
  const normalizedStr = str.replace(
    /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})/,
    '$1T$2',
  );
  let parsed = new Date(normalizedStr).getTime();
  if (Number.isFinite(parsed) && parsed > 0) return parsed;

  parsed = new Date(str).getTime();
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const parseNumeric = (value: unknown): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const n =
    typeof value === 'number' ? value : Number(String(value).replace(/[,\s]/g, ''));
  return Number.isFinite(n) ? n : null;
};

export const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const endOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
};

export const isSameLocalDay = (a: number, b: number) => {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
};

export const formatDuration = (startMs: number, endMs: number): string => {
  if (!startMs || !endMs || endMs <= startMs) return '< 1s';
  const totalSeconds = Math.floor((endMs - startMs) / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes < 60) {
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};
