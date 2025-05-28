import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useSwal } from 'libs/query/src/swal';
import { UUID } from 'crypto';

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

  const query = useQuery({
    queryKey: ['dailyMonitorings', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'ms.dailyMonitoring.getAll',
          payload: payload,
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
