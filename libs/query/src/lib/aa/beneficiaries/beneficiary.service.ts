import { UUID } from 'crypto';
import { useProjectAction } from '../../projects';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSwal } from 'libs/query/src/swal';

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
  isSuccess?: boolean;
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
    // keepPreviousData: true,
    enabled: !!payload.projectUuid && !!payload.groupId,
    staleTime: 1000,
    refetchInterval: (query) => {
      const data = query.state.data as { status?: string } | null;
      if (data?.status === 'processing') return 3000;
      return false;
    },
  });

  return query;
};

export const useGenerateQrPdf = (projectUuid: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (groupId: UUID) => {
      const mutate = await q.mutateAsync({
        uuid: projectUuid,
        data: {
          action: 'aaProject.beneficiary.generateQrPdf',
          payload: {
            groupId: groupId,
          },
        },
      });
      return mutate.data;
    },
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({
        queryKey: ['beneficiariesQr', { projectUuid, groupId }],
      });
      toast.fire({
        title: 'QR generated successfully',
        icon: 'success',
      });
    },
    onError: (error) => {
      toast.fire({
        title: error?.message || 'Failed to generate QR PDF',
        icon: 'error',
      });
    },
  });
};
