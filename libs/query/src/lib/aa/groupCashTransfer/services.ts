'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useProjectAction } from '../../projects';
import { runAction, ACTION_NS } from './utils';
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
import {
  AssignFundPayload,
  CreateGroupCashTransferPayload,
  DisbursePayload,
  UpdateGroupCashTransferPayload,
  UpdateGctRecordPayload,
} from './types';
import { useTranslations } from 'next-intl';
import { resolveBackendErrorMessage } from '../../../utils/i18n/backend-error';

export const useCreateGroupCashTransfer = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: CreateGroupCashTransferPayload) =>
      runAction(q, projectUUID, ACTION_NS + '.create', payload as any),
    onSuccess: () => {
      q.reset();
      toast.fire({ title: t('GROUP_CASH_TRANSFER_CREATED'), icon: 'success' });
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.get', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['GROUP_CASH_TRANSFER'],
        rawMessage,
      );
      toast.fire({
        title: t('ERROR_CREATING_GROUP_CASH_TRANSFER'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useUpdateGroupCashTransfer = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: UpdateGroupCashTransferPayload) =>
      runAction(q, projectUUID, ACTION_NS + '.update', payload as any),
    onSuccess: (_, variables) => {
      q.reset();
      toast.fire({ title: t('GROUP_CASH_TRANSFER_UPDATED'), icon: 'success' });
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.get', projectUUID],
      });
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.getOne', projectUUID, variables.uuid],
      });
    },
    onError: (error: any) => {
      q.reset();
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['GROUP_CASH_TRANSFER'],
        rawMessage,
      );
      toast.fire({
        title: t('ERROR_UPDATING_GROUP_CASH_TRANSFER'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDeleteGroupCashTransfer = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ uuid }: { uuid: string }) =>
      runAction(q, projectUUID, ACTION_NS + '.delete', { uuid }),
    onSuccess: () => {
      q.reset();
      toast.fire({ title: t('GROUP_CASH_TRANSFER_DELETED'), icon: 'success' });
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.get', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['GROUP_CASH_TRANSFER'],
        rawMessage,
      );
      toast.fire({
        title: t('ERROR_DELETING_GROUP_CASH_TRANSFER'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useAssignGroupCashTransferFund = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: AssignFundPayload) =>
      runAction(q, projectUUID, ACTION_NS + '.assignFund', payload as any),
    onSuccess: () => {
      q.reset();
      toast.fire({ title: t('FUND_ASSIGNED_SUCCESSFULLY'), icon: 'success' });
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.get', projectUUID],
      });
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.getRecords', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['GROUP_CASH_TRANSFER'],
        rawMessage,
      );
      toast.fire({
        title: t('ERROR_ASSIGNING_FUND'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useUpdateGctRecord = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: UpdateGctRecordPayload) =>
      runAction(q, projectUUID, ACTION_NS + '.updateRecord', payload as any),
    onSuccess: (_, variables) => {
      q.reset();
      toast.fire({ title: t('RECORD_UPDATED_SUCCESSFULLY'), icon: 'success' });
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.getRecords', projectUUID],
      });
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.getOneRecord', projectUUID, variables.uuid],
      });
    },
    onError: (error: any) => {
      q.reset();
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['GROUP_CASH_TRANSFER'],
        rawMessage,
      );
      toast.fire({
        title: t('ERROR_UPDATING_RECORD'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useValidateBankAccount = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      runAction(q, projectUUID, ACTION_NS + '.validateBankAccount', payload),
    onError: (error: any) => {
      q.reset();
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['GROUP_CASH_TRANSFER'],
        rawMessage,
      );
      toast.fire({
        title: t('BANK_ACCOUNT_VALIDATION_FAILED'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useSendGctOtp = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      runAction(q, projectUUID, ACTION_NS + '.sendOtp', { email }),
    onSuccess: (_data, { email }) => {
      q.reset();
      toast.fire({
        title: t('RAHAT_PIN_SENT_SUCCESSFULLY_TO', { email }),
        icon: 'success',
      });
    },
    onError: (error: any) => {
      q.reset();
      const rawMessage = error?.response?.data?.message || tb('GLOBAL.ERROR' as never);
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['GROUP_CASH_TRANSFER'],
        rawMessage,
      );
      toast.fire({
        title: t('ERROR_SENDING_OTP'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useConfirmDisburseGroupCashTransfer = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({
      uuid,
      paymentProviderId,
    }: {
      uuid: string;
      paymentProviderId: string;
    }) =>
      runAction(q, projectUUID, ACTION_NS + '.confirmDisburse', {
        uuid,
        paymentProviderId,
      }),
    onSuccess: () => {
      q.reset();
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.get', projectUUID],
      });
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.getRecords', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['GROUP_CASH_TRANSFER'],
        rawMessage,
      );
      toast.fire({
        title: t('ERROR_CONFIRMING_DISBURSEMENT'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDisburseGroupCashTransfer = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const tb = useTranslations();
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    // uuid here is the fund record UUID returned by assignFund, not the group UUID
    mutationFn: ({ uuid, otp }: DisbursePayload) =>
      runAction(q, projectUUID, ACTION_NS + '.disburse', { uuid, otp }),
    onSuccess: () => {
      q.reset();
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.get', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      const rawMessage = error?.response?.data?.message || t('ERROR');
      const errorMessage = resolveBackendErrorMessage(
        tb,
        error?.response?.data?.code,
        error?.response?.data?.params,
        ['GROUP_CASH_TRANSFER'],
        rawMessage,
      );
      toast.fire({
        title: t('ERROR_INITIATING_DISBURSEMENT'),
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};
