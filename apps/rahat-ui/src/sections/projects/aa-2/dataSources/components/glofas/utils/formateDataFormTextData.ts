import { dateFormat } from 'apps/rahat-ui/src/utils/dateFormate';

export const formateDataFormTextData = (text: string) => {
  if (!text) return 'N/A';

  const match = text.match(/\d{4}-\d{2}-\d{2}/);

  if (!match) return 'N/A';
  const rawDate = match[0]; // "2025-10-31"
  const newFormattedDate = dateFormat(rawDate, 'MMMM d, yyyy');
  const newData = text.replace(rawDate, newFormattedDate);
  return newData;
};
