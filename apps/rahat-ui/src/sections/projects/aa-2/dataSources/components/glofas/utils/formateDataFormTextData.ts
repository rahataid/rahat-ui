import { localizeNepaliParts } from 'apps/rahat-ui/src/utils/i18n/date';

export const formateDateFromText = (text: string, locale = 'en') => {
  if (!text) return 'N/A';

  const match = text.match(/\d{4}-\d{2}-\d{2}/);

  if (!match) return 'N/A';
  const rawDate = match[0];
  const d = new Date(rawDate);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const neOptions =
    locale === 'ne' ? { ...options, numberingSystem: 'deva' } : options;
  const formatter = new Intl.DateTimeFormat(
    locale === 'ne' ? 'ne-NP' : locale,
    neOptions,
  );
  const newFormattedDate =
    locale === 'ne'
      ? localizeNepaliParts(d, neOptions, formatter.formatToParts(d))
      : formatter.format(d);
  const newData = text.replace(rawDate, newFormattedDate);
  return newData;
};
