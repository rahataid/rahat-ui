import { useRSQuery } from '@rumsan/react-query';
import { useQuery, useMutation } from '@tanstack/react-query';

export const useTreasuryTokenCreate = () => {
  const { queryClient, rumsanService } = useRSQuery();

  const createToken = async (data: any) => {
    return rumsanService.client.post('/token', data);
  };

  return useMutation(
    {
      mutationKey: ['CREATE_TOKEN'],
      mutationFn: createToken,
    },
    queryClient,
  );
};

export const useTreasuryTokenList = () => {
  const { queryClient, rumsanService } = useRSQuery();

  const getTokens = async () => {
    return rumsanService.client.get('/token');
  };

  return useQuery(
    {
      queryKey: ['GET_TOKENS'],
      queryFn: getTokens,
    },
    queryClient,
  );
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
