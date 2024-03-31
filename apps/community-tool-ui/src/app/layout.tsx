import { Toaster } from '@rahat-ui/shadcn/components/toaster';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { QueryProvider } from '../providers/query-provider';
import { ThemeProvider } from '../providers/theme-provider';
import { Wagmi } from '../providers/wagmi.provider';
import './globals.css';
import { ServiceProvider } from '../providers/service.provider';
import { GeistSans } from 'geist/font/sans';
import { RSQueryProvider } from '@rumsan/react-query';

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
    <html lang="en">
      <body>
        <Wagmi>
          <QueryProvider>
            <RSQueryProvider>
              <ServiceProvider>
                <ThemeProvider
                  attribute="class"
                  // defaultTheme="system"
                  // enableSystem
                  disableTransitionOnChange
                >
                  <main className={GeistSans.className}>{children}</main>
                  <ToastContainer />
                  <Toaster />
                </ThemeProvider>
              </ServiceProvider>
            </RSQueryProvider>
          </QueryProvider>
        </Wagmi>
      </body>
    </html>
  );
}
