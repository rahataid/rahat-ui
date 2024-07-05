import { useRSQuery } from '@rumsan/react-query';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useTreasuryTokenCreate = () => {
  const router = useRouter();
  const { queryClient, rumsanService } = useRSQuery();

  const createToken = async (data: any) => {
    return rumsanService.client.post('/token', data);
  };

  return useMutation(
    {
      onSuccess: () => {
        router.push('/treasury/assets');
      },
      mutationKey: ['CREATE_TOKEN'],
      mutationFn: createToken,
    },
    queryClient,
  );
};

export const useTreasuryTokenList = () => {
  const { rumsanService } = useRSQuery();

  const getTokens = async () => {
    return rumsanService.client.get('/token');
  };

  return useQuery({
    queryKey: ['GET_TOKENS'],
    queryFn: getTokens,
  });
};

export const useTreasuryTokenDetail = (contractAddress: string) => {
  const { queryClient, rumsanService } = useRSQuery();
  const getToken = async (contractAddress: string) => {
    const response = await rumsanService.client.get(
      `/token/${contractAddress}`,
    );
    return response.data;
  };

  return useQuery(
    {
      queryKey: ['GET_TOKEN_DETAIL'],
      queryFn: () => getToken(contractAddress),
    },
    queryClient,
  );
};
