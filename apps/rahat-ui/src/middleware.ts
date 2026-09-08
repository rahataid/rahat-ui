import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from './i18n/config';

const LOCALE_COOKIE = 'locale';
const LOCALE_HEADER = 'x-detected-locale';
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year, matches the language toggle

function isSupportedLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Picks the best supported locale from an `Accept-Language` header.
 * Parses RFC 4647 quality values (`;q=`), sorts by preference, and returns
 * the first primary language subtag (e.g. "ne" from "ne-NP") that matches a
 * locale this app supports. Falls back to `defaultLocale` when the header is
 * absent or none of the browser's preferred languages are supported.
 */
export function resolveLocaleFromAcceptLanguage(
  header: string | null,
): Locale {
  if (!header) return defaultLocale;

  const preferred = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? parseFloat(qParam.trim().slice(2)) : 1;
      return { tag: tag.trim().toLowerCase(), q: isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    const primary = tag.split('-')[0];
    if (isSupportedLocale(primary)) return primary;
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (existing && isSupportedLocale(existing)) {
    return NextResponse.next();
  }

  const detected = resolveLocaleFromAcceptLanguage(
    request.headers.get('accept-language'),
  );

  // No locale cookie yet (first visit): forward the detected locale as a
  // request header so the *current* request's server render picks it up
  // immediately (request.ts reads this as a fallback), instead of only
  // taking effect starting from the next request. The Set-Cookie below
  // then persists the choice so subsequent requests skip detection.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, detected);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.cookies.set(LOCALE_COOKIE, detected, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
  });
  return response;
}

export const config = {
  matcher: [
    // Run on every page request, but skip static assets, Next.js internals,
    // and files with an extension (images, fonts, etc).
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
