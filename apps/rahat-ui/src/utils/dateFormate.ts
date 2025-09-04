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
    const parsedDate = new Date(date);
    const pasedDateOffset = parsedDate.getTimezoneOffset();

    parsedDate.setMinutes(parsedDate.getMinutes() + pasedDateOffset);

    return format(parsedDate, formatStr);
  } catch (error) {
    console.error('Invalid date in dateFormat:', date);
    return '';
  }
};

export const formatTimestamp = (createdAt: string): string => {
  try {
    const date = parseISO(createdAt);
    const now = new Date();

    if (isYesterday(date)) {
      return format(date, 'MMMM d, yyyy, h:mm:ss');
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
