'use client';

import { QueryClient, QueryClientProvider, ReactQueryDevtools } from "@rahat-ui/query";


interface QueryProviderProps {
    children: React.ReactNode
}

export const QueryProvider= ({children}:QueryProviderProps)=>{
    const queryClient = new QueryClient({
        defaultOptions: {

          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
          mutations: {
            retry: false,
          },
          
        },
      });
      
    return (
        <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}