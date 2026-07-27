'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { PHASE_QUERY_KEYS } from '@rahat-ui/query';

type EVENT =
  | 'phase.updated'
  | 'phase.created'
  | 'phase.deleted'
  | 'beneficiaries.updated';

interface SseServerEvent {
  event: EVENT;
  data: any;
}

const SseStatusContext = createContext<string>('Disconnected');

export function SseProvider({ children }: { children: ReactNode }) {
  const uuid = useParams().id as UUID;

  const queryClient = useQueryClient();

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env['NEXT_PUBLIC_API_HOST_URL']}/v1/events`,
    );
    eventSource.onmessage = (event) => {
      try {
        const payload: SseServerEvent = JSON.parse(event.data);
        const eventType = payload.event;
        switch (eventType) {
          case 'beneficiaries.updated':
            queryClient.invalidateQueries({
              queryKey: ['beneficiaries'],
            });
            break;

          case 'phase.updated':
            queryClient.invalidateQueries({
              queryKey: [PHASE_QUERY_KEYS.PHASES, uuid],
            });
            break;

          case 'phase.created':
            queryClient.invalidateQueries({
              queryKey: [PHASE_QUERY_KEYS.PHASES],
            });
            break;

          case 'phase.deleted':
            queryClient.invalidateQueries({
              queryKey: [PHASE_QUERY_KEYS.PHASES],
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
