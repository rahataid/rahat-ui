import { MS_ACTIONS } from '@rahataid/sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useProjectAction } from '../../projects';

const GET_ALL_BENEFICIARY_GROUPS = 'comms.beneficiary.getAllGroups';

export const useFindAllCommsBeneficiaryGroups = (
  projectUUID: UUID,
  payload?: any,
) => {
  const action = useProjectAction();

  const query = useQuery({
    queryKey: ['beneficiary_groups', projectUUID],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_BENEFICIARY_GROUPS,
          payload: payload || {},
        },
      });
      return res.data;
    },
  });

  const data = query?.data || [];

  return {
    ...query,
    data,
  };
};

export const useCommsSingleBeneficiaryGroup = (
  uuid: UUID,
  beneficiariesGroupID: UUID,
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['beneficiaryGroup', uuid, beneficiariesGroupID],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'comms.beneficiary.getOneGroup',
          payload: {
            uuid: beneficiariesGroupID,
          },
        },
      });
      return mutate.data;
    },
  });
  return query;
};

export const useGetCommsSingleBeneficiary = (
  uuid: UUID,
  beneficiaryId: UUID,
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['beneficiaryGet', uuid, beneficiaryId],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'comms.beneficiary.get',
          payload: {
            uuid: beneficiaryId,
          },
        },
      });
      return mutate.data;
    },
  });
  return query;
};

export const useCommsSingleBeneficiaryGroupMutation = (projectUUID: UUID) => {
  const q = useProjectAction();

  return useMutation({
    mutationFn: async (beneficiariesGroupID: UUID) => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'comms.beneficiary.getOneGroup',
          payload: {
            uuid: beneficiariesGroupID,
          },
        },
      });
      return mutate.data;
    },
  });
};
