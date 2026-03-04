'use client';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useAAVendorsStore } from './store';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { UUID } from 'crypto';
import { useSwal } from 'libs/query/src/swal';

export const useAAVendorsList = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);
  const { setVendors } = useAAVendorsStore((state) => ({
    setVendors: state.setVendors,
  }));
  const query = useQuery({
    queryKey: ['vendor.list_with_project_data', restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'vendor.list_with_project_data',
          payload: restPayload,
        },
      });
      return mutate;
    },
  });
  useEffect(() => {
    if (query?.data) {
      setVendors(query?.data?.data);
    }
  }, [query?.data?.data]);
  return query;
};

export const useGetVendorStellarStats = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: ['aa.stellar.getVendorStats', restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.stellar.getVendorStats',
          payload: restPayload,
        },
      });
      return mutate;
    },
  });

  return query;
};

export const useGetVendorRedemptionStats = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: ['aa.vendor.token_redemption.get_stats', restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.vendor.token_redemption.get_stats',
          payload: restPayload,
        },
      });
      return mutate;
    },
  });

  return query;
};

export const useGetTxnRedemptionRequestList = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: ['aa.stellar.getRedemptionRequest', restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.stellar.getRedemptionRequest',
          payload: restPayload,
        },
      });
      return mutate;
    },
  });

  return query;
};

export const useGetVendorBeneficiaries = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;

  const query = useQuery({
    queryKey: ['vendor.get_beneficiaries', projectUUID, restPayload],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'vendor.get_beneficiaries',
          payload: restPayload,
        },
      });
      return mutate;
    },
  });

  return query;
};

export const useGetVendorTokenRedemptionList = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: ['aa.vendor.token_redemption.list', restPayloadString],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.vendor.token_redemption.list',
          payload: restPayload,
        },
      });
      return mutate;
    },
  });

  return query;
};

export const useApproveVendorTokenRedemption = () => {
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
        redemptionStatus: string;
        uuid: string;
      };
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.vendor.token_redemption.update_status',
          payload,
        },
      });
    },
    onSuccess: () => {
      q.reset();
      qc.invalidateQueries({ queryKey: ['aa.vendor.token_redemption.list'] });
      toast.fire({
        title: 'Vendor token redemption approved successfully',
        icon: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
      toast.fire({
        title: 'Error while approving vendor token redemption.',
        icon: 'error',
        text: errorMessage,
      });
    },
  });
};

export const useVendorTokenRedemptionList = (payload: any) => {
  const q = useProjectAction<any[]>();
  const { projectUUID, ...restPayload } = payload;

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: [
      'aa.vendor.token_redemption.get_vendor_redemptions',
      restPayloadString,
    ],
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.vendor.token_redemption.get_vendor_redemptions',
          payload: restPayload,
        },
      });
      return mutate;
    },
  });

  return query;
};
