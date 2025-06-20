import { UUID } from 'crypto';
import axios from 'axios';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSwal } from 'libs/query/src/swal';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';
import { useProjectAction, useProjectSettingsStore } from '../../projects';
import { Pagination } from '@rumsan/sdk/types';

export enum PayoutType {
  FSP = 'FSP',
  VENDOR = 'VENDOR',
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
  status?: string;
  groupId?: string;
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
      return mutate.data;
    },
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
