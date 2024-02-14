import { QueryProvider } from '../providers/query-provider';
import './globals.css';
import { ThemeProvider } from './theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
        <ThemeProvider
          attribute="class"
          // defaultTheme="system"
          // enableSystem
          disableTransitionOnChange
        >
          
          <main>{children}</main>
        </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
