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

export const useCommuicationStatsforBeneficiaryandStakeHolders = (
  uuid: UUID,
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['commsStatsForBeneficiaryandStakeHolders', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.triggers.getTransportSessionStatsByGroup',
          payload: {},
        },
      });
      return mutate.data;
    },
  });

  return query;
};

export const useProjectDashboardReporting = (uuid: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['projectDashboard', uuid],
    staleTime: 1000 * 60 * 60 * 4,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.stats.getAll',
          payload: {
            appId: uuid,
          },
        },
      });
      return mutate.data;
    },
  });

  return query;
};

export const useProjectDashboardBeneficiaryMapLocation = (
  uuid: UUID,
  payload: any,
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['projectDashboardBenefMap', payload, uuid],
    staleTime: 1000 * 60 * 60 * 4,
    queryFn: async () => {
      console.log('payload', payload);
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.stats.getMapLocation',
          payload: {
            appId: uuid,
            ...payload,
          },
        },
      });
      return mutate.data;
    },
  });

  return query;
};
