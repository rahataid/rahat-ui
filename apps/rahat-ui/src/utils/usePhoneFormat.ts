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
    return locale === 'ne' ? toDevanagari(phone) : phone;
  };

  return format;
}
