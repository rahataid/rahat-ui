type TFunction = (key: string) => string;

const defaultT: TFunction = (key) => {
  const fallback: Record<string, string> = {
    DURATION_DAY: 'day',
    DURATION_DAYS: 'days',
    DURATION_HR: 'hr',
    DURATION_HRS: 'hrs',
    DURATION_MIN: 'min',
    DURATION_MINS: 'mins',
    DURATION_ZERO_MIN: '0 min',
  };
  return fallback[key] || key;
};

export function formatDurationFromMinutes(
  minutes: number,
  t: TFunction = defaultT,
  formatNum: (value: number) => string = String,
): string {
  if (!minutes || minutes <= 0) return '—';

  const MINUTES_IN_HOUR = 60;
  const MINUTES_IN_DAY = 60 * 24;

  const days = Math.floor(minutes / MINUTES_IN_DAY);
  const hours = Math.floor((minutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR);
  const remainingMinutes = minutes % MINUTES_IN_HOUR;

  const parts: string[] = [];

  if (days > 0)
    parts.push(`${formatNum(days)} ${t(days > 1 ? 'DURATION_DAYS' : 'DURATION_DAY')}`);
  if (hours > 0)
    parts.push(`${formatNum(hours)} ${t(hours > 1 ? 'DURATION_HRS' : 'DURATION_HR')}`);
  if (remainingMinutes > 0 && days === 0)
    parts.push(
      `${formatNum(remainingMinutes)} ${t(remainingMinutes > 1 ? 'DURATION_MINS' : 'DURATION_MIN')}`,
    );

  return parts.join(' ') || t('DURATION_ZERO_MIN');
}
