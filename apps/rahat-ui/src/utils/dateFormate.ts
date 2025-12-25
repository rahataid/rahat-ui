import {
  differenceInHours,
  format,
  formatDate,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  isYesterday,
  parseISO,
} from 'date-fns';

export const dateFormat = (
  date: Date | string | undefined | null,
  formatStr = 'MMMM d, yyyy, h:mm:ss a',
): string => {
  if (!date) return '';
  try {
    return formatDate(new Date(date), formatStr);
  } catch (error) {
    console.error('Invalid date in dateFormat:', date);
    return '';
  }
};

export const convertToLocalTimeOrMillisecond = (
  date: Date | string | undefined | null,
  formatStr = 'MMMM d, yyyy, h:mm:ss',
): { formatted: string; timestamp: number } | '' => {
  if (!date) return '';
  try {
    const parsedDate = new Date(date);
    const parsedDateOffset = parsedDate.getTimezoneOffset();

    parsedDate.setMinutes(parsedDate.getMinutes() + parsedDateOffset);

    const formatted = format(parsedDate, formatStr);
    const timestamp = parsedDate.getTime();
    return { formatted, timestamp };
  } catch (error) {
    console.error('Invalid date in convertToLocalTimeOrMillisecond:', date);
    return '';
  }
};

export const formatTimestamp = (createdAt: string): string => {
  try {
    const date = parseISO(createdAt);
    const now = new Date();

    if (isYesterday(date)) {
      return format(date, 'MMMM d, yyyy, h:mm:ss a');
    }

    const hoursDifference = differenceInHours(now, date);
    if (hoursDifference < 24) {
      return formatDistanceToNowStrict(date, { addSuffix: true });
    }

    return format(date, 'MMMM d, yyyy, h:mm:ss a');
  } catch (error) {
    return createdAt;
  }
};

export const formatDateFull = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formats milliseconds into a human-readable duration string
 * @param milliseconds - Duration in milliseconds
 * @returns Formatted duration string (e.g., "2 hours 5 minutes", "45 seconds", "1 day 3 hours")
 */
export const formatDuration = (milliseconds: number): string => {
  if (!milliseconds || milliseconds < 0) return '0 seconds';

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }
  if (hours % 24 > 0) {
    parts.push(`${hours % 24} ${hours % 24 === 1 ? 'hour' : 'hours'}`);
  }
  if (minutes % 60 > 0) {
    parts.push(`${minutes % 60} ${minutes % 60 === 1 ? 'minute' : 'minutes'}`);
  }
  if (seconds % 60 > 0 && days === 0) {
    parts.push(`${seconds % 60} ${seconds % 60 === 1 ? 'second' : 'seconds'}`);
  }

  // If no parts were added (duration < 1 second), show 0 seconds
  if (parts.length === 0) {
    return '0 seconds';
  }

  return parts.join(' ');
};
