'use client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useAAVendorsStore } from './store';
import { useEffect } from 'react';

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

  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: ['vendor.get_beneficiaries', restPayloadString],
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
