import { UUID } from 'crypto';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSwal } from 'libs/query/src/swal';
import { TAGS } from 'libs/query/src/config';
import { useProjectAction } from '../../projects';
import { useRSQuery } from '@rumsan/react-query';

export enum PayoutType {
  FSP = 'FSP',
  VENDOR = 'VENDOR',
  CVA = 'CVA',
}

export enum PayoutMode {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

interface Payout {
  page?: number;
  perPage?: number;
  type?: PayoutType;
  mode?: PayoutMode;
  payoutType?: string;
  groupName?: string;
  payoutProcessorId?: string;
}

interface CreatePayout {
  type: PayoutType;
  mode: PayoutMode;
  status?: string;
  extras?: any;
  groupId: string;
  payoutProcessorId?: string;
}

export const useCreatePayout = () => {
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      payload,
    }: {
      projectUUID: UUID;
      payload: CreatePayout;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.payout.create',
          payload: payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      toast.fire({
        title: 'Payout created successfully.',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while creating payout.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const usePayouts = (projectUUID: UUID, payload: Payout) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['payouts', projectUUID, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.payout.list',
          payload: payload,
        },
      });
      return mutate;
    },
    staleTime: 5 * 60 * 60 * 1000, // 5 hrs
  });
  return query;
};

export const usePayoutStats = (projectUUID: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['payout-stats', projectUUID],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.jobs.payout.getPayoutStats',
          payload: {},
        },
      });
      return mutate.data;
    },
    staleTime: 1 * 60 * 60 * 1000, // 1 hrs
  });
  return query;
};
export const useSinglePayout = (projectUUID: UUID, payload: { uuid: UUID }) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['payout', projectUUID, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.payout.get',
          payload: payload,
        },
      });
      return mutate.data;
    },
    staleTime: 60 * 60 * 1000, // 1 hr
  });
  return query;
};

export const useGetPayoutLogs = (projectUUID: UUID, payload: any) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['payout', projectUUID, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.payout.getPayoutLogs',
          payload: payload,
        },
      });
      return mutate;
    },
    staleTime: 60 * 60 * 1000, // 1 hr
  });
  return query;
};

export const useGetPayoutLog = (projectUUID: UUID, payload: any) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['payout', projectUUID, payload],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.payout.getPayoutLog',
          payload: payload,
        },
      });
      return mutate;
    },
    staleTime: 60 * 60 * 1000, // 1 hr
  });
  return query;
};

export const useUpdatePayout = () => {
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      payload,
    }: {
      projectUUID: UUID;
      payload: CreatePayout;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.payout.update',
          payload: payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['payouts'] });
      qc.invalidateQueries({ queryKey: ['payout'] });
      qc.invalidateQueries({ queryKey: ['payout-stats'] });
      toast.fire({
        title: 'Payout updated successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating payout.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useTriggerForPayoutFailed = () => {
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      payload,
    }: {
      projectUUID: UUID;
      payload: {
        payoutUUID: string;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.payout.triggerFailedPayoutRequest',
          payload: payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['payouts'] });
      qc.invalidateQueries({ queryKey: ['payout'] });
      qc.invalidateQueries({ queryKey: ['payout-stats'] });
      toast.fire({
        title: 'Payout Triggerd successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while triggering payout.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useTriggerForOnePayoutFailed = () => {
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      payload,
    }: {
      projectUUID: UUID;
      payload: {
        beneficiaryRedeemUuid: string;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.payout.triggerOneFailedPayoutRequest',
          payload: payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['payouts'] });
      qc.invalidateQueries({ queryKey: ['payout'] });
      qc.invalidateQueries({ queryKey: ['payout-stats'] });
      toast.fire({
        title: 'Payout updated successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating payout.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useTriggerPayout = () => {
  const qc = useQueryClient();
  const q = useProjectAction();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });
  return useMutation({
    mutationFn: async ({
      projectUUID,
      payload,
    }: {
      projectUUID: UUID;
      payload: {
        uuid: string;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.payout.triggerPayout',
          payload: payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['payouts'] });
      qc.invalidateQueries({ queryKey: ['payout'] });
      toast.fire({
        title: 'Payout updated successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while updating payout.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const usePaymentProviders = ({ projectUUID }: { projectUUID: UUID }) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['aa.payout.getPaymentProviders', projectUUID],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.payout.getPaymentProviders',
          payload: {},
        },
      });
      return mutate.data;
    },
    enabled: !!projectUUID,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePayoutExportLogs = ({
  projectUUID,
  payoutUUID,
}: {
  projectUUID: UUID;
  payoutUUID: string;
}) => {
  const q = useProjectAction();

  return useQuery({
    queryKey: ['aa.jobs.payout.exportPayoutLogs', payoutUUID],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.jobs.payout.exportPayoutLogs',
          payload: {
            payoutUUID,
          },
        },
      });
      return mutate.data;
    },
    enabled: !!projectUUID,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useVerifyManualPayout = () => {
  const queryClient = useQueryClient();
  const { rumsanService } = useRSQuery();
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
  });

  return useMutation({
    mutationFn: async ({
      selectedFile,
      doctype,
      projectId,
      payload,
    }: {
      selectedFile: File;
      doctype: string;
      projectId?: UUID;
      payload?: {
        payoutUUID: string;
      };
    }) => {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('doctype', doctype);
      formData.append('action', 'aa.payout.verifyManualPayout');
      if (payload) {
        formData.append('payload', JSON.stringify(payload));
      }

      const response = await rumsanService.client.post(
        `/projects/${projectId}/upload`,
        formData,
      );
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS.VERFIY_MANUAL_PAYOUT] });
      toast.fire({
        icon: 'success',
        title: 'Manual payout verified',
      });
    },
    onError: (error: any) => {
      console.error('Upload error', error);
      const message: string =
        error?.response?.data?.message || error?.message || '';

      toast.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: message,
      });
    },
  });
};
