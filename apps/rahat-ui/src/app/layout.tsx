import { Inter } from 'next/font/google';
import '../../globals.css';
import { ThemeProvider } from './theme-provider';
import { cn } from '@rahat-ui/shadcn/utils';
import { Nav } from '../components/nav';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn('relative h-full font-sans antialiased', inter.className)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="relative flex flex-col min-h-screen">
            <Nav />
            <div className="flex-gorw flex-1">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
