import { useEffect } from 'react';
import { useQuery  } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useStatsStore } from './stats.store';
import { UUID } from 'crypto';

export const usePhasesStats = (uuid: UUID) => {
  const q = useProjectAction();
  const { setPhasesStats } = useStatsStore((state) => ({
    setPhasesStats: state.setPhasesStats
  }));

  const query = useQuery({
    queryKey: ['phasesStats', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.phases.getStats',
          payload: {},
        },
      });
      return mutate.data;
    },
  });

  useEffect(() => {
    if (query.data) {
      setPhasesStats(query?.data)
    }
  }, [query.data]);
  return query;
};

