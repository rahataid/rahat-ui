'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type EVENT =
  | 'phase.updated'
  | 'phase.created'
  | 'phase.deleted'
  | 'beneficiaries.updated';

interface SseServerEvent {
  event: EVENT;
}

const SseStatusContext = createContext<string>('Disconnected');

export function SseProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env['NEXT_PUBLIC_API_HOST_URL']}/v1/events`,
    );
    console.log('eventSource:', eventSource);
    eventSource.onmessage = (event) => {
      try {
        const payload: SseServerEvent = JSON.parse(event.data);
        const eventType = payload.event;
        console.log('eventType:', eventType);
        switch (eventType) {
          case 'beneficiaries.updated':
            queryClient.invalidateQueries({
              queryKey: ['beneficiaries'],
            });
            break;

          case 'phase.updated':
            queryClient.invalidateQueries({
              queryKey: ['phases'],
            });
            break;

          case 'phase.created':
            queryClient.invalidateQueries({
              queryKey: ['phases'],
            });
            break;

          case 'phase.deleted':
            queryClient.invalidateQueries({
              queryKey: ['phases'],
            });
            break;

          default:
            console.warn('Unhandled SSE event type:', eventType);
        }
      } catch (error) {
        console.error('Failed to parse SSE payload', error);
      }
    };

    return () => eventSource.close();
  }, [queryClient]);

  return (
    <SseStatusContext.Provider value="Connected">
      {children}
    </SseStatusContext.Provider>
  );
}

export const useSseStatus = () => useContext(SseStatusContext);
