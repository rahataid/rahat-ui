// ----------------------------------------------------------------------

type InputValue = string | number | null;

const numberFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
});

// Whole amounts show no decimals ($1,234), others always show 2 ($1,234.50)
const currencyOptions: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'USD',
};
const currencyWholeFormatter = new Intl.NumberFormat(undefined, {
  ...currencyOptions,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const currencyFullFormatter = new Intl.NumberFormat(undefined, {
  ...currencyOptions,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const compactFormatter = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  maximumFractionDigits: 2,
});

const dataFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const DATA_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const DATA_BASE = 1000; // numeral's "b" format is decimal (use 1024 for binary)

// ----------------------------------------------------------------------

export function fNumber(number: InputValue) {
  return numberFormatter.format(toNumber(number));
}

export function fCurrency(number: InputValue) {
  if (!number) return '';

  const value = toNumber(number);
  const isWhole = Math.round(value * 100) % 100 === 0;

  return (isWhole ? currencyWholeFormatter : currencyFullFormatter).format(
    value,
  );
}

export function fPercent(number: InputValue) {
  if (!number) return '';

  return percentFormatter.format(toNumber(number) / 100);
}

export function fShortenNumber(number: InputValue) {
  if (!number) return '';

  // numeral used lowercase suffixes (k, m, b, t)
  return compactFormatter.format(toNumber(number)).toLowerCase();
}

export function fData(number: InputValue) {
  if (!number) return '';

  let value = toNumber(number);
  let unitIndex = 0;

  while (Math.abs(value) >= DATA_BASE && unitIndex < DATA_UNITS.length - 1) {
    value /= DATA_BASE;
    unitIndex += 1;
  }

  return `${dataFormatter.format(value)} ${DATA_UNITS[unitIndex]}`;
}

// ----------------------------------------------------------------------

function toNumber(value: InputValue) {
  const parsed =
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : Number(value);

  return Number.isNaN(parsed) ? 0 : parsed; // numeral treated invalid input as 0
}
