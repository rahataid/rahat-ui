import {
  getAppClient,
  getSourceClient,
} from '@rahataid/community-tool-sdk/clients';
import { useRSQuery } from '@rumsan/react-query';
import { UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';
import { TAGS } from '../config';
import Swal from 'sweetalert2';

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

export const useExistingFieldMappings = () => {
  const { rumsanService } = useRSQuery();
  const sourceClient = getSourceClient(rumsanService.client);
  return useMutation({
    mutationFn: (importId: string) => sourceClient.importIdMapping(importId),
  });
};

export const useCreateImportSource = () => {
  const { rumsanService } = useRSQuery();
  const myClient = getSourceClient(rumsanService.client);
  return useMutation({
    mutationFn: (payload: any) => myClient.create(payload),
    onSuccess: () => {},
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Something went wrong!';
      Swal.fire({
        icon: 'error',
        title: msg,
      });
    },
  });
};

export const useKobotoolData = () => {
  const { rumsanService } = useRSQuery();
  const myClient = getAppClient(rumsanService.client);
  return useMutation({
    mutationFn: (formName: string) => myClient.koboImportByForm(formName),
  });
};
