import { Toaster } from '@rahat-ui/shadcn/components/toaster';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GeistSans } from 'geist/font/sans';
import { QueryProvider } from '../providers/query-provider';
import { SecondPanelProvider } from '../providers/second-panel-provider';
import { ServiceProvider } from '../providers/service.provider';
import { ThemeProvider } from '../providers/theme-provider';
import { Wagmi } from '../providers/wagmi.provider';
import './globals.css';
import { RSQueryProvider } from '@rumsan/react-query/providers/rs-query-provider';
import { CommunicationQueryProvider } from '@rumsan/communication-query/providers/communication-query-provider';
import { NewCommunicationQueryProvider } from '@rahat-ui/query';

export const metadata = {
  icons: {
    icon: '/svg/rahat-logo.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body>
        <title>Welcome to Rahat</title>
        <NextIntlClientProvider messages={messages}>
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
                        // enableSystem
                        // disableTransitionOnChange
                      >
                        <main className={GeistSans.className}>{children}</main>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
