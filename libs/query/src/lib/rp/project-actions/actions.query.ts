import { UUID } from 'crypto';
import { useProjectAction, useProjectBeneficiaries } from '../../projects';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { useEffect } from 'react';
import { MS_ACTIONS } from '@rahataid/sdk';

// Constants for actions
const CREATE_DISBURSEMENT = 'rpProject.disbursement.create';
const GET_ALL_DISBURSEMENTS = 'rpProject.disbursements.get';
const GET_DISBURSEMENT = 'rpProject.disbursement.getOne';
const UPDATE_DISBURSEMENT = 'rpProject.disbursement.update';
const CREATE_DISBURSEMENT_PLAN = 'rpProject.disbursementPlan.create';
const GET_DISBURSEMENT_PLAN = 'rpProject.disbursementPlan.getOne';
const GET_ALL_DISBURSEMENT_PLANS = 'rpProject.disbursementPlan.get';
const UPDATE_DISBURSEMENT_PLAN = 'rpProject.disbursementPlan.update';

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
  planUUID: UUID,
) => {
  const action = useProjectAction(['findOneDisbursementPlan-rpProject']);

  return useQuery({
    queryKey: ['disbursementPlan', projectUUID, planUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_DISBURSEMENT_PLAN,
          payload: { uuid: planUUID },
        },
      });
      return res.data;
    },
  });
};

export const useUpdateDisbursementPlan = () => {
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

export const useFindAllDisbursements = (projectUUID: UUID) => {
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
          payload: {},
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
  disbursementUUID: UUID,
) => {
  const action = useProjectAction(['findOneDisbursement-rpProject']);

  return useQuery({
    queryKey: ['disbursement', projectUUID, disbursementUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: GET_DISBURSEMENT,
          payload: { uuid: disbursementUUID },
        },
      });
      return res.data;
    },
  });
};

export const useUpdateDisbursement = () => {
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
