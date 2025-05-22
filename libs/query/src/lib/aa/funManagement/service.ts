'use client';
import { useQuery } from '@tanstack/react-query';
import { useProjectAction } from '../../projects';
import { useEffect } from 'react';
import { useFundAssignmentStore } from './store';

export const useFetchTokenStatsStellar = (payload: any) => {
  const projectBalance = useProjectAction();
  const { setStellarTokenStats, setStellarTransaction } =
    useFundAssignmentStore((state) => ({
      setStellarTokenStats: state.setStellarTokenStats,
      setStellarTransaction: state.setStellarTransaction,
    }));
  const { projectUUID, ...restPayload } = payload;
  const restPayloadString = JSON.stringify(restPayload);

  const query = useQuery({
    queryKey: ['aa.stellar.getStellarStats', restPayloadString],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const mutate = await projectBalance.mutateAsync({
        uuid: projectUUID as '${string}-${string}-${string}-${string}-${string}',
        data: {
          action: 'aa.stellar.getStellarStats',
          payload: {},
        },
      });
      return mutate;
    },
  });
  useEffect(() => {
    if (query?.data) {
      setStellarTokenStats(query?.data?.data?.tokenStats);
      setStellarTransaction(query?.data?.data?.transactionStats);
    }
  }, [query?.data?.data]);
  return query;
};
