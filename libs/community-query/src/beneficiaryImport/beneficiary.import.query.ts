import {
  getBeneficiaryClient,
  getAppClient,
} from '@rahataid/community-tool-sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { Pagination } from '@rumsan/sdk/types';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { TAGS } from '../config';

export const useFetchKoboSettings = (): UseQueryResult<any, Error> => {
  const { queryClient, rumsanService } = useRSQuery();
  const myClient = getAppClient(rumsanService.client);
  return useQuery(
    {
      queryKey: [TAGS.LIST_KOBO_SETTINGS],
      queryFn: () => myClient.listKoboSettings(),
    },

    queryClient,
  );
};
