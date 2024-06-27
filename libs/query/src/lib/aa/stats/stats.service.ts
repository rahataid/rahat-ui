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

export const useCommunicationStats = (uuid: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['communicationStats', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.stats.getComms',
          payload: {},
        },
      });
      return mutate.data;
    },
  });
  return query;
};
export const useGetCommunicationLogs = (uuid: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['communicationlogs', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aa.jobs.communication.getCommunicationLogs',
          payload: {},
        },
      });
      return mutate.data;
    },
  });

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
