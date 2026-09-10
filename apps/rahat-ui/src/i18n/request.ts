import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { routing } from './routing';

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const fromCookie = cookieStore.get('locale')?.value;

  // On a user's first visit there's no cookie yet; middleware.ts detects a
  // locale from the Accept-Language header and forwards it via this request
  // header so the very first render already uses it, ahead of the cookie
  // middleware also sets (which only takes effect on the next request).
  const fromHeader = headers().get('x-detected-locale');

  const raw = fromCookie ?? fromHeader;
  const locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});