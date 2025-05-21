import { UUID } from 'crypto';
import axios from 'axios';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSwal } from 'libs/query/src/swal';
import { PROJECT_SETTINGS_KEYS } from 'libs/query/src/config';
import { useProjectAction, useProjectSettingsStore } from '../../projects';

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

export const useSinglePayout = (projectUUID: UUID, payload: Payout) => {
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

export const usePaymentProviders = (projectUUID: UUID) => {
  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const url = settings?.[projectUUID]?.[PROJECT_SETTINGS_KEYS?.OFFRAMP]?.url;

  return useQuery({
    queryKey: ['paymentProviders', projectUUID],
    queryFn: async () => {
      if (!url) throw new Error('Missing OFFRAMP URL');
      const response = await axios.get(url);
      return response.data;
    },
    enabled: !!url,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
