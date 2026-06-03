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
} from './types';

export const useCreateGroupCashTransfer = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: CreateGroupCashTransferPayload) =>
      runAction(q, projectUUID, ACTION_NS + '.create', payload as any),
    onSuccess: () => {
      q.reset();
      toast.fire({ title: 'Group cash transfer created.', icon: 'success' });
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.get', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: 'Error creating group cash transfer.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};

export const useUpdateGroupCashTransfer = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: UpdateGroupCashTransferPayload) =>
      runAction(q, projectUUID, ACTION_NS + '.update', payload as any),
    onSuccess: (_, variables) => {
      q.reset();
      toast.fire({ title: 'Group cash transfer updated.', icon: 'success' });
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
        title: 'Error updating group cash transfer.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};

export const useDeleteGroupCashTransfer = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ uuid }: { uuid: string }) =>
      runAction(q, projectUUID, ACTION_NS + '.delete', { uuid }),
    onSuccess: () => {
      q.reset();
      toast.fire({ title: 'Group cash transfer deleted.', icon: 'success' });
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.get', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: 'Error deleting group cash transfer.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};

export const useAssignGroupCashTransferFund = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: AssignFundPayload) =>
      runAction(q, projectUUID, ACTION_NS + '.assignFund', payload as any),
    onSuccess: () => {
      q.reset();
      toast.fire({ title: 'Fund assigned successfully.', icon: 'success' });
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
        title: 'Error assigning fund.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};

export const useDisburseGroupCashTransfer = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    // uuid here is the fund record UUID returned by assignFund, not the group UUID
    mutationFn: ({ uuid }: DisbursePayload) =>
      runAction(q, projectUUID, ACTION_NS + '.disburse', { uuid }),
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Disbursement initiated (PENDING).',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: [ACTION_NS + '.get', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: 'Error initiating disbursement.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};
