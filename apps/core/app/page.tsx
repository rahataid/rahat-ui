'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './app';
export default function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
