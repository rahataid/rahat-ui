import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSwal } from '../../swal';
import { UUID } from 'crypto';
import { useRSQuery } from '@rumsan/react-query';
import { useProjectAction } from '../projects';

// Shared toast configuration — avoids duplicating mixin options in every hook
const TOAST_CONFIG = {
  toast: true,
  position: 'top-end' as const,
  showConfirmButton: false,
  timer: 3000,
};

// Extracts the most useful error message from API error responses
const getErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as any;
  return err?.response?.data?.message || err?.message || fallback;
};

export const useUploadCustomers = () => {
  const { rumsanService } = useRSQuery();
  const alert = useSwal();
  const toast = alert.mixin(TOAST_CONFIG);
  return useMutation({
    mutationFn: async ({
      projectId,
      selectedFile,
      doctype,
    }: {
      projectId: UUID;
      selectedFile: File;
      doctype: string;
    }) => {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('doctype', doctype);
      formData.append('projectId', projectId);
      const res = await rumsanService.client.post('/vendors/upload', formData);
      return res?.data;
    },
    onSuccess: () => {
      toast.fire({
        title: 'Customers upload in progress',
        icon: 'success',
      });
    },
    onError: (error: unknown) => {
      toast.fire({
        title: 'Customer upload failed',
        icon: 'error',
        text: getErrorMessage(error, 'Please check your file format and try again.'),
      });
    },
  });
};

export const useCustomers = (uuid: UUID, payload: any) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['customers', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'elProject.crm.getAllVendor',
          payload,
        },
      });
      return mutate;
    },
  });

  return {
    ...query,
    customers: query.data?.data || [],
    meta: query.data?.response?.meta || {},
  };
};

export const useFailedBatch = (uuid: UUID, payload: any) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['failed-batch', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'elProject.crm.getFailedBatch',
          payload,
        },
      });
      return mutate;
    },
  });

  return {
    ...query,
    failedBatch: query.data?.data || [],
    // meta: query.data?.response?.meta || {},
  };
};

export const useRetryCustomerImport = () => {
  const q = useProjectAction();
  const queryClient = useQueryClient();
  const alert = useSwal();
  const toast = alert.mixin(TOAST_CONFIG);
  return useMutation({
    mutationFn: async ({
      projectUUID,
      payload,
    }: {
      projectUUID: UUID;
      payload: { batchUUID: UUID; vendors?: any[] };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'elProject.crm.retryImport',
          payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      // Invalidate batch queries so stale data isn't shown if user navigates back
      queryClient.invalidateQueries({ queryKey: ['failed-batch'] });
      queryClient.invalidateQueries({ queryKey: ['single-failed-batch'] });
      toast.fire({
        title: 'Batch retry initiated successfully',
        icon: 'success',
      });
    },
    onError: (error: unknown) => {
      q.reset();
      toast.fire({
        title: 'Batch retry failed',
        icon: 'error',
        text: getErrorMessage(error, 'An unexpected error occurred. Please try again.'),
      });
    },
  });
};

export const useCustomerStats = (uuid: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['customer-stats', uuid],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'elProject.getVendorStats',
          payload: {},
        },
      });
      return mutate.data;
    },
  });

  return query;
};

export const useSingleFailedBatch = (uuid: UUID, payload: any) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['single-failed-batch', uuid, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid,
        data: {
          action: 'elProject.crm.getOneFailedBatch',
          payload,
        },
      });
      return mutate;
    },
  });

  return {
    ...query,
    failedBatch: query.data?.data || [],
  };
};
