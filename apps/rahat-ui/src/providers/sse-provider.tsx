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
  | 'beneficiaries.updated'
  | 'trigger.updated'
  | 'trigger.created';

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

    const EVENT_QUERY_MAP: Record<string, (string | UUID)[][]> = {
      'beneficiaries.updated': [['beneficiaries']],
      'phase.updated': [[PHASE_QUERY_KEYS.PHASE], [PHASE_QUERY_KEYS.PHASES, uuid]],
      'phase.created': [[PHASE_QUERY_KEYS.PHASES]],
      'phase.deleted': [[PHASE_QUERY_KEYS.PHASES]],
      'trigger.updated': [[PHASE_QUERY_KEYS.PHASE]],
      'trigger.created': [[PHASE_QUERY_KEYS.PHASE]],
    };

    eventSource.onmessage = (event) => {
      try {
        const payload: SseServerEvent = JSON.parse(event.data);
        const queryKeys = EVENT_QUERY_MAP[payload.event];
        if (queryKeys) {
          queryKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
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
