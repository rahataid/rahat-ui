import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';
import { useProjectAction } from '../../projects';

// Constants for actions

const GET_OFFLINE_BENEFICIARIES = 'rpProject.getOfflineBeneficiaries';
const SYNC_OFFLINE_BENEFICIARIES = 'rpProject.syncOfflineBeneficiaries';

// hooks to get offline beneficiaries
export const useGetOfflineBeneficiaries = (
  projectUUID: UUID,
  vendorId?: number,
) => {
  const action = useProjectAction();

  return useQuery({
    queryKey: ['rpCampaign'],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_OFFLINE_BENEFICIARIES,
          payload: { vendorId },
        },
      });
      return res.data;
    },
  });
};

export const useSyncOfflineBeneficiaries = (projectUUID: UUID) => {
  const action = useProjectAction();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: SYNC_OFFLINE_BENEFICIARIES,
          payload: data,
        },
      });
      return res.data;
    },
  });
};
