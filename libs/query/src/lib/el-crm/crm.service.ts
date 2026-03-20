import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSwal } from '../../swal';
import { UUID } from 'crypto';
import { useRSQuery } from '@rumsan/react-query';
import { useProjectAction } from '../projects';

interface UploadResponse {
  totalRecords?: number;
  totalVendors?: number;
  failedVendors?: number;
  batchesCreated?: number;
  message?: string;
}

// Shared toast configuration — avoids duplicating mixin options in every hook
const TOAST_CONFIG = {
  toast: true,
  position: 'top-end' as const,
  showConfirmButton: false,
  timer: 3000,
};

// Extracts the most useful error message from API error responses.
// Backend may return nested structures (RpcException wraps inner errors),
// validation arrays, or plain strings — try each shape in priority order.
const getErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as any;
  const raw =
    err?.response?.data?.message ||
    err?.response?.message ||
    err?.message;

  if (Array.isArray(raw)) return raw.join('. ');
  if (typeof raw === 'string' && raw.length > 0) return raw;
  return fallback;
};

export const useUploadCustomers = () => {
  const { rumsanService } = useRSQuery();
  const queryClient = useQueryClient();
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
      // Backend wraps response via ResponseTransformInterceptor: { success, data: { ... } }
      // Axios unwraps one layer (res.data), so actual payload is at res.data.data
      const body = res?.data;
      return (body?.data ?? body) as UploadResponse;
    },
    onSuccess: (data: UploadResponse) => {
      // Refresh failed-batch list so the badge appears if some records failed
      queryClient.invalidateQueries({ queryKey: ['failed-batch'] });

      const total = data?.totalRecords ?? 0;
      const valid = data?.totalVendors ?? 0;
      const failed = data?.failedVendors ?? 0;

      if (failed === 0) {
        // All records valid
        toast.fire({
          title: 'All customers uploaded successfully',
          icon: 'success',
          text: total
            ? `All ${total} records are being processed.`
            : 'Your customer data is being processed.',
        });
      } else if (valid === 0) {
        // All records failed validation
        toast.fire({
          title: 'No valid customers found',
          icon: 'error',
          text: `All ${failed} records have validation errors. Check the Failed Batches section to review and fix them.`,
          timer: 6000,
        });
      } else {
        // Partial success
        toast.fire({
          title: 'Upload partially successful',
          icon: 'warning',
          text: `${valid} of ${total} customers are being processed. ${failed} record${failed !== 1 ? 's' : ''} had errors — review them in Failed Batches.`,
          timer: 6000,
        });
      }
    },
    onError: (error: unknown) => {
      const detail = getErrorMessage(error, '');
      const isEmptyFile = detail.toLowerCase().includes('empty');
      const isMissingHeaders = detail.toLowerCase().includes('missing header');

      let text: string;
      if (isEmptyFile) {
        text = 'The uploaded file has no data. Please add customer records and try again.';
      } else if (isMissingHeaders) {
        text = `${detail}. Download the sample template for the correct format.`;
      } else {
        text = detail || 'Please check your file format and try again.';
      }

      toast.fire({
        title: 'Upload could not be completed',
        icon: 'error',
        text,
        timer: 5000,
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

export const useExportCustomers = () => {
  const q = useProjectAction();

  return useMutation({
    mutationFn: async ({
      uuid,
      payload,
    }: {
      uuid: UUID;
      payload: any;
    }) => {
      const result = await q.mutateAsync({
        uuid,
        data: {
          action: 'elProject.crm.exportVendor',
          payload,
        },
      });
      return result;
    },
  });
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
        title: 'Import retry started',
        icon: 'success',
        text: 'The corrected data is being re-processed. You will be redirected shortly.',
      });
    },
    onError: (error: unknown) => {
      q.reset();
      const detail = getErrorMessage(error, '');
      const isValidation = detail.toLowerCase().includes('valid');

      toast.fire({
        title: 'Retry could not be completed',
        icon: 'error',
        text: isValidation
          ? `${detail}. Please review the highlighted fields and correct them before retrying.`
          : detail || 'Something went wrong. Please try again or contact support if the issue persists.',
        timer: 5000,
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
