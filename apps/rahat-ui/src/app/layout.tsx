import { Toaster } from '@rahat-ui/shadcn/components/toaster';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Plus_Jakarta_Sans, DM_Sans } from 'next/font/google';
import { QueryProvider } from '../providers/query-provider';
import { SecondPanelProvider } from '../providers/second-panel-provider';
import { ServiceProvider } from '../providers/service.provider';
import { ThemeProvider } from '../providers/theme-provider';
import { Wagmi } from '../providers/wagmi.provider';
import './globals.css';
import { RSQueryProvider } from '@rumsan/react-query/providers/rs-query-provider';
import { CommunicationQueryProvider } from '@rumsan/communication-query/providers/communication-query-provider';
import { NewCommunicationQueryProvider } from '@rahat-ui/query';
import { PostHogProvider } from '../providers/PostHogProvider';
import { headers } from 'next/headers';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata = {
  icons: {
    icon: '/svg/rahat-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = headers().get('x-nonce') || '';

  return (
    <html lang="en">
      <head nonce={nonce}></head>
      <body
        className={`${plusJakarta.variable} ${dmSans.variable} font-sans`}
      >
        <title>Welcome to Rahat</title>
        <PostHogProvider>
          <Wagmi>
            <QueryProvider>
              <RSQueryProvider>
                <NewCommunicationQueryProvider>
                  <CommunicationQueryProvider>
                    <ServiceProvider>
                      <SecondPanelProvider>
                        <ThemeProvider
                          attribute="class"
                          defaultTheme="light"
                          forcedTheme="light"
                          disableTransitionOnChange
                        >
                          <main>
                            {children}
                          </main>
                          <script nonce={nonce} />
                          <ToastContainer />
                          <Toaster />
                        </ThemeProvider>
                      </SecondPanelProvider>
                    </ServiceProvider>
                  </CommunicationQueryProvider>
                </NewCommunicationQueryProvider>
              </RSQueryProvider>
            </QueryProvider>
          </Wagmi>
        </PostHogProvider>
      </body>
    </html>
  );
}
