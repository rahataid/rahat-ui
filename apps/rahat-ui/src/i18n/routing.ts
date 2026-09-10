import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Locale is resolved from a cookie, not the URL — no /en or /ne prefix.
  localePrefix: 'never',
});
