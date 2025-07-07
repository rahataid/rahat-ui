import { formatDate } from 'date-fns';

export const dateFormat = (
  date: Date | string,
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
