import { localizeNepaliParts } from 'apps/rahat-ui/src/utils/useDateFormat';

export function formatDate(dateStr?: string, locale = 'en') {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    const neOptions =
      locale === 'ne' ? { ...options, numberingSystem: 'deva' } : options;
    const formatter = new Intl.DateTimeFormat(
      locale === 'ne' ? 'ne-NP' : locale,
      neOptions,
    );
    if (locale === 'ne') {
      return localizeNepaliParts(d, neOptions, formatter.formatToParts(d));
    }
    return formatter.format(d);
  } catch {
    return dateStr;
  }
}
