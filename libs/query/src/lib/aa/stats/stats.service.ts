'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useStatsStore } from './stats.store';
import { UUID } from 'crypto';

export const usePhasesStats = (uuid: UUID) => {
  const q = useProjectAction();
  const { setPhasesStats } = useStatsStore((state) => ({
    setPhasesStats: state.setPhasesStats,
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
      setPhasesStats(query?.data);
    }
  }, [query.data]);
  return query;
};

export const useAllStats = (uuid: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['allStats', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.stats.getAll',
          payload: {},
        },
      });
      return mutate.data;
    },
  });

  return query;
};

export const useCommsStats = (uuid: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['commsStatsAll', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.activities.communication.getStats',
          payload: {},
        },
      });
      return mutate.data;
    },
  });

  return query;
};

export const useSingleStat = (uuid: UUID, name: string) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['singleStat', uuid, name],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.stats.getOne',
          payload: { name },
        },
      });
      return mutate.data;
    },
  });

  return query;
};
