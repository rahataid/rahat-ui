'use client';

import { useSSE } from 'libs/query/src/utils/use-sse';
import { usePhasesStore } from './phases.store';

export function usePhaseSSE(projectId: string) {
  const addPhase = usePhasesStore((s) => s.addPhase);
  const updatePhase = usePhasesStore((s) => s.updatePhase);

  useSSE({
    url: `http://localhost:5500/v1/events/phases`,
    onMessage: (event) => {
      const { event: type, data } = event;

      if (type === 'phase.created') {
        console.log('new phase added');
        addPhase(data);
      }

      if (type === 'phase.updated') {
        console.log('phase edited');

        updatePhase(data.uuid, data);
      }
    },
  });

  return null;
}
