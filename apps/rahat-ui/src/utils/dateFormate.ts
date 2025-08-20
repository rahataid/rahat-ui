import { differenceInHours, format, formatDate, formatDistanceToNow, formatDistanceToNowStrict, isYesterday, parseISO } from 'date-fns';

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
}

