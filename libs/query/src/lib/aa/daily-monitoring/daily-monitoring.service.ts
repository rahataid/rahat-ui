import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProjectAction, useProjectSettingsStore } from '../../projects';
import { useSwal } from 'libs/query/src/swal';
import { UUID } from 'crypto';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';

export interface SourceHealthData {
  fetch_frequency_minutes: number;
  source_id: string;
  name: string;
  source_url: string;
  status: 'UP' | 'DOWN' | 'DEGRADED' | string;
  last_checked: string;
  response_time_ms: number | null;
  validity: 'VALID' | 'STALE' | 'EXPIRED' | string;
  errors: Array<{
    code: string;
    message: string;
    timestamp: string;
  }> | null;
}

export interface HealthCacheData {
  overall_status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | string;
  last_updated: string;
  sources?: SourceHealthData[];
}

export const useCreateDailyMonitoring = () => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      monitoringPayload,
    }: {
      projectUUID: UUID;
      monitoringPayload: any;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.dailyMonitoring.add',
          payload: monitoringPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Added successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while adding.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDailyMonitoring = (uuid: UUID, payload: any) => {
  const q = useProjectAction();
  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const query = useQuery({
    queryKey: ['dailyMonitorings', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.dailyMonitoring.getAll',
          payload: {
            ...payload,
            activeYear:
              settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
                'active_year'
              ],
            riverBasin:
              settings?.[uuid]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
                'river_basin'
              ],
          },
        },
      });
      return mutate.response;
    },
  });
  return query;
};

export const useGaugeReading = (uuid: UUID, payload: any) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['gaugeReading', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.dailyMonitoring.getGaugeReading',
          payload: {},
        },
      });
      return mutate.response;
    },
  });
  return query;
};

export const useGaugeForecast = (uuid: UUID, payload: any) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['gaugeForecast', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.dailyMonitoring.getGaugeForecast',
          payload: {
            ...payload,
          },
        },
      });
      return mutate.response;
    },
  });
  return query;
};

export const useSingleMonitoring = (uuid: UUID, monitoringId: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['dailyMonitoring', uuid, monitoringId],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.dailyMonitoring.getOne',
          payload: {
            uuid: monitoringId,
          },
        },
      });
      return mutate.response;
    },
  });
  return query;
};

export const useUpdateMonitoring = () => {
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      monitoringPayload,
    }: {
      projectUUID: UUID;
      monitoringPayload: { uuid: UUID };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.dailyMonitoring.update',
          payload: monitoringPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({
        queryKey: ['dailyMonitorings', 'dailyMonitoring'],
      });
      toast.fire({
        title: 'Updated successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useRemoveMonitoring = () => {
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      monitoringPayload,
    }: {
      projectUUID: UUID;
      monitoringPayload: {
        uuid: UUID;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.dailyMonitoring.remove',
          payload: monitoringPayload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['dailyMonitorings'] });
      toast.fire({
        title: 'Removed successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while removing.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useRemoveMonitoringWhileUpdating = () => {
  const qc = useQueryClient();
  const q = useProjectAction();
  return useMutation({
    mutationFn: async ({
      projectUUID,
      removePayload,
    }: {
      projectUUID: UUID;
      removePayload: {
        uuid: UUID;
        id: number;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'ms.dailyMonitoring.delete',
          payload: removePayload,
        },
      });
    },
  });
};

export const useTabConfiguration = (uuid: UUID, name: string) => {
  const q = useProjectAction([name]);
  const query = useQuery({
    queryKey: [name, uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'settings.get',
          payload: {
            name: name,
          },
        },
      });
      return mutate.data;
    },
  });

  return query;
};
