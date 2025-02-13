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
const GET_UNSYNCED_BENEFICIARIES = 'rpProject.beneficiaries.getUnsynced';
const GET_UNSYNCED_BENEFICIARY_GROUP =
  'rpProject.beneficiary.group.get_unsynced';

const GET_ALL_BENEFICIARY_GROUPS = 'rpProject.beneficiary.getAllGroups';
const LIST_EYE_CHECKEUP_LINE = 'rpProject.reporting.list_eye_checkup_line';
const LIST_PURCHASE_OF_GLASSESS_LINE =
  'rpProject.reporting.list_purchase_of_glassess';

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
        queryKey: [GET_UNSYNCED_BENEFICIARIES, {}],
      });
      queryClient.invalidateQueries({
        queryKey: ['unsyncedBeneficiaries', projectUUID],
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

export const useFindUnSyncedBenefiicaries = (
  projectUUID: UUID,
  payload: any,
) => {
  const action = useProjectAction(['findUnSyncedBeneficiaries-rpProject']);

  return useQuery({
    queryKey: ['unsyncedBeneficiaries', projectUUID, payload],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_UNSYNCED_BENEFICIARIES,
          payload,
        },
      });
      return res;
    },
  });
};

export const useFindUnSyncedBeneficaryGroup = (
  projectUUID: UUID,
  payload: any,
) => {
  const action = useProjectAction(['findUnSyncedBeneficiaryGroup-rpProject']);

  return useQuery({
    queryKey: ['unsyncedBeneficiaryGroup', projectUUID, payload],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_UNSYNCED_BENEFICIARY_GROUP,
          payload,
        },
      });
      return res.data;
    },
  });
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
  const queryClient = useQueryClient();
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

export const useListRedemptions = (projectUUID: UUID, payload: any) => {
  const action = useProjectAction(['listRedemptions-rpProject']);
  return useQuery({
    queryKey: ['redemptions', projectUUID, payload],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'rpProject.listRedemption',
          payload: { ...payload },
        },
      });
      const data = res.data;
      const formattedData = data.map((item: any) => {
        return {
          uuid: item?.uuid,
          name: item?.Vendor?.name,
          amount: item?.tokenAmount || item?.voucherAmount,
          status: item?.status,
          tokenAddress: item?.tokenAddress,
          walletAddress: item?.Vendor?.walletAddress,
        };
      });
      return { redemptions: formattedData, meta: res.response.meta };
    },
  });
};

export const useFindAllBeneficiaryGroups = (
  projectUUID: UUID,
  payload?: any,
) => {
  const action = useProjectAction();

  const query = useQuery({
    queryKey: ['beneficiary_groups', projectUUID, payload],
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
      return { data: res.data, meta: res.response.meta };
    },
  });

  const data = query?.data || [];

  return {
    ...query,
    data: query?.data?.data || [],
    meta: query?.data?.meta,
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

export const useGetSingleBeneficiary = (uuid: UUID, beneficiaryId: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['beneficiaryGet', uuid, beneficiaryId],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'rpProject.beneficiary.get',
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

export const useEyeCheckupLineChartsReports = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);
  const query = useQuery({
    queryKey: [LIST_EYE_CHECKEUP_LINE, restPayloadString],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: LIST_EYE_CHECKEUP_LINE,
          payload: restPayload?.filters,
        },
      });
      return mutate;
    },
  });
  return query;
};

export const usePurchaseOfGlassLineChartsReports = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);
  const query = useQuery({
    queryKey: [LIST_PURCHASE_OF_GLASSESS_LINE, restPayloadString],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: LIST_PURCHASE_OF_GLASSESS_LINE,
          payload: restPayload?.filters,
        },
      });
      return mutate;
    },
  });
  return query;
};
