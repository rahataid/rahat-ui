import { Toaster } from '@rahat-ui/shadcn/components/toaster';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { GeistSans } from 'geist/font/sans';
import { QueryProvider } from '../providers/query-provider';
import { SecondPanelProvider } from '../providers/second-panel-provider';
import { ServiceProvider } from '../providers/service.provider';
import { GraphQueryProvider } from '../providers/subgraph-provider';
import { ThemeProvider } from '../providers/theme-provider';
import { Wagmi } from '../providers/wagmi.provider';
import './globals.css';

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
          <GraphQueryProvider>
            <QueryProvider>
              <ServiceProvider>
                <SecondPanelProvider>
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
                </SecondPanelProvider>
              </ServiceProvider>
            </QueryProvider>
          </GraphQueryProvider>
        </Wagmi>
      </body>
    </html>
  );
}
