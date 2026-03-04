export function formatDurationFromMinutes(minutes: number): string {
  if (!minutes || minutes <= 0) return '—';

  const MINUTES_IN_HOUR = 60;
  const MINUTES_IN_DAY = 60 * 24;

  const days = Math.floor(minutes / MINUTES_IN_DAY);
  const hours = Math.floor((minutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR);
  const remainingMinutes = minutes % MINUTES_IN_HOUR;

  const parts: string[] = [];

  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
  if (remainingMinutes > 0 && days === 0)
    parts.push(`${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`);

  return parts.join(' ') || '0 min';
}
