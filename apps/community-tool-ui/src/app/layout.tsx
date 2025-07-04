import { Toaster } from '@rahat-ui/shadcn/components/toaster';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { QueryProvider } from '../providers/query-provider';
import { ThemeProvider } from '../providers/theme-provider';
import { Wagmi } from '../providers/wagmi.provider';
import './globals.css';
import { ServiceProvider } from '../providers/service.provider';
import { GeistSans } from 'geist/font/sans';
import { RSQueryProvider } from '@rumsan/react-query/providers/rs-query-provider';
import { SecondPanelProvider } from '../providers/second-panel-provider';
import { NewCommunicationQueryProvider } from '@rahat-ui/community-query';
import { PostHogProvider } from '../providers/PostHogProvider';

export const metadata = {
  title: 'Welcome to Rahat',
  icons: {
    icon: '/svg/rahat-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <body>
          <PostHogProvider>
            <Wagmi>
              <QueryProvider>
                <RSQueryProvider>
                  {/* <NewCommunicationQueryProvider> */}
                  <ServiceProvider>
                    <SecondPanelProvider>
                      <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        disableTransitionOnChange
                      >
                        <main className={GeistSans.className}>{children}</main>
                        <ToastContainer />
                        <Toaster />
                      </ThemeProvider>
                    </SecondPanelProvider>
                  </ServiceProvider>
                  {/* </NewCommunicationQueryProvider> */}
                </RSQueryProvider>
              </QueryProvider>
            </Wagmi>
          </PostHogProvider>
        </body>
      </html>
    </>
  );
}
