import { UUID } from 'crypto';
import { useProjectAction } from '../../projects';
import {
  keepPreviousData,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useSwal } from 'libs/query/src/swal';
import { on } from 'events';

function useToast() {
  const alert = useSwal();
  return alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
}
export const useGetBeneficiariesQr = (payload: {
  projectUuid: UUID;
  groupId: UUID;
}) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['beneficiariesQr', payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: payload.projectUuid,
        data: {
          action: 'aaProject.beneficiary.getQrPdf',
          payload: {
            groupId: payload.groupId,
          },
        },
      });
      return mutate.data;
    },
    enabled: !!payload.projectUuid && !!payload.groupId,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return query;
};

export const useGenerateQrPdf = (projectUuid: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (groupId: UUID) => {
      const mutate = await q.mutateAsync(
        {
          uuid: projectUuid,
          data: {
            action: 'aaProject.beneficiary.generateQrPdf',
            payload: {
              groupId: groupId,
            },
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['beneficiariesQr', { projectUuid, groupId }],
            });
            toast.fire({
              title: 'QR PDF generated successfully',
              icon: 'success',
            });
          },
          onError: (error: any) => {
            toast.fire({
              title: error?.message || 'Failed to generate QR PDF',
              icon: 'error',
            });
          },
        },
      );
      return mutate.data;
    },
  });
};
