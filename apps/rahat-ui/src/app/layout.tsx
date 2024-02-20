import { Toaster } from '@rahat-ui/shadcn/components/toaster';
import { QueryProvider } from '../providers/query-provider';
import { ThemeProvider } from '../providers/theme-provider';
import Web3Provider from '../providers/web3-provider';
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
        <Web3Provider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              // defaultTheme="system"
              // enableSystem
              disableTransitionOnChange
            >
              <main>{children}</main>
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
