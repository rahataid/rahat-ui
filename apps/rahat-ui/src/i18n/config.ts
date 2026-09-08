export const locales = ['en', 'ne'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';