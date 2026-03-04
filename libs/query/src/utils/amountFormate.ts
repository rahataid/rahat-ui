export const amountFormat = (amount: string | number, locale = 'en-IN') => {
  const num = Number(amount);
  if (isNaN(num)) return '0.00';

  return num.toLocaleString(locale, {
    maximumFractionDigits: 2,
  });
};
