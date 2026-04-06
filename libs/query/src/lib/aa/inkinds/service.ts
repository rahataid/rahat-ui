'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useSwal } from 'libs/query/src/swal';
import { UUID } from 'crypto';

export type InkindType = 'PRE_DEFINED' | 'WALK_IN';

export type CreateInkindPayload = {
  name: string;
  type: InkindType;
  description?: string;
  quantity?: number;
};

export type UpdateInkindPayload = {
  uuid: string;
  name?: string;
  type?: InkindType;
  description?: string;
};

export type ListInkindParams = {
  page?: number;
  perPage?: number;
  order?: 'asc' | 'desc';
  sort?: 'createdAt' | 'name' | 'type' | 'availableStock';
  type?: string;
  name?: string;
};

function useToast() {
  const alert = useSwal();
  return alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
}

// Common runAction hook as similar mutation is required over sevices
async function runAction(
  q: ReturnType<typeof useProjectAction>,
  projectUUID: UUID,
  action: string,
  payload: Record<string, unknown>,
) {
  return q.mutateAsync({
    uuid: projectUUID as `${string}-${string}-${string}-${string}-${string}`,
    data: { action, payload },
  });
}

export const useInkinds = (
  projectUUID: UUID,
  params: ListInkindParams = {},
) => {
  const q = useProjectAction();
  const paramsString = JSON.stringify(params);

  return useQuery({
    queryKey: ['aa.inkinds.get', projectUUID, paramsString],
    staleTime: 10 * 60 * 1000, // 10 minutes
    queryFn: () => runAction(q, projectUUID, 'aa.inkinds.get', { ...params }),
  });
};

export const useGetOneInkind = (projectUUID: UUID, inkindUUID: string) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['aa.inkinds.getOne', projectUUID, inkindUUID],
    enabled: !!inkindUUID,
    refetchOnMount: true,
    queryFn: () =>
      runAction(q, projectUUID, 'aa.inkinds.getOne', { uuid: inkindUUID }),
  });
};

export const useCreateInkind = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: CreateInkindPayload) =>
      runAction(q, projectUUID, 'aa.inkinds.create', payload as any),
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'In-kind item created successfully.',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.get', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: 'Error while creating in-kind item.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};

export const useUpdateInkind = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: UpdateInkindPayload) =>
      runAction(q, projectUUID, 'aa.inkinds.update', payload as any),
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'In-kind item updated successfully.',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.get', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: 'Error while updating in-kind item.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};

export const useDeleteInkind = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ uuid }: { uuid: string }) =>
      runAction(q, projectUUID, 'aa.inkinds.delete', { uuid }),
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'In-kind item deleted successfully.',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.get', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: 'Error while deleting in-kind item.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};

export const useInkindsSummary = (projectUUID: UUID) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['aa.inkinds.getSummary', projectUUID],
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: () =>
      runAction(q, projectUUID, 'aa.inkinds.getSummary', {}),
  });
};

export const useInkindTransactions = (
  projectUUID: UUID,
  params?: { page?: number; perPage?: number },
) => {
  const q = useProjectAction();
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;

  return useQuery({
    queryKey: ['aa.inkindStock.getAllMovements', projectUUID, page, perPage],
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
    queryFn: () =>
      runAction(q, projectUUID, 'aaProject.inkindStock.getAllMovements', {
        page,
        perPage,
      }),
  });
};

export const useAddInkindStock = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: { inkindId: string; quantity: number }) =>
      runAction(q, projectUUID, 'aaProject.inkindStock.add', payload as any),
    onSuccess: () => {
      q.reset();
      toast.fire({ title: 'Stock added successfully.', icon: 'success' });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.get', projectUUID],
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.getSummary', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: 'Error while adding stock.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};

export const useRemoveInkindStock = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: { inkindUuid: string; quantity: number }) =>
      runAction(q, projectUUID, 'aaProject.inkindStock.remove', payload as any),
    onSuccess: () => {
      q.reset();
      toast.fire({ title: 'Stock removed successfully.', icon: 'success' });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.get', projectUUID],
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.getSummary', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: 'Error while removing stock.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};

export const useGroupInkindAllocations = (projectUUID: UUID, payload?: any) => {
  const q = useProjectAction();
  const paramsKey = JSON.stringify(payload ?? {});

  return useQuery({
    queryKey: ['aaProject.groupInkinds.getByGroup', projectUUID, paramsKey],
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: () =>
      runAction(q, projectUUID, 'aaProject.groupInkinds.getByGroup', payload ?? {}),
  });
};

export const useUpdateGroupInkindAllocation = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: {
      groupId: string;
      inkindId: string;
      quantity: number;
    }) =>
      runAction(
        q,
        projectUUID,
        'aaProject.groupInkinds.updateQuantity',
        payload as any,
      ),
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Allocation updated successfully.',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['aaProject.groupInkinds.list', projectUUID],
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.get', projectUUID],
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.getSummary', projectUUID],
      });
    },
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: 'Error while updating allocation.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};

export const useGetGroupInkindRedemptions = (
  projectUUID: UUID,
  allocationUUID: string,
) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: [
      'aaProject.groupInkinds.redemptions',
      projectUUID,
      allocationUUID,
    ],
    enabled: !!allocationUUID,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: () =>
      runAction(q, projectUUID, 'aaProject.groupInkinds.getRedemptions', {
        groupInkindUuid: allocationUUID,
      }),
  });
};

export type GetGroupInkindLogsParams = {
  search?: string;
  sort?: 'redeemedAt' | 'quantity';
  order?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
};

export const useGetGroupInkindLogs = (
  projectUUID: UUID,
  allocationUUID: string,
  params: GetGroupInkindLogsParams = {},
) => {
  const q = useProjectAction();
  const paramsKey = JSON.stringify(params);

  return useQuery({
    queryKey: [
      'aaProject.groupInkinds.getLogs',
      projectUUID,
      allocationUUID,
      paramsKey,
    ],
    enabled: !!allocationUUID,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: () =>
      runAction(q, projectUUID, 'aaProject.groupInkinds.getLogs', {
        groupInkindId: allocationUUID,
        ...params,
      }),
  });
};

export const useGetUnassignedGroupInkind = (
  projectUUID: UUID,
  inkindUUID: string,
) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: [
      'aaProject.groupInkinds.getUnassignedGroupInkind',
      projectUUID,
      inkindUUID,
    ],
    enabled: !!inkindUUID,
    queryFn: () =>
      runAction(
        q,
        projectUUID,
        'aaProject.groupInkinds.getUnassignedGroupInkind',
        { uuid: inkindUUID },
      ),
  });
};

export const useAssignGroupInkind = (projectUUID: UUID) => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (payload: { groupId: string; inkindId: string }) =>
      runAction(
        q,
        projectUUID,
        'aaProject.groupInkinds.assign',
        payload as any,
      ),
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Inkind assigned to group successfully.',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.get', projectUUID],
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.getSummary', projectUUID],
      });
      queryClient.invalidateQueries({
        queryKey: ['aaProject.groupInkinds.getByGroup', projectUUID]
      });
    },
    onError: (error: any) => {
      q.reset();
      toast.fire({
        title: 'Error while assigning inkind to group.',
        icon: 'error',
        text: error?.response?.data?.message || 'Error',
      });
    },
  });
};
