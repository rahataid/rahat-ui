import { Toaster } from '@rahat-ui/shadcn/components/toaster';
import { QueryProvider } from '../providers/query-provider';
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
        </Wagmi>
      </body>
    </html>
  );
}
