'use client';

import { useLocale } from 'next-intl';

const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

function toDevanagari(str: string): string {
  return str.replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

export function usePhoneFormat() {
  const locale = useLocale();

  const format = (phone: string | null | undefined): string => {
    if (!phone) return '';

    let countryCode = '';
    let raw = phone;

    if (phone.startsWith('+')) {
      const match = phone.match(/^\+?(\d{1,4})(.*)/);
      if (match) {
        countryCode = match[1];
        raw = match[2].replace(/\D/g, '');
      }
    } else {
      raw = phone.replace(/\D/g, '');
    }

    const formatted = countryCode
      ? `+${countryCode} ${raw}`
      : raw;

    if (locale === 'ne') return toDevanagari(formatted);
    return formatted;
  };

  return format;
}
