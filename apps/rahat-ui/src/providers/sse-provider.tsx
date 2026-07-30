'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EVENT, EVENT_QUERY_MAP } from '../constants/sse.constants';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
interface SseServerEvent {
  event: EVENT;
  data: any;
}

const SseStatusContext = createContext<string>('Disconnected');

export function SseProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const params = useParams();
  const projectId = params.id as UUID;
  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env['NEXT_PUBLIC_API_HOST_URL']}/v1/events`,
    );

    eventSource.onmessage = (event) => {
      try {
        const payload: SseServerEvent = JSON.parse(event.data);
        const queryKeys = EVENT_QUERY_MAP[payload.event]?.(projectId);

        if (queryKeys) {
          queryKeys.forEach((key) =>
            queryClient.invalidateQueries({
              queryKey: key,
            }),
          );
        } else {
          console.warn('Unhandled SSE event type:', payload.event);
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
