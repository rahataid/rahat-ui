import { UUID } from 'crypto';
import { useProjectAction } from '../../projects';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSwal } from 'libs/query/src/swal';

export const useSinglePhase = (uuid: UUID, phaseId: UUID) => {
  const q = useProjectAction();
  const query = useQuery({
    queryKey: ['phase', uuid, phaseId],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'aaProject.phases.getOne',
          payload: {
            uuid: phaseId,
          },
        },
      });
      return mutate.data;
    },
  });
  return query;
};

export const useRevertPhase = () => {
  const q = useProjectAction();
  const qc = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      payload,
    }: {
      projectUUID: UUID;
      payload: {
        phaseId: UUID;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.phases.revertPhase',
          payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['phase'] });
      qc.invalidateQueries({ queryKey: ['triggerstatements'] });
      toast.fire({
        title: 'Phase reverted successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while reverting phase.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};
