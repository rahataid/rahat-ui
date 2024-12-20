import { useQuery } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { UUID } from 'crypto';

// Constants for actions
const GET_ALL_KENYA_STATS = 'rpProject.reporting.list';

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

