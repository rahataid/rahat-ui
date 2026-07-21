'use client';
import { useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useProjectAction, useProjectSettingsStore } from '../../projects';
import { useStatsStore } from './stats.store';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';

function useToast() {
  const alert = useSwal();
  return alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
}
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
    staleTime: 60 * 60 * 1000, // 1 hour
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
    staleTime: 60 * 60 * 1000, // 1 hour
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
    staleTime: 60 * 60 * 1000, // 1 hour
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
    staleTime: 60 * 60 * 1000, // 1 hour
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
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return query;
};

export const useProjectDashboardReporting = (uuid: UUID) => {
  const q = useProjectAction();
  const query = useQuery({
    queryKey: ['projectDashboard', uuid],
    staleTime: 1000 * 60 * 60 * 4,
    enabled: !!uuid,
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

export const useBackFill = (projectUuid: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUuid,
        data: {
          action: 'aaProject.stats.backFill',
          payload: {
            appId: projectUuid,
          },
        },
      });
      return mutate.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['allStats', projectUuid],
      });
      toast.fire({
        title: 'Back Fill completed successfully',
        icon: 'success',
      });
    },
    onError: (error) => {
      toast.fire({
        title: error?.message || 'Failed to Back Fill',
        icon: 'error',
      });
    },
  });
};

export const useTransportSessionStats = (uuid: UUID) => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  const query = useQuery({
    queryKey: ['transportSessionStats', uuid],
    queryFn: async () => {
      try {
        const mutate = await q.mutateAsync({
          uuid,
          data: {
            action: 'ms.activities.communication.getTransportSessionStats',
            payload: {
              projectId: uuid,
            },
          },
        });
        return mutate.data;
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || 'Failed to fetch transport stats';
        toast.fire({
          title: 'Error loading transport stats',
          text: errorMessage,
          icon: 'error',
        });
        throw error;
      }
    },
    staleTime: 60 * 60 * 1000,
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
