import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // To add language switching: read locale from a cookie here instead.
  const locale = 'ne';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
