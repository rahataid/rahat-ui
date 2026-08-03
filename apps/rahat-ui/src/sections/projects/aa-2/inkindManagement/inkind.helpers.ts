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
    return new Intl.DateTimeFormat(
      locale === 'ne' ? 'ne-NP' : locale,
      neOptions,
    ).format(d);
  } catch {
    return dateStr;
  }
}
