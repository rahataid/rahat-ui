export const formateDateFromText = (text: string) => {
  if (!text) return 'N/A';

  const match = text.match(/\d{4}-\d{2}-\d{2}/);

  if (!match) return 'N/A';
  const rawDate = match[0];
  const newFormattedDate = new Intl.DateTimeFormat('ne-NP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(rawDate));
  const newData = text.replace(rawDate, newFormattedDate);
  return newData;
};
