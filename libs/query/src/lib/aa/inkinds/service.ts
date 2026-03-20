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

export const useInkinds = (
  projectUUID: UUID,
  params: ListInkindParams = {},
) => {
  const q = useProjectAction();
  const paramsString = JSON.stringify(params);

  return useQuery({
    queryKey: ['aa.inkinds.get', projectUUID, paramsString],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const result = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aa.inkinds.get',
          payload: { ...params },
        },
      });
      return result;
    },
  });
};

export const useGetOneInkind = (projectUUID: UUID, inkindUUID: string) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['aa.inkinds.getOne', projectUUID, inkindUUID],
    enabled: !!inkindUUID,
    refetchOnMount: true,
    queryFn: async () => {
      const result = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aa.inkinds.getOne',
          payload: { uuid: inkindUUID },
        },
      });
      return result;
    },
  });
};

export const useCreateInkind = (projectUUID: UUID) => {
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
    mutationFn: async (payload: CreateInkindPayload) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.inkinds.create',
          payload,
        },
      });
    },
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
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while creating in-kind item.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useUpdateInkind = (projectUUID: UUID) => {
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
    mutationFn: async (payload: UpdateInkindPayload) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.inkinds.update',
          payload,
        },
      });
    },
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
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating in-kind item.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useDeleteInkind = (projectUUID: UUID) => {
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
    mutationFn: async ({ uuid }: { uuid: string }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.inkinds.delete',
          payload: { uuid },
        },
      });
    },
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
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while deleting in-kind item.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

// Fetches all inkind items (no pagination) for overview summary stats
export const useInkindsSummary = (projectUUID: UUID) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['aa.inkinds.summary', projectUUID],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const result = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aa.inkinds.get',
          payload: { perPage: 1000, order: 'desc', sort: 'createdAt' },
        },
      });
      return result;
    },
  });
};

// Fetches inkind tracker transactions (stock movements / flow)
export const useInkindTransactions = (projectUUID: UUID) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['aa.inkindStock.getAllMovements', projectUUID],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const result = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aaProject.inkindStock.getAllMovements',
          payload: {},
        },
      });
      return result;
    },
  });
};

export const useAddInkindStock = (projectUUID: UUID) => {
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
    mutationFn: async (payload: { inkindId: string; quantity: number }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.inkindStock.add',
          payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({ title: 'Stock added successfully.', icon: 'success' });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.get', projectUUID],
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.summary', projectUUID],
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while adding stock.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useRemoveInkindStock = (projectUUID: UUID) => {
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
    mutationFn: async (payload: { inkindUuid: string; quantity: number }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.inkindStock.remove',
          payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({ title: 'Stock removed successfully.', icon: 'success' });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.get', projectUUID],
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.summary', projectUUID],
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while removing stock.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useGroupInkindAllocations = (projectUUID: UUID) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['aaProject.groupInkinds.getByGroup', projectUUID],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const result = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aaProject.groupInkinds.getByGroup',
          payload: {},
        },
      });
      return result;
    },
  });
};

export const useUpdateGroupInkindAllocation = (projectUUID: UUID) => {
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
    mutationFn: async (payload: {
      groupId: string;
      inkindId: string;
      quantity: number;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.groupInkinds.updateQuantity',
          payload,
        },
      });
    },
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
        queryKey: ['aa.inkinds.summary', projectUUID],
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating allocation.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useGetGroupInkindDetail = (
  projectUUID: UUID,
  allocationUUID: string,
) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['aaProject.groupInkinds.getOne', projectUUID, allocationUUID],
    enabled: !!allocationUUID,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const result = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aaProject.groupInkinds.getOne',
          payload: { uuid: allocationUUID },
        },
      });
      return result;
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
    queryFn: async () => {
      const result = await q.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aaProject.groupInkinds.getRedemptions',
          payload: { groupInkindUuid: allocationUUID },
        },
      });
      return result;
    },
  });
};

export const useAssignGroupInkind = (projectUUID: UUID) => {
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
    mutationFn: async (payload: { groupId: string; inkindId: string }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aaProject.groupInkinds.assign',
          payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Inkind assigned to group successfully.',
        icon: 'success',
      });
      queryClient.invalidateQueries({
        queryKey: ['aa.inkinds.get', projectUUID],
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while assigning inkind to group.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};
