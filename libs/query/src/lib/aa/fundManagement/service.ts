'use client';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useEffect } from 'react';
import { useFundAssignmentStore } from './store';
import { useSwal } from 'libs/query/src/swal';
import { UUID } from 'crypto';
import { Pagination } from '@rumsan/sdk/types';
import { useTranslations } from 'next-intl';
import { resolveBackendErrorMessage } from '../../../utils/i18n/backend-error';

export type InitiateFundTransfer = {
  from: string;
  to: string;
  alias: string;
  amount: string;
  description: string;
};
export type ConfirmReceipt = {
  from: string;
  to: string;
  amount: string;
  alias?: string;
};
export const useFetchTokenStatsStellar = (payload: any) => {
  const projectBalance = useProjectAction();
  const { setStellarTokenStats, setStellarTransaction } =
    useFundAssignmentStore((state) => ({
      setStellarTokenStats: state.setStellarTokenStats,
      setStellarTransaction: state.setStellarTransaction,
    }));
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    // queryKey: ['aa.stellar.getStellarStats', restPayloadString],
    queryKey: ['aa.chain.getDisbursementStats', projectUUID, restPayloadString],
    refetchOnMount: true,
    staleTime: 20 * 60 * 1000, // 20 minutes
    queryFn: async () => {
      const mutate = await projectBalance.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          // TODO:naming
          action: 'aa.chain.getDisbursementStats',
          // action: 'aa.stellar.getStellarStats',
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  useEffect(() => {
    if (query?.data) {
      setStellarTokenStats(query?.data?.data?.tokenStats);
      setStellarTransaction(query?.data?.data?.transactionStats);
    }
  }, [query?.data?.data]);
  return query;
};
// cash-tracker start
export const useInitateFundTransfer = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({ payload }: { payload: InitiateFundTransfer }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.cash-tracker.executeAction',
          payload: { ...payload, action: 'initiate_transfer' },
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: t('FUND_TRANSFERRED_SUCCESSFULLY'),
        icon: 'success',
      });
      // Invalidate the transactions query to refresh the data
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['aa.cash-tracker.getTransactions', projectUUID],
        });
      }, 10000);
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['CASH_TRACKER_VENDOR_TOKEN_REDEMPTION'],
        rawMessage,
      );
      q.reset();
      toast.fire({
        title: t('ERROR_WHILE_FUND_TRANSFER'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useCreateBudget = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      amount,
      type = 'cash-tracker',
    }: {
      amount: string;
      type: string;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.cash-tracker.createBudget',
          payload: { amount, type },
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: t('BUDGET_CREATED_SUCCESSFULLY'),
        icon: 'success',
      });
      // Invalidate the transactions query to refresh the data
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['aa.cash-tracker.getTransactions', projectUUID],
        });
      }, 10000);
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['CASH_TRACKER_VENDOR_TOKEN_REDEMPTION'],
        rawMessage,
      );
      q.reset();
      toast.fire({
        title: t('ERROR_WHILE_CREATING_BUDGET'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useGetTransactions = (projectUUID: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['aa.cash-tracker.getTransactions', projectUUID],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aa.cash-tracker.getTransactions',
          payload: {},
        },
      });
      return mutate;
    },
  });
  return query;
};

export const useGetCashApprovedByMe = (
  projectUUID: UUID,
  payload: { from: string; to: string },
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['aa.cash-tracker.getApprovedByMe', projectUUID],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: !!payload.to && !!payload.from && payload.from !== payload.to,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aa.cash-tracker.executeAction',
          payload: {
            ...payload,
            action: 'get_cash_approved_by_me',
          },
        },
      });
      return mutate;
    },
  });
  return query;
};

export const useGetBeneficiaryBalance = (projectUUID: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['aaProject.beneficiary.getBalance', projectUUID],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aaProject.beneficiary.getBalance',
          payload: {},
        },
      });
      return mutate;
    },
  });
  return query;
};

export const useGetBalance = (projectUUID: UUID, smartAddress: string) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['aa.cash-tracker.getBalance', projectUUID, smartAddress],
    queryFn: async () => {
      const response = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aa.cash-tracker.executeAction',
          payload: {
            from: smartAddress,
            action: 'get_cash_balance',
          },
        },
      });
      return response;
    },
  });

  return query;
};

export const useGetCash = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({ payload }: { payload: ConfirmReceipt }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.cash-tracker.executeAction',
          payload: { ...payload, action: 'get_cash_from' },
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: t('CONFIRMED_SUCCESSFULLY'),
        icon: 'success',
      });
      // Invalidate the transactions query to refresh the data
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['aa.cash-tracker.getTransactions', projectUUID],
        });
        queryClient.invalidateQueries({
          queryKey: ['aa.cash-tracker.getApprovedByMe', projectUUID],
        });
      }, 10000);
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['CASH_TRACKER_VENDOR_TOKEN_REDEMPTION'],
        rawMessage,
      );
      q.reset();
      toast.fire({
        title: t('ERROR_WHILE_CONFIRM'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

// cash-tracker end

// inkind-tracker start
export const useInitateInkindTransfer = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({ payload }: { payload: InitiateFundTransfer }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.inkind-tracker.executeAction',
          payload: { ...payload, action: 'initiate_transfer' },
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: t('INKIND_TRANSFERRED_SUCCESSFULLY'),
        icon: 'success',
      });
      // Invalidate the transactions query to refresh the data
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['aa.inkind-tracker.getTransactions', projectUUID],
        });
      }, 10000);
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['IN_KIND_VENDORS'],
        rawMessage,
      );
      q.reset();
      toast.fire({
        title: t('ERROR_WHILE_INKIND_TRANSFER'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useGetInkindTransactions = (projectUUID: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['aa.inkind-tracker.getTransactions', projectUUID],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aa.inkind-tracker.getTransactions',
          payload: {},
        },
      });
      return mutate;
    },
  });
  return query;
};

export const useGetInkindBalance = (
  projectUUID: UUID,
  smartAddress: string,
) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['aa.inkind-tracker.getBalance', projectUUID, smartAddress],
    queryFn: async () => {
      const response = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aa.inkind-tracker.executeAction',
          payload: {
            from: smartAddress,
            action: 'get_cash_balance',
          },
        },
      });
      return response;
    },
  });

  return query;
};

export const useGetInkind = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({ payload }: { payload: ConfirmReceipt }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.inkind-tracker.executeAction',
          payload: { ...payload, action: 'get_cash_from' },
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: t('CONFIRMED_SUCCESSFULLY'),
        icon: 'success',
      });
      // Invalidate the transactions query to refresh the data
      queryClient.invalidateQueries({
        queryKey: ['aa.inkind-tracker.getTransactions', projectUUID],
      });
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['IN_KIND_VENDORS'],
        rawMessage,
      );
      q.reset();
      toast.fire({
        title: t('ERROR_WHILE_CONFIRM'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useGetAASafeOwners = (projectUUID: UUID) => {
  const q = useProjectAction(['aa', 'multisig-actions']);

  const query = useQuery({
    queryKey: ['safeOwners', projectUUID],
    queryFn: async () => {
      const res = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.getSafeOwner',
          payload: {},
        },
      });
      return res.data;
    },
  });

  return {
    ...query,
    transfers: query?.data?.transfers?.map((tx: any) => ({
      type: tx.dataDecoded?.method,
      blockNumber: tx.blockNumber,
      to: tx.dataDecoded?.parameters[0]?.value,
      value: tx.dataDecoded?.parameters[1]?.value,
      isSuccess: tx.isExecuted && tx.isSuccessful,
      submissionDate: tx.submissionDate,
    })),
  };
};

export const useCreateAASafeTransaction = () => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const projectActions = useProjectAction(['aa', 'multisig-actions']);
  const qc = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useMutation({
    mutationKey: ['create-safe-transaction'],
    mutationFn: async ({
      amount,
      projectUUID,
    }: {
      amount: string;
      projectUUID: UUID;
    }) => {
      const response = await projectActions.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.createSafeTransaction',
          payload: {
            amount,
          },
        },
      });
      return response;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['safeOwners'],
        exact: false,
      });
    },
    onError: (error: any) => {
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['PROJECT_INFO_DASHBOARD_USAGE_AUDIT_CHART_REPORTS'],
        rawMessage,
      );
      toast.fire({
        title: t('ERROR'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};
export const useGetTokenDetails = (projectUUID: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['aa.tokenDetails', projectUUID],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.tokenDetails',
          payload: {},
        },
      });
      return mutate.response;
    },
  });
  return query;
};

export const useGetTransferList = (projectUUID: UUID, payload: Pagination) => {
  const q = useProjectAction(['aa.transferList']);

  const query = useQuery({
    queryKey: ['aa.transferList', projectUUID, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.transferList',
          payload: { ...payload },
        },
      });
      return mutate.response;
    },
    enabled: !!projectUUID,
    placeholderData: keepPreviousData,
  });
  return query;
};
export const useDisburseChain = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useMutation({
    mutationFn: async ({ dName, groups = [] }: { dName: string; groups?: string[] }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.chain.disburse',
          payload: { dName, groups },
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Disbursement triggered successfully.',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['groupsreservedfunds', projectUUID],
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while triggering disbursement.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useAddProjectFund = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  return useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.addProjectFund',
          payload: { amount },
        },
      });
    },
    onSuccess: ({ data }) => {
      q.reset();
      toast.fire({
        title: t('FUND_ADDED_SUCCESSFULLY'),
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.tokenDetails', projectUUID],
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || t('ERROR');
      q.reset();
      toast.fire({
        title: t('ERROR_WHILE_ADDING_FUND'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};
