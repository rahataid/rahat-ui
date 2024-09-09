import { MS_ACTIONS } from '@rahataid/sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useProjectAction } from '../../projects';

// Constants for actions
const CREATE_DISBURSEMENT = 'rpProject.disbursement.create';
const GET_ALL_DISBURSEMENTS = 'rpProject.disbursements.get';
const GET_DISBURSEMENT = 'rpProject.disbursement.getOne';
const UPDATE_DISBURSEMENT = 'rpProject.disbursement.update';
const CREATE_DISBURSEMENT_PLAN = 'rpProject.disbursementPlan.create';
const GET_DISBURSEMENT_PLAN = 'rpProject.disbursementPlan.getOne';
const GET_ALL_DISBURSEMENT_PLANS = 'rpProject.disbursementPlan.get';
const UPDATE_DISBURSEMENT_PLAN = 'rpProject.disbursementPlan.update';
const CREATE_BULK_DISBURSEMENT = 'rpProject.disbursement.bulkCreate';

const GET_ALL_BENEFICIARY_GROUPS = 'rpProject.beneficiary.getAllGroups';

// Hooks for Disbursement Plan
export const useCreateDisbursementPlan = (projectUUID: UUID) => {
  const action = useProjectAction(['createDisbursementPlan-rpProject']);

  return useMutation({
    mutationFn: async (data: {
      totalAmount: number;
      conditions: string[];
      beneficiaries: `0x${string}`[];
    }) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: CREATE_DISBURSEMENT_PLAN,
          payload: data,
        },
      });
      return res.data;
    },
  });
};

export const useFindAllDisbursementPlans = (projectUUID: UUID) => {
  const action = useProjectAction(['findAllDisbursementPlans-rpProject']);

  return useQuery({
    queryKey: ['disbursementPlans', projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_DISBURSEMENT_PLANS,
          payload: {},
        },
      });
      return res.data;
    },
  });
};

export const useFindOneDisbursementPlan = (
  projectUUID: UUID,
  // planUUID: UUID,
) => {
  const action = useProjectAction(['findOneDisbursementPlan-rpProject']);

  return useQuery({
    queryKey: ['disbursementPlan', projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_DISBURSEMENT_PLAN,
          payload: {},
        },
      });
      return res.data;
    },
  });
};

export const useUpdateRPDisbursementPlan = () => {
  const action = useProjectAction(['updateDisbursementPlan-rpProject']);

  return useMutation({
    mutationFn: async (data: {
      projectUUID: UUID;
      id: UUID;
      totalAmount?: number;
      conditions?: string[];
      beneficiaries?: {
        amount: number;
        beneficiaryWallet: string;
        uuid: UUID;
      }[];
    }) => {
      const { projectUUID, id, ...rest } = data;
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: UPDATE_DISBURSEMENT_PLAN,
          payload: { id, ...rest },
        },
      });
      return res.data;
    },
  });
};

// Hooks for Disbursement
export const useCreateDisbursement = (projectUUID: UUID) => {
  const action = useProjectAction(['createDisbursement-rpProject']);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { amount: number; walletAddress: string }) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: CREATE_DISBURSEMENT,
          payload: data,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MS_ACTIONS.BENEFICIARY.LIST_BY_PROJECT, {}],
      });
      queryClient.invalidateQueries({
        queryKey: ['disbursements', projectUUID],
      });
    },
  });
};

export const useFindAllDisbursements = (projectUUID: UUID, payload: any) => {
  const action = useProjectAction(['findAllDisbursements-rpProject']);

  const query = useQuery({
    queryKey: ['disbursements', projectUUID],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_ALL_DISBURSEMENTS,
          payload,
        },
      });
      return res.data;
    },
  });

  const data = query?.data;

  return {
    ...query,
    data,
  };
};
// type GetProjectBeneficiaries = Pagination & {
//   order?: 'asc' | 'desc';
//   sort?: string;
//   projectUUID: UUID;
// };

export const useFindOneDisbursement = (
  projectUUID: UUID,
  params: {
    walletAddress?: string;
    id?: number;
    uuid?: UUID;
  },
) => {
  const action = useProjectAction(['findOneDisbursement-rpProject']);

  return useQuery({
    queryKey: [
      'disbursement',
      projectUUID,
      params.walletAddress,
      params.id,
      params.uuid,
    ],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_DISBURSEMENT,
          payload: params,
        },
      });
      return res.data;
    },
  });
};

export const useUpdateRPDisbursement = () => {
  const action = useProjectAction(['updateDisbursement-rpProject']);

  return useMutation({
    mutationFn: async (data: {
      projectUUID: UUID;
      disbursementUUID: UUID;
      amount: number;
    }) => {
      const { projectUUID, disbursementUUID, amount } = data;
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: UPDATE_DISBURSEMENT,
          payload: { uuid: disbursementUUID, amount },
        },
      });
      return res.data;
    },
  });
};

export const useBulkCreateDisbursement = (projectUUID: UUID) => {
  const action = useProjectAction(['createBulkDisbursement-rpProject']);

  return useMutation({
    mutationFn: async (data: {
      amount: number;
      beneficiaries: `0x${string}`[];
    }) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: CREATE_BULK_DISBURSEMENT,
          payload: data,
        },
      });
      return res.data;
    },
  });
};

export const useRedeemToken = (projectUUID: UUID) => {
  const action = useProjectAction(['redeemToken-rpProject']);

  return useMutation({
    mutationFn: async (data: { uuid: string }) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'rpProject.updateRedemption',
          payload: data,
        },
      });
      return res.data;
    },
  });
};

export const useListRedemptions = (projectUUID: UUID) => {
  const action = useProjectAction(['listRedemptions-rpProject']);
  return useQuery({
    queryKey: ['redemptions', projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'rpProject.listRedemption',
          payload: {},
        },
      });
      const data = res.data;
      const formattedData = data.map((item: any) => {
        return {
          uuid: item?.uuid,
          name: item?.Vendor?.name,
          amount: item?.tokenAmount,
          status: item?.status,
          tokenAddress: item?.tokenAddress,
          walletAddress: item?.Vendor?.walletAddress,
        };
      });
      return formattedData;
    },
  });
};

export const useFindAllBeneficiaryGroups = (projectUUID: UUID) => {
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
          payload: {},
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

export const useRpSingleBeneficiaryGroup = (
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
          action: 'rpProject.beneficiary.getOneGroup',
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

export const useRpSingleBeneficiaryGroupMutation = (projectUUID: UUID) => {
  const q = useProjectAction();

  return useMutation({
    mutationFn: async (beneficiariesGroupID: UUID) => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'rpProject.beneficiary.getOneGroup',
          payload: {
            uuid: beneficiariesGroupID,
          },
        },
      });
      return mutate.data;
    },
  });
};
