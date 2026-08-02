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

export const useCreateGroupCashTransfer = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
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
      toast.fire({
        title: t('ERROR_CREATING_GROUP_CASH_TRANSFER'),
        icon: 'error',
        text: error?.response?.data?.message || t('ERROR'),
      });
    },
  });
};

export const useUpdateGroupCashTransfer = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
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
      toast.fire({
        title: t('ERROR_UPDATING_GROUP_CASH_TRANSFER'),
        icon: 'error',
        text: error?.response?.data?.message || t('ERROR'),
      });
    },
  });
};

export const useDeleteGroupCashTransfer = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
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
      toast.fire({
        title: t('ERROR_DELETING_GROUP_CASH_TRANSFER'),
        icon: 'error',
        text: error?.response?.data?.message || t('ERROR'),
      });
    },
  });
};

export const useAssignGroupCashTransferFund = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
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
      toast.fire({
        title: t('ERROR_ASSIGNING_FUND'),
        icon: 'error',
        text: error?.response?.data?.message || t('ERROR'),
      });
    },
  });
};

export const useUpdateGctRecord = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
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
      toast.fire({
        title: t('ERROR_UPDATING_RECORD'),
        icon: 'error',
        text: error?.response?.data?.message || t('ERROR'),
      });
    },
  });
};

export const useValidateBankAccount = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const q = useProjectAction();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      runAction(q, projectUUID, ACTION_NS + '.validateBankAccount', payload),
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: t('BANK_ACCOUNT_VALIDATION_FAILED'),
        icon: 'error',
        text: error?.response?.data?.message || t('ERROR'),
      });
    },
  });
};

export const useSendGctOtp = (projectUUID: UUID) => {
  const q = useProjectAction();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ email }: { email: string }) =>
      runAction(q, projectUUID, ACTION_NS + '.sendOtp', { email }),
    onSuccess: (_data, { email }) => {
      q.reset();
      toast.fire({
        title: `Rahat Pin sent successfully to ${email}`,
        icon: 'success',
      });
    },
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: 'Error sending OTP.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};

export const useConfirmDisburseGroupCashTransfer = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ uuid, paymentProviderId }: { uuid: string; paymentProviderId: string }) =>
      runAction(q, projectUUID, ACTION_NS + '.confirmDisburse', { uuid, paymentProviderId }),
    onSuccess: () => {
      q.reset();
      queryClient.invalidateQueries({ queryKey: [ACTION_NS + '.get', projectUUID] });
      queryClient.invalidateQueries({ queryKey: [ACTION_NS + '.getRecords', projectUUID] });
    },
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: t('ERROR_CONFIRMING_DISBURSEMENT'),
        icon: 'error',
        text: error?.response?.data?.message || t('ERROR'),
      });
    },
  });
};

export const useDisburseGroupCashTransfer = (projectUUID: UUID) => {
  const t = useTranslations('AA_PROJECT');
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
      toast.fire({
        title: t('ERROR_INITIATING_DISBURSEMENT'),
        icon: 'error',
        text: error?.response?.data?.message || t('ERROR'),
      });
    },
  });
};
