'use client';

import { useLocale, useTranslations } from 'next-intl';

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

/**
 * Props for `<PhoneInput>`'s country dropdown (labels + search/empty text),
 * translated for the 6 countries `libs/shadcn`'s PhoneInput restricts its
 * list to (see `allowedCountries` in phone-input.tsx). Spread directly:
 * `<PhoneInput {...usePhoneCountrySelectProps()} ... />`.
 */
export function usePhoneCountrySelectProps() {
  const g = useTranslations('GLOBAL');

  return {
    labels: {
      NP: g('NEPAL'),
      KE: g('KENYA'),
      MW: g('MALAWI'),
      PK: g('PAKISTAN'),
      KH: g('CAMBODIA'),
      SG: g('SINGAPORE'),
    },
    countrySelectProps: {
      searchPlaceholder: g('SEARCH_COUNTRY'),
      noCountryFoundText: g('NO_COUNTRY_FOUND'),
    },
  };
}
