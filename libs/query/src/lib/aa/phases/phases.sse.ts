'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useSSE } from 'libs/query/src/utils/use-sse';

export function usePhaseSSE(projectId: string) {
  const qc = useQueryClient();

  useSSE({
    url: `${process.env.NEXT_PUBLIC_API_HOST_URL}/v1/events/phases`,
    onMessage: (event) => {
      // const { event: type, data } = event;

      qc.invalidateQueries({ queryKey: ['phases', projectId] });
    },
  });

  return null;
}
