import { UUID } from 'crypto';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useSwal } from 'libs/query/src/swal';
import { useProjectAction, useProjectSettingsStore } from '../../projects';

interface GetTransactions {
  code: string;
  username: string;
  password: string;
  totpSecret: string;
  fromDate?: string;
  toDate?: string;
}

export const useGetTransactions = () => {
  const q = useProjectAction();
  const alert = useSwal();

  return useMutation({
    mutationFn: async ({
      projectUUID,
      payload,
    }: {
      projectUUID: UUID;
      payload: GetTransactions;
    }) => {
      return q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.bank-scrape.transactions',
          payload: payload,
        },
      });
    },
    onSuccess: (value) => {
      q.reset();
      console.log('Transactions fetched successfully', value);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Error';
      q.reset();
    },
  });
};

export const useGetBanks = (projectUUID: UUID) => {
  const q = useProjectAction();

  const query = useQuery({
    queryKey: ['payouts', projectUUID],
    queryFn: async () => {
      const mutate = await q.mutateAsync({
        uuid: projectUUID,
        data: {
          action: 'aa.bank-scrape.banks',
          payload: {},
        },
      });
      return mutate.data;
    },
  });
  return query;
};
