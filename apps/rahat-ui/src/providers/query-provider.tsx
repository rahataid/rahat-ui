'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import Image from 'next/image';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectKitProvider
        theme="soft"
        options={{
          customAvatar: ({ radius }) => (
            <Image
              src={`/svg/rahat-logo.png`}
              alt="avatar"
              style={{ borderRadius: radius }}
              width={radius * 2}
              height={radius * 2}
            />
          ),
        }}
      >
        {children}
      </ConnectKitProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" /> */}
    </QueryClientProvider>
  );
};
