import { Toaster } from '@rahat-ui/shadcn/components/toaster';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CommunicationQueryProvider } from '@rumsan/communication-query/providers/communication-query-provider';
import { RSQueryProvider } from '@rumsan/react-query/providers/rs-query-provider';
import { GeistSans } from 'geist/font/sans';
import { cookieToInitialState } from 'wagmi';
import { fetchChainSettingsNet } from '../api/fetchsettings';
import { QueryProvider } from '../providers/query-provider';
import { SecondPanelProvider } from '../providers/second-panel-provider';
import { ServiceProvider } from '../providers/service.provider';
import { GraphQueryProvider } from '../providers/subgraph-provider';
import { ThemeProvider } from '../providers/theme-provider';
import { Wagmi } from '../providers/wagmi.provider';
import { config } from '../wagmi/wagmi.config';
import './globals.css';
import { headers } from 'next/headers';
import { merge } from 'lodash';
import { defineChain } from 'viem';

export const metadata = {
  title: 'Welcome to Rahat',
  icons: {
    icon: '/svg/rahat-logo.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chainSettings = await fetchChainSettingsNet();
  console.log('d', chainSettings);
  const initialState = cookieToInitialState(config);

  console.log('initialState', initialState);
  return (
    <html lang="en">
      <body>
        <Wagmi initialState={initialState} chainSettings={chainSettings}>
          <GraphQueryProvider>
            <QueryProvider>
              <RSQueryProvider>
                <CommunicationQueryProvider>
                  <ServiceProvider>
                    <SecondPanelProvider>
                      <ThemeProvider
                        attribute="class"
                        // defaultTheme="system"
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
              </RSQueryProvider>
            </QueryProvider>
          </GraphQueryProvider>
        </Wagmi>
      </body>
    </html>
  );
}
