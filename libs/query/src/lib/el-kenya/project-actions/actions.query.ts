import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { UUID } from 'crypto';

// Constants for actions
const GET_ALL_KENYA_STATS = 'rpProject.reporting.list';
const SYNC_LEGACY_IMPORTED = 'rpProject.walkin.syncLegacyImported';

// hooks
export const useFindAllKenyaStats = (projectUUID: UUID) => {
  const action = useProjectAction(['findAllKenyaStats-rpProject']);

  return useQuery({
    queryKey: ['kenyaStats', projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_KENYA_STATS,
          payload: {},
        },
      });
      return res.data;
    },
  });
};

export const useGetRedemption = (projectUUID: UUID,redemptionId:UUID) => {
  const action = useProjectAction(['getRedemptions-rpProject']);

  return useQuery({
    queryKey: ['getRedemptions', projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'rpProject.getRedemption',
          payload: {uuid:redemptionId},
        },
      });
      return res.data;
    },
  });
};

export const useSyncLegacyImported = (projectUUID: UUID) => {
  const action = useProjectAction(['syncLegacyImported-rpProject']);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: SYNC_LEGACY_IMPORTED,
          payload: {},
        },
      });
      return res?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['beneficiary.list_by_project'],
      });
    },
  });
};

