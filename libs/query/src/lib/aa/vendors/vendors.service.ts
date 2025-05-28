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
