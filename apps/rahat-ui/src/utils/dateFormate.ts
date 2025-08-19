import { differenceInHours, format, formatDate, formatDistanceToNow, isYesterday, parseISO } from 'date-fns';

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

export const formatTimestamp = (createdAt: string): string => {
  try {
    const date = parseISO(createdAt);

    // Check if the date is yesterday
    if (isYesterday(date)) {
      return format(date, 'MMMM d, yyyy, h:mm:ss a'); 
    }

    
    const hoursDifference = differenceInHours(new Date(), date);
    if (hoursDifference < 24) {
      return formatDistanceToNow(date, { addSuffix: true }); 
    }

   
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return createdAt;
  }
}

