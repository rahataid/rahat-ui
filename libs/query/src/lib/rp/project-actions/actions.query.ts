import { UUID } from 'crypto';
import { useProjectAction } from '../../projects';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useCreateDisbursementPlan = (projectUUID: UUID) => {
  const action = useProjectAction(['createDisbursementPlan-rpProject']);

  return useMutation({
    mutationFn: async (data: {
      totalAmount: number;
      conditions: string[];
      beneficiaries: { amount: number; walletAddress: string }[];
      // assignAllBeneficiaries: boolean;
    }) => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'rpProject.disbursement.create',
          payload: data,
        },
      });
      return res.data;
    },
  });
};

export const useFindAllDisbursementPlans = (projectUUID: UUID) => {
  const action = useProjectAction(['findAllDisbursementPlans-rp']);

  return useQuery({
    queryKey: ['disbursementPlans', projectUUID],
    queryFn: async () => {
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          payload: {},
          action: 'rpProject.disbursements.get',
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
          action: 'rpProject.disbursement.listone',
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
      totalAmount?: string;
      conditions?: string[];
      beneficiaries?: {
        amount: string;
        beneficiaryWallet: string;
        uuid: UUID;
      }[];
    }) => {
      const { projectUUID, id, ...rest } = data;
      const res = await action.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'rpProject.disbursement.update',
          payload: { id, ...rest },
        },
      });
      return res.data;
    },
  });
};
