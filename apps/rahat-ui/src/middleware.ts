import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const _rsc = url.searchParams.get('_rsc') || '';
  const upgradeHeader = request.headers.get('upgrade-insecure-requests') || '';

  const maliciousPattern =
    /utl_inaddr|get_host_name|select|union|dual|\(\s*select|\/\s*\(select/i;

  for (const [key, value] of url.searchParams.entries()) {
    if (
      maliciousPattern.test(value) ||
      maliciousPattern.test(upgradeHeader) ||
      maliciousPattern.test(_rsc)
    ) {
      return new Response('Bad Request', { status: 400 });
    }
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const dev = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';

  const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${
    dev ? "'unsafe-eval'" : ''
  };
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  connect-src 'self' http: https: ws: wss:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  block-all-mixed-content;
  upgrade-insecure-requests;
`
    .replace(/\n/g, ' ')
    .trim();

  const requestHeaders = new Headers();
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set(
    'Content-Security-Policy',
    // Replace newline characters and spaces
    cspHeader,
  );

  return NextResponse.next({
    headers: requestHeaders,
    request: {
      headers: requestHeaders,
    },
  });
}
