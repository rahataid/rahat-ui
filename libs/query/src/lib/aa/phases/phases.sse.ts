'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@rumsan/react-query';
// import { useSSE } from '../../utils/use-sse';
import { usePhasesStore } from './phases.store';
import { useSSE } from 'libs/query/src/utils/use-sse';

export function usePhaseSSE(projectId: string) {
  const qc = useQueryClient();
  const addPhase = usePhasesStore((s) => s.addPhase);
  const updatePhase = usePhasesStore((s) => s.updatePhase);

  useSSE({
    url: `${process.env.NEXT_PUBLIC_API_HOST_URL}/v1/events/phases`,
    // getToken: () => useAuthStore.getState().token,
    onMessage: (event) => {
      const { event: type, data } = event;
      console.log('type:', type);
      if (type === 'phase.created') {
        addPhase(data);
      }

      if (type === 'phase.updated') {
        updatePhase(data.uuid, data);
      }

      qc.invalidateQueries({ queryKey: ['phases', projectId] });
    },
  });

  return null;
}
