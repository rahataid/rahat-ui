import { format } from 'date-fns';

export function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  try {
    return format(new Date(dateStr), 'MMM dd, yyyy, hh:mm a');
  } catch {
    return dateStr;
  }
}
